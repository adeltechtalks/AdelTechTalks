# Publishing

**One decision. Then write.**

---

## The only decision

| You are about to… | It goes in | Command |
|---|---|---|
| **teach** something | **Learn** | `npm run new learn "Title"` |
| give people something **reusable** | **Prompts** | `npm run new prompt "Title"` |
| show something you **made or tested** | **Builds** | `npm run new build "Title"` |

That is the whole model. Three pillars, three commands, and they are the same
three doors the reader sees on the homepage.

Everything else is a **topic**, a **format** or a **relationship** — never a
fourth pillar:

- **Vibe Coding, Vibe Designing, AI Workflows, Automation, Prompting** are
  topics inside Learn.
- **Videos** and **cheat sheets** are formats. A video is Learn, Prompts or
  Builds depending on what it is *doing* — "How context windows work" is Learn,
  "I automated my camera with AI" is a Build.
- **Gear** is not a Phase 1 pillar. Unboxings, reviews and comparisons belong to
  Gear Nests. When a device is part of an AI experiment here, that is a Build.

---

## Publish in three steps

```bash
npm run new learn "How context windows actually work"
```

1. **Write it.** The file it created has only required fields in it.
2. Change `draft: true` → `draft: false`.
3. **Commit to `main`.** Cloudflare builds and deploys.

`npm run dev` to see it at `http://localhost:4321` first.

---

## Extras

Everything after the title is a plain word, in any order. No `--flags`: `npm run`
eats those before the script sees them, which would drop a YouTube id silently.

```bash
npm run new learn  "My vibe coding workflow" dQw4w9WgXcQ   # 11-char YouTube id
npm run new learn  "Prompting cheat sheet"   cheatsheet     # or workflow / checklist
npm run new build  "Does this even work?"    experiment     # a question, not a launch
npm run new prompt "اسم بالعربي"              ar             # write it in Arabic
```

---

## What each pillar needs

Only these. Everything else has a working default, and the optional fields are
documented in each collection's `_template.md`.

| Pillar | Required |
|---|---|
| **Learn** — guide | `title` `description` `date` `topic` |
| **Learn** — video | `title` `description` `date` `topic` `youtubeId` |
| **Prompts** | `title` `description` `date` `prompt` `category` |
| **Builds** | `title` `description` `date` `question` |

**A build does not need a screenshot.** Publish the write-up; the frame renders
a designed empty screen. Add `heroShot: /images/…` later and the real one drops
into the same frame without moving anything.

**Arabic is never required.** Every surface filters by language, so an
English-only piece publishes cleanly and the `/ar/` side simply does not list
it. An Arabic version is a separate file with `lang: ar` and
`translationOf: <the-english-slug>`.

---

## Linking things together

The chain you want is **Video → Prompt → Learn resource → Build**, and it is
built out of two fields that already exist. There is no relationship engine and
nothing to register.

```yaml
# in a video
promptSlugs: ['spec-before-you-build']    # prompts used on screen

# in anything
related: ['canon-ai-workflow', 'spec-before-you-build']
```

`related` resolves across **every pillar** — guides, articles, videos, prompts,
use cases and builds — by bare slug, in either direction. So the Canon camera
example is:

```yaml
# src/content/builds/canon-ai-workflow.md
related: ['auto-cull-with-ai', 'canon-upload-cheatsheet', 'pick-the-keepers']

# src/content/videos/canon-ai-workflow-video.md
promptSlugs: ['pick-the-keepers']
related: ['canon-ai-workflow']
```

Write both ends when you want the link to work both ways — it is two lines, and
it is honest about which piece is actually pointing at which.

`crossover:` still links a Build to a Gear story and back, if a device story
already exists.

---

## Cheat sheets and downloads

A cheat sheet is a **guide with `format: cheatsheet`**, usually carrying a file:

```yaml
format: cheatsheet
download:
  label: 'The one-page version'
  href: /downloads/prompting.pdf
  meta: 'PDF · 1 page'
```

Put the file in `public/downloads/`. `/guides` groups by format, so it appears
under **Cheat sheets** on its own without a new route or a new hub.

> `download.gated` exists in the schema and **is not implemented yet** — nothing
> reads it, and a download renders as a plain link whatever it is set to. Leave
> it alone until the gated-resource work lands.

---

## Topics

`ai` · `automation` (reads as **AI Workflows**) · `vibe-coding` ·
`vibe-designing` · `prompting` · `building` · `product` · `tech` ·
`creator-tech`

A typo in `topic:` fails the build rather than producing an orphan page. Add a
new one in `topics` in `src/site.config.ts` **and** in `TOPICS` in
`src/content.config.ts` — both, or the build tells you.

---

## Where things live

```
src/content/guides/     Learn — tutorials, cheat sheets, workflows, checklists
src/content/videos/     Learn — a video that earns its own page
src/content/articles/   Learn — written to be read rather than followed
src/content/use-cases/  Learn — what happened when it met a real problem
src/content/prompts/    Prompts
src/content/builds/     Builds and experiments
src/content/gear/       Gear — routed, not in the navigation
src/content/courses/    Phase 2 — schema only, no route
```

Files starting with `_` never publish, which is what makes `_template.md` safe.

---

## Two switches that are not the same

- **`draft: true`** — nobody may read this. No page, no index, no sitemap.
- **`homepage: false`** — real, published, linkable work that is no longer what
  AdelTechTalks is about right now. Keeps its URL and its index entry; stops
  being promoted on the front page.
