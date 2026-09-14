#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Opening and closing brand cards for the ASMR format.

Restraint is the brief. The corner watermark alone was too invisible to read as
a branded edit, but this format is not a title-heavy Reel either — so: one short
opening card, one short end card, nothing during the edit beyond the watermark.

  opener   ~0.8s   product name · optional content-family label · mark
  endcard  ~1.0s   clean product hero frame · mark · optional CTA

Every colour comes from brand_profile (brand/tokens), never inline.

TYPEFACE: Montserrat is the approved display face and is NOT installed here, so
these cards render in DejaVu Sans Bold. That is a visible substitution and is
recorded in the render audit — it is not the brand face.

Usage: imported by 22_asmr_render.py, or:
    python3 26_brand_cards.py <workdir> <out_dir>
"""
import json, subprocess, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import brand_profile as bp

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_IS_SUBSTITUTE = True
ROOT = Path(__file__).resolve().parents[4]


def _run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.stderr.write((r.stderr or "")[-1200:] + "\n")
        raise SystemExit(r.returncode)


def _hex(c: str) -> str:
    """ffmpeg filtergraphs cannot take '#RRGGBB' — '#' is not valid there."""
    c = (c or "").strip()
    return "0x" + c[1:] if c.startswith("#") else c


def _esc(t: str) -> str:
    return (t.replace("\\", "\\\\").replace(":", "\\:")
             .replace("'", "’").replace("%", "\\%"))


def mark_png(dest: Path, width: int) -> Path:
    src = ROOT / "brand" / "logo" / "adel-mark-white.svg"
    _run(["ffmpeg", "-v", "error", "-i", str(src), "-vf", f"scale={width}:-1",
          "-y", str(dest)])
    return dest


def opener(out: Path, tmp: Path, prof: dict, brief: dict, seconds: float = 0.8) -> Path:
    """Dark ground, product name, small family label, mark. Fade and a slight rise."""
    w, h, fps = prof["width"], prof["height"], prof["fps"]
    ground = _hex(bp.color("semantic.light.surface.inverse", "#171A1F"))
    accent = _hex(bp.color("semantic.light.action.primary-bg", "#2563EB"))
    name = _esc((brief.get("product_name") or "").strip())
    model = _esc((brief.get("product_model") or "").strip())
    family = _esc((brief.get("content_family") or "").strip())

    mk = mark_png(tmp / "mark_open.png", max(64, w // 9))
    title_px = max(52, int(w * 0.082))
    label_px = max(22, int(w * 0.026))
    model_px = max(24, int(w * 0.030))
    cy = h // 2

    # Fade in over the first third; a 14px rise that settles. Subtle only.
    a = "min(t/0.28,1)"
    rise = "(1-min(t/0.34,1))*14"
    parts = [f"color=c={ground}:s={w}x{h}:r={fps}:d={seconds}[bg]"]
    chain = "[bg]"
    if family:
        parts.append(
            f"{chain}drawtext=fontfile={FONT}:text='{family}':fontcolor={accent}"
            f":fontsize={label_px}:x='(w-tw)/2':y='{cy}-{int(title_px*1.15)}+{rise}'"
            f":alpha='{a}':borderw=0[l1]")
        chain = "[l1]"
    if name:
        parts.append(
            f"{chain}drawtext=fontfile={FONT}:text='{name}':fontcolor=white"
            f":fontsize={title_px}:x='(w-tw)/2':y='{cy}-{title_px//2}+{rise}'"
            f":alpha='{a}'[l2]")
        chain = "[l2]"
    if model:
        parts.append(
            f"{chain}drawtext=fontfile={FONT}:text='{model}':fontcolor=0xA0A6B0"
            f":fontsize={model_px}:x='(w-tw)/2':y='{cy}+{int(title_px*0.78)}+{rise}'"
            f":alpha='{a}'[l3]")
        chain = "[l3]"
    parts.append(f"{chain}format=yuv420p[v0]")

    fc = ";".join(parts) + (
        f";[1:v]format=rgba,colorchannelmixer=aa=0.92[mk];"
        f"[v0][mk]overlay=(W-w)/2:{cy}+{int(title_px*1.9)}:format=auto,format=yuv420p[v]")
    _run(["ffmpeg", "-v", "error", "-f", "lavfi", "-i",
          f"anullsrc=r=48000:cl=stereo:d={seconds}", "-loop", "1", "-i", str(mk),
          "-filter_complex", fc, "-map", "[v]", "-map", "0:a",
          "-t", f"{seconds}", "-r", str(fps),
          "-c:v", "libx264", "-preset", "medium", "-crf", "18",
          "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.0",
          "-c:a", "aac", "-ar", "48000", "-ac", "2", "-y", str(out)])
    return out


def endcard(out: Path, tmp: Path, prof: dict, brief: dict, hero_src: Path,
            hero_t: float, seconds: float = 1.0) -> Path:
    """A held frame from the final hero beat, darkened, with the mark over it."""
    w, h, fps = prof["width"], prof["height"], prof["fps"]
    still = tmp / "endcard_still.png"
    _run(["ffmpeg", "-v", "error", "-ss", f"{max(0.0, hero_t):.3f}", "-i", str(hero_src),
          "-frames:v", "1", "-vf",
          f"scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h}",
          "-y", str(still)])
    mk = mark_png(tmp / "mark_end.png", max(90, w // 6))
    creator = _esc((brief.get("optional_creator_name") or "AdelTechTalks").strip())
    px = max(26, int(w * 0.032))
    a = "min(t/0.3,1)"

    fc = (f"[0:v]scale={w}:{h},eq=brightness=-0.30:saturation=0.88,"
          f"boxblur=8:1,format=yuv420p[bgv];"
          f"[2:v]format=rgba,colorchannelmixer=aa=0.97[mk];"
          f"[bgv][mk]overlay=(W-w)/2:(H-h)/2-{int(px*1.6)}:format=auto[o1];"
          f"[o1]drawtext=fontfile={FONT}:text='{creator}':fontcolor=white:fontsize={px}"
          f":x='(w-tw)/2':y='(h/2)+{int(px*1.7)}':alpha='{a}',format=yuv420p[v]")
    _run(["ffmpeg", "-v", "error", "-loop", "1", "-t", f"{seconds}", "-i", str(still),
          "-f", "lavfi", "-t", f"{seconds}", "-i", "anullsrc=r=48000:cl=stereo",
          "-loop", "1", "-i", str(mk),
          "-filter_complex", fc, "-map", "[v]", "-map", "1:a",
          "-t", f"{seconds}", "-r", str(fps),
          "-c:v", "libx264", "-preset", "medium", "-crf", "18",
          "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.0",
          "-c:a", "aac", "-ar", "48000", "-ac", "2", "-y", str(out)])
    return out


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__); raise SystemExit(2)
    work, od = Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve()
    od.mkdir(parents=True, exist_ok=True)
    plan = json.loads((work / "asmr-plan.json").read_text(encoding="utf-8"))
    prof = plan["target"]
    brief = plan.get("brief", {})
    opener(od / "opener.mp4", od, prof, brief)
    last = plan["segments"][-1]
    endcard(od / "endcard.mp4", od, prof, brief, Path(last["src"]),
            (last["start"] + last["end"]) / 2)
    print(f"✓ {od/'opener.mp4'}\n✓ {od/'endcard.mp4'}")
