# AEO + GEO → llms.txt Generator

Paste any public website URL and this tool will:

1. **Scrape** the site (including JavaScript-rendered pages)
2. **Score** it for **AEO** (Answer Engine Optimization) and **GEO** (Generative Engine Optimization)
3. **Generate** a ready-to-use `llms.txt` file from the real content
4. **Embed** the whole result anywhere with a single `<script>` tag

**Live demo:** paste a URL at `frontend/demo/analyzer.html` (see [Deployment](#deployment) for the hosted link once available).

---

## What are AEO and GEO?

- **AEO (Answer Engine Optimization)** — for tools like Google Featured Snippets, Siri, and Alexa, which don't read a whole page, they lift *one direct answer* out of it. AEO rewards content structured so a machine can extract a clean fact: question-style headings, FAQ blocks, answer-first paragraphs, lists, tables, and structured data (JSON-LD).

- **GEO (Generative Engine Optimization)** — for LLM tools like ChatGPT, Claude, and Gemini, which synthesize an answer from *many* sources and decide which to trust and cite. GEO rewards credibility signals: Organization/Person/Article schema, author attribution, internal linking depth, and content freshness.

**In one line: AEO = "can a machine extract a fact from this page?" GEO = "does a machine trust this page enough to cite it?"**

`llms.txt` is an emerging convention (like `robots.txt`, but for AI) — a plain-text file that tells AI crawlers/agents what a site is about and its key pages. This project generates that file automatically from a real scrape instead of someone hand-writing it.

---

## How it works

```
1. <script src=".../widget.js" data-url="https://example.com"> loads on any page
2. widget.js calls  GET /analyze?url=<target>  on the backend
3. Backend crawls the site:
     - fetches HTML (axios + cheerio)
     - falls back to a headless browser (Playwright) for JS-rendered pages
     - follows the site's own nav links to crawl a few extra important pages
4. Two scoring engines run on the scraped content:
     - AEO engine  → 9 weighted checks  → score 0–100
     - GEO engine  → 10 weighted checks → score 0–100
5. The llms.txt Generator composes a spec-compliant llms.txt from the same content
6. Backend returns one JSON payload: { website, scores, checks, recommendations, generatedLlmsTxt }
7. widget.js renders score cards, pass/fail checklists, recommendations,
   and the llms.txt file itself (with Copy/Download buttons)
```

Each check is a small pure function that returns `{ passed, weight, message }`. The score is:

```
score = round( (sum of weights of passed checks / sum of all weights) * 100 )
```

---

## Project structure

```
backend/
├── server.js               # Express entry point, serves frontend/ statically
├── routes/                 # GET /analyze
├── controllers/             # request parsing → calls the service layer
├── services/
│   ├── analyze.service.js   # orchestrates scrape → score → generate
│   ├── crawl.service.js     # multi-page crawl + link prioritization
│   ├── recommendations.service.js
│   └── cache.service.js     # disk + memory cache, avoids re-scraping
├── scraper/
│   ├── scraper.js           # fetch → fallback to headless render → extract
│   ├── renderPage.js        # Playwright headless-render fallback
│   ├── browserPool.js       # shared headless browser instance across a crawl
│   └── extractors/          # one file per data point (title, FAQ, JSON-LD, links, ...)
├── engines/
│   ├── aeo/                 # AEO checks + scorer
│   ├── geo/                 # GEO checks + scorer
│   └── llmsTxt/              # composes the generated llms.txt from its sections
├── models/                  # shape of Website / CheckResult / AnalysisResult
└── utils/                   # HTTP client, HTML/URL helpers, JSON-LD parsing, logger

frontend/
├── widget.js                 # the single <script> entry point
├── widget/                    # ES modules: apiClient, uiRenderer, components/*
├── styles/widget.css
└── demo/
    ├── index.html             # minimal embed example (hardcoded data-url)
    └── analyzer.html          # paste-a-URL UI for manual testing
```

---

## Running locally

**Requirements:** Node.js 20+

```bash
cd backend
npm install
npx playwright install chromium   # one-time, downloads the headless browser
npm start
```

The server starts on `http://localhost:3000` and serves both the API and the `frontend/` folder statically.

Open in your browser:

```
http://localhost:3000/demo/analyzer.html
```

Paste any public URL and click **Analyze**.

---

## Using the widget on your own page

```html
<script
  src="http://localhost:3000/widget.js"
  data-url="https://example.com">
</script>
```

Drop that tag into any HTML page — it auto-runs, calls the backend, and renders the results in place. No build step, no bundler.

---

## API

```
GET /analyze?url=<target-url>
```

Returns:

```json
{
  "website": { "url": "...", "title": "...", "organization": {...}, "author": {...} },
  "scores": { "aeo": 62, "geo": 48, "overall": 55 },
  "checks": { "aeo": [ { "id": "...", "passed": true, "weight": 10, "message": "..." } ], "geo": [...] },
  "recommendations": [ { "message": "...", "weight": 12 } ],
  "generatedLlmsTxt": "# Example\n\n> ...",
  "pagesCrawled": ["https://example.com", "https://example.com/about"]
}
```

Rate-limited (`express-rate-limit`) to protect against abuse.

---

## Deployment

This app is split across two hosts because the backend needs a persistent Node process with a headless Chromium browser (Playwright), which a static host can't run:

| Part | Host | Why |
|---|---|---|
| `backend/` | [Render](https://render.com) | Persistent Node server + Playwright/Chromium via Docker |
| `frontend/` | [Netlify](https://netlify.com) | Static files only — no server needed |

The backend is deployed via [`render.yaml`](render.yaml) (Blueprint) using [`backend/Dockerfile`](backend/Dockerfile), which is based on Microsoft's official Playwright image so Chromium's system dependencies are already baked in.

Once both are live, `frontend/demo/analyzer.html` points its API calls at the Render backend URL via the widget's `data-api-base` attribute, while its own static assets can be served from Netlify.

---

## Tech stack

| Choice | Why |
|---|---|
| Node.js + Express | Simple, fast single-purpose API |
| Axios + Cheerio | Fast HTML parsing for the common case (server-rendered pages) |
| Playwright | Headless-browser fallback for JavaScript-rendered (SPA) sites |
| Vanilla JS widget (no framework/bundler) | The deliverable is a single `<script>` tag — no build step for consumers |
| Modular folder structure | Scraping, scoring, and generation logic are independently testable and extensible |
