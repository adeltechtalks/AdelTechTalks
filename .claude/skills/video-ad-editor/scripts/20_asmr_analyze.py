#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ASMR ingest + clip analysis.

Reads every clip in <workdir>/raw and answers three questions per clip:
  · where is the dead time?
  · where are the tactile events? (peel, click, snap, scratch, box-open)
  · where are the hero moments? (dense tactile activity, stable camera)

Writes <workdir>/asmr-analysis.json.

Deliberately dependency-free beyond ffmpeg/ffprobe: the RMS envelope is computed
in pure Python on an 8 kHz mono decode, which is ample for transient detection
and keeps the skill installable anywhere ffmpeg runs.

Usage: python3 20_asmr_analyze.py <workdir> [--profile verticalStandard]
"""
import array, json, math, statistics, subprocess, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import brand_profile as bp
import tuning

CLIP_EXT = {".mp4", ".mov", ".m4v", ".mkv", ".webm", ".avi"}

# Detection constants live in calibration/thresholds.json, never inline here.
# They are a property of the FOOTAGE, not of the brand — see tuning.py.
TUNE = tuning.load()
SR = int(TUNE["envelope"]["sample_rate_hz"])
WIN_MS = int(TUNE["envelope"]["window_ms"])


def probe(path: Path) -> dict:
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-print_format", "json",
         "-show_format", "-show_streams", str(path)],
        capture_output=True, text=True)
    if r.returncode:
        return {}
    d = json.loads(r.stdout or "{}")
    v = next((s for s in d.get("streams", []) if s.get("codec_type") == "video"), {})
    a = next((s for s in d.get("streams", []) if s.get("codec_type") == "audio"), None)
    fps = 0.0
    if v.get("avg_frame_rate", "0/0") not in ("0/0", None):
        num, _, den = v["avg_frame_rate"].partition("/")
        fps = float(num) / float(den or 1) if float(den or 1) else 0.0
    return {
        "duration": float(d.get("format", {}).get("duration") or 0.0),
        "width": int(v.get("width") or 0),
        "height": int(v.get("height") or 0),
        "fps": round(fps, 3),
        "has_audio": a is not None,
        "audio_channels": int(a.get("channels") or 0) if a else 0,
        "audio_sample_rate": int(a.get("sample_rate") or 0) if a else 0,
    }


def envelope(path: Path) -> list:
    """Short-window RMS envelope of the recorded audio, in linear amplitude."""
    r = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-vn",
         "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"],
        capture_output=True)
    if r.returncode or not r.stdout:
        return []
    pcm = array.array("h")
    pcm.frombytes(r.stdout[: len(r.stdout) - (len(r.stdout) % 2)])
    win = int(SR * WIN_MS / 1000)
    out = []
    for i in range(0, len(pcm) - win, win):
        acc = 0
        for s in pcm[i:i + win]:
            acc += s * s
        out.append(math.sqrt(acc / win) / 32768.0)
    return out


def analyse_audio(env: list, fmt_rules: dict, tune: dict = None) -> dict:
    """Dead time and tactile transients from the envelope."""
    T = tune or TUNE
    SIL, EV = T["silence"], T["events"]
    if not env:
        return {"noise_floor": 0.0, "peak": 0.0, "silences": [], "events": []}
    srt = sorted(env)
    floor = srt[int(len(srt) * float(SIL["floor_percentile"]))]
    peak = srt[-1]
    median = statistics.median(env)

    # Dead time: quiet relative to this clip's own floor, not an absolute dB.
    sil_thresh = max(floor * float(SIL["floor_multiplier"]), peak * float(SIL["peak_fraction"]))
    min_sil = float(SIL["min_silence_s"])

    silences, run = [], None
    for i, v in enumerate(env):
        t = i * WIN_MS / 1000.0
        if v <= sil_thresh:
            run = t if run is None else run
        else:
            if run is not None and t - run >= min_sil:
                silences.append({"start": round(run, 3), "end": round(t, 3)})
            run = None
    if run is not None:
        end = len(env) * WIN_MS / 1000.0
        if end - run >= min_sil:
            silences.append({"start": round(run, 3), "end": round(end, 3)})

    # Tactile transients: a sharp rise above the local level. These are the
    # content — a peel, a click, a snap — and they are what must survive.
    ev_thresh = max(median * float(EV["median_multiplier"]),
                    peak * float(EV["peak_fraction"]),
                    floor * float(EV["floor_multiplier"]))
    rise = float(EV["rise_ratio"]); refract = float(EV["refractory_s"])
    events, last = [], -1.0
    for i in range(1, len(env)):
        t = i * WIN_MS / 1000.0
        prev = env[i - 1] if env[i - 1] > 1e-9 else 1e-9
        if env[i] >= ev_thresh and env[i] / prev >= rise and t - last >= refract:
            events.append({"t": round(t, 3), "amp": round(env[i] / (peak or 1), 3)})
            last = t
    return {
        "noise_floor": round(floor, 6), "peak": round(peak, 6),
        "median": round(median, 6), "silence_threshold": round(sil_thresh, 6),
        "event_threshold": round(ev_thresh, 6),
        "silences": silences, "events": events,
        "_tuning": T["_id"],
    }


def scene_changes(path: Path, threshold: float = None) -> list:
    """Camera/scene motion proxy — used to avoid calling a pan a hero moment."""
    if threshold is None:
        threshold = float(TUNE["scene"]["threshold"])
    r = subprocess.run(
        ["ffmpeg", "-v", "info", "-i", str(path),
         "-vf", f"select='gt(scene,{threshold})',showinfo", "-f", "null", "-"],
        capture_output=True, text=True)
    out = []
    for line in (r.stderr or "").splitlines():
        if "pts_time:" in line:
            try:
                out.append(round(float(line.split("pts_time:")[1].split()[0]), 3))
            except (ValueError, IndexError):
                pass
    return out


def hero_windows(events: list, scenes: list, duration: float,
                 span: float = None, min_events: int = None) -> list:
    """Dense tactile activity with a stable camera. The moments worth leading with."""
    if span is None:
        span = float(TUNE["hero"]["span_s"])
    if min_events is None:
        min_events = int(TUNE["hero"]["min_events"])
    if not events:
        return []
    best = []
    for e in events:
        lo, hi = e["t"] - span / 2, e["t"] + span / 2
        inside = [x for x in events if lo <= x["t"] <= hi]
        if len(inside) < min_events:
            continue
        if any(lo <= s <= hi for s in scenes):
            continue                              # a cut mid-window is not a hero moment
        score = round(sum(x["amp"] for x in inside), 3)
        best.append({"start": round(max(0.0, lo), 3),
                     "end": round(min(duration, hi), 3),
                     "events": len(inside), "score": score})
    best.sort(key=lambda w: -w["score"])
    merged = []
    for w in best:
        if all(w["start"] >= m["end"] or w["end"] <= m["start"] for m in merged):
            merged.append(w)
    return merged[:6]


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: 20_asmr_analyze.py <workdir> [--profile verticalStandard]")
        return 2
    work = Path(sys.argv[1]).resolve()
    prof_name = "verticalStandard"
    if "--profile" in sys.argv:
        prof_name = sys.argv[sys.argv.index("--profile") + 1]
    raw = work / "raw"
    if not raw.is_dir():
        print(f"❌ No footage directory at {raw}")
        return 3

    prof = bp.profile(prof_name)
    rules = bp.format_rules("asmr-unboxing")
    clips = sorted(p for p in raw.iterdir() if p.suffix.lower() in CLIP_EXT)
    if not clips:
        print(f"❌ No clips in {raw}")
        return 4

    out = {
        "_generated_by": "20_asmr_analyze.py",
        "_brand_source": bp.source_path(),
        "_tuning_profile": TUNE["_id"],
        "_tuning_source": str(tuning.CAL),
        "profile": prof,
        "format": rules["id"],
        "audio_policy": rules["editing_rules"]["audio"],
        "clips": [],
    }
    for c in clips:
        meta = probe(c)
        env = envelope(c) if meta.get("has_audio") else []
        audio = analyse_audio(env, rules)
        scenes = scene_changes(c)
        heroes = hero_windows(audio["events"], scenes, meta.get("duration", 0.0))
        out["clips"].append({
            "file": c.name, "path": str(c), **meta,
            "orientation": "portrait" if meta.get("height", 0) >= meta.get("width", 1) else "landscape",
            "matches_profile": meta.get("width") == prof["width"] and meta.get("height") == prof["height"],
            "audio": audio, "scene_changes": scenes, "hero_windows": heroes,
        })
        print(f"  {c.name:28s} {meta.get('duration',0):6.2f}s  "
              f"{meta.get('width')}x{meta.get('height')}  "
              f"events {len(audio['events']):3d}  silences {len(audio['silences']):2d}  "
              f"heroes {len(heroes)}")

    (work / "asmr-analysis.json").write_text(json.dumps(out, indent=2) + "\n", encoding="utf-8")
    print(f"\n✓ {work/'asmr-analysis.json'}  ({len(clips)} clip(s))")
    return 0


if __name__ == "__main__":
    sys.exit(main())
