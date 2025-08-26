package main

import (
	"fmt"
	"log"
	"net/http"
	"text/template"
	"time"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("received request: method=%s path=%s", r.Method, r.URL.Path)
		tmpl, err := template.ParseFiles("index.html")
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

	http.HandleFunc("/time", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("received request: method=%s path=%s", r.Method, r.URL.Path)
		w.Write([]byte("Current time: " + time.Now().Format(time.RFC1123Z)))
	})

	fmt.Println("Server started at port 7501!")
	log.Fatal(http.ListenAndServe(":7501", nil))
}
