# V3_GAMIFICATION

**Status:** proposal. XP, levels, badges and the achievement share loop ship in the v3 foundation. Prompt Arena's full challenge set ships in Phase 2.

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
| save a first prompt | 5 | prompting |

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

| key | name | requirement |
|---|---|---|
| `prompt-builder` | Prompt Builder | complete 3 prompting challenges |
| `prompt-architect` | Prompt Architect | score ≥90 on a Create challenge |
| `first-ai-workflow` | First AI Workflow | complete the automation path |
| `vibe-coder` | Vibe Coder | complete the Vibe Coding course |
| `website-builder` | Website Builder | complete Launch a Website with AI |

Locked badges show their **requirement**, not a mystery silhouette. "Score 90 on a Create challenge" is an invitation; a grey question mark is a tease.

### Evaluation

After any XP event or challenge completion, the evaluator checks only the badges whose requirement type could have been affected — not the whole catalogue. Awards are idempotent on `(user_id, badge_key)`.

---

## 6 · Public achievements — the acquisition loop

```
/achievements/[verification-id]
```

Server-rendered (`prerender = false`), because LinkedIn's crawler does not run JavaScript — the same reason `/badge/[id]` is server-rendered today, and the same mechanism.

**Shows:** display name (frozen at share time) · badge art, name, description · date earned · level and XP when the user opted to include them · a verification state · one honest CTA.

**Never shows:** email, progress detail, attempt payloads, scores on other challenges, anything about anyone else.

Sharing is opt-in and reversible: earning writes `user_badges`; sharing writes `achievement_verifications`; un-sharing deletes that row and the page 404s while the badge stays earned. This is exactly the `shares` design from v2.x, generalised — including the trade-off comment that explains why a public row exists at all.

### The OG card

1200×630, generated by the same token-driven pipeline as `scripts/build-og-adel.mjs`, so it cannot drift from the site's colours.

Composition: warm-white ground, Signature Blue edge rule, `ADELTECHTALKS` eyebrow, the badge medallion, the badge name in Montserrat 800, "{display name} earned this on {date}", `adeltechtalks.com` — and the heart, when it appears, is Signature Blue, never red.

Generated **on demand and cached at the edge**, keyed by verification id. Pre-generating one PNG per possible badge per user does not scale and is not needed. `og:title`, `og:description`, `og:image`, `twitter:card=summary_large_image` are all set from the row.

### Why this loop should work

The person posting has something true to say ("I scored 94 on this"), the page proves it, the card is branded, and a stranger who clicks lands on a page that explains what AdelTechTalks is and offers the same challenge. No incentive to spam, because the badge is only interesting if it was earned.

---

## 7 · Playground and Prompt Arena

Playground is the container; Prompt Arena is the first experience in it. **The architecture must not assume prompting.**

```
Experience  (git)   slug, title, skill, description, format set, status
  └── Challenge (git)   slug, format, payload, rubric, rubric_version, XP
        └── Attempt (db)   score, dimensions jsonb, payload, duration
```

Three formats at launch:

| format | the task | scored by |
|---|---|---|
| **Choose** | pick the strongest of N prompts | exact match + explanation shown either way |
| **Repair** | improve a weak prompt | rubric against the named weaknesses |
| **Create** | write one from scratch | rubric across the dimensions |

Prompting dimensions: clarity · context · constraints · specificity · output structure · usefulness. **These are the prompting rubric, not the platform's rubric.** A Vibe Coding challenge will score something else entirely, which is why `dimensions` is `jsonb` and why the rubric ships with the challenge rather than with the engine.

Future tracks slot in unchanged: Vibe Coding, Vibe Designing, AI Workflows, Automation, AI Business, AI/Tech literacy.

### Scoring is server-side

`POST /api/challenge/score`. Choose and Repair are deterministic. Create needs judgement, and there are two options:

- **Foundation:** a rubric checklist the learner self-assesses against a worked model answer, with XP awarded for completion rather than for score. Honest, cheap, and it teaches — reading a model answer against your own attempt is most of the value.
- **Phase 2:** model-assisted scoring behind the server, with the rubric in the prompt and the score shown as guidance with its reasoning.

Foundation ships the first. **Never a fake score** — no client-side heuristic dressed up as an evaluation.

### Anonymous play

The homepage challenge is playable signed-out, and scored. The attempt is stored against an opaque browser key, and at sign-up recent attempts are claimed and their XP awarded. That is the conversion moment: the visitor has already done the work, and the account is how they keep it.

---

## 8 · Presentation rules

- **XP gain:** "+40 XP" rises and fades once, 400ms, and the total counts up. Announced in a live region. No confetti.
- **Level up:** ring completes, name cross-fades. ≤900ms, one shot.
- **Badge unlock:** medallion scales up with a single Signature Blue ring expanding once. 700ms. One ring, no particles.
- **Never a number the system cannot compute.** No fake progress bars, no "83% of learners", no invented leaderboards.
- **Streaks appear only when real**, and never as pressure. No "don't break your streak" copy.
- **Everything is announced.** A screen-reader user learns they scored 84 and earned Prompt Architect without seeing any animation.
- Mint stays inside its 3% ceiling — an XP tick and three earned badges cannot all be mint in one viewport.
