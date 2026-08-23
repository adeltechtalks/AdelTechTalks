# V3_DESIGN_SYSTEM

**Status:** proposal. **Revised in v3.1** — §2.3 (achievement and state
components), §2.6 (launch-state components), and §4, which now points at the
dedicated `V3_CANVA_PRODUCTION_SYSTEM.md` for production.
**Relationship to v2.1:** additive evolution, not replacement. Every existing token keeps its name and value. v3 adds semantic layers and component families on top. A v2.x page rendered against v3 tokens must look identical.

---

## 0 · The identity, unchanged

These are not up for revision:

Signature Blue `#2563EB` · warm-light and graphite direction · Liquid Glass as an accent · **I ❤️ Tech** with the drawn Signature Blue heart · the AdelTechTalks lockup · clean editorial typography · English and Arabic both first-class.

**What v3 must avoid looking like:** a generic AI startup (purple gradient mesh, abstract neural hero, dark-mode-only), an online course platform (stock smiling learners, progress-bar soup, badge confetti), or a tech publication (dense feed, no author). The corrective is present in v2.x and is amplified in v3: **a real photograph of a real person is the largest thing on the homepage.**

---

## 1 · Foundations

### 1.1 Colour — CS v3.0

The v2.0 palette is the v3 palette. Nothing is retired, nothing is recoloured.

| role | token | value |
|---|---|---|
| brand | `--adel-signature-blue` | `#2563EB` |
| brand deep | `--adel-deep-blue` | `#1746A2` |
| brand tint | `--adel-ice-blue` | `#DCEBFF` |
| accent | `--adel-fresh-mint` | `#2DD4A8` |
| ink | `--adel-graphite` | `#171A1F` |
| secondary text | `--adel-slate` | `#667085` |
| canvas | `--adel-warm-white` | `#FAFAF8` |
| hairline | `--adel-soft-gray` | `#E6E8EC` |

**Distribution law 70 / 20 / 7 / 3 holds.** Gradients stay retired. Shadows stay neutral graphite.

**Mint's meaning is extended, carefully.** In v2.x mint means exactly "happening right now". v3 adds one adjacent meaning — "you just achieved something" — because XP gain and badge unlock are the same class of event: momentary, real, and worth exactly one accent. The 3% ceiling is per *viewport*, and the ceiling is what enforces restraint: a page cannot show a Now badge, an XP tick and three earned badges in mint at once. Mint is still never a surface, never a status colour (`--adel-status-success: #17A96A` stays separate), and never a logo colour.

**New semantic tokens** (values map onto the existing palette; no new hues):

```
--adel-xp-fill            mint-500        XP progress fill
--adel-xp-track           soft-gray       XP progress track
--adel-level-ring         signature-blue  level ring stroke
--adel-badge-earned       deep-blue       earned badge ground
--adel-badge-locked       neutral-sunken  locked badge ground
--adel-badge-locked-fg    text-tertiary   locked badge glyph
--adel-challenge-correct  status-success
--adel-challenge-wrong    status-error
--adel-track-prompting    signature-blue   } skill-track identity.
--adel-track-coding       deep-blue        } Five tracks, drawn from the
--adel-track-design       ice-blue         } existing palette — no new
--adel-track-automation   graphite         } hues, and never used as
--adel-track-business     slate            } large surfaces.
```

Skill-track colour is a **secondary** identifier only: every track is also named and iconed, so the system never depends on colour alone (WCAG 1.4.1).

### 1.2 Typography — TY v3.0

Five families. Caveat was the only addition in v2.x and remains the only one; **v3 adds no font.**

| face | job | rules |
|---|---|---|
| Montserrat | Latin display, wordmarks, nav, CTA | 400–800; never remapped by language |
| KO Ghorab | Arabic display | self-hosted, single weight 400, never below 24px, never letter-spaced, never body/UI |
| Readex Pro | Arabic body/UI, Latin inside Arabic, EN long-form prose | 300–600 |
| JetBrains Mono | technical: XP figures, scores, code, overlines, badge markers | 400/500 |
| Caveat | About sketch layer only, English only | 500/600, ≥18px |

