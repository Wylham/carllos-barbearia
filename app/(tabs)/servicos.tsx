import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { T } from "@/constants/theme";
import { useAppData } from "@/hooks/useAppData";
import { formatMoney } from "@/lib/date";

export default function ServicosScreen() {
  const { services, loading } = useAppData();

  const activeServices = services.filter((s) => s.active);
  const inactiveServices = services.filter((s) => !s.active);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="cut" size={22} color={T.colors.black} />
          <Text style={styles.headerTitle}>Serviços</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={T.colors.black} />
        </View>
      ) : (
        <View style={styles.content}>
          {/* Contagens */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{services.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={[styles.statBox, styles.statBoxDivider]}>
              <Text style={[styles.statValue, { color: T.colors.done }]}>{activeServices.length}</Text>
              <Text style={styles.statLabel}>Ativos</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: T.colors.textMuted }]}>{inactiveServices.length}</Text>
              <Text style={styles.statLabel}>Inativos</Text>
            </View>
          </View>

          {/* Lista simples (FASE 3 terá CRUD completo) */}
          {activeServices.length === 0 ? (
            <View style={styles.placeholder}>
              <Ionicons name="cut-outline" size={48} color={T.colors.border} />
              <Text style={styles.placeholderTitle}>Nenhum serviço ativo</Text>
              <Text style={styles.placeholderSub}>FASE 3 — CRUD completo em breve</Text>
            </View>
          ) : (
            <View style={styles.list}>
              {activeServices.map((s) => (
                <View key={s.id} style={styles.listItem}>
                  <View style={styles.listDot} />
                  <Text style={styles.listName}>{s.name}</Text>
                  <Text style={styles.listPrice}>{formatMoney(s.price)}</Text>
                </View>
              ))}
              {inactiveServices.map((s) => (
                <View key={s.id} style={[styles.listItem, styles.listItemInactive]}>
                  <View style={[styles.listDot, styles.listDotInactive]} />
                  <Text style={[styles.listName, styles.listNameInactive]}>{s.name} (inativo)</Text>
                  <Text style={[styles.listPrice, styles.listNameInactive]}>{formatMoney(s.price)}</Text>
                </View>
              ))}
            </View>
          )}
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
  list: {
    padding: T.spacing.md,
    gap: T.spacing.xs,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: T.spacing.sm + 2,
    paddingHorizontal: T.spacing.md,
    backgroundColor: T.colors.surface,
    borderRadius: T.radius.md,
    borderWidth: 1,
    borderColor: T.colors.border,
    gap: T.spacing.sm,
  },
  listItemInactive: {
    opacity: 0.5,
  },
  listDot: {
    width: 8,
    height: 8,
    borderRadius: T.radius.full,
    backgroundColor: T.colors.done,
  },
  listDotInactive: {
    backgroundColor: T.colors.textMuted,
  },
  listName: {
    flex: 1,
    fontSize: T.fontSize.md,
    fontWeight: T.fontWeight.medium,
    color: T.colors.textPrimary,
  },
  listNameInactive: {
    color: T.colors.textMuted,
  },
  listPrice: {
    fontSize: T.fontSize.md,
    fontWeight: T.fontWeight.semibold,
    color: T.colors.textPrimary,
  },
});
