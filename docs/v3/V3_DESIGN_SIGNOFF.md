# V3 — Design Sign-Off Record

**The design phase is closed.**
**Design artifact:** https://claude.ai/code/artifact/becad32a-445e-493b-a685-9a9eee36ca4b
**Branch carrying the approved state:** `claude/adeltechtalk-final-design-4nc4fr`
**Production:** untouched. `main` is at the v2.x release and stays there until a controlled merge.

This file exists so that "what was approved, and when" is answerable from the
repository rather than from a chat log. Anything not listed as approved here is
not approved.

---

## 1 · Approval state

| area | state |
|---|---|
| Architecture v3.1 | **APPROVED** |
| Design direction | **APPROVED** |
| Motion system | **APPROVED** |
| Playground direction | **APPROVED** |
| Gamification direction | **APPROVED** |
| Achievement / sharing direction | **APPROVED** |
| RTL architecture and layout | **APPROVED** |
| **Arabic final copy and typography** | **PENDING NATIVE FINAL REVIEW** |

**Approved design elements, carried forward unchanged:** the personal-first Adel
hero · the existing AdelTechTalks visual identity · I ❤️ Tech · Right Now · What
I'm Building · outcome-based learning paths · Prompt Arena · Prompts I Actually
Use · "Something changed. Does it matter?" · the member progress concept ·
BUILD → PLAY → LEARN → SHIP · the scroll spine and act system.

**Approved design decisions are closed.** They reopen only if implementation
reveals a genuine technical, accessibility, security or usability problem — and
then the problem is stated first and the change second.

---

## 2 · Decisions taken at sign-off

### 2.1 Baton copy — final

The three connectives that make the homepage a narrative rather than four
sections:

1. **What I learn while building becomes something you can try.**
2. **Play it. See what worked. Learn why.**
3. **Then use it to ship something of your own.**

They stay **connective tissue** — one line between acts with a drawn connector
above and below. They must not grow into standalone content sections, gain
subheadings, or acquire their own CTAs.

### 2.2 Hero CTA — final

**Try a 60-second challenge**, replacing *Start Learning*. It leads directly into
the playable Arena. The homepage's job is to let a visitor experience value
before it asks for anything.

### 2.3 Scoring — dimensions approved, implementation constrained

Approved dimensions: **Clarity · Context · Constraints · Structure ·
Usefulness**. They are shown to the learner because the breakdown is teaching
material.

**Constraint, and it is binding:** weights and rules are **not** hardcoded into
presentation or UI components. A rubric is a versioned data object; a challenge
names one; the evaluator reads it. The server stays authoritative for anything
persisted — score, XP, achievements.

### 2.4 Launch badges

| badge | requirement (data, not code) |
|---|---|
| Prompt Repairer | `{type:'challenge_score', skill:'prompting', min:70}` |
| Prompt Builder | `{type:'challenge_count', skill:'prompting', min:3}` |

Both thresholds are **current design values**, held in the catalogue row and
changed by editing one number. They are not conditions written into components.

### 2.5 Playground launch gate — changed

**Nine challenges are no longer required.** v3 launches with **three excellent,
complete, genuinely playable challenges**, provided the whole loop works:

> challenge → score → explanation → XP → badge where earned → save progress →
> try another → share where applicable

The gate is the loop, not the count. The library must expand past nine
immediately after launch **without a code change**.

### 2.6 Guest-first — confirmed

A visitor opens the Arena, completes a challenge, receives a real score, sees the
breakdown, receives provisional XP and sees a badge unlock — **all before any
account exists**. Only then does *Save your XP and badge → Join Free* appear, and
signing up **claims the existing progress**. A visitor is never asked to replay a
challenge they have already completed.

### 2.7 Arabic — approved architecture, unapproved content

RTL architecture and layout direction are approved. Arabic **content and
typography are not**. Before production release:

- review Arabic in the real **KO Ghorab** face, not the board's Readex fallback
- author final Arabic copy naturally — never translated
- review navigation labels, level names, and Preview/member copy
- test embedded English technical terms
- test Prompt Arena independently in RTL
- test mobile RTL independently
- verify no bidi corruption and no layout collisions

**Provisional Arabic on the design board is not production copy** and must not be
copied into the codebase.

---

## 3 · What changed in the repository at sign-off

| file | change |
|---|---|
| `docs/v3/prototype/atc-v31-prototype.html` | final baton copy; launch gate 3; rubric and badge criteria moved into configuration |
| `docs/v3/V3_GAMIFICATION.md` | §5 criteria as data; §7.1 gate is the loop, not a count; the rubric is a versioned object |
| `docs/v3/V3_IMPLEMENTATION_PLAN.md` | Phase 2 scope, QA gate 5, risk 16 |
| `docs/v3/README.md` | decision list and open items |
| `docs/v3/V3_DESIGN_SIGNOFF.md` | this file |
| `docs/v3/V3_IMPLEMENTATION_MASTER_PLAN.md` | the plan for the next phase |
