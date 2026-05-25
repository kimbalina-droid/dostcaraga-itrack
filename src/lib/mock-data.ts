export type OfficeCode = "ORD" | "FAS" | "PSTO" | "TECH" | "OTHER";

export const OFFICES: { code: OfficeCode; name: string; color: string }[] = [
  { code: "ORD", name: "Office of the Regional Director", color: "var(--office-ord)" },
  { code: "FAS", name: "Finance & Admin Services", color: "var(--office-fas)" },
  { code: "PSTO", name: "Provincial S&T Offices", color: "var(--office-psto)" },
  { code: "TECH", name: "Technical Divisions", color: "var(--office-tech)" },
  { code: "OTHER", name: "Other Units", color: "var(--office-other)" },
];

export const DOC_TYPES = [
  "Incoming Communication",
  "Memorandum",
  "Letter",
  "Endorsement",
  "Special Order",
  "Travel Order",
  "Financial Document",
  "Procurement Document",
  "Administrative",
  "HR Document",
  "Other",
] as const;

export type DocStatus =
  | "Received"
  | "Routed"
  | "Ongoing"
  | "Pending"
  | "For Approval"
  | "Approved"
  | "Released"
  | "Closed";

export const DOC_STATUSES: DocStatus[] = [
  "Received", "Routed", "Ongoing", "Pending", "For Approval", "Approved", "Released", "Closed",
];

export interface TimelineEntry {
  id: string;
  at: string;
  officer: string;
  action: string;
  remarks?: string;
  status?: DocStatus;
}

export interface DocumentRecord {
  id: string;
  trackingNo: string;
  title: string;
  description?: string;
  type: string;
  nature: string;
  sender: string;
  dateReceived: string;
  timeReceived: string;
  receivingOfficer: string;
  receivingOffice: OfficeCode;
  routedTo: OfficeCode;
  releasingOffice?: string;
  dateReleased?: string;
  fileName?: string;
  confidentiality: "Normal" | "Confidential" | "Restricted";
  status: DocStatus;
  directorInstructions?: string;
  timeline: TimelineEntry[];
  createdAt: string;
}

export type EventStatus =
  | "Draft"
  | "Submitted"
  | "Pending RD Approval"
  | "Approved"
  | "Declined"
  | "Completed"
  | "Cancelled";

export interface CalendarEvent {
  id: string;
  title: string;
  office: OfficeCode;
  description?: string;
  venue: string;
  date: string; // ISO date
  startTime: string;
  endTime: string;
  type: string;
  participants?: string;
  requiresRD: boolean;
  status: EventStatus;
  organizer: string;
  createdAt: string;
}

