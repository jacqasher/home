import {
  Button,
  Callout,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CollapsibleSection,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  IconButton,
  Link,
  Pill,
  Row,
  Select,
  Spacer,
  Stack,
  Stat,
  Swatch,
  Table,
  Text,
  TextArea,
  TextInput,
  useCanvasAction,
  useCanvasState,
  useHostTheme,
} from "cursor/canvas";

// Medico-legal app brand tokens
const ASHER = {
  navy: "#011936",
  coral: "#f08080",
  bg: "#ffffff",
  muted: "#d9d9d9",
  text: "#000000",
  nav: "rgba(1, 25, 54, 0.72)",
  border: "rgba(1, 25, 54, 0.08)",
  borderStrong: "rgba(1, 25, 54, 0.35)",
  coralSoft: "rgba(240, 128, 128, 0.12)",
  coralUnderline: "rgba(240, 128, 128, 0.55)",
  fontSerif: 'Calibri, "Helvetica Neue", Helvetica, Arial, sans-serif',
  fontMono: 'Calibri, "Helvetica Neue", Helvetica, Arial, sans-serif',
} as const;

function asherSectionLabelStyle() {
  return {
    fontFamily: ASHER.fontMono,
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: "-0.045em",
    textDecoration: "underline",
    textUnderlineOffset: "0.2em",
    textDecorationColor: ASHER.coralUnderline,
    color: ASHER.navy,
  };
}

function asherOutlineButtonStyle(variant: "default" | "accent" = "default", emphasized = false) {
  if (variant === "accent") {
    return {
      border: `${emphasized ? 2 : 1}px solid ${ASHER.coral}`,
      background: ASHER.bg,
      color: ASHER.coral,
      fontFamily: ASHER.fontMono,
      fontSize: 14,
      letterSpacing: "-0.045em",
      borderRadius: 0,
      padding: emphasized ? "5px 12px" : "6px 12px",
      boxSizing: "border-box" as const,
    };
  }
  return {
    border: `1px solid ${ASHER.borderStrong}`,
    background: ASHER.bg,
    color: ASHER.navy,
    fontFamily: ASHER.fontMono,
    fontSize: 14,
    letterSpacing: "-0.045em",
    borderRadius: 0,
    padding: "6px 12px",
  };
}

function asherHeadingStyle(level: "h2" | "h3" = "h2") {
  return {
    margin: 0,
    fontFamily: ASHER.fontSerif,
    fontWeight: 300,
    letterSpacing: "-0.03em",
    color: ASHER.navy,
    fontSize: level === "h2" ? 24 : 20,
    lineHeight: 1.25,
  };
}

function AsherOutlineButton({
  children,
  onClick,
  accent,
  emphasized,
  disabled,
  style,
}: {
  children: string;
  onClick?: () => void;
  accent?: boolean;
  emphasized?: boolean;
  disabled?: boolean;
  style?: Record<string, string | number>;
}) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      disabled={disabled}
      style={{
        ...asherOutlineButtonStyle(accent ? "accent" : "default", emphasized),
        ...style,
      }}
    >
      {children}
    </Button>
  );
}

// ── Types ──────────────────────────────────────────────────────────────────

type MatterStatus =
  | "intake"
  | "records_requested"
  | "records_received"
  | "analysis"
  | "expert_brief"
  | "closed";

type MatterFileStatus = "received" | "in_progress" | "complete";

type RecordStatus = "pending" | "received" | "follow_up";

interface Matter {
  id: string;
  matterNumber: string;
  clientName: string;
  clientDOB: string;
  defendantName: string;
  injuryDate: string;
  injuryDescription: string;
  claimType: string;
  status: MatterStatus;
  createdAt: string;
  solicitor: string;
  notes: string;
  lastActionNote: string;
  followUpNote: string;
  packetReceivedDate?: string;
  packetReturnedDate?: string;
  progressNotes?: string;
  matterSummary?: string;
  fileStatus?: MatterFileStatus;
  invoiceSentDate?: string;
  invoiceAmount?: string;
  invoiceReturnDate?: string;
  preliminaryChecklist?: {
    conflictOfInterest: boolean;
    retainerAndAuthority: boolean;
    previousLitigation: boolean;
  };
}

interface RecordRequest {
  id: string;
  matterId: string;
  provider: string;
  providerType: string;
  dateRequested: string;
  dateReceived: string;
  status: RecordStatus;
  dateRange: string;
  notes: string;
}

interface ChronologyEntry {
  id: string;
  matterId: string;
  date: string;
  provider: string;
  eventType: string;
  description: string;
  relevance: "high" | "medium" | "low";
  sourceRef: string;
}

type PartyRole = "defendant" | "third_party" | "employer" | "insurer" | "other";
type PursueDecision = "yes" | "no" | "under_review";

interface MatterParty {
  id: string;
  matterId: string;
  name: string;
  role: PartyRole;
  relationship: string;
  liabilityNotes: string;
  pursue: PursueDecision;
  pursueRationale: string;
}

interface SolCheck {
  matterId: string;
  jurisdiction: string;
  limitationYears: number;
  accrualDate: string;
  useDiscoveryDate: boolean;
  discoveryDate: string;
  verified: boolean;
  verifiedDate: string;
  notes: string;
}

interface LetterOfInstruction {
  matterId: string;
  preparedFor: string;
  injuryOverview: string;
  executiveSummary: string;
  chronologyNarrative: string;
  summary: string;
  questionsForExpert: string;
}

interface TimeEntry {
  id: string;
  matterId: string;
  date: string;
  description: string;
  hours: number;
  rate: number;
  category: string;
  billingStatus?: BillingStatus;
  invoiceId?: string;
  followUpDate?: string;
}

type BillingStatus = "unbilled" | "invoiced" | "invoice_sent" | "paid" | "written_off";

type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "written_off";

interface Invoice {
  id: string;
  matterId: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  entryIds: string[];
  total: number;
  status: InvoiceStatus;
  followUpDate: string;
  notes: string;
  billedToName: string;
  billedToAddress: string;
  billedToPhone: string;
}

type DeadlineType =
  | "court_filing"
  | "party_response"
  | "hearing"
  | "discovery"
  | "other";

type DeadlineStatus = "pending" | "completed";

interface Deadline {
  id: string;
  matterId: string;
  date: string;
  title: string;
  type: DeadlineType;
  party: string;
  status: DeadlineStatus;
  notes: string;
}

type CorrespondenceDirection = "inbound" | "outbound";

type CorrespondenceType =
  | "letter"
  | "email"
  | "fax"
  | "notice"
  | "court_document"
  | "expert_report"
  | "other";

interface CorrespondenceItem {
  id: string;
  matterId: string;
  date: string;
  direction: CorrespondenceDirection;
  type: CorrespondenceType;
  party: string;
  subject: string;
  reference: string;
  summary: string;
  tags?: string[];
  body?: string;
  attachmentName?: string;
  attachmentPath?: string;
}

const CORRESPONDENCE_TAGS = [
  "Client",
  "Defendant",
  "Medical",
  "Expert",
  "Court",
  "Insurer",
  "Internal",
] as const;

type Tab =
  | "overview"
  | "records"
  | "correspondence"
  | "chronology"
  | "advice"
  | "billing"
  | "calendar"
  | "register"
  | "links";

type LibraryRoute =
  | "template-chronology"
  | "template-advice"
  | "template-invoice"
  | "template-email-records"
  | "template-email-expert"
  | "template-email-defendant"
  | "workflow-chronology"
  | "workflow-advice";

type LibraryItem = "chronology" | "advice";

type EmailTemplateKind = "records" | "expert" | "defendant";

const EMAIL_TEMPLATE_DEFINITIONS: Record<
  EmailTemplateKind,
  { title: string; description: string; subject: string; fields: string[]; body: string }
> = {
  records: {
    title: "Records request follow-up",
    description: "Chase a provider or hospital for outstanding clinical records under the Health Records Act.",
    subject: "Follow-up — request for medical records",
    fields: ["Provider name", "Original request date", "Records requested", "Authority enclosed (Y/N)"],
    body:
      "Dear [Provider],\n\nWe refer to our letter dated [date] requesting [records]. We have not yet received the records or an acknowledgment.\n\nPlease confirm receipt and advise when the records will be released.\n\nYours faithfully,",
  },
  expert: {
    title: "Expert briefing",
        description: "Cover email when sending a letter of instruction, chronology, and records to an expert.",
        subject: "Medicolegal opinion — [Client name]",
        fields: ["Expert name", "Enclosures list", "Reply-by date", "Fee estimate requested (Y/N)"],
        body:
          "Dear Dr [Name],\n\nWe act for [client] in relation to [injury/incident]. Please find enclosed a letter of instruction, chronology, and relevant records.\n\nWe would be grateful for your opinion on the enclosed questions. Please advise your fee estimate and earliest availability.\n\nYours faithfully,",
  },
  defendant: {
    title: "Defendant correspondence",
    description: "Formal email to defendant solicitors — acknowledgments, requests, or responses.",
    subject: "[Client name] — [matter reference]",
    fields: ["Defendant firm", "Your reference", "Defendant reference", "Purpose (acknowledge / request / reply)"],
    body:
      "Dear [Solicitor],\n\nWe act for [client] in the above matter.\n\n[Insert purpose — e.g. we acknowledge your letter dated [date] and enclose our client's response to your request for particulars.]\n\nYours faithfully,",
  },
};

const LOI_HEADING_FIELDS: [string, string][] = [
  ["Ref", "Matter reference (e.g. ML-0100134)"],
  ["Prepared For", "Expert physician or specialist receiving the brief"],
  ["Prepared By", "Consulting firm or instructing party"],
  ["Date", "Date of issue (dd Mmm yyyy)"],
  ["Plaintiff Name", "Full name of the injured client"],
  ["DOB", "Client date of birth (dd Mmm yyyy)"],
];

const LOI_HEADING_EXAMPLE: [string, string][] = [
  ["Ref", "ML-0100134"],
  ["Prepared For", "Expert Physician"],
  ["Prepared By", "Medico-Legal Consulting"],
  ["Date", "24 June 2025"],
  ["Plaintiff Name", "Client Name"],
  ["DOB", "03/05/1979"],
];

const LOI_SECTION_GUIDANCE: [string, string][] = [
  [
    "Injury overview",
    "Brief neutral snapshot of the injury, treatment to date, and current functional status (one paragraph).",
  ],
  [
    "Executive Summary",
    "Concise overview of the claim, key events, and the client's current presentation.",
  ],
  [
    "Chronology of Significant Events",
    "Date-ordered narrative paragraphs summarising clinically significant events from the records.",
  ],
  [
    "Summary",
    "Synthesis of findings, objective evidence, and outstanding issues before requesting expert opinion.",
  ],
  [
    "Questions for the expert",
    "Bullet list of specific matters on which opinion is sought, introduced by: We would be most grateful for your opinion on the following issues:",
  ],
];

const LOI_BRAND = {
  firmLine1: "Medico-Legal Consulting",
  firmLine2: "Expert Brief Pack",
  packTitle: "Letter of Instruction",
  preparedBy: "Medico-Legal Consulting",
};

const CHRONOLOGY_PREVIOUS_HISTORY_BULLETS = [
  "Date — event date (dd Mmm yyyy)",
  "Event — surgery type or description, diagnosis, or other clinically relevant episode",
  "Location — hospital, clinic, or facility",
  "Physician — treating doctor or surgeon",
];

const CHRONOLOGY_COLUMN_ROWS: [string, string][] = [
  ["Date", "Event date (ISO or dd Mmm yyyy)"],
  ["Provider / source", "Treating clinician, hospital, or document"],
  ["Event type", "Consultation, imaging, referral, procedure, etc."],
  ["Description", "Neutral summary of the clinical event"],
  ["Reference", "Page, record ID, or exhibit mark"],
];

const INVOICE_FROM = {
  name: "Medico-Legal Consulting",
  addressLines: ["Address line 1", "Address line 2"],
  email: "billing@example.com",
  abn: "",
};

const INVOICE_PAYMENT = {
  terms: "Please pay within 30 days of receiving this invoice.",
  thanks: "Thanks for the business!",
  accountName: "",
  accountNumber: "",
  bsb: "",
  bank: "",
  contactEmail: "",
};

const INVOICE_LAYOUT_SECTIONS: [string, string][] = [
  ["Header", "Invoice (left) and invoice number No ### (right)"],
  ["Amount & dates", "Payable $, Due date, Issued date, Ref #INV-###"],
  ["Billed to", "Firm name, address lines, phone number"],
  ["From", "Consultant name, address, email, ABN"],
  [
    "Invoice details",
    "Right-aligned with one-third blank margin — Legal Research section, client name, Qty, Rate, Amount",
  ],
  ["Totals", "Grey rule, Subtotal, not registered for GST, grey rule, Total (bold)"],
  ["Payment details", "Payment terms, thanks, and bank account details"],
];

const INVOICE_FIELD_ROWS: [string, string][] = INVOICE_LAYOUT_SECTIONS;

const TEMPLATE_ITEMS: {
  route: LibraryRoute;
  label: string;
  icon: "document" | "email" | "invoice";
}[] = [
  { route: "template-chronology", label: "Chronology", icon: "document" },
  { route: "template-advice", label: "Letter of Instruction", icon: "document" },
  { route: "template-invoice", label: "Invoice", icon: "invoice" },
  { route: "template-email-records", label: "Records request follow-up", icon: "email" },
  { route: "template-email-expert", label: "Expert briefing", icon: "email" },
  { route: "template-email-defendant", label: "Defendant correspondence", icon: "email" },
];

const LIBRARY_WORKFLOW_ITEMS: { route: LibraryRoute; label: string; item: LibraryItem }[] = [
  { route: "workflow-chronology", label: "Chronology", item: "chronology" },
  { route: "workflow-advice", label: "Letter of Instruction", item: "advice" },
];

function libraryRouteLabel(route: LibraryRoute): string {
  const map: Record<LibraryRoute, string> = {
    "template-chronology": "Template · Chronology",
    "template-advice": "Template · Letter of Instruction",
    "template-invoice": "Template · Invoice",
    "template-email-records": "Template · Records request follow-up",
    "template-email-expert": "Template · Expert briefing",
    "template-email-defendant": "Template · Defendant correspondence",
    "workflow-chronology": "Workflow · Chronology",
    "workflow-advice": "Workflow · Letter of Instruction",
  };
  return map[route];
}

function templateEmailKind(route: LibraryRoute): EmailTemplateKind | "" {
  if (route === "template-email-records") return "records";
  if (route === "template-email-expert") return "expert";
  if (route === "template-email-defendant") return "defendant";
  return "";
}

function libraryItemTab(item: LibraryItem): Tab {
  return item === "chronology" ? "chronology" : "advice";
}

interface MatterTask {
  id: string;
  matterId: string;
  title: string;
  dueDate: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
}

interface ResearchLink {
  id: string;
  category: string;
  title: string;
  url: string;
  description: string;
}

const DEFAULT_RESEARCH_LINKS: ResearchLink[] = [
  {
    id: "link-austlii",
    category: "Case law",
    title: "AustLII",
    url: "https://www.austlii.edu.au/",
    description: "Free access to Australian case law, legislation, and treaties.",
  },
  {
    id: "link-jade",
    category: "Case law",
    title: "JADE — Case Law",
    url: "https://jade.io/",
    description: "Searchable Australian judgments with citation tools and note-up.",
  },
  {
    id: "link-vic-cases",
    category: "Case law",
    title: "Victorian Reports & unreported judgments",
    url: "https://www.austlii.edu.au/databases.html#vic",
    description: "Victorian superior and lower court decisions via AustLII.",
  },
  {
    id: "link-legislation-vic",
    category: "Legislation",
    title: "Victorian Legislation",
    url: "https://www.legislation.vic.gov.au/",
    description: "Current and historical Victorian Acts and statutory rules.",
  },
  {
    id: "link-legislation-commonwealth",
    category: "Legislation",
    title: "Federal Register of Legislation",
    url: "https://www.legislation.gov.au/",
    description: "Commonwealth Acts, regulations, and compilations.",
  },
  {
    id: "link-tga-artg",
    category: "Medical devices & therapeutics",
    title: "TGA — Australian Register of Therapeutic Goods (ARTG)",
    url: "https://www.tga.gov.au/resources/artg",
    description: "Search registered medicines, medical devices, and sponsors in Australia.",
  },
  {
    id: "link-tga-devices",
    category: "Medical devices & therapeutics",
    title: "TGA — Medical devices hub",
    url: "https://www.tga.gov.au/products/medical-devices",
    description: "Classification, regulation, and safety alerts for medical devices.",
  },
  {
    id: "link-ahpra",
    category: "Medical regulators",
    title: "AHPRA — Practitioner register",
    url: "https://www.ahpra.gov.au/Registration/Registers-of-Practitioners.aspx",
    description: "Verify medical practitioner registration, conditions, and specialties.",
  },
  {
    id: "link-mbs",
    category: "Medical regulators",
    title: "MBS Online",
    url: "https://www9.health.gov.au/mbs/fullDisplay.cfm",
    description: "Medicare Benefits Schedule item numbers, descriptors, and fees.",
  },
  {
    id: "link-oic-health",
    category: "Health records & privacy",
    title: "OAIC — Health records guidance",
    url: "https://www.oaic.gov.au/privacy/your-privacy-rights/health-and-medical",
    description: "Privacy rights and guidance for health information in Australia.",
  },
  {
    id: "link-health-records-vic",
    category: "Health records & privacy",
    title: "Health Records Act 2001 (Vic)",
    url: "https://www.legislation.vic.gov.au/in-force/acts/health-records-act-2001",
    description: "Victorian framework for access to and handling of health records.",
  },
  {
    id: "link-county-court",
    category: "Courts & tribunals",
    title: "County Court of Victoria",
    url: "https://www.countycourt.vic.gov.au/",
    description: "Practice directions, forms, and listings for personal injury matters.",
  },
  {
    id: "link-vcat",
    category: "Courts & tribunals",
    title: "VCAT",
    url: "https://www.vcat.vic.gov.au/",
    description: "Victorian Civil and Administrative Tribunal — forms, lists, and decisions.",
  },
  {
    id: "link-tac",
    category: "Compensation schemes",
    title: "TAC Victoria",
    url: "https://www.tac.vic.gov.au/",
    description: "Transport accident compensation policies, forms, and clinical resources.",
  },
  {
    id: "link-worksafe",
    category: "Compensation schemes",
    title: "WorkSafe Victoria",
    url: "https://www.worksafe.vic.gov.au/",
    description: "Work injury compensation, IME guidance, and employer obligations.",
  },
];

// ── Seed data ──────────────────────────────────────────────────────────────

const SAMPLE_MATTER_ID = "matter-001";

const DEFAULT_MATTERS: Matter[] = [
  {
    id: SAMPLE_MATTER_ID,
    matterNumber: "ML-2026-0042",
    clientName: "Sarah Chen",
    clientDOB: "1985-03-14",
    defendantName: "Metro Transit Authority",
    injuryDate: "2024-11-08",
    injuryDescription:
      "Rear-end motor vehicle collision at traffic lights. Client was stationary when struck by bus. Whiplash-associated disorder with cervical and lumbar radiculopathy.",
    claimType: "Personal injury — motor accident",
    status: "analysis",
    createdAt: "2026-01-15",
    solicitor: "J. Asher",
    notes:
      "Client employed as retail manager. Off work 14 weeks. Returned to modified duties. Medicare and private health (Bupa) in place.",
    lastActionNote:
      "Sent letter of advice to Dr James Okonkwo (14 Mar 2026), awaiting reply.",
    followUpNote: "Follow up email in 3 days if no response.",
    packetReceivedDate: "2026-01-15",
    packetReturnedDate: "",
    progressNotes:
      "Letter of advice sent to Dr Okonkwo 14 Mar. Awaiting expert report. Defendant IME served — response due end July.",
    matterSummary:
      "Rear-end MVA (Nov 2024). Cervical/lumbar radiculopathy. Liability not in issue. Dispute on causation and treatment reasonableness.",
    fileStatus: "in_progress",
    invoiceSentDate: "",
    invoiceAmount: "",
    invoiceReturnDate: "",
    preliminaryChecklist: {
      conflictOfInterest: true,
      retainerAndAuthority: true,
      previousLitigation: false,
    },
  },
];

const DEFAULT_RECORDS: RecordRequest[] = [
  {
    id: "rec-1",
    matterId: SAMPLE_MATTER_ID,
    provider: "Royal Melbourne Hospital — Emergency",
    providerType: "hospital",
    dateRequested: "2026-01-20",
    dateReceived: "2026-02-04",
    status: "received",
    dateRange: "08/11/2024 – 09/11/2024",
    notes: "ED presentation, CT cervical spine, discharge summary.",
  },
  {
    id: "rec-2",
    matterId: SAMPLE_MATTER_ID,
    provider: "Dr Helen Park — GP (Collins St Medical)",
    providerType: "gp",
    dateRequested: "2026-01-20",
    dateReceived: "2026-02-12",
    status: "received",
    dateRange: "01/01/2024 – present",
    notes: "Full clinical notes including referral letters.",
  },
  {
    id: "rec-3",
    matterId: SAMPLE_MATTER_ID,
    provider: "Melbourne Spine & Pain Clinic — Dr James Okonkwo",
    providerType: "specialist",
    dateRequested: "2026-01-22",
    dateReceived: "",
    status: "follow_up",
    dateRange: "All attendances",
    notes: "Second follow-up sent 03/03/2026. IME report from defendant received — need treating specialist notes.",
  },
  {
    id: "rec-4",
    matterId: SAMPLE_MATTER_ID,
    provider: "Insight Radiology — MRI lumbar spine",
    providerType: "radiology",
    dateRequested: "2026-02-01",
    dateReceived: "2026-02-18",
    status: "received",
    dateRange: "15/01/2025",
    notes: "Report and images on USB.",
  },
];

const DEFAULT_CORRESPONDENCE: CorrespondenceItem[] = [
  {
    id: "corr-1",
    matterId: SAMPLE_MATTER_ID,
    date: "2026-01-15",
    direction: "inbound",
    type: "letter",
    party: "Sarah Chen (client)",
    subject: "Instructions to act — MVA 8 Nov 2024",
    reference: "File note / retainer",
    summary: "Client engages firm. Provides TAC claim number, employer details, and brief account of accident.",
    tags: ["Client", "Internal"],
  },
  {
    id: "corr-2",
    matterId: SAMPLE_MATTER_ID,
    date: "2026-01-20",
    direction: "outbound",
    type: "letter",
    party: "Royal Melbourne Hospital — Health Records",
    subject: "Request for medical records — s 21 Health Records Act",
    reference: "LTR-001",
    summary: "Request ED notes, imaging, discharge summary for 8–9 Nov 2024.",
    tags: ["Medical"],
  },
  {
    id: "corr-3",
    matterId: SAMPLE_MATTER_ID,
    date: "2026-01-20",
    direction: "outbound",
    type: "letter",
    party: "Dr Helen Park — Collins St Medical",
    subject: "Request for clinical notes and referral letters",
    reference: "LTR-002",
    summary: "Request full GP records from 1 Jan 2024 to present.",
    tags: ["Medical"],
  },
  {
    id: "corr-4",
    matterId: SAMPLE_MATTER_ID,
    date: "2026-02-18",
    direction: "inbound",
    type: "email",
    party: "HWL Ebsworth — defendant solicitors",
    subject: "Metro Transit Authority — Chen matter",
    reference: "Email 18/02/2026",
    summary: "Acknowledge act. Request 28 days to obtain instructions. Enclose defendant's insurer details.",
    tags: ["Defendant", "Insurer"],
    body: "We acknowledge your act for Ms Chen. We require 28 days to obtain instructions. We act for Metro Transit Authority and its insurer.",
  },
  {
    id: "corr-5",
    matterId: SAMPLE_MATTER_ID,
    date: "2026-03-05",
    direction: "inbound",
    type: "expert_report",
    party: "Dr Whitfield (defendant IME)",
    subject: "Independent medical examination report",
    reference: "IME report 22/09/2025 (served)",
    summary: "IME opines minor soft tissue injury, pre-existing degeneration, full recovery within 6 months.",
    tags: ["Expert", "Defendant"],
  },
  {
    id: "corr-6",
    matterId: SAMPLE_MATTER_ID,
    date: "2026-03-14",
    direction: "outbound",
    type: "letter",
    party: "Dr James Okonkwo — Melbourne Spine & Pain Clinic",
    subject: "Letter of advice — request for medicolegal opinion",
    reference: "LTR-015",
    summary: "Enclose chronology, records, and IME. Seek opinion on causation, prognosis, and treatment reasonableness.",
    tags: ["Expert", "Medical"],
    body: "Dear Dr Okonkwo,\n\nWe act for Ms Sarah Chen. Please find enclosed a chronology of medical events, treating records, and the defendant's IME report.\n\nWe would be grateful for your opinion on causation, prognosis, and reasonableness of treatment.\n\nYours faithfully,\nJ. Asher",
  },
  {
    id: "corr-7",
    matterId: SAMPLE_MATTER_ID,
    date: "2026-06-27",
    direction: "inbound",
    type: "letter",
    party: "HWL Ebsworth — defendant solicitors",
    subject: "Further and better particulars of injury and treatment",
    reference: "LTR-DEF-042",
    summary: "Request particulars re pre-existing conditions, treatment providers, and employment history.",
    tags: ["Defendant"],
  },
  {
    id: "corr-8",
    matterId: SAMPLE_MATTER_ID,
    date: "2026-07-02",
    direction: "inbound",
    type: "notice",
    party: "County Court of Victoria",
    subject: "Directions hearing — 15 Aug 2026",
    reference: "Court notice GEN-2026-8841",
    summary: "First directions listed 10:00am Court 4.2. Orders include chronology and witness statements.",
    tags: ["Court"],
  },
  {
    id: "corr-9",
    matterId: SAMPLE_MATTER_ID,
    date: "2026-07-10",
    direction: "outbound",
    type: "email",
    party: "Sarah Chen (client)",
    subject: "Update — IME report and next steps",
    reference: "Email 10/07/2026",
    summary: "Advise client of defendant IME, expert brief to Dr Okonkwo, and upcoming directions hearing.",
    tags: ["Client"],
    body: "Hi Sarah,\n\nFurther to our conversation, please find an update on the defendant's IME report. We have briefed Dr Okonkwo and have a directions hearing on 15 August.\n\nRegards,\nJ. Asher",
  },
];

const DEFAULT_CHRONOLOGY: ChronologyEntry[] = [
  {
    id: "ch-1",
    matterId: SAMPLE_MATTER_ID,
    date: "2024-11-08",
    provider: "RMH Emergency",
    eventType: "Presentation",
    description:
      "MVA — rear-end collision. C/o neck pain, headache, lower back pain. GCS 15. C-spine cleared clinically. Prescribed paracetamol, diazepam 5mg PRN.",
    relevance: "high",
    sourceRef: "RMH ED notes p.1-3",
  },
  {
    id: "ch-2",
    matterId: SAMPLE_MATTER_ID,
    date: "2024-11-09",
    provider: "Dr Park (GP)",
    eventType: "Review",
    description:
      "Post-MVA review. Restricted ROM cervical spine. Tender paraspinal muscles. Cert unfit 2 weeks. Referred for physiotherapy.",
    relevance: "high",
    sourceRef: "GP notes 09/11/2024",
  },
  {
    id: "ch-3",
    matterId: SAMPLE_MATTER_ID,
    date: "2024-12-02",
    provider: "Active Physio — Ms Tran",
    eventType: "Treatment",
    description:
      "8 sessions manual therapy, exercise programme. Subjective improvement in neck but persistent lumbar pain on prolonged standing.",
    relevance: "medium",
    sourceRef: "Physio discharge summary",
  },
  {
    id: "ch-4",
    matterId: SAMPLE_MATTER_ID,
    date: "2025-01-15",
    provider: "Insight Radiology",
    eventType: "Investigation",
    description:
      "MRI lumbar spine: L4/5 broad-based disc bulge with mild bilateral foraminal narrowing. No cauda equina. Degenerative changes L5/S1.",
    relevance: "high",
    sourceRef: "MRI report 15/01/2025",
  },
  {
    id: "ch-5",
    matterId: SAMPLE_MATTER_ID,
    date: "2025-02-20",
    provider: "Dr Okonkwo (Pain specialist)",
    eventType: "Specialist review",
    description:
      "Diagnosis: cervical WAD Grade II, lumbar radiculopathy L5 distribution. Commenced pregabalin 75mg BD, recommended 3 epidural steroid injections.",
    relevance: "high",
    sourceRef: "Specialist letter 20/02/2025",
  },
  {
    id: "ch-6",
    matterId: SAMPLE_MATTER_ID,
    date: "2025-06-10",
    provider: "Dr Okonkwo (Pain specialist)",
    eventType: "Procedure",
    description:
      "Lumbar transforaminal ESI L4/5 — right. Transient 40% pain relief for 6 weeks, then recurrence.",
    relevance: "high",
    sourceRef: "Procedure note 10/06/2025",
  },
  {
    id: "ch-7",
    matterId: SAMPLE_MATTER_ID,
    date: "2025-09-22",
    provider: "Dr Whitfield (Defendant IME)",
    eventType: "Independent examination",
    description:
      "IME opinion: soft tissue injury only, pre-existing degenerative disease, full recovery expected within 6 months of accident. Criticised ESI as unnecessary.",
    relevance: "high",
    sourceRef: "IME report 22/09/2025",
  },
];

const DEFAULT_PARTIES: MatterParty[] = [
  {
    id: "pty-1",
    matterId: SAMPLE_MATTER_ID,
    name: "Metro Transit Authority",
    role: "defendant",
    relationship: "Employer/operator of the bus that rear-ended client's stationary vehicle",
    liabilityNotes:
      "Vicarious liability for bus driver. Client stationary at lights — fault likely non-issue. Insured, solvent public authority.",
    pursue: "yes",
    pursueRationale: "Primary defendant. Clear mechanism, admitted liability in TAC material.",
  },
  {
    id: "pty-2",
    matterId: SAMPLE_MATTER_ID,
    name: "Bus driver (name TBC from discovery)",
    role: "third_party",
    relationship: "Driver of at-fault vehicle",
    liabilityNotes:
      "Potential concurrent tortfeasor. Likely covered by employer's vicarious liability.",
    pursue: "no",
    pursueRationale: "Not worth pursuing individually — recovery against MTA sufficient; driver unlikely to add recoverable damages.",
  },
  {
    id: "pty-3",
    matterId: SAMPLE_MATTER_ID,
    name: "Department of Transport — traffic signal maintenance",
    role: "third_party",
    relationship: "Alleged traffic light malfunction raised in client instructions (unconfirmed)",
    liabilityNotes:
      "No evidence in records to date. Would require engineer report and council/DoT records.",
    pursue: "under_review",
    pursueRationale: "Deprioritise unless chronology or witness statements support signal failure. Reassess after discovery.",
  },
];

const DEFAULT_SOL: Record<string, SolCheck> = {
  [SAMPLE_MATTER_ID]: {
    matterId: SAMPLE_MATTER_ID,
    jurisdiction: "VIC",
    limitationYears: 6,
    accrualDate: "2024-11-08",
    useDiscoveryDate: false,
    discoveryDate: "",
    verified: true,
    verifiedDate: "2026-01-15",
    notes:
      "TAC scheme: serious injury/common law limitation 6 years from date of injury (verify impairment certificate and election timelines separately — NOI lodged 12 Dec 2024). Also confirm no earlier accrual trigger on discovery of latent injury.",
  },
};

