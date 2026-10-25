import React, { useCallback, useEffect, useState } from 'react';

import { StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';

import { Button } from '@dloizides/ui-buttons';
import { useUi } from '@dloizides/ui-feedback';

import { CardActions } from './CardActions';
import { PaymentsSwitchRow } from './PaymentsSwitchRow';
import { SecretFields } from './SecretFields';
import { StripeStatusHeader } from './StripeStatusHeader';
import { WebhookUrlRow } from './WebhookUrlRow';
import { useStripeCredentialsDraft } from '../hooks/useStripeCredentialsDraft';
import { dangerInk } from '../utils/kitColors';
import { buildStripeSubmission } from '../utils/stripeConnection';

import type { StripeCredentialsCardProps } from '../types';

const GAP = 12;
const TEXT_SIZE = 14;
const TEXT_LINE_HEIGHT = 20;
const ERROR_SIZE = 14;
const COLUMN_MAX_WIDTH = 640;
const WIDE_MIN_WIDTH = 480;
const DEFAULT_TEST_ID = 'stripe';

const styles = StyleSheet.create({
  create: { alignSelf: 'flex-start' },
  error: { fontSize: ERROR_SIZE },
  root: { gap: GAP, maxWidth: COLUMN_MAX_WIDTH, width: '100%' },
  text: { fontSize: TEXT_SIZE, lineHeight: TEXT_LINE_HEIGHT },
});

/** Stripe credentials editor in a bounded column: status, webhook URL, secrets, payments switch, save/test/clear. */
export const StripeCredentialsCard = (props: StripeCredentialsCardProps): React.ReactElement => {
  const { connection, labels, onSave, onCopyWebhookUrl, onCreateAccount, onDraftChange, error } = props;
  const testID = props.testID ?? DEFAULT_TEST_ID;
  const readOnly = props.readOnly ?? false;
  const locked = readOnly || (props.disabled ?? false);
  const { theme } = useUi();
  const form = useStripeCredentialsDraft(connection, onSave);
  const { draft } = form;
  const [wide, setWide] = useState(false);
  const onLayout = useCallback((event: LayoutChangeEvent): void => {
    setWide(event.nativeEvent.layout.width >= WIDE_MIN_WIDTH);
  }, []);
  useEffect(() => {
    onDraftChange?.(buildStripeSubmission(draft), form.canSave);
  }, [draft, form.canSave, onDraftChange]);
  const webhookUrl = connection.webhookUrl ?? '';
  const readOnlyHint = labels.readOnlyHint ?? labels.saveHint;
  const hint = (normal: string): string => (readOnly ? readOnlyHint : normal);
  const hasError = error !== undefined && error !== null && error !== '';

  return (
    <View style={styles.root} testID={testID} onLayout={onLayout}>
      <StripeStatusHeader connection={connection} labels={labels} testID={testID} />
      {labels.blurb !== undefined ? (
        <Text style={[styles.text, { color: theme.colors.textSecondary }]}>{labels.blurb}</Text>
      ) : null}
      {onCreateAccount !== undefined ? (
        <View style={styles.create}>
          <Button
            accessibilityHint={labels.createAccountHint}
            accessibilityLabel={labels.createAccount}
            label={labels.createAccount}
            size="sm"
            testID={`${testID}-create-account`}
            variant="secondary"
            onPress={onCreateAccount}
          />
        </View>
      ) : null}
      {webhookUrl !== '' ? (
        <WebhookUrlRow labels={labels} testID={testID} url={webhookUrl} wide={wide} onCopy={onCopyWebhookUrl} />
      ) : null}
      <SecretFields
        autoFocus={props.autoFocus ?? false}
        configured={connection.configured}
        draft={draft}
        labels={labels}
        locked={locked}
        setSecretKey={form.setSecretKey}
        setWebhookSecret={form.setWebhookSecret}
        testID={testID}
      />
      <PaymentsSwitchRow
        description={labels.paymentsDescription}
        disabled={locked}
        hint={labels.paymentsHint}
        label={labels.paymentsEnabled}
        testID={`${testID}-payments-switch`}
        value={draft.paymentsEnabled}
        onValueChange={form.setPaymentsEnabled}
      />
      {hasError ? (
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.error, { color: dangerInk(theme) }]}
          testID={`${testID}-error`}
        >
          {error}
        </Text>
      ) : null}
      <CardActions canSave={form.canSave} card={props} hint={hint} locked={locked} save={form.save} wide={wide} />
    </View>
  );
};
