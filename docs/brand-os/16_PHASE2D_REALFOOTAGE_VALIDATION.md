# Phase 2D — Real-footage validation mode

> ## STATUS
> ### ✅ IMPLEMENTATION APPROVED
> ### ⏳ REAL-FOOTAGE VALIDATION PENDING
>
> This document describes the validation mode that has been **prepared and self-tested**.
> It has **not been run on real footage**, because no real footage exists in the repository yet.
> **Not touched:** Brand OS architecture · Canva · Adobe · Supabase · RLS · Security Guardrails · deployment.
> **Not started:** Motion Carousel.

---

## 1 · What this mode is for

Phase 2D was approved as an implementation milestone with an explicit carve-out:
ASMR is not production-proven. Five things remain unproven, and this mode exists
to test exactly those five:

| Unproven | How this mode tests it |
|---|---|
| real-world tactile audio detection | D2/D3/D5 measure whether transients are found at all |
| threshold calibration on real footage | signature comparison against the synthetic baseline |
| actual creative edit quality | the plan is rendered and listened to — no metric replaces that |
| real camera/room noise, handling variability | D1/D4/D6/D8/D9 |
| publish-ready without manual rescue | the count of manual interventions needed, recorded honestly |

## 2 · What was discovered while building it

**The synthetic baseline exercised less of the detector than assumed.**

Measuring the four generated test clips produced a result worth stating plainly:

| Measurement | Synthetic value |
|---|---|
| 20th-percentile RMS | **exactly 0** (−180 dBFS clamp) |
| median RMS (2 of 4 clips) | **exactly 0** |
| deciding silence branch | `peak` |
| deciding event branch | `peak` |

Both thresholds are a `max()` over several branches:

```
sil_thresh = max(floor × 2.2,  peak × 0.03)
ev_thresh  = max(median × 3.0, peak × 0.18, floor × 4.0)
```

Generated audio has **true digital silence** between bursts, so `floor` is zero,
so every floor-relative branch evaluates to zero and can never win the `max()`.
**Of the five branches, only the two peak-relative ones have ever fired.**

This does not invalidate the approved implementation — the pipeline did what it
was tested to do. It does sharpen what "synthetic test validation" was worth:
it validated the *plumbing*, and roughly half the *detection logic*. The first
real clip will activate the remaining branches for the first time, changing
behaviour with no code change. `D9 BRANCH_ACTIVATION` exists solely to make that
transition visible rather than letting it surface as a bad render.

## 3 · Structural change: thresholds are now named, not buried

The one code change this preparation required.

| Before | After |
|---|---|
| detection constants as literals inside `20_asmr_analyze.py` and `21_asmr_plan.py` | all 18 in `calibration/thresholds.json`, profile `synthetic-v1` |
| a tuning change = a code diff | a tuning change = a measurable delta between two named profiles |

Loaded through `scripts/tuning.py`, which is deliberately the mirror of
`scripts/brand_profile.py`:

```
brand_profile.py  →  brand/tokens/adel-v2.1.json   (canvas, safe zones, watermark)
tuning.py         →  calibration/thresholds.json   (silence, transients, reserves)
```

**Detection tuning is a property of the footage, not of the brand.** A calibration
run must never be able to move a safe zone. Keeping the two loaders separate is
what enforces that, and it is why calibration does not touch Brand OS architecture.

**Regression check:** after the refactor, the full pipeline was re-run on the same
four synthetic clips. The generated `asmr-decisions.md` is **byte-identical** to the
approved evidence file. Zero behaviour drift.

## 4 · The diagnostics

Ten named checks, with trip conditions fixed **before any real footage existed** —
full contract in `calibration/diagnostics.md`.

| Code | Name | Severity | Guards against |
|---|---|---|---|
| D1 | `SILENCE_OVER_CUT` | **critical** | room tone cut as dead time |
| D2 | `EVENT_UNDER_DETECT` | high | real peels missed entirely |
| D3 | `EVENT_OVER_DETECT` | medium | continuous texture shredded into events |
| D4 | `PEAK_MASKING` | high | one loud snap masking all quieter work |
| D5 | `ONSET_SMEAR` | high | reverb-smeared attacks slipping past the detector |
| D6 | `FLOOR_DRIFT` | medium | non-stationary room tone |
| D7 | `TAIL_TRUNCATION` | **critical** | cuts landing inside a decay |
| D8 | `SCENE_FALSE_POSITIVE` | low | handheld motion read as cuts |
| D9 | `BRANCH_ACTIVATION` | high | untested logic silently taking over |
| D10 | `NO_EVENTS` | **critical** | a clip the planner cannot edit at all |

