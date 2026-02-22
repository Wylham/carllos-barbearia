/**
 * AppDataContext
 *
 * Estado global dos dados da aplicação (agendamentos, serviços, barbeiros).
 * Ao centralizar aqui, qualquer aba que modifique os dados reflete
 * imediatamente em TODAS as outras abas sem necessidade de refetch.
 */
import React, { createContext, useCallback, useContext, useEffect, useReducer } from "react";

import {
  generateId,
  initStorage,
  saveAppointments,
  saveBarbers,
  saveServices,
  resetAll as storageResetAll,
} from "@/lib/storage";
import { Appointment, AppointmentStatus, Barber, Service } from "@/types";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface AppState {
  services: Service[];
  barbers: Barber[];
  appointments: Appointment[];
  loading: boolean;
  ready: boolean;
}

type Action =
  | { type: "LOADED"; payload: Omit<AppState, "loading" | "ready"> }
  | { type: "SET_SERVICES"; payload: Service[] }
  | { type: "SET_BARBERS"; payload: Barber[] }
  | { type: "SET_APPOINTMENTS"; payload: Appointment[] };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "LOADED":
      return { ...state, ...action.payload, loading: false, ready: true };
    case "SET_SERVICES":
      return { ...state, services: action.payload };
    case "SET_BARBERS":
      return { ...state, barbers: action.payload };
    case "SET_APPOINTMENTS":
      return { ...state, appointments: action.payload };
    default:
      return state;
  }
}

const initialState: AppState = {
  services: [],
  barbers: [],
  appointments: [],
  loading: true,
  ready: false,
};

// ─── Interface pública do contexto ────────────────────────────────────────────

export interface AppDataContextValue {
  // Estado
  services: Service[];
  barbers: Barber[];
  appointments: Appointment[];
  loading: boolean;
  ready: boolean;

  // Services
  addService: (data: Omit<Service, "id" | "active" | "createdAt">) => Promise<Service>;
  updateService: (id: string, data: Partial<Omit<Service, "id" | "createdAt">>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  // Barbers
  addBarber: (data: Omit<Barber, "id" | "createdAt">) => Promise<Barber>;
  updateBarber: (id: string, data: Partial<Omit<Barber, "id" | "createdAt">>) => Promise<void>;
  deleteBarber: (id: string) => Promise<void>;

  // Appointments
  addAppointment: (data: Omit<Appointment, "id" | "createdAt">) => Promise<Appointment>;
  updateAppointment: (id: string, data: Partial<Omit<Appointment, "id" | "createdAt">>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  hasConflict: (barberId: string, date: string, time: string, excludeId?: string) => boolean;

  // Utilitários
  resetAll: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Carrega dados na montagem
  useEffect(() => {
    initStorage().then((data) => {
      dispatch({ type: "LOADED", payload: data });
    });
  }, []);

  // ─── Helpers de persistência ─────────────────────────────────────────────

  const updateServices = useCallback(async (next: Service[]) => {
    dispatch({ type: "SET_SERVICES", payload: next });
    await saveServices(next);
  }, []);

  const updateBarbers = useCallback(async (next: Barber[]) => {
    dispatch({ type: "SET_BARBERS", payload: next });
    await saveBarbers(next);
  }, []);

  const updateAppointments = useCallback(async (next: Appointment[]) => {
    dispatch({ type: "SET_APPOINTMENTS", payload: next });
    await saveAppointments(next);
  }, []);

  // ─── Services CRUD ────────────────────────────────────────────────────────

  const addService = useCallback(
    async (data: Omit<Service, "id" | "active" | "createdAt">) => {
      const next: Service = {
        id: generateId(),
        active: true,
        createdAt: new Date().toISOString(),
        ...data,
      };
      await updateServices([...state.services, next]);
      return next;
    },
    [state.services, updateServices],
  );

  const updateService = useCallback(
    async (id: string, data: Partial<Omit<Service, "id" | "createdAt">>) => {
      const next = state.services.map((s) => (s.id === id ? { ...s, ...data } : s));
      await updateServices(next);
    },
    [state.services, updateServices],
  );

  const deleteService = useCallback(
    async (id: string) => {
      const hasActiveAppointments = state.appointments.some(
        (a) => a.serviceId === id && a.status !== AppointmentStatus.CANCELLED,
      );

      if (hasActiveAppointments) {
        const next = state.services.map((s) => (s.id === id ? { ...s, active: false } : s));
        await updateServices(next);
      } else {
        const next = state.services.filter((s) => s.id !== id);
        await updateServices(next);
      }
    },
    [state.services, state.appointments, updateServices],
  );

  // ─── Barbers CRUD ─────────────────────────────────────────────────────────

  const addBarber = useCallback(
    async (data: Omit<Barber, "id" | "createdAt">) => {
      const next: Barber = {
        id: generateId(),
        createdAt: new Date().toISOString(),
        ...data,
      };
      await updateBarbers([...state.barbers, next]);
      return next;
    },
    [state.barbers, updateBarbers],
  );

  const updateBarber = useCallback(
    async (id: string, data: Partial<Omit<Barber, "id" | "createdAt">>) => {
      const next = state.barbers.map((b) => (b.id === id ? { ...b, ...data } : b));
      await updateBarbers(next);
    },
    [state.barbers, updateBarbers],
  );

  const deleteBarber = useCallback(
    async (id: string) => {
      const next = state.barbers.filter((b) => b.id !== id);
      await updateBarbers(next);
    },
    [state.barbers, updateBarbers],
  );

  // ─── Appointments CRUD ────────────────────────────────────────────────────

  const addAppointment = useCallback(
    async (data: Omit<Appointment, "id" | "createdAt">) => {
      const next: Appointment = {
        id: generateId(),
        createdAt: new Date().toISOString(),
        ...data,
      };
      await updateAppointments([...state.appointments, next]);
      return next;
    },
    [state.appointments, updateAppointments],
  );

  const updateAppointment = useCallback(
    async (id: string, data: Partial<Omit<Appointment, "id" | "createdAt">>) => {
      const next = state.appointments.map((a) => (a.id === id ? { ...a, ...data } : a));
      await updateAppointments(next);
    },
    [state.appointments, updateAppointments],
  );

  const deleteAppointment = useCallback(
    async (id: string) => {
      const next = state.appointments.filter((a) => a.id !== id);
      await updateAppointments(next);
    },
    [state.appointments, updateAppointments],
  );

  const hasConflict = useCallback(
    (barberId: string, date: string, time: string, excludeId?: string): boolean => {
      return state.appointments.some(
        (a) =>
          a.id !== excludeId &&
          a.barberId === barberId &&
          a.date === date &&
          a.time === time &&
          a.status !== AppointmentStatus.CANCELLED,
      );
    },
    [state.appointments],
  );

  // ─── Reset geral ──────────────────────────────────────────────────────────

  const resetAll = useCallback(async () => {
    await storageResetAll();
    const data = await initStorage();
    dispatch({ type: "LOADED", payload: data });
  }, []);

  const value: AppDataContextValue = {
    // Estado
    services: state.services,
    barbers: state.barbers,
    appointments: state.appointments,
    loading: state.loading,
    ready: state.ready,

    // Services
    addService,
    updateService,
    deleteService,

    // Barbers
    addBarber,
    updateBarber,
    deleteBarber,

    // Appointments
    addAppointment,
    updateAppointment,
    deleteAppointment,
    hasConflict,

    // Utilitários
    resetAll,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

// ─── Hook de acesso ───────────────────────────────────────────────────────────

export function useAppDataContext(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error("useAppDataContext deve ser usado dentro de <AppDataProvider>");
  }
  return ctx;
}
