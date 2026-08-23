# V3_INFORMATION_ARCHITECTURE

**Status:** proposal. Companion to `V3_PRODUCT_BLUEPRINT.md`.

---

## 1 · Navigation

```
AdelTechTalks   Learn   Prompts   Courses   Playground   Projects   What's New   About      [Login] [Join Free]
```

The lockup returns home — "Home" is not a nav item, it is the logo, exactly as in v2.x.

**Seven destinations plus two utility actions.** That is one more destination than v2.x carried and it is the practical ceiling; anything further goes inside Learn or Projects, never into the bar.

| item | menu | destination |
|---|---|---|
| Learn | yes — outcome paths + library | `/learn/` |
| Prompts | no | `/prompts/` |
| Courses | yes — when ≥2 published | `/courses/` |
| Playground | yes — when ≥2 experiences | `/playground/` |
| Projects | yes — Building now / Shipped / Experiments | `/projects/` |
| What's New | no | `/whats-new/` |
| About | no | `/about/` |
| Login | — | `/login/` |
| Join Free | — | `/join/` (filled CTA) |

**Menus keep the v2.x rule that earned its place:** every dropdown entry is gated on its destination having something behind it, and a pillar whose menu is empty renders as a plain link with no chevron. With an empty content directory the whole bar degrades to seven working links. This is `src/lib/nav-menus.ts`, extended — not rewritten.

Interaction is unchanged from the frozen v2.x spec: hover-intent plus click, 8px rise over 200ms, chevron rotates, full keyboard operation, Escape closes and returns focus, mobile is a full-screen accordion with one pillar open at a time and an ✕ burger.

### Arabic navigation

Same seven, same order, mirrored. Labels follow the frozen non-translated rule — `Prompts`, `Playground`, `Vibe Coding` stay Latin; `Learn`, `Projects`, `What's New`, `About`, `Join Free` take authored Arabic. **No Arabic label in this document is final:** every string must come from an authored Arabic source before it ships (`ARABIC_VOICE_GUIDE.md`). Placeholders are marked `‹author›` rather than guessed.

| EN | AR |
|---|---|
| Learn | `اتعلم` (authored, in use in v2.x) |
| Prompts | `Prompts` |
| Courses | ‹author› |
| Playground | `Playground` |
| Projects | ‹author› |
| What's New | ‹author› |
| About | `عنّي` (authored, in use in v2.x) |
| Join Free | ‹author› |

---

## 2 · Route tree

New routes are marked **NEW**. Everything unmarked exists today and keeps its URL.

```
/                                       Home
/about/                                 About (v2.x Storyboard, retained)
/join/                              NEW Join Free — account creation
/login/                                 Sign in
/account/                           NEW member dashboard (gated)
  /account/prompts/                 NEW saved prompts
  /account/achievements/            NEW earned badges
  /account/learning/            PHASE 2 progress
  /account/purchases/           PHASE 3 orders + billing portal link
  /account/profile/                 NEW display name, language, deletion

/learn/                                 Learn hub — outcome paths
  /learn/[path]/                    NEW e.g. /learn/get-better-at-prompting/
/guides/  /guides/[...slug]/            retained at top level (indexed)
/use-cases/  /use-cases/[...slug]/      retained at top level (indexed)
/videos/  /videos/[...slug]/            retained at top level (indexed)
/topics/  /topics/[topic]/              retained at top level (indexed)
/articles/[...slug]/                    retained

/prompts/  /prompts/[...slug]/          Prompt Library — promoted to nav
/resources/                         NEW free resource library
  /resources/[slug]/                NEW

/courses/                           NEW course index
  /courses/[slug]/                  NEW course landing
  /courses/[slug]/[lesson]/     PHASE 3 lesson player (gated)

/playground/                            Playground hub — rebuilt
  /playground/[experience]/             experience shell (v2.x tracks migrate in)
  /playground/passport/                 301 → /account/achievements/ (already a 301 today)

/projects/                          NEW build log index
  /projects/[slug]/                 NEW project page with update timeline

/whats-new/                         NEW interpretation feed
  /whats-new/[slug]/                NEW single item

/achievements/[verification-id]/    NEW public, crawlable, OG-carded
/badge/[id]/                            301 → /achievements/[id]/

/api/*                              NEW server endpoints (never prerendered)
/newsletter/  /contact/  /work-with-me/  /404/  /ask-index.json   retained
```

