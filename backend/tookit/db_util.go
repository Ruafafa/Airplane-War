package tookit

import (
	"fmt"
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

// ConnectDatabase initializes the database connection
func ConnectDatabase(databasePath string) {
	var err error
	db, err = gorm.Open(sqlite.Open(databasePath), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	fmt.Println("Database connection successfully opened")
}

// GetDB returns the database connection
func GetDB() *gorm.DB {
	return db
}

// CloseDatabase closes the database connection
func CloseDatabase() {
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("failed to get database connection: %v", err)
	}

	if err := sqlDB.Close(); err != nil {
		log.Fatalf("failed to close database: %v", err)
	}

	fmt.Println("Database connection successfully closed")
}

// AutoMigrate automigrates the given models
func AutoMigrate(models ...interface{}) {
	if err := db.AutoMigrate(models...); err != nil {
		log.Fatalf("failed to automigrate models: %v", err)
	}

	fmt.Println("Database models successfully migrated")
}
