package main

import "fmt"

type User struct {
	Name     string
	Email    string
	Metadata [8192]byte
}

func Performance() {
	fmt.Println("")
	fmt.Println("---   PERFORMANCE   ---")

	// When creating a slice of structures and looping over it, go creates copies of its elements.
	// To avoid:
	// - use pointers for the slice instead on the structures
	// users := []*User{
	users := []User{
		{Name: "Bob", Email: "bob@test.com"},
		{Name: "Flo", Email: "flo@test.com"},
	}

	// - use the index to access the element directly in the slice
	// for i := range users {
	for i, user := range users {
		fmt.Printf("(%d - in slice): %p\n", i, &users[i])
		fmt.Printf("(%d - in loop): %p\n", i, &user)
	}
}
