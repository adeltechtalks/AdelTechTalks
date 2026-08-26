# V3_GAMIFICATION

**Status:** **APPROVED at design sign-off.** Revised in v3.1 — §2, §5, §6 and §7; §5 and §7.1 revised again at sign-off (configurable criteria; the launch gate is the loop, not a count). XP, levels, badges and the achievement share loop ship in the v3 foundation. Prompt Arena ships **live, with a real challenge set**, in Phase 2; model-assisted Create scoring in Phase 4.

**Framing:** this is a **service**, not page behaviour. One module awards XP, one module evaluates badges, one component renders a level. If challenge pages, lesson pages and project pages each grow their own XP logic, the numbers will disagree within a month and nobody will be able to say which is right.

---

## 1 · What gamification is for here

It is not engagement decoration. It has two jobs:

1. **Make progress legible.** "I have learned things" is vague; "620 XP, Builder, 4 badges, strongest in Prompting" is specific, and specific is motivating.
2. **Give people something to post.** A public achievement page with a branded OG card is a credible thing to share on LinkedIn, and it is the cheapest acquisition channel this product has.

It is explicitly **not** for manufacturing daily-return pressure. No streak guilt, no "you're about to lose your progress", no artificial scarcity. Those work, and they are not what Adel's voice sounds like.

---

## 2 · XP

### Awarding

Every award goes through one function:

```ts
awardXP({
  userId, amount, reason, skill?, subjectType, subjectId, idempotencyKey
})
```

Server-side only, always. It appends to `xp_events`, then updates the `xp_balances` and `skill_progress` caches in the same transaction.

**And "server-side" now has a stricter meaning than the v3 draft gave it.** Every
input to an award must itself be server-derived. An award triggered by a
client-written row is a client-issued award with extra steps — which is why
`lesson_progress` became server-written and the saved-prompt award was dropped.

**`idempotencyKey` is required and is the reason the numbers can be trusted.** Deterministic per achievement: `lesson:launch-a-website/03:completed`, `challenge:prompt-repair-01:perfect`. Re-running an award is a unique-constraint conflict and a no-op. Without it, a double-click, a retried request and a re-completed lesson each inflate the total, and event sourcing merely records the inflation faithfully.

### The table

| event | XP | skill |
|---|---|---|
| complete a lesson | 20 | course's skill |
| complete a course | 150 | course's skill |
| complete a challenge | 25 | challenge's skill |
| perfect challenge score (≥90) | +25 bonus | same |
| first attempt at a new experience | 10 | experience's skill |
| complete a learning path | 100 | path's skill |

**v3.1 removed "save a first prompt · 5 XP".** `saved_prompts` is the one table a
client still writes directly, because a bookmark confers nothing — and the moment
it awards XP, it confers something, and the server would be issuing an award on
the evidence of a row the client wrote. Five XP is not worth either making the
table server-written or making an exception to the rule. If saving a prompt
should ever earn XP, `saved_prompts` becomes server-written first.

Values live in one config file (`src/config/xp.ts`), not scattered at call sites, so the economy can be rebalanced in one diff. **Rebalancing does not rewrite history** — past events keep the amount they were awarded. If a rebalance must apply retroactively, that is a deliberate replay against `xp_events`, reviewed like a migration.

### Never awarded for

Page views, scrolling, time on site, logging in, returning. XP tracks *doing*, and inflating it with attendance makes every number meaningless.

---

## 3 · Levels

Config, never business logic:

```ts
export const LEVELS = [
  { key: 'explorer',   min: 0,    name: { en: 'Explorer',   ar: '‹author›' } },
  { key: 'builder',    min: 250,  name: { en: 'Builder',    ar: '‹author›' } },
  { key: 'maker',      min: 750,  name: { en: 'Maker',      ar: '‹author›' } },
  { key: 'operator',   min: 1800, name: { en: 'Operator',   ar: '‹author›' } },
  { key: 'ai-builder', min: 4000, name: { en: 'AI Builder', ar: '‹author›' } },
];
```

`xp_balances.level_key` stores the **key**. Nothing in the codebase, the database or a query compares against a display name. Renaming "Maker" is a config edit; adding a sixth tier is one array entry plus a threshold review.

The curve is deliberately shallow early and steep late: Explorer → Builder is reachable in one good session, which is when someone decides whether this is worth returning to. AI Builder is a real commitment, which is what makes it worth having.

Arabic level names are `‹author›` placeholders. They are brand vocabulary and must be authored in Arabic, not translated.

---

## 4 · Skill tracks

Five, each with total XP of its own alongside the general total:

`prompting` · `coding` · `design` · `automation` · `business`

Every XP event may carry one `skill` or none. A skill's XP is a subset of the total, never a separate currency — one action awards once, and the skill field says which shelf it also lands on. Two currencies would immediately raise "which one counts?" and there is no good answer.

