// Zone hex view.
import * as yi from "react";
import * as kt from "react/jsx-runtime";
import { useSimClock, readPilotModel } from "../services/portalState.jsx";
import {
  Badge,
  SegmentedControl,
  Stat,
  PageHeader,
  Drawer,
  Callout,
} from "../components/ui.jsx";
var QM = Math.sqrt(3),
  _3 = 3;
function W3(t, e, a) {
  let r = [],
    n = QM * a,
    i = 1.5 * a;
  for (let o = 0; o < e; o++)
    for (let l = 0; l < t; l++) {
      let d = (o & 1) === 1 ? n * 0.5 : 0,
        c = l * n + d + n * 0.5,
        g = o * i + a;
      r.push({
        id: `hex-${l}-${o}`,
        col: l,
        row: o,
        centerX: c,
        centerY: g,
        zoneId: null,
        ordersLastHour: 0,
        activeCouriers: 0,
        gap: 0,
        etaRiskScore: 0,
      });
    }
  return r;
}
function O3(t, e) {
  if (e.length !== 0)
    for (let a of t) {
      let r = null,
        n = 1 / 0;
      for (let i of e) {
        let o = a.centerX - i.x,
          l = a.centerY - i.y,
          d = o * o + l * l;
        d < n && ((n = d), (r = i.id));
      }
      a.zoneId = r;
    }
}
function E3(t, e, a, r) {
  let n = e - 60,
    i = {};
  for (let d of a)
    d.createdAt >= n &&
      d.createdAt <= e &&
      (i[d.zoneId] = (i[d.zoneId] ?? 0) + 1);
  let o = {};
  for (let d of r)
    e >= d.shiftStart &&
      e < d.shiftEnd &&
      (o[d.homeZoneId] = (o[d.homeZoneId] ?? 0) + 1);
  let l = {};
  for (let d of t) d.zoneId && (l[d.zoneId] = (l[d.zoneId] ?? 0) + 1);
  return t.map((d) => {
    let c = {
      ...d,
    };
    if (!d.zoneId) return c;
    let g = l[d.zoneId] ?? 1,
      u =
        0.55 + ((((d.col * 73856093) ^ (d.row * 19349663)) >>> 0) % 1e3) / 1250,
      s = ((i[d.zoneId] ?? 0) / g) * u,
      f = ((o[d.zoneId] ?? 0) / g) * (1.9 - u);
    ((c.ordersLastHour = Math.max(0, Math.round(s))),
      (c.activeCouriers = Math.max(0, Math.round(f))),
      (c.gap = c.ordersLastHour - c.activeCouriers * _3));
    let x = Math.max(1, c.activeCouriers * _3),
      M = c.ordersLastHour / x;
    return ((c.etaRiskScore = Math.max(0, Math.min(1, (M - 0.6) / 1.4))), c);
  });
}
function T3(t, e) {
  let a = t - (e - (e & 1)) / 2,
    r = e;
  return {
    x: a,
    z: r,
    y: -a - r,
  };
}
function H3(t, e, a) {
  let r = T3(t.col, t.row),
    n = [];
  for (let i of e) {
    if (i.id === t.id) continue;
    let o = T3(i.col, i.row);
    (Math.abs(r.x - o.x) + Math.abs(r.y - o.y) + Math.abs(r.z - o.z)) / 2 <=
      a && n.push(i);
  }
  return n;
}
function R3(t, e, a) {
  let r = [];
  for (let n = 0; n < 6; n++) {
    let i = (Math.PI / 3) * n - Math.PI / 2,
      o = t + a * Math.cos(i),
      l = e + a * Math.sin(i);
    r.push(`${n === 0 ? "M" : "L"} ${o.toFixed(2)} ${l.toFixed(2)}`);
  }
  return (r.push("Z"), r.join(" "));
}
var $0 = 900,
  F0 = 600,
  D3 = 30,
  JM = 15,
  tb = 12,
  eb = [
    "Jonas Kr\xFCger",
    "Aylin Demir",
    "Marta Rossi",
    "Kofi Owusu",
    "Sofia Bianchi",
    "Emre Arslan",
  ];
