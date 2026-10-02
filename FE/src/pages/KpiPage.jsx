// KPI center.
import * as en from "react";
import * as b from "react/jsx-runtime";
import {
  Badge,
  SegmentedControl,
  Card,
  Field,
  CountFraction,
  PageHeader,
  Tabs,
  wl,
  Callout,
  Button,
} from "../components/ui.jsx";
import {
  opsStore,
  Et,
  useOpsStore,
  Pe,
  V,
  f2,
  ie,
  jt,
  me,
  ml,
  mt,
  n5,
  qr,
  readPilotModel,
} from "../services/portalState.jsx";
import { An, Nn, ve } from "./CapacityPage.jsx";
import { Fr, e2 } from "../components/icons.jsx";
function KpiPage() {
  let [t, e] = en.useState("scorecard");
  return b.jsxs(b.Fragment, {
    children: [
      <PageHeader
        eyebrow="Performance control"
        title="KPI Center"
        description="One scorecard by platform, zone and peak period, with the underlying counts always visible. Each partner's punctuality definition is kept separate from the internal EELS measure."
      />,
      <Tabs
        value={t}
        onChange={e}
        tabs={[
          {
            value: "scorecard",
            label: "Daily scorecard",
          },
          {
            value: "definitions",
            label: "Platform definitions",
          },
          {
            value: "calculator",
            label: "Calculators",
          },
          {
            value: "trend",
            label: "8-week trend",
          },
        ]}
      />,
      t === "scorecard" && b.jsx(ib, {}),
      t === "definitions" && b.jsx(db, {}),
      t === "calculator" && b.jsx(sb, {}),
      t === "trend" && b.jsx(hb, {}),
    ],
  });
}
function ib() {
  let t = jt(),
    e = useOpsStore(),
    [a, r] = en.useState("all"),
    n = a === "all" ? t.completed : t.completed.filter((f) => f.platform === a),
    i = a === "all" ? t.internal : t.byPlatformInternal[a],
    o = t.visible.filter(
      (f) =>
        (a === "all" || f.platform === a) &&
        f.actual.accepted !== void 0 &&
        f.actual.accepted <= t.now,
    ),
    l = t.cancelled.filter(
      (f) => (a === "all" || f.platform === a) && f.actual.accepted !== void 0,
    ),
    d = t.attendance.pct,
    c = Object.values(t.capacity).filter((f) => f.gap > 0).length,
    g = t.completed.length / Math.max(1, t.economics.paidHours),
    p = t.completed.length / Math.max(1, t.economics.onlineHours),
    u = t.restaurants.filter((f) => f.pickups > 0),
    s = readPilotModel().vehicles.reduce((f, x) => f + x.downtimeMinutes7d, 0);
  return (
    <div className="stack">
      <div className="row between wrap">
        <SegmentedControl
          value={a}
          onChange={r}
          label="Platform"
          options={[
            {
              value: "all",
              label: "All platforms",
            },
            ...me.map((f) => ({
              value: f,
              label: mt[f],
            })),
          ]}
        />
        <span className="small muted">
          {"As of "}
          {V(t.now)}
          {" · internal measure unless stated"}
        </span>
      </div>
      <div className="grid g3">
        <Card title="Delivery service">
          <table className="table">
            <tbody>
              <tr>
                <td>{"PTOD (internal)"}</td>
                <td className="num">
                  <Badge tone={wl(i.pct, e.targetPct) ?? "neutral"}>
                    {Et(i.pct)}
                  </Badge>
                </td>
                <td className="num muted small">
                  {i.num}
                  {"/"}
                  {i.den}
                </td>
              </tr>
              <tr>
                <td>{"Pickup punctuality"}</td>
                <td className="num">{Et(t.pickupPunctuality.pct)}</td>
                <td className="num muted small">
                  {t.pickupPunctuality.num}
                  {"/"}
                  {t.pickupPunctuality.den}
                </td>
              </tr>
              <tr>
                <td>{"Cancellation rate"}</td>
                <td className="num">{Et(Pe(l.length, o.length).pct)}</td>
                <td className="num muted small">
                  {l.length}
                  {"/"}
                  {o.length}
                </td>
              </tr>
              <tr>
                <td>{"Wrong or missing orders"}</td>
                <td className="num">
                  {Et(
                    Pe(n.filter((f) => f.wrongOrMissing).length, n.length).pct,
                  )}
                </td>
                <td className="num muted small">
                  {n.filter((f) => f.wrongOrMissing).length}
                  {"/"}
                  {n.length}
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
        <Card title="Workforce capacity">
          <table className="table">
            <tbody>
              <tr>
                <td>{"Staffed vs planned hours"}</td>
                <td className="num">{Et(d)}</td>
                <td className="num muted small">
                  {t.attendance.staffed.toFixed(0)}
                  {"/"}
                  {t.attendance.scheduled.toFixed(0)}
                  {" h"}
                </td>
              </tr>
              <tr>
                <td>{"Zones short (next 30 min)"}</td>
                <td className="num">{c}</td>
                <td className="num muted small">
                  {"of "}
                  {Object.keys(t.capacity).length}
                </td>
              </tr>
              <tr>
                <td>{"Late starts · no-shows"}</td>
                <td className="num">{t.attendance.lateStarts}</td>
                <td className="num muted small">
                  {t.attendance.noShows}
                  {" no-shows"}
                </td>
              </tr>
              <tr>
                <td>{"Deliveries per online hour"}</td>
                <td className="num">{p.toFixed(2)}</td>
                <td className="num muted small">
                  {t.economics.onlineHours.toFixed(0)}
                  {" h"}
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
        <Card title="Operating economics" sub="Illustrative assumptions">
          <table className="table">
            <tbody>
              <tr>
                <td>{"Deliveries per paid hour"}</td>
                <td className="num">{g.toFixed(2)}</td>
                <td className="num muted small">
                  {t.economics.paidHours.toFixed(0)}
                  {" h"}
                </td>
              </tr>
              <tr>
                <td>{"Revenue less direct costs"}</td>
                <td className="num">{ie(t.economics.total.contribution)}</td>
                <td className="num muted small">
                  {Et(t.economics.total.marginPct)}
                </td>
              </tr>
              <tr>
                <td>{"Restaurant wait, median of medians"}</td>
                <td className="num">
                  {(
                    u.map((f) => f.medianWait ?? 0).sort((f, x) => f - x)[
                      Math.floor(u.length / 2)
                    ] ?? 0
                  ).toFixed(1)}
                  {" min"}
                </td>
                <td className="num muted small">
                  {u.length}
                  {" restaurants"}
                </td>
              </tr>
              <tr>
                <td>{"Vehicle downtime (7 days)"}</td>
                <td className="num">
                  {(s / 60).toFixed(1)}
                  {" h"}
                </td>
                <td className="num muted small">{"fleet"}</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
      <div className="grid g2">
        <Card
          title="By zone"
          sub="Counts shown; combined figures add counts, never percentages"
          flush={!0}
        >
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>{"Zone"}</th>
                  <th className="num">{"PTOD"}</th>
                  <th className="num">{"Cancellations"}</th>
                  <th className="num">{"Accepted"}</th>
                </tr>
              </thead>
              <tbody>
                {t.byZone.map((f) => (
                  <tr key={f.zoneId}>
                    <td>{f.name}</td>
                    <td className="num">
                      <CountFraction {...f.ptod} />
                    </td>
                    <td className="num">
                      <CountFraction {...f.cancel} />
                    </td>
                    <td className="num">{f.accepted}</td>
                  </tr>
                ))}
                <tr>
                  <td className="bold">{"All zones (by counts)"}</td>
                  <td className="num bold">
                    <CountFraction {...qr(t.byZone.map((f) => f.ptod))} />
                  </td>
                  <td className="num">
                    <CountFraction {...qr(t.byZone.map((f) => f.cancel))} />
                  </td>
                  <td className="num">
                    {t.byZone.reduce((f, x) => f + x.accepted, 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
        <Card title="By peak period" sub="Orders created in each period">
          <An
            categories={t.byPeriod.map((f) => f.label)}
            series={[
              {
                id: "ptod",
                label: "PTOD",
                color: "var(--seq-3)",
                values: t.byPeriod.map((f) => f.ptod.pct),
              },
            ]}
            yMax={100}
            format={(f) => `${Math.round(f)}%`}
            refLine={{
              value: e.targetPct,
              label: `Target ${e.targetPct}%`,
            }}
          />
          <div
            className="legend"
            style={{
              marginTop: 6,
            }}
          >
            {t.byPeriod.map((f) => (
              <span key={f.id}>
                {f.label}
                {": "}
                {f.ptod.num}
                {"/"}
                {f.ptod.den}
              </span>
            ))}
          </div>
        </Card>
      </div>
      <Card
        title="Platform scores under each definition"
        sub="The same orders, scored the way each partner might score them. Placeholder definitions are marked."
        flush={!0}
      >
        {b.jsx(ob, {})}
      </Card>
    </div>
  );
}
function ob() {
  let t = jt();
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>{"Definition"}</th>
            <th>{"Measures"}</th>
            <th>{"Window"}</th>
            <th className="num">{"Score"}</th>
            <th className="num">{"Target"}</th>
            <th>{"Status"}</th>
          </tr>
        </thead>
        <tbody>
          {t.byDefinition.map(({ def: e, score: a }) => (
            <tr key={e.id}>
              <td>
                <div className="row">
                  {e.platform !== "internal" && (
                    <i
                      className="swatch"
                      style={{
                        background: ve[e.platform],
                      }}
                    />
                  )}
                  <span className="bold">{e.label}</span>
                </div>
              </td>
              <td className="small">{lb(e)}</td>
              <td className="small">
                {e.window.kind === "rolling"
                  ? `Last ${e.window.size} units`
                  : "Today"}
              </td>
              <td className="num">
                <CountFraction {...a} />
              </td>
              <td className="num">
                {e.target}
                {"%"}
              </td>
              <td>
                {e.verified ? (
                  <Badge tone="good">{"Agreed"}</Badge>
                ) : (
                  <Badge tone="warn">{"Placeholder"}</Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function lb(t) {
  let a = [
    {
      handover: "Handover",
      dropoff_arrival: "Arrival at customer",
      pickup_and_dropoff_arrivals: "Pickup and drop-off arrivals",
    }[t.measuredEvent],
    `${t.deadlineBasis} deadline`,
  ];
  return (
    t.toleranceMin && a.push(`+${t.toleranceMin} min tolerance`),
    t.excludeRestaurantWait && a.push("restaurant wait excluded"),
    t.cancellations === "driver_late" &&
      a.push("driver cancellations count late"),
    a.join(" \xB7 ")
  );
}
function db() {
  let t = useOpsStore(),
    e = (a, r) =>
      opsStore.set({
        definitions: t.definitions.map((n) =>
          n.id === a
            ? {
                ...n,
                ...r,
              }
            : n,
        ),
      });
  return (
    <div className="stack">
      <Callout tone="warn">
        {
          "Only the internal EELS measure is decided. German fleet definitions for Uber Eats, Wolt and Lieferando were not verified; agree each one in writing and then mark it as agreed here."
        }
      </Callout>
      <Card title="What to agree with each platform" flush={!0}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{"Question"}</th>
                <th>{"Why it matters"}</th>
                {t.definitions.map((a) => (
                  <th key={a.id}>
                    {a.platform === "internal" ? "EELS" : mt[a.platform]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {n5.map((a) => (
                <tr key={a.key}>
                  <td className="bold">{a.question}</td>
                  <td className="small text-2">{a.reason}</td>
                  {t.definitions.map((r) => (
                    <td className="small" key={r.id}>
                      {cb(r, a.key)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="grid g2">
        {t.definitions.map((a) => (
          <Card
            title=<span className="row">
              {a.platform !== "internal" && (
                <i
                  className="swatch"
                  style={{
                    background: ve[a.platform],
                  }}
                />
              )}
              {a.label}
            </span>
            sub={a.source}
            actions={
              a.verified ? (
                <Badge tone="good">{"Agreed"}</Badge>
              ) : (
                <Badge tone="warn">{"Placeholder"}</Badge>
              )
            }
            key={a.id}
          >
            <div
              className="grid g2"
              style={{
                gap: 10,
              }}
            >
              <Field id={`${a.id}-ev`} label="Measured event">
                <select
                  id={`${a.id}-ev`}
                  className="select"
                  value={a.measuredEvent}
                  onChange={(r) =>
                    e(a.id, {
                      measuredEvent: r.target.value,
                    })
                  }
                >
                  <option value="handover">{"Handover to customer"}</option>
                  <option value="dropoff_arrival">
                    {"Arrival at customer"}
                  </option>
                  <option value="pickup_and_dropoff_arrivals">
                    {"Pickup and drop-off arrivals"}
                  </option>
                </select>
              </Field>
              <Field id={`${a.id}-dl`} label="Deadline basis">
                <select
                  id={`${a.id}-dl`}
                  className="select"
                  value={a.deadlineBasis}
                  onChange={(r) =>
                    e(a.id, {
                      deadlineBasis: r.target.value,
                    })
                  }
                >
                  <option value="original">{"Original deadline"}</option>
                  <option value="updated">{"Updated estimate"}</option>
                </select>
              </Field>
              <Field id={`${a.id}-tol`} label="Tolerance (minutes)">
                <input
                  id={`${a.id}-tol`}
                  className="input"
                  type="number"
                  min={0}
                  max={15}
                  value={a.toleranceMin}
                  onChange={(r) =>
                    e(a.id, {
                      toleranceMin: Number(r.target.value),
                    })
                  }
                />
              </Field>
              <Field id={`${a.id}-tg`} label="Target (%)">
                <input
                  id={`${a.id}-tg`}
                  className="input"
                  type="number"
                  min={50}
                  max={100}
                  step={0.5}
                  value={a.target}
                  onChange={(r) =>
                    e(a.id, {
                      target: Number(r.target.value),
                    })
                  }
                />
              </Field>
              <Field id={`${a.id}-can`} label="Cancelled orders">
                <select
                  id={`${a.id}-can`}
                  className="select"
                  value={a.cancellations}
                  onChange={(r) =>
                    e(a.id, {
                      cancellations: r.target.value,
                    })
                  }
                >
                  <option value="exclude">
                    {"Excluded from the denominator"}
                  </option>
                  <option value="driver_late">
                    {"Driver-caused count as late"}
                  </option>
                </select>
              </Field>
              <Field id={`${a.id}-win`} label="Reporting window">
                <select
                  id={`${a.id}-win`}
                  className="select"
                  value={
                    a.window.kind === "rolling" ? `r${a.window.size}` : "daily"
                  }
                  onChange={(r) =>
                    e(a.id, {
                      window:
                        r.target.value === "daily"
                          ? {
                              kind: "daily",
                            }
                          : {
                              kind: "rolling",
                              size: Number(r.target.value.slice(1)),
                            },
                    })
                  }
                >
                  <option value="daily">{"Daily"}</option>
                  <option value="r100">{"Rolling last 100"}</option>
                  <option value="r200">{"Rolling last 200"}</option>
                  <option value="r500">{"Rolling last 500"}</option>
                </select>
              </Field>
            </div>
            <div
              className="row wrap"
              style={{
                marginTop: 10,
                gap: 16,
              }}
            >
              <label className="check">
                <input
                  type="checkbox"
                  id={`${a.id}-rw`}
                  checked={a.excludeRestaurantWait}
                  onChange={(r) =>
                    e(a.id, {
                      excludeRestaurantWait: r.target.checked,
                    })
                  }
                />
                {"Exclude restaurant waiting"}
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  id={`${a.id}-cw`}
                  checked={a.excludeCustomerWait}
                  onChange={(r) =>
                    e(a.id, {
                      excludeCustomerWait: r.target.checked,
                    })
                  }
                />
                {"Exclude customer waiting"}
              </label>
              {a.platform !== "internal" && (
                <label className="check">
                  <input
                    type="checkbox"
                    id={`${a.id}-ver`}
                    checked={a.verified}
                    onChange={(r) =>
                      e(a.id, {
                        verified: r.target.checked,
                      })
                    }
                  />
                  {"Agreed in writing"}
                </label>
              )}
            </div>
            <p
              className="xsmall muted"
              style={{
                marginTop: 6,
              }}
            >
              {a.notes}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
function cb(t, e) {
  switch (e) {
    case "measuredEvent":
      return {
        handover: "Handover",
        dropoff_arrival: "Arrival at customer",
        pickup_and_dropoff_arrivals: "Pickup + drop-off arrivals",
      }[t.measuredEvent];
    case "deadlineBasis":
      return t.deadlineBasis === "original" ? "Original" : "Updated estimate";
    case "toleranceMin":
      return t.toleranceMin ? `${t.toleranceMin} min` : "None";
    case "cancellations":
      return t.cancellations === "exclude"
        ? "Cancelled orders excluded"
        : "Driver cancellations = late";
    case "excludeRestaurantWait":
      return [
        t.excludeRestaurantWait
          ? "Restaurant wait excluded"
          : "Restaurant wait counts",
        t.excludeCustomerWait ? "customer wait excluded" : "",
      ]
        .filter(Boolean)
        .join(", ");
    case "window":
      return t.window.kind === "rolling" ? `Rolling ${t.window.size}` : "Daily";
    case "target":
      return `${t.target}%, ${t.batchRule === "per_stop" ? "each batch stop" : "per order"}`;
    default:
      return "";
  }
}
function sb() {
  let [t, e] = en.useState({
      onTime: 475,
      eligible: 500,
    }),
    a =
      t.onTime <= t.eligible && t.onTime >= 0 ? f2(t.onTime, t.eligible) : null,
    [r, n] = en.useState([
      {
        name: "Zone A",
        num: 90,
        den: 100,
      },
      {
        name: "Zone B",
        num: 10,
        den: 10,
      },
    ]),
    i = qr(r),
    o = r.length
      ? r.reduce((u, s) => u + (s.den ? (s.num / s.den) * 100 : 0), 0) /
        r.length
      : 0,
    [l, d] = en.useState({
      targetPct: 98.5,
      expectedTotal: 500,
      completedSoFar: 200,
      onTimeSoFar: 180,
    }),
    c = ml(l),
    g = [
      {
        label: "Plan example (95%)",
        v: {
          targetPct: 95,
          expectedTotal: 500,
          completedSoFar: 200,
          onTimeSoFar: 180,
        },
      },
      {
        label: "Plan example (96%)",
        v: {
          targetPct: 96,
          expectedTotal: 500,
          completedSoFar: 200,
          onTimeSoFar: 190,
        },
      },
      {
        label: "Deck slide 14 (98.5%)",
        v: {
          targetPct: 98.5,
          expectedTotal: 500,
          completedSoFar: 200,
          onTimeSoFar: 180,
        },
      },
    ],
    p = (u, s, f, x, M = 1) => (
      <Field id={u} label={s}>
        <input
          id={u}
          className="input"
          type="number"
          step={M}
          value={f}
          onChange={(h) => x(Number(h.target.value))}
        />
      </Field>
    );
  return (
    <div className="grid g2">
      <Card
        title="PTOD"
        sub="On-time completed deliveries ÷ eligible completed deliveries × 100"
      >
        <div
          className="grid g2"
          style={{
            gap: 10,
          }}
        >
          {p("pt-on", "On-time deliveries", t.onTime, (u) =>
            e({
              ...t,
              onTime: u,
            }),
          )}
          {p("pt-el", "Eligible completed deliveries", t.eligible, (u) =>
            e({
              ...t,
              eligible: u,
            }),
          )}
        </div>
        <p
          style={{
            marginTop: 12,
            fontSize: 22,
          }}
          className="bold"
        >
          {a
            ? `${a.pct?.toFixed(1) ?? "\u2014"}%`
            : "On-time cannot exceed eligible"}
        </p>
        {a?.pct !== null && a && (
          <p className="small muted">
            {Math.round(a.pct ?? 0)}
            {" of every 100 deliveries were on time."}
          </p>
        )}
      </Card>
      <Card
        title="Weighted aggregation"
        sub="Combine zones by counts, never by averaging percentages"
      >
        <div className="stack-sm">
          {r.map((u, s) => (
            <div className="row" key={s}>
              <input
                className="input"
                style={{
                  width: 110,
                }}
                aria-label="Name"
                id={`agg-n-${s}`}
                value={u.name}
                onChange={(f) =>
                  n(
                    r.map((x, M) =>
                      M === s
                        ? {
                            ...x,
                            name: f.target.value,
                          }
                        : x,
                    ),
                  )
                }
              />
              <input
                className="input"
                style={{
                  width: 80,
                }}
                type="number"
                aria-label="On time"
                id={`agg-o-${s}`}
                value={u.num}
                onChange={(f) =>
                  n(
                    r.map((x, M) =>
                      M === s
                        ? {
                            ...x,
                            num: Number(f.target.value),
                          }
                        : x,
                    ),
                  )
                }
              />
              <span className="muted">{"/"}</span>
              <input
                className="input"
                style={{
                  width: 80,
                }}
                type="number"
                aria-label="Completed"
                id={`agg-d-${s}`}
                value={u.den}
                onChange={(f) =>
                  n(
                    r.map((x, M) =>
                      M === s
                        ? {
                            ...x,
                            den: Number(f.target.value),
                          }
                        : x,
                    ),
                  )
                }
              />
              <span className="small muted grow">
                {u.den ? `${((u.num / u.den) * 100).toFixed(1)}%` : "\u2014"}
              </span>
              <button
                className="icon-btn"
                aria-label="Remove row"
                onClick={() => n(r.filter((f, x) => x !== s))}
              >
                {b.jsx(e2, {
                  size: 14,
                })}
              </button>
            </div>
          ))}
          <div>
            <Button
              size="sm"
              onClick={() =>
                n([
                  ...r,
                  {
                    name: `Zone ${String.fromCharCode(65 + r.length)}`,
                    num: 0,
                    den: 0,
                  },
                ])
              }
            >
              <Fr size={13} />
              {" Add row"}
            </Button>
          </div>
        </div>
        <p
          style={{
            marginTop: 12,
          }}
        >
          {"Combined: "}
          <b>{Et(i.pct)}</b>
          {" ("}
          {i.num}
          {"/"}
          {i.den}
          {") · Simple average would wrongly say "}
          <s>
            {o.toFixed(1)}
            {"%"}
          </s>
        </p>
      </Card>
      <Card
        title="End-of-day PTOD forecast"
        sub="What punctuality do the remaining deliveries need?"
      >
        <div
          className="row wrap"
          style={{
            marginBottom: 10,
          }}
        >
          {g.map((u) => (
            <Button size="sm" onClick={() => d(u.v)} key={u.label}>
              {u.label}
            </Button>
          ))}
        </div>
        <div
          className="grid g2"
          style={{
            gap: 10,
          }}
        >
          {p(
            "eod-t",
            "Daily target %",
            l.targetPct,
            (u) =>
              d({
                ...l,
                targetPct: u,
              }),
            0.5,
          )}
          {p("eod-x", "Expected deliveries today", l.expectedTotal, (u) =>
            d({
              ...l,
              expectedTotal: u,
            }),
          )}
          {p("eod-c", "Completed so far", l.completedSoFar, (u) =>
            d({
              ...l,
              completedSoFar: u,
            }),
          )}
          {p("eod-o", "On time so far", l.onTimeSoFar, (u) =>
            d({
              ...l,
              onTimeSoFar: u,
            }),
          )}
        </div>
        <table
          className="table"
          style={{
            marginTop: 12,
          }}
        >
          <tbody>
            <tr>
              <td>
                {"On-time needed for "}
                {l.targetPct}
                {"% of "}
                {l.expectedTotal}
              </td>
              <td className="num bold">{c.requiredOnTime}</td>
            </tr>
            <tr>
              <td>{"Remaining on-time needed"}</td>
              <td className="num">
                {c.remainingOnTimeNeeded}
                {" of "}
                {c.remaining}
              </td>
            </tr>
            <tr>
              <td>{"Required punctuality for the rest of the day"}</td>
              <td className="num bold">
                {c.requiredRemainingPct === null
                  ? "\u2014"
                  : `${c.requiredRemainingPct.toFixed(1)}%`}
              </td>
            </tr>
            <tr>
              <td>{"Best possible result"}</td>
              <td className="num">
                {c.bestCaseOnTime}
                {"/"}
                {l.expectedTotal}
                {" = "}
                {c.bestCasePct.toFixed(1)}
                {"%"}
              </td>
            </tr>
          </tbody>
        </table>
        {c.status === "unreachable" && (
          <Callout tone="crit">
            {
              "Unreachable: the remaining deliveries would need more than 100% punctuality. Report honestly and improve the remaining service."
            }
          </Callout>
        )}
        {c.status !== "unreachable" && (
          <Callout>
            {
              "Both forecasts depend on the final delivery volume, and apply to the daily internal measure only, not to a rolling platform score."
            }
          </Callout>
        )}
      </Card>
      <Card
        title="Early-warning margin"
        sub="Time margin = agreed deadline − predicted completion"
      >
        {b.jsx(ub, {})}
      </Card>
    </div>
  );
}
function ub() {
  let [t, e] = en.useState("20:00"),
    [a, r] = en.useState("19:56"),
    n = (l) => {
      let [d, c] = l.split(":").map(Number);
      return d * 60 + c;
    },
    i = n(t) - n(a),
    o = i < 0 ? "red" : i <= 5 ? "amber" : "green";
  return (
    <div className="stack">
      <div
        className="grid g2"
        style={{
          gap: 10,
        }}
      >
        <Field id="mg-d" label="Agreed deadline">
          <input
            id="mg-d"
            className="input"
            type="time"
            value={t}
            onChange={(l) => e(l.target.value)}
          />
        </Field>
        <Field id="mg-p" label="Predicted completion">
          <input
            id="mg-p"
            className="input"
            type="time"
            value={a}
            onChange={(l) => r(l.target.value)}
          />
        </Field>
      </div>
      <p
        className="bold"
        style={{
          fontSize: 20,
        }}
      >
        {i}
        {" min margin · "}
        <Badge tone={o === "red" ? "crit" : o === "amber" ? "warn" : "good"}>
          {o === "red"
            ? "Red: escalate and record the cause"
            : o === "amber"
              ? "Amber: check food readiness and obstacles"
              : "Green: continue monitoring"}
        </Badge>
      </p>
      <p className="small muted">
        {
          "Thresholds are illustrative and editable in Settings; calibrate them during the pilot."
        }
      </p>
    </div>
  );
}
function hb() {
  let t = readPilotModel(),
    e = useOpsStore(),
    a = jt(),
    r = t.history,
    n = [...r.map((c) => c.date.slice(5)), "Today"],
    i = [...r.map((c) => (c.onTime / c.completed) * 100), a.internal.pct],
    o = (c) => [
      ...r.map(
        (g) =>
          (g.byPlatform[c].onTime / Math.max(1, g.byPlatform[c].completed)) *
          100,
      ),
      a.byPlatformInternal[c].pct,
    ],
    l = [...r.map((c) => (c.cancelled / c.accepted) * 100), a.cancellation.pct],
    d = en.useMemo(
      () => [...r.map((c) => c.completed), a.completed.length],
      [r, a.completed.length],
    );
  return (
    <div className="stack">
      <Card
        title="PTOD, last 8 weeks"
        sub="Internal measure. Today is the day so far."
      >
        <Nn
          labels={n}
          series={[
            {
              id: "all",
              label: "All platforms",
              color: "var(--text-2)",
              values: i,
            },
            ...me.map((c) => ({
              id: c,
              label: mt[c],
              color: ve[c],
              values: o(c),
            })),
          ]}
          yMin={80}
          yMax={100}
          format={(c) => `${c.toFixed(0)}%`}
          refLine={{
            value: e.targetPct,
            label: `Target ${e.targetPct}%`,
          }}
        />
      </Card>
      <div className="grid g2">
        <Card title="Cancellations after acceptance">
          <Nn
            labels={n}
            series={[
              {
                id: "c",
                label: "Cancellation rate",
                color: "var(--s-wolt)",
                values: l,
              },
            ]}
            yMin={0}
            yMax={6}
            format={(c) => `${c.toFixed(1)}%`}
          />
        </Card>
        <Card title="Completed deliveries per day">
          <An
            categories={n}
            series={[
              {
                id: "v",
                label: "Deliveries",
                color: "var(--seq-3)",
                values: d,
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
export { KpiPage };