const DEFAULT_LETTERS: Record<string, LetterOfInstruction> = {
  [SAMPLE_MATTER_ID]: {
    matterId: SAMPLE_MATTER_ID,
    preparedFor: "Dr James Okonkwo",
    injuryOverview:
      "Client with ongoing cervical and lumbar symptoms following a rear-end motor vehicle accident. Despite conservative management and specialist review, the client reports continuing pain, restricted function, and modified duties at work.",
    executiveSummary:
      "Client alleges ongoing spinal symptoms following a motor vehicle accident on 8 November 2024. Following conservative treatment and specialist review, the client reports persistent neck and lumbar pain with right leg radiculopathy, reduced activity tolerance, and inability to return to pre-injury employment.",
    chronologyNarrative:
      "On 8 November 2024, the client reported sustaining injuries when her stationary vehicle was rear-ended by a bus. GP records document WAD Grade II with L5 radiculopathy. MRI L-spine (15 January 2025) demonstrated L4/5 disc bulge with mild foraminal narrowing. Treating specialist Dr Okonkwo maintains accident-related pathology; defendant IME Dr Whitfield attributes symptoms to pre-existing degenerative disease.",
    summary:
      "The records demonstrate objective imaging findings and ongoing specialist management. Defendant IME opines minor soft tissue injury with full recovery within six months. Treating records support ongoing functional limitation, disputed causation, and reasonableness of pain management including ESI.",
    questionsForExpert:
      "• Are the client's current symptoms consistent with the accident mechanism?\n• Is the L4/5 disc pathology acute/aggravated by trauma or pre-existing?\n• Was the ESI reasonable? Are further injections warranted?\n• What is the prognosis for return to pre-injury duties?\n• Is there a permanent impairment rating under AMA Guides?",
  },
};

const DEFAULT_TIME: TimeEntry[] = [
  {
    id: "t-1",
    matterId: SAMPLE_MATTER_ID,
    date: "2026-01-15",
    description: "Initial client conference and file opening",
    hours: 1.5,
    rate: 450,
    category: "Conference",
  },
  {
    id: "t-2",
    matterId: SAMPLE_MATTER_ID,
    date: "2026-01-20",
    description: "Draft and send medical record requests (4 providers)",
    hours: 0.8,
    rate: 350,
    category: "Correspondence",
  },
  {
    id: "t-3",
    matterId: SAMPLE_MATTER_ID,
    date: "2026-02-28",
    description: "Review received records — hospital and GP",
    hours: 2.2,
    rate: 450,
    category: "Analysis",
  },
  {
    id: "t-4",
    matterId: SAMPLE_MATTER_ID,
    date: "2026-03-10",
    description: "Prepare chronology of medical events",
    hours: 3.0,
    rate: 450,
    category: "Analysis",
  },
  {
    id: "t-5",
    matterId: SAMPLE_MATTER_ID,
    date: "2026-03-14",
    description: "Draft letter of advice to treating specialist",
    hours: 1.7,
    rate: 450,
    category: "Drafting",
  },
];

const DEFAULT_INVOICES: Invoice[] = [];

const DEFAULT_TASKS: MatterTask[] = [
  {
    id: "task-1",
    matterId: SAMPLE_MATTER_ID,
    title: "Follow up Royal Melbourne Hospital records",
    dueDate: "2026-07-17",
    status: "pending",
  },
  {
    id: "task-2",
    matterId: SAMPLE_MATTER_ID,
    title: "Review defendant IME report and draft response",
    dueDate: "2026-07-25",
    status: "pending",
  },
  {
    id: "task-3",
    matterId: SAMPLE_MATTER_ID,
    title: "Send chronology to expert Dr Okonkwo",
    dueDate: "2026-07-20",
    status: "in_progress",
  },
];

const DEFAULT_DEADLINES: Deadline[] = [
  {
    id: "dl-1",
    matterId: SAMPLE_MATTER_ID,
    date: "2026-07-20",
    title: "Brief treating specialist — letter of advice",
    type: "party_response",
    party: "Dr James Okonkwo",
    status: "pending",
    notes: "Send chronology, IME report, and questions for opinion.",
  },
  {
    id: "dl-2",
    matterId: SAMPLE_MATTER_ID,
    date: "2026-07-25",
    title: "Response to defendant's IME report",
    type: "party_response",
    party: "Defendant solicitors — HWL Ebsworth",
    status: "pending",
    notes: "28-day response period from receipt (27 Jun 2026). Address causation and treatment reasonableness.",
  },
  {
    id: "dl-3",
    matterId: SAMPLE_MATTER_ID,
    date: "2026-07-30",
    title: "Reply to further and better particulars",
    type: "party_response",
    party: "Defendant solicitors",
    status: "pending",
    notes: "Particulars received 2 Jul 2026 re treatment history and employment.",
  },
  {
    id: "dl-4",
    matterId: SAMPLE_MATTER_ID,
    date: "2026-08-01",
    title: "File chronology with court",
    type: "court_filing",
    party: "County Court of Victoria",
    status: "pending",
    notes: "Per directions order — chronology not to exceed 15 pages.",
  },
  {
    id: "dl-5",
    matterId: SAMPLE_MATTER_ID,
    date: "2026-08-08",
    title: "Serve expert report on defendant",
    type: "court_filing",
    party: "Defendant solicitors",
    status: "pending",
    notes: "Expert report must be served at least 7 days before directions hearing.",
  },
  {
    id: "dl-6",
    matterId: SAMPLE_MATTER_ID,
    date: "2026-08-15",
    title: "Directions hearing",
    type: "hearing",
    party: "County Court — Judge Morrison",
    status: "pending",
    notes: "Court 4.2, 10:00am. Bring chronology and draft witness statements.",
  },
  {
    id: "dl-7",
    matterId: SAMPLE_MATTER_ID,
    date: "2026-09-01",
    title: "Discovery — list of documents",
    type: "discovery",
    party: "County Court of Victoria",
    status: "pending",
    notes: "Affidavit of documents due. Include all medical record requests and responses.",
  },
  {
    id: "sol-expiry-matter-001",
    matterId: SAMPLE_MATTER_ID,
    date: "2030-11-08",
    title: "Limitation period expires",
    type: "court_filing",
    party: "VIC limitation",
    status: "pending",
    notes: "Auto-synced from Statute of Limitations check.",
  },
  {
    id: "sol-accrual-matter-001",
    matterId: SAMPLE_MATTER_ID,
    date: "2024-11-08",
    title: "Accrual — date of injury / cause of action",
    type: "other",
    party: "Limitation reference",
    status: "completed",
    notes: "Auto-synced accrual date from SOL check.",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

function clientLastName(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) return "";
  const parts = trimmed.split(/\s+/);
  return parts[parts.length - 1];
}

function upcomingDeadlineLabel(dl: Deadline, matters: Matter[]): string {
  const matter = matters.find((m) => m.id === dl.matterId);
  const last = matter ? clientLastName(matter.clientName) : "";
  return last ? `${last} · ${dl.title}` : dl.title;
}

function matterShortLabel(matterId: string, matters: Matter[]): string {
  const matter = matters.find((m) => m.id === matterId);
  return matter ? `${matter.matterNumber} — ${matter.clientName}` : "—";
}

function statusLabel(s: MatterStatus): string {
  const map: Record<MatterStatus, string> = {
    intake: "Intake",
    records_requested: "Records requested",
    records_received: "Records received",
    analysis: "Analysis",
    expert_brief: "Expert brief",
    closed: "Closed",
  };
  return map[s];
}

function fileStatusLabel(s: MatterFileStatus): string {
  const map: Record<MatterFileStatus, string> = {
    received: "Received",
    in_progress: "In progress",
    complete: "Complete",
  };
  return map[s];
}

function matterFileStatus(m: Matter): MatterFileStatus {
  return m.fileStatus ?? "received";
}

function matterRegisterProgressNotes(m: Matter): string {
  return m.progressNotes ?? m.lastActionNote ?? "";
}

function matterRegisterSummary(m: Matter): string {
  return m.matterSummary ?? m.injuryDescription ?? "";
}

const MATTER_HEADING_FIELDS: [string, string][] = [
  ["Matter name", "Matter number or short matter title"],
  ["Client name", "Full name of the injured client"],
  ["Description of injury", "Brief neutral summary of the injury or incident mechanism"],
  ["DOB", "Client date of birth (dd Mmm yyyy)"],
  ["Prepared by", "Name of the medico-legal consultant or instructing solicitor"],
];

const MATTER_HEADING_EXAMPLE: [string, string][] = [
  ["Matter name", "ML-2024-017 — Sample matter"],
  ["Client name", "Client Name"],
  ["Description of injury", "Workplace lifting incident — lumbar soft tissue injury with radiculopathy"],
  ["DOB", "14 Mar 1985"],
  ["Prepared by", "Consultant name"],
];

function matterHeadingName(matter: Matter): string {
  return matter.matterSummary
    ? `${matter.matterNumber} — ${matter.matterSummary}`
    : matter.matterNumber;
}

function matterHeadingHtml(matter: Matter): string {
  return `<p><strong>Matter name:</strong> ${escapeHtml(matterHeadingName(matter))}</p>
<p><strong>Client name:</strong> ${escapeHtml(matter.clientName)}</p>
<p><strong>Description of injury:</strong> ${escapeHtml(matter.injuryDescription || "—")}</p>
<p><strong>DOB:</strong> ${escapeHtml(formatDate(matter.clientDOB))}</p>
<p><strong>Prepared by:</strong> ${escapeHtml(matter.solicitor || "—")}</p>`;
}

function matterHeadingPdfLines(matter: Matter): string[] {
  return [
    `Matter name: ${matterHeadingName(matter)}`,
    `Client name: ${matter.clientName}`,
    `Description of injury: ${matter.injuryDescription || "—"}`,
    `DOB: ${formatDate(matter.clientDOB)}`,
    `Prepared by: ${matter.solicitor || "—"}`,
  ];
}

function totalHoursForMatter(matterId: string, entries: TimeEntry[]): number {
  return entries.filter((e) => e.matterId === matterId).reduce((s, e) => s + e.hours, 0);
}

function latestSentInvoice(matterId: string, invoices: Invoice[]): Invoice | undefined {
  return invoices
    .filter((inv) => inv.matterId === matterId && inv.status !== "draft")
    .sort((a, b) => b.date.localeCompare(a.date))[0];
}

function nextDueForMatter(
  matterId: string,
  tasks: MatterTask[],
  deadlines: Deadline[],
): { title: string; date: string } | null {
  const items: { title: string; date: string }[] = [];
  tasks
    .filter((t) => t.matterId === matterId && t.status !== "completed" && t.status !== "cancelled")
    .forEach((t) => {
      if (t.dueDate) items.push({ title: t.title, date: t.dueDate });
    });
  deadlines
    .filter((d) => d.matterId === matterId && d.status === "pending")
    .forEach((d) => items.push({ title: d.title, date: d.date }));
  items.sort((a, b) => a.date.localeCompare(b.date));
  return items[0] ?? null;
}

function registerRowTone(m: Matter): "success" | "info" | "neutral" | undefined {
  const s = matterFileStatus(m);
  if (s === "complete") return "success";
  if (s === "in_progress") return "info";
  return "neutral";
}

function defaultMatterRegisterFields(): Pick<
  Matter,
  | "packetReceivedDate"
  | "packetReturnedDate"
  | "progressNotes"
  | "matterSummary"
  | "fileStatus"
  | "invoiceSentDate"
  | "invoiceAmount"
  | "invoiceReturnDate"
  | "preliminaryChecklist"
> {
  return {
    packetReceivedDate: "",
    packetReturnedDate: "",
    progressNotes: "",
    matterSummary: "",
    fileStatus: "received",
    invoiceSentDate: "",
    invoiceAmount: "",
    invoiceReturnDate: "",
    preliminaryChecklist: {
      conflictOfInterest: false,
      retainerAndAuthority: false,
      previousLitigation: false,
    },
  };
}

function matterPreliminaryChecklist(m: Matter) {
  return (
    m.preliminaryChecklist ?? {
      conflictOfInterest: false,
      retainerAndAuthority: false,
      previousLitigation: false,
    }
  );
}

function recordStatusTone(s: RecordStatus): "warning" | "success" | "info" {
  if (s === "received") return "success";
  if (s === "follow_up") return "warning";
  return "info";
}

function correspondenceTypeLabel(t: CorrespondenceType): string {
  const map: Record<CorrespondenceType, string> = {
    letter: "Letter",
    email: "Email",
    fax: "Fax",
    notice: "Notice",
    court_document: "Court document",
    expert_report: "Expert report",
    other: "Other",
  };
  return map[t];
}

function correspondenceDirectionTone(d: CorrespondenceDirection): "info" | "neutral" {
  return d === "inbound" ? "info" : "neutral";
}

function correspondenceTags(item: CorrespondenceItem): string[] {
  return item.tags ?? [];
}

function correspondenceMatchesSearch(item: CorrespondenceItem, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  const haystack = [
    item.party,
    item.subject,
    item.reference,
    item.summary,
    item.type,
    item.direction,
    correspondenceBody(item),
    correspondenceTypeLabel(item.type),
    ...correspondenceTags(item),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

function correspondenceMatchesTagFilter(item: CorrespondenceItem, activeTags: string[]): boolean {
  if (activeTags.length === 0) return true;
  const itemTags = correspondenceTags(item);
  return activeTags.some((t) => itemTags.includes(t));
}

function toggleTagList(tags: string[], tag: string): string[] {
  return tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag];
}

function formatTagsLabel(tags: string[]): string {
  if (tags.length === 0) return "—";
  return tags.join(", ");
}

function correspondenceBody(item: CorrespondenceItem): string {
  return item.body ?? item.summary ?? "";
}

function allAvailableTags(customTags: string[], matterItems: CorrespondenceItem[]): string[] {
  const set = new Set<string>([...CORRESPONDENCE_TAGS, ...customTags]);
  matterItems.forEach((c) => correspondenceTags(c).forEach((t) => set.add(t)));
  return Array.from(set).sort();
}

function inferCorrespondenceTypeFromFilename(name: string): CorrespondenceType {
  const lower = name.toLowerCase();
  if (lower.endsWith(".eml") || lower.endsWith(".msg")) return "email";
  if (lower.includes("notice") || lower.includes("order")) return "notice";
  if (lower.includes("report") || lower.includes("ime")) return "expert_report";
  if (lower.includes("court") || lower.includes("filing")) return "court_document";
  return "other";
}

function entryBillingStatus(e: TimeEntry): BillingStatus {
  return e.billingStatus ?? "unbilled";
}

function billingStatusLabel(s: BillingStatus): string {
  const map: Record<BillingStatus, string> = {
    unbilled: "Unbilled",
    invoiced: "Invoiced",
    invoice_sent: "Invoice sent",
    paid: "Paid",
    written_off: "Written off",
  };
  return map[s];
}

function invoiceStatusLabel(s: InvoiceStatus): string {
  const map: Record<InvoiceStatus, string> = {
    draft: "Draft",
    sent: "Sent",
    paid: "Paid",
    overdue: "Overdue",
    written_off: "Written off",
  };
  return map[s];
}

function billingStatusFromInvoice(status: InvoiceStatus): BillingStatus {
  if (status === "draft") return "invoiced";
  if (status === "sent" || status === "overdue") return "invoice_sent";
  if (status === "paid") return "paid";
  return "written_off";
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^\w\s.-]/g, "").replace(/\s+/g, "-").slice(0, 80) || "export";
}

