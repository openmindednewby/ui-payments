# Critique: ui-payments webhook URL wrap (0.4.4 -> 0.4.5), round 1

Date: 2026-10-25. Tier: style-only (DESIGN-TIER-1 "Two-tier design process"), one round.
Judged from the 8 PNG captures + `measure.json` in this folder. Placeholder labels (`blurb`,
`secretKeyKeepPlaceholder`, `save`/`test`/`clear`) are a harness artefact and were not scored.

## What the pixels show

| Capture | Before | After |
|---|---|---|
| connected 360x640 | UUID line `65adb9d4-...-95a3923a880c` runs past the field's right border (overflowPx 46, textRight 332 > boxRight 298) | 5 lines, last glyph at 282 < 298; UUID splits `...-95a39` / `23a880c` |
| not-connected 360x640 | same 46px overflow | same as connected after, no overflow |
| connected 1280x800 | 2 lines, break after `stripe/` | pixel-identical layout: 2 lines, same break, Copy beside the field |
| not-connected 1280x800 | 2 lines | 2 lines, unchanged |

Breaks at 360: `dloizides.` / `com/bff/payments/webhooks/` / `stripe/` / UUID. Every soft break lands
after `.` or `/`, as asked. The UUID is wider than 236px on its own, so a mid-token break is the only
way to fit it; it breaks only there. The field grows one line (40px at 2x) and pushes the rest down
evenly; no clipping, no horizontal scroll (docScrollX 0 in all 8).

## Scores (1-5)

| # | Criterion | Score | Evidence |
|---|---|---|---|
| 1 | Focal point / purpose | 4 | URL field + Copy still the clear block of the card at both widths |
| 2 | Portability | 3 | Stock settings form; not changed by this fix, not in its scope |
| 3 | Hierarchy, type, spacing | 4 | Monospace, padding and line height unchanged; extra line keeps the same rhythm |
| 4 | Visual-language rules | 4 | No new colour, shape or token; border and radius identical to before |
| 5 | Taste ledger | 4 | Ledger not read for ui-payments (none supplied); nothing here contradicts calm/plain |
| 6 | No AI-default tells | 5 | None |
| 7 | Mobile + desktop, text fits | 4 | 0px overflow in all 4 after states; desktop unchanged; UUID split is at an arbitrary char, not a hyphen |
| 8 | Inventory | n/a | Style-only, nothing added/moved/removed (same elements in every before/after pair) |
| 9 | Game | n/a | |

Mean 4.0, lowest #2=3. **PASS.**

## Top fixes (optional, not blocking)

1. Let the UUID break at its hyphens before any character (e.g. a `<wbr>`/zero-width break after
   each `-`), so 360 reads `65adb9d4-47f1-4425-a7bf-` / `95a3923a880c` instead of `...-95a39` /
   `23a880c`; easier to compare against the Stripe dashboard by eye.
2. Confirm Copy still copies the URL without any inserted break characters if fix 1 is done.

## NOT COVERED

Dark mode not rendered; widths between 360 and 1280 (e.g. 768, where the side-by-side Copy may
squeeze the field) not captured; a longer or shorter host than `app.kefi.dloizides.com` not tried;
real device and font fallback not used; Copy behaviour not judged from stills.
