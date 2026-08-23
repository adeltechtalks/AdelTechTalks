# V3_MOTION_SYSTEM

**Status:** proposal.
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
