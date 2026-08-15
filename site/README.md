# Adel — personal website

**Brand: Adel Personal Brand v2.0.** Adel is the site. AdelTechTalks is the
content/show identity, named where the channel is named. GearNest is a separate
business, linked but never merged in.

**👉 To get this live, read [LAUNCH.md](./LAUNCH.md).**

## What this is

A static site — Astro builds it into plain HTML, CSS and a small amount of
JavaScript. Only `/badge/*` is server-rendered (LinkedIn's crawler does not run
JavaScript, so a shared badge's name has to be in the HTML it fetches).

### Routes

English keeps the bare paths. Arabic is added alongside under `/ar/`. Every URL
that was live before the v2.0 migration is still at the same address.

| Page | English | Arabic |
|---|---|---|
| Home | `/` | `/ar/` |
| About | `/about` | `/ar/about` |
| Guides | `/guides`, `/guides/<slug>` | `/ar/guides`, `/ar/guides/<slug>` |
| Articles | `/articles/<slug>` | `/ar/articles/<slug>` |
| Topics | `/topics`, `/topics/<id>` | `/ar/topics`, `/ar/topics/<id>` |
| Newsletter | `/newsletter` | `/ar/newsletter` |
| Playground | `/playground`, `/playground/<slug>` | — |
| Work with me | `/work-with-me` | — |
| Contact | `/contact` | — |
| Badge (shared) | `/badge/<id>` | — |
| 404 | `/404` (answers in both languages) | |

Reserved but not built: `/prompts`, `/projects`, `/podcast`, `/services`,
`/resume`. They are already declared in `nav` in `src/site.config.ts` with a
`phase` above 1, so switching one on is a page plus a one-word change.

## Editing content

Two files hold everything you would normally want to change.

**`src/copy.ts` — all the words**, English and Arabic side by side. To keep an
English technical term inside an Arabic sentence, wrap it in double square
brackets and the site handles direction, isolation and wrapping:

```ts
body: 'أستكشف الـ[[AI]] و[[Automation]] كل أسبوع'
```

**`src/site.config.ts` — structure and links**: social accounts, the six topics,
projects, featured videos, photography paths, partnership packages, Playground
tracks, service keys.

**Guides and articles** are Markdown files in `src/content/guides/` and
`src/content/articles/`. Copy one, rename it — the filename becomes the URL —
and change the frontmatter. `src/content/articles/_template.md` documents every
field. An Arabic piece is a separate file with `lang: ar`.

**Photographs** go in `public/photos/`, then name them in `photography` in
`src/site.config.ts`. Until a real photograph is set, the page renders a
designed placeholder that says what belongs there. That is deliberate — no
generated or stock image ever stands in for Adel.

## The design system

Tokens live in `src/styles/tokens/` and load in the order set by
`src/styles/tokens.css`, which is load-bearing:

| File | What it is |
|---|---|
| `fonts / colors / typography / spacing / elevation / brand / motion / base` | The original ATT system. Still the source of every geometry, motion and type token. |
| `adel-v2.css` | The v2.0 palette — nine approved values plus the Tier 2 semantics components consume. |
| `adel-type.css` | v2.0 typography, Arabic/RTL rules, and the mixed Arabic+English handling. |
| `bridge-v2.css` | Re-points every `--atc-*` **colour** token at a v2.0 value. This is what carried the whole existing site onto the new palette without editing components or inlining a single hex. |
| `legacy-att.css` | `Legacy · ATT Content System`, scoped to `.att-legacy`. Never global. |

**New components author against `--adel-*`.** `--atc-*` is a compatibility
surface for pre-v2.0 code, not something to build on.

To roll the entire visual migration back: comment out the three `adel-*` /
`bridge-v2` imports in `src/styles/tokens.css`. Nothing else has to change.

### Editorial primitives

`src/components/editorial/` — `Prose`, `SectionIntro`, `Divider`, `PhotoFigure`,
`PullQuote`, `NewsletterCTA`, plus `EntryList` and `EntryCard`. Reach for these
before reaching for a card; the system is deliberately card-light.

A `Divider` takes its spacing from the element that wraps it:
`<div class="my-spacing"><Divider /></div>`.

## Running it on your own machine

Optional — you do not need this to publish.

```bash
cd site
npm install
npm run dev      # then open http://localhost:4321
npm run build    # production build into dist/
npm run og       # regenerate the social share cards
```

## Outstanding assets

The site is complete and builds clean without these; each one has a designed
placeholder or a documented fallback until it arrives.

- **Real photography of Adel** — hero portrait (3:4, 1200px+) and a working
  photograph for About. Set in `photography` in `src/site.config.ts`.
- **`KOGhorab-Regular.woff2`** — the approved Arabic display face. Drop it in
  `src/assets/fonts/` and it activates on the next build. Arabic display falls
  back to Cairo until then.
- **The Adel “A” mark** — `src/assets/brand/adel-a-mark.svg`, using
  `fill="currentColor"`. The lockup renders as the wordmark alone until it
  exists; the mark has deliberately not been drawn from a description.
- **Adel's real handwritten signature** — `photography.signature`.
- **Real YouTube video IDs**, and the About page's three paragraphs.
