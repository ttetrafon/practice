package main

import "fmt"

func DefineSet() {
	// since we need to keep track of the keys only in a set, we define the values as empty structures so they don't occupy any memory at all
	activeUsers := make(map[string]struct{})

	activeUsers["alice"] = struct{}{}
	activeUsers["bob"] = struct{}{}

	if _, exists := activeUsers["alice"]; exists {
		fmt.Println("Alice exists!")
	}

	fmt.Printf("Total active users: %d\n", len(activeUsers))
	for user := range activeUsers {
		fmt.Println(" - ", user)
	}
}
