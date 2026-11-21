"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LANDING_SETTINGS,
  DEFAULT_VISITOR_PREFS,
  SEED_APPOINTMENTS,
  SEED_BOOKINGS,
  SEED_CASES,
  SEED_CLIENTS,
  SEED_DOCUMENTS,
  SEED_PAYMENTS,
} from "@/lib/demo-data";
import { safeJsonParse } from "@/lib/utils";
import type {
  Appointment,
  Booking,
  BookingStatus,
  CaseNote,
  Client,
  DocumentFile,
  LandingSettings,
  LegalCase,
  Payment,
  VisitorPreferences,
} from "@/types";

const STORAGE_KEY = "lawyeros-workspace-v1";
const PREFS_KEY = "lawyeros-visitor-prefs";

interface WorkspaceState {
  bookings: Booking[];
  appointments: Appointment[];
  cases: LegalCase[];
  clients: Client[];
  documents: DocumentFile[];
  payments: Payment[];
  landing: LandingSettings;
  visitor: VisitorPreferences;
}

const INITIAL_STATE: WorkspaceState = {
  bookings: SEED_BOOKINGS,
  appointments: SEED_APPOINTMENTS,
  cases: SEED_CASES,
  clients: SEED_CLIENTS,
  documents: SEED_DOCUMENTS,
  payments: SEED_PAYMENTS,
  landing: DEFAULT_LANDING_SETTINGS,
  visitor: DEFAULT_VISITOR_PREFS,
};

interface WorkspaceContextValue extends WorkspaceState {
  createBooking: (input: NewBookingInput) => Booking;
  lookupBooking: (reference: string) => Booking | undefined;
  updateBookingStatus: (id: string, status: BookingStatus, label: string) => void;
  rescheduleBooking: (id: string, date: string, time: string) => void;
  addAppointment: (input: NewAppointmentInput) => Appointment;
  updateAppointmentStatus: (id: string, status: BookingStatus, label: string) => void;
  addCase: (input: NewCaseInput) => LegalCase;
  updateCaseStatus: (id: string, status: LegalCase["status"]) => void;
  addCaseNote: (caseId: string, note: CaseNote) => void;
  addDocument: (file: DocumentFile) => void;
  deleteDocument: (id: string) => void;
  recordPayment: (input: NewPaymentInput) => Payment;
  saveLanding: (settings: LandingSettings) => void;
  saveVisitorPreferences: (prefs: VisitorPreferences) => void;
  resetWorkspace: () => void;
}

export interface NewBookingInput {
  clientName: string;
  phone: string;
  email: string;
  mode: "in-chamber" | "online";
  fee: number;
  date: string;
  time: string;
  caseSummary: string;
}

export interface NewAppointmentInput extends NewBookingInput {}

export interface NewCaseInput {
  title: string;
  client: string;
  opposingParty: string;
  court: string;
  nextHearing: string;
  description: string;
}

export interface NewPaymentInput {
  client: string;
  caseNo: string | null;
  amount: number;
  date: string;
  method: Payment["method"];
  note: string;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

function newReference(): string {
  const now = new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `LC-${date}-${rand}`;
}

function nextId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WorkspaceState>(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = safeJsonParse<WorkspaceState | null>(
      window.localStorage.getItem(STORAGE_KEY),
      null,
    );
    if (stored) {
      setState((current) => ({ ...current, ...stored }));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state, hydrated]);

  const createBooking = useCallback(
    (input: NewBookingInput) => {
      const booking: Booking = {
        id: nextId("bk"),
        reference: newReference(),
        ...input,
        status: "pending",
        createdAt: new Date().toISOString(),
        source: "public-site",
        notes: [],
        history: [
          {
            at: new Date().toISOString(),
            label: "Request submitted online",
            actor: "Client",
          },
        ],
      };
      setState((current) => ({ ...current, bookings: [booking, ...current.bookings] }));
      return booking;
    },
    [],
  );

  const lookupBooking = useCallback(
    (reference: string) => {
      const normalized = reference.trim().toUpperCase();
      return state.bookings.find(
        (booking) =>
          booking.reference.toUpperCase() === normalized ||
          booking.id.toUpperCase() === normalized,
      );
    },
    [state.bookings],
  );

