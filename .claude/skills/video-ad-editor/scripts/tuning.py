#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Detection-tuning loader for the ASMR pipeline.

The counterpart to brand_profile.py. That module is the ONLY way brand values
enter the video engine; this one is the ONLY way signal-detection constants do.
Keeping them apart is deliberate:

    brand_profile.py  → brand/tokens/adel-v2.1.json   (canvas, safe zones, watermark)
    tuning.py         → calibration/thresholds.json   (silence, transients, reserves)

Detection tuning is a property of the FOOTAGE, not of the brand. A calibration
run changes how transients are found; it must never be able to move a safe zone.

Usage:
    import tuning
    T = tuning.load()                 # active profile
    T = tuning.load("real-v1")        # a specific profile
    T["events"]["rise_ratio"]
"""
import json
from pathlib import Path

CAL = Path(__file__).resolve().parent.parent / "calibration" / "thresholds.json"


def _doc() -> dict:
    if not CAL.exists():
        raise FileNotFoundError(
            f"Missing tuning file: {CAL}\n"
            "The ASMR pipeline refuses to guess detection thresholds.")
    return json.loads(CAL.read_text(encoding="utf-8"))


def profile_names() -> list:
    return [k for k in _doc().get("profiles", {})]


def active_name() -> str:
    return _doc().get("active", "synthetic-v1")


def load(name: str = None) -> dict:
    """Return one tuning profile, with its own name attached as _id."""
    d = _doc()
    key = name or d.get("active", "synthetic-v1")
    profs = d.get("profiles", {})
    if key not in profs:
        raise KeyError(
            f"Unknown tuning profile '{key}'. Available: {', '.join(profs) or '(none)'}")
    p = dict(profs[key])
    p["_id"] = key
    return p


def flat(name: str = None) -> dict:
    """The tunable numbers only, flattened to group.key — for calibration diffs."""
    p = load(name)
    out = {}
    for group, vals in p.items():
        if group.startswith("_") or not isinstance(vals, dict):
            continue
        for k, v in vals.items():
            if not k.startswith("_") and isinstance(v, (int, float)):
                out[f"{group}.{k}"] = v
    return out


def delta(base: str, other: str) -> dict:
    """What changed between two profiles, and by how much. The calibration delta."""
    a, b = flat(base), flat(other)
    out = {}
    for k in sorted(set(a) | set(b)):
        av, bv = a.get(k), b.get(k)
        if av != bv:
            pct = None
            if isinstance(av, (int, float)) and isinstance(bv, (int, float)) and av:
                pct = round((bv - av) / av * 100.0, 1)
            out[k] = {"from": av, "to": bv, "change_pct": pct}
    return out


def save_profile(name: str, prof: dict, make_active: bool = False) -> None:
    """Write a derived profile back. Used only by 23_asmr_calibrate.py."""
    d = _doc()
    prof = {k: v for k, v in prof.items() if k != "_id"}
    d.setdefault("profiles", {})[name] = prof
    if make_active:
        d["active"] = name
    CAL.write_text(json.dumps(d, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


if __name__ == "__main__":
    import sys
    if len(sys.argv) >= 4 and sys.argv[1] == "delta":
        print(json.dumps(delta(sys.argv[2], sys.argv[3]), indent=2))
    else:
        print(f"active: {active_name()}")
        print(f"profiles: {', '.join(profile_names())}")
        print(json.dumps(flat(), indent=2))
