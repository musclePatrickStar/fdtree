package main

import "fmt"

// Greet 打印问候语
func Greet(name string) string {
	return fmt.Sprintf("Hello, %s!", name)
}

func main() {
	names := []string{"Ada", "Bob", "Cara"}
	for i, n := range names {
		fmt.Println(i, Greet(n))
	}
}
