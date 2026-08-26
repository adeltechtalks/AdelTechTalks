# AdelTechTalks v3 — Implementation Master Plan

**Status:** plan only. **No implementation code has been written. No migration has been applied. `main` is untouched and production is unchanged.**

**Approved inputs:** `V3_DESIGN_SIGNOFF.md` · `V3.1_ARCHITECTURE_PATCH.md` · **`V3_2_IA_MEDIA_PATCH.md`** · the v3 architecture documents · the design artifact at https://claude.ai/code/artifact/becad32a-445e-493b-a685-9a9eee36ca4b

**Patched by v3.2** — navigation naming, `/builds/` and `/now/` routes, the
homepage media layer, the video content model, the motion-stack decision, and the
analytics and performance additions those require.

**Patched again by the v3.2 final simplification** — `V3_CONTENT_ROUTER.md` is
now the durable editorial model (five destinations, four educational topics,
format as metadata), the premium motion quality bar is a build requirement, and
the XP skill tracks reduce from five to four. **PR 1 is unchanged.**
**Branch:** `claude/adeltechtalk-final-design-4nc4fr` — 10 commits ahead of `origin/main` (`7bb4b45`).

---

## 1 · Executive summary

v3 turns a well-built bilingual content site into a personal media and
practical-AI-education product. The gap between those two things is not visual —
the design is signed off — it is **three capabilities the current codebase does
not have at all**: a server it trusts, a scoring engine, and an account that
holds anything.

The plan below is shaped by four facts about the actual repository, not by the
shape of the design:

1. **There is exactly one server route today** — `/badge/[id]`, `prerender = false`.
   Everything else is a CDN file. v3 adds roughly a dozen server routes, and the
   correct move is to add them the same way rather than flipping the site to SSR.
2. **All authentication is client-side.** `src/lib/playground.ts` creates a browser
   Supabase client and writes `progress` and `badges` directly. Nothing verifies a
   session on the server, because nothing has needed to. Every gated thing in v3
   depends on fixing that, and it is the first thing built.
3. **The content model is already right.** Eight collections over a shared
   `editorial` Zod base, files in git, two publication gates. Challenges, projects,
   resources and What's New are four more collections in the same pattern — not a
   CMS, not a second database.
4. **Seven homepage components are dead** (zero importers, verified). They are
   removed in their own commit before anything is built on top of them, so the
   deletion is reviewable on its own and never hides inside a feature diff.

**The sequence is: make the server trustworthy → move existing writes behind it →
build the new surfaces → open the account → open the loop → sell things.** Each
step ships behind a flag, to a hidden route, or as a behaviour-identical swap.
There is no big-bang cutover, and there is no point in the sequence where
production is broken and waiting for the next phase to fix it.

**Six phases, sixteen PRs.** Phases 1–3 are the release that matters; 4–6 follow.
The first PR touches no visible pixel.

---

## 2 · Current repository baseline

Measured, not remembered — `b3dd9ee` on the v3 branch, which is v2.x production
plus the v3 planning documents.

### 2.1 Stack and deployment

| | |
|---|---|
| Framework | Astro 5.18.2, `output: 'static'` |
| Adapter | `@astrojs/cloudflare` 12.6, `imageService: 'compile'` |
| Hosting | Cloudflare Workers, Worker `adeltechtalks-sites`, declared in `site/wrangler.jsonc` |
| Server entry | `dist/_worker.js/index.js` — reached only by `prerender = false` routes |
| Deploy | Cloudflare Git integration on push to `main`. **No GitHub Actions workflow exists.** Observed cutover ≈6 minutes |
| Runtime deps | `astro`, `@astrojs/cloudflare`, `@astrojs/sitemap`, `@supabase/supabase-js`, `lucide-static` — **five** |
| Dev deps | `playwright`, `wrangler` |
| Compat flags | `nodejs_compat`, `global_fetch_strictly_public`, compat date `2026-08-04` |

### 2.2 Size

| | count |
|---|---|
| Route files (`src/pages`) | 50 |
| Components (`src/components`) | 64 |
| Content files (`src/content`) | 14 |
| Token files (`src/styles/tokens`) | 12 |
| Server routes (`prerender = false`) | **1** (`src/pages/badge/[id].astro`) |
| Browser QA checks (`scripts/qa-browser.mjs`) | 113 |
| Static QA sweep (`scripts/qa.mjs`) | 52 pages |

### 2.3 The five files that carry the most weight

| file | lines | why it matters to v3 |
|---|---|---|
| `src/copy.ts` | 1174 | every UI string, EN and AR as separately-authored siblings. Every new surface adds keys here, and every Arabic key is a release gate |
| `src/site.config.ts` | 659 | site metadata, Supabase keys, `commerce` flag, `aboutStory`, photography |
| `src/content.config.ts` | 412 | eight collections over one `editorial` base; four more join it |
| `src/lib/content.ts` | 391 | collection queries, publication gates, `homepage` eligibility |
| `src/lib/pillars.ts` | 369 | pillar taxonomy — carries the `gear` half that v3 deprecates |

### 2.4 Supabase, as it actually is

Four live tables: `progress`, `badges`, `shares`, `subscribers`. RLS on all four.
`progress` and `badges` are `for all to authenticated` — **client-writable
today**, which is the retirement problem migration 07 exists to solve.

Ten files touch Supabase: `AuthNav.astro`, `NewsletterForm.astro`,
`site.config.ts`, `lib/playground.ts`, `lib/newsletter.ts`, `pages/badge/[id].astro`,
`pages/playground/index.astro`, `pages/playground/[slug].astro`, `pages/profile.astro`,
`pages/login.astro`. **All but `badge/[id]` run in the browser.**

### 2.5 Dead code, verified

Zero importers, checked with a grep across `src/`:
`home/Explore` · `home/SeriesBand` · `home/Videos` · `home/GuidesStrip` ·
`home/PromptTeaser` · `home/SignOff` · `VideoCard`.

Still imported, keep: `home/RealWorld`, `home/GearSection`, `OriginFrame`.

### 2.6 What already exists that v3 assumed it would have to build

- `src/lib/commerce.ts` — a monetisation guard that makes "commerce is off" an
  enforced fact rather than a memory. v3's entitlement work extends it; it does
  not replace it.
- `src/lib/nav-menus.ts` — menus already gated on their destination having
  content. v3 extends the data, not the mechanism.
- `src/lib/badges.ts` — content badges, already separated from the gamification
  concept that shares the word.
- `src/i18n/index.ts` — `localizePath`, `neutralPath`, `alternates`,
  `isEnglishOnly` with an explicit `ENGLISH_ONLY` list. v3 edits that array.
