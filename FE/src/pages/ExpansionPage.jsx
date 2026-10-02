// Expansion scenarios page.
import * as S3 from "react";
import * as St from "react/jsx-runtime";
import {
  C0,
  opsStore,
  Et,
  useOpsStore,
  Ln,
  ie,
  jt,
  me,
  mt,
  qr,
  readPilotModel,
} from "../services/portalState.jsx";
import {
  Badge,
  Card,
  Meter,
  Field,
  PageHeader,
  Callout,
} from "../components/ui.jsx";
import { Sk, Zr } from "../components/icons.jsx";
import { z2 } from "./DashboardPage.jsx";
import { Cl } from "./AdminPage.jsx";
function ExpansionPage() {
  let t = jt(),
    e = readPilotModel(),
    a = useOpsStore(),
    r = a.gateThresholds,
    n = e.history.slice(-7),
    i = qr(
      n.map((s) => ({
        num: s.onTime,
        den: s.completed,
      })),
    ),
    o = S3.useMemo(() => {
      let s = 0,
        f = 0,
        x = C0.filter((M) => M.id === "lunch" || M.id === "dinner");
      for (let M of e.zones)
        for (let h of x)
          for (let m = Math.ceil(h.from / 30); m < Math.floor(h.to / 30); m++) {
            let y = m * 30 + 15,
              k = e.drivers.filter(
                (w) =>
                  w.homeZoneId === M.id &&
                  !w.noShow &&
                  y >= w.shiftStart &&
                  y < w.shiftEnd,
              ).length,
              L = Ln(
                t.forecasts[M.id][m].p50 * 2,
                M.minutesPerOrder,
                a.utilisation,
              ).rounded;
            (f++, k >= L && s++);
          }
      return f ? (s / f) * 100 : 0;
    }, [e, t.forecasts, a.utilisation]),
    l = t.visible.filter(
      (s) => s.actual.accepted !== void 0 && s.actual.accepted <= t.now,
    ).length,
    d = t.cancelled.filter(
      (s) => s.cancellation.initiatedBy === "driver",
    ).length,
    c = l ? (d / l) * 100 : 0,
    g = t.economics.total.contribution / Math.max(1, t.economics.paidHours),
    p = [
      {
        key: "ptod",
        label: "Repeatable punctuality",
        detail: `Last 7 days PTOD ${Et(i.pct)} (${i.num}/${i.den})`,
        ok: (i.pct ?? 0) >= r.ptod,
        threshold: `\u2265 ${r.ptod}%`,
        value: i.pct ?? 0,
        max: 100,
      },
      {
        key: "peakCoverage",
        label: "Reliable peak coverage",
        detail: `${o.toFixed(0)}% of lunch and dinner zone slots fully rostered today`,
        ok: o >= r.peakCoverage,
        threshold: `\u2265 ${r.peakCoverage}%`,
        value: o,
        max: 100,
      },
      {
        key: "controllableCancel",
        label: "Low controllable cancellations",
        detail: `Driver-caused cancellations ${c.toFixed(2)}% (${d}/${l})`,
        ok: c <= r.controllableCancel,
        threshold: `\u2264 ${r.controllableCancel}%`,
        value: c,
        max: Math.max(2, r.controllableCancel * 2),
      },
      {
        key: "contributionPerHour",
        label: "Positive contribution after direct costs",
        detail: `${ie(g, 2)} per paid hour today (illustrative assumptions)`,
        ok: g > r.contributionPerHour,
        threshold: `> \u20AC${r.contributionPerHour}/h`,
        value: Math.max(0, g + 10),
        max: 20,
      },
    ],
    u = p.filter((s) => s.ok).length;
  return (
    <St.Fragment>
      <PageHeader
        eyebrow="Pilot and scale"
        title="Pilot & Expansion"
        description="Frankfurt is the pilot. Expansion follows only after the pilot shows repeatable punctuality, reliable peak coverage, low controllable cancellations and a positive contribution after direct costs."
      />
      <div className="grid g-2-1">
        <Card
          title="Pilot gate"
          sub="PTOD target 98.5% (set by EELS); the other thresholds are placeholders until agreed"
          actions=<Badge tone={u === p.length ? "good" : "warn"}>
            {u === p.length
              ? "Ready for Phase 1"
              : `${u} of ${p.length} criteria met`}
          </Badge>
        >
          <div className="stack">
            {p.map((s) => (
              <div className="alert-item" key={s.key}>
                {s.ok ? (
                  <Zr size={18} color="var(--good)" />
                ) : (
                  <Sk size={18} color="var(--crit)" />
                )}
                <div
                  className="grow stack-sm"
                  style={{
                    gap: 4,
                  }}
                >
                  <div className="row between">
                    <span className="t">{s.label}</span>
                    <Badge tone={s.ok ? "good" : "crit"}>
                      {s.ok ? "Met" : "Not met"}
                    </Badge>
                  </div>
                  <div className="d">{s.detail}</div>
                  <Meter
                    value={s.value}
                    max={s.max}
                    tone={s.ok ? "good" : "crit"}
                  />
                </div>
                <div
                  style={{
                    width: 110,
                  }}
                >
                  <Field
                    id={`gate-${s.key}`}
                    label={`Threshold ${s.threshold}`}
                  >
                    <input
                      id={`gate-${s.key}`}
                      className="input"
                      type="number"
                      step={s.key === "controllableCancel" ? 0.1 : 1}
                      value={r[s.key]}
                      onChange={(f) =>
                        opsStore.set({
                          gateThresholds: {
                            ...r,
                            [s.key]: Number(f.target.value),
                          },
                        })
                      }
                    />
                  </Field>
                </div>
              </div>
            ))}
            <Callout>
              {
                "Apply the lessons from each city before launching the next. No launch dates or city-specific demand forecasts have been confirmed."
              }
            </Callout>
          </div>
        </Card>
        <Card title="Rollout map" sub="Schematic positions">
          {St.jsx(z2, {})}
        </Card>
      </div>
      <div className="grid g2">
        <Card title="Rollout stages" flush={!0}>
          <table className="table">
            <thead>
              <tr>
                <th>{"Stage"}</th>
                <th>{"Cities"}</th>
                <th>{"Purpose"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Badge tone="accent">{"Pilot"}</Badge>
                </td>
                <td>{"Frankfurt"}</td>
                <td className="small">
                  {
                    "Use the Raunheim base to test staffing, punctuality, equipment support and unit economics."
                  }
                </td>
              </tr>
              <tr>
                <td>
                  <Badge tone="info">{"Phase 1"}</Badge>
                </td>
                <td>
                  {"Berlin, Munich, Frankfurt, Hamburg, Cologne, Düsseldorf"}
                </td>
                <td className="small">
                  {
                    "Progressive expansion across the target metropolitan markets."
                  }
                </td>
              </tr>
              <tr>
                <td>
                  <Badge tone="warn">{"Phase 2"}</Badge>
                </td>
                <td>{"Bonn, Duisburg, then suitable surrounding locations"}</td>
                <td className="small">
                  {
                    "Additional urban and regional markets; semi-urban areas where demand and route economics support it."
                  }
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
        <Card
          title="Partner agreements"
          sub="What each agreement must cover before capacity is committed"
        >
          <div className="stack">
            {me.map((s) => {
              let f = Cl.filter(
                (x, M) => a.partnerChecklist[`${s}:${M}`],
              ).length;
              return (
                <details key={s}>
                  <summary
                    className="row between"
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <span className="bold">{mt[s]}</span>
                    <span
                      className="row"
                      style={{
                        width: 180,
                      }}
                    >
                      <span className="grow">
                        <Meter
                          value={f}
                          max={Cl.length}
                          tone={f === Cl.length ? "good" : void 0}
                        />
                      </span>
                      <span className="small num">
                        {f}
                        {"/"}
                        {Cl.length}
                      </span>
                    </span>
                  </summary>
                  <div
                    className="stack-sm"
                    style={{
                      padding: "6px 0 4px",
                    }}
                  >
                    {Cl.map((x, M) => (
                      <label className="check" key={x}>
                        <input
                          type="checkbox"
                          id={`pc-${s}-${M}`}
                          checked={!!a.partnerChecklist[`${s}:${M}`]}
                          onChange={(h) =>
                            opsStore.set((m) => ({
                              partnerChecklist: {
                                ...m.partnerChecklist,
                                [`${s}:${M}`]: h.target.checked,
                              },
                            }))
                          }
                        />
                        {x}
                      </label>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        </Card>
      </div>
    </St.Fragment>
  );
}
export { ExpansionPage };
