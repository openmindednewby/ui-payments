const BREAK_AFTER = /([/.])/;

/** Splits a URL into pieces that each end on a separator, so a line prefers to break after `/` or `.`, never after a hyphen. */
export function splitUrlForBreaks(url: string): string[] {
  const pieces: string[] = [];
  let current = '';
  for (const part of url.split(BREAK_AFTER)) {
    current += part;
    if (BREAK_AFTER.test(part)) {
      pieces.push(current);
      current = '';
    }
  }
  if (current !== '') pieces.push(current);
  return pieces;
}

const GLUE = /([^A-Za-z0-9].)/;
const CAPTURE_PARITY = 2;

export interface UrlRun {
  text: string;
  glued: boolean;
}

/** Splits a URL piece so each separator (`-`, `_`, `?`, ...) is glued to the character after it; the rest may break anywhere when it cannot fit. */
export function splitPieceForGlue(piece: string): UrlRun[] {
  return piece
    .split(GLUE)
    .map((text, index) => ({ text, glued: index % CAPTURE_PARITY === 1 }))
    .filter((run) => run.text !== '');
}
