//go:build prueba

// Solo para las pruebas automáticas: la página abierta como "localhost" hace de
// laptop servidora y la abierta como "127.0.0.1" hace de laptop remota.
package main

import (
	"net/http"
	"strings"
)

func init() {
	esControl = func(ip string, r *http.Request) bool { return strings.HasPrefix(r.Host, "localhost") }
}
