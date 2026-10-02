// Executive dashboard and Ops Copilot page (one bundle module).
import * as P0 from "react";
import * as ke from "react/jsx-runtime";
import * as br from "react/jsx-runtime";
import * as nt from "react/jsx-runtime";
import {
  Et,
  useOpsStore,
  M2,
  useHashLocation,
  V,
  ie,
  jt,
  me,
  mt,
  useToast,
  Link,
  readPilotModel,
} from "../services/portalState.jsx";
import { A2, _2, bn } from "../services/copilotEngine.js";
import {
  CopilotChat,
  Badge,
  Card,
  Stat,
  bl,
  Toast,
  PageHeader,
  wl,
  Callout,
  Button,
} from "../components/ui.jsx";
import { Js, gl, h2, hi, n2, r2, t2, xr } from "../components/icons.jsx";
import { downloadTextFile } from "../api/mockApi.jsx";
import { Fe, T2, tn } from "./AdminPage.jsx";
import { An, Nn, i3, ve } from "./CapacityPage.jsx";
function CopilotPage() {
  let t = jt(),
    e = useOpsStore(),
    a = readPilotModel(),
    { query: r } = useHashLocation(),
    [n, i] = useToast(),
    [o, l] = P0.useState(
      r.get("report")
        ? {
            text: bn(t, e),
            engine: "Template",
            at: t.now,
          }
        : null,
    ),
    [d, c] = P0.useState(!1),
    g = async () => {
      c(!0);
      let p = bn(t, e);
      try {
        let u = await _2(
          [
            {
              role: "user",
              content: `Write today's end-of-day report from the live data. Use this template draft as the factual base and keep every number:

${p}`,
            },
          ],
          A2(t, a, e),
          () => p,
          {
            onText: (s) =>
              l({
                text: s,
                engine: "Template",
                at: t.now,
              }),
          },
        );
        l({
          text: u.text,
          engine: u.engine,
          at: t.now,
        });
      } finally {
        c(!1);
      }
    };
  return ke.jsxs(ke.Fragment, {
    children: [
      <PageHeader
        eyebrow="AI assistant"
        title="Ops Copilot"
        description="Ask questions about today's operation and draft the end-of-day report. Answers are grounded in the live pilot snapshot and quote their counts."
      />,
      <Callout>
        {
          "Engines: Claude inside claude.ai (when this page runs as an Artifact), Claude through the Netlify function (when "
        }
        <code>{"ANTHROPIC_API_KEY"}</code>
        {
          " is set), otherwise the built-in offline engine. The Copilot explains and drafts; it never makes decisions about individual drivers."
        }
      </Callout>,
      <div className="grid g2">
        <Card title="Ask" sub={`Live data as of ${V(t.now)}`}>
          <CopilotChat />
        </Card>
        <Card
          title="End-of-day report"
          sub="Three largest delay causes, affected zones and peaks, planned vs actual coverage, actions for tomorrow"
          actions={o ? <Badge tone="info">{o.engine}</Badge> : void 0}
        >
          <div className="stack">
            <div className="row wrap">
              <Button
                onClick={() =>
                  l({
                    text: bn(t, e),
                    engine: "Template",
                    at: t.now,
                  })
                }
              >
                {"Draft from template"}
              </Button>
              <Button variant="primary" onClick={g} disabled={d}>
                {ke.jsx(r2, {
                  size: 14,
                })}{" "}
                {d ? "Writing\u2026" : "Write with Copilot"}
              </Button>
            </div>
            {o ? (
              ke.jsxs(ke.Fragment, {
                children: [
                  <pre
                    className="code"
                    style={{
                      whiteSpace: "pre-wrap",
                      background: "var(--surface-2)",
                      color: "var(--text)",
                      border: "1px solid var(--border)",
                      maxHeight: 520,
                    }}
                  >
                    {o.text}
                  </pre>,
                  <div className="row">
                    <Button
                      size="sm"
                      onClick={async () => {
                        try {
                          (await navigator.clipboard.writeText(o.text),
                            i("Report copied"));
                        } catch {
                          i("Copy is blocked here; use Download");
                        }
                      }}
                    >
                      {ke.jsx(gl, {
                        size: 13,
                      })}
                      {" Copy"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={async () => {
                        let p = await downloadTextFile(
                          `eels-eod-report-2026-09-16-${V(o.at).replace(":", "")}.md`,
                          o.text,
                          "text/markdown",
                        );
                        i(p ? "Download started" : "Download was not allowed");
                      }}
                    >
                      {ke.jsx(xr, {
                        size: 13,
                      })}
                      {" Download"}
                    </Button>
                    <span className="xsmall muted">
                      {"As of "}
                      {V(o.at)}
                      {"; review before sending."}
                    </span>
                  </div>,
                ],
              })
            ) : (
              <p className="muted small">
                {
                  "Draft the report at the end of the shift, or at any time to see where the day stands."
                }
              </p>
            )}
          </div>
        </Card>
      </div>,
      <Toast message={n} />,
    ],
  });
}
var Jd = {
    pilot: {
      label: "Pilot",
      color: "var(--lime-500)",
    },
    phase1: {
      label: "Phase 1",
      color: "var(--seq-3)",
    },
    phase2: {
      label: "Phase 2",
      color: "var(--s-wolt)",
    },
    other: {
      label: "Prototype cities",
      color: "var(--muted)",
    },
  },
  U0 = {
    duisburg: {
      dx: -3.4,
      dy: -1.6,
      anchor: "end",
    },
    dusseldorf: {
      dx: 3.4,
      dy: 0.2,
      anchor: "start",
    },
    cologne: {
      dx: 3.4,
      dy: 2.4,
      anchor: "start",
    },
    bonn: {
      dx: -3.4,
      dy: 4,
      anchor: "end",
    },
    dresden: {
      dx: -3.4,
      dy: 5,
      anchor: "end",
    },
    leipzig: {
      dx: -3.4,
      dy: -1.8,
      anchor: "end",
    },
  };
function z2({ maxHeight: t = 420 }) {
  let e = (r) => ((r - 5.6) / 9.8) * 100,
    a = (r) => ((55.2 - r) / 8.100000000000001) * 120;
  return (
    <div>
      <svg
        viewBox="0 0 100 120"
        style={{
          width: "100%",
          maxHeight: t,
        }}
        role="img"
        aria-label="Rollout stages by city"
      >
        <rect
          x="2"
          y="2"
          width="96"
          height="116"
          rx="8"
          fill="var(--surface-2)"
          stroke="var(--border)"
        />
        {T2.map((r) => (
          <g key={r.id}>
            <circle
              cx={e(r.lng)}
              cy={a(r.lat)}
              r={r.stage === "pilot" ? 3.4 : 2.4}
              fill={Jd[r.stage].color}
              stroke="var(--surface)"
              strokeWidth={0.8}
            />
            <text
              x={e(r.lng) + (U0[r.id]?.dx ?? 3.6)}
              y={a(r.lat) + (U0[r.id]?.dy ?? 1.2)}
              textAnchor={U0[r.id]?.anchor ?? "start"}
              style={{
                fontSize: 3.6,
                fill: "var(--text)",
                fontWeight: r.stage === "pilot" ? 700 : 500,
              }}
            >
              {r.name}
            </text>
          </g>
        ))}
      </svg>
      <div className="legend">
        {Object.values(Jd).map((r) => (
          <span key={r.label}>
            <i
              className="swatch"
              style={{
                background: r.color,
                borderRadius: 99,
              }}
            />
            {r.label}
          </span>
        ))}
      </div>
    </div>
  );
}
function DashboardPage() {
  let t = jt(),
    e = readPilotModel(),
    a = useOpsStore(),
    r = t.driverStates.filter(
      (c) =>
        c.activity === "free" ||
        c.activity === "on_delivery" ||
        c.activity === "on_break",
    ).length,
    n = tn.filter(
      (c) => c.status === "report import" || c.status === "live feed",
    ).length,
    i = e.drivers.filter((c) =>
      Fe(c).some((g) => g.severity === "High"),
    ).length,
    o = t.alerts.filter((c) => c.severity === "critical"),
    l = e.history.slice(-28),
    d = (c) => t.driverStates.filter((g) => g.activity === c).length;
  return nt.jsxs(nt.Fragment, {
    children: [
      <PageHeader
        eyebrow={`Wednesday 16 September 2026 \xB7 ${V(t.now)}`}
        title="Executive Dashboard"
        description="Frankfurt pilot health at a glance: service, workforce, compliance and economics, with the rollout plan for Germany."
      />,
      <div className="grid g4">
        <Stat
          icon={nt.jsx(t2, {
            size: 16,
          })}
          label="Riders on shift now"
          value={r}
          foot={`${e.drivers.length} rostered today \xB7 ${t.attendance.noShows} no-shows`}
        />
        <Stat
          icon=<Js size={16} />
          label="Data channels active"
          value={`${n}/${tn.length}`}
          foot="2 partner agreements pending"
        />
        <Stat
          icon={nt.jsx(h2, {
            size: 16,
          })}
          label="Payroll ready"
          value={Et(((e.drivers.length - i) / e.drivers.length) * 100, 0)}
          tone={i ? "warn" : "good"}
          foot={`${i} drivers blocked by compliance`}
        />
        <Stat
          icon={nt.jsx(n2, {
            size: 16,
          })}
          label="High-risk items"
          value={o.length}
          tone={o.length ? "crit" : "good"}
          foot=<Link to="/ops">{"Open control tower"}</Link>
        />
      </div>,
      <div className="grid g4">
        <Stat
          icon={nt.jsx(hi, {
            size: 16,
          })}
          label="PTOD today (internal)"
          value={Et(t.internal.pct)}
          tone={wl(t.internal.pct, a.targetPct)}
          foot={nt.jsxs(nt.Fragment, {
            children: [
              t.internal.num,
              "/",
              t.internal.den,
              " \xB7 target ",
              a.targetPct,
              "% ",
              nt.jsx(i3, {
                values: l.map((c) => (c.onTime / c.completed) * 100),
              }),
            ],
          })}
        />
        <Stat
          label="Deliveries today"
          value={t.completed.length}
          foot={`\u2248 ${t.expectedTotal} expected \xB7 ${t.active.length} active`}
        />
        <Stat
          label="Contribution so far"
          value={ie(t.economics.total.contribution)}
          tone={t.economics.total.contribution >= 0 ? "good" : "crit"}
          foot=<Link to="/economics">{"Illustrative assumptions"}</Link>
        />
        <Stat
          label="End-of-day outlook"
          value={
            {
              on_track: "On track",
              at_risk: "At risk",
              unreachable: "Unreachable",
              achieved: "Secured",
            }[t.eod.status]
          }
          tone={
            t.eod.status === "on_track" || t.eod.status === "achieved"
              ? "good"
              : t.eod.status === "at_risk"
                ? "warn"
                : "crit"
          }
          foot={`Projected ${t.eod.projectedPct.toFixed(1)}%`}
        />
      </div>,
      <div className="grid g-2-1">
        <Card
          title="Pilot trend, last 4 weeks"
          sub="Internal PTOD by day, all platforms"
        >
          <Nn
            labels={l.map((c) => c.date.slice(5))}
            series={[
              {
                id: "p",
                label: "PTOD",
                color: "var(--seq-3)",
                values: l.map((c) => (c.onTime / c.completed) * 100),
              },
            ]}
            yMin={85}
            yMax={100}
            format={(c) => `${c.toFixed(0)}%`}
            refLine={{
              value: a.targetPct,
              label: `Target ${a.targetPct}%`,
            }}
          />
        </Card>
        <Card title="Risk alert queue" actions=<Link to="/ops">{"All"}</Link>>
          <div className="stack-sm">
            {t.alerts.slice(0, 6).map((c) => (
              <Link
                to={c.route}
                className="alert-item"
                style={{
                  color: "inherit",
                  textDecoration: "none",
                }}
                key={c.id}
              >
                {nt.jsx(bl, {
                  severity: c.severity,
                })}
                <div className="grow">
                  <div className="t">{c.title}</div>
                  <div className="d">{c.detail}</div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>,
      <div className="grid g-2-1">
        <Card
          title="Multi-city coverage"
          sub="Rollout stage per city; non-Frankfurt figures are carried over from the prototype"
          flush={!0}
        >
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>{"City"}</th>
                  <th>{"Stage"}</th>
                  <th>{"Status"}</th>
                  <th className="num">{"Riders"}</th>
                  <th className="num">{"Orders / month"}</th>
                  <th>{"Platforms"}</th>
                </tr>
              </thead>
              <tbody>
                {T2.map((c) => (
                  <tr key={c.id}>
                    <td className="bold">{c.name}</td>
                    <td>
                      <span className="row">
                        <i
                          className="swatch"
                          style={{
                            background: Jd[c.stage].color,
                            borderRadius: 99,
                          }}
                        />
                        {Jd[c.stage].label}
                      </span>
                    </td>
                    <td>
                      <Badge
                        tone={
                          c.status === "live pilot"
                            ? "accent"
                            : c.status === "planned"
                              ? "info"
                              : "neutral"
                        }
                      >
                        {c.status}
                      </Badge>
                    </td>
                    <td className="num">{c.riders || "\u2014"}</td>
                    <td className="num">
                      {c.monthlyOrders ? M2(c.monthlyOrders) : "\u2014"}
                    </td>
                    <td className="small">
                      {c.platforms.join(", ") || "\u2014"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card title="Germany rollout">
          {nt.jsx(z2, {
            maxHeight: 360,
          })}
        </Card>
      </div>,
      <div className="grid g3">
        <Card title="Rider operations now">
          <An
            categories={["Free", "Delivering", "Break", "Blocked", "No-show"]}
            series={[
              {
                id: "r",
                label: "Riders",
                color: "var(--seq-3)",
                values: [
                  d("free"),
                  d("on_delivery"),
                  d("on_break"),
                  d("blocked"),
                  d("no_show"),
                ],
              },
            ]}
            height={180}
          />
        </Card>
        <Card title="Platforms today" sub="Internal PTOD with counts">
          <div className="stack-sm">
            {me.map((c) => (
              <div className="row between" key={c}>
                <span className="row">
                  <i
                    className="swatch"
                    style={{
                      background: ve[c],
                    }}
                  />
                  {mt[c]}
                </span>
                <span className="num">
                  {Et(t.byPlatformInternal[c].pct)}{" "}
                  <span className="muted small">
                    {"("}
                    {t.byPlatformInternal[c].num}
                    {"/"}
                    {t.byPlatformInternal[c].den}
                    {")"}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card
          title="Partner data channels"
          actions=<Link to="/api-hub">{"API Hub"}</Link>
        >
          <div className="stack-sm">
            {tn.slice(0, 4).map((c) => (
              <div className="row between small" key={c.id}>
                <span>{c.name}</span>
                <Badge
                  tone={
                    c.status === "report import"
                      ? "info"
                      : c.status === "live feed"
                        ? "good"
                        : "warn"
                  }
                >
                  {c.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>,
    ],
  });
}
export { CopilotPage, DashboardPage, z2 };
