// Ops control tower.
import * as Cr from "react";
import * as T from "react/jsx-runtime";
import {
  Be,
  Ca,
  opsStore,
  Et,
  Gr,
  useOpsStore,
  Id,
  Mn,
  V,
  Yr,
  useSimClock,
  jt,
  mt,
  useToast,
  rt,
  Link,
  navigate,
} from "../services/portalState.jsx";
import {
  Badge,
  Card,
  Stat,
  Meter,
  Modal,
  bl,
  Field,
  CountFraction,
  Toast,
  PageHeader,
  wl,
  wn,
  Callout,
  Button,
} from "../components/ui.jsx";
import { Fr, Zr, a2, hi, hl, l2, pl } from "../components/icons.jsx";
import { Nn, ve } from "./CapacityPage.jsx";
var gb = {
    waiting_driver: "Waiting for driver",
    to_pickup: "To restaurant",
    at_pickup: "At restaurant",
    to_customer: "To customer",
    at_customer: "At customer",
  },
  G0 = [
    "Restaurant not ready",
    "Waiting for a free driver",
    "Late arrival at restaurant",
    "Travel to customer",
    "Customer handover",
    "Equipment or vehicle problem",
    "Platform assignment",
    "Other",
  ];
function OpsPage() {
  let t = jt(),
    e = useOpsStore(),
    { now: a } = useSimClock(),
    [r, n] = useToast(),
    [i, o] = Cr.useState(null),
    [l, d] = Cr.useState("risk"),
    c = a < 16.5 * 60 ? Ca[0] : Ca[1],
    g = a < 16.5 * 60 ? Yr[0] : Yr[1],
    p = Object.values(t.capacity).filter((m) => m.gap > 0),
    u = new Set(e.escalations.map((m) => m.orderId)),
    s = t.active.filter((m) => l === "all" || m.prediction.band !== "green"),
    f = Cr.useMemo(() => {
      let m = Array.from(
          {
            length: 13,
          },
          (k, L) => 11 + L,
        ),
        y = m.map((k) => {
          let L = t.completed.filter(
            (w) =>
              w.actual.delivered >= k * 60 && w.actual.delivered < (k + 1) * 60,
          );
          return L.length >= 3
            ? (L.filter((w) => Gr(w)).length / L.length) * 100
            : null;
        });
      return {
        labels: m.map((k) => `${k}:00`),
        vals: y,
      };
    }, [t.completed]),
    x =
      t.eod.status === "unreachable"
        ? "crit"
        : t.eod.status === "at_risk"
          ? "warn"
          : "good",
    M = {
      on_track: "On track",
      at_risk: "At risk",
      unreachable: "Unreachable",
      achieved: "Secured",
    }[t.eod.status],
    h = `${String(Math.floor(a / 15) * 15)}`;
  return (
    <T.Fragment>
      <PageHeader
        eyebrow={`Frankfurt pilot \xB7 ${V(t.now)}`}
        title="Ops Control Tower"
        description="One operational lead coordinates coverage, protects the next delivery before it becomes late, and keeps corrective actions visible."
        actions=<T.Fragment>
          <Badge tone="info">
            {"Lead: "}
            {c.name}
          </Badge>
          <Badge tone="outline">
            {"Alnaif: "}
            {g.name}
          </Badge>
          <Button variant="dark" onClick={() => navigate("/copilot?report=1")}>
            {T.jsx(pl, {
              size: 15,
            })}
            {" End-of-day report"}
          </Button>
        </T.Fragment>
      />
      <div className="grid g4">
        <Stat
          icon={T.jsx(hl, {
            size: 16,
          })}
          label="PTOD today (EELS internal)"
          value={Et(t.internal.pct)}
          tone={wl(t.internal.pct, e.targetPct)}
          foot=<T.Fragment>
            {t.internal.num}
            {"/"}
            {t.internal.den}
            {" on time · target "}
            {e.targetPct}
            {"%"}
          </T.Fragment>
        />
        <Stat
          icon={T.jsx(l2, {
            size: 16,
          })}
          label="Active orders"
          value={t.active.length}
          foot=<T.Fragment>
            {T.jsx(wn, {
              band: "red",
              label: `${t.bands.red} late`,
            })}{" "}
            {T.jsx(wn, {
              band: "amber",
              label: `${t.bands.amber} check`,
            })}
          </T.Fragment>
        />
        <Stat
          icon={T.jsx(hi, {
            size: 16,
          })}
          label="Zones short, next 30 min"
          value={p.length}
          tone={p.length ? "crit" : "good"}
          foot={
            p.length
              ? p.map((m) => `${rt(m.zoneId)} \u2212${m.gap}`).join(", ")
              : "All zones covered"
          }
        />
        <Stat
          icon={T.jsx(a2, {
            size: 16,
          })}
          label="End-of-day outlook"
          value={M}
          tone={x}
          foot={
            t.eod.requiredRemainingPct !== null && t.eod.status !== "achieved"
              ? `${t.eod.requiredRemainingPct.toFixed(1)}% needed on the remaining ${t.eod.remaining}`
              : `Projected ${t.eod.projectedPct.toFixed(1)}%`
          }
        />
      </div>
      <div className="grid g-2-1">
        <Card
          title="Orders to protect"
          sub="Time margin = deadline shown by the platform − predicted completion. Green > 5 min, amber 0–5 min, red = predicted late."
          actions=<div className="seg">
            <button
              className={l === "risk" ? "on" : ""}
              onClick={() => d("risk")}
            >
              {"At risk ("}
              {t.bands.red + t.bands.amber}
              {")"}
            </button>
            <button
              className={l === "all" ? "on" : ""}
              onClick={() => d("all")}
            >
              {"All active ("}
              {t.active.length}
              {")"}
            </button>
          </div>
          flush={!0}
        >
          <div className="table-wrap table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>{"Order"}</th>
                  <th>{"Zone"}</th>
                  <th>{"Stage"}</th>
                  <th className="num">{"Deadline → predicted"}</th>
                  <th className="num">{"Margin"}</th>
                  <th>{"Likely cause"}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {s.length === 0 && (
                  <tr>
                    <td colSpan={7} className="empty">
                      <Zr />
                      {" No order is at risk right now."}
                    </td>
                  </tr>
                )}
                {s.slice(0, 40).map((m) => (
                  <tr key={m.order.id}>
                    <td className="id">
                      <div className="row">
                        <i
                          className="swatch"
                          style={{
                            background: ve[m.order.platform],
                          }}
                          title={mt[m.order.platform]}
                        />
                        <Link
                          to={`/delays?order=${m.order.id}`}
                          className="mono"
                        >
                          {m.order.id}
                        </Link>
                      </div>
                    </td>
                    <td>{rt(m.order.zoneId)}</td>
                    <td className="small nowrap">{gb[m.stage] ?? m.stage}</td>
                    <td className="num nowrap">
                      {V(m.prediction.deadline)}
                      {" → "}
                      {V(m.prediction.predictedCompletion)}
                    </td>
                    <td className="num">
                      {T.jsx(wn, {
                        band: m.prediction.band,
                        label: Id(m.prediction.margin),
                      })}
                    </td>
                    <td className="small">{m.prediction.likelyCause}</td>
                    <td className="right">
                      {u.has(m.order.id) ? (
                        <Badge tone="info">{"Escalated"}</Badge>
                      ) : m.prediction.band !== "green" ? (
                        <Button
                          size="sm"
                          variant={
                            m.prediction.band === "red" ? "danger" : void 0
                          }
                          onClick={() => o(m.order.id)}
                        >
                          {"Escalate"}
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <div className="stack">
          <Card
            title="End-of-day PTOD forecast"
            sub={`Internal measure, daily target ${e.targetPct}%`}
          >
            <div className="stack">
              <div className="row between">
                <Badge tone={x}>{M}</Badge>
                <span className="small muted">
                  {"≈ "}
                  {t.expectedTotal}
                  {" deliveries expected today"}
                </span>
              </div>
              <table className="table">
                <tbody>
                  <tr>
                    <td>
                      {"On-time deliveries needed for "}
                      {e.targetPct}
                      {"%"}
                    </td>
                    <td className="num bold">{t.eod.requiredOnTime}</td>
                  </tr>
                  <tr>
                    <td>{"Already on time"}</td>
                    <td className="num">{t.internal.num}</td>
                  </tr>
                  <tr>
                    <td>{"Still needed"}</td>
                    <td className="num">
                      {t.eod.remainingOnTimeNeeded}
                      {" of "}
                      {t.eod.remaining}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Required punctuality from now"}</td>
                    <td className="num bold">
                      {t.eod.requiredRemainingPct === null
                        ? "\u2014"
                        : `${t.eod.requiredRemainingPct.toFixed(1)}%`}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Best possible result"}</td>
                    <td className="num">
                      {t.eod.bestCasePct.toFixed(1)}
                      {"%"}
                    </td>
                  </tr>
                  <tr>
                    <td>{"Projected at recent pace"}</td>
                    <td className="num">
                      {t.eod.projectedPct.toFixed(1)}
                      {"%"}
                    </td>
                  </tr>
                </tbody>
              </table>
              <Meter
                value={Math.min(100, t.eod.requiredRemainingPct ?? 0)}
                tone={x}
              />
              {t.eod.status === "unreachable" && (
                <Callout tone="crit">
                  {
                    "The target can no longer be met with the expected volume. Report the honest result and protect the remaining deliveries; never cancel or re-time orders to improve the score."
                  }
                </Callout>
              )}
              {t.eod.status === "at_risk" && (
                <Callout tone="warn">
                  {
                    "Intervene early: close zone gaps, escalate restaurant delays and keep reserves ready."
                  }
                </Callout>
              )}
            </div>
          </Card>
          <Card
            title="Coverage next 30 minutes"
            actions=<Link to="/capacity">{"Planner"}</Link>
          >
            <div className="stack-sm">
              {Object.values(t.capacity).map((m) => (
                <div className="row between small" key={m.zoneId}>
                  <span>{rt(m.zoneId)}</span>
                  <span className="row">
                    <span className="num muted">
                      {m.usable}
                      {"/"}
                      {m.required}
                    </span>
                    <Badge
                      tone={
                        m.status === "short"
                          ? "crit"
                          : m.status === "tight"
                            ? "warn"
                            : "good"
                      }
                    >
                      {m.status === "short" ? `${m.gap} short` : m.status}
                    </Badge>
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <div className="grid g2">
        {T.jsx(mb, {
          peakSlot: h,
          now: a,
        })}
        {T.jsx(vb, {
          onSaved: () => n("Action saved"),
        })}
      </div>
      <div className="grid g-2-1">
        <Card
          title="Punctuality by hour"
          sub="Share of deliveries completed in each hour that met the original deadline (hours with at least 3 deliveries)"
        >
          <Nn
            series={[
              {
                id: "ptod",
                label: "PTOD",
                color: "var(--seq-3)",
                values: f.vals,
              },
            ]}
            labels={f.labels}
            yMin={60}
            yMax={100}
            format={(m) => `${Math.round(m)}%`}
            refLine={{
              value: e.targetPct,
              label: `Target ${e.targetPct}%`,
            }}
          />
        </Card>
        <Card
          title="Alerts"
          sub="Automation rules"
          actions=<Badge
            tone={
              t.alerts.some((m) => m.severity === "critical")
                ? "crit"
                : "neutral"
            }
          >
            {t.alerts.length}
          </Badge>
        >
          <div className="stack-sm">
            {t.alerts.slice(0, 7).map((m) => (
              <Link
                to={m.route}
                className="alert-item"
                style={{
                  color: "inherit",
                  textDecoration: "none",
                }}
                key={m.id}
              >
                {T.jsx(bl, {
                  severity: m.severity,
                })}
                <div className="grow">
                  <div className="t">{m.title}</div>
                  <div className="d">{m.detail}</div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
      <Card
        title="Today by platform"
        sub="Internal measure, split by platform (counts shown)"
      >
        <div className="grid g3">
          {Object.keys(t.byPlatformInternal).map((m) => (
            <div className="card inset stat" key={m}>
              <div className="label">
                <i
                  className="swatch"
                  style={{
                    background: ve[m],
                  }}
                />
                {mt[m]}
              </div>
              <div
                className="value"
                style={{
                  fontSize: 22,
                }}
              >
                <CountFraction {...t.byPlatformInternal[m]} />
              </div>
            </div>
          ))}
        </div>
      </Card>
      {i &&
        T.jsx(fb, {
          orderId: i,
          defaultCause:
            t.active.find((m) => m.order.id === i)?.prediction.likelyCause ??
            "",
          onClose: () => o(null),
          onSaved: () => {
            (o(null), n("Escalation recorded"));
          },
        })}
      <Toast message={r} />
    </T.Fragment>
  );
}
function fb({ orderId: t, defaultCause: e, onClose: a, onSaved: r }) {
  let { now: n } = useSimClock(),
    [i, o] = Cr.useState(G0.includes(e) ? e : G0[0]),
    [l, d] = Cr.useState(""),
    [c, g] = Cr.useState("");
  return (
    <Modal
      title={`Escalate ${t}`}
      onClose={a}
      footer=<T.Fragment>
        <Button onClick={a}>{"Cancel"}</Button>
        <Button
          variant="primary"
          onClick={() => {
            (opsStore.set((p) => ({
              escalations: [
                ...p.escalations,
                {
                  orderId: t,
                  cause: i,
                  note: l,
                  at: n,
                  by: "Shift lead",
                  platformSupportRef: c || void 0,
                },
              ],
            })),
              r());
          }}
        >
          {"Record escalation"}
        </Button>
      </T.Fragment>
    >
      <p className="small text-2">
        {
          "Follow the platform's support process. Recording the cause keeps outcome and responsibility separate in the daily report."
        }
      </p>
      <Field
        id="esc-cause"
        label="Cause (verify before assigning responsibility)"
      >
        <select
          id="esc-cause"
          className="select"
          value={i}
          onChange={(p) => o(p.target.value)}
        >
          {G0.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </Field>
      <Field id="esc-note" label="What was done">
        <input
          id="esc-note"
          className="input"
          value={l}
          onChange={(p) => d(p.target.value)}
          placeholder="e.g. Called restaurant, food ready in 5 min; customer informed by platform"
        />
      </Field>
      <Field id="esc-ref" label="Platform support reference (optional)">
        <input
          id="esc-ref"
          className="input"
          value={c}
          onChange={(p) => g(p.target.value)}
          placeholder="SUP-…"
        />
      </Field>
    </Modal>
  );
}
var G2 = [
  {
    id: "before-staff",
    phase: "Before shifts",
    text: "Alnaif confirms attendance and readiness checks are complete",
  },
  {
    id: "before-cap",
    phase: "Before shifts",
    text: "EELS checks forecast workload, zone capacity and reserve coverage",
  },
  {
    id: "prepeak",
    phase: "Before peaks",
    text: "Close coverage gaps and position free drivers near expected pickups",
  },
  {
    id: "peak",
    phase: "Every 15 minutes in peaks",
    text: "Review at-risk orders, restaurant delays and upcoming driver availability",
  },
  {
    id: "after-review",
    phase: "After shifts",
    text: "Review PTOD, cancellations, staffed hours, delay causes and direct costs",
  },
  {
    id: "next",
    phase: "Before the next shift",
    text: "Give every corrective action an owner and a deadline; update staffing and coaching",
  },
];
function mb({ peakSlot: t, now: e }) {
  let a = useOpsStore(),
    r = (e >= 11.5 * 60 && e < 840) || (e >= 17.5 * 60 && e < 21.5 * 60),
    n = Math.ceil((e + 0.01) / 15) * 15,
    i = (l) => (l === "peak" ? `${Be}-peak-${t}` : `${Be}-${l}`),
    o = G2.filter((l) => a.rhythm[i(l.id)]).length;
  return (
    <Card
      title="Daily operating rhythm"
      sub={
        r
          ? `Peak review due ${V(n)} (every 15 minutes)`
          : "Outside peak periods"
      }
      actions=<Badge tone={o === G2.length ? "good" : "neutral"}>
        {o}
        {"/"}
        {G2.length}
      </Badge>
    >
      <div className="stack-sm">
        {G2.map((l) => (
          <label className="check" key={l.id}>
            <input
              type="checkbox"
              id={`rh-${l.id}`}
              checked={!!a.rhythm[i(l.id)]}
              onChange={(d) =>
                opsStore.set((c) => ({
                  rhythm: {
                    ...c.rhythm,
                    [i(l.id)]: d.target.checked,
                  },
                }))
              }
            />
            <span>
              <span className="xsmall muted">{l.phase}</span>
              <br />
              {l.text}
              {l.id === "peak" && r && (
                <span className="muted small">{" · this quarter hour"}</span>
              )}
            </span>
          </label>
        ))}
      </div>
    </Card>
  );
}
function vb({ onSaved: t }) {
  let e = useOpsStore(),
    { now: a } = useSimClock(),
    [r, n] = Cr.useState(""),
    [i, o] = Cr.useState(""),
    [l, d] = Cr.useState("2026-09-17"),
    c = r.trim() && i.trim() && l;
  return (
    <Card
      title="Corrective actions"
      sub="An action cannot be saved without an owner and a deadline"
    >
      <div className="stack">
        <div className="stack-sm">
          {e.actions.map((g) => (
            <div
              className="row between"
              style={{
                alignItems: "flex-start",
              }}
              key={g.id}
            >
              <label
                className="check grow"
                style={{
                  padding: 0,
                }}
              >
                <input
                  type="checkbox"
                  id={`act-${g.id}`}
                  checked={g.status === "done"}
                  onChange={(p) =>
                    opsStore.set((u) => ({
                      actions: u.actions.map((s) =>
                        s.id === g.id
                          ? {
                              ...s,
                              status: p.target.checked ? "done" : "open",
                            }
                          : s,
                      ),
                    }))
                  }
                />
                <span
                  style={{
                    textDecoration:
                      g.status === "done" ? "line-through" : void 0,
                  }}
                >
                  {g.title}
                  <br />
                  <span className="xsmall muted">
                    {g.owner}
                    {" · due "}
                    {g.due}
                    {" · "}
                    {g.source}
                  </span>
                </span>
              </label>
              {g.status === "open" && g.due < Be ? (
                <Badge tone="crit">{"Overdue"}</Badge>
              ) : g.status === "open" && g.due === Be ? (
                <Badge tone="warn">{"Today"}</Badge>
              ) : null}
            </div>
          ))}
        </div>
        <div className="divider" />
        <div
          className="grid g3"
          style={{
            gap: 8,
          }}
        >
          <input
            id="act-title"
            className="input"
            placeholder="Action"
            value={r}
            onChange={(g) => n(g.target.value)}
            aria-label="Action"
            style={{
              gridColumn: "1 / -1",
            }}
          />
          <input
            id="act-owner"
            className="input"
            placeholder="Owner (name, organisation)"
            value={i}
            onChange={(g) => o(g.target.value)}
            aria-label="Owner"
          />
          <input
            id="act-due"
            className="input"
            type="date"
            value={l}
            onChange={(g) => d(g.target.value)}
            aria-label="Deadline"
          />
          <Button
            variant="primary"
            disabled={!c}
            onClick={() => {
              (opsStore.set((g) => ({
                actions: [
                  ...g.actions,
                  {
                    id: Mn("A"),
                    title: r.trim(),
                    owner: i.trim(),
                    due: l,
                    status: "open",
                    source: `Control tower ${V(a)}`,
                    createdAt: a,
                  },
                ],
              })),
                n(""),
                o(""),
                t());
            }}
          >
            <Fr size={14} />
            {" Add"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
export { OpsPage };
