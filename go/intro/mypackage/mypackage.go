// Packages are placed in folders.
// - only functions defined with a capital letter are exported
package mypackage

import "strings"

// `func` can be used to define functions

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
