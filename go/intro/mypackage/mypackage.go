// Packages are placed in folders.
// - only functions defined with a capital letter are exported
package mypackage

import (
	"fmt"
	"os"
	"strings"
)

// `func` can be used to define functions

// - each .go file can have an initialiser
var user = os.Getenv("USER")

func init() {
	if user == "" {
		fmt.Println("user is not defined")
	} else {
		fmt.Println("User:", user)
	}
}

func fibonacci(n int) int {
	if n <= 0 {
		return 0
	}
	if n == 1 {
		return 1
	}

	return fibonacci(n-1) + fibonacci(n-2)
}

func FibonacciSequence(n int) []int {
	sequence := make([]int, n)

	for i := 0; i < n; i++ {
		sequence[i] = fibonacci(i)
	}

	return sequence
}

// Functions can be assigned to variables and passed around, allowing for higher order functions.
func MakeMultiplier(multiplier int) func(int) int {
	return func(x int) int {
		return x * multiplier
	}
}

// Functions can return multiple values.
func ParseName(fullname string) (string, string) {
	parts := strings.Split(fullname, " ")
	if len(parts) < 2 {
		return parts[0], ""
	}

	return parts[0], parts[1]
}

// Function execution can be deferred.
// A deferred statement happens after the enclosing function has finished.
// Multiple deferred statements are executed in LIFO order.
func FancyPrint() {
	defer fmt.Println("[deferred] World")
	defer fmt.Println("[deferred] Go")
	fmt.Println("[deferred] Hello")
}
