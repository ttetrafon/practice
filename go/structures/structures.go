package main

import (
	"encoding/json"
	"fmt"
)

type Animal struct {
	Name string
}

func (a Animal) Speak() {
	fmt.Printf("%s makes a sound.\n", a.Name)
}

type Dog struct {
	// embedding a structure (composition) allows access to the full structure (as if inherited)
	Animal
	Breed string
}

func (d Dog) Bark() {
	fmt.Printf("%s the %s barks!\n", d.Name, d.Breed)
}

// A function that targets a sub-structure can also be used with the parent structure itself.
// For example, the following can be called through both an Animal and a Dog.
func (a Animal) PrintAnimal() {
	fmt.Printf("Animal: %s\n", a.Name)
}

///////////////////
///   BUILDER   ///
///////////////////

type OptFunc func(*Opts)

type Opts struct {
	maxConn int
	id      string
	tls     bool
}

func defaultOpts() Opts {
	return Opts{
		maxConn: 10,
		id:      "default",
		tls:     false,
	}
}

type Server struct {
	opts Opts
}

func newServer(opts ...OptFunc) *Server {
	o := defaultOpts()

	for _, fn := range opts {
		fn(&o)
	}

	return &Server{
		opts: o,
	}
}

func WithTls(o *Opts) {
	o.tls = true
}

func WithMaxConn(maxConn int) OptFunc {
	return func(o *Opts) {
		o.maxConn = maxConn
	}
}

func WithId(id string) OptFunc {
	return func(o *Opts) {
		o.id = id
	}
}

////////////////
///   TAGS   ///
////////////////
// Tags are used to convey metadata about the structure.

// 'json'
// Defines the name of the field when serialising to and from json.
type Employee struct {
	Name     string  `json:"name"`
	Age      int     `json:"age"`
	Position string  `json:"position"`
	Salary   float64 `json:"salary"`
	IsRemote bool    `json:"remote"`
	Address  Address `json:"address"`
}

type Address struct {
	Street  string `json:"street"`
	City    string `json:"city"`
	Country string `json:"country"`
	Zip     string `json:"zip"`
}

// ----------------------------------------

func main() {
	dog := Dog{
		Animal: Animal{Name: "Buddy"},
		Breed:  "Golden Retriever",
	}

	dog.Speak()
	dog.Bark()
	dog.PrintAnimal()

	s := newServer(WithTls, WithMaxConn(3), WithId("test"))
	fmt.Printf("Server %v\n", s)

	// A structure can be declared and initialised in the same line.
	job := struct {
		title  string
		salary int
	}{
		title:  "Developer",
		salary: 100000,
	}
	fmt.Println("Job:", job)

	// Serialisation
	employee := Employee{
		Name:     "John Doe",
		Age:      25,
		Position: "Developer",
		Salary:   100000,
		IsRemote: true,
		Address: Address{
			Street:  "123 Main St",
			City:    "New York",
			Country: "USA",
			Zip:     "10001",
		},
	}
	fmt.Println("Employee:", employee)

	jsonData, _ := json.MarshalIndent(employee, "", "\t")
	fmt.Println("JSON bytes:", jsonData)
	fmt.Println("JSON:", string(jsonData))

	decoded := Employee{}
	json.Unmarshal(jsonData, &decoded)
	fmt.Println("Decoded:", decoded)
}
