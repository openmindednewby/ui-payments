import { badgeColors, type ColorScale } from '@dloizides/theme-web';

import { StripeConnectionState } from '../StripeConnectionState';
import { isStripeSecretKeyShape, isStripeWebhookSecretShape } from './stripeKeys';

import type { StripeConnectionInfo, StripeCredentialsDraft, StripeCredentialsSubmission, StripeStateColors } from '../types';
import type { UiTheme } from '@dloizides/ui-feedback';

type KitScale = UiTheme['semantic'][string];

const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as const;

function toScale(scale: KitScale | undefined): ColorScale | undefined {
  const shades = SHADES.map((shade) => scale?.[shade]);
  if (shades.some((value) => value === undefined)) return undefined;
  return Object.fromEntries(SHADES.map((shade, i) => [shade, shades[i]])) as unknown as ColorScale;
}

function inertColors(theme: UiTheme): StripeStateColors {
  return { color: theme.colors.textSecondary, backgroundColor: theme.colors.surfaceElevated };
}

/** Map the connection onto its single rendered state. */
export function deriveStripeState(connection: StripeConnectionInfo): StripeConnectionState {
  if (!connection.configured) return StripeConnectionState.NotConnected;
  if (!connection.paymentsEnabled) return StripeConnectionState.PaymentsOff;
  return StripeConnectionState.Live;
}

/** Badge colours per state: Live = success, payments off = warning, not connected = inert. */
export function stripeStateColors(theme: UiTheme, state: StripeConnectionState): StripeStateColors {
  if (state === StripeConnectionState.NotConnected) return inertColors(theme);
  const role = state === StripeConnectionState.Live ? theme.semantic.success : theme.semantic.warning;
  const scale = toScale(role);
  return scale === undefined ? inertColors(theme) : badgeColors(scale);
}

/** The empty draft a form opens with; secrets are never pre-filled. */
export function emptyStripeDraft(connection: StripeConnectionInfo): StripeCredentialsDraft {
  return { secretKey: '', webhookSecret: '', paymentsEnabled: connection.paymentsEnabled };
}

/** True when a typed secret key is blank (keep) or well-shaped. */
export function isSecretKeyAcceptable(value: string): boolean {
  return value.trim() === '' || isStripeSecretKeyShape(value);
}

/** True when a typed webhook secret is blank (keep) or well-shaped. */
export function isWebhookSecretAcceptable(value: string): boolean {
  return value.trim() === '' || isStripeWebhookSecretShape(value);
}

/** Save is allowed when both inputs are acceptable and the draft changes something storable. */
export function canSaveStripeDraft(connection: StripeConnectionInfo, draft: StripeCredentialsDraft): boolean {
  const shapesOk = isSecretKeyAcceptable(draft.secretKey) && isWebhookSecretAcceptable(draft.webhookSecret);
  if (!shapesOk) return false;
  const hasSecret = draft.secretKey.trim() !== '';
  const hasWebhook = draft.webhookSecret.trim() !== '';
  if (!connection.configured) return hasSecret && hasWebhook;
  return hasSecret || hasWebhook || draft.paymentsEnabled !== connection.paymentsEnabled;
}

/** Trim the draft into what `onSave` receives; a blank secret becomes `undefined` (keep). */
export function buildStripeSubmission(draft: StripeCredentialsDraft): StripeCredentialsSubmission {
  const secret = draft.secretKey.trim();
  const webhook = draft.webhookSecret.trim();
  return {
    secretKey: secret === '' ? undefined : secret,
    webhookSecret: webhook === '' ? undefined : webhook,
    paymentsEnabled: draft.paymentsEnabled,
  };
}
