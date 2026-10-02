// Capacity planner and compliance pages (one bundle module).
import * as Qd from "react";
import * as xi from "react";
import * as Lt from "react/jsx-runtime";
import * as pt from "react/jsx-runtime";
import * as zt from "react/jsx-runtime";
import {
  Be,
  opsStore,
  useOpsStore,
  L2,
  Ln,
  useHashLocation,
  V,
  useSimClock,
  gi,
  jt,
  mt,
  useToast,
  rt,
  Link,
  readPilotModel,
} from "../services/portalState.jsx";
import {
  Badge,
  Card,
  Stat,
  Meter,
  Field,
  Toast,
  PageHeader,
  Callout,
  Button,
} from "../components/ui.jsx";
import { Gv, p2 } from "../components/icons.jsx";
import { Fe } from "./AdminPage.jsx";
function a3(t = 600) {
  let e = xi.useRef(null),
    [a, r] = xi.useState(t);
  return (
    xi.useEffect(() => {
      if (!e.current) return;
      let n = e.current;
      r(n.clientWidth || t);
      let i = new ResizeObserver(() => r(n.clientWidth || t));
      return (i.observe(n), () => i.disconnect());
    }, [t]),
    [e, a]
  );
}
function V0(t) {
  if (t <= 0) return 1;
  let e = Math.pow(10, Math.floor(Math.log10(t))),
    a = t / e;
  return (a <= 1 ? 1 : a <= 2 ? 2 : a <= 2.5 ? 2.5 : a <= 5 ? 5 : 10) * e;
}
function r3(t, e, a = 4) {
  let r = (e - t) / a;
  return Array.from(
    {
      length: a + 1,
    },
    (n, i) => t + r * i,
  );
}
function n3({ items: t }) {
  return (
    <div className="legend">
      {t.map((e) => (
        <span key={e.label}>
          {e.dashed ? (
            <svg width="16" height="4" aria-hidden={!0}>
              <line
                x1="0"
                y1="2"
                x2="16"
                y2="2"
                stroke={e.color}
                strokeWidth="2"
                strokeDasharray="4 3"
              />
            </svg>
          ) : (
            <i
              className="swatch"
              style={{
                background: e.color,
              }}
            />
          )}
          {e.label}
        </span>
      ))}
    </div>
  );
}
function Nn({
  series: t,
  labels: e,
  height: a = 220,
  yMin: r,
  yMax: n,
  format: i = (g) => String(Math.round(g)),
  band: o,
  refLine: l,
  marker: d,
  tickEvery: c,
}) {
  let [g, p] = a3(),
    [u, s] = xi.useState(null),
    f = {
      l: 44,
      r: 16,
      t: 12,
      b: 26,
    },
    x = [
      ...t.flatMap((A) => A.values.filter((j) => j !== null)),
      ...(o?.high ?? []),
      ...(l ? [l.value] : []),
    ],
    M = r ?? 0,
    h = n ?? V0(Math.max(...x, 1)),
    m = e.length,
    y = (A) => f.l + (m <= 1 ? 0 : (A / (m - 1)) * (p - f.l - f.r)),
    k = (A) => f.t + (1 - (A - M) / (h - M || 1)) * (a - f.t - f.b),
    L = c ?? Math.max(1, Math.ceil(m / Math.max(2, Math.floor(p / 70)))),
    w = (A) => {
      let j = "",
        v = !1;
      return (
        A.forEach((E, Q) => {
          if (E === null) {
            v = !1;
            return;
          }
          ((j += `${v ? "L" : "M"}${y(Q).toFixed(1)},${k(Math.max(M, Math.min(h, E))).toFixed(1)}`),
            (v = !0));
        }),
        j
      );
    };
  return (
    <div className="chart-wrap" ref={g}>
      <svg
        className="chart"
        width={p}
        height={a}
        onMouseMove={(A) => {
          let j = A.currentTarget.getBoundingClientRect(),
            v = A.clientX - j.left,
            E = Math.round(((v - f.l) / (p - f.l - f.r)) * (m - 1));
          s(E >= 0 && E < m ? E : null);
        }}
        onMouseLeave={() => s(null)}
        role="img"
        aria-label={t.map((A) => A.label).join(", ")}
      >
        {r3(M, h).map((A) => (
          <g key={A}>
            <line
              className="grid-line"
              x1={f.l}
              x2={p - f.r}
              y1={k(A)}
              y2={k(A)}
            />
            <text x={f.l - 8} y={k(A) + 4} textAnchor="end">
              {i(A)}
            </text>
          </g>
        ))}
        {e.map((A, j) =>
          j % L === 0 ? (
            <text x={y(j)} y={a - 8} textAnchor="middle" key={j}>
              {A}
            </text>
          ) : null,
        )}
        {o && (
          <path
            d={`${o.high.map((A, j) => `${j === 0 ? "M" : "L"}${y(j)},${k(Math.min(h, A))}`).join("")}${o.low.map((A, j) => `L${y(o.low.length - 1 - j)},${k(Math.max(M, o.low[o.low.length - 1 - j] ?? A))}`).join("")}Z`}
            fill={o.color}
            opacity={0.12}
          />
        )}
        {l && (
          <g>
            <line
              x1={f.l}
              x2={p - f.r}
              y1={k(l.value)}
              y2={k(l.value)}
              stroke="var(--text-2)"
              strokeWidth={1}
              strokeDasharray="5 4"
            />
            <text
              x={p - f.r}
              y={k(l.value) - 5}
              textAnchor="end"
              style={{
                fill: "var(--text-2)",
              }}
            >
              {l.label}
            </text>
          </g>
        )}
        {d !== void 0 && d >= 0 && d < m && (
          <line
            x1={y(d)}
            x2={y(d)}
            y1={f.t}
            y2={a - f.b}
            stroke="var(--accent)"
            strokeWidth={1.5}
          />
        )}
        {t.map((A) => (
          <path
            d={w(A.values)}
            fill="none"
            stroke={A.color}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={A.dashed ? "5 4" : void 0}
            key={A.id}
          />
        ))}
        {t.map((A) => {
          let j = A.values
            .map((v, E) => (v === null ? -1 : E))
            .filter((v) => v >= 0)
            .at(-1);
          return j === void 0 ? null : (
            <circle
              cx={y(j)}
              cy={k(A.values[j])}
              r={4}
              fill={A.color}
              stroke="var(--surface)"
              strokeWidth={2}
              key={A.id}
            />
          );
        })}
        {u !== null && (
          <g>
            <line
              x1={y(u)}
              x2={y(u)}
              y1={f.t}
              y2={a - f.b}
              stroke="var(--axis)"
            />
            {t.map((A) =>
              A.values[u] !== null && A.values[u] !== void 0 ? (
                <circle
                  cx={y(u)}
                  cy={k(A.values[u])}
                  r={4}
                  fill={A.color}
                  stroke="var(--surface)"
                  strokeWidth={2}
                  key={A.id}
                />
              ) : null,
            )}
          </g>
        )}
        <line
          className="axis-line"
          x1={f.l}
          x2={p - f.r}
          y1={a - f.b}
          y2={a - f.b}
        />
      </svg>
      {u !== null && (
        <div
          className="chart-tip"
          style={{
            left: Math.min(Math.max(y(u), 80), p - 80),
            top: f.t + 10,
          }}
        >
          <div className="bold">{e[u]}</div>
          {t.map((A) => (
            <div className="tip-row" key={A.id}>
              <i
                className="swatch"
                style={{
                  background: A.color,
                }}
              />
              {A.label}
              {": "}
              {A.values[u] === null || A.values[u] === void 0
                ? "\u2014"
                : i(A.values[u])}
            </div>
          ))}
          {o && (
            <div className="tip-row">
              {o.label}
              {": "}
              {i(o.low[u])}
              {"–"}
              {i(o.high[u])}
            </div>
          )}
        </div>
      )}
      {t.length > 1 &&
        Lt.jsx(n3, {
          items: t.map((A) => ({
            label: A.label,
            color: A.color,
            dashed: A.dashed,
          })),
        })}
    </div>
  );
}
function An({
  categories: t,
  series: e,
  height: a = 220,
  stacked: r,
  format: n = (d) => String(Math.round(d)),
  refLine: i,
  yMax: o,
  diverging: l,
}) {
  let [d, c] = a3(),
    [g, p] = xi.useState(null),
    u = {
      l: 44,
      r: 12,
      t: 12,
      b: 28,
    },
    s = t.map((w, O) =>
      r
        ? e.reduce((A, j) => A + Math.max(0, j.values[O] ?? 0), 0)
        : Math.max(...e.map((A) => A.values[O] ?? 0)),
    ),
    f = t.map((w, O) => Math.min(0, ...e.map((A) => A.values[O] ?? 0))),
    x = o ?? V0(Math.max(...s, i?.value ?? 0, 1)),
    M = l ? -V0(Math.max(1, ...f.map((w) => -w))) : 0,
    h = (c - u.l - u.r) / Math.max(1, t.length),
    m = (w) => u.t + (1 - (w - M) / (x - M)) * (a - u.t - u.b),
    y = Math.min(h * 0.7, r ? 24 : 24 * e.length),
    k = r ? y : y / e.length,
    L = Math.max(1, Math.ceil(t.length / Math.max(2, Math.floor(c / 64))));
  return (
    <div className="chart-wrap" ref={d}>
      <svg
        className="chart"
        width={c}
        height={a}
        role="img"
        aria-label={e.map((w) => w.label).join(", ")}
        onMouseLeave={() => p(null)}
      >
        {r3(M, x).map((w) => (
          <g key={w}>
            <line
              className="grid-line"
              x1={u.l}
              x2={c - u.r}
              y1={m(w)}
              y2={m(w)}
            />
            <text x={u.l - 8} y={m(w) + 4} textAnchor="end">
              {n(w)}
            </text>
          </g>
        ))}
        {t.map((w, O) => {
          let A = u.l + h * O + (h - y) / 2,
            j = 0;
          return (
            <g onMouseEnter={() => p(O)} key={w}>
              <rect
                x={u.l + h * O}
                y={u.t}
                width={h}
                height={a - u.t - u.b}
                fill="transparent"
              />
              {e.map((v, E) => {
                let Q = v.values[O] ?? 0,
                  _ = r ? A : A + E * k,
                  Mt = r ? j : 0,
                  Wt = Mt + Q;
                r && (j += Math.max(0, Q));
                let Tt = m(Math.max(Mt, Wt)),
                  Pt = m(Math.min(Mt, Wt)),
                  Bt = Math.max(0, Pt - Tt - (r && E > 0 ? 2 : 0)),
                  Z = Math.min(4, Bt / 2, (k - 2) / 2),
                  qt = Math.max(1, k - (r ? 0 : 2)),
                  ze =
                    Q >= 0
                      ? `M${_},${Tt + Bt} V${Tt + Z} Q${_},${Tt} ${_ + Z},${Tt} H${_ + qt - Z} Q${_ + qt},${Tt} ${_ + qt},${Tt + Z} V${Tt + Bt} Z`
                      : `M${_},${Tt} V${Tt + Bt - Z} Q${_},${Tt + Bt} ${_ + Z},${Tt + Bt} H${_ + qt - Z} Q${_ + qt},${Tt + Bt} ${_ + qt},${Tt + Bt - Z} V${Tt} Z`;
                return (
                  <path
                    d={ze}
                    fill={v.color}
                    opacity={g === null || g === O ? 1 : 0.55}
                    key={v.id}
                  />
                );
              })}
              {O % L === 0 && (
                <text x={u.l + h * O + h / 2} y={a - 9} textAnchor="middle">
                  {w}
                </text>
              )}
            </g>
          );
        })}
        {i && (
          <g>
            <line
              x1={u.l}
              x2={c - u.r}
              y1={m(i.value)}
              y2={m(i.value)}
              stroke="var(--text-2)"
              strokeDasharray="5 4"
            />
            <text
              x={c - u.r}
              y={m(i.value) - 5}
              textAnchor="end"
              style={{
                fill: "var(--text-2)",
              }}
            >
              {i.label}
            </text>
          </g>
        )}
        <line className="axis-line" x1={u.l} x2={c - u.r} y1={m(0)} y2={m(0)} />
      </svg>
      {g !== null && (
        <div
          className="chart-tip"
          style={{
            left: Math.min(Math.max(u.l + h * g + h / 2, 80), c - 80),
            top: u.t + 10,
          }}
        >
          <div className="bold">{t[g]}</div>
          {e.map((w) => (
            <div className="tip-row" key={w.id}>
              <i
                className="swatch"
                style={{
                  background: w.color,
                }}
              />
              {w.label}
              {": "}
              {n(w.values[g] ?? 0)}
            </div>
          ))}
        </div>
      )}
      {e.length > 1 &&
        Lt.jsx(n3, {
          items: e.map((w) => ({
            label: w.label,
            color: w.color,
          })),
        })}
    </div>
  );
}
function D2({ items: t, format: e = (r) => String(r), max: a }) {
  let r = a ?? Math.max(1, ...t.map((n) => n.value));
  return (
    <div className="stack-sm">
      {t.map((n, i) => (
        <div
          className="stack-sm"
          style={{
            gap: 4,
          }}
          key={i}
        >
          <div className="row between small">
            <span>{n.label}</span>
            <span className="num bold">
              {e(n.value)} {n.note && <span className="muted">{n.note}</span>}
            </span>
          </div>
          <div className="meter">
            <span
              style={{
                width: `${(n.value / r) * 100}%`,
                background: n.color ?? "var(--seq-3)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
function i3({
  values: t,
  color: e = "var(--seq-3)",
  width: a = 110,
  height: r = 30,
}) {
  if (t.length < 2) return null;
  let n = Math.min(...t),
    i = Math.max(...t),
    o = (c) => 2 + (c / (t.length - 1)) * (a - 6),
    l = (c) => 3 + (1 - (c - n) / (i - n || 1)) * (r - 6),
    d = t
      .map((c, g) => `${g ? "L" : "M"}${o(g).toFixed(1)},${l(c).toFixed(1)}`)
      .join("");
  return (
    <svg width={a} height={r} aria-hidden={!0}>
      <path
        d={`${d}L${o(t.length - 1)},${r}L${o(0)},${r}Z`}
        fill={e}
        opacity={0.1}
      />
      <path d={d} fill="none" stroke={e} strokeWidth={1.6} />
      <circle
        cx={o(t.length - 1)}
        cy={l(t[t.length - 1])}
        r={3}
        fill={e}
        stroke="var(--surface)"
        strokeWidth={1.5}
      />
    </svg>
  );
}
function _M(t, e = 4) {
  let a = Math.max(-1, Math.min(1, t / e));
  return Math.abs(a) < 0.12
    ? {
        bg: "var(--surface-3)",
        fg: "var(--text-2)",
      }
    : a < 0
      ? {
          bg: `color-mix(in srgb, var(--crit) ${Math.round(25 + 65 * -a)}%, var(--surface))`,
          fg: -a > 0.55 ? "#fff" : "var(--text)",
        }
      : {
          bg: `color-mix(in srgb, var(--seq-3) ${Math.round(20 + 55 * a)}%, var(--surface))`,
          fg: a > 0.7 ? "#fff" : "var(--text)",
        };
}
function o3({ rows: t, cols: e, value: a, label: r, title: n }) {
  return (
    <div className="table-wrap">
      <div
        className="heat"
        style={{
          gridTemplateColumns: `max-content repeat(${e.length}, minmax(34px, 1fr))`,
          minWidth: 120 + e.length * 36,
        }}
      >
        <div />
        {e.map((i) => (
          <div className="collab" key={i}>
            {i}
          </div>
        ))}
        {t.map((i) => (
          <div
            style={{
              display: "contents",
            }}
            key={i.id}
          >
            <div className="rowlab">{i.label}</div>
            {e.map((o, l) => {
              let d = a(i.id, l),
                c = _M(d);
              return (
                <div
                  className="cell"
                  style={{
                    background: c.bg,
                    color: c.fg,
                  }}
                  title={n(i.id, l)}
                  key={l}
                >
                  {r(i.id, l)}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
var ve = {
  uber_eats: "var(--s-uber)",
  wolt: "var(--s-wolt)",
  lieferando: "var(--s-lief)",
};
var l3 = {
  now: {
    label: "Available now",
    tone: "good",
  },
  soon: {
    label: "Available soon",
    tone: "info",
  },
  unavailable: {
    label: "Unavailable",
    tone: "neutral",
  },
};
function CapacityPage() {
  let t = jt(),
    e = readPilotModel(),
    a = useOpsStore(),
    { now: r } = useSimClock(),
    { query: n } = useHashLocation(),
    [i, o] = Qd.useState(
      n.get("zone") ??
        Object.values(t.capacity).sort((k, L) => L.gap - k.gap)[0]?.zoneId ??
        "innenstadt",
    ),
    [l, d] = useToast(),
    c = e.zones.find((k) => k.id === i),
    g = t.capacity[i],
    p = t.classified[i] ?? [],
    u = Math.floor(r / 30),
    s = Array.from(
      {
        length: 12,
      },
      (k, L) => u + L,
    ).filter((k) => k < 48),
    f = Qd.useMemo(() => {
      let k = {};
      for (let L of e.zones)
        k[L.id] = s.map((w) => {
          let O = w * 30 + 15,
            A = e.drivers.filter(
              (E) =>
                E.homeZoneId === L.id &&
                !E.noShow &&
                O >= E.shiftStart &&
                O < E.shiftEnd &&
                !(
                  E.breakMinutes &&
                  O >= E.breakStart &&
                  O < E.breakStart + E.breakMinutes
                ),
            ).length,
            j = t.forecasts[L.id][w],
            v = Ln(j.p50 * 2, L.minutesPerOrder, a.utilisation).rounded;
          return A - v;
        });
      return k;
    }, [e, t.forecasts, a.utilisation, u]),
    x = t.forecasts[i].filter((k) => k.slot >= 21),
    M = x.findIndex((k) => k.slot === Math.floor(r / 30)),
    [h, m] = Qd.useState({
      orders: 60,
      minutes: 20,
      util: 85,
    }),
    y = Ln(h.orders, h.minutes, Math.max(1, Math.min(100, h.util)) / 100);
  return pt.jsxs(pt.Fragment, {
    children: [
      <PageHeader
        eyebrow={`Next 30\u201360 minutes \xB7 ${V(r)}`}
        title="Capacity Planner"
        description="How much work can available drivers handle in each zone during the next 30 minutes? Online status alone is not usable capacity, and a driver never counts for two platforms at once."
        actions=<Field
          id="util"
          label={`Planned utilisation: ${Math.round(a.utilisation * 100)}%`}
        >
          <input
            id="util"
            type="range"
            min={60}
            max={95}
            step={1}
            value={Math.round(a.utilisation * 100)}
            onChange={(k) =>
              opsStore.set({
                utilisation: Number(k.target.value) / 100,
              })
            }
          />
        </Field>
      />,
      <div className="grid g4">
        {e.zones.map((k) => {
          let L = t.capacity[k.id],
            w =
              L.status === "short"
                ? "crit"
                : L.status === "tight"
                  ? "warn"
                  : "good";
          return (
            <button
              type="button"
              className="card stat"
              onClick={() => o(k.id)}
              style={{
                textAlign: "left",
                cursor: "pointer",
                outline: k.id === i ? "2px solid var(--accent)" : void 0,
              }}
              key={k.id}
            >
              <div className="row between">
                <span className="bold">{k.name}</span>
                <Badge tone={w}>
                  {L.status === "short" ? `${L.gap} short` : L.status}
                </Badge>
              </div>
              <div
                className="row"
                style={{
                  alignItems: "baseline",
                  gap: 6,
                }}
              >
                <span
                  className="value"
                  style={{
                    fontSize: 26,
                  }}
                >
                  {L.usable}
                </span>
                <span className="muted">
                  {"/ "}
                  {L.required}
                  {" required"}
                </span>
              </div>
              <div className="foot">
                {L.forecastOrders.toFixed(1)}
                {" orders in 30 min · "}
                {L.availableNow}
                {" free now · "}
                {L.availableSoon}
                {" soon"}
                {(a.reservesCalled[k.id] ?? 0) > 0 && (
                  <Badge tone="info">
                    {"+"}
                    {a.reservesCalled[k.id]}
                    {" reserve"}
                  </Badge>
                )}
              </div>
            </button>
          );
        })}
      </div>,
      <div className="grid g-2-1">
        <Card
          title={`${c.name}: who can take the next orders?`}
          sub={`Required ${g.required} = ${g.ordersPerHour.toFixed(1)} orders/h \xD7 ${c.minutesPerOrder} min \xF7 (60 \xD7 ${Math.round(a.utilisation * 100)}%) = ${g.requiredExact.toFixed(2)}, rounded up`}
          flush={!0}
          actions=<Button
            onClick={() => {
              (opsStore.set((k) => ({
                reservesCalled: {
                  ...k.reservesCalled,
                  [i]: (k.reservesCalled[i] ?? 0) + 1,
                },
              })),
                d(`Reserve driver requested for ${c.name} (Alnaif informed)`));
            }}
          >
            <Gv size={14} />
            {" Call reserve"}
          </Button>
        >
          <div className="table-wrap table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>{"Driver"}</th>
                  <th>{"Platform"}</th>
                  <th>{"Status"}</th>
                  <th>{"Counts as"}</th>
                  <th>{"Why"}</th>
                </tr>
              </thead>
              <tbody>
                {p.length === 0 && (
                  <tr>
                    <td colSpan={5} className="empty">
                      {"No rostered driver is in this zone right now."}
                    </td>
                  </tr>
                )}
                {[...p]
                  .sort(
                    (k, L) =>
                      ["now", "soon", "unavailable"].indexOf(k.availability) -
                      ["now", "soon", "unavailable"].indexOf(L.availability),
                  )
                  .filter((k) => k.activity !== "off_shift")
                  .map((k) => (
                    <tr key={k.driverId}>
                      <td>{k.name}</td>
                      <td>
                        <span className="row small">
                          <i
                            className="swatch"
                            style={{
                              background: ve[k.platform],
                            }}
                          />
                          {mt[k.platform]}
                        </span>
                      </td>
                      <td className="small">{k.activity.replace("_", " ")}</td>
                      <td>
                        <Badge tone={l3[k.availability].tone}>
                          {l3[k.availability].label}
                        </Badge>
                      </td>
                      <td className="small text-2">{k.explanation}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
        <div className="stack">
          <Card
            title="Safe repositioning"
            sub="Only from neighbouring zones that keep their required drivers plus planned reserve"
          >
            {t.moves.length === 0 ? (
              <p className="small muted">
                {
                  "No safe move available. Use reserves or ask the platform to reduce the delivery area in short zones."
                }
              </p>
            ) : (
              <div className="stack-sm">
                {t.moves.map((k) => (
                  <div className="alert-item" key={k.driverId}>
                    <div className="grow">
                      <div className="t row">
                        {k.driverName}
                        {": "}
                        {rt(k.from)}{" "}
                        {pt.jsx(p2, {
                          size: 13,
                        })}{" "}
                        {rt(k.to)}
                      </div>
                      <div className="d">{k.reason}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        (opsStore.set((L) => ({
                          moves: {
                            ...L.moves,
                            [k.driverId]: {
                              to: k.to,
                              at: r,
                            },
                          },
                        })),
                          d(`${k.driverName} asked to move to ${rt(k.to)}`));
                      }}
                    >
                      {"Confirm"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div
              style={{
                marginTop: 10,
              }}
            >
              <Callout>
                {
                  "Assignment, reassignment and delivery-area changes may stay under platform control; a confirmed move is a request to the driver within the platform's rules."
                }
              </Callout>
            </div>
          </Card>
          <Card
            title="Required drivers calculator"
            sub="Formula from the EELS plan"
          >
            <div
              className="grid g3"
              style={{
                gap: 8,
              }}
            >
              <Field id="c-orders" label="Orders / hour">
                <input
                  id="c-orders"
                  className="input"
                  type="number"
                  min={0}
                  value={h.orders}
                  onChange={(k) =>
                    m({
                      ...h,
                      orders: Number(k.target.value),
                    })
                  }
                />
              </Field>
              <Field id="c-min" label="Minutes / order">
                <input
                  id="c-min"
                  className="input"
                  type="number"
                  min={1}
                  value={h.minutes}
                  onChange={(k) =>
                    m({
                      ...h,
                      minutes: Number(k.target.value),
                    })
                  }
                />
              </Field>
              <Field id="c-util" label="Utilisation %">
                <input
                  id="c-util"
                  className="input"
                  type="number"
                  min={1}
                  max={100}
                  value={h.util}
                  onChange={(k) =>
                    m({
                      ...h,
                      util: Number(k.target.value),
                    })
                  }
                />
              </Field>
            </div>
            <p
              style={{
                marginTop: 10,
              }}
            >
              {h.orders}
              {" × "}
              {h.minutes}
              {" ÷ (60 × "}
              {h.util}
              {"%) = "}
              <b>{y.exact.toFixed(2)}</b>
              {" → "}
              <b>
                {y.rounded}
                {" active drivers"}
              </b>
            </p>
            <p className="xsmall muted">
              {
                "Roster breaks and expected absences on top; the remaining time allowance absorbs demand variation."
              }
            </p>
          </Card>
        </div>
      </div>,
      <Card
        title={`${c.name}: demand forecast`}
        sub={`Same-weekday profile from the last 6 weeks, adjusted to today's volume (level \xD7${t.forecastLevel.toFixed(2)} city-wide); shaded band up to the 90th percentile`}
      >
        <Nn
          labels={x.map((k) => L2(k.slot))}
          series={[
            {
              id: "p50",
              label: "Forecast (median)",
              color: "var(--seq-3)",
              values: x.map((k) => k.p50),
            },
            {
              id: "act",
              label: "Actual orders",
              color: "var(--s-wolt)",
              values: x.map((k) => k.actual),
            },
          ]}
          band={{
            low: x.map((k) => k.p50),
            high: x.map((k) => k.p90),
            color: "var(--seq-3)",
            label: "Median\u2013P90",
          }}
          marker={M}
          format={(k) => k.toFixed(k < 10 ? 1 : 0)}
        />
      </Card>,
      <Card
        title="Planned balance by zone, next 6 hours"
        sub="Rostered drivers minus required drivers per 30-minute slot. Red = shortage to fix before the peak, blue = spare cover."
      >
        {pt.jsx(o3, {
          rows: e.zones.map((k) => ({
            id: k.id,
            label: k.name,
          })),
          cols: s.map((k) => L2(k)),
          value: (k, L) => f[k][L],
          label: (k, L) => {
            let w = f[k][L];
            return w > 0 ? `+${w}` : String(w);
          },
          title: (k, L) => `${rt(k)} ${L2(s[L])}: balance ${f[k][L]}`,
        })}
      </Card>,
      <Toast message={l} />,
    ],
  });
}
var TM = [
  {
    title: "EU Platform Work Directive",
    detail:
      "Must be transposed into German law by 2 December 2026; no ministerial draft was published as of 15 September 2026. Requires transparency and human oversight for automated monitoring and decisions.",
    due: "2026-12-02",
    url: "https://www.teamed.global/eu-platform-work/germany",
  },
  {
    title: "Possible direct-employment rule for food delivery",
    detail:
      "The Federal Labour Minister is examining a ban on subcontractors after an investigation into delivery fleet partners (December 2025). Keep employment evidence ready for every rider.",
    due: null,
    url: "https://www.tageskarte.io/politik/detail/arbeitsministerin-bas-prueft-subunternehmerverbot-fuer-essenslieferdienste.html",
  },
  {
    title: "Working time recording",
    detail:
      "Employers must record start, end and breaks (BAG, 13 Sep 2022). A draft bill proposes electronic recording as the default.",
    due: null,
    url: "https://www.ihk.de/rhein-neckar/recht/arbeitsrecht/arbeitszeiterfassung-5631422",
  },
  {
    title: "Minimum wage and mini-job limit",
    detail:
      "\u20AC13.90/h and \u20AC603/month in 2026; \u20AC14.60/h and \u20AC633/month from 1 January 2027.",
    due: "2027-01-01",
    url: "https://www.bundesregierung.de/breg-de/aktuelles/mindestlohn-faq-1688186",
  },
];
function CompliancePage() {
  let t = readPilotModel(),
    e = t.drivers
      .flatMap(Fe)
      .sort(
        (r, n) =>
          ["High", "Medium", "Low"].indexOf(r.severity) -
          ["High", "Medium", "Low"].indexOf(n.severity),
      ),
    a = [
      {
        rule: "Right to work",
        total: t.drivers.length,
        failing: t.drivers.filter((r) =>
          Fe(r).some(
            (n) => n.rule === "Right to work" && n.severity === "High",
          ),
        ).length,
      },
      {
        rule: "Minimum wage 2026",
        total: t.drivers.length,
        failing: t.drivers.filter((r) =>
          Fe(r).some((n) => n.rule === "Mindestlohn 2026"),
        ).length,
      },
      {
        rule: "Mini-job limit",
        total: t.drivers.filter((r) => r.employmentType === "Mini-job").length,
        failing: t.drivers.filter((r) =>
          Fe(r).some(
            (n) => n.rule === "Minijob limit 2026" && n.severity === "High",
          ),
        ).length,
      },
      {
        rule: "Break planning (ArbZG)",
        total: t.drivers.filter((r) => r.shiftEnd - r.shiftStart > 360).length,
        failing: t.drivers.filter((r) =>
          Fe(r).some((n) => n.rule === "ArbZG section 4"),
        ).length,
      },
      {
        rule: "Time recording",
        total: t.drivers.length,
        failing: 0,
      },
    ];
  return zt.jsxs(zt.Fragment, {
    children: [
      <PageHeader
        eyebrow="Compliance"
        title="Compliance"
        description="Right to work, wages, working time and contracts checked for every rider, with the regulatory changes that affect the pilot."
      />,
      <Callout tone="warn">
        {"These checks support, not replace, advice from an employment lawyer."}
      </Callout>,
      <div className="grid g4">
        <Stat
          label="High-severity items"
          value={e.filter((r) => r.severity === "High").length}
          tone="crit"
        />
        <Stat
          label="Medium"
          value={e.filter((r) => r.severity === "Medium").length}
          tone="warn"
        />
        <Stat
          label="Low"
          value={e.filter((r) => r.severity === "Low").length}
        />
        <Stat
          label="Riders fully compliant"
          value={t.drivers.filter((r) => Fe(r).length === 0).length}
          tone="good"
          foot={`of ${t.drivers.length}`}
        />
      </div>,
      <div className="grid g-2-1">
        <Card title="Compliance queue" flush={!0}>
          <div className="table-wrap table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>{"Rider"}</th>
                  <th>{"Issue"}</th>
                  <th>{"Rule"}</th>
                  <th>{"Severity"}</th>
                  <th>{"Due"}</th>
                </tr>
              </thead>
              <tbody>
                {e.map((r) => (
                  <tr key={`${r.driverId}-${r.issue}`}>
                    <td>
                      <Link to={`/riders/${r.driverId}`}>{r.driverName}</Link>
                    </td>
                    <td>
                      <div className="bold">{r.issue}</div>
                      <div className="xsmall muted">{r.detail}</div>
                    </td>
                    <td className="small">{r.rule}</td>
                    <td>
                      <Badge
                        tone={
                          r.severity === "High"
                            ? "crit"
                            : r.severity === "Medium"
                              ? "warn"
                              : "neutral"
                        }
                      >
                        {r.severity}
                      </Badge>
                    </td>
                    <td className="small">{r.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card title="Rule health">
          <div className="stack">
            {a.map((r) => {
              let n = r.total ? ((r.total - r.failing) / r.total) * 100 : 100;
              return (
                <div
                  className="stack-sm"
                  style={{
                    gap: 4,
                  }}
                  key={r.rule}
                >
                  <div className="row between small">
                    <span>{r.rule}</span>
                    <span className="num">
                      {r.total - r.failing}
                      {"/"}
                      {r.total}
                      {" passing"}
                    </span>
                  </div>
                  <Meter
                    value={n}
                    tone={n === 100 ? "good" : n >= 95 ? "warn" : "crit"}
                  />
                </div>
              );
            })}
          </div>
        </Card>
      </div>,
      <Card title="Regulatory watch" sub="Sources opened on 16 September 2026">
        <div className="grid g2">
          {TM.map((r) => {
            let n = r.due ? gi(r.due, Be) : null;
            return (
              <div className="alert-item" key={r.title}>
                <div className="grow">
                  <div className="t row between">
                    <span>{r.title}</span>
                    {n !== null && (
                      <Badge tone={n < 90 ? "warn" : "info"}>
                        {n}
                        {" days"}
                      </Badge>
                    )}
                  </div>
                  <div className="d">{r.detail}</div>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="small"
                  >
                    {"Source"}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </Card>,
    ],
  });
}
export { An, CapacityPage, CompliancePage, D2, Nn, i3, ve };
