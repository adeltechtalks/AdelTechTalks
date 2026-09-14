# Adaptive / Fold-First Content System

**Status:** APPROVED REQUIREMENT, added to Phase 2A on 2026-09-14. Architecture, tokens, profile definitions, component implications and documentation only.
**Not in this phase:** no fold videos generated, nothing published, no campaign, no Canva, no Adobe, no rendering engine.
**Machine-readable source:** `brand/tokens/adel-v2.1.json` → `canvasProfiles`, `adaptiveLayouts`, `devicePack`, `adaptiveMigration`, `foldFirstNaming`.

---

## 1 · What this is

AdelTechTalks supports content designed for modern foldable, dual-screen and large-screen mobile devices alongside normal phone-first social video. **This is not another export size.** It is an adaptive composition system: from one source edit, the system produces device-appropriate versions in which subject framing, product placement, text position and line length, captions, brand position, safe zones and motion all adapt, and graphics expand rather than being cropped.

**The one rule that defines it:** a fold version is never produced by centre-cropping the 9:16 master. The renderer re-lays-out the same source edit against a different profile.

Two corollaries that are easy to get wrong:
- **Graphics expand, they do not scale up.** A wider canvas gets a second zone, not a bigger version of the single zone.
- **Extra canvas is room for the same content, not a reason to add content.** ASMR in particular stays clean; empty space is a legitimate use of a fold canvas.

All four profiles are AdelTechTalks. One palette, one type system, one set of mark roles, one motion charter. No profile gets its own visual identity.

## 2 · Canonical video canvas profiles

| Profile | Aspect | Size | Margin | Safe top / bottom | Side | Grid | Focal zones |
|---|---|---|---|---|---|---|---|
| `verticalStandard` | 9:16 | 1080 × 1920 | 72 | 260 / 420 | 72 | 4 cols · 32 | 1 |
| `foldPortrait` ⚠ | 3:4 | 1440 × 1920 | 96 | 136 / 240 | 96 | 6 cols · 32 | 2 |
| `foldLandscape` ⚠ | 4:3 | 1920 × 1440 | 96 | 0 / 120 | 96 | 8 cols · 32 | 2 |
| `youtubeLandscape` ⚠ | 16:9 | 1920 × 1080 | 72 | 0 / 120 | 72 | 8 cols · 24 | 2 |

**Use:** vertical standard for Reels, TikTok, Shorts, Stories and all standard vertical social video · fold portrait as the large-screen / unfolded portrait composition · fold landscape as the unfolded large-screen landscape composition and, where appropriate, a special YouTube large-screen edition · YouTube landscape for standard YouTube output and long-form. **Fold-first does not replace standard YouTube**; 16:9 stays first-class.

### Provenance — what is audited and what is proposed

`verticalStandard` carries the audited repository values from `site/src/styles/tokens/brand.css` (`--atc-social-reel-*`). Everything marked ⚠ is **derived by a stated rule and is a proposal for approval**, not an invented number:

- **Margin** = 6.67% of the canvas short edge, the audited reel ratio (72 / 1080), rounded to the 8 px grid. Gives 96 for both 1440-short-edge profiles and 72 for 16:9.
- **Fold portrait reserves** = the audited **Feed 4:5** reserves (96 / 168), the nearest audited canvas by aspect, scaled by the height ratio 1920 / 1350 = 1.4222 → 136 / 240.
- **Landscape bottom bands** (120) are proposed player-control bands. **No audited landscape video precedent exists** — the audited 16:9 token is a static cover with 0 / 0 reserves and stays unchanged. These two values are flagged `open` in the export and need a device and platform check before first production use.

The audited static canvases (Feed 4:5, Square 1:1, Thumbnail 16:9) are untouched by this system. They remain in the `Canvas & Safe Zones` collection; the video profiles are a separate `Canvas / Video Device Profiles` collection so a consumer cannot confuse a static cover canvas with a video device profile.

### What each profile carries

Beyond dimensions, every profile defines: safe zones · content margins · grid · **caption region** (anchor, alignment, max width) · **preferred brand positions** with alternates and scale · **text limits** (headline / title / body / support word ceilings plus the Arabic and Latin measure) · **focal rules** (how many genuine content zones, the split, and what must never be blind-cropped).

Two text-limit notes:
- Headline and title ceilings **do not rise** on a bigger canvas. A fold canvas is not a licence for a longer headline. The body ceiling rises from 18 to 24 Arabic words because the measure is genuinely wider, and that rise is itself flagged `proposed`.
- Captions keep the reel line length on fold profiles rather than stretching to the full width. A longer caption line is harder to read, not better.

## 3 · Adaptive layout rules per format

Every format declares five things. **PRIMARY** must stay dominant and uncropped. **SECONDARY** may move, resize or reflow. **TEXT ZONE** is where title, captions and callouts can safely go. **BRAND ZONE** is where the logo or signature may go. **FOCAL ZONE** is the face, hands, product or action a naive crop would destroy.

