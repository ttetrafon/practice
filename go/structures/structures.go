package main

import "fmt"

type Animal struct {
	Name string
}

func (a Animal) Speak() {
	fmt.Printf("%s makes a sound.\n", a.Name)
}

type Dog struct { // embedding a structure (composition) allows access to the full structure (as if inherited)
	Animal
	Breed string
}

func (d Dog) Bark() {
	fmt.Printf("%s the %s barks!\n", d.Name, d.Breed)
}

func main() {
	dog := Dog{
		Animal: Animal{Name: "Buddy"},
		Breed:  "Golden Retriever",
	}

	dog.Speak()
	dog.Bark()
}
