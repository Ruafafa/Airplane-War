package backend

import (
	"AirPlaneWar/backend/tookit"
	"errors"
	"fmt"
	"gorm.io/gorm"
	"log"
	"os"
	"path/filepath"
	"sort"
	"time"
)

// UserGameInfo represents the user model
type UserGameInfo struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	UserName      string    `json:"name"`
	HighScore     int       `json:"high_score"`
	HighScoreTime time.Time `json:"high_score_time"`
}

var DATABASE_PATH = "build/db/data.db"

// UserService 服务类
type UserService struct {
}

// NewUserService 新建 UserService
func NewUserService() *UserService {
	return &UserService{}
}

// CreateUser 创建用户
func (us *UserService) CreateUser(userName string, highScore int, highScoreTimeStr string) {

	// 获取当前执行文件的路径
	exePath, err := os.Executable()
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	// 获取当前执行文件所在的目录
	exeDir := filepath.Dir(exePath)

	// 构造数据库文件的路径
	dbPath := filepath.Join(exeDir, "../db/data.db")
	// 输出数据库文件的路径
	fmt.Println(dbPath)
	DATABASE_PATH = dbPath

	absPath, err := filepath.Abs(DATABASE_PATH)
	if err != nil {
		log.Fatalf("failed to get absolute path: %v", err)
	}
	fmt.Println("绝对路径:", absPath)
	defer tookit.CloseDatabase()

	// 连接到数据库
	tookit.ConnectDatabase(DATABASE_PATH)

	highScoreTime, err := time.Parse(time.RFC3339, highScoreTimeStr)

	if err != nil {
		log.Fatalf("failed to parse time: %v", err)
	}

	db := tookit.GetDB()
	user := UserGameInfo{UserName: userName, HighScore: highScore, HighScoreTime: highScoreTime}
	result := db.Create(&user)
	if result.Error != nil {
		log.Fatalf("failed to create user: %v", result.Error)
	}
}

// InsertOrUpdateUser 插入或更新用户最高历史记录
func (us *UserService) InsertOrUpdateUser(userName string, highScore int, highScoreTimeStr string) {
	// 获取当前执行文件的路径
	exePath, _ := os.Executable()
	// 获取当前执行文件所在的目录
	exeDir := filepath.Dir(exePath)
	// 构造数据库文件的路径
	dbPath := filepath.Join(exeDir, "../db/data.db")
	// 输出数据库文件的路径
	DATABASE_PATH = dbPath
	// 连接到数据库
	tookit.ConnectDatabase(DATABASE_PATH)
	defer tookit.CloseDatabase()

	highScoreTime, err := time.Parse(time.RFC3339, highScoreTimeStr)

	if err != nil {
		log.Fatalf("failed to parse time: %v", err)
	}

	db := tookit.GetDB()
	var user UserGameInfo
	result := db.Where("user_name = ?", userName).First(&user)
	if result.Error != nil {
		// 用户不存在
		user = UserGameInfo{UserName: userName, HighScore: highScore, HighScoreTime: highScoreTime}
		result = db.Create(&user)
		if result.Error != nil {
			log.Fatalf("failed to create user: %v", result.Error)
		}
	} else {
		// 用户存在
		if highScore > user.HighScore {
			user.HighScore = highScore
			user.HighScoreTime = highScoreTime
			result = db.Save(&user)
			if result.Error != nil {
				log.Fatalf("failed to update user: %v", result.Error)
			}
		}
	}

}

// UpdateUser 更新用户
func (us *UserService) UpdateUser(userName string, highScore int, highScoreTimeStr string) {
	// 连接到数据库
	tookit.ConnectDatabase(DATABASE_PATH)
	defer tookit.CloseDatabase()

	highScoreTime, err := time.Parse(time.RFC3339, highScoreTimeStr)

	if err != nil {
		log.Fatalf("failed to parse time: %v", err)
	}

	db := tookit.GetDB()
	user := UserGameInfo{UserName: userName, HighScore: highScore, HighScoreTime: highScoreTime}
	result := db.Save(&user)
	if result.Error != nil {
		log.Fatalf("failed to update user: %v", result.Error)
	}
}

// GetAllUsers 获取所有用户
func (us *UserService) GetAllUsers() []UserGameInfo {
	// 连接到数据库
	tookit.ConnectDatabase(DATABASE_PATH)
	defer tookit.CloseDatabase()

	// 创建数据
	db := tookit.GetDB()
	var users []UserGameInfo
	result := db.Find(&users)
	if result.Error != nil {
		log.Fatalf("failed to query users: %v", result.Error)
	}
	return users
}

// GetUserHighestScoreInHistory 根据用户名查询某个用户的历史最高成绩（现有成绩）
func (us *UserService) GetUserHighestScoreInHistory(username string) int64 {
	exePath, _ := os.Executable()
	// 获取当前执行文件所在的目录
	exeDir := filepath.Dir(exePath)
	// 构造数据库文件的路径
	dbPath := filepath.Join(exeDir, "../db/data.db")
	// 输出数据库文件的路径
	DATABASE_PATH = dbPath
	// 连接到数据库
	// 连接到数据库
	tookit.ConnectDatabase(DATABASE_PATH)
	defer tookit.CloseDatabase()

	// 创建数据
	db := tookit.GetDB()
	var user UserGameInfo
	result := db.Where("user_name = ?", username).First(&user)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			// 用户不存在，返回0
			return -1
		} else {
			log.Fatalf("failed to query user: %v", result.Error)
		}
	}
	return int64(user.HighScore)
}

// GetUsersSortedByScore 获取所有用户并按分数排序
func (us *UserService) GetUsersSortedByScore() []UserGameInfo {
	// 获取当前执行文件的路径
	exePath, _ := os.Executable()
	// 获取当前执行文件所在的目录
	exeDir := filepath.Dir(exePath)
	// 构造数据库文件的路径
	dbPath := filepath.Join(exeDir, "../db/data.db")
	// 输出数据库文件的路径
	DATABASE_PATH = dbPath
	// 连接到数据库
	tookit.ConnectDatabase(DATABASE_PATH)
	defer tookit.CloseDatabase()

	users := us.GetAllUsers()
	sort.Slice(users, func(i, j int) bool {
		if users[i].HighScore == users[j].HighScore {
			return users[i].HighScoreTime.Before(users[j].HighScoreTime)
		}
		return users[i].HighScore > users[j].HighScore
	})
	return users
}
