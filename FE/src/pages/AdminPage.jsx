// Admin page. Also contains fleet-owner seed data used by the admin screen.
import * as T0 from "react";
import * as J from "react/jsx-runtime";
import {
  Be,
  useOpsStore,
  V,
  gi,
  jt,
  kl,
  Link,
  readPilotModel,
  y2,
} from "../services/portalState.jsx";
import { Badge, Card, Stat, PageHeader, Button } from "../components/ui.jsx";
import { Fr, Vd } from "../components/icons.jsx";
var L5 = [
    {
      id: "fo0",
      ownerName: "EELS operations team",
      companyName: "EELS GmbH (Frankfurt pilot)",
      email: "ops@eels.de",
      phone: "+49 6142 000 100",
      cities: ["Frankfurt"],
      platforms: ["Uber Eats", "Wolt", "Lieferando"],
      riders: 91,
      monthlyOrders: 18400,
      status: "onboarding",
      joinedDate: "Sep 2026",
    },
    {
      id: "fo1",
      ownerName: "Mohammad Khan",
      companyName: "Khan Delivery GmbH",
      email: "khan@khandelivery.de",
      phone: "+49 30 1234567",
      cities: ["Berlin", "Hamburg"],
      platforms: ["Uber Eats", "Wolt"],
      riders: 86,
      monthlyOrders: 24500,
      status: "active",
      joinedDate: "Jan 2025",
    },
    {
      id: "fo2",
      ownerName: "Ali Raza",
      companyName: "Raza Logistics",
      email: "ali@razalogistics.de",
      phone: "+49 89 2345678",
      cities: ["Munich", "Stuttgart"],
      platforms: ["Uber Eats", "Flink"],
      riders: 64,
      monthlyOrders: 18200,
      status: "active",
      joinedDate: "Mar 2025",
    },
    {
      id: "fo3",
      ownerName: "Priya Sharma",
      companyName: "Sharma Fleet Services",
      email: "priya@sharmafleet.de",
      phone: "+49 69 3456789",
      cities: ["Frankfurt", "Cologne"],
      platforms: ["Wolt"],
      riders: 42,
      monthlyOrders: 11800,
      status: "suspended",
      joinedDate: "Feb 2025",
    },
    {
      id: "fo4",
      ownerName: "Ahmed Hassan",
      companyName: "Hassan Delivery Co",
      email: "ahmed@hassandelivery.de",
      phone: "+49 341 4567890",
      cities: ["Leipzig", "Dresden"],
      platforms: ["Lieferando"],
      riders: 31,
      monthlyOrders: 8400,
      status: "active",
      joinedDate: "Apr 2025",
    },
    {
      id: "fo5",
      ownerName: "Fatima Bibi",
      companyName: "Bibi Express Fleet",
      email: "fatima@bibiexpress.de",
      phone: "+49 30 5678901",
      cities: ["Berlin"],
      platforms: ["Uber Eats", "Wolt"],
      riders: 28,
      monthlyOrders: 7200,
      status: "on-hold",
      joinedDate: "May 2025",
    },
    {
      id: "fo6",
      ownerName: "Usman Malik",
      companyName: "Malik Logistics GmbH",
      email: "usman@maliklogistics.de",
      phone: "+49 40 6789012",
      cities: ["Hamburg"],
      platforms: ["Flink", "Wolt"],
      riders: 52,
      monthlyOrders: 15600,
      status: "active",
      joinedDate: "Dec 2024",
    },
    {
      id: "fo7",
      ownerName: "Zainab Ali",
      companyName: "ZA Fleet Management",
      email: "zainab@zafleet.de",
      phone: "+49 89 7890123",
      cities: ["Munich"],
      platforms: ["Uber Eats"],
      riders: 38,
      monthlyOrders: 10100,
      status: "active",
      joinedDate: "Jan 2025",
    },
    {
      id: "fo8",
      ownerName: "Rashid Ahmed",
      companyName: "Rashid Delivery Services",
      email: "rashid@rashiddelivery.de",
      phone: "+49 30 8901234",
      cities: ["Berlin", "Leipzig"],
      platforms: ["Lieferando", "Wolt"],
      riders: 45,
      monthlyOrders: 13300,
      status: "suspended",
      joinedDate: "Mar 2025",
    },
  ],
  T2 = [
    {
      id: "frankfurt",
      name: "Frankfurt",
      lat: 50.11,
      lng: 8.68,
      stage: "pilot",
      status: "live pilot",
      riders: 91,
      monthlyOrders: 18400,
      platforms: ["Uber Eats", "Wolt", "Lieferando"],
      apiCoverage: 33,
    },
    {
      id: "berlin",
      name: "Berlin",
      lat: 52.52,
      lng: 13.4,
      stage: "phase1",
      status: "prototype data",
      riders: 186,
      monthlyOrders: 48200,
      platforms: ["Uber Eats", "Wolt", "Lieferando"],
      apiCoverage: 67,
    },
    {
      id: "munich",
      name: "Munich",
      lat: 48.14,
      lng: 11.58,
      stage: "phase1",
      status: "prototype data",
      riders: 76,
      monthlyOrders: 16900,
      platforms: ["Uber Eats"],
      apiCoverage: 33,
    },
    {
      id: "hamburg",
      name: "Hamburg",
      lat: 53.55,
      lng: 9.99,
      stage: "phase1",
      status: "prototype data",
      riders: 94,
      monthlyOrders: 21600,
      platforms: ["Uber Eats", "Wolt"],
      apiCoverage: 50,
    },
    {
      id: "cologne",
      name: "Cologne",
      lat: 50.94,
      lng: 6.96,
      stage: "phase1",
      status: "prototype data",
      riders: 42,
      monthlyOrders: 8400,
      platforms: ["Wolt"],
      apiCoverage: 33,
    },
    {
      id: "dusseldorf",
      name: "D\xFCsseldorf",
      lat: 51.23,
      lng: 6.78,
      stage: "phase1",
      status: "planned",
      riders: 0,
      monthlyOrders: 0,
      platforms: [],
      apiCoverage: 0,
    },
    {
      id: "bonn",
      name: "Bonn",
      lat: 50.74,
      lng: 7.1,
      stage: "phase2",
      status: "planned",
      riders: 0,
      monthlyOrders: 0,
      platforms: [],
      apiCoverage: 0,
    },
    {
      id: "duisburg",
      name: "Duisburg",
      lat: 51.43,
      lng: 6.76,
      stage: "phase2",
      status: "planned",
      riders: 0,
      monthlyOrders: 0,
      platforms: [],
      apiCoverage: 0,
    },
    {
      id: "stuttgart",
      name: "Stuttgart",
      lat: 48.78,
      lng: 9.18,
      stage: "other",
      status: "prototype data",
      riders: 64,
      monthlyOrders: 13100,
      platforms: ["Flink"],
      apiCoverage: 25,
    },
    {
      id: "leipzig",
      name: "Leipzig",
      lat: 51.34,
      lng: 12.37,
      stage: "other",
      status: "prototype data",
      riders: 31,
      monthlyOrders: 5100,
      platforms: ["Lieferando"],
      apiCoverage: 33,
    },
    {
      id: "dresden",
      name: "Dresden",
      lat: 51.05,
      lng: 13.74,
      stage: "other",
      status: "prototype data",
      riders: 28,
      monthlyOrders: 4800,
      platforms: ["Lieferando"],
      apiCoverage: 33,
    },
  ],
  tn = [
    {
      id: "uber_eats",
      name: "Uber Eats",
      platform: "uber_eats",
      dataChannel: "Supplier portal report (CSV); supplier API to be requested",
      status: "report import",
      health: 96,
      lastSync: "Today 06:00",
      uptime: null,
      responseTime: "batch",
      note: "Uber publishes a Supplier Performance Data API for fleet suppliers; coverage of German Eats couriers must be confirmed.",
    },
    {
      id: "wolt",
      name: "Wolt",
      platform: "wolt",
      dataChannel: "Partner report (CSV); event feed to be agreed",
      status: "agreement pending",
      health: 0,
      lastSync: "\u2014",
      uptime: null,
      responseTime: "\u2014",
      note: "Public Wolt Drive API is for merchants; a fleet feed must be agreed.",
    },
    {
      id: "lieferando",
      name: "Lieferando",
      platform: "lieferando",
      dataChannel: "Partner report (CSV)",
      status: "agreement pending",
      health: 0,
      lastSync: "\u2014",
      uptime: null,
      responseTime: "\u2014",
      note: "Public developer portal covers restaurant POS integration only.",
    },
    {
      id: "alnaif",
      name: "Alnaif workforce roster",
      dataChannel: "Roster CSV, daily",
      status: "report import",
      health: 92,
      lastSync: "Today 09:40",
      uptime: null,
      responseTime: "batch",
      note: "Attendance, replacements and onboarding status.",
    },
    {
      id: "amazon",
      name: "Amazon (prototype)",
      dataChannel: "Delivery Service API",
      status: "prototype",
      health: 96,
      lastSync: "1 min ago",
      uptime: 99.8,
      responseTime: "89ms",
      note: "Carried over from the prototype; not part of the EELS food plan.",
    },
    {
      id: "flink",
      name: "Flink (prototype)",
      dataChannel: "Grocery Delivery API",
      status: "prototype",
      health: 91,
      lastSync: "8 min ago",
      uptime: 98.7,
      responseTime: "221ms",
      note: "Carried over from the prototype; not part of the EELS food plan.",
    },
  ],
  M5 = [
    {
      name: "Anna M\xFCller",
      email: "admin@eels.de",
      role: "Operations Admin",
      lastActive: "Now",
    },
    {
      name: "Tobias Lang",
      email: "shiftlead@eels.de",
      role: "Shift Lead",
      lastActive: "4 min ago",
    },
    {
      name: "Katrin Becker",
      email: "k.becker@eels.de",
      role: "Shift Lead",
      lastActive: "2 h ago",
    },
    {
      name: "Samir Nasser",
      email: "s.nasser@alnaif.de",
      role: "Alnaif coordinator (limited)",
      lastActive: "Today 16:58",
    },
    {
      name: "Ali Hassan",
      email: "compliance@eels.de",
      role: "Compliance Officer",
      lastActive: "Yesterday",
    },
  ],
  _0 = [
    {
      area: "Live operations and escalations",
      roles: {
        Executive: "view",
        "Ops Admin": "full",
        "Shift Lead": "full",
        "Fleet Owner": "view",
        HR: "none",
        Compliance: "none",
        Payroll: "none",
      },
    },
    {
      area: "Driver records and documents",
      roles: {
        Executive: "view",
        "Ops Admin": "full",
        "Shift Lead": "view",
        "Fleet Owner": "view",
        HR: "full",
        Compliance: "view",
        Payroll: "view",
      },
    },
    {
      area: "Driver performance reviews",
      roles: {
        Executive: "view",
        "Ops Admin": "full",
        "Shift Lead": "view",
        "Fleet Owner": "none",
        HR: "full",
        Compliance: "view",
        Payroll: "none",
      },
    },
    {
      area: "Payroll and wages",
      roles: {
        Executive: "view",
        "Ops Admin": "view",
        "Shift Lead": "none",
        "Fleet Owner": "none",
        HR: "view",
        Compliance: "view",
        Payroll: "full",
      },
    },
    {
      area: "KPI definitions and targets",
      roles: {
        Executive: "full",
        "Ops Admin": "full",
        "Shift Lead": "view",
        "Fleet Owner": "none",
        HR: "none",
        Compliance: "view",
        Payroll: "none",
      },
    },
    {
      area: "API keys and integrations",
      roles: {
        Executive: "view",
        "Ops Admin": "full",
        "Shift Lead": "none",
        "Fleet Owner": "none",
        HR: "none",
        Compliance: "none",
        Payroll: "none",
      },
    },
    {
      area: "Audit export",
      roles: {
        Executive: "full",
        "Ops Admin": "full",
        "Shift Lead": "none",
        "Fleet Owner": "none",
        HR: "none",
        Compliance: "full",
        Payroll: "full",
      },
    },
  ],
  b5 = [
    {
      task: "Platform relationships and commercial terms",
      eels: "Owns",
      alnaif: "\u2014",
      platform: "Counterparty",
    },
    {
      task: "City and zone capacity plans",
      eels: "Owns",
      alnaif: "Consulted",
      platform: "Shares demand data (to agree)",
    },
    {
      task: "Recruitment and workforce availability",
      eels: "Approves",
      alnaif: "Owns",
      platform: "\u2014",
    },
    {
      task: "Shift confirmation and replacements",
      eels: "Informed",
      alnaif: "Owns",
      platform: "\u2014",
    },
    {
      task: "Vehicles, gear, maintenance, facilities",
      eels: "Owns",
      alnaif: "Follows up readiness",
      platform: "\u2014",
    },
    {
      task: "Onboarding and app training",
      eels: "Supports",
      alnaif: "Owns",
      platform: "Provides app access",
    },
    {
      task: "Live coverage and at-risk orders",
      eels: "Owns (shift lead)",
      alnaif: "Supports",
      platform: "Controls assignment and delivery areas",
    },
    {
      task: "Platform escalation and support tickets",
      eels: "Owns",
      alnaif: "\u2014",
      platform: "Resolves",
    },
    {
      task: "Performance reporting and KPI definitions",
      eels: "Owns",
      alnaif: "Informed",
      platform: "Agrees definitions",
    },
    {
      task: "Attendance, coaching and retention",
      eels: "Consulted",
      alnaif: "Owns",
      platform: "\u2014",
    },
    {
      task: "Payroll, contracts and compliance evidence",
      eels: "Owns (as employer, to confirm)",
      alnaif: "Provides records",
      platform: "May audit",
    },
    {
      task: "Profitability and direct costs",
      eels: "Owns",
      alnaif: "Informed",
      platform: "\u2014",
    },
  ],
  Cl = [
    "Partner acceptance and operating scope",
    "Commercial terms and payment schedule",
    "Named EELS and Alnaif owners for staffing, equipment, incidents, reporting",
    "Written KPI definition, target and reporting window",
    "Authorised data access (reports or live feed)",
    "Escalation contacts and support process",
    "Who may change delivery areas and reassign orders during peaks",
  ],
  w5 = [
    {
      item: "Insulated delivery bags",
      inUse: 91,
      spare: 14,
      reorderAt: 10,
    },
    {
      item: "Secure carriers and bottle holders",
      inUse: 62,
      spare: 9,
      reorderAt: 8,
    },
    {
      item: "Helmets",
      inUse: 91,
      spare: 6,
      reorderAt: 8,
    },
    {
      item: "Reflective jackets",
      inUse: 91,
      spare: 12,
      reorderAt: 10,
    },
    {
      item: "Rain gear sets",
      inUse: 88,
      spare: 4,
      reorderAt: 10,
    },
    {
      item: "Gloves (seasonal)",
      inUse: 40,
      spare: 30,
      reorderAt: 15,
    },
    {
      item: "Phone mounts",
      inUse: 91,
      spare: 11,
      reorderAt: 8,
    },
    {
      item: "Power banks",
      inUse: 85,
      spare: 3,
      reorderAt: 10,
    },
    {
      item: "Spare e-bike batteries",
      inUse: 0,
      spare: 5,
      reorderAt: 6,
    },
    {
      item: "Cleaning kits",
      inUse: 91,
      spare: 25,
      reorderAt: 20,
    },
  ],
  W2 = [
    {
      name: "Raunheim logistics base",
      services:
        "Vehicle storage, maintenance bay, battery charging, lockers, rest area, toilets, water",
      hours: "06:00-24:00",
    },
    {
      name: "Frankfurt city hub (to be confirmed)",
      services: "Charging points, rest area, water, toilets, spare equipment",
      hours: "10:30-23:45",
    },
  ];
