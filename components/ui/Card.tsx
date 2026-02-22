import { T } from "@/constants/theme";
import React from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: keyof typeof T.spacing;
}

export function Card({ children, onPress, style, padding = "md" }: CardProps) {
  const inner = <View style={[styles.card, { padding: T.spacing[padding] }, style]}>{children}</View>;

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
        {inner}
      </Pressable>
    );
  }

  return inner;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: T.colors.bg,
    borderRadius: T.radius.lg,
    borderWidth: 1,
    borderColor: T.colors.border,
    ...T.shadow.sm,
  },
  pressed: {
    opacity: 0.8,
  },
});
