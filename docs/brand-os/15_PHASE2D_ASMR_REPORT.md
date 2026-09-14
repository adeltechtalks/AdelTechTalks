# Phase 2D — ASMR unboxing implementation report

> ## STATUS — PHASE 2D
> ### ✅ IMPLEMENTATION APPROVED
> ### ⏳ REAL-FOOTAGE VALIDATION PENDING
>
> Approved by Adel as an **implementation milestone**, 14 Sep 2026.
> **ASMR is NOT production-proven.** Approval covers the architecture and code below;
> it does not cover creative judgement on real tactile material.
>
> **Approved:** Brand OS token integration via `brand_profile.py` · removal of hard-coded
> safe zones · retirement of blind centre-cropping · analysis → planning → rendering
> separation · tactile-audio protection logic · policy enforcement (music, captions,
> denoise, gate, compression, speed) · non-cropping recomposition branch · Liquid Glass
> watermark integration · end-to-end ffmpeg render pipeline · inspectable/editable plan
> JSON · synthetic test validation · draft PR #27.
>
> **Unproven:** real-world tactile audio detection · threshold calibration on real
> footage · actual creative edit quality on a real unboxing · real camera noise, room
> noise and handling variability · publish-ready judgement without manual rescue.
>
> Validation mode: `docs/brand-os/16_PHASE2D_REALFOOTAGE_VALIDATION.md`


**Built and tested end to end.** Architecture written first: `14_PHASE2D_ARCHITECTURE.md`.
**Foundations:** Phase 2A, 2B and 2C are FINAL APPROVED and were not reopened.
**Not touched:** Canva, Adobe, Supabase, RLS, the Security Guardrails check, production deployment. No Motion Carousel work. No existing PR merged.

---

## 1 · Implementation architecture

```
brand/tokens/adel-v2.1.json          canonical export (unchanged)
        │
        └─ scripts/brand_profile.py  THE seam — the only place brand values
                                     enter the video engine
                                       profile(id)          canvas, margins, reserves, fps
                                       watermark(short_edge) geometry + the 24 px floor
                                       watermark_position()  margin / top-reserve
                                       motion(), format_rules(), colour()
        ┌────────────────────────────┴────────────────────────────┐
  20_asmr_analyze.py   →   21_asmr_plan.py   →   22_asmr_render.py
  ingest + analysis        edit decisions        assemble · brand · export
```

Nothing else restates a canvas size, a reserve, a watermark geometry or a colour. If the export moves, one file changes.

## 2 · Files changed

| File | Change |
|---|---|
| `scripts/brand_profile.py` | **new** — the token seam |
| `scripts/20_asmr_analyze.py` | **new** — probe · dead time · tactile transients · scene motion · hero windows |
| `scripts/21_asmr_plan.py` | **new** — edit decisions + `asmr-decisions.md` rationale |
| `scripts/22_asmr_render.py` | **new** — recompose, brand, enforce policy, export |
| `scripts/08_safe_check.js` | **conflict C1 fixed** — reserves now read from the export |
| `scripts/13_asmr_assemble.py` | marked superseded, with both reasons recorded |
| `formats/asmr-unboxing.json` | token source, pipeline, platform profiles, analysis knobs, creative caps |
| `templates/asmr-test-project.sh` | **new** — regenerates the synthetic test clips |

## 3 · The three conflicts, documented then replaced

| # | Was | Now |
|---|---|---|
| **C1** | `08_safe_check.js` hard-coded reel reserves **150 top / 300 bottom / 180 caution** — the superseded bootstrap numbers | reads **260 / 420** from the export; canvas and viewport too |
| **C2** | `13_asmr_assemble.py` **centre-cropped** to fit (`force_original_aspect_ratio=increase, crop`) | `22_asmr_render.py` **recomposes**: matching aspect scales, non-matching fits and holds on a Graphite ground |
| **C3** | canvas, signature width/opacity/margins duplicated inside scripts | every value via `brand_profile.py` |

**C2 was the dangerous one.** For a 9:16 master from portrait footage the crop is invisible, which is why it survived. The first alternate-format request would have made it throw the subject away — exactly what the adaptive architecture exists to forbid.

## 4 · The ASMR pipeline

