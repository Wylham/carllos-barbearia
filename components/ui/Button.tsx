import { T } from "@/constants/theme";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from "react-native";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === "primary" ? T.colors.white : T.colors.black} />
      ) : (
        <Text style={[styles.label, styles[`labelVariant_${variant}`], styles[`labelSize_${size}`]]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: T.radius.md,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  fullWidth: {
    width: "100%",
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.38,
  },

  // Variants
  primary: {
    backgroundColor: T.colors.black,
    borderColor: T.colors.black,
  },
  secondary: {
    backgroundColor: T.colors.white,
    borderColor: T.colors.black,
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  danger: {
    backgroundColor: T.colors.error,
    borderColor: T.colors.error,
  },

  // Sizes
  size_sm: { paddingVertical: T.spacing.xs, paddingHorizontal: T.spacing.sm, minHeight: 32 },
  size_md: { paddingVertical: T.spacing.sm + 2, paddingHorizontal: T.spacing.md, minHeight: 44 },
  size_lg: { paddingVertical: T.spacing.md, paddingHorizontal: T.spacing.lg, minHeight: 52 },

  // Labels
  label: {
    fontWeight: T.fontWeight.semibold,
    letterSpacing: 0.2,
  },
  labelVariant_primary: { color: T.colors.white },
  labelVariant_secondary: { color: T.colors.black },
  labelVariant_ghost: { color: T.colors.black },
  labelVariant_danger: { color: T.colors.white },

  labelSize_sm: { fontSize: T.fontSize.sm },
  labelSize_md: { fontSize: T.fontSize.md },
  labelSize_lg: { fontSize: T.fontSize.lg },
});
