#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Visual analysis for the ASMR pipeline — the counterweight to audio.

Phase 2D v1 selected shots by tactile transient density alone, and on a real
Galaxy Z Fold unboxing that chose 30 seconds of packaging: crinkling card is
acoustically denser than a smooth hinge, so the box beat the product. A strong
transient is not a strong shot.

This module measures what the microphone cannot. No ML, no model downloads —
every signal below is computed from downscaled frames with ffmpeg and pure
Python, so the skill stays installable anywhere ffmpeg runs.

Signals, and honestly what each one is:
  sharpness      edge energy per frame           → blur / unusable movement
  motion         mean abs difference vs previous → action, stillness, hero frames
  hand           skin-tone pixel fraction        → is a hand acting in frame
  subject_mass   centre edge energy vs full      → does something occupy useful area
  luma           mean luminance                  → screen-on, reveal, lighting change
  novelty        dHash distance vs previous      → duplicate / near-duplicate shots

`subject_mass` is a PROXY for "product occupies useful frame area", not object
detection. It measures structure in the centre against the whole frame. A
centred box scores high; so would a centred hand. It is used as one weighted
signal among several, never as a sole gate.

Writes <workdir>/asmr-visual.json.

Usage: python3 24_visual_analyze.py <workdir> [--fps 2]
"""
import array, json, math, subprocess, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

CLIP_EXT = {".mp4", ".mov", ".m4v", ".mkv", ".webm", ".avi"}
GW, GH = 64, 64          # analysis grid (square: orientation-agnostic, cheap)
DEFAULT_FPS = 2.0


def display_size(path: Path) -> tuple:
    """Display dimensions, honouring the rotation matrix (see 20_asmr_analyze)."""
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-print_format", "json",
         "-show_streams", str(path)], capture_output=True, text=True)
    try:
        st = (json.loads(r.stdout or "{}").get("streams") or [{}])[0]
        w, h = int(st.get("width") or 0), int(st.get("height") or 0)
        rot = 0
        for sd in (st.get("side_data_list") or []):
            if sd.get("rotation") is not None:
                rot = int(float(sd["rotation"])) % 360
        if rot in (90, 270):
            w, h = h, w
        dur = float(st.get("duration") or 0.0)
        return w, h, dur
    except (ValueError, KeyError, IndexError):
        return 0, 0, 0.0


def frames(path: Path, fps: float) -> list:
    """Downscaled RGB frames as flat byte arrays. One ffmpeg pass."""
    r = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path),
         "-vf", f"fps={fps},scale={GW}:{GH}:flags=bilinear",
         "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        capture_output=True)
    if r.returncode or not r.stdout:
        return []
    buf, step = r.stdout, GW * GH * 3
    return [buf[i:i + step] for i in range(0, len(buf) - step + 1, step)]


def grey(fr: bytes) -> array.array:
    g = array.array("f", [0.0]) * (GW * GH)
    for i in range(GW * GH):
        j = i * 3
        g[i] = (fr[j] * 0.299 + fr[j + 1] * 0.587 + fr[j + 2] * 0.114) / 255.0
    return g


def sharpness(g: array.array, x0=0, y0=0, x1=GW, y1=GH) -> float:
    """Edge energy — a Laplacian-style neighbour difference, mean absolute."""
    acc, n = 0.0, 0
    for y in range(max(1, y0), min(GH - 1, y1)):
        base = y * GW
        for x in range(max(1, x0), min(GW - 1, x1)):
            i = base + x
            acc += abs(4.0 * g[i] - g[i - 1] - g[i + 1] - g[i - GW] - g[i + GW])
            n += 1
    return acc / n if n else 0.0


def skin_fraction(fr: bytes) -> float:
    """Fraction of pixels in a broad skin-tone envelope — hand presence.

    Deliberately broad so it works across skin tones and warm desk lighting.
    It will also catch wood and cardboard, which is why it is a weighted signal
    and not a gate.
    """
    hit = 0
    for i in range(0, GW * GH * 3, 3):
        r, g, b = fr[i], fr[i + 1], fr[i + 2]
        mx, mn = max(r, g, b), min(r, g, b)
        if (r > 60 and g > 30 and b > 15 and r > b and mx - mn > 12
                and abs(r - g) > 10):
            hit += 1
    return hit / (GW * GH)


def dhash(g: array.array) -> int:
    """64-bit difference hash on an 8x8 reduction — duplicate detection."""
    cell_w, cell_h = GW // 9, GH // 8
    bits = 0
    for y in range(8):
        row = []
        for x in range(9):
            acc, n = 0.0, 0
            for yy in range(y * cell_h, min(GH, (y + 1) * cell_h)):
                for xx in range(x * cell_w, min(GW, (x + 1) * cell_w)):
                    acc += g[yy * GW + xx]; n += 1
            row.append(acc / n if n else 0.0)
        for x in range(8):
            bits = (bits << 1) | (1 if row[x] < row[x + 1] else 0)
    return bits


def hamming(a: int, b: int) -> int:
    return bin(a ^ b).count("1")


def analyse(path: Path, fps: float) -> dict:
    w, h, dur = display_size(path)
    frs = frames(path, fps)
    if not frs:
        return {}
    cx0, cy0, cx1, cy1 = GW // 4, GH // 4, GW * 3 // 4, GH * 3 // 4
    out, prev_g, prev_hash = [], None, None
    for k, fr in enumerate(frs):
        g = grey(fr)
        full = sharpness(g)
        cen = sharpness(g, cx0, cy0, cx1, cy1)
        luma = sum(g) / len(g)
        mot = 0.0
        if prev_g is not None:
            mot = sum(abs(g[i] - prev_g[i]) for i in range(0, GW * GH, 2)) / (GW * GH / 2)
        hsh = dhash(g)
        nov = hamming(hsh, prev_hash) if prev_hash is not None else 64
        out.append({
            "t": round(k / fps, 3),
            "sharpness": round(full, 5),
            "subject_mass": round(cen / full, 4) if full > 1e-6 else 0.0,
            "motion": round(mot, 5),
            "hand": round(skin_fraction(fr), 4),
            "luma": round(luma, 4),
            "novelty": nov,
        })
        prev_g, prev_hash = g, hsh
    return {"file": path.name, "width": w, "height": h, "duration": dur,
            "fps_sampled": fps, "samples": out}


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    work = Path(sys.argv[1]).resolve()
    fps = float(sys.argv[sys.argv.index("--fps") + 1]) if "--fps" in sys.argv else DEFAULT_FPS
    raw = work / "raw"
    if not raw.is_dir():
        print(f"❌ No footage directory at {raw}")
        return 3
    clips = sorted(p for p in raw.iterdir() if p.suffix.lower() in CLIP_EXT)
    if not clips:
        print(f"❌ No clips in {raw}")
        return 4

    res = {"_generated_by": "24_visual_analyze.py",
           "_what": "Visual signals. Audio is one input among several, not the selector.",
           "grid": [GW, GH], "clips": []}
    for c in clips:
        a = analyse(c, fps)
        if not a:
            print(f"  {c.name:28s} — no frames, skipped")
            continue
        res["clips"].append(a)
        s = a["samples"]
        print(f"  {c.name:28s} {len(s):4d} samples @{fps}fps  "
              f"sharp {sum(x['sharpness'] for x in s)/len(s):.4f}  "
              f"motion {sum(x['motion'] for x in s)/len(s):.4f}  "
              f"hand {sum(x['hand'] for x in s)/len(s):.3f}")
    (work / "asmr-visual.json").write_text(json.dumps(res, indent=2) + "\n", encoding="utf-8")
    print(f"\n✓ {work/'asmr-visual.json'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
