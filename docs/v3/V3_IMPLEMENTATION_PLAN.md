# V3_IMPLEMENTATION_PLAN

**Status:** proposal. This is the document that has to be right before any production-facing code is written.

---

## 1 · Runtime decision

**Keep `output: 'static'` and opt individual routes out of prerendering.** Do not switch the site to SSR.

v2.x is static with exactly one server route. v3 needs perhaps a dozen. The instinct is to flip to `output: 'server'` and stop thinking about it; the cost is that every marketing and editorial page — which is most of the site, and all of the indexed part — stops being a CDN file and starts being a Worker invocation. Slower, more expensive, and a much larger blast radius when the Worker has a bad day.

```
static (CDN)     /  /learn  /prompts  /projects  /whats-new  /courses (index)
                 /about  /guides/*  /use-cases/*  /videos/*  /topics/*
                 /playground  /playground/[experience]

prerender=false  /account/*            session-gated
                 /courses/*/[lesson]   entitlement-gated
                 /achievements/[id]    crawler needs the HTML
                 /badge/[id]           existing, unchanged
                 /api/*                everything privileged
```

This is the same pattern `/badge/[id]` already proves in production, applied more widely. It also means the deployment model, `wrangler.jsonc` and the Cloudflare integration are unchanged — the highest-risk part of the stack is not touched.

---

## 2 · Component audit

### Keep unchanged

`Logo` · `LoveTech` · `PillarIcon` · `Icon` · `Rich` · `Button` · `Chip` · `Card` · `StatusPill` · `NewsletterForm` · `AuthNav` · `AdelLogo` · `ArabicDisplayFont` · `OriginFrame` · all seven `editorial/*` · `ia/JourneyRail` · `ia/BrowserFrame` · `ia/WorkspaceFrame` · `ia/StoryRow` · `about/Sketch` · `about/Annotation` · `pages/AboutPage` · `pages/EntryPage` · `pages/PromptPage` · `pages/VideoPage` · `pages/GuidesIndexPage` · `pages/UseCasesIndexPage` · `pages/VideosIndexPage` · `pages/TopicsPage` · `pages/TopicPage` · `pages/NewsletterPage`

### Evolve

| component | change |
|---|---|
| `Header` | seven-item IA; XP/level indicator when signed in; Join Free CTA |
| `Footer` | new column contents; unchanged structure |
| `Badge` | closed set extended with the v3 content types |
| `pages/HomePage` | recomposed to the eleven-section narrative |
| `home/Hero` | positioning line, Now modules, two actions |
| `home/Exploring` | becomes the **Now** trio, reading live project/feed data instead of static copy |
| `home/Latest` | becomes **What's New**, four-slot editorial structure |
| `home/LearnSection` | outcome rails instead of file-type rows |
| `home/PlaygroundSection` | inline playable challenge |
| `home/AboutSubscribe` | membership CTA, newsletter as the secondary ask |
| `pages/LearnPage` | outcome paths |
| `pages/PromptsIndexPage`, `pages/PromptPage` | save-to-account |
| `pages/VibeCodingHub` → `pages/ProjectsIndex` | wider scope, build log |
| `pages/BuildStory` → `pages/ProjectPage` | update timeline |
| `pages/SeriesPage` | frozen; kept for its URLs until Projects covers them |
| `lib/nav-menus` | extended for the new sections |
| `lib/badges` | content badges stay; gamification badges are a **separate** module — same word, different concept, and merging them would be the `badges` table collision all over again in TypeScript |

### Deprecate — kept in the repo, unrouted

`pages/GearHub` · `pages/GearStory` · `home/GearSection` · the `gear` collection and its `lib/pillars` gear half. Precedent: v2.x kept the `courses` collection schema unrouted for a whole release. No files are deleted; the routes redirect.

### Remove — dead code, confirmed unreferenced

`home/Explore` · `home/SeriesBand` · `home/Videos` · `home/GuidesStrip` · `home/PromptTeaser` · `home/SignOff`

All six are v1.1 homepage strips with zero importers today. Verified with a grep across `src/`, removed in a standalone commit so the deletion is reviewable on its own.

