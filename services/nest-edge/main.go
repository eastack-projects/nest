package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"sync"
	"time"

	"go.bug.st/serial"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	// MySQL client init
	dsn := "root:helloworld@tcp(localhost:3306)/iot"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	fmt.Println("start...")
	mode := &serial.Mode{
		BaudRate: 9600,
		Parity:   serial.NoParity,
		DataBits: 8,
		StopBits: serial.OneStopBit,
	}

	fmt.Println("open serial port...")
	port, err := serial.Open("/dev/ttyUSB0", mode)
	if err != nil {
		log.Fatal(err)
	}

	var wg sync.WaitGroup
	ticker := time.NewTicker(3 * time.Second)
	quit := make(chan struct{})

	wg.Add(1)
	go func() {
		for {
			select {
			case <-ticker.C:
				fmt.Println("read DHT22...")
				dht := readDHT(port)
				saveDHT(dht, db)
			case <-quit:
				ticker.Stop()
				return
			}
		}
	}()

	wg.Wait()
}

type DHTResponse struct {
	Humidity    float32 `json:"humidity"`
	Temperature float32 `json:"temperature"`
}

func readDHT(port serial.Port) DHTResponse {
	fmt.Println("send single...")
	n, err := port.Write([]byte("a"))
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("read response...")
	buff := make([]byte, 1024)
	n, err = port.Read(buff)
	if err != nil {
		log.Fatal(err)
	}

	// process response
	response := DHTResponse{}
	json.Unmarshal(buff[:n], &response)

	return response
}

func saveDHT(dhtData DHTResponse, db *sql.DB) {
	stmt, err := db.Prepare("INSERT INTO temperature_and_humidity (temperature, humidity) VALUES (?, ?)")
	if err != nil {
		panic(err.Error())
	}
	defer stmt.Close()

	_, err = stmt.Exec(dhtData.Temperature, dhtData.Humidity)
	if err != nil {
		panic(err.Error())
	}
}
