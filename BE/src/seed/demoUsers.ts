import bcrypt from "bcryptjs";
import { ROLE_TITLES, type Role } from "../domain/roles";
import type { UserRepository } from "../repositories/user.repository";

const DEMO_PASSWORD = "demo123";

const DEMO_USERS: Array<{ name: string; email: string; role: Role }> = [
  { name: "Marcus Klein", email: "executive@eels.de", role: "executive" },
  { name: "Anna Müller", email: "admin@eels.de", role: "admin" },
  { name: "Tobias Lang", email: "shiftlead@eels.de", role: "shift_lead" },
  { name: "Björn Richter", email: "fleet@eels.de", role: "fleet_manager" },
  { name: "Priya Sharma", email: "hr@eels.de", role: "hr" },
  { name: "Ali Hassan", email: "compliance@eels.de", role: "compliance" },
  { name: "Sophie Wagner", email: "payroll@eels.de", role: "payroll" },
];

export async function seedDemoUsers(users: UserRepository): Promise<number> {
  if ((await users.count()) > 0) return 0;

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  for (const user of DEMO_USERS) {
    await users.create({
      name: user.name,
      email: user.email,
      passwordHash,
      role: user.role,
      title: ROLE_TITLES[user.role],
      active: true,
    });
  }
  return DEMO_USERS.length;
}