**The rule v3 must not break, because v3 introduces dozens of small numeric UI elements:** anything below Ghorab's 24px floor that may carry Arabic uses `--adel-font-display-sm`, which resolves to Readex Pro on Arabic pages and Montserrat on English ones. XP counters, level labels, badge names, challenge scores and progress percentages are all in this category. The existing browser QA guard catches violations automatically and must be extended to the new routes.

**New scale entries** for gamification numerals, mono, tabular:

```
--adel-xp-figure       28px / 1     XP totals
--adel-xp-delta        15px / 1     "+40 XP"
--adel-score-figure    44px / 1     challenge score
--adel-level-label     11px / 1.2   uppercase mono, Latin only
```

### 1.3 Spacing, grid, radii, elevation, stroke

Unchanged: 4px base, 8px rhythm, the existing `--atc-space-*` ladder (note: 7, 9, 11 do not exist — the v2.x QA sweep catches references to them). Container max 1200px, padding 32px desktop / 20px mobile.

Radii keep their semantic roles (`chip, control, inline, media, card, panel, pill, circle`). Elevation stays 1–3, neutral graphite, no coloured shadows.

**Breakpoints**, formalised from v2.x practice:

| name | range | behaviour |
|---|---|---|
| mobile | ≤767 | composed, not stacked desktop; CTAs full-width ≥50px; touch targets ≥44px |
| tablet | 768–1199 | 3-up grids → 1×3 wide rows; hero photo 480px |
| desktop | ≥1200 | max width 1264, padding 88 |

### 1.4 Liquid Glass — budget and new claimants

10–15% of surface area, "navigation, floating controls, small overlays". v2.x spends it on the header and the hero chip.

v3 introduces three candidates: the XP/level indicator in the header, the challenge HUD, and the achievement-unlock overlay. **The budget does not increase.** The rule: at most two glass elements visible in any viewport, and the header always holds one of them. The challenge HUD is glass *only* while a challenge is running (it replaces nothing, it is transient). The achievement overlay is glass and is modal, so nothing else is visible behind it.

### 1.5 Imagery and iconography

**Photography, PH v1.0, unchanged:** real photography only. Real Adel, real screens, real desks. No stock, no AI-generated people, no fabricated product shots. A missing photograph collapses its slot; it never gets a placeholder on a live page.

**Icons:** the 24px / 1.8px stroke family from v2.x (`PillarIcon.astro`), extended with the v3 surfaces — projects, courses, whats-new, resources, xp, level, badge, challenge, streak. Round caps, single colour, never emoji. Lucide (`Icon.astro`, 2px master) remains for everything outside the pillar family; the two do not mix inside one component.

### 1.6 Accessibility — the floor, not the aspiration

- Contrast: 4.5:1 body, 3:1 large text and non-text UI. Signature Blue on graphite is 3.37:1 — legal for a graphic accent, never for a label.
- **Colour is never the only channel.** Skill tracks carry name + icon + colour. Challenge correct/wrong carries glyph + text + colour. Badge earned/locked carries a lock glyph and a text state.
- Every interactive element is reachable and operable by keyboard; focus is visible; `Escape` closes anything that opened.
- Live regions announce XP gain, badge unlock, challenge result, copy confirmation and form state. A screen-reader user must learn they scored 84 and earned a badge without seeing the animation.
- Decorative motion and the entire sketch layer are `aria-hidden`.
- `prefers-reduced-motion: reduce` renders every animated block static and fully visible.
- Touch targets ≥44×44 on mobile.

---

## 2 · Component library

### 2.1 Core — retained from v2.x, extended

`Button` (primary / secondary / ghost / quiet, sm-md-lg) · `Logo` · `LoveTech` · `Badge` (content taxonomy) · `Chip` · `Card` · `Icon` · `PillarIcon` · `Rich` · `StatusPill` · `Header` + dropdowns + accordion · `Footer` · `NewsletterForm`.