- `emptyIndexFilter` in `astro.config.mjs` — sitemap already drops empty indexes
  per language. New sections inherit it.

---

## 3 · Approved references

| document | governs |
|---|---|
| `V3_DESIGN_SIGNOFF.md` | what is approved and what is still pending |
| `V3.1_ARCHITECTURE_PATCH.md` | the eight v3.1 changes and the security defect they correct |
| `V3_API_SURFACE.md` | every server endpoint, what it refuses, what it proves |
| `V3_SECURITY_MODEL.md` §5, §5.1 | the RLS matrix and the policy test |
| `V3_DATA_MODEL.md` §3, §5 | migration order and legacy retirement |
| `V3_GAMIFICATION.md` §5, §7 | badges as data, the launch gate, the rubric |
| `V3_INFORMATION_ARCHITECTURE.md` §3, §5, §6 | route matrix, homepage acts, SEO continuity |
| `V3_MOTION_SYSTEM.md` §2.5, §2.6 | act registers and the interactive state machine |
| the design artifact | the visual and interaction target |

---

## 4 · Phase breakdown

The six proposed phases survive contact with the repository, with **three
corrections** that come from what is actually there.

**Correction 1 — Phase 1 cannot be purely visual.** Migration 07 revokes the
client's write access to `progress` and `badges`, and the live Playground writes
both from the browser. Either the server-mediated write path ships in the same
release, or the Playground breaks. So the foundation phase carries one
behaviour-identical functional change.

**Correction 2 — the dead-code removal comes first and alone.** Seven components
with zero importers are deleted in their own PR before the foundation is built,
so that deletion is never mixed into a feature diff where nobody can see it.

**Correction 3 — guest progress transfer is designed in Phase 3, not Phase 4.**
The Arena ships in Phase 3 and is guest-playable from day one, so the anonymous
attempt record and its claim path must exist then. Phase 4 adds the account that
claims it, not the mechanism.

### Phase 0 — Hygiene *(no behaviour change)*
Remove seven verified-dead components. Add the CI secret grep. Add the RLS
assertion harness against a Supabase branch. Nothing user-visible; nothing
depends on it; it makes every later diff readable.

### Phase 1 — Foundation
Design tokens v3 · motion primitives and the four act registers · reduced-motion
behaviour · RTL foundations (the logical-property audit and the Arabic type
scale) · accessibility foundations · `src/server/*` with real session
verification · rate limiting · the two Playground shim endpoints · migrations
01–05 and 07 on a branch database · the homepage structural shell behind a flag.

**The rule for this phase: a v2.x page rendered against v3 tokens must look
identical.** That is a test, not an aspiration.

### Phase 2 — Core content experience
**Builds** at `/builds/` (with `/vibe-coding` redirects) · Learn outcome paths ·
**Prompt Lab** with the three-fact card and save-to-account, **route unchanged at
`/prompts/`** · **Now** at `/now/` with the four mandatory slots · the extended
video model · homepage content integration · publication gates · `adels_take`
required in the Zod schema · `/gear` redirects.

### Phase 3 — Playground
Prompt Arena · **three complete challenges** · the rubric as versioned config ·
the shared evaluator (client for hints, server for the persisted score) · the
60-second timer · scoring breakdown with per-rule explanations · XP calculation ·
badge eligibility · **guest attempt records and the claim path** · accessibility ·
RTL challenge behaviour.

### Phase 4 — Member layer
Server session integration for real · guest → member progress transfer · profile ·
XP persistence · levels · skill progression · saved prompts · challenge history ·
achievements · the progress dashboard.

### Phase 5 — Achievement and growth loop
Server-authoritative publishing · public achievement pages · verification · soft
revoke · 1200×630 share cards · contextual CTA · `/badge/[id]` → `/achievements/[id]`
redirect · acquisition events.

### Phase 6 — Courses, commerce, entitlements
Course product model · lessons · course progress · Stripe Checkout and Portal ·
webhook verification · the entitlement resolver · gated resources and downloads ·
workshops. **Nothing earlier depends on this**, which is why it is last.

---

## 5 · PR breakdown

Sixteen PRs. Each has one purpose, is independently reviewable, and leaves
production working whether or not the next one lands.

| # | PR | phase | depends on | ships behind |
|---|---|---|---|---|
| 1 | Remove seven unreferenced homepage components | 0 | — | nothing; pure deletion |
| 2 | CI: secret grep, RLS assertion harness, policy audit query | 0 | — | CI only |
| 3 | Design tokens v3 + motion primitives + reduced-motion | 1 | 1 | additive tokens; zero visual change asserted |
| 4 | `src/server/*`: session verification, rate limiting, service-role client | 1 | 2 | no route uses it yet |
| 5 | Migrations 01–05 + 07 on a Supabase branch + the Playground write shims | 1 | 4 | behaviour-identical; live Playground unchanged |
| 6 | RTL foundations + Arabic type scale + logical-property audit | 1 | 3 | no new routes |
| 7 | Homepage shell: **media layer**, acts, spine, batons — flagged off | 1 | 3, 6 | `?v3=1` / flag |
| 8 | **Builds** (`/builds/`) + `/vibe-coding` and `/gear` redirects | 2 | 7 | route live, nav item flagged |
| 9 | Learn outcome paths + **Prompt Lab** three-fact card (route stays `/prompts/`) | 2 | 7 | flagged |
| 10 | **Now** (`/now/`) + video model extensions + `adels_take` requirement | 2 | 7 | flagged |
| 11 | Arena engine: rubric config, evaluator, timer, breakdown — hidden route | 3 | 4, 5 | `/playground/arena` unlinked |
| 12 | Three launch challenges + guest attempts + claim path | 3 | 11 | still unlinked |
| 13 | Homepage PLAY act wired to the Arena; homepage flag ON | 3 | 7, 12 | **the cutover PR** |
| 14 | Account: profile, XP persistence, levels, skills, dashboard | 4 | 5, 12 | `/account` gated |
| 15 | Achievement publishing, public pages, share cards, `/badge` redirect | 5 | 14 | route live |
| 16 | Commerce: migration 06, Stripe, entitlements, downloads | 6 | 14 | flagged |

**PR 13 is the only one that changes what a visitor sees on the homepage.**
Everything before it is either invisible or reachable only by typing a URL. That
is deliberate: it means the cutover is one revertable commit rather than a
three-month drift.

**Splitting rule applied:** Phase 1 is four PRs and Phase 3 is three, because
each has a natural seam — tokens vs server vs database vs shell; engine vs
content vs wiring. Phase 5 and 6 are single PRs each only because their internals
have no seam that produces a reviewable half.

---

## 6 · File-by-file implementation map

