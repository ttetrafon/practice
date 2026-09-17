package main

import (
	"fmt"
	"uuid"
)

func main() {
	id := uuid.New()
	randomId := uuid.NewV4()
	orderedId := uuid.NewV7()

	fmt.Print(id, randomId, orderedId)
}
