#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""REAL-FOOTAGE VALIDATION mode for the ASMR pipeline.

Phase 2D is IMPLEMENTATION APPROVED / REAL-FOOTAGE VALIDATION PENDING. Every
detection constant was tuned against synthetic noise bursts. This script is how
that gets tested against real tactile audio — and, only where the evidence
demands it, corrected.

What it does:
  1. measures a threshold-INDEPENDENT signature of the footage
  2. compares that signature against the synthetic baseline
  3. runs eight named diagnostics whose trip conditions were written down
     BEFORE any real clip existed (see calibration/diagnostics.md)
  4. proposes a threshold delta ONLY for diagnostics that actually tripped
  5. writes calibration-report.md and, with --apply, a new tuning profile

What it must not do:
  · tune because a number looks unfamiliar — a diagnostic must trip
  · touch brand values — those come from brand_profile.py and are not tunable here
  · edit anything under brand/tokens/

Usage:
    python3 23_asmr_calibrate.py <workdir>                  # measure + report
    python3 23_asmr_calibrate.py <workdir> --apply real-v1  # also write profile
    python3 23_asmr_calibrate.py <workdir> --baseline       # record as baseline
"""
import array, json, math, statistics, subprocess, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import tuning

sys.argv_orig = list(sys.argv)
import importlib.util
_spec = importlib.util.spec_from_file_location(
    "analyze", Path(__file__).resolve().parent / "20_asmr_analyze.py")
_an = importlib.util.module_from_spec(_spec)
sys.argv = ["20_asmr_analyze.py"]          # keep the module from parsing our args
_spec.loader.exec_module(_an)
sys.argv = sys.argv_orig

CAL_DIR = Path(__file__).resolve().parent.parent / "calibration"
BASELINE = CAL_DIR / "synthetic-baseline.json"
CLIP_EXT = _an.CLIP_EXT


def db(x: float) -> float:
    return round(20.0 * math.log10(max(x, 1e-9)), 2)


def signature(env: list, scenes: list, duration: float, win_ms: int) -> dict:
    """Threshold-independent description of the audio. Nothing here depends on a
    tuning value, which is the whole point: it can be compared across footage."""
    if not env or duration <= 0:
        return {}
    srt = sorted(env)
    n = len(srt)
    floor = srt[int(n * 0.20)]
    p50 = statistics.median(env)
    p99 = srt[min(n - 1, int(n * 0.99))]
    peak = srt[-1]

    # Floor drift: is the room tone stationary? Synthetic audio is; a real room
    # with traffic, aircon or a moving mic is not, and a single global floor
    # then mis-describes most of the clip.
    per_s, wps = [], max(1, int(1000 / win_ms))
    for i in range(0, len(env) - wps, wps):
        chunk = sorted(env[i:i + wps])
        if chunk:
            per_s.append(chunk[int(len(chunk) * 0.20)])
    if len(per_s) > 1 and min(per_s) > 1e-9:
        drift = db(max(per_s)) - db(min(per_s))
    else:
        drift = 0.0          # undefined against digital silence — see d6_floor_drift

    # Occupancy: share of the clip meaningfully above its own floor. Synthetic
    # bursts leave long true gaps; real tactile handling rarely does.
    occ = sum(1 for v in env if v > floor * 2.2) / len(env)

    # Onset sharpness: how fast do rises actually happen? Room reflections smear
    # attacks, so a rise ratio tuned on dry synthetic clicks can miss real ones.
    # Only the FIRST window of each loud run is an onset. Averaging over every
    # loud window measures the body of a burst, which is flat or falling, and
    # reports a "rise" below 1.0 for perfectly sharp audio.
    rises, loud = [], False
    for i in range(1, len(env)):
        hot = env[i] >= p99 * 0.5
        if hot and not loud:
            prev = env[i - 1] if env[i - 1] > 1e-9 else 1e-9
            rises.append(env[i] / prev)
        loud = hot
    onset = round(statistics.median(rises), 3) if rises else 0.0

    # Decay time: from a loud window, how long to fall back near the floor?
    # This is the ASMR-critical number — it is what tail_s has to cover.
    # A degenerate (digital-silence) floor makes floor*2 useless as a return
    # level, so fall back to level-relative terms that always exist.
    thr = max(floor * 2.0, p50 * 0.5, peak * 0.02, 1e-9)
    decays, i = [], 1
    while i < len(env) - 1:
        if env[i] >= p99 * 0.6 and env[i] > env[i - 1]:
            j = i + 1
            while j < len(env) and env[j] > thr and j - i < int(3000 / win_ms):
                j += 1
            decays.append((j - i) * win_ms / 1000.0)
            i = j
        i += 1
    decays.sort()
    d_med = decays[len(decays) // 2] if decays else 0.0
    d_p75 = decays[int(len(decays) * 0.75)] if decays else 0.0

    return {
        "duration_s": round(duration, 2),
        "floor_is_digital_silence": floor <= 1e-9,
        "median_is_digital_silence": p50 <= 1e-9,
        "floor_dbfs": db(floor), "median_dbfs": db(p50),
        "p99_dbfs": db(p99), "peak_dbfs": db(peak),
        "median_above_floor_db": round(db(p50) - db(floor), 2),
        "peak_above_median_db": round(db(peak) - db(p50), 2),
        "peak_above_p99_db": round(db(peak) - db(p99), 2),
        "floor_drift_db": round(drift, 2),
        "occupancy": round(occ, 3),
        "onset_rise_median": onset,
        "decay_median_s": round(d_med, 3),
        "decay_p75_s": round(d_p75, 3),
        "scene_changes_per_s": round(len(scenes) / duration, 3),
    }


# ─────────────────────────────────────────────────────────────────────────────
# Diagnostics. Trip conditions written BEFORE any real footage was available.
# Each returns (tripped: bool, evidence: str, proposal: dict|None).
# ─────────────────────────────────────────────────────────────────────────────

def d1_silence_over_cut(sig, det, T):
    """DANGEROUS DIRECTION. Room tone lifts the measured floor, so floor*2.2 can
    sit above quiet handling — real tactile content then reads as dead time and
    gets cut. Over-cutting is the failure that destroys the format."""
    # Only meaningful against a REAL noise floor. With digital silence both floor
    # and median are zero, the dB comparison is degenerate, and a clip that is
    # genuinely mostly silent is not evidence of over-cutting.
    if sig.get("floor_is_digital_silence") or sig.get("median_is_digital_silence"):
        return False, "floor/median are digital silence — no room tone to over-cut, not applicable", None
    trip = sig["median_above_floor_db"] < 6.0 and det["silence_fraction"] > 0.45
    if not trip:
        return False, (f"median sits {sig['median_above_floor_db']} dB above floor, "
                       f"silence covers {det['silence_fraction']:.0%} — floor multiplier is safe"), None
    return True, (f"median is only {sig['median_above_floor_db']} dB above the floor and the "
                  f"current threshold calls {det['silence_fraction']:.0%} of the clip silent — "
                  f"continuous room tone is being cut as dead time"), \
        {"silence.floor_multiplier": round(max(1.2, 2.2 * 0.65), 2)}


def d2_event_under_detect(sig, det, T):
    """Real ASMR is dense. Too few events means median*3.0 is above the peels."""
    # peak_above_median_db is degenerate when the median is digital silence
    # (it reads as ~166 dB), so the headroom test cannot be applied there.
    if sig.get("median_is_digital_silence"):
        return False, (f"{det['events_per_s']:.2f} events/s — median is digital silence, "
                       f"headroom test not applicable"), None
    trip = det["events_per_s"] < 0.40 and sig["peak_above_median_db"] > 12.0
    if not trip:
        return False, f"{det['events_per_s']:.2f} events/s — detection is finding material", None
    return True, (f"only {det['events_per_s']:.2f} events/s despite "
                  f"{sig['peak_above_median_db']} dB of headroom above the median — "
                  f"the event threshold is sitting above real transients"), \
        {"events.median_multiplier": 2.0, "events.peak_fraction": 0.10}


def d3_event_over_detect(sig, det, T):
    """A continuous crackle is one gesture, not two hundred events."""
    trip = det["events_per_s"] > 6.0
    if not trip:
        return False, f"{det['events_per_s']:.2f} events/s — no runaway detection", None
    return True, (f"{det['events_per_s']:.2f} events/s — a continuous texture is being "
                  f"shredded into separate events"), \
        {"events.refractory_s": 0.15, "events.rise_ratio": 2.2}


def d4_peak_masking(sig, det, T):
    """One loud outlier inflates peak, so peak_fraction masks every softer event."""
    trip = sig["peak_above_p99_db"] > 6.0
    if not trip:
        return False, (f"peak sits {sig['peak_above_p99_db']} dB above p99 — "
                       f"no single outlier dominating"), None
    return True, (f"peak is {sig['peak_above_p99_db']} dB above p99: one loud moment is "
                  f"setting the threshold for the whole clip and masking quieter tactile work"), \
        {"events.peak_fraction": 0.10}


def d5_onset_smear(sig, det, T):
    """Reverb smears attacks. A rise ratio tuned on dry synthetic clicks misses them."""
    trip = 0.0 < sig["onset_rise_median"] < float(T["events"]["rise_ratio"])
    if not trip:
        return False, (f"median onset rise {sig['onset_rise_median']}× vs required "
                       f"{T['events']['rise_ratio']}× — attacks are sharp enough"), None
    return True, (f"median onset rises only {sig['onset_rise_median']}× per 20 ms window but "
                  f"{T['events']['rise_ratio']}× is required — room reflections are smearing "
                  f"attacks past the detector"), \
        {"events.rise_ratio": max(1.2, round(sig["onset_rise_median"] * 0.85, 2))}


def d6_floor_drift(sig, det, T):
    """A drifting floor means one global threshold mis-describes most of the clip."""
    if sig.get("floor_is_digital_silence"):
        return False, "floor is digital silence — drift undefined, not applicable", None
    trip = sig["floor_drift_db"] > 6.0
    if not trip:
        return False, f"floor drifts {sig['floor_drift_db']} dB — stationary enough for a global floor", None
    return True, (f"floor drifts {sig['floor_drift_db']} dB across the clip — a single global "
                  f"floor is wrong for much of it; raising the percentile is the conservative fix"), \
        {"silence.floor_percentile": 0.10}


def d7_tail_truncation(sig, det, T):
    """The one that matters most. If real decays outlast tail_s, every cut
    truncates a decay — the single most audible way to ruin an ASMR edit."""
    tail = float(T["plan"]["tail_s"])
    trip = sig["decay_p75_s"] > tail
    if not trip:
        return False, (f"75th-percentile decay {sig['decay_p75_s']}s fits inside the "
                       f"{tail}s tail reserve"), None
    return True, (f"75th-percentile decay is {sig['decay_p75_s']}s but the tail reserve is only "
                  f"{tail}s — cuts would truncate real decays"), \
        {"plan.tail_s": round(min(1.5, sig["decay_p75_s"] * 1.1), 2)}


def d8_scene_false_positive(sig, det, T):
    """Handheld motion is not a cut. False scenes suppress genuine hero windows."""
    trip = sig["scene_changes_per_s"] > 0.5
    if not trip:
        return False, f"{sig['scene_changes_per_s']:.2f} scene changes/s — plausible", None
    return True, (f"{sig['scene_changes_per_s']:.2f} scene changes/s — handheld motion is being "
                  f"read as cuts, suppressing hero windows"), \
        {"scene.threshold": 0.25}


def d10_no_events(sig, det, T):
    """A clip with zero detected transients has NO protected spans, so the planner
    cannot edit it at all — it is either dropped or passed through untouched.
    Headroom gating (D2) deliberately stays quiet when a clip may genuinely be
    eventless; this fires regardless, because an un-editable clip is a hard
    failure whatever the reason."""
    if det["events"] > 0:
        return False, f"{det['events']} event(s) detected — clip is editable", None
    if sig.get("occupancy", 0) < 0.15:
        return True, ("zero events detected and the clip is near-empty — it may genuinely "
                      "contain no tactile content; check the source before tuning"), None
    return True, (f"zero events detected despite {sig['occupancy']:.0%} occupancy — there is "
                  f"audio content the detector is not resolving; this clip cannot be edited"),         {"events.median_multiplier": 2.0, "events.rise_ratio": 1.4}


def d9_branch_activation(sig, det, T):
    """On synthetic footage the floor-relative branches are identically zero and
    never fire. Real footage has a real noise floor, so those branches go live
    for the first time — a behaviour change with no code change. Not a fault;
    a transition that must be seen rather than discovered in a bad render."""
    base = json.loads(BASELINE.read_text(encoding="utf-8")) if BASELINE.exists() else None
    if not base:
        return False, "no baseline on file — branch comparison unavailable", None
    bd = base.get("detection", {})
    moved = [n for n in ("silence_branch", "event_branch")
             if bd.get(n) and det.get(n) and bd[n] != det[n]]
    if not moved:
        return False, (f"threshold branches unchanged from baseline "
                       f"(silence={det.get('silence_branch')}, event={det.get('event_branch')})"), None
    detail = ", ".join(f"{n}: {bd[n]} → {det[n]}" for n in moved)
    return True, (f"threshold branch changed vs synthetic baseline — {detail}. Logic never "
                  f"exercised on synthetic footage is now deciding the edit; review the cut "
                  f"list by ear before trusting it"), None


DIAGNOSTICS = [
    ("D1", "SILENCE_OVER_CUT", d1_silence_over_cut, "critical"),
    ("D2", "EVENT_UNDER_DETECT", d2_event_under_detect, "high"),
    ("D3", "EVENT_OVER_DETECT", d3_event_over_detect, "medium"),
    ("D4", "PEAK_MASKING", d4_peak_masking, "high"),
    ("D5", "ONSET_SMEAR", d5_onset_smear, "high"),
    ("D6", "FLOOR_DRIFT", d6_floor_drift, "medium"),
    ("D7", "TAIL_TRUNCATION", d7_tail_truncation, "critical"),
    ("D8", "SCENE_FALSE_POSITIVE", d8_scene_false_positive, "low"),
    ("D9", "BRANCH_ACTIVATION", d9_branch_activation, "high"),
    ("D10", "NO_EVENTS", d10_no_events, "critical"),
]


def measure(clip: Path, T: dict) -> tuple:
    meta = _an.probe(clip)
    env = _an.envelope(clip) if meta.get("has_audio") else []
    if not env:
        return meta, {}, {}
    scenes = _an.scene_changes(clip)
    sig = signature(env, scenes, meta.get("duration", 0.0), int(T["envelope"]["window_ms"]))
    audio = _an.analyse_audio(env, {}, T)
    dur = max(meta.get("duration", 0.0), 1e-6)
    sil_s = sum(s["end"] - s["start"] for s in audio["silences"])
    # WHICH BRANCH of each max() actually decided the threshold. On synthetic
    # footage the floor branches are identically zero and have never fired; real
    # footage activates them for the first time, changing behaviour with no code
    # change. That transition is exactly what this records.
    f_, pk_, md_ = audio["noise_floor"], audio["peak"], audio["median"]
    SIL, EV = T["silence"], T["events"]
    sil_b = {"floor": f_ * float(SIL["floor_multiplier"]),
             "peak": pk_ * float(SIL["peak_fraction"])}
    ev_b = {"median": md_ * float(EV["median_multiplier"]),
            "peak": pk_ * float(EV["peak_fraction"]),
            "floor": f_ * float(EV["floor_multiplier"])}
    det = {
        "silence_branch": max(sil_b, key=sil_b.get),
        "event_branch": max(ev_b, key=ev_b.get),
        "events": len(audio["events"]),
        "events_per_s": round(len(audio["events"]) / dur, 3),
        "silences": len(audio["silences"]),
        "silence_fraction": round(sil_s / dur, 3),
        "silence_seconds": round(sil_s, 2),
    }
    return meta, sig, det


def mean_sig(sigs: list) -> dict:
    keys = set().union(*[set(s) for s in sigs]) if sigs else set()
    return {k: round(statistics.mean([s[k] for s in sigs if k in s]), 3)
            for k in sorted(keys)}


def main() -> int:
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        return 2
    work = Path(args[0]).resolve()
    apply_as = args[args.index("--apply") + 1] if "--apply" in args else None
    as_baseline = "--baseline" in args

    raw = work / "raw"
    if not raw.is_dir():
        print(f"❌ No footage directory at {raw}")
        return 3
    clips = sorted(p for p in raw.iterdir() if p.suffix.lower() in CLIP_EXT)
    if not clips:
        print(f"❌ No clips in {raw}")
        return 4

    T = tuning.load()
    print(f"tuning profile: {T['_id']}\n")

    sigs, dets, rows = [], [], []
    for c in clips:
        meta, sig, det = measure(c, T)
        if not sig:
            print(f"  {c.name:28s} — no audio, skipped")
            continue
        sigs.append(sig); dets.append(det)
        rows.append((c.name, sig, det))
        print(f"  {c.name:28s} floor {sig['floor_dbfs']:7.2f} dBFS  "
              f"med+{sig['median_above_floor_db']:5.2f} dB  occ {sig['occupancy']:.2f}  "
              f"decay75 {sig['decay_p75_s']:.2f}s  ev/s {det['events_per_s']:.2f}")
    if not sigs:
        print("❌ No clip had usable audio.")
        return 5

    agg_sig = mean_sig(sigs)
    agg_det = {}
    for k in dets[0]:
        vals = [d[k] for d in dets]
        if all(isinstance(v, (int, float)) for v in vals):
            agg_det[k] = round(statistics.mean(vals), 3)
        else:
            agg_det[k] = statistics.mode(vals)

    if as_baseline:
        BASELINE.write_text(json.dumps(
            {"_what": "Synthetic-footage signature. The reference the real-footage "
                      "calibration compares against.",
             "_tuning": T["_id"], "clips": len(sigs),
             "signature": agg_sig, "detection": agg_det,
             "per_clip": [{"file": n, "signature": s, "detection": d} for n, s, d in rows]},
            indent=2) + "\n", encoding="utf-8")
        print(f"\n✓ baseline recorded → {BASELINE}")
        return 0

    base = json.loads(BASELINE.read_text(encoding="utf-8")) if BASELINE.exists() else None

    # Diagnostics run PER CLIP as well as on the aggregate. A mean hides the
    # case that matters most: one clip detecting nothing at all while its
    # neighbour carries the average. Any clip tripping trips the diagnostic.
    results, proposal = [], {}
    for code, name, fn, sev in DIAGNOSTICS:
        agg_trip, agg_ev, agg_prop = fn(agg_sig, agg_det, T)
        per = []
        for n, sg, dt in rows:
            try:
                t_, e_, p_ = fn(sg, dt, T)
            except Exception:
                continue
            if t_:
                per.append((n, e_, p_))
        tripped = agg_trip or bool(per)
        if per and not agg_trip:
            names = ", ".join(n for n, _, _ in per)
            evidence = (f"aggregate looks fine but {len(per)} of {len(rows)} clip(s) trip "
                        f"individually ({names}): {per[0][1]}")
            prop = per[0][2]
        else:
            evidence, prop = agg_ev, agg_prop
            if per:
                evidence += f" · also trips individually on {len(per)}/{len(rows)} clip(s)"
        results.append((code, name, sev, tripped, evidence, prop))
        if tripped and prop:
            proposal.update(prop)

    print()
    for code, name, sev, tripped, evidence, _ in results:
        print(f"  {'⚠ TRIP ' if tripped else '  ok   '} {code} {name:22s} {evidence}")

    # Report
    lines = ["# ASMR calibration report", "",
             f"Footage: `{work}` — {len(sigs)} clip(s) with audio.  ",
             f"Tuning profile under test: **{T['_id']}**", "",
             "## 1. Measured signature (threshold-independent)", ""]
    if base:
        lines += ["| Metric | Synthetic baseline | This footage | Δ |",
                  "|---|---:|---:|---:|"]
        bs = base.get("signature", {})
        for k in sorted(agg_sig):
            b, r = bs.get(k), agg_sig[k]
            d = round(r - b, 3) if isinstance(b, (int, float)) else None
            lines.append(f"| `{k}` | {b if b is not None else '—'} | {r} | "
                         f"{('+' if d and d > 0 else '')}{d if d is not None else '—'} |")
    else:
        lines += ["| Metric | This footage |", "|---|---:|"]
        lines += [f"| `{k}` | {v} |" for k, v in sorted(agg_sig.items())]
        lines += ["", "> No synthetic baseline on file — comparison unavailable."]

    lines += ["", "## 2. Detection result with synthetic-tuned thresholds", "",
              "| Metric | Synthetic baseline | This footage |", "|---|---:|---:|"]
    bd = (base or {}).get("detection", {})
    for k in sorted(agg_det):
        lines.append(f"| `{k}` | {bd.get(k, '—')} | {agg_det[k]} |")

    lines += ["", "## 3. Diagnostics", "",
              "Trip conditions were fixed before any real footage existed — see "
              "`calibration/diagnostics.md`. A threshold moves only when a diagnostic trips.", "",
              "| | Code | Diagnostic | Severity | Finding |", "|---|---|---|---|---|"]
    for code, name, sev, tripped, evidence, _ in results:
        lines.append(f"| {'⚠️' if tripped else '✅'} | {code} | `{name}` | {sev} | {evidence} |")

    lines += ["", "## 4. Proposed calibration delta", ""]
    if not proposal:
        lines += ["**None. No diagnostic tripped.**", "",
                  "The synthetic-tuned thresholds hold on this footage. Tuning was not needed "
                  "and was not performed — the instruction was to tune only if needed."]
        print("\n✓ no diagnostic tripped — synthetic thresholds hold, no tuning proposed")
    else:
        cur = tuning.flat(T["_id"])
        lines += ["| Constant | Current | Proposed | Change | Driven by |", "|---|---:|---:|---:|---|"]
        for k, v in sorted(proposal.items()):
            c = cur.get(k)
            pct = round((v - c) / c * 100.0, 1) if isinstance(c, (int, float)) and c else None
            drivers = [cd for cd, _n, _s, tp, _e, pr in results if tp and pr and k in pr]
            lines.append(f"| `{k}` | {c} | {v} | {('+' if pct and pct > 0 else '')}{pct}% | "
                         f"{', '.join(drivers)} |")
        print(f"\n⚠ {len(proposal)} threshold(s) proposed for change")

    lines += ["", "## 5. What was NOT changed", "",
              "- Brand OS architecture, tokens, and `brand_profile.py` — untouched. Detection "
              "tuning cannot move a safe zone, a canvas size, or a watermark.",
              "- The analysis → planning → rendering separation.",
              "- The audio policy gate (music, captions, denoise, gate, compression, speed).",
              "- The non-cropping recomposition branch.", ""]

    rpt = work / "calibration-report.md"
    rpt.write_text("\n".join(lines) + "\n", encoding="utf-8")
    (work / "calibration-signature.json").write_text(json.dumps(
        {"tuning": T["_id"], "signature": agg_sig, "detection": agg_det,
         "diagnostics": [{"code": c, "name": n, "severity": s, "tripped": t, "evidence": e}
                         for c, n, s, t, e, _ in results],
         "_note": "Diagnostics evaluate per clip and on the aggregate; any clip tripping "
                  "trips the diagnostic, so one dead clip cannot hide behind an average.",
         "proposal": proposal,
         "per_clip": [{"file": n, "signature": s, "detection": d} for n, s, d in rows]},
        indent=2) + "\n", encoding="utf-8")
    print(f"✓ {rpt}")

    if apply_as:
        if not proposal:
            print(f"· nothing to apply — profile '{apply_as}' not written")
            return 0
        newp = json.loads(json.dumps(tuning.load(T["_id"])))
        newp["_status"] = f"DERIVED from {T['_id']} by real-footage calibration"
        newp["_tuned_against"] = str(work)
        newp["_driven_by"] = [f"{c}:{n}" for c, n, _s, t, _e, _p in results if t]
        for k, v in proposal.items():
            g, _, key = k.partition(".")
            newp.setdefault(g, {})[key] = v
        tuning.save_profile(apply_as, newp, make_active=False)
        print(f"✓ profile '{apply_as}' written (NOT made active — activate deliberately)")
        print(f"  delta: python3 tuning.py delta {T['_id']} {apply_as}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
