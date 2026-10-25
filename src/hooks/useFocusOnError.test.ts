import { renderHook } from '@testing-library/react';

import { revealWithMargin, useFocusOnError } from './useFocusOnError';

const VIEWPORT_HEIGHT = 800;

function mount(html: string): void {
  document.body.innerHTML = html;
}

function placeAt(el: HTMLElement, bottom: number): void {
  el.getBoundingClientRect = (): DOMRect => ({ bottom } as DOMRect);
}

describe('useFocusOnError', () => {
  beforeEach(() => {
    window.innerHeight = VIEWPORT_HEIGHT;
    window.scrollBy = jest.fn();
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
  });

  it('focuses the error line and scrolls the actions to end 24 px above the fold', () => {
    mount('<p data-testid="stripe-error">Invalid API key</p><div data-testid="stripe-actions"></div>');
    placeAt(document.querySelector<HTMLElement>('[data-testid="stripe-actions"]')!, 800);

    renderHook(() => useFocusOnError('Invalid API key', 'stripe'));

    expect(document.activeElement?.getAttribute('data-testid')).toBe('stripe-error');
    expect(window.scrollBy).toHaveBeenCalledWith({ top: 24 });
  });

  it('does not scroll when the actions already sit 24 px or more above the fold', () => {
    mount('<div data-testid="a"></div>');
    const node = document.querySelector<HTMLElement>('[data-testid="a"]')!;
    placeAt(node, 776);

    revealWithMargin(node);

    expect(window.scrollBy).not.toHaveBeenCalled();
  });

  it('leaves focus alone when there is no error', () => {
    mount('<p data-testid="stripe-error">x</p><input data-testid="stripe-secret-key" />');
    document.querySelector<HTMLElement>('[data-testid="stripe-secret-key"]')!.focus();

    renderHook(() => useFocusOnError(null, 'stripe'));

    expect(document.activeElement?.getAttribute('data-testid')).toBe('stripe-secret-key');
  });
});
