#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ASMR assemble · brand · export.

Consumes asmr-plan.json and produces a publish-ready master.

Two things it does differently from the older assembler:

  1. It RECOMPOSES rather than blind-crops. A clip whose aspect already matches
     the profile is scaled. One that does not is fitted and padded with a held
     ground, because the approved adaptive architecture forbids solving an
     aspect change by centre-cropping — that is what throws the subject away.

  2. It ENFORCES the audio policy. A plan asking for denoise, a gate,
     compression, loudness normalisation, music, captions, or a speed or volume
     other than 1.0 is refused rather than quietly obeyed.

Brand geometry comes from brand_profile.py and nowhere else.

Usage: python3 22_asmr_render.py <workdir> [output.mp4] [--allow-pad]
"""
import json, subprocess, sys, tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import brand_profile as bp

FORBIDDEN = ["denoise", "noise_gate", "compression", "loudness_normalization"]


def run(cmd, **kw):
    r = subprocess.run(cmd, **kw)
    if r.returncode:
        sys.exit(r.returncode)
    return r


def enforce_policy(plan: dict) -> list:
    """Refuse a plan that violates the ASMR audio policy. Returns the audit lines."""
    pol = plan.get("policy", {})
    problems, audit = [], []
    for key in FORBIDDEN:
        if pol.get(key):
            problems.append(f"{key} is enabled — the ASMR policy forbids it")
        audit.append(f"{key}: off")
    if pol.get("music"):
        problems.append("music is enabled — off by default for ASMR")
    audit.append("music: off")
    if pol.get("captions"):
        problems.append("captions are enabled — off by default for ASMR")
    audit.append("captions: off")
    for seg in plan.get("segments", []):
        if abs(float(seg.get("speed", 1.0)) - 1.0) > 1e-6:
            problems.append(f"segment {seg.get('clip')} sets speed {seg['speed']} — "
                            "time-stretching destroys tactile rhythm")
        if abs(float(seg.get("volume", 1.0)) - 1.0) > 1e-6:
            problems.append(f"segment {seg.get('clip')} sets volume {seg['volume']} — "
                            "recorded level is the content")
    audit += ["speed: 1.0", "volume: 1.0 (recorded level preserved)"]
    treatments = [plan.get("creative", {}).get("primary_treatment"),
                  plan.get("creative", {}).get("supporting_treatment")]
    if len([t for t in treatments if t]) > 2:
        problems.append("more than one primary plus one supporting creative treatment")
    if problems:
        print("❌ Plan violates the approved ASMR policy:")
        for p in problems:
            print("   · " + p)
        sys.exit(5)
    return audit


def recompose_filter(src_w: int, src_h: int, tw: int, th: int, ground: str) -> tuple:
    """Fit, never blind-crop. Returns (filter, mode)."""
    if src_w == 0 or src_h == 0:
        return f"scale={tw}:{th}", "scale (unknown source geometry)"
    src_ar, tgt_ar = src_w / src_h, tw / th
    if abs(src_ar - tgt_ar) < 0.01:
        return (f"scale={tw}:{th}:flags=lanczos", "scale — aspect already matches")
    return (f"scale={tw}:{th}:force_original_aspect_ratio=decrease:flags=lanczos,"
            f"pad={tw}:{th}:(ow-iw)/2:(oh-ih)/2:color={ground}",
            "fit + hold — recomposed, NOT centre-cropped")


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: 22_asmr_render.py <workdir> [output.mp4]")
        return 2
    work = Path(sys.argv[1]).resolve()
    plan_path = work / "asmr-plan.json"
    if not plan_path.exists():
        print(f"❌ Missing {plan_path}. Run 21_asmr_plan.py first.")
        return 3
    plan = json.loads(plan_path.read_text(encoding="utf-8"))
    out = Path(sys.argv[2]).resolve() if len(sys.argv) > 2 and not sys.argv[2].startswith("--") \
        else work / "asmr-final.mp4"

    audit = enforce_policy(plan)

    prof = bp.profile(plan["target"]["profile"])
    tw, th, fps = prof["width"], prof["height"], prof["fps"]
    ground = bp.colour("primitives.brand.graphite")
    segs = plan.get("segments", [])
    if not segs:
        print("❌ plan has no segments")
        return 4

    tmp = Path(tempfile.mkdtemp(prefix="asmr-"))
    parts, modes = [], set()
    for i, s in enumerate(segs):
        src = Path(s["src"])
        # Read the DISPLAY size, not the stored size. Phone footage carries its
        # orientation in a rotation matrix: ffprobe reports 1024x576 where ffmpeg
        # decodes 576x1024. Using the stored size makes recompose_filter compare
        # the wrong aspect and report a recomposition that did not happen.
        meta = subprocess.run(
            ["ffprobe", "-v", "error", "-select_streams", "v:0", "-print_format", "json",
             "-show_streams", str(src)], capture_output=True, text=True).stdout
        try:
            st = (json.loads(meta or "{}").get("streams") or [{}])[0]
            sw, sh = int(st.get("width") or 0), int(st.get("height") or 0)
            rot = 0
            for sd in (st.get("side_data_list") or []):
                if sd.get("rotation") is not None:
                    rot = int(float(sd["rotation"])) % 360
            if rot in (90, 270):
                sw, sh = sh, sw
        except (ValueError, KeyError, IndexError):
            sw = sh = 0
        vf, mode = recompose_filter(sw, sh, tw, th, ground)
        modes.add(mode)
        fade = float(s.get("boundary_fade_ms", 5)) / 1000.0
        dur = float(s["end"]) - float(s["start"])
        dest = tmp / f"seg{i:03d}.mp4"
        cmd = ["ffmpeg", "-v", "error", "-ss", f"{float(s['start']):.4f}",
               "-t", f"{dur:.4f}", "-i", str(src),
               "-vf", f"{vf},fps={fps},setsar=1,format=yuv420p",
               "-c:v", "libx264", "-preset", "medium", "-crf", "18",
               "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.0"]
        has_audio = subprocess.run(
            ["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_entries",
             "stream=index", "-of", "csv=p=0", str(src)],
            capture_output=True, text=True).stdout.strip()
        if has_audio:
            # The ONLY audio processing: a short boundary fade so a splice does
            # not click. No denoise, no gate, no compressor, no normalisation.
            af = (f"afade=t=in:st=0:d={fade:.4f},"
                  f"afade=t=out:st={max(0.0, dur-fade):.4f}:d={fade:.4f},"
                  f"aresample=48000") if fade > 0 else "aresample=48000"
            cmd += ["-af", af, "-c:a", "aac", "-b:a", "256k", "-ar", "48000"]
        else:
            cmd += ["-an"]
        cmd += ["-y", str(dest)]
        run(cmd)
        parts.append(dest)
        print(f"  seg {i:02d}  {s['clip']}  {s['start']}→{s['end']}s  ({mode})")

    concat = tmp / "list.txt"
    concat.write_text("".join(f"file '{p}'\n" for p in parts), encoding="utf-8")
    body = tmp / "body.mp4"
    run(["ffmpeg", "-v", "error", "-f", "concat", "-safe", "0", "-i", str(concat),
         "-c", "copy", "-y", str(body)])

    # --- watermark, geometry straight from the approved rule -----------------
    if plan.get("watermark", {}).get("enabled", True):
        wm = bp.watermark(min(tw, th))
        x, y = bp.watermark_position(prof)
        root = Path(bp.source_path()).parents[2]
        mark = root / "brand" / "logo" / "adel-mark-white.svg"
        png = tmp / "mark.png"
        run(["ffmpeg", "-v", "error", "-i", str(mark), "-vf",
             f"scale={wm['mark_width']}:{wm['mark_height']}", "-y", str(png)])
        plate_w, plate_h, pad, r = wm["plate_width"], wm["plate_height"], wm["padding"], wm["radius"]
        # Frosted plate: blur the region behind the mark, veil it, then the mark.
        fc = (
            f"[0:v]crop={plate_w}:{plate_h}:{x}:{y},boxblur={max(2,wm['blur']//2)}:1,"
            f"drawbox=0:0:{plate_w}:{plate_h}:color=white@0.22:t=fill[plate];"
            f"[0:v][plate]overlay={x}:{y}[base];"
            # format=auto promotes to yuv444p when blending an RGBA mark, and
            # x264 then writes High 4:4:4 Predictive — which browsers, QuickTime,
            # iOS and Android all refuse to play. Pin the output chroma here.
            f"[base][1:v]overlay={x+pad}:{y+pad}:format=auto,format=yuv420p[v]"
        )
        run(["ffmpeg", "-v", "error", "-i", str(body), "-i", str(png),
             "-filter_complex", fc, "-map", "[v]", "-map", "0:a?",
             "-c:v", "libx264", "-preset", "medium", "-crf", "18",
             "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.0",
             "-c:a", "copy", "-movflags", "+faststart", "-y", str(out)])
        print(f"  watermark  {wm['plate_width']}×{wm['plate_height']} plate at ({x},{y})"
              + ("  [24 px mark floor applied]" if wm["floor_applied"] else ""))
    else:
        run(["ffmpeg", "-v", "error", "-i", str(body), "-c", "copy",
             "-movflags", "+faststart", "-y", str(out)])

    # DELIVERY GATE. A master that will not play on a phone is not a master.
    # This shipped once as High 4:4:4 Predictive / yuv444p and was reported as a
    # successful render because nobody tried to play it. Checked in code now.
    # Parse by NAME. ffprobe emits fields in the stream's own order, not the
    # order requested, so positional CSV silently swaps pix_fmt and profile.
    chk = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
         "stream=pix_fmt,profile", "-of", "default=nw=1", str(out)],
        capture_output=True, text=True).stdout
    fields = dict(
        line.split("=", 1) for line in chk.strip().splitlines() if "=" in line)
    pix = fields.get("pix_fmt", "").strip()
    vprof = fields.get("profile", "").strip()
    if pix != "yuv420p":
        print(f"❌ DELIVERY GATE: output is {pix or 'unknown'} (profile {vprof or 'unknown'}), "
              f"not yuv420p.\n   That file will not play in browsers, QuickTime, iOS or "
              f"Android. Refusing to report it as a finished master.")
        sys.exit(7)
    print(f"  delivery   {pix} / {vprof} — plays on phone and browser")

    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries",
         "format=duration,size:stream=width,height,codec_name,sample_rate,channels",
         "-of", "default=nw=1", str(out)], capture_output=True, text=True).stdout
    (work / "asmr-render-audit.txt").write_text(
        "ASMR render audit\n=================\n"
        f"brand source   {bp.source_path()}\n"
        f"profile        {prof['id']} {tw}x{th} @{fps}fps\n"
        f"recomposition  {'; '.join(sorted(modes))}\n"
        f"audio policy   {', '.join(audit)}\n"
        f"segments       {len(segs)}\n\n{probe}", encoding="utf-8")
    print(f"\n✓ {out}")
    print(probe.strip())
    return 0


if __name__ == "__main__":
    sys.exit(main())
