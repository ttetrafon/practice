// https://prateeksurana.me/blog/guide-to-go-for-javascript-developers/

// Split the code into packages.
// Entry point is the 'main' package, which requires a `func main()` defined.
package main

import (
	"fmt"
	"intro/mypackage"
)

func main() {
	fmt.Println("Hello, World!")

	sequence := mypackage.FibonacciSequence(10)

	fmt.Println("Fibonacci sequence of first 10 numbers:")
	fmt.Println(sequence)

	// Variables are declared or inferred as needed.
	// `const` and `var` are used to declare constants and variables.
	// - `const` can only be used with primitives though, not with other complex types
	// Initially undefined variables are automatically assigned their type's default zero value:
	// - int: 0
	// - float64: 0
	// - bool: false
	// - string: ""
	// - pointer: nil
	const x int = 5
	var y float64 = 2.5

	sum := float64(x) + y
	fmt.Println("Sum:", sum)

	// Structures can be used to to create objects (collection of fields).
	p := Person{
		Name: "John",
		Age:  32,
	}
	fmt.Println("Person:", p)

	d := Doctor{
		p,
		"Radiology",
	}
	fmt.Println("Doctor:", d)
	fmt.Println("Doctor's Name:", d.Person.Name)

	// Types can be used to define any value a variable can bold.
	type ID int
	var i ID = 22575
	fmt.Println("ID:", i)

	res := Response{
		Status: StatusApproved,
		Meta:   "Approved by auto-admin!",
	}
	fmt.Println("Response:", res)

	// Go uses pointers to pass references, which means reference is explicit and everything (except slices, maps and channels) is passed by value.
	// - `&` generates a pointer
	// - `*` gets the underlying value of the pointer (dereferencing)
	pPointer := &p
	fmt.Println("Person value from pointer:", *pPointer)
	fmt.Println("Person pointer:", pPointer)

	// Functions
	double := mypackage.MakeMultiplier(2)
	fmt.Println("Double of 3:", double(3))

	firstName, lastName := mypackage.ParseName("Bruce Willis")
	fmt.Println("First Name:", firstName)
	fmt.Println("Last Name:", lastName)

	// Arrays are declared as `[]T`, and take a length
	var myArray [5]int
	myArray[0] = 7
	myArray[3] = 3
	fmt.Println("Array:", myArray)
	// An array can be initialised by passing values to it immediately.
	initialisedArray := [6]int{1, 2, 3, 4, 5, 6}
	fmt.Println("Initialised Array:", initialisedArray)

	// A slice is a dynamically sized flexible view into an array: [start:stop (exclusive)]
	slice := initialisedArray[2:4]
	fmt.Println("Slice:", slice)
	// - Modifying a slice changes the underlying array.
	slice[1] = -10
	fmt.Println("Modified Slice:", slice)
	fmt.Println("Modified Array:", initialisedArray)
	// Omitting the length when declaring an array creates a slice literal.
	// A slice literal has a length (`len`, current size of the slice) and a capacity (`cap`, length of the underlying array)
	s := []int{1, 2, 3, 4, 5, 6}
	t := s[0:3]
	fmt.Printf("len=%d cap=%d %v\n", len(t), cap(t), t)
	// A slice can also be created with `make([]T, len, cap)`, which allocates a zeroed array and returns a slice that references that array.
	m := make([]int, 0, 5)
	fmt.Printf("Make slice: len=%d cap=%d %v\n", len(m), cap(m), m)
	// `append(array, len)` can be used to append items to a lice ignoring the underlying array's capacity
	// https://go.dev/blog/slices-intro
	// It returns a new slice with the initial values plus the appended one(s), creating a new, bigger array if the previous capacity could not hold the added values.
	a := []int{1, 2, 3}
	fmt.Println("Pre-append:", a)
	a = append(a, 4)
	fmt.Println("Aft-append:", a)

	// Iterating over an array is done with `for`.
	for i, num := range s {
		fmt.Printf("- Index: %d, Value: %d\n", i, num)
	}

	// Map
	// can also be created with `make`
	userScores := map[string]int{
		"Bob":     10,
		"Maria":   20,
		"Charlie": 30,
	}
	fmt.Println("User Scores:", userScores)
	// - getting a value is like slicing
	// - as such, it returns a reference, and thus modifying it will affect the underlying map
	bobScore, bobScoreExists := userScores["Bob"]
	fmt.Println("Bob's score:", bobScore, "exists:", bobScoreExists)
	annaScore, annaScoreExists := userScores["Anna"]
	fmt.Println("Anna's score:", annaScore, "exists:", annaScoreExists)
	// - values can be deleted by key `delete(userScores, "Bob")`
	// - `len(userScores)` returns the size of the map

	// Comparisons use values, so even different instances of structures can be equal.
	p2 := Person{
		Name: "John",
		Age:  32,
	}
	fmt.Println("p1 == p2:", p == p2)
	// - Comparisons between slices is not allowed though, as well as between structures with incomparable member types.
	// - Pointers are compared by reference (address).

	// Methods
	r := Rectangle{
		length: 4,
		width:  5,
	}
	fmt.Println("Rectangle", r, "; has area ", r.Area())
	// - As a convenience Go automatically interprets the statement r.Double() as (&r).Double() since Double() method has a pointer receiver.
	r.Double()
	fmt.Println("Rectangle", r, "; has area ", r.Area())

	// Interfaces
	square := Square{
		length: 7,
	}

	circle := Circle{
		radius: 3,
	}

	fmt.Println("Square area:")
	printShapeArea(square)

	fmt.Println("Circle area:")
	printShapeArea(circle)

	// - type assertions can get the underlying concrete value of an interface
	var shape Shape = &Circle{
		radius: 3,
	}

	isCircle, ok := shape.(*Circle)
	fmt.Println("IsCircle?", isCircle, "OK?", ok)

	isSquare, ok := shape.(*Square)
	fmt.Println("IsSquare?", isSquare, "OK?", ok)

	// - assertions work on primitives too
	var aString any = "hello"
	// var aString interface{} = "hello"
	sss, ok := aString.(string)
	fmt.Println("IsString?", sss, "OK?", ok)
	fff, ok := aString.(float64)
	fmt.Println("IsFloat?", fff, "OK?", ok)

	// Deferred execution
	mypackage.FancyPrint()
}

