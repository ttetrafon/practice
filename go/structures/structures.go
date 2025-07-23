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

// ----------------------------------------

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

// ----------------------------------------

func main() {
	dog := Dog{
		Animal: Animal{Name: "Buddy"},
		Breed:  "Golden Retriever",
	}

	dog.Speak()
	dog.Bark()

	s := newServer(WithTls, WithMaxConn(3), WithId("test"))
	fmt.Printf("Server %v\n", s)
}
