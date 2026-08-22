package main

import (
	"bufio"
	"fmt"
	"io"
	"os"
)

// The returned items can be named, and the names can be used within the function itself.
func firstLine(path string) (line string, length int, err error) {
	f, err := os.Open(path)
	if err != nil {
		return "", 0, err
	}

	defer func() {
		f.Close()
	}()

	r := bufio.NewReader(f)
	line, err = r.ReadString('\n')
	if err != nil && err != io.EOF {
		return "", 0, err
	}

	if len(line) > 0 && line[len(line)-1] == '\n' {
		line = line[:len(line)-1]
	}

	length = len(line)
	return line, length, err
}

func main() {
	line, length, err := firstLine("./test.txt")
	fmt.Printf("line=%q, length=%d, error=%v\n", line, length, err)
}
