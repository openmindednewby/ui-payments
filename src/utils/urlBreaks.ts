const BREAK_AFTER = /([/.?&=_-])/;

/** Splits a URL into pieces that each end on a separator, so a line can break after `/`, `.`, `?`, `&`, `=`, `_` or `-` and never mid-word. */
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
