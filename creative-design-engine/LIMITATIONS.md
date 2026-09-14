# Limitations

Stated plainly, because a system that hides its edges gets trusted in the places it should not be.

---

## It does not render

It decides and specifies. Producing the artwork is a separate step in a design tool, a renderer, or by hand. Nothing here outputs a file.

## It is only as honest as the asset manifest

The single rule holding the system together is *never invent media availability*, and it depends entirely on the manifest being accurate. A manifest claiming a product photograph that does not exist produces a confident, unbuildable direction.

## It cannot judge photographic quality

It reads the `quality` and `notes` fields and trusts them. It cannot tell a sharp macro from a soft crop, or a strong portrait from a flat one. Those notes are a human's job.

## Motion skills are documented, not implemented

Roughly half the library is motion. The motion logic is specified; no renderer, template or timeline is produced. Treat motion entries as briefs for an editor.

## Its taste is a set of rules, not taste

Rules like *one primary skill per scene* and *no panel behind text* encode good defaults. They are not equivalent to a designer's judgement, and a skilled designer will sometimes be right to break them. The engine cannot tell when that moment has arrived.

## Platform values are only as current as the profile

Platform canvases and reserves change. The engine has no way to notice. Anything not measured should be marked derived and validation-required in the profile, and re-checked periodically.

## It does not know what already exists

It has no memory of previous work, so it cannot tell you that a direction resembles last week's. Repetition across a channel is a human's job to spot.

## It cannot verify claims

If a brief says a product is faster, the engine will design a proof composition. It has no way to know whether the claim is true.

## Language support is declared, not verified

Script coverage comes from the profile's `scripts` fields. If a sketch face is declared as supporting a script it does not actually cover, the engine will propose handwriting that silently falls back. Verify faces with real copy once, then declare.

## It will not tell you the idea is bad

It works within the brief. A well-executed direction for a piece that should not be made is still a well-executed direction.
