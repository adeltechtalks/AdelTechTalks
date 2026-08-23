# V3_IMPLEMENTATION_PLAN

**Status:** proposal. **Revised in v3.1** — §2 (new components), §4 (Phase 0 and
Phase 2 change), §5 (three new risks), §7 (new gates) and §8. This is the document
that has to be right before any production-facing code is written.

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
| `pages/HomePage` | recomposed to the four-act narrative — BUILD, PLAY, LEARN, SHIP (`V3_INFORMATION_ARCHITECTURE.md` §5) |
| `home/Hero` | positioning line, Now modules, two actions |
| `home/Exploring` | becomes the **Now** trio, reading live project/feed data instead of static copy |
| `home/Latest` | becomes **What's New**, four-slot editorial structure |
| `home/LearnSection` | outcome rails instead of file-type rows |
| `home/PlaygroundSection` | the PLAY act: an inline, server-scored, playable challenge — Choose or Repair, never Create |
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

**Core:** `Tabs` `Accordion` `Dialog` `Toast` `Menu` `Avatar` `Input` `Select` `Checkbox` `Switch` `FieldGroup`
**Learning:** `CourseCard` `LessonCard` `LearningPath` `ProgressBar` `PromptCard` `ResourceCard` `ChallengeCard` `QuizState` `CompletionState`
**Gamification:** `XPIndicator` `XPGain` `Level` `LevelProgress` `BadgeMedallion` `Achievement` `Streak` `ChallengeComplete` `AchievementCard` `VerificationMark` `ContextualCTA`
**Launch state (v3.1):** `EmptyState` `PreviewCard` — see `V3_DESIGN_SYSTEM.md` §2.6
**Project:** `BuildCard` `BuildTimeline` `BuildStatus` `ExperimentCard` `LatestUpdate`
**What's New:** `WhatsNewCard` `WhatsNewEntry`
**Server:** `src/server/{auth,entitlements,xp,badges,scoring,achievements,stripe,storage,ratelimit}.ts`
`achievements.ts` is new in v3.1 and owns the ownership proofs and the public
snapshot derivation. It is the only module that writes `achievement_verifications`.

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

### Phase 0 — foundations, one behaviour-identical change
Migrations 01–05 **and 07** on a Supabase branch · `src/server/*` with session
verification · rate limiting · the `entitlements` resolver against an empty table ·
CI secret grep · RLS assertion tests · the policy audit.

**Amended in v3.1.** Phase 0 no longer ships *nothing* user-visible. Migration 07
revokes the client's write access to `playground_track_badges` and `progress`, and
the live v2.x Playground writes both directly from the browser today. So Phase 0
also ships two shim endpoints — `POST /api/playground/progress` and
`POST /api/playground/complete` — that perform exactly those writes from the
server, with the user derived from the verified session.

Nothing moves on screen. The Playground behaves identically. **The authority
moves**, which is the whole point, and the alternative — leaving the legacy path
client-writable until Phase 2 — is the indefinite legacy path the review rejected.

Verification for this phase is therefore not "byte-identical output" but
"byte-identical output *except* the Playground's network calls, and the Playground
behaves identically end to end". Both are tested.

### Phase 1 — Design System v3
New tokens, new component families, Figma library. Built in isolation, verified against v2.x pages for zero visual change. Motion tiers 1–3 formalised, 4–5 built.

### Phase 2 — the v3 foundation release *(the first thing a visitor sees)*
New IA and navigation · redesigned homepage in the four acts · Learn outcome paths ·
Prompts with save-to-account · Projects (with `/vibe-coding` redirects) · What's New ·
**Prompt Arena, live, with nine real challenges** · Join Free and `/account` ·
XP, levels, badges · `/achievements/[id]` with server-authoritative publishing and
generated cards · contextual CTAs · `/gear` redirects · the Canva template set.

**Two v3.1 changes to what this phase means.**

*Playground is not a shell.* "Playground shell with one real challenge" was the v3
scope and it is a bench. Prompt Arena opens with three Choose, three Repair and
three Create challenges, or `/playground/` does not open (`V3_GAMIFICATION.md`
§7.1). This is a **publication gate**: the engine ships regardless; the route waits
for content.

*Achievement publishing is server-side from the first line of code.* There is no
interim client-write version, not even behind a flag, not even in a preview
deploy. A preview deploy with a self-issuable achievement is a live one for anyone
who finds it.

### Phase 3 — commerce
Migration 06 · Stripe Checkout and Portal · webhook · course engine and lesson player · protected downloads · purchases in the dashboard.

### Phase 4 — depth
Prompt Arena's later experiences · **model-assisted Create scoring, which is what
unlocks `prompt-architect` and score-gated badges on Create** · Build achievements
(`user_badges.source_type = 'build'`) · **legacy retirement stage 3** (migration 07)
· workshops · richer dashboard · Content OS phases 2–3 · community.

