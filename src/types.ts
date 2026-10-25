import type { StripeConnectionState } from './StripeConnectionState';

/** What the host knows about the stored Stripe credentials (never the secrets themselves). */
export interface StripeConnectionInfo {
  configured: boolean;
  paymentsEnabled: boolean;
  secretKeyLast4?: string | null;
  webhookUrl?: string | null;
}

/** The editable, never-prefilled form buffer. Blank secret = keep the stored one. */
export interface StripeCredentialsDraft {
  secretKey: string;
  webhookSecret: string;
  paymentsEnabled: boolean;
}

/** What `onSave` receives: trimmed secrets, `undefined` meaning "keep the stored value". */
export interface StripeCredentialsSubmission {
  secretKey?: string;
  webhookSecret?: string;
  paymentsEnabled: boolean;
}

/** Badge colour pair for a connection state. */
export interface StripeStateColors {
  color: string;
  backgroundColor: string;
}

/** Every visible and accessible string, already localized by the host. */
export interface StripeCredentialsLabels {
  states: Record<StripeConnectionState, string>;
  keyMask: (masked: string) => string;
  blurb?: string;
  createAccount: string;
  createAccountHint: string;
  webhookUrl: string;
  webhookCopy: string;
  webhookCopyHint: string;
  secretKey: string;
  secretKeyHint: string;
  secretKeyPlaceholder: string;
  secretKeyKeepPlaceholder: string;
  secretKeyInvalid: string;
  webhookSecret: string;
  webhookSecretHint: string;
  webhookSecretPlaceholder: string;
  webhookSecretKeepPlaceholder: string;
  webhookSecretInvalid: string;
  paymentsEnabled: string;
  paymentsDescription: string;
  paymentsHint: string;
  save: string;
  saveHint: string;
  clear: string;
  clearHint: string;
  test: string;
  testHint: string;
  readOnlyHint?: string;
}

/** Props of `StripeCredentialsCard`. */
export interface StripeCredentialsCardProps {
  connection: StripeConnectionInfo;
  labels: StripeCredentialsLabels;
  onSave: (submission: StripeCredentialsSubmission) => void | Promise<unknown>;
  onClear?: () => void | Promise<unknown>;
  onTest?: () => void | Promise<unknown>;
  onCopyWebhookUrl?: (url: string) => void;
  onCreateAccount?: () => void;
  saving?: boolean;
  clearing?: boolean;
  testing?: boolean;
  readOnly?: boolean;
  error?: string | null;
  testID?: string;
}