  const updateBookingStatus = useCallback(
    (id: string, status: BookingStatus, label: string) => {
      setState((current) => ({
        ...current,
        bookings: current.bookings.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                status,
                history: [
                  ...booking.history,
                  { at: new Date().toISOString(), label, actor: "Chamber" },
                ],
              }
            : booking,
        ),
      }));
    },
    [],
  );

  const rescheduleBooking = useCallback((id: string, date: string, time: string) => {
    setState((current) => ({
      ...current,
      bookings: current.bookings.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              date,
              time,
              status: "pending",
              history: [
                ...booking.history,
                {
                  at: new Date().toISOString(),
                  label: `Rescheduled to ${date} at ${time}`,
                  actor: "Chamber",
                },
              ],
            }
          : booking,
      ),
    }));
  }, []);

  const addAppointment = useCallback((input: NewAppointmentInput) => {
    const appointment: Appointment = {
      id: nextId("ap"),
      reference: newReference(),
      ...input,
      status: "confirmed",
      history: [
        { at: new Date().toISOString(), label: "Appointment created", actor: "Chamber" },
      ],
    };
    setState((current) => ({
      ...current,
      appointments: [appointment, ...current.appointments],
    }));
    return appointment;
  }, []);

  const updateAppointmentStatus = useCallback(
    (id: string, status: BookingStatus, label: string) => {
      setState((current) => ({
        ...current,
        appointments: current.appointments.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                status,
                history: [
                  ...appointment.history,
                  { at: new Date().toISOString(), label, actor: "Chamber" },
                ],
              }
            : appointment,
        ),
      }));
    },
    [],
  );

  const addCase = useCallback((input: NewCaseInput) => {
    const year = new Date().getFullYear().toString().slice(2);
    const legalCase: LegalCase = {
      id: nextId("case"),
      caseNo: `CR-${Math.floor(1100 + Math.random() * 800)}/${year}`,
      status: "pending",
      stage: "Pleadings",
      filedOn: new Date().toISOString().slice(0, 10),
      hearings: [],
      notes: [],
      ...input,
    };
    setState((current) => ({
      ...current,
      cases: [legalCase, ...current.cases],
      clients: current.clients.map((client) =>
        client.name === input.client
          ? { ...client, caseIds: [...client.caseIds, legalCase.id] }
          : client,
      ),
    }));
    return legalCase;
  }, []);

  const updateCaseStatus = useCallback((id: string, status: LegalCase["status"]) => {
    setState((current) => ({
      ...current,
      cases: current.cases.map((legalCase) =>
        legalCase.id === id ? { ...legalCase, status } : legalCase,
      ),
    }));
  }, []);

  const addCaseNote = useCallback((caseId: string, note: CaseNote) => {
    setState((current) => ({
      ...current,
      cases: current.cases.map((legalCase) =>
        legalCase.id === caseId
          ? { ...legalCase, notes: [note, ...legalCase.notes] }
          : legalCase,
      ),
    }));
  }, []);

  const addDocument = useCallback((file: DocumentFile) => {
    setState((current) => ({ ...current, documents: [file, ...current.documents] }));
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setState((current) => ({
      ...current,
      documents: current.documents.filter((file) => file.id !== id),
    }));
  }, []);

  const recordPayment = useCallback((input: NewPaymentInput) => {
    const now = new Date();
    const payment: Payment = {
      id: nextId("pay"),
      receipt: `RCPT-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(100 + Math.random() * 900)}`,
      ...input,
      status: "paid",
    };
    setState((current) => ({ ...current, payments: [payment, ...current.payments] }));
    return payment;
  }, []);

  const saveLanding = useCallback((settings: LandingSettings) => {
    setState((current) => ({ ...current, landing: settings }));
  }, []);

  const saveVisitorPreferences = useCallback((prefs: VisitorPreferences) => {
    setState((current) => ({ ...current, visitor: prefs }));
    try {
      window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {
      /* storage unavailable */
    }
  }, []);

  const resetWorkspace = useCallback(() => {
    setState((current) => ({
      ...INITIAL_STATE,
      visitor: current.visitor,
    }));
  }, []);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      ...state,
      createBooking,
      lookupBooking,
      updateBookingStatus,
      rescheduleBooking,
      addAppointment,
      updateAppointmentStatus,
      addCase,
      updateCaseStatus,
      addCaseNote,
      addDocument,
      deleteDocument,
      recordPayment,
      saveLanding,
      saveVisitorPreferences,
      resetWorkspace,
    }),
    [
      state,
      createBooking,
      lookupBooking,
      updateBookingStatus,
      rescheduleBooking,
      addAppointment,
      updateAppointmentStatus,
      addCase,
      updateCaseStatus,
      addCaseNote,
      addDocument,
      deleteDocument,
      recordPayment,
      saveLanding,
      saveVisitorPreferences,
      resetWorkspace,
    ],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used inside WorkspaceProvider");
  }
  return context;
}
