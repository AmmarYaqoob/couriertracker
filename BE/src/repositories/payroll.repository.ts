import type { CreatePayrollLine, CreatePayrollRun, PayrollLineRecord, PayrollRunRecord } from "../domain/payroll";

export interface PayrollRepository {
  countLines(): Promise<number>;
  clearRun(): Promise<void>;
  insertRun(data: CreatePayrollRun): Promise<PayrollRunRecord>;
  insertLines(rows: CreatePayrollLine[]): Promise<number>;
  getRun(): Promise<PayrollRunRecord | null>;
  listLines(): Promise<PayrollLineRecord[]>;
  findLine(riderId: string): Promise<PayrollLineRecord | null>;
}
