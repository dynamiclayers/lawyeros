import type {
  Appointment,
  Booking,
  CaseNote,
  CauseItem,
  Client,
  DocumentFile,
  LandingSettings,
  LegalCase,
  Payment,
  VisitorPreferences,
} from "@/types";

export const CHAMBER = {
  brand: "LawyerOS",
  chamberName: "Rahman Law Chamber",
  chamberShort: "Rahman Law",
  tagline: "Advocates & Legal Consultants",
  lawyerName: "Adv. Rafiq Rahman",
  lawyerTitle: "Barrister-at-Law, Supreme Court of Bangladesh",
  established: "Est. 2014",
};

export function dayOffset(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function stamp(daysAgo: number, hour: number, minute = 0): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export const DEFAULT_LANDING_SETTINGS: LandingSettings = {
  lawyerName: CHAMBER.lawyerName,
  lawyerTitle: CHAMBER.lawyerTitle,
  bio: "With over a decade of courtroom experience, we are committed to delivering clear, principled legal services to individuals, families, and businesses across Dhaka. Every engagement begins with listening, and ends with a documented strategy you can hold us to.",
  photo: "/images/lawyer-portrait.jpg",
  education: "LL.B., LL.M.",
  barCouncil: "Enrolled Member",
  jurisdictions: "District Judge Court, High Court",
  chamberHours: "Mon–Fri, 9AM–6PM",
  feeInChamber: 2000,
  feeOnline: 1000,
  phone: "+880 1XXX-XXXXXX",
  email: "chamber@example.com",
  address: "123, Supreme Court Road, Dhaka–1000 (demo placeholder)",
  bookingDays: [1, 2, 3, 4, 5],
  bookingSlots: [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ],
};

export const DEFAULT_VISITOR_PREFS: VisitorPreferences = {
  defaultMode: "light",
  preset: "classic",
};

export const TODAY_CAUSE_LIST: CauseItem[] = [
  { id: "cause-1", caseNo: "CR-1023/25", court: "SC Court", client: "Ahmed Rahman", purpose: "Final Hearing", time: "10:30 AM" },
  { id: "cause-2", caseNo: "CR-1045/25", court: "DC Court", client: "Fatema Akter", purpose: "Evidence", time: "12:00 PM" },
  { id: "cause-3", caseNo: "CR-1078/25", court: "HC", client: "Karin Hossain", purpose: "Arguments", time: "02:15 PM" },
  { id: "cause-4", caseNo: "CR-1091/25", court: "SC Court", client: "Nusrat Jahan", purpose: "Order", time: "04:00 PM" },
];

export const SEED_BOOKINGS: Booking[] = [
  {
    id: "bk-1",
    reference: "LC-2025-0816-0421",
    clientName: "Tanvir Ahmed",
    phone: "+880 1711-223344",
    email: "tanvir.ahmed@example.com",
    mode: "online",
    fee: 1000,
    date: dayOffset(2),
    time: "11:00 AM",
    caseSummary: "Seeking guidance on a disputed commercial lease renewal clause.",
    status: "pending",
    createdAt: stamp(0, 9, 20),
    source: "public-site",
    notes: [],
    history: [{ at: stamp(0, 9, 20), label: "Request submitted online", actor: "Client" }],
  },
  {
    id: "bk-2",
    reference: "LC-2025-0816-0419",
    clientName: "Shahana Kabir",
    phone: "+880 1812-556677",
    email: "shahana.kabir@example.com",
    mode: "in-chamber",
    fee: 2000,
    date: dayOffset(3),
    time: "02:00 PM",
    caseSummary: "Family property succession — needs review of ancestral deed.",
    status: "pending",
    createdAt: stamp(0, 7, 5),
    source: "public-site",
    notes: ["Prefers Bengali correspondence."],
    history: [{ at: stamp(0, 7, 5), label: "Request submitted online", actor: "Client" }],
  },
  {
    id: "bk-3",
    reference: "LC-2025-0816-0417",
    clientName: "Imran Hossain",
    phone: "+880 1913-998877",
    email: "imran.hossain@example.com",
    mode: "online",
    fee: 1000,
    date: dayOffset(4),
    time: "03:00 PM",
    caseSummary: "Employment termination notice — clarity on notice period entitlement.",
    status: "pending",
    createdAt: stamp(1, 15, 40),
    source: "public-site",
    notes: [],
    history: [{ at: stamp(1, 15, 40), label: "Request submitted online", actor: "Client" }],
  },
  {
    id: "bk-4",
    reference: "LC-2025-0815-0402",
    clientName: "Raisa Noor",
    phone: "+880 1611-445566",
    email: "raisa.noor@example.com",
    mode: "in-chamber",
    fee: 2000,
    date: dayOffset(5),
    time: "10:00 AM",
    caseSummary: "Trademark opposition for a small software studio.",
    status: "confirmed",
    createdAt: stamp(2, 11, 15),
    source: "public-site",
    notes: [],
    history: [
      { at: stamp(2, 11, 15), label: "Request submitted online", actor: "Client" },
      { at: stamp(1, 8, 30), label: "Appointment approved", actor: "Chamber" },
    ],
  },
];

export const SEED_APPOINTMENTS: Appointment[] = [
  {
    id: "ap-1",
    reference: "LC-2025-0816-0411",
    clientName: "Rahim Uddin",
    phone: "+880 1515-112233",
    email: "rahim.uddin@example.com",
    mode: "online",
    fee: 1000,
    date: dayOffset(0),
    time: "10:00 AM",
    status: "confirmed",
    caseSummary: "Contract review for a distribution agreement.",
    history: [
      { at: stamp(4, 10), label: "Appointment confirmed", actor: "Chamber" },
    ],
  },
  {
    id: "ap-2",
    reference: "LC-2025-0817-0433",
    clientName: "Ayesha Khan",
    phone: "+880 1717-334455",
    email: "ayesha.khan@example.com",
    mode: "in-chamber",
    fee: 2000,
    date: dayOffset(1),
    time: "02:00 PM",
    status: "pending",
    caseSummary: "Initial consultation on a land boundary dispute.",
    history: [],
  },
  {
    id: "ap-3",
    reference: "LC-2025-0818-0440",
    clientName: "Mizanur Rahman",
    phone: "+880 1818-778899",
    email: "mizanur.rahman@example.com",
    mode: "in-chamber",
    fee: 2000,
    date: dayOffset(2),
    time: "11:00 AM",
    status: "confirmed",
    caseSummary: "Probate petition follow-up with the family.",
    history: [],
  },
  {
    id: "ap-4",
    reference: "LC-2025-0819-0451",
    clientName: "Farhana Islam",
    phone: "+880 1919-667788",
    email: "farhana.islam@example.com",
    mode: "online",
    fee: 1000,
    date: dayOffset(3),
    time: "04:00 PM",
    status: "pending",
    caseSummary: "Review of a software licensing contract.",
    history: [],
  },
  {
    id: "ap-5",
    reference: "LC-2025-0812-0388",
    clientName: "Kamal Chowdhury",
    phone: "+880 1616-990011",
    email: "kamal.chowdhury@example.com",
    mode: "in-chamber",
    fee: 2000,
    date: dayOffset(-4),
    time: "03:00 PM",
    status: "completed",
    caseSummary: "Cheque dishonour complaint — first information review.",
    history: [
      { at: stamp(4, 15), label: "Consultation completed", actor: "Chamber" },
    ],
  },
  {
    id: "ap-6",
    reference: "LC-2025-0809-0361",
    clientName: "Sabrina Haque",
    phone: "+880 1321-443322",
    email: "sabrina.haque@example.com",
    mode: "online",
    fee: 1000,
    date: dayOffset(-7),
    time: "12:00 PM",
    status: "cancelled",
    caseSummary: "Requested reschedule due to client travel.",
    history: [
      { at: stamp(8, 9, 10), label: "Cancelled by client", actor: "Client" },
    ],
  },
];

export const SEED_CLIENTS: Client[] = [
  {
    id: "cl-1",
    name: "Ahmed Rahman",
    phone: "+880 1711-101010",
    email: "ahmed.rahman@example.com",
    address: "Dhanmondi, Dhaka",
    caseIds: ["case-1", "case-4"],
    due: 0,
    since: "2021-03-11",
  },
  {
    id: "cl-2",
    name: "Fatema Akter",
    phone: "+880 1812-202020",
    email: "fatema.akter@example.com",
    address: "Uttara, Dhaka",
    caseIds: ["case-2"],
    due: 2000,
    since: "2022-07-02",
  },
  {
    id: "cl-3",
    name: "Karin Hossain",
    phone: "+880 1913-303030",
    email: "karin.hossain@example.com",
    address: "Gulshan, Dhaka",
    caseIds: ["case-3"],
    due: 0,
    since: "2020-01-19",
  },
  {
    id: "cl-4",
    name: "Nusrat Jahan",
    phone: "+880 1611-404040",
    email: "nusrat.jahan@example.com",
    address: "Mirpur, Dhaka",
    caseIds: ["case-5"],
    due: 5000,
    since: "2023-11-08",
  },
  {
    id: "cl-5",
    name: "Imran Hossain",
    phone: "+880 1515-505050",
    email: "imran.hossain@example.com",
    address: "Banani, Dhaka",
    caseIds: [],
    due: 0,
    since: "2024-05-22",
  },
];

export const SEED_CASES: LegalCase[] = [
  {
    id: "case-1",
    caseNo: "CR-1023/25",
    title: "Rahman v. National Housing Ltd.",
    client: "Ahmed Rahman",
    opposingParty: "National Housing Ltd.",
    court: "SC Court",
    status: "active",
    stage: "Final Hearing",
    nextHearing: dayOffset(0),
    filedOn: "2024-11-04",
    description:
      "Specific performance of a flat handover agreement; developer delayed possession by 14 months.",
    hearings: [
      { id: "h-1", date: dayOffset(0), court: "SC Court", purpose: "Final Hearing" },
      { id: "h-2", date: dayOffset(-66), court: "SC Court", purpose: "Evidence", outcome: "Plaintiff evidence accepted" },
      { id: "h-3", date: dayOffset(-165), court: "SC Court", purpose: "Framing of issues" },
    ],
    notes: [
      { id: "n-1", at: dayOffset(-6), body: "Witness list needs final review before the hearing.", internal: true },
      { id: "n-2", at: dayOffset(-24), body: "Client briefed on the settlement range discussed with the developer's counsel.", internal: false },
    ],
  },
  {
    id: "case-2",
    caseNo: "CR-1045/25",
    title: "Akter v. Metro Traders",
    client: "Fatema Akter",
    opposingParty: "Metro Traders",
    court: "DC Court",
    status: "pending",
    stage: "Evidence",
    nextHearing: dayOffset(0),
    filedOn: "2025-01-22",
    description: "Recovery of unpaid supply invoices totalling ৳4,80,000 with interest.",
    hearings: [
      { id: "h-4", date: dayOffset(0), court: "DC Court", purpose: "Evidence" },
      { id: "h-5", date: dayOffset(-93), court: "DC Court", purpose: "Written statement", outcome: "Adjourned at defendant's request" },
    ],
    notes: [
      { id: "n-3", at: dayOffset(-5), body: "Original ledger copies requested from the client — do not file bank screenshots alone.", internal: true },
    ],
  },
  {
    id: "case-3",
    caseNo: "CR-1078/25",
    title: "Hossain v. Dhaka Municipality",
    client: "Karin Hossain",
    opposingParty: "Dhaka Municipality",
    court: "HC",
    status: "active",
    stage: "Arguments",
    nextHearing: dayOffset(0),
    filedOn: "2024-08-30",
    description: "Challenge to a wrongful holding-tax assessment for a commercial premises.",
    hearings: [
      { id: "h-6", date: dayOffset(0), court: "HC", purpose: "Arguments" },
      { id: "h-7", date: dayOffset(-140), court: "HC", purpose: "Interim order" },
    ],
    notes: [],
  },
  {
    id: "case-4",
    caseNo: "CR-1091/25",
    title: "Rahman v. Rahman (Succession)",
    client: "Ahmed Rahman",
    opposingParty: "Yusuf Rahman",
    court: "SC Court",
    status: "adjourned",
    stage: "Order",
    nextHearing: dayOffset(0),
    filedOn: "2023-05-16",
    description: "Partition of ancestral property among three legal heirs.",
    hearings: [
      { id: "h-8", date: dayOffset(0), court: "SC Court", purpose: "Order" },
      { id: "h-9", date: dayOffset(-210), court: "SC Court", purpose: "Mediation", outcome: "No settlement reached" },
    ],
    notes: [],
  },
  {
    id: "case-5",
    caseNo: "CR-1102/25",
    title: "Jahan v. Brightline Tech",
    client: "Nusrat Jahan",
    opposingParty: "Brightline Tech Ltd.",
    court: "Lab Court",
    status: "active",
    stage: "Pleadings",
    nextHearing: dayOffset(17),
    filedOn: "2025-06-11",
    description: "Wrongful termination claim and unpaid gratuity for a senior engineer.",
    hearings: [
      { id: "h-10", date: dayOffset(17), court: "Lab Court", purpose: "Pleadings" },
    ],
    notes: [],
  },
  {
    id: "case-6",
    caseNo: "CR-1011/24",
    title: "Chowdhury v. Delta Bank",
    client: "Kamal Chowdhury",
    opposingParty: "Delta Bank PLC",
    court: "DC Court",
    status: "closed",
    stage: "Disposed",
    nextHearing: "—",
    filedOn: "2023-02-14",
    description: "Cheque dishonour complaint under Section 138.",
    hearings: [
      { id: "h-11", date: dayOffset(-320), court: "DC Court", purpose: "Judgment", outcome: "Decree in favour of client" },
    ],
    notes: [],
  },
];

export const SEED_DOCUMENTS: DocumentFile[] = [
  {
    id: "doc-1",
    name: "plaint-rahman-housing.pdf",
    category: "Petitions",
    caseNo: "CR-1023/25",
    uploadedAt: dayOffset(-12),
    size: 1_854_000,
    type: "PDF",
    visibility: "chamber",
  },
  {
    id: "doc-2",
    name: "ledger-summary-akter.xlsx",
    category: "Evidence",
    caseNo: "CR-1045/25",
    uploadedAt: dayOffset(-8),
    size: 486_000,
    type: "XLSX",
    visibility: "chamber",
  },
  {
    id: "doc-3",
    name: "nid-nusrat-jahan.jpg",
    category: "NID/ID",
    caseNo: "CR-1102/25",
    uploadedAt: dayOffset(-5),
    size: 912_000,
    type: "JPG",
    visibility: "chamber",
  },
  {
    id: "doc-4",
    name: "interim-order-hossain.pdf",
    category: "Court Orders",
    caseNo: "CR-1078/25",
    uploadedAt: dayOffset(-140),
    size: 1_204_000,
    type: "PDF",
    visibility: "client",
  },
  {
    id: "doc-5",
    name: "hearing-notice-august.pdf",
    category: "Court Orders",
    caseNo: "CR-1023/25",
    uploadedAt: dayOffset(-2),
    size: 320_000,
    type: "PDF",
    visibility: "client",
  },
];

export const SEED_PAYMENTS: Payment[] = [
  { id: "pay-1", receipt: "RCPT-2025-0812-001", client: "Kamal Chowdhury", caseNo: "CR-1011/24", amount: 15000, date: dayOffset(-4), method: "bank-transfer", note: "Final settlement on disposal", status: "paid" },
  { id: "pay-2", receipt: "RCPT-2025-0808-002", client: "Ahmed Rahman", caseNo: "CR-1023/25", amount: 25000, date: dayOffset(-9), method: "bkash", note: "Retainer — monthly tranche", status: "paid" },
  { id: "pay-3", receipt: "RCPT-2025-0805-003", client: "Fatema Akter", caseNo: "CR-1045/25", amount: 8000, date: dayOffset(-13), method: "cash", note: "Consultation and drafting", status: "paid" },
  { id: "pay-4", receipt: "RCPT-2025-0729-004", client: "Nusrat Jahan", caseNo: "CR-1102/25", amount: 20000, date: dayOffset(-25), method: "cheque", note: "Cheque #447192 — cleared", status: "paid" },
  { id: "pay-5", receipt: "RCPT-2025-0721-005", client: "Fatema Akter", caseNo: "CR-1045/25", amount: 2000, date: dayOffset(-33), method: "nagad", note: "Outstanding balance reminder", status: "pending" },
];

export const DEMO_TESTIMONIALS = [
  {
    id: "t-1",
    quote:
      "Clear advice, no theatrics, and a written strategy within the first week. Our lease dispute settled before it reached a hearing.",
    name: "Demo Client A",
    role: "Client — Corporate & Contract",
    rating: 5,
  },
  {
    id: "t-2",
    quote:
      "They explained each hearing date in plain language and never let a document slip. I always knew where my case stood.",
    name: "Demo Client B",
    role: "Client — Family Law",
    rating: 5,
  },
  {
    id: "t-3",
    quote:
      "Responsive over email, precise in court. The chamber feels like a firm that respects both your time and your budget.",
    name: "Demo Client C",
    role: "Client — Property & Land",
    rating: 4,
  },
];

export const PRACTICE_AREAS = [
  { id: "civil", title: "Civil Litigation", description: "Get expert advice and representation.", icon: "Scale" },
  { id: "criminal", title: "Criminal Defense", description: "Strong defense for your rights.", icon: "ShieldCheck" },
  { id: "corporate", title: "Corporate & Contract", description: "Legal solutions for businesses.", icon: "Briefcase" },
  { id: "family", title: "Family Law", description: "Support for your family matters.", icon: "Users" },
  { id: "property", title: "Property & Land", description: "Secure your property rights.", icon: "Building2" },
  { id: "cyber", title: "Cyber & Tech Law", description: "Legal support in digital era.", icon: "Laptop" },
];

export const FAQS = [
  {
    q: "How do I book an appointment?",
    a: "Use the booking form on this page: choose in-chamber or online, pick an available date and time, then submit your details. You will receive a booking reference — the appointment is confirmed only after the chamber approves it.",
  },
  {
    q: "What are your consultation fees?",
    a: "In-chamber consultation is ৳2,000 and online video consultation is ৳1,000. Fees are payable at the appointment; a receipt is issued by the chamber.",
  },
  {
    q: "Which courts do you practice in?",
    a: "The chamber appears before the District Judge Court and the High Court, including related tribunals and labour courts where briefed.",
  },
  {
    q: "Can I reschedule my appointment?",
    a: "Yes. Use “Track Booking Status” with your booking reference, or contact the chamber at least 24 hours before the appointment. We will offer the next available slot.",
  },
  {
    q: "What documents should I bring?",
    a: "Bring a valid photo ID and any agreements, notices, receipts, or court papers relevant to your matter. Originals plus one photocopy set is ideal.",
  },
];

export function newCaseNote(body: string, internal: boolean): CaseNote {
  return {
    id: `n-${Math.random().toString(36).slice(2, 8)}`,
    at: dayOffset(0),
    body,
    internal,
  };
}