Skill XP surfaces as a profile shape — "strongest in Prompting, nothing yet in Automation" — which is genuinely useful, because it tells someone what to try next. That is its purpose; it is not a second leaderboard.

---

## 5 · Badges

### The record

Every badge carries: **stable key** (never reused, never renamed) · name · description · icon · machine-readable requirement · skill category · tier · earned timestamp · verification URL when shared · share metadata.

The key is permanent. Reusing `prompt-builder` for a different achievement would silently rewrite what an already-posted LinkedIn link claims.

### Requirements are data

```json
{ "type": "challenge_score",  "challenge": "prompt-repair-01", "min": 90 }
{ "type": "xp_threshold",     "skill": "prompting",            "min": 500 }
{ "type": "course_completed", "course": "launch-a-website-with-ai" }
{ "type": "count",            "of": "challenge_completed",     "min": 10 }
```

A single evaluator reads these. Adding a badge is a catalogue row, not a deploy.

### Launch set

**Criteria are configuration, not UI logic** (design sign-off §5). Each row
below is a `requirement` object on the catalogue row, read by one evaluator.
Moving the qualifying score from 70 to 75, or three challenges to five, is one
number in one place — never a condition written into a component.

| key | name | requirement | ships |
|---|---|---|---|
| `prompt-repairer` | Prompt Repairer | `{type:'challenge_score', skill:'prompting', min:70}` | launch |
| `prompt-builder` | Prompt Builder | `{type:'challenge_count', skill:'prompting', min:3}` | launch |
| `prompt-architect` | Prompt Architect | `{type:'challenge_score', format:'create', min:90, requires:'model_assisted'}` | Phase 4 |
| `first-ai-workflow` | First AI Workflow | `{type:'path_completed', path:'automate-my-work'}` | later |
| `vibe-coder` | Vibe Coder | `{type:'course_completed', course:'vibe-coding-to-a-real-product'}` | later |
| `website-builder` | Website Builder | `{type:'course_completed', course:'launch-a-website-with-ai'}` | later |

Locked badges show their **requirement**, not a mystery silhouette. "Score 90 on a Create challenge" is an invitation; a grey question mark is a tease.

**`prompt-architect` cannot be earned at foundation, and v3.1 says so rather than
shipping it hollow.** Its requirement names a minimum score on a Create challenge,
and Create is self-assessed until Phase 4. A self-assessed 100 is not evidence, so
the badge would be self-issued. It ships **visible and locked**, with its
requirement and an honest state — *"opens when Create challenges are scored"* —
which is a promise the system can keep, unlike a badge that quietly grades itself.

### Evaluation

After any XP event or challenge completion, the evaluator checks only the badges whose requirement type could have been affected — not the whole catalogue. Awards are idempotent on `(user_id, badge_key)`.

**The evaluator refuses self-assessed evidence** (v3.1). A `challenge_score`
requirement reads only `challenge_attempts` rows where `scored_by <>
'self_assessed'`. This is enforced in the evaluator, not in the UI, and it is a
CI test: given a `self_assessed` attempt scoring 100, no score-gated badge is
awarded.

---

## 6 · Public achievements — the acquisition loop

**Rewritten in v3.1.** One infrastructure, three kinds of achievement, and a
server that decides what is true.

```
/achievements/[verification-id]
```

Server-rendered (`prerender = false`), because LinkedIn's crawler does not run
JavaScript — the same reason `/badge/[id]` is server-rendered today, and the same
mechanism.

### 6.1 Publishing is server-authoritative

The v3 draft let the browser insert the verification row. It does not any more,
and the reasoning is in `V3_SECURITY_MODEL.md` §5.1. The loop is now:

```
earning     → user_badges / enrollments / challenge_attempts   (server writes)
sharing     → POST /api/achievements/publish                   (server proves, then writes)
un-sharing  → POST /api/achievements/unpublish                 (soft revoke, same id)
```

The publish endpoint takes a `subject_type`, a `subject_id` and a `show` consent
object, and **nothing else**. It refuses a request carrying a display name, a
score, an `earned_at`, a level, an XP figure or a `user_id` — refuses with a 400,
not by silently ignoring the field. Every value on the public page is re-derived
server-side from the record that proves ownership. Full contract:
`V3_API_SURFACE.md` §2.

Un-sharing is a soft revoke. The page 404s at once, the badge stays earned, and
the id survives — so publishing again restores the *same URL* instead of
orphaning every link already posted. That is a change from the v3 draft, which
deleted the row.

### 6.2 Three kinds, one page, one card

