package main

import (
	"fmt"
	"io"
	"net/http"
	"sync"
	"time"
)

func say(s string) {
	fmt.Println(s)
}

func main() {
	// Go supports concurrency through go-routines, which are self-managed, lightweight threads, thus achieving multithreading.

	go say("world")
	say("hello")

	// We have added sleep to prevent program from exiting
	// before goroutine runs, there are better ways to
	// handle this using channels and wait groups
	time.Sleep(100 * time.Millisecond)

	var wg sync.WaitGroup
	var postJSON, commentsJSON string
	var postErr, commentsErr error

	// Add two items to wait for
	wg.Add(2)

	// Fetch post in a goroutine
	go func() {
		defer wg.Done()
		resp, err := http.Get("https://jsonplaceholder.typicode.com/posts/1")
		if err != nil {
			postErr = err
			return
		}
		defer resp.Body.Close()

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			postErr = err
			return
		}

		postJSON = string(body)
	}()

	// Fetch comments in a goroutine
	go func() {
		defer wg.Done()
		resp, err := http.Get("https://jsonplaceholder.typicode.com/posts/1/comments")
		if err != nil {
			commentsErr = err
			return
		}
		defer resp.Body.Close()

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			commentsErr = err
			return
		}

		commentsJSON = string(body)
	}()

	// Wait for both goroutines to complete
	wg.Wait()

	// Handle any errors
	if postErr != nil {
		fmt.Println("Error fetching post:", postErr)
		return
	}
	if commentsErr != nil {
		fmt.Println("Error fetching comments:", commentsErr)
		return
	}

	// Print results
	fmt.Println("Post JSON:", postJSON)
	fmt.Println("Comments JSON:", commentsJSON)
}
