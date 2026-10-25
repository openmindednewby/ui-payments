# @dloizides/ui-payments

Stripe credentials card for the dloizides.com RN-web portals. Generalised from agora-web's
`StripeConnectCard` and kefi-web's `StripeCredentialsSection`.

```tsx
import { StripeCredentialsCard } from '@dloizides/ui-payments';

<StripeCredentialsCard
  connection={{ configured, paymentsEnabled, secretKeyLast4, webhookUrl }}
  labels={labels}
  onSave={(s) => mutateAsync(s)}
  onClear={disconnect}
  onTest={testConnection}
  onCopyWebhookUrl={copy}
/>
```

- No i18n inside: every string, hint and placeholder is a `labels` field.
- Colours come from the `@dloizides/ui-feedback` theme; badges use `@dloizides/theme-web` `badgeColors`.
- Every button is a `@dloizides/ui-buttons` Button (44 px floor at every size).
- `onSave` receives trimmed secrets; `undefined` means keep the stored value. A resolved
  promise clears the typed secrets.

Helpers: `isStripeSecretKeyShape`, `isStripeWebhookSecretShape`, `keyLast4`, `maskedKey`,
`deriveStripeState`, `stripeStateColors`, `canSaveStripeDraft`, `buildStripeSubmission`.
