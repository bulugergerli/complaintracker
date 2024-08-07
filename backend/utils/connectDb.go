package utils

import (
	"database/sql"
	"fmt"
	"os"
	"strconv"

	_ "github.com/lib/pq"
)

func ConnectDB() (*sql.DB, error) {

	// port conversion
	portStr := os.Getenv("PORT")
	port, err := strconv.Atoi(portStr)
	if err != nil {
		return nil, fmt.Errorf("failed to convert port %s to integer: %v", portStr, err)
	}

	// PostgreSQL connection string
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		os.Getenv("HOST"), port, os.Getenv("USERNAME"), os.Getenv("PASSWORD"), os.Getenv("DBNAME"))

	// connect to the database
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to the database: %v", err)
	}

	// check if the connection is successful
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping the database: %v", err)
	}

	fmt.Println("DB connection successful.")
	return db, nil
}