type Person struct {
	Name string
	Age  int
}

// struct embedding can be used to achieve composition
type Doctor struct {
	Person
	Speciality string
}

// A common use of types is to create string based enums.
// These are just aliases though for the underlying type (string in this case), so the compiler won't block assigning any string as their value.
type Status string

const (
	StatusPending  Status = "pending"
	StatusApproved Status = "approved"
	StatusRejected Status = "rejected"
)

type Response struct {
	Status Status
	Meta   string
}

// Go does not have classes, but methods can still be defined directly on types.
type Rectangle struct {
	length float64
	width  float64
}

func (r Rectangle) Area() float64 {
	return r.length * r.width
}

func AreaAlt(r Rectangle) float64 {
	return r.length * r.width
}

// - pointers should be used when modification of the structure is required
func (r *Rectangle) Double() {
	r.length = r.length * 2
	r.width = r.width * 2
}

// An 'Interface' is a set of method signatures, which can also hold a value that implements these methods.
// Implementation is implicit; any type that implements the methods is considered to implement the interface automatically.
type Shape interface {
	Area() float64
	Perimeter() float64
}

type Square struct {
	length float64
}

func (r Square) Area() float64 {
	return r.length * r.length
}

func (r Square) Perimeter() float64 {
	return 4 * r.length
}

type Circle struct {
	radius float64
}

func (c Circle) Area() float64 {
	return 3.14 * c.radius * c.radius
}

func (c Circle) Perimeter() float64 {
	return 2 * 3.14 * c.radius
}

func printShapeArea(s Shape) {
	fmt.Println(s.Area())
}

func printShapePerimeter(s Shape) {
	fmt.Println(s.Perimeter())
}

// Compile with:
// `go build hello.go`
// For different architectures, use GOOS and GOARCH packages.