### New

**Core:** `Tabs` `Accordion` `Dialog` `Toast` `Menu` `Avatar` `EmptyState` `Input` `Select` `Checkbox` `Switch` `FieldGroup`
**Learning:** `CourseCard` `LessonCard` `LearningPath` `ProgressBar` `PromptCard` `ResourceCard` `ChallengeCard` `QuizState` `CompletionState`
**Gamification:** `XPIndicator` `XPGain` `Level` `LevelProgress` `BadgeMedallion` `Achievement` `Streak` `ChallengeComplete`
**Project:** `BuildCard` `BuildTimeline` `BuildStatus` `ExperimentCard` `LatestUpdate`
**What's New:** `WhatsNewCard` `WhatsNewEntry`
**Server:** `src/server/{auth,entitlements,xp,badges,scoring,stripe,storage}.ts`

---

## 3 · Content model additions

Four new collections, all spreading the existing `editorial` base:

```
projects      status, started, shipped_at, stack[], repo, live_url,
              cover, screenshots[], skill, updates[] (dated)
whatsNew      what_changed, why_it_matters, adels_take (REQUIRED),
              try_it {label, href}, source_url, source_date
resources     type, format, file (private path), access, preview
experiences   skill, formats[], status, challenges[] (slug, format,
              payload, rubric, rubric_version, xp)
```

`courses` already exists as a schema and gains `stripe_price_id`, `outcome`, `skill`, `modules[]`.

`whatsNew.adels_take` is **required by the Zod schema**. A What's New item without Adel's opinion is a news aggregator post, and the schema is the cheapest place to make that impossible.

---

## 4 · Phases

### Phase 0 — foundations, no visible change
Migrations 01–05 on a Supabase branch · `src/server/*` with session verification · rate limiting · the `entitlements` resolver against an empty table · CI secret grep · RLS assertion tests. **Nothing user-visible ships.** Verify the site is byte-identical.

### Phase 1 — Design System v3
New tokens, new component families, Figma library. Built in isolation, verified against v2.x pages for zero visual change. Motion tiers 1–3 formalised, 4–5 built.

### Phase 2 — the v3 foundation release *(the first thing a visitor sees)*
New IA and navigation · redesigned homepage · Learn outcome paths · Prompts with save-to-account · Projects (with `/vibe-coding` redirects) · What's New · Playground shell with one real challenge · Join Free and `/account` · XP, levels, badges, `/achievements/[id]` with OG cards · `/gear` redirects · initial social templates.

### Phase 3 — commerce
Migration 06 · Stripe Checkout and Portal · webhook · course engine and lesson player · protected downloads · purchases in the dashboard.

### Phase 4 — depth
Prompt Arena full challenge set · model-assisted Create scoring · workshops · richer dashboard · Content OS phases 2–3 · community.

**Phase 2 is the release that matters and it is large.** It can be split behind a flag: ship the new IA and homepage first, then Playground and gamification two weeks later. The redirects must land with the IA, in the same deploy.

---

## 5 · Risks

| # | risk | severity | mitigation |
|---|---|---|---|
| 1 | **`shares` → view migration breaks live LinkedIn links** | **critical** | strict sequence in `03_achievements.sql`; verify counts before the swap; test a known id in production immediately after; rollback is one `create table as select` |
| 2 | **Client-only auth mistaken for a gate** | **critical** | every gated route calls `requireUser` server-side; `localStorage` reads are labelled in code as presentation-only |
| 3 | **Entitlement bypass via client redirect** | **critical** | webhook-only grants; the success page polls and says so |
| 4 | Secret leaked into the client bundle | critical | `src/server/` import boundary + CI grep of `dist/` |
| 5 | XP double-award | high | mandatory idempotency keys; rebuild-from-ledger test in CI |
| 6 | SEO loss from IA changes | high | library keeps its URLs; 301s single-hop with Arabic twins; production canonical/hreflang/sitemap checks per release |
| 7 | **Scope: Phase 2 is very large** | high | flag-split into IA+homepage, then Playground+gamification |
| 8 | Homepage feels empty at launch | medium | eleven collapse rules; **the empty state is verified before the full state** |
| 9 | Arabic drifts as surface area grows | medium | `‹author›` placeholders block release; the typography guard extends to every new route |
| 10 | Motion tanks performance | medium | transform/opacity only; 3-element budget; 4× CPU throttle test |
| 11 | Gamification reads as gimmick | medium | no confetti, no streak pressure, no fake numbers |
| 12 | Cloudflare Worker cold starts on gated routes | low | gated routes are few and post-login; static pages never touch the Worker |
| 13 | Rebuilding Playground breaks existing badges | medium | migration 02 backfills every earned track badge into `user_badges` |

