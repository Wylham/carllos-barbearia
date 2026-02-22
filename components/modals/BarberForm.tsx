import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { T } from "@/constants/theme";
import { Barber } from "@/types";

interface BarberFormProps {
  visible: boolean;
  barber?: Barber | null;
  onSave: (data: { name: string; active: boolean }) => Promise<void>;
  onClose: () => void;
}

export function BarberForm({ visible, barber, onSave, onClose }: BarberFormProps) {
  const isEdit = !!barber;
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setName(barber?.name ?? "");
      setActive(barber?.active ?? true);
      setErrors({});
    }
  }, [visible, barber]);

  function validate(): boolean {
    const errs: { name?: string } = {};
    if (!name.trim()) errs.name = "Nome é obrigatório";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({ name: name.trim(), active });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{isEdit ? "Editar Barbeiro" : "Novo Barbeiro"}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={T.colors.textPrimary} />
            </Pressable>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.form}>
            {/* Avatar placeholder */}
            <View style={styles.avatarRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarLetter}>{name.trim().charAt(0).toUpperCase() || "?"}</Text>
              </View>
              <Text style={styles.avatarHint}>TODO: seleção de foto via expo-image-picker</Text>
            </View>

            <Input
              label="Nome do barbeiro"
              value={name}
              onChangeText={setName}
              placeholder="Ex: Carlos"
              error={errors.name}
              autoCapitalize="words"
            />

            {/* Toggle ativo */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleLabel}>Barbeiro ativo</Text>
                <Text style={styles.toggleHint}>{active ? "Aparece na agenda" : "Não aparece na agenda"}</Text>
              </View>
              <Pressable onPress={() => setActive((v) => !v)} style={[styles.toggle, active && styles.toggleActive]}>
                <View style={[styles.toggleThumb, active && styles.toggleThumbActive]} />
              </Pressable>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button label="Cancelar" onPress={onClose} variant="secondary" style={styles.btn} />
            <Button
              label={saving ? "Salvando..." : "Salvar"}
              onPress={handleSave}
              loading={saving}
              style={styles.btn}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    backgroundColor: T.colors.bg,
    borderTopLeftRadius: T.radius.xl,
    borderTopRightRadius: T.radius.xl,
    maxHeight: "80%",
    ...T.shadow.md,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: T.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: T.colors.border,
  },
  sheetTitle: {
    fontSize: T.fontSize.lg,
    fontWeight: T.fontWeight.bold,
    color: T.colors.textPrimary,
  },
  form: {
    padding: T.spacing.md,
    gap: T.spacing.md,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: T.spacing.md,
    padding: T.spacing.sm,
    backgroundColor: T.colors.surface,
    borderRadius: T.radius.md,
    borderWidth: 1,
    borderColor: T.colors.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: T.radius.full,
    backgroundColor: T.colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: {
    fontSize: T.fontSize.xl,
    fontWeight: T.fontWeight.bold,
    color: T.colors.white,
  },
  avatarHint: {
    flex: 1,
    fontSize: T.fontSize.xs,
    color: T.colors.textMuted,
    fontStyle: "italic",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: T.spacing.sm,
    backgroundColor: T.colors.surface,
    borderRadius: T.radius.md,
    borderWidth: 1,
    borderColor: T.colors.border,
  },
  toggleInfo: { gap: T.spacing.xxs },
  toggleLabel: {
    fontSize: T.fontSize.md,
    fontWeight: T.fontWeight.medium,
    color: T.colors.textPrimary,
  },
  toggleHint: { fontSize: T.fontSize.xs, color: T.colors.textMuted },
  toggle: {
    width: 46,
    height: 26,
    borderRadius: T.radius.full,
    backgroundColor: T.colors.borderStrong,
    justifyContent: "center",
    padding: 3,
  },
  toggleActive: { backgroundColor: T.colors.black },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: T.radius.full,
    backgroundColor: T.colors.white,
  },
  toggleThumbActive: { alignSelf: "flex-end" },
  footer: {
    flexDirection: "row",
    gap: T.spacing.sm,
    padding: T.spacing.md,
    borderTopWidth: 1,
    borderTopColor: T.colors.border,
  },
  btn: { flex: 1 },
});
