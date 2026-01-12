.PHONY: dev build clean install serve help new-lang

# Default target
help:
	@echo "CraftedSignal Website - Hugo + Tailwind CSS"
	@echo ""
	@echo "Usage:"
	@echo "  make install     Install npm dependencies"
	@echo "  make dev         Start development server with live reload"
	@echo "  make build       Build production site to ./public"
	@echo "  make serve       Serve production build locally"
	@echo "  make clean       Remove build artifacts"
	@echo "  make new-lang    Create new language (usage: make new-lang LANG=de)"
	@echo ""

# Install dependencies
install:
	npm ci

# Development server with live reload
dev:
	hugo server --buildDrafts --buildFuture --disableFastRender

# Build for production
build:
	hugo --minify

# Serve production build locally
serve: build
	cd public && python3 -m http.server 8080

# Clean build artifacts
clean:
	rm -rf public resources .hugo_build.lock

# Create new language translation file
new-lang:
ifndef LANG
	$(error LANG is required. Usage: make new-lang LANG=de)
endif
	@echo "Creating i18n/$(LANG).toml from English template..."
	@cp i18n/en.toml i18n/$(LANG).toml
	@echo "Created i18n/$(LANG).toml"
	@echo ""
	@echo "Next steps:"
	@echo "1. Edit i18n/$(LANG).toml with translations"
	@echo "2. Uncomment [languages.$(LANG)] section in hugo.toml"
	@echo "3. Run 'make dev' to preview"

# Copy fonts from node_modules (run after npm install if fonts are missing)
fonts:
	@mkdir -p static/fonts
	cp node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2 static/fonts/
	cp node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2 static/fonts/
	cp node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2 static/fonts/
	cp node_modules/@fontsource/inter/files/inter-latin-700-normal.woff2 static/fonts/
	cp node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff2 static/fonts/
	cp node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-500-normal.woff2 static/fonts/
	cp node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-600-normal.woff2 static/fonts/
	cp node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2 static/fonts/
	@echo "Fonts copied to static/fonts/"

# Full setup from scratch
setup: install fonts
	@echo "Setup complete! Run 'make dev' to start developing."
