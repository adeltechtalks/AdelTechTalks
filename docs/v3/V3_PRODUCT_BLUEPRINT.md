# V3_PRODUCT_BLUEPRINT

**Status:** proposal, for approval. **Revised in v3.1** (§2, §7, new §8) and
**in v3.2** (§1 — the creator dimension; see `V3_2_IA_MEDIA_PATCH.md`).
Nothing in this document is implemented.
**Baseline:** v2.x at `7bb4b45`, live on `https://adeltechtalks.com`. Frozen and stable.
**Branch:** `claude/adeltechtalk-final-design-4nc4fr` (v3 working branch, cut from `main` after the v2.x merge). `main` is untouched.

---

## 1 · What AdelTechTalks becomes

v2.x is a well-built **personal content site**: two pillars, a library, a bench of small tools. It answers "what has Adel written?"

v3 is a **personal media and practical-AI-education product**. It answers "what can I learn to do, with Adel, this week?"

The positioning line is the whole brief:

> **I build with AI, test new tech, and teach what actually works.**

Three clauses, three obligations, and every surface in v3 has to be traceable to one of them:

| clause | obligation | primary surface |
|---|---|---|
| I build with AI | show real work in progress, publicly | **Builds** (build log) |
| I test new tech | interpret what is new, in real workflows and in the real world | **Now** — takes, experiences, tools |
| teach what actually works | make people able to do the thing | **Learn · Prompt Lab · Playground** |

**The fourth thing, added in v3.2: Adel the creator.** The three clauses above
describe what Adel does; they do not describe that he *publishes constantly* —
videos, shorts, observations, technology encountered outside the studio. The v3
design represented the builder and the teacher well and left the creator almost
invisible, so a visitor could not tell whether the site was alive this week.

The correction is the **media layer** on the homepage and the **Now** stream
behind it (`V3_2_IA_MEDIA_PATCH.md` §3). AdelTechTalks is not only an education
platform: it is the living digital home of Adel's work, learning, media and
experiments — **Creator + Builder + Teacher + Tech Explorer** — without becoming
a gadget-review site.

Adel is the product and the trust layer. The platform is the delivery mechanism. If a surface could be lifted onto a generic AI-course site without loss, it is wrong.

### The three shifts from v2.x

1. **From reading to doing.** v2.x publishes; v3 also *runs* — challenges, tools, progress, XP. The Playground stops being a bench of curiosities and becomes a first-class product area.
2. **From content types to outcomes.** v2.x's Learn gateway is organised by file type (Guides, Use Cases, Videos, Prompts, Topics). v3 organises by what the reader wants to be able to do ("Build a website", "Automate my work"). The file types survive as the *substrate*, not the menu.
3. **From audience to membership.** v2.x has an email list. v3 has an account: saved prompts, tracked progress, earned badges, purchased courses. The newsletter remains, and remains separate.

### What AdelTechTalks is NOT

- **Not a gadget review site.** Unboxings, spec tables, scored reviews and buying guides are out of scope. Technology appears only inside a real workflow or story: "what did this let me do?" This survives v3.2 unchanged: **Out in Tech** is Adel *experiencing* technology in the real world — a store, an event, an installation — and it carries the same schema-level protection the `gear` collection already has: no rating, no score, no price, no retailer link, no spec table, and no field to put one in.
- **Not Gear Nests.** Gear Nests is a separate brand and business. On AdelTechTalks it may appear *only* as a Project, a build-in-public case study, or a teaching example. It is never a section, never navigation, never a default feature. This is the same rule v2.x already enforces (`homepage: false` on the case study, zero template dependencies) and v3 inherits it unchanged.
- **Not a generic AI startup or course marketplace.** The design must be unmistakably Adel: warm light, graphite, Signature Blue, real photography of a real person, "I ❤️ Tech". No purple gradient mesh, no abstract neural-network hero, no stock founder.

---

## 2 · Learning philosophy, made structural

Two loops, and they are not decoration — they are the information architecture.

**The narrative: BUILD → PLAY → LEARN → SHIP** *(reframed in v3.1)*

The v3 draft ran *Learn → Play → Build → Ship*. That is the order a curriculum
designer writes and it is not the order a visitor experiences. A stranger arrives
because Adel builds things; the first interesting thing they can do is try one;
only then does a reading list mean anything.

| act | whose | surface | what changes for the visitor |
|---|---|---|---|
| **BUILD** | Adel's | Projects, Now, What's New | *"This person actually makes things."* Credibility, before any ask. |
| **PLAY** | the visitor's | Prompt Arena, the inline challenge | *"I just did something."* The first act of participation, no account. |
| **LEARN** | the visitor's | Learn paths, Prompts, Guides, Courses | *"Now I want the method."* Reading has a reason. |
| **SHIP** | the visitor's | Resources, Achievements, membership | *"I have something to show."* Proof, and a reason to return. |

