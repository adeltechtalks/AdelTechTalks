# Adel — personal website

**Brand: Adel Personal Brand v2.0.** Adel is the site. AdelTechTalks is the
content/show identity, named where the channel is named. GearNest is a separate
business, linked but never merged in.

**👉 To get this live, read [LAUNCH.md](./LAUNCH.md).**

> **Which document wins.** The Design System export is the visual source of
> truth — colour, type, spacing, motion, photography. It is not the source of
> truth for product scope. Its `DESIGN_FREEZE.md` still carries scope notes
> from an earlier phase — a four-item header of Home · Topics · Guides · About,
> and "Prompt Library — do not build yet" — and both were superseded by the
> approved Phase 1.1 architecture that is live in this repo. Where the two
> disagree about **what exists**, the live Phase 1.1 product architecture and
> navigation win. Where they disagree about **how it looks**, the Design System
> wins. The one visual exception is the header lockup: the graphite
> AdelTechTalks navbar was an explicit Phase 1.2 decision taken after that
> export, so it supersedes the older A-mark + "Adel" header treatment shown in
> the export's `ui_kits/website/Chrome.jsx`.

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
| **Vibe Coding** | `/vibe-coding`, `/vibe-coding/<slug>` | `/ar/vibe-coding`, `/ar/vibe-coding/<slug>` |
| **Gear** | `/gear`, `/gear/<category>/<slug>` | `/ar/gear`, `/ar/gear/<category>/<slug>` |
| **Learn Hub** | `/learn` | `/ar/learn` |
| **Series** | `/series/<id>` | `/ar/series/<id>` |
| About | `/about` | `/ar/about` |
| Guides | `/guides`, `/guides/<slug>` | `/ar/guides`, `/ar/guides/<slug>` |
| **Use cases** | `/use-cases`, `/use-cases/<slug>` | `/ar/use-cases`, `/ar/use-cases/<slug>` |
| **Prompt Library** | `/prompts`, `/prompts/<slug>` | `/ar/prompts`, `/ar/prompts/<slug>` |
| **Videos** | `/videos`, `/videos/<slug>` | `/ar/videos`, `/ar/videos/<slug>` |
| Articles | `/articles/<slug>` | `/ar/articles/<slug>` |
| Topics | `/topics`, `/topics/<id>` | `/ar/topics`, `/ar/topics/<id>` |
| Newsletter | `/newsletter` | `/ar/newsletter` |
| Playground | `/playground`, `/playground/<slug>` | — |
| Work with me | `/work-with-me` | — |
| Contact | `/contact` | — |
| Badge (shared) | `/badge/<id>` | — |
| Retrieval index | `/ask-index.json` | (one file, both languages) |
| 404 | `/404` (answers in both languages) | |

Routes marked — are English only. That is recorded in one place,
`ENGLISH_ONLY` in `src/i18n/index.ts`: the Arabic header links straight to the
English page with `hreflang="en"` rather than to an `/ar/` URL that does not
exist, and no hreflang is advertised for a page with no counterpart. Delete an
entry from that list the day the route gains an Arabic version.

Reserved but not built: `/courses`, `/projects`, `/podcast`, `/services`,
`/resume`. They are already declared in `nav` in `src/site.config.ts` with a
`phase` above 1, so switching one on is a page plus a one-word change.

A pillar story only gets a URL once its asset exists — a Build story needs a
real screenshot of something live, a Gear story needs a real photograph. Until
then the file is drafted and committed but generates no page. See **Publication
is a gate** below.

### The header holds five items

`Vibe Coding · Gear · Learn · Playground · About`, plus Subscribe as the one
filled pill. Guides, Use Cases, Videos, Prompts and Topics all keep the URLs
they had — they are reached from `/learn`, which is an index of the whole
library, and from the footer's second column, which lists every one of them.
That is what lets the ecosystem grow without the navigation growing with it.

The order lives in one place, `nav` in `src/site.config.ts`, and the header,
the mobile menu and the footer all read from it, so the three cannot drift.

### The homepage is in pillar order

    1. Hero
    2. Vibe Coding in the Real World      building with AI
    3. Gear — Currently Testing           using and testing technology
    4. Learn                              the gateway to the library
    5. Playground                         only what you can actually open
    6. About + Subscribe                  the close
    7. Footer

Every section collapses on its own. §2 and §3 are gated on real assets, §4
drops any surface with nothing published in that language, §5 lists only tools
a reader can open right now. With an empty content directory the homepage is a
hero, four honest lines and a close — which is the correct state, not a broken
one.

### Publication is a gate, not a schema rule

`src/lib/pillars.ts` draws a hard line between IMPLEMENTATION and PUBLICATION.
The system ships complete with zero real assets, and a missing asset only keeps
its OWN story unpublished:

| Pillar | Required before publication |
|---|---|
| Gear (`src/content/gear/`) | a real photograph — `photo` |
| Vibe Coding (`src/content/builds/`) | a real screenshot of something live — `heroShot` |

