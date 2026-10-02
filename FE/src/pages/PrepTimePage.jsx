// Prep-time page.
import * as _n from "react";
import * as K from "react/jsx-runtime";
import {
  Badge,
  Card,
  Stat,
  Toast,
  PageHeader,
  Drawer,
  Callout,
  Button,
} from "../components/ui.jsx";
import { Ek, Wk, ik, uk } from "../components/icons.jsx";
import {
  V,
  useSimClock,
  jt,
  useToast,
  rt,
  readPilotModel,
} from "../services/portalState.jsx";
function Tb(t, e) {
  let a = e >>> 0 || 2654435761;
  for (let r = 0; r < t.length; r++)
    a = Math.imul(a ^ t.charCodeAt(r), 2654435761) >>> 0;
  return a || 1;
}
function Wb(t) {
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
function Mx(t) {
  let e = Math.exp(-((t - 19) ** 2) / 4),
    a = 0.7 * Math.exp(-((t - 13) ** 2) / 2.5),
    r = t < 6 ? -0.25 : 0;
  return Math.max(0.08, e + a + r);
}
function bx(t, e) {
  if (t.length === 0) return 0;
  let a = Math.min(t.length - 1, Math.max(0, Math.floor(e * t.length)));
  return t[a];
}
function ap(t, e) {
  let a = Wb(Tb(t, e)),
    r = 7 + a() * 6,
    n = 4 + a() * 7,
    i = 0.6 + a() * 1.4,
    o = new Array(24);
  for (let x = 0; x < 24; x++) {
    let M = Mx(x),
      h = (a() - 0.5) * i;
    o[x] = Math.max(2.5, r + n * M + h);
  }
  let l = o.map((x, M) => Mx(M)),
    d = l.reduce((x, M) => x + M, 0),
    c = 400,
    g = new Array(c);
  for (let x = 0; x < c; x++) {
    let M = a() * d,
      h = 0;
    for (; h < 23 && M > l[h];) ((M -= l[h]), h++);
    let m = (a() + a() + a() - 1.5) * 2.4;
    g[x] = Math.max(1, o[h] + m);
  }
  g.sort((x, M) => x - M);
  let p = bx(g, 0.5),
    u = bx(g, 0.9),
    s = 180 + Math.floor(a() * 620),
    f = Math.round((a() - 0.5) * 60) / 10;
  return {
    restaurantId: t,
    hourly: o,
    p50: p,
    p90: u,
    samples28: s,
    driftMinLast7d: f,
  };
}
function wx(t, e) {
  let a = Math.max(0, Math.min(23, Math.floor(e / 60) % 24)),
    r = t.hourly[a],
    n = e + r,
    i = t.p50 > 0 ? Math.max(1.15, t.p90 / t.p50) : 1.4,
    o = e + r * i;
  return {
    p50Ready: n,
    p90Ready: o,
  };
}
function Cx(t, e) {
  return t - e;
}
function Sx(t, e) {
  let a = 2 + Math.abs(e.driftMinLast7d) * 0.25;
  return Math.max(0, t - a);
}
var X2 = 2;
function Bx(t) {
  if (t.length === 0) return 0;
  let e = 0;
  for (let a of t) e += a;
  return e / t.length;
}
function Ob({ drift: t }) {
  return Math.abs(t) < 0.2 ? (
    <Badge tone="neutral" title="Prep-time steady week over week">
      {K.jsx(uk, {
        size: 12,
      })}{" "}
      {t.toFixed(1)}
      {" min"}
    </Badge>
  ) : t > 0 ? (
    <Badge tone="warn" title="Getting slower vs prior 21 days">
      <Wk size={12} />
      {" +"}
      {t.toFixed(1)}
      {" min"}
    </Badge>
  ) : (
    <Badge tone="good" title="Getting faster vs prior 21 days">
      <Ek size={12} /> {t.toFixed(1)}
      {" min"}
    </Badge>
  );
}
function Eb({ hourly: t, nowHour: e }) {
  let n = {
      l: 34,
      r: 12,
      t: 12,
      b: 24,
    },
    i = 560 - n.l - n.r,
    o = 200 - n.t - n.b,
    l = Math.max(...t) * 1.15,
    d = (f) => n.l + (f / 23) * i,
    c = (f) => n.t + o - (f / l) * o,
    g = t
      .map(
        (f, x) => `${x === 0 ? "M" : "L"}${d(x).toFixed(1)},${c(f).toFixed(1)}`,
      )
      .join(" "),
    p = `${g} L${d(23).toFixed(1)},${(n.t + o).toFixed(1)} L${d(0).toFixed(1)},${(n.t + o).toFixed(1)} Z`,
    u = 4,
    s = [0, 6, 12, 18, 23];
  return (
    <svg
      viewBox="0 0 560 200"
      width="100%"
      height={200}
      role="img"
      aria-label="24-hour prep-time curve"
      style={{
        display: "block",
      }}
    >
      {Array.from(
        {
          length: u + 1,
        },
        (f, x) => {
          let M = (l * x) / u,
            h = c(M);
          return (
            <g key={`y${x}`}>
              <line
                x1={n.l}
                x2={560 - n.r}
                y1={h}
                y2={h}
                stroke="var(--line, #e5e7eb)"
                strokeDasharray={x === 0 ? void 0 : "2 3"}
              />
              <text
                x={n.l - 6}
                y={h + 3}
                textAnchor="end"
                fontSize={10}
                fill="var(--muted-ink, #6b7280)"
              >
                {M.toFixed(0)}
              </text>
            </g>
          );
        },
      )}
      <path d={p} fill="var(--seq-3, #a5c8e8)" opacity={0.25} />
      <path d={g} fill="none" stroke="var(--seq-3, #2563eb)" strokeWidth={2} />
      {t.map((f, x) => (
        <circle
          cx={d(x)}
          cy={c(f)}
          r={2}
          fill="var(--seq-3, #2563eb)"
          key={x}
        />
      ))}
      {e >= 0 && e <= 23 && (
        <g>
          <line
            x1={d(e)}
            x2={d(e)}
            y1={n.t}
            y2={n.t + o}
            stroke="var(--accent, #111827)"
            strokeDasharray="3 3"
          />
          <text
            x={d(e) + 4}
            y={n.t + 10}
            fontSize={10}
            fill="var(--accent, #111827)"
          >
            {"now"}
          </text>
        </g>
      )}
      {s.map((f) => (
        <text
          x={d(f)}
          y={194}
          textAnchor="middle"
          fontSize={10}
          fill="var(--muted-ink, #6b7280)"
          key={`x${f}`}
        >
          {String(f).padStart(2, "0")}
          {":00"}
        </text>
      ))}
    </svg>
  );
}
function Hb({ current: t, recommended: e }) {
  let a = Math.max(t, e, 1);
  return (
    <div
      className="stack-sm"
      style={{
        marginTop: 8,
      }}
    >
      {[
        {
          label: "Current gap",
          value: t,
          color: "var(--warn-ink)",
        },
        {
          label: "Recommended",
          value: e,
          color: "var(--good-ink)",
        },
      ].map((n) => (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "140px 1fr 70px",
            alignItems: "center",
            gap: 10,
          }}
          key={n.label}
        >
          <div className="small">{n.label}</div>
          <div
            style={{
              background: "var(--surf-2, #f3f4f6)",
              height: 12,
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(n.value / a) * 100}%`,
                background: n.color,
                transition: "width 200ms",
              }}
            />
          </div>
          <div className="num small">
            {n.value.toFixed(1)}
            {" min"}
          </div>
        </div>
      ))}
    </div>
  );
}
function PrepTimePage() {
  let t = readPilotModel(),
    e = jt(),
    { now: a } = useSimClock(),
    [r, n] = useToast(),
    [i, o] = _n.useState(null),
    l = _n.useMemo(() => {
      let y = new Map();
      for (let k of t.restaurants) y.set(k.id, ap(k.id, t.seed));
      return y;
    }, [t.restaurants, t.seed]),
    d = _n.useMemo(
      () => new Map(e.restaurants.map((y) => [y.restaurantId, y])),
      [e.restaurants],
    ),
    c = _n.useMemo(
      () =>
        t.restaurants
          .map((y) => {
            let k = l.get(y.id),
              L = d.get(y.id);
            return {
              r: y,
              model: k ?? ap(y.id, 1),
              medianWait: L?.medianWait ?? null,
              pickups: L?.pickups ?? 0,
            };
          })
          .sort((y, k) => k.model.p90 - y.model.p90),
      [t.restaurants, l, d],
    ),
    g = Bx(c.map((y) => y.model.p50)),
    p = Bx(c.map((y) => y.model.p90)),
    u = _n.useMemo(() => {
      let y = 0;
      for (let k of c)
        k.medianWait === null ||
          k.pickups === 0 ||
          (y += Sx(k.medianWait, k.model) * k.pickups);
      return y;
    }, [c]),
    s = _n.useMemo(
      () =>
        e.restaurants
          .filter((y) => y.medianWait !== null && y.pickups > 0)
          .slice(0, 10),
      [e.restaurants],
    ),
    f = Math.max(1, ...s.map((y) => y.medianWait ?? 0)),
    x = _n.useMemo(
      () => (i ? (c.find((k) => k.r.id === i) ?? null) : null),
      [i, c],
    ),
    M = Math.floor(a / 60) % 24,
    h = x ? wx(x.model, a) : null,
    m = h ? Cx(h.p50Ready, X2) : null;
  return (
    <K.Fragment>
      <PageHeader
        title="Prep-Time Prediction"
        description="Per-restaurant prep-time models. Dispatch couriers to arrive just-in-time. Cuts courier wait-at-pickup, the #1 delay cause on Uber."
      />
      <div className="grid g4">
        <Stat
          label="Restaurants modelled"
          value={t.restaurants.length}
          foot=<span className="muted small">
            {"Rolling 28 days of pickup samples"}
          </span>
        />
        <Stat
          label="Avg P50 prep"
          value={`${g.toFixed(1)} min`}
          foot=<span className="muted small">
            {"Day-weighted median across the fleet"}
          </span>
        />
        <Stat
          label="Avg P90 prep"
          value={`${p.toFixed(1)} min`}
          foot=<span className="muted small">{"Long-tail exposure"}</span>
        />
        <Stat
          label="Projected wait saved today"
          value={`${u.toFixed(0)} min`}
          tone="good"
          foot=<span className="muted small">
            {"Sum of expected pickup-wait reduction"}
          </span>
        />
      </div>
      <Card
        title="Prep-time models"
        sub="Sorted by P90 prep time. Row click opens the 24-hour curve and dispatch recommendation."
      >
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{"Restaurant"}</th>
                <th>{"Zone"}</th>
                <th className="num">{"P50 (min)"}</th>
                <th className="num">{"P90 (min)"}</th>
                <th className="num">{"Samples (28d)"}</th>
                <th>{"Drift (7d)"}</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {c.map((y) => (
                <tr
                  onClick={() => o(y.r.id)}
                  style={{
                    cursor: "pointer",
                  }}
                  key={y.r.id}
                >
                  <td>{y.r.name}</td>
                  <td className="small">{rt(y.r.zoneId)}</td>
                  <td className="num">{y.model.p50.toFixed(1)}</td>
                  <td className="num">{y.model.p90.toFixed(1)}</td>
                  <td className="num">{y.model.samples28}</td>
                  <td>
                    <Ob drift={y.model.driftMinLast7d} />
                  </td>
                  <td onClick={(k) => k.stopPropagation()}>
                    <Button
                      size="sm"
                      onClick={() => n(`Recalibrating ${y.r.name}...`)}
                    >
                      {K.jsx(ik, {
                        size: 12,
                      })}
                      {" Recalibrate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card
        title="Wait-at-pickup Pareto"
        sub="Top 10 restaurants by median courier wait — where the prep-time model pays back fastest."
      >
        {s.length === 0 ? (
          <p className="small muted">{"No pickup samples yet today."}</p>
        ) : (
          <div className="stack-sm">
            {s.map((y) => {
              let k = y.medianWait ?? 0;
              return (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "200px 1fr 130px",
                    alignItems: "center",
                    gap: 12,
                  }}
                  key={y.restaurantId}
                >
                  <div className="small">
                    <span className="bold">{y.name}</span>
                    <span className="muted">
                      {" · "}
                      {rt(y.zoneId)}
                    </span>
                  </div>
                  <div
                    style={{
                      background: "var(--surf-2, #f3f4f6)",
                      height: 14,
                      borderRadius: 6,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${(k / f) * 100}%`,
                        background: "var(--warn-ink)",
                      }}
                    />
                  </div>
                  <div className="num small">
                    {k.toFixed(1)}
                    {" min · "}
                    {y.pickups}
                    {" pickups"}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
      <Callout>
        {"Uber "}
        <code>{"pickup"}</code>
        {" → "}
        <code>{"pickup_complete"}</code>
        {" gap tells us wait time; Wolt exposes "}
        <code>{"ready"}</code>
        {" timestamp separately. This model already benefits both."}
      </Callout>
      {x && h && m !== null && (
        <Drawer
          title={`${x.r.name} \xB7 prep-time model`}
          onClose={() => o(null)}
          footer=<Button
            variant="primary"
            onClick={() => {
              (n(
                `Applied just-in-time dispatch for ${x.r.name} (target arrival ${V(m)})`,
              ),
                o(null));
            }}
          >
            {"Apply recommendation"}
          </Button>
        >
          <div className="stack">
            <div>
              <div className="row between">
                <div className="bold">{"24-hour prep-time curve"}</div>
                <div className="small muted">
                  {"P50 "}
                  {x.model.p50.toFixed(1)}
                  {" · P90 "}
                  {x.model.p90.toFixed(1)}
                  {" min"}
                </div>
              </div>
              <Eb hourly={x.model.hourly} nowHour={M} />
              <p
                className="xsmall muted"
                style={{
                  marginTop: 6,
                }}
              >
                {x.model.samples28}
                {" samples · drift last 7d"}{" "}
                {x.model.driftMinLast7d > 0 ? "+" : ""}
                {x.model.driftMinLast7d.toFixed(1)}
                {" min"}
              </p>
            </div>
            <div>
              <div className="bold">{"If an order arrives now"}</div>
              <p
                className="small muted"
                style={{
                  marginTop: 4,
                }}
              >
                {"Predicted ready "}
                {V(h.p50Ready)}
                {" (P50) ·"} {V(h.p90Ready)}
                {" (P90). Dispatch a courier to arrive by"}{" "}
                <span className="bold">{V(m)}</span>
                {" ("}
                {X2}
                {"-min safety buffer)."}
              </p>
            </div>
            <div>
              <div className="bold">
                {"Current dispatch arrival gap vs recommended"}
              </div>
              <Hb current={x.medianWait ?? 0} recommended={X2} />
              <p
                className="small muted"
                style={{
                  marginTop: 6,
                }}
              >
                {"Today's median courier wait at "}
                {x.r.name}
                {" is"} {(x.medianWait ?? 0).toFixed(1)}
                {" min across "}
                {x.pickups}
                {" pickups. The model targets a "}
                {X2}
                {"-min buffer — the rest is pure waste of courier time."}
              </p>
            </div>
          </div>
        </Drawer>
      )}
      <Toast message={r} />
    </K.Fragment>
  );
}
export { PrepTimePage };