function triggerDownload(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function exportAsDoc(filename: string, title: string, htmlBody: string): void {
  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<style>
  body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.4; }
  h1 { font-size: 16pt; } h2 { font-size: 13pt; margin-top: 18pt; }
  table { border-collapse: collapse; width: 100%; margin-top: 12pt; }
  th, td { border: 1px solid #999; padding: 6pt 8pt; text-align: left; vertical-align: top; }
  th { background: #f0f0f0; }
  .pre { white-space: pre-wrap; }
</style></head>
<body>${htmlBody}</body></html>`;
  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  triggerDownload(`${sanitizeFilename(filename)}.doc`, blob);
}

function pdfEscape(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function pdfSafe(text: string): string {
  return text.replace(/[\u2013\u2014\u2018\u2019\u201C\u201D]/g, (c) => {
    if (c === "\u2013" || c === "\u2014") return "-";
    if (c === "\u2018" || c === "\u2019") return "'";
    if (c === "\u201C" || c === "\u201D") return '"';
    return c;
  });
}

function wrapPdfLine(text: string, maxLen = 92): string[] {
  const safe = pdfSafe(text);
  if (safe.length <= maxLen) return [safe];
  const out: string[] = [];
  let remaining = safe;
  while (remaining.length > maxLen) {
    let breakAt = remaining.lastIndexOf(" ", maxLen);
    if (breakAt <= 0) breakAt = maxLen;
    out.push(remaining.slice(0, breakAt).trimEnd());
    remaining = remaining.slice(breakAt).trimStart();
  }
  if (remaining) out.push(remaining);
  return out;
}

function flattenPdfLines(lines: string[]): string[] {
  return lines.flatMap((line) => (line === "" ? [""] : wrapPdfLine(line)));
}

function exportAsPdf(filename: string, title: string, contentLines: string[]): void {
  const lines = flattenPdfLines([title, "", ...contentLines]);
  const linesPerPage = 52;
  const pages: string[][] = [];
  for (let i = 0; i < lines.length; i += linesPerPage) {
    pages.push(lines.slice(i, i + linesPerPage));
  }
  if (pages.length === 0) pages.push([title]);

  const lineHeight = 14;
  const startX = 50;
  const startY = 760;
  const fontSize = 11;

  let nextId = 1;
  const catalogId = nextId++;
  const pagesId = nextId++;
  const fontId = nextId++;
  const pageIds: number[] = [];
  const contentIds: number[] = [];
  pages.forEach(() => {
    pageIds.push(nextId++);
    contentIds.push(nextId++);
  });

  const bodies = new Map<number, string>();
  bodies.set(fontId, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  pages.forEach((pageLines, idx) => {
    const contentId = contentIds[idx];
    const pageId = pageIds[idx];
    let stream = `BT\n/F1 ${fontSize} Tf\n${startX} ${startY} Td\n`;
    pageLines.forEach((line, lineIdx) => {
      if (lineIdx > 0) stream += `0 -${lineHeight} Td\n`;
      stream += `(${pdfEscape(line || " ")}) Tj\n`;
    });
    stream += "ET";
    bodies.set(contentId, `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    bodies.set(
      pageId,
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`,
    );
  });

  const kids = pageIds.map((id) => `${id} 0 R`).join(" ");
  bodies.set(pagesId, `<< /Type /Pages /Kids [ ${kids} ] /Count ${pageIds.length} >>`);
  bodies.set(catalogId, `<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

  let pdf = "%PDF-1.4\n";
  const objOffsets: number[] = [];
  for (let id = 1; id < nextId; id++) {
    objOffsets[id] = pdf.length;
    pdf += `${id} 0 obj\n${bodies.get(id)!}\nendobj\n`;
  }
  const xrefPos = pdf.length;
  pdf += `xref\n0 ${nextId}\n`;
  pdf += "0000000000 65535 f \n";
  for (let id = 1; id < nextId; id++) {
    pdf += `${String(objOffsets[id]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${nextId} /Root ${catalogId} 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;

  triggerDownload(`${sanitizeFilename(filename)}.pdf`, new Blob([pdf], { type: "application/pdf" }));
}

function buildChronologyDocHtml(matter: Matter, entries: ChronologyEntry[]): string {
  const rows = entries
    .map(
      (e) => `<tr>
      <td>${escapeHtml(formatDate(e.date))}</td>
      <td>${escapeHtml(e.provider || "—")}</td>
      <td>${escapeHtml(e.eventType)}</td>
      <td>${escapeHtml(e.description)}</td>
      <td>${escapeHtml(e.sourceRef || "—")}</td>
      <td>${escapeHtml(e.relevance)}</td>
    </tr>`,
    )
    .join("");
  return `<h1>Medical Chronology</h1>
${matterHeadingHtml(matter)}
<p><strong>Generated:</strong> ${escapeHtml(formatDate(todayIso()))}</p>
<table>
  <thead><tr><th>Date</th><th>Provider</th><th>Type</th><th>Description</th><th>Source</th><th>Relevance</th></tr></thead>
  <tbody>${rows}</tbody>
</table>`;
}

function buildChronologyPdfLines(matter: Matter, entries: ChronologyEntry[]): string[] {
  const lines: string[] = [
    ...matterHeadingPdfLines(matter),
    `Generated: ${formatDate(todayIso())}`,
    "",
  ];
  entries.forEach((e, i) => {
    lines.push(`${i + 1}. ${formatDate(e.date)} | ${e.provider || "—"} | ${e.eventType}`);
    lines.push(`   ${e.description}`);
    if (e.sourceRef) lines.push(`   Source: ${e.sourceRef}`);
    lines.push(`   Relevance: ${e.relevance}`);
    lines.push("");
  });
  return lines;
}

function letterOfInstructionBrandHtml(): string {
  return `<p style="text-align:center"><strong>${escapeHtml(LOI_BRAND.firmLine1)}</strong><br>${escapeHtml(LOI_BRAND.firmLine2)}<br>${escapeHtml(LOI_BRAND.packTitle)}</p>`;
}

function letterOfInstructionHeaderHtml(matter: Matter, letter: LetterOfInstruction): string {
  return `${letterOfInstructionBrandHtml()}
<p><strong>Ref:</strong> ${escapeHtml(matter.matterNumber)}</p>
<p><strong>Prepared For:</strong> ${escapeHtml(letter.preparedFor || "Expert Physician")}</p>
<p><strong>Prepared By:</strong> ${escapeHtml(LOI_BRAND.preparedBy)}</p>
<p><strong>Date:</strong> ${escapeHtml(formatDate(todayIso()))}</p>
<p><strong>Plaintiff Name:</strong> ${escapeHtml(matter.clientName)}</p>
<p><strong>DOB:</strong> ${escapeHtml(formatDate(matter.clientDOB))}</p>`;
}

function letterOfInstructionHeaderPdfLines(matter: Matter, letter: LetterOfInstruction): string[] {
  return [
    LOI_BRAND.firmLine1,
    LOI_BRAND.firmLine2,
    LOI_BRAND.packTitle,
    "",
    `Ref: ${matter.matterNumber}`,
    `Prepared For: ${letter.preparedFor || "Expert Physician"}`,
    `Prepared By: ${LOI_BRAND.preparedBy}`,
    `Date: ${formatDate(todayIso())}`,
    `Plaintiff Name: ${matter.clientName}`,
    `DOB: ${formatDate(matter.clientDOB)}`,
    "",
  ];
}

function letterOfInstructionHeadingTemplateHtml(): string {
  const lines = LOI_HEADING_FIELDS.map(
    ([label]) => `<p><strong>${escapeHtml(label)}:</strong></p>`,
  ).join("\n");
  return `${letterOfInstructionBrandHtml()}\n${lines}`;
}

function letterOfInstructionHeadingTemplatePdfLines(): string[] {
  return [
    LOI_BRAND.firmLine1,
    LOI_BRAND.firmLine2,
    LOI_BRAND.packTitle,
    "",
    ...LOI_HEADING_FIELDS.map(([label]) => `${label}:`),
    "",
  ];
}

function instructionQuestionsHtml(text: string): string {
  const items = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-•]\s*/, "").replace(/^\d+\.\s*/, ""));
  if (items.length === 0) {
    return `<p>We would be most grateful for your opinion on the following issues:</p><ul><li></li></ul>`;
  }
  return `<p>We would be most grateful for your opinion on the following issues:</p><ul>${items
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("")}</ul>`;
}

function instructionQuestionsPdfLines(text: string): string[] {
  const lines = ["We would be most grateful for your opinion on the following issues:"];
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      lines.push(`• ${line.replace(/^[-•]\s*/, "").replace(/^\d+\.\s*/, "")}`);
    });
  if (lines.length === 1) lines.push("• ");
  return lines;
}

function buildInstructionDocHtml(matter: Matter, letter: LetterOfInstruction): string {
  return `${letterOfInstructionHeaderHtml(matter, letter)}
<p class="pre">${escapeHtml(letter.injuryOverview || "—")}</p>
<h2>Executive Summary</h2>
<p class="pre">${escapeHtml(letter.executiveSummary || "—")}</p>
<h2>Chronology of Significant Events</h2>
<p class="pre">${escapeHtml(letter.chronologyNarrative || "—")}</p>
<h2>Summary</h2>
<p class="pre">${escapeHtml(letter.summary || "—")}</p>
${instructionQuestionsHtml(letter.questionsForExpert)}`;
}

function buildInstructionPdfLines(matter: Matter, letter: LetterOfInstruction): string[] {
  return [
    ...letterOfInstructionHeaderPdfLines(matter, letter),
    letter.injuryOverview || "—",
    "",
    "EXECUTIVE SUMMARY",
    letter.executiveSummary || "—",
    "",
    "CHRONOLOGY OF SIGNIFICANT EVENTS",
    letter.chronologyNarrative || "—",
    "",
    "SUMMARY",
    letter.summary || "—",
    "",
    ...instructionQuestionsPdfLines(letter.questionsForExpert),
    "",
  ];
}

function buildInstructionTemplateDocHtml(): string {
  const sections = LOI_SECTION_GUIDANCE.map(
    ([title]) => `<h2>${escapeHtml(title)}</h2><p class="pre"></p>`,
  ).join("\n");
  return `${letterOfInstructionHeadingTemplateHtml()}
${sections.replace(
  /<h2>Questions for the expert<\/h2><p class="pre"><\/p>/,
  `<h2>Questions for the expert</h2><p>We would be most grateful for your opinion on the following issues:</p><ul><li></li><li></li><li></li></ul>`,
)}`;
}

function buildInstructionTemplatePdfLines(): string[] {
  const lines = [...letterOfInstructionHeadingTemplatePdfLines()];
  LOI_SECTION_GUIDANCE.forEach(([title, purpose]) => {
    lines.push(title.toUpperCase());
    lines.push(purpose);
    lines.push("");
    if (title === "Questions for the expert") {
      lines.push("We would be most grateful for your opinion on the following issues:");
      lines.push("• ");
      lines.push("");
    }
  });
  return lines;
}

function ExportDocPdfButtons({
  baseFilename,
  title,
  buildDocHtml,
  buildPdfLines,
  docLabel = "Export .doc",
  pdfLabel = "Export .pdf",
}: {
  baseFilename: string;
  title: string;
  buildDocHtml: () => string;
  buildPdfLines: () => string[];
  docLabel?: string;
  pdfLabel?: string;
}) {
  return (
    <Row gap={8}>
      <AsherOutlineButton onClick={() => exportAsDoc(baseFilename, title, buildDocHtml())}>
        {docLabel}
      </AsherOutlineButton>
      <AsherOutlineButton onClick={() => exportAsPdf(baseFilename, title, buildPdfLines())}>
        {pdfLabel}
      </AsherOutlineButton>
    </Row>
  );
}

function htmlDocTable(headers: string[], rows: string[][]): string {
  const th = headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("");
  const trs = rows
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
    .join("");
  return `<table><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table>`;
}

function matterHeadingTemplateHtml(): string {
  const lines = MATTER_HEADING_FIELDS.map(
    ([label]) => `<p><strong>${escapeHtml(label)}:</strong></p>`,
  ).join("\n");
  return `<h2>Heading</h2>\n${lines}`;
}

function matterHeadingTemplatePdfLines(): string[] {
  return ["HEADING", ...MATTER_HEADING_FIELDS.map(([label]) => `${label}:`), ""];
}

function buildChronologyTemplateDocHtml(): string {
  const bullets = CHRONOLOGY_PREVIOUS_HISTORY_BULLETS.map(
    (line) => `<li>${escapeHtml(line)}</li>`,
  ).join("");
  return `<h1>Medical Chronology</h1>
${matterHeadingTemplateHtml()}
<h2>Previous medical history</h2>
<p>Include a bullet list of relevant prior medical history at the start of the chronology. Exercise discretion — not every past medical event needs to be documented, but record a sufficient amount to give the physician reading the file useful context. Always include past surgeries relating to the injury.</p>
<p><strong>Each bullet (chronological order)</strong></p>
<ul>${bullets}</ul>
<p>Example: 14 Mar 2019 · ACL reconstruction · St Vincent's Hospital · Dr J. Nguyen</p>
<h2>Chronology</h2>
${htmlDocTable(
  CHRONOLOGY_COLUMN_ROWS.map(([field]) => field),
  [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ],
)}`;
}

function buildChronologyTemplatePdfLines(): string[] {
  return [
    ...matterHeadingTemplatePdfLines(),
    "PREVIOUS MEDICAL HISTORY",
    "Include a bullet list of relevant prior medical history at the start of the chronology.",
    "Each bullet (chronological order):",
    ...CHRONOLOGY_PREVIOUS_HISTORY_BULLETS.map((line) => `• ${line}`),
    "Example: 14 Mar 2019 · ACL reconstruction · St Vincent's Hospital · Dr J. Nguyen",
    "",
    "CHRONOLOGY",
    ...CHRONOLOGY_COLUMN_ROWS.map(([field, purpose]) => `${field}: ${purpose}`),
    "",
    "[Date] | [Provider] | [Type] | [Description] | [Reference]",
    "",
  ];
}

function buildEmailTemplateDocHtml(kind: EmailTemplateKind): string {
  const template = EMAIL_TEMPLATE_DEFINITIONS[kind];
  const fields = template.fields.map((field) => `<li>${escapeHtml(field)}: </li>`).join("");
  return `<h1>${escapeHtml(template.title)}</h1>
<p>${escapeHtml(template.description)}</p>
<h2>Subject</h2>
<p>${escapeHtml(template.subject)}</p>
<h2>Fields to complete</h2>
<ul>${fields}</ul>
<h2>Body</h2>
<p class="pre">${escapeHtml(template.body)}</p>`;
}

function buildEmailTemplatePdfLines(kind: EmailTemplateKind): string[] {
  const template = EMAIL_TEMPLATE_DEFINITIONS[kind];
  return [
    template.description,
    "",
    "SUBJECT",
    template.subject,
    "",
    "FIELDS TO COMPLETE",
    ...template.fields.map((field) => `${field}:`),
    "",
    "BODY",
    template.body,
    "",
  ];
}

function templateExportConfig(route: LibraryRoute): {
  baseFilename: string;
  title: string;
  buildDocHtml: () => string;
  buildPdfLines: () => string[];
} {
  switch (route) {
    case "template-chronology":
      return {
        baseFilename: "medical-chronology-template",
        title: "Medical Chronology Template",
        buildDocHtml: buildChronologyTemplateDocHtml,
        buildPdfLines: buildChronologyTemplatePdfLines,
      };
    case "template-advice":
      return {
        baseFilename: "letter-of-instruction-template",
        title: "Letter of Instruction Template",
        buildDocHtml: buildInstructionTemplateDocHtml,
        buildPdfLines: buildInstructionTemplatePdfLines,
      };
    case "template-invoice":
      return {
        baseFilename: "invoice-template",
        title: "Invoice Template",
        buildDocHtml: buildInvoiceTemplateDocHtml,
        buildPdfLines: buildInvoiceTemplatePdfLines,
      };
    case "template-email-records":
      return {
        baseFilename: "records-request-follow-up-template",
        title: "Records Request Follow-up Template",
        buildDocHtml: () => buildEmailTemplateDocHtml("records"),
        buildPdfLines: () => buildEmailTemplatePdfLines("records"),
      };
    case "template-email-expert":
      return {
        baseFilename: "expert-briefing-template",
        title: "Expert Briefing Template",
        buildDocHtml: () => buildEmailTemplateDocHtml("expert"),
        buildPdfLines: () => buildEmailTemplatePdfLines("expert"),
      };
    case "template-email-defendant":
      return {
        baseFilename: "defendant-correspondence-template",
        title: "Defendant Correspondence Template",
        buildDocHtml: () => buildEmailTemplateDocHtml("defendant"),
        buildPdfLines: () => buildEmailTemplatePdfLines("defendant"),
      };
    default:
      return {
        baseFilename: "template",
        title: "Template",
        buildDocHtml: () => "<p></p>",
        buildPdfLines: () => [],
      };
  }
}

function TemplateDownloadButtons({ route }: { route: LibraryRoute }) {
  const { baseFilename, title, buildDocHtml, buildPdfLines } = templateExportConfig(route);
  return (
    <Card>
      <CardHeader>Download template</CardHeader>
      <CardBody>
        <Stack gap={10}>
          <Text size="small" tone="secondary">
            Download a blank .doc or .pdf version of this template to complete offline.
          </Text>
          <ExportDocPdfButtons
            baseFilename={baseFilename}
            title={title}
            buildDocHtml={buildDocHtml}
            buildPdfLines={buildPdfLines}
            docLabel="Download .doc"
            pdfLabel="Download .pdf"
          />
        </Stack>
      </CardBody>
    </Card>
  );
}

function relevanceTone(r: string): "danger" | "warning" | "neutral" {
  if (r === "high") return "danger";
  if (r === "medium") return "warning";
  return "neutral";
}

function formatCurrency(n: number): string {
  return n.toLocaleString("en-AU", { style: "currency", currency: "AUD", minimumFractionDigits: 2 });
}

function formatInvoiceDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-AU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function invoiceShortNumber(invoiceNumber: string): string {
  const match = invoiceNumber.match(/(\d+)\s*$/);
  return match ? match[1].padStart(3, "0") : invoiceNumber;
}

function invoiceRefLabel(invoiceNumber: string): string {
  return invoiceNumber.startsWith("#") ? invoiceNumber : `#${invoiceNumber}`;
}

function nextInvoiceNumber(existing: Invoice[]): string {
  const nums = existing
    .map((inv) => parseInt(invoiceShortNumber(inv.invoiceNumber), 10))
    .filter((n) => !Number.isNaN(n));
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `INV-${String(next).padStart(3, "0")}`;
}

interface InvoiceLineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

function invoiceLineItemsFromEntries(entries: TimeEntry[]): InvoiceLineItem[] {
  const groups = new Map<string, InvoiceLineItem>();
  entries.forEach((e) => {
    const key = e.category || e.description || "Legal services";
    const existing = groups.get(key);
    if (existing) {
      existing.quantity += e.hours;
      existing.amount += e.hours * e.rate;
    } else {
      groups.set(key, {
        description: key,
        quantity: e.hours,
        rate: e.rate,
        amount: e.hours * e.rate,
      });
    }
  });
  return Array.from(groups.values());
}

interface InvoiceDocumentData {
  invoiceNumber: string;
  payable: number;
  issuedDate: string;
  dueDate: string;
  billedToName: string;
  billedToAddress: string;
  billedToPhone: string;
  clientName: string;
  lineItems: InvoiceLineItem[];
  sectionTitle: string;
}

function invoiceDocumentDataFromMatter(
  matter: Matter,
  invoice: Invoice,
  entries: TimeEntry[],
): InvoiceDocumentData {
  const linked = entries.filter((e) => invoice.entryIds.includes(e.id));
  const lineItems = invoiceLineItemsFromEntries(linked);
  return {
    invoiceNumber: invoice.invoiceNumber,
    payable: invoice.total,
    issuedDate: invoice.date,
    dueDate: invoice.dueDate || addDaysIso(invoice.date, 30),
    billedToName: invoice.billedToName,
    billedToAddress: invoice.billedToAddress,
    billedToPhone: invoice.billedToPhone,
    clientName: matter.clientName,
    lineItems,
    sectionTitle: "Legal Research",
  };
}

function blankInvoiceDocumentData(): InvoiceDocumentData {
  return {
    invoiceNumber: "INV-051",
    payable: 630,
    issuedDate: "2024-12-30",
    dueDate: "2025-01-30",
    billedToName: "Firm Name",
    billedToAddress: "Address\nAddress\nAddress",
    billedToPhone: "Phone number",
    clientName: "Client Name",
    sectionTitle: "Legal Research",
    lineItems: [
      { description: "Chronology", quantity: 6, rate: 70, amount: 420 },
      { description: "Letter of Instruction", quantity: 3, rate: 70, amount: 210 },
    ],
  };
}

function buildInvoiceDocumentHtml(data: InvoiceDocumentData, template = false): string {
  const shortNo = invoiceShortNumber(data.invoiceNumber);
  const ref = invoiceRefLabel(data.invoiceNumber);
  const payable = formatCurrency(data.payable);
  const issued = formatInvoiceDate(data.issuedDate);
  const due = formatInvoiceDate(data.dueDate);
  const billedAddress = (data.billedToAddress || "Address\nAddress\nAddress")
    .split("\n")
    .map((line) => escapeHtml(line))
    .join("<br>");
  const fromAddress = INVOICE_FROM.addressLines.map((line) => escapeHtml(line)).join("<br>");
  const clientHeader = template ? "CLIENT NAME" : escapeHtml(data.clientName.toUpperCase());
  const lineRows = (template ? data.lineItems : data.lineItems.length > 0 ? data.lineItems : [])
    .map(
      (item) => `<tr>
        <td>${escapeHtml(item.description)}</td>
        <td align="center">${item.quantity.toFixed(item.quantity % 1 ? 1 : 0)}</td>
        <td align="right">${formatCurrency(item.rate)}</td>
        <td align="right">${formatCurrency(item.amount)}</td>
      </tr>`,
    )
    .join("");
  const blankRows =
    template && !lineRows
      ? `<tr><td>Chronology</td><td></td><td></td><td></td></tr>
         <tr><td>Letter of Instruction</td><td></td><td></td><td></td></tr>`
      : lineRows;
  const subtotal = formatCurrency(data.payable);
  const total = formatCurrency(data.payable);

  return `<table width="100%" cellpadding="0" cellspacing="0" style="border:none;">
  <tr>
    <td align="left"><h1 style="margin:0;font-size:20pt;">Invoice</h1></td>
    <td align="right" style="font-size:12pt;">No ${escapeHtml(shortNo)}</td>
  </tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:18pt;border:none;">
  <tr>
    <td width="33%" valign="top" style="padding-right:12pt;">
      <p style="margin:0 0 6pt;"><strong>Payable</strong> ${payable}</p>
      <p style="margin:0 0 6pt;"><strong>Due</strong> ${due || "&nbsp;"}</p>
      <p style="margin:0 0 6pt;"><strong>Issued</strong> ${issued || "&nbsp;"}</p>
      <p style="margin:0;"><strong>Ref.</strong> ${escapeHtml(ref)}</p>
    </td>
    <td width="33%" valign="top" style="padding-right:12pt;">
      <p style="margin:0 0 6pt;"><strong>Billed to</strong></p>
      <p style="margin:0;">${escapeHtml(data.billedToName || "Firm Name")}<br>${billedAddress}<br>${escapeHtml(data.billedToPhone || "Phone number")}</p>
    </td>
    <td width="33%" valign="top">
      <p style="margin:0 0 6pt;"><strong>From</strong></p>
      <p style="margin:0;">${escapeHtml(INVOICE_FROM.name)}<br>${fromAddress}<br>${escapeHtml(INVOICE_FROM.email)}<br>${escapeHtml(INVOICE_FROM.abn ? `ABN ${INVOICE_FROM.abn}` : "ABN")}</p>
    </td>
  </tr>
</table>
<table width="67%" align="right" cellpadding="6" cellspacing="0" style="margin-top:24pt;border-collapse:collapse;">
  <tr><td colspan="4" style="padding-bottom:8pt;"><strong>${escapeHtml(data.sectionTitle)}</strong></td></tr>
  <tr>
    <td><strong>${clientHeader}</strong></td>
    <td align="center"><strong>Qty</strong></td>
    <td align="right"><strong>Rate</strong></td>
    <td align="right"><strong>Amount</strong></td>
  </tr>
  ${blankRows || `<tr><td colspan="4">&nbsp;</td></tr>`}
  <tr><td colspan="4" style="border-top:1px solid #999;padding-top:8pt;"></td></tr>
  <tr>
    <td colspan="3" align="right">Subtotal</td>
    <td align="right">${subtotal || "&nbsp;"}</td>
  </tr>
  <tr><td colspan="4" style="font-size:10pt;">not registered for GST</td></tr>
  <tr><td colspan="4" style="border-top:1px solid #999;padding-top:8pt;"></td></tr>
  <tr>
    <td colspan="3" align="right"><strong>Total</strong></td>
    <td align="right"><strong>${total || "&nbsp;"}</strong></td>
  </tr>
</table>
<table width="67%" align="right" cellpadding="0" cellspacing="0" style="margin-top:24pt;border:none;">
  <tr><td><strong>Payment details</strong></td></tr>
  <tr><td style="padding-top:6pt;">${escapeHtml(INVOICE_PAYMENT.terms)}</td></tr>
  <tr><td style="padding-top:6pt;">${escapeHtml(INVOICE_PAYMENT.thanks)}</td></tr>
  <tr><td style="padding-top:12pt;">
    Acct Name: ${escapeHtml(INVOICE_PAYMENT.accountName || "Name")}<br>
    Acct No: ${escapeHtml(INVOICE_PAYMENT.accountNumber || "Number")}<br>
    BSB: ${escapeHtml(INVOICE_PAYMENT.bsb || "Number")}<br>
    Bank: ${escapeHtml(INVOICE_PAYMENT.bank || "Institution")}<br>
    Email: ${escapeHtml(INVOICE_PAYMENT.contactEmail || INVOICE_FROM.email)}
  </td></tr>
</table>`;
}

function buildInvoiceDocumentPdfLines(data: InvoiceDocumentData, template = false): string[] {
  const shortNo = invoiceShortNumber(data.invoiceNumber);
  const ref = invoiceRefLabel(data.invoiceNumber);
  const lines: string[] = [
    "Invoice",
    `No ${shortNo}`,
    "",
    `Payable ${template ? "$" : formatCurrency(data.payable)}`,
    `Due ${template ? "" : formatInvoiceDate(data.dueDate)}`,
    `Issued ${template ? "" : formatInvoiceDate(data.issuedDate)}`,
    `Ref. ${ref}`,
    "",
    "Billed to",
    data.billedToName || "Firm Name",
    ...(data.billedToAddress || "Address\nAddress\nAddress").split("\n"),
    data.billedToPhone || "Phone number",
    "",
    "From",
    INVOICE_FROM.name,
    ...INVOICE_FROM.addressLines,
    INVOICE_FROM.email,
    INVOICE_FROM.abn ? `ABN ${INVOICE_FROM.abn}` : "ABN",
    "",
    data.sectionTitle,
    template ? "CLIENT NAME" : data.clientName.toUpperCase(),
    "Qty | Rate | Amount",
  ];
  const items =
    data.lineItems.length > 0
      ? data.lineItems
      : template
        ? [
            { description: "Chronology", quantity: 6, rate: 70, amount: 420 },
            { description: "Letter of Instruction", quantity: 3, rate: 70, amount: 210 },
          ]
        : [];
  items.forEach((item) => {
    lines.push(
      `${item.description} | ${template ? "" : item.quantity} | ${template ? "" : formatCurrency(item.rate)} | ${template ? "" : formatCurrency(item.amount)}`,
    );
  });
  lines.push(
    "",
    "Subtotal",
    template ? "" : formatCurrency(data.payable),
    "not registered for GST",
    "",
    "Total",
    template ? "" : formatCurrency(data.payable),
    "",
    "Payment details",
    INVOICE_PAYMENT.terms,
    INVOICE_PAYMENT.thanks,
    "",
  );
  return lines;
}

function buildInvoiceDocHtml(matter: Matter, invoice: Invoice, entries: TimeEntry[]): string {
  return buildInvoiceDocumentHtml(invoiceDocumentDataFromMatter(matter, invoice, entries));
}

function buildInvoicePdfLines(matter: Matter, invoice: Invoice, entries: TimeEntry[]): string[] {
  return buildInvoiceDocumentPdfLines(invoiceDocumentDataFromMatter(matter, invoice, entries));
}

function buildInvoiceTemplateDocHtml(): string {
  return buildInvoiceDocumentHtml(blankInvoiceDocumentData(), true);
}

function buildInvoiceTemplatePdfLines(): string[] {
  return buildInvoiceDocumentPdfLines(blankInvoiceDocumentData(), true);
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function parseIsoDate(iso: string): Date {
  return new Date(iso + "T00:00:00");
}

function isoFromParts(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function addDaysIso(iso: string, days: number): string {
  const d = parseIsoDate(iso);
  d.setDate(d.getDate() + days);
  return isoFromParts(d.getFullYear(), d.getMonth(), d.getDate());
}

function startOfWeekIso(iso: string): string {
  const d = parseIsoDate(iso);
  const mondayOffset = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - mondayOffset);
  return isoFromParts(d.getFullYear(), d.getMonth(), d.getDate());
}

function daysUntil(dateIso: string): number {
  const today = parseIsoDate(todayIso());
  const target = parseIsoDate(dateIso);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

function deadlineTypeLabel(t: DeadlineType): string {
  const map: Record<DeadlineType, string> = {
    court_filing: "Court filing",
    party_response: "Response to party",
    hearing: "Hearing",
    discovery: "Discovery",
    other: "Other",
  };
  return map[t];
}

function deadlineSwatchColor(t: DeadlineType): "blue" | "purple" | "orange" | "green" | "gray" {
  if (t === "court_filing") return "blue";
  if (t === "party_response") return "purple";
  if (t === "hearing") return "orange";
  if (t === "discovery") return "green";
  return "gray";
}

const DEADLINE_ASHER_COLORS: Record<DeadlineType, string> = {
  court_filing: ASHER.navy,
  party_response: ASHER.coral,
  hearing: "rgba(1, 25, 54, 0.42)",
  discovery: "rgba(240, 128, 128, 0.72)",
  other: ASHER.muted,
};

function deadlineAsherColor(t: DeadlineType): string {
  return DEADLINE_ASHER_COLORS[t];
}

function DeadlineColorDot({
  type,
  size = 10,
  style,
}: {
  type: DeadlineType;
  size?: number;
  style?: Record<string, string | number>;
}) {
  return (
    <span
      aria-hidden
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        display: "inline-block",
        background: deadlineAsherColor(type),
        border: `1px solid ${ASHER.border}`,
        ...style,
      }}
    />
  );
}

function tabLabel(tab: Tab): string {
  const map: Record<Tab, string> = {
    overview: "Matter file",
    records: "Record requests",
    correspondence: "Correspondence",
    chronology: "Chronology",
    advice: "Letter of instruction",
    billing: "Billable hours",
    calendar: "Calendar",
    register: "Matter Database",
    links: "Research links",
  };
  return map[tab];
}

const MATTER_TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Matter file" },
  { id: "records", label: "Record requests" },
  { id: "correspondence", label: "Correspondence" },
  { id: "chronology", label: "Chronology" },
  { id: "advice", label: "Letter of instruction" },
  { id: "billing", label: "Billable hours" },
];

function SidebarGlyph({
  children,
  size = 16,
}: {
  children: unknown;
  size?: number;
}) {
  return (
    <span
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: "inherit",
      }}
    >
      {children}
    </span>
  );
}

function IconHouse() {
  return (
    <SidebarGlyph>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M2.5 6.5 8 2.5l5.5 4V13a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V6.5Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path d="M6.5 13V9h3v4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    </SidebarGlyph>
  );
}

function IconCalendar() {
  return (
    <SidebarGlyph>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <rect x="2.5" y="3.5" width="11" height="10" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
        <path d="M2.5 6.5h11M5.5 2v2.5M10.5 2v2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M5 9h1.5M9.5 9H11M5 11.5h1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </SidebarGlyph>
  );
}

function IconTable() {
  return (
    <SidebarGlyph>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <rect x="2.5" y="3" width="11" height="10" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <path d="M2.5 6.5h11M2.5 9.5h11M6.5 6.5V13M10.5 6.5V13" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </SidebarGlyph>
  );
}

function IconSearch() {
  return (
    <SidebarGlyph>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="7" cy="7" r="4.2" stroke="currentColor" strokeWidth="1.3" />
        <path d="m10.2 10.2 3.3 3.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    </SidebarGlyph>
  );
}

function IconScales() {
  return (
    <SidebarGlyph>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M4.5 13h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M8 13V6.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M2.8 6.2h10.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M3.2 6.2V8.4M12.8 6.2V8.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path
          d="M1.8 9.2c0 .9.8 1.6 1.8 1.6s1.8-.7 1.8-1.6M11.6 9.2c0 .9.8 1.6 1.8 1.6s1.8-.7 1.8-1.6"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path d="M2.8 9.2h2.4M10.8 9.2h2.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="8" cy="4.4" r="1" stroke="currentColor" strokeWidth="1.1" />
        <path d="M8 5.4V6.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    </SidebarGlyph>
  );
}

function IconFolder() {
  return (
    <SidebarGlyph>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M2.5 4.5A.5.5 0 0 1 3 4h3.2l1.3 1.5H13a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-8Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    </SidebarGlyph>
  );
}

function IconDocument() {
  return (
    <SidebarGlyph>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M4.5 2.5h4.8L12.5 5.2V13a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path d="M9 2.5V5.5h3.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M5.5 8h5M5.5 10h5M5.5 12h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </SidebarGlyph>
  );
}

function IconEmail() {
  return (
    <SidebarGlyph>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <rect x="2.5" y="4" width="11" height="8" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <path d="M2.5 5 8 9l5.5-4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    </SidebarGlyph>
  );
}

function IconInvoice() {
  return (
    <SidebarGlyph>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M4.5 2.5h4.8L12.5 5.2V12.2c0 .4-.3.8-.8.8H4.8c-.5 0-.8-.4-.8-.8V3.3c0-.4.3-.8.8-.8Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path d="M9 2.5V5.5h3.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M5.5 7.2h5M5.5 9h3.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path
          d="M4 12.8h8M4.8 13.6l.8-.5.8.5.8-.5.8.5.8-.5.8.5.8-.5.8.5"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10.8" cy="10.8" r="1.5" stroke="currentColor" strokeWidth="1.1" />
        <path d="M10.8 9.8v2M10.3 10.8h1" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
      </svg>
    </SidebarGlyph>
  );
}

function templateItemIcon(icon: "document" | "email" | "invoice") {
  if (icon === "email") return <IconEmail />;
  if (icon === "invoice") return <IconInvoice />;
  return <IconDocument />;
}

function tabIcon(tab: Tab) {
  switch (tab) {
    case "overview":
      return <IconFolder />;
    case "correspondence":
      return <IconEmail />;
    case "billing":
      return <IconInvoice />;
    case "calendar":
      return <IconCalendar />;
    case "register":
      return <IconTable />;
    case "links":
      return <IconScales />;
    default:
      return <IconDocument />;
  }
}

function libraryRouteIcon(route: LibraryRoute) {
  if (route.startsWith("workflow-")) return <IconWorkflow />;
  const template = TEMPLATE_ITEMS.find((entry) => entry.route === route);
  if (template) return templateItemIcon(template.icon);
  return <IconDocument />;
}

function pageHeaderIcon(
  createPanel: "" | "workflow" | "template" | "matter" | "skill",
  libraryRoute: LibraryRoute | "",
  activeTab: Tab | "",
) {
  if (createPanel === "workflow") return <IconWorkflow />;
  if (createPanel === "template") return <IconDocument />;
  if (createPanel === "matter") return <IconFolder />;
  if (createPanel === "skill") return <IconHammer />;
  if (libraryRoute !== "") return libraryRouteIcon(libraryRoute);
  if (activeTab === "") return <IconHouse />;
  if (activeTab === "links") return <IconScales />;
  if (activeTab === "calendar") return <IconCalendar />;
  if (activeTab === "register") return <IconTable />;
  return tabIcon(activeTab);
}

function IconHammer() {
  return (
    <SidebarGlyph>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M3.5 12.5 9.2 6.8"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          d="M8.8 5.2 10.9 3.1a1.6 1.6 0 0 1 2.3 2.3L11.1 7.6"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.4 6.6 5.3 8.7"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          d="M2.8 13.2 3.8 12.2"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    </SidebarGlyph>
  );
}

function IconWorkflow() {
  return (
    <SidebarGlyph>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M11.2 4.8A4.8 4.8 0 0 0 5.6 3.4"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          d="M5.6 3.4 5.6 5.8M5.6 3.4 3.2 3.4"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.8 11.2A4.8 4.8 0 0 0 10.4 12.6"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          d="M10.4 12.6 10.4 10.2M10.4 12.6 12.8 12.6"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SidebarGlyph>
  );
}

function IconPlus() {
  return (
    <SidebarGlyph size={14}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path d="M7 2.5v9M2.5 7h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </SidebarGlyph>
  );
}

function IconChevron({ open }: { open?: boolean }) {
  return (
    <SidebarGlyph size={14}>
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden
        style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s ease" }}
      >
        <path d="m5 3.5 4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </SidebarGlyph>
  );
}

function SidebarNavButton({
  label,
  icon,
  active,
  trailing,
  onClick,
  indent,
  accent,
}: {
  label: string;
  icon?: unknown;
  active?: boolean;
  trailing?: unknown;
  onClick: () => void;
  indent?: number;
  accent?: boolean;
}) {
  const idleColor = accent ? ASHER.coral : ASHER.nav;
  const activeColor = ASHER.navy;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e: { key: string }) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 8px",
        paddingLeft: indent ? 8 + indent : 8,
        borderRadius: 0,
        cursor: "pointer",
        background: active ? ASHER.coralSoft : "transparent",
        color: active ? activeColor : idleColor,
        fontFamily: ASHER.fontMono,
        fontWeight: active ? 500 : 400,
        fontSize: 13,
        lineHeight: 1.4,
        letterSpacing: "-0.045em",
        userSelect: "none",
      }}
    >
      {icon}
      <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {label}
      </span>
      {trailing}
    </div>
  );
}

function SidebarSectionLabel({ children }: { children: string }) {
  return (
    <Text
      size="small"
      tone="tertiary"
      weight="semibold"
      style={{ padding: "10px 16px 6px", fontSize: 11, letterSpacing: "0.04em" }}
    >
      {children}
    </Text>
  );
}

function SidebarCollapsibleSectionLabel({
  children,
  open,
  onToggle,
}: {
  children: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e: { key: string }) => {
        if (e.key === "Enter" || e.key === " ") onToggle();
      }}
      style={{ cursor: "pointer", userSelect: "none" }}
    >
      <Row align="center" gap={4} style={{ padding: "10px 16px 6px" }}>
        <span style={{ flex: 1, ...asherSectionLabelStyle() }}>{children}</span>
        <IconChevron open={open} />
      </Row>
    </div>
  );
}

function TemplateHeadingCard({ intro }: { intro: string }) {
  return (
    <Card>
      <CardHeader>Heading</CardHeader>
      <CardBody>
        <Stack gap={10}>
          <Text size="small" style={{ color: ASHER.nav, fontFamily: ASHER.fontSerif }}>
            {intro}
          </Text>
          <Table headers={["Field", "Purpose"]} rows={MATTER_HEADING_FIELDS} striped />
          <div
            style={{
              border: `1px solid ${ASHER.border}`,
              borderRadius: 8,
              padding: "14px 16px",
              background: ASHER.bg,
            }}
          >
            <Text
              size="small"
              weight="semibold"
              style={{ color: ASHER.navy, fontFamily: ASHER.fontSerif, marginBottom: 8 }}
            >
              Example heading
            </Text>
            <Stack gap={4}>
              {MATTER_HEADING_EXAMPLE.map(([label, value]) => (
                <div key={label}>
                  <Row gap={8} align="start">
                    <Text
                      size="small"
                      style={{
                        color: ASHER.navy,
                        fontFamily: ASHER.fontMono,
                        letterSpacing: "-0.045em",
                        minWidth: 168,
                      }}
                    >
                      {label}
                    </Text>
                    <Text size="small" style={{ color: ASHER.nav, fontFamily: ASHER.fontSerif }}>
                      {value}
                    </Text>
                  </Row>
                </div>
              ))}
            </Stack>
          </div>
        </Stack>
      </CardBody>
    </Card>
  );
}

function TemplateLetterOfInstructionHeadingCard({ intro }: { intro: string }) {
  return (
    <Card>
      <CardHeader>Heading</CardHeader>
      <CardBody>
        <Stack gap={10}>
          <Text size="small" style={{ color: ASHER.nav, fontFamily: ASHER.fontSerif }}>
            {intro}
          </Text>
          <Text size="small" style={{ color: ASHER.nav, fontFamily: ASHER.fontSerif }}>
            Branded header: Medico-Legal Consulting · Expert Brief Pack · Letter of Instruction
          </Text>
          <Table headers={["Field", "Purpose"]} rows={LOI_HEADING_FIELDS} striped />
          <div
            style={{
              border: `1px solid ${ASHER.border}`,
              borderRadius: 8,
              padding: "14px 16px",
              background: ASHER.bg,
            }}
          >
            <Text
              size="small"
              weight="semibold"
              style={{ color: ASHER.navy, fontFamily: ASHER.fontSerif, marginBottom: 8 }}
            >
              Example heading
            </Text>
            <Stack gap={4}>
              {LOI_HEADING_EXAMPLE.map(([label, value]) => (
                <div key={label}>
                  <Row gap={8} align="start">
                    <Text
                      size="small"
                      style={{
                        color: ASHER.navy,
                        fontFamily: ASHER.fontMono,
                        letterSpacing: "-0.045em",
                        minWidth: 168,
                      }}
                    >
                      {label}
                    </Text>
                    <Text size="small" style={{ color: ASHER.nav, fontFamily: ASHER.fontSerif }}>
                      {value}
                    </Text>
                  </Row>
                </div>
              ))}
            </Stack>
          </div>
        </Stack>
      </CardBody>
    </Card>
  );
}

function TemplateLibraryPanel({
  route,
  onOpenInMatter,
}: {
  route: LibraryRoute;
  onOpenInMatter: (tab: Tab) => void;
}) {
  const emailKind = templateEmailKind(route);
  if (emailKind) {
    const template = EMAIL_TEMPLATE_DEFINITIONS[emailKind];
    return (
      <Stack gap={16}>
        <Callout tone="info" title={template.title}>
          {template.description}
        </Callout>
        <Card>
          <CardHeader>Email structure</CardHeader>
          <CardBody>
            <Stack gap={10}>
              <div>
                <Text size="small" weight="semibold">Subject</Text>
                <Text size="small" tone="secondary">{template.subject}</Text>
              </div>
              <div>
                <Text size="small" weight="semibold">Fields to complete</Text>
                <Stack gap={6}>
                  {template.fields.map((field) => (
                    <div key={field}>
                      <Text size="small" tone="secondary">{field}</Text>
                    </div>
                  ))}
                </Stack>
              </div>
              <div>
                <Text size="small" weight="semibold">Body</Text>
                <Text size="small" tone="secondary" style={{ whiteSpace: "pre-wrap" }}>
                  {template.body}
                </Text>
              </div>
            </Stack>
          </CardBody>
        </Card>
        <TemplateDownloadButtons route={route} />
        <AsherOutlineButton onClick={() => onOpenInMatter("correspondence")}>
          Use in active matter
        </AsherOutlineButton>
      </Stack>
    );
  }

  if (route === "template-invoice") {
    return (
      <Stack gap={16}>
        <Callout tone="info" title="Invoice template">
          Client fee invoice — Invoice / No ### header, three-column billing block, right-aligned line items, and payment details.
        </Callout>
        <Card>
          <CardHeader>Layout</CardHeader>
          <CardBody>
            <Table headers={["Section", "Purpose"]} rows={INVOICE_LAYOUT_SECTIONS} striped />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Example structure</CardHeader>
          <CardBody>
            <Stack gap={8}>
              <Text size="small" style={{ color: ASHER.nav, fontFamily: ASHER.fontSerif }}>
                Invoice ····················································· No 051
              </Text>
              <Text size="small" style={{ color: ASHER.nav, fontFamily: ASHER.fontSerif }}>
                Payable $630.00 · Due 30/01/2025 · Issued 30/12/2024 · Ref. #INV-051
              </Text>
              <Text size="small" style={{ color: ASHER.nav, fontFamily: ASHER.fontSerif }}>
                Billed to (firm) · From (consultant) · Legal Research line items · Subtotal · Total
              </Text>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Workflow</CardHeader>
          <CardBody>
            <Stack gap={6}>
              <Text size="small" tone="secondary">Log billable time in the matter file.</Text>
              <Text size="small" tone="secondary">Create a draft invoice from unbilled entries.</Text>
              <Text size="small" tone="secondary">Mark sent, paid, or overdue — linked entries update automatically.</Text>
            </Stack>
          </CardBody>
        </Card>
        <TemplateDownloadButtons route={route} />
        <AsherOutlineButton onClick={() => onOpenInMatter("billing")}>
          Use in active matter
        </AsherOutlineButton>
      </Stack>
    );
  }

  const item: LibraryItem = route === "template-chronology" ? "chronology" : "advice";
  if (item === "chronology") {
    return (
      <Stack gap={16}>
        <Callout tone="info" title="Chronology template">
          Standard medical chronology layout — matter heading, previous medical history, then date-ordered events with provider, type, and source reference.
        </Callout>
        <TemplateHeadingCard intro="Every chronology opens with a matter heading. Populate from the active matter file when exporting." />
        <Card>
          <CardHeader>Previous medical history</CardHeader>
          <CardBody>
            <Stack gap={10}>
              <Text size="small" style={{ color: ASHER.nav, fontFamily: ASHER.fontSerif }}>
                Include a bullet list of relevant prior medical history at the start of the chronology. Exercise discretion — not every past medical event needs to be documented, but record a sufficient amount to give the physician reading the file useful context. Always include past surgeries relating to the injury.
              </Text>
              <Text
                size="small"
                weight="semibold"
                style={{ color: ASHER.navy, fontFamily: ASHER.fontMono, letterSpacing: "-0.045em" }}
              >
                Each bullet (chronological order)
              </Text>
              <Stack gap={6}>
                {CHRONOLOGY_PREVIOUS_HISTORY_BULLETS.map((line) => (
                  <div key={line}>
                    <Text size="small" style={{ color: ASHER.nav, fontFamily: ASHER.fontSerif }}>
                      • {line}
                    </Text>
                  </div>
                ))}
              </Stack>
              <Text size="small" style={{ color: ASHER.nav, fontFamily: ASHER.fontMono }}>
                Example: 14 Mar 2019 · ACL reconstruction · St Vincent&apos;s Hospital · Dr J. Nguyen
              </Text>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Column structure</CardHeader>
          <CardBody>
            <Table
              headers={["Field", "Purpose"]}
              rows={CHRONOLOGY_COLUMN_ROWS}
              striped
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Export</CardHeader>
          <CardBody>
            <Text size="small" tone="secondary">
              Generates a court-ready PDF or HTML chronology with the matter heading (name, client, injury description, DOB, prepared by), generated date, and paginated event table.
            </Text>
          </CardBody>
        </Card>
        <TemplateDownloadButtons route={route} />
        <AsherOutlineButton onClick={() => onOpenInMatter("chronology")}>
          Use in active matter
        </AsherOutlineButton>
      </Stack>
    );
  }

  return (
    <Stack gap={16}>
      <Callout tone="info" title="Letter of Instruction template">
        Expert brief pack — branded heading, injury overview, executive summary, narrative chronology, summary, and questions for the expert.
      </Callout>
      <TemplateLetterOfInstructionHeadingCard intro="Every letter of instruction opens with the branded heading below. Populate from the active matter file when exporting." />
      <Card>
        <CardHeader>Sections</CardHeader>
        <CardBody>
          <Table headers={["Section", "Purpose"]} rows={LOI_SECTION_GUIDANCE} striped />
        </CardBody>
      </Card>
      <TemplateDownloadButtons route={route} />
      <AsherOutlineButton onClick={() => onOpenInMatter("advice")}>
        Use in active matter
      </AsherOutlineButton>
    </Stack>
  );
}

