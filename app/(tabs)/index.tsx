import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppColors, T } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { useAppData } from "@/hooks/useAppData";
import { formatMoney, isSameMonth, monthName, todayISO } from "@/lib/date";
import { AppointmentStatus } from "@/types";

function MetricCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        minWidth: "45%",
        backgroundColor: colors.surface,
        borderRadius: T.radius.lg,
        padding: T.spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        gap: T.spacing.xxs,
      }}
    >
      <Text
        style={{
          fontSize: T.fontSize.xxl,
          fontWeight: T.fontWeight.bold,
          color: color ?? colors.textPrimary,
        }}
      >
        {value}
      </Text>
      <Text style={{ fontSize: T.fontSize.sm, color: colors.textSecondary }}>{label}</Text>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: T.spacing.md,
      paddingTop: T.spacing.lg,
      paddingBottom: T.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    brandLabel: {
      fontSize: T.fontSize.xs,
      fontWeight: T.fontWeight.medium,
      color: colors.textMuted,
      letterSpacing: 3,
    },
    brandName: {
      fontSize: T.fontSize.xxl,
      fontWeight: T.fontWeight.extrabold,
      color: colors.textPrimary,
      letterSpacing: 2,
      marginTop: -2,
    },
    settingsBtn: { padding: T.spacing.xs },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    scroll: { flex: 1 },
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
      color: colors.textMuted,
      textTransform: "capitalize",
    },
    sectionTitle: {
      fontSize: T.fontSize.sm,
      fontWeight: T.fontWeight.semibold,
      color: colors.textMuted,
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
    metricsRow: {
      flexDirection: "row",
      gap: T.spacing.sm,
    },
    generalCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: T.radius.lg,
      padding: T.spacing.md,
      alignItems: "center",
      gap: T.spacing.xs,
      borderWidth: 1,
      borderColor: colors.border,
    },
    generalValue: {
      fontSize: T.fontSize.xl,
      fontWeight: T.fontWeight.bold,
      color: colors.textPrimary,
    },
    generalLabel: {
      fontSize: T.fontSize.xs,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 16,
    },
    monthlyHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: T.spacing.md,
      marginBottom: T.spacing.xs,
    },
    monthSelector: {
      flexDirection: "row",
      alignItems: "center",
      gap: T.spacing.sm,
      backgroundColor: colors.surface,
      borderRadius: T.radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: T.spacing.sm,
      paddingVertical: T.spacing.xs,
    },
    monthLabel: {
      fontSize: T.fontSize.sm,
      fontWeight: T.fontWeight.semibold,
      color: colors.textPrimary,
      minWidth: 110,
      textAlign: "center",
    },
    breakdown: {
      backgroundColor: colors.surface,
      borderRadius: T.radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: T.spacing.md,
      gap: T.spacing.sm,
      marginTop: T.spacing.xs,
    },
    breakdownTitle: {
      fontSize: T.fontSize.sm,
      fontWeight: T.fontWeight.semibold,
      color: colors.textSecondary,
      marginBottom: T.spacing.xs,
    },
    breakdownRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: T.spacing.sm,
    },
    breakdownDay: {
      fontSize: T.fontSize.sm,
      color: colors.textMuted,
      width: 40,
    },
    breakdownBar: {
      flex: 1,
      height: 6,
      borderRadius: T.radius.full,
      backgroundColor: colors.border,
      overflow: "hidden",
    },
    breakdownFill: {
      height: "100%",
      backgroundColor: colors.primaryAction,
      borderRadius: T.radius.full,
    },
    breakdownCount: {
      fontSize: T.fontSize.xs,
      color: colors.textMuted,
      width: 24,
      textAlign: "center",
    },
    breakdownRevenue: {
      fontSize: T.fontSize.sm,
      fontWeight: T.fontWeight.semibold,
      color: colors.textPrimary,
      width: 72,
      textAlign: "right",
    },
    monthEmpty: {
      padding: T.spacing.lg,
      alignItems: "center",
    },
    monthEmptyText: {
      fontSize: T.fontSize.sm,
      color: colors.textMuted,
      fontStyle: "italic",
    },
  });
}