| kind | proven by | the page says |
|---|---|---|
| **badge** | a `user_badges` row and an active catalogue entry | "earned the Prompt Builder badge" |
| **course** | `enrollments.completed_at` | "completed *Launch a Website with AI*" |
| **challenge** | a best `challenge_attempts` row with `scored_by <> 'self_assessed'` | "scored 94 on *Prompt Repair 01*" |

One route, one card generator, one ownership check per kind. Three separate
achievement systems would be three separate chances to get the ownership check
wrong, and the one that got it wrong would be the one nobody reviewed twice.

**Build achievements ship in Phase 4 and are deliberately not a fourth kind.**
They are badges awarded on a verified build submission
(`user_badges.source_type = 'build'`), so they inherit the badge ownership check
rather than needing one invented for them.

### 6.3 What the page shows, and what it never shows

**Shows:** the achievement title and art · the display name frozen at publish time
· the date earned · the score, for challenge achievements, when the person
consented to show it · level and XP only when explicitly consented · a
verification statement · **one contextual CTA** (§6.5).

**Never shows:** email, progress detail, attempt payloads, other challenges,
other achievements, anything about anyone else, any count of how many people hold
the badge.

The display name is sanitised server-side before it is ever stored: normalised,
control and bidi-override characters stripped, capped at 48 characters, rejected
if it carries a URL or an `@`. An account with no display name **cannot publish**
— the endpoint returns 409 and the UI sends the person to their profile. It never
falls back to the email local part; a public page is not the place to discover
that a convenience was a leak.

### 6.4 The share card

1200×630, generated by the same token-driven pipeline as
`scripts/build-og-adel.mjs`, so it cannot drift from the site's colours.

| element | source |
|---|---|
| warm-white ground, Signature Blue edge rule | tokens |
| `ADELTECHTALKS` eyebrow | fixed |
| achievement art — badge medallion, course mark, or challenge mark | the kind |
| achievement title, Montserrat 800 | the snapshot |
| "{display name} · {date}" | the snapshot |
| score, when consented | the snapshot |
| verification line — "Verified achievement" | fixed |
| `adeltechtalks.com/achievements` | fixed |

The heart, wherever it appears, is Signature Blue `#2563EB`. Never red — that was
fixed in v2.x and the card inherits the corrected pipeline.

**Never on the card:** an email, a level or XP the person did not consent to, any
other member, any other achievement, a rank, or a count. A share card is a public
image with no access control; it carries only the row's consented fields.

Generated **on demand and cached at the edge**, keyed by verification id plus a
short version token derived from `published_at` — so a re-publish busts the cache
and a stale card cannot outlive the row it was made from. `og:title`,
`og:description`, `og:image` and `twitter:card=summary_large_image` are all set
from the row.

**Arabic cards** render in the achievement's snapshot language. Arabic titles set
in KO Ghorab at ≥24px; Latin product names stay Latin inside LTR islands; Western
digits. **If no authored Arabic title exists for the achievement, the card renders
the English title** — the no-machine-translation rule applies to generated images
exactly as it applies to pages.

### 6.5 The contextual acquisition loop

**Rewritten in v3.1.** A stranger who clicks a share link has done nothing yet,
and "Join AdelTechTalks" asks them to commit before they have any reason to. The
CTA names the thing they just looked at:

| where the visitor is | the CTA |
|---|---|
| a challenge achievement page, score shown | **"Think you can beat 94?"** → the same challenge, playable immediately, no account |
| a challenge achievement page, score withheld | **"Try Prompt Arena"** → the same challenge |
| a course achievement page | **"See what this course teaches"** → the course landing |
| a badge achievement page | **"Earn this badge"** → the requirement, then the thing that satisfies it |
| just finished a challenge, signed out | **"You scored 84. Create a free account to keep it."** |
| just finished a challenge, signed in | **"Next: {the next challenge in the track}"** |

The rule underneath all six rows: **do the thing → see your result → then the
account is how you keep it.** The account is never the first ask on a page reached
from a share.

Two constraints on "Think you can beat it?": it appears only when the achiever
consented to show the score, and the score it names is the one on the row — if the
verification is revoked the page 404s and the question never gets asked.

### 6.6 Why this loop should work

The person posting has something true to say ("I scored 94 on this"), the page
proves it — *actually* proves it, now — the card is branded, and a stranger who
clicks lands on the same challenge rather than on a sign-up form. No incentive to
spam, because the achievement is only interesting if it was earned, and after
v3.1 it can only exist if it was.

---

## 7 · Playground and Prompt Arena

**Revised in v3.1: Playground does not launch as a Coming Soon page.** It launches
with one genuine, complete, playable experience, or it does not launch.

Playground is the container; Prompt Arena is the first experience in it. **The
architecture must not assume prompting.**

```
Experience  (git)   slug, title, skill, description, format set, status
  └── Challenge (git)   slug, format, payload, rubric, rubric_version, XP
        └── Attempt (db)   score, dimensions jsonb, payload, duration, scored_by
```

