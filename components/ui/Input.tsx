import { T } from "@/constants/theme";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from "react-native";

interface InputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
}

export function Input({ label, error, hint, containerStyle, ...props }: InputProps) {
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
        placeholderTextColor={T.colors.textMuted}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {hint && !error ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: T.spacing.xs,
  },
  label: {
    fontSize: T.fontSize.sm,
    fontWeight: T.fontWeight.medium,
    color: T.colors.textPrimary,
  },
  input: {
    backgroundColor: T.colors.bg,
    borderWidth: 1.5,
    borderColor: T.colors.border,
    borderRadius: T.radius.md,
    paddingHorizontal: T.spacing.md,
    paddingVertical: T.spacing.sm + 2,
    fontSize: T.fontSize.md,
    color: T.colors.textPrimary,
    minHeight: 44,
  },
  inputFocused: {
    borderColor: T.colors.black,
  },
  inputError: {
    borderColor: T.colors.error,
  },
  inputMultiline: {
    minHeight: 88,
    textAlignVertical: "top",
    paddingTop: T.spacing.sm + 2,
  },
  error: {
    fontSize: T.fontSize.xs,
    color: T.colors.error,
  },
  hint: {
    fontSize: T.fontSize.xs,
    color: T.colors.textMuted,
  },
});
