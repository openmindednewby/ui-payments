import { StripeConnectionState } from '../StripeConnectionState';
import {
  buildStripeSubmission,
  canSaveStripeDraft,
  deriveStripeState,
  emptyStripeDraft,
  stripeStateColors,
} from './stripeConnection';

import type { UiTheme } from '@dloizides/ui-feedback';

const SAMPLE_KEY = ['sk', 'test', 'abcdefghij4242'].join('_');
const SAMPLE_SIGNING = ['whsec', 'abcdefghijklmn'].join('_');

function scale(prefix: string): Record<string, string> {
  return {
    '50': `${prefix}50`, '100': `${prefix}100`, '200': `${prefix}200`, '300': `${prefix}300`, '400': `${prefix}400`,
    '500': `${prefix}500`, '600': `${prefix}600`, '700': `${prefix}700`, '800': `${prefix}800`, '900': `${prefix}900`,
  };
}

describe('deriveStripeState', () => {
  it('with no stored credentials, returns NotConnected', () => {
    const connection = { configured: false, paymentsEnabled: true };

    const result = deriveStripeState(connection);

    expect(result).toBe(StripeConnectionState.NotConnected);
  });

  it('with credentials but payments off, returns PaymentsOff', () => {
    const connection = { configured: true, paymentsEnabled: false };

    const result = deriveStripeState(connection);

    expect(result).toBe(StripeConnectionState.PaymentsOff);
  });

  it('with credentials and payments on, returns Live', () => {
    const connection = { configured: true, paymentsEnabled: true };

    const result = deriveStripeState(connection);

    expect(result).toBe(StripeConnectionState.Live);
  });
});

describe('stripeStateColors', () => {
  it('with NotConnected, returns the inert text-secondary on surface-elevated pair', () => {
    const theme = {
      colors: { textSecondary: 'muted-text', surfaceElevated: 'raised-surface' },
      semantic: { success: scale('s'), warning: scale('w') },
    } as unknown as UiTheme;

    const result = stripeStateColors(theme, StripeConnectionState.NotConnected);

    expect(result).toEqual({ color: 'muted-text', backgroundColor: 'raised-surface' });
  });

  it('with Live, fills the badge with the success 100 tint', () => {
    const theme = {
      colors: { textSecondary: 'muted-text', surfaceElevated: 'raised-surface' },
      semantic: { success: { ...scale('s'), '100': '#e8f5e9', '900': '#1b5e20', '800': '#2e7d32', '700': '#388e3c', '600': '#43a047' }, warning: scale('w') },
    } as unknown as UiTheme;

    const result = stripeStateColors(theme, StripeConnectionState.Live);

    expect(result.backgroundColor).toBe('#e8f5e9');
  });
});

describe('emptyStripeDraft', () => {
  it('with payments enabled on the connection, opens with blank secrets and payments on', () => {
    const connection = { configured: true, paymentsEnabled: true };

    const result = emptyStripeDraft(connection);

    expect(result).toEqual({ secretKey: '', webhookSecret: '', paymentsEnabled: true });
  });
});

describe('canSaveStripeDraft', () => {
  it('when not configured and only the secret key is typed, returns false', () => {
    const connection = { configured: false, paymentsEnabled: false };
    const draft = { secretKey: SAMPLE_KEY, webhookSecret: '', paymentsEnabled: false };

    const result = canSaveStripeDraft(connection, draft);

    expect(result).toBe(false);
  });

  it('when not configured and both secrets are well-shaped, returns true', () => {
    const connection = { configured: false, paymentsEnabled: false };
    const draft = { secretKey: SAMPLE_KEY, webhookSecret: SAMPLE_SIGNING, paymentsEnabled: false };

    const result = canSaveStripeDraft(connection, draft);

    expect(result).toBe(true);
  });

  it('with a malformed secret key, returns false', () => {
    const connection = { configured: true, paymentsEnabled: true };
    const draft = { secretKey: ['pk', 'live', 'nope'].join('_'), webhookSecret: '', paymentsEnabled: true };

    const result = canSaveStripeDraft(connection, draft);

    expect(result).toBe(false);
  });

  it('when configured and nothing changed, returns false', () => {
    const connection = { configured: true, paymentsEnabled: true };
    const draft = { secretKey: '', webhookSecret: '', paymentsEnabled: true };

    const result = canSaveStripeDraft(connection, draft);

    expect(result).toBe(false);
  });

  it('when configured and only the payments switch flipped, returns true', () => {
    const connection = { configured: true, paymentsEnabled: true };
    const draft = { secretKey: '', webhookSecret: '', paymentsEnabled: false };

    const result = canSaveStripeDraft(connection, draft);

    expect(result).toBe(true);
  });
});

describe('buildStripeSubmission', () => {
  it('with blank secrets, sends undefined so the stored values are kept', () => {
    const draft = { secretKey: '   ', webhookSecret: '', paymentsEnabled: true };

    const result = buildStripeSubmission(draft);

    expect(result).toEqual({ secretKey: undefined, webhookSecret: undefined, paymentsEnabled: true });
  });

  it('with padded secrets, sends them trimmed', () => {
    const draft = { secretKey: ` ${SAMPLE_KEY} `, webhookSecret: ` ${SAMPLE_SIGNING}`, paymentsEnabled: false };

    const result = buildStripeSubmission(draft);

    expect(result).toEqual({ secretKey: SAMPLE_KEY, webhookSecret: SAMPLE_SIGNING, paymentsEnabled: false });
  });
});