function ab(t, e) {
  if (e === "orders")
    return {
      fill: "rgb(220, 38, 38)",
      opacity: 0.1 + Math.min(1, t.ordersLastHour / 12) * 0.8,
    };
  if (e === "couriers")
    return {
      fill: "rgb(37, 99, 235)",
      opacity: 0.1 + Math.min(1, t.activeCouriers / 6) * 0.8,
    };
  if (e === "gap") {
    let o = Math.min(1, Math.abs(t.gap) / 10);
    return t.gap === 0
      ? {
          fill: "rgb(148, 163, 184)",
          opacity: 0.25,
        }
      : {
          fill: t.gap > 0 ? "rgb(220, 38, 38)" : "rgb(37, 99, 235)",
          opacity: 0.15 + o * 0.75,
        };
  }
  let a = Math.min(1, t.etaRiskScore),
    r = Math.round(245 + -25 * a),
    n = Math.round(158 + -120 * a),
    i = Math.round(11 + 27 * a);
  return {
    fill: `rgb(${r}, ${n}, ${i})`,
    opacity: 0.2 + a * 0.75,
  };
}
var rb = [
  {
    value: "orders",
    label: "Orders",
  },
  {
    value: "couriers",
    label: "Couriers",
  },
  {
    value: "gap",
    label: "Gap",
  },
  {
    value: "eta_risk",
    label: "ETA risk",
  },
];
function HexPage() {
  let { now: t } = useSimClock(),
    e = readPilotModel(),
    [a, r] = yi.useState("gap"),
    [n, i] = yi.useState(null),
    o = yi.useMemo(() => {
      let p = W3(JM, tb, D3),
        u = e.zones.map((s) => ({
          id: s.id,
          x: (s.x / 100) * $0,
          y: (s.y / 100) * F0,
        }));
      return (O3(p, u), E3(p, t, e.orders, e.drivers));
    }, [e, t]),
    l = yi.useMemo(() => {
      let p = {};
      for (let u of e.zones) p[u.id] = u.name;
      return p;
    }, [e.zones]),
    d = yi.useMemo(
      () => ({
        hot: o.filter((p) => p.ordersLastHour >= 4).length,
        under: o.filter((p) => p.zoneId && p.gap > 0).length,
        over: o.filter((p) => p.zoneId && p.gap < 0).length,
        risk: o.filter((p) => p.etaRiskScore >= 0.4).length,
      }),
      [o],
    ),
    c = n ? (o.find((p) => p.id === n) ?? null) : null,
    g = yi.useMemo(
      () =>
        c
          ? H3(c, o, 2)
              .filter((p) => p.activeCouriers > 0)
              .sort((p, u) => u.activeCouriers - p.activeCouriers)
              .slice(0, 3)
          : [],
      [c, o],
    );
  return kt.jsxs(kt.Fragment, {
    children: [
      <PageHeader
        title="Demand vs Supply Heatmap"
        description="Frankfurt tiled into hexagons (Uber-style H3 pattern). Live gap between incoming orders and available couriers."
        actions=<SegmentedControl
          value={a}
          onChange={r}
          options={rb}
          label="Heatmap layer"
        />
      />,
      <div className="grid g4">
        <Stat
          label="Hot order hexes"
          value={d.hot}
          foot="4+ orders in the last hour"
        />
        <Stat
          label="Undersupplied hexes"
          value={d.under}
          foot="Positive gap (orders exceed courier capacity)"
          tone={d.under > 0 ? "crit" : void 0}
        />
        <Stat
          label="Oversupplied hexes"
          value={d.over}
          foot="Negative gap (spare couriers on hand)"
          tone={d.over > 0 ? "good" : void 0}
        />
        <Stat
          label="Hexes at ETA risk"
          value={d.risk}
          foot="Risk score at 0.4 or above"
          tone={d.risk > 0 ? "warn" : void 0}
        />
      </div>,
      <section className="card">
        <div className="card-body">
          <svg
            viewBox={`0 0 ${$0} ${F0}`}
            style={{
              width: "100%",
              height: "auto",
              background: "var(--surface-2)",
              borderRadius: 8,
            }}
            role="img"
            aria-label="Demand versus supply heatmap"
          >
            {o.map((p) => {
              let u = ab(p, a),
                s = n === p.id,
                f = p.zoneId !== null;
              return (
                <path
                  d={R3(p.centerX, p.centerY, D3)}
                  fill={f ? u.fill : "var(--surface)"}
                  fillOpacity={f ? u.opacity : 0.25}
                  stroke={s ? "var(--accent)" : "var(--border)"}
                  strokeWidth={s ? 2.5 : 0.6}
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => i(p.id)}
                  key={p.id}
                >
                  <title>
                    {p.id}
                    {" · "}
                    {p.zoneId ? l[p.zoneId] : "outside"}
                    {" · orders "}
                    {p.ordersLastHour}
                    {" · couriers "}
                    {p.activeCouriers}
                    {" · gap "}
                    {p.gap}
                  </title>
                </path>
              );
            })}
            {e.zones.map((p) => {
              let u = (p.x / 100) * $0,
                s = (p.y / 100) * F0;
              return (
                <g
                  style={{
                    pointerEvents: "none",
                  }}
                  key={p.id}
                >
                  <circle
                    cx={u}
                    cy={s}
                    r={3.5}
                    fill="var(--text)"
                    opacity={0.4}
                  />
                  <text
                    x={u + 6}
                    y={s - 6}
                    style={{
                      fontSize: 12,
                      fill: "var(--text)",
                      fontWeight: 600,
                    }}
                  >
                    {p.name}
                  </text>
                </g>
              );
            })}
          </svg>
          <div
            className="legend"
            style={{
              marginTop: 12,
            }}
          >
            {a === "orders" &&
              kt.jsxs(kt.Fragment, {
                children: [
                  <span>
                    <i
                      className="swatch"
                      style={{
                        background: "rgba(220,38,38,0.18)",
                      }}
                    />
                    {" Few"}
                  </span>,
                  <span>
                    <i
                      className="swatch"
                      style={{
                        background: "rgba(220,38,38,0.55)",
                      }}
                    />
                    {" Busy"}
                  </span>,
                  <span>
                    <i
                      className="swatch"
                      style={{
                        background: "rgba(220,38,38,0.9)",
                      }}
                    />
                    {" Hot"}
                  </span>,
                ],
              })}
            {a === "couriers" &&
              kt.jsxs(kt.Fragment, {
                children: [
                  <span>
                    <i
                      className="swatch"
                      style={{
                        background: "rgba(37,99,235,0.18)",
                      }}
                    />
                    {" Sparse"}
                  </span>,
                  <span>
                    <i
                      className="swatch"
                      style={{
                        background: "rgba(37,99,235,0.55)",
                      }}
                    />
                    {" Present"}
                  </span>,
                  <span>
                    <i
                      className="swatch"
                      style={{
                        background: "rgba(37,99,235,0.9)",
                      }}
                    />
                    {" Dense"}
                  </span>,
                ],
              })}
            {a === "gap" &&
              kt.jsxs(kt.Fragment, {
                children: [
                  <span>
                    <i
                      className="swatch"
                      style={{
                        background: "rgba(37,99,235,0.75)",
                      }}
                    />
                    {" Oversupply (couriers > orders)"}
                  </span>,
                  <span>
                    <i
                      className="swatch"
                      style={{
                        background: "rgba(148,163,184,0.5)",
                      }}
                    />
                    {" Balanced"}
                  </span>,
                  <span>
                    <i
                      className="swatch"
                      style={{
                        background: "rgba(220,38,38,0.75)",
                      }}
                    />
                    {" Undersupply (orders > couriers)"}
                  </span>,
                ],
              })}
            {a === "eta_risk" &&
              kt.jsxs(kt.Fragment, {
                children: [
                  <span>
                    <i
                      className="swatch"
                      style={{
                        background: "rgba(245,158,11,0.55)",
                      }}
                    />
                    {" Watch"}
                  </span>,
                  <span>
                    <i
                      className="swatch"
                      style={{
                        background: "rgba(232,98,25,0.75)",
                      }}
                    />
                    {" Elevated"}
                  </span>,
                  <span>
                    <i
                      className="swatch"
                      style={{
                        background: "rgba(220,38,38,0.9)",
                      }}
                    />
                    {" Critical"}
                  </span>,
                ],
              })}
          </div>
        </div>
      </section>,
      <Callout>
        {
          "H3 resolution 8-9 is typical for city ops; we approximate with a schematic tiling in this POC."
        }
      </Callout>,
      c && (
        <Drawer title={`Hex ${c.id}`} onClose={() => i(null)}>
          <div className="stack-sm">
            <div
              className="row wrap"
              style={{
                gap: 8,
              }}
            >
              <Badge tone={c.zoneId ? "info" : "neutral"}>
                {"Zone: "}
                {c.zoneId ? l[c.zoneId] : "outside pilot"}
              </Badge>
              <Badge tone={c.gap > 0 ? "crit" : c.gap < 0 ? "good" : "neutral"}>
                {"Gap: "}
                {c.gap > 0 ? `+${c.gap}` : String(c.gap)}
              </Badge>
              <Badge
                tone={
                  c.etaRiskScore >= 0.6
                    ? "crit"
                    : c.etaRiskScore >= 0.4
                      ? "warn"
                      : "neutral"
                }
              >
                {"ETA risk: "}
                {(c.etaRiskScore * 100).toFixed(0)}
                {"%"}
              </Badge>
            </div>
            <p className="small">
              {"Orders in the last hour: "}
              <b>{c.ordersLastHour}</b>
              {" · Active couriers home-zoned nearby: "}
              <b>{c.activeCouriers}</b>
            </p>
            <h4
              style={{
                margin: "12px 0 4px",
                fontSize: 13,
              }}
            >
              {"Nearest 3 idle riders within 2 rings"}
            </h4>
            {g.length === 0 ? (
              <p className="small muted">
                {
                  "No idle riders in the surrounding two rings. Consider a reserve call or a repositioning suggestion."
                }
              </p>
            ) : (
              <ul
                className="stack-sm"
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                {g.map((p, u) => (
                  <li
                    className="row between"
                    style={{
                      padding: "6px 0",
                      borderBottom: "1px solid var(--border)",
                    }}
                    key={p.id}
                  >
                    <span>
                      <b>{eb[u] ?? `Rider ${u + 1}`}</b>
                    </span>
                    <span className="small muted">
                      {p.id}
                      {" · "}
                      {p.zoneId ? l[p.zoneId] : "-"}
                      {" · "}
                      {p.activeCouriers}
                      {" avail."}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p
              className="xsmall muted"
              style={{
                marginTop: 12,
              }}
            >
              {
                "Rider list is illustrative — production would surface real driver IDs from the dispatch bridge."
              }
            </p>
          </div>
        </Drawer>
      ),
    ],
  });
}
export { HexPage };
