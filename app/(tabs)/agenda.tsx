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

import { AppointmentCard } from "@/components/AppointmentCard";
import { AppointmentForm } from "@/components/modals/AppointmentForm";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { T } from "@/constants/theme";
import { useAppData } from "@/hooks/useAppData";
import { formatDate, todayISO, toISODate, weekdayShort } from "@/lib/date";
import { Appointment, AppointmentStatus } from "@/types";

type Filter = "all" | AppointmentStatus;

const FILTERS: { label: string; value: Filter }[] = [
  { label: "Todos", value: "all" },
  { label: "Agendados", value: AppointmentStatus.SCHEDULED },
  { label: "Concluídos", value: AppointmentStatus.DONE },
  { label: "Cancelados", value: AppointmentStatus.CANCELLED },
];

function offsetDate(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return toISODate(dt);
}

export default function AgendaScreen() {
  const {
    appointments, services, barbers, loading,
    addAppointment, updateAppointment, deleteAppointment, hasConflict,
  } = useAppData();

  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [filter, setFilter] = useState<Filter>("all");
  const [formVisible, setFormVisible] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const todayStr = todayISO();

  const dayAppointments = useMemo(() => {
    return appointments
      .filter((a) => {
        if (a.date !== selectedDate) return false;
        if (filter !== "all" && a.status !== filter) return false;
        return true;
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [appointments, selectedDate, filter]);

  const allDayCount = appointments.filter((a) => a.date === selectedDate).length;

  function openCreate() {
    setEditingAppointment(null);
    setFormVisible(true);
  }

  function openEdit(a: Appointment) {
    setEditingAppointment(a);
    setFormVisible(true);
  }

  async function handleSave(data: Omit<Appointment, "id" | "createdAt">) {
    if (editingAppointment) {
      await updateAppointment(editingAppointment.id, data);
    } else {
      await addAppointment(data);
    }
  }

  async function handleMarkDone(id: string) {
    await updateAppointment(id, { status: AppointmentStatus.DONE });
  }

  async function handleCancel(id: string) {
    await updateAppointment(id, { status: AppointmentStatus.CANCELLED });
  }

  async function handleDelete() {
    if (deleteTargetId) {
      await deleteAppointment(deleteTargetId);
      setDeleteTargetId(null);
    }
  }

  const isToday = selectedDate === todayStr;
  const displayDate = isToday
    ? `Hoje, ${formatDate(selectedDate)}`
    : `${weekdayShort(selectedDate)}, ${formatDate(selectedDate)}`;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="calendar" size={22} color={T.colors.black} />
          <Text style={styles.headerTitle}>Agenda</Text>
        </View>
        <Pressable
          onPress={openCreate}
          style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.7 }]}
        >
          <Ionicons name="add" size={22} color={T.colors.white} />
        </Pressable>
      </View>

      {/* Seletor de data */}
      <View style={styles.dateNav}>
        <Pressable
          onPress={() => setSelectedDate((d) => offsetDate(d, -1))}
          style={({ pressed }) => [styles.navArrow, pressed && styles.pressed]}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={20} color={T.colors.textPrimary} />
        </Pressable>
        <Pressable
          onPress={() => setSelectedDate(todayStr)}
          style={styles.dateCenter}
        >
          <Text style={styles.dateMain}>{displayDate}</Text>
          {!isToday && (
            <Text style={styles.dateBack}>Toque para voltar a hoje</Text>
          )}
        </Pressable>
        <Pressable
          onPress={() => setSelectedDate((d) => offsetDate(d, 1))}
          style={({ pressed }) => [styles.navArrow, pressed && styles.pressed]}
          hitSlop={8}
        >
          <Ionicons name="chevron-forward" size={20} color={T.colors.textPrimary} />
        </Pressable>
      </View>

      {/* Filtros */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => {
          const count =
            f.value === "all"
              ? allDayCount
              : appointments.filter((a) => a.date === selectedDate && a.status === f.value).length;
          return (
            <Pressable
              key={f.value}
              onPress={() => setFilter(f.value)}
              style={[styles.filterBtn, filter === f.value && styles.filterBtnActive]}
            >
              <Text style={[styles.filterText, filter === f.value && styles.filterTextActive]}>
                {f.label}
              </Text>
              {count > 0 && (
                <View style={[styles.filterBadge, filter === f.value && styles.filterBadgeActive]}>
                  <Text style={[styles.filterBadgeText, filter === f.value && styles.filterBadgeTextActive]}>
                    {count}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={T.colors.black} />
        </View>
      ) : dayAppointments.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="calendar-outline" size={48} color={T.colors.border} />
          <Text style={styles.emptyTitle}>
            {allDayCount === 0
              ? "Nenhum agendamento para este dia"
              : "Nenhum resultado para o filtro"}
          </Text>
          {allDayCount === 0 && (
            <Pressable onPress={openCreate} style={styles.emptyBtn}>
              <Ionicons name="add-circle-outline" size={16} color={T.colors.textSecondary} />
              <Text style={styles.emptyBtnText}>Adicionar agendamento</Text>
            </Pressable>
          )}
        </View>
      ) : (
        <FlatList
          data={dayAppointments}
          keyExtractor={(a) => a.id}
          renderItem={({ item }) => {
            const serviceName = services.find((s) => s.id === item.serviceId)?.name ?? "—";
            const barberName = barbers.find((b) => b.id === item.barberId)?.name ?? "—";
            return (
              <AppointmentCard
                appointment={item}
                serviceName={serviceName}
                barberName={barberName}
                onMarkDone={() => handleMarkDone(item.id)}
                onCancel={() => handleCancel(item.id)}
                onEdit={() => openEdit(item)}
                onDelete={() => setDeleteTargetId(item.id)}
              />
            );
          }}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <AppointmentForm
        visible={formVisible}
        appointment={editingAppointment}
        services={services}
        barbers={barbers}
        defaultDate={selectedDate}
        hasConflict={hasConflict}
        onSave={handleSave}
        onClose={() => setFormVisible(false)}
      />

      <ConfirmDialog
        visible={!!deleteTargetId}
        title="Excluir agendamento?"
        message="Este agendamento será permanentemente excluído."
        confirmLabel="Excluir"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
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
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: T.radius.full,
    backgroundColor: T.colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  dateNav: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: T.spacing.sm,
    paddingVertical: T.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: T.colors.border,
    backgroundColor: T.colors.surface,
  },
  navArrow: {
    padding: T.spacing.sm,
    borderRadius: T.radius.md,
  },
  dateCenter: {
    flex: 1,
    alignItems: "center",
    gap: T.spacing.xxs,
  },
  dateMain: {
    fontSize: T.fontSize.md,
    fontWeight: T.fontWeight.semibold,
    color: T.colors.textPrimary,
  },
  dateBack: {
    fontSize: T.fontSize.xs,
    color: T.colors.textMuted,
  },
  pressed: { opacity: 0.6 },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: T.spacing.sm,
    paddingVertical: T.spacing.sm,
    gap: T.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: T.colors.border,
  },
  filterBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: T.spacing.xxs,
    paddingVertical: T.spacing.xs,
    paddingHorizontal: T.spacing.xs,
    borderRadius: T.radius.md,
    borderWidth: 1.5,
    borderColor: "transparent",
    backgroundColor: T.colors.surface,
  },
  filterBtnActive: {
    backgroundColor: T.colors.black,
    borderColor: T.colors.black,
  },
  filterText: {
    fontSize: T.fontSize.xs,
    fontWeight: T.fontWeight.medium,
    color: T.colors.textSecondary,
  },
  filterTextActive: { color: T.colors.white },
  filterBadge: {
    minWidth: 16,
    height: 16,
    borderRadius: T.radius.full,
    backgroundColor: T.colors.borderStrong,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  filterBadgeActive: { backgroundColor: T.colors.white },
  filterBadgeText: {
    fontSize: 9,
    fontWeight: T.fontWeight.bold,
    color: T.colors.textSecondary,
  },
  filterBadgeTextActive: { color: T.colors.black },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: {
    padding: T.spacing.md,
    gap: T.spacing.sm,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: T.spacing.md,
    padding: T.spacing.xl,
  },
  emptyTitle: {
    fontSize: T.fontSize.md,
    fontWeight: T.fontWeight.semibold,
    color: T.colors.textSecondary,
    textAlign: "center",
  },
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: T.spacing.xs,
    paddingVertical: T.spacing.sm,
    paddingHorizontal: T.spacing.md,
    borderRadius: T.radius.md,
    borderWidth: 1,
    borderColor: T.colors.border,
    backgroundColor: T.colors.surface,
  },
  emptyBtnText: {
    fontSize: T.fontSize.sm,
    color: T.colors.textSecondary,
  },
});
