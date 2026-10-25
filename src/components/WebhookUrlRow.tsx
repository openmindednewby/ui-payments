import React, { useCallback } from 'react';

import { Platform, StyleSheet, Text, View, type TextStyle } from 'react-native';

import { Button } from '@dloizides/ui-buttons';
import { useUi } from '@dloizides/ui-feedback';
import { Field } from '@dloizides/ui-forms';

import { splitUrlForBreaks } from '../utils/urlBreaks';

import type { StripeCredentialsLabels } from '../types';

const GAP = 8;
const URL_FONT_SIZE = 13;
const URL_LINE_HEIGHT = 20;
const URL_PADDING_X = 12;
const URL_PADDING_Y = 12;
const URL_RADIUS = 6;
const URL_BORDER = 1;
const HELP_FONT_SIZE = 13;

const wrapAnywhere = { overflowWrap: 'anywhere', wordBreak: 'normal' } as unknown as TextStyle;
const keepTogether = { whiteSpace: 'nowrap' } as unknown as TextStyle;

function urlWithBreaks(url: string): React.ReactNode {
  if (Platform.OS !== 'web') return url;
  return splitUrlForBreaks(url).map((piece, index) => (
    <React.Fragment key={`${index}-${piece}`}>
      <Text style={keepTogether}>{piece}</Text>
      {React.createElement('wbr')}
    </React.Fragment>
  ));
}

const styles = StyleSheet.create({
  box: { borderRadius: URL_RADIUS, borderWidth: URL_BORDER, paddingHorizontal: URL_PADDING_X, paddingVertical: URL_PADDING_Y },
  boxWide: { flex: 1, minWidth: 0 },
  column: { gap: GAP },
  field: { marginBottom: 0 },
  help: { fontSize: HELP_FONT_SIZE },
  row: { alignItems: 'center', flexDirection: 'row', gap: GAP },
  url: { fontFamily: 'monospace', fontSize: URL_FONT_SIZE, lineHeight: URL_LINE_HEIGHT },
});

interface Props {
  url: string;
  labels: StripeCredentialsLabels;
  onCopy?: (url: string) => void;
  wide: boolean;
  testID: string;
}

/** The webhook endpoint in a bordered read-only field that wraps; Copy beside it when wide, under it when narrow. */
export const WebhookUrlRow = ({ url, labels, onCopy, wide, testID }: Props): React.ReactElement => {
  const { theme } = useUi();
  const copy = useCallback((): void => onCopy?.(url), [onCopy, url]);
  const instruction = labels.webhookUrlInstruction;

  return (
    <Field containerStyle={styles.field} label={labels.webhookUrl}>
      <View style={styles.column}>
        <View style={wide ? styles.row : styles.column}>
          <View
            style={[
              styles.box,
              wide ? styles.boxWide : null,
              { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border },
            ]}
          >
            <Text selectable style={[styles.url, wrapAnywhere, { color: theme.colors.text }]} testID={`${testID}-webhook-url`}>
              {urlWithBreaks(url)}
            </Text>
          </View>
          {onCopy !== undefined ? (
            <Button
              accessibilityHint={labels.webhookCopyHint}
              accessibilityLabel={labels.webhookCopy}
              fullWidth={!wide}
              label={labels.webhookCopy}
              testID={`${testID}-webhook-copy`}
              variant="outline"
              onPress={copy}
            />
          ) : null}
        </View>
        {instruction !== undefined && instruction !== '' ? (
          <Text style={[styles.help, { color: theme.colors.textSecondary }]} testID={`${testID}-webhook-instruction`}>
            {instruction}
          </Text>
        ) : null}
      </View>
    </Field>
  );
};