D1 and D7 are critical because both protect against **over-cutting**. Under-detection
produces a lazy edit; over-cutting produces an edit that sounds broken. The risks are
not symmetric, and the thresholds are deliberately biased toward keeping material.

D9 proposes no change on purpose — a branch change calls for a human listening to the
cut list, not an automatic threshold move.

Every diagnostic evaluates **per clip as well as on the aggregate**, and any single
clip tripping trips the diagnostic. That was not foresight: the self-test below
produced a completely dead clip sitting unnoticed behind a healthy two-clip average.

## 5 · Harness self-test

An untested test harness is worth nothing, so the diagnostics were run against two
generated clips carrying continuous room tone and `aecho` reverb — conditions
synthetic bursts lack:

```
⚠ D1   60% of clip called silent — room tone cut as dead time      (2/2 clips)
⚠ D7   p75 decay 0.47s vs 0.45s reserve                            (1/2 clips)
⚠ D9   silence_branch: peak → floor,  event_branch: peak → median  (2/2 clips)
⚠ D10  roomtone-02: zero events at 32% occupancy — un-editable     (1/2 clips)
```

And the control — the four synthetic clips the thresholds were tuned on:

```
✓ no diagnostic tripped — synthetic thresholds hold, no tuning proposed
```

Two controls, opposite results, both correct. One room-tone clip detected **zero
events** at 32% occupancy: complete detection failure under reverb, caught by D10.

### The self-test corrected three of my own diagnostics

Running the harness against its own baseline exposed real errors in the
*measurements* — not the trip levels:

| Was | Why it was wrong | Fix |
|---|---|---|
| D5 averaged rise over every loud window | most loud windows are mid-burst, so sharp audio reported a "rise" of 0.77× | measure only the first window of each loud run |
| D7 ended decay at `floor × 2` | zero against a digital-silence floor, so decays never terminated | `max(floor×2, median×0.5, peak×0.02)` |
| D1/D2/D6 compared against a zero floor | dB against digital silence is degenerate (166 dB readings) | not applicable when floor or median is digital silence |

D5's initial trip on the room-tone clips was a **false positive from a broken
metric**; the corrected metric clears it. Stated plainly because an earlier draft of
this document reported that trip as a finding.

**This tests the harness, not the pipeline.** Echo-processed noise is still not
tactile audio. It proves the diagnostics fire; it proves nothing about real unboxing
material.

## 6 · The eight steps, when footage arrives

| # | Step | Command / output |
|---|---|---|
| 1 | analyse it | `20_asmr_analyze.py <work>` → `asmr-analysis.json` |
| 2 | produce the proposed edit plan | `21_asmr_plan.py <work>` → `asmr-plan.json` |
| 3 | show what it cuts and protects | `asmr-decisions.md` — Removed vs **Guarded** per clip |
| 4 | render one test output | `22_asmr_render.py <work>` → `asmr-final.mp4` |
| 5 | compare synthetic vs real thresholds | `23_asmr_calibrate.py <work>` → `calibration-report.md` |
| 6 | tune only if needed | `--apply real-v1`; **writes nothing if no diagnostic trips** |
| 7 | document the calibration delta | `tuning.py delta synthetic-v1 real-v1` |
| 8 | no Brand OS change unless blocked | tuning cannot reach `brand/tokens/` by construction |

Step 6 is gated in code, not by intention: with no diagnostic tripped, `--apply`
prints `nothing to apply` and writes no profile. A derived profile is also never
made active automatically — activation stays a deliberate act.

## 7 · What would count as a genuine blocker

Per the standing instruction, Brand OS architecture changes only for a genuine
implementation blocker. On this work that would mean:

- a real clip whose correct edit is impossible without a **different safe-zone or
  canvas** than the tokens define (a Brand OS question, not a tuning one)
- the watermark being unreadable or intrusive over real footage at real viewing size
- recomposition of a real aspect ratio that fit-and-hold genuinely cannot serve

Anything reachable by moving a number in `thresholds.json` is **not** a blocker.

## 8 · The honest limit

No metric in this document establishes that an edit sounds good. The diagnostics
can prove a decay was not truncated; they cannot prove the cut came at the right
moment in a gesture. Step 4 renders an output specifically so it can be **listened
to** — that judgement is Adel's, and no threshold substitutes for it.

**One short real ASMR unboxing clip is the only remaining dependency.**