The four acts are the homepage order (`V3_INFORMATION_ARCHITECTURE.md` §5), the
motion identity (`V3_MOTION_SYSTEM.md` §2.5), and the argument the site makes. The
learner still ends up learning; they just are not asked to read first.

**The reason the reorder matters more than it sounds:** the brief's other
correction is that Playground is a product, not a bench. A product that appears
below the fold at position 5, after four reading sections, is a bench with better
copy. Moving PLAY to the second act is what makes the rest of the claim true.

**Adel's supply loop, unchanged: Build → Test → Learn → Teach → Package**

This is the *supply* side, and it is why the content is credible: nothing is taught that was not first built and broken. Every Course traces back to a Project. Every Prompt traces back to a real session. The Content OS (`V3_CONTENT_OS.md`) is the machinery of this loop.

The two loops meet at Projects: Adel's Build is the visitor's first act of trust,
and the source of everything they later learn.

---

## 3 · The v3 surface map

Eight destinations. Each has one job and one sentence.

| surface | job | one sentence to a visitor |
|---|---|---|
| **Home** | orient and commit | "Here is what I'm building, and here is where you start." |
| **Learn** | route by outcome | "What do you want to be able to do?" |
| **Prompts** | give away the working tools | "Prompts I actually use." |
| **Courses** | small paid outcomes | "Finish this and you will have shipped X." |
| **Playground** | learn by doing — **a real product, launched with a real challenge set** | "Don't read about it — try it." |
| **Projects** | proof and narrative | "Watch me build it, including the parts that broke." |
| **What's New** | interpretation, not news | "This changed. Here's whether it matters." |
| **About** | the trust layer | "Who is saying all this." |

Utility: **Login** and **Join Free**. Join Free is the conversion goal on every page; the newsletter is a separate, smaller ask.

Full route tree, redirects and the current→v3 migration matrix: `V3_INFORMATION_ARCHITECTURE.md`.

---

## 4 · The current production baseline, documented

This is what v3 is being built on top of. Everything here works today and is in production.

### 4.1 Runtime and deployment

| | |
|---|---|
| Framework | Astro 5.18, `output: 'static'` |
| Adapter | `@astrojs/cloudflare` 12.6, `imageService: 'compile'` |
| Hosting | Cloudflare Workers, Worker name `adeltechtalks-sites`, config declared in `site/wrangler.jsonc` |
| Server entry | `dist/_worker.js/index.js` — reached only by routes that opt out of prerendering |
| Server routes today | exactly one: `/badge/[id]` (`prerender = false`), because LinkedIn's crawler does not run JavaScript |
| Build | `astro build && node scripts/postbuild.mjs` |
| Deploy trigger | Cloudflare's own Git integration on push to `main`. There is **no** GitHub Actions workflow in the repo. Observed cutover latency at the v2.x merge: ~6 minutes. |
| Sessions | Cloudflare KV binding `SESSION` |

**This static-first model is a v3 asset, not a constraint to escape.** See `V3_IMPLEMENTATION_PLAN.md` §"Runtime decision".

### 4.2 Routes (49 source routes, 52 built pages)

Public, English, all live: `/`, `/about/`, `/learn/`, `/newsletter/`, `/contact/`, `/work-with-me/`, `/404/`, `/guides/` + `[...slug]`, `/articles/[...slug]`, `/use-cases/` + `[...slug]`, `/prompts/` + `[...slug]`, `/videos/` + `[...slug]`, `/topics/` + `[topic]`, `/series/[series]`, `/vibe-coding/` + `[slug]`, `/gear/` + `[category]/[slug]`, `/playground/` + `[slug]` + `/passport`, `/login/`, `/profile/`, `/badge/[id]`, `/ask-index.json`.

Arabic mirrors exist for every route except the English-only set (`ENGLISH_ONLY` in `src/i18n/index.ts`): `/playground`, `/login`, `/profile`, `/work-with-me`, `/contact`, `/badge`.

### 4.3 Content model — Astro content collections, files in git

Eight collections, all spreading a shared `editorial` base (`src/content.config.ts`):

`guides` · `articles` · `useCases` · `prompts` · `videos` · `courses` (schema only, deliberately unrouted) · `gear` · `builds`

Shared `editorial` fields: `title, description, date, updated, lang, translationOf, topic, pillar (deprecated), tags, series, part, access, cover, coverAlt, preview, minutes, featured, draft, homepage, related, campaign`.

Two publication gates, both read-time rather than schema-level, so an unfinished piece is committable and reviewable but invisible:
- a **Gear** story needs a real photograph
- a **Build** story needs a real hero screenshot

