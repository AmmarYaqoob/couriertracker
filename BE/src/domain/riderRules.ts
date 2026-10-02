import {
  COMPLIANCE_GOOD_AT,
  COMPLIANCE_WARN_AT,
  MINIJOB_LIMITS,
  MINIJOB_WARNING_SHARE,
  PILOT_DAY,
  WAGE_BANDS,
  type RiderRecord,
} from "./rider";

export type ComplianceSeverity = "High" | "Medium" | "Low";
export type ComplianceTone = "good" | "warn" | "crit";
export type DocumentStatus = "verified" | "expiring" | "expired" | "pending";
export type PayrollStatus = "approved" | "blocked" | "pending";
export type MiniJobState = "ok" | "warning" | "breach";

export interface ComplianceItem {
  issue: string;
  detail: string;
  severity: ComplianceSeverity;
  rule: string;
  due: string;
}

export interface RiderDocument {
  name: string;
  status: DocumentStatus;
  detail: string;
}

export interface PayrollMonth {
  month: string;
  hours: number;
  gross: number;
  grossLabel: string;
  status: PayrollStatus;
  note: string;
}

export interface MiniJobAssessment {
  monthlyEarnings: number;
  monthlyEarningsLabel: string;
  limit: number;
  limitLabel: string;
  limit2027: number;
  share: number;
  state: MiniJobState;
  headroom: number;
  message: string;
}

const DAY_MS = 86_400_000;

export function daysUntil(date: string | null, asOf = PILOT_DAY): number | null {
  if (!date) return null;
  return Math.round((Date.parse(date) - Date.parse(asOf)) / DAY_MS);
}

export function minimumWage(asOf = PILOT_DAY): number {
  let rate: number = WAGE_BANDS[0].rate;
  for (const band of WAGE_BANDS) {
    if (asOf >= band.from) rate = band.rate;
  }
  return rate;
}

export function miniJobLimit(asOf = PILOT_DAY): number {
  const year = Number(asOf.slice(0, 4));
  return MINIJOB_LIMITS[year] ?? MINIJOB_LIMITS[2026];
}

export function assessMiniJob(earnings: number, asOf = PILOT_DAY): {
  monthlyEarnings: number;
  limit: number;
  share: number;
  state: MiniJobState;
  headroom: number;
} {
  const limit = miniJobLimit(asOf);
  const share = earnings / limit;
  const state: MiniJobState = share > 1 ? "breach" : share >= MINIJOB_WARNING_SHARE ? "warning" : "ok";
  return { monthlyEarnings: earnings, limit, share, state, headroom: limit - earnings };
}

export interface RiderComplianceFacts {
  permitExpiry: string | null;
  earnings: number | null;
}

export function complianceItems(
  rider: RiderRecord,
  facts: RiderComplianceFacts,
  asOf = PILOT_DAY,
): ComplianceItem[] {
  const items: ComplianceItem[] = [];
  const permitDays = daysUntil(facts.permitExpiry, asOf);

  if (permitDays !== null && permitDays < 0) {
    items.push({
      issue: "Work permit expired",
      detail: `Expired ${facts.permitExpiry}. Do not roster until renewed.`,
      severity: "High",
      rule: "Right to work",
      due: "Immediately",
    });
  } else if (permitDays !== null && permitDays <= 30) {
    items.push({
      issue: "Work permit expiring",
      detail: `Expires ${facts.permitExpiry} (${permitDays} days)`,
      severity: "Medium",
      rule: "Right to work",
      due: facts.permitExpiry ?? asOf,
    });
  }

  const minimum = minimumWage(asOf);
  if (rider.hourlyRate < minimum - 1e-9) {
    items.push({
      issue: "Below statutory minimum wage",
      detail: `€${rider.hourlyRate.toFixed(2)}/h against €${minimum.toFixed(2)}/h`,
      severity: "High",
      rule: "Mindestlohn 2026",
      due: "Before payroll run",
    });
  }

  if (rider.employmentType === "Mini-job" && facts.earnings !== null) {
    const mini = assessMiniJob(facts.earnings, asOf);
    if (mini.state === "breach") {
      items.push({
        issue: "Mini-job limit exceeded",
        detail: `€${facts.earnings} this month against €${mini.limit}`,
        severity: "High",
        rule: "Minijob limit 2026",
        due: "Before payroll run",
      });
    } else if (mini.state === "warning") {
      items.push({
        issue: "Mini-job limit nearly reached",
        detail: `€${facts.earnings} of €${mini.limit} (${Math.round(mini.share * 100)}%)`,
        severity: "Medium",
        rule: "Minijob limit 2026",
        due: "Before next roster",
      });
    }
  }

  const contractDays = daysUntil(rider.contractEnd, asOf);
  if (contractDays !== null && contractDays <= 180) {
    items.push({
      issue: "Fixed-term contract ending",
      detail: `Ends ${rider.contractEnd}; decide on renewal`,
      severity: "Low",
      rule: "Contract management",
      due: rider.contractEnd ?? asOf,
    });
  }

  if (rider.shiftEnd - rider.shiftStart > 360 && rider.breakMinutes < 30) {
    items.push({
      issue: "Break not planned",
      detail: "Shift over 6 hours needs at least 30 minutes break",
      severity: "Medium",
      rule: "ArbZG section 4",
      due: "Today",
    });
  }

  return items;
}

export function complianceScore(items: ComplianceItem[]): number {
  const penalty = items.reduce((total, item) => {
    if (item.severity === "High") return total + 35;
    if (item.severity === "Medium") return total + 12;
    return total + 4;
  }, 0);
  return Math.max(0, 100 - penalty);
}

export function complianceTone(score: number): ComplianceTone {
  if (score >= COMPLIANCE_GOOD_AT) return "good";
  if (score >= COMPLIANCE_WARN_AT) return "warn";
  return "crit";
}

