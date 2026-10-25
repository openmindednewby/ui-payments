# Changelog

## 0.2.0

- Design-critic round 2 (UI-PAY-1 "ui-payments Stripe credentials card"): webhook URL in a bordered field that wraps (Copy beside it when wide, under it when narrow); card bounded to a 640 px column; status pill with a glyph per state; Clear is an outlined danger button behind a `ConfirmDialog`; the payments row is one 48 px `role="switch"` with the 2 px kit focus ring; Save is the only filled control.
- New labels: `clearConfirmTitle`, `clearConfirmMessage`, `clearConfirmAction`, `clearCancel` (required), `keepHelper`, `webhookUrlInstruction` (optional).
- New props: `disabled`, `hideSave`, `onDraftChange` (host-owned save, kefi-web). Create account now shows in every state when `onCreateAccount` is passed.
- Exports `PaymentsSwitchRow`, `DangerOutlineButton`, `dangerInk`, `focusRingColor`.

## 0.1.0

- `StripeCredentialsCard` (labels as props; save, clear, test, copy, create-account callbacks), `StripeStatusHeader`, `WebhookUrlRow`, `useStripeCredentialsDraft`.
- Pure helpers: `isStripeSecretKeyShape`, `isStripeWebhookSecretShape`, `keyLast4`, `maskedKey`, `deriveStripeState`, `stripeStateColors`, `canSaveStripeDraft`, `buildStripeSubmission`, `emptyStripeDraft`.
