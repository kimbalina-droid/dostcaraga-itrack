export type OfficeCode =
  | "ORD"
  | "FOD"
  | "TSS"
  | "IU"
  | "MIS"
  | "ADN"
  | "ADS"
  | "SDN"
  | "SDS"
  | "PDI";

export const OFFICES: { code: OfficeCode; name: string; color: string }[] = [
  { code: "ORD", name: "Office of the Regional Director", color: "var(--office-ord)" },
  { code: "FOD", name: "Field Operations Division", color: "var(--office-fod)" },
  { code: "TSS", name: "Technical Support Services", color: "var(--office-tss)" },
  { code: "IU",  name: "Innovation Unit", color: "var(--office-iu)" },
  { code: "MIS", name: "Management Information Systems Unit", color: "var(--office-mis)" },
  { code: "ADN", name: "PSTO – Agusan del Norte", color: "var(--office-psto)" },
  { code: "ADS", name: "PSTO – Agusan del Sur", color: "var(--office-psto)" },
  { code: "SDN", name: "PSTO – Surigao del Norte", color: "var(--office-psto)" },
  { code: "SDS", name: "PSTO – Surigao del Sur", color: "var(--office-psto)" },
  { code: "PDI", name: "PSTO – Province of Dinagat Islands", color: "var(--office-psto)" },
];

// Expanded DOST document list (per iTRACK spec)
export const DOC_TYPES = [
  "Acceptance of Resignation",
  "Advice to Debit Account (ADA)",
  "Activity Proposal",
  "Activity Report",
  "Application for Leave (AFL)",
  "Authorization",
  "BED No. 1",
  "BED No. 2",
  "BED No. 3",
  "Budget Utilization Request and Status (BURS)",
  "Call Slip",
  "Certificate",
  "Certificate of Acceptance",
  "Certificate of Appearance",
  "Certificate of Completion (COC) Earned",
  "Certification",
  "Check",
  "Clearance Form",
  "Comparative Review of Technical Specifications",
  "Contract of Service (COS)",
  "Daily Time Record (DTR)",
  "Disbursement Voucher (DV)",
  "Document Control Form (DCF)",
  "Division Performance Commitment and Review (DPCR)",
  "DTR Accomplishment Report",
  "DOST Form 1 – Detailed Program Proposal",
  "DOST Form 2 – Detailed Project Proposal",
  "DOST Form 3 – Non-R&D Proposal",
  "DOST Form 4 – Project LIB",
  "DOST Form 5 – Workplan",
  "DOST Form 6 – Semi-Annual Progress Report",
  "DOST Form 7 – Annual Progress Report",
  "DOST Form 8 – Financial Report",
  "DOST Form 9 – Schedule of Accounts Payable",
  "DOST Form 11 – List of Personnel Involved",
  "DOST Form 12 – List of Equipment Purchased",
  "DOST Form 13 – Report of Income and Interest Earned",
  "DOST Form 14 – Appraisal Assessment Form",
  "DOST Form 15 – Terminal Report",
  "DOST Form 16 – Terminal Audited Financial Report",
  "DOST Form 18 – Terminal Financial Report",
  "Flight Booking Request",
  "Gender and Development (GAD) Checklist",
  "Incoming Communication",
  "Individual Performance Commitment and Review (IPCR)",
  "Inventory and Inspection of Unserviceable Property",
  "ISO/IEC 17025:2017 Documents",
  "Justification",
  "Letter",
  "Liquidation Report (LR)",
  "Mailing Slip",
  "Memorandum of Agreement (MOA)",
  "Memorandum of Understanding (MOU)",
  "Monthly Cash Program (MCP)",
  "National Memorandum",
  "National Special Order",
  "Narrative Process Report (NR)",
  "Nonconformity/Corrective Action for Improvement Report (NCCAIR)",
  "Official Business (OB) Pass Slip",
  "Obligation Request and Status (OBRS)",
  "Office Performance Commitment and Review (OPCR)",
  "Outgoing Communication",
  "Parcel",
  "Payroll",
  "Performance Contract",
  "Procedures Manual",
  "Project Accomplishment Report (AR)",
  "Project Procurement Management Plan (PPMP)",
  "Property Transfer Report",
  "Purchase Order (PO)",
  "Purchase Request (PR)",
  "Quality Manual",
  "Quality Objectives and Plans",
  "Regional Memorandum",
  "Regional Special Order",
  "Request Form for Certificate Deposit",
  "Request for Hiring Non-Permanent Personnel",
  "Risk and Opportunity Register",
  "Status of Quality Objectives",
  "Semi-Annual Progress Report",
  "TEV Documents",
  "Trip Ticket",
  "Transmittal Form",
  "Transmittal Letter",
  "Travel Order (TO)",
  "Work Instruction",
  "Work Breakdown Structure (WBS)",
  "Others",
] as const;

