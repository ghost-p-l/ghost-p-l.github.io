# ghost-p-l.github.io

Personal portfolio for **Liberty James** — Computer Scientist & AI / Full-Stack Developer.
Founder of Nurish. Builder of AI trading systems and MCP tooling for TradingView & MetaTrader.

Static site — plain HTML, CSS, and JavaScript. No build step. Hosted on GitHub Pages.

## Features
- Command palette (`⌘K` / `Ctrl+K`) with fuzzy search over sections, actions, themes
- Interactive terminal (`` ` `` key) with commands: `about`, `projects`, `skills`, `neofetch`, `theme`, `matrix`, …
- 7 switchable themes (Midnight, Tokyo, Sunset, Forest, Ocean, Mono, Daylight) — persisted
- Bento-grid about, animated stat counters, marquee tech ticker, custom cursor, magnetic buttons
- Parallax blobs, film-grain overlay, scroll progress, side dot-nav, scroll-reveal
- Project filtering, 3D tilt cards, GitHub API repo fetch (static fallback)
- Konami-code easter egg → Matrix mode · toast notifications · boot sequence
- Fully responsive, `prefers-reduced-motion` aware, SEO + JSON-LD structured data

## Structure
```
index.html              # Single-page site
styles/main.css         # Theme tokens, bento grid, terminal, palette, cursor
scripts/main.js         # Palette, terminal, themes, matrix, counters, GitHub fetch
assets/                 # CV (PDF)
robots.txt · sitemap.xml · manifest.webmanifest
```

## Local preview
```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy
Push to `main` of this repo. GitHub Pages serves the root automatically
(Settings → Pages → Source: Deploy from branch → `main` / `/root`).
