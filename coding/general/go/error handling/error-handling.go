package main

import (
	"encoding/json"
	"fmt"
	"os"
)

func main() {
	fmt.Println("Starting...!")

	// Functions return multiple values.
	// If an error happens during a function execution, an optional (last) return value is added with the error.

	processFiles([]string{"file1.json", "file2.json"})

	// Deferred statements/functions can be used for cleanup (like using finally in try-catch-finally).

	// Can also be used to recover from panics (a runtime error causes the unwinding of the stack until handled or program termination).
	// This is done through `recover` within a deferred function.
	riskyOperation()
	fmt.Println("Program continues after recovery")
}

func processFiles(filePaths []string) ([]map[string]string, error) {
	var results []map[string]string

	for _, path := range filePaths {
		data, err := os.ReadFile(path)
		if err != nil {
			return nil, fmt.Errorf("failed to read file %s: %w", path, err)
		}

		var result map[string]string
		err = json.Unmarshal(data, &result)

		if err != nil {
			return nil, fmt.Errorf("failed to parse JSON from file %s: %w", path, err)
		}

		results = append(results, result)
	}

	return results, nil
}

func riskyOperation() {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
		}
	}()

	// This will cause a panic
	var arr []int
	fmt.Println(arr[1]) // Accessing out of bounds
}
