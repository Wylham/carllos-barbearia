// ─── Enums ────────────────────────────────────────────────────────────────────

export enum AppointmentStatus {
  SCHEDULED = "scheduled",
  DONE = "done",
  CANCELLED = "cancelled",
}

// ─── Entidades ────────────────────────────────────────────────────────────────

export interface Service {
  id: string;
  name: string;
  price: number;
  active: boolean; // false = soft-delete (ocorre quando há agendamentos)
  createdAt: string; // ISO string
}

export interface Barber {
  id: string;
  name: string;
  active: boolean;
  avatarUri?: string; // TODO: implementar com expo-image-picker
  createdAt: string; // ISO string
}

export interface Appointment {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  clientName: string;
  phone?: string;
  serviceId: string;
  barberId: string;
  price: number; // editável — pode diferir do service.price
  status: AppointmentStatus;
  notes?: string;
  createdAt: string; // ISO string
}

// ─── Helpers de tipo ──────────────────────────────────────────────────────────

export type AppointmentStatusLabel = {
  [K in AppointmentStatus]: string;
};

export const STATUS_LABEL: AppointmentStatusLabel = {
  [AppointmentStatus.SCHEDULED]: "Agendado",
  [AppointmentStatus.DONE]: "Concluído",
  [AppointmentStatus.CANCELLED]: "Cancelado",
};
