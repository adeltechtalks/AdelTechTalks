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

/* Every id in `series` in site.config.ts. Same reasoning as TOPICS: a piece
   claiming a series that does not exist should fail the build, not silently
   drop off the series page it was written for. */
const SERIES = ['vibe-coding'] as const;

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

  /* Phase 1.1 — which build narrative this belongs to, and where it sits in
     that narrative's running order. `part` is what makes a series a series
     rather than a tag: it gives the reader a first, a next and a last. */
  series: z.enum(SERIES).optional(),
  part: z.number().int().positive().optional(),

  /* Phase 1.1 — monetisation architecture, not monetisation. Every piece is
     free today and `commerce.enabled` is false, so 'paid' renders exactly like
     'free'. The field exists so a paid Course later is a value change rather
     than a migration across four collections. */
  access: z.enum(['free', 'paid']).default('free'),

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

/* -----------------------------------------------------------------------------
   USE CASES (Phase 1.1)
   -----------------------------------------------------------------------------
   A Use Case is the counterpart to a Guide. A Guide teaches a technique; a Use
   Case reports what happened when it met a real problem, with the outcome
   stated plainly including when the outcome was "this did not work".

   GearNest is the first one, and it is the case study for the Vibe Coding
   series. `external` links out to the real thing rather than pretending the
   business lives on this site (§5).
   -------------------------------------------------------------------------- */
const useCases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/use-cases' }),
  schema: z.object({
    ...editorial,
    /* Where it got to. This is the honest field — 'exploring' and 'abandoned'
       are as publishable as 'live', and a library with no abandoned entries in
       it is not a record of real work. */
    stage: z.enum(['exploring', 'building', 'live', 'abandoned']).default('building'),
    /* The one-line answer, shown under the title on the index. Not a claim
       about revenue or growth unless one is genuinely known. */
    outcome: z.string().optional(),
    /* What it was actually built with. Rendered as plain labels. */
    stack: z.array(z.string()).default([]),
    /* The real thing, if it is public. */
    external: z.object({ label: z.string(), href: z.string().url() }).optional(),
  }),
});

/* -----------------------------------------------------------------------------
   PROMPT LIBRARY (Phase 1.1)
   -----------------------------------------------------------------------------
   §22 said not to overbuild the Prompt Library "during this migration" and to
   keep the architecture from making it hard to add later. Phase 1.1 is later:
   it is now a real content type with real routes.

   The prompt text lives in `prompt`, NOT in the Markdown body, so it can be
   rendered into a copy button and into /ask-index.json without parsing prose.
   The Markdown body is the commentary around it — when to use it, what it gets
   wrong, what to change.
   -------------------------------------------------------------------------- */
const prompts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/prompts' }),
  schema: z.object({
    ...editorial,
    /* The prompt itself, verbatim, ready to paste. */
    prompt: z.string(),
    /* Placeholders inside the prompt the reader is expected to replace. Each
       one is highlighted so nobody pastes `[YOUR PRODUCT]` into a model. */
    variables: z.array(z.string()).default([]),
    /* What it is for, in one phrase. Groups the index. */
    category: z
      .enum(['product', 'building', 'research', 'writing', 'automation'])
      .default('product'),
    /* Where it has actually been run. A prompt tuned on one model is not a
       promise about another, and saying so is the whole value of the library. */
    testedOn: z.array(z.string()).default([]),
  }),
});

/* -----------------------------------------------------------------------------
   STRUCTURED VIDEOS (Phase 1.1)
   -----------------------------------------------------------------------------
   "Structured" is the point. A bare YouTube ID is a link; a structured video is
   a page — chapters, takeaways, and the guide and prompts that go with it —
   which is indexable, linkable, translatable, and useful with the sound off.

   The simple `videos` array in site.config.ts still works and still renders in
   the homepage strip. This collection is for the ones that earn a page.
   -------------------------------------------------------------------------- */
const videosCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/videos' }),
  schema: z.object({
    ...editorial,
    /* The YouTube ID. Nothing is embedded until the reader asks for it (§31) —
       the page ships a thumbnail and a link, not an iframe. */
    youtubeId: z.string(),
    /* Chapters, in order. `at` is seconds from the start, and becomes a real
       deep link into the video. */
    chapters: z
      .array(z.object({ at: z.number().int().nonnegative(), title: z.string() }))
      .default([]),
    /* What you should be able to do after watching. The part that survives
       without the video. */
    takeaways: z.array(z.string()).default([]),
    /* Prompt slugs used in the video, resolved against the prompts collection. */
    promptSlugs: z.array(z.string()).default([]),
    duration: z.string().optional(),
  }),
});

/* -----------------------------------------------------------------------------
   COURSES (Phase 1.1 — MODEL ONLY, NO ROUTE)
   -----------------------------------------------------------------------------
   Deliberately unrouted. There is no /courses page, no course player, no
   progress tracking, no enrolment and no LMS in this phase — the brief was
   explicit that unfinished Courses must not be exposed.

   What exists is the shape: enough schema that writing the first course does
   not require redesigning the content model, and enough that the Learn Hub can
   name Courses honestly as in progress without linking anywhere.
   -------------------------------------------------------------------------- */
const courses = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/courses' }),
  schema: z.object({
    ...editorial,
    /* Lessons reference existing guides and videos rather than duplicating
       them — a course is a path through the library, not a second copy of it. */
    lessons: z
      .array(
        z.object({
          title: z.string(),
          /* 'guide' | 'video' slug, or nothing yet. */
          ref: z.string().optional(),
          kind: z.enum(['guide', 'video', 'exercise']).default('guide'),
        })
      )
      .default([]),
    level: z.enum(['intro', 'working', 'deep']).default('intro'),
    /* Priced later. Ignored entirely while commerce.enabled is false. */
    price: z.number().nonnegative().optional(),
  }),
});

export const collections = {
  guides,
  articles,
  useCases,
  prompts,
  videos: videosCollection,
  courses,
};
