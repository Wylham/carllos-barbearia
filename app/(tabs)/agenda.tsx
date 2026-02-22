import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  LayoutAnimation,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

import { AppointmentCard } from "@/components/AppointmentCard";
import { AppointmentForm } from "@/components/modals/AppointmentForm";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { AppColors, T } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { useAppData } from "@/hooks/useAppData";
import { formatDate, todayISO, weekdayShort } from "@/lib/date";
import { Appointment, AppointmentStatus } from "@/types";

// Ativa LayoutAnimation no Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Localização em português
LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
  dayNames: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

type Filter = "all" | AppointmentStatus;

const FILTERS: { label: string; value: Filter }[] = [
  { label: "Todos", value: "all" },
  { label: "Agendados", value: AppointmentStatus.SCHEDULED },
  { label: "Concluídos", value: AppointmentStatus.DONE },
  { label: "Cancelados", value: AppointmentStatus.CANCELLED },
];

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },

    // ── Header ──────────────────────────────────────────────────────────────
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
    headerActions: { flexDirection: "row", alignItems: "center", gap: T.spacing.xs },
    todayBtn: {
      paddingHorizontal: T.spacing.sm,
      paddingVertical: T.spacing.xs,
      borderRadius: T.radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    todayBtnText: {
      fontSize: T.fontSize.xs,
      fontWeight: T.fontWeight.semibold,
      color: colors.textSecondary,
    },
    addBtn: {
      width: 36,
      height: 36,
      borderRadius: T.radius.full,
      backgroundColor: colors.primaryAction,
      justifyContent: "center",
      alignItems: "center",
    },

    // ── Toggle calendário ────────────────────────────────────────────────────
    calendarToggle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: T.spacing.md,
      paddingVertical: T.spacing.sm,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    calendarToggleLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: T.spacing.xs,
    },
    calendarToggleText: {
      fontSize: T.fontSize.sm,
      fontWeight: T.fontWeight.medium,
      color: colors.textSecondary,
    },
    calendarWrapper: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      overflow: "hidden",
    },

    // ── Barra de data selecionada ────────────────────────────────────────────
    selectedDateBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: T.spacing.md,
      paddingVertical: T.spacing.sm,
      backgroundColor: colors.surfaceAlt,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    selectedDateText: {
      fontSize: T.fontSize.md,
      fontWeight: T.fontWeight.semibold,
      color: colors.textPrimary,
    },
    selectedDateCount: {
      fontSize: T.fontSize.sm,
      color: colors.textMuted,
    },

    // ── Legenda ──────────────────────────────────────────────────────────────
    legend: {
      flexDirection: "row",
      alignItems: "center",
      gap: T.spacing.md,
      paddingHorizontal: T.spacing.md,
      paddingVertical: T.spacing.xs,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    legendItem: { flexDirection: "row", alignItems: "center", gap: T.spacing.xs },
    legendDot: { width: 8, height: 8, borderRadius: T.radius.full },
    legendText: { fontSize: T.fontSize.xs, color: colors.textMuted },

    // ── Filtros ──────────────────────────────────────────────────────────────
    pressed: { opacity: 0.6 },
    filterRow: {
      flexDirection: "row",
      paddingHorizontal: T.spacing.sm,
      paddingVertical: T.spacing.sm,
      gap: T.spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
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
      backgroundColor: colors.surface,
    },
    filterBtnActive: {
      backgroundColor: colors.primaryAction,
      borderColor: colors.primaryAction,
    },
    filterText: {
      fontSize: T.fontSize.xs,
      fontWeight: T.fontWeight.medium,
      color: colors.textSecondary,
    },
    filterTextActive: { color: colors.primaryActionText },
    filterBadge: {
      minWidth: 16,
      height: 16,
      borderRadius: T.radius.full,
      backgroundColor: colors.borderStrong,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 3,
    },
    filterBadgeActive: { backgroundColor: colors.primaryActionText },
    filterBadgeText: {
      fontSize: 9,
      fontWeight: T.fontWeight.bold,
      color: colors.textSecondary,
    },
    filterBadgeTextActive: { color: colors.primaryAction },

    // ── Lista ────────────────────────────────────────────────────────────────
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
      color: colors.textSecondary,
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
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    emptyBtnText: {
      fontSize: T.fontSize.sm,
      color: colors.textSecondary,
    },
  });
}

/** Constrói o tema do react-native-calendars baseado nas cores do app. */
function buildCalendarTheme(colors: AppColors) {
  return {
    calendarBackground: colors.surface,
    textSectionTitleColor: colors.textMuted,
    textSectionTitleDisabledColor: colors.textDisabled,
    selectedDayBackgroundColor: colors.primaryAction,
    selectedDayTextColor: colors.primaryActionText,
    todayTextColor: colors.info,
    todayBackgroundColor: "transparent",
    dayTextColor: colors.textPrimary,
    textDisabledColor: colors.textDisabled,
    dotColor: colors.scheduled,
    selectedDotColor: colors.primaryActionText,
    arrowColor: colors.textPrimary,
    disabledArrowColor: colors.textDisabled,
    monthTextColor: colors.textPrimary,
    indicatorColor: colors.textPrimary,
    textDayFontWeight: "400" as const,
    textMonthFontWeight: "700" as const,
    textDayHeaderFontWeight: "600" as const,
    textDayFontSize: 14,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 12,
    // Estilos extras — borda sutil no dia de hoje
    "stylesheet.day.basic": {
      today: {
        borderWidth: 1.5,
        borderColor: colors.info,
        borderRadius: 20,
      },
    },
  };
}

