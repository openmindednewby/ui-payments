import { renderHook } from '@testing-library/react';

import { useFocusOnError } from './useFocusOnError';

function mount(html: string): void {
  document.body.innerHTML = html;
}

describe('useFocusOnError', () => {
  it('focuses the error line and scrolls the actions with a 24 px margin when a save error appears', () => {
    mount('<p data-testid="stripe-error">Invalid API key</p><div data-testid="stripe-actions"></div>');
    const actions = document.querySelector<HTMLElement>('[data-testid="stripe-actions"]')!;
    const scroll = jest.fn();
    actions.scrollIntoView = scroll;

    renderHook(() => useFocusOnError('Invalid API key', 'stripe'));

    expect(document.activeElement?.getAttribute('data-testid')).toBe('stripe-error');
    expect(actions.style.scrollMarginBottom).toBe('24px');
    expect(scroll).toHaveBeenCalledWith({ block: 'nearest' });
  });

  it('leaves focus alone when there is no error', () => {
    mount('<p data-testid="stripe-error">x</p><input data-testid="stripe-secret-key" />');
    document.querySelector<HTMLElement>('[data-testid="stripe-secret-key"]')!.focus();

    renderHook(() => useFocusOnError(null, 'stripe'));

    expect(document.activeElement?.getAttribute('data-testid')).toBe('stripe-secret-key');
  });
});
