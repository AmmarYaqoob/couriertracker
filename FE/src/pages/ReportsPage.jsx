// Reports and responsibilities pages (one bundle module).
import * as Ja from "react";
import * as Nt from "react/jsx-runtime";
import * as Dt from "react/jsx-runtime";
import {
  Ca,
  opsStore,
  useOpsStore,
  Yr,
  useSimClock,
  fi,
  me,
  mt,
} from "../services/portalState.jsx";
import {
  Badge,
  Card,
  Select,
  Modal,
  Field,
  PageHeader,
  Callout,
  Button,
} from "../components/ui.jsx";
import { Ak, dk, xr } from "../components/icons.jsx";
import { b5 } from "./AdminPage.jsx";
const REPORTS_API = "http://127.0.0.1:4000/api/reports";
const DIMENSION_FIELD = {
  platform: "platform",
  zone: "zone",
  restaurant: "restaurant",
  driver: "driver",
  delay_cause: "delayCause",
  hour: "hour",
  employment: "employment",
};
var Q2 = {
    platform: "Platform",
    zone: "Zone",
    restaurant: "Restaurant",
    driver: "Driver",
    delay_cause: "Delay Cause",
    hour: "Hour of Day",
    employment: "Employment Type",
  },
  jx = {
    orders: "Orders",
    delivered: "Delivered",
    on_time_pct: "On-Time %",
    late: "Late Count",
    avg_min: "Avg Delivery Minutes",
    revenue: "Revenue",
    cancellations: "Cancellations",
  };
