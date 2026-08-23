# V3_MOTION_SYSTEM

**Status:** proposal. **Revised in v3.1** — new §2.5 (the four-act identity) and
§2.6 (the Playground and achievement sequences, specified as states rather than
as a list of effects).
**Relationship to the frozen v2.x charter:** the charter is not replaced. Its numbers stay exactly as they are and become **Tier 3** of a five-tier system. v3 adds tiers above and below it, because a platform with challenges and achievements needs motion the charter never had to describe.

---

## 0 · What "alive" has to mean here

v3 should feel alive. That is a real brief and it has a real failure mode: an AI-education site that animates constantly reads as a startup landing page, and every extra moving thing makes the *content* less believable, not more.

So the rule underneath all of this: **motion serves narrative, feedback, or orientation. Nothing moves for delight alone.**

Three consequences, stated once and enforced everywhere:

- **No looping decorative motion.** Carried from v2.x, non-negotiable. Nothing pulses, breathes, floats or shimmers while idle.
- **No confetti.** Achievement moments are marked by a single, restrained, one-shot sequence. Celebration through craft, not through particles.
- **One entrance per element.** An element animates in once. Scrolling back up does not replay it.

---

## 1 · The five tiers

| tier | name | duration | easing | what it covers |
|---|---|---|---|---|
| 1 | **Micro** | 100–150ms | `--atc-ease-move` | hover, press, focus ring, toggle, chevron |
| 2 | **UI** | 200–300ms | `--atc-ease-enter` / `-exit` | dropdown, dialog, toast, tab, accordion, tooltip |
| 3 | **Reveal** | 300–400ms, 70ms stagger, cap 8 | `--atc-ease-enter` | scroll-in content — **the frozen v2.x charter, unchanged** |
| 4 | **Narrative** | 600–900ms | `--atc-ease-enter` | scroll-driven storytelling, build timelines, path draws |
| 5 | **Feedback** | 400–1200ms | per sequence | XP gain, level up, badge unlock, challenge result |

Tier 3 is the default. A designer reaching for Tier 4 or 5 needs a reason that is about *meaning*, not about the section feeling flat.

Existing tokens are reused; v3 adds only names, not new numbers:

```
--atc-duration-micro / instant / fast / moderate / base / slow / deliberate / ceiling
--atc-ease-enter / -exit / -move / -loop
--atc-stagger-marketing: 70ms
--atc-distance-2: 8px   --atc-distance-3: 16px
```

New, for tiers 4–5 only:
```
--adel-duration-narrative: 800ms
--adel-duration-celebrate: 1200ms   /* hard ceiling for any one-shot */
--adel-stagger-sequence:   120ms    /* journey pins, timeline nodes */
```

---

## 2 · Named sequences

Each is a contract: a name, a trigger, a description, and a reduced-motion fallback. `data-motion="<name>"` marks the element, exactly as `data-reveal` / `data-vb-reveal` do today.

### Tier 3 — reveal (unchanged)

| name | trigger | behaviour | reduced |
|---|---|---|---|
| `reveal` | 20% in view, once | translateY 16px → 0, fade, 300ms | static, visible |
| `stagger` | as above | children +70ms, capped at 8 | static, visible |
| `visual` | as above | +100ms after its text sibling | static, visible |

### Tier 4 — narrative

| name | trigger | behaviour | reduced |
|---|---|---|---|
| `hero-kinetic` | load | positioning line rises 16px + fades, 600ms; photo scale 1.03→1 + fade, 600ms; chip +250ms | all present, no transform |
| `build-reveal` | section enters | project cards enter as a sequence, 120ms apart | static |
| `timeline-draw` | section enters | vertical connector draws top→bottom, `stroke-dashoffset`, 800ms, settles | drawn, no animation |
| `path-draw` | section enters | learning-path / journey connector draws, 800ms | drawn |
| `rail-hint` | rail enters, once | horizontal rail nudges 12px and returns, 500ms — the affordance that it scrolls | no motion; a visible scrollbar or arrow instead |
| `sticky-scene` | scroll within a pinned section | content cross-fades between states, driven by scroll position | section un-pins; states stack vertically |
| `parallax-soft` | scroll | background layer at 0.92× scroll. **Maximum 40px total travel** | none |

