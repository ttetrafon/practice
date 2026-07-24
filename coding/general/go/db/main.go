package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/go-sql-driver/mysql"
)

type server struct {
	port string
	mux  http.ServeMux
	db   *sql.DB
}

func DbConnection() *sql.DB {
	cfg := mysql.NewConfig()
	cfg.User = "root"
	cfg.Passwd = "practice-maria-db-pass"
	cfg.Net = "tcp"
	cfg.Addr = "127.0.0.1:3306"
	cfg.DBName = "jump-challenge"

	var err error
	db, err := sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		log.Fatal(err)
	}

	pingErr := db.Ping()
	if pingErr != nil {
		log.Fatal(pingErr)
	}

	return db
}

type TestEntry struct {
	id      int64
	name    string
	age     int
	address string
}

func InsertTest(db *sql.DB, entry *TestEntry) (int64, error) {
	result, err := db.Exec("INSERT INTO TEST (name, age, address) VALUES (?, ?, ?);", entry.name, entry.age, entry.address)
	if err != nil {
		return 0, fmt.Errorf("addAlbum: %v", err)
	}
	id, err := result.LastInsertId()
	if err != nil {
		return 0, fmt.Errorf("addAlbum: %v", err)
	}
	return id, nil
}

func GetTest(db *sql.DB) ([]TestEntry, error) {
	var entries []TestEntry

	rows, err := db.Query("SELECT * FROM `TEST`;")
	if err != nil {
		return nil, fmt.Errorf("test-query failed: %v", err)
	}

	defer rows.Close()
	for rows.Next() {
		var te TestEntry
		if err := rows.Scan(&te.id, &te.name, &te.age, &te.address); err != nil {
			return nil, fmt.Errorf("test-query failed: %v", err)
		}
		entries = append(entries, te)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("test-query failed: %v", err)
	}
	return entries, nil
}

func main() {
	fmt.Println("Starting...")

	db := DbConnection()

	entryId, testErr := InsertTest(
		db,
		&TestEntry{
			name:    "Tryfon",
			age:     33,
			address: "Thessaloniki",
		},
	)
	if testErr != nil {
		log.Fatal(testErr)
	}
	fmt.Printf("ID of added album: %v\n", entryId)

	entries, queryErr := GetTest(db)
	if queryErr != nil {
		log.Fatal(queryErr)
	}
	fmt.Printf("Entries found: %v\n", entries)
}
