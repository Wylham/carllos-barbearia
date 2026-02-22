import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ServiceForm } from "@/components/modals/ServiceForm";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { T } from "@/constants/theme";
import { useAppData } from "@/hooks/useAppData";
import { formatMoney } from "@/lib/date";
import { Service } from "@/types";

export default function ServicosScreen() {
  const { services, appointments, loading, addService, updateService, deleteService } = useAppData();

  const [formVisible, setFormVisible] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const activeServices = services.filter((s) => s.active);
  const inactiveServices = services.filter((s) => !s.active);
  const sortedServices = [...activeServices, ...inactiveServices];

  function openCreate() {
    setEditingService(null);
    setFormVisible(true);
  }

  function openEdit(s: Service) {
    setEditingService(s);
    setFormVisible(true);
  }

  async function handleSave(data: { name: string; price: number }) {
    if (editingService) {
      await updateService(editingService.id, data);
    } else {
      await addService(data);
    }
  }

  function openDelete(s: Service) {
    // Verifica se tem agendamentos ativos
    const hasActive = appointments.some(
      (a) => a.serviceId === s.id && a.status !== "cancelled"
    );
    if (hasActive) {
      Alert.alert(
        "Serviço em uso",
        `"${s.name}" possui agendamentos ativos e será desativado (não excluído).`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Desativar mesmo assim", style: "destructive", onPress: () => deleteService(s.id) },
        ]
      );
    } else {
      setDeleteTarget(s);
    }
  }

  async function handleDelete() {
    if (deleteTarget) {
      await deleteService(deleteTarget.id);
      setDeleteTarget(null);
    }
  }

  function renderItem({ item }: { item: Service }) {
    return (
      <View style={[styles.item, !item.active && styles.itemInactive]}>
        <View style={[styles.dot, !item.active && styles.dotInactive]} />
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, !item.active && styles.textInactive]}>
            {item.name}
            {!item.active ? " (inativo)" : ""}
          </Text>
          <Text style={[styles.itemPrice, !item.active && styles.textInactive]}>
            {formatMoney(item.price)}
          </Text>
        </View>
        <View style={styles.itemActions}>
          <Pressable
            onPress={() => openEdit(item)}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
            hitSlop={6}
          >
            <Ionicons name="create-outline" size={20} color={T.colors.textSecondary} />
          </Pressable>
          <Pressable
            onPress={() => openDelete(item)}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
            hitSlop={6}
          >
            <Ionicons name="trash-outline" size={20} color={T.colors.cancelled} />
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
          <Ionicons name="cut" size={22} color={T.colors.black} />
          <Text style={styles.headerTitle}>Serviços</Text>
        </View>
        <Button label="+ Novo" onPress={openCreate} size="sm" />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={T.colors.black} />
        </View>
      ) : (
        <>
          {/* Stats */}
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
              <Text style={[styles.statValue, { color: T.colors.textMuted }]}>
                {inactiveServices.length}
              </Text>
              <Text style={styles.statLabel}>Inativos</Text>
            </View>
          </View>

          {sortedServices.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="cut-outline" size={48} color={T.colors.border} />
              <Text style={styles.emptyTitle}>Nenhum serviço cadastrado</Text>
              <Button label="Criar primeiro serviço" onPress={openCreate} variant="secondary" />
            </View>
          ) : (
            <FlatList
              data={sortedServices}
              keyExtractor={(s) => s.id}
              renderItem={renderItem}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}

      <ServiceForm
        visible={formVisible}
        service={editingService}
        onSave={handleSave}
        onClose={() => setFormVisible(false)}
      />

      <ConfirmDialog
        visible={!!deleteTarget}
        title="Excluir serviço?"
        message={`"${deleteTarget?.name}" será permanentemente excluído.`}
        confirmLabel="Excluir"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
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
  list: {
    padding: T.spacing.md,
    gap: T.spacing.xs,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: T.spacing.sm,
    padding: T.spacing.md,
    backgroundColor: T.colors.surface,
    borderRadius: T.radius.md,
    borderWidth: 1,
    borderColor: T.colors.border,
  },
  itemInactive: { opacity: 0.6 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: T.radius.full,
    backgroundColor: T.colors.done,
  },
  dotInactive: { backgroundColor: T.colors.textMuted },
  itemInfo: { flex: 1, gap: 2 },
  itemName: {
    fontSize: T.fontSize.md,
    fontWeight: T.fontWeight.medium,
    color: T.colors.textPrimary,
  },
  itemPrice: {
    fontSize: T.fontSize.sm,
    color: T.colors.textSecondary,
  },
  textInactive: { color: T.colors.textMuted },
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
    color: T.colors.textSecondary,
    textAlign: "center",
  },
});
