package main

func main() {
	result, err := performDivision(10, 2)
	// result, err := performDivision(10, 0)
	if err != nil {
		println("Error:", err.Error())
	} else {
		println("Result:", result)
	}
}

type CalculationError struct {
	msg string
}

func (ce CalculationError) Error() string {
	// Error() is just an interface that implements a msg string
	return ce.msg
}

func performDivision(val1 float64, val2 float64) (float64, error) {
	if val2 == 0 {
		return 0, CalculationError{"Cannot divide by zero"}
	}
	return val1 / val2, nil
}