// Short acronyms for tracking-number generation
export const DOC_ACRONYMS: Record<string, string> = {
  "Memorandum of Agreement (MOA)": "MOA",
  "Memorandum of Understanding (MOU)": "MOU",
  "Purchase Request (PR)": "PR",
  "Purchase Order (PO)": "PO",
  "Disbursement Voucher (DV)": "DV",
  "Travel Order (TO)": "TO",
  "Incoming Communication": "IC",
  "Outgoing Communication": "OC",
  "Regional Memorandum": "RM",
  "Regional Special Order": "RSO",
  "National Memorandum": "NM",
  "National Special Order": "NSO",
  "Letter": "LTR",
  "Certification": "CERT",
  "Certificate": "CERT",
  "Activity Proposal": "AP",
  "Activity Report": "AR",
  "Application for Leave (AFL)": "AFL",
};

export type DocStatus =
  | "Received"
  | "Routed"
  | "Ongoing"
  | "Pending"
  | "For Approval"
  | "Approved"
  | "Released"
  | "Completed"
  | "Closed";

export const DOC_STATUSES: DocStatus[] = [
  "Received", "Routed", "Ongoing", "Pending", "For Approval", "Approved", "Released", "Completed", "Closed",
];

export type Confidentiality = "Public" | "Internal" | "Confidential" | "Highly Confidential";
export const CONFIDENTIALITY: Confidentiality[] = ["Public", "Internal", "Confidential", "Highly Confidential"];

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
  customType?: string;
  nature: string;
  sender: string;
  dateReceived: string;
  timeReceived: string;
  receivingOfficer: string;
  receivingOffice: OfficeCode;
  routedTo: OfficeCode;
  routedToOfficer?: string;
  releasingOffice?: string;
  dateReleased?: string;
  completedAt?: string;
  fileName?: string;
  confidentiality: Confidentiality | "Normal" | "Restricted";
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
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  participants?: string;
  stakeholders?: string;
  participantProfile?: string;
  scope?: "National" | "Regional";
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
    trackingNo: "DOST-IC-001",
    title: "Request for Endorsement – Regional Science Fair 2026",
    description: "Endorsement request from DepEd Caraga for the upcoming Regional Science Fair.",
    type: "Incoming Communication",
    nature: "External",
    sender: "DepEd Regional Office XIII",
    dateReceived: dateOnly(-2),
    timeReceived: "09:14",
    receivingOfficer: "Maria S. Cabrera",
    receivingOffice: "ORD",
    routedTo: "TSS",
    routedToOfficer: "J. Lim",
    confidentiality: "Internal",
    status: "Ongoing",
    directorInstructions: "Please coordinate with STIIDS and prepare draft endorsement by Friday.",
    timeline: [
      { id: "t1", at: iso(-2, 9), officer: "Maria S. Cabrera", action: "Document received", status: "Received" },
      { id: "t2", at: iso(-2, 11), officer: "Maria S. Cabrera", action: "Routed to Technical Support Services", status: "Routed", remarks: "For RD review and endorsement drafting" },
      { id: "t3", at: iso(-1, 14), officer: "J. Lim (TSS)", action: "Drafting endorsement", status: "Ongoing" },
    ],
    createdAt: iso(-2, 9),
  },
  {
    id: "d2",
    trackingNo: "DOST-RSO-025",
    title: "Special Order No. 25 – Designation of OIC",
    type: "Regional Special Order",
    nature: "Internal",
    sender: "Office of the Regional Director",
    dateReceived: dateOnly(-1),
    timeReceived: "10:30",
    receivingOfficer: "Anna R. Velasco",
    receivingOffice: "MIS",
    routedTo: "MIS",
    confidentiality: "Internal",
    status: "For Approval",
    timeline: [
      { id: "t1", at: iso(-1, 10), officer: "Anna R. Velasco", action: "Document received", status: "Received" },
      { id: "t2", at: iso(-1, 12), officer: "Anna R. Velasco", action: "Forwarded for RD signature", status: "For Approval" },
    ],
    createdAt: iso(-1, 10),
  },
  {
    id: "d3",
    trackingNo: "DOST-PR-014",
    title: "Procurement Request – Laboratory Equipment",
    type: "Purchase Request (PR)",
    nature: "Internal",
    sender: "PSTO Agusan del Norte",
    dateReceived: dateOnly(0),
    timeReceived: "08:55",
    receivingOfficer: "Pedro D. Ang",
    receivingOffice: "MIS",
    routedTo: "MIS",
    confidentiality: "Internal",
    status: "Pending",
    timeline: [
      { id: "t1", at: iso(0, 9), officer: "Pedro D. Ang", action: "Document received", status: "Received" },
    ],
    createdAt: iso(0, 9),
  },
  {
    id: "d4",
    trackingNo: "DOST-TO-007",
    title: "Travel Order – Manila Coordination Meeting",
    type: "Travel Order (TO)",
    nature: "Internal",
    sender: "Director's Office",
    dateReceived: dateOnly(-5),
    timeReceived: "13:20",
    receivingOfficer: "Maria S. Cabrera",
    receivingOffice: "ORD",
    routedTo: "MIS",
    releasingOffice: "MIS",
    dateReleased: dateOnly(-3),
    completedAt: iso(-3, 10),
    confidentiality: "Internal",
    status: "Released",
    timeline: [
      { id: "t1", at: iso(-5, 13), officer: "Maria S. Cabrera", action: "Received", status: "Received" },
      { id: "t2", at: iso(-4, 9), officer: "MIS", action: "Approved", status: "Approved" },
      { id: "t3", at: iso(-3, 10), officer: "MIS", action: "Released to traveler", status: "Released" },
    ],
    createdAt: iso(-5, 13),
  },
  {
    id: "d5",
    trackingNo: "DOST-RM-018",
    title: "HR Memo – Updated Leave Guidelines",
    type: "Regional Memorandum",
    nature: "Internal",
    sender: "HR Unit",
    dateReceived: dateOnly(-7),
    timeReceived: "15:00",
    receivingOfficer: "Anna R. Velasco",
    receivingOffice: "MIS",
    routedTo: "IU",
    completedAt: iso(-7, 15),
    confidentiality: "Internal",
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
    scope: "Regional",
    requiresRD: true,
    status: "Approved",
    organizer: "Office of the Regional Director",
    createdAt: iso(-3),
  },
  {
    id: "e2",
    title: "Budget Review Workshop",
    office: "MIS",
    venue: "MIS Training Room",
    date: dateOnly(2),
    startTime: "13:00",
    endTime: "17:00",
    type: "Workshop",
    scope: "Regional",
    requiresRD: false,
    status: "Approved",
    organizer: "Management Information Systems Unit",
    createdAt: iso(-2),
  },
  {
    id: "e3",
    title: "SETUP Beneficiary Visit – Butuan",
    office: "ADN",
    venue: "Butuan City",
    date: dateOnly(3),
    startTime: "08:00",
    endTime: "16:00",
    type: "Field Activity",
    scope: "Regional",
    requiresRD: false,
    status: "Approved",
    organizer: "PSTO Agusan del Norte",
    createdAt: iso(-1),
  },
  {
    id: "e4",
    title: "NMA – Stakeholders Consultation",
    office: "TSS",
    venue: "Almont Hotel",
    date: dateOnly(5),
    startTime: "09:00",
    endTime: "15:00",
    type: "Consultation",
    stakeholders: "LGUs, Academe, MSMEs",
    scope: "Regional",
    requiresRD: true,
    status: "Pending RD Approval",
    organizer: "Technical Support Services",
    createdAt: iso(0),
  },
  {
    id: "e5",
    title: "Innovation Roadshow Planning",
    office: "IU",
    venue: "DOST Caraga",
    date: dateOnly(7),
    startTime: "14:00",
    endTime: "16:00",
    type: "Planning",
    scope: "Regional",
    requiresRD: false,
    status: "Approved",
    organizer: "Innovation Unit",
    createdAt: iso(0),
  },
  {
    id: "e6",
    title: "NMA – Provincial Coordination Meeting",
    office: "SDN",
    venue: "Surigao City",
    date: dateOnly(9),
    startTime: "10:00",
    endTime: "15:00",
    type: "Meeting",
    scope: "Regional",
    requiresRD: true,
    status: "Pending RD Approval",
    organizer: "PSTO Surigao del Norte",
    createdAt: iso(0),
  },
];

let _seq = 200;
export function generateTrackingNo(type?: string) {
  _seq += 1;
  const acr = (type && DOC_ACRONYMS[type]) || "DOC";
  return `DOST-${acr}-${String(_seq).padStart(3, "0")}`;
}

export const officeMeta = (code: OfficeCode) =>
  OFFICES.find((o) => o.code === code) ?? OFFICES[OFFICES.length - 1];
