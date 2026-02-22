import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { T } from "@/constants/theme";
import { useAppData } from "@/hooks/useAppData";

export default function BarbeirosScreen() {
  const { barbers, loading } = useAppData();

  const activeBarbers = barbers.filter((b) => b.active);
  const inactiveBarbers = barbers.filter((b) => !b.active);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="people" size={22} color={T.colors.black} />
          <Text style={styles.headerTitle}>Barbeiros</Text>
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
              <Text style={styles.statValue}>{barbers.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={[styles.statBox, styles.statBoxDivider]}>
              <Text style={[styles.statValue, { color: T.colors.done }]}>{activeBarbers.length}</Text>
              <Text style={styles.statLabel}>Ativos</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: T.colors.textMuted }]}>{inactiveBarbers.length}</Text>
              <Text style={styles.statLabel}>Inativos</Text>
            </View>
          </View>

          {/* Lista simples */}
          {activeBarbers.length === 0 ? (
            <View style={styles.placeholder}>
              <Ionicons name="people-outline" size={48} color={T.colors.border} />
              <Text style={styles.placeholderTitle}>Nenhum barbeiro ativo</Text>
              <Text style={styles.placeholderSub}>FASE 3 — CRUD completo em breve</Text>
            </View>
          ) : (
            <View style={styles.list}>
              {activeBarbers.map((b) => (
                <View key={b.id} style={styles.listItem}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarLetter}>{b.name.charAt(0).toUpperCase()}</Text>
                  </View>
                  <Text style={styles.listName}>{b.name}</Text>
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>Ativo</Text>
                  </View>
                </View>
              ))}
              {inactiveBarbers.map((b) => (
                <View key={b.id} style={[styles.listItem, styles.listItemInactive]}>
                  <View style={[styles.avatar, styles.avatarInactive]}>
                    <Text style={styles.avatarLetter}>{b.name.charAt(0).toUpperCase()}</Text>
                  </View>
                  <Text style={[styles.listName, styles.listNameInactive]}>{b.name}</Text>
                  <View style={styles.inactiveBadge}>
                    <Text style={styles.inactiveBadgeText}>Inativo</Text>
                  </View>
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
    paddingVertical: T.spacing.sm,
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
  avatar: {
    width: 36,
    height: 36,
    borderRadius: T.radius.full,
    backgroundColor: T.colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInactive: {
    backgroundColor: T.colors.textMuted,
  },
  avatarLetter: {
    fontSize: T.fontSize.md,
    fontWeight: T.fontWeight.bold,
    color: T.colors.white,
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
  activeBadge: {
    paddingHorizontal: T.spacing.sm,
    paddingVertical: T.spacing.xxs,
    backgroundColor: T.colors.done + "20",
    borderRadius: T.radius.full,
    borderWidth: 1,
    borderColor: T.colors.done + "40",
  },
  activeBadgeText: {
    fontSize: T.fontSize.xs,
    fontWeight: T.fontWeight.medium,
    color: T.colors.done,
  },
  inactiveBadge: {
    paddingHorizontal: T.spacing.sm,
    paddingVertical: T.spacing.xxs,
    backgroundColor: T.colors.surfaceAlt,
    borderRadius: T.radius.full,
    borderWidth: 1,
    borderColor: T.colors.border,
  },
  inactiveBadgeText: {
    fontSize: T.fontSize.xs,
    color: T.colors.textMuted,
  },
});
