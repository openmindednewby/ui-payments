import { themeFocusRingColor } from '@dloizides/ui-buttons';
import type { UiTheme } from '@dloizides/ui-feedback';

/** The kit focus-ring colour: the shared contrast-checked focus-ring token from ui-buttons. */
export function focusRingColor(theme: UiTheme): string {
  return themeFocusRingColor(theme);
}

/** The danger ink: the darkest addressable error step, for 4.5:1 text on the card surface. */
export function dangerInk(theme: UiTheme): string {
  const scale = theme.semantic.error;
  return scale['700'] ?? scale['600'] ?? scale['500'];
}
