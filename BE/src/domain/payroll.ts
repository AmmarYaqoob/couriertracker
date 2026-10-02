import { isEmploymentType, type EmploymentType } from "./rider";

export const PAYROLL_PERIOD_ID = "2026-09";

export const PAYROLL_STATUSES = ["blocked", "pending", "approved"] as const;
export type PayrollStatus = (typeof PAYROLL_STATUSES)[number];

export interface PayrollChecklistItem {
  label: string;
  done: boolean;
}

export interface PayrollException {
  type: string;
  count: number;
}

export interface PayrollRunRecord {
  id: string;
  eyebrow: string;
  description: string;
  blockedFoot: string;
  checklist: PayrollChecklistItem[];
  exceptions: PayrollException[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PayrollLineRecord {
  id: string;
  periodId: string;
  name: string;
  employmentType: EmploymentType;
  hourlyRate: number;
  hours: number;
  gross: number;
  status: PayrollStatus;
  note: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreatePayrollRun = Omit<PayrollRunRecord, "createdAt" | "updatedAt">;
export type CreatePayrollLine = Omit<PayrollLineRecord, "createdAt" | "updatedAt">;

export function isPayrollStatus(value: string): value is PayrollStatus {
  return (PAYROLL_STATUSES as readonly string[]).includes(value);
}

export function requireEmploymentType(value: string): EmploymentType {
  if (!isEmploymentType(value)) {
    throw new Error(`Unknown employment type ${value}`);
  }
  return value;
}

export function requirePayrollStatus(value: string): PayrollStatus {
  if (!isPayrollStatus(value)) {
    throw new Error(`Unknown payroll status ${value}`);
  }
  return value;
}