function WorkflowLibraryPanel({
  item,
  onOpenInMatter,
}: {
  item: LibraryItem;
  onOpenInMatter: (tab: Tab) => void;
}) {
  const chronologySteps = [
    "Collect medical records, imaging, and correspondence into the matter file.",
    "Extract dated clinical events — one row per consultation, referral, or investigation.",
    "Draft neutral descriptions tied to a source reference for each entry.",
    "Cross-check against records; flag gaps and request missing records.",
    "Export chronology for counsel, court, or expert briefing.",
  ];
  const instructionSteps = [
    "Confirm preliminary checks and limitation review are complete.",
    "Assemble chronology, key records, and any served IME reports.",
    "Complete each letter of instruction section using the template prompts.",
    "Internal review — causation, prognosis, and treatment reasonableness.",
    "Send letter of instruction, log in correspondence, and track expert reply.",
  ];
  const steps = item === "chronology" ? chronologySteps : instructionSteps;
  const title = item === "chronology" ? "Chronology workflow" : "Letter of Instruction workflow";

  return (
    <Stack gap={16}>
      <Callout tone="info" title={title}>
        Step-by-step process for {item === "chronology" ? "building a medical chronology" : "briefing an expert"} in a medicolegal matter.
      </Callout>
      <Card>
        <CardHeader>Steps</CardHeader>
        <CardBody>
          <Stack gap={10}>
            {steps.map((step, index) => (
              <div key={step}>
                <Row gap={8} align="start">
                  <Pill size="sm">{String(index + 1)}</Pill>
                  <Text size="small">{step}</Text>
                </Row>
              </div>
            ))}
          </Stack>
        </CardBody>
      </Card>
      <AsherOutlineButton onClick={() => onOpenInMatter(libraryItemTab(item))}>
        Start in active matter
      </AsherOutlineButton>
    </Stack>
  );
}

function CreateSkillPanel({ onCancel }: { onCancel: () => void }) {
  const [skillName, setSkillName] = useCanvasState("new-skill-name", "");
  const [skillDescription, setSkillDescription] = useCanvasState("new-skill-description", "");

  return (
    <Card>
      <CardHeader trailing={<Button variant="ghost" onClick={onCancel}>Cancel</Button>}>
        Create skill
      </CardHeader>
      <CardBody>
        <Stack gap={12}>
          <Callout tone="info" title="Reusable skill">
            Define a skill for repeated medicolegal work — checklists, research steps, or drafting prompts you can apply across matters.
          </Callout>
          <Stack gap={4}>
            <FieldLabel>Skill name</FieldLabel>
            <TextInput
              value={skillName}
              onChange={setSkillName}
              placeholder="e.g. IME review checklist"
            />
          </Stack>
          <Stack gap={4}>
            <FieldLabel>Description</FieldLabel>
            <TextArea
              value={skillDescription}
              onChange={setSkillDescription}
              rows={4}
              placeholder="What this skill helps you do…"
            />
          </Stack>
          <AsherOutlineButton onClick={onCancel}>
            Save skill
          </AsherOutlineButton>
        </Stack>
      </CardBody>
    </Card>
  );
}

function CreateTemplatePanel({
  onSelect,
  onCancel,
}: {
  onSelect: (claimType: string) => void;
  onCancel: () => void;
}) {
  const templates = [
    { label: "Motor accident file", claimType: "Personal injury — motor accident" },
    { label: "Public liability file", claimType: "Personal injury — public liability" },
    { label: "Medical negligence file", claimType: "Medical negligence" },
  ];

  return (
    <Card>
      <CardHeader trailing={<Button variant="ghost" onClick={onCancel}>Cancel</Button>}>
        Choose a template
      </CardHeader>
      <CardBody>
        <Stack gap={8}>
          {templates.map((t) => (
            <div key={t.label}>
              <SidebarNavButton
                label={t.label}
                icon={<IconPlus />}
                onClick={() => onSelect(t.claimType)}
              />
            </div>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

function AppSidebar({
  matters,
  activeTab,
  activeMatterId,
  expandedMatterId,
  createMenuOpen,
  homeSearch,
  homeActive,
  libraryRoute,
  onToggleCreateMenu,
  onCreateWorkflow,
  onCreateTemplate,
  onCreateMatter,
  onCreateSkill,
  onGoHome,
  onGoSearch,
  onGoCalendar,
  onGoRegister,
  onGoResearch,
  onOpenLibrary,
  onToggleMatterExpand,
  onOpenMatter,
  onOpenMatterTab,
}: {
  matters: Matter[];
  activeTab: Tab | "";
  activeMatterId: string;
  expandedMatterId: string;
  createMenuOpen: boolean;
  homeSearch: string;
  homeActive: boolean;
  libraryRoute: LibraryRoute | "";
  onToggleCreateMenu: () => void;
  onCreateWorkflow: () => void;
  onCreateTemplate: () => void;
  onCreateMatter: () => void;
  onCreateSkill: () => void;
  onGoHome: () => void;
  onGoSearch: () => void;
  onGoCalendar: () => void;
  onGoRegister: () => void;
  onGoResearch: () => void;
  onOpenLibrary: (route: LibraryRoute) => void;
  onToggleMatterExpand: (matterId: string) => void;
  onOpenMatter: (matterId: string) => void;
  onOpenMatterTab: (matterId: string, tab: Tab) => void;
}) {
  const [templatesOpen, setTemplatesOpen] = useCanvasState("sidebar-templates-open", false);
  const [workflowsOpen, setWorkflowsOpen] = useCanvasState("sidebar-workflows-open", false);
  const [registerSectionOpen, setRegisterSectionOpen] = useCanvasState("sidebar-register-open", true);
  const templatesExpanded = templatesOpen || libraryRoute.startsWith("template-");
  const workflowsExpanded = workflowsOpen || libraryRoute.startsWith("workflow-");
  const registerSectionExpanded = registerSectionOpen;

  return (
    <Stack
      gap={0}
      style={{
        width: 260,
        flexShrink: 0,
        alignSelf: "stretch",
        background: ASHER.bg,
        borderRight: `1px solid ${ASHER.border}`,
        minHeight: "100%",
        fontFamily: ASHER.fontSerif,
      }}
    >
      <Stack gap={4} style={{ padding: "20px 14px 12px" }}>
        <span
          style={{
            padding: "0 6px 10px",
            fontFamily: ASHER.fontSerif,
            fontSize: 15,
            fontWeight: 400,
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
            color: ASHER.navy,
          }}
        >
          Medico-Legal Matter Manager
        </span>

        <Stack gap={2}>
          <SidebarNavButton
            label="Create new"
            icon={<IconPlus />}
            trailing={<IconChevron open={createMenuOpen} />}
            active={createMenuOpen}
            accent
            onClick={onToggleCreateMenu}
          />
          {createMenuOpen && (
            <Stack gap={1} style={{ paddingLeft: 8 }}>
              <SidebarNavButton label="Matter" icon={<IconFolder />} indent={8} onClick={onCreateMatter} />
              <SidebarNavButton label="Skill" icon={<IconHammer />} indent={8} onClick={onCreateSkill} />
              <SidebarNavButton label="Workflow" icon={<IconWorkflow />} indent={8} onClick={onCreateWorkflow} />
              <SidebarNavButton label="Template" icon={<IconDocument />} indent={8} onClick={onCreateTemplate} />
            </Stack>
          )}
          <SidebarNavButton
            label="Search"
            icon={<IconSearch />}
            active={homeActive && homeSearch.trim().length > 0}
            onClick={onGoSearch}
          />
          <SidebarNavButton
            label="Home"
            icon={<IconHouse />}
            active={homeActive}
            onClick={onGoHome}
          />
          <SidebarNavButton
            label="Calendar"
            icon={<IconCalendar />}
            active={activeTab === "calendar"}
            onClick={onGoCalendar}
          />
          <SidebarNavButton
            label="Research Resources"
            icon={<IconScales />}
            active={activeTab === "links"}
            onClick={onGoResearch}
          />
        </Stack>
      </Stack>

      <Divider />

      <Stack gap={0} style={{ overflowY: "auto", flex: 1 }}>
        <SidebarCollapsibleSectionLabel
          open={templatesExpanded}
          onToggle={() => setTemplatesOpen(!templatesOpen)}
        >
          Templates
        </SidebarCollapsibleSectionLabel>
        {templatesExpanded && (
          <Stack gap={1} style={{ padding: "0 8px 8px" }}>
            {TEMPLATE_ITEMS.map((entry) => (
              <div key={entry.route}>
                <SidebarNavButton
                  label={entry.label}
                  icon={templateItemIcon(entry.icon)}
                  indent={8}
                  active={libraryRoute === entry.route}
                  onClick={() => onOpenLibrary(entry.route)}
                />
              </div>
            ))}
          </Stack>
        )}

        <SidebarCollapsibleSectionLabel
          open={workflowsExpanded}
          onToggle={() => setWorkflowsOpen(!workflowsOpen)}
        >
          Workflows
        </SidebarCollapsibleSectionLabel>
        {workflowsExpanded && (
          <Stack gap={1} style={{ padding: "0 8px 8px" }}>
            {LIBRARY_WORKFLOW_ITEMS.map((entry) => (
              <div key={entry.route}>
                <SidebarNavButton
                  label={entry.label}
                  indent={12}
                  active={libraryRoute === entry.route}
                  onClick={() => onOpenLibrary(entry.route)}
                />
              </div>
            ))}
          </Stack>
        )}

        <SidebarCollapsibleSectionLabel
          open={registerSectionExpanded}
          onToggle={() => setRegisterSectionOpen(!registerSectionOpen)}
        >
          Matters
        </SidebarCollapsibleSectionLabel>
        {registerSectionExpanded && (
          <Stack gap={1} style={{ padding: "0 8px 16px" }}>
            <div>
              <SidebarNavButton
                label="Matter Database"
                icon={<IconTable />}
                indent={8}
                active={activeTab === "register"}
                onClick={onGoRegister}
              />
            </div>
            {matters.map((m) => {
              const expanded = expandedMatterId === m.id;
              const matterActive =
                activeMatterId === m.id &&
                activeTab !== "" &&
                activeTab !== "links" &&
                activeTab !== "calendar" &&
                activeTab !== "register" &&
                libraryRoute === "";
              return (
                <div key={m.id}>
                  <Stack gap={1}>
                    <Row gap={0} align="center" style={{ minWidth: 0 }}>
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e: { stopPropagation: () => void }) => {
                          e.stopPropagation();
                          onToggleMatterExpand(m.id);
                        }}
                        onKeyDown={(e: { key: string; stopPropagation: () => void }) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.stopPropagation();
                            onToggleMatterExpand(m.id);
                          }
                        }}
                        style={{ padding: "6px 2px 6px 12px", cursor: "pointer", flexShrink: 0 }}
                      >
                        <IconChevron open={expanded} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <SidebarNavButton
                          label={`${m.matterNumber} — ${m.clientName}`}
                          icon={<IconFolder />}
                          indent={8}
                          active={matterActive && activeTab === "overview"}
                          onClick={() => onOpenMatter(m.id)}
                        />
                      </div>
                    </Row>
                    {expanded &&
                      MATTER_TABS.filter((t) => t.id !== "overview").map((t) => (
                        <div key={`${m.id}-${t.id}`}>
                          <SidebarNavButton
                            label={t.label}
                            indent={30}
                            active={matterActive && activeTab === t.id}
                            onClick={() => onOpenMatterTab(m.id, t.id)}
                          />
                        </div>
                      ))}
                  </Stack>
                </div>
              );
            })}
          </Stack>
        )}

      </Stack>
    </Stack>
  );
}

function workTabForDeadline(dl: Deadline): Tab {
  const title = dl.title.toLowerCase();
  const notes = dl.notes.toLowerCase();

  if (
    title.includes("letter of advice") ||
    title.includes("brief treating") ||
    (title.includes("expert") && title.includes("brief"))
  ) {
    return "advice";
  }
  if (
    title.includes("chronology") ||
    title.includes("limitation") ||
    title.includes("accrual") ||
    notes.includes("sol") ||
    dl.id.startsWith("sol-")
  ) {
    return "chronology";
  }
  if (
    title.includes("record") ||
    title.includes("discovery") ||
    title.includes("documents") ||
    title.includes("affidavit")
  ) {
    return "records";
  }
  if (dl.type === "hearing") return "calendar";
  if (
    title.includes("response") ||
    title.includes("particulars") ||
    title.includes("serve") ||
    title.includes("ime") ||
    dl.type === "party_response"
  ) {
    return "correspondence";
  }

  switch (dl.type) {
    case "court_filing":
      return title.includes("chronology") ? "chronology" : "correspondence";
    case "discovery":
      return "records";
    case "other":
      return "overview";
    default:
      return "calendar";
  }
}

interface CorrespondenceWorkDraft {
  date: string;
  direction: CorrespondenceDirection;
  type: CorrespondenceType;
  party: string;
  subject: string;
  reference: string;
  summary: string;
  body: string;
  tags: string[];
}

interface DeadlineWorkTemplate {
  tab: Tab;
  hint: string;
  correspondence?: CorrespondenceWorkDraft;
  advice?: Partial<LetterOfInstruction>;
  records?: { provider: string; providerType: string; dateRange: string };
}

function outboundLetterDraft(
  matter: Matter,
  party: string,
  reLine: string,
  paragraphs: string[],
): string {
  return `${formatDate(todayIso())}

${party}

Dear Sir/Madam,

Re: ${matter.clientName} v ${matter.defendantName || "TBC"}
    Our ref: ${matter.matterNumber}
    ${reLine}

${paragraphs.join("\n\n")}

Yours faithfully,

${matter.solicitor || "[Solicitor]"}`;
}

function genericCorrespondenceDraft(dl: Deadline, matter: Matter): CorrespondenceWorkDraft {
  const party = dl.party || matter.defendantName || "";
  return {
    date: todayIso(),
    direction: "outbound",
    type: dl.type === "court_filing" ? "court_document" : "letter",
    party,
    subject: dl.title,
    reference: "",
    summary: dl.notes || dl.title,
    tags: dl.type === "court_filing" ? ["Court"] : ["Defendant"],
    body: outboundLetterDraft(matter, party, dl.title, [
      dl.notes || "[Set out the purpose of this correspondence.]",
      "[Complete draft text before sending.]",
    ]),
  };
}

function buildDeadlineWorkTemplate(dl: Deadline, matter: Matter): DeadlineWorkTemplate {
  const title = dl.title.toLowerCase();
  const party = dl.party || matter.defendantName || "";
  const hint = dl.notes || "Complete the draft below, then mark the deadline done on the Calendar tab once filed or sent.";

  if (title.includes("further") && title.includes("particulars")) {
    return {
      tab: "correspondence",
      hint,
      correspondence: {
        date: todayIso(),
        direction: "outbound",
        type: "letter",
        party,
        subject: `Re: Further and better particulars — ${matter.clientName}`,
        reference: `LTR-FBP-${matter.matterNumber}`,
        summary: "Reply to defendant's request for further and better particulars",
        tags: ["Defendant", "Court"],
        body: outboundLetterDraft(matter, party, "Further and better particulars", [
          "We refer to your letter dated 2 July 2026 requesting further and better particulars in relation to the above matter.",
          "Our client's responses are as follows:",
          "Particular 1 — Treatment history\n[Set out treating practitioners, dates of attendance, referrals, and interventions from date of injury to present.]",
          "Particular 2 — Employment and economic loss\n[Set out pre-injury role, hours, earnings, periods of total/modified duties, and quantification of lost income.]",
          "Particular 3 — Mechanism and injuries\n[Set out circumstances of the accident, initial symptoms, diagnoses, and ongoing complaints.]",
          "Please contact the writer if any further information is required.",
        ]),
      },
    };
  }

  if (title.includes("ime")) {
    return {
      tab: "correspondence",
      hint,
      correspondence: {
        date: todayIso(),
        direction: "outbound",
        type: "letter",
        party,
        subject: `Re: Independent medical examination report — ${matter.clientName}`,
        reference: `LTR-IME-${matter.matterNumber}`,
        summary: "Response to defendant's IME report",
        tags: ["Defendant", "Expert"],
        body: outboundLetterDraft(matter, party, "Response to independent medical examination report", [
          "We refer to the independent medical examination report dated 22 September 2025.",
          "Our client maintains that the accident caused a whiplash-associated disorder with ongoing cervical and lumbar symptoms. The treating specialist's opinion is enclosed for context.",
          "Causation\n[Address whether current symptoms and imaging findings are consistent with the accident mechanism, and respond to the IME opinion on pre-existing degeneration.]",
          "Treatment reasonableness\n[Respond to criticisms of physiotherapy, medication, and any proposed injections.]",
          "Prognosis and capacity\n[Contrast IME prognosis with treating evidence and client's functional restrictions.]",
        ]),
      },
    };
  }

  if (title.includes("serve") && title.includes("expert")) {
    return {
      tab: "correspondence",
      hint,
      correspondence: {
        date: todayIso(),
        direction: "outbound",
        type: "letter",
        party,
        subject: `Service of expert report — ${matter.clientName}`,
        reference: `LTR-SERV-${matter.matterNumber}`,
        summary: "Cover letter serving expert medical report on defendant",
        tags: ["Defendant", "Expert", "Court"],
        body: outboundLetterDraft(matter, party, "Service of expert medical report", [
          "We enclose for your attention a copy of the expert medical report dated [date].",
          "The report is served pursuant to the directions order made in this proceeding.",
          "Please confirm receipt of the enclosed report.",
        ]),
      },
    };
  }

  if (
    title.includes("letter of advice") ||
    title.includes("letter of instruction") ||
    title.includes("brief treating") ||
    (title.includes("expert") && title.includes("brief"))
  ) {
    return {
      tab: "advice",
      hint: "Review and finalise the letter of instruction to the expert. When ready, log the sent brief on the Correspondence tab.",
      advice: {
        preparedFor: party || "Dr [Expert name]",
        injuryOverview: matter.injuryDescription,
        executiveSummary: `${matter.clientName} alleges ongoing symptoms following a ${matter.claimType.toLowerCase()} on ${formatDate(matter.injuryDate)}.`,
        questionsForExpert:
          "• Is the client's current presentation causally related to the incident?\n• Are the reported functional restrictions consistent with the objective medical evidence?\n• What work capacity, if any, is supported by the available evidence?",
      },
    };
  }

  if (title.includes("file chronology")) {
    return {
      tab: "chronology",
      hint: "Review chronology entries against the records, then export the chronology below for court filing.",
    };
  }

  if (title.includes("limitation") || title.includes("accrual") || dl.id.startsWith("sol-")) {
    return {
      tab: "chronology",
      hint: "Review the statute of limitations check, accrual date, and limitation notes. Update if discovery or scheme-specific issues apply.",
    };
  }

  if (title.includes("discovery") || title.includes("documents") || title.includes("affidavit")) {
    return {
      tab: "records",
      hint: "Compile all record requests and responses to support the affidavit of documents.",
      records: {
        provider: "Affidavit of documents — supporting medical records",
        providerType: "other",
        dateRange: "All records requested and received in this matter",
      },
    };
  }

  if (dl.type === "hearing") {
    return {
      tab: "calendar",
      hint: `Directions hearing on ${formatDate(dl.date)}. Prepare chronology, draft witness statements, and confirm client attendance.`,
    };
  }

  const tab = workTabForDeadline(dl);
  if (tab === "correspondence") {
    return { tab, hint, correspondence: genericCorrespondenceDraft(dl, matter) };
  }
  return { tab, hint };
}

function deadlineWorkBannerText(dl: Deadline): string {
  const days = daysUntil(dl.date);
  const due =
    days < 0
      ? `${Math.abs(days)} days overdue`
      : days === 0
        ? "due today"
        : `due in ${days} day${days === 1 ? "" : "s"}`;
  return `${formatDate(dl.date)} (${due})`;
}

function DeadlineWorkBanner({
  deadlineId,
  deadlines,
  hint,
  onDismiss,
}: {
  deadlineId: string;
  deadlines: Deadline[];
  hint?: string;
  onDismiss: () => void;
}) {
  const dl = deadlines.find((d) => d.id === deadlineId);
  if (!dl) return null;

  return (
    <Callout tone="info" title={`Draft: ${dl.title}`}>
      <Stack gap={8}>
        <Text size="small">{deadlineWorkBannerText(dl)}</Text>
        <Text size="small" tone="secondary">
          {hint || dl.notes || "Complete the prefilled draft below."}
        </Text>
        <Row gap={8}>
          <Button variant="ghost" onClick={onDismiss}>Dismiss draft</Button>
        </Row>
      </Stack>
    </Callout>
  );
}

function deadlineUrgencyTone(d: Deadline): "danger" | "warning" | "info" | undefined {
  if (d.status === "completed") return undefined;
  const days = daysUntil(d.date);
  if (days < 0) return "danger";
  if (days <= 7) return "warning";
  if (days <= 14) return "info";
  return undefined;
}

function monthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("en-AU", { month: "long", year: "numeric" });
}

function getNextDeadline(matterId: string, allDeadlines: Deadline[]): Deadline | null {
  const pending = allDeadlines
    .filter((d) => d.matterId === matterId && d.status === "pending")
    .sort((a, b) => a.date.localeCompare(b.date));
  if (pending.length === 0) return null;
  const today = todayIso();
  return pending.find((d) => d.date >= today) ?? pending[0];
}

function formatNextDeadlinePhrase(dl: Deadline): string {
  const days = daysUntil(dl.date);
  const datePart = formatDate(dl.date);
  if (days < 0) {
    return `Next deadline: ${dl.title} (${datePart}) — ${Math.abs(days)} days overdue`;
  }
  if (days === 0) {
    return `Next deadline: ${dl.title} — due today (${datePart})`;
  }
  return `Next deadline: ${dl.title} (${datePart}) — ${days} day${days === 1 ? "" : "s"}`;
}

function buildFileStatusSummary(
  matter: Matter,
  nextDeadline: Deadline | null,
): string {
  const parts: string[] = [];
  const lastAction = matter.lastActionNote?.trim();
  const followUp = matter.followUpNote?.trim();
  if (lastAction) parts.push(lastAction);
  if (followUp) parts.push(followUp);
  if (nextDeadline) parts.push(formatNextDeadlinePhrase(nextDeadline));
  return parts.join(" ");
}

function partyRoleLabel(r: PartyRole): string {
  const map: Record<PartyRole, string> = {
    defendant: "Defendant",
    third_party: "Third party",
    employer: "Employer",
    insurer: "Insurer",
    other: "Other",
  };
  return map[r];
}

function pursueLabel(p: PursueDecision): string {
  if (p === "yes") return "Pursue";
  if (p === "no") return "Do not pursue";
  return "Under review";
}

function pursueTone(p: PursueDecision): "success" | "danger" | "warning" {
  if (p === "yes") return "success";
  if (p === "no") return "danger";
  return "warning";
}

function addYearsToIso(iso: string, years: number): string {
  const d = parseIsoDate(iso);
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString().slice(0, 10);
}

function solExpiryDate(sol: SolCheck): string {
  const base = sol.useDiscoveryDate && sol.discoveryDate ? sol.discoveryDate : sol.accrualDate;
  if (!base) return "";
  return addYearsToIso(base, sol.limitationYears);
}

function defaultSolForMatter(matter: Matter): SolCheck {
  const accrual = matter.injuryDate || matter.createdAt;
  let years = 3;
  let jurisdiction = "VIC";
  if (matter.claimType.includes("motor accident")) years = 6;
  if (matter.claimType.includes("Workers")) years = 3;
  return {
    matterId: matter.id,
    jurisdiction,
    limitationYears: years,
    accrualDate: accrual,
    useDiscoveryDate: false,
    discoveryDate: "",
    verified: false,
    verifiedDate: "",
    notes: "",
  };
}

function solLimitationNote(jurisdiction: string, claimType: string): string {
  if (jurisdiction === "VIC" && claimType.includes("motor accident")) {
    return "VIC TAC/MVA — verify serious injury certificate, common law election, and impairment timelines separately from general limitation.";
  }
  if (jurisdiction === "VIC") return "Limitation of Actions Act 1958 (Vic) — typically 3 years for personal injury from accrual.";
  if (jurisdiction === "NSW") return "Limitation Act 1969 (NSW) — typically 3 years for personal injury.";
  if (jurisdiction === "QLD") return "Limitation of Actions Act 1974 (Qld) — typically 3 years for personal injury.";
  return "Confirm applicable limitation period for jurisdiction and cause of action.";
}

function applySolPreset(sol: SolCheck, jurisdiction: string, claimType: string): SolCheck {
  let years = 3;
  if (jurisdiction === "VIC" && claimType.includes("motor accident")) years = 6;
  return { ...sol, jurisdiction, limitationYears: years };
}

function solDeadlineIds(matterId: string): string[] {
  return [
    `sol-expiry-${matterId}`,
    `sol-accrual-${matterId}`,
    `sol-discovery-${matterId}`,
  ];
}

function syncSolToCalendar(sol: SolCheck, deadlines: Deadline[]): Deadline[] {
  const matterId = sol.matterId;
  const solIds = new Set(solDeadlineIds(matterId));
  const without = deadlines.filter((d) => !solIds.has(d.id));

  const synced: Deadline[] = [];
  const expiry = solExpiryDate(sol);
  if (expiry) {
    synced.push({
      id: `sol-expiry-${matterId}`,
      matterId,
      date: expiry,
      title: "Limitation period expires",
      type: "court_filing",
      party: `${sol.jurisdiction} limitation`,
      status: "pending",
      notes: "Auto-synced from Statute of Limitations check.",
    });
  }
  if (sol.accrualDate) {
    synced.push({
      id: `sol-accrual-${matterId}`,
      matterId,
      date: sol.accrualDate,
      title: "Accrual — date of injury / cause of action",
      type: "other",
      party: "Limitation reference",
      status: "completed",
      notes: "Auto-synced accrual date from SOL check.",
    });
  }
  if (sol.useDiscoveryDate && sol.discoveryDate) {
    synced.push({
      id: `sol-discovery-${matterId}`,
      matterId,
      date: sol.discoveryDate,
      title: "Date of discovery",
      type: "other",
      party: "Limitation reference",
      status: "completed",
      notes: "Discovery date — limitation expiry calculated from this date. Also on calendar.",
    });
  }
  return [...without, ...synced];
}

// ── Field label ──────────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: string }) {
  return (
    <Text size="small" tone="tertiary" weight="medium" style={{ marginBottom: 4 }}>
      {children}
    </Text>
  );
}

function CollapsibleHeading({
  title,
  open,
  onToggle,
  trailing,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  trailing?: string;
}) {
  const theme = useHostTheme();
  return (
    <div
      onClick={onToggle}
      style={{ cursor: "pointer", userSelect: "none" }}
    >
      <Row gap={10} align="center">
        <Text weight="semibold" style={{ fontSize: 12, color: theme.text.tertiary, width: 14, flexShrink: 0 }}>
          {open ? "▼" : "▶"}
        </Text>
        <H2 style={{ margin: 0, flex: 1 }}>{title}</H2>
        {trailing && (
          <Text size="small" tone="tertiary">{trailing}</Text>
        )}
      </Row>
    </div>
  );
}

// ── New matter form ──────────────────────────────────────────────────────────

function NewMatterPanel({
  onSave,
  onCancel,
}: {
  onSave: (m: Matter) => void;
  onCancel: () => void;
}) {
  const [matterNumber, setMatterNumber] = useCanvasState("new-matter-number", "");
  const [clientName, setClientName] = useCanvasState("new-client-name", "");
  const [clientDOB, setClientDOB] = useCanvasState("new-client-dob", "");
  const [defendant, setDefendant] = useCanvasState("new-defendant", "");
  const [injuryDate, setInjuryDate] = useCanvasState("new-injury-date", "");
  const [injuryDesc, setInjuryDesc] = useCanvasState("new-injury-desc", "");
  const [claimType, setClaimType] = useCanvasState("new-claim-type", "Personal injury — motor accident");
  const [solicitor, setSolicitor] = useCanvasState("new-solicitor", "");

  const handleSave = () => {
    if (!clientName.trim()) return;
    const m: Matter = {
      id: uid("matter"),
      matterNumber: matterNumber.trim() || `ML-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`,
      clientName: clientName.trim(),
      clientDOB,
      defendantName: defendant.trim(),
      injuryDate,
      injuryDescription: injuryDesc.trim(),
      claimType,
      status: "intake",
      createdAt: new Date().toISOString().slice(0, 10),
      solicitor: solicitor.trim() || "Unassigned",
      notes: "",
      lastActionNote: "",
      followUpNote: "",
      ...defaultMatterRegisterFields(),
    };
    onSave(m);
    setMatterNumber("");
    setClientName("");
    setClientDOB("");
    setDefendant("");
    setInjuryDate("");
    setInjuryDesc("");
    setSolicitor("");
  };

  return (
    <Card>
      <CardHeader trailing={<Pill size="sm">New file</Pill>}>Create matter</CardHeader>
      <CardBody>
        <Stack gap={12}>
          <Grid columns={2} gap={12}>
            <Stack gap={4}>
              <FieldLabel>Matter number</FieldLabel>
              <TextInput value={matterNumber} onChange={setMatterNumber} placeholder="Auto-generated if blank" />
            </Stack>
            <Stack gap={4}>
              <FieldLabel>Solicitor</FieldLabel>
              <TextInput value={solicitor} onChange={setSolicitor} placeholder="Responsible solicitor" />
            </Stack>
          </Grid>
          <Grid columns={2} gap={12}>
            <Stack gap={4}>
              <FieldLabel>Client name</FieldLabel>
              <TextInput value={clientName} onChange={setClientName} placeholder="Full legal name" />
            </Stack>
            <Stack gap={4}>
              <FieldLabel>Date of birth</FieldLabel>
              <TextInput value={clientDOB} onChange={setClientDOB} type="text" placeholder="YYYY-MM-DD" />
            </Stack>
          </Grid>
          <Grid columns={2} gap={12}>
            <Stack gap={4}>
              <FieldLabel>Defendant / respondent</FieldLabel>
              <TextInput value={defendant} onChange={setDefendant} placeholder="Party liable" />
            </Stack>
            <Stack gap={4}>
              <FieldLabel>Date of injury / incident</FieldLabel>
              <TextInput value={injuryDate} onChange={setInjuryDate} placeholder="YYYY-MM-DD" />
            </Stack>
          </Grid>
          <Stack gap={4}>
            <FieldLabel>Claim type</FieldLabel>
            <Select
              value={claimType}
              onChange={setClaimType}
              options={[
                { value: "Personal injury — motor accident", label: "Personal injury — motor accident" },
                { value: "Public liability", label: "Public liability" },
                { value: "Medical negligence", label: "Medical negligence" },
                { value: "Workers compensation", label: "Workers compensation" },
                { value: "Product liability", label: "Product liability" },
              ]}
            />
          </Stack>
          <Stack gap={4}>
            <FieldLabel>Injury / incident description</FieldLabel>
            <TextArea value={injuryDesc} onChange={setInjuryDesc} rows={3} placeholder="Brief factual summary of mechanism and initial injuries" />
          </Stack>
          <Row gap={8}>
            <AsherOutlineButton onClick={handleSave}>Create matter file</AsherOutlineButton>
            <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          </Row>
        </Stack>
      </CardBody>
    </Card>
  );
}

// ── Overview tab ─────────────────────────────────────────────────────────────

