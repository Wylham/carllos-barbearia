import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from "react-native";

import { AppColors, T } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

interface InputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: { gap: T.spacing.xs },
    label: {
      fontSize: T.fontSize.sm,
      fontWeight: T.fontWeight.medium,
      color: colors.textPrimary,
    },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: T.radius.md,
      paddingHorizontal: T.spacing.md,
      paddingVertical: T.spacing.sm + 2,
      fontSize: T.fontSize.md,
      color: colors.textPrimary,
      minHeight: 44,
    },
    inputFocused: { borderColor: colors.primaryAction },
    inputError: { borderColor: colors.error },
    inputMultiline: {
      minHeight: 88,
      textAlignVertical: "top",
      paddingTop: T.spacing.sm + 2,
    },
    error: { fontSize: T.fontSize.xs, color: colors.error },
    hint: { fontSize: T.fontSize.xs, color: colors.textMuted },
  });
}

export function Input({ label, error, hint, containerStyle, ...props }: InputProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        {...props}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        style={[
          styles.input,
          focused && styles.inputFocused,
          !!error && styles.inputError,
          props.multiline && styles.inputMultiline,
        ]}
        placeholderTextColor={colors.textMuted}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {hint && !error ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}
