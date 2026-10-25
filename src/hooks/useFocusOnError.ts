import { useEffect } from 'react';

import { Platform } from 'react-native';

const ERROR_SCROLL_MARGIN = 24;

function byTestId(id: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-testid="${id}"]`);
}

/** Web only (FOCUS-1): when a save error appears, focus the error line and scroll the actions into view with 24 px below them. */
export function useFocusOnError(error: string | null | undefined, testID: string): void {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    if (error === undefined || error === null || error === '') return;
    const line = byTestId(`${testID}-error`);
    if (line === null) return;
    line.setAttribute('tabindex', '-1');
    line.focus({ preventScroll: true });
    const actions = byTestId(`${testID}-actions`);
    if (actions === null) return;
    actions.style.scrollMarginBottom = `${ERROR_SCROLL_MARGIN}px`;
    actions.scrollIntoView?.({ block: 'nearest' });
  }, [error, testID]);
}