function OverviewTab({
  matter,
  deadlines,
  letter,
  timeEntries,
  onUpdate,
  onOpenCalendar,
  onOpenDeadline,
}: {
  matter: Matter;
  deadlines: Deadline[];
  letter: LetterOfInstruction | undefined;
  timeEntries: TimeEntry[];
  onUpdate: (m: Matter) => void;
  onOpenCalendar: () => void;
  onOpenDeadline: (deadline: Deadline) => void;
}) {
  const theme = useHostTheme();
  const nextDeadline = getNextDeadline(matter.id, deadlines);
  const statusSummary = buildFileStatusSummary(matter, nextDeadline);
  const preliminary = matterPreliminaryChecklist(matter);
  const preliminaryComplete =
    preliminary.conflictOfInterest &&
    preliminary.retainerAndAuthority &&
    preliminary.previousLitigation;

  const updatePreliminary = (patch: Partial<Matter["preliminaryChecklist"]>) => {
    onUpdate({
      ...matter,
      preliminaryChecklist: { ...preliminary, ...patch },
    });
  };

  const suggestLastAction = () => {
    const matterTime = timeEntries
      .filter((e) => e.matterId === matter.id)
      .sort((a, b) => b.date.localeCompare(a.date));
    const latest = matterTime[0];

    if (letter?.preparedFor?.trim()) {
      const datePart = latest?.description.toLowerCase().includes("letter")
        ? formatDate(latest.date)
        : formatDate(todayIso());
      onUpdate({
        ...matter,
        lastActionNote: `Sent letter of instruction to ${letter.preparedFor.trim()} (${datePart}), awaiting reply.`,
        followUpNote: matter.followUpNote || "Follow up email in 3 days if no response.",
      });
      return;
    }

    if (latest) {
      onUpdate({
        ...matter,
        lastActionNote: `${latest.description} (${formatDate(latest.date)}).`,
      });
      return;
    }

    onUpdate({
      ...matter,
      lastActionNote: "File opened — initial client conference completed.",
    });
  };

  return (
    <Grid columns="minmax(0, 1fr) 200px" gap={16} style={{ width: "100%" }}>
      <Stack gap={16} style={{ minWidth: 0 }}>
      <Grid columns={3} gap={12}>
        <Stat value={matter.matterNumber} label="Matter number" />
        <Stat value={statusLabel(matter.status)} label="Stage" tone="info" />
        <Stat value={formatDate(matter.injuryDate)} label="Date of injury" />
      </Grid>

      <Card>
        <CardHeader
          trailing={
            preliminaryComplete ? (
              <Pill size="sm" active>Complete</Pill>
            ) : (
              <Pill size="sm">In progress</Pill>
            )
          }
        >
          Preliminary checklist
        </CardHeader>
        <CardBody>
          <Stack gap={10}>
            <Checkbox
              checked={preliminary.conflictOfInterest}
              onChange={(v) => updatePreliminary({ conflictOfInterest: v })}
              label="Check for conflict of interests"
            />
            <Checkbox
              checked={preliminary.retainerAndAuthority}
              onChange={(v) => updatePreliminary({ retainerAndAuthority: v })}
              label="Send and receipt of retainer and authority"
            />
            <Checkbox
              checked={preliminary.previousLitigation}
              onChange={(v) => updatePreliminary({ previousLitigation: v })}
              label="Check for previous litigation by the client"
            />
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardHeader trailing={<Text size="small" tone="tertiary">{matter.claimType}</Text>}>
          {matter.clientName} v {matter.defendantName || "TBC"}
        </CardHeader>
        <CardBody>
          <Stack gap={12}>
            <Grid columns={2} gap={12}>
              <Stack gap={4}>
                <FieldLabel>Client DOB</FieldLabel>
                <Text>{formatDate(matter.clientDOB)}</Text>
              </Stack>
              <Stack gap={4}>
                <FieldLabel>Responsible solicitor</FieldLabel>
                <TextInput
                  value={matter.solicitor}
                  onChange={(v) => onUpdate({ ...matter, solicitor: v })}
                />
              </Stack>
            </Grid>
            <Stack gap={4}>
              <FieldLabel>Injury description</FieldLabel>
              <TextArea
                value={matter.injuryDescription}
                onChange={(v) => onUpdate({ ...matter, injuryDescription: v })}
                rows={3}
              />
            </Stack>
            <Stack gap={4}>
              <FieldLabel>File notes</FieldLabel>
              <TextArea
                value={matter.notes}
                onChange={(v) => onUpdate({ ...matter, notes: v })}
                rows={3}
              />
            </Stack>
            <Stack gap={4}>
              <FieldLabel>Matter stage</FieldLabel>
              <Select
                value={matter.status}
                onChange={(v) => onUpdate({ ...matter, status: v as MatterStatus })}
                options={[
                  { value: "intake", label: "Intake" },
                  { value: "records_requested", label: "Records requested" },
                  { value: "records_received", label: "Records received" },
                  { value: "analysis", label: "Analysis" },
                  { value: "expert_brief", label: "Expert brief" },
                  { value: "closed", label: "Closed" },
                ]}
              />
            </Stack>

            {statusSummary && (
              <Callout
                tone={
                  nextDeadline && daysUntil(nextDeadline.date) < 0
                    ? "danger"
                    : nextDeadline && daysUntil(nextDeadline.date) <= 7
                      ? "warning"
                      : "neutral"
                }
                title="File status"
              >
                {statusSummary}
              </Callout>
            )}

            <Stack gap={4}>
              <Row gap={8} align="center">
                <FieldLabel>Last action on file</FieldLabel>
                <Spacer />
                <Button variant="ghost" onClick={suggestLastAction}>Suggest from file</Button>
              </Row>
              <TextArea
                value={matter.lastActionNote ?? ""}
                onChange={(v) => onUpdate({ ...matter, lastActionNote: v })}
                rows={2}
                placeholder="e.g. Sent letter of advice to Dr Smith (14 Mar 2026), awaiting reply."
              />
            </Stack>
            <Stack gap={4}>
              <FieldLabel>Follow-up reminder</FieldLabel>
              <TextInput
                value={matter.followUpNote ?? ""}
                onChange={(v) => onUpdate({ ...matter, followUpNote: v })}
                placeholder="e.g. Follow up email in 3 days if no response."
              />
            </Stack>
          </Stack>
        </CardBody>
      </Card>

      <Callout tone="info" title="Litigation journey — Stage 1">
        This matter is at the beginning of the medicolegal pathway: open the file, obtain records, build the chronology, and prepare the letter of instruction to brief an expert physician.
      </Callout>

      <H3>Workflow checklist</H3>
      <Stack gap={4}>
        {[
          { step: "1", label: "Create matter file", done: true },
          { step: "2", label: "Request medical records from all treating providers", done: matter.status !== "intake" },
          { step: "3", label: "Verify statute of limitations and identify parties to pursue", done: ["analysis", "expert_brief", "closed"].includes(matter.status) },
          { step: "4", label: "Review records and compile medical chronology", done: ["analysis", "expert_brief", "closed"].includes(matter.status) },
          { step: "5", label: "Draft letter of instruction to expert", done: ["expert_brief", "closed"].includes(matter.status) },
          { step: "6", label: "Track court and party deadlines on calendar", done: matter.status !== "intake" },
          { step: "7", label: "Track billable time throughout", done: true },
        ].map((item) => (
          <div key={item.step}>
          <Row gap={8} align="center">
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                background: item.done ? theme.accent.primary : theme.fill.tertiary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Text size="small" style={{ color: item.done ? theme.text.onAccent : theme.text.tertiary }}>
                {item.step}
              </Text>
            </div>
            <Text tone={item.done ? "primary" : "tertiary"}>{item.label}</Text>
          </Row>
          </div>
        ))}
      </Stack>
      </Stack>

      <Stack gap={12} style={{ alignSelf: "start" }}>
        <TodayCalendarCompact
          matterId={matter.id}
          matters={[matter]}
          deadlines={deadlines}
          onOpenCalendar={onOpenCalendar}
          onOpenDeadline={onOpenDeadline}
        />
        <UpcomingDeadlinesCompact
          matters={[matter]}
          matterId={matter.id}
          deadlines={deadlines}
          onOpenCalendar={onOpenCalendar}
          onOpenDeadline={onOpenDeadline}
        />
      </Stack>
    </Grid>
  );
}

// ── Records tab ──────────────────────────────────────────────────────────────

function RecordsTab({
  matterId,
  records,
  onChange,
  deadlines,
}: {
  matterId: string;
  records: RecordRequest[];
  onChange: (r: RecordRequest[]) => void;
  deadlines: Deadline[];
}) {
  const matterRecords = records.filter((r) => r.matterId === matterId);
  const [showAdd, setShowAdd] = useCanvasState(`records-add-${matterId}`, false);
  const [workDeadlineId, setWorkDeadlineId] = useCanvasState(`deadline-work-active-${matterId}`, "");
  const [workHint, setWorkHint] = useCanvasState(`deadline-work-hint-${matterId}`, "");
  const [newProvider, setNewProvider] = useCanvasState(`new-rec-provider-${matterId}`, "");
  const [newType, setNewType] = useCanvasState(`new-rec-type-${matterId}`, "hospital");
  const [newRange, setNewRange] = useCanvasState(`new-rec-range-${matterId}`, "");

  const addRecord = () => {
    if (!newProvider.trim()) return;
    const rec: RecordRequest = {
      id: uid("rec"),
      matterId,
      provider: newProvider.trim(),
      providerType: newType,
      dateRequested: new Date().toISOString().slice(0, 10),
      dateReceived: "",
      status: "pending",
      dateRange: newRange,
      notes: "",
    };
    onChange([...records, rec]);
    setNewProvider("");
    setNewRange("");
    setShowAdd(false);
    setWorkDeadlineId("");
    setWorkHint("");
  };

  const updateRecord = (id: string, patch: Partial<RecordRequest>) => {
    onChange(records.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const removeRecord = (id: string) => {
    onChange(records.filter((r) => r.id !== id));
  };

  const pending = matterRecords.filter((r) => r.status !== "received").length;
  const received = matterRecords.filter((r) => r.status === "received").length;

  return (
    <Stack gap={16}>
      {workDeadlineId && (
        <DeadlineWorkBanner
          deadlineId={workDeadlineId}
          deadlines={deadlines}
          hint={workHint}
          onDismiss={() => {
            setWorkDeadlineId("");
            setWorkHint("");
          }}
        />
      )}

      <Grid columns={3} gap={12}>
        <Stat value={String(matterRecords.length)} label="Total requests" />
        <Stat value={String(received)} label="Received" tone="success" />
        <Stat value={String(pending)} label="Outstanding" tone={pending > 0 ? "warning" : "success"} />
      </Grid>

      <Row gap={8}>
        <AsherOutlineButton onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? "Close form" : "New record request"}
        </AsherOutlineButton>
      </Row>

      {showAdd && (
        <Card>
          <CardHeader>
            {workDeadlineId ? "Complete record request draft" : "Request medical records"}
          </CardHeader>
          <CardBody>
            <Stack gap={12}>
              <Grid columns={2} gap={12}>
                <Stack gap={4}>
                  <FieldLabel>Provider / facility</FieldLabel>
                  <TextInput value={newProvider} onChange={setNewProvider} placeholder="Hospital, GP, specialist, radiology" />
                </Stack>
                <Stack gap={4}>
                  <FieldLabel>Provider type</FieldLabel>
                  <Select
                    value={newType}
                    onChange={setNewType}
                    options={[
                      { value: "hospital", label: "Hospital" },
                      { value: "gp", label: "General practitioner" },
                      { value: "specialist", label: "Specialist" },
                      { value: "radiology", label: "Radiology / pathology" },
                      { value: "other", label: "Other" },
                    ]}
                  />
                </Stack>
              </Grid>
              <Stack gap={4}>
                <FieldLabel>Date range requested</FieldLabel>
                <TextInput value={newRange} onChange={setNewRange} placeholder="e.g. 01/01/2024 – present" />
              </Stack>
              <AsherOutlineButton onClick={addRecord}>Send request</AsherOutlineButton>
            </Stack>
          </CardBody>
        </Card>
      )}

      <H2>Record requests</H2>
      <Table
        headers={["Provider", "Type", "Requested", "Received", "Status", "Date range", ""]}
        rows={matterRecords.map((r) => [
          r.provider,
          r.providerType,
          formatDate(r.dateRequested),
          r.dateReceived ? formatDate(r.dateReceived) : "—",
          r.status.replace("_", " "),
          r.dateRange,
          <IconButton title="Remove" onClick={() => removeRecord(r.id)}>×</IconButton>,
        ])}
        rowTone={matterRecords.map((r) => recordStatusTone(r.status))}
        striped
        stickyHeader
      />

      {matterRecords.map((r) => (
        <div key={r.id}>
        <CollapsibleSection
          title={r.provider}
          count={r.status === "received" ? undefined : 1}
          trailing={
            <Select
              value={r.status}
              onChange={(v) =>
                updateRecord(r.id, {
                  status: v as RecordStatus,
                  dateReceived: v === "received" && !r.dateReceived ? new Date().toISOString().slice(0, 10) : r.dateReceived,
                })
              }
              options={[
                { value: "pending", label: "Pending" },
                { value: "follow_up", label: "Follow-up sent" },
                { value: "received", label: "Received" },
              ]}
              style={{ minWidth: 120 }}
            />
          }
          defaultOpen={r.status !== "received"}
        >
          <Stack gap={8}>
            <FieldLabel>Notes</FieldLabel>
            <TextArea
              value={r.notes}
              onChange={(v) => updateRecord(r.id, { notes: v })}
              rows={2}
            />
          </Stack>
        </CollapsibleSection>
        </div>
      ))}
    </Stack>
  );
}

// ── Correspondence tab ───────────────────────────────────────────────────────

function CorrespondenceTab({
  matterId,
  items,
  onChange,
  deadlines,
}: {
  matterId: string;
  items: CorrespondenceItem[];
  onChange: (items: CorrespondenceItem[]) => void;
  deadlines: Deadline[];
}) {
  const theme = useHostTheme();
  const dispatch = useCanvasAction();

  const [workDeadlineId, setWorkDeadlineId] = useCanvasState(`deadline-work-active-${matterId}`, "");
  const [workHint, setWorkHint] = useCanvasState(`deadline-work-hint-${matterId}`, "");

  const matterItems = items
    .filter((c) => c.matterId === matterId)
    .sort((a, b) => b.date.localeCompare(a.date));

  const [showAdd, setShowAdd] = useCanvasState(`corr-add-${matterId}`, false);
  const [searchQuery, setSearchQuery] = useCanvasState(`corr-search-${matterId}`, "");
  const [tagFilter, setTagFilter] = useCanvasState<string[]>(`corr-tag-filter-${matterId}`, []);
  const [selectedCorrId, setSelectedCorrId] = useCanvasState(`corr-selected-${matterId}`, "");
  const [customTags, setCustomTags] = useCanvasState<string[]>(`corr-custom-tags-${matterId}`, []);
  const [newTagInput, setNewTagInput] = useCanvasState(`corr-new-tag-input-${matterId}`, "");
  const [dragOver, setDragOver] = useCanvasState(`corr-drag-over-${matterId}`, false);
  const [newDate, setNewDate] = useCanvasState(`corr-date-${matterId}`, "");
  const [newDirection, setNewDirection] = useCanvasState(`corr-dir-${matterId}`, "outbound");
  const [newType, setNewType] = useCanvasState(`corr-type-${matterId}`, "letter");
  const [newParty, setNewParty] = useCanvasState(`corr-party-${matterId}`, "");
  const [newSubject, setNewSubject] = useCanvasState(`corr-subject-${matterId}`, "");
  const [newReference, setNewReference] = useCanvasState(`corr-ref-${matterId}`, "");
  const [newSummary, setNewSummary] = useCanvasState(`corr-summary-${matterId}`, "");
  const [newBody, setNewBody] = useCanvasState(`corr-body-${matterId}`, "");
  const [newTags, setNewTags] = useCanvasState<string[]>(`corr-new-tags-${matterId}`, []);

  const availableTags = allAvailableTags(customTags, matterItems);

  const filteredItems = matterItems.filter(
    (c) => correspondenceMatchesSearch(c, searchQuery) && correspondenceMatchesTagFilter(c, tagFilter),
  );

  const selectedItem = selectedCorrId ? items.find((c) => c.id === selectedCorrId) ?? null : null;

  const inbound = matterItems.filter((c) => c.direction === "inbound").length;
  const outbound = matterItems.filter((c) => c.direction === "outbound").length;

  const registerCustomTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag) return "";
    if (!customTags.includes(tag) && !(CORRESPONDENCE_TAGS as readonly string[]).includes(tag)) {
      setCustomTags([...customTags, tag]);
    }
    return tag;
  };

  const addCustomTagFromInput = () => {
    const tag = registerCustomTag(newTagInput);
    if (tag) setNewTagInput("");
  };

  const addItem = () => {
    if (!newDate || !newSubject.trim()) return;
    const item: CorrespondenceItem = {
      id: uid("corr"),
      matterId,
      date: newDate,
      direction: newDirection as CorrespondenceDirection,
      type: newType as CorrespondenceType,
      party: newParty.trim(),
      subject: newSubject.trim(),
      reference: newReference.trim(),
      summary: newSummary.trim(),
      body: newBody.trim() || newSummary.trim(),
      tags: [...newTags],
    };
    onChange([...items, item]);
    setNewDate("");
    setNewParty("");
    setNewSubject("");
    setNewReference("");
    setNewSummary("");
    setNewBody("");
    setNewTags([]);
    setShowAdd(false);
    setSelectedCorrId(item.id);
    setWorkDeadlineId("");
    setWorkHint("");
  };

  const addDroppedFile = (file: File) => {
    const item: CorrespondenceItem = {
      id: uid("corr"),
      matterId,
      date: todayIso(),
      direction: "inbound",
      type: inferCorrespondenceTypeFromFilename(file.name),
      party: "",
      subject: file.name.replace(/\.[^.]+$/, ""),
      reference: file.name,
      summary: `File added to register: ${file.name}`,
      body: "",
      tags: [],
      attachmentName: file.name,
      attachmentPath: "",
    };
    onChange([...items, item]);
    setSelectedCorrId(item.id);
  };

  const updateItem = (id: string, patch: Partial<CorrespondenceItem>) => {
    onChange(items.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const removeItem = (id: string) => {
    onChange(items.filter((c) => c.id !== id));
    if (selectedCorrId === id) setSelectedCorrId("");
  };

  const toggleItemTag = (id: string, tag: string) => {
    const item = items.find((c) => c.id === id);
    if (!item) return;
    updateItem(id, { tags: toggleTagList(correspondenceTags(item), tag) });
  };

  const addTagToItem = (id: string, raw: string) => {
    const tag = registerCustomTag(raw);
    if (!tag) return;
    const item = items.find((c) => c.id === id);
    if (!item) return;
    const current = correspondenceTags(item);
    if (!current.includes(tag)) {
      updateItem(id, { tags: [...current, tag] });
    }
  };

  const renderTagPicker = (selected: string[], onToggle: (tag: string) => void) => (
    <Stack gap={8}>
      <Row gap={6} wrap>
        {availableTags.map((tag) => (
          <span key={tag}>
            <Pill active={selected.includes(tag)} onClick={() => onToggle(tag)} size="sm">
              {tag}
            </Pill>
          </span>
        ))}
      </Row>
      <Row gap={8} align="center">
        <TextInput
          value={newTagInput}
          onChange={setNewTagInput}
          placeholder="Create new tag…"
          style={{ flex: 1, maxWidth: 240 }}
        />
        <AsherOutlineButton
          onClick={() => {
            const tag = registerCustomTag(newTagInput);
            if (tag) {
              onToggle(tag);
              setNewTagInput("");
            }
          }}
        >
          Add tag
        </AsherOutlineButton>
      </Row>
    </Stack>
  );

  return (
    <Stack gap={16}>
      {workDeadlineId && (
        <DeadlineWorkBanner
          deadlineId={workDeadlineId}
          deadlines={deadlines}
          hint={workHint}
          onDismiss={() => {
            setWorkDeadlineId("");
            setWorkHint("");
          }}
        />
      )}

      <Callout tone="info" title="Matter correspondence register">
        Complete record of all inbound and outbound correspondence. Click a subject to open the full item, or drag a file into the register.
      </Callout>

      <Grid columns={3} gap={12}>
        <Stat value={String(matterItems.length)} label="Total items" />
        <Stat value={String(inbound)} label="Inbound" tone="info" />
        <Stat value={String(outbound)} label="Outbound" />
      </Grid>

      <div
        onDragOver={(e: { preventDefault: () => void }) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e: { preventDefault: () => void; dataTransfer: DataTransfer }) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files[0];
          if (file) addDroppedFile(file);
        }}
        style={{
          border: `2px dashed ${dragOver ? theme.accent.primary : theme.stroke.secondary}`,
          borderRadius: 8,
          padding: 28,
          textAlign: "center",
          background: dragOver ? theme.fill.secondary : theme.fill.quaternary,
          cursor: "copy",
        }}
      >
        <Stack gap={10} style={{ alignItems: "center" }}>
          <div
            aria-hidden
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: `2px solid ${dragOver ? theme.accent.primary : theme.stroke.secondary}`,
              background: dragOver ? theme.fill.tertiary : theme.bg.elevated,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 22,
                height: 3,
                borderRadius: 2,
                background: dragOver ? theme.accent.primary : theme.text.tertiary,
              }}
            />
            <div
              style={{
                position: "absolute",
                width: 3,
                height: 22,
                borderRadius: 2,
                background: dragOver ? theme.accent.primary : theme.text.tertiary,
              }}
            />
          </div>
          <Text weight="semibold">Drop file here</Text>
          <Text size="small" tone="tertiary">
            Drag a document, email, or PDF into this area to add it to the correspondence register
          </Text>
        </Stack>
      </div>

      <Row gap={8}>
        <AsherOutlineButton onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? "Close form" : "Log correspondence"}
        </AsherOutlineButton>
      </Row>

      {showAdd && (
        <Card>
          <CardHeader>
            {workDeadlineId ? "Complete draft correspondence" : "Log correspondence"}
          </CardHeader>
          <CardBody>
            <Stack gap={12}>
              <Grid columns={3} gap={12}>
                <Stack gap={4}>
                  <FieldLabel>Date</FieldLabel>
                  <TextInput value={newDate} onChange={setNewDate} placeholder="YYYY-MM-DD" />
                </Stack>
                <Stack gap={4}>
                  <FieldLabel>Direction</FieldLabel>
                  <Select
                    value={newDirection}
                    onChange={setNewDirection}
                    options={[
                      { value: "inbound", label: "Inbound" },
                      { value: "outbound", label: "Outbound" },
                    ]}
                  />
                </Stack>
                <Stack gap={4}>
                  <FieldLabel>Type</FieldLabel>
                  <Select
                    value={newType}
                    onChange={setNewType}
                    options={[
                      { value: "letter", label: "Letter" },
                      { value: "email", label: "Email" },
                      { value: "fax", label: "Fax" },
                      { value: "notice", label: "Notice" },
                      { value: "court_document", label: "Court document" },
                      { value: "expert_report", label: "Expert report" },
                      { value: "other", label: "Other" },
                    ]}
                  />
                </Stack>
              </Grid>
              <Grid columns={2} gap={12}>
                <Stack gap={4}>
                  <FieldLabel>Party / sender / recipient</FieldLabel>
                  <TextInput value={newParty} onChange={setNewParty} placeholder="Name of party or organisation" />
                </Stack>
                <Stack gap={4}>
                  <FieldLabel>Reference</FieldLabel>
                  <TextInput value={newReference} onChange={setNewReference} placeholder="e.g. LTR-015, email ref" />
                </Stack>
              </Grid>
              <Stack gap={4}>
                <FieldLabel>Subject</FieldLabel>
                <TextInput value={newSubject} onChange={setNewSubject} placeholder="Subject or description line" />
              </Stack>
              <Stack gap={4}>
                <FieldLabel>Tags</FieldLabel>
                {renderTagPicker(newTags, (tag) => setNewTags(toggleTagList(newTags, tag)))}
              </Stack>
              <Stack gap={4}>
                <FieldLabel>Summary</FieldLabel>
                <TextArea value={newSummary} onChange={setNewSummary} rows={2} placeholder="Brief summary for the register" />
              </Stack>
              <Stack gap={4}>
                <FieldLabel>Full content</FieldLabel>
                <TextArea value={newBody} onChange={setNewBody} rows={6} placeholder="Full email body, letter text, or notes" />
              </Stack>
              <AsherOutlineButton onClick={addItem}>Add to register</AsherOutlineButton>
            </Stack>
          </CardBody>
        </Card>
      )}

      <H2>Correspondence register</H2>
      <TextInput
        value={searchQuery}
        onChange={setSearchQuery}
        type="search"
        placeholder="Search party, subject, reference, summary, tags, body…"
      />
      <Stack gap={8}>
        <FieldLabel>Filter by tag</FieldLabel>
        <Row gap={6} wrap align="center">
          <Pill active={tagFilter.length === 0} onClick={() => setTagFilter([])} size="sm">
            All
          </Pill>
          {availableTags.map((tag) => (
            <span key={tag}>
              <Pill
                active={tagFilter.includes(tag)}
                onClick={() => setTagFilter(toggleTagList(tagFilter, tag))}
                size="sm"
              >
                {tag}
              </Pill>
            </span>
          ))}
          {tagFilter.length > 0 && (
            <Button variant="ghost" onClick={() => setTagFilter([])}>Clear filters</Button>
          )}
        </Row>
        <Row gap={8} align="center">
          <TextInput
            value={newTagInput}
            onChange={setNewTagInput}
            placeholder="New tag name…"
            style={{ maxWidth: 200 }}
          />
          <AsherOutlineButton onClick={addCustomTagFromInput}>Create tag</AsherOutlineButton>
        </Row>
      </Stack>
      <Text size="small" tone="tertiary">
        Showing {filteredItems.length} of {matterItems.length} items
        {searchQuery.trim() ? ` matching "${searchQuery.trim()}"` : ""}
        {tagFilter.length > 0 ? ` · tags: ${tagFilter.join(", ")}` : ""}
      </Text>
      <Table
        headers={["Date", "Dir.", "Type", "Tags", "Party", "Subject", "Reference", ""]}
        rows={filteredItems.map((c) => [
          formatDate(c.date),
          c.direction === "inbound" ? "In" : "Out",
          correspondenceTypeLabel(c.type),
          formatTagsLabel(correspondenceTags(c)),
          c.party || "—",
          <span
            role="button"
            tabIndex={0}
            onClick={() => setSelectedCorrId(c.id)}
            onKeyDown={(e: { key: string }) => {
              if (e.key === "Enter" || e.key === " ") setSelectedCorrId(c.id);
            }}
            style={{
              color: theme.text.link,
              cursor: "pointer",
              textDecoration: selectedCorrId === c.id ? "underline" : "none",
              fontWeight: selectedCorrId === c.id ? 600 : 400,
            }}
          >
            {c.subject}
          </span>,
          c.reference || "—",
          <IconButton title="Remove" onClick={() => removeItem(c.id)}>×</IconButton>,
        ])}
        rowTone={filteredItems.map((c) => correspondenceDirectionTone(c.direction))}
        striped
        stickyHeader
        emptyMessage="No correspondence matches your search or filters."
      />

      {selectedItem && selectedItem.matterId === matterId && (
        <Card>
          <CardHeader
            trailing={
              <Button variant="ghost" onClick={() => setSelectedCorrId("")}>Close</Button>
            }
          >
            {selectedItem.subject}
          </CardHeader>
          <CardBody>
            <Stack gap={12}>
              <Grid columns={3} gap={12}>
                <Stack gap={4}>
                  <FieldLabel>Date</FieldLabel>
                  <TextInput
                    value={selectedItem.date}
                    onChange={(v) => updateItem(selectedItem.id, { date: v })}
                    placeholder="YYYY-MM-DD"
                  />
                </Stack>
                <Stack gap={4}>
                  <FieldLabel>Direction</FieldLabel>
                  <Select
                    value={selectedItem.direction}
                    onChange={(v) => updateItem(selectedItem.id, { direction: v as CorrespondenceDirection })}
                    options={[
                      { value: "inbound", label: "Inbound" },
                      { value: "outbound", label: "Outbound" },
                    ]}
                  />
                </Stack>
                <Stack gap={4}>
                  <FieldLabel>Type</FieldLabel>
                  <Select
                    value={selectedItem.type}
                    onChange={(v) => updateItem(selectedItem.id, { type: v as CorrespondenceType })}
                    options={[
                      { value: "letter", label: "Letter" },
                      { value: "email", label: "Email" },
                      { value: "fax", label: "Fax" },
                      { value: "notice", label: "Notice" },
                      { value: "court_document", label: "Court document" },
                      { value: "expert_report", label: "Expert report" },
                      { value: "other", label: "Other" },
                    ]}
                  />
                </Stack>
              </Grid>
              <Grid columns={2} gap={12}>
                <Stack gap={4}>
                  <FieldLabel>Party</FieldLabel>
                  <TextInput
                    value={selectedItem.party}
                    onChange={(v) => updateItem(selectedItem.id, { party: v })}
                  />
                </Stack>
                <Stack gap={4}>
                  <FieldLabel>Reference</FieldLabel>
                  <TextInput
                    value={selectedItem.reference}
                    onChange={(v) => updateItem(selectedItem.id, { reference: v })}
                  />
                </Stack>
              </Grid>
              <Stack gap={4}>
                <FieldLabel>Tags</FieldLabel>
                <Row gap={6} wrap>
                  {availableTags.map((tag) => (
                    <span key={tag}>
                      <Pill
                        active={correspondenceTags(selectedItem).includes(tag)}
                        onClick={() => toggleItemTag(selectedItem.id, tag)}
                        size="sm"
                      >
                        {tag}
                      </Pill>
                    </span>
                  ))}
                </Row>
                <Row gap={8} align="center">
                  <TextInput
                    value={newTagInput}
                    onChange={setNewTagInput}
                    placeholder="Add new tag to this item…"
                    style={{ flex: 1, maxWidth: 240 }}
                  />
                  <AsherOutlineButton
                    onClick={() => {
                      addTagToItem(selectedItem.id, newTagInput);
                      setNewTagInput("");
                    }}
                  >
                    Add tag
                  </AsherOutlineButton>
                </Row>
              </Stack>
              <Stack gap={4}>
                <FieldLabel>Summary</FieldLabel>
                <TextArea
                  value={selectedItem.summary}
                  onChange={(v) => updateItem(selectedItem.id, { summary: v })}
                  rows={2}
                />
              </Stack>
              <Stack gap={4}>
                <FieldLabel>Full content</FieldLabel>
                <TextArea
                  value={correspondenceBody(selectedItem)}
                  onChange={(v) => updateItem(selectedItem.id, { body: v })}
                  rows={10}
                />
              </Stack>
              {(selectedItem.attachmentName || selectedItem.type === "email") && (
                <Stack gap={8}>
                  <FieldLabel>Attachment</FieldLabel>
                  <Stack gap={4}>
                    <FieldLabel>File name</FieldLabel>
                    <TextInput
                      value={selectedItem.attachmentName ?? ""}
                      onChange={(v) => updateItem(selectedItem.id, { attachmentName: v })}
                      placeholder="e.g. email-001.pdf"
                    />
                  </Stack>
                  <Stack gap={4}>
                    <FieldLabel>File path (workspace-relative)</FieldLabel>
                    <TextInput
                      value={selectedItem.attachmentPath ?? ""}
                      onChange={(v) => updateItem(selectedItem.id, { attachmentPath: v })}
                      placeholder="e.g. documents/corr/email-001.pdf"
                    />
                  </Stack>
                  {selectedItem.attachmentPath?.trim() && (
                    <AsherOutlineButton
                      onClick={() =>
                        dispatch({ type: "openFile", path: selectedItem.attachmentPath!.trim() })
                      }
                    >
                      Open attachment
                    </AsherOutlineButton>
                  )}
                </Stack>
              )}
            </Stack>
          </CardBody>
        </Card>
      )}
    </Stack>
  );
}

// ── Chronology tab ───────────────────────────────────────────────────────────

