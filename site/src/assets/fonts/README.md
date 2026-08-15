# Fonts

## KOGhorab-Regular.woff2 — PENDING

The approved Arabic display typeface is **KO Ghorab / Ghorab Typeface (Kotype)**.

Drop the licensed file here, named exactly:

    KOGhorab-Regular.woff2

Nothing else needs to change. `src/components/ArabicDisplayFont.astro` picks it
up at build time, fingerprints it, and Arabic display text switches from the
Cairo fallback to Ghorab. Until the file exists, no `@font-face` is emitted and
no request is made for a file that is not there.

No font file has been fabricated or redistributed. Do not substitute another
display family for Ghorab — per the brief, the token and the staged
implementation stay in place until the licensed asset arrives.