function Fe(t) {
  let e = [],
    a = {
      driverId: t.id,
      driverName: t.name,
    },
    r = gi(t.workPermitExpiry, Be);
  r !== null && r < 0
    ? e.push({
        ...a,
        issue: "Work permit expired",
        detail: `Expired ${t.workPermitExpiry}. Do not roster until renewed.`,
        severity: "High",
        rule: "Right to work",
        due: "Immediately",
      })
    : r !== null &&
      r <= 30 &&
      e.push({
        ...a,
        issue: "Work permit expiring",
        detail: `Expires ${t.workPermitExpiry} (${r} days)`,
        severity: "Medium",
        rule: "Right to work",
        due: t.workPermitExpiry,
      });
  let n = y2(t.hourlyRate, Be);
  if (
    (n.ok ||
      e.push({
        ...a,
        issue: "Below statutory minimum wage",
        detail: `\u20AC${t.hourlyRate.toFixed(2)}/h against \u20AC${n.minimum.toFixed(2)}/h`,
        severity: "High",
        rule: "Mindestlohn 2026",
        due: "Before payroll run",
      }),
    t.employmentType === "Mini-job")
  ) {
    let o = kl(t.monthlyEarnings, 2026);
    o.state === "breach"
      ? e.push({
          ...a,
          issue: "Mini-job limit exceeded",
          detail: `\u20AC${t.monthlyEarnings} this month against \u20AC${o.limit}`,
          severity: "High",
          rule: "Minijob limit 2026",
          due: "Before payroll run",
        })
      : o.state === "warning" &&
        e.push({
          ...a,
          issue: "Mini-job limit nearly reached",
          detail: `\u20AC${t.monthlyEarnings} of \u20AC${o.limit} (${Math.round(o.share * 100)}%)`,
          severity: "Medium",
          rule: "Minijob limit 2026",
          due: "Before next roster",
        });
  }
  let i = gi(t.contractEnd, Be);
  return (
    i !== null &&
      i <= 180 &&
      e.push({
        ...a,
        issue: "Fixed-term contract ending",
        detail: `Ends ${t.contractEnd}; decide on renewal`,
        severity: "Low",
        rule: "Contract management",
        due: t.contractEnd,
      }),
    t.shiftEnd - t.shiftStart > 360 &&
      t.breakMinutes < 30 &&
      e.push({
        ...a,
        issue: "Break not planned",
        detail: "Shift over 6 hours needs at least 30 minutes break",
        severity: "Medium",
        rule: "ArbZG section 4",
        due: "Today",
      }),
    e
  );
}
function Gd(t) {
  let e = Fe(t).reduce(
    (a, r) =>
      a + (r.severity === "High" ? 35 : r.severity === "Medium" ? 12 : 4),
    0,
  );
  return Math.max(0, 100 - e);
}
function O2(t) {
  let e = gi(t.workPermitExpiry, Be),
    a = [
      {
        name: "ID document",
        status: "verified",
        date: `Onboarded ${t.joined}`,
      },
      {
        name: "Work permit / right to work",
        status:
          t.workPermitExpiry === null
            ? "verified"
            : e < 0
              ? "expired"
              : e <= 30
                ? "expiring"
                : "verified",
        date: t.workPermitExpiry
          ? `Valid until ${t.workPermitExpiry}`
          : "EU citizen, no permit needed",
      },
      {
        name: "Employment contract",
        status: "verified",
        date: `${t.contractType}${t.contractEnd ? ` until ${t.contractEnd}` : ""}`,
      },
      {
        name: "Tax ID and social security number",
        status: Number(t.id.slice(1)) % 7 === 0 ? "pending" : "verified",
        date: Number(t.id.slice(1)) % 7 === 0 ? "Requested" : "On file",
      },
      {
        name: "Health insurance confirmation",
        status: "verified",
        date: "On file",
      },
    ];
  return (
    (t.vehicleType === "car" || t.vehicleType === "scooter") &&
      a.push({
        name: "Driving licence check",
        status: Number(t.id.slice(1)) % 5 === 0 ? "pending" : "verified",
        date: "Checked every 6 months",
      }),
    a.push({
      name: "Safety briefing and app training",
      status: "verified",
      date: `Completed ${t.joined}`,
    }),
    a
  );
}
function Sl(t) {
  let e = t.hoursPerWeek * 4.33,
    a = Fe(t).filter((i) => i.severity === "High"),
    r = (i) => Math.round(e * (i === 2 ? 0.55 : 1)),
    n = (i) =>
      t.employmentType === "Mini-job" && t.monthlyEarnings
        ? Math.min(t.monthlyEarnings, i * t.hourlyRate)
        : i * t.hourlyRate;
  return [
    {
      month: "Jul 2026",
      hours: r(0),
      gross: n(r(0)),
      status: "approved",
      note: "Paid",
    },
    {
      month: "Aug 2026",
      hours: r(1),
      gross: n(r(1)),
      status: "approved",
      note: "Paid",
    },
    {
      month: "Sep 2026 (to date)",
      hours: r(2),
      gross: t.employmentType === "Mini-job" ? t.monthlyEarnings : n(r(2)),
      status: a.length ? "blocked" : "pending",
      note: a.length
        ? a.map((i) => i.issue).join("; ")
        : "Awaiting month close",
    },
  ];
}
function AdminPage() {
  let t = jt(),
    e = useOpsStore(),
    a = readPilotModel(),
    [r, n] = T0.useState(M5),
    [i, o] = T0.useState({
      name: "",
      email: "",
    }),
    l = e.actions.filter((s) => s.status === "open"),
    d = t.driverStates.filter((s) => s.activity === "blocked"),
    c = a.drivers.flatMap(Fe).filter((s) => s.severity === "High"),
    g = a.drivers
      .flatMap((s) =>
        a.driverHistory[s.id].flags.map((f) => `${s.id}:${f.orderId}`),
      )
      .filter((s) => !e.flagReviews[s]),
    p = [
      ...e.escalations.map((s) => ({
        at: s.at,
        text: `Escalated ${s.orderId}: ${s.cause}`,
        by: s.by,
      })),
      ...Object.entries(e.readiness).map(([s, f]) => ({
        at: f.at,
        text: `Readiness check ${f.passed ? "passed" : "failed"} for ${a.drivers.find((x) => x.id === s)?.name}`,
        by: f.by,
      })),
      ...Object.entries(e.moves).map(([s, f]) => ({
        at: f.at,
        text: `Repositioned ${a.drivers.find((x) => x.id === s)?.name}`,
        by: "Shift lead",
      })),
      ...e.actions
        .filter((s) => s.createdAt > 0)
        .map((s) => ({
          at: s.createdAt,
          text: `Action created: ${s.title}`,
          by: s.owner,
        })),
    ].sort((s, f) => f.at - s.at),
    u = {
      full: "good",
      view: "info",
      none: "neutral",
    };
  return (
    <J.Fragment>
      <PageHeader
        eyebrow="Administration"
        title="Admin Panel"
        description="Work queue, approvals, activity, API health, users and permissions."
      />
      <div className="grid g4">
        <Stat
          label="Open corrective actions"
          value={l.length}
          foot=<Link to="/ops">{"Control tower"}</Link>
        />
        <Stat
          label="Drivers blocked now"
          value={d.length}
          tone={d.length ? "warn" : void 0}
          foot=<Link to="/readiness">{"Readiness"}</Link>
        />
        <Stat
          label="High compliance items"
          value={c.length}
          tone={c.length ? "crit" : "good"}
          foot=<Link to="/compliance">{"Compliance"}</Link>
        />
        <Stat
          label="Records awaiting review"
          value={g.length}
          foot=<Link to="/performance">{"Fair performance"}</Link>
        />
      </div>
      <div className="grid g2">
        <Card title="Work queue" flush={!0}>
          <table className="table">
            <thead>
              <tr>
                <th>{"Item"}</th>
                <th>{"Priority"}</th>
                <th>{"Assignee"}</th>
                <th>{"Due"}</th>
              </tr>
            </thead>
            <tbody>
              {c.map((s) => (
                <tr key={`${s.driverId}-${s.issue}`}>
                  <td>
                    {s.issue}
                    {": "}
                    {s.driverName}
                  </td>
                  <td>
                    <Badge tone="crit">{"High"}</Badge>
                  </td>
                  <td>{"Compliance"}</td>
                  <td className="small">{s.due}</td>
                </tr>
              ))}
              {l.map((s) => (
                <tr key={s.id}>
                  <td>{s.title}</td>
                  <td>
                    <Badge tone="warn">{"Medium"}</Badge>
                  </td>
                  <td className="small">{s.owner}</td>
                  <td className="small">{s.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="Recent activity" sub="Actions taken in this portal">
          <div className="stack-sm">
            {p.length === 0 && (
              <p className="small muted">
                {
                  "Nothing recorded yet today. Escalations, checks and moves appear here."
                }
              </p>
            )}
            {p.slice(0, 10).map((s, f) => (
              <div className="row between small" key={f}>
                <span>{s.text}</span>
                <span className="muted nowrap">
                  {V(s.at)}
                  {" · "}
                  {s.by}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid g2">
        <Card title="API monitor" flush={!0}>
          <table className="table">
            <thead>
              <tr>
                <th>{"Source"}</th>
                <th>{"Status"}</th>
                <th className="num">{"Health"}</th>
                <th className="num">{"Uptime"}</th>
                <th className="num">{"Response"}</th>
              </tr>
            </thead>
            <tbody>
              {tn.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>
                    <Badge
                      tone={
                        s.status === "report import"
                          ? "info"
                          : s.status === "agreement pending"
                            ? "warn"
                            : "neutral"
                      }
                    >
                      {s.status}
                    </Badge>
                  </td>
                  <td className="num">
                    {s.health ? `${s.health}%` : "\u2014"}
                  </td>
                  <td className="num">
                    {s.uptime ? `${s.uptime}%` : "\u2014"}
                  </td>
                  <td className="num">{s.responseTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="Admin user management">
          <div className="stack-sm">
            {r.map((s) => (
              <div className="row between" key={s.email}>
                <span>
                  <span className="bold">{s.name}</span>
                  <span className="small muted">
                    {" "}
                    {"· "}
                    {s.email}
                    {" · "}
                    {s.role}
                  </span>
                </span>
                <span className="row">
                  <span className="xsmall muted">{s.lastActive}</span>
                  <button
                    className="icon-btn"
                    aria-label={`Remove ${s.name}`}
                    onClick={() => n(r.filter((f) => f.email !== s.email))}
                  >
                    <Vd size={13} />
                  </button>
                </span>
              </div>
            ))}
            <div
              className="row wrap"
              style={{
                marginTop: 6,
              }}
            >
              <input
                id="nu-name"
                className="input"
                placeholder="Name"
                aria-label="Name"
                value={i.name}
                onChange={(s) =>
                  o({
                    ...i,
                    name: s.target.value,
                  })
                }
              />
              <input
                id="nu-email"
                className="input"
                placeholder="Email"
                aria-label="Email"
                value={i.email}
                onChange={(s) =>
                  o({
                    ...i,
                    email: s.target.value,
                  })
                }
              />
              <Button
                disabled={!i.name || !i.email.includes("@")}
                onClick={() => {
                  (n([
                    ...r,
                    {
                      ...i,
                      role: "Operations Admin",
                      lastActive: "Invited",
                    },
                  ]),
                    o({
                      name: "",
                      email: "",
                    }));
                }}
              >
                <Fr size={13} />
                {" Add admin"}
              </Button>
            </div>
            <p className="xsmall muted">
              {
                "Demo only: real invitations need the release 2 identity service."
              }
            </p>
          </div>
        </Card>
      </div>
      <Card title="Permissions matrix" flush={!0}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{"Area"}</th>
                {Object.keys(_0[0].roles).map((s) => (
                  <th key={s}>{s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {_0.map((s) => (
                <tr key={s.area}>
                  <td className="bold">{s.area}</td>
                  {Object.entries(s.roles).map(([f, x]) => (
                    <td key={f}>
                      <Badge tone={u[x]}>{x}</Badge>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </J.Fragment>
  );
}
export { AdminPage, Cl, Fe, Gd, L5, O2, Sl, T2, W2, b5, tn, w5 };
