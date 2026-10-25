import { splitUrlForBreaks } from './urlBreaks';

describe('splitUrlForBreaks', () => {
  it('never breaks inside a hyphenated or underscored slug', () => {
    const url = 'https://x.com/agora-merchant_a-shop';

    expect(splitUrlForBreaks(url)).toEqual(['https:/', '/', 'x.', 'com/', 'agora-merchant_a-shop']);
  });

  it('ends each piece on a separator so the URL breaks after / and .', () => {
    const url = 'https://api.agora.dloizides.com/webhooks/stripe/merchant-a-shop';

    const pieces = splitUrlForBreaks(url);

    expect(pieces).toEqual([
      'https:/',
      '/',
      'api.',
      'agora.',
      'dloizides.',
      'com/',
      'webhooks/',
      'stripe/',
      'merchant-a-shop',
    ]);
  });

  it('joins back to the exact URL, so copying never changes it', () => {
    const url = 'https://x.example.com/hook?tenant=a_b&mode=live';

    expect(splitUrlForBreaks(url).join('')).toBe(url);
  });

  it('returns no pieces for an empty URL', () => {
    expect(splitUrlForBreaks('')).toEqual([]);
  });
});
