package main

import (
	"cmp"
	"fmt"
	"os"
)

///////////////////////////
///   FALLBACK VALUES   ///
///////////////////////////

func getPortFromFlag() string {
	return "9090"
}

func getPort() string {
	return cmp.Or(
		os.Getenv("PORT"),
		getPortFromFlag(),
		"8080",
	)
}

//   --------------------------------------------------   //

func main() {
	result := getPort()
	fmt.Println("getPort:", result)
}
