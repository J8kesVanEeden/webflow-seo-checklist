# The Ultimate Webflow SEO & AEO Checklist

A page-by-page, pre-launch **Webflow SEO + AEO checklist** — 52 steps across 7 phases, each
rated by impact and effort with the *what*, the *how on Webflow*, and the *why*. Built by
[Milk Moon Studio](https://www.milkmoonstudio.com) and live at **[seo.milkmoonstudio.com](https://seo.milkmoonstudio.com)**.

The site practises what it preaches: it's a static, semantic, schema-rich, fast page that
demonstrates every item on its own checklist.

## Stack

- **[Astro](https://astro.build)** (static output) — real semantic HTML for crawlers + AI, one tiny JS island for progress.
- **Self-hosted fonts** — Durer (display) + Poppins (body), matching milkmoonstudio.com.
- **Cloudflare Workers (Static Assets)** — auto-deploys on push to `main` via Workers Builds.
- **Google Tag Manager** — container `GTM-P29ZKG79`.

## Editing the content

**All copy lives in one file: [`src/content/checklist.yaml`](src/content/checklist.yaml).**

Edit it, commit, and push — Cloudflare rebuilds and redeploys automatically. No need to touch
any components or HTML. The file is validated against a [Zod schema](src/data/checklist.ts) at
build time, so a typo or missing field fails the build loudly rather than shipping broken.

Each checklist item looks like this:

```yaml
- id: "meta-title"          # stable id (also the anchor + localStorage key)
  n: 13                     # global number 1–52
  title: "Write a unique meta title with the keyword"
  summary: "Every page needs its own keyword-led title under ~60 characters."
  impact: "critical"        # critical | high | medium | low
  effort: "easy"            # super-easy | easy | medium | high
  what: >-                  # folded block scalar — write prose freely, no escaping
    The title tag — the clickable blue line in search results.
  how: >-
    Page settings → SEO settings → Title Tag. Lead with the primary keyword.
  why: >-
    The strongest on-page relevance signal and the biggest driver of click-through.
  webflowPath: "Page settings → SEO settings → Title Tag"   # optional
  code:                                                     # optional
    lang: "html"
    label: "Self-referencing canonical"
    snippet: |-
      <link rel="canonical" href="https://yourdomain.com/page" />
```

## Develop

```bash
npm install
npm run dev        # local dev server
npm run build      # static build to dist/
npm run preview    # preview the build
```

Regenerate the OG image / icons after a brand change:

```bash
node scripts/gen-assets.mjs
```

## Deploy

Pushing to `main` triggers Cloudflare Workers Builds (`npm run build` → `npx wrangler deploy`).
To deploy by hand from a local build:

```bash
npm run build
npx wrangler deploy        # uploads ./dist as static assets (see wrangler.jsonc)
```

Security and cache headers are served from [`public/_headers`](public/_headers) (HSTS,
`X-Frame-Options`, `nosniff`, referrer + permissions policy; immutable caching for fonts and
`/_astro/*`, `must-revalidate` for HTML).

## SEO / AEO features baked in

- Semantic HTML5 landmarks, one H1 → H2 (phases) → H3 (items) hierarchy.
- Unique title + meta description, canonical, Open Graph + Twitter, favicon set.
- JSON-LD: `TechArticle`, `Organization` + `sameAs`, `HowTo` (all 52 steps), `FAQPage`, `BreadcrumbList`.
- Auto `sitemap.xml`, `robots.txt`, self-hosted preloaded fonts, security headers (`public/_headers`).
- Answer-first copy, self-contained chunks, a visible FAQ mirrored exactly in `FAQPage` schema.

## Progress tracking

Real checkboxes saved to `localStorage` (key `wsac:v1:progress`) — progress survives refresh and
return visits. The sticky header shows overall completion (ring + bar + count) and per-phase
counts; **Reset** clears everything (and is disabled when nothing is checked). On load, ids for
items that no longer exist are pruned, so editing the checklist never leaves stale saved state.
Works without JS; JS only adds persistence and the progress UI.

---

Built by [Milk Moon Studio](https://www.milkmoonstudio.com) — high-performing, beautiful Webflow sites.
