package main

// packages:
// 'encoding/json': version 1
// 'encoding/json/v2': version 2

import (
	json "encoding/json/v2"
	"fmt"
)

type Track struct {
	Title   string `json:"title"`
	Seconds int    `json:"seconds"`
}

func main() {
	out, err := json.Marshal(Track{Title: "qwerty", Seconds: 12353})
	fmt.Println(string(out), err)

	plays := map[string]int{
		"zig":  3,
		"go":   91,
		"rust": 12,
	}
	out, err = json.Marshal(plays)
	fmt.Println(string(out), err)

	out, err = json.Marshal(plays, json.Deterministic(true))
	fmt.Println(string(out), err)
}