`sticky-scene` is the one to be most careful with. Pinned scroll-jacking is the single most common way a premium site becomes an unusable one on a trackpad. Rule: at most **one** sticky scene per page, never on mobile, and the section must remain fully readable if the pin never engages.

### Tier 5 — feedback

| name | trigger | behaviour | reduced |
|---|---|---|---|
| `xp-gain` | XP awarded | "+40 XP" rises 12px and fades over 400ms; the total counts up over 400ms | figure updates instantly |
| `xp-fill` | XP awarded | progress bar fills to the new value, 600ms | jumps to value |
| `level-up` | level threshold crossed | ring completes, 400ms; new level name cross-fades in, 300ms; **total ≤900ms** | new level shown |
| `badge-unlock` | badge earned | medallion scales 0.94→1 with a single Signature Blue ring expanding once and dissipating. 700ms. **One ring. No particles.** | badge shown earned |
| `challenge-correct` | answer scored | option border → success, 150ms; score figure counts up, 400ms | states shown |
| `challenge-wrong` | answer scored | border → error, 150ms; **no shake** (shake reads as punishment) | states shown |
| `copy-confirm` | prompt copied | label swaps Copy → Copied, 150ms, reverts after 2s | label swaps |
| `save-confirm` | prompt saved | icon fills, 150ms | icon fills |

Every Tier 5 sequence is accompanied by a text change in a live region. **The animation is never the only notification** — a screen-reader user must learn they scored 84 and earned "Prompt Architect" without seeing any of it.

### 2.5 The four-act motion identity *(new in v3.1)*

The homepage is one argument in four movements — BUILD, PLAY, LEARN, SHIP — and
the motion is what makes that legible without a single word of explanation. Each
act has **one** entrance register, used consistently inside it and nowhere else.

| act | register | why this one | tier |
|---|---|---|---|
| **BUILD** | **drawn** — connectors and timelines draw in, cards follow the line | building is sequential and structural; a drawn line is the honest picture of it | 4 |
| **PLAY** | **responsive** — nothing enters on scroll; everything moves in reply to the visitor | this is the only act where the visitor acts, and the motion should only ever be an answer | 5 |
| **LEARN** | **calm** — the frozen v2.x reveal, 300ms, 70ms stagger | reading sections should not perform; this is the charter, unchanged | 3 |
| **SHIP** | **settling** — a path completes and comes to rest; one arrival, no bounce | the end of an argument, not a crescendo | 4 |

Two rules keep this from becoming four times as much motion:

- **An act's register is the only entrance motion inside it.** BUILD does not also
  reveal, PLAY does not also draw. Mixing registers inside an act is how a page
  starts to feel busy while every individual animation is defensible.
- **PLAY has no entrance motion at all.** The Arena section is simply present when
  it is reached. Everything that moves in it is a response to a click. This is
  deliberate contrast: after two acts of things arriving, the act where the
  visitor acts is still until they do.

**The act indicator.** A four-stop rule, thin, Signature Blue, tracking scroll
position through the four acts. Orientation — it tells you where you are in the
argument — which is one of the three things motion is permitted to serve.
Constraints: one element, `transform` only, desktop only, hidden below 1200px,
and it renders **complete and static** under reduced motion. It is not a progress
bar of anything the system cannot compute; it is a position in a page.

### 2.6 The interactive sequences, specified as states *(new in v3.1)*

The v3 draft listed the Tier 5 effects. It did not say what the *states* were, and
an interactive surface is a state machine before it is an animation. These are
specified as states because that is what the prototype has to demonstrate and what
the implementation has to match.

**A challenge, start to finish**

| state | what is true | motion |
|---|---|---|
| `idle` | the challenge is shown, nothing chosen | none |
| `answering` | an option is selected / text is being written | `Tier 1` on selection only |
| `submitting` | the server is scoring | the action becomes a quiet indeterminate state; **nothing else moves** |
| `scored-correct` | a deterministic result came back | `challenge-correct`, then `xp-gain`, then `xp-fill` — **sequenced, never simultaneous** |
| `scored-wrong` | ditto | `challenge-wrong` — border and glyph, 150ms, **no shake** |
| `self-assess` | Create only: the model answer and rubric are shown | the model answer cross-fades in beside the attempt, 300ms. No score animates, because none was computed |
| `complete` | score, XP, any badge, one next action | `badge-unlock` last, and only if a badge was actually awarded |

