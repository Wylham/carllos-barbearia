import React, { useMemo } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from "react-native";

import { AppColors, T } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

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

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    base: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: T.radius.md,
      borderWidth: 1.5,
      borderColor: "transparent",
    },
    fullWidth: { width: "100%" },
    pressed: { opacity: 0.75 },
    disabled: { opacity: 0.38 },

    primary: {
      backgroundColor: colors.primaryAction,
      borderColor: colors.primaryAction,
    },
    secondary: {
      backgroundColor: "transparent",
      borderColor: colors.primaryAction,
    },
    ghost: {
      backgroundColor: "transparent",
      borderColor: "transparent",
    },
    danger: {
      backgroundColor: colors.error,
      borderColor: colors.error,
    },

    size_sm: { paddingVertical: T.spacing.xs, paddingHorizontal: T.spacing.sm, minHeight: 32 },
    size_md: { paddingVertical: T.spacing.sm + 2, paddingHorizontal: T.spacing.md, minHeight: 44 },
    size_lg: { paddingVertical: T.spacing.md, paddingHorizontal: T.spacing.lg, minHeight: 52 },

    label: {
      fontWeight: T.fontWeight.semibold,
      letterSpacing: 0.2,
    },
    labelVariant_primary: { color: colors.primaryActionText },
    labelVariant_secondary: { color: colors.primaryAction },
    labelVariant_ghost: { color: colors.textPrimary },
    labelVariant_danger: { color: colors.white },

    labelSize_sm: { fontSize: T.fontSize.sm },
    labelSize_md: { fontSize: T.fontSize.md },
    labelSize_lg: { fontSize: T.fontSize.lg },
  });
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
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
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
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? colors.primaryActionText : colors.primaryAction}
        />
      ) : (
        <Text style={[styles.label, styles[`labelVariant_${variant}`], styles[`labelSize_${size}`]]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
