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

---

# Round 2 — 2026-10-25

- **Subject:** `StripeCredentialsCard` from `@dloizides/ui-payments` 0.2.0, live at https://ui.dloizides.com/payments
- **States judged:** all 5 showcase stories (Not connected, Live, Payments off in a 320 px host, Read-only, Error) + the Disconnect confirm dialog open
- **Viewports:** 360x640 (Pixel 5 descriptor, touch) and 1280x800, Chromium via Playwright, light theme; scripted text-fit, hit-box, Tab walk, Space/Enter, dialog focus trap and Escape

## Verdict: FAILED — ESCALATE (second REDO on the same option)

Mean 3.88 (31/8), lowest 3 (#2, #4, #7). Every criterion is now ≥ 3 and nothing scores 1, so the round 1
blockers are gone; the mean is held under 4 by two defects that live in **shared packages**, not in
ui-payments. Per the critic rule (two REDO rounds → ESCALATE) the owner decides whether to ship 0.2.0
with the two package fixes logged as follow-ups, or hold it.

## Did round 1's fixes land?

| Round 1 fix | Round 2 measurement | Landed |
|---|---|---|
| Webhook URL fits at 360 | URL wraps inside a bordered mono field, 0 text overflows in all 5 states at both viewports (the only probe hits are the 1 px visually-hidden accessibility hints) | yes |
| Short keep placeholders + helper | "Leave blank to keep" 123 px in a 204 px box; helper "A blank field keeps the stored value." under the fields | yes |
| Clear = outlined danger behind a confirm | "Disconnect" 109x48, 1 px dark-red border, no fill; opens a `role=dialog aria-modal` confirm. Save is the only filled control. Label is back to "Disconnect" (base wording) | yes |
| One 2 px kit focus ring everywhere | **No.** 3 ring styles measured, see below | partial |
| Switch row ≥ 44x44 | whole row is the `role=switch`: 230x72 at 360, 640x55 at 1280; Space toggles (true→false), Enter toggles, page does not scroll | yes |
| Designed desktop | 640 px column; inputs 640; Create a Stripe account 159x44 natural width; URL + Copy on one row; Save / Test / Disconnect on one row, Save first | yes |
| Status glyph + tint | Not connected: grey dot + outlined pill; Live: tick on teal tint; Payments off: pause bars on sand tint | yes |
| Read-only + error stories | both rendered; read-only locks switch/Save/Test/Disconnect (tabIndex -1, opacity .5), inputs `readOnly` (typing yields ""), Copy stays live; error line sits above the actions | yes |

## Measurements

| Check | 360x640 | 1280x800 |
|---|---|---|
| Horizontal page scroll | none (scrollWidth 360) | none |
| Text fit, 5 states + dialog | 0 overflows | 0 overflows |
| Card controls | all ≥ 44 high (Copy 230x48, inputs 230x48, Test 100x48, Disconnect 109x48, switch row 230x72) | all ≥ 44 |
| **Confirm dialog buttons** | **Keep connected 144x41, Disconnect 110x41 — 3 px under 44** | 144x41, 110x41 |
| Dialog behaviour | initial focus on "Keep connected" (non-destructive, FOCUS-1 ok); Tab cycles only the two buttons (trapped); Escape closes and returns focus to the card's Disconnect | same |
| Dialog accessible name | **none** (`aria-label` and `aria-labelledby` both absent; title "Disconnect Stripe?" is not wired) | same |
| Tab order per card | Create account → Copy → Secret key → Webhook secret → switch → [Save skipped while disabled] → Test → Disconnect; read-only card: Copy → 2 read-only inputs only | same |
| Focus ring styles | **3:** browser default `outline: auto 1px` on Create/Copy/Test and both dialog buttons (`@dloizides/ui-buttons`, ui-feedback); indigo border + 3 px 16% halo on inputs (`@dloizides/ui-forms`); kit `2px solid rgb(79,91,147)` offset 2 on switch and Disconnect (ui-payments' own `useFocusRing`) | same |
| Console errors | 0 | 0 |

## Score sheet

| # | Criterion | Score | Evidence |
|---|---|---|---|
| 1 | Focal point / purpose | 4 | Status pill with glyph reads first, then the blurb; Save is the single fill. The disabled Save is pale, so a first-time user's eye still lands on the inputs rather than a goal. |
| 2 | Portability | 3 | Stripe-specific content (masked key, whsec, webhook URL field in mono) but the frame is a stock stacked form; nothing a competitor's settings page would not have. Acceptable for a back-office card. |
| 3 | Hierarchy, type, spacing | 4 | Desktop rows and the 640 column read well. Rhythm still uneven: label→input ~10 px, input→next label ~40 px, and the keep helper floats ~40 px below the second input, detached from the fields it explains. |
| 4 | Visual language | 3 | R8 still fails: 3 focus-ring styles in one card (above). Mood passes now: one fill, outlined danger, teal/sand only on status pills, switch moved to the indigo accent. R7 passes (glyph + word). |
| 5 | Taste ledger | 4 | No ledger file for ui-payments; against `user_design_taste.md` the card is now calm (no solid red, one accent). |
| 6 | AI-default tells | 5 | None. |
| 7 | Mobile + desktop, text fit | 3 | TEXT-FIT-1 passes in all 5 states and the dialog at both viewports; desktop is designed. Fails the 44x44 floor on the confirm dialog's two buttons (41 px high) at 360. Read-only inputs look identical to editable ones (white fill, same border). |
| 8 | Inventory vs agora-web base | 5 | 10/10 base items sighted: status header, blurb, Create account, secret, webhook secret, payments switch, Save, Disconnect (name restored), read-only state, error line; plus webhook URL, Test, masked key. |
| 9 | Games only | n/a | |

**Mean:** 31 / 8 = 3.88 · **Lowest:** #2 = 3, #4 = 3, #7 = 3

## Does the two-focus-ring claim block?

The designer's count is wrong: there are **3** ring styles, not 2 (ui-buttons browser default, ui-forms
halo, ui-payments' own 2 px kit ring). On its own it does not block: every ring is visible, so it is an
R8 consistency defect (criterion 4 = 3), not an accessibility failure. It is one of the two things
keeping the mean under 4. The fix belongs in the packages (fix in the PACKAGE, not the app): ui-buttons
and ui-forms adopt the kit 2 px ring; ui-payments must **not** override them locally, which would
create a fourth style in every other portal.

## Top fixes

1. **`@dloizides/ui-feedback` ConfirmDialog:** button min-height 44 (now 41) and wire `aria-labelledby` to the title. Package fix, all portals benefit.
2. **`@dloizides/ui-buttons` + `@dloizides/ui-forms`:** one focus ring, the kit `2px solid` accent with 2 px offset, replacing `outline: auto` and the 3 px halo; then ui-payments drops `useFocusRing` for the shared one.
3. **ui-payments (local, small):** move "A blank field keeps the stored value." up to 8 px under the secret inputs, and give read-only inputs the kit's muted fill so they read as locked.

With fixes 1 and 2 shipped in their packages, #4 and #7 go to 4 and the mean to 4.13 (PASS).

## Not covered

Dark theme not rendered; real devices not used (Chromium emulation only); motion and press feedback not
judged from stills; Save never seen enabled (every story keeps it disabled, so the filled-primary look
was judged from its disabled tint); screen-reader output not run; `vf_measure.py` not run.