| Format | Primary | Secondary | Focal zone |
|---|---|---|---|
| Talking Head | the speaker, face and gesture space | B-roll insert, contextual graphic, scene cards, progress bar | face and upper body, plus the hand area when gesturing |
| Product hero | the product, silhouette and finish | headline, spec tokens, background treatment | product outline plus its highlight and shadow contact |
| Talking Head + product B-roll | speech is the spine; speaker and the synchronised B-roll moment | which of the two is foregrounded at a beat | speaker face and B-roll subject; one is always fully visible |
| Comparison A/B | both products at matched scale and framing | labels, spec rows, verdict card, scorecard | the compared feature area on each product |
| ASMR unboxing | the tactile action: hands, packaging, product surface | nothing, by default | hands and the contact point where the sound is made |
| Product Demo | the feature in real use, the proof shot | feature callout, label, step index | the interaction point |
| Motion Carousel | the slide media, one idea per slide | headline, body, index, signature | the slide subject; each slide must read alone |
| Long-form / explainer | the explanation: speaker, screen recording or diagram | chapter cards, lower thirds, recurring diagram | the diagram or screen region under discussion |

### Using the extra horizontal space intentionally

- **Talking Head** — do **not** enlarge the speaker to fill 4:3. The speaker keeps the dominant column at its 9:16 scale and the freed width becomes a real second zone: contextual graphic, product, supporting visual, transcript panel, or deliberate breathing room.
- **Comparison A/B** — fold landscape is the best canvas this format has: large side-by-side at matched scale, spec row beneath, verdict in the shared band.
- **Product Demo** — product and feature callout **coexist**; the callout stops being an overlay and becomes its own zone.
- **ASMR** — keep the tactile action large and the frame visually clean. Do not add graphics because there is more canvas. No music, no captions, no denoise, gating or compression — the audio policy is profile-independent.
- **Motion Carousel** — a **Fold Edition** where each slide is recomposed for the wider canvas: media and text become two zones instead of a vertical stack, and the landscape edition can use horizontal motion (parallax, side reveal, A→B slide-through) that 9:16 cannot afford. Never a crop of the 9:16 slide. Every profile still exports each slide as its own MP4.

Full per-profile wording for all eight formats lives in `adaptiveLayouts` in the export and is mirrored on Figma page `07 — Video System`.

## 4 · Adaptive Device Pack

```
<name>-standard-9x16.mp4
<name>-fold-portrait-3x4.mp4
<name>-fold-landscape-4x3.mp4
<name>-youtube-16x9.mp4
```

Requested, never forced. A job may ask for one profile, several, or the entire pack. Each output is a recomposition of the same source edit — the cut, transcript, caption timing, scene logic and audio decisions are shared; only the composition differs.

**Status: specified, not implemented.** The rendering engine is a later phase.

## 5 · Where this lives in the design system

| Module | What it carries |
|---|---|
| `01 — Foundations` | the `Canvas / Video Device Profiles` variable collection (4 modes) and the adaptive profile board. Built in Phase 2A. |
| `04 — Core Components` | adaptive/responsive component variants — a Zone property and profile-aware sizing, not a duplicate component set per profile. Spec frame added; components are Phase 2B. |
| `06 — Motion Carousel` | standard and fold-first motion compositions. Spec frame added; storyboards are Phase 2B. |
| `07 — Video System` | the Adaptive Device Pack and per-format recomposition rules. Spec frame added; kits are Phase 2B. |
| `90 — Export Library` | machine-readable device and canvas profiles exposed for consumers. Spec frame added. |

## 6 · Video skill — architecture, not implementation

The rendering engine is **not** built in Phase 2A. What Phase 2A does is guarantee the capability is not designed out:

- The profile schema exists and is machine-readable.
- Every place the skill currently bakes in a canvas dimension is inventoried, with what it must read instead. Sixteen call sites across `08_safe_check.js`, `04_render_frames.js`, `03_cut_zoom.py`, `11_behind_text.js`, `13_asmr_assemble.py`, `compose.REFERENCE.html`, `studio.html`, the Remotion template (`Root.tsx`, `stage.ts`, `Guides.tsx`, `Captions.tsx`, `Outro.tsx`), the motion-carousel template, `formats/motion-carousel.json`, the plan templates and the `SKILL.md` safe-zone table. The full list with line numbers is `adaptiveMigration.targets` in the export.
- The governing principle is recorded: **the editor must not hold a canvas assumption anywhere.** A dimension is configuration, read from a profile, at every stage — analysis, cut, zoom, compose, caption, safe-check, encode. Stage rectangles become ratios of the profile rather than pixel constants.
- Nothing in the Phase 2A token model, variable structure or component plan blocks this.

**The future skill must perform recomposition, not resize or crop.** A resize-only implementation does not satisfy this requirement.

## 7 · Branding language

"Fold First", "Fold Ready", "Made for your unfolded screen" are **reserved concepts only**. None is an official badge or a permanent brand element. Nothing ships with this language until a separate decision approves one.

## 8 · Open questions for approval

1. **The two landscape bottom bands (120 px).** Proposed as player-control reserves with no audited precedent. Need a device and platform check.
2. **Fold portrait reserves (136 / 240).** Derived from the Feed 4:5 reserves by aspect similarity. Confirm the derivation is the right basis, or supply measured values from a real device.
3. **The body word ceiling rising to 24 on wide profiles.** This edits an enforced slot rule; it needs an explicit yes.
4. **Focal splits** (62/38 portrait, 55/45 landscape, 58/42 YouTube) are compositional starting points, not measured. Confirm or adjust.
5. **Whether `foldLandscape` or `youtubeLandscape` is the default for a large-screen YouTube edition** when both would work.
6. **Frame rate per profile** — all four are 30 fps today. Confirm, or allow 60 fps for landscape demo footage.
7. **Whether the Adaptive Device Pack should have a default subset** (for example standard + YouTube) when a job does not name profiles.