The sequence is strictly ordered and each step waits for the previous one:
result → XP → level → badge. Firing them together produces a slot machine, and a
slot machine is what "no confetti" was protecting against in a different costume.
**Total ceiling for the whole chain: 2000ms**, after which everything is at rest.

**Reduced motion, for every state above:** the state changes are all still
visible — border colours, glyphs, figures, the badge in its earned state — and
nothing transitions. The `submitting` state shows a static text label rather than
an indeterminate animation.

**Every state change is announced in a live region**, in words, in order: *"Scored
84 out of 100. 50 XP awarded. Badge earned: Prompt Builder."* A screen-reader user
gets the whole sequence without any of the motion, and that is the test of whether
the motion was ever load-bearing.

**The achievement page** has exactly one piece of motion: the medallion settles
once on load, 400ms, and the CTA is present immediately. A page someone arrived at
from LinkedIn does not perform for them.

### Tier 2 — page transitions

Astro View Transitions, **within a section only** (project → project, lesson → lesson): 200ms cross-fade, no slide. Cross-section navigation does a normal page load. Rationale: a full-site transition layer costs real complexity and a real risk of broken back-button state, for a gain the reader does not notice.

---

## 3 · Performance budget

Motion that drops frames is worse than no motion.

- Animate **`transform` and `opacity` only.** `width`, `height`, `top`, `left`, `margin` and `filter` are off-limits in a scroll-driven sequence. `stroke-dashoffset` is permitted for draw-on (it is what SVG offers) and is used on at most one element per section.
- `will-change` is set only for the duration of a running animation, never parked in a stylesheet.
- Scroll-driven work uses `IntersectionObserver` or CSS scroll-driven animations — never a `scroll` listener doing layout reads.
- **Budget: at most 3 elements animating simultaneously per viewport.** A stagger is one element for this purpose.
- Above-the-fold motion must not delay LCP. The hero photograph is `loading="eager"` `fetchpriority="high"` and its animation is a transform on an already-painted image.
- Every sequence is verified on a 4× CPU throttle.

---

## 4 · Reduced motion

`prefers-reduced-motion: reduce` is not a degraded experience. It is a complete one.

```css
@media (prefers-reduced-motion: reduce) {
  /* Full replacement, never a shortened duration: content is present,
     opaque and untransformed. */
  [data-motion], [data-reveal], [data-vb-reveal], [data-vb-stage] {
    opacity: 1; transform: none; animation: none; transition: none;
  }
}
```

Specific fallbacks:
- Draw-on paths render **complete**, not undrawn.
- Counters show the final figure.
- Sticky scenes un-pin and stack.
- Rails show a scrollbar or arrow instead of a nudge.
- View transitions are disabled.

The v2.x browser QA already asserts that every `[data-reveal]` / `[data-vb-*]` element is opacity 1 and untransformed under reduced motion on four routes. v3 extends the same assertion to `[data-motion]` and to every new route. **This check is the reason the fallback cannot silently rot.**

---

## 5 · What v3 must not do

- No confetti, particle bursts, or full-screen celebration takeovers.
- No looping, pulsing, breathing or floating idle states.
- No scroll-jacking beyond the single permitted sticky scene, and none on mobile.
- No motion that delays reading. A visitor scrolling fast must never wait for content.
- No parallax beyond 40px.
- No animated numbers that are not real, and no progress bar showing a percentage the system cannot compute.
- No motion on the footer. Carried from v2.x.
- **No simultaneous celebration** *(v3.1)*. Result, XP, level and badge are a
  sequence with a 2000ms ceiling, never a chord.
- **No entrance motion in the PLAY act** *(v3.1)*. If it moves there, the visitor
  caused it.
- **No motion that stands in for a missing state.** A skeleton shimmer where there
  is no content is a looping decorative animation claiming something is loading.
  Empty is a designed state, not a pending one.
