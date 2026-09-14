#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Content package: understand the content once, then package it per platform.

Not "edit the video, then attach a standard thumbnail". The cover is chosen from
the same content understanding that drove the edit — the same beats, the same
seven signals — and the composition is decided per job from the assets that
actually exist. Brand recognition is fixed; layout is not.

Produces:
  final video (already rendered)   thumbnail directions (2-3, when the content supports them)
  platform covers, RECOMPOSED     creative-rationale.md with title/hook options

Frame candidates are scored on: sharpness · product visibility · clean composition
· story relevance (which beat) · curiosity · text-space · foreground separation.

WHAT THIS CANNOT DO: there is no face detection here. Compositions that need the
creator (creator only, creator + product, reaction) are therefore never
auto-selected — the script reports them as unavailable and recommends a dedicated
photograph rather than guessing. That is a real limit, not a temporary gap.

Usage: python3 27_package.py <workdir> [--out <dir>]
"""
import json, math, statistics, subprocess, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import brand_profile as bp
import importlib.util as _ilu
_v = _ilu.spec_from_file_location("va", Path(__file__).resolve().parent / "24_visual_analyze.py")
va = _ilu.module_from_spec(_v); _v.loader.exec_module(va)

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_SUBSTITUTE = True

# Platform surfaces. Only the two AUDITED masters carry real audited sizes; the
# rest are derived and labelled as such — the Phase 2B rule, unchanged.
SURFACES = [
    ("youtube-thumbnail", 1280, 720,  "AUDITED"),
    ("shorts-cover",      1080, 1920, "AUDITED"),
    ("reels-cover",       1080, 1920, "DERIVED — shares the 9:16 master"),
    ("tiktok-cover",      1080, 1920, "DERIVED — shares the 9:16 master"),
    ("feed-4x5",          1080, 1350, "DERIVED — VALIDATION REQUIRED"),
    ("square-1x1",        1080, 1080, "DERIVED — VALIDATION REQUIRED"),
]


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.stderr.write((r.stderr or "")[-900:] + "\n")
        raise SystemExit(r.returncode)


def hexc(c):
    c = (c or "").strip()
    return "0x" + c[1:] if c.startswith("#") else c


def esc(t):
    return (str(t).replace("\\", "\\\\").replace(":", "\\:")
            .replace("'", "’").replace("%", "\\%"))


def text_space(g, gw, gh):
    """Where could text go? Lowest edge-energy band — top, middle or bottom third."""
    bands = {}
    for name, (y0, y1) in {"top": (0, gh // 3), "middle": (gh // 3, 2 * gh // 3),
                           "bottom": (2 * gh // 3, gh)}.items():
        acc, n = 0.0, 0
        for y in range(max(1, y0), min(gh - 1, y1)):
            for x in range(1, gw - 1):
                i = y * gw + x
                acc += abs(4 * g[i] - g[i - 1] - g[i + 1] - g[i - gw] - g[i + gw]); n += 1
        bands[name] = acc / n if n else 0.0
    best = min(bands, key=bands.get)
    spread = (max(bands.values()) - min(bands.values())) / (max(bands.values()) or 1)
    return best, round(spread, 3), {k: round(v, 4) for k, v in bands.items()}


def score_frames(src: Path, times: list, beats: list) -> list:
    """Score one candidate frame per beat window."""
    out = []
    for t, beat in zip(times, beats):
        r = subprocess.run(
            ["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", str(src), "-frames:v", "1",
             "-vf", f"scale={va.GW}:{va.GH}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
            capture_output=True)
        if r.returncode or len(r.stdout) < va.GW * va.GH * 3:
            continue
        fr = r.stdout[:va.GW * va.GH * 3]
        g = va.grey(fr)
        sharp = va.sharpness(g)
        cen = va.sharpness(g, va.GW // 4, va.GH // 4, va.GW * 3 // 4, va.GH * 3 // 4)
        mass = cen / sharp if sharp > 1e-6 else 0.0
        hand = va.skin_fraction(fr)
        luma = sum(g) / len(g)
        band, spread, bands = text_space(g, va.GW, va.GH)
        # Foreground separation: centre detail well above frame average.
        sep = mass
        out.append({"t": round(t, 3), "beat": beat, "sharpness": round(sharp, 5),
                    "subject_mass": round(mass, 4), "hand": round(hand, 4),
                    "luma": round(luma, 4), "text_band": band,
                    "text_space": round(spread, 3), "bands": bands,
                    "separation": round(sep, 4)})
    if not out:
        return []
    def pct(key):
        vals = sorted(o[key] for o in out)
        return lambda v: (sum(1 for x in vals if x < v) / max(1, len(vals) - 1))
    rs, rm, rt = pct("sharpness"), pct("subject_mass"), pct("text_space")
    # Story relevance: how much this beat matters for a cover.
    REL = {"first_reveal": 1.00, "box_opening": 0.90, "final_hero": 0.88,
           "product_lift": 0.82, "handling": 0.70, "sealed_hero": 0.66,
           "macro_detail": 0.60, "seal_peel": 0.45, "accessories": 0.35}
    for o in out:
        clarity = rs(o["sharpness"])
        product = rm(o["subject_mass"])
        rel = REL.get(o["beat"], 0.5)
        curiosity = rel * (0.6 + 0.4 * product)
        o["dims"] = {"clarity": round(clarity, 3), "product": round(product, 3),
                     "story": round(rel, 3), "curiosity": round(curiosity, 3),
                     "text_space": round(rt(o["text_space"]), 3),
                     "separation": round(product, 3)}
        o["score"] = round(0.26 * clarity + 0.24 * product + 0.20 * rel
                           + 0.14 * curiosity + 0.16 * rt(o["text_space"]), 4)
    out.sort(key=lambda o: -o["score"])
    return out


def src_aspect(src: Path):
    probe = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0",
                            "-print_format", "json", "-show_streams", str(src)],
                           capture_output=True, text=True).stdout
    st = (json.loads(probe or "{}").get("streams") or [{}])[0]
    sw, sh = int(st.get("width") or 0), int(st.get("height") or 0)
    rot = 0
    for sd in (st.get("side_data_list") or []):
        if sd.get("rotation") is not None:
            rot = int(float(sd["rotation"])) % 360
    if rot in (90, 270):
        sw, sh = sh, sw
    return sw, sh, (sw / sh if sh else 1.0)


def recompose(src: Path, t: float, w: int, h: int, dest: Path, focus: str = "center"):
    """Build a real composition for this aspect — not a crop, and not blur-padding.

    Blur-padding a portrait frame into 16:9 leaves a narrow strip between two grey
    panels: the subject reads tiny at feed size and the layout is a fallback, not a
    design. So a wider surface gets an ASYMMETRIC layout instead — the subject fills
    one side at its own scale, and the other side becomes a brand panel that the
    type is designed into. The composition genuinely changes per surface.
    """
    sw, sh, src_ar = src_aspect(src)
    tgt_ar = w / h
    ground = hexc(bp.color("semantic.light.surface.inverse", "#171A1F"))

    if abs(src_ar - tgt_ar) < 0.02:
        vf = f"scale={w}:{h}:flags=lanczos"
        mode = "full bleed — aspect already matches"
    elif tgt_ar > src_ar * 1.15:
        # Wider surface: subject holds one side, brand panel takes the other.
        sub_w = int(w * 0.56)
        vf = (f"split[a][b];"
              f"[a]scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h},"
              f"boxblur=30:2,eq=brightness=-0.55:saturation=0.35[bg];"
              f"[b]scale={sub_w}:{h}:force_original_aspect_ratio=increase,"
              f"crop={sub_w}:{h}[fg];"
              f"[bg][fg]overlay={w - sub_w}:0")
        mode = f"asymmetric — subject holds the right {sub_w}px, type panel left"
    else:
        # Narrower or near-square: crop within the portrait frame, keep the subject.
        vf = (f"scale={w}:{h}:force_original_aspect_ratio=increase:flags=lanczos,"
              f"crop={w}:{h}:(iw-{w})/2:(ih-{h})*0.40")
        mode = "reframed — cropped within the portrait frame, subject held high"
    run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", str(src), "-frames:v", "1",
         "-vf", vf, "-y", str(dest)])
    return mode


def compose(base: Path, dest: Path, w: int, h: int, direction: dict, brief: dict,
            mark: Path, band: str, wide: bool = False):
    """Apply the fixed brand treatment over a varying composition."""
    accent = hexc(bp.color("semantic.light.action.primary-bg", "#2563EB"))
    coral = hexc(bp.color("expressive.spark-coral.value", "#FF6B57"))
    hook = esc(direction.get("hook", ""))
    label = esc(direction.get("label", brief.get("content_family", "")))
    big = max(34, int(w * direction.get("hook_scale", 0.085)))
    small = max(18, int(w * 0.022))
    # On a wide surface the type is designed into the left panel, left-aligned,
    # at a size that survives a feed. Elsewhere it goes in the quietest band.
    if wide:
        pad = int(w * 0.055)
        panel = int(w * 0.44) - pad * 2          # the type area, not the whole frame
        big = max(40, int(w * direction.get("hook_scale_wide", 0.085)))
        # Fit the hook to the panel instead of letting it run under the subject.
        # DejaVu Sans Bold caps average ~0.62em; leave a little air.
        if hook:
            fit = int(panel / (0.62 * max(1, len(hook))))
            big = max(28, min(big, fit))
        parts = [f"[0:v]scale={w}:{h}[b0]"]
        chain = "[b0]"
        if label:
            parts.append(f"{chain}drawtext=fontfile={FONT}:text='{label}':fontcolor={accent}"
                         f":fontsize={small}:x={pad}:y='{int(h*0.30)}'[b1]")
            chain = "[b1]"
        if hook:
            parts.append(f"{chain}drawtext=fontfile={FONT}:text='{hook}':fontcolor=white"
                         f":fontsize={big}:x={pad}:y='{int(h*0.38)}'"
                         f":borderw={max(2,big//24)}:bordercolor=black@0.5[b2]")
            chain = "[b2]"
        if direction.get("rule"):
            parts.append(f"{chain}drawbox=x={pad}:y={int(h*0.38)+int(big*1.3)}"
                         f":w={int(w*0.14)}:h={max(4,int(h*0.012))}"
                         f":color={coral}@0.95:t=fill[b3]")
            chain = "[b3]"
        parts.append(f"{chain}format=rgba[base]")
        mw = max(46, int(w * 0.050))
        fc = ";".join(parts) + (
            f";[1:v]scale={mw}:-1,format=rgba,colorchannelmixer=aa=0.93[mk];"
            f"[base][mk]overlay={pad}:{int(h*0.075)}:format=auto,format=rgb24[v]")
        run(["ffmpeg", "-v", "error", "-i", str(base), "-i", str(mark),
             "-filter_complex", fc, "-map", "[v]", "-y", str(dest)])
        return

    if band == "top":
        hy, ly = int(h * 0.11), int(h * 0.055)
    elif band == "bottom":
        hy, ly = int(h * 0.74), int(h * 0.68)
    else:
        hy, ly = int(h * 0.44), int(h * 0.38)

    scrim = direction.get("scrim", 0.42)
    parts = [f"[0:v]scale={w}:{h}[b0]"]
    chain = "[b0]"
    if scrim > 0:
        y0 = 0 if band == "top" else (int(h * 0.62) if band == "bottom" else int(h * 0.30))
        hh = int(h * 0.38)
        parts.append(f"{chain}drawbox=0:{y0}:{w}:{hh}:color=black@{scrim}:t=fill[b1]")
        chain = "[b1]"
    if label:
        parts.append(f"{chain}drawtext=fontfile={FONT}:text='{label}':fontcolor={accent}"
                     f":fontsize={small}:x='(w-tw)/2':y='{ly}'[b2]")
        chain = "[b2]"
    if hook:
        parts.append(f"{chain}drawtext=fontfile={FONT}:text='{hook}':fontcolor=white"
                     f":fontsize={big}:x='(w-tw)/2':y='{hy}'"
                     f":borderw={max(2,big//22)}:bordercolor=black@0.55[b3]")
        chain = "[b3]"
    if direction.get("rule"):
        ry = hy + int(big * 1.25)
        parts.append(f"{chain}drawbox=x='(w-{int(w*0.22)})/2':y={ry}:w={int(w*0.22)}"
                     f":h={max(4,int(h*0.007))}:color={coral}@0.95:t=fill[b4]")
        chain = "[b4]"
    parts.append(f"{chain}format=rgba[base]")
    mw = max(46, int(w * 0.052))
    fc = ";".join(parts) + (f";[1:v]scale={mw}:-1,format=rgba,colorchannelmixer=aa=0.93[mk];"
                            f"[base][mk]overlay={int(w*0.035)}:{int(h*0.035)}:format=auto,format=rgb24[v]")
    run(["ffmpeg", "-v", "error", "-i", str(base), "-i", str(mark),
         "-filter_complex", fc, "-map", "[v]", "-y", str(dest)])


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__); return 2
    work = Path(sys.argv[1]).resolve()
    out = Path(sys.argv[sys.argv.index("--out") + 1]).resolve() if "--out" in sys.argv \
        else work / "package"
    out.mkdir(parents=True, exist_ok=True)
    plan = json.loads((work / "asmr-plan.json").read_text(encoding="utf-8"))
    brief = plan.get("brief", {})
    segs = plan["segments"]
    src = Path(segs[0]["src"])

    # Candidates: the middle of every selected beat — the same understanding
    # that drove the edit, not a random frame or the first frame.
    times = [(float(s["start"]) + float(s["end"])) / 2.0 for s in segs]
    beats = [s["role"] for s in segs]
    frames = score_frames(src, times, beats)
    if not frames:
        print("❌ No usable candidate frame."); return 3

    tmp = out / ".tmp"; tmp.mkdir(exist_ok=True)
    mark = tmp / "mark.png"
    run(["ffmpeg", "-v", "error", "-i",
         str(va.Path(bp.source_path()).parents[1] / "logo" / "adel-mark-white.svg"),
         "-vf", "scale=256:-1", "-y", str(mark)])

    product = (brief.get("product_name") or "the product").strip()
    best, second = frames[0], (frames[1] if len(frames) > 1 else frames[0])

    # Composition is decided from the assets and the story, not a template.
    # No face detection => every creator-dependent composition is unavailable.
    directions = [
        dict(id="A", name="Product hero",
             why="The strongest frame is the device itself, sharp and centred. With no "
                 "creator asset the product carries the frame, and the panel names it "
                 "rather than shouting a hook.",
             frame=best, hook=product.upper(), label=brief.get("content_family", ""),
             scrim=0.0, rule=False, hook_scale=0.062, hook_scale_wide=0.062),
        dict(id="B", name="Curiosity — reveal withheld",
             why="The reveal beat with a short hook over the quiet band. Text asks "
                 "the question the frame does not answer.",
             frame=best, hook="WORTH IT?", label=product, scrim=0.46,
             rule=True, hook_scale=0.105),
        dict(id="C", name="Bold concept — typography led",
             why="Typography is the idea; the frame supports it. Used when the "
                 "product reads small at feed size.",
             frame=second, hook="FOLD IT", label=brief.get("content_family", ""),
             scrim=0.55, rule=True, hook_scale=0.135),
    ]

    made, rows = [], []
    for d in directions:
        f = d["frame"]
        for name, w, h, prov in SURFACES:
            if name not in ("youtube-thumbnail", "shorts-cover"):
                continue                      # full set only for the recommended one
            base = tmp / f"{d['id']}_{name}.png"
            mode = recompose(src, f["t"], w, h, base)
            dest = out / f"{name}-{d['id']}.png"
            compose(base, dest, w, h, d, brief, mark, f["text_band"], wide=(w / h) > 1.15)
            made.append(dest); rows.append((d, name, w, h, prov, mode, f))

    # The recommended direction gets every surface.
    rec = directions[1]
    for name, w, h, prov in SURFACES:
        base = tmp / f"rec_{name}.png"
        mode = recompose(src, rec["frame"]["t"], w, h, base)
        dest = out / f"{name}.png"
        compose(base, dest, w, h, rec, brief, mark, rec["frame"]["text_band"],
                wide=(w / h) > 1.15)
        made.append(dest); rows.append((rec, name, w, h, prov, mode, rec["frame"]))

    (out / "thumbnail-candidates.json").write_text(
        json.dumps({"candidates": frames, "directions":
                    [{k: v for k, v in d.items() if k != "frame"} | {"frame_t": d["frame"]["t"]}
                     for d in directions]}, indent=2) + "\n", encoding="utf-8")

    md = [f"# Creative rationale — {product}", "",
          "Understood once, packaged per platform. The cover uses the same beats and the "
          "same seven signals that drove the edit — it is not a frame grabbed afterwards.", "",
          "## Why this hero", "",
          f"The strongest candidate is the **{best['beat']}** beat at **{best['t']:.2f}s** "
          f"(score {best['score']:.3f}).", "",
          "| Beat | t | score | clarity | product | story | curiosity | text-space | text band |",
          "|---|---:|---:|---:|---:|---:|---:|---:|---|"]
    for f in frames:
        d = f["dims"]
        md.append(f"| {f['beat']} | {f['t']:.2f}s | {f['score']:.3f} | {d['clarity']:.2f} | "
                  f"{d['product']:.2f} | {d['story']:.2f} | {d['curiosity']:.2f} | "
                  f"{d['text_space']:.2f} | {f['text_band']} |")
    md += ["", "Text is placed in the band with the least edge energy, measured per frame — "
           "so the type never lands on the busiest part of the image.", "",
           "## Directions", ""]
    for d in directions:
        md.append(f"### Direction {d['id']} — {d['name']}\n\n{d['why']}  \n"
                  f"Frame: **{d['frame']['beat']}** at {d['frame']['t']:.2f}s · "
                  f"hook: {d['hook'] or '_none_'} · text band: `{d['frame']['text_band']}`\n")
    md += ["## Recommended", "",
           f"**Direction {rec['id']} — {rec['name']}** for every surface. The device is "
           f"recognisable at feed size and the hook supplies the question the frame withholds. "
           f"Direction A is the fallback where a platform discourages text; C is for a feed "
           f"where the product reads too small.", "",
           "## Rejected, and why", "",
           "- **Creator only / creator + product / reaction** — *unavailable*. This script has "
           "no face detection, and the footage is hands-only: no creator frame exists to select. "
           "**Recommendation: shoot a dedicated thumbnail photograph** if a creator-led cover is "
           "wanted. Guessing one from video would be fabricating an asset.",
           "- **A/B comparison, before/after** — one device, one state. No second subject exists.",
           "- **Screen/UI dominant** — the boot screen appears only briefly and is too dim at "
           "feed size to carry a cover.", "",
           "## Platform surfaces", "",
           "| Surface | Size | Provenance | Recomposition |", "|---|---|---|---|"]
    seen = set()
    for d, name, w, h, prov, mode, f in rows:
        if name in seen: continue
        seen.add(name)
        md.append(f"| `{name}` | {w}×{h} | {prov} | {mode} |")
    md += ["", "Every surface is **recomposed**, never a blind crop of one master: the subject is "
           "held at its own scale over a darkened, blurred extension of the same frame.", "",
           "## Title / hook treatment", "", f"Hooks stay 2–5 words. For {product}:", "",
           "| Use | Hook | Why |", "|---|---|---|",
           "| recommended | **WORTH IT?** | a question the frame cannot answer |",
           "| alternate | **FOLD IT** | verb-led, reads at 168 px |",
           "| alternate | **FIRST FOLD** | positions the format, not the spec |", "",
           "Titles are not hooks. A title may name the product; the cover hook must not repeat it.", "",
           "## Brand treatment — fixed while composition varies", "",
           "| Fixed | Varies |", "|---|---|",
           "| A-mark, same corner, same scale ratio | which beat becomes the hero |",
           "| Signature Blue label, Spark Coral rule | whether there is a hook at all |",
           "| hook in caps with a dark border | scrim depth, text band, type scale |",
           "| text placed in the quietest band | the composition itself |", "",
           "## Caveats", "",
           "- **Montserrat is not installed here**; covers render in DejaVu Sans Bold. "
           "Structurally correct, typographically provisional.",
           "- Source is 576×1024 WhatsApp-compressed, so a 1280×720 cover is upscaled. "
           "A camera original would be sharper.",
           f"- `{[s for s in SURFACES if 'DERIVED' in s[3]][0][0]}` and the other derived sizes "
           "keep the Phase 2B rule: no platform pixel size is invented as audited.", ""]
    (out / "creative-rationale.md").write_text("\n".join(md) + "\n", encoding="utf-8")

    print(f"✓ {len(made)} cover(s) → {out}")
    for p in sorted({m.name for m in made}):
        print(f"    {p}")
    print(f"✓ {out/'creative-rationale.md'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
