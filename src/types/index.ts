export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type ConsultationMode = "in-chamber" | "online";
export type CaseStatus = "active" | "pending" | "adjourned" | "closed";
export type PaymentMethod = "bkash" | "nagad" | "bank-transfer" | "cash" | "cheque";
export type DocumentCategory = "Petitions" | "Evidence" | "NID/ID" | "Court Orders";

export interface HistoryEntry {
  at: string;
  label: string;
  actor: string;
}

export interface Booking {
  id: string;
  reference: string;
  clientName: string;
  phone: string;
  email: string;
  mode: ConsultationMode;
  fee: number;
  date: string;
  time: string;
  caseSummary: string;
  status: BookingStatus;
  createdAt: string;
  source: "public-site" | "chamber";
  notes: string[];
  history: HistoryEntry[];
}

export interface Appointment {
  id: string;
  reference: string;
  clientName: string;
  phone: string;
  email: string;
  mode: ConsultationMode;
  fee: number;
  date: string;
  time: string;
  status: BookingStatus;
  caseSummary: string;
  history: HistoryEntry[];
}

export interface Hearing {
  id: string;
  date: string;
  court: string;
  purpose: string;
  outcome?: string;
}

export interface CaseNote {
  id: string;
  at: string;
  body: string;
  internal: boolean;
}

export interface LegalCase {
  id: string;
  caseNo: string;
  title: string;
  client: string;
  opposingParty: string;
  court: string;
  status: CaseStatus;
  stage: string;
  nextHearing: string;
  filedOn: string;
  description: string;
  hearings: Hearing[];
  notes: CaseNote[];
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  caseIds: string[];
  due: number;
  since: string;
}

export interface DocumentFile {
  id: string;
  name: string;
  category: DocumentCategory;
  caseNo: string | null;
  uploadedAt: string;
  size: number;
  type: string;
  visibility: "chamber" | "client";
}

export interface Payment {
  id: string;
  receipt: string;
  client: string;
  caseNo: string | null;
  amount: number;
  date: string;
  method: PaymentMethod;
  note: string;
  status: "paid" | "pending";
}

export interface CauseItem {
  id: string;
  caseNo: string;
  court: string;
  client: string;
  purpose: string;
  time: string;
}

export interface LandingSettings {
  lawyerName: string;
  lawyerTitle: string;
  bio: string;
  photo: string;
  education: string;
  barCouncil: string;
  jurisdictions: string;
  chamberHours: string;
  feeInChamber: number;
  feeOnline: number;
  phone: string;
  email: string;
  address: string;
  bookingDays: number[];
  bookingSlots: string[];
}

export interface VisitorPreferences {
  defaultMode: "light" | "dark" | "system";
  preset: string;
}
