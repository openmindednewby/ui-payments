import type { UiTheme } from '@dloizides/ui-feedback';

/** The kit focus-ring colour: the theme's `focusRing` token when present, else primary 500. */
export function focusRingColor(theme: UiTheme): string {
  const colors = theme.colors as UiTheme['colors'] & { focusRing?: string };
  return colors.focusRing ?? theme.palette.primary['500'];
}

/** The danger ink: the darkest addressable error step, for 4.5:1 text on the card surface. */
export function dangerInk(theme: UiTheme): string {
  const scale = theme.semantic.error;
  return scale['700'] ?? scale['600'] ?? scale['500'];
}
