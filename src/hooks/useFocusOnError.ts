import { useEffect } from 'react';

import { Platform } from 'react-native';

const ERROR_SCROLL_MARGIN = 24;

function byTestId(id: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-testid="${id}"]`);
}

function scrollParent(node: HTMLElement): HTMLElement | null {
  let el = node.parentElement;
  while (el !== null) {
    const { overflowY } = getComputedStyle(el);
    if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight) return el;
    el = el.parentElement;
  }
  return null;
}

/** Scrolls just enough that `node` ends at least 24 px above the bottom of the viewport. */
export function revealWithMargin(node: HTMLElement): void {
  const overflow = node.getBoundingClientRect().bottom + ERROR_SCROLL_MARGIN - window.innerHeight;
  if (overflow <= 0) return;
  const parent = scrollParent(node);
  if (parent === null) window.scrollBy({ top: overflow });
  else parent.scrollBy({ top: overflow });
}

/** Web only (FOCUS-1): when a save error appears, focus the error line and reveal the actions with 24 px below them. */
export function useFocusOnError(error: string | null | undefined, testID: string): void {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    if (error === undefined || error === null || error === '') return;
    const line = byTestId(`${testID}-error`);
    if (line === null) return;
    line.setAttribute('tabindex', '-1');
    line.focus({ preventScroll: true });
    const actions = byTestId(`${testID}-actions`);
    if (actions !== null) requestAnimationFrame(() => revealWithMargin(actions));
  }, [error, testID]);
}