Two visibility flags, answering different questions:
- `draft: true` — nobody may read it; off its index, out of the sitemap
- `homepage: false` — published and linkable, but no longer current; excluded from the homepage Latest feed

**There is no CMS and no second database for editorial content.** Supabase holds user data only. This separation is deliberate and v3 keeps it.

### 4.4 Authentication

Supabase Auth, Google OAuth. Client-side only: `src/lib/playground.ts` creates the browser client, and `AuthNav.astro` plus the header script read the `sb-{ref}-auth-token` key out of `localStorage` to decide whether to show "Sign in" or "Your profile". `/login/` and `/profile/` are static pages that hydrate.

**There is no server-side session verification anywhere today.** Nothing needs it yet — no page gates content. v3 changes that, and `V3_SECURITY_MODEL.md` treats it as the single most important upgrade.

### 4.5 Supabase — four tables, all with RLS enabled

| table | purpose | RLS |
|---|---|---|
| `progress` | `(user_id, track_slug, step_index)` — Playground steps ticked | own rows only, `for all to authenticated` |
| `badges` | `(user_id, track_slug, earned_at)` — Playground track badges | own rows only |
| `shares` | public badge share records: `id, user_id, track_slug, display_name, earned_at` | **public select**, owner insert/delete |
| `subscribers` | newsletter list + consent + attribution | insert-only for anon; no public read |

`shares` is the existing precedent for the v3 achievement-verification pattern: a deliberately public projection holding only what belongs on a public page, with the private table untouched beside it. v3 generalises exactly this design.

### 4.6 Styling and design system

Token layers in `src/styles/tokens/` — `base, colors, typography, spacing, elevation, motion, fonts, adel-v2, adel-type, bridge-v2, legacy-att` — composed by `app.css`. Roughly 90 `--adel-*` semantic tokens over the CS v2.0 palette.

Palette: Signature Blue `#2563EB`, Deep `#1746A2`, Ice `#DCEBFF`, Fresh Mint `#2DD4A8` (3% ceiling, "happening now" only), Graphite `#171A1F`, Slate `#667085`, Warm White `#FAFAF8`, Soft Gray `#E6E8EC`. No gradients. Liquid Glass budget 10–15%, currently spent on the header and the hero chip.

Type: Montserrat (Latin display) · KO Ghorab (Arabic display, self-hosted, single weight, never below 24px) · Readex Pro (Arabic body + Latin-inside-Arabic) · JetBrains Mono (technical) · Caveat (About sketch layer, English only).

Motion charter, frozen: ~300ms reveal, 70ms stagger capped at 8 steps, no looping decorative motion, `prefers-reduced-motion` renders everything static and fully visible.

### 4.7 Localisation

English keeps bare paths; Arabic is prefixed `/ar/*`. `src/i18n/index.ts` owns `localizePath`, `neutralPath`, `alternates`, `isEnglishOnly`. `src/copy.ts` is a single typed `Copy` interface with two complete implementations — **English and Arabic are separately authored siblings, never translations** (`ARABIC_VOICE_GUIDE.md`, frozen). `Rich.astro` renders `[[term]]` as bidi-isolated LTR runs and `**bold**` as emphasis.

Arabic typography is protected by an automated guard in `scripts/qa-browser.mjs`: any element computing to the KO Ghorab stack must be weight 400, ≥24px and untracked, on 13 Arabic routes.

### 4.8 QA infrastructure — inherited and extended by v3

| tool | covers |
|---|---|
| `npm run qa` (`scripts/qa.mjs`) | static sweep of the built output, 52 pages — undefined CSS tokens, structural rules |
| `scripts/qa-browser.mjs` | 113 live browser checks: every route loads clean, RTL, prompt copy + clipboard, newsletter validation both languages, mobile nav, homepage section order, hub overflow desktop+mobile, **nav dropdowns and accordion**, **reduced-motion fallback**, **Arabic display typography** |
| `scripts/postbuild.mjs` | post-build fixups |
| `scripts/build-og*.mjs` | branded share cards, generated from tokens |

v3 adds to this suite rather than replacing it. See `V3_IMPLEMENTATION_PLAN.md` §QA.

---

## 5 · The membership proposition

Free membership is the primary conversion, and it must be worth taking on day one — not a promise of future value.

**At v3 foundation launch, a free account gets:** saved prompts, XP and level, earned badges, a public achievement page, and challenge history.

**Later phases add:** course purchases, resource downloads, learning progress, workshop access, community.

The member journey, and the consent boundary:

```
Visitor → Email Subscriber → Free Member → Course Buyer → Workshop Attendee → Community Member
```

**Newsletter consent is separate from account creation and from product access, in both directions.** Creating an account does not subscribe anyone. Subscribing does not create an account. Buying a course does not subscribe anyone. The `subscribers` table stays independent of `profiles`, joined only by email when a person is genuinely both — this is already how v2.x behaves and it is a deliberate legal and ethical boundary, not an implementation detail.

