import { dangerInk, focusRingColor } from './kitColors';

import type { UiTheme } from '@dloizides/ui-feedback';

const baseColors = {
  background: 'bg',
  surface: 'surface',
  surfaceElevated: 'raised',
  text: 'text',
  textSecondary: 'muted',
  border: 'border',
};

const themeWith = (colors: Record<string, string>, error: Record<string, string>): UiTheme =>
  ({ colors, palette: { primary: { '500': 'primary-500' } }, semantic: { error } }) as unknown as UiTheme;

describe('focusRingColor', () => {
  it('uses the theme focusRing token when the theme carries one', () => {
    expect(focusRingColor(themeWith({ ...baseColors, focusRing: 'ring' }, { '500': 'red' }))).toBe('ring');
  });

  it('falls back to primary 500 when the theme has no focusRing token', () => {
    expect(focusRingColor(themeWith(baseColors, { '500': 'red' }))).toBe('primary-500');
  });
});

describe('dangerInk', () => {
  it('prefers error 700 for text contrast', () => {
    expect(dangerInk(themeWith(baseColors, { '500': 'red-500', '600': 'red-600', '700': 'red-700' }))).toBe('red-700');
  });

  it('uses error 600 when 700 is missing', () => {
    expect(dangerInk(themeWith(baseColors, { '500': 'red-500', '600': 'red-600' }))).toBe('red-600');
  });

  it('uses error 500 when only the guaranteed step exists', () => {
    expect(dangerInk(themeWith(baseColors, { '500': 'red-500' }))).toBe('red-500');
  });
});
