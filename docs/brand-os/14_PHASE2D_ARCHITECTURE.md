# Phase 2D — architecture, written before implementation

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


**Goal:** turn the approved Brand OS, the Creative Decision Engine and the video-ad-editor skill into an **end-to-end production workflow**, proven on one format: **ASMR unboxing**.
**Foundations:** Phase 2A, 2B and 2C are FINAL APPROVED and are not reopened.
**Not in this phase:** no Motion Carousel implementation · no Canva production sync · no Adobe work · no Supabase, RLS, Security Guardrails or deployment change · no existing PR merged.

---

## 1 · What exists, and what is actually missing

The skill already has an assembler. What it does not have is **judgement**.

| Step the brief asks for | Today |
|---|---|
| 1. inspect the footage | `12_asmr_inventory.py` — probes and contact-sheets. Partial. |
| 2. identify usable clips and hero moments | **missing** |
| 3. sequence the edit | **missing** — `asmr-plan.json` is hand-written |
| 4. remove dead time without destroying tactile rhythm | **missing** |
| 5–7. preserve natural mic audio, no denoise/gate/compression, music off | already correct in `formats/asmr-unboxing.json` — but only as declared policy, never enforced by code |
| 8–9. captions off, minimal text | declared, not enforced |
| 10–13. branding, watermark, motion, intro/end card | partial: `13_asmr_assemble.py` overlays a signature only |
| 14. export publish-ready | `13_asmr_assemble.py` + `06_encode.sh` |

So Phase 2D builds **2, 3, 4**, enforces **5–9** in code rather than in prose, and completes **10–13**.

## 2 · Three conflicts with the Brand OS, found by reading the code

These are documented first and replaced second, exactly as instructed.

| # | Conflict | Today | Approved value |
|---|---|---|---|
| **C1** | `08_safe_check.js` hard-codes reel reserves | top band `0–150`, bottom band `1620–1920`, caution `1500–1620` — the **superseded bootstrap** numbers | **260 top / 420 bottom** (`--atc-social-reel-*`) |
| **C2** | `13_asmr_assemble.py` centre-crops to fit the target | `scale=…force_original_aspect_ratio=increase, crop=TW:TH` — a blind centre-crop | Fold-First forbids it: alternate formats **recompose**, never crop |
| **C3** | Brand values are duplicated inside the engine | canvas defaults, signature width/opacity/margins live in script defaults | one source: `brand/tokens/adel-v2.1.json` |

**C2 is the important one.** For a 9:16 master from portrait footage the crop is harmless, which is why it survived. The moment an alternate format is requested it becomes exactly the behaviour the adaptive architecture exists to forbid.

## 3 · The integration seam

One new module is the **only** place brand values enter the video engine:

```
scripts/brand_profile.py   reads brand/tokens/adel-v2.1.json
                           → canvas profile (w, h, margin, reserves, fps)
                           → watermark geometry and placement
                           → motion durations and easing
                           → format rules (audio policy, sequence, ceilings)
```

Every other script asks it. Nothing re-states a value. If the token export moves, one file changes.

## 4 · The ASMR pipeline

```
raw clips
   │
   ├─ 20_asmr_analyze.py   ingest + analysis
   │     ffprobe geometry/duration · silencedetect → dead time
   │     RMS envelope at 8 kHz mono → tactile transients (peel, click, snap)
   │     scene score → camera motion
   │     → asmr-analysis.json   (per clip: usable ranges, events, hero windows)
   │
   ├─ 21_asmr_plan.py      edit decisions
   │     orders clips into the approved default_sequence
   │     trims dead time but PADS every tactile event (rhythm survives)
   │     enforces the audio policy in code
   │     → asmr-plan.json + asmr-decisions.md  (why each cut exists)
   │
   ├─ 22_asmr_render.py    assemble · brand · export
   │     recompose (never blind-crop) · watermark from token geometry
   │     optional intro/end card · publish-ready encode
   │     → asmr-final.mp4
   │
   └─ 08_safe_check.js     reserves read from the token export (C1 fixed)
```

## 5 · The rule that shapes step 4

**Dead time is removed; tactile rhythm is not.** Cutting to the last millisecond of a sound destroys ASMR — the decay *is* the content. So:

- a detected transient reserves `pre-roll` before and `tail` after it, and a silence overlapping that reserve is **not** cut
- only silence longer than a floor, and outside every reserve, is removed
- cuts land on silence, never mid-transient
- a short boundary fade prevents clicks at the splice, and is the **only** audio processing applied

No denoise, no gate, no compressor, no loudness normalisation. The renderer refuses to apply them even if a plan asks: the policy is enforced where it can be checked, not merely written down.

## 6 · Creative Decision Engine integration

The engine's recommendation enters as a plan field, not as hard-coded behaviour: **at most one primary creative treatment and one supporting treatment**, and for ASMR the approved default is *product-first, tactile, premium, calm* — which usually means **no creative skill at all** beyond the watermark. The renderer caps treatments at two and records what it refused.

## 7 · Output

Primary: **9:16 vertical master**. The other three profiles (3:4, 4:3, 16:9) are supported by the profile loader and the recomposition path from day one, but only the 9:16 master is produced in this phase.

## 8 · The test, and its honest limit

**There is no ASMR footage in this repository.** So the test uses a **synthetic clip set generated with ffmpeg** — moving frames plus an audio track built from transient bursts separated by silences, which is what the analyser actually looks for.

That validates **ingest, analysis, dead-time removal, transient protection, edit decisions, the audio policy, watermark compositing, recomposition and export**. It does **not** validate creative judgement on real tactile footage, and the report will say so in those words. Real footage remains the one dependency.