**New core:** `Tabs` · `Accordion` · `Dialog` (focus-trapped, Escape, restore focus) · `Toast` (live region, auto-dismiss ≥5s, never carrying the only copy of information) · `Menu` · `Input` / `Select` / `Checkbox` / `Switch` / `FieldGroup` (the Design System already ships these as JSX references; port to Astro) · `Avatar` · `EmptyState` (first-class: v3 has many more empty states than v2.x and they must look designed).

### 2.2 Learning components

| component | notes |
|---|---|
| `CourseCard` | outcome-first title, level, duration, price or Free, entitlement state |
| `LessonCard` | index, title, kind (read/watch/do), duration, completion state |
| `LearningPath` | ordered rail of mixed item types; shows position, not a fake percentage |
| `ProgressBar` | determinate only. **Never renders a percentage the system cannot actually compute** |
| `PromptCard` | the prompt, its variables highlighted, tested-on models, copy + save |
| `ResourceCard` | type glyph, format, size, entitlement state, download action |
| `ChallengeCard` | format (Choose/Repair/Create), skill track, XP on offer, best score |
| `QuizState` | idle / answering / scoring / correct / wrong / complete |
| `CompletionState` | what you did, what you earned, one next action |

### 2.3 Gamification components

| component | notes |
|---|---|
| `XPIndicator` | mono tabular figure; header variant is compact |
| `XPGain` | "+40 XP" — one 400ms rise-and-fade, announced politely, **no confetti** |
| `Level` | name + numeral; name comes from config, never hard-coded |
| `LevelProgress` | ring or bar, current → next, with the remaining XP stated in text |
| `BadgeMedallion` | earned / locked / just-unlocked. Locked shows the requirement, not a silhouette-and-mystery |
| `Achievement` | badge + title + description + date + verification state |
| `Streak` | count + honest label. Shows only when real; **never a guilt device** |
| `ChallengeComplete` | score, dimension breakdown, XP, badge if any, one next action |
| `AchievementCard` | the public verification page's core block. One component, three kinds — badge, course, challenge — selected by `subject_type`. Renders only fields the row's `visibility` says are consented |
| `VerificationMark` | the "Verified achievement" statement and its date. Never rendered from a client claim; it exists only on a page served from a verification row |
| `ContextualCTA` | the acquisition CTA, keyed to what the visitor just saw (`V3_GAMIFICATION.md` §6.5). Has no generic variant — "Join AdelTechTalks" is not one of its states |

### 2.4 Project components

`BuildCard` (status, cover, last-updated, one line) · `BuildTimeline` (dated updates, newest first, expandable) · `BuildStatus` (Exploring · Designing · Now building — the one mint · Testing · Launched · Paused, **visible not hidden**) · `ExperimentCard` · `LatestUpdate` · `JourneyRail` (the frozen six-stage component from v2.x, reused unchanged).

### 2.5 What's New components

`WhatsNewCard` and `WhatsNewEntry` both render the four fixed slots — **What changed · Why it matters · Adel's take · Try it** — as structure, not prose. The component cannot render an entry missing "Adel's take"; that is a build error, not a soft warning.

---

### 2.6 Launch-state components *(new in v3.1)*

`V3_PRODUCT_BLUEPRINT.md` §8 names three states — Live, Preview, Absent — and
they need components, or the distinction will be re-litigated per section.

| component | renders | hard rules |
|---|---|---|
| `EmptyState` | the honest nothing-here state inside a surface that exists | one line, one action at most, no illustration of fake content |
| `PreviewCard` | a committed-but-not-open thing | **not a link** unless the link goes to the thing that opens it. No date unless the date is real. Carries an explicit "not open yet" state, never a bare "soon" |
| — (Absent) | nothing | there is no component; the section does not render. **A skeleton shimmer is not an absent state** — it is a looping animation claiming something is loading |

`PreviewCard` is visually quieter than a live card: no cover image, no hover
elevation, reduced contrast on the title, and the state label reads as
information rather than as a badge. It must be impossible to mistake for
something you can use, at a glance, in both languages.

