import { T } from "@/constants/theme";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "./Button";

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel} statusBarTranslucent>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable
          style={styles.dialog}
          onPress={() => {
            /* evita fechar ao tocar no card */
          }}
        >
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Button label={cancelLabel} onPress={onCancel} variant="secondary" style={styles.btn} />
            <Button
              label={confirmLabel}
              onPress={onConfirm}
              variant={destructive ? "danger" : "primary"}
              style={styles.btn}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: T.spacing.lg,
  },
  dialog: {
    width: "100%",
    backgroundColor: T.colors.bg,
    borderRadius: T.radius.xl,
    padding: T.spacing.lg,
    gap: T.spacing.sm,
    ...T.shadow.md,
  },
  title: {
    fontSize: T.fontSize.lg,
    fontWeight: T.fontWeight.bold,
    color: T.colors.textPrimary,
  },
  message: {
    fontSize: T.fontSize.md,
    color: T.colors.textSecondary,
    lineHeight: 22,
  },
  actions: {
    flexDirection: "row",
    gap: T.spacing.sm,
    marginTop: T.spacing.sm,
  },
  btn: {
    flex: 1,
  },
});
