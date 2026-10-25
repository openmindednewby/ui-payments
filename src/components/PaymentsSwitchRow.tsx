import React, { useCallback, useRef } from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useFocusRing } from '@dloizides/ui-buttons';
import { DISABLED_OPACITY, useUi } from '@dloizides/ui-feedback';

import { useSpaceToggle } from '../hooks/useSpaceToggle';

const MIN_ROW_HEIGHT = 48;
const ROW_GAP = 12;
const ROW_PADDING = 8;
const ROW_RADIUS = 6;
const TRACK_WIDTH = 40;
const TRACK_HEIGHT = 24;
const THUMB_SIZE = 18;
const THUMB_INSET = 3;
const LABEL_SIZE = 15;
const DESCRIPTION_SIZE = 13;
const LABEL_WEIGHT = '600';

const styles = StyleSheet.create({
  description: { fontSize: DESCRIPTION_SIZE },
  label: { fontSize: LABEL_SIZE, fontWeight: LABEL_WEIGHT },
  row: {
    alignItems: 'center',
    borderRadius: ROW_RADIUS,
    flexDirection: 'row',
    gap: ROW_GAP,
    minHeight: MIN_ROW_HEIGHT,
    paddingVertical: ROW_PADDING,
  },
  text: { flex: 1, gap: 2 },
  thumb: { borderRadius: THUMB_SIZE / 2, height: THUMB_SIZE, width: THUMB_SIZE },
  track: {
    borderRadius: TRACK_HEIGHT / 2,
    height: TRACK_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: THUMB_INSET,
    width: TRACK_WIDTH,
  },
});

interface Props {
  label: string;
  description?: string;
  hint: string;
  value: boolean;
  disabled: boolean;
  onValueChange: (value: boolean) => void;
  testID: string;
}

/** The whole row is ONE switch: one tab stop, one focus ring, a 48 px tall hit box. */
export const PaymentsSwitchRow = ({
  label,
  description,
  hint,
  value,
  disabled,
  onValueChange,
  testID,
}: Props): React.ReactElement => {
  const { theme } = useUi();
  const ring = useFocusRing();
  const ref = useRef<View>(null);
  const toggle = useCallback((): void => {
    if (!disabled) onValueChange(!value);
  }, [disabled, onValueChange, value]);
  useSpaceToggle(ref, toggle, disabled);
  const trackColor = value ? theme.palette.primary['500'] : theme.colors.border;

  return (
    <Pressable
      ref={ref}
      accessibilityHint={hint}
      accessibilityLabel={label}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      aria-checked={value}
      disabled={disabled}
      role="switch"
      style={[styles.row, ring.ringStyle, disabled ? { opacity: DISABLED_OPACITY } : null]}
      testID={testID}
      onBlur={ring.onBlur}
      onFocus={ring.onFocus}
      onPress={toggle}
    >
      <View style={styles.text}>
        <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
        {description !== undefined && description !== '' ? (
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{description}</Text>
        ) : null}
      </View>
      <View style={[styles.track, { backgroundColor: trackColor }]} testID={`${testID}-track`}>
        <View
          style={[styles.thumb, { alignSelf: value ? 'flex-end' : 'flex-start', backgroundColor: theme.colors.surface }]}
        />
      </View>
    </Pressable>
  );
};
