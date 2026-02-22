import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { BarberForm } from "@/components/modals/BarberForm";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { AppColors, T } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { useAppData } from "@/hooks/useAppData";
import { Barber } from "@/types";

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
    headerLeft: { flexDirection: "row", alignItems: "center", gap: T.spacing.sm },
    headerTitle: {
      fontSize: T.fontSize.xl,
      fontWeight: T.fontWeight.bold,
      color: colors.textPrimary,
    },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    statsRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
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
      borderColor: colors.border,
    },
    statValue: {
      fontSize: T.fontSize.xxl,
      fontWeight: T.fontWeight.bold,
      color: colors.textPrimary,
    },
    statLabel: {
      fontSize: T.fontSize.xs,
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    list: {
      padding: T.spacing.md,
      gap: T.spacing.xs,
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      gap: T.spacing.sm,
      padding: T.spacing.sm,
      paddingHorizontal: T.spacing.md,
      backgroundColor: colors.surface,
      borderRadius: T.radius.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    itemInactive: { opacity: 0.6 },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: T.radius.full,
      backgroundColor: colors.primaryAction,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarInactive: { backgroundColor: colors.textMuted },
    avatarLetter: {
      fontSize: T.fontSize.lg,
      fontWeight: T.fontWeight.bold,
      color: colors.primaryActionText,
    },
    itemInfo: { flex: 1, gap: 2 },
    itemName: {
      fontSize: T.fontSize.md,
      fontWeight: T.fontWeight.medium,
      color: colors.textPrimary,
    },
    itemStatus: {
      fontSize: T.fontSize.xs,
      color: colors.done,
    },
    textInactive: { color: colors.textMuted },
    itemActions: { flexDirection: "row", gap: T.spacing.xs },
    iconBtn: {
      padding: T.spacing.xs,
      borderRadius: T.radius.sm,
    },
    pressed: { opacity: 0.6 },
    empty: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: T.spacing.md,
      padding: T.spacing.xl,
    },
    emptyTitle: {
      fontSize: T.fontSize.lg,
      fontWeight: T.fontWeight.semibold,
      color: colors.textSecondary,
      textAlign: "center",
    },
  });
}

export default function BarbeirosScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { barbers, loading, addBarber, updateBarber, deleteBarber } = useAppData();

  const [formVisible, setFormVisible] = useState(false);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Barber | null>(null);

  const activeBarbers = barbers.filter((b) => b.active);
  const inactiveBarbers = barbers.filter((b) => !b.active);
  const sortedBarbers = [...activeBarbers, ...inactiveBarbers];

  function openCreate() {
    setEditingBarber(null);
    setFormVisible(true);
  }

  function openEdit(b: Barber) {
    setEditingBarber(b);
    setFormVisible(true);
  }

  async function handleSave(data: { name: string; active: boolean }) {
    if (editingBarber) {
      await updateBarber(editingBarber.id, data);
    } else {
      await addBarber({ ...data });
    }
  }

  async function handleToggleActive(b: Barber) {
    await updateBarber(b.id, { active: !b.active });
  }

  async function handleDelete() {
    if (deleteTarget) {
      await deleteBarber(deleteTarget.id);
      setDeleteTarget(null);
    }
  }

  function renderItem({ item }: { item: Barber }) {
    return (
      <View style={[styles.item, !item.active && styles.itemInactive]}>
        {/* Avatar */}
        <View style={[styles.avatar, !item.active && styles.avatarInactive]}>
          <Text style={styles.avatarLetter}>{item.name.charAt(0).toUpperCase()}</Text>
        </View>

        {/* Info */}
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, !item.active && styles.textInactive]}>
            {item.name}
          </Text>
          <Text style={[styles.itemStatus, !item.active && { color: colors.textMuted }]}>
            {item.active ? "● Ativo" : "○ Inativo"}
          </Text>
        </View>

        {/* Ações */}
        <View style={styles.itemActions}>
          <Pressable
            onPress={() => handleToggleActive(item)}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
            hitSlop={6}
          >
            <Ionicons
              name={item.active ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
          <Pressable
            onPress={() => openEdit(item)}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
            hitSlop={6}
          >
            <Ionicons name="create-outline" size={20} color={colors.textSecondary} />
          </Pressable>
          <Pressable
            onPress={() => setDeleteTarget(item)}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
            hitSlop={6}
          >
            <Ionicons name="trash-outline" size={20} color={colors.cancelled} />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="people" size={22} color={colors.primaryAction} />
          <Text style={styles.headerTitle}>Barbeiros</Text>
        </View>
        <Button label="+ Novo" onPress={openCreate} size="sm" />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primaryAction} />
        </View>
      ) : (
        <>
          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{barbers.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={[styles.statBox, styles.statBoxDivider]}>
              <Text style={[styles.statValue, { color: colors.done }]}>{activeBarbers.length}</Text>
              <Text style={styles.statLabel}>Ativos</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: colors.textMuted }]}>
                {inactiveBarbers.length}
              </Text>
              <Text style={styles.statLabel}>Inativos</Text>
            </View>
          </View>

          {sortedBarbers.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="people-outline" size={48} color={colors.border} />
              <Text style={styles.emptyTitle}>Nenhum barbeiro cadastrado</Text>
              <Button label="Criar primeiro barbeiro" onPress={openCreate} variant="secondary" />
            </View>
          ) : (
            <FlatList
              data={sortedBarbers}
              keyExtractor={(b) => b.id}
              renderItem={renderItem}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}

      <BarberForm
        visible={formVisible}
        barber={editingBarber}
        onSave={handleSave}
        onClose={() => setFormVisible(false)}
      />

      <ConfirmDialog
        visible={!!deleteTarget}
        title="Excluir barbeiro?"
        message={`"${deleteTarget?.name}" será permanentemente excluído. Agendamentos vinculados permanecem no histórico.`}
        confirmLabel="Excluir"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </SafeAreaView>
  );
}
