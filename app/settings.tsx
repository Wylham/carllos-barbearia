import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { T } from "@/constants/theme";
import { useAppData } from "@/hooks/useAppData";

export default function SettingsScreen() {
  const router = useRouter();
  const { services, barbers, appointments, resetAll } = useAppData();
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  async function handleReset() {
    setResetting(true);
    try {
      await resetAll();
      setConfirmReset(false);
      Alert.alert("Pronto", "Dados resetados para o padrão com sucesso.");
    } finally {
      setResetting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Resumo dos dados */}
        <SectionHeader title="Dados armazenados" style={styles.section} />
        <Card>
          <View style={styles.dataRow}>
            <Ionicons name="cut-outline" size={18} color={T.colors.textSecondary} />
            <Text style={styles.dataLabel}>Serviços cadastrados</Text>
            <Text style={styles.dataValue}>{services.length}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.dataRow}>
            <Ionicons name="people-outline" size={18} color={T.colors.textSecondary} />
            <Text style={styles.dataLabel}>Barbeiros cadastrados</Text>
            <Text style={styles.dataValue}>{barbers.length}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.dataRow}>
            <Ionicons name="calendar-outline" size={18} color={T.colors.textSecondary} />
            <Text style={styles.dataLabel}>Agendamentos</Text>
            <Text style={styles.dataValue}>{appointments.length}</Text>
          </View>
        </Card>

        {/* Zona perigosa */}
        <SectionHeader title="Zona de risco" style={[styles.section, { marginTop: T.spacing.lg }]} />
        <Card>
          <Text style={styles.dangerDesc}>
            Apaga todos os dados e restaura serviços e barbeiros padrão. Agendamentos serão permanentemente removidos.
          </Text>
          <Button
            label="Resetar dados para o padrão"
            onPress={() => setConfirmReset(true)}
            variant="danger"
            fullWidth
            style={{ marginTop: T.spacing.sm }}
          />
        </Card>

        {/* Sobre */}
        <SectionHeader title="Sobre" style={[styles.section, { marginTop: T.spacing.lg }]} />
        <Card>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>App</Text>
            <Text style={styles.aboutValue}>Carllos Barbearia Admin</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Storage</Text>
            <Text style={styles.aboutValue}>AsyncStorage v1</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Versão</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
        </Card>

        <Button
          label="Fechar"
          onPress={() => router.back()}
          variant="secondary"
          fullWidth
          style={{ marginTop: T.spacing.xl }}
        />
      </ScrollView>

      <ConfirmDialog
        visible={confirmReset}
        title="Resetar dados?"
        message="Esta ação apagará TODOS os agendamentos e restaurará os serviços e barbeiros padrão. Esta ação não pode ser desfeita."
        confirmLabel={resetting ? "Resetando..." : "Sim, resetar"}
        cancelLabel="Cancelar"
        destructive
        onConfirm={handleReset}
        onCancel={() => setConfirmReset(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.colors.bg },
  content: {
    padding: T.spacing.md,
    paddingBottom: T.spacing.xxl,
  },
  section: {
    marginBottom: T.spacing.sm,
  },
  dataRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: T.spacing.sm,
    paddingVertical: T.spacing.xs,
  },
  dataLabel: {
    flex: 1,
    fontSize: T.fontSize.md,
    color: T.colors.textPrimary,
  },
  dataValue: {
    fontSize: T.fontSize.md,
    fontWeight: T.fontWeight.bold,
    color: T.colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: T.colors.border,
    marginVertical: T.spacing.xs,
  },
  dangerDesc: {
    fontSize: T.fontSize.sm,
    color: T.colors.textSecondary,
    lineHeight: 20,
  },
  aboutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: T.spacing.xs,
  },
  aboutLabel: {
    fontSize: T.fontSize.md,
    color: T.colors.textSecondary,
  },
  aboutValue: {
    fontSize: T.fontSize.md,
    fontWeight: T.fontWeight.medium,
    color: T.colors.textPrimary,
  },
});
