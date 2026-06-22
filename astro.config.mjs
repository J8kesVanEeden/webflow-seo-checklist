// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Canonical production URL. Drives <link rel="canonical">, sitemap, and OG URLs.
const SITE = 'https://seo.milkmoonstudio.com';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'never',
  integrations: [sitemap()],
  build: {
    // Keep one clean URL (/) — no /index/ folder.
    format: 'file',
  },
});
