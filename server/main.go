package main

import (
	"flag"
	"log"
	"net"
	"net/http"
)

type config struct {
	port string
}

func parseConfig() *config {
	c := config{}

	flag.StringVar(&c.port, "port", "4000", "HTTP port")

	return &c
}

func main() {
	c := parseConfig()

	log.Printf("config: %+v", c)
	log.Fatal(http.ListenAndServe(net.JoinHostPort("", c.port), nil))
}
