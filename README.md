# Surya Prajyesh Eatha — Portfolio

Personal site: projects, résumé, how I build with Claude Code, and a live GitHub feed.

**Stack:** React 18 · Vite 5 · [motion](https://motion.dev) (springs and shared-layout transitions) · Lenis smooth scroll · plain CSS.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # refreshes the GitHub snapshot, then builds to dist/
```

## How it's put together

- **Content** lives in `src/data.js`. Every fact comes from my résumé or a public repo.
- **Live GitHub feed** (`src/lib/github.js`) fetches from the GitHub API in the browser and caches it for 10 minutes. If the API is rate-limited or offline it falls back to `public/github-snapshot.json`, which is regenerated on every build.
- **LinkedIn posts** use LinkedIn's official embeds (it has no public read API). Add a post's `urn:li:share:…` to `linkedinPosts` in `src/data.js`.
- **Projects** open into a detail sheet via a shared-layout animation. Each has its own link, e.g. `/#project-pitwall`.
- **Security headers** (HSTS, CSP, immutable asset caching) are in `vercel.json`.

## Checks

Python + Playwright scripts in `scripts/`, run against a local `vite preview`:

| Script | Checks |
| --- | --- |
| `review.py` | Scrolls the page at 1440px and 390px, screenshots it, reports console errors and horizontal overflow |
| `sheet-check.py` | Project dialog: focus trap, Esc, arrow-key navigation, scroll lock, deep links |
| `csp-check.py` | Loads the site under the production CSP and reports violations |
| `og.py` | Renders `scripts/og.html` to the 1200×630 link-preview image `public/og.png` |