---

## 6 · Dependencies

**New runtime:** `stripe` (server only) · `@supabase/ssr` (server session) — two packages.
**Not added:** no UI framework, no CSS framework, no state library, no animation library. Motion is CSS and the Web Animations API. The v2.x stack is deliberately small and v3 does not change that.
**External:** Stripe account with webhook endpoint and products · Supabase private storage bucket · Cloudflare secret bindings · Google Fonts (Caveat already added).
**Human:** authored Arabic for every new string · real project screenshots · real course content · the first challenge set. **These are publication gates, never implementation blockers** — the system ships complete and each piece publishes when its content is real.

---

## 7 · QA plan

Extends the existing suite. Nothing is replaced.

| layer | tool | v3 additions |
|---|---|---|
| static sweep | `npm run qa` | hard-coded hex detection; orphaned content-slug detection against live user rows |
| browser | `scripts/qa-browser.mjs` (113 today) | new routes load clean; Playground challenge flow; XP/badge live-region announcements; achievement page renders without JS; account redirects when signed out; reduced motion on every new route; Arabic typography guard on every new Arabic route; overflow desktop+mobile on all new surfaces |
| database | new | RLS assertion per table (auth as A, assert cannot read B); `rebuild_xp` against a snapshot |
| security | new | secret grep of `dist/`; redirect validation unit tests; webhook invalid-signature and duplicate-event tests; download without entitlement fails closed |
| commerce | new | Stripe test-mode end-to-end: checkout → webhook → entitlement → access; refund → revoke |
| performance | new | Lighthouse budget on `/`; 4× CPU throttle for motion; LCP unaffected by hero animation |
| production smoke | extend the v2.x script | routes 200; metadata; no role/employer in any `<head>`; redirects resolve single-hop; `/badge/[id]` still resolves post-migration |

**Two release gates that are not negotiable:**
1. The homepage is verified in its **empty state** — no projects, no courses, no resources, no challenges — before it is verified with content.
2. `/badge/<a real live id>` is fetched from production immediately after migration 03 and must render the same name and badge it rendered before.

---

## 8 · Consistency check across the ten documents

Verified before sign-off:

- Runtime: static-first with per-route opt-out — Blueprint §4.1, Plan §1, Security §3. Consistent.
- `badges` collision: renamed in Data Model §1, migration 02, Plan §2 (`lib/badges` stays content badges, gamification is separate). Consistent.
- `shares` → view: Data Model §1/§3, migration 03, Security §5, Risk 1, QA gate 2. Consistent.
- Entitlements: one table, one resolver — Data Model §2.7, Commerce §5, Security §5. Consistent.
- XP idempotency: Data Model §2.4, Gamification §2, Risk 5, QA. Consistent.
- Newsletter separate from account: Blueprint §5, Data Model §2.1, Security §8. Consistent.
- Arabic authored not translated: Blueprint §7, IA §1, Design §4, Content OS §3, Risk 9. Consistent.
- Mint ceiling: Design §1.1, Motion §2, Gamification §8. Consistent.
- Reduced motion: Design §1.6, Motion §4, QA. Consistent.
- No fake content: Blueprint §7, Design §4, Gamification §8, Content OS §3. Consistent.
- Gear deprecated not deleted: Blueprint §6, IA §3–4, Plan §2. Consistent.
- Gear Nests as project only: Blueprint §1, Content OS §3. Consistent.
