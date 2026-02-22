import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { T } from "@/constants/theme";
import { formatMoney } from "@/lib/date";
import { Appointment, AppointmentStatus } from "@/types";

interface AppointmentCardProps {
  appointment: Appointment;
  serviceName: string;
  barberName: string;
  onMarkDone: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function AppointmentCard({
  appointment,
  serviceName,
  barberName,
  onMarkDone,
  onCancel,
  onEdit,
  onDelete,
}: AppointmentCardProps) {
  const { time, clientName, price, status, phone, notes } = appointment;
  const isDone = status === AppointmentStatus.DONE;
  const isCancelled = status === AppointmentStatus.CANCELLED;

  return (
    <View style={[styles.card, isCancelled && styles.cardCancelled]}>
      {/* Linha superior: hora + status */}
      <View style={styles.topRow}>
        <Text style={styles.time}>{time}</Text>
        <StatusBadge status={status} />
      </View>

      {/* Linha do cliente */}
      <Text style={styles.clientName} numberOfLines={1}>
        {clientName}
      </Text>
      {phone ? (
        <Text style={styles.phone} numberOfLines={1}>
          {phone}
        </Text>
      ) : null}

      {/* Serviço + Barbeiro + Preço */}
      <View style={styles.detailRow}>
        <View style={styles.detailItem}>
          <Ionicons name="cut-outline" size={13} color={T.colors.textMuted} />
          <Text style={styles.detailText} numberOfLines={1}>
            {serviceName}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="person-outline" size={13} color={T.colors.textMuted} />
          <Text style={styles.detailText} numberOfLines={1}>
            {barberName}
          </Text>
        </View>
        <Text style={styles.price}>{formatMoney(price)}</Text>
      </View>

      {notes ? (
        <Text style={styles.notes} numberOfLines={2}>
          {notes}
        </Text>
      ) : null}

      {/* Ações rápidas */}
      <View style={styles.actions}>
        {!isDone && !isCancelled && (
          <Pressable
            onPress={onMarkDone}
            style={({ pressed }) => [styles.actionBtn, styles.actionDone, pressed && styles.pressed]}
          >
            <Ionicons name="checkmark-circle-outline" size={15} color={T.colors.done} />
            <Text style={[styles.actionText, { color: T.colors.done }]}>Concluir</Text>
          </Pressable>
        )}
        {!isCancelled && (
          <Pressable
            onPress={onCancel}
            style={({ pressed }) => [styles.actionBtn, styles.actionCancel, pressed && styles.pressed]}
          >
            <Ionicons name="close-circle-outline" size={15} color={T.colors.cancelled} />
            <Text style={[styles.actionText, { color: T.colors.cancelled }]}>Cancelar</Text>
          </Pressable>
        )}
        <Pressable
          onPress={onEdit}
          style={({ pressed }) => [styles.actionBtn, styles.actionEdit, pressed && styles.pressed]}
        >
          <Ionicons name="create-outline" size={15} color={T.colors.textSecondary} />
          <Text style={[styles.actionText, { color: T.colors.textSecondary }]}>Editar</Text>
        </Pressable>
        <Pressable
          onPress={onDelete}
          style={({ pressed }) => [styles.actionBtn, styles.actionDelete, pressed && styles.pressed]}
        >
          <Ionicons name="trash-outline" size={15} color={T.colors.cancelled} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: T.colors.bg,
    borderRadius: T.radius.lg,
    borderWidth: 1,
    borderColor: T.colors.border,
    padding: T.spacing.md,
    gap: T.spacing.xs,
    ...T.shadow.sm,
  },
  cardCancelled: {
    opacity: 0.65,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  time: {
    fontSize: T.fontSize.xl,
    fontWeight: T.fontWeight.bold,
    color: T.colors.textPrimary,
    letterSpacing: 0.5,
  },
  clientName: {
    fontSize: T.fontSize.lg,
    fontWeight: T.fontWeight.semibold,
    color: T.colors.textPrimary,
  },
  phone: {
    fontSize: T.fontSize.sm,
    color: T.colors.textMuted,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: T.spacing.sm,
    flexWrap: "wrap",
    marginTop: T.spacing.xxs,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: T.spacing.xxs,
    flex: 1,
    minWidth: 80,
  },
  detailText: {
    fontSize: T.fontSize.sm,
    color: T.colors.textSecondary,
    flex: 1,
  },
  price: {
    fontSize: T.fontSize.md,
    fontWeight: T.fontWeight.bold,
    color: T.colors.textPrimary,
  },
  notes: {
    fontSize: T.fontSize.sm,
    color: T.colors.textMuted,
    fontStyle: "italic",
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    gap: T.spacing.xs,
    marginTop: T.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: T.colors.border,
    paddingTop: T.spacing.sm,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: T.spacing.xxs,
    paddingVertical: T.spacing.xs,
    paddingHorizontal: T.spacing.sm,
    borderRadius: T.radius.sm,
    borderWidth: 1,
  },
  actionDone: {
    borderColor: T.colors.done + "40",
    backgroundColor: T.colors.done + "10",
  },
  actionCancel: {
    borderColor: T.colors.cancelled + "40",
    backgroundColor: T.colors.cancelled + "10",
  },
  actionEdit: {
    borderColor: T.colors.border,
    backgroundColor: T.colors.surface,
  },
  actionDelete: {
    borderColor: T.colors.cancelled + "40",
    backgroundColor: T.colors.cancelled + "10",
    marginLeft: "auto",
  },
  actionText: {
    fontSize: T.fontSize.xs,
    fontWeight: T.fontWeight.medium,
  },
  pressed: { opacity: 0.65 },
});
