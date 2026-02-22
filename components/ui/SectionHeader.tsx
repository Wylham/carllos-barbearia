import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

import { T } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  style?: ViewStyle;
}

export function SectionHeader({ title, subtitle, right, style }: SectionHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.textGroup}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text> : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: T.spacing.xs,
  },
  textGroup: {
    flex: 1,
    gap: T.spacing.xxs,
  },
  title: {
    fontSize: T.fontSize.lg,
    fontWeight: T.fontWeight.bold,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: T.fontSize.sm,
  },
  right: {
    marginLeft: T.spacing.sm,
  },
});