---

## 6 · What is retained, evolved, deprecated, removed

Component-level detail is in `V3_IMPLEMENTATION_PLAN.md` §"Component audit". At the product level:

**Retained unchanged**
Astro + Cloudflare static-first deployment · Supabase Auth and the four existing tables · the file-based content model and its two publication gates · the bilingual system and the Arabic authored-copy rule · the token architecture · the motion charter · the QA suite · every currently indexed URL.

**Evolved**
Design system v2.1 → v3 (additive: new component families, no palette break) · Learn from file-type gateway to outcome routing · Playground from a quiz bench to a challenge platform · badges from a single Playground-track table to a catalogue + awards + verifications · `/vibe-coding` → `/projects` with wider scope · the newsletter block into a membership CTA that also offers the newsletter.

**Deprecated (kept live, no longer developed)**
`/gear/*` — the pillar leaves the product. Zero gear stories were ever published, so **no article URL is lost**; the hub redirects. The `gear` collection and its templates stay in the repo, unrouted, exactly as `courses` did in v2.x.
`/series/[series]` — superseded by Projects, kept for the URLs it holds.
`/work-with-me`, `/contact` — untouched, out of v3 scope.

**Removed**
Dead v1.1 homepage components already unreferenced (`Explore`, `SeriesBand`, `Videos`, `GuidesStrip`, `PromptTeaser`, `SignOff`) — confirmed unused before deletion, in a standalone commit.

---

## 7 · Non-negotiables carried forward from v2.x

These survived two design freezes and they survive this one:

1. **Nothing fake, ever.** No fabricated builds, screenshots, product photography, reviews, subscriber counts, testimonials, ratings, or "live" claims about tools that do not open. Missing assets are publication gates, never implementation blockers: the system ships complete and the individual piece stays unpublished.
2. **Empty is a designed state, and v3.1 names three of them.** Every surface has an honest state and collapses gracefully. The site must be correct with an empty content directory. See §8 — *Live*, *Preview* and *Absent* are different things and conflating them is how "coming soon" becomes a lie.
3. **Internal editorial rules are not visitor copy.** The reader experiences the structure; they never read its documentation.
4. **Arabic is authored, never translated.** EN and AR are siblings sharing intent and facts, not sentence structure.
5. **Reduced motion means static and fully visible.**
6. **Tokens only.** No hard-coded colour or font in a component.
7. **Nothing a client asserts is treated as proof** *(v3.1)*. XP, scores, levels, badge awards, completions and public verifications are issued by the server against records the server wrote. `V3_SECURITY_MODEL.md` §5.1.

---

## 8 · Launch state — how v3 communicates the vision without faking it *(new in v3.1)*

The brief asks for two things that pull against each other: launch honestly, and
still show what this is going to be. The resolution is not to blur them. It is to
name three states and never let one wear another's clothes.

| state | what it means | what it looks like | when it is allowed |
|---|---|---|---|
| **Live** | the thing exists and works | the real component, full behaviour | always |
| **Preview** | the thing is designed, named and genuinely committed, and is not open | a labelled, **non-interactive** card that says what it will be and what opens it | only against a real commitment |
| **Absent** | nothing real, nothing committed | the section collapses; no placeholder, no skeleton | the default |

**The rules that keep Preview honest:**

1. A preview card is **never clickable into an empty page.** It has no link, or it
   links to the thing it depends on ("opens after the first Vibe Coding course" →
   the course).
2. It **never carries a fabricated date.** "Q3" invented to look confident is a
   fake claim about the future. A preview states its *condition*, not its date,
   unless the date is real.
3. A section may hold **at most one** preview card among live ones. A section that
   would be all preview is **Absent** instead — a grid of promises is a skeleton
   with adjectives.
4. Preview never appears above the fold, and never in the Hero.
5. Preview copy is written by Adel, in both languages, like any other copy. A
   preview card with `‹author›` Arabic does not render in Arabic.

**What this means concretely at foundation launch:**

- **Prompt Arena is Live**, with nine real challenges, or Playground does not open
  at all. It is never Preview. (`V3_GAMIFICATION.md` §7.1.)
- The other Playground experiences are **Preview**, each naming the course or
  project that opens it.
- **Courses and Resources are Absent.** No "coming soon" course cards.
- The homepage **achievements wall is Absent** until at least three real public
  verifications exist. It is never seeded with examples, and there is no
  demonstration data anywhere in the system.
- Counts, ranks, "X learners" and "most popular" do not appear at launch, because
  none of them would be true, and a number that becomes true later is not an
  excuse to print it early.

The empty homepage is verified **before** the full one — that gate is inherited
from the v3 plan and it is what makes all of the above testable rather than
aspirational.
