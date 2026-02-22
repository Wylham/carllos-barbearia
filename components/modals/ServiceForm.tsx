import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AppColors, T } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { Service } from "@/types";

interface ServiceFormProps {
  visible: boolean;
  service?: Service | null;
  onSave: (data: { name: string; price: number }) => Promise<void>;
  onClose: () => void;
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "flex-end",
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.45)",
    },
    sheet: {
      backgroundColor: colors.bg,
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
      borderBottomColor: colors.border,
    },
    sheetTitle: {
      fontSize: T.fontSize.lg,
      fontWeight: T.fontWeight.bold,
      color: colors.textPrimary,
    },
    form: {
      padding: T.spacing.md,
      gap: T.spacing.md,
    },
    footer: {
      flexDirection: "row",
      gap: T.spacing.sm,
      padding: T.spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    btn: { flex: 1 },
  });
}

export function ServiceForm({ visible, service, onSave, onClose }: ServiceFormProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isEdit = !!service;
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});
  const [saving, setSaving] = useState(false);

  // Preenche campos ao abrir para edição
  useEffect(() => {
    if (visible) {
      setName(service?.name ?? "");
      setPrice(service?.price != null ? String(service.price) : "");
      setErrors({});
    }
  }, [visible, service]);

  function validate(): boolean {
    const errs: { name?: string; price?: string } = {};
    if (!name.trim()) errs.name = "Nome é obrigatório";
    const num = parseFloat(price.replace(",", "."));
    if (isNaN(num) || num <= 0) errs.price = "Preço deve ser maior que zero";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({ name: name.trim(), price: parseFloat(price.replace(",", ".")) });
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
            <Text style={styles.sheetTitle}>{isEdit ? "Editar Serviço" : "Novo Serviço"}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.textPrimary} />
            </Pressable>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.form}>
            <Input
              label="Nome do serviço"
              value={name}
              onChangeText={setName}
              placeholder="Ex: Corte Social"
              error={errors.name}
              autoCapitalize="words"
              returnKeyType="next"
            />
            <Input
              label="Preço (R$)"
              value={price}
              onChangeText={setPrice}
              placeholder="Ex: 35"
              error={errors.price}
              keyboardType="decimal-pad"
              returnKeyType="done"
            />
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
