import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";

import { AppColors, T } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  value?: string;
  options: SelectOption[];
  onSelect: (value: string) => void;
  placeholder?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: { gap: T.spacing.xs },
    label: {
      fontSize: T.fontSize.sm,
      fontWeight: T.fontWeight.medium,
      color: colors.textPrimary,
    },
    trigger: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: T.radius.md,
      paddingHorizontal: T.spacing.md,
      paddingVertical: T.spacing.sm + 2,
      minHeight: 44,
      gap: T.spacing.xs,
    },
    triggerError: { borderColor: colors.error },
    triggerText: {
      flex: 1,
      fontSize: T.fontSize.md,
      color: colors.textPrimary,
    },
    placeholder: { color: colors.textMuted },
    error: { fontSize: T.fontSize.xs, color: colors.error },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.55)",
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: colors.bg,
      borderTopLeftRadius: T.radius.xl,
      borderTopRightRadius: T.radius.xl,
      borderTopWidth: 1,
      borderColor: colors.border,
      maxHeight: "60%",
      paddingBottom: T.spacing.xl,
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
      fontWeight: T.fontWeight.semibold,
      color: colors.textPrimary,
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: T.spacing.sm + 2,
      paddingHorizontal: T.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    optionSelected: { backgroundColor: colors.surface },
    optionPressed: { backgroundColor: colors.surfaceAlt },
    optionText: {
      flex: 1,
      fontSize: T.fontSize.md,
      color: colors.textPrimary,
    },
    optionTextSelected: { fontWeight: T.fontWeight.semibold },
  });
}

export function Select({
  label,
  value,
  options,
  onSelect,
  placeholder = "Selecionar...",
  error,
  containerStyle,
}: SelectProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable onPress={() => setOpen(true)} style={[styles.trigger, !!error && styles.triggerError]}>
        <Text style={[styles.triggerText, !selected && styles.placeholder]} numberOfLines={1}>
          {selected?.label ?? placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)} statusBarTranslucent>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{label ?? "Selecionar"}</Text>
              <Pressable onPress={() => setOpen(false)} hitSlop={8}>
                <Ionicons name="close" size={22} color={colors.textPrimary} />
              </Pressable>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onSelect(item.value);
                    setOpen(false);
                  }}
                  style={({ pressed }) => [
                    styles.option,
                    item.value === value && styles.optionSelected,
                    pressed && styles.optionPressed,
                  ]}
                >
                  <Text style={[styles.optionText, item.value === value && styles.optionTextSelected]}>
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Ionicons name="checkmark" size={18} color={colors.primaryAction} />
                  )}
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
