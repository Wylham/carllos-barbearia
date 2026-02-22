import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { AppColors, T } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
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

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.bg,
      borderRadius: T.radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: T.spacing.md,
      gap: T.spacing.xs,
      ...T.shadow.sm,
    },
    cardCancelled: { opacity: 0.65 },
    topRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    time: {
      fontSize: T.fontSize.xl,
      fontWeight: T.fontWeight.bold,
      color: colors.textPrimary,
      letterSpacing: 0.5,
    },
    clientName: {
      fontSize: T.fontSize.lg,
      fontWeight: T.fontWeight.semibold,
      color: colors.textPrimary,
    },
    phone: {
      fontSize: T.fontSize.sm,
      color: colors.textMuted,
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
      color: colors.textSecondary,
      flex: 1,
    },
    price: {
      fontSize: T.fontSize.md,
      fontWeight: T.fontWeight.bold,
      color: colors.textPrimary,
    },
    notes: {
      fontSize: T.fontSize.sm,
      color: colors.textMuted,
      fontStyle: "italic",
      lineHeight: 18,
    },
    actions: {
      flexDirection: "row",
      gap: T.spacing.xs,
      marginTop: T.spacing.xs,
      borderTopWidth: 1,
      borderTopColor: colors.border,
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
      borderColor: colors.done + "40",
      backgroundColor: colors.done + "18",
    },
    actionCancel: {
      borderColor: colors.cancelled + "40",
      backgroundColor: colors.cancelled + "18",
    },
    actionEdit: {
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    actionDelete: {
      borderColor: colors.cancelled + "40",
      backgroundColor: colors.cancelled + "18",
      marginLeft: "auto",
    },
    actionText: {
      fontSize: T.fontSize.xs,
      fontWeight: T.fontWeight.medium,
    },
    pressed: { opacity: 0.65 },
  });
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
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { time, clientName, price, status, phone, notes } = appointment;
  const isDone = status === AppointmentStatus.DONE;
  const isCancelled = status === AppointmentStatus.CANCELLED;

  return (
    <View style={[styles.card, isCancelled && styles.cardCancelled]}>
      <View style={styles.topRow}>
        <Text style={styles.time}>{time}</Text>
        <StatusBadge status={status} />
      </View>

      <Text style={styles.clientName} numberOfLines={1}>
        {clientName}
      </Text>
      {phone ? (
        <Text style={styles.phone} numberOfLines={1}>
          {phone}
        </Text>
      ) : null}

      <View style={styles.detailRow}>
        <View style={styles.detailItem}>
          <Ionicons name="cut-outline" size={13} color={colors.textMuted} />
          <Text style={styles.detailText} numberOfLines={1}>
            {serviceName}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="person-outline" size={13} color={colors.textMuted} />
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

      <View style={styles.actions}>
        {!isDone && !isCancelled && (
          <Pressable
            onPress={onMarkDone}
            style={({ pressed }) => [styles.actionBtn, styles.actionDone, pressed && styles.pressed]}
          >
            <Ionicons name="checkmark-circle-outline" size={15} color={colors.done} />
            <Text style={[styles.actionText, { color: colors.done }]}>Concluir</Text>
          </Pressable>
        )}
        {!isCancelled && (
          <Pressable
            onPress={onCancel}
            style={({ pressed }) => [styles.actionBtn, styles.actionCancel, pressed && styles.pressed]}
          >
            <Ionicons name="close-circle-outline" size={15} color={colors.cancelled} />
            <Text style={[styles.actionText, { color: colors.cancelled }]}>Cancelar</Text>
          </Pressable>
        )}
        <Pressable
          onPress={onEdit}
          style={({ pressed }) => [styles.actionBtn, styles.actionEdit, pressed && styles.pressed]}
        >
          <Ionicons name="create-outline" size={15} color={colors.textSecondary} />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>Editar</Text>
        </Pressable>
        <Pressable
          onPress={onDelete}
          style={({ pressed }) => [styles.actionBtn, styles.actionDelete, pressed && styles.pressed]}
        >
          <Ionicons name="trash-outline" size={15} color={colors.cancelled} />
        </Pressable>
      </View>
    </View>
  );
}
