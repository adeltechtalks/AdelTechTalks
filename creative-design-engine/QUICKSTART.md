# Quickstart

Five minutes from nothing to a first direction.

---

## 1 · Make a brand profile

Copy `templates/brand-profile.example.json` and replace every value. The minimum that actually works:

- one primary colour, one ink, three surfaces
- a display face and a text face
- **an annotation colour that is not your primary or action colour**
- one platform with a canvas, a margin and its reserves
- your language rules and digit convention

Do not fill in what you have not decided. A declared-but-wrong value is worse than an absent one — the engine trusts the profile completely.

## 2 · Write a content brief

Copy `templates/content-brief.example.json`. Leave `primaryBeat` null and let the engine propose one.

## 3 · List your assets

Copy `templates/asset-manifest.example.json`. **List only what exists.** Also list what is missing under `absent` — it tells the engine which strategies to stop considering, and tells you what to go and shoot.

## 4 · Ask

> "Create a YouTube thumbnail for this camera comparison."

The engine will: read the manifest first · pick a hero from what exists · name the beat · filter compositions the assets permit · rank them · choose one primary skill and at most one supporting · apply your profile · adapt to the platform · give you two or three directions with reasons, plus what it rejected.

## 5 · Read the rejections

The rejections are the most useful part. They tell you whether the engine understood the job, and they usually name the asset you need.

---

## If it gives you one direction

Your assets allow one. That is information, not a failure.

## If every direction looks the same

Check the manifest. Thin assets produce similar work because the honest options are few. If the manifest is rich and the output is still uniform, the brand profile is probably over-specified — it is prescribing layout where it should be prescribing values.
