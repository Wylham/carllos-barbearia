import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectOption } from "@/components/ui/Select";
import { T } from "@/constants/theme";
import { todayISO } from "@/lib/date";
import { Appointment, AppointmentStatus, Barber, Service, STATUS_LABEL } from "@/types";

const STATUS_OPTIONS: SelectOption[] = [
  { label: STATUS_LABEL[AppointmentStatus.SCHEDULED], value: AppointmentStatus.SCHEDULED },
  { label: STATUS_LABEL[AppointmentStatus.DONE], value: AppointmentStatus.DONE },
  { label: STATUS_LABEL[AppointmentStatus.CANCELLED], value: AppointmentStatus.CANCELLED },
];

interface AppointmentFormProps {
  visible: boolean;
  appointment?: Appointment | null;
  services: Service[];
  barbers: Barber[];
  defaultDate?: string;
  hasConflict: (barberId: string, date: string, time: string, excludeId?: string) => boolean;
  onSave: (data: Omit<Appointment, "id" | "createdAt">) => Promise<void>;
  onClose: () => void;
}

type FormErrors = Partial<Record<"date" | "time" | "clientName" | "serviceId" | "barberId" | "price", string>>;

export function AppointmentForm({
  visible,
  appointment,
  services,
  barbers,
  defaultDate,
  hasConflict,
  onSave,
  onClose,
}: AppointmentFormProps) {
  const isEdit = !!appointment;

  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("");
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [barberId, setBarberId] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState<AppointmentStatus>(AppointmentStatus.SCHEDULED);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  // Preenche campos ao abrir
  useEffect(() => {
    if (visible) {
      if (appointment) {
        setDate(appointment.date);
        setTime(appointment.time);
        setClientName(appointment.clientName);
        setPhone(appointment.phone ?? "");
        setServiceId(appointment.serviceId);
        setBarberId(appointment.barberId);
        setPrice(String(appointment.price));
        setStatus(appointment.status);
        setNotes(appointment.notes ?? "");
      } else {
        setDate(defaultDate ?? todayISO());
        setTime("");
        setClientName("");
        setPhone("");
        setServiceId("");
        setBarberId("");
        setPrice("");
        setStatus(AppointmentStatus.SCHEDULED);
        setNotes("");
      }
      setErrors({});
    }
  }, [visible, appointment, defaultDate]);

  // Auto-preenche preço ao escolher serviço (somente na criação)
  function handleServiceChange(id: string) {
    setServiceId(id);
    if (!isEdit || !price) {
      const svc = services.find((s) => s.id === id);
      if (svc) setPrice(String(svc.price));
    }
  }

  const serviceOptions: SelectOption[] = services
    .filter((s) => s.active)
    .map((s) => ({ label: `${s.name} — R$ ${s.price.toFixed(2).replace(".", ",")}`, value: s.id }));

  const barberOptions: SelectOption[] = barbers.filter((b) => b.active).map((b) => ({ label: b.name, value: b.id }));

  function validate(): boolean {
    const errs: FormErrors = {};

    if (!clientName.trim()) errs.clientName = "Nome do cliente é obrigatório";

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      errs.date = "Use o formato AAAA-MM-DD (ex: 2025-01-31)";
    } else {
      const d = new Date(date + "T00:00:00");
      if (isNaN(d.getTime())) errs.date = "Data inválida";
    }

    if (!/^\d{2}:\d{2}$/.test(time)) {
      errs.time = "Use o formato HH:MM (ex: 09:30)";
    } else {
      const [h, m] = time.split(":").map(Number);
      if (h > 23 || m > 59) errs.time = "Hora inválida";
    }

    if (!serviceId) errs.serviceId = "Selecione um serviço";
    if (!barberId) errs.barberId = "Selecione um barbeiro";

    const priceNum = parseFloat(price.replace(",", "."));
    if (isNaN(priceNum) || priceNum < 0) errs.price = "Preço inválido";

    // Verificação de conflito de horário (só se date/time/barbeiro são válidos)
    if (!errs.date && !errs.time && barberId && date && time) {
      if (hasConflict(barberId, date, time, appointment?.id)) {
        const barberName = barbers.find((b) => b.id === barberId)?.name ?? "Barbeiro";
        errs.time = `Conflito: ${barberName} já tem atendimento às ${time} neste dia`;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({
        date,
        time,
        clientName: clientName.trim(),
        phone: phone.trim() || undefined,
        serviceId,
        barberId,
        price: parseFloat(price.replace(",", ".")),
        status,
        notes: notes.trim() || undefined,
      });
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
            <Text style={styles.sheetTitle}>{isEdit ? "Editar Agendamento" : "Novo Agendamento"}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={T.colors.textPrimary} />
            </Pressable>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.form}>
            {/* Data + Hoje */}
            <View>
              <Input
                label="Data (AAAA-MM-DD)"
                value={date}
                onChangeText={setDate}
                placeholder="2025-01-31"
                error={errors.date}
                keyboardType="numeric"
                maxLength={10}
              />
              <Pressable onPress={() => setDate(todayISO())} style={styles.todayBtn}>
                <Ionicons name="today-outline" size={13} color={T.colors.textSecondary} />
                <Text style={styles.todayBtnText}>Preencher com hoje</Text>
              </Pressable>
            </View>

            <Input
              label="Hora (HH:MM)"
              value={time}
              onChangeText={setTime}
              placeholder="09:30"
              error={errors.time}
              keyboardType="numeric"
              maxLength={5}
            />

            <Input
              label="Nome do cliente"
              value={clientName}
              onChangeText={setClientName}
              placeholder="Nome completo"
              error={errors.clientName}
              autoCapitalize="words"
            />

            <Input
              label="Telefone (opcional)"
              value={phone}
              onChangeText={setPhone}
              placeholder="(11) 99999-9999"
              keyboardType="phone-pad"
            />

            <Select
              label="Serviço"
              value={serviceId}
              options={serviceOptions}
              onSelect={handleServiceChange}
              placeholder="Selecionar serviço..."
              error={errors.serviceId}
            />

            <Select
              label="Barbeiro"
              value={barberId}
              options={barberOptions}
              onSelect={setBarberId}
              placeholder="Selecionar barbeiro..."
              error={errors.barberId}
            />

            <Input
              label="Preço (R$)"
              value={price}
              onChangeText={setPrice}
              placeholder="0,00"
              error={errors.price}
              keyboardType="decimal-pad"
            />

            <Select
              label="Status"
              value={status}
              options={STATUS_OPTIONS}
              onSelect={(v) => setStatus(v as AppointmentStatus)}
            />

            <Input
              label="Observações (opcional)"
              value={notes}
              onChangeText={setNotes}
              placeholder="Alguma observação..."
              multiline
              numberOfLines={3}
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
    maxHeight: "92%",
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
    paddingBottom: T.spacing.xl,
  },
  todayBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: T.spacing.xxs,
    marginTop: T.spacing.xs,
    alignSelf: "flex-start",
  },
  todayBtnText: {
    fontSize: T.fontSize.xs,
    color: T.colors.textSecondary,
    textDecorationLine: "underline",
  },
  footer: {
    flexDirection: "row",
    gap: T.spacing.sm,
    padding: T.spacing.md,
    borderTopWidth: 1,
    borderTopColor: T.colors.border,
  },
  btn: { flex: 1 },
});
