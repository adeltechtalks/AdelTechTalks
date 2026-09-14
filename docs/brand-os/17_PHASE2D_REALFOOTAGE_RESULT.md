# Phase 2D — Real-footage validation result

> ## STATUS
> ### ✅ IMPLEMENTATION APPROVED (unchanged)
> ### ⚠️ REAL-FOOTAGE VALIDATION — RUN, WITH ONE UNRESOLVED CREATIVE GAP
>
> **Footage:** one real Samsung Galaxy Z Fold unboxing, 225.73 s, supplied 14 Sep 2026.
> **Not touched:** Brand OS architecture, tokens, Supabase, RLS, Security Guardrails, Canva, Adobe, deployment.
> **Not started:** Motion Carousel.

---

## The short version

The pipeline runs end to end on real footage and produces a correct, policy-clean,
branded 30 s vertical master. Calibration cleared eight of ten diagnostics.

**It does not yet choose the right moments.** It optimises for acoustic density, and
in a real unboxing the acoustically densest material is *packaging*, not the product.
Every hero window landed on paperwork. The fold reveal — the reason the video exists —
was not selected. That is a design gap, not a bug, and it needs a decision.

## 1 · Source

| Property | Value | Note |
|---|---|---|
| duration | 225.73 s | far longer than the 20–35 s format |
| stored size | 1024×576 | **landscape** as stored |
| display size | **576×1024** | portrait, via a −90° rotation matrix |
| audio | AAC 44.1 kHz stereo, **64 kbps** | WhatsApp re-encode |

The 64 kbps re-encode matters for ASMR specifically: lossy coding at that rate discards
exactly the quiet high-frequency detail the format is built on. Everything below holds
for *this* file; a camera-original would measure better.

## 2 · Three real bugs, found only because the footage was real

### B1 — rotation was ignored (both scripts)

`ffprobe` reports the **stored** frame size; `ffmpeg` decodes the **rotated** one. The
analyser read 1024×576 and labelled this portrait clip "landscape"; the renderer
compared the wrong aspect and reported a recomposition that never happened.

Fixed in `20_asmr_analyze.py` and `22_asmr_render.py` by reading the display matrix.
Synthetic footage carries no rotation metadata, so nothing could have caught this.

### B2 — the absolute peak was the wrong anchor

One box-slam at t=32.04 s sits **15.5 dB above the clip's own p99**. Both thresholds
were anchored to that absolute peak, so:

```
ev_thresh = peak × 0.18 = −41.2 dBFS
p99 of the entire clip    = −41.8 dBFS
```

**The event threshold sat above the 99th percentile of the whole clip.** By
construction the detector could only ever see the top ~1% of windows — 39 events in
226 seconds.

Numeric tuning could not fix this. Lowering the multiplier to 0.10 only rescales the
same broken anchor: events went 39 → 74 and **D1, D2, D4 all still tripped**. The fix
had to be structural — anchor on a robust percentile:

| | anchor | events | silence coverage | D1 | D2 | D4 |
|---|---|---:|---:|:--:|:--:|:--:|
| synthetic-v1 | `peak` | 39 | 68% | ⚠️ | ⚠️ | ⚠️ |
| numeric tuning only | `peak` | 74 | 68% | ⚠️ | ⚠️ | ⚠️ |
| **real-v1** | **`p95`** | **184** | **7%** | ✅ | ✅ | ✅ |

`reference` is a new tuning key defaulting to `peak`, so every existing profile
behaves exactly as before.

### B3 — the planner could not subdivide a long protected run

With 184 dense events every tactile reserve merged into **one continuous 140.61 s
block**. The selection loop read:

```python
if total + k["dur"] > budget and taken:   # `and taken` → the FIRST range is always accepted
```

so it accepted a 140 s segment against a 30 s budget — 4.7× over. Invisible with
sparse synthetic events, which never produced a range longer than the budget.

Fixed by carving an over-long run around its hero windows, snapping every sub-range
boundary **out** of any reserve so no decay is truncated. Result: 6 segments, 30.34 s.

## 3 · Calibration delta

`synthetic-v1` → `real-v1`:

| Constant | From | To | Why |
|---|---:|---:|---|
| `silence.reference` | `peak` | **`p95`** | structural — D1/D2/D4 |
| `events.reference` | `peak` | **`p95`** | structural — D1/D2/D4 |
| `silence.floor_multiplier` | 2.2 | 1.43 | D1 |
| `silence.floor_percentile` | 0.20 | 0.10 | D6 |

`events.peak_fraction`, `events.median_multiplier` and every plan reserve were
**returned to their approved values** once the anchor was corrected. The multipliers
were never wrong; the level they multiplied was.

