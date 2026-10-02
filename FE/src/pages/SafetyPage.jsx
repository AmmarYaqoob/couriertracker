// Safety page.
import * as Br from "react";
import * as G from "react/jsx-runtime";
import {
  Kr,
  V,
  useSimClock,
  fi,
  useToast,
  rt,
  readPilotModel,
} from "../services/portalState.jsx";
import {
  Badge,
  SegmentedControl,
  Card,
  Stat,
  Select,
  Modal,
  Toast,
  PageHeader,
  Drawer,
  Callout,
  Button,
} from "../components/ui.jsx";
import { Jv } from "../components/icons.jsx";
var tu = {
    sos_button: "SOS button",
    crash_detected: "Crash detected",
    silent_emergency: "Silent emergency",
    man_down: "Man down",
    near_miss: "Near miss",
    severe_weather: "Severe weather",
    harassment_report: "Harassment report",
  },
  eu = {
    sos_button: "crit",
    crash_detected: "crit",
    silent_emergency: "crit",
    man_down: "crit",
    near_miss: "warn",
    severe_weather: "warn",
    harassment_report: "warn",
  },
  Dx = [
    "sos_button",
    "crash_detected",
    "silent_emergency",
    "man_down",
    "near_miss",
    "near_miss",
    "severe_weather",
    "harassment_report",
    "near_miss",
    "crash_detected",
    "sos_button",
    "man_down",
  ],
  $b = [
    "resolved",
    "resolved",
    "responding",
    "open",
    "resolved",
    "false_alarm",
    "responding",
    "resolved",
    "resolved",
    "open",
    "responding",
    "resolved",
  ],
  Fb = [
    "Rider pressed SOS after being cut off by a van; no injury, bike scuffed.",
    "Crash-detect triggered by sudden deceleration; rider confirmed safe.",
    "Silent emergency ping from checkout area; dispatcher called back within 90s.",
    "Man-down after minor slip on wet cobblestones near R\xF6merberg.",
    "Near-miss with tram on Zeil; rider unharmed, reported the crossing.",
    "Weather advisory auto-raised: hail warning from DWD for downtown.",
    "Customer verbally aggressive at handover; rider withdrew, SafeChat opened.",
    "SOS false alarm \u2014 phone in jacket pocket.",
    "Near-miss with e-scooter on the bridge, no contact.",
    "Crash-detect: rider clipped by opening car door, minor bruising, ambulance called.",
    "SOS from parking garage; poor GPS, dispatcher used last-known zone to locate.",
    "Rider slipped on the ramp, cargo intact, no injury.",
  ];
function Zb(t) {
  return function () {
    t = (t + 1831565813) | 0;
    let e = t;
    return (
      (e = Math.imul(e ^ (e >>> 15), e | 1)),
      (e ^= e + Math.imul(e ^ (e >>> 7), e | 61)),
      ((e ^ (e >>> 14)) >>> 0) / 4294967296
    );
  };
}
function zx(t, e) {
  if (e.length === 0) return [];
  let a = Zb(20260916),
    r = Math.min(12, Dx.length),
    n = [];
  for (let i = 0; i < r; i++) {
    let o = e[Math.floor(a() * e.length)],
      l = Dx[i],
      d = $b[i],
      c = Math.floor(6 + a() * 260),
      g = Math.max(0, t - c),
      p = (a() - 0.5) * 0.05,
      u = (a() - 0.5) * 0.07,
      f =
        (l === "crash_detected" || l === "man_down" || l === "sos_button") &&
        d === "resolved" &&
        a() > 0.4;
    n.push({
      id: `SAF-${String(2100 + i).padStart(4, "0")}`,
      driverId: o.id,
      kind: l,
      status: d,
      at: g,
      zoneId: o.homeZoneId,
      latLng: [50.1 + p, 8.68 + u],
      bg_verkehr_reported: f,
      notes: Fb[i],
    });
  }
  return n.sort((i, o) => o.at - i.at);
}
var qb = [
    {
      value: "all",
      label: "All",
    },
    {
      value: "crit",
      label: "Critical",
    },
    {
      value: "warn",
      label: "Warning",
    },
    {
      value: "info",
      label: "Info",
    },
  ],
  Gb = [
    {
      value: "all",
      label: "All",
    },
    {
      value: "sos_button",
      label: "SOS",
    },
    {
      value: "crash_detected",
      label: "Crash",
    },
    {
      value: "man_down",
      label: "Man down",
    },
    {
      value: "near_miss",
      label: "Near miss",
    },
    {
      value: "severe_weather",
      label: "Weather",
    },
  ],
  Vx = {
    open: "warn",
    responding: "info",
    resolved: "good",
    false_alarm: "neutral",
  },
  op = {
    open: "Open",
    responding: "Responding",
    resolved: "Resolved",
    false_alarm: "False alarm",
  },
  Kb = [
    {
      key: "sos_swipe",
      label: "SOS swipe (rider app)",
      status: "on",
      note: "Two-finger swipe opens SOS on lock screen.",
    },
    {
      key: "silent_emergency",
      label: "Silent emergency ping",
      status: "on",
      note: "Sends location + audio hint without alerting the caller.",
    },
    {
      key: "crash_detect",
      label: "Crash detection",
      status: "on",
      note: "Auto-triggers if speed drops from >15km/h to 0 with impact.",
    },
    {
      key: "phone_masking",
      label: "Phone-number masking",
      status: "on",
      note: "Both directions via platform proxy numbers.",
    },
    {
      key: "safechat_filter",
      label: "SafeChat filter",
      status: "beta",
      note: "Blocks abusive messages, flags for review.",
    },
  ];