**20 · analyse.** ffprobe geometry. An 8 kHz mono RMS envelope in 20 ms windows, computed in pure Python so the skill installs anywhere ffmpeg runs. From it: dead time (quiet relative to *this clip's own* noise floor, not an absolute dB) and tactile transients (a sharp rise above the local level). Scene score gives camera motion. Hero windows are dense transient activity with a stable camera.

**21 · plan.** Orders clips into the approved `default_sequence`, trims dead time, and writes both `asmr-plan.json` and a human-readable `asmr-decisions.md` saying why each cut exists.

**22 · render.** Recomposes, concatenates, composites the watermark from token geometry, exports faststart H.264/AAC, and writes a render audit.

## 5 · The rule that shapes the edit

> **Dead time is removed. Tactile rhythm is not.**

Every transient reserves **120 ms before** and **450 ms after** it. A silence overlapping a reserve is never trimmed — the decay *is* the content.

**A real bug was found and fixed here.** The first implementation *discarded* any kept run shorter than the minimum segment length. That threw away precisely the protected tactile content the reserves exist to defend — the opposite of the rule. Short runs are now **merged** with their neighbour by giving back the cut between them.

## 6 · Default settings

| | |
|---|---|
| Primary output | 9:16 `verticalStandard` 1080 × 1920 @ 30 fps |
| Supported | 3:4, 4:3, 16:9 — recomposed, never cropped |
| Music | **off** · Captions | **off** |
| Denoise / gate / compression / loudness normalisation | **off, and refused if a plan asks** |
| Speed · volume | 1.0 · 1.0 (recorded level is the content) |
| Only audio processing | a 5 ms boundary fade so a splice does not click |
| Creative treatments | ≤ 1 primary + 1 supporting; ASMR default is **none** beyond the watermark |
| Watermark | on, top-left, from the approved geometry |

**Policy is enforced in code, not declared in prose.** A plan asking for denoise, a gate, compression, normalisation, music, captions, or a speed or volume other than 1.0 is **refused with a non-zero exit**, not quietly obeyed.

## 7 · Before / after edit decisions

From the test run (`evidence/phase2d_asmr-decisions.md`):

| Clip | Length | Events | Silences | Removed | **Guarded** | Kept |
|---|---|---|---|---|---|---|
| `01-sealed-box` | 9.0s | 4 | 5 | 6.32s | **5** | 2.68s |
| `02-peel-open` | 10.0s | 9 | 9 | 4.96s | **9** | 6.29s |
| `03-macro-detail` | 8.0s | 3 | 3 | 6.36s | **3** | 5.97s |
| `04-handling` | 12.0s | 8 | 8 | 7.33s | **8** | 5.19s |

**39s → 20.13s across 23 segments.** The column that matters is **Guarded**: every silence that touched a tactile reserve was refused as a cut, while the non-reserved part of the same silence was removed. That is the difference between an edit and a jump-cut reel.

## 8 · Test render evidence

| File | Shows |
|---|---|
| `evidence/phase2d_frame-watermark.png` | the corner watermark at (72, 260), inside the safe zone |
| `evidence/phase2d_frame-recomposed.png` | the 16:9 source **fitted whole** into 9:16 — nothing cropped |
| `evidence/phase2d_contact-sheet.png` | six frames across the master |
| `evidence/phase2d_asmr-decisions.md` | the full decision record |
| `evidence/phase2d_asmr-render-audit.txt` | brand source, profile, recomposition modes, audio policy |
| `evidence/phase2d_asmr-analysis.excerpt.json` | analyser output |

Final master: **1080 × 1920 H.264, 48 kHz AAC, 21.27 s, 11.6 MB.** Policy enforcement was tested by feeding a deliberately bad plan (denoise + gate + speed 1.5) — refused with exit 5 and all three violations named.

## 9 · Remaining limitations

1. **No real ASMR footage exists in this repository.** The test clips are **synthetic** — transient bursts separated by silence, which is the structure the analyser looks for. This validates ingest, analysis, dead-time removal, transient protection, edit decisions, the audio policy, recomposition, watermarking and export. It does **not** validate creative judgement on real tactile material. That is the one dependency.
2. **Hero windows are detected but not yet used** to choose the opening shot; clip order still follows filename order against the approved sequence.
3. **Intro / end card are not wired.** The slots exist in the format; the branded opener and closer are not composited.
4. **Alternate formats are supported but untested** — the recomposition path runs, but 3:4 / 4:3 / 16:9 masters have not been produced.
5. **ffmpeg is a hard dependency** and is not vendored. It was installed into this session's container.
6. **`libx264` re-encodes twice** (segments, then watermark). Quality holds at CRF 18 but a single-pass filtergraph would be cleaner.
7. **Transient detection is amplitude-based.** It cannot distinguish a peel from a bump, so a loud non-tactile noise is protected like a tactile one.

## 10 · The command

```bash
bash .claude/skills/video-ad-editor/templates/asmr-test-project.sh ~/work/unboxing   # test clips only
# or: put real footage in ~/work/unboxing/raw/

python3 .claude/skills/video-ad-editor/scripts/20_asmr_analyze.py ~/work/unboxing
python3 .claude/skills/video-ad-editor/scripts/21_asmr_plan.py    ~/work/unboxing --seconds 28
python3 .claude/skills/video-ad-editor/scripts/22_asmr_render.py  ~/work/unboxing
```

Reads `~/work/unboxing/raw/*.mp4`, writes `asmr-analysis.json`, `asmr-plan.json`, `asmr-decisions.md`, `asmr-final.mp4` and `asmr-render-audit.txt`. Review `asmr-decisions.md` before the render — it is the edit, in words.

In future, through the skill: **"Edit this ASMR unboxing footage."**

## ⚠️ Post-delivery defect — unplayable master (FIXED)

The first renders, synthetic and real alike, were encoded **H.264 High 4:4:4
Predictive / yuv444p**. That will not play in browsers, QuickTime, iOS or Android.
The synthetic render carried the same defect and was reported as a successful
render because it was never played.

**Cause.** The watermark pass composites an RGBA mark with `overlay=...:format=auto`,
which promotes the chain to `yuv444p`, and that final encode set no `-pix_fmt`, so
x264 selected a 4:4:4 profile. The segment encodes were already correct; only the
watermark pass was not.

**Fix.** `format=yuv420p` pinned at the end of the watermark filtergraph, plus
`-pix_fmt yuv420p -profile:v high -level 4.0` on both encodes.

**Delivery gate.** `22_asmr_render.py` now probes its own output and exits 7 if the
pixel format is not `yuv420p`, printing what it found. Verified in both directions:
it accepts the corrected master and rejects a deliberately built yuv444p file. A
master that will not play on a phone is not a master, and that is now checked in
code rather than assumed.

Corrected output: **H.264 High / yuv420p / level 4.0, 1080×1920, AAC-LC 48 kHz**,
`moov` before `mdat` for progressive streaming.
