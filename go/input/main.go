package main

import (
	"cmp"
	"fmt"
)

////////////////////////
///   CONSOLE READ   ///
////////////////////////

func getUsernameFromConsole() string {
	fmt.Print("Name: ")
	var name string
	fmt.Scanln(&name)
	return cmp.Or(name, "Anonymous")
}

//   --------------------------------------------------   //

func main() {
	name := getUsernameFromConsole()
	fmt.Println("Hello", name)
}
