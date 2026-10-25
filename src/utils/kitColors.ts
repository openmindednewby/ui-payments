import { readableScaleInk, themeFocusRingColor } from '@dloizides/ui-buttons';
import type { UiTheme } from '@dloizides/ui-feedback';

/** The kit focus-ring colour: the shared contrast-checked focus-ring token from ui-buttons. */
export function focusRingColor(theme: UiTheme): string {
  return themeFocusRingColor(theme);
}

const DANGER_LIGHT_STEPS = ['700', '600', '500'];
const DANGER_DARK_STEPS = ['300', '200', '400', '100', '500'];

/** The danger ink: the error step that clears 4.5:1 on the card surface, in light and dark themes. */
export function dangerInk(theme: UiTheme): string {
  return readableScaleInk(theme.semantic.error, theme.colors.surface, DANGER_LIGHT_STEPS, DANGER_DARK_STEPS);
}
