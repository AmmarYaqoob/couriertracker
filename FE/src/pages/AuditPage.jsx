// Audit page.
import * as ro from "react";
import * as Ht from "react/jsx-runtime";
import {
  useOpsStore,
  V,
  jt,
  me,
  mt,
  useToast,
  rt,
  readPilotModel,
} from "../services/portalState.jsx";
import { Fe, O2, Sl } from "./AdminPage.jsx";
import { $5, downloadTextFile } from "../api/mockApi.jsx";
import {
  Badge,
  Card,
  Field,
  Toast,
  PageHeader,
  Button,
} from "../components/ui.jsx";
import { c2, xr } from "../components/icons.jsx";
var K5 = [
  {
    id: "contracts",
    label: "Employment contracts and documents",
  },
  {
    id: "time",
    label: "Time records and breaks",
  },
  {
    id: "payroll",
    label: "Payroll and minimum-wage check",
  },
  {
    id: "compliance",
    label: "Compliance findings",
  },
  {
    id: "kpi",
    label: "KPI definitions and daily scores",
  },
  {
    id: "orders",
    label: "Order outcomes and delay causes",
  },
  {
    id: "cancellations",
    label: "Cancellation log",
  },
  {
    id: "readiness",
    label: "Readiness checks and escalations",
  },
];
function AuditPage() {
  let t = readPilotModel(),
    e = jt(),
    a = useOpsStore(),
    [r, n] = useToast(),
    [i, o] = ro.useState(Object.fromEntries(K5.map((L) => [L.id, !0]))),
    [l, d] = ro.useState("all"),
    [c, g] = ro.useState("json"),
    [p, u] = ro.useState("2026-09-01"),
    [s, f] = ro.useState("2026-09-16"),
    [x, M] = ro.useState([]),
    h = t.drivers.filter((L) => l === "all" || L.platform === l),
    m = e.visible.filter((L) => l === "all" || L.platform === l),
    y = () => {
      let L = {
        generatedAt: new Date().toISOString(),
        period: {
          from: p,
          to: s,
        },
        scope: l === "all" ? "All platforms" : mt[l],
        company: "EELS GmbH, Raunheim (Frankfurt pilot)",
        note: "Prototype export built from simulated pilot data.",
      };
      return (
        i.contracts &&
          (L.contracts = h.map((w) => ({
            riderId: w.id,
            name: w.name,
            employmentType: w.employmentType,
            contract: w.contractType,
            contractEnd: w.contractEnd,
            documents: O2(w),
          }))),
        i.time &&
          (L.timeRecords = h.map((w) => ({
            riderId: w.id,
            date: "2026-09-16",
            plannedStart: V(w.shiftStart),
            actualStart: w.noShow ? null : V(w.shiftStart + w.lateStartMin),
            end: V(w.shiftEnd),
            breakStart: w.breakMinutes ? V(w.breakStart) : null,
            breakMinutes: w.breakMinutes,
            noShow: w.noShow,
          }))),
        i.payroll &&
          (L.payroll = h.map((w) => ({
            riderId: w.id,
            hourlyRate: w.hourlyRate,
            months: Sl(w),
          }))),
        i.compliance && (L.complianceFindings = h.flatMap(Fe)),
        i.kpi &&
          (L.kpi = {
            definitions: a.definitions,
            today: e.byDefinition.map((w) => ({
              id: w.def.id,
              onTime: w.score.num,
              units: w.score.den,
              pct: w.score.pct,
            })),
            cancellation: e.cancellation,
          }),
        i.orders &&
          (L.orders = m.map((w) => ({
            id: w.id,
            platform: w.platform,
            zone: rt(w.zoneId),
            created: V(w.createdAt),
            deadline: V(w.deadlineOriginal),
            delivered:
              w.actual.delivered !== void 0 && w.actual.delivered <= e.now
                ? V(w.actual.delivered)
                : null,
            cause: e.attributions.get(w.id)?.primaryCause ?? null,
          }))),
        i.cancellations &&
          (L.cancellations = [
            ...e.cancelled
              .filter((w) => l === "all" || w.platform === l)
              .map((w) => ({
                orderId: w.id,
                ...w.cancellation,
                at: V(w.cancellation.at),
              })),
            ...a.cancellations,
          ]),
        i.readiness &&
          (L.readinessAndEscalations = {
            readiness: a.readiness,
            escalations: a.escalations,
          }),
        L
      );
    },
    k = async () => {
      let L = y(),
        w,
        O;
      c === "json"
        ? ((w = `eels-audit-pack-${p}-to-${s}.json`),
          (O = JSON.stringify(L, null, 2)))
        : ((w = `eels-audit-orders-${p}-to-${s}.csv`),
          (O = $5(L.orders ?? [])));
      let A = await downloadTextFile(
        w,
        O,
        c === "json" ? "application/json" : "text/csv",
      );
      (M([
        {
          name: w,
          at: new Date().toLocaleTimeString(),
          size: O.length,
        },
        ...x,
      ]),
        n(A ? "Audit pack ready" : "Download was not allowed in this view"));
    };
  return (
    <Ht.Fragment>
      <PageHeader
        eyebrow="Evidence"
        title="Audit Export"
        description="One pack with contracts, time records, pay, compliance findings, KPI definitions and operational records, for partner audits, customs (FKS) checks or labour inspections."
      />
      <div className="grid g-2-1">
        <Card title="Export settings">
          <div className="stack">
            <div
              className="grid g3"
              style={{
                gap: 10,
              }}
            >
              <Field id="ae-from" label="From">
                <input
                  id="ae-from"
                  className="input"
                  type="date"
                  value={p}
                  onChange={(L) => u(L.target.value)}
                />
              </Field>
              <Field id="ae-to" label="To">
                <input
                  id="ae-to"
                  className="input"
                  type="date"
                  value={s}
                  onChange={(L) => f(L.target.value)}
                />
              </Field>
              <Field id="ae-platform" label="Platform scope">
                <select
                  id="ae-platform"
                  className="select"
                  value={l}
                  onChange={(L) => d(L.target.value)}
                >
                  <option value="all">{"All platforms"}</option>
                  {me.map((L) => (
                    <option value={L} key={L}>
                      {mt[L]}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="field-label">{"Document types"}</div>
            <div
              className="grid g2"
              style={{
                gap: 0,
              }}
            >
              {K5.map((L) => (
                <label className="check" key={L.id}>
                  <input
                    type="checkbox"
                    id={`ae-${L.id}`}
                    checked={!!i[L.id]}
                    onChange={(w) =>
                      o({
                        ...i,
                        [L.id]: w.target.checked,
                      })
                    }
                  />
                  {L.label}
                </label>
              ))}
            </div>
            <div className="row wrap">
              <Field id="ae-format" label="Format">
                <select
                  id="ae-format"
                  className="select"
                  value={c}
                  onChange={(L) => g(L.target.value)}
                >
                  <option value="json">{"Full pack (JSON)"}</option>
                  <option value="csv">{"Order outcomes (CSV)"}</option>
                </select>
              </Field>
              <div
                style={{
                  alignSelf: "flex-end",
                }}
              >
                <Button variant="primary" onClick={k}>
                  {Ht.jsx(c2, {
                    size: 15,
                  })}
                  {" Generate audit pack"}
                </Button>
              </div>
            </div>
          </div>
        </Card>
        <Card title="Pack contents">
          <div className="stack-sm small">
            <div className="row between">
              <span>{"Riders in scope"}</span>
              <b>{h.length}</b>
            </div>
            <div className="row between">
              <span>{"Orders today"}</span>
              <b>{m.length}</b>
            </div>
            <div className="row between">
              <span>{"Compliance findings"}</span>
              <b>{h.flatMap(Fe).length}</b>
            </div>
            <div className="row between">
              <span>{"Escalations recorded"}</span>
              <b>{a.escalations.length}</b>
            </div>
            <div className="divider" />
            <div className="field-label">{"Recent exports"}</div>
            {x.length === 0 && <span className="muted">{"None yet"}</span>}
            {x.map((L, w) => (
              <div className="row between" key={w}>
                <span className="mono xsmall">
                  {Ht.jsx(xr, {
                    size: 11,
                  })}{" "}
                  {L.name}
                </span>
                <Badge tone="good">
                  {(L.size / 1024).toFixed(0)}
                  {" KB"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Toast message={r} />
    </Ht.Fragment>
  );
}
export { AuditPage };
