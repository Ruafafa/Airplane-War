package backend

import (
	"AirPlaneWar/backend/tookit"
	"fmt"
	"testing"
	"time"
)

func TestSql(t *testing.T) {
	// 连接到数据库
	tookit.ConnectDatabase("../db/data.db")
	defer tookit.CloseDatabase()

	// 创建数据
	createUser("Alice", 1000, time.Now())

	// 查询数据
	users := getAllUsers()

	fmt.Println(users)

	user := users[0]
	if user.UserName != "Alice" || user.HighScore != 1000 {
		t.Errorf("Expected user with name Alice and highscore 1000, got %v", user)
	}

}

func TestSort(t *testing.T) {
	// 连接到数据库
	tookit.ConnectDatabase("../db/data.db")
	defer tookit.CloseDatabase()
	scores := getUsersSortedByScore()
	fmt.Println(scores)
}
