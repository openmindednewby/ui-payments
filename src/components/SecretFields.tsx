import React from "react";

import { StyleSheet, Text, View } from "react-native";

import { useUi } from "@dloizides/ui-feedback";
import { FormField } from "@dloizides/ui-forms";

import {
  isSecretKeyAcceptable,
  isWebhookSecretAcceptable,
} from "../utils/stripeConnection";

import type { StripeCredentialsDraft, StripeCredentialsLabels } from "../types";

const GAP = 16;
const HELPER_GAP = 4;
const HELP_FONT_SIZE = 13;

const styles = StyleSheet.create({
  help: { fontSize: HELP_FONT_SIZE },
  helperGroup: { gap: HELPER_GAP },
  root: { gap: GAP },
  tightField: { marginBottom: 0 },
});

interface Props {
  labels: StripeCredentialsLabels;
  draft: StripeCredentialsDraft;
  configured: boolean;
  locked: boolean;
  setSecretKey: (value: string) => void;
  setWebhookSecret: (value: string) => void;
  testID: string;
}

/** The two never-prefilled secret inputs; when configured, one helper line says blank keeps the stored value. */
export const SecretFields = ({
  labels,
  draft,
  configured,
  locked,
  setSecretKey,
  setWebhookSecret,
  testID,
}: Props): React.ReactElement => {
  const { theme } = useUi();
  const keepHelper = configured ? labels.keepHelper : undefined;
  const showHelper = keepHelper !== undefined && keepHelper !== "";

  return (
    <View style={styles.root}>
      <FormField
        accessibilityHint={labels.secretKeyHint}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!locked}
        error={
          isSecretKeyAcceptable(draft.secretKey)
            ? undefined
            : labels.secretKeyInvalid
        }
        label={labels.secretKey}
        placeholder={
          configured
            ? labels.secretKeyKeepPlaceholder
            : labels.secretKeyPlaceholder
        }
        secureTextEntry={draft.secretKey !== ""}
        testID={`${testID}-secret-key`}
        value={draft.secretKey}
        onChangeText={setSecretKey}
      />
      <View style={styles.helperGroup}>
        <FormField
          accessibilityHint={labels.webhookSecretHint}
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={showHelper ? styles.tightField : undefined}
          editable={!locked}
          error={
            isWebhookSecretAcceptable(draft.webhookSecret)
              ? undefined
              : labels.webhookSecretInvalid
          }
          label={labels.webhookSecret}
          placeholder={
            configured
              ? labels.webhookSecretKeepPlaceholder
              : labels.webhookSecretPlaceholder
          }
          secureTextEntry={draft.webhookSecret !== ""}
          testID={`${testID}-webhook-secret`}
          value={draft.webhookSecret}
          onChangeText={setWebhookSecret}
        />
        {showHelper ? (
          <Text
            style={[styles.help, { color: theme.colors.textSecondary }]}
            testID={`${testID}-keep-helper`}
          >
            {keepHelper}
          </Text>
        ) : null}
      </View>
    </View>
  );
};
