# The Ultimate Webflow SEO & AEO Checklist — Design Spec

**Date:** 2026-06-22
**Owner:** Jakes (Milk Moon Studio)
**Status:** Approved — building

## Goal
A page-by-page, pre-launch **Webflow SEO + AEO checklist** that doubles as (a) a practical
auditing tool for Milk Moon Studio's own client projects and (b) a ranking/citation asset
hosted at `seo.milkmoonstudio.com`. The site must itself exemplify every item on its checklist.

## Decisions (approved)
- **Stack:** Astro v5, static output. Real semantic HTML for crawlers/AI; one interactive island.
- **Structure:** Single comprehensive page with sticky phase nav + anchor links.
- **Progress:** Real checkboxes; state in `localStorage` (persists across visits). Sticky progress
  header (overall % ring + per-phase). Reset button with confirm. Storage key versioned.
- **Content source of truth:** one human-friendly `src/content/checklist.yaml`, Zod-validated.
  Editing copy = edit file → commit → Cloudflare auto-rebuild. No manual rebuilds.
- **Repo:** public GitHub repo `webflow-seo-checklist` under `J8kesVanEeden`.
- **Deploy:** Cloudflare Pages, auto-build on push to `main`, custom domain `seo.milkmoonstudio.com`.
- **Fonts:** self-hosted `Durer.woff2` (display serif, headings) + `Poppins` woff2 (body),
  pulled from the user's `milk-moon-studio_webflow-projects` repo.
- **Analytics:** Google Tag Manager (container `GTM-P29ZKG79`) — head script + body noscript.
  Cloudflare Web Analytics may be enabled in the Pages dashboard separately.

## Design tokens (from live milkmoonstudio.com CSS)
- `--black:#0c0c0c` (bg) · `--white:#fff` (text) · `--grey-dark:#1f1f1f` · `--grey:#8a8a8a`
- `--purple:#7f71c8` · `--lilac:#cba6d6` · `--pale-yellow:#fef7b9`
- Headings: **Durer**, weight 400, fluid (viewport-based) sizing, line-height ~1.13.
- Body: **Poppins**, weight 400, 1rem, line-height 1.5.
- Aesthetic: editorial, dark, large serif display headers, generous whitespace, playful accents.
- Layout: two-column item rows (label + rating chips left; What/How/Why right) → single col on mobile.

## Content
Backbone = the Dia-generated checklist (52 items, 7 phases), each item refined/verified against
the user's synced Webflow University docs and current sources:
1. Strategy & Keyword Foundation
2. Technical Foundation (site-wide)
3. On-Page SEO (per page)
4. Performance & Core Web Vitals
5. Mobile, UX & Accessibility
6. Launch Day & Verification
7. AEO — Get Cited by AI Answer Engines

Each item: `title, impact (critical|high|medium|low), effort (super-easy|easy|medium|high),
what, how, why, code? (lang + snippet), webflowPath?`. Plus intro, how-to-use, do-first
shortlist, FAQ (mirrors FAQPage schema), and sources.

## SEO/AEO implementation (the site eats its own dog food)
- Semantic HTML5; one H1 → H2 (phases) → H3 (items); unique title (~60c) + meta description (~155c);
  canonical; `lang=en`; favicon + touch icon; OG/Twitter tags + 1200×630 OG image.
- `@astrojs/sitemap` → `sitemap.xml`; `robots.txt`.
- JSON-LD: `FAQPage`, `Organization` + `sameAs`, `HowTo` (from phases), `BreadcrumbList`, `TechArticle`.
  Schema-content parity enforced (every schema fact appears in visible copy).
- Answer-first writing; self-contained chunks; inline stats with sources.
- Perf: self-hosted preloaded woff2 + `font-display:swap`; minimal JS; lazy images w/ dimensions;
  minified output; `_headers` for cache + security.
- A11y: WCAG AA contrast (body white/light-grey; purple for large/accent text only — verify ratios),
  keyboard nav, ARIA on progress widget, `prefers-reduced-motion`.
- Footer CTA links to milkmoonstudio.com (authority back to main site).

## Project structure
```
astro.config.mjs            # site url + sitemap integration
package.json
public/
  fonts/                    # Durer.woff2, Poppins-*.woff2
  robots.txt
  favicon / icons / og-image
  _headers                  # Cloudflare cache + security headers
src/
  content/checklist.yaml    # ALL copy
  content/config.ts         # Zod schema
  layouts/Base.astro        # head, meta, JSON-LD, fonts, GTM
  components/{ProgressHeader,PhaseNav,ChecklistItem,RatingChip,FAQ,Schema}.astro
  pages/index.astro
  scripts/progress.js       # localStorage + progress
  styles/global.css         # tokens + fonts
README.md
```

## Build order
1. Scaffold Astro + config + sitemap.
2. Fonts + global styles/tokens (match MMS).
3. Content schema + port all 52 items into `checklist.yaml`.
4. Layout + components → render page.
5. Progress interactivity (localStorage).
6. SEO/AEO: meta, JSON-LD, sitemap, robots, OG image, GTM.
7. A11y + responsive + perf pass (Lighthouse).
8. GitHub repo + push.
9. Cloudflare Pages connect + domain.
10. Live verification (Search Console, sitemap submit, Lighthouse).

## Out of scope (YAGNI for v1)
- Per-project named checklists (storage key versioned to allow it later).
- CMS / backend. Filters beyond a possible "hide completed" toggle.
- Printable/PDF export.