**Phase 2 is the release that matters and it is large.** It can be split behind a
flag: ship the new IA and homepage first, then Playground and gamification two
weeks later. The redirects must land with the IA, in the same deploy.

**v3.1 caveat on that split.** If the homepage ships first, its PLAY act ships
with it — and the PLAY act *is* Prompt Arena. So the split is not
"homepage, then Playground"; it is "homepage **including the inline challenge**,
then the full Arena, achievements and sharing". The inline challenge needs the
scoring endpoint and the anonymous attempt path, which means those are in the
first half of the split, not the second.

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
| **14** | **Self-issued public achievement** — the defect v3.1 corrects | **critical** | no client write policy or grant on `achievement_verifications`; ownership proven server-side; the hostile-client suite in `V3_API_SURFACE.md` §2.4 is a CI gate |
| **15** | **The legacy client-writable path outlives its retirement date** | **high** | migration 07's three stages have verifiable preconditions, and the policy audit in `V3_SECURITY_MODEL.md` §9 lists any table that regains a client write policy |
| **16** | **Prompt Arena ships thin and Playground reads as a demo** | **high** | nine-challenge publication gate; the route does not open below it. Content is the gate, not the schedule |
| **17** | A self-assessed Create score is treated as evidence | high | `scored_by` on every attempt; the publish endpoint and the badge evaluator both refuse `self_assessed`, both tested |

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
| security | new | secret grep of built client output for secret **values**; redirect validation unit tests; webhook invalid-signature and duplicate-event tests; download without entitlement fails closed; **the full hostile-client suite for `/api/achievements/publish`**; **the policy audit query**, asserting the only client-writable tables are `saved_prompts` and `subscribers` |
| commerce | new | Stripe test-mode end-to-end: checkout → webhook → entitlement → access; refund → revoke |
| performance | new | Lighthouse budget on `/`; 4× CPU throttle for motion; LCP unaffected by hero animation |
| production smoke | extend the v2.x script | routes 200; metadata; no role/employer in any `<head>`; redirects resolve single-hop; `/badge/[id]` still resolves post-migration |

**Five release gates that are not negotiable** *(three added in v3.1):*

1. The homepage is verified in its **empty state** — no projects, no courses, no resources, no challenges — before it is verified with content.
2. `/badge/<a real live id>` is fetched from production immediately after migration 03 and must render the same name and badge it rendered before.
3. **Every row of the hostile-client table** (`V3_API_SURFACE.md` §2.4) passes. A signed-in test user cannot mint a verification for a badge they do not hold, by any route, including a direct anon-key insert.
4. **The policy audit returns exactly `saved_prompts` and `subscribers`.** Any other table with a client `insert`/`update`/`delete` policy fails the release until it is justified in writing against the §5 test in the Security Model.
5. **`/playground/` does not open below nine published challenges.** Asserted by the same build check that gates a Gear story on its photograph.

---

## 8 · Consistency check across the twelve documents

Verified before sign-off. The v3 version of this list is what let the achievement
defect through: it checked that the documents *agreed with each other*, and they
did — the migration and the gamification document told the same wrong story. The
v3.1 list therefore includes checks that are about the system rather than about
the prose.

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

**Added in v3.1:**

- Achievement publishing is server-authoritative: migration 03, API Surface §2, Security §5.1, Gamification §6.1, Data Model §2.5, Risk 14, QA gate 3. Consistent.
- Nothing client-written is treated as evidence: migrations 02/03/05/07, Security §5, Gamification §2, Data Model §2.2. Consistent.
- Legacy retirement has a terminal state: migration 07, Data Model §5, Plan §4 (Phase 0, Phase 4), Risk 15. Consistent.
- Self-assessed scores are not evidence: migration 05 (`scored_by`), Gamification §5/§7.3, API Surface §2/§3, Risk 17. Consistent.
- BUILD → PLAY → LEARN → SHIP: Blueprint §2, IA §5, Motion §2.5. Consistent.
- Playground launches with real content: Blueprint §8, Gamification §7.1, Plan §4 Phase 2, QA gate 5. Consistent.
- Three launch states, and Preview is bounded: Blueprint §8, Design §2.6, IA §5, Motion §5. Consistent.
- Contextual acquisition, never a generic join on a shared page: Gamification §6.5, IA §5, Design §2.3. Consistent.
- Achievement cards are generated, never authored: Gamification §6.4, Design §4, Canva §2/§3. Consistent.
- Figma is the source of truth, Canva the surface: Design §3/§4, Canva §1/§6, Content OS §6. Consistent.

**Two things this list deliberately does not claim.** It does not claim the design
is right — that is the prototype's job. And it does not claim the documents are
complete: the open items in `README.md` are open, and the Arabic strings marked
`‹author›` are still unwritten.
