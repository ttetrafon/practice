package main

import "fmt"

/////////////////////
///   FILTERING   ///
/////////////////////

func filter(initial []int) []int {
	res := initial[:0]
	for _, x := range initial {
		if x < 5 {
			res = append(res, x)
		}
	}

	return res
}

//   --------------------------------------------------   //

func main() {
	a := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 0}
	b := filter(a)
	fmt.Println("b:", b)
}
