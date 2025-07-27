package main

import "fmt"

func main() {
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

	fmt.Println("Square perimeter:")
	printShapePerimeter(square)

	fmt.Println("Circle perimeter:")
	printShapePerimeter(circle)

	// - type assertions can get the underlying concrete value of an interface
	var shape Shape = &Circle{
		radius: 3,
	}

	isCircle, ok := shape.(*Circle)
	fmt.Println("IsCircle?", isCircle, "OK?", ok)

	isSquare, ok := shape.(*Square)
	fmt.Println("IsSquare?", isSquare, "OK?", ok)

	// -----------------------------

	e := &FireEnemy{}
	e.Enemy = &Enemy{
		tileWalker: e,
	}
	for range 5 {
		Update(e)
	}
	fmt.Println("Final e.position:", e.position)
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

// ------------------------------------
// Interfaces & struct Embedding

type Tile struct{}

type TileWalker interface {
	WalkTile(Tile)
}

type Updater interface {
	Update()
}

func Update(u Updater) {
	u.Update()
}

type Transform struct {
	position int
}

type Enemy struct {
	Transform
	tileWalker TileWalker
}

func (e *Enemy) checkTileWalkedOn() {
	// some logic here...
	fmt.Println("enemy walked on tile...: ", e.position)
	e.tileWalker.WalkTile(Tile{})
}

func (e *Enemy) Update() {
	e.position += 1
	e.checkTileWalkedOn()
}

type FireEnemy struct {
	*Enemy
}

func (e *FireEnemy) WalkTile(t Tile) {
	// logic specific to fire-enemy
	fmt.Println("fire enemy walked on tile: ", t)
}
