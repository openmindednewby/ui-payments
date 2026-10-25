import { render } from '@testing-library/react';

import { WebhookUrlRow } from './WebhookUrlRow';

import type { StripeCredentialsLabels } from '../types';

const labels = { webhookUrl: 'Webhook URL', webhookCopy: 'Copy', webhookCopyHint: 'Copies it' } as StripeCredentialsLabels;

describe('WebhookUrlRow', () => {
  it('offers a line break after every separator and keeps the URL text unchanged', () => {
    const url = 'https://api.agora.dloizides.com/webhooks/stripe/merchant-a-shop';

    const { getByTestId } = render(<WebhookUrlRow labels={labels} testID="stripe" url={url} wide={false} />);

    const node = getByTestId('stripe-webhook-url');
    expect(node.querySelectorAll('wbr')).toHaveLength(11);
    expect(node.textContent).toBe(url);
  });
});
