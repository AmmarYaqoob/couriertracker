import type { PayrollLineRecord, PayrollRunRecord, PayrollStatus } from "../domain/payroll";
import { euro } from "../domain/rider";
import { AppError } from "../errors/appError";
import type { PayrollRepository } from "../repositories/payroll.repository";

type StatusTone = "crit" | "warn" | "good";

export class PayrollService {
  constructor(private readonly payroll: PayrollRepository) {}

  async list() {
    const run = await this.requireRun();
    const lines = await this.payroll.listLines();
    return toPage(run, lines);
  }

  async getById(id: string) {
    const line = await this.payroll.findLine(id);
    if (!line) throw new AppError(404, "Payroll rider not found");
    return { rider: toLine(line) };
  }

  private async requireRun(): Promise<PayrollRunRecord> {
    const run = await this.payroll.getRun();
    if (!run) throw new AppError(404, "Payroll not found");
    return run;
  }
}

const BLOCKED_EXCEPTIONS = [
  { type: "Below minimum wage", note: "Below statutory minimum wage" },
  { type: "Mini-job limit", note: "Mini-job limit exceeded" },
  { type: "Right to work", note: "Work permit expired" },
] as const;

function toPage(run: PayrollRunRecord, lines: PayrollLineRecord[]) {
  const approvedHours = lines
    .filter((line) => line.status === "approved")
    .reduce((sum, line) => sum + line.hours, 0);
  const grossCents = lines.reduce((sum, line) => sum + Math.round(line.gross * 100), 0);
  const grossPay = grossCents / 100;
  const blockedRiders = lines.filter((line) => line.status === "blocked").length;
  const checklistDone = run.checklist.filter((item) => item.done).length;
  return {
    period: {
      id: run.id,
      eyebrow: run.eyebrow,
      description: run.description,
    },
    summary: {
      approvedHours,
      approvedHoursLabel: approvedHours.toLocaleString("en-GB"),
      grossPay,
      grossPayLabel: euro(grossPay, 0),
      blockedRiders,
      blockedTone: blockedRiders ? "crit" : "good",
      blockedFoot: run.blockedFoot,
      checklistDone,
      checklistTotal: run.checklist.length,
      checklistLabel: `${checklistDone}/${run.checklist.length}`,
    },
    checklist: run.checklist.map((item) => ({ label: item.label, done: item.done })),
    exceptions: BLOCKED_EXCEPTIONS.map((rule) => {
      const count = lines.filter((line) => line.status === "blocked" && line.note === rule.note).length;
      return { type: rule.type, count, tone: count ? "crit" : "good" };
    }).filter((item) => item.count > 0),
    count: lines.length,
    riders: lines.map(toLine),
  };
}

function toLine(line: PayrollLineRecord) {
  return {
    id: line.id,
    name: line.name,
    employmentType: line.employmentType,
    hourlyRate: line.hourlyRate,
    hourlyRateLabel: euro(line.hourlyRate, 2),
    hours: line.hours,
    gross: line.gross,
    grossLabel: euro(line.gross, 2),
    status: line.status,
    statusTone: statusTone(line.status),
    note: line.note,
  };
}

function statusTone(status: PayrollStatus): StatusTone {
  if (status === "blocked") return "crit";
  if (status === "pending") return "warn";
  return "good";
}
