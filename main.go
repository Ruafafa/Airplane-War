package main

import (
	"AirPlaneWar/backend"
	"embed"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"log"
)

// Embed the frontend assets
//
//go:embed all:frontend/dist
var assets embed.FS

// Constants for window size
const (
	WindowWidth  = 500
	WindowHeight = 770
)

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Define application options
	appOptions := &options.App{
		Title:            "飞机大战",
		Width:            WindowWidth,
		MinWidth:         WindowWidth,
		MaxWidth:         WindowWidth,
		Height:           WindowHeight,
		MinHeight:        WindowHeight,
		MaxHeight:        WindowHeight,
		AssetServer:      &assetserver.Options{Assets: assets},
		BackgroundColour: &options.RGBA{R: 0, G: 0, B: 0, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
			backend.NewUserService(),
		},
	}

	// Run the application
	if err := wails.Run(appOptions); err != nil {
		log.Fatalf("Error: %v", err)
	}
}
