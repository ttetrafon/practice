package main

import (
	"flag"
	"fmt"
)

//   --------------------------------------------------   //

func main() {
	var name string
	var age int

	flag.StringVar(&name, "name", "Unknown", "The user's name.")
	flag.IntVar(&age, "age", -1, "The user's age")
	flag.Parse()

	fmt.Printf("user=%s, age=%d\n", name, age)
}
