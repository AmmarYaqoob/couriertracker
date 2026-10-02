// Shared UI components and the application shell.
import { useEffect, useMemo, useRef, useState } from "react";
import { jsx } from "react/jsx-runtime";
import {
  Bk,
  Pd,
  Qv,
  Tk,
  Vd,
  Zr,
  ck,
  f0,
  fl,
  gk,
  hk,
  i2,
  kk,
  o2,
  r2,
  sk,
  u2,
  ul,
} from "./icons.jsx";
import {
  C2,
  useOpsStore,
  simClock,
  useHashLocation,
  V,
  NAV_ITEMS,
  useSimClock,
  jt,
  useI18n,
  qd,
  rt,
  Link,
  xl,
  readPilotModel,
  yl,
  navigate,
} from "../services/portalState.jsx";
import { A2, B0, _2, bn, j2 } from "../services/copilotEngine.js";
import { useAuth } from "../auth/AuthProvider.jsx";
const STAT_COLORS = {
  good: "var(--good-ink)",
  warn: "var(--warn-ink)",
  crit: "var(--crit-ink)",
};

function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="page-head">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}
function Card({ title, sub, actions, children, flush, className = "", id }) {
  return (
    <section className={`card ${className}`} id={id}>
      {(title || actions) && (
        <div className="card-head">
          <div>
            {title && <h3>{title}</h3>}
            {sub && <div className="sub">{sub}</div>}
          </div>
          {actions && <div className="row wrap">{actions}</div>}
        </div>
      )}
      <div className={`card-body ${flush ? "flush" : ""}`}>{children}</div>
    </section>
  );
}
function Stat({ label, value, foot, icon, hero, tone }) {
  return (
    <div className={`card stat ${hero ? "hero" : ""}`}>
      <div className="label">
        {icon && <span className="stat-icon">{icon}</span>}
        {label}
      </div>
      <div className="value" style={{ color: STAT_COLORS[tone] }}>
        {value}
      </div>
      {foot && <div className="foot">{foot}</div>}
    </div>
  );
}
function Badge({ tone: t = "neutral", children: e, title: a }) {
  return (
    <span className={`badge ${t === "neutral" ? "" : t}`} title={a}>
      {e}
    </span>
  );
}
var aM = {
  green: {
    tone: "good",
    label: "On track",
    icon: <Zr size={12} />,
  },
  amber: {
    tone: "warn",
    label: "Check",
    icon: jsx(ul, {
      size: 12,
    }),
  },
  red: {
    tone: "crit",
    label: "Late",
    icon: jsx(u2, {
      size: 12,
    }),
  },
};
function wn({ band: t, label: e }) {
  let a = aM[t];
  return (
    <Badge tone={a.tone}>
      {a.icon}
      {e ?? a.label}
    </Badge>
  );
}
function bl({ severity: t }) {
  return t === "critical"
    ? jsx(u2, {
        size: 16,
        color: "var(--crit)",
      })
    : t === "warning"
      ? jsx(ul, {
          size: 16,
          color: "var(--warn-ink)",
        })
      : jsx(f0, {
          size: 16,
          color: "var(--info-ink)",
        });
}
function Button({ children: t, variant: e, size: a, ...r }) {
  return (
    <button type="button" className={`btn ${e ?? ""} ${a ?? ""}`} {...r}>
      {t}
    </button>
  );
}
function SegmentedControl({ value: t, options: e, onChange: a, label: r }) {
  return (
    <div className="seg" role="radiogroup" aria-label={r}>
      {e.map((n) => (
        <button
          type="button"
          role="radio"
          aria-checked={n.value === t}
          className={n.value === t ? "on" : ""}
          onClick={() => a(n.value)}
          key={n.value}
        >
          {n.label}
        </button>
      ))}
    </div>
  );
}
function Tabs({ value: t, tabs: e, onChange: a }) {
  return (
    <div className="tabs" role="tablist">
      {e.map((r) => (
        <button
          type="button"
          role="tab"
          aria-selected={r.value === t}
          className={r.value === t ? "on" : ""}
          onClick={() => a(r.value)}
          key={r.value}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
function Select({ id: t, value: e, options: a, onChange: r, label: n }) {
  let i = (
    <select
      id={t}
      className="select"
      value={e}
      onChange={(o) => r(o.target.value)}
      aria-label={n}
    >
      {a.map((o) => (
        <option value={o.value} key={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
  return n ? (
    <div className="field">
      <label htmlFor={t}>{n}</label>
      {i}
    </div>
  ) : (
    i
  );
}
function Field({ id: t, label: e, hint: a, children: r }) {
  return (
    <div className="field">
      <label htmlFor={t}>{e}</label>
      {r}
      {a && <div className="hint">{a}</div>}
    </div>
  );
}
function Meter({ value: t, max: e = 100, tone: a }) {
  let r = Math.max(0, Math.min(100, (t / e) * 100));
  return (
    <div
      className={`meter ${a ?? ""}`}
      role="meter"
      aria-valuenow={t}
      aria-valuemax={e}
    >
      <span
        style={{
          width: `${r}%`,
        }}
      />
    </div>
  );
}
function Callout({ tone: t, children: e }) {
  return (
    <div className={`note ${t ?? ""}`}>
      <span
        style={{
          marginTop: 2,
        }}
      >
        {t === "crit" ? (
          jsx(u2, {
            size: 14,
          })
        ) : t === "good" ? (
          <Zr size={14} />
        ) : t === "warn" ? (
          jsx(ul, {
            size: 14,
          })
        ) : (
          jsx(f0, {
            size: 14,
          })
        )}
      </span>
      <div>{e}</div>
    </div>
  );
}
function useEscapeToClose(onClose) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);
}

function Drawer({ title, onClose, children, footer }) {
  useEscapeToClose(onClose);
  return (
    <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="drawer" role="dialog" aria-modal="true">
        <div className="panel-head">
          <h3 style={{ fontSize: 16 }}>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <Vd size={16} />
          </button>
        </div>
        <div className="panel-body">{children}</div>
        {footer && <div className="panel-foot">{footer}</div>}
      </aside>
    </div>
  );
}
function Modal({ title, onClose, children, footer }) {
  useEscapeToClose(onClose);
  return (
    <div className="overlay center" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="panel-head">
          <h3 style={{ fontSize: 16 }}>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <Vd size={16} />
          </button>
        </div>
        <div className="panel-body">{children}</div>
        {footer && <div className="panel-foot">{footer}</div>}
      </div>
    </div>
  );
}
function Toast({ message: t }) {
  return t ? (
    <div className="toast" role="status">
      {t}
    </div>
  ) : null;
}
function KeyValueList({ items: t }) {
  return (
    <dl className="kv">
      {t.map(([e, a], r) => (
        <div
          style={{
            display: "contents",
          }}
          key={r}
        >
          <dt>{e}</dt>
          <dd>{a}</dd>
        </div>
      ))}
    </dl>
  );
}
function CountFraction({ num: t, den: e, pct: a }) {
  return (
    <span className="num">
      {a === null ? "\u2014" : `${a.toFixed(1)}%`}{" "}
      <span className="muted small">
        {"("}
        {t.toLocaleString("en-GB")}
        {"/"}
        {e.toLocaleString("en-GB")}
        {")"}
      </span>
    </span>
  );
}
function wl(t, e) {
  if (t !== null) return t >= e ? "good" : t >= e - 3 ? "warn" : "crit";
}
var rM = [
  "Which zones are short of drivers in the next 30 minutes?",
  "Which orders are at risk and why?",
  "Can we still reach today's PTOD target?",
  "Which restaurants should we escalate?",
  "Draft the end-of-day report",
];
function CopilotChat({ compact: t }) {
  let e = jt(),
    a = readPilotModel(),
    r = useOpsStore(),
    [n, i] = useState([
      {
        role: "assistant",
        content:
          "I answer from the live pilot data: capacity, late-delivery risk, restaurant waits, the daily target, cancellations and costs. I can also draft the end-of-day report.",
        engine: "Offline engine",
      },
    ]),
    [o, l] = useState(""),
    [d, c] = useState(!1),
    g = useRef(null),
    p = useRef(null);
  (useEffect(() => {
    B0();
  }, []),
    useEffect(() => {
      p.current?.scrollIntoView({
        block: "end",
      });
    }, [n]));
  let u = async (s) => {
    let f = s.trim();
    if (!f || d) return;
    l("");
    let x = [
      ...n
        .slice(1)
        .filter((h) => !h.pending)
        .map((h) => ({
          role: h.role,
          content: h.content,
        })),
      {
        role: "user",
        content: f,
      },
    ];
    (i((h) => [
      ...h,
      {
        role: "user",
        content: f,
      },
      {
        role: "assistant",
        content: "Thinking\u2026",
        pending: !0,
      },
    ]),
      c(!0),
      (g.current = new AbortController()));
    let M = /report|bericht/i.test(f);
    try {
      let h = await _2(x, A2(e, a, r), () => (M ? bn(e, r) : j2(f, e, a, r)), {
        signal: g.current.signal,
        onText: (m) =>
          i((y) => [
            ...y.slice(0, -1),
            {
              role: "assistant",
              content: m,
              pending: !0,
            },
          ]),
      });
      i((m) => [
        ...m.slice(0, -1),
        {
          role: "assistant",
          content: h.text,
          engine: h.engine,
          note: h.note,
        },
      ]);
    } catch {
      i((h) => [
        ...h.slice(0, -1),
        {
          role: "assistant",
          content: "Stopped.",
          engine: "Offline engine",
        },
      ]);
    } finally {
      (c(!1), (g.current = null));
    }
  };
  return (
    <div
      className="stack"
      style={{
        height: "100%",
      }}
    >
      <div
        className="chat"
        style={{
          flex: 1,
          overflow: "auto",
          maxHeight: t ? void 0 : 520,
          paddingRight: 4,
        }}
      >
        {n.map((s, f) => (
          <div className={`msg ${s.role}`} key={f}>
            {s.content}
            {s.role === "assistant" && s.engine && !s.pending && (
              <span className="engine">
                {s.engine}
                {s.note ? ` \xB7 ${s.note}` : ""}
              </span>
            )}
          </div>
        ))}
        <div ref={p} />
      </div>
      <div className="suggest">
        {rM.map((s) => (
          <button type="button" onClick={() => u(s)} disabled={d} key={s}>
            {s}
          </button>
        ))}
      </div>
      <form
        className="row"
        onSubmit={(s) => {
          (s.preventDefault(), u(o));
        }}
      >
        <label
          htmlFor={t ? "copilot-input-drawer" : "copilot-input"}
          className="sr-only"
          style={{
            position: "absolute",
            left: -9999,
          }}
        >
          {"Question"}
        </label>
        <input
          id={t ? "copilot-input-drawer" : "copilot-input"}
          className="input grow"
          placeholder="Ask about today's operation…"
          value={o}
          onChange={(s) => l(s.target.value)}
        />
        {d ? (
          <Button onClick={() => g.current?.abort()} aria-label="Stop">
            <Bk size={15} />
            {" Stop"}
          </Button>
        ) : (
          <button type="submit" className="btn primary" aria-label="Send">
            <Pd size={15} />
            {" Ask"}
          </button>
        )}
      </form>
    </div>
  );
}
function CopilotHeader({ onClose: t }) {
  return (
    <Drawer
      title=<span className="row">
        {jsx(fl, {
          size: 18,
        })}
        {" Ops Copilot"}
      </span>
      onClose={t}
    >
      <div className="note">
        <span>
          {jsx(r2, {
            size: 13,
          })}
          {
            " Answers use the live pilot snapshot. It explains and drafts; decisions about people stay with a named reviewer."
          }
        </span>
      </div>
      <CopilotChat compact={!0} />
    </Drawer>
  );
}
function applyTheme(theme) {
  if (theme === "system") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", theme);
}

function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("eels_theme") ?? "system";
    } catch {
      return "system";
    }
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = theme === "dark" || (theme === "system" && prefersDark) ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("eels_theme", next);
    } catch {
      // Ignore storage failures. The theme still applies for this view.
    }
  };

  return [theme, toggleTheme];
}
function SimClockControl() {
  let t = useSimClock(),
    { t: e } = useI18n();
  return (
    <div
      className="sim-clock"
      title="Simulated pilot day, Wednesday 16 September 2026"
    >
      <span
        className={`live-dot ${t.running ? "" : "paused"}`}
        aria-hidden={!0}
      />
      <div
        className="stack-sm"
        style={{
          gap: 0,
        }}
      >
        <span className="label">{e("simTime")}</span>
        <span className="time" aria-live="off">
          {V(t.now)}
        </span>
      </div>
      <input
        type="range"
        id="sim-time"
        aria-label="Simulated time"
        min={C2}
        max={xl}
        step={5}
        value={Math.round(t.now)}
        onChange={(a) => yl(Number(a.target.value))}
      />
      <select
        id="sim-speed"
        className="select"
        style={{
          padding: "3px 4px",
          fontSize: 12,
        }}
        aria-label="Simulation speed"
        value={t.speed}
        onChange={(a) =>
          simClock.set({
            speed: Number(a.target.value),
          })
        }
      >
        <option value={1}>{"1×"}</option>
        <option value={10}>{"10×"}</option>
        <option value={60}>{"60×"}</option>
        <option value={300}>{"300×"}</option>
      </select>
      <button
        className="icon-btn"
        style={{
          width: 30,
          height: 30,
        }}
        onClick={() =>
          simClock.set({
            running: !t.running,
          })
        }
        aria-label={t.running ? "Pause simulation" : "Run simulation"}
      >
        {t.running
          ? jsx(ck, {
              size: 14,
            })
          : jsx(o2, {
              size: 14,
            })}
      </button>
    </div>
  );
}
function CommandSearch() {
  let { t } = useI18n(),
    { user: e } = useAuth(),
    a = readPilotModel(),
    [r, n] = useState(""),
    [i, o] = useState(!1),
    l = useMemo(() => {
      let d = r.trim().toLowerCase();
      if (d.length < 2 || !e) return [];
      let c = NAV_ITEMS.filter((f) => qd(f, e.role))
          .map((f) => ({
            label: t(f.key),
            sub: "Page",
            to: f.path,
          }))
          .filter((f) => f.label.toLowerCase().includes(d)),
        g = a.drivers
          .filter(
            (f) => f.name.toLowerCase().includes(d) || f.id.toLowerCase() === d,
          )
          .slice(0, 6)
          .map((f) => ({
            label: f.name,
            sub: `Rider ${f.id} \xB7 ${rt(f.homeZoneId)}`,
            to: `/riders/${f.id}`,
          })),
        p = a.zones
          .filter((f) => f.name.toLowerCase().includes(d))
          .map((f) => ({
            label: f.name,
            sub: "Zone capacity",
            to: `/capacity?zone=${f.id}`,
          })),
        u = a.orders
          .filter((f) => f.id.toLowerCase().includes(d))
          .slice(0, 5)
          .map((f) => ({
            label: f.id,
            sub: "Order timeline",
            to: `/delays?order=${f.id}`,
          })),
        s = a.restaurants
          .filter((f) => f.name.toLowerCase().includes(d))
          .slice(0, 4)
          .map((f) => ({
            label: f.name,
            sub: "Restaurant waits",
            to: "/delays",
          }));
      return [...c, ...p, ...g, ...u, ...s].slice(0, 12);
    }, [r, e, a, t]);
  return (
    <div className="search">
      {jsx(i2, {
        size: 15,
      })}
      <input
        id="global-search"
        aria-label={t("search")}
        placeholder={t("search")}
        value={r}
        onChange={(d) => {
          (n(d.target.value), o(!0));
        }}
        onBlur={() => setTimeout(() => o(!1), 150)}
        onKeyDown={(d) => {
          d.key === "Enter" && l[0] && (navigate(l[0].to), n(""));
        }}
      />
      {i && r.trim().length >= 2 && (
        <div className="search-results">
          {l.length === 0 && (
            <div className="empty small">{t("noResults")}</div>
          )}
          {l.map((d, c) => (
            <button
              type="button"
              onMouseDown={(g) => g.preventDefault()}
              onClick={() => {
                (navigate(d.to), n(""), o(!1));
              }}
              key={c}
            >
              <span className="grow">
                <span className="bold">{d.label}</span>
                <span className="muted small">
                  {" · "}
                  {d.sub}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
function AlertsPanel({ onClose: t }) {
  let e = jt();
  return (
    <Drawer title={`Alerts at ${V(e.now)}`} onClose={t}>
      <p className="small text-2">
        {
          "Generated by the automation rules from live capacity, risk, readiness, restaurant and compliance data."
        }
      </p>
      {e.alerts.length === 0 && <div className="empty">{"No alerts."}</div>}
      {e.alerts.map((a) => (
        <Link
          to={a.route}
          className="alert-item"
          onClick={t}
          style={{
            color: "inherit",
            textDecoration: "none",
          }}
          key={a.id}
        >
          {jsx(bl, {
            severity: a.severity,
          })}
          <div className="grow">
            <div className="t">{a.title}</div>
            <div className="d">{a.detail}</div>
          </div>
        </Link>
      ))}
    </Drawer>
  );
}
function AppShell({ children: t }) {
  let { user: e, logout: a } = useAuth(),
    { t: r, lang: n, setLang: i } = useI18n(),
    { path: o } = useHashLocation(),
    l = jt(),
    [d, c] = useTheme(),
    g =
      d === "dark" ||
      (d === "system" &&
        typeof window < "u" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches),
    [p, u] = useState(!1),
    [s, f] = useState(!1),
    [x, M] = useState(!1);
  if (!e) return null;
  let h = NAV_ITEMS.filter((L) => qd(L, e.role)),
    m = [...new Set(h.map((L) => L.group))],
    y = l.alerts.filter((L) => L.severity === "critical").length,
    k = (L) =>
      L === "ops"
        ? l.bands.red || null
        : L === "capacity"
          ? Object.values(l.capacity).filter((w) => w.gap > 0).length || null
          : (L === "readiness" &&
              l.driverStates.filter(
                (w) => w.activity === "blocked" || w.activity === "no_show",
              ).length) ||
            null;
  return (
    <div className="shell">
      {p && <div className="scrim" onClick={() => u(!1)} />}
      <aside
        className={`sidebar ${p ? "open" : ""}`}
        aria-label="Main navigation"
      >
        <div className="brand">
          <div className="brand-mark">{"EE"}</div>
          <div>
            <div className="brand-name">{"EELS FLEET PORTAL"}</div>
            <div className="brand-sub">{"Frankfurt pilot"}</div>
          </div>
        </div>
        <nav className="nav">
          {m.map((L) => (
            <div
              style={{
                display: "contents",
              }}
              key={L}
            >
              <div className="nav-group">{r(L)}</div>
              {h
                .filter((w) => w.group === L)
                .map((w) => {
                  let O = w.icon,
                    A = k(w.key),
                    j =
                      o === w.path ||
                      (w.path === "/riders" && o.startsWith("/riders/"));
                  return (
                    <Link
                      to={w.path}
                      className={j ? "active" : ""}
                      onClick={() => u(!1)}
                      key={w.key}
                    >
                      <O size={17} />
                      {r(w.key)}
                      {A ? <span className="nav-badge">{A}</span> : null}
                    </Link>
                  );
                })}
            </div>
          ))}
        </nav>
        <div className="sidebar-foot">
          <div
            className="bold"
            style={{
              color: "#dfe6f3",
            }}
          >
            {e.name}
          </div>
          <div>{e.title}</div>
          <div
            style={{
              marginTop: 8,
            }}
          >
            {r("simulated")}
          </div>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <button
            className="icon-btn menu-btn"
            onClick={() => u(!0)}
            aria-label="Open menu"
          >
            {jsx(hk, {
              size: 17,
            })}
          </button>
          <CommandSearch />
          <div className="topbar-spacer" />
          <SimClockControl />
          <button
            className="icon-btn"
            onClick={() => f(!0)}
            aria-label={`${r("notifications")}: ${l.alerts.length}`}
          >
            <Tk size={16} />
            {l.alerts.length > 0 && (
              <span className="dot">{y || l.alerts.length}</span>
            )}
          </button>
          <button
            className="icon-btn hide-sm"
            onClick={() => i(n === "en" ? "de" : "en")}
            aria-label="Switch language"
            title={n === "en" ? "Deutsch" : "English"}
          >
            {jsx(kk, {
              size: 16,
            })}
          </button>
          <button className="icon-btn" onClick={c} aria-label="Switch theme">
            {g ? (
              <Qv size={16} />
            ) : (
              jsx(sk, {
                size: 16,
              })
            )}
          </button>
          <button
            className="icon-btn"
            onClick={a}
            aria-label={r("logout")}
            title={r("logout")}
          >
            {jsx(gk, {
              size: 16,
            })}
          </button>
        </header>
        <main className="content">{t}</main>
      </div>
      {o !== "/copilot" && (
        <button className="copilot-fab" onClick={() => M(!0)}>
          {jsx(fl, {
            size: 17,
          })}{" "}
          {r("askCopilot")}
        </button>
      )}
      {s && <AlertsPanel onClose={() => f(!1)} />}
      {x && <CopilotHeader onClose={() => M(!1)} />}
    </div>
  );
}
export {
  AlertsPanel,
  AppShell,
  Badge,
  Button,
  Callout,
  Card,
  CommandSearch,
  CopilotChat,
  CopilotHeader,
  CountFraction,
  Drawer,
  Field,
  KeyValueList,
  Meter,
  Modal,
  PageHeader,
  SegmentedControl,
  Select,
  SimClockControl,
  Stat,
  Tabs,
  Toast,
  bl,
  useTheme,
  wl,
  wn,
};