`real-v1` is written but **not active**. `synthetic-v1` remains the active profile.

## 4 · Diagnostics, final state

| | Code | Finding |
|---|---|---|
| ✅ | D1 `SILENCE_OVER_CUT` | silence 68% → **7%** |
| ✅ | D2 `EVENT_UNDER_DETECT` | 0.17 → **0.81** events/s |
| ✅ | D3 `EVENT_OVER_DETECT` | no runaway |
| ✅ | D4 `PEAK_MASKING` | outlier can no longer dominate under `p95` |
| ✅ | D5 `ONSET_SMEAR` | onsets rise 3.07× — sharp |
| ⚠️ | D6 `FLOOR_DRIFT` | floor drifts **29.5 dB**; remedy applied, drift is real |
| ✅ | D7 `TAIL_TRUNCATION` | decay p75 0.28 s fits the 0.45 s reserve |
| ✅ | D8 `SCENE_FALSE_POSITIVE` | none |
| ⚠️ | D9 `BRANCH_ACTIVATION` | **the predicted transition happened** |
| ✅ | D10 `NO_EVENTS` | 184 events |

**D9 fired exactly as designed.** The silence branch moved `level → floor` and the
event branch `level → median`: logic that never once executed on synthetic footage is
now deciding the edit. D9 proposes no threshold change on purpose — it asks for a
human to listen. That request stands.

**D6 is honest, not alarming.** The floor genuinely drifts 29.5 dB across a 226 s
handheld take. Its remedy is applied; the consequence it guards against is
over-cutting, which D1 now measures as safe at 7%.

## 5 · Render

| | |
|---|---|
| output | **1080×1920 H.264, 30.57 s, 21.5 MB**, AAC 48 kHz stereo |
| recomposition | `scale — aspect already matches` (correct after B1) |
| watermark | Glass plate 63×56 at (72, 260), inside the token safe zone |
| policy | denoise / gate / compression / normalisation / music / captions **off**; speed 1.0; volume 1.0 |

One caveat stated plainly: the source is 576×1024 and the master is 1080×1920, so the
image is upscaled ~1.9×. Sharpness is limited by the source, not by the pipeline.

## 6 · The unresolved gap — moment selection

All six hero windows fell between **51 s and 110 s**. Event density by block:

```
  0- 30s  #########                                (9)
 30- 60s  #######################################  (39)
 60- 90s  ##############################################  (46)
 90-120s  ####################################     (36)
120-150s  #######                                  (7)
150-180s  ######################                   (22)   ← unfold
180-210s  ########################                 (24)   ← screen on
210-240s  #                                        (1)
```

The selected 30 s is entirely packaging: sliding the sleeve, lifting the tray, the
quick-start leaflet. The **fold reveal and first screen-on at 150–210 s were never
considered**, despite carrying 46 events between them.

The cause is not a threshold. Crinkling card and plastic film are acoustically
sharper and denser than a smooth hinge opening, so a density-ranked scorer will
always prefer the box to the product.

**Loudest ≠ most interesting.** The pipeline currently has no notion of narrative
position, of what the object is, or of which moment the video exists to show.

### Options — this needs your decision, not my guess

| | Approach | Cost | Risk |
|---|---|---|---|
| **A** | **Beat-aware selection** — require coverage across the story arc the format already declares (`default_sequence`: sealed → opening → first reveal → handling), so at least one segment must come from the reveal region | moderate | needs a reliable way to locate beats in a single long take |
| **B** | **Visual salience** — weight windows by frame change, hand-in-frame, or screen luminance, so a lit display or a device transformation scores even when quiet | higher | new visual analysis stage |
| **C** | **Operator anchor** — accept one or two timestamps as "the moment", and let the engine build the edit around them | low | not fully automatic; but honest, and matches how an editor actually works |

My recommendation is **C now, A next.** C makes the tool immediately useful — you know
where the reveal is, and saying so costs one argument. A then removes that step for the
common case. B is the most powerful and the least certain; it should follow evidence
from A and C, not precede it.

## 7 · What this validates, and what it does not

**Validated on real footage:** ingest, rotation handling, transient detection after
calibration, dead-time removal with reserves intact, budget-respecting segmentation,
recomposition, watermarking, policy enforcement, export.

**Not validated:** that the result is *publish-ready*. It is a technically correct edit
of the wrong 30 seconds. No metric here establishes that a cut lands well inside a
gesture — §6 is the reason, and a human ear is still the test.

**One unaudited item:** the 64 kbps WhatsApp audio is not representative of what a
camera original would give. Re-running calibration on an original-quality file may
move `real-v1` again, and that profile should be treated as provisional until it does.
