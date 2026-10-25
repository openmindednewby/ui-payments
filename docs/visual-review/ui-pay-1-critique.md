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

---

# Round 3 — 2026-10-25

- **Subject:** `StripeCredentialsCard` from `@dloizides/ui-payments` 0.2.1, live at https://ui.dloizides.com/payments (showcase `ac12a54`)
- **States judged:** Not connected, filled (valid keys, Save enabled), invalid key, Live, Payments off (320 px host), Read-only, Error, Disconnect confirm open, keyboard focus on every card control, and **dark theme** (first time rendered) for Not connected / Live / Read-only / Error
- **Viewports:** 360x640 (Pixel 5 descriptor, touch) and 1280x800, Chromium via Playwright; scripted text-fit, hit boxes, Tab walk with computed ring per stop, dialog name / size / trap / Escape, computed colours in dark
- **Captures:** session scratchpad `r3/` (`m360-*.png`, `d1280-*.png`: full page, one per story, `-filled`, `-invalid`, `-focus-0..9`, `-dialog`, `-dialog-el`, `-dark-*`) and `r3/res.json` (all measurements)

## Verdict: FAILED — ESCALATE stands (third round on the same option)

Mean 3.75 (30/8), lowest **#3 = 2**. The card's own round 2 fix landed (one focus ring); the dialog fix was
published but never reached the showcase; and rendering dark mode for the first time exposed a new blocker:
the danger ink and the outline-button labels are near-invisible on the dark card.

## Did round 2's fixes land?

| Round 2 fix | Round 3 measurement | Landed |
|---|---|---|
| ConfirmDialog buttons ≥ 44, `aria-labelledby` (ui-feedback) | Live dialog still **Keep connected 144x41, Disconnect 110x41**, `aria-label` and `aria-labelledby` both null, browser `outline: auto 1px` ring (orange at 360, black at 1280). Cause: `@dloizides/ui-feedback` **1.16.2 is on npm** (source has `minHeight: MIN_TOUCH_TARGET` ConfirmDialog.tsx:57 and `aria-labelledby` :129) but the showcase lock still resolves **1.16.1** (`apps/ui-showcase/package.json:43` `^1.16.1`, package-lock `version 1.16.1`) | **no (not deployed)** |
| One focus ring in the card (ui-buttons + ui-forms + ui-payments) | Every card stop: Create account, Copy, both inputs, switch row, Save, Test, Disconnect = `solid 2px rgb(79,91,147) offset 2px`, box-shadow none; the 3 px input halo is gone | **yes** |
| Keep helper 8 px under the inputs | input → helper still **32 px** (input → input 53 px); helper still floats | no |
| Read-only inputs get the muted fill | read-only input `bg rgb(255,255,255)`, border `rgb(217,221,228)`, identical to editable (dark: both `rgb(36,40,51)`) | no |

## Measurements

| Check | 360x640 | 1280x800 |
|---|---|---|
| Horizontal page scroll | none (360) | none (1280) |
| Text fit: all 5 stories, filled, invalid, dialog, dark | 0 clip / 0 spill | 0 / 0 |
| Card hit boxes | all ≥ 44 (Create 159x44, Copy 230x48, inputs 230x48, switch row 230x72, Save 230x48, Test 100x48, Disconnect 109x48) | all ≥ 44 (inputs 640x48, switch 640x55) |
| Save enabled (valid sk_live + whsec) | filled indigo, full width, single fill on card | 100x48, first in row |
| Invalid key (`pk_wrong`) | Save stays disabled; inline "Expected a key starting with sk_ or rk_" in a live region | same |
| Dialog behaviour | initial focus Keep connected (FOCUS-1 ok), Tab trapped between the two, Escape closes, focus returns to card Disconnect | same |
| **Dark: error line** | `rgb(102,21,13)` on card ~`rgb(28,31,38)` ≈ **1.3:1** (needs 4.5) | same |
| **Dark: Disconnect label + border** | same dark-red ink ≈ **1.3:1**, reads as an empty box | same |
| **Dark: Copy / Test labels** | indigo `rgb(79,91,147)`-range ink on dark ≈ 2.5:1 (estimated from the capture, not computed) | same |
| Console errors | 0 | 0 |

Capture note: the 360 element captures include the sticky showcase header over the top of tall cards; the full-page and in-viewport captures were used for judgement.

## Score sheet

