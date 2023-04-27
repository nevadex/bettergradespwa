package main

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
	"log"
	"os"
	"time"
)

func main() {
	fmt.Println("BetterGrades (c) Neev Dadhania 2023. ALL RIGHTS RESERVED.")

	app := fiber.New(fiber.Config{
		Prefork:      true,
		ServerHeader: "bettergrades v1",
		ReadTimeout:  time.Second,
		WriteTimeout: time.Second,
		IdleTimeout:  time.Second,
		GETOnly:      true,
		AppName:      "BetterGrades",
	})

	app.Static("/", "../www", fiber.Static{
		Browse: false,
		Index:  "index.html",
		MaxAge: 600,
	})
	if os.Args[1] == "debug" {
		log.Fatal(app.Listen(":3000"))
	} else {
		log.Fatal(app.ListenTLS(":443", os.Args[1], os.Args[2]))
	}
}