The check is at read time, not in the Zod schema, so a story missing its asset
is drafted, committed and reviewable — and invisible. It appears the moment the
asset lands, with no other change. Nothing is ever substituted, generated or
stubbed to fill the gap: no placeholder screenshot, no stock photograph, no
demo story standing in for a real one.

The same rule runs the featured slots. "Currently testing" and "Now building"
are claims about right now, so they are only made when something really is in
that state; otherwise the most recent story takes the slot carrying its own
honest label.

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

**All editorial content** is Markdown files under `src/content/`. Copy one,
rename it — the filename becomes the URL — and change the frontmatter. An
Arabic piece is always a SEPARATE file with `lang: ar` and `translationOf:`
naming the English slug; nothing is machine-translated, and a language only
ever shows content actually written in it.

| Folder | Becomes | What it is for | Template |
|---|---|---|---|
| `guides/` | `/guides/<slug>` | A technique, start to finish | copy an existing guide |
| `use-cases/` | `/use-cases/<slug>` | What happened when it met a real problem | `use-cases/gearnest.md` |
| `prompts/` | `/prompts/<slug>` | One reusable prompt, plus what it gets wrong | copy an existing prompt |
| `videos/` | `/videos/<slug>` | A video with chapters and takeaways | `videos/_template.md` |
| `articles/` | `/articles/<slug>` | Written to be read | `articles/_template.md` |
| `builds/` | `/vibe-coding/<slug>` | Making something with AI, in the open | `builds/_example-build.md` |
| `gear/` | `/gear/<category>/<slug>` | A testing journal entry — never a review | `gear/_example-fold.md` |
| `courses/` | *nothing yet* | Model only — no route, by design | `courses/_template.md` |

A file starting with `_` never publishes, so the templates are safe to leave in
place.

**The two pillars have one extra rule each.** A Gear story's headline is always
the QUESTION — `product` is a separate, quieter field — and there is no
rating, score, price, spec table or retailer field in the schema to put one in.
A Build story declares one `stage` from the frozen six (Idea · Explore · Design
· Build · Test · Launch) and the rail derives the rest, so it cannot contradict
itself. Neither publishes without its asset.

**Crossover** is earned, not automatic. Set `crossover:` on a Gear story to a
Build slug — or the reverse — ONLY when the device itself is what makes the
build possible. Each side then links to the other and states the relationship
in one line; neither retells the other's story, so the canonical text lives on
exactly one page.

**Series.** A piece joins the current build narrative by adding two lines of
frontmatter:

```yaml
series: vibe-coding
part: 3
```

It then appears on `/series/vibe-coding` in reading order, carries a series chip
on its own page, and shows up in the homepage band's count. Series themselves
are defined in `series` in `src/site.config.ts` — a question, a status and the
two languages. Vibe Coding is the flagship; "I ❤️ Tech" is still the master
brand expression above it, and starting a second series does not disturb either.

**The `[[term]]` marker works in Markdown too**, not only in `copy.ts` — an
Arabic guide can write `الـ[[prompt]]` and get the same bidi-isolated LTR run.
In an attribute (a title, a meta description, an alt) use `plain()` from
`src/copy.ts` instead; `Base.astro` already does this for every page head.

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
npm run qa       # sweep dist/ for broken links, hreflang, headings, alt text
npm run og       # regenerate the social share cards
```

`npm run qa` reads `dist/`, so build first. It checks every built page for
broken internal links, hreflang that points at a page that does not exist,
unrendered `[[term]]` markers, missing or duplicated `<h1>`, images without
`alt`, and links or buttons with no accessible name. It exits non-zero on any
of those, and reports `PLACEHOLDER` copy as a warning rather than an error —
those are deliberate and listed under Outstanding assets below.

There is also a browser pass, which needs a Chromium available to Playwright:

```bash
node scripts/qa-browser.mjs
```

It serves `dist/` and checks that Arabic pages genuinely lay out right-to-left
(computed direction, and the header logo actually on the right), that there is
no horizontal overflow at desktop or phone width, that the Prompt Library copy
button works and degrades honestly when the clipboard is refused, that the
newsletter still validates in both languages, and that the Playground, login
and profile routes still render.

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
- **Real YouTube video IDs.** Nothing has been published to `src/content/videos/`
  because no real ID exists to write up, and a page built on an invented ID
  renders a broken thumbnail and a dead link. `/videos` renders its designed
  empty state until the first one lands; `videos/_template.md` is ready to copy.
- **The About page's three paragraphs.**
- **The GearNest case study's three factual paragraphs** —
  `src/content/use-cases/gearnest.md` and its Arabic counterpart. The question,
  the framing and the rules of the test are written; what GearNest actually is,
  how much of it came out of Vibe Coding, and what it has cost are marked
  `PLACEHOLDER` because only Adel can answer them. Everything else on the page
  is finished.