var rn = () => ({
  orders: 0,
  delivered: 0,
  onTime: 0,
  late: 0,
  deliveryMinSum: 0,
  deliveryMinCount: 0,
  revenue: 0,
  cancellations: 0,
});
function addFact(bucket, row) {
  bucket.orders += 1;
  if (row.cancelled) bucket.cancellations += 1;
  if (!row.delivered) return;
  bucket.delivered += 1;
  bucket.revenue += row.revenue;
  if (row.onTime) bucket.onTime += 1;
  if (row.late) bucket.late += 1;
  if (typeof row.deliveryMinutes === "number") {
    bucket.deliveryMinSum += row.deliveryMinutes;
    bucket.deliveryMinCount += 1;
  }
}
function bi(t, e) {
  switch (e) {
    case "orders":
      return t.orders;
    case "delivered":
      return t.delivered;
    case "on_time_pct":
      return t.delivered > 0 ? (t.onTime / t.delivered) * 100 : null;
    case "late":
      return t.late;
    case "avg_min":
      return t.deliveryMinCount > 0 ? t.deliveryMinSum / t.deliveryMinCount : null;
    case "revenue":
      return t.revenue;
    case "cancellations":
      return t.cancellations;
  }
}
function Tn(t, e) {
  if (t === null) return "\u2014";
  switch (e) {
    case "on_time_pct":
      return `${t.toFixed(1)}%`;
    case "avg_min":
      return t.toFixed(1);
    case "revenue":
      return `\u20AC${Math.round(t).toLocaleString("en-GB")}`;
    default:
      return Math.round(t).toLocaleString("en-GB");
  }
}
function Pb(t, e) {
  return t === null || e !== "on_time_pct"
    ? null
    : t >= 98.5
      ? "good"
      : t >= 95
        ? "warn"
        : "crit";
}
function np(t) {
  return /[",\n;]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
}
function Ub() {
  let t = new Date();
  return `${t.getFullYear()}${String(t.getMonth() + 1).padStart(2, "0")}${String(t.getDate()).padStart(2, "0")}`;
}
function ReportsPage() {
  let [page, setPage] = Ja.useState(null),
    [tableState, setTableState] = Ja.useState("loading"),
    [a, r] = Ja.useState("platform"),
    [n, i] = Ja.useState("zone"),
    [o, l] = Ja.useState("orders"),
    [d, c] = Ja.useState("all"),
    [g, p] = fi("reports.digests", []),
    [u, s] = Ja.useState(!1);
  Ja.useEffect(() => {
    let cancelled = false;
    fetch(REPORTS_API)
      .then((response) => response.json())
      .then((body) => {
        if (cancelled) return;
        if (!body?.isSuccess || !Array.isArray(body.data?.rows) || !Array.isArray(body.data?.platforms)) {
          setTableState("error");
          return;
        }
        setPage(body.data);
        setTableState("ready");
      })
      .catch(() => {
        if (!cancelled) setTableState("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);
  let {
      rowKeys: M,
      colKeys: h,
      matrix: m,
      rowTotals: y,
      colTotals: k,
      grand: L,
    } = Ja.useMemo(() => {
      let v = (page?.rows ?? []).filter((Pt) => d === "all" || Pt.platformId === d),
        E = new Set(),
        Q = new Set(),
        _ = new Map(),
        Mt = new Map(),
        Wt = new Map(),
        Tt = rn(),
        rowField = DIMENSION_FIELD[a],
        colField = DIMENSION_FIELD[n];
      for (let Pt of v) {
        let Bt = Pt[rowField],
          Z = Pt[colField];
        (E.add(Bt), Q.add(Z));
        let qt = `${Bt}${Z}`,
          Se = _.get(qt) ?? rn();
        (addFact(Se, Pt), _.set(qt, Se));
        let ze = Mt.get(Bt) ?? rn();
        (addFact(ze, Pt), Mt.set(Bt, ze));
        let Qe = Wt.get(Z) ?? rn();
        (addFact(Qe, Pt), Wt.set(Z, Qe), addFact(Tt, Pt));
      }
      return {
        rowKeys: [...E].sort(),
        colKeys: [...Q].sort(),
        matrix: _,
        rowTotals: Mt,
        colTotals: Wt,
        grand: Tt,
      };
    }, [page, d, a, n]),
    w = Object.keys(Q2).map((v) => ({
      value: v,
      label: Q2[v],
    })),
    O = Object.keys(jx).map((v) => ({
      value: v,
      label: jx[v],
    })),
    A = [
      {
        value: "all",
        label: "All platforms",
      },
      ...(page?.platforms ?? []).map((v) => ({
        value: v.id,
        label: v.name,
      })),
    ];
  return (
    <Nt.Fragment>
      <PageHeader
        eyebrow="Reports"
        title="Reports Center"
        description="Slice today's operation by any two dimensions. Export to CSV for the quarterly Platform Health Pack."
      />
      <Card
        title="Pivot builder"
        actions=<Nt.Fragment>
          <Button onClick={() => s(!0)}>
            <Ak size={14} />
            {" Schedule digest"}
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              let E = [[Q2[a], ...h, "Total"].map(np).join(",")];
              for (let Tt of M) {
                let Pt = [
                  Tt,
                  ...h.map((Bt) => Tn(bi(m.get(`${Tt}${Bt}`) ?? rn(), o), o)),
                  Tn(bi(y.get(Tt) ?? rn(), o), o),
                ];
                E.push(Pt.map(np).join(","));
              }
              if (M.length > 0) {
                let Tt = [
                  "Total",
                  ...h.map((Pt) => Tn(bi(k.get(Pt) ?? rn(), o), o)),
                  Tn(bi(L, o), o),
                ];
                E.push(Tt.map(np).join(","));
              }
              let Q = E.join(`
`),
                _ = `report_${a}_by_${n}_${Ub()}.csv`,
                Mt = URL.createObjectURL(
                  new Blob([Q], {
                    type: "text/csv",
                  }),
                ),
                Wt = document.createElement("a");
              ((Wt.href = Mt),
                (Wt.download = _),
                document.body.appendChild(Wt),
                Wt.click(),
                document.body.removeChild(Wt),
                URL.revokeObjectURL(Mt));
            }}
          >
            {Nt.jsx(xr, {
              size: 14,
            })}
            {" Export CSV"}
          </Button>
        </Nt.Fragment>
      >
        <div
          className="grid g4"
          style={{
            gap: 10,
            marginBottom: 12,
          }}
        >
          <Select
            id="rep-rows"
            label="Rows"
            value={a}
            options={w}
            onChange={r}
          />
          <Select
            id="rep-cols"
            label="Columns"
            value={n}
            options={w}
            onChange={i}
          />
          <Select
            id="rep-metric"
            label="Metric"
            value={o}
            options={O}
            onChange={l}
          />
          <Select
            id="rep-plat"
            label="Platform filter"
            value={d}
            options={A}
            onChange={c}
          />
        </div>
        <div
          className="table-wrap table-scroll"
          style={{
            maxHeight: 620,
          }}
        >
          <table className="table">
            <thead>
              <tr>
                <th>{Q2[a]}</th>
                {h.map((v) => (
                  <th className="num" key={v}>
                    {v}
                  </th>
                ))}
                <th className="num">{"Total"}</th>
              </tr>
            </thead>
            <tbody>
              {tableState !== "ready" && (
                <tr>
                  <td colSpan={h.length + 2} className="empty">
                    {tableState === "error" ? "Could not load reports." : "Loading reports…"}
                  </td>
                </tr>
              )}
              {tableState === "ready" && M.length === 0 && (
                <tr>
                  <td colSpan={h.length + 2} className="empty">
                    {"No orders match the current filters yet."}
                  </td>
                </tr>
              )}
              {tableState === "ready" && M.map((v) => (
                <tr key={v}>
                  <td>{v}</td>
                  {h.map((E) => {
                    let Q = bi(m.get(`${v}${E}`) ?? rn(), o),
                      _ = Pb(Q, o);
                    return (
                      <td className="num" key={E}>
                        {_ ? <Badge tone={_}>{Tn(Q, o)}</Badge> : Tn(Q, o)}
                      </td>
                    );
                  })}
                  <td className="num">
                    <strong>{Tn(bi(y.get(v) ?? rn(), o), o)}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
            {tableState === "ready" && M.length > 0 && (
              <tfoot>
                <tr>
                  <th>{"Total"}</th>
                  {h.map((v) => (
                    <th className="num" key={v}>
                      {Tn(bi(k.get(v) ?? rn(), o), o)}
                    </th>
                  ))}
                  <th className="num">{Tn(bi(L, o), o)}</th>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Card>
      <Callout>
        {
          "Delay cause comes from recorded late deliveries. A delivered order with no late-delivery record is On time. Revenue is the platform rate per delivered order. Average minutes use the recorded handover time when a late delivery exists, otherwise the received-to-deadline window."
        }
      </Callout>
      {u && (
        <Ib
          existing={g}
          onClose={() => s(!1)}
          onSave={(v) => {
            (p([...g, v]), s(!1));
          }}
        />
      )}
    </Nt.Fragment>
  );
}
function Ib({ onClose: t, onSave: e, existing: a }) {
  let [r, n] = Ja.useState(""),
    [i, o] = Ja.useState("Weekly"),
    [l, d] = Ja.useState("all"),
    c = /.+@.+\..+/.test(r.trim());
  return (
    <Modal
      title="Schedule digest"
      onClose={t}
      footer=<Nt.Fragment>
        <Button onClick={t}>{"Cancel"}</Button>
        <Button
          variant="primary"
          disabled={!c}
          onClick={() =>
            e({
              email: r.trim(),
              frequency: i,
              platform: l,
              createdAt: new Date().toISOString(),
            })
          }
        >
          {"Save"}
        </Button>
      </Nt.Fragment>
    >
      <div
        className="grid g2"
        style={{
          gap: 10,
        }}
      >
        <Field id="dig-email" label="Recipient email">
          <input
            id="dig-email"
            className="input"
            type="email"
            placeholder="you@eels.de"
            value={r}
            onChange={(g) => n(g.target.value)}
          />
        </Field>
        <Field id="dig-freq" label="Frequency">
          <select
            id="dig-freq"
            className="select"
            value={i}
            onChange={(g) => o(g.target.value)}
          >
            <option>{"Weekly"}</option>
            <option>{"Monthly"}</option>
          </select>
        </Field>
        <Field id="dig-plat" label="Platform recipient">
          <select
            id="dig-plat"
            className="select"
            value={l}
            onChange={(g) => d(g.target.value)}
          >
            <option value="all">{"All platforms"}</option>
            {me.map((g) => (
              <option value={g} key={g}>
                {mt[g]}
              </option>
            ))}
          </select>
        </Field>
      </div>
      {a.length > 0 && (
        <div
          className="small muted"
          style={{
            marginTop: 12,
          }}
        >
          {a.length}
          {" digest"}
          {a.length === 1 ? "" : "s"}
          {" already scheduled."}
        </div>
      )}
    </Modal>
  );
}
var Wx = (t) =>
  t.startsWith("Owns") ? "accent" : t === "\u2014" ? "neutral" : "outline";
function ResponsibilitiesPage() {
  let t = useOpsStore(),
    { now: e } = useSimClock(),
    a = [
      {
        id: "early",
        label: "Day shift 10:30\u201317:00",
        lead: Ca[0],
        alnaif: Yr[0],
        active: e < 1020,
      },
      {
        id: "late",
        label: "Evening shift 16:30\u201323:45",
        lead: Ca[1],
        alnaif: Yr[1],
        active: e >= 16.5 * 60,
      },
    ];
  return (
    <Dt.Fragment>
      <PageHeader
        eyebrow="Operating model"
        title="Responsibilities"
        description="Clear ownership connects workforce readiness with daily delivery operations. Each shift has one named EELS lead and one Alnaif contact. Final responsibilities follow the agreed service and employment arrangements."
      />
      <div className="grid g2">
        {a.map((r) => {
          let n = t.shiftLeadOverride[r.lead.id] ?? r.lead.name,
            i = t.shiftLeadOverride[r.alnaif.id] ?? r.alnaif.name;
          return (
            <Card
              title={r.label}
              actions={
                r.active ? (
                  <Badge tone="good">{"Active"}</Badge>
                ) : (
                  <Badge>{"Off"}</Badge>
                )
              }
              key={r.id}
            >
              <div className="stack">
                {[
                  {
                    role: "EELS operational lead",
                    id: r.lead.id,
                    name: n,
                    phone: r.lead.phone,
                  },
                  {
                    role: "Alnaif workforce contact",
                    id: r.alnaif.id,
                    name: i,
                    phone: r.alnaif.phone,
                  },
                ].map((o) => (
                  <div className="alert-item" key={o.id}>
                    <div className="grow">
                      <div className="xsmall muted">{o.role}</div>
                      <input
                        id={`lead-${o.id}`}
                        aria-label={o.role}
                        className="input"
                        style={{
                          marginTop: 4,
                          width: "100%",
                        }}
                        value={o.name}
                        placeholder="Name required"
                        onChange={(l) =>
                          opsStore.set((d) => ({
                            shiftLeadOverride: {
                              ...d.shiftLeadOverride,
                              [o.id]: l.target.value,
                            },
                          }))
                        }
                      />
                      {!o.name.trim() && (
                        <div
                          className="xsmall"
                          style={{
                            color: "var(--crit-ink)",
                            marginTop: 4,
                          }}
                        >
                          {
                            "A shift without a named contact raises a critical alert."
                          }
                        </div>
                      )}
                    </div>
                    <Badge tone="outline">
                      {Dt.jsx(dk, {
                        size: 11,
                      })}{" "}
                      {o.phone}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
      <Card
        title="Who does what"
        sub="EELS, Alnaif Lieferdienst and the platforms"
        flush={!0}
      >
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{"Responsibility"}</th>
                <th>{"EELS GmbH"}</th>
                <th>{"Alnaif Lieferdienst UG"}</th>
                <th>{"Platform"}</th>
              </tr>
            </thead>
            <tbody>
              {b5.map((r) => (
                <tr key={r.task}>
                  <td className="bold">{r.task}</td>
                  <td>
                    <Badge tone={Wx(r.eels)}>{r.eels}</Badge>
                  </td>
                  <td>
                    <Badge tone={Wx(r.alnaif)}>{r.alnaif}</Badge>
                  </td>
                  <td className="small text-2">{r.platform}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card title="Platform escalation contacts" flush={!0}>
        <table className="table">
          <thead>
            <tr>
              <th>{"Platform"}</th>
              <th>{"Operational escalation"}</th>
              <th>{"Reporting and data access"}</th>
              <th>{"Status"}</th>
            </tr>
          </thead>
          <tbody>
            {me.map((r) => (
              <tr key={r}>
                <td className="bold">{mt[r]}</td>
                <td className="muted">{"To be named in the agreement"}</td>
                <td className="muted">{"To be named in the agreement"}</td>
                <td>
                  <Badge tone="warn">{"Open"}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Callout>
        {
          "Employment status, payroll ownership and liability between EELS and Alnaif must be confirmed by an employment lawyer, especially given the German discussion about direct employment in food delivery."
        }
      </Callout>
    </Dt.Fragment>
  );
}
export { ReportsPage, ResponsibilitiesPage };
