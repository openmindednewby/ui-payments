import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@dloizides/ui-buttons';
import { useUi } from '@dloizides/ui-feedback';
import { FormField, FormSwitch } from '@dloizides/ui-forms';

import { StripeStatusHeader } from './StripeStatusHeader';
import { WebhookUrlRow } from './WebhookUrlRow';
import { useStripeCredentialsDraft } from '../hooks/useStripeCredentialsDraft';
import { isSecretKeyAcceptable, isWebhookSecretAcceptable } from '../utils/stripeConnection';

import type { StripeCredentialsCardProps } from '../types';

const GAP = 16;
const TEXT_SIZE = 13;
const DEFAULT_TEST_ID = 'stripe';

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP },
  text: { fontSize: TEXT_SIZE },
  root: { gap: GAP },
});

/** Stripe credentials editor: status, webhook URL, secret inputs, payments switch, save/test/clear. */
export const StripeCredentialsCard = ({
  connection,
  labels,
  onSave,
  onClear,
  onTest,
  onCopyWebhookUrl,
  onCreateAccount,
  saving = false,
  clearing = false,
  testing = false,
  readOnly = false,
  error,
  testID = DEFAULT_TEST_ID,
}: StripeCredentialsCardProps): React.ReactElement => {
  const { theme } = useUi();
  const form = useStripeCredentialsDraft(connection, onSave);
  const { draft } = form;
  const secretInvalid = !isSecretKeyAcceptable(draft.secretKey);
  const webhookInvalid = !isWebhookSecretAcceptable(draft.webhookSecret);
  const webhookUrl = connection.webhookUrl ?? '';
  const readOnlyHint = labels.readOnlyHint ?? labels.saveHint;
  const hint = (normal: string): string => (readOnly ? readOnlyHint : normal);

  return (
    <View style={styles.root} testID={testID}>
      <StripeStatusHeader connection={connection} labels={labels} testID={testID} />
      {labels.blurb !== undefined ? (
        <Text style={[styles.text, { color: theme.colors.textSecondary }]}>{labels.blurb}</Text>
      ) : null}
      {onCreateAccount !== undefined && !connection.configured ? (
        <Button
          accessibilityHint={labels.createAccountHint}
          accessibilityLabel={labels.createAccount}
          label={labels.createAccount}
          size="sm"
          testID={`${testID}-create-account`}
          variant="ghost"
          onPress={onCreateAccount}
        />
      ) : null}
      {webhookUrl !== '' ? (
        <WebhookUrlRow labels={labels} testID={testID} url={webhookUrl} onCopy={onCopyWebhookUrl} />
      ) : null}
      <FormField
        accessibilityHint={labels.secretKeyHint}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!readOnly}
        error={secretInvalid ? labels.secretKeyInvalid : undefined}
        label={labels.secretKey}
        placeholder={connection.configured ? labels.secretKeyKeepPlaceholder : labels.secretKeyPlaceholder}
        secureTextEntry={draft.secretKey !== ''}
        testID={`${testID}-secret-key`}
        value={draft.secretKey}
        onChangeText={form.setSecretKey}
      />
      <FormField
        accessibilityHint={labels.webhookSecretHint}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!readOnly}
        error={webhookInvalid ? labels.webhookSecretInvalid : undefined}
        label={labels.webhookSecret}
        placeholder={connection.configured ? labels.webhookSecretKeepPlaceholder : labels.webhookSecretPlaceholder}
        secureTextEntry={draft.webhookSecret !== ''}
        testID={`${testID}-webhook-secret`}
        value={draft.webhookSecret}
        onChangeText={form.setWebhookSecret}
      />
      <FormSwitch
        accessibilityHint={labels.paymentsHint}
        description={labels.paymentsDescription}
        disabled={readOnly}
        label={labels.paymentsEnabled}
        testID={`${testID}-payments-switch`}
        value={draft.paymentsEnabled}
        onValueChange={form.setPaymentsEnabled}
      />
      {error !== undefined && error !== null && error !== '' ? (
        <Text style={[styles.text, { color: theme.semantic.error['500'] }]} testID={`${testID}-error`}>
          {error}
        </Text>
      ) : null}
      <View style={styles.actions}>
        <Button
          accessibilityHint={hint(labels.saveHint)}
          accessibilityLabel={labels.save}
          disabled={!form.canSave || readOnly}
          label={labels.save}
          loading={saving}
          testID={`${testID}-save`}
          onPress={form.save}
        />
        {onTest !== undefined && connection.configured ? (
          <Button
            accessibilityHint={hint(labels.testHint)}
            accessibilityLabel={labels.test}
            disabled={readOnly}
            label={labels.test}
            loading={testing}
            testID={`${testID}-test`}
            variant="outline"
            onPress={onTest}
          />
        ) : null}
        {onClear !== undefined && connection.configured ? (
          <Button
            accessibilityHint={hint(labels.clearHint)}
            accessibilityLabel={labels.clear}
            disabled={readOnly}
            label={labels.clear}
            loading={clearing}
            testID={`${testID}-clear`}
            variant="danger"
            onPress={onClear}
          />
        ) : null}
      </View>
    </View>
  );
};
