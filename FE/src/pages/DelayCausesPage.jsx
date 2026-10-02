// Delay-cause breakdown.
import * as ka from "react";
import * as vt from "react/jsx-runtime";
import { jt, me, mt, rt, readPilotModel } from "../services/portalState.jsx";
import {
  Badge,
  SegmentedControl,
  Card,
  Stat,
  PageHeader,
  Callout,
} from "../components/ui.jsx";
var co = [
    "restaurant_prep",
    "courier_wait_pickup",
    "traffic",
    "address_issue",
    "handover",
    "batching",
    "on_time",
  ],
  tc = {
    restaurant_prep: "Restaurant prep",
    courier_wait_pickup: "Courier wait at pickup",
    traffic: "Traffic / route",
    address_issue: "Address issue",
    handover: "Customer handover",
    batching: "Batching overhead",
    on_time: "On time",
  },
  p3 = {
    restaurant_prep: "warn",
    courier_wait_pickup: "warn",
    traffic: "info",
    address_issue: "crit",
    handover: "crit",
    batching: "neutral",
    on_time: "good",
  };
function OM(t) {
  let e = t.actual.delivered;
  return e === void 0 ? !1 : e - t.deadlineOriginal > 0.5;
}
function ec(t) {
  if (!OM(t)) return "on_time";
  let e = t.actual,
    a = t.planned,
    r = e.arrivedPickup,
    n = e.pickedUp,
    i = e.arrivedDropoff,
    o = e.delivered,
    l = r !== void 0 ? r - a.arrivedPickup : 0,
    d = r !== void 0 && n !== void 0 ? n - r : 0,
    c = i !== void 0 ? i - a.arrivedDropoff : 0,
    g = i !== void 0 && o !== void 0 ? o - i : 0;
  return l > 5 && d < 3
    ? "restaurant_prep"
    : d > 5
      ? "courier_wait_pickup"
      : c > 6 && g > 4
        ? "address_issue"
        : g > 4
          ? "handover"
          : t.batchId
            ? "batching"
            : "traffic";
}
function g3(t) {
  let e = new Map();
  for (let r of co)
    e.set(r, {
      count: 0,
      totalMinutesLate: 0,
    });
  for (let r of t) {
    if (r.actual.delivered === void 0) continue;
    let n = ec(r),
      i = e.get(n);
    if (((i.count += 1), n !== "on_time")) {
      let o = Math.max(0, (r.actual.delivered ?? 0) - r.deadlineOriginal);
      i.totalMinutesLate += o;
    }
  }
  let a = co
    .filter((r) => r !== "on_time")
    .reduce((r, n) => r + (e.get(n)?.count ?? 0), 0);
  return co.map((r) => {
    let n = e.get(r),
      i = r === "on_time" || a === 0 ? 0 : n.count / a;
    return {
      cause: r,
      count: n.count,
      totalMinutesLate: n.totalMinutesLate,
      pct: i,
    };
  });
}
var EM = {
    restaurant_prep: "var(--warn-ink)",
    courier_wait_pickup: "var(--warn-ink)",
    traffic: "var(--info-ink)",
    address_issue: "var(--crit-ink)",
    handover: "var(--crit-ink)",
    batching: "var(--info-ink)",
    on_time: "var(--good-ink)",
  },
  so = co.filter((t) => t !== "on_time"),
  HM = {
    restaurant_prep:
      "Coordinate with restaurant on prep-time SLA; delay courier dispatch.",
    courier_wait_pickup:
      "Increase courier arrival buffer; verify food-ready signal.",
    traffic: "Reroute via secondary corridor; watch peak-hour zone density.",
    address_issue:
      "Prompt customer confirmation on drop; validate address at order time.",
    handover:
      "Coach courier on handover flow; enable customer 'I'm here' ping.",
    batching: "Reduce batch size in this zone during peak; split at pickup.",
    on_time: "-",
  };
