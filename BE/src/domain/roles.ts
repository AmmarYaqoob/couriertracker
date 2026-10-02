export const ROLES = [
  "executive",
  "admin",
  "shift_lead",
  "fleet_manager",
  "hr",
  "compliance",
  "payroll",
] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_TITLES: Record<Role, string> = {
  executive: "Chief Executive",
  admin: "Operations Admin",
  shift_lead: "Shift Lead",
  fleet_manager: "Fleet Owner",
  hr: "HR Manager",
  compliance: "Compliance Officer",
  payroll: "Payroll Admin",
};

export const HOME_BY_ROLE: Record<Role, string> = {
  executive: "/dashboard",
  admin: "/admin",
  shift_lead: "/ops",
  fleet_manager: "/fleet",
  hr: "/riders",
  compliance: "/compliance",
  payroll: "/payroll",
};

export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}