Every path below was read in the repository. `KEEP` = untouched. `EDIT` = changed
in place. `REPLACE` = superseded, old file removed. `NEW` = does not exist yet.

### 6.1 Delete — verified zero importers

| path | action | PR |
|---|---|---|
| `src/components/home/Explore.astro` | DELETE | 1 |
| `src/components/home/SeriesBand.astro` | DELETE | 1 |
| `src/components/home/Videos.astro` | DELETE | 1 |
| `src/components/home/GuidesStrip.astro` | DELETE | 1 |
| `src/components/home/PromptTeaser.astro` | DELETE | 1 |
| `src/components/home/SignOff.astro` | DELETE | 1 |
| `src/components/VideoCard.astro` | DELETE | 1 |

### 6.2 Configuration and infrastructure

| path | action | reason | PR |
|---|---|---|---|
| `astro.config.mjs` | EDIT | sitemap filter gains `/account`, `/join`, `/api`; `emptyIndexFilter` gains the new collections | 7, 8 |
| `wrangler.jsonc` | EDIT | secret bindings for service role and Stripe; **nothing else** — the deployment model is not touched | 4, 16 |
| `package.json` | EDIT | add `@supabase/ssr` (PR 4), `stripe` (PR 16). No UI, CSS, state or animation library | 4, 16 |
| `src/site.config.ts` | EDIT | v3 flags, level config, rubric registry pointer; `commerce.enabled` stays `false` until PR 16 | 3, 11, 16 |
| `src/content.config.ts` | EDIT | four new collections on the existing `editorial` base; `adels_take` required | 8–12 |

### 6.3 Styles and tokens

| path | action | reason | PR |
|---|---|---|---|
| `src/styles/tokens/*.css` (12 files) | KEEP | every existing token keeps its name and value | — |
| `src/styles/tokens/adel-v3.css` | NEW | XP, level, badge, track, challenge semantic tokens | 3 |
| `src/styles/tokens/adel-rtl.css` | NEW | Arabic type scale, line-height and tracking resets | 6 |
| `src/styles/motion.css` | EDIT | act registers, tiers 4–5, the feedback sequence | 3 |
| `src/styles/app.css` | EDIT | compose the two new token files | 3, 6 |

### 6.4 Server — all new, all `src/server/`

| path | action | reason | PR |
|---|---|---|---|
| `src/server/auth.ts` | NEW | `requireUser`, `optionalUser`, redirect validation | 4 |
| `src/server/db.ts` | NEW | the **only** file constructing the service-role client; exports functions, never the client | 4 |
| `src/server/ratelimit.ts` | NEW | per-user and per-IP limits | 4 |
| `src/server/scoring.ts` | NEW | the rubric evaluator — **shared with the client for hints, authoritative here** | 11 |
| `src/server/xp.ts` | NEW | `awardXP` with mandatory idempotency keys | 12 |
| `src/server/badges.ts` | NEW | the requirement evaluator; refuses self-assessed evidence | 12 |
| `src/server/achievements.ts` | NEW | ownership proofs and public-snapshot derivation; the only writer of `achievement_verifications` | 15 |
| `src/server/entitlements.ts` | NEW | the resolver; no component asks about purchases | 16 |
| `src/server/stripe.ts` | NEW | webhook verification and handlers | 16 |
| `src/server/storage.ts` | NEW | signed URLs, 60s TTL | 16 |

### 6.5 API routes — all `prerender = false`

| path | action | PR |
|---|---|---|
| `src/pages/api/playground/progress.ts` | NEW → **DELETE in PR 13** | 5 |
| `src/pages/api/playground/complete.ts` | NEW → **DELETE in PR 13** | 5 |
| `src/pages/api/challenge/score.ts` | NEW | 11 |
| `src/pages/api/challenge/claim.ts` | NEW | 12 |
| `src/pages/api/prompts/save.ts` | NEW | 9 |
| `src/pages/api/achievements/publish.ts` | NEW | 15 |
| `src/pages/api/achievements/unpublish.ts` | NEW | 15 |
| `src/pages/api/achievements/card/[id].png.ts` | NEW | 15 |
| `src/pages/api/checkout.ts` · `stripe/webhook.ts` · `entitlements/status.ts` · `download/[slug].ts` | NEW | 16 |

The two shims are the only files in this plan created with a scheduled deletion.
That is recorded here so their removal is a planned step and not an act of
archaeology in six months.

### 6.6 Existing components

| path | action | reason | PR |
|---|---|---|---|
| `src/components/Header.astro` | EDIT | seven-item IA, XP chip when signed in, Join Free | 7, 14 |
| `src/components/AuthNav.astro` | EDIT | `localStorage` read stays but is **labelled presentation-only in code**; it never gates | 4 |
| `src/components/Footer.astro` | EDIT | column contents; structure unchanged | 7 |
| `src/components/Badge.astro`, `src/lib/badges.ts` | EDIT | closed set extended with v3 content types. **Gamification badges stay a separate module** | 8 |
| `src/lib/nav-menus.ts` | EDIT | new sections; the gating mechanism is unchanged | 7 |
| `src/lib/content.ts` | EDIT | queries for the four new collections | 8–12 |
| `src/lib/pillars.ts` | EDIT | gear half marked deprecated, not deleted | 8 |
| `src/lib/playground.ts` | EDIT → REPLACE | writes move to the shims (PR 5), then the file is replaced by the Arena client (PR 13) | 5, 13 |
| `src/copy.ts` | EDIT | every new string, EN and AR. **Arabic is a release gate on every PR that touches it** | most |
| `src/layouts/Base.astro` | EDIT | CSP and security headers; metadata unchanged | 4 |
| `src/components/Rich.astro`, `LoveTech`, `Logo`, `PillarIcon`, `Icon`, `Button`, `Chip`, `Card`, `StatusPill`, `NewsletterForm`, `AdelLogo`, `ArabicDisplayFont`, `OriginFrame`, all seven `editorial/*`, all four `ia/*`, both `about/*` | KEEP | they work and v3 does not need them different | — |

### 6.7 Homepage components

| path | action | PR |
|---|---|---|
| `src/components/pages/HomePage.astro` | REPLACE | 7 |
| `src/components/home/Hero.astro` | EDIT — CTA becomes *Try a 60-second challenge* | 7 |
| `src/components/home/Exploring.astro` | REPLACE → **the media layer**, reading videos, builds and Now entries. *(v3.2: absorbs Right Now rather than sitting beside it)* | 7 |
| `src/components/home/Latest.astro` | REPLACE → **Now**, four slots | 10 |
| `src/components/home/LearnSection.astro` | EDIT → outcome rails | 9 |
| `src/components/home/PlaygroundSection.astro` | REPLACE → the PLAY act | 13 |
| `src/components/home/AboutSubscribe.astro` | EDIT → membership CTA, newsletter secondary | 7 |
| `src/components/home/RealWorld.astro`, `home/GearSection.astro` | KEEP unrouted | 8 |
| `src/components/story/Spine.astro`, `story/ActRow.astro`, `story/Baton.astro` | NEW | 7 |

