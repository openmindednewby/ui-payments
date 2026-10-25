import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';
import { StatusBadge } from '@dloizides/ui-layout';

import { deriveStripeState, stripeStateColors } from '../utils/stripeConnection';
import { maskedKey } from '../utils/stripeKeys';

import type { StripeConnectionInfo, StripeCredentialsLabels } from '../types';

const GAP = 12;
const MASK_FONT_SIZE = 13;

const styles = StyleSheet.create({
  mask: { fontSize: MASK_FONT_SIZE },
  root: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: GAP },
});

interface Props {
  connection: StripeConnectionInfo;
  labels: StripeCredentialsLabels;
  testID: string;
}

/** Connection-state badge plus the stored key's masked last four. */
export const StripeStatusHeader = ({ connection, labels, testID }: Props): React.ReactElement => {
  const { theme } = useUi();
  const state = deriveStripeState(connection);
  const colors = stripeStateColors(theme, state);
  const mask = connection.configured ? maskedKey(connection.secretKeyLast4) : '';

  return (
    <View style={styles.root}>
      <StatusBadge
        backgroundColor={colors.backgroundColor}
        color={colors.color}
        label={labels.states[state]}
        testID={`${testID}-state`}
      />
      {mask !== '' ? (
        <Text style={[styles.mask, { color: theme.colors.textSecondary }]} testID={`${testID}-key-last4`}>
          {labels.keyMask(mask)}
        </Text>
      ) : null}
    </View>
  );
};