| # | Criterion | Score | Evidence |
|---|---|---|---|
| 1 | Focal point / purpose | 4 | Status pill reads first; with valid keys Save becomes the one filled control and the obvious next step. |
| 2 | Portability | 3 | Unchanged: Stripe content in a stock stacked form. |
| 3 | Hierarchy, type, spacing, colour | **2** | Light theme is a 4, but dark theme fails colour outright: error line and Disconnect ≈ 1.3:1, Copy/Test ≈ 2.5:1. Keep helper still detached (32 px). |
| 4 | Visual language | 4 | R8 passes inside the card (one 2 px kit ring on every stop). Dialog still uses the browser ring until 1.16.2 ships in the showcase. |
| 5 | Taste ledger | 4 | No ledger file; calm, one accent, outlined danger. |
| 6 | AI-default tells | 5 | None. |
| 7 | Mobile + desktop, text fit | 3 | Text fits in every state at both viewports, both themes; confirm dialog buttons still 41 px high at 360 (deployed 1.16.1). Read-only inputs indistinguishable from editable. |
| 8 | Inventory vs agora-web base | 5 | 10/10 base items sighted again, plus filled and invalid states. |
| 9 | Games only | n/a | |

**Mean:** 30 / 8 = 3.75 · **Lowest:** #3 = 2

## Top fixes

1. **ui-payments `dangerInk` is theme-blind** (`src/utils/kitColors.ts:10-13` always returns error 700): pick the step that clears 4.5:1 against the actual card surface (dark: a light error step such as 300/400), used by the error line (`StripeCredentialsCard.tsx:98`) and `DangerOutlineButton.tsx:49`. Check the outline-button label ink in dark too; if it is the ui-buttons outline variant, fix it in `@dloizides/ui-buttons`, not here.
2. **Showcase: take `@dloizides/ui-feedback` 1.16.2** (`apps/ui-showcase/package.json:43` + lockfile) and redeploy, so the live dialog gets 44 px buttons and `aria-labelledby`; confirm its ring is the kit 2 px ring, not `outline: auto`.
3. **ui-payments local:** keep helper 8 px under the second secret input (`SecretFields.tsx:71`), and read-only inputs on the kit's muted surface in both themes.

With 1 and 2 shipped, #3 and #7 go to 4 and the mean to 4.0 (PASS bar met, every criterion ≥ 3); fix 3 lifts it above.

## Not covered

Real devices not used (Chromium emulation only); screen-reader output not run; motion and press feedback not judged from stills; dark theme judged for 4 of 5 stories (Payments off not captured dark) and the dialog not opened in dark; Copy/Test dark contrast is an estimate from the capture, not a computed ratio; `vf_measure.py` not run; no taste ledger exists for ui-payments.

# Round 4 — 2026-10-25

- **Subject:** `StripeCredentialsCard` (ui-payments, local: `dangerInk` via `readableScaleInk`, 4 px Keep helper), plus the fleet-wide changes it pulls: `@dloizides/ui-buttons` 1.21.0 (`readableScaleInk`), `@dloizides/ui-forms` 1.19.0 (read-only style), `@dloizides/ui-feedback` 1.16.2 (ConfirmDialog). Local showcase build, not ui.dloizides.com.
- **Surfaces judged:** payments card (Not connected, filled, invalid, Live, Payments off, Read-only, Error), Disconnect confirm dialog, showcase Buttons page, showcase Forms page; light + dark; 360x640 (Pixel 5) and 1280x800.
- **Captures:** session scratchpad `r4/` (44 PNGs + `report.json`). Contrast computed from capture pixels (WCAG relative luminance; ink = pixel farthest from the dominant fill in the label box).

## Verdict: FAILED — card PASS, dialog and Forms REDO

The card's round 3 blockers are gone; ESCALATE on the card is lifted. Rendering the dialog in dark for the first time
exposes a new blocker in `@dloizides/ui-feedback`, and the Forms page shows the same theme-blind error ink that
ui-payments just fixed, still live in `@dloizides/ui-forms` for all 7 portals.

## Did round 3's fixes land?

| Round 3 fix | Round 4 measurement | Landed |
|---|---|---|
| ui-payments `dangerInk` theme-aware | `kitColors.ts:13` now `readableScaleInk(error, surface, 700/600/500, 300/200/400/…)`. Dark error line `rgb(225,106,94)` on `rgb(28,31,38)` = **5.05:1** (was 1.3); light `rgb(102,21,13)` on white = 12.5:1 | **yes** |
| Outline label ink in dark (ui-buttons) | Copy / outline sm+md+lg label `rgb(148,156,192)` on `rgb(28,31,38)` = **6.11:1** (was ~2.5); light outline 6.46:1, primary 6.46:1 both themes | **yes** |
| Showcase takes ui-feedback 1.16.2 | Dialog Disconnect fill 110x**44** at 1280, initial focus Keep connected | **yes** |
| Keep helper under second input | helper sits ~4 px under the Webhook signing secret input (both themes) | **yes** |
| Read-only inputs on the muted surface | dark read-only `rgb(20,22,27)` vs editable `rgb(36,40,51)` (clear); light `rgb(247,248,250)` vs white (faint, 1.07:1, but present) | **yes** |

