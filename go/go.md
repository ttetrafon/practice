# GoLang

- [Effective Go](https://go.dev/doc/effective_go)
- [Go Project Layout](https://github.com/golang-standards/project-layout)
- Testing:
  - [Mockery test suit](https://github.com/vektra/mockery)

## Program Structure

```Filesystem
| .git/
| bin/ -> auto-generated
| cmd/ -> subfolders for every executable the program features
  | server/
    | main.go
  | client/
    | main.go
| internal/ -> contains the packages that are going to be used only by this program
  | http-client/
    | http-client.go
    | http-client_test.go
  | logger/
    | logger.go
    | logger_test.go
| mocks/ -> auto-generated
| pkg/
  | client
    | client.go
    | client_test.go
  | server
    | server.go
    | server_test.go -> unit tests
| test -> integration tests
| .gitignore
| go.mod
| go.sum
| Makefile
| README.md
| TUTORIAL.md
```

```Makefile
ARTIFACT_NAME := my-app

build:
  @go build -o bin/${ARTIFACT_NAME}/${ARTIFACT_NAME} cmd/${ARTIFACT_NAME}/main.go

run:
  @go run cmd/${ARTIFACT_NAME}/main.go

test:
  @go test -v $(shell go list ./ ... | grep -v /test/)

go-test-with-cover:
  @go test -coverprofile cover.out -v $(shell go list ./ ... | grep -v /test/)
  @go tool cover -html=cover.out -o cover.html

generate-mocks:
  @mockery --all --with-expecter --keeptree
```
