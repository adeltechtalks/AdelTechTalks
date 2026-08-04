# AdelTechTalks — website

Built on the AdelTechTalks Design System (`.claude/skills/adeltechtalks-design/`).
Every colour, radius, shadow, duration and type size comes from that system's token
files, copied in verbatim.

**👉 To get this live, read [LAUNCH.md](./LAUNCH.md).**

## What this is

A static site — Astro builds it into plain HTML, CSS and a small amount of
JavaScript. There is no server to run and no database needed for the main site, so
hosting is free and there is nothing to maintain or patch.

| Page | Route | Notes |
|---|---|---|
| Home | `/` | Hero, pillars, videos, guides, Playground teaser, newsletter |
| Guides | `/guides` + `/guides/<slug>` | Generated from Markdown in `src/content/guides/` |
| Playground | `/playground` + `/playground/<slug>` | Google sign-in, step tracking, badges |
| About | `/about` | Story and values |
| Work with me | `/work-with-me` | The nine partnership packages |
| Contact | `/contact` | Brand enquiry form |

## Editing content

**Almost everything is in `src/site.config.ts`** — bio, pillars, featured videos,
partnership packages, Playground tracks, service keys. Plain text between quote
marks; no code knowledge needed.

Guides are Markdown files in `src/content/guides/`. Copy one, rename it, change the
text at the top.

## Running it on your own machine

Optional — you do not need this to publish.

```bash
cd site
npm install
npm run dev      # then open http://localhost:4321
```

```bash
npm run build    # produces dist/ — what Cloudflare serves
npm run preview  # check the built version before publishing
```

## Design system rules this site enforces

These are the ones most likely to be broken by a future edit. The full set is in the
skill's README.

- **One Spark moment per page.** The coral `variant="primary"` button appears exactly
  once per page — the hero CTA on Home, "Start an enquiry" on Work with me. Adding a
  second breaks CS-05. There is a check for this in `npm run build` output review.
- **One glass layer.** The sticky header is the only glass surface. Never glass on glass.
- **One Origin Corner per composition.** Currently the hero panel. Never nested, never
  on cards, nav, buttons or inputs.
- **Four fonts, no fifth.** Montserrat for standalone Latin headings, Readex Pro for
  body, JetBrains Mono for figures and dates, Cairo for Arabic display at 32px+.
- **Shadows are violet**, never black. Neutrals are violet-tinted, never grey.
- **Light only.** Dark Impact Mode is not specified deeply enough to build against.

## Notable implementation choices

- **Icons** are Lucide, inlined at build time from `lucide-static` so no icon JS ships.
  The design system pins lucide `0.474.0`; `lucide-static` has no 0.474 release (it
  goes 0.473 → 0.477), so this uses **0.473.0**.
- **Fonts** load via a `<link>` in `src/layouts/Base.astro` rather than the `@import`
  the token file originally used — an `@import` inside bundled CSS creates a
  render-blocking waterfall. Same four families, same weights, same subsets.
- **YouTube embeds** use a facade: the thumbnail is a static image and YouTube's
  player only loads on click, so no tracking scripts run on page load.
- **The React components** in the design system were not reused directly — they are
  browser prototypes that need React, ReactDOM and Babel loaded from a CDN at
  runtime, which would be slow and bad for search engines. They were reimplemented
  as Astro components with the exact same token values, verified against the source.
