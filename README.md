# CraftedSignal Website

Marketing website for CraftedSignal - SOC Control Plane for Detection Engineering.

Built with [Hugo](https://gohugo.io/) and [Tailwind CSS](https://tailwindcss.com/).

## Prerequisites

- [Hugo Extended](https://gohugo.io/installation/) (v0.128.0+)
- [Node.js](https://nodejs.org/) (v20+)
- npm

## Quick Start

```bash
# Install dependencies
make setup

# Start development server
make dev
```

Visit http://localhost:1313 to see the site.

## Project Structure

```
.
├── archetypes/          # Content templates
├── assets/
│   ├── css/             # Tailwind CSS (processed by Hugo Pipes)
│   └── js/              # JavaScript (bundled by Hugo's ESBuild)
├── content/             # Markdown content (future pages)
├── data/                # Structured data files
├── i18n/                # Translation files (TOML format)
│   └── en.toml          # English translations
├── layouts/
│   ├── _default/        # Base templates
│   ├── partials/        # Reusable template components
│   │   └── sections/    # Page sections (hero, architecture, etc.)
│   └── index.html       # Homepage template
├── static/
│   └── fonts/           # Web fonts (Inter, Space Grotesk)
├── hugo.toml            # Hugo configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
├── package.json         # npm dependencies
└── Makefile             # Build commands
```

## Available Commands

| Command | Description |
|---------|-------------|
| `make install` | Install npm dependencies |
| `make dev` | Start development server with live reload |
| `make build` | Build production site to `./public` |
| `make serve` | Build and serve production site locally |
| `make clean` | Remove build artifacts |
| `make fonts` | Copy fonts from node_modules |
| `make setup` | Full setup (install + fonts) |

## Internationalization (i18n)

The site is prepared for internationalization. All user-facing strings are extracted to translation files.

### Adding a New Language

1. Create a new translation file:
   ```bash
   make new-lang LANG=de
   ```

2. Edit `i18n/de.toml` with German translations

3. Uncomment the language in `hugo.toml`:
   ```toml
   [languages.de]
     languageName = "Deutsch"
     weight = 2
   ```

4. Preview with `make dev`

### Translation File Format

Translations use TOML format with the `other` key:

```toml
[heroTitle]
other = "Your translated hero title here"

[ctaDemo]
other = "Schedule a live demo"
```

## Deployment

The site automatically deploys to GitHub Pages when changes are pushed to `main`.

### GitHub Actions Workflow

- **Build**: Hugo builds the site with Tailwind CSS processing
- **Deploy**: Uploads to GitHub Pages
- **Release**: Creates a GitHub Release with version tag and zip artifact

Releases are versioned as `v1.0.{run_number}`.

## Development

### CSS

Tailwind CSS is processed through Hugo Pipes with PostCSS. Custom styles are in `assets/css/main.css`.

The theme uses custom colors:
- `base`: Dark background (#070b12)
- `panel`: Card backgrounds (#0e1421)
- `accent`: Primary blue (#5ab0ff)
- `accent2`: Secondary teal (#7ed0c0)
- `muted`: Muted text (#9baac0)
- `text`: Primary text (#e4eaf5)

### JavaScript

JavaScript is bundled using Hugo's built-in ESBuild. The main entry point is `assets/js/app.js`.

Features:
- Rule editor with syntax highlighting (highlight.js)
- Local storage for draft rules
- Auto-scrolling problem cards

### Fonts

The site uses self-hosted fonts:
- **Inter** - Body text
- **Space Grotesk** - Display headings

Fonts are copied from `@fontsource` packages to `static/fonts/`.

## License

Proprietary - CraftedSignal
