# AdelTechTalks — TikTok Profile Redesign Carousel

**Status:** built · 2026-09-21
**Where:** Figma, brand file `OD9bQi6eWexQi53tLKoctW`, page `05 — Static Ultra Carousel`, section
`AdelTechTalks — TikTok Profile Redesign Carousel` (node `139:215`).
**Link:** https://www.figma.com/design/OD9bQi6eWexQi53tLKoctW/?node-id=139-215
**Format:** 6 slides · 1080 × 1350 (4:5) · Arabic-first, RTL · TikTok / Instagram photo carousel.

## Why Figma, not Canva

- Canva holds no AdelTechTalks brand templates, and the "AdelTechTalks" brand kit there is still the
  retired Edition 1 purple / Cairo kit (see `00_PHASE1_AUDIT.md` §3.2, §5.7).
- Figma carries the locked Phase 2A system: `Color / Semantic` variables, `Social/*` text styles,
  `Elevation/*` effect styles, the A-mark, signature strip and I ❤ Tech components, and the ten
  1080 × 1350 carousel masters on page 05. The carousel reuses that anatomy exactly.

## Anatomy (shared by all six slides)

| Element | Value |
|---|---|
| Canvas | Warm White `surface/canvas`, 72 px margins, 936 px content column |
| Index | `01 / 06` … `06 / 06`, JetBrains Mono Medium 26, top-left (72, 96) |
| Eyebrow | `Social/Label` in `text/link` (Signature Blue), right-aligned, top-right |
| Headline | `Social/Cover` (Readex Pro 112/123) on slides 1; `Social/Title` (Readex Pro Bold 76/94) on 2–6 |
| Body / sub | `Social/Body` 36/58, `Social/Sub` 54/71, `Social/Support` 30/48 — slate |
| Screenshot crops | clipping frame, radius 20 (40 on the cover phone), 1 px Soft Gray stroke, `Elevation/3`; the full screenshot sits inside as an editable rectangle |
| Callouts | white pills `Elevation/2`, Deep Blue text, 2.5 px Signature Blue leader + dot, 3 px rings |
| Signature | `Brand / Signature strip · Lang=AR` instance, bottom-right at y 1140 |
| Accent | TikTok cyan `#25F4EE` / pink `#FE2C55` appear once, as two 10 px dots in the cover badge |

## Copy deck (as built)

| # | Eyebrow | Headline | Copy |
|---|---|---|---|
| 01 | تحديث جديد في TikTok | TikTok غيّر شكل البروفايل 👀 | وأول حاجة جات في بالي… Instagram؟ 😅 |
| 02 | التغيير | البروفايل اتغيّر فعلًا | الصورة والـBio والمعلومات بقوا ناحية الجنب بدل الشكل التقليدي اللي متعودين عليه. · callouts: الصورة · الأرقام · الـBio والمعلومات |
| 03 | التفاصيل | إيه اللي اتغيّر؟ | cards: المعلومات بقت Side‑Aligned · مساحات أكبر وأنضف · الـFollow بقى أوضح · اختصارات زي TikTok Studio بقت في الواجهة |
| 04 | الإحساس | هو أنا فتحت Instagram؟ 😅 | الـProfile الجديد بيدي مساحة أكبر للهوية والمعلومات… ومش بس الفيديوهات. · chips: الجديد في TikTok · بروفايل سوشيال تقليدي |
| 05 | بالنسبة للـCreators | وده يهم الـCreators ليه؟ | صورتك بقت أهم · الـBio بقى له حضور أكبر · أول فيديوهات في الـGrid بقت جزء أقوى من أول Impression · closing: يعني شكل البروفايل نفسه محتاج اهتمام أكتر. |
| 06 | رأيك يهمني | الجديد ولا القديم؟ 👀 | أنا لسه بحاول أتعود عليه 😅 · choices: الجديد ✅ / القديم ❤️ · footer: قولّي رأيك في الكومنتات 👇 · I ❤ Tech lockup |

RTL rules applied: "TikTok" is always written in Latin; the cover headline starts with it, so the text is prefixed with an invisible right-to-left mark (U+200F) to keep the paragraph RTL. Every other text box starts with an Arabic word; Latin product names are inline
islands; `؟` + emoji and `Side‑Aligned` use non-breaking joins (U+00A0 / U+2011) so a line never
ends on a lone emoji or a split hyphenated word. Rendering verified at 1080 × 1350 and at grid
thumbnail size.

## Editing

- Re-crop any screenshot by moving the inner `image · TikTok profile screenshot` rectangle; swap the
  image fill to replace the screenshot everywhere it is used.
- Text is plain Figma text bound to the `Social/*` styles; colours are bound to `Color / Semantic`.
- Export: select the six slide frames → PNG 1×.

## Known gaps

- KO Ghorab is still not available in Figma, so the cover headline renders in the Readex Pro
  placeholder that the `Social/Cover [Ghorab]` style already carries (Phase 2A decision).
- Canva mirror not produced: no brand templates exist there yet (Phase 2 §6.2 pending).