function RM(t) {
  let e = Math.floor(t / 60) % 24;
  return `${String(e).padStart(2, "0")}:00`;
}
function DelayCausesPage() {
  let t = jt(),
    e = readPilotModel(),
    [a, r] = ka.useState("today"),
    [n, i] = ka.useState("all"),
    [o, l] = ka.useState("zone"),
    d = ka.useMemo(
      () => new Map(e.restaurants.map((L) => [L.id, L])),
      [e.restaurants],
    ),
    c = ka.useMemo(
      () => t.completed.filter((L) => n === "all" || L.platform === n),
      [t.completed, n],
    ),
    g = ka.useMemo(() => c.filter((L) => ec(L) !== "on_time"), [c]),
    p = ka.useMemo(() => g3(c), [c]),
    u = g.length,
    s = ka.useMemo(
      () =>
        g.reduce(
          (L, w) =>
            L + Math.max(0, (w.actual.delivered ?? 0) - w.deadlineOriginal),
          0,
        ),
      [g],
    ),
    f = u > 0 ? s / u : 0,
    x = ka.useMemo(
      () =>
        p
          .filter((w) => w.cause !== "on_time")
          .reduce(
            (w, O) =>
              w === null || O.count > w.count
                ? {
                    cause: O.cause,
                    count: O.count,
                  }
                : w,
            null,
          ),
      [p],
    ),
    M = ka.useMemo(() => {
      let L = new Map();
      for (let w of g) L.set(w.restaurantId, (L.get(w.restaurantId) ?? 0) + 1);
      return L;
    }, [g]),
    h = ka.useMemo(() => [...M.values()].filter((L) => L > 3).length, [M]),
    m = ka.useMemo(() => {
      let L = p
          .filter((O) => O.cause !== "on_time")
          .sort((O, A) => A.count - O.count),
        w = L.reduce((O, A) => Math.max(O, A.count), 0);
      return {
        rows: L,
        max: w,
      };
    }, [p]),
    y = ka.useMemo(() => {
      let L = (j) => {
          switch (o) {
            case "zone":
              return {
                key: j.zoneId,
                label: rt(j.zoneId),
              };
            case "restaurant": {
              let v = d.get(j.restaurantId);
              return {
                key: j.restaurantId,
                label: v?.name ?? j.restaurantId,
              };
            }
            case "hour": {
              let v = j.actual.delivered ?? j.createdAt;
              return {
                key: `h-${Math.floor(v / 60) % 24}`,
                label: RM(v),
              };
            }
            case "platform":
              return {
                key: j.platform,
                label: mt[j.platform],
              };
          }
        },
        w = new Map();
      for (let j of g) {
        let { key: v, label: E } = L(j),
          Q = ec(j),
          _ = w.get(v);
        (_ ||
          ((_ = {
            label: E,
            counts: co.reduce(
              (Mt, Wt) => ({
                ...Mt,
                [Wt]: 0,
              }),
              {},
            ),
            total: 0,
          }),
          w.set(v, _)),
          (_.counts[Q] += 1),
          (_.total += 1));
      }
      let O = [...w.entries()]
          .map(([j, v]) => ({
            key: j,
            ...v,
          }))
          .sort((j, v) => v.total - j.total)
          .slice(0, 12),
        A = 0;
      for (let j of O) for (let v of so) A = Math.max(A, j.counts[v]);
      return {
        rows: O,
        max: A,
      };
    }, [g, o, d]),
    k = ka.useMemo(() => {
      let L = new Map(),
        w = new Map(),
        O = () =>
          co.reduce(
            (v, E) => ({
              ...v,
              [E]: 0,
            }),
            {},
          );
      for (let v of g) {
        let E = ec(v),
          Q = L.get(v.restaurantId);
        (Q || ((Q = O()), L.set(v.restaurantId, Q)), (Q[E] += 1));
        let _ = w.get(v.zoneId);
        (_ || ((_ = O()), w.set(v.zoneId, _)), (_[E] += 1));
      }
      let A = (v) => {
          let E = "traffic",
            Q = -1;
          for (let _ of so) v[_] > Q && ((Q = v[_]), (E = _));
          return E;
        },
        j = [];
      for (let [v, E] of L) {
        let Q = so.reduce((_, Mt) => _ + E[Mt], 0);
        j.push({
          key: `r-${v}`,
          kind: "restaurant",
          label: d.get(v)?.name ?? v,
          count: Q,
          dominant: A(E),
        });
      }
      for (let [v, E] of w) {
        let Q = so.reduce((_, Mt) => _ + E[Mt], 0);
        j.push({
          key: `z-${v}`,
          kind: "zone",
          label: rt(v),
          count: Q,
          dominant: A(E),
        });
      }
      return j.sort((v, E) => E.count - v.count).slice(0, 5);
    }, [g, d]);
  return vt.jsxs(vt.Fragment, {
    children: [
      <PageHeader
        eyebrow="Diagnostics"
        title="Delay-Cause Analytics"
        description="Break down late deliveries by root cause, cross-cut by zone, restaurant, hour or platform. Drives the root-cause action queue below."
      />,
      <Card
        title="Filters"
        actions={vt.jsxs(vt.Fragment, {
          children: [
            <SegmentedControl
              value={a}
              onChange={r}
              options={[
                {
                  value: "today",
                  label: "Today",
                },
                {
                  value: "last7d",
                  label: "Last 7d",
                },
              ]}
            />,
            <SegmentedControl
              value={n}
              onChange={i}
              options={[
                {
                  value: "all",
                  label: "All",
                },
                ...me.map((L) => ({
                  value: L,
                  label: mt[L],
                })),
              ]}
            />,
            <SegmentedControl
              value={o}
              onChange={l}
              options={[
                {
                  value: "zone",
                  label: "Zone",
                },
                {
                  value: "restaurant",
                  label: "Restaurant",
                },
                {
                  value: "hour",
                  label: "Hour",
                },
                {
                  value: "platform",
                  label: "Platform",
                },
              ]}
            />,
          ],
        })}
      >
        {a === "last7d" && (
          <Callout>
            {"Last-7d uses today for POC — replace with "}
            <code>{"world.days"}</code>
            {" slice when history wired."}
          </Callout>
        )}
        <Callout>
          {"Cause detection uses simulated "}
          <code>{"planned"}</code>
          {" vs "}
          <code>{"actual"}</code>
          {" times. Uber"}
          <code>{" event.delivery_status"}</code>
          {" transitions ("}
          <code>{"pickup_complete"}</code>
          {" to "}
          <code>{"delivered"}</code>
          {") and Wolt "}
          <code>{"production to ready to delivered"}</code>
          {" timestamps map to the same slots once wired."}
        </Callout>
      </Card>,
      <div className="grid g4">
        <Stat
          label="Total late"
          value={u}
          foot={`${c.length} completed in scope`}
          tone={u > 0 ? "warn" : "good"}
        />
        <Stat
          label="Top cause"
          value={x ? tc[x.cause] : "\u2014"}
          foot={
            x ? `${x.count} order${x.count === 1 ? "" : "s"}` : "No late orders"
          }
        />
        <Stat
          label="Avg minutes late"
          value={u > 0 ? `${f.toFixed(1)} min` : "\u2014"}
          tone={f >= 8 ? "crit" : f >= 4 ? "warn" : void 0}
        />
        <Stat
          label="Restaurants > 3 late"
          value={h}
          foot="Candidates for escalation"
          tone={h > 0 ? "warn" : void 0}
        />
      </div>,
      <Card
        title="Pareto of delay causes"
        sub="Ordered by count; share is of late deliveries in scope"
      >
        {m.rows.length === 0 ? (
          <p className="muted">{"No late deliveries in the current scope."}</p>
        ) : (
          <div className="stack">
            {m.rows.map((L) => {
              let w = m.max === 0 ? 0 : (L.count / m.max) * 100;
              return (
                <div className="stack-sm" key={L.cause}>
                  <div className="row between small">
                    <span className="bold">{tc[L.cause]}</span>
                    <span className="num muted">
                      {L.count}
                      {" · "}
                      {Math.round(L.pct * 100)}
                      {"% · "}
                      {Math.round(L.totalMinutesLate)}
                      {" min"}
                    </span>
                  </div>
                  <div
                    aria-hidden={!0}
                    style={{
                      width: "100%",
                      height: 10,
                      background: "var(--surface-2, rgba(0,0,0,0.06))",
                      borderRadius: 6,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${w}%`,
                        height: "100%",
                        background: EM[L.cause],
                        transition: "width 200ms ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>,
      <Card
        title={`Heatmap \xB7 ${f3(o)} \xD7 cause`}
        sub="Cell shade encodes count; empty rows are hidden"
        flush={!0}
      >
        <div
          className="table-wrap table-scroll"
          style={{
            maxHeight: 480,
          }}
        >
          <table className="table">
            <thead>
              <tr>
                <th>{f3(o)}</th>
                {so.map((L) => (
                  <th className="num" key={L}>
                    {tc[L]}
                  </th>
                ))}
                <th className="num">{"Total"}</th>
              </tr>
            </thead>
            <tbody>
              {y.rows.length === 0 && (
                <tr>
                  <td colSpan={so.length + 2} className="empty">
                    {"No late orders in scope for this dimension."}
                  </td>
                </tr>
              )}
              {y.rows.map((L) => (
                <tr key={L.key}>
                  <td className="bold">{L.label}</td>
                  {so.map((w) => {
                    let O = L.counts[w],
                      A = y.max === 0 ? 0 : O / y.max;
                    return (
                      <td
                        className="num"
                        style={{
                          background:
                            O === 0 ? void 0 : `rgba(220, 38, 38, ${A})`,
                          color: A > 0.55 ? "white" : void 0,
                        }}
                        key={w}
                      >
                        {O === 0 ? "\u2014" : O}
                      </td>
                    );
                  })}
                  <td className="num bold">{L.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>,
      <Card
        title="Root-cause action queue"
        sub="Top 5 offending entities with their dominant cause and a suggested action"
        flush={!0}
      >
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{"Entity"}</th>
                <th>{"Kind"}</th>
                <th className="num">{"Late orders"}</th>
                <th>{"Dominant cause"}</th>
                <th>{"Action"}</th>
              </tr>
            </thead>
            <tbody>
              {k.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty">
                    {"Nothing to action — no late orders in scope."}
                  </td>
                </tr>
              )}
              {k.map((L) => (
                <tr key={L.key}>
                  <td className="bold">{L.label}</td>
                  <td>
                    <Badge tone={L.kind === "restaurant" ? "info" : "neutral"}>
                      {L.kind}
                    </Badge>
                  </td>
                  <td className="num">{L.count}</td>
                  <td>
                    <Badge tone={p3[L.dominant]}>{tc[L.dominant]}</Badge>
                  </td>
                  <td className="small">{HM[L.dominant]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>,
    ],
  });
}
function f3(t) {
  switch (t) {
    case "zone":
      return "Zone";
    case "restaurant":
      return "Restaurant";
    case "hour":
      return "Hour";
    case "platform":
      return "Platform";
  }
}
export { DelayCausesPage };
