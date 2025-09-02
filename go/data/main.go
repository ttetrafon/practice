package main

import (
	"cmp"
	"fmt"
	"slices"
)

///////////////////
///   SORTING   ///
///////////////////

type employee struct {
	name string
	age  int
}

func sortEmployees(employees []employee) []employee {
	sortedEmployees := employees
	slices.SortFunc(
		sortedEmployees,
		func(a, b employee) int {
			return cmp.Or(
				cmp.Compare(a.name, b.name),
				cmp.Compare(a.age, b.age),
				-1,
			)
		},
	)
	return sortedEmployees
}

//   --------------------------------------------------   //

func main() {
	employees := []employee{
		{name: "Josh", age: 33},
		{name: "Kate", age: 29},
		{name: "Bob", age: 39},
		{name: "Victor", age: 18},
		{name: "Helen", age: 18},
	}

	fmt.Println("Employees (pre-sorting):", employees)
	fmt.Println("Employees (aft-sorting):", sortEmployees(employees))
}
