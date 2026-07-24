package main

import "fmt"

type ServerState int

const (
	StateIdle ServerState = iota
	StateConnected
	StateError
	StateRetrying
)

var stateName = map[ServerState]string{
	StateIdle:      "idle",
	StateConnected: "connected",
	StateError:     "error",
	StateRetrying:  "retrying",
}

func (s ServerState) String() string {
	return stateName[s]
}

func transition(s ServerState) ServerState {
	switch s {
	case StateIdle:
		return StateConnected
	case StateConnected, StateRetrying:
		return StateIdle
	case StateError:
		return StateRetrying
	default:
		panic(fmt.Errorf("Unknown State: $s", s))
	}
}

func main() {
	ns1 := transition(StateIdle)
	fmt.Println(ns1)

	ns2 := transition(ns1)
	fmt.Println(ns2)
}
