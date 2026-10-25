import { useEffect, type RefObject } from 'react';

import { Platform } from 'react-native';

interface KeyTarget {
  addEventListener: (type: 'keydown', handler: (event: KeyboardEvent) => void) => void;
  removeEventListener: (type: 'keydown', handler: (event: KeyboardEvent) => void) => void;
}

const SPACE_KEYS = new Set([' ', 'Spacebar']);

/** Space toggles a web `role="switch"` pressable, which react-native-web maps to Enter only. */
export function useSpaceToggle(ref: RefObject<unknown>, toggle: () => void, disabled: boolean): void {
  useEffect(() => {
    if (Platform.OS !== 'web' || disabled) return undefined;
    const node = ref.current as KeyTarget | null;
    if (node === null || typeof node.addEventListener !== 'function') return undefined;
    const handler = (event: KeyboardEvent): void => {
      if (!SPACE_KEYS.has(event.key)) return;
      event.preventDefault();
      toggle();
    };
    node.addEventListener('keydown', handler);
    return () => node.removeEventListener('keydown', handler);
  }, [disabled, ref, toggle]);
}
