import { render } from '@testing-library/react';

import { WebhookUrlRow } from './WebhookUrlRow';

import type { StripeCredentialsLabels } from '../types';

const labels = { webhookUrl: 'Webhook URL', webhookCopy: 'Copy', webhookCopyHint: 'Copies it' } as StripeCredentialsLabels;
const UNBREAKABLE_MAX = 2;

function nowrapTexts(node: HTMLElement): string[] {
  return Array.from(node.querySelectorAll<HTMLElement>('*'))
    .filter((el) => getComputedStyle(el).whiteSpace === 'nowrap')
    .map((el) => el.textContent ?? '');
}

describe('WebhookUrlRow', () => {
  it('with a hyphenated slug, offers a break after every separator, glues each hyphen to the next letter and keeps the URL text', () => {
    const url = 'https://api.agora.dloizides.com/webhooks/stripe/merchant-a-shop';

    const { getByTestId } = render(<WebhookUrlRow labels={labels} testID="stripe" url={url} wide={false} />);

    const node = getByTestId('stripe-webhook-url');
    expect(node.querySelectorAll('wbr')).toHaveLength(9);
    expect(node.textContent).toBe(url);
    expect(nowrapTexts(node)).toEqual(expect.arrayContaining(['-a', '-s']));
  });

  it('with a UUID segment wider than the box, leaves no unbreakable run longer than a glued separator', () => {
    const url = 'https://app.kefi.dloizides.com/webhooks/stripe/65adb9d4-47f1-4425-a7bf-95a3923a880c';

    const { getByTestId } = render(<WebhookUrlRow labels={labels} testID="stripe" url={url} wide={false} />);

    const node = getByTestId('stripe-webhook-url');
    expect(node.textContent).toBe(url);
    expect(nowrapTexts(node).filter((text) => text.length > UNBREAKABLE_MAX)).toEqual([]);
  });
});
