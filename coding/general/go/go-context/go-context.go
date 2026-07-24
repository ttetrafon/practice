package main

import (
	"context"
	"fmt"
	"log"
	"math/rand/v2"
	"time"
)

type Response struct {
	val string
	err error
}

func main() {
	start := time.Now()

	ctx := context.WithValue(context.Background(), "foo", "bar")
	val, error := fetch(ctx)
	if error != nil {
		log.Fatal(error)
	}
	fmt.Println("result: ", val)

	fmt.Println("took: ", time.Since(start))
}

func fetch(ctx context.Context) (string, error) {
	ctxValue := ctx.Value("foo")
	fmt.Println("ctx value: ", ctxValue.(string))

	ctx, cancel := context.WithTimeout(ctx, time.Second*3)
	defer cancel() // prevents leaking context (memory)

	responseChannel := make(chan Response)

	go func() {
		val, err := slowFetch()
		responseChannel <- Response{val, err}
	}()

	for {
		select {
		case <-ctx.Done():
			return "", fmt.Errorf("fetch timed out")
		case resp := <-responseChannel:
			return resp.val, resp.err
		}
	}
}

func slowFetch() (string, error) {
	r := rand.N(5000)
	time.Sleep(time.Duration(r) * time.Millisecond)
	return "some response!", nil
}
