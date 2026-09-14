#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Inventory ASMR/unboxing footage and extract representative frames.
Usage: python3 scripts/12_asmr_inventory.py <workdir>
Expected input folder: <workdir>/raw/
Outputs:
  <workdir>/asmr-inventory.json
  <workdir>/asmr-frames/*.jpg
  <workdir>/asmr-contact.html
"""
import json, os, subprocess, sys, html
from pathlib import Path

if len(sys.argv) < 2:
    print("usage: 12_asmr_inventory.py <workdir>")
    sys.exit(2)
W = Path(sys.argv[1]).resolve()
RAW = W / "raw"
OUT = W / "asmr-frames"
OUT.mkdir(parents=True, exist_ok=True)
if not RAW.exists():
    print(f"❌ Missing {RAW}. Put original product clips inside raw/.")
    sys.exit(3)

exts = {".mov", ".mp4", ".m4v", ".mts", ".m2ts", ".avi", ".webm"}
clips = sorted([p for p in RAW.iterdir() if p.is_file() and p.suffix.lower() in exts])
if not clips:
    print("❌ No video clips found in raw/.")
    sys.exit(4)

def probe(p: Path):
    cmd = ["ffprobe","-v","error","-show_streams","-show_format","-of","json",str(p)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr.strip() or f"ffprobe failed for {p}")
    d = json.loads(r.stdout)
    v = next((s for s in d.get("streams",[]) if s.get("codec_type")=="video"), {})
    a = next((s for s in d.get("streams",[]) if s.get("codec_type")=="audio"), None)
    dur = float(d.get("format",{}).get("duration") or v.get("duration") or 0)
    fps = v.get("avg_frame_rate") or v.get("r_frame_rate") or "0/1"
    return {
        "duration": round(dur, 3),
        "width": int(v.get("width") or 0),
        "height": int(v.get("height") or 0),
        "fps": fps,
        "has_audio": bool(a),
        "audio_codec": a.get("codec_name") if a else None,
        "video_codec": v.get("codec_name")
    }

def snap(p: Path, t: float, dest: Path):
    cmd = ["ffmpeg","-v","error","-ss",f"{max(0,t):.3f}","-i",str(p),"-frames:v","1",
           "-vf","scale=360:-2:flags=lanczos","-q:v","3","-y",str(dest)]
    return subprocess.run(cmd).returncode == 0 and dest.exists()

items=[]
for i,p in enumerate(clips,1):
    meta=probe(p)
    dur=max(meta["duration"],0.01)
    times=[max(0.01,dur*0.15), max(0.01,dur*0.50), max(0.01,dur*0.85)]
    frames=[]
    for j,t in enumerate(times,1):
        dest=OUT/f"{i:02d}_{j}.jpg"
        if snap(p,t,dest):
            frames.append({"time":round(t,3),"file":str(dest.relative_to(W))})
    item={"id":i,"file":str(p.relative_to(W)),**meta,"frames":frames}
    items.append(item)

inv={"workdir":str(W),"clip_count":len(items),"total_duration":round(sum(x["duration"] for x in items),3),"clips":items}
(W/"asmr-inventory.json").write_text(json.dumps(inv,ensure_ascii=False,indent=2),encoding="utf-8")

cards=[]
for x in items:
    imgs=''.join(f'<figure><img src="{html.escape(f["file"])}"><figcaption>{f["time"]:.2f}s</figcaption></figure>' for f in x["frames"])
    orient="portrait" if x["height"]>=x["width"] else "landscape"
    cards.append(f'''<section><h2>{x["id"]:02d} — {html.escape(x["file"])}</h2>
<p>{x["duration"]:.2f}s · {x["width"]}×{x["height"]} · {orient} · audio: {"yes" if x["has_audio"] else "no"}</p><div class="row">{imgs}</div></section>''')
contact=f'''<!doctype html><meta charset="utf-8"><title>ASMR Footage Contact Sheet</title>
<style>body{{font-family:system-ui;background:#111;color:#eee;margin:24px}}section{{border-bottom:1px solid #333;padding:12px 0 22px}}h2{{font-size:17px}}p,figcaption{{color:#aaa}}.row{{display:flex;gap:12px;flex-wrap:wrap}}figure{{margin:0}}img{{height:260px;max-width:420px;object-fit:contain;background:#000;border-radius:10px}}figcaption{{font-size:12px;margin-top:4px}}</style>
<h1>ASMR / Unboxing footage</h1><p>{len(items)} clips · {inv["total_duration"]:.2f}s raw</p>{''.join(cards)}'''
(W/"asmr-contact.html").write_text(contact,encoding="utf-8")
print(f"✅ {len(items)} clips inventoried · {inv['total_duration']:.1f}s raw")
print(f"→ {W/'asmr-inventory.json'}")
print(f"→ {W/'asmr-contact.html'}")
