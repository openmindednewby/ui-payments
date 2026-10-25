import React, { useCallback } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@dloizides/ui-buttons';
import { useUi } from '@dloizides/ui-feedback';
import { Field } from '@dloizides/ui-forms';

import type { StripeCredentialsLabels } from '../types';

const GAP = 8;
const URL_FONT_SIZE = 13;
const URL_PADDING = 10;
const URL_RADIUS = 6;

const styles = StyleSheet.create({
  row: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: GAP },
  url: { borderRadius: URL_RADIUS, flexShrink: 1, fontFamily: 'monospace', fontSize: URL_FONT_SIZE, padding: URL_PADDING },
});

interface Props {
  url: string;
  labels: StripeCredentialsLabels;
  onCopy?: (url: string) => void;
  testID: string;
}

/** The selectable webhook endpoint the merchant pastes into Stripe, with an optional copy action. */
export const WebhookUrlRow = ({ url, labels, onCopy, testID }: Props): React.ReactElement => {
  const { theme } = useUi();
  const copy = useCallback((): void => onCopy?.(url), [onCopy, url]);

  return (
    <Field label={labels.webhookUrl}>
      <View style={styles.row}>
        <Text
          selectable
          style={[styles.url, { backgroundColor: theme.colors.surfaceElevated, color: theme.colors.text }]}
          testID={`${testID}-webhook-url`}
        >
          {url}
        </Text>
        {onCopy !== undefined ? (
          <Button
            accessibilityHint={labels.webhookCopyHint}
            accessibilityLabel={labels.webhookCopy}
            label={labels.webhookCopy}
            size="sm"
            testID={`${testID}-webhook-copy`}
            variant="outline"
            onPress={copy}
          />
        ) : null}
      </View>
    </Field>
  );
};
