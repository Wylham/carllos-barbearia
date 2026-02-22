import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { T } from "@/constants/theme";
import { useAppData } from "@/hooks/useAppData";
import { formatMoney, todayISO } from "@/lib/date";
import { AppointmentStatus } from "@/types";

function MetricCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={[styles.metricValue, color ? { color } : null]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const { appointments, services, barbers, loading } = useAppData();

  const today = new Date();
  const todayStr = todayISO();

  const todayAll = appointments.filter((a) => a.date === todayStr);
  const todayScheduled = todayAll.filter((a) => a.status === AppointmentStatus.SCHEDULED);
  const todayDone = todayAll.filter((a) => a.status === AppointmentStatus.DONE);
  const todayRevenue = todayDone.reduce((sum, a) => sum + a.price, 0);
  const todayCancelled = todayAll.filter((a) => a.status === AppointmentStatus.CANCELLED);

  const activeServices = services.filter((s) => s.active);
  const activeBarbers = barbers.filter((b) => b.active);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandLabel}>BARBEARIA</Text>
          <Text style={styles.brandName}>CARLLOS</Text>
        </View>
        <Pressable
          onPress={() => router.push("/settings")}
          style={({ pressed }) => [styles.settingsBtn, pressed && { opacity: 0.6 }]}
          hitSlop={8}
        >
          <Ionicons name="settings-outline" size={24} color={T.colors.textPrimary} />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={T.colors.black} />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Data de hoje */}
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={14} color={T.colors.textMuted} />
            <Text style={styles.dateText}>
              {today.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
              })}
            </Text>
          </View>

          {/* Seção: Hoje */}
          <Text style={styles.sectionTitle}>Hoje</Text>
          <View style={styles.metricsGrid}>
            <MetricCard label="Agendados" value={todayScheduled.length} color={T.colors.scheduled} />
            <MetricCard label="Concluídos" value={todayDone.length} color={T.colors.done} />
            <MetricCard label="Cancelados" value={todayCancelled.length} color={T.colors.cancelled} />
            <MetricCard label="Receita do dia" value={formatMoney(todayRevenue)} color={T.colors.textPrimary} />
          </View>

          {/* Seção: Totais gerais */}
          <Text style={styles.sectionTitle}>Geral</Text>
          <View style={styles.metricsRow}>
            <View style={styles.generalCard}>
              <Ionicons name="calendar" size={20} color={T.colors.textSecondary} />
              <Text style={styles.generalValue}>{appointments.length}</Text>
              <Text style={styles.generalLabel}>Agendamentos{"\n"}total</Text>
            </View>
            <View style={styles.generalCard}>
              <Ionicons name="cut" size={20} color={T.colors.textSecondary} />
              <Text style={styles.generalValue}>{activeServices.length}</Text>
              <Text style={styles.generalLabel}>Serviços{"\n"}ativos</Text>
            </View>
            <View style={styles.generalCard}>
              <Ionicons name="people" size={20} color={T.colors.textSecondary} />
              <Text style={styles.generalValue}>{activeBarbers.length}</Text>
              <Text style={styles.generalLabel}>Barbeiros{"\n"}ativos</Text>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: T.colors.bg,
  },
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
  brandLabel: {
    fontSize: T.fontSize.xs,
    fontWeight: T.fontWeight.medium,
    color: T.colors.textMuted,
    letterSpacing: 3,
  },
  brandName: {
    fontSize: T.fontSize.xxl,
    fontWeight: T.fontWeight.extrabold,
    color: T.colors.black,
    letterSpacing: 2,
    marginTop: -2,
  },
  settingsBtn: {
    padding: T.spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: T.spacing.md,
    paddingBottom: T.spacing.xxl,
    gap: T.spacing.sm,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: T.spacing.xs,
    marginBottom: T.spacing.xs,
  },
  dateText: {
    fontSize: T.fontSize.sm,
    color: T.colors.textMuted,
    textTransform: "capitalize",
  },
  sectionTitle: {
    fontSize: T.fontSize.sm,
    fontWeight: T.fontWeight.semibold,
    color: T.colors.textMuted,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: T.spacing.md,
    marginBottom: T.spacing.xs,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: T.spacing.sm,
  },
  metricCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: T.colors.surface,
    borderRadius: T.radius.lg,
    padding: T.spacing.md,
    borderWidth: 1,
    borderColor: T.colors.border,
    gap: T.spacing.xxs,
  },
  metricValue: {
    fontSize: T.fontSize.xxl,
    fontWeight: T.fontWeight.bold,
    color: T.colors.textPrimary,
  },
  metricLabel: {
    fontSize: T.fontSize.sm,
    color: T.colors.textSecondary,
  },
  metricsRow: {
    flexDirection: "row",
    gap: T.spacing.sm,
  },
  generalCard: {
    flex: 1,
    backgroundColor: T.colors.surface,
    borderRadius: T.radius.lg,
    padding: T.spacing.md,
    alignItems: "center",
    gap: T.spacing.xs,
    borderWidth: 1,
    borderColor: T.colors.border,
  },
  generalValue: {
    fontSize: T.fontSize.xl,
    fontWeight: T.fontWeight.bold,
    color: T.colors.textPrimary,
  },
  generalLabel: {
    fontSize: T.fontSize.xs,
    color: T.colors.textSecondary,
    textAlign: "center",
    lineHeight: 16,
  },
});