## New blockers

| # | Where | Measurement | Owner |
|---|---|---|---|
| B1 | Dark ConfirmDialog confirm label | Label ink `rgb(36,40,51)` (= `surfaceElevated`) on fill `rgb(174,32,18)` (= error 500) = **2.13:1** at 360 and 1280. Not dark-red on red: the label is painted with the dark dialog surface colour. Light is 6.97:1 (white on red). The non-destructive confirm (`primary 500` fill) gets the same dark-surface ink in dark. | **`@dloizides/ui-feedback`** `src/ConfirmDialog/ConfirmDialog.tsx:113` (`confirmButtonText: { color: theme.colors.surfaceElevated }`) and `:179` (spinner colour). Fix: an on-fill ink (white / `readableScaleInk` against the fill), not the surface token. |
| B2 | Forms page, dark: FormField / ThemedTextInput error helper + border | `rgb(174,32,24)` on `rgb(28,31,38)` = **2.37:1** (text needs 4.5, border needs 3). Light 6.97:1. Fleet-wide: every portal's form errors in dark. | **`@dloizides/ui-forms`** `Field/Field.tsx:213`, `useThemedInput/useThemedInput.ts:141`, `TypeaheadControl/TypeaheadControl.tsx:126` (all `semantic.error['500']`, theme-blind). Fix: the same `readableScaleInk` call ui-payments now uses. |

## Measurements

| Check | 360x640 | 1280x800 |
|---|---|---|
| Horizontal page scroll | none, every page, both themes | none |
| `report.json` spill probe | buttons 21, payments 15, dialog 15, forms 0 (identical at both viewports, both themes) | same |
| Visible clipping in captures | none seen | none seen |
| Placeholder ink, dark | 3.22-3.57:1 (advisory; placeholders are not labels here) | same |
| Console | 3x "unsupported MIME type ('text/html')" script errors on every page (local build artefact, unattributed) | same |

The spill probe counts any text node with `scrollWidth > clientWidth` and non-visible overflow; it does not name the
elements, and RN-web `Text` defaults to `overflow: hidden`, so the counts are unattributed, not proof of clipping.

## Score sheet

| # | Criterion | Card | Dialog | Buttons page | Forms page |
|---|---|---|---|---|---|
| 1 | Focal point | 4 | 4 | n/a | n/a |
| 2 | Portability | 3 | 3 | n/a | n/a |
| 3 | Hierarchy, type, colour | 4 (dark colour fixed) | **2** (B1, 2.13:1 on the destructive action) | 4 | **2** (B2, 2.37:1) |
| 4 | Visual language | 4 | 4 | 4 | 4 |
| 5 | Taste ledger | 4 (no ledger file) | 4 | 4 | 4 |
| 6 | AI-default tells | 5 | 5 | 5 | 5 |
| 7 | Mobile + desktop, text fit | 3 (no visible clip; spill probe unattributed) | 4 (44 px buttons) | 3 (spill 21 unattributed) | 4 |
| 8 | Inventory vs agora-web base | 5 (10/10 + filled, invalid) | n/a | n/a | n/a |
| | **Mean / verdict** | **32/8 = 4.0 PASS** | 26/7 = 3.7 **REDO** | 20/5 = 4.0 PASS | 19/5 = 3.8 **REDO** |

## Top fixes

1. **ui-feedback** `ConfirmDialog.tsx:113` + `:179`: confirm label and spinner ink = an on-fill colour that clears 4.5:1 on `error 500` / `primary 500` in both themes (white gives 6.97:1 / 6.46:1). Add a dark-theme contrast test.
2. **ui-forms** `Field.tsx:213`, `useThemedInput.ts:141`, `TypeaheadControl.tsx:126`: error ink via `readableScaleInk(error, surface, …)` as ui-payments does; dark target ≥ 4.5:1 text, ≥ 3:1 border.
3. **Showcase capture script:** make the spill probe print the offending element's text and testID, so #7 can go to 4 on evidence.

## Not covered

Card Disconnect outline in dark not sighted (every dark Live/Read-only element capture cuts off above it; inferred
fixed because it calls the same `dangerInk` as the 5.05:1 error line); dark dialog focus ring not captured; Payments off
dark judged from the full-page capture only; spill-probe elements unidentified; console MIME errors not traced;
real devices and screen reader not used; motion not judged from stills; `vf_measure.py` not run; no taste ledger
exists for ui-payments; captures are a local build, not the deployed showcase.