function ChronologyTab({
  matter,
  entries,
  parties,
  solCheck,
  onEntriesChange,
  onPartiesChange,
  onSolChange,
  deadlines,
}: {
  matter: Matter;
  entries: ChronologyEntry[];
  parties: MatterParty[];
  solCheck: SolCheck;
  onEntriesChange: (e: ChronologyEntry[]) => void;
  onPartiesChange: (p: MatterParty[]) => void;
  onSolChange: (s: SolCheck) => void;
  deadlines: Deadline[];
}) {
  const matterId = matter.id;
  const matterEntries = entries
    .filter((e) => e.matterId === matterId)
    .sort((a, b) => a.date.localeCompare(b.date));
  const matterParties = parties.filter((p) => p.matterId === matterId);

  const [workDeadlineId, setWorkDeadlineId] = useCanvasState(`deadline-work-active-${matterId}`, "");
  const [workHint, setWorkHint] = useCanvasState(`deadline-work-hint-${matterId}`, "");
  const [showAdd, setShowAdd] = useCanvasState(`chrono-add-${matterId}`, false);
  const [showAddParty, setShowAddParty] = useCanvasState(`party-add-${matterId}`, false);
  const [newDate, setNewDate] = useCanvasState(`chrono-date-${matterId}`, "");
  const [newProvider, setNewProvider] = useCanvasState(`chrono-provider-${matterId}`, "");
  const [newType, setNewType] = useCanvasState(`chrono-type-${matterId}`, "Treatment");
  const [newDesc, setNewDesc] = useCanvasState(`chrono-desc-${matterId}`, "");
  const [newRef, setNewRef] = useCanvasState(`chrono-ref-${matterId}`, "");
  const [newPartyName, setNewPartyName] = useCanvasState(`new-party-name-${matterId}`, "");
  const [newPartyRole, setNewPartyRole] = useCanvasState(`new-party-role-${matterId}`, "third_party");
  const [solOpen, setSolOpen] = useCanvasState(`sol-open-${matterId}`, false);
  const [partiesOpen, setPartiesOpen] = useCanvasState(`parties-open-${matterId}`, false);

  const expiry = solExpiryDate(solCheck);
  const daysToExpiry = expiry ? daysUntil(expiry) : null;
  const solTone: "danger" | "warning" | "success" | "info" =
    daysToExpiry === null
      ? "info"
      : daysToExpiry < 0
        ? "danger"
        : daysToExpiry <= 180
          ? "warning"
          : solCheck.verified
            ? "success"
            : "info";

  const pursueYes = matterParties.filter((p) => p.pursue === "yes").length;
  const pursueReview = matterParties.filter((p) => p.pursue === "under_review").length;

  const addEntry = () => {
    if (!newDate || !newDesc.trim()) return;
    const entry: ChronologyEntry = {
      id: uid("ch"),
      matterId,
      date: newDate,
      provider: newProvider.trim(),
      eventType: newType,
      description: newDesc.trim(),
      relevance: "medium",
      sourceRef: newRef.trim(),
    };
    onEntriesChange([...entries, entry]);
    setNewDate("");
    setNewProvider("");
    setNewDesc("");
    setNewRef("");
    setShowAdd(false);
  };

  const updateEntry = (id: string, patch: Partial<ChronologyEntry>) => {
    onEntriesChange(entries.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };

  const removeEntry = (id: string) => {
    onEntriesChange(entries.filter((e) => e.id !== id));
  };

  const addParty = () => {
    if (!newPartyName.trim()) return;
    const party: MatterParty = {
      id: uid("pty"),
      matterId,
      name: newPartyName.trim(),
      role: newPartyRole as PartyRole,
      relationship: "",
      liabilityNotes: "",
      pursue: "under_review",
      pursueRationale: "",
    };
    onPartiesChange([...parties, party]);
    setNewPartyName("");
    setShowAddParty(false);
  };

  const updateParty = (id: string, patch: Partial<MatterParty>) => {
    onPartiesChange(parties.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const removeParty = (id: string) => {
    onPartiesChange(parties.filter((p) => p.id !== id));
  };

  const updateSol = (patch: Partial<SolCheck>) => {
    onSolChange({ ...solCheck, ...patch });
  };

  return (
    <Stack gap={16}>
      {workDeadlineId && (
        <DeadlineWorkBanner
          deadlineId={workDeadlineId}
          deadlines={deadlines}
          hint={workHint}
          onDismiss={() => {
            setWorkDeadlineId("");
            setWorkHint("");
          }}
        />
      )}

      <Callout tone="neutral" title="Chronology & preliminary merits">
        Before finalising the medical chronology, confirm limitation dates and identify all potential parties — including whether each is worth pursuing.
      </Callout>

      <Stack gap={10}>
        <CollapsibleHeading
          title="Statute of limitations"
          open={solOpen}
          onToggle={() => setSolOpen(!solOpen)}
          trailing={solCheck.verified ? undefined : "Unverified"}
        />
        <Grid columns={3} gap={12}>
          <Stat
            value={expiry ? formatDate(expiry) : "—"}
            label="Limitation expiry"
            tone={daysToExpiry !== null && daysToExpiry < 0 ? "danger" : daysToExpiry !== null && daysToExpiry <= 180 ? "warning" : undefined}
          />
          <Stat value={solCheck.jurisdiction} label="Jurisdiction" />
          <Stat
            value={solCheck.verified ? "Verified" : "Not verified"}
            label="Limitation verified"
            tone={solCheck.verified ? "success" : "warning"}
          />
        </Grid>
        {solOpen && (
          <Stack gap={12}>
            <Stat
              value={daysToExpiry !== null ? (daysToExpiry < 0 ? `${Math.abs(daysToExpiry)}d overdue` : `${daysToExpiry}d`) : "—"}
              label="Time remaining"
              tone={solTone === "danger" ? "danger" : solTone === "warning" ? "warning" : undefined}
            />
            <Card>
              <CardHeader trailing={
                <Checkbox
                  checked={solCheck.verified}
                  onChange={(v) =>
                    updateSol({
                      verified: v,
                      verifiedDate: v ? todayIso() : "",
                    })
                  }
                  label="Verified"
                />
              }>
                Limitation analysis
              </CardHeader>
              <CardBody>
                <Stack gap={12}>
                  <Callout tone={solTone} title={solLimitationNote(solCheck.jurisdiction, matter.claimType)}>
                    {daysToExpiry !== null && daysToExpiry < 0
                      ? "Limitation period may have expired — urgent advice required."
                      : daysToExpiry !== null && daysToExpiry <= 180
                        ? "Limitation expiry within 6 months — confirm proceedings or protective steps."
                        : "Review accrual date, discovery issues, and scheme-specific deadlines."}
                  </Callout>
                  <Text size="small" tone="tertiary">
                    Expiry, accrual, and discovery dates sync to the Calendar automatically when you update this section.
                  </Text>
                  <Grid columns={3} gap={12}>
                    <Stack gap={4}>
                      <FieldLabel>Jurisdiction</FieldLabel>
                      <Select
                        value={solCheck.jurisdiction}
                        onChange={(v) => onSolChange(applySolPreset(solCheck, v, matter.claimType))}
                        options={[
                          { value: "VIC", label: "Victoria" },
                          { value: "NSW", label: "New South Wales" },
                          { value: "QLD", label: "Queensland" },
                          { value: "SA", label: "South Australia" },
                          { value: "WA", label: "Western Australia" },
                          { value: "TAS", label: "Tasmania" },
                          { value: "ACT", label: "ACT" },
                          { value: "NT", label: "Northern Territory" },
                        ]}
                      />
                    </Stack>
                    <Stack gap={4}>
                      <FieldLabel>Limitation period (years)</FieldLabel>
                      <TextInput
                        value={String(solCheck.limitationYears)}
                        onChange={(v) => updateSol({ limitationYears: parseFloat(v) || 3 })}
                        type="number"
                      />
                    </Stack>
                    <Stack gap={4}>
                      <FieldLabel>Accrual date (date of injury / cause of action)</FieldLabel>
                      <TextInput
                        value={solCheck.accrualDate}
                        onChange={(v) => updateSol({ accrualDate: v })}
                        placeholder="YYYY-MM-DD"
                      />
                    </Stack>
                  </Grid>
                  <Row gap={8} align="center">
                    <Checkbox
                      checked={solCheck.useDiscoveryDate}
                      onChange={(v) => updateSol({ useDiscoveryDate: v })}
                      label="Use date of discovery instead of accrual date"
                    />
                  </Row>
                  {solCheck.useDiscoveryDate && (
                    <Stack gap={4}>
                      <FieldLabel>Date of discovery</FieldLabel>
                      <TextInput
                        value={solCheck.discoveryDate}
                        onChange={(v) => updateSol({ discoveryDate: v })}
                        placeholder="YYYY-MM-DD"
                      />
                    </Stack>
                  )}
                  <Stack gap={4}>
                    <FieldLabel>Limitation notes & scheme-specific deadlines</FieldLabel>
                    <TextArea
                      value={solCheck.notes}
                      onChange={(v) => updateSol({ notes: v })}
                      rows={3}
                      placeholder="TAC election dates, impairment certificate, protective filing, s 23 extensions, etc."
                    />
                  </Stack>
                  {solCheck.verified && solCheck.verifiedDate && (
                    <Text size="small" tone="tertiary">Verified on {formatDate(solCheck.verifiedDate)}</Text>
                  )}
                </Stack>
              </CardBody>
            </Card>
          </Stack>
        )}
      </Stack>

      <Stack gap={10}>
        <CollapsibleHeading
          title="Parties to the matter"
          open={partiesOpen}
          onToggle={() => setPartiesOpen(!partiesOpen)}
          trailing={`${matterParties.length} parties · ${pursueYes} to pursue`}
        />
        {partiesOpen && (
        <Stack gap={12}>
          <Grid columns={3} gap={12}>
            <Stat value={String(matterParties.length)} label="Parties identified" />
            <Stat value={String(pursueYes)} label="To pursue" tone="success" />
            <Stat value={String(pursueReview)} label="Under review" tone={pursueReview > 0 ? "warning" : undefined} />
          </Grid>

          <Row gap={8}>
            <AsherOutlineButton onClick={() => setShowAddParty(!showAddParty)}>
              {showAddParty ? "Close form" : "Add party"}
            </AsherOutlineButton>
          </Row>

          {showAddParty && (
            <Card>
              <CardHeader>Identify party</CardHeader>
              <CardBody>
                <Stack gap={12}>
                  <Grid columns={2} gap={12}>
                    <Stack gap={4}>
                      <FieldLabel>Party name</FieldLabel>
                      <TextInput value={newPartyName} onChange={setNewPartyName} placeholder="Individual, company, authority" />
                    </Stack>
                    <Stack gap={4}>
                      <FieldLabel>Role</FieldLabel>
                      <Select
                        value={newPartyRole}
                        onChange={setNewPartyRole}
                        options={[
                          { value: "defendant", label: "Defendant" },
                          { value: "third_party", label: "Third party" },
                          { value: "employer", label: "Employer" },
                          { value: "insurer", label: "Insurer" },
                          { value: "other", label: "Other" },
                        ]}
                      />
                    </Stack>
                  </Grid>
                  <AsherOutlineButton onClick={addParty}>Add party</AsherOutlineButton>
                </Stack>
              </CardBody>
            </Card>
          )}

          <Table
            headers={["Party", "Role", "Relationship to incident", "Pursue?", "Rationale", ""]}
            rows={matterParties.map((p) => [
              p.name,
              partyRoleLabel(p.role),
              p.relationship || "—",
              <Select
                value={p.pursue}
                onChange={(v) => updateParty(p.id, { pursue: v as PursueDecision })}
                options={[
                  { value: "yes", label: "Pursue" },
                  { value: "under_review", label: "Under review" },
                  { value: "no", label: "Do not pursue" },
                ]}
              />,
              p.pursueRationale || "—",
              <IconButton title="Remove" onClick={() => removeParty(p.id)}>×</IconButton>,
            ])}
            rowTone={matterParties.map((p) => pursueTone(p.pursue))}
            striped
            stickyHeader
          />

          {matterParties.map((p) => (
            <div key={p.id}>
              <CollapsibleSection
                title={p.name}
                trailing={<Text size="small" tone="tertiary">{pursueLabel(p.pursue)}</Text>}
                defaultOpen={p.pursue === "under_review"}
              >
                <Stack gap={8}>
                  <Grid columns={2} gap={12}>
                    <Stack gap={4}>
                      <FieldLabel>Relationship to incident</FieldLabel>
                      <TextArea
                        value={p.relationship}
                        onChange={(v) => updateParty(p.id, { relationship: v })}
                        rows={2}
                      />
                    </Stack>
                    <Stack gap={4}>
                      <FieldLabel>Liability assessment</FieldLabel>
                      <TextArea
                        value={p.liabilityNotes}
                        onChange={(v) => updateParty(p.id, { liabilityNotes: v })}
                        rows={2}
                      />
                    </Stack>
                  </Grid>
                  <Stack gap={4}>
                    <FieldLabel>Worth pursuing — rationale</FieldLabel>
                    <TextArea
                      value={p.pursueRationale}
                      onChange={(v) => updateParty(p.id, { pursueRationale: v })}
                      rows={2}
                      placeholder="Recovery prospects, insurance, costs, vicarious liability, limitation..."
                    />
                  </Stack>
                </Stack>
              </CollapsibleSection>
            </div>
          ))}
        </Stack>
        )}
      </Stack>

      <Divider />

      <Row gap={12} align="center" wrap>
        <H2 style={{ margin: 0 }}>Medical chronology</H2>
        <Spacer />
        <ExportDocPdfButtons
          baseFilename={`${matter.matterNumber}-medical-chronology`}
          title={`Medical Chronology — ${matter.clientName}`}
          buildDocHtml={() => buildChronologyDocHtml(matter, matterEntries)}
          buildPdfLines={() => buildChronologyPdfLines(matter, matterEntries)}
        />
      </Row>
      <Text size="small" tone="tertiary">
        Document every relevant treatment, investigation, and opinion relating to the injury.
      </Text>

      <Row gap={8}>
        <AsherOutlineButton onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? "Close form" : "Add event"}
        </AsherOutlineButton>
        <Text size="small" tone="tertiary">{matterEntries.length} events recorded</Text>
      </Row>

      {showAdd && (
        <Card>
          <CardHeader>Add chronology entry</CardHeader>
          <CardBody>
            <Stack gap={12}>
              <Grid columns={3} gap={12}>
                <Stack gap={4}>
                  <FieldLabel>Date</FieldLabel>
                  <TextInput value={newDate} onChange={setNewDate} placeholder="YYYY-MM-DD" />
                </Stack>
                <Stack gap={4}>
                  <FieldLabel>Provider</FieldLabel>
                  <TextInput value={newProvider} onChange={setNewProvider} placeholder="Treating clinician / facility" />
                </Stack>
                <Stack gap={4}>
                  <FieldLabel>Event type</FieldLabel>
                  <Select
                    value={newType}
                    onChange={setNewType}
                    options={[
                      { value: "Presentation", label: "Presentation" },
                      { value: "Review", label: "Review" },
                      { value: "Treatment", label: "Treatment" },
                      { value: "Investigation", label: "Investigation" },
                      { value: "Procedure", label: "Procedure" },
                      { value: "Specialist review", label: "Specialist review" },
                      { value: "Independent examination", label: "Independent examination" },
                      { value: "Certificate", label: "Certificate / capacity" },
                    ]}
                  />
                </Stack>
              </Grid>
              <Stack gap={4}>
                <FieldLabel>Description</FieldLabel>
                <TextArea value={newDesc} onChange={setNewDesc} rows={3} placeholder="Clinical findings, treatment provided, diagnoses" />
              </Stack>
              <Stack gap={4}>
                <FieldLabel>Source reference</FieldLabel>
                <TextInput value={newRef} onChange={setNewRef} placeholder="e.g. GP notes p.4, MRI report dated..." />
              </Stack>
              <AsherOutlineButton onClick={addEntry}>Add to chronology</AsherOutlineButton>
            </Stack>
          </CardBody>
        </Card>
      )}

      <Table
        headers={["Date", "Provider", "Type", "Description", "Source", "Rel.", ""]}
        rows={matterEntries.map((e) => [
          formatDate(e.date),
          e.provider,
          e.eventType,
          e.description,
          e.sourceRef,
          <Select
            value={e.relevance}
            onChange={(v) => updateEntry(e.id, { relevance: v as ChronologyEntry["relevance"] })}
            options={[
              { value: "high", label: "High" },
              { value: "medium", label: "Medium" },
              { value: "low", label: "Low" },
            ]}
          />,
          <IconButton title="Remove" onClick={() => removeEntry(e.id)}>×</IconButton>,
        ])}
        rowTone={matterEntries.map((e) => relevanceTone(e.relevance))}
        striped
        stickyHeader
      />
    </Stack>
  );
}

// ── Letter of instruction tab ────────────────────────────────────────────────

function AdviceTab({
  matter,
  letter,
  onChange,
  deadlines,
}: {
  matter: Matter;
  letter: LetterOfInstruction;
  onChange: (l: LetterOfInstruction) => void;
  deadlines: Deadline[];
}) {
  const update = (patch: Partial<LetterOfInstruction>) => onChange({ ...letter, ...patch });
  const [workDeadlineId, setWorkDeadlineId] = useCanvasState(`deadline-work-active-${matter.id}`, "");
  const [workHint, setWorkHint] = useCanvasState(`deadline-work-hint-${matter.id}`, "");

  const sections: { key: keyof LetterOfInstruction; label: string; hint: string; rows: number }[] = [
    {
      key: "injuryOverview",
      label: "Injury overview",
      hint: "Brief neutral snapshot of the injury, treatment to date, and current functional status.",
      rows: 3,
    },
    {
      key: "executiveSummary",
      label: "Executive Summary",
      hint: "Concise overview of the claim, key events, and the client's current presentation.",
      rows: 5,
    },
    {
      key: "chronologyNarrative",
      label: "Chronology of Significant Events",
      hint: "Date-ordered narrative paragraphs summarising clinically significant events from the records.",
      rows: 10,
    },
    {
      key: "summary",
      label: "Summary",
      hint: "Synthesis of findings, objective evidence, and outstanding issues before requesting expert opinion.",
      rows: 6,
    },
    {
      key: "questionsForExpert",
      label: "Questions for the expert",
      hint: "Bullet list of specific matters on which opinion is sought. Export adds: We would be most grateful for your opinion on the following issues:",
      rows: 6,
    },
  ];

  return (
    <Stack gap={16}>
      {workDeadlineId && (
        <DeadlineWorkBanner
          deadlineId={workDeadlineId}
          deadlines={deadlines}
          hint={workHint}
          onDismiss={() => {
            setWorkDeadlineId("");
            setWorkHint("");
          }}
        />
      )}

      <Callout tone="info" title="Letter of instruction">
        Expert brief pack — letter of instruction template with branded heading, injury overview, executive summary, narrative chronology, summary, and questions for the expert.
      </Callout>

      <Row gap={8} align="center" wrap>
        <ExportDocPdfButtons
          baseFilename={`${matter.matterNumber}-letter-of-instruction`}
          title={`Letter of Instruction — ${matter.clientName}`}
          buildDocHtml={() => buildInstructionDocHtml(matter, letter)}
          buildPdfLines={() => buildInstructionPdfLines(matter, letter)}
        />
      </Row>

      <Card>
        <CardHeader>Heading</CardHeader>
        <CardBody>
          <Stack gap={12}>
            <Grid columns={2} gap={12}>
              <Stack gap={4}>
                <FieldLabel>Ref</FieldLabel>
                <Text>{matter.matterNumber}</Text>
              </Stack>
              <Stack gap={4}>
                <FieldLabel>Prepared For</FieldLabel>
                <TextInput
                  value={letter.preparedFor}
                  onChange={(v) => update({ preparedFor: v })}
                  placeholder="Expert Physician"
                />
              </Stack>
              <Stack gap={4}>
                <FieldLabel>Prepared By</FieldLabel>
                <Text>{LOI_BRAND.preparedBy}</Text>
              </Stack>
              <Stack gap={4}>
                <FieldLabel>Date</FieldLabel>
                <Text>{formatDate(todayIso())}</Text>
              </Stack>
              <Stack gap={4}>
                <FieldLabel>Plaintiff Name</FieldLabel>
                <Text>{matter.clientName}</Text>
              </Stack>
              <Stack gap={4}>
                <FieldLabel>DOB</FieldLabel>
                <Text>{formatDate(matter.clientDOB)}</Text>
              </Stack>
            </Grid>
          </Stack>
        </CardBody>
      </Card>

      {sections.map((s) => (
        <div key={String(s.key)}>
          <CollapsibleSection
            title={s.label}
            defaultOpen={s.key === "executiveSummary" || s.key === "questionsForExpert"}
          >
            <Stack gap={4}>
              <Text size="small" tone="tertiary" italic>
                {s.hint}
              </Text>
              <TextArea
                value={letter[s.key] as string}
                onChange={(v) => update({ [s.key]: v })}
                rows={s.rows}
              />
            </Stack>
          </CollapsibleSection>
        </div>
      ))}
    </Stack>
  );
}

// ── Billing tab ──────────────────────────────────────────────────────────────

function BillingTab({
  matter,
  entries,
  onChange,
  invoices,
  onInvoicesChange,
  defaultRate,
}: {
  matter: Matter;
  entries: TimeEntry[];
  onChange: (e: TimeEntry[]) => void;
  invoices: Invoice[];
  onInvoicesChange: (invoices: Invoice[]) => void;
  defaultRate: number;
}) {
  const matterId = matter.id;
  const matterEntries = entries.filter((e) => e.matterId === matterId);
  const matterInvoices = invoices
    .filter((inv) => inv.matterId === matterId)
    .sort((a, b) => b.date.localeCompare(a.date));

  const unbilledEntries = matterEntries.filter((e) => entryBillingStatus(e) === "unbilled");
  const unbilledHours = unbilledEntries.reduce((s, e) => s + e.hours, 0);
  const unbilledFees = unbilledEntries.reduce((s, e) => s + e.hours * e.rate, 0);
  const totalHours = matterEntries.reduce((s, e) => s + e.hours, 0);
  const totalFees = matterEntries.reduce((s, e) => s + e.hours * e.rate, 0);
  const paidFees = matterEntries
    .filter((e) => entryBillingStatus(e) === "paid")
    .reduce((s, e) => s + e.hours * e.rate, 0);

  const [desc, setDesc] = useCanvasState(`time-desc-${matterId}`, "");
  const [hours, setHours] = useCanvasState(`time-hours-${matterId}`, "");
  const [rate, setRate] = useCanvasState(`time-rate-${matterId}`, String(defaultRate));
  const [category, setCategory] = useCanvasState(`time-cat-${matterId}`, "Analysis");
  const [timerRunning, setTimerRunning] = useCanvasState(`timer-running-${matterId}`, false);
  const [timerStart, setTimerStart] = useCanvasState(`timer-start-${matterId}`, 0);
  const [timerDesc, setTimerDesc] = useCanvasState(`timer-desc-${matterId}`, "");

  const updateEntry = (id: string, patch: Partial<TimeEntry>) => {
    onChange(entries.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };

  const addEntry = () => {
    const h = parseFloat(hours);
    const r = parseFloat(rate);
    if (!desc.trim() || isNaN(h) || h <= 0) return;
    const entry: TimeEntry = {
      id: uid("t"),
      matterId,
      date: todayIso(),
      description: desc.trim(),
      hours: h,
      rate: isNaN(r) ? defaultRate : r,
      category,
      billingStatus: "unbilled",
      invoiceId: "",
      followUpDate: "",
    };
    onChange([...entries, entry]);
    setDesc("");
    setHours("");
  };

  const toggleTimer = () => {
    if (timerRunning) {
      const elapsed = (Date.now() - timerStart) / 3600000;
      if (elapsed > 0.01) {
        const entry: TimeEntry = {
          id: uid("t"),
          matterId,
          date: todayIso(),
          description: timerDesc.trim() || "Timed work session",
          hours: Math.round(elapsed * 100) / 100,
          rate: parseFloat(rate) || defaultRate,
          category,
          billingStatus: "unbilled",
          invoiceId: "",
          followUpDate: "",
        };
        onChange([...entries, entry]);
      }
      setTimerRunning(false);
      setTimerDesc("");
    } else {
      setTimerStart(Date.now());
      setTimerRunning(true);
    }
  };

  const removeEntry = (id: string) => {
    onChange(entries.filter((e) => e.id !== id));
  };

  const createInvoice = () => {
    if (unbilledEntries.length === 0) return;
    const invId = uid("inv");
    const total = unbilledEntries.reduce((s, e) => s + e.hours * e.rate, 0);
    const issued = todayIso();
    const invoice: Invoice = {
      id: invId,
      matterId,
      invoiceNumber: nextInvoiceNumber(invoices),
      date: issued,
      dueDate: addDaysIso(issued, 30),
      entryIds: unbilledEntries.map((e) => e.id),
      total,
      status: "draft",
      followUpDate: "",
      notes: "",
      billedToName: "",
      billedToAddress: "",
      billedToPhone: "",
    };
    onInvoicesChange([...invoices, invoice]);
    onChange(
      entries.map((e) =>
        unbilledEntries.some((u) => u.id === e.id)
          ? { ...e, billingStatus: "invoiced" as BillingStatus, invoiceId: invId }
          : e,
      ),
    );
  };

  const updateInvoice = (id: string, patch: Partial<Invoice>) => {
    const updated = invoices.map((inv) => (inv.id === id ? { ...inv, ...patch } : inv));
    onInvoicesChange(updated);
    const inv = updated.find((i) => i.id === id);
    if (inv && patch.status) {
      const entryStatus = billingStatusFromInvoice(patch.status);
      onChange(
        entries.map((e) => (e.invoiceId === id ? { ...e, billingStatus: entryStatus } : e)),
      );
    }
  };

  const byCategory = matterEntries.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.hours;
    return acc;
  }, {});

  const billingStatusOptions: { value: BillingStatus; label: string }[] = [
    { value: "unbilled", label: "Unbilled" },
    { value: "invoiced", label: "Invoiced" },
    { value: "invoice_sent", label: "Invoice sent" },
    { value: "paid", label: "Paid" },
    { value: "written_off", label: "Written off" },
  ];

  const invoiceStatusOptions: { value: InvoiceStatus; label: string }[] = [
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
    { value: "paid", label: "Paid" },
    { value: "overdue", label: "Overdue" },
    { value: "written_off", label: "Written off" },
  ];

  return (
    <Stack gap={16}>
      <Grid columns={4} gap={12}>
        <Stat value={totalHours.toFixed(1)} label="Total hours" />
        <Stat value={formatCurrency(totalFees)} label="Total fees" tone="info" />
        <Stat value={formatCurrency(unbilledFees)} label="Unbilled" tone="warning" />
        <Stat value={formatCurrency(paidFees)} label="Paid" tone="success" />
      </Grid>

      <Card>
        <CardHeader
          trailing={
            <AsherOutlineButton
              onClick={createInvoice}
              disabled={unbilledEntries.length === 0}
            >
              {`Create invoice (${unbilledEntries.length} entries · ${unbilledHours.toFixed(1)} hrs)`}
            </AsherOutlineButton>
          }
        >
          Invoicing
        </CardHeader>
        <CardBody>
          <Callout tone="info">
            Bundle all unbilled time entries into a draft invoice. Export uses the standard invoice layout — Invoice / No ###, billed to, from, line items, and payment details.
          </Callout>
          {matterInvoices.length > 0 && (
            <Stack gap={16}>
              <Stack gap={10}>
                <Text size="small" weight="semibold">Export latest invoice</Text>
                <ExportDocPdfButtons
                  baseFilename={`${matter.matterNumber}-${matterInvoices[0].invoiceNumber}`}
                  title={`Invoice ${matterInvoices[0].invoiceNumber} — ${matter.clientName}`}
                  buildDocHtml={() => buildInvoiceDocHtml(matter, matterInvoices[0], entries)}
                  buildPdfLines={() => buildInvoicePdfLines(matter, matterInvoices[0], entries)}
                />
              </Stack>
              <Card>
                <CardHeader>Billed to — latest invoice</CardHeader>
                <CardBody>
                  <Grid columns={2} gap={12}>
                    <Stack gap={4}>
                      <FieldLabel>Firm name</FieldLabel>
                      <TextInput
                        value={matterInvoices[0].billedToName}
                        onChange={(v) => updateInvoice(matterInvoices[0].id, { billedToName: v })}
                        placeholder="Firm Name"
                      />
                    </Stack>
                    <Stack gap={4}>
                      <FieldLabel>Phone</FieldLabel>
                      <TextInput
                        value={matterInvoices[0].billedToPhone}
                        onChange={(v) => updateInvoice(matterInvoices[0].id, { billedToPhone: v })}
                        placeholder="Phone number"
                      />
                    </Stack>
                  </Grid>
                  <Stack gap={4} style={{ marginTop: 12 }}>
                    <FieldLabel>Address</FieldLabel>
                    <TextArea
                      value={matterInvoices[0].billedToAddress}
                      onChange={(v) => updateInvoice(matterInvoices[0].id, { billedToAddress: v })}
                      rows={3}
                      placeholder="Address lines"
                    />
                  </Stack>
                </CardBody>
              </Card>
            </Stack>
          )}
          {matterInvoices.length === 0 ? (
            <Text tone="tertiary">No invoices yet for this matter.</Text>
          ) : (
            <Table
              headers={["Invoice #", "Date", "Due", "Amount", "Status", "Follow-up", "Entries", "Export", "Notes"]}
              rows={matterInvoices.map((inv) => [
                inv.invoiceNumber,
                formatDate(inv.date),
                formatDate(inv.dueDate),
                formatCurrency(inv.total),
                <Select
                  value={inv.status}
                  onChange={(v) => updateInvoice(inv.id, { status: v as InvoiceStatus })}
                  options={invoiceStatusOptions}
                />,
                <TextInput
                  value={inv.followUpDate}
                  onChange={(v) => {
                    updateInvoice(inv.id, { followUpDate: v });
                    onChange(
                      entries.map((e) =>
                        e.invoiceId === inv.id ? { ...e, followUpDate: v } : e,
                      ),
                    );
                  }}
                  placeholder="YYYY-MM-DD"
                />,
                String(inv.entryIds.length),
                <AsherOutlineButton
                  onClick={() =>
                    exportAsDoc(
                      `${matter.matterNumber}-${inv.invoiceNumber}`,
                      `Invoice ${inv.invoiceNumber} — ${matter.clientName}`,
                      buildInvoiceDocHtml(matter, inv, entries),
                    )
                  }
                >
                  .doc
                </AsherOutlineButton>,
                <TextInput
                  value={inv.notes}
                  onChange={(v) => updateInvoice(inv.id, { notes: v })}
                  placeholder="Notes"
                />,
              ])}
              striped
              stickyHeader
            />
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader trailing={timerRunning ? <Pill active size="sm">Recording</Pill> : undefined}>
          Log time
        </CardHeader>
        <CardBody>
          <Stack gap={12}>
            <Grid columns={2} gap={12}>
              <Stack gap={4}>
                <FieldLabel>Description</FieldLabel>
                <TextInput value={desc} onChange={setDesc} placeholder="Work performed" />
              </Stack>
              <Stack gap={4}>
                <FieldLabel>Category</FieldLabel>
                <Select
                  value={category}
                  onChange={setCategory}
                  options={[
                    { value: "Conference", label: "Conference" },
                    { value: "Correspondence", label: "Correspondence" },
                    { value: "Analysis", label: "Analysis / review" },
                    { value: "Drafting", label: "Drafting" },
                    { value: "Research", label: "Research" },
                    { value: "Court", label: "Court / hearing" },
                  ]}
                />
              </Stack>
            </Grid>
            <Grid columns={3} gap={12}>
              <Stack gap={4}>
                <FieldLabel>Hours</FieldLabel>
                <TextInput value={hours} onChange={setHours} type="number" placeholder="0.0" />
              </Stack>
              <Stack gap={4}>
                <FieldLabel>Rate ($/hr)</FieldLabel>
                <TextInput value={rate} onChange={setRate} type="number" placeholder="450" />
              </Stack>
              <Row align="end" style={{ paddingBottom: 2 }}>
                <AsherOutlineButton onClick={addEntry}>Add entry</AsherOutlineButton>
              </Row>
            </Grid>
            <Divider />
            <Row gap={8} align="center">
              <Stack gap={4} style={{ flex: 1 }}>
                <FieldLabel>Timer — describe work before starting</FieldLabel>
                <TextInput value={timerDesc} onChange={setTimerDesc} placeholder="e.g. Reviewing hospital records" disabled={timerRunning} />
              </Stack>
              <AsherOutlineButton accent={!timerRunning} onClick={toggleTimer}>
                {timerRunning ? "Stop and save" : "Start timer"}
              </AsherOutlineButton>
            </Row>
          </Stack>
        </CardBody>
      </Card>

      {Object.keys(byCategory).length > 0 && (
        <>
          <H3>Hours by category</H3>
          <Grid columns={Math.min(Object.keys(byCategory).length, 4)} gap={8}>
            {Object.entries(byCategory).map(([cat, hrs]) => (
              <div key={cat}>
                <Stat value={hrs.toFixed(1)} label={cat} />
              </div>
            ))}
          </Grid>
        </>
      )}

      <H2>Time entries</H2>
      <Table
        headers={["Date", "Description", "Category", "Hours", "Rate", "Amount", "Status", "Follow-up", "Invoice", ""]}
        rows={matterEntries
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((e) => {
            const linkedInvoice = e.invoiceId
              ? matterInvoices.find((inv) => inv.id === e.invoiceId)
              : undefined;
            return [
              formatDate(e.date),
              e.description,
              e.category,
              e.hours.toFixed(2),
              formatCurrency(e.rate),
              formatCurrency(e.hours * e.rate),
              <Select
                value={entryBillingStatus(e)}
                onChange={(v) => updateEntry(e.id, { billingStatus: v as BillingStatus })}
                options={billingStatusOptions}
              />,
              <TextInput
                value={e.followUpDate ?? ""}
                onChange={(v) => updateEntry(e.id, { followUpDate: v })}
                placeholder="YYYY-MM-DD"
              />,
              linkedInvoice?.invoiceNumber ?? "—",
              <IconButton title="Remove" onClick={() => removeEntry(e.id)}>×</IconButton>,
            ];
          })}
        columnAlign={["left", "left", "left", "right", "right", "right", "left", "left", "left", "center"]}
        striped
        stickyHeader
      />
    </Stack>
  );
}

function greetingForHour(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const HOME_SEARCH_QUOTES = [
  "Search by client name or matter number",
  "Find matters with deadlines this week",
  "Look up a file by defendant or claim type",
  "Search progress notes and matter summaries",
  "Locate files awaiting records or expert reports",
  "Find matters by responsible solicitor",
  "Filter by injury type, status, or stage",
  "Search billing, invoices, or hours logged",
  "Find matters with overdue tasks",
  "Look up packet received or returned dates",
  "Open a file from the matter register",
  "Search correspondence or calendar entries",
];

function pickHomeQuoteIndex(): number {
  return Math.floor(Math.random() * HOME_SEARCH_QUOTES.length);
}

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function matterCalendarSnapshot(matterId: string, deadlines: Deadline[]) {
  return mattersCalendarSnapshot([matterId], deadlines);
}

function mattersCalendarSnapshot(matterIds: string[], deadlines: Deadline[]) {
  const idSet = new Set(matterIds);
  const today = todayIso();
  const matterPending = deadlines
    .filter((d) => idSet.has(d.matterId) && d.status === "pending")
    .sort((a, b) => a.date.localeCompare(b.date));
  const dueToday = matterPending.filter((d) => d.date === today);
  const overdue = matterPending.filter((d) => d.date < today);
  const nextUp = matterPending.find((d) => d.date > today);
  const pendingByDate = matterPending.reduce<Record<string, number>>((acc, d) => {
    acc[d.date] = (acc[d.date] ?? 0) + 1;
    return acc;
  }, {});
  const weekStart = startOfWeekIso(today);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDaysIso(weekStart, i));
  return { today, matterPending, dueToday, overdue, nextUp, pendingByDate, weekDays };
}

interface DayWorkBlock {
  deadlineId: string;
  title: string;
  hours: number;
  startHour: number;
  endHour: number;
}

function defaultDeadlines(): Deadline[] {
  const today = todayIso();
  return DEFAULT_DEADLINES.map((d) => (d.id === "dl-3" ? { ...d, date: today } : d));
}

function deadlineSchedulePriority(dl: Deadline): number {
  const t = dl.title.toLowerCase();
  if (t.includes("further") && t.includes("particulars")) return 100;
  if (t.includes("reply") || t.includes("response")) return 80;
  if (dl.type === "court_filing") return 70;
  if (t.includes("brief") || t.includes("letter of advice")) return 60;
  if (dl.type === "discovery") return 50;
  if (dl.type === "hearing") return 40;
  return 30;
}

function deadlineBlockHours(dl: Deadline): number {
  const t = dl.title.toLowerCase();
  if (dl.type === "hearing") return 1.5;
  if (t.includes("particulars") || t.includes("chronology")) return 2;
  if (t.includes("discovery") || t.includes("affidavit")) return 3;
  if (dl.type === "court_filing") return 2.5;
  if (dl.type === "party_response") return 2;
  if (dl.type === "discovery") return 3;
  return 1.5;
}

function scheduleBlockTitle(dl: Deadline, matter: Matter | undefined): string {
  const last = matter ? clientLastName(matter.clientName) : "";
  const title = dl.title;
  const lower = title.toLowerCase();
  if (lower.startsWith("reply") || lower.startsWith("response") || lower.startsWith("brief")) {
    const phrase = `${title.charAt(0).toLowerCase()}${title.slice(1)}`;
    return last ? `Work on ${last} ${phrase}` : `Work on ${phrase}`;
  }
  return last ? `Work on ${last} — ${title}` : `Work on ${title}`;
}

function formatScheduleHours(hours: number): string {
  return hours === 1 ? "1 hour" : `${hours} hours`;
}

function formatBlockTimeRange(startHour: number, endHour: number): string {
  const fmt = (h: number) => {
    const hrs = Math.floor(h);
    const mins = Math.round((h - hrs) * 60);
    if (mins === 0) return String(hrs);
    return `${hrs}:${String(mins).padStart(2, "0")}`;
  };
  return `${fmt(startHour)}–${fmt(endHour)}`;
}

function buildDayBlockSchedule(deadlines: Deadline[], matters: Matter[]): DayWorkBlock[] {
  const workStart = 9;
  const lunchStart = 12;
  const lunchEnd = 13;
  const workEnd = 17;
  const blockGap = 0.25;

  const items = [...deadlines]
    .filter((d) => d.status === "pending" && d.type !== "hearing")
    .sort((a, b) => deadlineSchedulePriority(b) - deadlineSchedulePriority(a));

  const blocks: DayWorkBlock[] = [];
  let cursor = workStart;

  for (const dl of items) {
    const hours = deadlineBlockHours(dl);
    if (cursor < lunchStart && cursor + hours > lunchStart) {
      cursor = lunchEnd;
    }
    if (cursor + hours > workEnd) break;

    const matter = matters.find((m) => m.id === dl.matterId);
    blocks.push({
      deadlineId: dl.id,
      title: scheduleBlockTitle(dl, matter),
      hours,
      startHour: cursor,
      endHour: cursor + hours,
    });
    cursor += hours + blockGap;
  }

  return blocks;
}

function DayBlockSchedule({
  blocks,
  compact,
  onOpenDeadline,
  deadlines,
}: {
  blocks: DayWorkBlock[];
  compact?: boolean;
  deadlines: Deadline[];
  onOpenDeadline?: (deadline: Deadline) => void;
}) {
  const theme = useHostTheme();
  if (blocks.length === 0) return null;

  return (
    <Stack gap={compact ? 4 : 6}>
      <Text size="small" weight="semibold" tone={compact ? "tertiary" : undefined}>
        {compact ? "SCHEDULE" : "Today's schedule"}
      </Text>
      {blocks.map((block) => {
        const dl = deadlines.find((d) => d.id === block.deadlineId);
        const clickable = Boolean(dl && onOpenDeadline);
        return (
          <div
            key={block.deadlineId}
            role={clickable ? "button" : undefined}
            tabIndex={clickable ? 0 : undefined}
            onClick={clickable ? () => onOpenDeadline!(dl!) : undefined}
            onKeyDown={
              clickable
                ? (e: { key: string }) => {
                    if (e.key === "Enter" || e.key === " ") onOpenDeadline!(dl!);
                  }
                : undefined
            }
            style={{
              padding: compact ? "6px 8px" : "8px 10px",
              borderRadius: 6,
              background: theme.fill.quaternary,
              borderLeft: `3px solid ${theme.accent.primary}`,
              cursor: clickable ? "pointer" : "default",
            }}
          >
            <Text size="small" weight="medium" truncate={compact}>
              {block.title}
            </Text>
            <Text size="small" tone="tertiary">
              {formatScheduleHours(block.hours)} · {formatBlockTimeRange(block.startHour, block.endHour)}
            </Text>
          </div>
        );
      })}
    </Stack>
  );
}

function WeekDayStrip({
  weekDays,
  today,
  pendingByDate,
  compact,
}: {
  weekDays: string[];
  today: string;
  pendingByDate: Record<string, number>;
  compact?: boolean;
}) {
  return (
    <Grid columns={7} gap={compact ? 2 : 4}>
      {weekDays.map((iso) => {
        const d = parseIsoDate(iso);
        const isToday = iso === today;
        const count = pendingByDate[iso] ?? 0;
        return (
          <div
            key={iso}
            style={{
              textAlign: "center",
              padding: compact ? "4px 2px" : "6px 4px",
              borderRadius: 0,
              background: isToday ? ASHER.coralSoft : ASHER.bg,
              border: `1px solid ${isToday ? ASHER.coral : ASHER.border}`,
            }}
          >
            <Text size="small" style={{ color: ASHER.nav, fontFamily: ASHER.fontMono }}>
              {compact ? WEEKDAY_LABELS[(d.getDay() + 6) % 7].slice(0, 1) : WEEKDAY_LABELS[(d.getDay() + 6) % 7]}
            </Text>
            <Text
              size="small"
              weight={isToday ? "semibold" : "normal"}
              style={{ color: isToday ? ASHER.navy : ASHER.text, fontFamily: ASHER.fontSerif }}
            >
              {d.getDate()}
            </Text>
            {!compact && count > 0 && (
              <Text size="small" style={{ color: ASHER.nav, fontFamily: ASHER.fontMono }}>{count}</Text>
            )}
            {compact && count > 0 && (
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: ASHER.coral,
                  margin: "2px auto 0",
                }}
              />
            )}
          </div>
        );
      })}
    </Grid>
  );
}

function UpcomingDeadlinesCompact({
  matters,
  matterId,
  deadlines,
  onOpenCalendar,
  onOpenDeadline,
}: {
  matters: Matter[];
  matterId?: string;
  deadlines: Deadline[];
  onOpenCalendar: () => void;
  onOpenDeadline: (deadline: Deadline) => void;
}) {
  const pending = deadlines
    .filter((d) => d.status === "pending" && (!matterId || d.matterId === matterId))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Card style={{ width: 200, flexShrink: 0 }}>
      <CardBody>
        <Stack gap={8}>
          <Row gap={4} align="center">
            <span style={asherSectionLabelStyle()}>Upcoming</span>
            <Spacer />
            {pending.length > 0 && <Pill size="sm" active>{pending.length}</Pill>}
          </Row>
          {pending.length === 0 ? (
            <Text size="small" tone="tertiary">No pending deadlines</Text>
          ) : (
            pending.slice(0, 8).map((dl) => {
              const days = daysUntil(dl.date);
              const daysLabel =
                days < 0 ? `${Math.abs(days)}d late` : days === 0 ? "Today" : `${days}d`;
              const workTab = workTabForDeadline(dl);
              return (
                <div key={dl.id}>
                  <Row gap={4} align="center">
                    <Swatch
                      color={deadlineSwatchColor(dl.type)}
                      style={{ width: 6, height: 6, borderRadius: 2, flexShrink: 0 }}
                    />
                    <Stack gap={0} style={{ minWidth: 0, flex: 1 }}>
                      <span
                        role="button"
                        tabIndex={0}
                        title={`Open draft in ${tabLabel(workTab)}`}
                        onClick={() => onOpenDeadline(dl)}
                        onKeyDown={(e: { key: string }) => {
                          if (e.key === "Enter" || e.key === " ") onOpenDeadline(dl);
                        }}
                        style={{
                          color: ASHER.navy,
                          cursor: "pointer",
                          textDecoration: "none",
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontSize: 12,
                          lineHeight: 1.4,
                        }}
                      >
                        {upcomingDeadlineLabel(dl, matters)}
                      </span>
                      <Text size="small" tone="tertiary">
                        {formatDate(dl.date)} · {daysLabel}
                      </Text>
                    </Stack>
                  </Row>
                </div>
              );
            })
          )}
          {pending.length > 8 && (
            <Text size="small" tone="tertiary">+{pending.length - 8} more</Text>
          )}
          <Button variant="ghost" onClick={onOpenCalendar} style={{ width: "100%" }}>
            Calendar
          </Button>
        </Stack>
      </CardBody>
    </Card>
  );
}

