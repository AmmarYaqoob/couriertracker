// Driver readiness.
import * as rc from "react";
import * as dt from "react/jsx-runtime";
import {
  opsStore,
  useOpsStore,
  V,
  useSimClock,
  jt,
  mt,
  useToast,
  ra,
  rt,
  readPilotModel,
} from "../services/portalState.jsx";
import {
  Badge,
  SegmentedControl,
  Card,
  Stat,
  Field,
  Toast,
  PageHeader,
  Drawer,
  Button,
} from "../components/ui.jsx";
import { Zr, n2 } from "../components/icons.jsx";
import { W2 } from "./AdminPage.jsx";
var rp = [
  {
    id: "attendance",
    label: "Attendance confirmed and on time",
  },
  {
    id: "zone",
    label: "Assigned zone and platform confirmed",
  },
  {
    id: "vehicle",
    label: "Vehicle condition: brakes, lights, tyres",
  },
  {
    id: "battery",
    label: "Battery or fuel sufficient for the shift",
  },
  {
    id: "phone",
    label: "Phone connected, platform app logged in",
  },
  {
    id: "powerBank",
    label: "Power bank charged, phone mount fitted",
  },
  {
    id: "bag",
    label: "Delivery bag clean and intact",
  },
  {
    id: "gear",
    label: "Helmet, reflective and weather gear",
  },
  {
    id: "support",
    label: "Knows the shift lead and support contacts",
  },
];
function ReadinessPage() {
  let t = readPilotModel(),
    e = jt(),
    a = useOpsStore(),
    { now: r } = useSimClock(),
    [n, i] = useToast(),
    [o, l] = rc.useState(null),
    [d, c] = rc.useState("attention"),
    g = (M) => {
      if (M.shiftStart - r > 30)
        return {
          status: "later",
          detail: `Shift starts ${V(M.shiftStart)}`,
        };
      if (M.noShow && r >= M.shiftStart)
        return {
          status: "no_show",
          detail: `Ask ${M.alnaifCoordinator} for a replacement`,
        };
      let h = a.readiness[M.id];
      if (h)
        return h.passed
          ? {
              status: "cleared",
              detail: `Checked ${V(h.at)} by ${h.by}`,
            }
          : {
              status: "blocked",
              detail: h.issue ?? "Check failed",
            };
      if (M.readinessPassed === null)
        return {
          status: "pending",
          detail: "Check not done yet",
        };
      if (M.readinessPassed === !1) {
        let m = t.unblockAt[M.id];
        return m !== void 0 && r >= m
          ? {
              status: "cleared",
              detail: `Issue fixed ${V(m)} (${M.readinessIssue})`,
            }
          : {
              status: "blocked",
              detail: M.readinessIssue ?? "Check failed",
            };
      }
      return {
        status: "cleared",
        detail: `Checked ${V(M.shiftStart + M.lateStartMin - 3)}`,
      };
    },
    p = t.drivers.filter((M) => M.shiftEnd > r),
    u = p
      .map((M) => ({
        d: M,
        ...g(M),
      }))
      .filter(
        (M) =>
          d === "all" || ["blocked", "pending", "no_show"].includes(M.status),
      ),
    s = (M) => p.map(g).filter((h) => h.status === M).length,
    f = {
      cleared: "good",
      blocked: "crit",
      pending: "warn",
      no_show: "crit",
      later: "neutral",
    },
    x = {
      cleared: "Cleared",
      blocked: "Blocked",
      pending: "Not checked",
      no_show: "No-show",
      later: "Later shift",
    };
  return dt.jsxs(dt.Fragment, {
    children: [
      <PageHeader
        eyebrow="Shift readiness"
        title="Driver Readiness"
        description="Before each shift: confirm attendance and zone, check vehicle condition, battery or fuel, connectivity, bag and gear. A driver is counted as available only after every check passes."
      />,
      <div className="grid g4">
        <Stat
          label="Cleared to ride"
          value={s("cleared")}
          tone="good"
          foot={`of ${p.filter((M) => M.shiftStart - r <= 30).length} starting by ${V(r + 30)}`}
        />
        <Stat
          label="Blocked by a failed check"
          value={s("blocked")}
          tone={s("blocked") ? "crit" : void 0}
          foot="Not counted as capacity"
        />
        <Stat
          label="Check not done"
          value={s("pending")}
          tone={s("pending") ? "warn" : void 0}
          foot="Not counted until checked"
        />
        <Stat
          label="No-shows"
          value={s("no_show")}
          tone={s("no_show") ? "crit" : void 0}
          foot="Replacement via Alnaif"
        />
      </div>,
      <Card
        title="Pre-shift checks"
        actions=<SegmentedControl
          value={d}
          onChange={c}
          options={[
            {
              value: "attention",
              label: "Needs attention",
            },
            {
              value: "all",
              label: "All drivers today",
            },
          ]}
        />
        flush={!0}
      >
        <div className="table-wrap table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>{"Driver"}</th>
                <th>{"Shift"}</th>
                <th>{"Zone · platform"}</th>
                <th>{"Vehicle"}</th>
                <th>{"Status"}</th>
                <th>{"Detail"}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {u.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty">
                    <Zr />
                    {" Every driver on shift is cleared."}
                  </td>
                </tr>
              )}
              {u.map(({ d: M, status: h, detail: m }) => (
                <tr key={M.id}>
                  <td>
                    <div className="bold">{M.name}</div>
                    <div className="xsmall muted">
                      {M.id}
                      {" · "}
                      {M.employmentType}
                    </div>
                  </td>
                  <td className="num">
                    {V(M.shiftStart)}
                    {"–"}
                    {V(M.shiftEnd)}
                  </td>
                  <td>
                    {rt(M.homeZoneId)}
                    {" · "}
                    {mt[M.platform]}
                  </td>
                  <td>{ra[M.vehicleType]}</td>
                  <td>
                    <Badge tone={f[h]}>{x[h]}</Badge>
                  </td>
                  <td className="small text-2">{m}</td>
                  <td className="right">
                    {h !== "no_show" && h !== "later" && (
                      <Button
                        size="sm"
                        variant={h === "cleared" ? void 0 : "primary"}
                        onClick={() => l(M)}
                      >
                        {h === "cleared" ? "Re-check" : "Run check"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>,
      <div className="grid g2">
        <Card
          title="Breakdown response"
          sub="When equipment fails during a shift"
        >
          <ol
            className="stack-sm"
            style={{
              margin: 0,
              paddingLeft: 18,
            }}
          >
            <li>
              {
                "The driver reports the issue safely and stops riding if unsafe."
              }
            </li>
            <li>
              {
                "The shift lead marks the driver unavailable, so zone capacity updates immediately."
              }
            </li>
            <li>
              {
                "Arrange a replacement vehicle from the reserve pool or a repair."
              }
            </li>
            <li>
              {
                "Contact platform support when an active order is affected, and note the support reference."
              }
            </li>
            <li>
              {
                "Record downtime and cause on the Fleet & Equipment page for follow-up."
              }
            </li>
          </ol>
          <p
            className="small muted"
            style={{
              marginTop: 8,
            }}
          >
            {"Currently not riding: "}
            {e.driverStates.filter((M) => M.activity === "blocked").length}
            {" drivers."}
          </p>
        </Card>
        <Card title="Driver facilities" sub="Defined per operating hub">
          <div className="stack-sm">
            {W2.map((M) => (
              <div className="alert-item" key={M.name}>
                <div className="grow">
                  <div className="t">{M.name}</div>
                  <div className="d">{M.services}</div>
                </div>
                <Badge tone="outline">{M.hours}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>,
      o && (
        <Rb
          driver={o}
          onClose={() => l(null)}
          onSaved={(M) => {
            (i(
              M
                ? `${o.name} cleared and counted as available`
                : `${o.name} blocked until the issue is fixed`,
            ),
              l(null));
          }}
        />
      ),
      <Toast message={n} />,
    ],
  });
}
function Rb({ driver: t, onClose: e, onSaved: a }) {
  let { now: r } = useSimClock(),
    [n, i] = rc.useState({}),
    [o, l] = rc.useState(t.readinessIssue ?? ""),
    d = rp.every((c) => n[c.id]);
  return (
    <Drawer
      title={`Pre-shift check: ${t.name}`}
      onClose={e}
      footer={dt.jsxs(dt.Fragment, {
        children: [
          <Button onClick={e}>{"Cancel"}</Button>,
          <Button
            variant={d ? "primary" : "danger"}
            onClick={() => {
              (opsStore.set((c) => ({
                readiness: {
                  ...c.readiness,
                  [t.id]: {
                    passed: d,
                    items: n,
                    issue: d ? void 0 : o || "One or more checks failed",
                    at: r,
                    by: "Shift lead",
                  },
                },
              })),
                a(d));
            }}
          >
            {d
              ? dt.jsxs(dt.Fragment, {
                  children: [<Zr size={14} />, " Clear to ride"],
                })
              : dt.jsxs(dt.Fragment, {
                  children: [
                    dt.jsx(n2, {
                      size: 14,
                    }),
                    " Block and record issue",
                  ],
                })}
          </Button>,
        ],
      })}
    >
      <p className="small text-2">
        {ra[t.vehicleType]} {t.vehicleId}
        {" · "}
        {rt(t.homeZoneId)}
        {" · shift "}
        {V(t.shiftStart)}
        {"–"}
        {V(t.shiftEnd)}
      </p>
      <div className="stack-sm">
        {rp.map((c) => (
          <label className="check" key={c.id}>
            <input
              type="checkbox"
              id={`chk-${c.id}`}
              checked={!!n[c.id]}
              onChange={(g) =>
                i({
                  ...n,
                  [c.id]: g.target.checked,
                })
              }
            />
            {c.label}
          </label>
        ))}
      </div>
      <Button
        size="sm"
        onClick={() => i(Object.fromEntries(rp.map((c) => [c.id, !0])))}
      >
        {"Mark all as checked"}
      </Button>
      {!d && (
        <Field
          id="chk-issue"
          label="Issue found (a defect ticket is opened for vehicle problems)"
        >
          <input
            id="chk-issue"
            className="input"
            value={o}
            onChange={(c) => l(c.target.value)}
            placeholder="e.g. Rear light broken"
          />
        </Field>
      )}
    </Drawer>
  );
}
export { ReadinessPage };
