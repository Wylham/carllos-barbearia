import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { T } from "@/constants/theme";
import { useAppData } from "@/hooks/useAppData";
import { todayISO } from "@/lib/date";
import { AppointmentStatus } from "@/types";

export default function AgendaScreen() {
  const { appointments, loading } = useAppData();

  const todayStr = todayISO();
  const todayCount = appointments.filter((a) => a.date === todayStr).length;
  const totalCount = appointments.length;
  const scheduledCount = appointments.filter((a) => a.status === AppointmentStatus.SCHEDULED).length;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="calendar" size={22} color={T.colors.black} />
          <Text style={styles.headerTitle}>Agenda</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={T.colors.black} />
        </View>
      ) : (
        <View style={styles.content}>
          {/* Contagens rápidas */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{todayCount}</Text>
              <Text style={styles.statLabel}>Hoje</Text>
            </View>
            <View style={[styles.statBox, styles.statBoxDivider]}>
              <Text style={styles.statValue}>{scheduledCount}</Text>
              <Text style={styles.statLabel}>Pendentes</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalCount}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>

          {/* Placeholder FASE 3 */}
          <View style={styles.placeholder}>
            <Ionicons name="calendar-outline" size={48} color={T.colors.border} />
            <Text style={styles.placeholderTitle}>
              {totalCount === 0 ? "Nenhum agendamento ainda" : `${todayCount} agendamento(s) hoje`}
            </Text>
            <Text style={styles.placeholderSub}>FASE 3 — lista e formulário completos em breve</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: T.spacing.md,
    paddingTop: T.spacing.lg,
    paddingBottom: T.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: T.colors.border,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: T.spacing.sm },
  headerTitle: {
    fontSize: T.fontSize.xl,
    fontWeight: T.fontWeight.bold,
    color: T.colors.textPrimary,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { flex: 1 },
  statsRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: T.colors.border,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: T.spacing.md,
    gap: T.spacing.xxs,
  },
  statBoxDivider: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: T.colors.border,
  },
  statValue: {
    fontSize: T.fontSize.xxl,
    fontWeight: T.fontWeight.bold,
    color: T.colors.textPrimary,
  },
  statLabel: {
    fontSize: T.fontSize.xs,
    color: T.colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: T.spacing.xl,
    gap: T.spacing.sm,
  },
  placeholderTitle: {
    fontSize: T.fontSize.lg,
    fontWeight: T.fontWeight.semibold,
    color: T.colors.textSecondary,
    textAlign: "center",
  },
  placeholderSub: {
    fontSize: T.fontSize.sm,
    color: T.colors.textMuted,
    textAlign: "center",
  },
});