export default function AgendaScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const calendarTheme = useMemo(() => buildCalendarTheme(colors), [colors]);
  const {
    appointments,
    services,
    barbers,
    loading,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    hasConflict,
  } = useAppData();

  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [calendarOpen, setCalendarOpen] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [formVisible, setFormVisible] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const todayStr = todayISO();

  // ── markedDates para o calendário ──────────────────────────────────────────
  const markedDates = useMemo(() => {
    const map: Record<
      string,
      { dots: { key: string; color: string; selectedDotColor: string }[]; selected?: boolean; selectedColor?: string }
    > = {};

    for (const appt of appointments) {
      if (!map[appt.date]) {
        map[appt.date] = { dots: [] };
      }
      const dotKey = appt.status;
      const alreadyHas = map[appt.date].dots.some((d) => d.key === dotKey);
      if (!alreadyHas) {
        const dotColor =
          appt.status === AppointmentStatus.SCHEDULED
            ? colors.scheduled
            : appt.status === AppointmentStatus.DONE
              ? colors.done
              : colors.cancelled;
        map[appt.date].dots.push({
          key: dotKey,
          color: dotColor,
          selectedDotColor: colors.primaryActionText,
        });
      }
    }

    // Marca o dia selecionado
    if (!map[selectedDate]) map[selectedDate] = { dots: [] };
    map[selectedDate] = {
      ...map[selectedDate],
      selected: true,
      selectedColor: colors.primaryAction,
    };

    return map;
  }, [appointments, selectedDate, colors]);

  // ── Agendamentos do dia filtrados ──────────────────────────────────────────
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

  function handleDayPress(day: { dateString: string }) {
    setSelectedDate(day.dateString);
  }

  function toggleCalendar() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCalendarOpen((v) => !v);
  }

  function goToToday() {
    setSelectedDate(todayStr);
  }

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
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="calendar" size={22} color={colors.primaryAction} />
          <Text style={styles.headerTitle}>Agenda</Text>
        </View>
        <View style={styles.headerActions}>
          {!isToday && (
            <Pressable onPress={goToToday} style={({ pressed }) => [styles.todayBtn, pressed && styles.pressed]}>
              <Text style={styles.todayBtnText}>Hoje</Text>
            </Pressable>
          )}
          <Pressable onPress={openCreate} style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.7 }]}>
            <Ionicons name="add" size={22} color={colors.primaryActionText} />
          </Pressable>
        </View>
      </View>

      {/* ── Toggle do calendário ─────────────────────────────────────────── */}
      <Pressable onPress={toggleCalendar} style={({ pressed }) => [styles.calendarToggle, pressed && styles.pressed]}>
        <View style={styles.calendarToggleLeft}>
          <Ionicons name={calendarOpen ? "chevron-up" : "chevron-down"} size={16} color={colors.textMuted} />
          <Text style={styles.calendarToggleText}>{calendarOpen ? "Recolher calendário" : "Expandir calendário"}</Text>
        </View>
        {/* Legenda de cores */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.scheduled }]} />
            <Text style={styles.legendText}>Agendado</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.done }]} />
            <Text style={styles.legendText}>Concluído</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.cancelled }]} />
            <Text style={styles.legendText}>Cancelado</Text>
          </View>
        </View>
      </Pressable>

      {/* ── Calendário mensal (react-native-calendars) ───────────────────── */}
      {calendarOpen && (
        <View style={styles.calendarWrapper}>
          <Calendar
            current={selectedDate}
            onDayPress={handleDayPress}
            markedDates={markedDates}
            markingType="multi-dot"
            theme={calendarTheme}
            enableSwipeMonths
            hideExtraDays
            onMonthChange={() => {}}
          />
        </View>
      )}

      {/* ── Barra com data selecionada + contagem ─────────────────────────── */}
      <View style={styles.selectedDateBar}>
        <Text style={styles.selectedDateText}>{displayDate}</Text>
        <Text style={styles.selectedDateCount}>
          {allDayCount === 0 ? "Sem agendamentos" : `${allDayCount} agendamento${allDayCount > 1 ? "s" : ""}`}
        </Text>
      </View>

      {/* ── Filtros ──────────────────────────────────────────────────────── */}
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
              <Text style={[styles.filterText, filter === f.value && styles.filterTextActive]}>{f.label}</Text>
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

      {/* ── Lista de agendamentos ─────────────────────────────────────────── */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primaryAction} />
        </View>
      ) : dayAppointments.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="calendar-outline" size={48} color={colors.border} />
          <Text style={styles.emptyTitle}>
            {allDayCount === 0 ? "Nenhum agendamento para este dia" : "Nenhum resultado para o filtro"}
          </Text>
          {allDayCount === 0 && (
            <Pressable onPress={openCreate} style={styles.emptyBtn}>
              <Ionicons name="add-circle-outline" size={16} color={colors.textSecondary} />
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

      {/* ── Modais ───────────────────────────────────────────────────────── */}
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
