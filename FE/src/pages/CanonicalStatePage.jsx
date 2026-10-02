// Canonical state monitor. Also contains order-status mapping tables.
import * as z0 from "react";
import * as at from "react/jsx-runtime";
import { V, jt, mt, readPilotModel } from "../services/portalState.jsx";
import { Badge, Card, Stat, PageHeader, Callout } from "../components/ui.jsx";
var Q5 = [
    "created",
    "offered",
    "accepted",
    "travelling_to_pickup",
    "at_pickup",
    "picked",
    "in_transit",
    "at_dropoff",
    "delivered",
    "cancelled",
    "returned",
  ],
  lo = {
    created: "Created",
    offered: "Offered",
    accepted: "Accepted",
    travelling_to_pickup: "Travelling to pickup",
    at_pickup: "At pickup",
    picked: "Picked up",
    in_transit: "In transit",
    at_dropoff: "At dropoff",
    delivered: "Delivered",
    cancelled: "Cancelled",
    returned: "Returned",
  },
  no = {
    pending: "offered",
    pickup: "travelling_to_pickup",
    pickup_complete: "picked",
    dropoff: "at_dropoff",
    delivered: "delivered",
    canceled: "cancelled",
    returned: "returned",
  },
  io = {
    received: "created",
    fetched: "offered",
    acknowledged: "accepted",
    production: "at_pickup",
    ready: "picked",
    delivered: "delivered",
    rejected: "cancelled",
    refunded: "cancelled",
  },
  oo = {
    new: "created",
    confirmed: "accepted",
    in_kitchen: "at_pickup",
    ready: "picked",
    collected: "in_transit",
    delivered: "delivered",
    cancelled: "cancelled",
  };
function bM(t) {
  let e = t.raw.toLowerCase().trim();
  switch (t.platform) {
    case "uber_eats":
      return e in no ? no[e] : null;
    case "wolt":
      return e in io ? io[e] : null;
    case "lieferando":
      return e in oo ? oo[e] : null;
    default:
      return null;
  }
}
function X5(t) {
  let e = bM(t);
  return e
    ? {
        canonicalOrderId: `${t.platform}:${t.externalOrderId}`,
        platform: t.platform,
        state: e,
        at: t.at,
        raw: t.raw,
        signatureOk: t.signatureOk,
      }
    : null;
}
var J5 = {
  created: ["offered", "accepted", "cancelled"],
  offered: ["accepted", "cancelled"],
  accepted: ["travelling_to_pickup", "at_pickup", "cancelled"],
  travelling_to_pickup: ["at_pickup", "cancelled"],
  at_pickup: ["picked", "cancelled"],
  picked: ["in_transit", "at_dropoff", "returned", "cancelled"],
  in_transit: ["at_dropoff", "returned", "cancelled"],
  at_dropoff: ["delivered", "returned", "cancelled"],
  delivered: [],
  cancelled: [],
  returned: [],
};
var wM = ["pending", "pickup", "pickup_complete", "dropoff", "delivered"],
  CM = ["received", "acknowledged", "production", "ready", "delivered"],
  SM = ["new", "confirmed", "in_kitchen", "ready", "collected", "delivered"];
function BM(t) {
  return t === "uber_eats" ? wM : t === "wolt" ? CM : SM;
}
function NM(t) {
  let e = t >>> 0;
  return () => {
    e = (e + 1831565813) >>> 0;
    let a = e;
    return (
      (a = Math.imul(a ^ (a >>> 15), a | 1)),
      (a ^= a + Math.imul(a ^ (a >>> 7), a | 61)),
      ((a ^ (a >>> 14)) >>> 0) / 4294967296
    );
  };
}
function t3(t, e) {
  let a = NM(Math.floor(t) * 977 + e.length),
    r = [];
  for (let n of e) {
    let i = BM(n.platform),
      o = Math.max(0, t - n.createdAt),
      l = Math.min(i.length, Math.floor(o / 4) + 1);
    for (let d = 0; d < l; d++) {
      let c = i[d],
        g = n.createdAt + d * 4,
        p = n.platform === "lieferando" ? void 0 : a() > 0.03,
        u = X5({
          platform: n.platform,
          raw: c,
          externalOrderId: n.id,
          at: g,
          signatureOk: p,
        });
      u && r.push(u);
    }
    if (a() < 0.06) {
      let d =
          n.platform === "uber_eats"
            ? "canceled"
            : n.platform === "wolt"
              ? "rejected"
              : "cancelled",
        c = n.createdAt + l * 4,
        g = n.platform === "lieferando" ? void 0 : a() > 0.03,
        p = X5({
          platform: n.platform,
          raw: d,
          externalOrderId: n.id,
          at: c,
          signatureOk: g,
        });
      p && r.push(p);
    }
  }
  return r.sort((n, i) => i.at - n.at);
}
var Xd = {
    created: "neutral",
    offered: "info",
    accepted: "info",
    travelling_to_pickup: "accent",
    at_pickup: "accent",
    picked: "accent",
    in_transit: "accent",
    at_dropoff: "accent",
    delivered: "good",
    cancelled: "crit",
    returned: "warn",
  },
  AM = {
    uber_eats: "info",
    wolt: "good",
    lieferando: "warn",
  };