# Round 5 — 2026-10-25

- **Subject:** round 4 REDOs: Disconnect ConfirmDialog (`@dloizides/ui-feedback` `confirmDialogColors`) and the showcase Forms page error ink (`@dloizides/ui-forms` `fieldErrorInk`, both built on `@dloizides/design-tokens` `readableScaleInk`); card and Buttons page re-checked. Local showcase from unpublished builds, not ui.dloizides.com.
- **Captures:** session scratchpad `r5/` (44 PNGs + `report.json`), light + dark, 360x640 (Pixel 5, 990x1760 device px) and 1280x800.
- **Method:** ratios recomputed by the critic from capture pixels (WCAG relative luminance; fill = modal pixel in the label box, ink = the pixel farthest from it in luminance), independently of `report.json`. Every value matched the report.

## Verdict: PASSED — dialog and Forms REDO cleared; card and Buttons still PASS

## Did round 4's blockers land?

| Blocker | Round 5 pixel measurement | Landed |
|---|---|---|
| B1 dark ConfirmDialog label | Disconnect label `rgb(255,255,255)` on `rgb(174,32,18)` = **6.97:1** at 1280 dark and 360 dark (was 2.13); light 6.97:1 | **yes** |
| B2 dark Forms error text + border | helper `rgb(225,106,94)` on card `rgb(28,31,38)` = **5.05:1** (was 2.37); border 1 device px of the same ink, ≈ 4.6:1 against the input fill `rgb(36,40,51)` (≥ 3:1); light 6.97:1 | **yes** |

## Re-check: card and Buttons page

| Element | Dark | Light |
|---|---|---|
| Card Disconnect outline label (first dark sighting; was NOT COVERED in round 4) | 5.05:1 | from round 4, unchanged |
| Card Copy / Test labels | 6.11:1 | 6.46:1 (round 4) |
| Buttons primary md | 6.46:1 | 6.46:1 |
| Buttons outline md | 6.11:1 | 6.46:1 |
| Buttons secondary md | 14.98:1 | n/a |

No regression. Horizontal scroll: none on any page, theme or viewport. Spill probe unchanged (buttons 21, payments 15, dialog 15, forms 0) and still unattributed. Dialog initial focus = Keep connected (FOCUS-1: safe action, not destructive) in all four runs. Console: the same 3x "unsupported MIME type ('text/html')" script errors per page as round 4, still untraced.

Non-text note (advisory, not scored down): the destructive fill `rgb(174,32,18)` against the dark dialog surface `rgb(36,40,51)` is 2.13:1. WCAG 1.4.11 does not require a button's boundary when its label identifies it, and the white label carries it; the red still reads as the one strong element in the dialog.

## Score sheet

| # | Criterion | Card | Dialog | Buttons page | Forms page |
|---|---|---|---|---|---|
| 1 | Focal point | 4 | 4 | n/a | n/a |
| 2 | Portability | 3 | 3 | n/a | n/a |
| 3 | Hierarchy, type, colour | 4 | **4** (B1 fixed, 6.97:1 both themes) | 4 | **4** (B2 fixed, 5.05:1) |
| 4 | Visual language | 4 | 4 | 4 | 4 |
| 5 | Taste ledger | 4 (no ledger file) | 4 | 4 | 4 |
| 6 | AI-default tells | 5 | 5 | 5 | 5 |
| 7 | Mobile + desktop, text fit | 3 (spill unattributed) | 4 | 3 (spill 21 unattributed) | 4 |
| 8 | Inventory vs agora-web base | 5 | n/a | n/a | n/a |
| | **Mean / verdict** | **32/8 = 4.0 PASS** | **28/7 = 4.0 PASS** | **20/5 = 4.0 PASS** | **21/5 = 4.2 PASS** |

## Top fixes (none blocking)

1. **Showcase capture script:** print the text + testID of every spill-probe hit, so #7 on card and Buttons can move to 4 on evidence.
2. **Trace the 3 console MIME errors** (a script URL served as `index.html`) before the showcase deploy; if they survive on ui.dloizides.com they are a real defect.
3. **Publish the four packages through `publish.ps1` and re-sight on ui.dloizides.com**: this round judged an unpublished local build.

## Not covered

Captures are a local build of unpublished design-tokens / ui-buttons / ui-forms / ui-feedback / ui-payments, not the deployed showcase; dark dialog focus ring not captured; spill-probe elements unidentified; console MIME errors untraced; Typeahead error state (`TypeaheadControl`) not rendered in any capture; Forms error border ratio computed from a single device-pixel row; real devices and screen reader not used; motion not judged from stills; `vf_measure.py` not run; no taste ledger exists for ui-payments.
