import { useCallback, useState } from 'react';

import { buildStripeSubmission, canSaveStripeDraft, emptyStripeDraft } from '../utils/stripeConnection';

import type { StripeConnectionInfo, StripeCredentialsCardProps, StripeCredentialsDraft } from '../types';

interface DraftState {
  draft: StripeCredentialsDraft;
  setSecretKey: (value: string) => void;
  setWebhookSecret: (value: string) => void;
  setPaymentsEnabled: (value: boolean) => void;
  canSave: boolean;
  save: () => void | Promise<unknown>;
}

/** The card's form buffer; a resolved async `onSave` clears the typed secrets. */
export function useStripeCredentialsDraft(
  connection: StripeConnectionInfo,
  onSave: StripeCredentialsCardProps['onSave'],
): DraftState {
  const [draft, setDraft] = useState<StripeCredentialsDraft>(() => emptyStripeDraft(connection));
  const setSecretKey = useCallback((secretKey: string): void => setDraft((d) => ({ ...d, secretKey })), []);
  const setWebhookSecret = useCallback((webhookSecret: string): void => setDraft((d) => ({ ...d, webhookSecret })), []);
  const setPaymentsEnabled = useCallback(
    (paymentsEnabled: boolean): void => setDraft((d) => ({ ...d, paymentsEnabled })),
    [],
  );
  const canSave = canSaveStripeDraft(connection, draft);

  const save = useCallback((): void | Promise<unknown> => {
    if (!canSave) return undefined;
    const result = onSave(buildStripeSubmission(draft));
    if (result instanceof Promise) return result.then(() => setDraft((d) => ({ ...d, secretKey: '', webhookSecret: '' })));
    return undefined;
  }, [canSave, draft, onSave]);

  return { draft, setSecretKey, setWebhookSecret, setPaymentsEnabled, canSave, save };
}
