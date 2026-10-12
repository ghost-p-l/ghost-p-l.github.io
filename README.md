# ghost-p-l.github.io

Personal portfolio for **Liberty James** — Computer Scientist & AI / Full-Stack Developer.
Founder of Nurish. Builder of AI trading systems and MCP tooling for TradingView & MetaTrader.

Static site — plain HTML, CSS, and JavaScript. No build step. Hosted on GitHub Pages.

## Structure
```
index.html          # Single-page site
styles/main.css     # Design tokens, dark/light theme, responsive layout
scripts/main.js     # Typing effect, theme toggle, scroll reveal, GitHub repo fetch
assets/             # CV (PDF)
```

## Local preview
```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy
Push to `main` of this repo. GitHub Pages serves the root automatically
(Settings → Pages → Source: Deploy from branch → `main` / `/root`).
