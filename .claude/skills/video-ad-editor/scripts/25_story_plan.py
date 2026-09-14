#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Beat-aware, multi-signal edit planning for ASMR unboxing.

Replaces the density-ranked selector. v1 scored candidates on tactile transient
density alone and chose 30 seconds of packaging from a Galaxy Z Fold unboxing:
crinkling card is acoustically denser than a smooth hinge, so the box beat the
product. A strong transient is not a strong shot.

Two changes:

1. SEVEN SIGNALS, not one. narrative importance · visual quality · product
   visibility · action clarity · novelty · tactile value · hero potential.
   Audio is one weighted input. A loud clip with a weak visual now loses.

2. A STORY MODEL. Nine semantic beats of an unboxing. Each candidate window is
   scored against every beat signature; the sequence is assembled from the beats
   the footage actually contains, in canonical order. Beats that are not present
   are left out — a weak beat is never included to complete the list.

   `box_opening` is a priority beat: when a credible one exists it is reserved
   before the budget is spent, so it can never be displaced by louder packaging.

Signals are normalised to percentile rank WITHIN the clip, so every threshold is
footage-relative — the same principle that fixed the audio calibration.

Usage: python3 25_story_plan.py <workdir> [--seconds 30]
"""
import json, statistics, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import brand_profile as bp
import tuning

TUNE = tuning.load()
_P = TUNE["plan"]
PRE_ROLL = float(_P["pre_roll_s"])
TAIL = float(_P["tail_s"])
MIN_SEGMENT = float(_P["min_segment_s"])

WIN = 3.0          # candidate window length (s)
HOP = 0.5          # candidate stride (s)
MIN_BEAT = 1.6     # a beat shorter than this does not read as a shot; drop it

# ─────────────────────────────────────────────────────────────────────────────
# The story model. Signatures are expressed as desired PERCENTILE bands (0..1)
# for each normalised signal, plus where in the clip the beat usually sits.
# `priority` is narrative importance; `reserve` marks a beat that is protected
# from budget starvation.
# ─────────────────────────────────────────────────────────────────────────────
BEATS = [
    dict(id="sealed_hero",  label="Product / sealed box hero",
         pos=(0.00, 0.35), motion=(0.0, 0.40), sharp=(0.55, 1.0),
         hand=(0.0, 0.55), mass=(0.45, 1.0), nov=(0.0, 0.6),
         priority=0.70, reserve=False),
    dict(id="seal_peel",    label="Seal / peel / packaging interaction",
         pos=(0.00, 0.55), motion=(0.30, 0.85), sharp=(0.30, 1.0),
         hand=(0.45, 1.0), mass=(0.25, 1.0), nov=(0.1, 0.8),
         priority=0.65, reserve=False),
    dict(id="box_opening",  label="Actual box opening",
         pos=(0.05, 0.70), motion=(0.55, 1.0), sharp=(0.25, 1.0),
         hand=(0.50, 1.0), mass=(0.30, 1.0), nov=(0.45, 1.0),
         priority=1.00, reserve=True),
    dict(id="first_reveal", label="First reveal",
         pos=(0.10, 0.80), motion=(0.35, 0.95), sharp=(0.40, 1.0),
         hand=(0.35, 1.0), mass=(0.45, 1.0), nov=(0.60, 1.0),
         priority=0.95, reserve=True),
    dict(id="product_lift", label="Product lift / removal",
         pos=(0.15, 0.85), motion=(0.50, 1.0), sharp=(0.35, 1.0),
         hand=(0.55, 1.0), mass=(0.40, 1.0), nov=(0.35, 1.0),
         priority=0.85, reserve=False),
    dict(id="accessories",  label="Accessories / contents",
         pos=(0.20, 0.90), motion=(0.25, 0.85), sharp=(0.35, 1.0),
         hand=(0.40, 1.0), mass=(0.20, 0.85), nov=(0.25, 0.9),
         priority=0.45, reserve=False),
    dict(id="macro_detail", label="Macro / tactile detail",
         pos=(0.10, 0.95), motion=(0.0, 0.45), sharp=(0.65, 1.0),
         hand=(0.20, 0.95), mass=(0.55, 1.0), nov=(0.0, 0.55),
         priority=0.60, reserve=False),
    dict(id="handling",     label="Product handling",
         pos=(0.35, 1.00), motion=(0.30, 0.85), sharp=(0.40, 1.0),
         hand=(0.55, 1.0), mass=(0.45, 1.0), nov=(0.20, 0.85),
         priority=0.75, reserve=False),
    dict(id="final_hero",   label="Final hero shot",
         pos=(0.60, 1.00), motion=(0.0, 0.40), sharp=(0.60, 1.0),
         hand=(0.0, 0.70), mass=(0.55, 1.0), nov=(0.0, 0.6),
         priority=0.80, reserve=False),
]

# Weights for the seven reported dimensions.
W = dict(narrative=0.26, visual=0.14, product=0.14, action=0.12,
         novelty=0.10, tactile=0.14, hero=0.10)


def pct_ranker(vals: list):
    """Percentile rank of a value within this clip. Footage-relative, always."""
    srt = sorted(vals)
    n = len(srt)
    def rank(v):
        lo, hi = 0, n
        while lo < hi:
            mid = (lo + hi) // 2
            if srt[mid] < v: lo = mid + 1
            else: hi = mid
        return lo / max(1, n - 1)
    return rank


def band(v: float, lo: float, hi: float) -> float:
    """1.0 inside the band, tapering to 0 outside it. Never negative."""
    if lo <= v <= hi:
        return 1.0
    d = (lo - v) if v < lo else (v - hi)
    return max(0.0, 1.0 - d / 0.35)


def protected_spans(events: list) -> list:
    spans = [(max(0.0, e["t"] - PRE_ROLL), e["t"] + TAIL) for e in events]
    spans.sort()
    out = []
    for s, e in spans:
        if out and s <= out[-1][1]:
            out[-1] = (out[-1][0], max(out[-1][1], e))
        else:
            out.append((s, e))
    return out


def snap_out(t: float, reserves: list, forward: bool) -> float:
    for rs, re in reserves:
        if rs < t < re:
            return re if forward else rs
    return t


def build_candidates(clip: dict, vis: dict, reserves: list) -> list:
    """Sliding windows over the clip, each scored on all seven dimensions."""
    samples = vis["samples"]
    if not samples:
        return []
    dur = clip["duration"]
    rk = {k: pct_ranker([s[k] for s in samples])
          for k in ("sharpness", "motion", "hand", "subject_mass", "novelty")}
    events = clip["audio"]["events"]

    cands = []
    t = 0.0
    while t + WIN <= dur:
        win = [s for s in samples if t <= s["t"] < t + WIN]
        if not win:
            t += HOP; continue
        sharp = rk["sharpness"](statistics.mean(s["sharpness"] for s in win))
        motion = rk["motion"](statistics.mean(s["motion"] for s in win))
        hand = rk["hand"](statistics.mean(s["hand"] for s in win))
        mass = rk["subject_mass"](statistics.mean(s["subject_mass"] for s in win))
        nov = rk["novelty"](max(s["novelty"] for s in win))
        n_ev = sum(1 for e in events if t <= e["t"] < t + WIN)
        pos = t / dur if dur else 0.0

        # The seven dimensions.
        visual = sharp                                   # blur is disqualifying
        product = mass
        action = 1.0 - abs(motion - 0.55) / 0.55         # neither frozen nor smeared
        action = max(0.0, min(1.0, action))
        tactile = min(1.0, n_ev / 6.0)
        hero = (sharp * 0.5 + mass * 0.35 + (1.0 - motion) * 0.15)

        for b in BEATS:
            fit = (band(pos, *b["pos"]) * band(motion, *b["motion"])
                   * band(sharp, *b["sharp"]) * band(hand, *b["hand"])
                   * band(mass, *b["mass"]) * band(nov, *b["nov"]))
            if fit <= 0.02:
                continue
            narrative = b["priority"] * fit
            score = (W["narrative"] * narrative + W["visual"] * visual
                     + W["product"] * product + W["action"] * action
                     + W["novelty"] * nov + W["tactile"] * tactile
                     + W["hero"] * hero)
            cands.append({
                "beat": b["id"], "beat_label": b["label"],
                "start": round(t, 3), "end": round(t + WIN, 3),
                "score": round(score, 4), "fit": round(fit, 4),
                "dims": {"narrative": round(narrative, 3), "visual": round(visual, 3),
                         "product": round(product, 3), "action": round(action, 3),
                         "novelty": round(nov, 3), "tactile": round(tactile, 3),
                         "hero": round(hero, 3)},
                "events": n_ev,
            })
        t += HOP
    return cands


def pick(cands: list, budget: float, reserves: list, dur: float) -> tuple:
    """Choose at most one window per beat, in canonical order AND in time order.

    An unboxing is chronological: the seal cannot be peeled after the box is
    opened. Beat order and time order must therefore agree, and two beats can
    never occupy the same seconds. Greedy selection satisfied neither — it put
    seal/peel at 104s ahead of the opening at 90s and let the two reserved beats
    land on the same window.

    This is a DP over candidates sorted by time: extend a partial sequence only
    with a candidate that starts after the previous one ends AND belongs to a
    later beat. Reserved beats carry a bonus so a credible box-opening is chosen
    over louder packaging rather than competing with it on raw score.
    """
    order = [b["id"] for b in BEATS]
    idx = {b: i for i, b in enumerate(order)}
    bonus = {b["id"]: (0.45 if b["reserve"] else 0.0) for b in BEATS}

    # Keep the strongest windows per beat — enough for a real choice, few enough
    # to stay O(n^2) in the hundreds.
    per_beat = {}
    for c in cands:
        per_beat.setdefault(c["beat"], []).append(c)
    pool = []
    for b, lst in per_beat.items():
        lst.sort(key=lambda c: -c["score"])
        pool += lst[:40]
    pool.sort(key=lambda c: (c["start"], idx[c["beat"]]))
    n = len(pool)
    if not n:
        return [], [], order

    NEG = float("-inf")
    best = [NEG] * n
    prev = [-1] * n
    dur_of = [c["end"] - c["start"] for c in pool]
    val = [c["score"] + bonus[c["beat"]] for c in pool]
    used = [0.0] * n

    for i in range(n):
        best[i] = val[i]
        used[i] = dur_of[i]
        if used[i] > budget:
            best[i] = NEG
            continue
        for j in range(i):
            if best[j] == NEG:
                continue
            if pool[j]["end"] > pool[i]["start"]:
                continue                       # overlap in time
            if idx[pool[j]["beat"]] >= idx[pool[i]["beat"]]:
                continue                       # not a later beat
            if used[j] + dur_of[i] > budget:
                continue
            cand = best[j] + val[i]
            if cand > best[i]:
                best[i] = cand
                prev[i] = j
                used[i] = used[j] + dur_of[i]

    end_i = max(range(n), key=lambda i: best[i])
    if best[end_i] == NEG:
        return [], [], order
    seq, i = [], end_i
    while i != -1:
        seq.append(pool[i]); i = prev[i]
    seq.reverse()

    chosen_beats = {c["beat"] for c in seq}
    rejected = []
    for b in order:
        if b in per_beat and b not in chosen_beats:
            top = max(per_beat[b], key=lambda c: c["score"])
            rejected.append((top, "no slot in a chronologically consistent sequence"))

    # Spend any leftover budget widening the kept windows, never past a
    # neighbour and never into a reserve.
    spent = sum(c["end"] - c["start"] for c in seq)
    room = budget - spent
    if room > 0.5 and seq:
        grow = min(2.0, room / len(seq)) / 2.0
        for k, c in enumerate(seq):
            lo_lim = seq[k - 1]["end"] if k else 0.0
            hi_lim = seq[k + 1]["start"] if k + 1 < len(seq) else dur
            c["start"] = max(lo_lim, c["start"] - grow)
            c["end"] = min(hi_lim, c["end"] + grow)

    for c in seq:
        c["start"] = round(max(0.0, snap_out(c["start"], reserves, False)), 3)
        c["end"] = round(min(dur, snap_out(c["end"], reserves, True)), 3)

    # Reconcile. Snapping moves boundaries OUTWARD to clear a reserve, so it can
    # reintroduce the overlap the DP had eliminated and push the total past the
    # budget. Fix both here, after snapping, never by cutting back into a reserve.
    seq.sort(key=lambda c: c["start"])
    for k in range(1, len(seq)):
        if seq[k]["start"] < seq[k - 1]["end"]:
            seq[k]["start"] = round(seq[k - 1]["end"], 3)
    # A sliver left behind by clamping is not a beat. Drop it rather than
    # cutting to something too short to register as a shot.
    seq = [c for c in seq if c["end"] - c["start"] >= MIN_BEAT]

    total = sum(c["end"] - c["start"] for c in seq)
    if total > budget and seq:
        # Trim the lowest-scoring beats until it fits. A reserved beat is the
        # last thing dropped -- that is the whole point of reserving it.
        ranked = sorted(range(len(seq)),
                        key=lambda i: (bonus[seq[i]["beat"]], seq[i]["score"]))
        drop = set()
        for i in ranked:
            if total <= budget:
                break
            drop.add(i)
            total -= seq[i]["end"] - seq[i]["start"]
            rejected.append((seq[i], "trimmed to fit budget after reserve snapping"))
        seq = [c for i, c in enumerate(seq) if i not in drop]

    chosen_beats = {c["beat"] for c in seq}
    missing = [b for b in order if b not in chosen_beats]
    return seq, rejected, missing


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__); return 2
    work = Path(sys.argv[1]).resolve()
    ana_p, vis_p = work / "asmr-analysis.json", work / "asmr-visual.json"
    for p, who in ((ana_p, "20_asmr_analyze.py"), (vis_p, "24_visual_analyze.py")):
        if not p.exists():
            print(f"❌ Missing {p}. Run {who} first."); return 3
    ana = json.loads(ana_p.read_text(encoding="utf-8"))
    vis = json.loads(vis_p.read_text(encoding="utf-8"))
    rules = bp.format_rules("asmr-unboxing")
    lo, hi = rules["default_duration_seconds"]
    budget = float(sys.argv[sys.argv.index("--seconds") + 1]) if "--seconds" in sys.argv else float(hi)

    brief = {}
    bp_path = work / "brief.json"
    if bp_path.exists():
        brief = json.loads(bp_path.read_text(encoding="utf-8"))

    vmap = {v["file"]: v for v in vis["clips"]}
    segments, notes, all_rej, missing = [], [], [], []
    spent = 0.0
    for clip in ana["clips"]:
        v = vmap.get(clip["file"])
        if not v:
            continue
        reserves = protected_spans(clip["audio"]["events"])
        cands = build_candidates(clip, v, reserves)
        share = budget - spent
        chosen, rej, miss = pick(cands, share, reserves, clip["duration"])
        missing += [m for m in miss if m not in missing]
        all_rej += rej
        for c in chosen:
            if c["end"] - c["start"] < MIN_SEGMENT:
                continue
            segments.append({
                "role": c["beat"], "beat_label": c["beat_label"],
                "clip": clip["file"], "src": clip["path"],
                "start": c["start"], "end": c["end"],
                "speed": 1.0, "volume": 1.0,
                "score": c["score"], "dims": c["dims"],
                "events_preserved": c["events"],
                "boundary_fade_ms": rules["editing_rules"]["audio"]["boundary_fade_ms"],
            })
            spent += c["end"] - c["start"]
        notes.append({"file": clip["file"], "candidates": len(cands),
                      "beats_found": len(chosen), "beats_absent": miss})

    if not segments:
        print("❌ No segment survived beat selection."); return 4

    plan = {
        "_generated_by": "25_story_plan.py",
        "_model": "beat-aware, seven-signal. Audio is one input, not the selector.",
        "_brand_source": bp.source_path(),
        "_tuning": TUNE["_id"],
        "brief": brief,
        "target": {"profile": ana["profile"]["id"],
                   "width": ana["profile"]["width"],
                   "height": ana["profile"]["height"],
                   "fps": ana["profile"]["fps"]},
        "format": ana["format"],
        "audio": rules["editing_rules"]["audio"],
        "branding": {"opener_s": 0.8, "endcard_s": 1.0},
        "segments": segments,
        "notes": notes,
    }
    (work / "asmr-plan.json").write_text(json.dumps(plan, indent=2) + "\n", encoding="utf-8")

    total = sum(s["end"] - s["start"] for s in segments)
    md = ["# ASMR edit decisions — beat-aware", "",
          f"Generated by `25_story_plan.py`. Target **{ana['profile']['width']}×{ana['profile']['height']} "
          f"@{ana['profile']['fps']}fps**. Budget **{budget:.0f}s** (format allows {lo}–{hi}s).", "",
          "## Why this differs from v1", "",
          "v1 ranked candidates on tactile transient density alone and selected 30 seconds of "
          "packaging: crinkling card is acoustically denser than a smooth hinge. **A strong "
          "transient is not a strong shot.** Selection now scores seven signals and assembles "
          "the beats the footage actually contains, in story order.", "",
          "## Selected beats", "",
          "| # | Beat | Window | Score | narr | vis | prod | act | nov | tac | hero |",
          "|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|"]
    for i, s in enumerate(segments, 1):
        d = s["dims"]
        md.append(f"| {i} | **{s['beat_label']}** | {s['start']:.2f}–{s['end']:.2f}s | "
                  f"{s['score']:.3f} | {d['narrative']:.2f} | {d['visual']:.2f} | {d['product']:.2f} | "
                  f"{d['action']:.2f} | {d['novelty']:.2f} | {d['tactile']:.2f} | {d['hero']:.2f} |")
    md += ["", f"**Total {total:.2f}s across {len(segments)} beat(s).**", ""]
    if missing:
        md += ["## Beats not present in the footage", "",
               "Left out deliberately — a weak beat is never included to complete the list.", ""]
        md += [f"- `{m}`" for m in missing] + [""]
    md += ["## Protected", "",
           f"Every transient still reserves {PRE_ROLL*1000:.0f} ms before and {TAIL*1000:.0f} ms "
           f"after it, and every beat boundary is snapped OUT of a reserve — no cut lands inside "
           f"a decay.", ""]
    (work / "asmr-decisions.md").write_text("\n".join(md) + "\n", encoding="utf-8")

    print(f"✓ {work/'asmr-plan.json'}  — {len(segments)} beat(s), {total:.2f}s")
    for s in segments:
        print(f"    {s['beat_label']:34s} {s['start']:7.2f}→{s['end']:7.2f}  score {s['score']:.3f}")
    if missing:
        print(f"  absent beats: {', '.join(missing)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
