# UI-PAY-1 "ui-payments Stripe credentials card" — design critique, round 1

- **Date:** 2026-10-25 · **Critic:** design-critic · **Round:** 1
- **Subject:** `StripeCredentialsCard` from `@dloizides/ui-payments` 0.1.0, live at https://ui.dloizides.com/payments
- **States judged:** Not connected (card 1), Live with payments on (card 2)
- **Viewports:** 360x640 (Pixel 5 descriptor, touch, DPR 1.5) and 1280x800, Chromium via Playwright, light theme (System)
- **Base it replaces:** `agora-web/src/features/shop/components/StripeConnectCard.tsx`
- **Taste ledger:** none exists for ui-payments or ui-showcase; scored against `user_design_taste.md` (calm back office) only

## Verdict: REDO

Mean 2.75, criterion 7 scored 1 (text overflows its box at 360x640). Fails the bar on three counts:
a criterion at 1, mean below 4, criteria 3 and 4 below 3.

## Measurements

| Check | 360x640 | 1280x800 |
|---|---|---|
| Horizontal page scroll | none (scrollWidth 360) | none |
| Webhook URL text box vs card edge | text right edge **467 px, card right edge 312 px**: URL runs out of the card and is clipped mid-word (`.../api/st`) | fits (413 px wide) |
| Placeholder "Leave blank to keep the stored value" (Live) | clipped to "Leave blank to keep the stored va" in both inputs | fits |
| Buttons Save / Test / Clear | 100x48 each, Clear wraps alone onto a second row | 100x48, one row |
| Copy | 100x44 | 100x44 |
| Create a Stripe account | 230x44 | **1150x44** (stretched across the card) |
| Secret inputs | 230x48 | **1150x48** |
| Card-payments switch (`input[role=switch]`) | **40x20**; the 230x53 row around it has tabIndex -1, row press not verified | **40x20** |
| Focus order (Tab from section heading) | Create account, Copy, Secret key, Webhook secret, switch, [Save skipped while disabled], then card 2: Copy, Secret, Webhook secret, switch, Test, Clear | same | 
| Focus ring styles in the card | 3: browser default `outline: auto 1px` on buttons and switch, `box-shadow` on inputs, kit `2px solid rgb(79,91,147)` on the showcase chrome | same |
| Console errors | 0 | 0 |

Status marks: "Not connected" is 12 px grey text on a white pill inside a white card (no visible badge
shape, no glyph); "Live" is teal text on a teal tint (no glyph). Accents in view: indigo (Copy/Test
outline, disabled Save fill), teal (Live pill, switch), red (Clear, solid fill).

## Score sheet

| # | Criterion | Score | Evidence |
|---|---|---|---|
| 1 | Focal point / purpose | 3 | Purpose clear from the blurb; no single focal point: Save is pale-disabled, status badge is the weakest mark on the card, filled red Clear is the loudest thing in the Live state. |
| 2 | Portability | 3 | Stripe-specific fields (sk_live, whsec, webhook URL) make it this flow, but the layout is a stock stacked form with nothing of the fleet's marks. |
| 3 | Hierarchy, type, spacing | 2 | Uneven rhythm (URL row to Copy ~40 px, label to input ~12 px, input to next label ~40 px); fixed-width 100 px buttons wrap Clear to its own row at 360; desktop stretches inputs and the Create button to 1150 px. |
| 4 | Visual language | 2 | R8 fails: 3 focus-ring styles and 2 filled buttons in the Live view (Save + solid-red Clear). Mood fails: three accent hues (indigo, teal, red) in one card. R7 partial: status has a word but no glyph. R2/R5 pass (flat card, hairline only). |
| 5 | Taste ledger | 3 | No ledger rows to violate; the solid red Clear and teal/indigo mix sit against the owner's "calm back office" taste. |
| 6 | AI-default tells | 5 | None: no violet ramps, no 135deg gradients, no emoji, no hero/cards skeleton. |
| 7 | Mobile + desktop designed, text fits | **1** | TEXT-FIT-1 breach: webhook URL overflows the card at 360x640 (467 vs 312 px) and both Live placeholders clip. VIEWPORT-1 breach: desktop is the phone column stretched to 1150 px, not a designed view. |
| 8 | Inventory vs agora-web base | 3 | 8/10 base items visible (status header, blurb, Create account, secret, webhook secret, payments switch, Save, Disconnect shown as "Clear") plus new webhook URL, Test, masked key. Read-only state and the error line exist in code (`readOnly` prop, StripeCredentialsCard.tsx:38) but no showcase story renders them, so they are unsighted. "Disconnect" was renamed "Clear" without a recorded decision. |
| 9 | Games only | n/a | |

**Mean:** 22 / 8 = 2.75 · **Lowest:** #7 = 1

## Top fixes (in order)

1. **Make every text fit at 360.** Give the webhook URL `overflow-wrap: anywhere` (or `word-break: break-all`) inside a bordered read-only field that is the card's width, Copy beside it at desktop and full-width under it on mobile. Shorten the Live placeholders to "Leave blank to keep" and move "the stored value is kept" into helper text under the label.
2. **One chrome language (R8, mood).** Clear becomes an outlined danger button (red text, 1 px border) behind a confirm, so Save is the only filled control; all controls in the card use the kit's single 2 px focus ring (inputs and switch included); make the whole switch row the press target so the hit box is at least 44x44, not the 40x20 thumb.
3. **Design the desktop view.** Bound the card content to a ~640 px column (inputs about 560 px), Create a Stripe account at its natural width as a secondary button, Save / Test / Clear on one row with Save first; give both status badges a glyph plus a tint ("Not connected" neutral grey tint + dot, "Live" tick) so status reads before the blurb.

Add showcase stories for the read-only and error states so criterion 8 can be ticked next round.

## Not covered

Dark theme not rendered; real devices not used (Chromium emulation only); motion and press feedback not judged from stills; switch-row press target not exercised; read-only and error states not rendered by the showcase; initial focus (FOCUS-1) not judged because the card is embedded, not a screen; `vf_measure.py` saturation/value numbers not run (judged from computed colours).
