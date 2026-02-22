import React from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { T } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: keyof typeof T.spacing;
}

export function Card({ children, onPress, style, padding = "md" }: CardProps) {
  const { colors } = useTheme();

  const inner = (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.bg, borderColor: colors.border },
        { padding: T.spacing[padding] },
        style,
      ]}
    >
      {children}
    </View>
  );

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
    borderRadius: T.radius.lg,
    borderWidth: 1,
    ...T.shadow.sm,
  },
  pressed: { opacity: 0.8 },
});
