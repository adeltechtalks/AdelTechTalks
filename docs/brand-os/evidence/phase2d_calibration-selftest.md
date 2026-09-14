# ASMR calibration report

Footage: `/tmp/claude-0/-home-user-AdelTechTalks/118735a4-6e6c-58e1-89aa-45150f760a83/scratchpad/selftest` — 2 clip(s) with audio.  
Tuning profile under test: **synthetic-v1**

## 1. Measured signature (threshold-independent)

| Metric | Synthetic baseline | This footage | Δ |
|---|---:|---:|---:|
| `decay_median_s` | 0.3 | 0.45 | +0.15 |
| `decay_p75_s` | 0.3 | 0.47 | +0.17 |
| `duration_s` | 9.75 | 10.0 | +0.25 |
| `floor_dbfs` | -180.0 | -33.135 | +146.865 |
| `floor_drift_db` | 0.0 | 2.245 | +2.245 |
| `floor_is_digital_silence` | 1 | 0 | -1 |
| `median_above_floor_db` | 51.417 | 4.51 | -46.907 |
| `median_dbfs` | -128.583 | -28.625 | +99.958 |
| `median_is_digital_silence` | 0.5 | 0 | -0.5 |
| `occupancy` | 0.516 | 0.378 | -0.138 |
| `onset_rise_median` | 106.972 | 6.377 | -100.595 |
| `p99_dbfs` | -12.012 | -17.705 | -5.693 |
| `peak_above_median_db` | 116.748 | 11.14 | -105.608 |
| `peak_above_p99_db` | 0.177 | 0.22 | +0.043 |
| `peak_dbfs` | -11.835 | -17.485 | -5.65 |
| `scene_changes_per_s` | 0.0 | 0.0 | 0.0 |

## 2. Detection result with synthetic-tuned thresholds

| Metric | Synthetic baseline | This footage |
|---|---:|---:|
| `event_branch` | peak | median |
| `events` | 6 | 3.5 |
| `events_per_s` | 0.597 | 0.35 |
| `silence_branch` | peak | floor |
| `silence_fraction` | 0.811 | 0.603 |
| `silence_seconds` | 7.86 | 6.03 |
| `silences` | 6.25 | 9 |

## 3. Diagnostics

Trip conditions were fixed before any real footage existed — see `calibration/diagnostics.md`. A threshold moves only when a diagnostic trips.

| | Code | Diagnostic | Severity | Finding |
|---|---|---|---|---|
| ⚠️ | D1 | `SILENCE_OVER_CUT` | critical | median is only 4.51 dB above the floor and the current threshold calls 60% of the clip silent — continuous room tone is being cut as dead time · also trips individually on 2/2 clip(s) |
| ✅ | D2 | `EVENT_UNDER_DETECT` | high | 0.35 events/s — detection is finding material |
| ✅ | D3 | `EVENT_OVER_DETECT` | medium | 0.35 events/s — no runaway detection |
| ✅ | D4 | `PEAK_MASKING` | high | peak sits 0.22 dB above p99 — no single outlier dominating |
| ✅ | D5 | `ONSET_SMEAR` | high | median onset rise 6.377× vs required 1.8× — attacks are sharp enough |
| ✅ | D6 | `FLOOR_DRIFT` | medium | floor drifts 2.245 dB — stationary enough for a global floor |
| ⚠️ | D7 | `TAIL_TRUNCATION` | critical | 75th-percentile decay is 0.47s but the tail reserve is only 0.45s — cuts would truncate real decays · also trips individually on 1/2 clip(s) |
| ✅ | D8 | `SCENE_FALSE_POSITIVE` | low | 0.00 scene changes/s — plausible |
| ⚠️ | D9 | `BRANCH_ACTIVATION` | high | threshold branch changed vs synthetic baseline — silence_branch: peak → floor, event_branch: peak → median. Logic never exercised on synthetic footage is now deciding the edit; review the cut list by ear before trusting it · also trips individually on 2/2 clip(s) |
| ⚠️ | D10 | `NO_EVENTS` | critical | aggregate looks fine but 1 of 2 clip(s) trip individually (roomtone-02.mp4): zero events detected despite 32% occupancy — there is audio content the detector is not resolving; this clip cannot be edited |

## 4. Proposed calibration delta

| Constant | Current | Proposed | Change | Driven by |
|---|---:|---:|---:|---|
| `events.median_multiplier` | 3.0 | 2.0 | -33.3% | D10 |
| `events.rise_ratio` | 1.8 | 1.4 | -22.2% | D10 |
| `plan.tail_s` | 0.45 | 0.52 | +15.6% | D7 |
| `silence.floor_multiplier` | 2.2 | 1.43 | -35.0% | D1 |

## 5. What was NOT changed

- Brand OS architecture, tokens, and `brand_profile.py` — untouched. Detection tuning cannot move a safe zone, a canvas size, or a watermark.
- The analysis → planning → rendering separation.
- The audio policy gate (music, captions, denoise, gate, compression, speed).
- The non-cropping recomposition branch.

