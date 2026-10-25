# Changelog

## 0.4.4

- The save-error reveal scrolls the nearest scroll container (or the window) by exactly what it takes to leave 24 px below the actions (`revealWithMargin`); `scrollIntoView` with `scroll-margin` did not move an RN-web page.

## 0.4.3

- FOCUS-1 "Every screen names its initial focus": when a save error appears the card focuses the error line and scrolls its actions (`<testID>-actions`) into view with 24 px below them (`useFocusOnError`).

## 0.4.2

- Each URL piece between `/` and `.` is kept on one line (`white-space: nowrap`), so the browser no longer breaks after a hyphen in a slug.

## 0.4.1

- The webhook URL breaks only after `/` and `.`; a hyphenated slug (`agora-merchant-a-shop`) stays on one line.
- Tighter card rhythm so Save sits above the fold at 1280x800 in a wizard: the webhook field and both secret fields drop their own bottom margin (the card gap already spaces them) and the card gap is 12 px.

## 0.4.0

- The webhook URL breaks only after `/`, `.`, `?`, `&`, `=`, `_` and `-` (a `<wbr>` after each on web), never mid-word; the copied text is unchanged (`splitUrlForBreaks`).
- New props: `saveVariant` (`outline` when a host such as a wizard already shows the one filled action) and `autoFocus` (focus the secret-key field on mount, FOCUS-1 "Every screen names its initial focus").

## 0.2.1

- The switch row and Disconnect use the shared `useFocusRing` from `@dloizides/ui-buttons` 1.20.1 (the `@dloizides/design-tokens` 1.14 `FOCUS_RING`) instead of a local copy, shown on keyboard focus only; `focusRingColor` delegates to the shared contrast-checked resolver (FOCUS-RING-1 "One focus ring across the shared kit").

## 0.2.0

- Design-critic round 2 (UI-PAY-1 "ui-payments Stripe credentials card"): webhook URL in a bordered field that wraps (Copy beside it when wide, under it when narrow); card bounded to a 640 px column; status pill with a glyph per state; Clear is an outlined danger button behind a `ConfirmDialog`; the payments row is one 48 px `role="switch"` with the 2 px kit focus ring; Save is the only filled control.
- New labels: `clearConfirmTitle`, `clearConfirmMessage`, `clearConfirmAction`, `clearCancel` (required), `keepHelper`, `webhookUrlInstruction` (optional).
- New props: `disabled`, `hideSave`, `onDraftChange` (host-owned save, kefi-web). Create account now shows in every state when `onCreateAccount` is passed.
- Exports `PaymentsSwitchRow`, `DangerOutlineButton`, `dangerInk`, `focusRingColor`.

## 0.1.0

- `StripeCredentialsCard` (labels as props; save, clear, test, copy, create-account callbacks), `StripeStatusHeader`, `WebhookUrlRow`, `useStripeCredentialsDraft`.
- Pure helpers: `isStripeSecretKeyShape`, `isStripeWebhookSecretShape`, `keyLast4`, `maskedKey`, `deriveStripeState`, `stripeStateColors`, `canSaveStripeDraft`, `buildStripeSubmission`, `emptyStripeDraft`.
