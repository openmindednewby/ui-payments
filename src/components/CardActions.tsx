import React, { useCallback, useState } from 'react';

import { StyleSheet, View } from 'react-native';

import { Button } from '@dloizides/ui-buttons';
import { ConfirmDialog } from '@dloizides/ui-feedback';

import { DangerOutlineButton } from './DangerOutlineButton';

import type { StripeCredentialsCardProps } from '../types';

const GAP = 8;

const styles = StyleSheet.create({
  column: { gap: GAP },
  row: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: GAP },
});

interface Props {
  card: StripeCredentialsCardProps;
  canSave: boolean;
  save: () => void | Promise<unknown>;
  wide: boolean;
  locked: boolean;
  hint: (normal: string) => string;
}

/** Save (the one filled control), Test, and an outlined Clear behind a confirm step. */
export const CardActions = ({ card, canSave, save, wide, locked, hint }: Props): React.ReactElement | null => {
  const { connection, labels, onClear, onTest, testID = 'stripe' } = card;
  const [confirming, setConfirming] = useState(false);
  const askClear = useCallback((): void => setConfirming(true), []);
  const cancelClear = useCallback((): void => setConfirming(false), []);
  const confirmClear = useCallback((): void => {
    setConfirming(false);
    void onClear?.();
  }, [onClear]);
  const showSave = card.hideSave !== true;
  const showTest = onTest !== undefined && connection.configured;
  const showClear = onClear !== undefined && connection.configured;
  if (!showSave && !showTest && !showClear) return null;

  const secondary =
    showTest || showClear ? (
      <View style={styles.row}>
        {showTest ? (
          <Button
            accessibilityHint={hint(labels.testHint)}
            accessibilityLabel={labels.test}
            disabled={locked}
            label={labels.test}
            loading={card.testing ?? false}
            testID={`${testID}-test`}
            variant="outline"
            onPress={onTest}
          />
        ) : null}
        {showClear ? (
          <DangerOutlineButton
            accessibilityHint={hint(labels.clearHint)}
            disabled={locked}
            label={labels.clear}
            loading={card.clearing ?? false}
            testID={`${testID}-clear`}
            onPress={askClear}
          />
        ) : null}
      </View>
    ) : null;

  return (
    <View style={wide ? styles.row : styles.column}>
      {showSave ? (
        <Button
          accessibilityHint={hint(labels.saveHint)}
          accessibilityLabel={labels.save}
          disabled={!canSave || locked}
          fullWidth={!wide}
          label={labels.save}
          loading={card.saving ?? false}
          testID={`${testID}-save`}
          variant={card.saveVariant ?? 'primary'}
          onPress={save}
        />
      ) : null}
      {secondary}
      {showClear ? (
        <ConfirmDialog
          destructive
          cancelLabel={labels.clearCancel}
          confirmLabel={labels.clearConfirmAction}
          message={labels.clearConfirmMessage}
          title={labels.clearConfirmTitle}
          visible={confirming}
          onCancel={cancelClear}
          onConfirm={confirmClear}
        />
      ) : null}
    </View>
  );
};
