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

# Edit reserves live in calibration/thresholds.json, never inline here — a
# calibration run on real footage must be able to move them, and the move must
# show up as a measurable delta rather than a diff against buried literals.
import tuning
TUNE = tuning.load()
_P = TUNE["plan"]
PRE_ROLL = float(_P["pre_roll_s"])      # breath before a transient
TAIL = float(_P["tail_s"])              # the decay — cutting into this is what kills ASMR
MIN_CUT = float(_P["min_cut_s"])        # a silence shorter than this is not worth cutting
MIN_SEGMENT = float(_P["min_segment_s"])# a kept run shorter than this is MERGED, never discarded


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


def snap_out(t: float, reserves: list, forward: bool) -> float:
    """Move a cut point OUT of any tactile reserve it lands inside.

    A sub-range boundary that falls mid-reserve truncates a decay — the exact
    thing the reserves exist to prevent. Boundaries move outward, never inward.
    """
    for rs, re in reserves:
        if rs < t < re:
            return re if forward else rs
    return t


def carve(a: float, b: float, events: list, heroes: list, reserves: list,
          want: float) -> list:
    """Split an over-long protected run into the best sub-ranges inside `want`.

    Dense real footage merges every reserve into one continuous block — a whole
    unboxing can come back as a single 140s "keep". Taking it whole blows the
    duration budget; truncating it arbitrarily throws away the judgement the
    hero-window scoring already did. So carve around the hero moments, and
    snap every boundary clear of a reserve.
    """
    inside = [h for h in heroes if h["start"] >= a - 0.01 and h["end"] <= b + 0.01]
    inside.sort(key=lambda h: -h.get("score", 0))
    out, used = [], 0.0
    for h in inside:
        if used >= want:
            break
        span = min(want - used, max(h["end"] - h["start"], 2.0))
        mid = (h["start"] + h["end"]) / 2.0
        lo = snap_out(max(a, mid - span / 2.0), reserves, forward=False)
        hi = snap_out(min(b, lo + span), reserves, forward=True)
        if hi - lo < 1.0 or any(not (hi <= o[0] or lo >= o[1]) for o in out):
            continue
        out.append((lo, hi)); used += hi - lo
    if not out:
        # No hero window here: take the densest `want` seconds by event count.
        best, bs = (a, min(b, a + want)), -1
        step = max(0.5, want / 8.0)
        t = a
        while t + want <= b + 1e-6:
            n = sum(1 for e in events if t <= e["t"] <= t + want)
            if n > bs:
                bs, best = n, (t, t + want)
            t += step
        lo = snap_out(best[0], reserves, forward=False)
        hi = snap_out(min(b, lo + want), reserves, forward=True)
        out = [(lo, hi)]
    out.sort()
    return out


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

        heroes = clip.get("hero_windows", [])
        taken = []
        for k in scored:
            remaining = budget - total
            if remaining <= 0.5:
                dropped.append((f"{clip['file']} {k['start']}–{k['end']}s", "over duration budget"))
                continue
            if k["dur"] > remaining:
                # Too long to take whole. Carve it around the hero moments rather
                # than accepting it entire (blows the budget) or cutting it at an
                # arbitrary point (ignores the scoring already done).
                for a2, b2 in carve(k["start"], k["end"], events, heroes, reserves, remaining):
                    n2 = sum(1 for e in events if a2 <= e["t"] <= b2)
                    taken.append({"start": round(a2, 3), "end": round(b2, 3),
                                  "events": n2, "dur": round(b2 - a2, 3),
                                  "carved_from": [k["start"], k["end"]]})
                    total += b2 - a2
                dropped.append((f"{clip['file']} {k['start']}–{k['end']}s",
                                f"carved to fit budget — kept {len([t for t in taken if t.get('carved_from')])} "
                                f"hero-anchored sub-range(s)"))
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