### 6.8 New component families

**Arena:** `arena/Arena.astro` · `arena/Timer.astro` · `arena/SourcePanel.astro` ·
`arena/HintChips.astro` · `arena/Breakdown.astro` · `arena/ChallengeComplete.astro` (PR 11)
**Gamification:** `gam/XPIndicator` · `XPGain` · `Level` · `LevelProgress` ·
`BadgeMedallion` · `Achievement` (PR 12, 14)
**Member:** `member/Dashboard` · `SkillBars` · `SavedList` · `BadgeGrid` (PR 14)
**State:** `state/EmptyState.astro` · `state/PreviewCard.astro` (PR 7)
**Media (v3.2):** `media/MediaLayer.astro` · `media/MediaCard.astro` (five types) ·
`media/VideoFacade.astro` (thumbnail + click-to-load; **no third-party frame on
first load**) (PR 7, 10)
**Core:** `Tabs` · `Dialog` · `Toast` · `Input` · `Select` · `Checkbox` (PR 7, as needed)

### 6.9 Routes

| path | action | PR |
|---|---|---|
| `src/pages/index.astro`, `ar/index.astro` | EDIT | 7, 13 |
| `src/pages/builds/*`, `ar/builds/*` | NEW *(v3.2: was `/projects/`)* | 8 |
| `src/pages/vibe-coding/*`, `ar/vibe-coding/*` | KEEP as files; redirect via `public/_redirects` | 8 |
| `src/pages/gear/*`, `ar/gear/*` | KEEP unrouted; redirect | 8 |
| `src/pages/now/*`, `ar/now/*` | NEW *(v3.2: was `/whats-new/`)* | 10 |
| `src/pages/prompts/*`, `videos/*` and their `ar/` twins | **KEEP** — v3.2 changes labels, not these routes | — |
| `src/pages/playground/index.astro`, `[slug].astro` | REPLACE | 13 |
| `src/pages/join.astro`, `account/*` | NEW | 14 |
| `src/pages/achievements/[id].astro` | NEW | 15 |
| `src/pages/badge/[id].astro` | EDIT → 301 to `/achievements/[id]`, **stays `prerender = false`** | 15 |
| `src/pages/profile.astro` | REPLACE → 301 to `/account` | 14 |
| `src/pages/login.astro` | EDIT | 14 |
| `src/pages/courses/*` | NEW | 16 |
| `public/_redirects` | NEW | 8 |
| `src/pages/about.astro`, `contact.astro`, `work-with-me.astro`, `404.astro`, `newsletter.astro`, `ask-index.json.ts`, all `guides/`, `use-cases/`, `videos/`, `topics/`, `articles/`, `series/`, `prompts/` routes and their `ar/` twins | KEEP | — |

### 6.10 Scripts

| path | action | PR |
|---|---|---|
| `scripts/qa.mjs` | EDIT — hard-coded hex detection, orphaned-slug detection | 3, 12 |
| `scripts/qa-browser.mjs` | EDIT — new routes, Arena loop, RTL per route, reduced motion | every PR |
| `scripts/build-og-adel.mjs` | KEEP — the achievement card generator reuses its token pipeline | 15 |
| `scripts/postbuild.mjs` | KEEP | — |
| `scripts/qa-rls.mjs` | NEW — authenticate as A, assert cannot read B, per table | 2 |
| `scripts/qa-security.mjs` | NEW — the hostile-client suite and the policy audit | 2, 15 |

### 6.11 Technical debt deliberately NOT touched

Naming it so nobody "tidies" it inside a v3 PR:

- **`src/lib/pillars.ts` (369 lines)** carries a five-pillar taxonomy of which v3
  uses two. Marked deprecated, left intact. Refactoring it touches every editorial
  route for no v3 benefit.
- **`src/styles/tokens/legacy-att.css` and `bridge-v2.css`** are compatibility
  layers from the v1→v2 migration. They are load-bearing for existing pages.
  Collapsing them is a separate project.
- **`src/pages/series/[series].astro`** is superseded by Projects but holds
  indexed content. Frozen, redirect deferred until every entry has a Project home.
- **`src/content/gear/`, `src/components/pages/GearHub|GearStory`** stay in the
  repo unrouted, exactly as `courses` did for a whole release.
- **`src/copy.ts` at 1174 lines** wants splitting. Not during v3: it is the file
  every PR touches, and splitting it would conflict with all of them.

---

## 7 · Database migration sequence

Reviewed against the four tables that actually exist in production:
`progress`, `badges`, `shares`, `subscribers`.

**None of these has been applied. All of them run against a Supabase branch
first.**

| order | migration | purpose | depends on | backward compatible | can land before UI | rollback | production risk |
|---|---|---|---|---|---|---|---|
| 1 | `01_profiles.sql` | `profiles` + `auth.users` trigger + backfill | — | yes, additive | **yes** | drop table + trigger | **low** |
| 2 | `02_badges_rename.sql` | `badges` → `playground_track_badges`; new `badges` catalogue; `user_badges`; one-time backfill | 01 | **no — renames a live table** | **no** — must ship with 07 and the shims | reverse rename | **high** |
| 3 | `07_retire_legacy_gamification.sql` | revokes client writes on the legacy pair; seals the 02 backfill | 02 | no — removes a write path | **no** | re-create the two `for all` policies | **high** |
| 4 | `03_achievements.sql` | `achievement_verifications`; copies `shares`; **`shares` becomes a view** | 02 | yes for readers; the view preserves the column set | **yes**, but verify `/badge/<live id>` immediately | `create table as select` from the view | **critical** |
| 5 | `04_xp.sql` | `xp_events`, `xp_balances`, `skill_progress`, `rebuild_xp()` | 01 | yes, additive | **yes** | drop three tables + function | **low** |
| 6 | `05_learning.sql` | `saved_prompts`, `enrollments`, `lesson_progress`, `challenge_attempts` | 01 | yes, additive | **yes** | drop | **low** |
| 7 | `06_commerce.sql` | Stripe tables, `entitlements`, workshops | 01 | yes, additive | **yes** | drop | **low** |

### 7.1 The three that need care, and why

**02 + 07 are one deployable unit.** 02 renames a table the live Playground is
writing and restates a transitional write policy; 07 removes that policy. Running
02 alone leaves the escalation route open — a client-writable
`playground_track_badges` feeding `user_badges`, which is what the publish
endpoint accepts as proof. They ship in the same release as the two write shims,
in that order, or not at all.

