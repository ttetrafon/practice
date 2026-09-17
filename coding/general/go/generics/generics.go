package main

import (
	"fmt"
	"strconv"
)

type Box[T any] struct {
	value T
}

// Generic methods can declare their own types.
// Restriction: interfaces cannot declare generic methods...

func (box Box[T]) MapBox[U any](transform func(T) U) Box[U] {
	return Box[U]{
		value: transform(box.value),
	}
}

func main() {
	num := Box[int]{value: 42}
	text := num.MapBox(strconv.Itoa)
	fmt.Print(num, "->", text)
}
