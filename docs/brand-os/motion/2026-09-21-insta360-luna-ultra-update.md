# AdelTechTalks — Insta360 Luna Ultra Update Motion Carousel

**Status:** rendered · 2026-09-21
**Source:** `content/motion-carousel/2026-09-insta360-luna-ultra-update/` (Remotion project + `carousel-plan.json`)
**Format:** 6 independent clips · 1080 × 1920 · 30 fps · 6–7 s each · muted · plus `carousel-preview.mp4` for review only
**Engine:** `.claude/skills/video-ad-editor` Motion Carousel format (`formats/motion-carousel.json`), rendered with the headless Chrome shell that ships with Playwright.

## Series anatomy (shared by all six)
| Element | Value |
|---|---|
| Canvas | Graphite-black `#0E1013`, faint Signature Blue radial glow; 9:16 reserves respected (nothing above y 260 or below y 1500, text right edge 828 beside the action-button column) |
| Index | `01 / 06` JetBrains Mono 26, top-left |
| Eyebrow | pill top-right: `جديد في التحديث` with a Mint dot on feature slides; `Insta360 Luna Ultra` / `AdelTechTalks` in Montserrat on the bookends |
| Media card | 936 × 800 at (72, 340), radius 32, 1 px white/8 % border, deep shadow, gradient into the canvas |
| Headline | Readex Pro Bold 64 (54 when long) for Arabic-led lines; Montserrat ExtraBold 60 for standalone English feature names; mixed lines rendered in an RTL paragraph |
| Sub | Readex Pro 34/51 Ice Blue |
| Signature | white A-mark + `@AdelTechTalks` Readex Pro Medium 26, bottom-left at y 1436 |
| Motion | 0.45 s eased reveals, slow push-ins/pans on stills, one masked transition per two-beat slide, UI callouts (glass pills, mint tracking brackets, rec pill, shutter flash), no whooshes |

## Slides
| # | Scene | Visual | Copy |
|---|---|---|---|
| 01 | hook | REAL-camera slot (placeholder: official cover render) + firmware "Update available → installed" UI card | Insta360 Luna Ultra · وصلها Update جديد 👀 · ودي أهم الحاجات الجديدة في التحديث |
| 02 | zoom | official 1×/15× split; pan from 1× to 15× while a mono counter ticks 1×→15× | 15× HighRes Zoom · تقريب أقوى لحد 15× — من ضمن الحاجات الجديدة في التحديث |
| 03 | stage | Stage Mode selector with pulsing ring → circular mask reveal of the AI stage shot | Stage Mode جديد 🎤 / متظبط للحفلات والعروض → AI-Enhanced Stage Footage / عشان يلقط اللحظات أوضح |
| 04 | tracking | stage shot, mint tracking brackets lock on the singer, zoom 1×→6× | Active Zoom Tracking · يمسك الهدف ويتابعه بسهولة |
| 05 | snapshot | camera-in-hand shot, REC pill, shutter flash, the live preview lifts off as a saved photo | Live Frame Snapshots · صوّر فيديو وخد Photo في نفس اللحظة 📸 |
| 06 | audio_cta | two animated waveform mode cards (Stage Audio / Ambient Audio 360) → wipe to the REAL-camera slot with the I ❤ Tech lockup | Pro Audio Modes / صوت أوضح حسب السيناريو → أي Feature شدّتك أكتر؟ 👀 / ولو عايزين أجرّب أول Feature أول ما تظهر عندي… قولولي |

## Content rules applied
- No claim of personal testing: every feature is introduced as part of the official update.
- Feature names in English; Arabic explanation first; Western digits.
- The Active Zoom Tracking and Pro Audio Modes slides had no official visual attached, so they use UI-style motion graphics over the official stage shot / brand graphite rather than a fabricated product screenshot.

## Open item
The two REAL-camera slots (`media/real-01-camera.jpg`, `media/real-06-camera.jpg`) hold the official cover render until Adel's own Luna Ultra photo / firmware shot is dropped in and `render.sh` is re-run. No connected source (Drive, Canva, Lightroom) held one on 2026-09-21.