**03 is the highest-risk statement in the entire project.** `/badge/[id]` is
server-rendered and those links are on LinkedIn. The sequence is fixed: create
the table → copy every row preserving ids → verify the count query returns 0 →
drop and create the view in one transaction → fetch a known live id from
production. If the view cannot reproduce the exact column set the page reads, the
migration does not proceed.

**RLS impact, stated per migration.** After the full set, exactly two tables
accept a client write: `saved_prompts` (a bookmark, confers nothing) and
`subscribers` (anon insert, unchanged from v2.x). Every other table is
read-own-rows with server-side writes. A CI policy audit asserts that list, and a
new table with a client write policy fails the release until it is justified in
writing.

### 7.2 Guest → member progress transfer

`challenge_attempts.user_id` is nullable and `anon_key` holds one opaque
browser-generated value with no PII. `POST /api/challenge/claim` matches on
`anon_key` within a short window, sets `user_id`, **clears `anon_key`**, and
awards the XP that was withheld. Idempotency keys make a double-claim a no-op.
Unclaimed rows expire after 30 days by scheduled job.

**The guest never replays anything.** The score already exists as a row; signing
up attaches an owner to it.

---

## 8 · Security boundaries

### 8.1 Threat boundaries, named

| # | boundary | crossing it means | enforced by |
|---|---|---|---|
| B1 | Browser → CDN | nothing; static files are public | — |
| B2 | Browser → Worker (`/api/*`) | **the only place a request becomes trusted** | `requireUser`, rate limits, field refusal |
| B3 | Worker → Postgres as `anon` | the client's own reach if the key leaks | RLS |
| B4 | Worker → Postgres as service role | full authority | one file (`src/server/db.ts`), exporting functions |
| B5 | Stripe → Worker | an unauthenticated write endpoint | signature verification + `stripe_events` idempotency |
| B6 | Worker → private storage | entitled file access | signed URL, 60s, fails closed |

**B2 is where the v3 defect lived.** The v3 draft let the browser write a
verification directly, which put the trust boundary in the wrong place entirely.

### 8.2 The invariants this plan preserves

- **Server-authoritative XP.** No client insert on `xp_events`. Every award
  carries a deterministic idempotency key.
- **Server-authoritative scoring where it persists.** The client runs the
  evaluator for live hints only; the stored score is computed server-side from
  the same rubric. A submitted `score` field is refused with 400.
- **Server-authoritative badge awards.** One evaluator over requirement objects;
  refuses self-assessed evidence.
- **Server-authoritative achievement publishing.** Ownership proven against
  `user_badges` / `enrollments` / `challenge_attempts` before any write. No
  insert policy and no grant for any client role.
- **Entitlements resolved in one place**, written only by verified webhooks. No
  component asks about purchases.
- **Stripe webhook signature verified** before anything happens. No bypass flag
  exists in any environment.
- **Protected downloads fail closed** — no entitlement, no signed URL.
- **Least-privilege RLS** — the policy audit is a release gate.
- **No client-controlled trusted fields** — `user_id`, `score`, `xp`,
  `earned_at`, `display_name`, `level_key`, `verified` are refused, not stripped.
- **Safe guest transfer** — one opaque key, no PII, cleared at claim, expired at 30 days.
- **No secrets client-side** — `src/server/` import boundary is a build check;
  CI greps built client output for secret *values*, not binding names.

### 8.3 The test that decides a policy

> **A client may write a table only if writing it confers nothing.**

Not "only its own rows". The question is: *if a client wrote this row itself,
what could it then obtain?* If the answer is XP, a level, a badge, a completion,
an entitlement or a public verification, the table is server-written.

---

## 9 · Analytics event model

**No vendor is chosen and none is installed.** The approved stack has no
analytics dependency, and adding one is a separate decision. What this section
does is define the events so that whatever is chosen later is a wiring job, not a
redesign — and so nobody instruments ad hoc in the meantime.

**Design rules, applied to every event below:**
- No PII in any property. No email, no display name, no IP beyond Cloudflare's own.
- The anonymous identifier is the same opaque `anon_key` the Arena already uses —
  no second identity, no fingerprinting, no third-party cookie.
- `user_id` appears in **no** event payload. Authenticated events carry
  `authed: true` and nothing that identifies who.
- Content is referenced by git slug, never by title.
- Every event answers a funnel question, or it does not ship.

| event | trigger | properties | anon / authed | funnel purpose |
|---|---|---|---|---|
| `homepage_view` | homepage render | `lang`, `variant` | both, identical | denominator |
| `hero_challenge_clicked` | hero CTA | `lang` | both | does the hero convert into play |
| `challenge_started` | timer starts | `challenge_slug`, `surface` (home\|arena), `lang` | both | intent → engagement |
| `challenge_completed` | submission scored | `challenge_slug`, `duration_bucket`, `timed_out` | both | completion rate |
| `challenge_score_received` | score rendered | `challenge_slug`, `score_bucket` (0–44/45–69/70–89/90+), `rubric_version` | both | **is the rubric calibrated** |
| `xp_earned` | XP awarded | `amount`, `reason`, `provisional` | both | value delivered pre-signup |
| `badge_earned` | badge unlocked | `badge_key`, `provisional` | both | first-session reward rate |
| `join_free_clicked` | conversion CTA | `surface`, `had_xp`, `had_badge` | anon only | **does earned value convert** |
| `guest_progress_claimed` | claim succeeds | `attempts_claimed`, `xp_claimed` | authed | is the transfer working |
| `prompt_copied` | copy button | `prompt_slug` | both | which prompts are used |
| `prompt_saved` | save button | `prompt_slug` | authed | account value |
| `build_opened` | build page | `build_slug` | both | BUILD act |
| `now_entry_opened` | Now entry opened | `entry_slug`, `type` | both | replaces `whats_new_opened` |
| `media_card_shown` | media layer in view | `type`, `position` | both | does the layer get seen |
| `media_card_clicked` | media card click | `type`, `position` | both | which card type earns the click |
| `video_play_clicked` | facade → play | `video_slug`, `platform` | both | facade conversion |
| `outbound_social` | leaves to a platform | `platform`, `video_slug` | both | attention leaving |
| `related_link_clicked` | a related slot on a video/Now entry | `from_type`, `to_type` | both | **does the social → owned chain work** |
| `achievement_published` | publish 201 | `subject_type` | authed | loop supply |
| `achievement_shared` | share action | `subject_type`, `target` | authed | loop supply |
| `achievement_referral_opened` | achievement page from external referrer | `subject_type`, `referrer_host` | anon | **loop return** |
| `course_viewed` · `checkout_started` · `purchase_completed` | Phase 6 | `product_key`, `amount_bucket` | authed | commerce |

