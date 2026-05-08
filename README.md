# Student Portfolio

Public portfolio site for **Ezekiel A. Obeisun Jr** (NerdPioneer).

This repo is intentionally simple: one `index.html`, a Tailwind build for CSS, and a lightweight local dev server.

## What this site highlights

- **Projects**: hands-on security + cloud work with clear outcomes
- **Credentials & education**: the timeline and proof points
- **Writing & code links**: Medium + GitHub

## Run it locally

### Prerequisites

- Node.js (any recent LTS is fine)

### Install + start

```bash
git clone https://github.com/NerdPioneer/Student-Portfolio.git
cd Student-Portfolio
npm install
npm run build:css
npm start
```

Then open the URL printed in your terminal (defaults to `http://localhost:3000`).

## Common commands

```bash
# Rebuild production CSS (writes to dist/styles.css)
npm run build:css

# Watch CSS changes while editing (Tailwind --watch)
npm run watch:css

# Local server only (no CSS watch)
npm start
```

## Repo layout (quick map)

```
index.html          # Main site (content + small scoped CSS)
src/input.css       # Tailwind input (source)
src/js/main.js      # Client-side interactions
dist/styles.css     # Built CSS output (used by the site)
public/images/      # Images and graphics
```

## Analytics

Uses [Umami](https://umami.is) for privacy-first analytics (no personal data collection—just basic traffic metrics).

## Deployment

Hosted on GitHub Pages. Pushing to `main` publishes updates automatically.

## License

MIT — feel free to reuse with attribution.