Arabic mirrors every route except the `ENGLISH_ONLY` set. v3 **adds** `/api`, `/account`, `/join` to that set (account UX and server endpoints are English-only at foundation) and **removes** `/playground` from it — Playground becomes bilingual, because a challenge platform that only speaks English contradicts the bilingual-first rule.

---

## 3 · Current → v3 route migration matrix

Legend: **KEEP** unchanged · **EVOLVE** same URL, new content/design · **301** permanent redirect · **NEW**

| current URL | v3 | disposition | notes |
|---|---|---|---|
| `/` | `/` | EVOLVE | new homepage narrative |
| `/ar/` | `/ar/` | EVOLVE | same |
| `/about/` `/ar/about/` | same | KEEP | Storyboard page shipped in v2.x; unchanged |
| `/learn/` `/ar/learn/` | same | EVOLVE | file-type gateway → outcome paths; library links retained |
| `/guides/` `/guides/[slug]/` | same | KEEP | indexed; **not** moved under `/learn/` — see §4 |
| `/use-cases/` + slug | same | KEEP | as above |
| `/videos/` + slug | same | KEEP | as above |
| `/topics/` `/topics/[topic]/` | same | KEEP | secondary discovery, as in v2.x |
| `/articles/[slug]/` | same | KEEP | |
| `/prompts/` + slug | same | EVOLVE | promoted to top-level nav; save-to-account added |
| `/vibe-coding/` | `/projects/` | **301** | pillar becomes the build log |
| `/vibe-coding/[slug]/` | `/projects/[slug]/` | **301** | slug preserved 1:1 |
| `/ar/vibe-coding/*` | `/ar/projects/*` | **301** | |
| `/gear/` | `/projects/` | **301** | pillar leaves the product |
| `/gear/[category]/[slug]/` | `/projects/` | **301** | **zero gear stories were ever published — no article URL is lost** |
| `/series/[series]/` | `/projects/` | **301 (deferred)** | holds real indexed content; redirect only once every entry has a Project home |
| `/playground/` | same | EVOLVE | hub rebuilt; becomes bilingual |
| `/playground/[slug]/` | same | EVOLVE | v2.x tracks become Playground experiences at the same URLs |
| `/playground/passport/` | `/account/achievements/` | **301** | already a 301 today; re-pointed |
| `/badge/[id]/` | `/achievements/[id]/` | **301** | **old links must keep working — they are on LinkedIn** |
| `/login/` | same | EVOLVE | + email link sign-in beside Google |
| `/profile/` | `/account/` | **301** | becomes the dashboard shell |
| `/newsletter/` `/ar/newsletter/` | same | KEEP | newsletter stays a distinct, separate ask |
| `/contact/` `/work-with-me/` | same | KEEP | out of v3 scope |
| `/404/` `/ask-index.json` | same | KEEP | |

### Redirect implementation

Cloudflare Workers serves `dist/` with a `_routes.json`. Redirects go in a `public/_redirects` file (supported by the Cloudflare adapter), **not** in per-page meta refreshes:

```
/vibe-coding            /projects              301
/vibe-coding/*          /projects/:splat       301
/ar/vibe-coding         /ar/projects           301
/ar/vibe-coding/*       /ar/projects/:splat    301
/gear                   /projects              301
/gear/*                 /projects              301
/ar/gear                /ar/projects           301
/ar/gear/*              /ar/projects           301
/badge/*                /achievements/:splat   301
/profile                /account               301
/playground/passport    /account/achievements  301
```

Rules: every redirect is **301** (permanent — these are IA decisions, not experiments); every one is added with its Arabic twin in the same commit; and a redirect is only written once its destination exists and renders. A redirect chain is never more than one hop.

---

## 4 · Two IA decisions that need stating, because the obvious move is wrong

**The library does not move under `/learn/`.**
`/learn/guides/` reads better in a sitemap. It is also a mass rename of every indexed editorial URL on the site, in two languages, to buy a tidier path segment. `/learn/` is already a *gateway* in v2.x and works perfectly well as one; v3 makes it route by outcome instead of by file type. The library keeps its addresses. No redirect, no ranking risk, no duplicate-content window.