**Three events carry the whole growth thesis** *(v3.2 adds the third)*:
`join_free_clicked` with `had_badge: true` (did the reward convert),
`achievement_referral_opened` (did the loop return anyone), and
`related_link_clicked` (does short-form attention actually travel from a video to
a prompt, a build or a challenge). If those three stay flat, the loop is
decorative — and the answer is to rethink the chain, not to publish more videos.

**`score_bucket`, not `score`.** A raw score plus a challenge slug plus a
timestamp is close to a fingerprint. Buckets answer the calibration question
without building one.

---

## 10 · SEO migration plan

The current site has live, indexed URLs and real accumulated authority. The rule
is **minimum churn**.

### 10.1 Unchanged — no redirect, no canonical change

`/` · `/about/` · `/learn/` · `/newsletter/` · `/contact/` · `/work-with-me/` ·
`/404/` · `/guides/` + `[...slug]` · `/articles/[...slug]` · `/use-cases/` +
`[...slug]` · `/prompts/` + `[...slug]` · `/videos/` + `[...slug]` · `/topics/` +
`[topic]` · `/ask-index.json` — **and every `/ar/` twin.**

**The library does not move under `/learn/`.** A tidier path is not worth
renaming every indexed editorial URL in two languages.

### 10.2 Changed — 301, single hop, with its Arabic twin in the same commit

| from | to | note |
|---|---|---|
| `/vibe-coding/` + `[slug]` | `/projects/` + `[slug]` | slug preserved 1:1 |
| `/gear/`, `/gear/[category]/[slug]` | `/projects/` | **zero gear stories ever published — no article URL is lost**; only the hub had a body |
| `/badge/[id]` | `/achievements/[id]` | **these are on LinkedIn**; the route stays `prerender = false` |
| `/profile/` | `/account/` | |
| `/playground/passport/` | `/account/achievements/` | already a 301 today; re-pointed |
| `/series/[series]/` | `/projects/` | **deferred** — holds indexed content; redirects only once every entry has a Project home |

Redirects live in `public/_redirects` (Cloudflare adapter), never in per-page
meta refreshes. Every one is 301, single-hop, and lands on a destination that
already renders.

### 10.3 Canonical, hreflang, sitemap, structured data

- Canonicals unchanged on every retained URL.
- `hreflang` pairs on every bilingual route, `x-default` → English; a route with
  no counterpart advertises only itself. `/api`, `/account`, `/join` join
  `ENGLISH_ONLY` in `src/i18n/index.ts`; **`/playground` leaves it** — the Arena
  is bilingual.
- Sitemap keeps its `i18n` config and `emptyIndexFilter`. `/account/*`, `/join/`,
  `/api/*` are `noindex` and excluded. New sections join as they gain content.
- `/achievements/[id]` **is** indexable and server-rendered — that is the point of it.
- Structured data: `Article` on editorial pages unchanged; `CreativeWork` for
  projects; **no `Course` markup until a course is genuinely purchasable**, and
  no `AggregateRating` ever, because there are no ratings.

### 10.4 Verified per release

Production smoke asserts: every retained URL 200s; canonical and hreflang
present; redirects resolve in one hop; `/badge/<a real live id>` still renders
the same name and badge after migration 03; no role or employer string in any
`<head>`.

---

## 11 · Performance budgets

The static-first advantage is the thing most at risk, so the budgets are written
against what the site does today.

| metric | budget | applies to | measured by |
|---|---|---|---|
| Initial JS, marketing routes | **≤ 20 KB** gzipped | `/`, `/learn`, `/prompts`, `/projects`, `/whats-new` | build report |
| Initial JS, Arena route | ≤ 45 KB gzipped | `/playground/*` | build report |
| CSS, any route | ≤ 45 KB gzipped | all | build report |
| Fonts, first paint | ≤ 2 families, `swap`, subset | all | network trace |
| **KO Ghorab** | subset to Arabic + digits, ≤ 60 KB, `swap`, **preloaded on `/ar/*` only** | Arabic routes | network trace |
| Hero image | ≤ 120 KB, AVIF/WebP, `fetchpriority=high` | `/` | build report |
| **Media thumbnails** *(v3.2)* | ≤ 40 KB each, AVIF/WebP, explicit `width`/`height`, `loading="lazy"` below the first card | `/` | build report |
| **Third-party frames on first load** *(v3.2)* | **zero, on every route** | all | network trace |
| LCP | ≤ 2.0s (p75, mobile) | `/` | Lighthouse CI |
| INP | ≤ 200ms | `/`, `/playground/*` | Lighthouse CI |
| CLS | ≤ 0.05 | all | Lighthouse CI |
| Motion | 60fps at **4× CPU throttle**; ≤ 3 elements animating per viewport | `/`, `/playground/*` | manual + trace |
| Arena interactive | ≤ 1.5s from route to a playable challenge | `/playground/*` | Lighthouse CI |
| Worker invocations | **only** `prerender = false` routes | all | `dist/_routes.json` diff |

**Two budget rules with teeth:**

1. **`dist/_routes.json` is diffed on every PR.** If a marketing route starts
   reaching the Worker, the build fails. That single check protects the entire
   static-first model from erosion by accident.
2. **No route may add a JS dependency without removing one or justifying it in
   the PR body.** The stack is five runtime dependencies and v3 adds two —
   `@supabase/ssr` and `stripe`, both server-only. **v3.2 adds none**: the motion
   stack is CSS plus the Web Animations API, and Remotion never enters
   `site/package.json`.
3. **The homepage is measured at the media layer's FULL state** *(v3.2)* — five
   items with real images — as well as its empty one. It is the only section
   whose full state is the performance risk, and a single third-party embed would
   exceed the entire marketing-route budget on its own.

---

## 12 · QA gates

**No phase is complete because it looks like the design.** Each gate below is a
command that passes or fails.

### 12.1 Applies to every PR

| gate | how |
|---|---|
| Build clean | `npm run build` — zero warnings |
| Static sweep | `npm run qa` — 52+ pages, no undefined tokens, **no hard-coded hex** |
| Browser suite | `scripts/qa-browser.mjs` — 113 existing checks still pass |
| RTL | every new route added to the Arabic typography guard |
| Reduced motion | every new animated block asserted static and fully visible |
| Keyboard | every new interactive element reachable, operable, focus visible, Escape closes |
| `_routes.json` diff | no marketing route newly reaches the Worker |
| Arabic strings | no `‹author›` placeholder ships; **English fallback is never silently rendered as Arabic** |