function SafetyPage() {
  let t = readPilotModel(),
    { now: e } = useSimClock(),
    [a, r] = useToast(),
    [n, i] = Br.useState(() => zx(e, t.drivers)),
    [o, l] = Br.useState("all"),
    [d, c] = Br.useState("all"),
    [g, p] = Br.useState("all"),
    [u, s] = Br.useState(null),
    [f, x] = Br.useState(!1),
    [M, h] = fi("safety.weatherPause", !1),
    m = Br.useMemo(() => {
      let v = new Map(t.drivers.map((E) => [E.id, E.name]));
      return (E) => v.get(E) ?? "\u2014";
    }, [t.drivers]),
    y = Br.useMemo(
      () => [
        {
          value: "all",
          label: "All zones",
        },
        ...Kr.map((v) => ({
          value: v.id,
          label: v.name,
        })),
      ],
      [],
    ),
    k = Br.useMemo(
      () =>
        n.filter(
          (v) =>
            !(
              (o !== "all" && eu[v.kind] !== o) ||
              (d !== "all" && v.kind !== d) ||
              (g !== "all" && v.zoneId !== g)
            ),
        ),
      [n, o, d, g],
    ),
    L = n.filter(
      (v) => v.status === "open" || v.status === "responding",
    ).length,
    w = n.filter(
      (v) =>
        !v.bg_verkehr_reported &&
        (v.kind === "crash_detected" ||
          v.kind === "man_down" ||
          v.kind === "sos_button"),
    ).length,
    O = n.filter((v) => v.status === "resolved").length,
    A = u ? (n.find((v) => v.id === u) ?? null) : null,
    j = (v, E) =>
      i((Q) =>
        Q.map((_) =>
          _.id === v
            ? {
                ..._,
                ...E,
              }
            : _,
        ),
      );
  return (
    <G.Fragment>
      <PageHeader
        eyebrow="Safety"
        title="Safety Center"
        description="SOS, crash-detect, near-miss and severe-weather events. BG Verkehr reporting SLA tracked."
        actions=<Button variant="danger" onClick={() => x(!0)}>
          <Jv size={14} />
          {" Test SOS Broadcast"}
        </Button>
      />
      {M && (
        <Callout tone="crit">
          {"Dispatch is auto-paused because of severe weather."}
        </Callout>
      )}
      <div className="grid g4">
        <Stat label="Open incidents" value={L} tone={L > 0 ? "warn" : "good"} />
        <Stat label="Avg response time" value="3.4 min" foot="last 7 days" />
        <Stat
          label="Unreported to BG Verkehr"
          value={w}
          tone={w > 0 ? "crit" : "good"}
        />
        <Stat label="Resolved today" value={O} tone="good" />
      </div>
      <Card
        title="Safety events"
        actions=<G.Fragment>
          <SegmentedControl
            value={o}
            onChange={l}
            options={qb}
            label="Severity"
          />
          <SegmentedControl value={d} onChange={c} options={Gb} label="Kind" />
          <Select
            id="safety-zone"
            value={g}
            onChange={p}
            options={y}
            label="Zone"
          />
        </G.Fragment>
        flush={!0}
      >
        <div className="table-wrap table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th className="num">{"Time"}</th>
                <th>{"Rider"}</th>
                <th>{"Kind"}</th>
                <th>{"Zone"}</th>
                <th>{"Status"}</th>
                <th>{"BG Verkehr"}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {k.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty">
                    {"No matching events."}
                  </td>
                </tr>
              )}
              {k.map((v) => (
                <tr
                  onClick={() => s(v.id)}
                  style={{
                    cursor: "pointer",
                  }}
                  key={v.id}
                >
                  <td className="num mono small">{V(v.at)}</td>
                  <td className="small">{m(v.driverId)}</td>
                  <td>
                    <Badge tone={eu[v.kind]}>{tu[v.kind]}</Badge>
                  </td>
                  <td className="small">{rt(v.zoneId)}</td>
                  <td>
                    <Badge tone={Vx[v.status]}>{op[v.status]}</Badge>
                  </td>
                  <td>
                    <Badge tone={v.bg_verkehr_reported ? "good" : "warn"}>
                      {v.bg_verkehr_reported ? "Yes" : "No"}
                    </Badge>
                  </td>
                  <td className="right">
                    <Button
                      size="sm"
                      onClick={(E) => {
                        (E.stopPropagation(), s(v.id));
                      }}
                    >
                      {"Open"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="grid g2">
        <Card
          title="Severe Weather Protocol"
          sub={M ? "Auto-pause ON" : "Auto-pause OFF"}
          actions=<Button
            variant={M ? "danger" : "primary"}
            size="sm"
            onClick={() => {
              let v = !M;
              (h(v), r(v ? "Auto-pause enabled" : "Auto-pause disabled"));
            }}
          >
            {M ? "Turn off" : "Turn on"}
          </Button>
        >
          <p
            className="small muted"
            style={{
              margin: 0,
            }}
          >
            {
              "When enabled, new dispatch is paused and riders are advised to seek shelter. Ongoing deliveries are allowed to complete unless a rider requests recall."
            }
          </p>
        </Card>
        <Card title="Safety features enabled">
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gap: 8,
            }}
          >
            {Kb.map((v) => (
              <li
                className="row"
                style={{
                  justifyContent: "space-between",
                  gap: 12,
                }}
                key={v.key}
              >
                <div>
                  <div
                    className="small"
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    {v.label}
                  </div>
                  <div className="xsmall muted">{v.note}</div>
                </div>
                <Badge
                  tone={
                    v.status === "on"
                      ? "good"
                      : v.status === "beta"
                        ? "info"
                        : "neutral"
                  }
                >
                  {v.status === "on"
                    ? "On"
                    : v.status === "beta"
                      ? "Beta"
                      : "Off"}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Callout tone="warn">
        {
          'BG Verkehr requires workplace accident reporting by the next working day ("spätestens am nächsten Werktag"). Crashes and man-down events with injury must be filed via the BG Verkehr portal.'
        }
      </Callout>
      {f && (
        <Modal
          title="Send test SOS ping to all riders on shift"
          onClose={() => x(!1)}
          footer=<G.Fragment>
            <Button onClick={() => x(!1)}>{"Cancel"}</Button>
            <Button
              variant="danger"
              onClick={() => {
                (x(!1), r("Sent to 42 riders"));
              }}
            >
              {"Send test"}
            </Button>
          </G.Fragment>
        >
          <p className="small">
            {
              "This will push a silent test-SOS notification to every rider currently on shift. Riders acknowledge with a swipe; unacknowledged pings appear in the response report."
            }
          </p>
        </Modal>
      )}
      {A && (
        <Yb
          event={A}
          driver={m(A.driverId)}
          onClose={() => s(null)}
          onStatus={(v) => {
            (j(A.id, {
              status: v,
            }),
              r(`Marked ${op[v].toLowerCase()}`));
          }}
          onReport={() => {
            (j(A.id, {
              bg_verkehr_reported: !0,
            }),
              r("Reported to BG Verkehr"));
          }}
        />
      )}
      <Toast message={a} />
    </G.Fragment>
  );
}
function Yb({ event: t, driver: e, onClose: a, onStatus: r, onReport: n }) {
  let [i, o] = t.latLng,
    l = Math.max(6, Math.min(94, ((o - 8.6) / 0.16) * 100)),
    d = Math.max(6, Math.min(94, (1 - (i - 50.06) / 0.1) * 100));
  return (
    <Drawer
      title={`${tu[t.kind]} \u2014 ${t.id}`}
      onClose={a}
      footer=<G.Fragment>
        <Button
          size="sm"
          onClick={() => r("responding")}
          disabled={t.status === "responding"}
        >
          {"Mark responding"}
        </Button>
        <Button
          size="sm"
          variant="primary"
          onClick={() => r("resolved")}
          disabled={t.status === "resolved"}
        >
          {"Mark resolved"}
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={n}
          disabled={t.bg_verkehr_reported}
        >
          {t.bg_verkehr_reported ? "Reported" : "Report to BG Verkehr"}
        </Button>
      </G.Fragment>
    >
      <div
        className="grid"
        style={{
          gap: 12,
        }}
      >
        <div
          className="row"
          style={{
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <Badge tone={eu[t.kind]}>{tu[t.kind]}</Badge>
          <Badge tone={Vx[t.status]}>{op[t.status]}</Badge>
          <Badge tone={t.bg_verkehr_reported ? "good" : "warn"}>
            {"BG Verkehr: "}
            {t.bg_verkehr_reported ? "Reported" : "Not reported"}
          </Badge>
        </div>
        <dl className="kv">
          <dt>{"Time"}</dt>
          <dd className="mono">{V(t.at)}</dd>
          <dt>{"Rider"}</dt>
          <dd>{e}</dd>
          <dt>{"Zone"}</dt>
          <dd>{rt(t.zoneId)}</dd>
          <dt>{"Coordinates"}</dt>
          <dd className="mono small">
            {i.toFixed(4)}
            {", "}
            {o.toFixed(4)}
          </dd>
        </dl>
        <div>
          <div
            className="xsmall muted"
            style={{
              marginBottom: 4,
            }}
          >
            {"Approximate location"}
          </div>
          <svg
            viewBox="0 0 100 100"
            width={140}
            height={140}
            role="img"
            aria-label="Event location map placeholder"
            style={{
              border: "1px solid var(--border, #ddd)",
              borderRadius: 6,
              background: "var(--panel, #fafafa)",
            }}
          >
            <rect x={0} y={0} width={100} height={100} fill="transparent" />
            <line
              x1={0}
              y1={50}
              x2={100}
              y2={50}
              stroke="currentColor"
              strokeOpacity={0.15}
            />
            <line
              x1={50}
              y1={0}
              x2={50}
              y2={100}
              stroke="currentColor"
              strokeOpacity={0.15}
            />
            <circle
              cx={l}
              cy={d}
              r={4}
              fill="var(--crit, #d33)"
              stroke="#fff"
              strokeWidth={1.5}
            />
          </svg>
        </div>
        <div>
          <div
            className="xsmall muted"
            style={{
              marginBottom: 4,
            }}
          >
            {"Notes"}
          </div>
          <p
            className="small"
            style={{
              margin: 0,
            }}
          >
            {t.notes}
          </p>
        </div>
        {!t.bg_verkehr_reported &&
          (t.kind === "crash_detected" ||
            t.kind === "man_down" ||
            t.kind === "sos_button") && (
            <Callout tone="warn">
              {
                "Reportable to BG Verkehr — file spätestens am nächsten Werktag."
              }
            </Callout>
          )}
      </div>
    </Drawer>
  );
}
export { SafetyPage };
