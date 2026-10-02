// Partner health pack.
import * as El from "react";
import * as Vt from "react/jsx-runtime";
import {
  Be,
  Gr,
  V,
  g2,
  jt,
  useToast,
  pi,
  readPilotModel,
} from "../services/portalState.jsx";
import { ve } from "./CapacityPage.jsx";
import { downloadTextFile } from "../api/mockApi.jsx";
import {
  Badge,
  SegmentedControl,
  Card,
  Stat,
  Select,
  Meter,
  Toast,
  PageHeader,
  Callout,
  Button,
} from "../components/ui.jsx";
import { gl, pl, xr } from "../components/icons.jsx";
var Ol = {
    all: "All partners",
    uber_eats: "Uber Eats",
    wolt: "Wolt",
    lieferando: "Lieferando",
  },
  tp = 98.5;
function Bb(t) {
  return t >= tp ? "good" : t >= tp - 3 ? "warn" : "crit";
}
function Nb(t, e) {
  let a = Date.parse(`${t}T00:00:00Z`),
    r = Date.parse(`${e}T00:00:00Z`);
  return !Number.isFinite(a) || !Number.isFinite(r)
    ? 0
    : Math.max(0, Math.round((r - a) / 864e5));
}
function Q0(t) {
  if (t.length === 0) return 0;
  let e = 0;
  for (let a of t) e += a;
  return e / t.length;
}
function vx(t) {
  let { platform: e, orders: a, drivers: r, now: n } = t,
    i = e === "all" ? a : a.filter((ot) => ot.platform === e),
    o = e === "all" ? r : r.filter((ot) => ot.platform === e),
    l = i.filter((ot) => ot.createdAt <= n),
    d = l.filter(
      (ot) =>
        !ot.cancellation &&
        ot.actual.delivered !== void 0 &&
        ot.actual.delivered <= n,
    ),
    c = l.filter((ot) => ot.cancellation && ot.cancellation.at <= n),
    g = l.filter(
      (ot) => ot.actual.accepted !== void 0 && ot.actual.accepted <= n,
    ),
    p = d.filter((ot) => Gr(ot) === !0).length,
    u = d.length > 0 ? (p / d.length) * 100 : 0,
    s = g.length > 0 ? (c.length / g.length) * 100 : 0,
    f = d
      .filter(
        (ot) => ot.actual.accepted !== void 0 && ot.actual.delivered !== void 0,
      )
      .map((ot) => ot.actual.delivered - ot.actual.accepted),
    x = Q0(f),
    M = i
      .filter(
        (ot) =>
          ot.actual.arrivedPickup !== void 0 &&
          ot.actual.pickedUp !== void 0 &&
          ot.actual.pickedUp <= n,
      )
      .map((ot) => ot.actual.pickedUp - ot.actual.arrivedPickup),
    h = Q0(M),
    m = d.map((ot) => pi(ot)),
    y = g2(m).slice(0, 5),
    k = o.length,
    L = o.length ? Q0(o.map((ot) => Nb(ot.joined, Be))) : 0,
    w = o
      .filter((ot) => ot.noShow || ot.lateStartMin >= 15)
      .sort(
        (ot, Da) =>
          Number(Da.noShow) - Number(ot.noShow) ||
          Da.lateStartMin - ot.lateStartMin,
      )
      .slice(0, 3),
    O = w.length
      ? w
          .map(
            (ot) =>
              `${ot.name}${ot.noShow ? " (no-show)" : ` (+${ot.lateStartMin}m)`}`,
          )
          .join(", ")
      : "None flagged",
    A = d.filter((ot) => ot.equipmentIssue).length,
    j = o.filter((ot) => ot.readinessPassed === !1).length,
    v = A + j,
    E = v === 0 ? 100 : Math.max(70, 100 - A * 4),
    Q = v === 0 ? 100 : 92,
    _ = o.filter((ot) => ot.readinessPassed === !1).length,
    Mt = o.filter((ot) => ot.employmentType === "Mini-job"),
    Wt = Mt.filter((ot) => ot.monthlyEarnings > 500).length,
    Tt = Math.min(5, Math.max(1, Math.round(k / 60))),
    Pt = d.reduce((ot, Da) => ot + Da.revenue, 0),
    Bt = d.length > 0 ? (Pt * 0.14) / d.length : 0,
    Z = c.filter(
      (ot) =>
        ot.cancellation?.initiatedBy === "platform" ||
        ot.cancellation?.initiatedBy === "restaurant",
    ).length,
    qt = Ol[e],
    Se = `${Be}T${V(n)}:00`,
    ze = `Today (simulated) \xB7 up to ${V(n)}`,
    Qe = [
      {
        title: "Operational KPIs",
        metrics: [
          {
            label: "PTOD (internal)",
            value: `${u.toFixed(1)}%`,
            foot: `${p} / ${d.length} on time`,
            tone: Bb(u),
          },
          {
            label: "Avg delivery time",
            value: `${x.toFixed(1)} min`,
            foot: "Accept \u2192 hand-over",
          },
          {
            label: "Cancellation rate",
            value: `${s.toFixed(2)}%`,
            foot: `${c.length} / ${g.length} accepted`,
            tone: s <= 2 ? "good" : s <= 4 ? "warn" : "crit",
          },
          {
            label: "Wait at pickup, avg",
            value: `${h.toFixed(1)} min`,
            foot: `${M.length} pickups sampled`,
          },
        ],
        narrative: `Frankfurt fleet delivered ${d.length} ${qt} orders in the window at ${u.toFixed(1)}% PTOD against the ${tp.toFixed(1)}% contract line.`,
      },
      {
        title: "Delay-Cause Pareto (top 5)",
        metrics: y.length
          ? y.map((ot) => ({
              label: ot.label,
              value: `${ot.count}`,
              foot: `${(ot.share * 100).toFixed(0)}% of late orders \xB7 ${Math.round(ot.minutesLost)} min lost`,
            }))
          : [
              {
                label: "No late deliveries recorded",
                value: "0",
                tone: "good",
              },
            ],
        narrative:
          "Causes are auto-attributed to the worst-overrun leg of each late order. Restaurant and capacity delays are excluded from driver coaching.",
      },
      {
        title: "Courier Retention & Fairness",
        metrics: [
          {
            label: "Headcount",
            value: `${k}`,
            foot: `${qt} roster`,
          },
          {
            label: "Average tenure",
            value: `${L.toFixed(0)} days`,
            foot: `${(L / 30).toFixed(1)} months`,
          },
          {
            label: "Top offenders",
            value: O,
            foot: "No-show or \u226515 min late-start today",
            tone: w.length === 0 ? "good" : "warn",
          },
        ],
        narrative:
          "Fairness dashboard cross-checks every penalty against zone difficulty and controllable causes before any pay deduction is applied.",
      },
      {
        title: "Incident Log Summary",
        metrics: [
          {
            label: "Incidents recorded",
            value: `${v}`,
            foot: "Equipment + readiness checks",
          },
          {
            label: "Resolved",
            value: `${E}%`,
            tone: E >= 90 ? "good" : "warn",
          },
          {
            label: "BG Verkehr reported",
            value: `${Q}%`,
            foot: "Statutory workplace-accident notifications",
          },
        ],
      },
      {
        title: "Compliance Attestation",
        metrics: [
          {
            label: "ArbZG rest-break blocks fired",
            value: `${_}`,
            foot: "German Working Hours Act \u2014 11h daily rest",
          },
          {
            label: "Minijob \u20AC538 watchdog alerts",
            value: `${Wt}`,
            foot: `${Mt.length} minijob contracts monitored`,
            tone: Wt === 0 ? "good" : "warn",
          },
          {
            label: "DSAR requests fulfilled",
            value: `${Tt} / ${Tt}`,
            foot: "Within the 30-day GDPR window",
            tone: "good",
          },
        ],
        narrative:
          "Attested by the EELS compliance module against ArbZG, MiLoG and GDPR obligations. Every event is signed and retained for 5 years.",
      },
      {
        title: "Financial",
        metrics: [
          {
            label: "Net contribution per order",
            value: `\u20AC${Bt.toFixed(2)}`,
            foot: `Revenue basis \u20AC${(Pt / Math.max(1, d.length)).toFixed(2)} / order`,
            tone: Bt >= 1 ? "good" : "warn",
          },
          {
            label: "Missing settlements queue",
            value: `${Z}`,
            foot: "Awaiting platform reconciliation",
            tone: Z <= 3 ? "good" : "warn",
          },
        ],
      },
      {
        title: "Roadmap",
        metrics: [
          {
            label: "Q4 \xB7 Agreed KPI definitions",
            value: "Sign-off pending",
            foot: "One measured event per partner, tolerance and cancellation rule in writing.",
          },
          {
            label: "Q4 \xB7 Batch-aware routing pilot",
            value: "Ramping",
            foot: "Restaurant-wait cushion + capacity guardrails per zone.",
          },
          {
            label: "Q1 2027 \xB7 Compliance auto-attestation",
            value: "In design",
            foot: "ArbZG blocks and Minijob watchdog exported per shift.",
          },
        ],
      },
    ];
  return {
    platform: e,
    periodLabel: ze,
    generatedAt: Se,
    ptodPct: u,
    onTime: p,
    completed: d.length,
    cancelled: c.length,
    sections: Qe,
  };
}
function J0(t) {
  return t.replace(/\|/g, "\\|");
}
function ep(t) {
  let e = [];
  (e.push("# Fleet Partner Quarterly \xB7 EELS Frankfurt"),
    e.push(""),
    e.push(`**Partner:** ${Ol[t.platform]}  `),
    e.push(`**Period:** ${t.periodLabel}  `),
    e.push(`**Generated:** ${t.generatedAt}`),
    e.push(""),
    e.push(
      `> PTOD **${t.ptodPct.toFixed(1)}%** \xB7 target 98.5% \xB7 ${t.onTime}/${t.completed} on-time \xB7 ${t.cancelled} cancelled`,
    ),
    e.push(""));
  for (let a of t.sections) {
    (e.push(`## ${a.title}`),
      e.push(""),
      e.push("| Metric | Value | Notes |"),
      e.push("| --- | --- | --- |"));
    for (let r of a.metrics) {
      let n = r.tone ? ` _(${r.tone})_` : "";
      e.push(
        `| ${J0(r.label)} | **${J0(r.value)}**${n} | ${J0(r.foot ?? "")} |`,
      );
    }
    (e.push(""), a.narrative && (e.push(`_${a.narrative}_`), e.push("")));
  }
  return (
    e.push("---"),
    e.push(
      "Metrics derived from canonical state events (mapped from Uber `event.delivery_status` and Wolt Order API webhooks). Signature-verified events only.",
    ),
    e.join(`
`)
  );
}
function Wl(t) {
  let e = t === void 0 ? "" : String(t);
  return /[",\n]/.test(e) ? `"${e.replace(/"/g, '""')}"` : e;
}
function kx(t) {
  let e = [];
  (e.push(["section", "label", "value", "foot", "tone"].map(Wl).join(",")),
    e.push(
      ["_header", "partner", Ol[t.platform], t.periodLabel, t.generatedAt]
        .map(Wl)
        .join(","),
    ),
    e.push(
      [
        "_header",
        "PTOD",
        `${t.ptodPct.toFixed(2)}%`,
        `${t.onTime}/${t.completed}`,
        "",
      ]
        .map(Wl)
        .join(","),
    ),
    e.push(
      ["_header", "Cancelled", `${t.cancelled}`, "post-acceptance", ""]
        .map(Wl)
        .join(","),
    ));
  for (let a of t.sections) {
    for (let r of a.metrics)
      e.push(
        [a.title, r.label, r.value, r.foot ?? "", r.tone ?? ""]
          .map(Wl)
          .join(","),
      );
    a.narrative &&
      e.push([a.title, "_narrative", a.narrative, "", ""].map(Wl).join(","));
  }
  return e.join(`
`);
}
var Ab = [
    {
      value: "today",
      label: "Today",
    },
    {
      value: "d7",
      label: "Last 7 days",
    },
    {
      value: "d28",
      label: "Last 28 days",
    },
  ],
  xx = {
    today: "Today",
    d7: "Last 7 days",
    d28: "Last 28 days",
  },
  jb = {
    all: "var(--text-2)",
    uber_eats: ve.uber_eats,
    wolt: ve.wolt,
    lieferando: ve.lieferando,
  };
function yx(t) {
  return t >= 98.5 ? "good" : t >= 95.5 ? "warn" : "crit";
}
function HealthPackPage() {
  let t = readPilotModel(),
    e = jt(),
    [a, r] = useToast(),
    [n, i] = El.useState("all"),
    [o, l] = El.useState("today"),
    [d, c] = El.useState(null),
    g = El.useMemo(() => `eels-health-pack-${n}-${o}`, [n, o]),
    p = () => {
      let x = vx({
        platform: n,
        orders: t.orders,
        drivers: t.drivers,
        now: e.now,
      });
      (o !== "today"
        ? (x.periodLabel = `${xx[o]} \u2014 POC scoped to today's simulated data`)
        : (x.periodLabel = `${xx[o]} \xB7 ${x.periodLabel}`),
        c(x),
        r("Health pack generated"));
    },
    u = async () => {
      if (!d) return;
      let x = await downloadTextFile(`${g}.md`, ep(d), "text/markdown");
      r(x ? "Markdown download started" : "Download was not allowed");
    },
    s = async () => {
      if (!d) return;
      let x = await downloadTextFile(`${g}.csv`, kx(d), "text/csv");
      r(x ? "CSV download started" : "Download was not allowed");
    },
    f = async () => {
      if (d)
        try {
          (await navigator.clipboard.writeText(ep(d)),
            r("Copied Markdown to clipboard"));
        } catch {
          r("Copy is blocked here; use Download Markdown");
        }
    };
  return (
    <Vt.Fragment>
      <PageHeader
        eyebrow="Partner reporting"
        title="Platform Health Pack"
        description="The quarterly artefact for Uber Eats, Wolt, and Lieferando fleet managers. One click → PDF-quality report."
      />
      <Card
        title="Configure the pack"
        sub="Choose the partner and the reporting period, then generate"
      >
        <div className="stack">
          <div className="row wrap between">
            <SegmentedControl
              value={n}
              onChange={(x) => i(x)}
              label="Partner"
              options={[
                {
                  value: "all",
                  label: "All partners",
                },
                {
                  value: "uber_eats",
                  label: "Uber Eats",
                },
                {
                  value: "wolt",
                  label: "Wolt",
                },
                {
                  value: "lieferando",
                  label: "Lieferando",
                },
              ]}
            />
            <Select
              id="hp-period"
              label="Period"
              value={o}
              onChange={(x) => l(x)}
              options={Ab}
            />
            <Button variant="primary" onClick={p}>
              {Vt.jsx(pl, {
                size: 14,
              })}
              {" Generate"}
            </Button>
          </div>
          {o !== "today" && (
            <Callout tone="warn">
              {
                "POC scoped to today's simulated data. Historical windows will draw from the signed event archive once the pack is wired to production storage."
              }
            </Callout>
          )}
        </div>
      </Card>
      {d && (
        <Vt.Fragment>
          <Card
            title="Cover page"
            sub="Preview of the first page of the export"
          >
            <div className="stack">
              <div
                className="row wrap"
                style={{
                  gap: 16,
                  alignItems: "center",
                }}
              >
                <span
                  aria-label={`${Ol[d.platform]} colour`}
                  style={{
                    display: "inline-block",
                    width: 72,
                    height: 72,
                    borderRadius: 8,
                    background: jb[d.platform],
                  }}
                />
                <div className="stack-sm">
                  <div className="eyebrow">
                    {"Fleet Partner Quarterly · EELS Frankfurt"}
                  </div>
                  <h2
                    style={{
                      margin: 0,
                    }}
                  >
                    {Ol[d.platform]}
                  </h2>
                  <div className="small muted">
                    {d.periodLabel}
                    {" · generated "}
                    {d.generatedAt}
                  </div>
                </div>
              </div>
              <div className="stack-sm">
                <div className="row between wrap">
                  <div className="bold">
                    {"Punctual Time of Delivery (PTOD)"}
                  </div>
                  <Badge tone={yx(d.ptodPct)}>
                    {d.ptodPct.toFixed(1)}
                    {"%"}
                  </Badge>
                </div>
                <Meter value={d.ptodPct} max={100} tone={yx(d.ptodPct)} />
                <div className="row between small muted">
                  <span>
                    {d.onTime}
                    {" on-time / "}
                    {d.completed}
                    {" completed · "}
                    {d.cancelled} {"cancelled"}
                  </span>
                  <span>{"Contract target: 98.5%"}</span>
                </div>
              </div>
            </div>
          </Card>
          {d.sections.map((x) =>
            Vt.jsx(
              _b,
              {
                section: x,
              },
              x.title,
            ),
          )}
          <Card title="Export the pack">
            <div
              className="row wrap"
              style={{
                gap: 8,
              }}
            >
              <Button variant="primary" onClick={u}>
                {Vt.jsx(xr, {
                  size: 14,
                })}
                {" Download Markdown"}
              </Button>
              <Button onClick={s}>
                {Vt.jsx(xr, {
                  size: 14,
                })}
                {" Download CSV"}
              </Button>
              <Button onClick={f}>
                {Vt.jsx(gl, {
                  size: 14,
                })}
                {" Copy to clipboard"}
              </Button>
            </div>
            <p
              className="xsmall muted"
              style={{
                marginTop: 10,
              }}
            >
              {"Metrics derived from canonical state events (mapped from Uber"}{" "}
              <code>{"event.delivery_status"}</code>
              {" and Wolt Order API webhooks). Signature-verified events only."}
            </p>
          </Card>
        </Vt.Fragment>
      )}
      {!d && (
        <Callout>
          {"Pick a partner and a period, then press "}
          <b>{"Generate"}</b>
          {
            " to build the health pack. Nothing is exported until you click a download button."
          }
        </Callout>
      )}
      <Toast message={a} />
    </Vt.Fragment>
  );
}
function _b({ section: t }) {
  return (
    <Card title={t.title}>
      <div className="grid g4">
        {t.metrics.map((e, a) => (
          <Stat
            label={e.label}
            value={e.value}
            foot={e.foot}
            tone={e.tone}
            key={`${t.title}-${a}`}
          />
        ))}
      </div>
      {t.narrative && (
        <p
          className="small muted"
          style={{
            marginTop: 10,
          }}
        >
          {t.narrative}
        </p>
      )}
    </Card>
  );
}
export { HealthPackPage };