### 12.2 Per phase

**Phase 0** — the seven deleted files have zero references (`grep` in CI); the
RLS harness runs green against a branch DB; the policy audit returns exactly
`saved_prompts` and `subscribers`.

**Phase 1** — **a v2.x page rendered against v3 tokens is visually identical**
(screenshot diff on 8 routes). The Playground behaves identically end to end after
the write path moves server-side; only its network calls change. Migration 03
verified on a branch, then `/badge/<real id>` fetched from production immediately
after the production run.

**Phase 2** — every redirect resolves in one hop with its Arabic twin; **no
retained URL changed canonical, and `/prompts/`, `/videos/` and `/topics/*` are
asserted unmoved**; **every published piece resolves to exactly one destination
and at most one `skill`** — a build check, because the router's whole value is
that classification stays single; a Now `take` without `adels_take` and an `experience` without a photo
both **fail the build**; the homepage renders correctly with an **empty content
directory**, and separately at the media layer's **full** state within budget; a
video entry with no related slots renders no empty slots.

**Phase 3** — the whole loop, as one browser test: start → type → submit → score
→ per-rule breakdown → XP → badge → save prompt → try another → share. Guest path
tested with no session. Timer expiry auto-submits. RTL Arena tested
independently. Live region announces score, XP and badge in order. Arena reaches
playable in ≤1.5s.

**Phase 4** — signed-out access to `/account/*` redirects with a safe `next`;
open-redirect list unit-tested; guest → member claim awards exactly once
(idempotency asserted by running it twice); `rebuild_xp()` reproduces balances
from the ledger on a restored snapshot.

**Phase 5** — **every row of the hostile-client table passes**, including the
direct anon-key insert asserted against RLS *and* the grant, separately.
Un-publish 404s the page; re-publish restores the same id. The share card renders
with only consented fields.

**Phase 6** — Stripe test-mode end to end: checkout → webhook → entitlement →
access. Invalid signature 400s. Duplicate event is a no-op. Refund revokes.
Download without entitlement fails closed. Expired signed URL fails.

### 12.3 Non-negotiable release gates

1. The homepage is verified in its **empty state before its full state**.
2. `/badge/<a real live id>` renders identically after migration 03.
3. The hostile-client suite passes in full.
4. The policy audit returns exactly two client-writable tables.
5. `/playground/` does not open until **three complete challenges exist and the
   full loop passes end to end**.
6. **Arabic is reviewed in the real KO Ghorab face** before any `/ar/*` v3 route
   goes live.

---

## 13 · Rollback strategy

| level | mechanism | recovery |
|---|---|---|
| A visual regression | flag off | seconds |
| A bad deploy | Cloudflare rollback to the previous Worker version | ~1 minute |
| A bad merge | revert the PR; every PR is one coherent commit | one deploy cycle |
| A bad additive migration (01, 04, 05, 06) | stated `drop` in the file header | immediate |
| **02 + 07** | reverse rename, re-create the two `for all` policies | minutes, and only before new `user_badges` rows accumulate |
| **03** | `create table as select` from the view, re-apply v2.x policies | minutes — **rehearsed on a branch before the production run** |
| Data written under a bad deploy | `xp_events` is an append-only ledger; `rebuild_xp()` recomputes every balance | full recovery |

**The rule that makes rollback real:** no PR both changes the database *and*
changes what a visitor sees. PR 5 migrates and swaps a write path with zero
visual change; PR 13 changes the homepage and touches no schema. So a rollback is
always either a flag or a revert, never both at once.

---

## 14 · Deployment and cutover strategy

**Recommendation: incremental compatible merges to `main`, with the homepage
behind a flag and v3 routes live-but-unlinked. Not a long-lived branch, and not a
big bang.**

Why, given this specific repository:

- Cloudflare deploys on every push to `main`, with no staging environment and no
  GitHub Actions workflow. A long-lived v3 branch would therefore be **untested
  in the real runtime** until the day it merged — the highest-risk possible shape.
- The site is static-first, so a new route that nothing links to costs nothing:
  it is a file on the CDN that no one requests.
- The Cloudflare Git integration gives per-deploy rollback for free.

**The mechanics:**

1. **PRs 1–6 merge to `main` and deploy continuously.** They are invisible: dead
   code removed, tokens added, server modules unused, migrations on a branch DB.
2. **The homepage flag.** `?v3=1` plus a `site.config.ts` boolean. The v3
   homepage is built and deployed but only served when the flag is on, so it is
   testable in the real runtime by a real URL before anyone sees it.
3. **New routes live but unlinked.** `/projects`, `/whats-new`,
   `/playground/arena` ship reachable but absent from navigation. Real
   environment, real data, zero audience.
4. **Migrations run against a Supabase branch**, verified, then against
   production in a scheduled window — **02+07 together, 03 alone with its
   verification immediately after**.
5. **The cutover is PR 13**: nav items appear, the homepage flag defaults on.
   One commit, revertable.
6. **`/gear` and `/vibe-coding` redirects land with the IA, in the same deploy.**

**What is explicitly rejected:** a big-bang merge (untested runtime), a parallel
v3 subdomain (splits SEO and doubles deployment), and a rewrite branch that
diverges for months (guarantees a painful merge and hides regressions).

---

## 15 · Dependencies

**New runtime — two packages, both server-only:**
`@supabase/ssr` (server session) · `stripe` (Phase 6).

**Deliberately not added:** no UI framework, no CSS framework, no state library,
no animation library, no analytics SDK. Motion is CSS plus the Web Animations
API. The stack stays five runtime dependencies plus two.

**External:** a Supabase branch for migration rehearsal · Cloudflare secret
bindings · a Stripe account with products and a webhook endpoint (Phase 6) · a
private Supabase Storage bucket (Phase 6).

**Human, and these are release gates rather than implementation blockers:**
authored Arabic for every new string · the real KO Ghorab review · **three
complete Arena challenges** with rubric, per-rule explanations, XP and badge
eligibility · real project screenshots · the first What's New item with a genuine
*Adel's take*.

---

## 16 · Risks

