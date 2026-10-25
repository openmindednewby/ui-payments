import { splitPieceForGlue, splitUrlForBreaks } from './urlBreaks';

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

describe('splitPieceForGlue', () => {
  it('with hyphens in a slug, glues each hyphen to the character after it', () => {
    const piece = 'merchant-a-shop';

    const runs = splitPieceForGlue(piece);

    expect(runs).toEqual([
      { text: 'merchant', glued: false },
      { text: '-a', glued: true },
      { text: '-s', glued: true },
      { text: 'hop', glued: false },
    ]);
  });

  it('with a trailing separator, leaves it unglued because nothing follows it', () => {
    const piece = 'webhooks/';

    const runs = splitPieceForGlue(piece);

    expect(runs).toEqual([{ text: 'webhooks/', glued: false }]);
  });

  it('with any piece, joins back to the exact piece', () => {
    const piece = 'hook?tenant=a_b&mode=live';

    const runs = splitPieceForGlue(piece);

    expect(runs.map((run) => run.text).join('')).toBe(piece);
  });
});
