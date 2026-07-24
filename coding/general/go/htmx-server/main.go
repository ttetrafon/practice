package main

import (
	"context"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/coder/websocket"
)

type server struct {
	subscriberMessageBuffer int
	mux                     http.ServeMux
	subscribersMutex        sync.Mutex
	subscribers             map[*subscriber]struct{}
}

type subscriber struct {
	msgs chan []byte
}

func NewServer() *server {
	s := &server{
		subscriberMessageBuffer: 100,
		subscribersMutex:        sync.Mutex{},
		subscribers:             make(map[*subscriber]struct{}),
	}
	// s.mux.Handle("/", http.FileServer(http.Dir("./htmx")))
	s.mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("received request: method=%s path=%s", r.Method, r.URL.Path)
		tmpl, err := template.ParseFiles("./htmx/index.html")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		data := struct {
			Message string
		}{
			Message: "Hello World",
		}
		tmpl.Execute(w, data)
	})
	s.mux.HandleFunc("/time", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("received request: method=%s path=%s", r.Method, r.URL.Path)
		w.Write([]byte("Current time: " + time.Now().Format(time.RFC1123Z)))
	})
	s.mux.HandleFunc("/ws", s.subscribeHandler)
	return s
}

func (s *server) subscribeHandler(writer http.ResponseWriter, request *http.Request) {
	err := s.subscribe(request.Context(), writer, request)
	if err != nil {
		fmt.Println(err)
		return
	}
}

func (s *server) addSubscriber(sub *subscriber) {
	s.subscribersMutex.Lock()
	s.subscribers[sub] = struct{}{}
	s.subscribersMutex.Unlock()
	fmt.Println("Subscriber added:", sub)
}

func (s *server) subscribe(ctx context.Context, writer http.ResponseWriter, request *http.Request) error {
	var c *websocket.Conn
	subscriber := &subscriber{
		msgs: make(chan []byte, s.subscriberMessageBuffer),
	}
	s.addSubscriber(subscriber)

	c, err := websocket.Accept(writer, request, nil)
	if err != nil {
		return err
	}

	defer c.CloseNow()

	ctx = c.CloseRead(ctx)
	for {
		select {
		case msg := <-subscriber.msgs:
			ctx, cancel := context.WithTimeout(ctx, time.Second)
			defer cancel()
			err := c.Write(ctx, websocket.MessageText, msg)
			if err != nil {
				return err
			}
		case <-ctx.Done():
			return ctx.Err()
		}
	}
}

func (s *server) broadcast(msg []byte) {
	s.subscribersMutex.Lock()
	for sub := range s.subscribers {
		sub.msgs <- msg
	}
	s.subscribersMutex.Unlock()
}

func main() {
	srv := NewServer()

	go func(s *server) {
		for {
			t := time.Now().Format(time.RFC1123Z)
			html := `<p hx-swap-oob="innerHtml:#ticking">Ticking time: ` + t + `</p>`

			fmt.Println("... broadcasting:", html)
			s.broadcast([]byte(html))

			time.Sleep(3 * time.Second)
		}
	}(srv)

	err := http.ListenAndServe(":8080", &srv.mux)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
