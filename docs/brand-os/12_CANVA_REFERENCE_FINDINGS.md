# Canva reference findings

> **✅ FINAL APPROVED** as part of the locked Phase 2B system (2026-09-14). Frozen; not reopened without a genuine implementation blocker.

**Reference only, completed 2026-09-14.** Canva is **not** a source of truth and overrode nothing. The Figma Brand OS remains canonical; this study fed production patterns into it, one direction only.
**Machine-readable:** `brand/tokens/adel-v2.1.json` → `thumbnails['canva-reference-review']`, `thumbnails['media-requirements']`, `thumbnails.checklist`.

---

## 1 · What was actually inspected — and what was not

The Canva connector exposes **the account's own content**, not Canva's public template gallery. So the honest inventory is:

| | Found |
|---|---|
| Brand templates | **0** — none exist in the account |
| Brand kits | 1, named `AdelTechTalks` |
| Designs | 11 |

**There is not one 16:9 thumbnail or video cover in the account.** Every design is 9:16 mobile video, a 9:16 carousel, or a header. Canva therefore contributed nothing about thumbnails *directly* — the conventions it did contribute are about covers, carousels and production process.

I could not browse Canva's public template library through this connector, so this document makes no claim about it. Writing "Canva templates show that…" from memory would have been invention dressed as research.

## 2 · Material quality

Only **one** design is substantive: a 23-page build guide, *Canva Carousel Template Guide — DJI Osmo Pocket 4P (9:16)*. It is a serious document — canvas geometry, type scale, enforced slot ceilings, three named directions with trade-offs, a brand-kit mapping and an editor checklist.

The other ten are **untouched stock templates still carrying their placeholder copy** — "Matthew Collins", "reallygreatsite.com", "unboxing time!". These are exactly the stock-template experiments Phase 2A ordered archived, and this review confirms that decision was right.

### The build guide is Edition 1, not current

It specifies Cairo, **Purple 600 as the brand colour**, the violet-tinted Ink ramp, Mist / Veil grounds, Dark Impact navy and the 45° gradient. **Phase 2A archived every one of those.** The Canva account is *behind* the Brand OS, not ahead of it. That is the single most important finding here: Canva is reference material precisely because it is out of date, and it must be rebuilt from `brand/tokens/adel-v2.1.json` before any production use.

## 3 · What was useful — adopted

1. **Media requirements per archetype.** The guide declares photo slots per direction and then says plainly *"if the shoot is thin, use A."* That honesty is worth more than any layout. All ten thumbnail archetypes now declare what they need from the shoot, and the system says which to use with a single usable frame — and that duplicating one photograph into a two-frame comparison is a lie, not a workaround. This directly addresses the live blocker on the Fold-First test.
2. **A pre-export checklist.** The guide ends in an editor checklist. Ours now does too — ten items, run before export.
3. **Stating what a photograph must *provide*.** "The lower third of each must stay calm, or the glass panel turns to mud" is a photo-suitability rule, not a layout rule. Archetypes now state what the image has to give them; a photo that cannot is the wrong photo, not a reason to weaken the archetype.
4. **An Instagram Video Cover profile.** The account being 9:16-only exposed a real gap: the profile list had YouTube, Facebook, Shorts, Reels and TikTok but no Instagram feed cover. Added as a sixth profile over the audited 9:16 master, with the **square grid preview** as its governing constraint rather than the full frame.
5. **Tool limits recorded for the eventual rebuild** — Canva cannot apply per-corner radii to a frame, RTL is applied per text box rather than per document, and Arabic rendering with inline Latin is still unverified there.

### Converged independently — not adopted

The guide enforces word ceilings with the remedy *"always fewer words, never smaller type"*, and gives each of its three directions an explicit trade-off including when **not** to use it. Both rules already exist in this system, reached separately. Worth recording as convergence — it is evidence the rules are sound, not a borrowing.

## 4 · What was rejected

- **Every Edition 1 colour and type value** in the guide. Archived by Phase 2A, not reopened.
- **The "Origin Corner" shape signature** — one double-radius corner per media block. Decorative geometry that fights the approved single-radius restraint.
- **A glass caption panel on every slide.** This system does not draw a panel to hold text; contrast is a global grade.
- **Generic template energy** in any form: stock layouts, placeholder aesthetics, anything that reads as assembled rather than composed.
- **Canva as a source of truth.** It informs production; it does not define the system.

## 5 · What changed in the AdelTechTalks system

Six additions, all additive:

| Change | Where |
|---|---|
| Instagram Video Cover profile | `thumbnails.profiles`, plus a sixth mode on the Figma `Canvas / Thumbnail Platforms` collection |
| Media requirements per archetype | `thumbnails['media-requirements']`, and a `NEEDS:` line on all ten Figma archetype descriptions |
| Pre-export checklist | `thumbnails.checklist` |
| Photo-suitability rule | `thumbnails['image-treatment']['photo-must-provide']` |
| Canva rebuild constraints | `thumbnails['canva-reference-review']['rebuild-constraints']` |
| This record | `thumbnails['canva-reference-review']` |

**No approved value changed. No archetype was replaced. Nothing in the visual language moved.** The export regenerates clean.

## 6 · Standing position on Canva

Phase 2A said: *archive, do not delete, the stock-template experiments; no Canva rebuild until the Figma foundations are approved.* This review confirms it and adds one line: when the rebuild happens, it is a **one-way sync** — `brand/tokens/adel-v2.1.json` into a new Canva brand kit, replacing the Edition 1 values still sitting there under the AdelTechTalks name. Nothing flows back.
