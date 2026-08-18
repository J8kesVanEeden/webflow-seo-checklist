# Webflow SEO & AEO Checklist

A static checklist site at **seo.milkmoonstudio.com**. Own repo:
`J8kesVanEeden/webflow-seo-checklist`. The hub folder above is a *different* repo.

## Stack

Astro (`output: 'static'`) · content in Zod-validated YAML under `src/content/` + `src/data/` ·
GSAP for motion · `@astrojs/sitemap` · Cloudflare Workers (Static Assets), auto-deploy on `main`.

## Commands

```bash
npm run dev        # local
npm run build      # astro build -> ./dist  (a schema violation FAILS the build — that is deliberate)
npm run preview    # serve the built output
```

There is no test script. **The build is the verification**: content is Zod-validated, so a typo in
the YAML breaks the build loudly instead of shipping. Run `npm run build` and show the output before
claiming a content change is good.

## Rules specific to this project

* **Content is data, not markup.** Checklist items live in the YAML/TS data files, never hard-coded
  into a component.
* The checklist is advice Jakes puts his name to — **every SEO/AEO claim must be checkable against
  a primary source** (Google/Webflow docs or the vault's Webflow mirrors). No folk SEO.
* Text sections run the full container width — no narrow reading-column caps.
