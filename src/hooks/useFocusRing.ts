import { useCallback, useMemo, useState } from 'react';

import { useUi } from '@dloizides/ui-feedback';

import { focusRingColor } from '../utils/kitColors';

import type { ViewStyle } from 'react-native';

const RING_WIDTH = 2;
const RING_OFFSET = 2;

interface FocusRing {
  ringStyle: ViewStyle;
  onFocus: () => void;
  onBlur: () => void;
}

/** One 2 px solid focus ring (replacing the browser default outline) for a custom pressable. */
export function useFocusRing(): FocusRing {
  const { theme } = useUi();
  const [focused, setFocused] = useState(false);
  const onFocus = useCallback((): void => setFocused(true), []);
  const onBlur = useCallback((): void => setFocused(false), []);
  const color = focusRingColor(theme);
  const ringStyle = useMemo<ViewStyle>(
    () =>
      focused
        ? { outlineColor: color, outlineOffset: RING_OFFSET, outlineStyle: 'solid', outlineWidth: RING_WIDTH }
        : { outlineWidth: 0 },
    [color, focused],
  );
  return { ringStyle, onFocus, onBlur };
}
