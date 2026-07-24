package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

type StatisticsResponse struct {
	Kind     string `json:"kind"`
	Etag     string `json:"etag"`
	PageInfo struct {
		TotalResults   int `json:"totalResults"`
		ResultsPerPage int `json:"resultsPerPage"`
	} `json:"pageInfo"`
	Items []struct {
		Kind       string `json:"kind"`
		Etag       string `json:"etag"`
		ID         string `json:"id"`
		Statistics struct {
			ViewCount             string `json:"viewCount"`
			SubscriberCount       string `json:"subscriberCount"`
			HiddenSubscriberCount bool   `json:"hiddenSubscriberCount"`
			VideoCount            string `json:"videoCount"`
		} `json:"statistics"`
	} `json:"items"`
}

var urlTemplate string = "https://youtube.googleapis.com/youtube/v3/channels?part=statistics&forHandle=%s&key=%s"
var channelName string = "ttetrafon"

func main() {
	fmt.Println("Starting...")

	// load the env file to get the API key
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
		os.Exit(1)
	}

	// build the url
	var apiKey string = os.Getenv("API_KEY")
	url := fmt.Sprintf(urlTemplate, channelName, apiKey)
	log.Println(url)

	// make the request
	resp, err := http.Get(url)
	if err != nil {
		log.Fatal(err)
		os.Exit(1)
	}

	// parse the response
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
		os.Exit(1)
	}
	statistics := StatisticsResponse{}
	err = json.Unmarshal(body, &statistics)
	if err != nil {
		log.Fatal(err)
		os.Exit(1)
	}
	log.Println(string(body))
	log.Println(statistics)

	// print the response

	fmt.Println("... finished!")
}
