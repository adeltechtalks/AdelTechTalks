import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* =============================================================================
   CONTENT MODEL (§19)
   =============================================================================
   Guides and Articles are Markdown files with frontmatter, loaded by Astro's
   content layer. §19: "make Guides a reusable content model rather than
   individually hard-coded pages" and "Do not introduce a second CMS/database
   without a strong reason."

   There is no second CMS. Editorial content is files in git — versioned,
   reviewable, and free to serve. Supabase stays what it already is: the place
   for user data (Playground progress, badges, subscribers).

   ── ADDING A GUIDE ──────────────────────────────────────────────────────────
   Copy an existing .md file in src/content/guides/, rename it (the filename
   becomes the URL), and change the frontmatter. Nothing else.

   ── BILINGUAL ───────────────────────────────────────────────────────────────
   A guide declares its own `lang`. An Arabic guide is a separate file with
   `lang: ar`, and `translationOf:` pointing at the English slug links the two
   so each can offer the other. Nothing is machine-translated, and a language
   only ever shows content actually written in it.
   ========================================================================== */

/* Every id in `topics` in site.config.ts. Kept as a literal union so a typo in
   frontmatter fails the build instead of producing an orphan page. */
const TOPICS = ['ai', 'automation', 'product', 'tech', 'building', 'creator-tech'] as const;

/* The five AdelTechTalks pillars. Legacy (§7) — still accepted so published
   guides keep building, and mapped onto a topic below. */
const PILLARS = ['ai', 'gadgets', 'automation', 'enterprise', 'creator'] as const;

/* The legacy pillar → topic mapping lives in src/lib/topics.ts, NOT here.
   Astro treats this file as configuration: anything exported from it that the
   app then imports gets pulled into the build graph, and the Cloudflare
   adapter goes looking for a server chunk that Astro never emits. Keep this
   file to collection definitions only. */

/* Shared by Guides and Articles. The difference between the two is intent —
   a Guide teaches you to do a thing and usually has something to take away;
   an Article is written to be read. */
const editorial = {
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  /* Set when a piece is materially revised. Shown as "Updated" and used for
     the sitemap's lastmod. */
  updated: z.coerce.date().optional(),

  lang: z.enum(['en', 'ar']).default('en'),
  /* The slug of the same piece in the other language, if it exists. */
  translationOf: z.string().optional(),

  topic: z.enum(TOPICS).optional(),
  /* DEPRECATED — the ATT pillar. Falls back to a topic via PILLAR_TO_TOPIC. */
  pillar: z.enum(PILLARS).optional(),
  tags: z.array(z.string()).default([]),

  /* Cover image, relative to /public. Absent → the designed placeholder (§15). */
  cover: z.string().optional(),
  coverAlt: z.string().optional(),

  /* One or two sentences shown above the body — the "preview" of §19. */
  preview: z.string().optional(),

  minutes: z.number().optional(),
  /* Pin to the top of an index and to the homepage. */
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),

  /* Slugs of related guides/articles, shown at the foot of the page. */
  related: z.array(z.string()).default([]),

  /* Campaign metadata (§21) — what a TikTok link to this piece should carry,
     so the attribution on a signup from here is consistent. */
  campaign: z.string().optional(),
};

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    ...editorial,
    /* Download / access (§19). A file in /public, or an external link.
       Present → the guide renders its download panel. */
    download: z
      .object({
        label: z.string().optional(),
        href: z.string(),
        /* 'PDF · 1.2 MB' — shown next to the button so nobody is surprised. */
        meta: z.string().optional(),
        /* Ask for an email before handing it over. */
        gated: z.boolean().default(false),
      })
      .optional(),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object(editorial),
});

export const collections = { guides, articles };
