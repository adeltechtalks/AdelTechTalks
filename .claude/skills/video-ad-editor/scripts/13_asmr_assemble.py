#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Assemble an ASMR/unboxing edit from asmr-plan.json.

SUPERSEDED by 22_asmr_render.py (Phase 2D). Kept for reference only.

Two reasons it was replaced, both recorded in docs/brand-os/14_PHASE2D_ARCHITECTURE.md:
  · it CENTRE-CROPS to fit the target (scale=…increase, crop=TW:TH). Harmless for a
    9:16 master from portrait footage, and exactly the behaviour the approved adaptive
    architecture forbids the moment an alternate format is requested.
  · it carries brand defaults inline (canvas 1080x1920, signature width/opacity/margins)
    instead of reading brand/tokens/adel-v2.1.json.

Usage: python3 scripts/13_asmr_assemble.py <workdir> [output.mp4]

The plan is intentionally simple and model-editable. Each segment points to an original
clip, start/end timestamps, speed and volume. The script preserves product audio by default,
normalizes geometry, concatenates clean cuts, then applies optional approved brand assets.
"""
import json, math, os, shutil, subprocess, sys, tempfile
from pathlib import Path

if len(sys.argv) < 2:
    print("usage: 13_asmr_assemble.py <workdir> [output.mp4]")
    sys.exit(2)
W=Path(sys.argv[1]).resolve()
PLAN=W/"asmr-plan.json"
if not PLAN.exists():
    print(f"❌ Missing {PLAN}. Create it from templates/asmr-plan.sample.json.")
    sys.exit(3)
P=json.loads(PLAN.read_text(encoding="utf-8"))
out=Path(sys.argv[2]).resolve() if len(sys.argv)>2 else W/"asmr-final.mp4"
target=P.get("target",{})
TW=int(target.get("width",1080)); TH=int(target.get("height",1920)); FPS=int(target.get("fps",30))
segments=P.get("segments",[])
if not segments:
    print("❌ asmr-plan.json has no segments.")
    sys.exit(4)

def run(cmd):
    r=subprocess.run(cmd)
    if r.returncode: sys.exit(r.returncode)

def has_audio(path, stream_index=0):
    r=subprocess.run(["ffprobe","-v","error","-select_streams",f"a:{int(stream_index)}","-show_entries","stream=index","-of","csv=p=0",str(path)],capture_output=True,text=True)
    return bool(r.stdout.strip())

def atempo_chain(speed):
    # Audio must speed by same factor as video. atempo supports 0.5..2.0 per stage.
    vals=[]; s=float(speed)
    while s>2.0: vals.append(2.0); s/=2.0
    while s<0.5: vals.append(0.5); s/=0.5
    vals.append(s)
    return ",".join(f"atempo={v:.6f}" for v in vals)

def prep_video(src, dest, start=None, end=None, speed=1.0, volume=1.0, audio_stream=0, boundary_fade_ms=5):
    speed=float(speed or 1.0); volume=float(volume if volume is not None else 1.0)
    audio_stream=int(audio_stream or 0); boundary_fade=max(0.0,float(boundary_fade_ms or 0)/1000.0)
    if speed<=0: raise ValueError("speed must be > 0")
    vf=(f"scale={TW}:{TH}:force_original_aspect_ratio=increase:flags=lanczos,"
        f"crop={TW}:{TH},fps={FPS},setpts=PTS/{speed:.8f},"
        "setparams=color_primaries=bt709:color_trc=bt709:colorspace=bt709,format=yuv420p")
    cmd=["ffmpeg","-v","error","-stats"]
    if start is not None: cmd += ["-ss",f"{float(start):.4f}"]
    if end is not None and start is not None: cmd += ["-t",f"{max(0,float(end)-float(start)):.4f}"]
    elif end is not None: cmd += ["-to",f"{float(end):.4f}"]
    cmd += ["-i",str(src)]
    if has_audio(src, audio_stream):
        af=atempo_chain(speed)
        if abs(volume-1.0)>1e-6: af += f",volume={volume:.5f}"
        # Preserve the recorded mic/product sound. No denoise, gate, compression or loudness
        # normalization is applied here. A tiny boundary fade is only for cut-click prevention.
        if boundary_fade > 0:
            af += f",afade=t=in:st=0:d={boundary_fade:.6f},areverse,afade=t=in:st=0:d={boundary_fade:.6f},areverse"
        cmd += ["-vf",vf,"-af",af,"-map","0:v:0","-map",f"0:a:{audio_stream}"]
    else:
        # Add silence so concat remains stable.
        duration=None
        if start is not None and end is not None: duration=(float(end)-float(start))/speed
        cmd += ["-f","lavfi","-t",f"{duration:.4f}" if duration else "1","-i","anullsrc=r=48000:cl=stereo",
                "-vf",vf,"-map","0:v:0","-map","1:a:0","-shortest"]
    cmd += ["-c:v","libx264","-preset","medium","-crf","16","-c:a","aac","-b:a","256k","-ar","48000","-movflags","+faststart","-y",str(dest)]
    run(cmd)

def normalize_asset(src, dest):
    # Approved opener/endcard video; preserve audio if present.
    vf=(f"scale={TW}:{TH}:force_original_aspect_ratio=increase:flags=lanczos,crop={TW}:{TH},fps={FPS},"
        "setparams=color_primaries=bt709:color_trc=bt709:colorspace=bt709,format=yuv420p")
    if has_audio(src):
        cmd=["ffmpeg","-v","error","-stats","-i",str(src),"-vf",vf,"-c:v","libx264","-preset","medium","-crf","16",
             "-c:a","aac","-b:a","256k","-ar","48000","-movflags","+faststart","-y",str(dest)]
    else:
        dur=subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",str(src)],capture_output=True,text=True).stdout.strip() or "1"
        cmd=["ffmpeg","-v","error","-stats","-i",str(src),"-f","lavfi","-t",dur,"-i","anullsrc=r=48000:cl=stereo","-vf",vf,
             "-map","0:v:0","-map","1:a:0","-shortest","-c:v","libx264","-preset","medium","-crf","16","-c:a","aac","-b:a","256k","-ar","48000","-y",str(dest)]
    run(cmd)

TMP=W/".asmr-tmp"
if TMP.exists(): shutil.rmtree(TMP)
TMP.mkdir(parents=True)
parts=[]
brand=P.get("brand",{})

op=brand.get("opener")
if op:
    p=W/op
    if p.exists():
        d=TMP/"000_opener.mp4"; normalize_asset(p,d); parts.append(d)

for i,s in enumerate(segments,1):
    src=W/s["file"]
    if not src.exists():
        print(f"❌ Missing source clip: {src}"); sys.exit(5)
    st=float(s.get("start",0)); en=s.get("end")
    en=float(en) if en is not None else None
    if en is not None and en<=st:
        print(f"❌ Segment {i}: end must be after start"); sys.exit(6)
    dest=TMP/f"{i:03d}_segment.mp4"
    prep_video(src,dest,st,en,s.get("speed",1.0),s.get("volume",1.0),s.get("audio_stream",0),s.get("boundary_fade_ms",5))
    parts.append(dest)

end=brand.get("endcard")
if end:
    p=W/end
    if p.exists():
        d=TMP/f"{len(parts)+1:03d}_endcard.mp4"; normalize_asset(p,d); parts.append(d)

concat=TMP/"concat.txt"
concat.write_text("".join(f"file '{str(p).replace("'","'\\''")}'\n" for p in parts),encoding="utf-8")
base=TMP/"assembled.mp4"
run(["ffmpeg","-v","error","-stats","-f","concat","-safe","0","-i",str(concat),"-c","copy","-movflags","+faststart","-y",str(base)])

sig=(brand.get("signature") or {})
sig_asset=sig.get("asset")
sig_path=W/sig_asset if sig_asset else None
if sig_path and sig_path.exists():
    width=int(sig.get("width",220)); opacity=float(sig.get("opacity",0.82)); mx=int(sig.get("margin_x",54)); my=int(sig.get("margin_y",340))
    pos=sig.get("position","bottom-left")
    if pos=="bottom-right": xy=(f"W-w-{mx}",f"H-h-{my}")
    elif pos=="top-right": xy=(f"W-w-{mx}",str(my))
    elif pos=="top-left": xy=(str(mx),str(my))
    else: xy=(str(mx),f"H-h-{my}")
    vf=f"[1:v]scale={width}:-1,format=rgba,colorchannelmixer=aa={opacity:.4f}[s];[0:v][s]overlay={xy[0]}:{xy[1]}:format=auto[v]"
    run(["ffmpeg","-v","error","-stats","-i",str(base),"-loop","1","-i",str(sig_path),"-filter_complex",vf,
         "-map","[v]","-map","0:a?","-c:v","libx264","-preset","medium","-crf","16","-c:a","copy","-shortest","-movflags","+faststart","-y",str(out)])
else:
    shutil.copy2(base,out)

# Basic report
probe=subprocess.run(["ffprobe","-v","error","-show_entries","format=duration,size","-show_entries","stream=width,height","-of","default=nw=1",str(out)],capture_output=True,text=True)
print(f"✅ ASMR edit ready: {out}")
print(probe.stdout.strip())
