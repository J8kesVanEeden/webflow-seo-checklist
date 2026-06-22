/**
 * Single source of truth loader.
 *
 * All copy lives in `checklist.yaml` (human-friendly, multiline-safe).
 * It is imported as a raw string, parsed, and validated against a Zod
 * schema at build time — so a typo or missing field fails the build
 * loudly instead of shipping broken content.
 */
import { z } from 'zod';
import { parse } from 'yaml';
// `?raw` gives us the file contents as a string (Vite feature).
import rawYaml from '../content/checklist.yaml?raw';

const impact = z.enum(['critical', 'high', 'medium', 'low']);
const effort = z.enum(['super-easy', 'easy', 'medium', 'high']);

const codeSchema = z.object({
  lang: z.string(),
  label: z.string().optional(),
  snippet: z.string(),
});

const itemSchema = z.object({
  id: z.string(),
  n: z.number(), // global item number (1..52)
  title: z.string(),
  summary: z.string(), // the bold lead line
  impact,
  effort,
  what: z.string(),
  how: z.string(),
  why: z.string(),
  webflowPath: z.string().optional(),
  code: codeSchema.optional(),
});

const phaseSchema = z.object({
  id: z.string(),
  number: z.string(), // Roman numeral
  title: z.string(),
  blurb: z.string(),
  items: z.array(itemSchema).min(1),
});

const faqSchema = z.object({
  q: z.string(),
  a: z.string(),
});

const sourceSchema = z.object({
  label: z.string(),
  url: z.string().url(),
  note: z.string().optional(),
  kind: z.enum(['data', 'reading']).optional(), // 'data' = research behind a cited number
});

const checklistSchema = z.object({
  site: z.object({
    title: z.string(),
    titleShort: z.string(),
    description: z.string(),
    url: z.string().url(),
    author: z.string(),
    authorUrl: z.string().url(),
    ogImage: z.string(),
    locale: z.string(),
    updated: z.string(),
    keywords: z.array(z.string()),
  }),
  org: z.object({
    name: z.string(),
    url: z.string().url(),
    logo: z.string(),
    sameAs: z.array(z.string().url()),
  }),
  hero: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    lead: z.string(),
    stats: z.array(
      z.object({ value: z.string(), label: z.string(), source: z.string().optional() })
    ),
  }),
  about: z.object({
    heading: z.string(),
    body: z.array(z.string()),
  }),
  howToUse: z.object({
    heading: z.string(),
    intro: z.string(),
    ratings: z.array(z.object({ key: z.string(), label: z.string(), desc: z.string() })),
    notes: z.array(z.string()),
  }),
  phases: z.array(phaseSchema).min(1),
  doFirst: z.object({
    heading: z.string(),
    intro: z.string(),
    items: z.array(z.string()).min(1),
    afterLaunch: z.string(),
  }),
  faq: z.array(faqSchema).min(1),
  sources: z.array(sourceSchema).min(1),
});

export type Checklist = z.infer<typeof checklistSchema>;
export type Phase = z.infer<typeof phaseSchema>;
export type Item = z.infer<typeof itemSchema>;
export type Impact = z.infer<typeof impact>;
export type Effort = z.infer<typeof effort>;

// Parse + validate now (build time). Throws with a clear path on error.
export const checklist: Checklist = checklistSchema.parse(parse(rawYaml));

// Convenience: flat list + total count.
export const allItems: Item[] = checklist.phases.flatMap((p) => p.items);
export const totalItems = allItems.length;
