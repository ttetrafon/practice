package main

import (
	"encoding/json"
	"fmt"
)

type User struct {
	Username   string
	RetryLimit int
	IsActive   bool
}

type UpdateSettings struct {
	RetryLimit *int  `json:"retry_limit,omitempty"`
	IsActive   *bool `json:"is_active,omitempty"`
}

func PatchUser(u *User, updates UpdateSettings) {
	if updates.RetryLimit != nil {
		u.RetryLimit = *updates.RetryLimit
	}
	if updates.IsActive != nil {
		u.IsActive = *updates.IsActive
	}
}

func main() {
	/////////////////
	///   new()   ///
	/////////////////

	// Memory allocation can be done through `new()`, which allocates the memory.
	p := new(int)
	// `new()` returns a pointer, so the memory address can be used through dereferencing.
	*p = 42
	fmt.Printf("p: %d <%v>\n", *p, p)

	// `new()` can also take an expression as a param directly.
	k := new(55)
	fmt.Printf("k: %d <%v>\n", *k, k)

	fmt.Println("------------------------------------------------------------------------")

	// Allocation through expression is useful in structures with optional values marshalled to json/protobuf
	dbUser := User{Username: "Alice", RetryLimit: 10, IsActive: true}
	fmt.Printf("initial user: %+v\n", dbUser)

	PatchUser(&dbUser, UpdateSettings{RetryLimit: new(20)})
	fmt.Printf("final user: %+v\n", dbUser)

	data, _ := json.Marshal(dbUser)
	fmt.Println(data, "->", string(data))
}