function TodayCalendarCompact({
  matterId,
  matters,
  deadlines,
  onOpenCalendar,
  onOpenDeadline,
}: {
  matterId: string;
  matters: Matter[];
  deadlines: Deadline[];
  onOpenCalendar: () => void;
  onOpenDeadline?: (deadline: Deadline) => void;
}) {
  const { today, dueToday, overdue, nextUp, pendingByDate, weekDays } = matterCalendarSnapshot(
    matterId,
    deadlines,
  );
  const todayDate = parseIsoDate(today);
  const dayBlocks = buildDayBlockSchedule(dueToday, matters);

  return (
    <Card style={{ width: 200, flexShrink: 0 }}>
      <CardBody>
        <Stack gap={8}>
          <Stack gap={2} style={{ alignItems: "center", textAlign: "center" }}>
            <Text size="small" tone="tertiary" weight="semibold">TODAY</Text>
            <Text weight="bold" style={{ fontSize: 28, lineHeight: 1 }}>
              {todayDate.getDate()}
            </Text>
            <Text size="small" tone="secondary">
              {todayDate.toLocaleDateString("en-AU", { month: "short", year: "numeric" })}
            </Text>
          </Stack>
          <WeekDayStrip weekDays={weekDays} today={today} pendingByDate={pendingByDate} compact />
          {dueToday.slice(0, 2).map((dl) => (
            <div key={dl.id}>
              <Text size="small" truncate>{dl.title}</Text>
            </div>
          ))}
          {dueToday.length === 0 && overdue.slice(0, 2).map((dl) => (
            <div key={dl.id}>
              <Text size="small" tone="tertiary" truncate>{dl.title}</Text>
            </div>
          ))}
          {dueToday.length === 0 && overdue.length === 0 && nextUp && (
            <Text size="small" tone="tertiary" truncate>
              Next: {formatDate(nextUp.date)}
            </Text>
          )}
          {dueToday.length === 0 && overdue.length === 0 && !nextUp && (
            <Text size="small" tone="tertiary">Clear day</Text>
          )}
          {dueToday.length > 0 && (
            <DayBlockSchedule
              blocks={dayBlocks}
              compact
              deadlines={deadlines}
              onOpenDeadline={onOpenDeadline}
            />
          )}
          <Row gap={4} justify="center" wrap>
            {dueToday.length > 0 && <Pill size="sm" active>{`${dueToday.length} due`}</Pill>}
            {overdue.length > 0 && <Pill size="sm">{`${overdue.length} late`}</Pill>}
          </Row>
          <Button variant="ghost" onClick={onOpenCalendar} style={{ width: "100%" }}>
            Calendar
          </Button>
        </Stack>
      </CardBody>
    </Card>
  );
}

function HomeCalendarPanel({
  matterIds,
  matters,
  deadlines,
  onOpenCalendar,
  onOpenDeadline,
}: {
  matterIds: string[];
  matters: Matter[];
  deadlines: Deadline[];
  onOpenCalendar: () => void;
  onOpenDeadline?: (deadline: Deadline) => void;
}) {
  const { today, dueToday, overdue, nextUp, pendingByDate, weekDays } = mattersCalendarSnapshot(
    matterIds,
    deadlines,
  );
  const todayDate = parseIsoDate(today);
  const dayName = todayDate.toLocaleDateString("en-AU", { weekday: "long" });
  const dayBlocks = buildDayBlockSchedule(dueToday, matters);

  return (
    <Card>
      <CardHeader trailing={<Button variant="ghost" onClick={onOpenCalendar}>Full calendar</Button>}>
        {dayName} · {formatDate(today)}
      </CardHeader>
      <CardBody>
        <Stack gap={12}>
          <WeekDayStrip weekDays={weekDays} today={today} pendingByDate={pendingByDate} />
          {dueToday.length > 0 && (
            <Stack gap={6}>
              <Text size="small" weight="semibold">Due today</Text>
              {dueToday.map((dl) => (
                <div key={dl.id}>
                  <Row gap={6} align="center">
                    <DeadlineColorDot type={dl.type} size={8} />
                    <Text size="small">{upcomingDeadlineLabel(dl, matters)}</Text>
                  </Row>
                </div>
              ))}
              <DayBlockSchedule
                blocks={dayBlocks}
                deadlines={deadlines}
                onOpenDeadline={onOpenDeadline}
              />
            </Stack>
          )}
          {overdue.length > 0 && (
            <Stack gap={6}>
              <Text size="small" weight="semibold" tone="tertiary">Overdue</Text>
              {overdue.slice(0, 4).map((dl) => (
                <div key={dl.id}>
                  <Text size="small">{upcomingDeadlineLabel(dl, matters)}</Text>
                  <Text size="small" tone="tertiary">{formatDate(dl.date)}</Text>
                </div>
              ))}
            </Stack>
          )}
          <Grid columns={3} gap={8}>
            <Stat value={String(dueToday.length)} label="Due today" tone={dueToday.length > 0 ? "warning" : undefined} />
            <Stat value={String(overdue.length)} label="Overdue" tone={overdue.length > 0 ? "danger" : undefined} />
            <Stat
              value={nextUp ? formatDate(nextUp.date) : "—"}
              label="Next deadline"
              tone="info"
            />
          </Grid>
        </Stack>
      </CardBody>
    </Card>
  );
}

function homeMatterMatchesSearch(m: Matter, query: string): boolean {
  if (!query.trim()) return true;
  const haystack = [
    m.matterNumber,
    m.clientName,
    m.defendantName,
    m.claimType,
    m.solicitor,
    m.matterSummary ?? "",
    m.progressNotes ?? "",
    m.notes,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.trim().toLowerCase());
}

function HomeTab({
  matters,
  deadlines,
  onNavigate,
  onOpenDeadline,
}: {
  matters: Matter[];
  deadlines: Deadline[];
  onNavigate: (tab: Tab) => void;
  onOpenDeadline: (deadline: Deadline) => void;
}) {
  return (
    <Stack gap={16}>
      <span style={asherSectionLabelStyle()}>Today</span>
      <Grid columns="minmax(0, 1fr) 200px" gap={16} style={{ width: "100%" }}>
        <HomeCalendarPanel
          matterIds={matters.map((m) => m.id)}
          matters={matters}
          deadlines={deadlines}
          onOpenCalendar={() => onNavigate("calendar")}
          onOpenDeadline={onOpenDeadline}
        />
        <UpcomingDeadlinesCompact
          matters={matters}
          deadlines={deadlines}
          onOpenCalendar={() => onNavigate("calendar")}
          onOpenDeadline={onOpenDeadline}
        />
      </Grid>
    </Stack>
  );
}

