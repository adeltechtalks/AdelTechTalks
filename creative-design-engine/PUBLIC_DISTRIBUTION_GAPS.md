# Public-distribution gaps

The engine is **FINAL APPROVED** for internal use (2026-09-14). These seven gaps are **known and non-blocking** for that approval, and each is what stands between the package and publishing it for other people.

None of them is closed by more design. Each closes with evidence, a decision, or an implementation.

---

| # | Gap | What closes it |
|---|---|---|
| 1 | **No external cold-start test.** It has never been run by anyone but its author, with anyone else's brand profile. | One outside user, their own profile, a real brief — and watching where they get stuck without help. |
| 2 | **No renderer.** It decides and specifies; a human or another tool executes. | Either an execution layer, or a clear statement in the published README that this is a decision system and not a production tool. |
| 3 | **Motion skills documented but not executed.** Roughly half the library specifies motion logic that has never been produced. | Producing at least one of each motion family and recording what the specification got wrong. |
| 4 | **Brand-profile schema is not validated.** A malformed profile fails at use rather than at load, with a confusing error. | A schema validator that runs on load and names the offending field. |
| 5 | **Language coverage tested only for Arabic and English.** Every bidirectional rule was derived from one language pair. | Testing with a CJK and a vertical-script brand; the rules will probably need widening, not just translating. |
| 6 | **The leakage check is a denylist.** `check-generic.mjs` catches the brand values it knows about, not novel ones. | Either an allowlist approach, or a second check that flags any literal hex, font name or capitalised proper noun in the generic tree. |
| 7 | **No licence or attribution decision.** Nothing states how the package may be used, modified or redistributed. | A decision by the owner, then a `LICENSE` file. |

## Honest ordering

If only two were closed before publishing, they should be **7** and **1**: a package without a licence cannot legitimately be used by anyone, and a package never run by an outsider is a package whose first user does the debugging.