function CanonicalStatePage() {
  let t = jt(),
    e = readPilotModel(),
    a = z0.useMemo(
      () =>
        e.orders
          .filter((p) => p.createdAt <= t.now)
          .slice(-120)
          .map((p) => ({
            id: p.id,
            platform: p.platform,
            createdAt: p.createdAt,
          })),
      [e.orders, t.now],
    ),
    r = z0.useMemo(() => t3(t.now, a), [t.now, a]),
    n = r.slice(0, 30),
    i = r.filter((p) => p.at >= t.now - 60),
    o = 0,
    l = i.filter((p) => p.signatureOk === !1).length,
    d = i.filter(
      (p) => p.platform === "uber_eats" && p.signatureOk === !0,
    ).length,
    c = i.filter((p) => p.platform === "wolt" && p.signatureOk === !0).length,
    g = i.length ? ((o / i.length) * 100).toFixed(1) : "0.0";
  return at.jsxs(at.Fragment, {
    children: [
      <PageHeader
        eyebrow={`Canonical events \xB7 ${V(t.now)}`}
        title="Canonical State Monitor"
        description="One state machine, three platforms. Every inbound status is verified, mapped and stamped with a canonical state so KPIs, payroll and risk work identically across Uber Eats, Wolt and Lieferando."
      />,
      <Callout>
        {
          "This is the moat. Every platform speaks its own dialect — we translate to one language."
        }
      </Callout>,
      <div className="grid g4">
        <Stat
          label="Events (last hour)"
          value={i.length}
          foot={`${r.length} in the day so far`}
        />
        <Stat
          label="Unmapped rate"
          value={`${g}%`}
          foot={`${o} of ${i.length}`}
          tone={o === 0 ? "good" : "warn"}
        />
        <Stat
          label="Signature failures"
          value={l}
          foot={l ? "Investigate partner keys" : "All partners healthy"}
          tone={l === 0 ? "good" : "crit"}
        />
        <Stat
          label="HMAC vs JWT verified"
          value={`${d} / ${c}`}
          foot="Uber HMAC · Wolt JWT (Lieferando: CSV, no sig)"
        />
      </div>,
      <div className="grid g3">
        <D0
          title="Uber Eats"
          sub="delivery_status webhook · HMAC SHA-256"
          rows={Object.entries(no).map(([p, u]) => ({
            raw: p,
            state: u,
          }))}
        />
        <D0
          title="Wolt"
          sub="Order API merchant lifecycle · HS256 JWT"
          rows={Object.entries(io).map(([p, u]) => ({
            raw: p,
            state: u,
          }))}
        />
        <D0
          title="Lieferando"
          sub="No public API · POS / manual entry"
          rows={Object.entries(oo).map(([p, u]) => ({
            raw: p,
            state: u,
          }))}
        />
      </div>,
      <Card
        title="Live event stream"
        sub={`Latest ${n.length} canonical events`}
        flush={!0}
      >
        <div
          className="table-wrap table-scroll"
          style={{
            maxHeight: 520,
          }}
        >
          <table className="table">
            <thead>
              <tr>
                <th className="num">{"Time"}</th>
                <th>{"Platform"}</th>
                <th>{"External order id"}</th>
                <th>{"Raw status"}</th>
                <th>{"Canonical state"}</th>
                <th>{"Signature"}</th>
              </tr>
            </thead>
            <tbody>
              {n.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty">
                    {"No canonical events at this simulated minute."}
                  </td>
                </tr>
              )}
              {n.map((p, u) => (
                <tr
                  style={
                    p.signatureOk === !1
                      ? {
                          background: "var(--crit-bg, rgba(220, 38, 38, 0.08))",
                        }
                      : void 0
                  }
                  key={`${p.canonicalOrderId}-${p.at}-${p.raw}-${u}`}
                >
                  <td className="num small">{V(p.at)}</td>
                  <td>
                    <Badge tone={AM[p.platform]}>{mt[p.platform]}</Badge>
                  </td>
                  <td className="small mono">
                    {p.canonicalOrderId.split(":")[1]}
                  </td>
                  <td className="small mono">{p.raw}</td>
                  <td>
                    <Badge tone={Xd[p.state]}>{lo[p.state]}</Badge>
                  </td>
                  <td>
                    {p.signatureOk === void 0 ? (
                      <Badge tone="neutral">{"n/a"}</Badge>
                    ) : p.signatureOk ? (
                      <Badge tone="good">{"verified"}</Badge>
                    ) : (
                      <Badge tone="crit">{"failed"}</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>,
      <Card
        title="State machine legend"
        sub="Legal transitions per canonical state"
      >
        {at.jsx(jM, {})}
        <ol
          className="small stack-sm"
          style={{
            margin: "12px 0 0",
            paddingLeft: 18,
          }}
        >
          {Q5.map((p) => {
            let u = J5[p];
            return (
              <li
                style={{
                  marginBottom: 4,
                }}
                key={p}
              >
                <Badge tone={Xd[p]}>{lo[p]}</Badge>{" "}
                {u.length === 0 ? (
                  <span className="muted">{"terminal"}</span>
                ) : (
                  at.jsxs(at.Fragment, {
                    children: [
                      <span className="muted">{"→"}</span>,
                      " ",
                      u.map((s, f) => (
                        <span key={s}>
                          <Badge tone={Xd[s]}>{lo[s]}</Badge>
                          {f < u.length - 1 ? " " : ""}
                        </span>
                      )),
                    ],
                  })
                )}
              </li>
            );
          })}
        </ol>
      </Card>,
    ],
  });
}
function D0({ title: t, sub: e, rows: a }) {
  return (
    <Card title={`${t} mapping`} sub={e} flush={!0}>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>{"Platform word"}</th>
              <th>{"Canonical state"}</th>
            </tr>
          </thead>
          <tbody>
            {a.map((r) => (
              <tr key={r.raw}>
                <td className="small mono">{r.raw}</td>
                <td>
                  <Badge tone={Xd[r.state]}>{lo[r.state]}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
function jM() {
  let t = [
      "created",
      "offered",
      "accepted",
      "travelling_to_pickup",
      "at_pickup",
      "picked",
      "in_transit",
      "at_dropoff",
      "delivered",
    ],
    e = ["cancelled", "returned"],
    i = t.length * 130,
    o = 160,
    l = 40,
    d = 110,
    c = (u) => u * 130 + 108 / 2,
    g = (u) => (u === 0 ? i * 0.32 : i * 0.68),
    p = (u) => {
      let s = Xd[u];
      return s === "good"
        ? "var(--good-bg, #dcfce7)"
        : s === "crit"
          ? "var(--crit-bg, #fee2e2)"
          : s === "warn"
            ? "var(--warn-bg, #fef3c7)"
            : s === "accent"
              ? "var(--accent-bg, #ede9fe)"
              : s === "info"
                ? "var(--info-bg, #dbeafe)"
                : "var(--card-bg, #f1f5f9)";
    };
  return (
    <div
      style={{
        overflowX: "auto",
      }}
    >
      <svg
        width={i}
        height={o}
        viewBox={`0 0 ${i} ${o}`}
        role="img"
        aria-label="Canonical state machine"
      >
        {t.slice(0, -1).map((u, s) => {
          let f = c(s) + 54,
            x = c(s + 1) - 108 / 2;
          return (
            <line
              x1={f}
              y1={l}
              x2={x}
              y2={l}
              stroke="var(--line, #94a3b8)"
              strokeWidth={1.5}
              markerEnd="url(#arrow)"
              key={`spine-${s}`}
            />
          );
        })}
        {t.slice(0, -1).map((u, s) => (
          <line
            x1={c(s)}
            y1={l + 34 / 2}
            x2={g(0)}
            y2={d - 34 / 2}
            stroke="var(--crit, #ef4444)"
            strokeWidth={0.6}
            strokeDasharray="3 3"
            opacity={0.35}
            key={`cancel-${u}`}
          />
        ))}
        {["picked", "in_transit", "at_dropoff"].map((u) => {
          let s = t.indexOf(u);
          return (
            <line
              x1={c(s)}
              y1={l + 34 / 2}
              x2={g(1)}
              y2={d - 34 / 2}
              stroke="var(--warn-ink, #b45309)"
              strokeWidth={0.8}
              strokeDasharray="4 3"
              opacity={0.55}
              key={`return-${u}`}
            />
          );
        })}
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="var(--line, #94a3b8)" />
          </marker>
        </defs>
        {t.map((u, s) => (
          <g transform={`translate(${c(s) - 108 / 2}, ${l - 34 / 2})`} key={u}>
            <rect
              width={108}
              height={34}
              rx={8}
              fill={p(u)}
              stroke="var(--line, #cbd5e1)"
              strokeWidth={1}
            />
            <text
              x={108 / 2}
              y={34 / 2 + 4}
              textAnchor="middle"
              fontSize={11}
              fill="var(--ink, #0f172a)"
            >
              {lo[u]}
            </text>
          </g>
        ))}
        {e.map((u, s) => (
          <g transform={`translate(${g(s) - 108 / 2}, ${d - 34 / 2})`} key={u}>
            <rect
              width={108}
              height={34}
              rx={8}
              fill={p(u)}
              stroke="var(--line, #cbd5e1)"
              strokeWidth={1}
            />
            <text
              x={108 / 2}
              y={34 / 2 + 4}
              textAnchor="middle"
              fontSize={11}
              fill="var(--ink, #0f172a)"
            >
              {lo[u]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
export { CanonicalStatePage, io, no, oo };
