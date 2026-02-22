import { Appointment, Barber, Service } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Chaves versionadas ───────────────────────────────────────────────────────

const KEYS = {
  services: "@carllos/services:v1",
  barbers: "@carllos/barbers:v1",
  appointments: "@carllos/appointments:v1",
} as const;

// ─── Utilitários internos ─────────────────────────────────────────────────────

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function nowISO(): string {
  return new Date().toISOString();
}

// ─── Services ─────────────────────────────────────────────────────────────────

export async function getServices(): Promise<Service[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.services);
    return raw ? (JSON.parse(raw) as Service[]) : [];
  } catch {
    return [];
  }
}

export async function saveServices(services: Service[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.services, JSON.stringify(services));
}

// ─── Barbers ──────────────────────────────────────────────────────────────────

export async function getBarbers(): Promise<Barber[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.barbers);
    return raw ? (JSON.parse(raw) as Barber[]) : [];
  } catch {
    return [];
  }
}

export async function saveBarbers(barbers: Barber[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.barbers, JSON.stringify(barbers));
}

// ─── Appointments ─────────────────────────────────────────────────────────────

export async function getAppointments(): Promise<Appointment[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.appointments);
    return raw ? (JSON.parse(raw) as Appointment[]) : [];
  } catch {
    return [];
  }
}

export async function saveAppointments(appointments: Appointment[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.appointments, JSON.stringify(appointments));
}

// ─── Seed & Reset ─────────────────────────────────────────────────────────────

function buildSeedServices(): Service[] {
  return [
    { id: generateId(), name: "Corte Social", price: 35, active: true, createdAt: nowISO() },
    { id: generateId(), name: "Degradê", price: 45, active: true, createdAt: nowISO() },
    { id: generateId(), name: "Barba", price: 25, active: true, createdAt: nowISO() },
  ];
}

function buildSeedBarbers(): Barber[] {
  return [
    { id: generateId(), name: "Carlos", active: true, createdAt: nowISO() },
    { id: generateId(), name: "Barbeiro 2", active: true, createdAt: nowISO() },
  ];
}

/** Apaga tudo e grava o seed padrão. */
export async function resetAll(): Promise<void> {
  await saveServices(buildSeedServices());
  await saveBarbers(buildSeedBarbers());
  await saveAppointments([]);
}

/**
 * Inicializa o storage.
 * Se não houver dados (primeira vez), aplica o seed padrão.
 * Retorna os dados carregados.
 */
export async function initStorage(): Promise<{
  services: Service[];
  barbers: Barber[];
  appointments: Appointment[];
}> {
  let [services, barbers, appointments] = await Promise.all([getServices(), getBarbers(), getAppointments()]);

  if (services.length === 0 && barbers.length === 0) {
    await resetAll();
    [services, barbers, appointments] = await Promise.all([getServices(), getBarbers(), getAppointments()]);
  }

  return { services, barbers, appointments };
}
