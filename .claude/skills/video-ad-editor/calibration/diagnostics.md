# ASMR calibration diagnostics

**These trip conditions were written before any real ASMR footage existed.**

That ordering is the point. If thresholds were adjusted after looking at one clip
until the output "looked right", the result would be a system tuned to that clip
and to nothing else. Fixing the conditions first makes the calibration a test the
footage either passes or fails, and makes the delta a measurement rather than an
opinion.

Run by `scripts/23_asmr_calibrate.py`. A constant moves only when a diagnostic
trips. If nothing trips, nothing is tuned.

## What the synthetic baseline actually established

Recorded in `synthetic-baseline.json` from the four generated test clips:

| Measurement | Synthetic value | Consequence |
|---|---|---|
| 20th-percentile RMS | **exactly 0** (−180 dBFS clamp) | `floor × 2.2` and `floor × 4.0` are both **zero** |
| median RMS (2 of 4 clips) | **exactly 0** | `median × 3.0` is **zero** on those clips |
| deciding silence branch | `peak` | the floor branch has **never fired** |
| deciding event branch | `peak` | the floor branch has **never fired** |

So of the five threshold branches in the detector, **only the two peak-relative
ones have ever been exercised.** Generated audio has true digital silence between
bursts; a real room does not. The moment real footage arrives, the floor- and
median-relative branches go live for the first time — a behaviour change with no
code change. `D9` exists to make that transition visible instead of letting it be
discovered in a bad render.

## The diagnostics

| Code | Name | Severity | Trips when | Proposes |
|---|---|---|---|---|
| **D1** | `SILENCE_OVER_CUT` | **critical** | median < 6 dB above floor **and** > 45% of clip called silent | `silence.floor_multiplier` → 1.43 |
| **D2** | `EVENT_UNDER_DETECT` | high | < 0.40 events/s **and** > 12 dB headroom above median | `events.median_multiplier` → 2.0, `events.peak_fraction` → 0.10 |
| **D3** | `EVENT_OVER_DETECT` | medium | > 6.0 events/s | `events.refractory_s` → 0.15, `events.rise_ratio` → 2.2 |
| **D4** | `PEAK_MASKING` | high | peak > 6 dB above p99 | `events.peak_fraction` → 0.10 |
| **D5** | `ONSET_SMEAR` | high | median onset rise < required `rise_ratio` | `events.rise_ratio` → measured × 0.85 |
| **D6** | `FLOOR_DRIFT` | medium | floor drifts > 6 dB across clip | `silence.floor_percentile` → 0.10 |
| **D7** | `TAIL_TRUNCATION` | **critical** | 75th-percentile decay > `tail_s` | `plan.tail_s` → measured p75 × 1.1 |
| **D8** | `SCENE_FALSE_POSITIVE` | low | > 0.5 scene changes/s | `scene.threshold` → 0.25 |
| **D9** | `BRANCH_ACTIVATION` | high | deciding branch differs from baseline | *nothing* — reports only |
| **D10** | `NO_EVENTS` | **critical** | a clip detects zero events | `events.median_multiplier` → 2.0, `events.rise_ratio` → 1.4 |

### Why D1 and D7 are the critical two

Both protect against **over-cutting**, which is how this format fails audibly.

`D1` catches the case where room tone lifts the floor so far that quiet handling
reads as dead time and gets removed. `D7` catches cuts landing inside a decay.
Under-detection (D2) yields a lazy edit; over-cutting yields an edit that sounds
broken. They are not symmetric risks, and the thresholds are deliberately biased
toward keeping material.

### D9 proposes nothing on purpose

A branch change is not a fault to auto-correct — it is a signal that untested
logic is now in charge. The correct response is a human listening to the cut
list, not an automatic threshold move.

## Evaluation is per clip, not just aggregate

A mean hides the case that matters most: one clip detecting nothing while its
neighbour carries the average. Every diagnostic runs against each clip *and* the
aggregate; **any clip tripping trips the diagnostic**, and the report names which.

This was not a design choice up front — it was forced by the self-test below,
where a completely dead clip sat behind a healthy average unnoticed.

## Harness self-test

An untested test harness is worth nothing. The diagnostics were run against two
generated clips carrying continuous room tone and `aecho` reverb — conditions
synthetic bursts lack:

```
⚠ D1   60% of clip called silent — room tone cut as dead time      (2/2 clips)
⚠ D7   p75 decay 0.47s vs 0.45s reserve                            (1/2 clips)
⚠ D9   silence_branch: peak → floor,  event_branch: peak → median  (2/2 clips)
⚠ D10  roomtone-02: zero events at 32% occupancy — un-editable     (1/2 clips)
```

And the control, run against the four synthetic clips the thresholds were tuned on:

```
✓ no diagnostic tripped — synthetic thresholds hold, no tuning proposed
```

Two controls, opposite results, both correct.

### Three diagnostics were wrong and were corrected by this self-test

Running the harness against its own baseline exposed genuine errors in the
*measurements*, not the trip levels. Fixed by correcting the metric:

| Was | Why it was wrong | Fix |
|---|---|---|
| D5 averaged rise over every loud window | most loud windows are mid-burst (flat or falling), so perfectly sharp audio reported a "rise" of 0.77× | measure only the first window of each loud run — an actual attack |
| D7 terminated decay at `floor × 2` | against a digital-silence floor that is ~zero, so decays never ended | fall back to `max(floor×2, median×0.5, peak×0.02)` |
| D6/D1/D2 compared against a zero floor | dB against digital silence is degenerate (~166 dB readings) | guarded: not applicable when floor or median is digital silence |

D5's original trip on the room-tone clips was therefore a **false positive from a
broken metric**, and the corrected metric clears it. Recorded here rather than
quietly amended, because the earlier number appears in the first draft of the
Phase 2D validation document.

**This tests the harness, not the pipeline.** Echo-processed noise is still not
tactile audio. It proves the diagnostics fire; it proves nothing about real
unboxing material.
