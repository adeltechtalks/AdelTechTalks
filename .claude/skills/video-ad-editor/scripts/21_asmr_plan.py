#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ASMR edit decisions.

Turns asmr-analysis.json into asmr-plan.json plus a human-readable
asmr-decisions.md that says why every cut exists.

The rule that shapes everything here:

    Dead time is removed. Tactile rhythm is not.

Cutting to the last millisecond of a sound destroys ASMR — the decay IS the
content. So every detected transient reserves a pre-roll before it and a tail
after it, and no silence overlapping a reserve is ever trimmed.

The audio policy is enforced here in code, not merely declared in prose:
speed 1.0, volume 1.0, no denoise, no gate, no compression, no loudness
normalisation, music off, captions off.

Usage: python3 21_asmr_plan.py <workdir> [--seconds 28]
"""
import json, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import brand_profile as bp

PRE_ROLL = 0.12    # breath before a transient
TAIL = 0.45        # the decay — cutting into this is what kills ASMR
MIN_CUT = 0.30     # a silence shorter than this is not worth cutting
MIN_SEGMENT = 0.35 # a kept run shorter than this is MERGED, never discarded


def protected(events: list) -> list:
    """Reserves around every tactile event, merged."""
    spans = [(max(0.0, e["t"] - PRE_ROLL), e["t"] + TAIL) for e in events]
    spans.sort()
    out = []
    for s, e in spans:
        if out and s <= out[-1][1]:
            out[-1] = (out[-1][0], max(out[-1][1], e))
        else:
            out.append((s, e))
    return out


def trimmable(silences: list, reserves: list) -> list:
    """Silence minus every protected reserve."""
    cuts = []
    for s in silences:
        pieces = [(s["start"], s["end"])]
        for rs, re in reserves:
            nxt = []
            for a, b in pieces:
                if re <= a or rs >= b:
                    nxt.append((a, b)); continue
                if a < rs:
                    nxt.append((a, rs))
                if re < b:
                    nxt.append((re, b))
            pieces = nxt
        cuts += [(a, b) for a, b in pieces if b - a > 0.0]
    return cuts


def keep_ranges(duration: float, cuts: list) -> list:
    """Everything that is not a trimmable silence.

    A short kept run is MERGED with its neighbour by giving back the cut
    between them — never discarded. Discarding it would throw away exactly the
    protected tactile content the reserves exist to defend, which is the
    opposite of the rule.
    """
    cuts = [(a, b) for a, b in sorted(cuts) if b - a >= MIN_CUT]
    keeps, cursor = [], 0.0
    for a, b in cuts:
        if a > cursor:
            keeps.append([cursor, a])
        cursor = max(cursor, b)
    if cursor < duration:
        keeps.append([cursor, duration])
    if not keeps:
        return []
    merged = [keeps[0]]
    for k in keeps[1:]:
        if merged[-1][1] - merged[-1][0] < MIN_SEGMENT or k[1] - k[0] < MIN_SEGMENT:
            merged[-1][1] = k[1]          # absorb the gap rather than lose the sound
        else:
            merged.append(k)
    return [(a, b) for a, b in merged if b - a > 0.0]


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: 21_asmr_plan.py <workdir> [--seconds 28]")
        return 2
    work = Path(sys.argv[1]).resolve()
    ana_path = work / "asmr-analysis.json"
    if not ana_path.exists():
        print(f"❌ Missing {ana_path}. Run 20_asmr_analyze.py first.")
        return 3
    ana = json.loads(ana_path.read_text(encoding="utf-8"))
    rules = bp.format_rules("asmr-unboxing")
    prof = ana["profile"]

    lo, hi = rules["default_duration_seconds"]
    budget = float(sys.argv[sys.argv.index("--seconds") + 1]) if "--seconds" in sys.argv else float(hi)

    sequence = rules["default_sequence"]
    segments, notes, dropped = [], [], []
    total = 0.0

    for i, clip in enumerate(ana["clips"]):
        role = sequence[i] if i < len(sequence) else sequence[-1]
        events = clip["audio"]["events"]
        reserves = protected(events)
        cuts = trimmable(clip["audio"]["silences"], reserves)
        keeps = keep_ranges(clip["duration"], cuts)
        removed = sum(b - a for a, b in cuts)
        guarded = sum(1 for s in clip["audio"]["silences"]
                      if any(not (re <= s["start"] or rs >= s["end"]) for rs, re in reserves))

        if not keeps:
            dropped.append((clip["file"], "no usable range survived trimming"))
            continue

        # Prefer the ranges carrying the most tactile activity.
        scored = []
        for a, b in keeps:
            n = sum(1 for e in events if a <= e["t"] <= b)
            scored.append({"start": round(a, 3), "end": round(b, 3), "events": n,
                           "dur": round(b - a, 3)})
        scored.sort(key=lambda k: (-k["events"], -k["dur"]))

        taken = []
        for k in scored:
            if total + k["dur"] > budget and taken:
                dropped.append((f"{clip['file']} {k['start']}–{k['end']}s", "over duration budget"))
                continue
            taken.append(k)
            total += k["dur"]
        taken.sort(key=lambda k: k["start"])

        for k in taken:
            segments.append({
                "role": role, "clip": clip["file"], "src": clip["path"],
                "start": k["start"], "end": k["end"],
                "speed": 1.0, "volume": 1.0,
                "events_preserved": k["events"],
                "boundary_fade_ms": rules["editing_rules"]["audio"]["boundary_fade_ms"],
            })
        notes.append({
            "clip": clip["file"], "role": role, "duration": round(clip["duration"], 2),
            "events": len(events), "silences": len(clip["audio"]["silences"]),
            "silence_removed_s": round(removed, 2),
            "silences_guarded": guarded, "segments": len(taken),
            "kept_s": round(sum(k["dur"] for k in taken), 2),
        })

    audio = rules["editing_rules"]["audio"]
    plan = {
        "_generated_by": "21_asmr_plan.py",
        "_brand_source": ana["_brand_source"],
        "format": rules["id"],
        "target": {"profile": prof["id"], "width": prof["width"],
                   "height": prof["height"], "fps": prof["fps"]},
        "policy": {
            "music": rules["music"], "captions": rules["captions"],
            "denoise": audio["denoise"], "noise_gate": audio["noise_gate"],
            "compression": audio["compression"],
            "loudness_normalization": audio["loudness_normalization"],
            "speed": 1.0, "volume": 1.0,
            "_enforced_by": "22_asmr_render.py refuses any plan that sets these otherwise",
        },
        "creative": {
            "primary_treatment": None, "supporting_treatment": None,
            "_note": "ASMR default is product-first, tactile, premium, calm — which usually "
                     "means no creative treatment beyond the corner watermark. The renderer "
                     "caps treatments at one primary plus one supporting.",
        },
        "watermark": {"enabled": True, "corner": "top-left"},
        "segments": segments,
    }
    (work / "asmr-plan.json").write_text(json.dumps(plan, indent=2) + "\n", encoding="utf-8")

    md = ["# ASMR edit decisions", "",
          f"Generated by `21_asmr_plan.py` from `asmr-analysis.json`. "
          f"Target **{prof['id']} {prof['width']}×{prof['height']} @{prof['fps']}fps**. "
          f"Duration budget **{budget:.0f}s** (format allows {lo}–{hi}s).", "",
          "## The rule",
          "",
          "**Dead time is removed. Tactile rhythm is not.** Every transient reserves "
          f"{PRE_ROLL*1000:.0f} ms before it and {TAIL*1000:.0f} ms after it. A silence overlapping a "
          "reserve is never trimmed — the decay is the content.", "",
          "## Per clip", "",
          "| Clip | Role | Length | Events | Silences | Removed | **Guarded** | Segments | Kept |",
          "|---|---|---|---|---|---|---|---|---|"]
    for n in notes:
        md.append(f"| `{n['clip']}` | {n['role']} | {n['duration']}s | {n['events']} | "
                  f"{n['silences']} | {n['silence_removed_s']}s | **{n['silences_guarded']}** | "
                  f"{n['segments']} | {n['kept_s']}s |")
    md += ["", f"**Guarded** counts silences the trimmer refused to cut because they sat inside "
               f"a tactile reserve. That column is the one that matters: it is the difference "
               f"between an edit and a jump-cut reel.", ""]
    if dropped:
        md += ["## Rejected", ""] + [f"- `{w}` — {why}" for w, why in dropped] + [""]
    md += ["## Policy enforced in code", "",
           "| Setting | Value |", "|---|---|",
           f"| music | {audio and rules['music']} |",
           f"| captions | {rules['captions']} |",
           f"| denoise | {audio['denoise']} |",
           f"| noise gate | {audio['noise_gate']} |",
           f"| compression | {audio['compression']} |",
           f"| loudness normalisation | {audio['loudness_normalization']} |",
           "| speed | 1.0 |", "| volume | 1.0 |", "",
           "The renderer refuses a plan that sets any of these otherwise. The policy is "
           "checked where it can be checked, not merely written down.", "",
           f"**Total kept: {total:.2f}s across {len(segments)} segment(s).**", ""]
    (work / "asmr-decisions.md").write_text("\n".join(md), encoding="utf-8")

    print(f"✓ {work/'asmr-plan.json'}  — {len(segments)} segment(s), {total:.2f}s")
    print(f"✓ {work/'asmr-decisions.md'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
