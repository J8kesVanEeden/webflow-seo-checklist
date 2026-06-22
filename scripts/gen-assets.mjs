/**
 * One-off asset generator: rasterises SVGs to the PNGs referenced in <head>.
 * Run with `node scripts/gen-assets.mjs`. Output committed to /public.
 */
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const mark = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}">
  <rect width="32" height="32" rx="7" fill="#0c0c0c"/>
  <path d="M8 16.5l5 5L24 10.5" fill="none" stroke="#cba6d6" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0c0c0c"/>
  <rect x="0" y="0" width="1200" height="6" fill="#7f71c8"/>
  <g font-family="Georgia, 'Times New Roman', serif">
    <text x="80" y="132" font-family="Poppins, Arial, sans-serif" font-size="24" letter-spacing="4" fill="#8a8a8a">MILK MOON STUDIO · PRE-LAUNCH REPORT</text>
    <text x="76" y="280" font-size="96" fill="#f2f2f2">The Ultimate Webflow</text>
    <text x="76" y="396" font-size="96" fill="#f2f2f2">SEO <tspan fill="#cba6d6">&amp; AEO</tspan> Checklist</text>
  </g>
  <g font-family="Poppins, Arial, sans-serif" font-size="27" fill="#b8b8b8">
    <text x="80" y="540">52 steps</text>
    <text x="320" y="540">7 phases</text>
    <text x="540" y="540">Rank on Google · Get cited by AI</text>
  </g>
  <rect x="1010" y="70" width="110" height="110" rx="24" fill="none" stroke="#1f1f1f" stroke-width="2"/>
  <path d="M1040 126l18 18 36-40" fill="none" stroke="#cba6d6" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

async function main() {
  await sharp(Buffer.from(og)).png().toFile('public/og-image.png');
  await sharp(Buffer.from(mark(180))).resize(180, 180).png().toFile('public/apple-touch-icon.png');
  await sharp(Buffer.from(mark(32))).resize(32, 32).png().toFile('public/favicon.png');
  console.log('Generated og-image.png, apple-touch-icon.png, favicon.png');
}
main();
