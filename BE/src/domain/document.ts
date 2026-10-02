import { PILOT_DAY } from "./rider";

export const DOCUMENT_AS_OF = PILOT_DAY;

export const DOCUMENT_KINDS = [
  "aufenthaltstitel",
  "duldung",
  "fuehrerschein",
  "uvv_inspection",
  "insurance",
  "bg_verkehr_reg",
  "a1_certificate",
  "work_contract",
] as const;

export type DocumentKind = (typeof DOCUMENT_KINDS)[number];

export const DOCUMENT_BANDS = ["crit", "warn", "good"] as const;
export type DocumentBand = (typeof DOCUMENT_BANDS)[number];

export const DOCUMENT_LABELS: Record<DocumentKind, string> = {
  aufenthaltstitel: "Aufenthaltstitel",
  duldung: "Duldung",
  fuehrerschein: "Fuehrerschein",
  uvv_inspection: "UVV",
  insurance: "Insurance",
  bg_verkehr_reg: "BG Verkehr",
  a1_certificate: "A1",
  work_contract: "Contract",
};

export const DOCUMENT_NAMES: Record<DocumentKind, string> = {
  aufenthaltstitel: "Aufenthaltstitel (residence permit)",
  duldung: "Duldung (tolerated stay certificate)",
  fuehrerschein: "Fuehrerscheinkontrolle (driving licence check)",
  uvv_inspection: "UVV vehicle inspection (workplace safety check)",
  insurance: "Betriebshaftpflicht (operator liability insurance)",
  bg_verkehr_reg: "BG Verkehr registration (statutory accident insurance)",
  a1_certificate: "A1 posting certificate (cross-border social security)",
  work_contract: "Arbeitsvertrag (employment contract)",
};

export const DOCUMENT_LEGAL: Record<DocumentKind, string> = {
  aufenthaltstitel:
    "Aufenthaltstitel: employer must hold a valid copy and re-verify before every extension; working without one triggers §404 AufenthG fines up to EUR 500,000 (Alnaif carries primary liability, EELS as principal is jointly liable).",
  duldung:
    "Duldung: work permission is a separate endorsement (Beschaeftigungserlaubnis). Re-check on every extension; typical validity is 3-6 months.",
  fuehrerschein:
    "Fuehrerscheinkontrolle: employers with fleet vehicles must verify the driving licence in person twice a year (UVV §35, BGV D29). Keep a dated log.",
  uvv_inspection:
    "UVV inspection: bicycles, e-bikes and scooters used for work need an annual safety check by a qualified person (DGUV Vorschrift 70).",
  insurance:
    "Betriebshaftpflicht: operator liability cover for third-party damage. Lapses must be closed within 14 days or vehicles come off the road.",
  bg_verkehr_reg:
    "BG Verkehr registration: statutory accident insurance for transport workers; new hires must be reported within one week. Accidents are reportable by the next working day.",
  a1_certificate:
    "A1 certificate: required for any rider working across a German border (day trips to Strasbourg, Basel). Must be carried on the person.",
  work_contract:
    "Arbeitsvertrag: written contract required within one month of start (NachwG, transposing EU 2019/1152). Missing contract blocks payroll.",
};

export interface DocumentRecord {
  id: string;
  riderId: string;
  riderName: string;
  kind: DocumentKind;
  reference: string;
  issuedOn: string;
  expiresOn: string;
  fileName: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateDocument = Omit<DocumentRecord, "createdAt" | "updatedAt">;

export function isDocumentKind(value: string): value is DocumentKind {
  return (DOCUMENT_KINDS as readonly string[]).includes(value);
}

export function isDocumentBand(value: string): value is DocumentBand {
  return (DOCUMENT_BANDS as readonly string[]).includes(value);
}

export function daysUntilExpiry(expiresOn: string, asOf = DOCUMENT_AS_OF): number {
  const start = Date.parse(`${asOf}T00:00:00Z`);
  const end = Date.parse(`${expiresOn}T00:00:00Z`);
  return Math.round((end - start) / 86_400_000);
}

export function expiryBand(daysLeft: number): DocumentBand {
  if (daysLeft < 14) return "crit";
  if (daysLeft <= 60) return "warn";
  return "good";
}

export function daysLeftLabel(daysLeft: number): string {
  if (daysLeft < 0) return `${Math.abs(daysLeft)}d expired`;
  if (daysLeft === 0) return "today";
  return `${daysLeft}d`;
}