### 7.1 The launch gate — the loop, not a count *(revised at design sign-off)*

Prompt Arena opens with **three excellent, complete, genuinely playable
challenges**, provided the whole loop works end to end:

> challenge → score → explanation → XP → badge where earned → save progress →
> try another → share where applicable

**The gate is the loop, not the number.** The earlier draft required nine, and
that was the wrong thing to measure: a ninth challenge adds content, while a
broken save step makes the other eight worthless. Three challenges that carry a
learner all the way through the loop is a product; nine that dead-end at the
score is a demo with better stocking.

Two conditions hold this honest:

1. **Complete means complete.** A challenge ships with its rubric, its
   explanations for every rule, its XP value and its badge eligibility. A
   challenge that scores but cannot explain itself is not one of the three.
2. **Nothing in the engine assumes three.** The library expands past nine
   immediately after launch by adding front matter, with no code change. If
   adding a fourth challenge requires a deploy, the gate has been met the wrong
   way.

### 7.2 Three formats at launch

| format | the task | scored by | `scored_by` |
|---|---|---|---|
| **Choose** | pick the strongest of N prompts | exact match; the explanation is shown either way | `deterministic` |
| **Repair** | improve a weak prompt against named weaknesses | rubric checks the server can evaluate | `deterministic` |
| **Create** | write one from scratch | the learner grades their own attempt against a worked model answer | `self_assessed` |

Prompting dimensions, approved at sign-off: **Clarity · Context · Constraints ·
Structure · Usefulness**. They are shown to the learner because the breakdown is
teaching material — the learner should finish a challenge knowing which rule they
missed and why it exists.

**The rubric is a versioned data object, never code in a component.** A challenge
names a rubric id (`prompting.repair.v1`); the rubric declares its dimensions,
their weights and their rules; a separate table declares how each rule is
measured. A new track adds a rubric and its rules without touching a single
component, and the identical evaluator runs server-side — which is what makes the
persisted score authoritative. **These are the prompting rubric, not the platform's rubric.** A Vibe Coding
challenge will score something else entirely, which is why `dimensions` is
`jsonb` and why the rubric ships with the challenge rather than with the engine.

### 7.3 Create, and the thing v3.1 had to correct

Create is self-assessed at foundation: the learner writes their attempt, then sees
a worked model answer and the rubric, and grades themselves against it. Reading a
model answer beside your own attempt is most of the value, and it is honest —
**never a fake score**, no client-side heuristic dressed up as an evaluation.

What the v3 draft did not say is what that score is *worth*. It is worth
completion XP and nothing else:

- it is stored with `scored_by = 'self_assessed'`
- it **cannot** satisfy a badge requirement that names a minimum score
- it **cannot** be published as a verified achievement
- consequently `prompt-architect` ships locked, with an honest state, until
  Phase 4 brings model-assisted scoring behind the server

Both refusals live in the evaluator and the publish endpoint, not in the UI.

### 7.4 Extensible beyond prompting

Future experiences slot in with no engine change: Vibe Coding, Vibe Designing, AI
Workflows, Automation, AI Business, AI/Tech literacy. Each brings its own
challenge definitions, its own rubric and its own dimension set. What it does not
bring is its own scoring engine, its own XP path or its own achievement table.

At launch these appear on the Playground hub in the **preview state** described in
`V3_PRODUCT_BLUEPRINT.md` §8 — named, labelled as not yet open, not clickable
into an empty page, and carrying no invented date. A future experience that has no
real commitment behind it is simply absent.

### 7.5 Anonymous play

The homepage challenge is playable signed-out and scored. The attempt is stored
against an opaque browser key with no PII, and at sign-up recent attempts are
claimed, their `anon_key` cleared, and their withheld XP awarded. That is the
conversion moment: the visitor has already done the work, and the account is how
they keep it.

Anonymous attempts are rate-limited per IP, expire after 30 days, and can never
be published — publishing requires a session and an ownership record, and an
anonymous attempt has neither.

---

## 8 · Presentation rules

- **XP gain:** "+40 XP" rises and fades once, 400ms, and the total counts up. Announced in a live region. No confetti.
- **Level up:** ring completes, name cross-fades. ≤900ms, one shot.
- **Badge unlock:** medallion scales up with a single Signature Blue ring expanding once. 700ms. One ring, no particles.
- **Never a number the system cannot compute.** No fake progress bars, no "83% of learners", no invented leaderboards.
- **Streaks appear only when real**, and never as pressure. No "don't break your streak" copy.
- **Everything is announced.** A screen-reader user learns they scored 84 and earned Prompt Architect without seeing any animation.
- Mint stays inside its 3% ceiling — an XP tick and three earned badges cannot all be mint in one viewport.
