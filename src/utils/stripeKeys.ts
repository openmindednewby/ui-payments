const SECRET_KEY_SHAPE = /^(sk|rk)_(test|live)_[A-Za-z0-9]{10,}$/;
const WEBHOOK_SECRET_SHAPE = /^whsec_[A-Za-z0-9+/=]{10,}$/;
const LAST_FOUR = 4;
const MASK_DOTS = '••••';

/** True when the value looks like a Stripe secret or restricted key (`sk_live_...`, `rk_test_...`). */
export function isStripeSecretKeyShape(value: string): boolean {
  return SECRET_KEY_SHAPE.test(value.trim());
}

/** True when the value looks like a Stripe webhook signing secret (`whsec_...`). */
export function isStripeWebhookSecretShape(value: string): boolean {
  return WEBHOOK_SECRET_SHAPE.test(value.trim());
}

/** The last four characters of a key, or an empty string when it is shorter than four. */
export function keyLast4(value: string): string {
  const trimmed = value.trim();
  return trimmed.length < LAST_FOUR ? '' : trimmed.slice(-LAST_FOUR);
}

/** A display mask for a stored key's last four (four dots then the digits), empty when there is none. */
export function maskedKey(last4: string | null | undefined): string {
  const tail = (last4 ?? '').trim();
  return tail === '' ? '' : `${MASK_DOTS}${tail.slice(-LAST_FOUR)}`;
}
