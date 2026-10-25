import { isStripeSecretKeyShape, isStripeWebhookSecretShape, keyLast4, maskedKey } from './stripeKeys';

describe('isStripeSecretKeyShape', () => {
  it('with a live secret key, returns true', () => {
    const value = ['sk', 'live', 'abcdefghij1234'].join('_');

    const result = isStripeSecretKeyShape(value);

    expect(result).toBe(true);
  });

  it('with a restricted test key padded by spaces, returns true', () => {
    const value = `  ${['rk', 'test', 'ABCDEFGHIJ99'].join('_')}  `;

    const result = isStripeSecretKeyShape(value);

    expect(result).toBe(true);
  });

  it('with a publishable key, returns false', () => {
    const value = ['pk', 'live', 'abcdefghij1234'].join('_');

    const result = isStripeSecretKeyShape(value);

    expect(result).toBe(false);
  });

  it('with a too-short body, returns false', () => {
    const value = ['sk', 'test', 'abc'].join('_');

    const result = isStripeSecretKeyShape(value);

    expect(result).toBe(false);
  });
});

describe('isStripeWebhookSecretShape', () => {
  it('with a whsec secret, returns true', () => {
    const value = ['whsec', 'abcdefghij+/='].join('_');

    const result = isStripeWebhookSecretShape(value);

    expect(result).toBe(true);
  });

  it('with a secret key in the webhook field, returns false', () => {
    const value = ['sk', 'test', 'abcdefghij1234'].join('_');

    const result = isStripeWebhookSecretShape(value);

    expect(result).toBe(false);
  });
});

describe('keyLast4', () => {
  it('with a full key, returns its last four characters', () => {
    const value = ['sk', 'test', 'abcdefghij4242'].join('_');

    const result = keyLast4(value);

    expect(result).toBe('4242');
  });

  it('with fewer than four characters, returns an empty string', () => {
    const value = 'abc';

    const result = keyLast4(value);

    expect(result).toBe('');
  });
});

describe('maskedKey', () => {
  it('with a stored last four, returns four dots then the digits', () => {
    const last4 = '4242';

    const result = maskedKey(last4);

    expect(result).toBe('••••4242');
  });

  it('with a longer tail, keeps only the last four', () => {
    const last4 = '994242';

    const result = maskedKey(last4);

    expect(result).toBe('••••4242');
  });

  it('with null, returns an empty string', () => {
    const last4 = null;

    const result = maskedKey(last4);

    expect(result).toBe('');
  });
});
