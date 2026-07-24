package main

import "fmt"

func main() {
	////////
	// if //
	////////
	const x int = 10
	const y int = 7
	if x > y {
		fmt.Println("x is bigger than y")
	} else {
		fmt.Println("y is bigger than x")
	}

	/////////
	// for //
	/////////
	// --- for init; condition; post { }
	sum := 0
	for i := 2; i < 10; i++ {
		sum += i
	}
	fmt.Println("sum (1):", sum)

	// --- for condition { }

	// --- for { }
	// `range` is useful when looping over an array, slice, map, string, or reading from a channel
	// - `for key, value := range obj {}`
	// - a blank identifier (`_`) can be used to discard the key (e.g.: `for _, value := range obj`)
	sum = 0
	for i := range 10 {
		sum += i
	}
	fmt.Println("sum (2):", sum)
	// - for strings specifically, range breaks the string into characters and applies utf8 encoding before returning them
	//   - in case of an erroneous character, U+FFFD is returned instead
	for pos, char := range "日本\x80語" { // \x80 is an illegal UTF-8 encoding
		fmt.Printf("character %#U starts at byte position %d\n", char, pos)
	}

	////////////
	// switch //
	////////////
	fmt.Println("unhex 0x6A:", unhex(0x62))

	// - there is no default case, but cases can be presented coma separated lists (e.g.: `case ' ', '?', '&', '=', '#', '+', '%':`)
	// - a switch can be used to discover the dynamic type of an interface variable
	var t any = unhex(0x10) // var t interface{}
	switch t := t.(type) {
	default:
		fmt.Printf("unexpected type %T\n", t) // %T prints whatever type t has
	case bool:
		fmt.Printf("boolean %t\n", t) // t has type bool
	case int:
		fmt.Printf("integer %d\n", t) // t has type int
	case *bool:
		fmt.Printf("pointer to boolean %t\n", *t) // t has type *bool
	case *int:
		fmt.Printf("pointer to integer %d\n", *t) // t has type *int
	}

	///////////
	// break //
	///////////
	// - break can be used to escape any loop
	// - to escape an outer loop, labels are used

	//////////////
	// continue //
	//////////////

}

func unhex(c byte) byte {
	switch {
	case '0' <= c && c <= '9':
		return c - '0'
	case 'a' <= c && c <= 'f':
		return c - 'a' + 10
	case 'A' <= c && c <= 'F':
		return c - 'A' + 10
	}
	return 0
}