const today = new Date();
const iso = (offsetDays: number, hour = 9) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};
const dateOnly = (offsetDays: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

export const seedDocuments: DocumentRecord[] = [
  {
    id: "d1",
    trackingNo: "DOST-2026-00142",
    title: "Request for Endorsement – Regional Science Fair 2026",
    description: "Endorsement request from DepEd Caraga for the upcoming Regional Science Fair.",
    type: "Endorsement",
    nature: "External",
    sender: "DepEd Regional Office XIII",
    dateReceived: dateOnly(-2),
    timeReceived: "09:14",
    receivingOfficer: "Maria S. Cabrera",
    receivingOffice: "ORD",
    routedTo: "TECH",
    confidentiality: "Normal",
    status: "Ongoing",
    directorInstructions: "Please coordinate with STIIDS and prepare draft endorsement by Friday.",
    timeline: [
      { id: "t1", at: iso(-2, 9), officer: "Maria S. Cabrera", action: "Document received", status: "Received" },
      { id: "t2", at: iso(-2, 11), officer: "Maria S. Cabrera", action: "Routed to Technical Divisions", status: "Routed", remarks: "For RD review and endorsement drafting" },
      { id: "t3", at: iso(-1, 14), officer: "J. Lim (TECH)", action: "Drafting endorsement", status: "Ongoing" },
    ],
    createdAt: iso(-2, 9),
  },
  {
    id: "d2",
    trackingNo: "DOST-2026-00143",
    title: "Special Order No. 25 – Designation of OIC",
    type: "Special Order",
    nature: "Internal",
    sender: "Office of the Regional Director",
    dateReceived: dateOnly(-1),
    timeReceived: "10:30",
    receivingOfficer: "Anna R. Velasco",
    receivingOffice: "FAS",
    routedTo: "FAS",
    confidentiality: "Normal",
    status: "For Approval",
    timeline: [
      { id: "t1", at: iso(-1, 10), officer: "Anna R. Velasco", action: "Document received", status: "Received" },
      { id: "t2", at: iso(-1, 12), officer: "Anna R. Velasco", action: "Forwarded for RD signature", status: "For Approval" },
    ],
    createdAt: iso(-1, 10),
  },
  {
    id: "d3",
    trackingNo: "DOST-2026-00144",
    title: "Procurement Request – Laboratory Equipment",
    type: "Procurement Document",
    nature: "Internal",
    sender: "PSTO Agusan del Norte",
    dateReceived: dateOnly(0),
    timeReceived: "08:55",
    receivingOfficer: "Pedro D. Ang",
    receivingOffice: "FAS",
    routedTo: "FAS",
    confidentiality: "Normal",
    status: "Pending",
    timeline: [
      { id: "t1", at: iso(0, 9), officer: "Pedro D. Ang", action: "Document received", status: "Received" },
    ],
    createdAt: iso(0, 9),
  },
  {
    id: "d4",
    trackingNo: "DOST-2026-00141",
    title: "Travel Order – Manila Coordination Meeting",
    type: "Travel Order",
    nature: "Internal",
    sender: "Director's Office",
    dateReceived: dateOnly(-5),
    timeReceived: "13:20",
    receivingOfficer: "Maria S. Cabrera",
    receivingOffice: "ORD",
    routedTo: "FAS",
    releasingOffice: "FAS",
    dateReleased: dateOnly(-3),
    confidentiality: "Normal",
    status: "Released",
    timeline: [
      { id: "t1", at: iso(-5, 13), officer: "Maria S. Cabrera", action: "Received", status: "Received" },
      { id: "t2", at: iso(-4, 9), officer: "FAS", action: "Approved", status: "Approved" },
      { id: "t3", at: iso(-3, 10), officer: "FAS", action: "Released to traveler", status: "Released" },
    ],
    createdAt: iso(-5, 13),
  },
  {
    id: "d5",
    trackingNo: "DOST-2026-00140",
    title: "HR Memo – Updated Leave Guidelines",
    type: "HR Document",
    nature: "Internal",
    sender: "HR Unit",
    dateReceived: dateOnly(-7),
    timeReceived: "15:00",
    receivingOfficer: "Anna R. Velasco",
    receivingOffice: "FAS",
    routedTo: "OTHER",
    confidentiality: "Normal",
    status: "Closed",
    timeline: [
      { id: "t1", at: iso(-7, 15), officer: "Anna R. Velasco", action: "Received & disseminated", status: "Closed" },
    ],
    createdAt: iso(-7, 15),
  },
];

export const seedEvents: CalendarEvent[] = [
  {
    id: "e1",
    title: "NMA – Regional Management Committee Meeting",
    office: "ORD",
    description: "Monthly ManCom with division chiefs and PSTO directors.",
    venue: "DOST Caraga Conference Room",
    date: dateOnly(1),
    startTime: "09:00",
    endTime: "12:00",
    type: "Meeting",
    participants: "RD, ARD, Division Chiefs, PSTO Directors",
    requiresRD: true,
    status: "Approved",
    organizer: "Office of the Regional Director",
    createdAt: iso(-3),
  },
  {
    id: "e2",
    title: "Budget Review Workshop",
    office: "FAS",
    venue: "FAS Training Room",
    date: dateOnly(2),
    startTime: "13:00",
    endTime: "17:00",
    type: "Workshop",
    requiresRD: false,
    status: "Approved",
    organizer: "Finance & Admin Services",
    createdAt: iso(-2),
  },
  {
    id: "e3",
    title: "SETUP Beneficiary Visit – Butuan",
    office: "PSTO",
    venue: "Butuan City",
    date: dateOnly(3),
    startTime: "08:00",
    endTime: "16:00",
    type: "Field Activity",
    requiresRD: false,
    status: "Approved",
    organizer: "PSTO Agusan del Norte",
    createdAt: iso(-1),
  },
  {
    id: "e4",
    title: "NMA – Stakeholders Consultation",
    office: "TECH",
    venue: "Almont Hotel",
    date: dateOnly(5),
    startTime: "09:00",
    endTime: "15:00",
    type: "Consultation",
    requiresRD: true,
    status: "Pending RD Approval",
    organizer: "Technical Services Division",
    createdAt: iso(0),
  },
  {
    id: "e5",
    title: "Innovation Roadshow Planning",
    office: "TECH",
    venue: "DOST Caraga",
    date: dateOnly(7),
    startTime: "14:00",
    endTime: "16:00",
    type: "Planning",
    requiresRD: false,
    status: "Approved",
    organizer: "Technical Services Division",
    createdAt: iso(0),
  },
  {
    id: "e6",
    title: "NMA – Provincial Coordination Meeting",
    office: "PSTO",
    venue: "Surigao City",
    date: dateOnly(9),
    startTime: "10:00",
    endTime: "15:00",
    type: "Meeting",
    requiresRD: true,
    status: "Pending RD Approval",
    organizer: "PSTO Surigao del Norte",
    createdAt: iso(0),
  },
];

export function generateTrackingNo() {
  const yr = new Date().getFullYear();
  const num = Math.floor(100 + Math.random() * 899);
  return `DOST-${yr}-00${num}`;
}

export const officeMeta = (code: OfficeCode) =>
  OFFICES.find((o) => o.code === code) ?? OFFICES[OFFICES.length - 1];
