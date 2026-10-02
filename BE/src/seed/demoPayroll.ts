import type { PayrollRepository } from "../repositories/payroll.repository";
import { buildPortalPayroll } from "./portalPayroll";

export async function seedDemoPayroll(payroll: PayrollRepository): Promise<number> {
  if ((await payroll.countLines()) > 0) return 0;

  const built = buildPortalPayroll();
  await payroll.clearRun();
  await payroll.insertRun(built.run);
  return payroll.insertLines(built.lines);
}
