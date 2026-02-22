import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { T } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { AppointmentStatus, STATUS_LABEL } from "@/types";

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const { colors } = useTheme();

  const STATUS_COLOR: Record<AppointmentStatus, string> = {
    [AppointmentStatus.SCHEDULED]: colors.scheduled,
    [AppointmentStatus.DONE]: colors.done,
    [AppointmentStatus.CANCELLED]: colors.cancelled,
  };

  const color = STATUS_COLOR[status];

  return (
    <View style={[styles.badge, { borderColor: color + "40", backgroundColor: color + "18" }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{STATUS_LABEL[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: T.spacing.xs,
    paddingHorizontal: T.spacing.sm,
    paddingVertical: T.spacing.xxs + 1,
    borderRadius: T.radius.full,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: T.radius.full,
  },
  label: {
    fontSize: T.fontSize.xs,
    fontWeight: T.fontWeight.semibold,
    letterSpacing: 0.2,
  },
});
