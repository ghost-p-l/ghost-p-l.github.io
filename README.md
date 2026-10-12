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
assets/                 # CV (PDF), og-image.png (1200×630 social card)
robots.txt · sitemap.xml · manifest.webmanifest
.well-known/security.txt
```

## Security
GitHub Pages serves static files only (no custom HTTP response headers), so the
enforceable policy ships in `<meta>` tags in `index.html`:
- `Content-Security-Policy`: `script-src 'self'` (no inline scripts), styles only
  from self + Google Fonts, fonts from `fonts.gstatic.com`, API calls only to
  `api.github.com`, `object-src 'none'`, `upgrade-insecure-requests`.
- `referrer: strict-origin-when-cross-origin`.
- All `target="_blank"` links carry `rel="noopener"`; GitHub API data injected
  into the DOM is HTML-escaped and URLs restricted to `https:`.
- No trackers, no cookies, no third-party scripts. HTTPS + HSTS enforced by
  `github.io` itself. Contact point: `.well-known/security.txt` (RFC 9116).

## Caching
GitHub Pages sends `Cache-Control: max-age=600` and browsers aggressively cache
same-named CSS/JS. Every asset reference carries a content hash
(`main.css?v=<sha>`, `main.js?v=<sha>`): **recompute the short sha1 after any
edit to CSS/JS and update the `?v=` in `index.html`** so visitors always get
fresh files. Verify live with:
```bash
curl -s https://ghost-p-l.github.io/ | grep -o 'main\.\(css\|js\)?v=[0-9a-f]*'
```

## Local preview
```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy
Push to `main` of this repo. GitHub Pages serves the root automatically
(Settings → Pages → Source: Deploy from branch → `main` / `/root`).