| # | risk | severity | mitigation |
|---|---|---|---|
| 1 | **Migration 03 breaks live LinkedIn links** | **critical** | fixed sequence; count verification; rehearsed rollback; production check on a real id immediately after |
| 2 | **02 without 07 leaves the escalation route open** | **critical** | they are one deployable unit; CI policy audit would catch it, but the coupling is stated in both files |
| 3 | Client-only auth mistaken for a gate | critical | every gated route calls `requireUser`; the `localStorage` read is labelled presentation-only in code |
| 4 | A secret reaches the client bundle | critical | `src/server/` import boundary as a build check; CI grep of built output for secret values |
| 5 | Self-issued achievement | critical | no insert policy, no grant; ownership proven server-side; hostile-client suite is a release gate |
| 6 | **Three challenges is not enough to hold attention** | high | the gate is the loop, not the count; the library expands with front matter, no deploy |
| 7 | Arabic ships provisional | high | `‹author›` placeholders fail the build; KO Ghorab review is gate 6 |
| 8 | XP double-award | high | mandatory idempotency keys; `rebuild_xp()` asserted in CI |
| 9 | **The static-first advantage erodes** | high | `_routes.json` diffed on every PR |
| 10 | SEO loss from IA changes | high | library URLs unchanged; single-hop 301s with Arabic twins; production smoke per release |
| 11 | The rubric is miscalibrated and scores feel arbitrary | medium | `challenge_score_received` with `score_bucket` and `rubric_version`; the rubric is versioned config, so recalibration is a data change |
| 12 | Guest transfer loses progress | medium | attempts are rows before signup, not client state; claim is idempotent; tested by running it twice |
| 13 | Gamification reads as gimmick | medium | no confetti, no streaks, no fake numbers; sequenced feedback with a 2000ms ceiling |
| 14 | Scope: Phase 3 is the biggest single build | medium | split across PRs 11–13; the engine ships before any challenge exists |
| 15 | `copy.ts` merge conflicts across parallel PRs | low | PRs merge in the stated order; the file is not split during v3 |
| 16 | **The media layer is thin at launch and the homepage looks abandoned** *(v3.2)* | high | renders only at ≥3 real items; below that it is absent and the hero flows into BUILD. An honest absence beats three placeholder tiles |
| 17 | **The media layer becomes a blog grid** *(v3.2)* | medium | five items, mixed types, one prominent; it is capped by design, not by taste |
| 18 | **A social embed blows the performance budget** *(v3.2)* | high | facade-first, zero third-party frames on first load, asserted in the network trace |
| 19 | **Out in Tech drifts into product reviews** *(v3.2)* | medium | schema-level: no rating, score, price, retailer link or spec table, and no field to hold one. The H1 is the experience, never a product name |

---

## 17 · Remaining decisions requiring Adel

These block a release, not the start of implementation. PR 1 does not wait for
any of them.

| # | decision | needed by | why it needs you |
|---|---|---|---|
| 1 | **The three Arena challenges** — the weak prompt, its named flaws, the rubric weights, and an explanation for every rule | PR 12 | This is the product. It cannot be generated; a challenge that scores but cannot explain itself is not one of the three |
| 2 | **Arabic authored copy** for every new string, plus the KO Ghorab review | Phase 2 release | The board's Arabic is provisional. Frozen Latin terms, level names, nav labels and Preview copy all need authoring |
| 3 | **`/gear/*` → `/projects/` confirmation** | PR 8 | Redirecting to Learn instead is defensible. Zero gear stories were ever published, so nothing is lost either way — but it is a permanent 301 |
| 4 | **`/series/[series]` timing** | deferred | It holds indexed content. It redirects only once every entry has a Project home. Which entries, and when |
| 5 | **Analytics vendor** | Phase 3 release | The events are defined and vendor-neutral. Adding an SDK is a new dependency and a new privacy surface |
| 6 | **Real project screenshots and the first What's New item** | Phase 2 release | Publication gates. The system ships complete; the piece waits for the asset |
| 7 | **The homepage achievements wall** | PR 13 | Specified, and absent at launch because nothing real exists. Build it now or defer the component to Phase 5 |
| 8 | **Level names in Arabic** | Phase 4 | Brand vocabulary, must be authored rather than translated |

**One recommendation among these:** defer the achievements wall (7) to Phase 5.
It cannot show anything true until the loop has produced real verifications, and
building it early means building a component whose only tested state is empty.

---

## 18 · Recommended first implementation PR

### PR 1 — Remove seven unreferenced homepage components

**Why this one first, and not the tokens.**

It is the only PR in the plan with **zero risk and zero dependencies**, and it
makes every subsequent diff readable. Seven components with no importers are
currently indistinguishable from live code in a file listing, so any later PR
that touches the homepage has to be reviewed against a directory where a third of
the candidates are already dead. Removing them first means PR 7's diff shows only
what actually changed.

It is also the correct way to open a large project: a small, complete,
independently reviewable change that proves the branch, the CI and the review
loop all work before anything is at stake.

**Scope — deletions only:**

```
src/components/home/Explore.astro
src/components/home/SeriesBand.astro
src/components/home/Videos.astro
src/components/home/GuidesStrip.astro
src/components/home/PromptTeaser.astro
src/components/home/SignOff.astro
src/components/VideoCard.astro
```

**Verification before the deletion, in the PR body:**

```
grep -rn "Explore\|SeriesBand\|GuidesStrip\|PromptTeaser\|SignOff\|VideoCard" src/ \
  --include=*.astro --include=*.ts | grep -v "components/"
# must return nothing
```

**Gates:** `npm run build` clean · `npm run qa` 52 pages · `scripts/qa-browser.mjs`
113/113 · `dist/` byte-identical apart from the removed modules.

**Rollback:** revert the commit. Nothing references these files.

**Explicitly not in this PR:** no token changes, no `pillars.ts` tidying, no
`copy.ts` touch, no reformatting. One purpose.

---

## 19 · Roadmap

```
   Current v2.x                    live, stable, untouched at 7bb4b45
        │
        ▼
   ░░ Phase 0 · Hygiene ░░         PR 1–2      invisible
        │                          dead code out · CI security harness
        ▼
   ▓▓ Phase 1 · Foundation ▓▓      PR 3–7      invisible
        │                          tokens · motion · RTL · server · migrations
        │                          the Playground's writes move server-side
        ▼
   ▓▓ Phase 2 · Core Content ▓▓    PR 8–10     live but unlinked
        │                          Projects · Learn · Prompts · What's New
        ▼
   ██ Phase 3 · Playground ██      PR 11–13    ← THE CUTOVER (PR 13)
        │                          Arena · 3 challenges · guest play
        ▼
   ██ Phase 4 · Member Layer ██    PR 14
        │                          account · XP · levels · skills · dashboard
        ▼
   ██ Phase 5 · Growth Loop ██     PR 15
        │                          verified achievements · share cards · CTA
        ▼
   ██ Phase 6 · Commerce ██        PR 16
        │                          Stripe · entitlements · downloads
        ▼
      v3 Complete
```

**Read the shading as risk to production.** Phases 0–1 cannot break a visitor's
experience because no visitor reaches them. Phase 2 ships routes nothing links
to. Everything a visitor actually sees changes in **one revertable commit**, PR
13 — and everything after it is additive.
