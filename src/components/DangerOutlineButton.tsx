import React from 'react';

import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { useFocusRing } from '@dloizides/ui-buttons';
import { DISABLED_OPACITY, useUi } from '@dloizides/ui-feedback';

import { dangerInk } from '../utils/kitColors';

const MIN_HEIGHT = 48;
const PADDING_X = 16;
const RADIUS = 6;
const BORDER = 1;
const LABEL_SIZE = 15;
const LABEL_WEIGHT = '600';

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    borderRadius: RADIUS,
    borderWidth: BORDER,
    justifyContent: 'center',
    minHeight: MIN_HEIGHT,
    paddingHorizontal: PADDING_X,
  },
  label: { fontSize: LABEL_SIZE, fontWeight: LABEL_WEIGHT },
});

interface Props {
  label: string;
  accessibilityHint: string;
  onPress: () => void;
  disabled: boolean;
  loading: boolean;
  testID: string;
}

/** Outlined destructive action (red ink, 1 px border) so the card keeps a single filled control. */
export const DangerOutlineButton = ({
  label,
  accessibilityHint,
  onPress,
  disabled,
  loading,
  testID,
}: Props): React.ReactElement => {
  const { theme } = useUi();
  const ring = useFocusRing();
  const ink = dangerInk(theme);
  const inert = disabled || loading;

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: inert }}
      disabled={inert}
      style={[styles.root, { borderColor: ink }, ring.ringStyle, inert ? { opacity: DISABLED_OPACITY } : null]}
      testID={testID}
      onBlur={ring.onBlur}
      onFocus={ring.onFocus}
      onPress={onPress}
    >
      {loading ? <ActivityIndicator color={ink} /> : <Text style={[styles.label, { color: ink }]}>{label}</Text>}
    </Pressable>
  );
};