---

## 3 · Figma master library

```
00 Brand          lockups, I ❤️ Tech, clearspace, misuse, photography direction
01 Foundations    colour, type, spacing, grid, radii, elevation, glass, icons, a11y
02 Components     core — buttons, nav, cards, chips, inputs, tabs, dialogs, toasts
03 Website        home, learn, prompts, projects, what's new, about, footer
04 Learning       course, lesson, path, progress, prompt, resource, challenge
05 Playground     arena shell, challenge formats, scoring, results
06 Gamification   XP, levels, badges, achievements, share cards
07 Social         the ten content templates
08 Motion         durations, easings, named sequences, reduced-motion variants
```

Every page in `01` and `02` names the code token or component it maps to, so a Figma change has an obvious destination in the repo — and its absence is a visible gap. Components are built with variants matching the code props (`tone`, `size`, `state`), Auto Layout throughout, and both an English and an Arabic/RTL variant wherever text direction changes the layout. Naming matches the code exactly: `Badge/kind=vibe-coding`, not `Badge/Blue`.

---

## 4 · Social and content template system

**Production detail moved to `V3_CANVA_PRODUCTION_SYSTEM.md` in v3.1.** Figma
remains the source of truth for every template below; Canva is the publishing
surface. This section keeps the template inventory and the brand rules; the other
document covers how a Figma master becomes a Canva brand template, how they are
kept in sync, what Canva may and may not be trusted with, and the Arabic
constraints that Canva specifically gets wrong.

Ten reusable templates. All inherit the Content Identity System frozen in v2.x — closed badge set, 1 primary + at most 1 secondary marker, photography-first, headline on a solid band never a gradient scrim, badges always English/Montserrat.

| # | template | sizes | required real inputs |
|---|---|---|---|
| 1 | AI News | 1080×1350, 1200×630 | source, date |
| 2 | Adel's Take | 1080×1350 | the take, in Adel's words |
| 3 | Prompt Card | 1080×1350 | a prompt that exists in the library |
| 4 | Six-slide Carousel | 1080×1350 ×6 | one idea per slide |
| 5 | Cheat Sheet | 1080×1350, A4 | verified reference content |
| 6 | Build Update | 1080×1350 | a real project + a real screenshot |
| 7 | Workflow Diagram | 1080×1080, 1200×630 | a workflow actually run |
| 8 | Achievement Card | 1200×630 | a real verification row — never composed by hand |
| 9 | Reel Cover | 1080×1920 | a real frame |
| 10 | Course / Resource Cover | 1080×1350, 1200×630 | a published product |

**Template 8 is not a Canva template.** It is generated by the site, on demand,
from a verification row, keyed by verification id and busted by `published_at`
(`V3_GAMIFICATION.md` §6.4). It appears in this inventory so that the design is
governed here, but it is never hand-composed and never editable in Canva — a share
card that can be typed into is a share card that can claim anything. The other
nine are authored.

**Bilingual rule for all ten:** RTL mirrors through logical properties; Arabic headlines set in KO Ghorab; badges and product names stay Latin in LTR islands; Western digits. Every template is proofed at its longest plausible Arabic string, because Arabic sets denser and overflow is the failure mode. The v2.x working template at `templates/content-covers/` is the starting point.

---

## 5 · Implementation rules

1. **Tokens only.** No literal colour, font-family or spacing value in a component. The QA sweep already fails a build on an undefined token; it must be extended to fail on a hard-coded hex.
2. **One component per concept.** The v2.x badge system exists because two badge implementations would drift. XP, levels, badges and progress get the same treatment.
3. **Shared primitives over page CSS.** A redesign solved with 400 lines of page-specific CSS is a redesign that will not survive the next section.
4. **No second design system.** v3 extends `src/styles/tokens/*`; it does not open a parallel directory.
5. **Every component ships its empty, loading and error states**, or it is not done. v3 has network-dependent UI for the first time and "it looked fine with data" is how that ships broken.
