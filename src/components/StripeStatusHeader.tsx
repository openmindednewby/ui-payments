import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { StripeConnectionState } from '../StripeConnectionState';
import { deriveStripeState, stripeStateColors } from '../utils/stripeConnection';
import { maskedKey } from '../utils/stripeKeys';

import type { StripeConnectionInfo, StripeCredentialsLabels } from '../types';

const GAP = 12;
const MASK_FONT_SIZE = 13;
const PILL_GAP = 6;
const PILL_PAD_X = 10;
const PILL_PAD_Y = 4;
const PILL_RADIUS = 999;
const PILL_BORDER = 1;
const PILL_FONT_SIZE = 13;
const PILL_WEIGHT = '600';
const GLYPH_BOX = 10;
const DOT = 8;
const BAR_WIDTH = 2;
const BAR_HEIGHT = 9;
const TICK_WIDTH = 5;
const TICK_HEIGHT = 9;
const TICK_STROKE = 2;

const styles = StyleSheet.create({
  bars: { flexDirection: 'row', gap: 2 },
  bar: { height: BAR_HEIGHT, width: BAR_WIDTH },
  dot: { borderRadius: DOT / 2, height: DOT, width: DOT },
  glyph: { alignItems: 'center', height: GLYPH_BOX, justifyContent: 'center', width: GLYPH_BOX },
  mask: { fontSize: MASK_FONT_SIZE, fontVariant: ['tabular-nums'] },
  pill: {
    alignItems: 'center',
    borderRadius: PILL_RADIUS,
    borderWidth: PILL_BORDER,
    flexDirection: 'row',
    gap: PILL_GAP,
    paddingHorizontal: PILL_PAD_X,
    paddingVertical: PILL_PAD_Y,
  },
  pillText: { fontSize: PILL_FONT_SIZE, fontWeight: PILL_WEIGHT },
  root: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: GAP },
  tick: {
    borderBottomWidth: TICK_STROKE,
    borderRightWidth: TICK_STROKE,
    height: TICK_HEIGHT,
    marginTop: -2,
    transform: [{ rotate: '45deg' }],
    width: TICK_WIDTH,
  },
});

const StateGlyph = ({ state, color }: { state: StripeConnectionState; color: string }): React.ReactElement => {
  if (state === StripeConnectionState.Live) return <View style={[styles.tick, { borderColor: color }]} />;
  if (state === StripeConnectionState.PaymentsOff)
    return (
      <View style={styles.bars}>
        <View style={[styles.bar, { backgroundColor: color }]} />
        <View style={[styles.bar, { backgroundColor: color }]} />
      </View>
    );
  return <View style={[styles.dot, { backgroundColor: color }]} />;
};

interface Props {
  connection: StripeConnectionInfo;
  labels: StripeCredentialsLabels;
  testID: string;
}

/** Connection-state pill (tint + glyph + word, never colour alone) plus the stored key's masked last four. */
export const StripeStatusHeader = ({ connection, labels, testID }: Props): React.ReactElement => {
  const { theme } = useUi();
  const state = deriveStripeState(connection);
  const colors = stripeStateColors(theme, state);
  const mask = connection.configured ? maskedKey(connection.secretKeyLast4) : '';
  const label = labels.states[state];
  const borderColor = state === StripeConnectionState.NotConnected ? theme.colors.border : colors.backgroundColor;

  return (
    <View style={styles.root}>
      <View
        accessibilityLabel={label}
        accessible
        style={[styles.pill, { backgroundColor: colors.backgroundColor, borderColor }]}
        testID={`${testID}-state`}
      >
        <View style={styles.glyph} testID={`${testID}-state-glyph`}>
          <StateGlyph color={colors.color} state={state} />
        </View>
        <Text style={[styles.pillText, { color: colors.color }]}>{label}</Text>
      </View>
      {mask !== '' ? (
        <Text style={[styles.mask, { color: theme.colors.textSecondary }]} testID={`${testID}-key-last4`}>
          {labels.keyMask(mask)}
        </Text>
      ) : null}
    </View>
  );
};