export default function DashboardScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { appointments, services, barbers, loading } = useAppData();

  const today = new Date();
  const todayStr = todayISO();

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const todayAll = appointments.filter((a) => a.date === todayStr);
  const todayScheduled = todayAll.filter((a) => a.status === AppointmentStatus.SCHEDULED);
  const todayDone = todayAll.filter((a) => a.status === AppointmentStatus.DONE);
  const todayRevenue = todayDone.reduce((sum, a) => sum + a.price, 0);
  const todayCancelled = todayAll.filter((a) => a.status === AppointmentStatus.CANCELLED);

  const activeServices = services.filter((s) => s.active);
  const activeBarbers = barbers.filter((b) => b.active);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  const monthlyData = useMemo(() => {
    const monthly = appointments.filter((a) => isSameMonth(a.date, viewYear, viewMonth));
    const done = monthly.filter((a) => a.status === AppointmentStatus.DONE);
    const revenue = done.reduce((sum, a) => sum + a.price, 0);

    const byDay: Record<string, { count: number; revenue: number }> = {};
    done.forEach((a) => {
      if (!byDay[a.date]) byDay[a.date] = { count: 0, revenue: 0 };
      byDay[a.date].count += 1;
      byDay[a.date].revenue += a.price;
    });

    const days = Object.entries(byDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => {
        const d = date.split("-")[2];
        return { day: parseInt(d, 10), ...data, dateStr: date };
      });

    return { total: monthly.length, done: done.length, revenue, days };
  }, [appointments, viewYear, viewMonth]);

  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

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
          <Ionicons name="settings-outline" size={24} color={colors.textPrimary} />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryAction} />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Data */}
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
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
            <MetricCard label="Agendados" value={todayScheduled.length} color={colors.scheduled} />
            <MetricCard label="Concluídos" value={todayDone.length} color={colors.done} />
            <MetricCard label="Cancelados" value={todayCancelled.length} color={colors.cancelled} />
            <MetricCard label="Receita do dia" value={formatMoney(todayRevenue)} />
          </View>

          {/* Seção: Geral */}
          <Text style={styles.sectionTitle}>Geral</Text>
          <View style={styles.metricsRow}>
            <View style={styles.generalCard}>
              <Ionicons name="calendar" size={20} color={colors.textSecondary} />
              <Text style={styles.generalValue}>{appointments.length}</Text>
              <Text style={styles.generalLabel}>Agendamentos{"\n"}total</Text>
            </View>
            <View style={styles.generalCard}>
              <Ionicons name="cut" size={20} color={colors.textSecondary} />
              <Text style={styles.generalValue}>{activeServices.length}</Text>
              <Text style={styles.generalLabel}>Serviços{"\n"}ativos</Text>
            </View>
            <View style={styles.generalCard}>
              <Ionicons name="people" size={20} color={colors.textSecondary} />
              <Text style={styles.generalValue}>{activeBarbers.length}</Text>
              <Text style={styles.generalLabel}>Barbeiros{"\n"}ativos</Text>
            </View>
          </View>

          {/* Seção: Mensal */}
          <View style={styles.monthlyHeader}>
            <Text style={styles.sectionTitle}>Mensal</Text>
            <View style={styles.monthSelector}>
              <Pressable
                onPress={prevMonth}
                hitSlop={8}
                style={({ pressed }) => pressed && { opacity: 0.5 }}
              >
                <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
              </Pressable>
              <Text style={styles.monthLabel}>
                {monthName(viewMonth)} {viewYear}
                {isCurrentMonth ? " ●" : ""}
              </Text>
              <Pressable
                onPress={nextMonth}
                hitSlop={8}
                style={({ pressed }) => pressed && { opacity: 0.5 }}
              >
                <Ionicons name="chevron-forward" size={20} color={colors.textPrimary} />
              </Pressable>
            </View>
          </View>

          {/* Cards mensais */}
          <View style={styles.metricsGrid}>
            <MetricCard label="Atendimentos" value={monthlyData.total} />
            <MetricCard label="Concluídos" value={monthlyData.done} color={colors.done} />
            <MetricCard
              label="Receita do mês"
              value={formatMoney(monthlyData.revenue)}
              color={colors.textPrimary}
            />
            <MetricCard
              label="Ticket médio"
              value={
                monthlyData.done > 0
                  ? formatMoney(monthlyData.revenue / monthlyData.done)
                  : "—"
              }
            />
          </View>

          {/* Breakdown por dia */}
          {monthlyData.days.length > 0 && (
            <View style={styles.breakdown}>
              <Text style={styles.breakdownTitle}>Detalhamento por dia</Text>
              {monthlyData.days.map((d) => (
                <View key={d.dateStr} style={styles.breakdownRow}>
                  <Text style={styles.breakdownDay}>Dia {String(d.day).padStart(2, "0")}</Text>
                  <View style={styles.breakdownBar}>
                    <View
                      style={[
                        styles.breakdownFill,
                        {
                          width: `${Math.min((d.revenue / (monthlyData.revenue || 1)) * 100, 100)}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.breakdownCount}>{d.count}x</Text>
                  <Text style={styles.breakdownRevenue}>{formatMoney(d.revenue)}</Text>
                </View>
              ))}
            </View>
          )}

          {monthlyData.total === 0 && (
            <View style={styles.monthEmpty}>
              <Text style={styles.monthEmptyText}>Sem agendamentos em {monthName(viewMonth)}</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
