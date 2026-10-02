import type { Model } from "mongoose";
import type {
  CreatePayrollLine,
  CreatePayrollRun,
  PayrollLineRecord,
  PayrollRunRecord,
  PayrollStatus,
} from "../domain/payroll";
import type { EmploymentType } from "../domain/rider";
import type {
  PayrollLineDocument,
  PayrollLineSchema,
  PayrollRunDocument,
  PayrollRunSchema,
} from "../models/payroll.model";
import type { PayrollRepository } from "./payroll.repository";

function toRun(doc: PayrollRunDocument): PayrollRunRecord {
  return {
    id: doc.code,
    eyebrow: doc.eyebrow,
    description: doc.description,
    blockedFoot: doc.blockedFoot,
    checklist: doc.checklist.map((item) => ({ label: item.label, done: item.done })),
    exceptions: doc.exceptions.map((item) => ({ type: item.type, count: item.count })),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function toLine(doc: PayrollLineDocument): PayrollLineRecord {
  return {
    id: doc.code,
    periodId: doc.periodId,
    name: doc.name,
    employmentType: doc.employmentType as EmploymentType,
    hourlyRate: doc.hourlyRate,
    hours: doc.hours,
    gross: doc.gross,
    status: doc.status as PayrollStatus,
    note: doc.note,
    sortOrder: doc.sortOrder,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function toRunDoc(data: CreatePayrollRun) {
  return {
    code: data.id,
    eyebrow: data.eyebrow,
    description: data.description,
    blockedFoot: data.blockedFoot,
    checklist: data.checklist,
    exceptions: data.exceptions,
  };
}

function toLineDoc(data: CreatePayrollLine) {
  return {
    code: data.id,
    periodId: data.periodId,
    name: data.name,
    employmentType: data.employmentType,
    hourlyRate: data.hourlyRate,
    hours: data.hours,
    gross: data.gross,
    status: data.status,
    note: data.note,
    sortOrder: data.sortOrder,
  };
}

export class MongoPayrollRepository implements PayrollRepository {
  constructor(
    private readonly runs: Model<PayrollRunSchema>,
    private readonly lines: Model<PayrollLineSchema>,
  ) {}

  async countLines(): Promise<number> {
    return this.lines.countDocuments();
  }

  async clearRun(): Promise<void> {
    await this.runs.deleteMany({});
  }

  async insertRun(data: CreatePayrollRun): Promise<PayrollRunRecord> {
    const doc = await this.runs.create(toRunDoc(data));
    return toRun(doc);
  }

  async insertLines(rows: CreatePayrollLine[]): Promise<number> {
    if (rows.length === 0) return 0;
    const docs = await this.lines.insertMany(rows.map(toLineDoc));
    return docs.length;
  }

  async getRun(): Promise<PayrollRunRecord | null> {
    const doc = await this.runs.findOne().sort({ code: 1 });
    return doc ? toRun(doc) : null;
  }

  async listLines(): Promise<PayrollLineRecord[]> {
    const docs = await this.lines.find().sort({ sortOrder: 1, code: 1 });
    return docs.map(toLine);
  }

  async findLine(riderId: string): Promise<PayrollLineRecord | null> {
    const doc = await this.lines.findOne({ code: riderId });
    return doc ? toLine(doc) : null;
  }
}