**`/gear/*` redirects rather than 410s.**
The pillar leaves the product, but the URLs were live and linked. A 301 to `/projects/` preserves whatever authority accumulated and lands the visitor on the nearest honest answer ("here is technology inside real work"). Because no gear *story* ever published, this costs nothing in lost content — the only page with a real body was the hub.

---

## 5 · Homepage composition

Order is the narrative, and it runs from "who is this" to "what will I do".

| # | section | collapse rule |
|---|---|---|
| 1 | **Hero** — I build with AI, test new tech, and teach what actually works | never |
| 2 | **Now** — Now Building / Now Exploring / Now Testing | hides any strip with no live entry; hides entirely with none |
| 3 | **What I'm Building** — visual build log, active projects | hides below 1 project |
| 4 | **Learn With Me** — outcome rails | hides a rail with no content behind it |
| 5 | **Learn by Playing** — an inline challenge, playable in place | hides with no live challenge |
| 6 | **Prompt Library** — "Prompts I actually use" | hides below 3 published prompts |
| 7 | **What's New** — what changed / why it matters / Adel's take / try it | hides below 1 item |
| 8 | **Free Resources** | hides below 2 resources |
| 9 | **Featured Courses** | hides below 1 published course |
| 10 | **Tech I'm Testing** — inside use cases, never a review card | hides with none |
| 11 | **Join Free** — membership CTA, newsletter as the secondary ask | never |
| 12 | Footer | never |

Eleven sections is a long page. It is a *narrative* page and each section earns its place by being a different kind of thing — but the collapse rules matter more here than anywhere in v2.x: at foundation launch, with Courses and Resources empty, the page renders 1–6, 7, 11, 12 and reads as complete rather than as a skeleton. **The page must be verified in its empty state before its full state.**

### Hero

Adel is visually dominant — real photography, the largest element on the screen. The positioning line carries the message; "I ❤️ Tech" remains the brand expression and the Signature Blue SVG heart is unchanged.

Two actions: **Start Learning** (primary → `/learn/`) and **See What I'm Building** (secondary → `/projects/`). CS-05 holds: one primary action on the page.

The **Now** modules are data, not decoration — they read from the Projects collection and the What's New feed, and each links to the thing it names. A Now module with nothing live does not render a placeholder; it is absent. "Now Building" claiming a project that has not been updated in 60 days is a lie the system should not be able to tell, so staleness hides it.

### Learn With Me — outcome rails

Six outcomes at launch, each a real path with real content behind it:

`Get Better at Prompting` · `Build a Website` · `Vibe Code a Product` · `Design with AI` · `Automate My Work` · `Build a Business with AI`

A path is a curated ordered list of existing library items plus, later, course lessons. **A path with fewer than two items does not render** — an outcome promising one guide is worse than an outcome not offered.

### Learn by Playing

One challenge, embedded and playable without leaving the page: *"Can you turn this weak prompt into a 90+ prompt?"* Anonymous play is allowed and scored; saving the score, earning XP and keeping the badge require an account. That is the conversion mechanic, and it converts because the visitor has already done the work.

### What's New — the editorial structure is the component

Four slots, always in this order, never free prose: **What changed · Why it matters · Adel's take · Try it**. "Adel's take" is the differentiator and is mandatory — an item without it is not publishable. "Try it" links to a prompt, a challenge, or a guide.

---

## 6 · SEO continuity

Non-negotiable, carried from v2.x and verified in production at every release:

- Every retained URL keeps its canonical.
- `hreflang` pairs on every bilingual route, `x-default` → English; a route with no counterpart advertises only itself.
- Sitemap keeps the `i18n` config and the empty-index filter; new sections join it as they gain content.
- `/account/*`, `/join/`, `/api/*` are `noindex` and excluded from the sitemap.
- `/achievements/[id]` **is** indexable — that is the point of it — and server-rendered so crawlers see the name and badge without JavaScript, exactly as `/badge/[id]` does today.
- Redirects are 301, single-hop, added in the same commit as their Arabic twin.
- Global metadata continues to lead with `AdelTechTalks — I ❤️ Tech`. Role and employer remain confined to the About professional module and are barred from every `<head>` on the site.