function MatterRegisterTab({
  matters,
  onMattersChange,
  onOpenMatter,
  tasks,
  deadlines,
  timeEntries,
  invoices,
}: {
  matters: Matter[];
  onMattersChange: (matters: Matter[]) => void;
  onOpenMatter: (matterId: string) => void;
  tasks: MatterTask[];
  deadlines: Deadline[];
  timeEntries: TimeEntry[];
  invoices: Invoice[];
}) {
  const theme = useHostTheme();
  const [searchQuery, setSearchQuery] = useCanvasState("home-matter-search", "");

  const updateMatter = (id: string, patch: Partial<Matter>) => {
    onMattersChange(matters.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  };

  const fileStatusOptions: { value: MatterFileStatus; label: string }[] = [
    { value: "received", label: "Received" },
    { value: "in_progress", label: "In progress" },
    { value: "complete", label: "Complete" },
  ];

  const visibleMatters = matters.filter((m) => homeMatterMatchesSearch(m, searchQuery));

  return (
    <Stack gap={16}>
      <TextInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search matters by number, client, defendant, or summary…"
        style={{ maxWidth: 480 }}
      />
      <Card>
        <CardHeader>Matter Database</CardHeader>
        <CardBody>
          <Table
            headers={[
              "Matter no.",
              "Client",
              "Packet received",
              "Packet returned",
              "Progress notes",
              "Next task due",
              "Summary",
              "Hours",
              "Status",
              "Invoice sent",
              "Invoice amount",
              "Invoice return",
            ]}
            rows={visibleMatters.map((m) => {
              const nextDue = nextDueForMatter(m.id, tasks, deadlines);
              const sentInvoice = latestSentInvoice(m.id, invoices);
              const invoiceSent = m.invoiceSentDate ?? sentInvoice?.date ?? "";
              const invoiceAmount =
                m.invoiceAmount ?? (sentInvoice ? String(sentInvoice.total) : "");
              const hours = totalHoursForMatter(m.id, timeEntries);

              return [
                <Button
                  variant="ghost"
                  onClick={() => onOpenMatter(m.id)}
                  style={{
                    color: theme.text.link,
                    padding: "0 4px",
                    minWidth: 0,
                  }}
                >
                  {m.matterNumber}
                </Button>,
                <TextInput
                  value={m.clientName}
                  onChange={(v) => updateMatter(m.id, { clientName: v })}
                />,
                <TextInput
                  value={m.packetReceivedDate ?? ""}
                  onChange={(v) => updateMatter(m.id, { packetReceivedDate: v })}
                  placeholder="YYYY-MM-DD"
                />,
                <TextInput
                  value={m.packetReturnedDate ?? ""}
                  onChange={(v) => updateMatter(m.id, { packetReturnedDate: v })}
                  placeholder="YYYY-MM-DD"
                />,
                <TextArea
                  value={matterRegisterProgressNotes(m)}
                  onChange={(v) => updateMatter(m.id, { progressNotes: v })}
                  rows={2}
                  placeholder="Last update — what we are awaiting…"
                />,
                nextDue ? (
                  <Stack gap={2}>
                    <Text size="small">{nextDue.title}</Text>
                    <Text size="small" tone="tertiary">{formatDate(nextDue.date)}</Text>
                  </Stack>
                ) : (
                  <Text size="small" tone="tertiary">—</Text>
                ),
                <TextArea
                  value={matterRegisterSummary(m)}
                  onChange={(v) => updateMatter(m.id, { matterSummary: v })}
                  rows={2}
                  placeholder="Brief matter summary…"
                />,
                hours.toFixed(1),
                <Select
                  value={matterFileStatus(m)}
                  onChange={(v) => updateMatter(m.id, { fileStatus: v as MatterFileStatus })}
                  options={fileStatusOptions}
                />,
                <TextInput
                  value={invoiceSent}
                  onChange={(v) => updateMatter(m.id, { invoiceSentDate: v })}
                  placeholder="YYYY-MM-DD"
                />,
                <TextInput
                  value={invoiceAmount}
                  onChange={(v) => updateMatter(m.id, { invoiceAmount: v })}
                  placeholder="0"
                />,
                <TextInput
                  value={m.invoiceReturnDate ?? ""}
                  onChange={(v) => updateMatter(m.id, { invoiceReturnDate: v })}
                  placeholder="YYYY-MM-DD"
                />,
              ];
            })}
            rowTone={visibleMatters.map((m) => registerRowTone(m))}
            striped
            stickyHeader
            emptyMessage={
              searchQuery.trim()
                ? "No matters match your search."
                : "No matters yet — create one to get started."
            }
          />
        </CardBody>
      </Card>
    </Stack>
  );
}

// ── Calendar tab ─────────────────────────────────────────────────────────────

function CalendarTab({
  matters,
  deadlines,
  onChange,
}: {
  matters: Matter[];
  deadlines: Deadline[];
  onChange: (d: Deadline[]) => void;
}) {
  const [filterMatterId, setFilterMatterId] = useCanvasState("calendar-filter-matter", "");
  const showAllMatters = filterMatterId === "";
  const matterIds = new Set(matters.map((m) => m.id));

  const scopedDeadlines = deadlines.filter((d) =>
    showAllMatters ? matterIds.has(d.matterId) : d.matterId === filterMatterId,
  );
  const pending = scopedDeadlines.filter((d) => d.status === "pending");

  const [viewYear, setViewYear] = useCanvasState("cal-year", 2026);
  const [viewMonth, setViewMonth] = useCanvasState("cal-month", 6);
  const [selectedDate, setSelectedDate] = useCanvasState("cal-selected", "2026-07-17");
  const [showAdd, setShowAdd] = useCanvasState("cal-add", false);
  const [newTitle, setNewTitle] = useCanvasState("cal-title", "");
  const [newDate, setNewDate] = useCanvasState("cal-date", "");
  const [newType, setNewType] = useCanvasState("cal-type", "court_filing");
  const [newParty, setNewParty] = useCanvasState("cal-party", "");
  const [newNotes, setNewNotes] = useCanvasState("cal-notes", "");
  const [newMatterId, setNewMatterId] = useCanvasState("cal-new-matter", matters[0]?.id ?? "");
  const [workDeadlineId, setWorkDeadlineId] = useCanvasState("deadline-work-active-calendar", "");
  const [workHint, setWorkHint] = useCanvasState("deadline-work-hint-calendar", "");

  const addTargetMatterId = showAllMatters ? newMatterId : filterMatterId;
  const matterFilterSelectStyle = {
    minWidth: 280,
    fontFamily: ASHER.fontMono,
    letterSpacing: "-0.045em",
    border: `1px solid ${ASHER.borderStrong}`,
    borderRadius: 0,
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const goToday = () => {
    const t = todayIso();
    const d = parseIsoDate(t);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
    setSelectedDate(t);
  };

  const updateDeadline = (id: string, patch: Partial<Deadline>) => {
    onChange(deadlines.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  };

  const removeDeadline = (id: string) => {
    onChange(deadlines.filter((d) => d.id !== id));
  };

  const addDeadline = () => {
    if (!newTitle.trim() || !newDate || !addTargetMatterId) return;
    const dl: Deadline = {
      id: uid("dl"),
      matterId: addTargetMatterId,
      date: newDate,
      title: newTitle.trim(),
      type: newType as DeadlineType,
      party: newParty.trim(),
      status: "pending",
      notes: newNotes.trim(),
    };
    onChange([...deadlines, dl]);
    setNewTitle("");
    setNewDate("");
    setNewParty("");
    setNewNotes("");
    setShowAdd(false);
    setSelectedDate(newDate);
    const d = parseIsoDate(newDate);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const overdueCount = pending.filter((d) => daysUntil(d.date) < 0).length;
  const weekCount = pending.filter((d) => {
    const days = daysUntil(d.date);
    return days >= 0 && days <= 7;
  }).length;

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startOffset = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const deadlinesByDate = pending.reduce<Record<string, Deadline[]>>((acc, d) => {
    if (!acc[d.date]) acc[d.date] = [];
    acc[d.date].push(d);
    return acc;
  }, {});

  const selectedDeadlines = scopedDeadlines.filter((d) => d.date === selectedDate);
  const upcoming = [...pending].sort((a, b) => a.date.localeCompare(b.date));

  const calendarCells = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - startOffset + 1;
    const inMonth = dayNum >= 1 && dayNum <= daysInMonth;
    const cellDate = inMonth ? isoFromParts(viewYear, viewMonth, dayNum) : "";
    const cellDeadlines = inMonth ? (deadlinesByDate[cellDate] ?? []) : [];
    const isToday = cellDate === todayIso();
    const isSelected = cellDate === selectedDate;

    calendarCells.push(
      <div
        key={`cell-${i}`}
        onClick={inMonth ? () => setSelectedDate(cellDate) : undefined}
        style={{
          minHeight: 72,
          padding: 6,
          border: `1px solid ${isToday || isSelected ? ASHER.coral : ASHER.border}`,
          background: isSelected ? ASHER.coralSoft : inMonth ? ASHER.bg : ASHER.muted,
          cursor: inMonth ? "pointer" : "default",
          opacity: inMonth ? 1 : 0.35,
        }}
      >
        {inMonth && (
          <Stack gap={4}>
            <Row gap={4} align="center">
              <Text
                size="small"
                weight={isToday ? "semibold" : "normal"}
                style={{
                  color: isToday ? ASHER.navy : ASHER.text,
                  fontFamily: ASHER.fontSerif,
                }}
              >
                {dayNum}
              </Text>
              {isToday && (
                <span
                  style={{
                    fontFamily: ASHER.fontMono,
                    fontSize: 10,
                    letterSpacing: "-0.045em",
                    color: ASHER.navy,
                    background: ASHER.coralSoft,
                    border: `1px solid ${ASHER.coral}`,
                    padding: "1px 5px",
                  }}
                >
                  Today
                </span>
              )}
            </Row>
            <Stack gap={2}>
              {cellDeadlines.slice(0, 3).map((dl) => (
                <div key={dl.id}>
                <Row gap={4} align="center">
                  <DeadlineColorDot type={dl.type} size={8} />
                  <Text
                    size="small"
                    truncate
                    style={{ color: ASHER.nav, fontFamily: ASHER.fontSerif }}
                  >
                    {showAllMatters ? upcomingDeadlineLabel(dl, matters) : dl.title}
                  </Text>
                </Row>
                </div>
              ))}
              {cellDeadlines.length > 3 && (
                <Text size="small" style={{ color: ASHER.nav, fontFamily: ASHER.fontMono }}>
                  +{cellDeadlines.length - 3} more
                </Text>
              )}
            </Stack>
          </Stack>
        )}
      </div>,
    );
  }

  return (
    <Stack gap={16}>
      {workDeadlineId && (
        <DeadlineWorkBanner
          deadlineId={workDeadlineId}
          deadlines={deadlines}
          hint={workHint}
          onDismiss={() => {
            setWorkDeadlineId("");
            setWorkHint("");
          }}
        />
      )}

      <Callout tone="neutral" title="Deadline calendar">
        <span style={{ color: ASHER.nav, fontFamily: ASHER.fontSerif }}>
          Track court filing dates, responses to other parties, hearings, and discovery deadlines. Overdue items appear in red; items due within 7 days in amber.
        </span>
      </Callout>

      <Row gap={8} align="center" wrap>
        <span style={{ ...asherSectionLabelStyle(), textDecoration: "none" }}>Show deadlines for</span>
        <Select
          value={filterMatterId}
          onChange={(id) => {
            setFilterMatterId(id);
            if (id) setNewMatterId(id);
          }}
          options={[
            { value: "", label: "All matters" },
            ...matters.map((m) => ({
              value: m.id,
              label: `${m.matterNumber} — ${m.clientName}`,
            })),
          ]}
          style={matterFilterSelectStyle}
        />
      </Row>

      <Row gap={8} align="center">
        <AsherOutlineButton accent emphasized onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? "Close form" : "Add deadline"}
        </AsherOutlineButton>
        <AsherOutlineButton onClick={goToday}>Go to today</AsherOutlineButton>
      </Row>

      {showAdd && (
        <Card>
          <CardHeader>New deadline</CardHeader>
          <CardBody>
            <Stack gap={12}>
              {showAllMatters && (
                <Stack gap={4}>
                  <FieldLabel>Matter</FieldLabel>
                  <Select
                    value={newMatterId}
                    onChange={setNewMatterId}
                    options={matters.map((m) => ({
                      value: m.id,
                      label: `${m.matterNumber} — ${m.clientName}`,
                    }))}
                    style={matterFilterSelectStyle}
                  />
                </Stack>
              )}
              <Grid columns={2} gap={12}>
                <Stack gap={4}>
                  <FieldLabel>Title</FieldLabel>
                  <TextInput value={newTitle} onChange={setNewTitle} placeholder="e.g. File chronology with court" />
                </Stack>
                <Stack gap={4}>
                  <FieldLabel>Due date</FieldLabel>
                  <TextInput value={newDate} onChange={setNewDate} placeholder="YYYY-MM-DD" />
                </Stack>
              </Grid>
              <Grid columns={2} gap={12}>
                <Stack gap={4}>
                  <FieldLabel>Type</FieldLabel>
                  <Select
                    value={newType}
                    onChange={setNewType}
                    options={[
                      { value: "court_filing", label: "Court filing" },
                      { value: "party_response", label: "Response to party" },
                      { value: "hearing", label: "Hearing" },
                      { value: "discovery", label: "Discovery" },
                      { value: "other", label: "Other" },
                    ]}
                  />
                </Stack>
                <Stack gap={4}>
                  <FieldLabel>Party / court</FieldLabel>
                  <TextInput value={newParty} onChange={setNewParty} placeholder="Recipient or court name" />
                </Stack>
              </Grid>
              <Stack gap={4}>
                <FieldLabel>Notes</FieldLabel>
                <TextArea value={newNotes} onChange={setNewNotes} rows={2} placeholder="Directions order reference, rule number, etc." />
              </Stack>
              <AsherOutlineButton onClick={addDeadline}>Save deadline</AsherOutlineButton>
            </Stack>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader
          trailing={
            <Row gap={4}>
              <AsherOutlineButton onClick={prevMonth}>Prev</AsherOutlineButton>
              <AsherOutlineButton onClick={nextMonth}>Next</AsherOutlineButton>
            </Row>
          }
        >
          <span style={asherHeadingStyle("h3")}>{monthLabel(viewYear, viewMonth)}</span>
        </CardHeader>
        <CardBody style={{ padding: 0, background: ASHER.bg }}>
          <Grid columns={7} gap={0}>
            {WEEKDAY_LABELS.map((label) => (
              <div
                key={label}
                style={{
                  padding: "8px 6px",
                  borderBottom: `1px solid ${ASHER.border}`,
                  background: ASHER.bg,
                }}
              >
                <Text
                  size="small"
                  weight="medium"
                  style={{ color: ASHER.nav, fontFamily: ASHER.fontMono, letterSpacing: "-0.045em" }}
                >
                  {label}
                </Text>
              </div>
            ))}
            {calendarCells}
          </Grid>
        </CardBody>
      </Card>

      <Row gap={12} align="start" wrap style={{ alignItems: "flex-start" }}>
        <Stack gap={8} style={{ flex: 1, minWidth: 280 }}>
          <H3 style={asherHeadingStyle("h3")}>{formatDate(selectedDate)}</H3>
          {selectedDeadlines.map((dl) => (
              <div key={dl.id}>
                <Card>
                  <CardHeader
                    trailing={
                      <Select
                        value={dl.status}
                        onChange={(v) => updateDeadline(dl.id, { status: v as DeadlineStatus })}
                        options={[
                          { value: "pending", label: "Pending" },
                          { value: "completed", label: "Completed" },
                        ]}
                        style={{ minWidth: 100 }}
                      />
                    }
                  >
                    {dl.title}
                  </CardHeader>
                  <CardBody>
                    <Stack gap={8}>
                      {showAllMatters && (
                        <Text size="small" style={{ color: ASHER.nav, fontFamily: ASHER.fontMono }}>
                          {matterShortLabel(dl.matterId, matters)}
                        </Text>
                      )}
                      <Row gap={6} align="center">
                        <DeadlineColorDot type={dl.type} />
                        <Text size="small" tone="secondary">{deadlineTypeLabel(dl.type)}</Text>
                        {dl.party && (
                          <Text size="small" tone="tertiary">· {dl.party}</Text>
                        )}
                      </Row>
                      {dl.status === "pending" && daysUntil(dl.date) < 0 && (
                        <Callout tone="danger" title="Overdue">
                          {Math.abs(daysUntil(dl.date))} days past due
                        </Callout>
                      )}
                      {dl.status === "pending" && daysUntil(dl.date) >= 0 && daysUntil(dl.date) <= 7 && (
                        <Callout tone="warning" title="Due soon">
                          {daysUntil(dl.date) === 0 ? "Due today" : `${daysUntil(dl.date)} days remaining`}
                        </Callout>
                      )}
                      {dl.notes && <Text size="small" tone="secondary">{dl.notes}</Text>}
                      <Row gap={8}>
                        <AsherOutlineButton onClick={() => removeDeadline(dl.id)}>Remove</AsherOutlineButton>
                      </Row>
                    </Stack>
                  </CardBody>
                </Card>
              </div>
            ))}
        </Stack>

        <Stack gap={8} style={{ flex: 1, minWidth: 280 }}>
          <span style={asherSectionLabelStyle()}>Legend</span>
          {(["court_filing", "party_response", "hearing", "discovery", "other"] as DeadlineType[]).map((t) => (
            <div key={t}>
            <Row gap={8} align="center">
              <DeadlineColorDot type={t} />
              <Text size="small" style={{ color: ASHER.nav, fontFamily: ASHER.fontSerif }}>
                {deadlineTypeLabel(t)}
              </Text>
            </Row>
            </div>
          ))}
        </Stack>
      </Row>

      <H2 style={asherHeadingStyle("h2")}>All upcoming deadlines</H2>
      <Table
        headers={
          showAllMatters
            ? ["Due date", "Matter", "Title", "Type", "Party", "Days", "Status", ""]
            : ["Due date", "Title", "Type", "Party", "Days", "Status", ""]
        }
        rows={upcoming.map((dl) => {
          const days = daysUntil(dl.date);
          const daysLabel =
            days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? "Today" : `${days}d`;
          const row = [
            formatDate(dl.date),
            ...(showAllMatters ? [matterShortLabel(dl.matterId, matters)] : []),
            dl.title,
            deadlineTypeLabel(dl.type),
            dl.party || "—",
            daysLabel,
            dl.status,
            <IconButton title="Remove" onClick={() => removeDeadline(dl.id)}>×</IconButton>,
          ];
          return row;
        })}
        rowTone={upcoming.map((dl) => deadlineUrgencyTone(dl))}
        striped
        stickyHeader
      />

      <Grid columns={4} gap={12}>
        <Stat value={String(pending.length)} label="Pending deadlines" />
        <Stat value={String(overdueCount)} label="Overdue" tone={overdueCount > 0 ? "danger" : undefined} />
        <Stat value={String(weekCount)} label="Due within 7 days" tone={weekCount > 0 ? "warning" : undefined} />
        <Stat value={formatDate(selectedDate)} label="Selected date" />
      </Grid>
    </Stack>
  );
}

// ── Research links tab ───────────────────────────────────────────────────────

function ResearchLinksTab({
  customLinks,
  onCustomLinksChange,
}: {
  customLinks: ResearchLink[];
  onCustomLinksChange: (links: ResearchLink[]) => void;
}) {
  const [showAdd, setShowAdd] = useCanvasState("research-add-link", false);
  const [newCategory, setNewCategory] = useCanvasState("research-new-cat", "Case law");
  const [newTitle, setNewTitle] = useCanvasState("research-new-title", "");
  const [newUrl, setNewUrl] = useCanvasState("research-new-url", "");
  const [newDescription, setNewDescription] = useCanvasState("research-new-desc", "");
  const [searchQuery, setSearchQuery] = useCanvasState("research-search", "");

  const allLinks = [...DEFAULT_RESEARCH_LINKS, ...customLinks];

  const filteredLinks = allLinks.filter((link) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return [link.title, link.category, link.description, link.url].join(" ").toLowerCase().includes(q);
  });

  const categories = Array.from(new Set(filteredLinks.map((l) => l.category))).sort();

  const addCustomLink = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    const link: ResearchLink = {
      id: uid("link"),
      category: newCategory.trim() || "Custom",
      title: newTitle.trim(),
      url: newUrl.trim(),
      description: newDescription.trim(),
    };
    onCustomLinksChange([...customLinks, link]);
    setNewTitle("");
    setNewUrl("");
    setNewDescription("");
    setShowAdd(false);
  };

  const removeCustomLink = (id: string) => {
    onCustomLinksChange(customLinks.filter((l) => l.id !== id));
  };

  return (
    <Stack gap={16}>
      <Callout tone="info" title="Research links">
        Quick access to case law, legislation, medical device registers, and other resources commonly used in medicolegal work. Add your own bookmarks below.
      </Callout>

      <Row gap={8} align="center">
        <TextInput
          value={searchQuery}
          onChange={setSearchQuery}
          type="search"
          placeholder="Search links…"
          style={{ flex: 1, maxWidth: 360 }}
        />
        <AsherOutlineButton onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? "Close" : "Add link"}
        </AsherOutlineButton>
      </Row>

      {showAdd && (
        <Card>
          <CardHeader>Add custom link</CardHeader>
          <CardBody>
            <Stack gap={12}>
              <Grid columns={2} gap={12}>
                <Stack gap={4}>
                  <FieldLabel>Category</FieldLabel>
                  <TextInput value={newCategory} onChange={setNewCategory} placeholder="e.g. Case law" />
                </Stack>
                <Stack gap={4}>
                  <FieldLabel>Title</FieldLabel>
                  <TextInput value={newTitle} onChange={setNewTitle} placeholder="Site or resource name" />
                </Stack>
              </Grid>
              <Stack gap={4}>
                <FieldLabel>URL</FieldLabel>
                <TextInput value={newUrl} onChange={setNewUrl} placeholder="https://…" />
              </Stack>
              <Stack gap={4}>
                <FieldLabel>Description</FieldLabel>
                <TextArea value={newDescription} onChange={setNewDescription} rows={2} placeholder="What this resource is useful for" />
              </Stack>
              <AsherOutlineButton onClick={addCustomLink}>Save link</AsherOutlineButton>
            </Stack>
          </CardBody>
        </Card>
      )}

      {categories.map((category) => {
        const categoryLinks = filteredLinks.filter((l) => l.category === category);
        if (categoryLinks.length === 0) return null;
        return (
          <div key={category}>
            <H2>{category}</H2>
            <Stack gap={8}>
              {categoryLinks.map((link) => {
                const isCustom = customLinks.some((c) => c.id === link.id);
                return (
                  <div key={link.id}>
                    <Card>
                      <CardBody>
                        <Row gap={12} align="start">
                          <Stack gap={4} style={{ flex: 1 }}>
                            <Link href={link.url}>{link.title}</Link>
                            <Text size="small" tone="tertiary">{link.description}</Text>
                            <Text size="small" tone="quaternary">{link.url}</Text>
                          </Stack>
                          {isCustom && (
                            <IconButton title="Remove" onClick={() => removeCustomLink(link.id)}>×</IconButton>
                          )}
                        </Row>
                      </CardBody>
                    </Card>
                  </div>
                );
              })}
            </Stack>
          </div>
        );
      })}

      {filteredLinks.length === 0 && (
        <Text tone="tertiary">No links match your search.</Text>
      )}
    </Stack>
  );
}

// ── Main app ─────────────────────────────────────────────────────────────────

export default function MedicolegalMatterManager() {
  const [matters, setMatters] = useCanvasState<Matter[]>("matters", DEFAULT_MATTERS);
  const [records, setRecords] = useCanvasState<RecordRequest[]>("records", DEFAULT_RECORDS);
  const [correspondence, setCorrespondence] = useCanvasState<CorrespondenceItem[]>("correspondence", DEFAULT_CORRESPONDENCE);
  const [chronology, setChronology] = useCanvasState<ChronologyEntry[]>("chronology", DEFAULT_CHRONOLOGY);
  const [parties, setParties] = useCanvasState<MatterParty[]>("parties", DEFAULT_PARTIES);
  const [solChecks, setSolChecks] = useCanvasState<Record<string, SolCheck>>("sol-checks", DEFAULT_SOL);
  const [letters, setLetters] = useCanvasState<Record<string, LetterOfInstruction>>("letters", DEFAULT_LETTERS);
  const [timeEntries, setTimeEntries] = useCanvasState<TimeEntry[]>("time-entries", DEFAULT_TIME);
  const [invoices, setInvoices] = useCanvasState<Invoice[]>("invoices", DEFAULT_INVOICES);
  const [customResearchLinks, setCustomResearchLinks] = useCanvasState<ResearchLink[]>("custom-research-links", []);
  const [tasks, setTasks] = useCanvasState<MatterTask[]>("matter-tasks", DEFAULT_TASKS);
  const [deadlines, setDeadlines] = useCanvasState<Deadline[]>("deadlines", defaultDeadlines());
  const [activeMatterId, setActiveMatterId] = useCanvasState("active-matter", SAMPLE_MATTER_ID);
  const [activeTab, setActiveTab] = useCanvasState<Tab | "">("active-tab", "");
  const [homeSearch, setHomeSearch] = useCanvasState("home-matter-search", "");
  const [homeQuoteIndex, setHomeQuoteIndex] = useCanvasState("home-quote-index", pickHomeQuoteIndex());
  const [defaultRate] = useCanvasState("default-rate", 450);
  const [createMenuOpen, setCreateMenuOpen] = useCanvasState("sidebar-create-open", false);
  const [, setRegisterSectionOpen] = useCanvasState("sidebar-register-open", true);
  const [expandedMatterId, setExpandedMatterId] = useCanvasState("sidebar-expanded-matter", SAMPLE_MATTER_ID);
  const [createPanel, setCreatePanel] = useCanvasState<"" | "workflow" | "template" | "matter" | "skill">("create-panel", "");
  const [libraryRoute, setLibraryRoute] = useCanvasState<LibraryRoute | "">("library-route", "");
  const [, setNewClaimType] = useCanvasState("new-claim-type", "Personal injury — motor accident");

  const goHome = () => {
    setHomeQuoteIndex(pickHomeQuoteIndex());
    setActiveTab("");
    setCreatePanel("");
    setLibraryRoute("");
    setCreateMenuOpen(false);
  };

  const goSearch = () => {
    goHome();
  };

  const openMatter = (matterId: string, tab: Tab = "overview") => {
    setActiveMatterId(matterId);
    setExpandedMatterId(matterId);
    setRegisterSectionOpen(true);
    setActiveTab(tab);
    setCreatePanel("");
    setLibraryRoute("");
    setCreateMenuOpen(false);
  };

  const openLibrary = (route: LibraryRoute) => {
    setLibraryRoute(route);
    setActiveTab("");
    setCreatePanel("");
    setCreateMenuOpen(false);
  };

  const openLibraryInMatter = (tab: Tab) => {
    openMatter(activeMatterId, tab);
  };

  const goResearch = () => {
    setActiveTab("links");
    setCreatePanel("");
    setLibraryRoute("");
    setCreateMenuOpen(false);
  };

  const goCalendar = () => {
    setActiveTab("calendar");
    setCreatePanel("");
    setLibraryRoute("");
    setCreateMenuOpen(false);
  };

  const goRegister = () => {
    setActiveTab("register");
    setRegisterSectionOpen(true);
    setCreatePanel("");
    setLibraryRoute("");
    setCreateMenuOpen(false);
  };

  const toggleMatterExpand = (matterId: string) => {
    setExpandedMatterId(expandedMatterId === matterId ? "" : matterId);
  };

  const homeSearchPlaceholder = HOME_SEARCH_QUOTES[homeQuoteIndex % HOME_SEARCH_QUOTES.length];

  const activeMatter = matters.find((m) => m.id === activeMatterId) ?? matters[0];
  const [, setCalSelected] = useCanvasState(`cal-selected-${activeMatterId}`, "2026-07-17");
  const [, setCalYear] = useCanvasState(`cal-year-${activeMatterId}`, 2026);
  const [, setCalMonth] = useCanvasState(`cal-month-${activeMatterId}`, 6);
  const [, setDeadlineWorkActive] = useCanvasState(`deadline-work-active-${activeMatterId}`, "");
  const [, setDeadlineWorkHint] = useCanvasState(`deadline-work-hint-${activeMatterId}`, "");
  const [, setCorrShowAdd] = useCanvasState(`corr-add-${activeMatterId}`, false);
  const [, setCorrSelected] = useCanvasState(`corr-selected-${activeMatterId}`, "");
  const [, setCorrDate] = useCanvasState(`corr-date-${activeMatterId}`, "");
  const [, setCorrDirection] = useCanvasState(`corr-dir-${activeMatterId}`, "outbound");
  const [, setCorrType] = useCanvasState(`corr-type-${activeMatterId}`, "letter");
  const [, setCorrParty] = useCanvasState(`corr-party-${activeMatterId}`, "");
  const [, setCorrSubject] = useCanvasState(`corr-subject-${activeMatterId}`, "");
  const [, setCorrReference] = useCanvasState(`corr-ref-${activeMatterId}`, "");
  const [, setCorrSummary] = useCanvasState(`corr-summary-${activeMatterId}`, "");
  const [, setCorrBody] = useCanvasState(`corr-body-${activeMatterId}`, "");
  const [, setCorrTags] = useCanvasState<string[]>(`corr-new-tags-${activeMatterId}`, []);
  const [, setRecordsShowAdd] = useCanvasState(`records-add-${activeMatterId}`, false);
  const [, setRecProvider] = useCanvasState(`new-rec-provider-${activeMatterId}`, "");
  const [, setRecType] = useCanvasState(`new-rec-type-${activeMatterId}`, "hospital");
  const [, setRecRange] = useCanvasState(`new-rec-range-${activeMatterId}`, "");

  const openDeadlineWork = (dl: Deadline) => {
    const matter = matters.find((m) => m.id === dl.matterId) ?? activeMatter;
    if (!matter) return;
    const template = buildDeadlineWorkTemplate(dl, matter);

    setDeadlineWorkActive(dl.id);
    setDeadlineWorkHint(template.hint);

    if (template.correspondence) {
      const c = template.correspondence;
      setCorrSelected("");
      setCorrShowAdd(true);
      setCorrDate(c.date);
      setCorrDirection(c.direction);
      setCorrType(c.type);
      setCorrParty(c.party);
      setCorrSubject(c.subject);
      setCorrReference(c.reference);
      setCorrSummary(c.summary);
      setCorrBody(c.body);
      setCorrTags(c.tags);
    }

    if (template.advice) {
      const existing =
        letters[matter.id] ?? {
          matterId: matter.id,
          preparedFor: "",
          injuryOverview: matter.injuryDescription,
          executiveSummary: "",
          chronologyNarrative: "",
          summary: "",
          questionsForExpert: "",
        };
      setLetters({
        ...letters,
        [matter.id]: { ...existing, ...template.advice },
      });
    }

    if (template.records) {
      setRecordsShowAdd(true);
      setRecProvider(template.records.provider);
      setRecType(template.records.providerType);
      setRecRange(template.records.dateRange);
    }

    if (template.tab === "calendar") {
      setCalSelected(dl.date);
      const d = parseIsoDate(dl.date);
      setCalYear(d.getFullYear());
      setCalMonth(d.getMonth());
    }

    setActiveTab(template.tab);
  };

  const updateMatter = (updated: Matter) => {
    setMatters(matters.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleNewMatter = (m: Matter) => {
    setMatters([...matters, m]);
    setLetters({
      ...letters,
      [m.id]: {
        matterId: m.id,
        preparedFor: "",
        injuryOverview: m.injuryDescription,
        executiveSummary: "",
        chronologyNarrative: "",
        summary: "",
        questionsForExpert: "",
      },
    });
    const newSol = defaultSolForMatter(m);
    setSolChecks({ ...solChecks, [m.id]: newSol });
    setDeadlines((current) => syncSolToCalendar(newSol, current));
    openMatter(m.id, "overview");
  };

  const activeSol =
    solChecks[activeMatter?.id ?? ""] ??
    (activeMatter ? defaultSolForMatter(activeMatter) : defaultSolForMatter(DEFAULT_MATTERS[0]));

  const updateSol = (s: SolCheck) => {
    setSolChecks({ ...solChecks, [s.matterId]: s });
    setDeadlines((current) => syncSolToCalendar(s, current));
  };

  const activeLetter = letters[activeMatter?.id] ?? {
    matterId: activeMatter?.id ?? "",
    recipientType: "physician" as const,
    recipientName: "",
    recipientAddress: "",
    financialSituation: "",
    subjectiveSymptoms: "",
    diagnosticFindings: "",
    conflictingOpinions: "",
    causation: "",
    treatmentReasonableness: "",
    questionsForExpert: "",
    draftBody: "",
  };

  const updateLetter = (l: LetterOfInstruction) => {
    setLetters({ ...letters, [l.matterId]: l });
  };

  const matterTotalHours = timeEntries
    .filter((e) => e.matterId === activeMatter?.id)
    .reduce((s, e) => s + e.hours, 0);

  const matterPendingDeadlines = deadlines.filter(
    (d) => d.matterId === activeMatter?.id && d.status === "pending",
  ).length;

  const isMatterView =
    activeTab !== "" &&
    activeTab !== "links" &&
    activeTab !== "calendar" &&
    activeTab !== "register" &&
    !createPanel &&
    libraryRoute === "";
  const pageTitle =
    createPanel === "workflow"
      ? "Create workflow"
      : createPanel === "template"
        ? "Choose a template"
        : createPanel === "matter"
          ? "Create matter"
          : createPanel === "skill"
            ? "Create skill"
            : libraryRoute !== ""
          ? libraryRouteLabel(libraryRoute)
          : activeTab === ""
            ? "Home"
            : activeTab === "links"
              ? "Research Resources"
              : activeTab === "calendar"
                ? "Calendar"
                : activeTab === "register"
                  ? "Matter Database"
                  : `${activeMatter?.matterNumber ?? ""} · ${tabLabel(activeTab)}`;

  return (
    <Row
      gap={0}
      style={{
        width: "100%",
        alignItems: "stretch",
        minHeight: "100%",
        background: ASHER.bg,
        color: ASHER.text,
        fontFamily: ASHER.fontSerif,
        fontWeight: 300,
      }}
    >
      <AppSidebar
        matters={matters}
        activeTab={activeTab}
        activeMatterId={activeMatterId}
        expandedMatterId={expandedMatterId}
        createMenuOpen={createMenuOpen}
        homeSearch={homeSearch}
        homeActive={activeTab === "" && createPanel === "" && libraryRoute === ""}
        libraryRoute={libraryRoute}
        onToggleCreateMenu={() => setCreateMenuOpen(!createMenuOpen)}
        onCreateWorkflow={() => {
          setCreatePanel("workflow");
          setCreateMenuOpen(false);
          setActiveTab("");
          setLibraryRoute("");
        }}
        onCreateTemplate={() => {
          setCreatePanel("template");
          setCreateMenuOpen(false);
          setActiveTab("");
          setLibraryRoute("");
        }}
        onCreateMatter={() => {
          setCreatePanel("matter");
          setCreateMenuOpen(false);
          setActiveTab("");
          setLibraryRoute("");
        }}
        onCreateSkill={() => {
          setCreatePanel("skill");
          setCreateMenuOpen(false);
          setActiveTab("");
          setLibraryRoute("");
        }}
        onGoHome={goHome}
        onGoSearch={goSearch}
        onGoCalendar={goCalendar}
        onGoRegister={goRegister}
        onGoResearch={goResearch}
        onOpenLibrary={openLibrary}
        onToggleMatterExpand={toggleMatterExpand}
        onOpenMatter={(id) => openMatter(id, "overview")}
        onOpenMatterTab={(id, tab) => openMatter(id, tab)}
      />

      <Stack gap={0} style={{ flex: 1, minWidth: 0, background: ASHER.bg }}>
        <Row
          gap={12}
          align="center"
          style={{
            padding: "28px 40px",
            borderBottom: `1px solid ${ASHER.border}`,
            background: ASHER.bg,
            minHeight: 72,
          }}
        >
          <Row gap={10} align="center" style={{ minWidth: 0 }}>
            <span style={{ color: ASHER.navy, display: "inline-flex", flexShrink: 0 }}>
              {pageHeaderIcon(createPanel, libraryRoute, activeTab)}
            </span>
            <H1
              style={{
                margin: 0,
                fontSize: 28,
                lineHeight: 1.2,
                minWidth: 0,
                fontWeight: 300,
                letterSpacing: "-0.03em",
                color: ASHER.navy,
                fontFamily: ASHER.fontSerif,
              }}
            >
              {pageTitle}
            </H1>
          </Row>
          {isMatterView && activeMatter && (
            <>
              <Spacer />
              <Text
                size="small"
                style={{ fontFamily: ASHER.fontMono, letterSpacing: "-0.045em", color: ASHER.nav }}
              >
                {activeMatter.clientName}
              </Text>
            </>
          )}
        </Row>

        <Stack gap={20} style={{ padding: "24px 40px", width: "100%" }}>
          {(createPanel === "workflow" || createPanel === "matter") && (
            <NewMatterPanel onSave={handleNewMatter} onCancel={() => setCreatePanel("")} />
          )}

          {createPanel === "skill" && (
            <CreateSkillPanel onCancel={() => setCreatePanel("")} />
          )}

          {createPanel === "template" && (
            <CreateTemplatePanel
              onSelect={(claimType) => {
                setNewClaimType(claimType);
                setCreatePanel("workflow");
              }}
              onCancel={() => setCreatePanel("")}
            />
          )}

          {!createPanel && libraryRoute.startsWith("template-") && (
            <TemplateLibraryPanel
              route={libraryRoute as LibraryRoute}
              onOpenInMatter={openLibraryInMatter}
            />
          )}

          {!createPanel && libraryRoute.startsWith("workflow-") && (
            <WorkflowLibraryPanel
              item={libraryRoute === "workflow-chronology" ? "chronology" : "advice"}
              onOpenInMatter={openLibraryInMatter}
            />
          )}

          {!createPanel && libraryRoute === "" && activeTab === "" && (
            <>
              <Stack
                gap={28}
                style={{
                  width: "100%",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "140px 24px 112px",
                }}
              >
                <Stack gap={10} style={{ alignItems: "center", width: "100%" }}>
                  <Text
                    style={{
                      fontSize: 32,
                      fontWeight: 300,
                      lineHeight: 1.2,
                      letterSpacing: "-0.03em",
                      color: ASHER.navy,
                      fontFamily: ASHER.fontSerif,
                    }}
                  >
                    {greetingForHour()}
                  </Text>
                </Stack>
                <TextInput
                  value={homeSearch}
                  onChange={setHomeSearch}
                  type="search"
                  placeholder={homeSearchPlaceholder}
                  style={{
                    width: "100%",
                    maxWidth: 560,
                    fontSize: 14,
                    fontFamily: ASHER.fontMono,
                    letterSpacing: "-0.045em",
                    color: homeSearch.trim() ? ASHER.navy : ASHER.nav,
                    padding: "10px 16px",
                    textAlign: "center",
                    border: `1px solid ${ASHER.borderStrong}`,
                    background: ASHER.bg,
                  }}
                />
              </Stack>
              <HomeTab
                matters={matters}
                deadlines={deadlines}
                onNavigate={(tab) => {
                  if (tab === "calendar") {
                    goCalendar();
                    return;
                  }
                  if (tab === "register") {
                    goRegister();
                    return;
                  }
                  openMatter(activeMatterId, tab);
                }}
                onOpenDeadline={(dl) => {
                  openMatter(dl.matterId, workTabForDeadline(dl));
                  openDeadlineWork(dl);
                }}
              />
            </>
          )}

          {!createPanel && isMatterView && (
            <Row gap={8} align="center" wrap>
              <Text size="small" tone="tertiary">Stage 1 — pre-litigation preparation</Text>
              <Spacer />
              <Pill size="sm">{matterTotalHours.toFixed(1)} hrs logged</Pill>
              {matterPendingDeadlines > 0 && activeTab !== "overview" && (
                <Pill size="sm" active>{matterPendingDeadlines} deadlines</Pill>
              )}
              <Pill size="sm">{statusLabel(activeMatter?.status ?? "intake")}</Pill>
            </Row>
          )}

          {!createPanel && libraryRoute === "" && activeTab === "register" && (
            <MatterRegisterTab
              matters={matters}
              onMattersChange={setMatters}
              onOpenMatter={(id) => openMatter(id, "overview")}
              tasks={tasks}
              deadlines={deadlines}
              timeEntries={timeEntries}
              invoices={invoices}
            />
          )}

          {!createPanel && libraryRoute === "" && activeTab === "links" && (
            <ResearchLinksTab
              customLinks={customResearchLinks}
              onCustomLinksChange={setCustomResearchLinks}
            />
          )}

          {!createPanel && libraryRoute === "" && activeTab === "calendar" && (
            <CalendarTab matters={matters} deadlines={deadlines} onChange={setDeadlines} />
          )}

          {!createPanel && isMatterView && (
            <Grid columns="minmax(0, 1fr) auto" gap={16} align="start" style={{ width: "100%" }}>
              <Stack gap={0} style={{ minWidth: 0 }}>
                <div
                  style={{
                    borderTop: `1px solid ${ASHER.border}`,
                    paddingTop: 16,
                  }}
                >
                  {activeMatter && activeTab === "overview" && (
                    <OverviewTab
                      matter={{
                        ...activeMatter,
                        lastActionNote: activeMatter.lastActionNote ?? "",
                        followUpNote: activeMatter.followUpNote ?? "",
                      }}
                      deadlines={deadlines}
                      letter={letters[activeMatter.id]}
                      timeEntries={timeEntries}
                      onUpdate={updateMatter}
                      onOpenCalendar={goCalendar}
                      onOpenDeadline={openDeadlineWork}
                    />
                  )}
                  {activeMatter && activeTab === "records" && (
                    <RecordsTab matterId={activeMatter.id} records={records} onChange={setRecords} deadlines={deadlines} />
                  )}
                  {activeMatter && activeTab === "correspondence" && (
                    <CorrespondenceTab matterId={activeMatter.id} items={correspondence} onChange={setCorrespondence} deadlines={deadlines} />
                  )}
                  {activeMatter && activeTab === "chronology" && (
                    <ChronologyTab
                      matter={activeMatter}
                      entries={chronology}
                      parties={parties}
                      solCheck={activeSol}
                      onEntriesChange={setChronology}
                      onPartiesChange={setParties}
                      onSolChange={updateSol}
                      deadlines={deadlines}
                    />
                  )}
                  {activeMatter && activeTab === "advice" && (
                    <AdviceTab matter={activeMatter} letter={activeLetter} onChange={updateLetter} deadlines={deadlines} />
                  )}
                  {activeMatter && activeTab === "billing" && (
                    <BillingTab
                      matter={activeMatter}
                      entries={timeEntries}
                      onChange={setTimeEntries}
                      invoices={invoices}
                      onInvoicesChange={setInvoices}
                      defaultRate={defaultRate}
                    />
                  )}
                </div>
              </Stack>

              {activeMatter && activeTab !== "overview" && (
                <TodayCalendarCompact
                  matterId={activeMatter.id}
                  matters={matters}
                  deadlines={deadlines}
                  onOpenCalendar={goCalendar}
                  onOpenDeadline={(dl) => openDeadlineWork(dl)}
                />
              )}
            </Grid>
          )}
        </Stack>
      </Stack>
    </Row>
  );
}
