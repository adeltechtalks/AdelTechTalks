# ASMR calibration report

Footage: `/tmp/claude-0/-home-user-AdelTechTalks/118735a4-6e6c-58e1-89aa-45150f760a83/scratchpad/realwork` — 1 clip(s) with audio.  
Tuning profile under test: **real-v1**

## 1. Measured signature (threshold-independent)

| Metric | Synthetic baseline | This footage | Δ |
|---|---:|---:|---:|
| `decay_median_s` | 0.3 | 0.18 | -0.12 |
| `decay_p75_s` | 0.3 | 0.28 | -0.02 |
| `duration_s` | 9.75 | 225.73 | +215.98 |
| `floor_dbfs` | -180.0 | -67.42 | +112.58 |
| `floor_drift_db` | 0.0 | 29.53 | +29.53 |
| `floor_is_digital_silence` | 1 | 0 | -1 |
| `median_above_floor_db` | 51.417 | 4.5 | -46.917 |
| `median_dbfs` | -128.583 | -62.92 | +65.663 |
| `median_is_digital_silence` | 0.5 | 0 | -0.5 |
| `occupancy` | 0.516 | 0.32 | -0.196 |
| `onset_rise_median` | 106.972 | 3.067 | -103.905 |
| `p99_dbfs` | -12.012 | -41.79 | -29.778 |
| `peak_above_median_db` | 116.748 | 36.65 | -80.098 |
| `peak_above_p99_db` | 0.177 | 15.52 | +15.343 |
| `peak_dbfs` | -11.835 | -26.27 | -14.435 |
| `scene_changes_per_s` | 0.0 | 0.0 | 0.0 |

## 2. Detection result with synthetic-tuned thresholds

| Metric | Synthetic baseline | This footage |
|---|---:|---:|
| `event_branch` | peak | median |
| `event_reference` | — | p95 |
| `events` | 6 | 184 |
| `events_per_s` | 0.597 | 0.815 |
| `silence_branch` | peak | floor |
| `silence_fraction` | 0.811 | 0.066 |
| `silence_reference` | — | p95 |
| `silence_seconds` | 7.86 | 14.96 |
| `silences` | 6.25 | 18 |

## 3. Diagnostics

Trip conditions were fixed before any real footage existed — see `calibration/diagnostics.md`. A threshold moves only when a diagnostic trips.

| | Code | Diagnostic | Severity | Finding |
|---|---|---|---|---|
| ✅ | D1 | `SILENCE_OVER_CUT` | critical | median sits 4.5 dB above floor, silence covers 7% — floor multiplier is safe |
| ✅ | D2 | `EVENT_UNDER_DETECT` | high | 0.81 events/s — detection is finding material |
| ✅ | D3 | `EVENT_OVER_DETECT` | medium | 0.81 events/s — no runaway detection |
| ✅ | D4 | `PEAK_MASKING` | high | peak sits 15.52 dB above p99, but thresholds anchor on p95 — outlier cannot dominate |
| ✅ | D5 | `ONSET_SMEAR` | high | median onset rise 3.067× vs required 1.8× — attacks are sharp enough |
| ⚠️ | D6 | `FLOOR_DRIFT` | medium | floor drifts 29.53 dB across the clip — a single global floor is wrong for much of it; raising the percentile is the conservative fix · also trips individually on 1/1 clip(s) |
| ✅ | D7 | `TAIL_TRUNCATION` | critical | 75th-percentile decay 0.28s fits inside the 0.45s tail reserve |
| ✅ | D8 | `SCENE_FALSE_POSITIVE` | low | 0.00 scene changes/s — plausible |
| ⚠️ | D9 | `BRANCH_ACTIVATION` | high | threshold branch changed vs synthetic baseline — silence_branch: peak → floor, event_branch: peak → median. Logic never exercised on synthetic footage is now deciding the edit; review the cut list by ear before trusting it · also trips individually on 1/1 clip(s) |
| ✅ | D10 | `NO_EVENTS` | critical | 184 event(s) detected — clip is editable |

## 4. Proposed calibration delta

| Constant | Current | Proposed | Change | Driven by |
|---|---:|---:|---:|---|
| `silence.floor_percentile` | 0.1 | 0.1 | 0.0% | D6 |

## 5. What was NOT changed

- Brand OS architecture, tokens, and `brand_profile.py` — untouched. Detection tuning cannot move a safe zone, a canvas size, or a watermark.
- The analysis → planning → rendering separation.
- The audio policy gate (music, captions, denoise, gate, compression, speed).
- The non-cropping recomposition branch.

