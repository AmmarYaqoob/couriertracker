// Algorithm decision log page and its event catalogue.
import * as Sa from "react";
import * as X from "react/jsx-runtime";
import {
  Be,
  V,
  useSimClock,
  readPilotModel,
} from "../services/portalState.jsx";
import {
  Badge,
  SegmentedControl,
  Card,
  KeyValueList,
  Stat,
  Select,
  Meter,
  Modal,
  Field,
  PageHeader,
  Drawer,
  Callout,
  Button,
} from "../components/ui.jsx";
var E2 = {
  order_offer: "Order offered",
  order_reassignment: "Order reassigned",
  shift_denied: "Shift denied",
  shift_offered: "Shift offered",
  incentive_fired: "Incentive triggered",
  dispatch_block_arbzg: "Dispatch blocked (ArbZG)",
  dispatch_block_minijob: "Dispatch blocked (mini-job)",
  priority_boost: "Priority boost",
  no_show_flag: "No-show flag",
};
function dM(t) {
  let e = t | 0;
  return () => {
    e = (e + 1831565813) | 0;
    let a = e;
    return (
      (a = Math.imul(a ^ (a >>> 15), a | 1)),
      (a ^= a + Math.imul(a ^ (a >>> 7), a | 61)),
      ((a ^ (a >>> 14)) >>> 0) / 4294967296
    );
  };
}
function cM(t) {
  let e = Math.max(0, Math.round(t)),
    a = Math.floor(e / 60),
    r = e % 60;
  return `${a}h${String(r).padStart(2, "0")}`;
}
function W0(t) {
  return String(8e3 + Math.floor(t() * 1500));
}
var S5 = [
    {
      kind: "order_offer",
      outcome: "allowed",
      regulation: "internal",
      build: (t, e) => {
        let a = 4 + Math.floor(t() * 6),
          r = Math.floor(t() * 3),
          n = 60 + Math.floor(t() * 35),
          i = W0(t);
        return {
          orderId: i,
          inputs: {
            eta_to_pickup_min: a,
            current_load: r,
            acceptance_rate_28d_pct: n,
            same_zone: !0,
          },
          weight: {
            eta_to_pickup_min: 0.55,
            current_load: 0.25,
            acceptance_rate_28d_pct: 0.15,
            same_zone: 0.05,
          },
          reason: `Order ${i} offered to Rider #${e.idx}: closest free rider (${a} min to pickup) with load ${r} and 28-day acceptance ${n}%.`,
        };
      },
    },
    {
      kind: "order_reassignment",
      outcome: "info",
      regulation: "internal",
      build: (t, e) => {
        let a = 3 + Math.floor(t() * 6),
          r = 4 + Math.floor(t() * 4),
          n = W0(t);
        return {
          orderId: n,
          inputs: {
            original_wait_min: a,
            restaurant_ready: !0,
            backup_eta_min: r,
          },
          weight: {
            original_wait_min: 0.5,
            restaurant_ready: 0.3,
            backup_eta_min: 0.2,
          },
          reason: `Order ${n} reassigned from Rider #${e.idx}: original rider still ${a} min away, restaurant is ready, backup rider ${r} min out.`,
        };
      },
    },
    {
      kind: "shift_denied",
      outcome: "blocked",
      regulation: "ArbZG",
      build: (t, e) => {
        let a = 540 + Math.floor(t() * 60),
          r = 8 + Math.floor(t() * 3);
        return {
          inputs: {
            worked_this_week_h: Math.round((a / 60) * 10) / 10,
            rest_since_last_shift_h: r,
            requested_hours: 6,
          },
          weight: {
            worked_this_week_h: 0.5,
            rest_since_last_shift_h: 0.4,
            requested_hours: 0.1,
          },
          reason: `Shift request from Rider #${e.idx} denied: only ${r}h since last shift ended, ArbZG \xA75 requires 11h uninterrupted rest.`,
        };
      },
    },
    {
      kind: "shift_offered",
      outcome: "allowed",
      regulation: "internal",
      build: (t, e) => {
        let a = 60 + Math.floor(t() * 40),
          r = 30 + Math.floor(t() * 40);
        return {
          inputs: {
            zone_demand_forecast_pct: a,
            scheduled_capacity_pct: r,
            rider_availability_next_2h: !0,
          },
          weight: {
            zone_demand_forecast_pct: 0.6,
            scheduled_capacity_pct: 0.3,
            rider_availability_next_2h: 0.1,
          },
          reason: `Optional shift offered to Rider #${e.idx}: forecast demand ${a}% of peak, current capacity only ${r}%.`,
        };
      },
    },
    {
      kind: "incentive_fired",
      outcome: "info",
      regulation: "internal",
      build: (t, e) => {
        let a = 4 + Math.floor(t() * 6),
          r = 3 + Math.floor(t() * 3);
        return {
          inputs: {
            bonus_eur: a,
            orders_required: r,
            window_min: 90,
            zone_shortfall: !0,
          },
          weight: {
            zone_shortfall: 0.5,
            orders_required: 0.3,
            bonus_eur: 0.2,
          },
          reason: `\u20AC${a} bonus offered to Rider #${e.idx} for ${r} deliveries in the next 90 min while the zone is understaffed. No penalty if declined.`,
        };
      },
    },
    {
      kind: "dispatch_block_arbzg",
      outcome: "blocked",
      regulation: "ArbZG",
      build: (t, e) => {
        let a = 540 + Math.floor(t() * 60),
          r = t() < 0.5 ? 0 : 15,
          n = W0(t);
        return {
          orderId: n,
          inputs: {
            worked_today_min: a,
            remaining_break_min: r,
            cap_min: 600,
          },
          weight: {
            worked_today_min: 0.6,
            remaining_break_min: 0.4,
          },
          reason: `Order ${n} not offered to Rider #${e.idx}: would exceed daily ArbZG 10h cap in ${600 - a} min. Signals: worked_today=${cM(a)} (weight 0.6), remaining_break=${r} (weight 0.4).`,
        };
      },
    },
    {
      kind: "dispatch_block_minijob",
      outcome: "blocked",
      regulation: "MiLoG",
      build: (t, e) => {
        let a = 560 + Math.floor(t() * 40),
          r = 603;
        return {
          inputs: {
            earned_this_month_eur: a,
            minijob_cap_eur: r,
            rate_eur_per_h: 13.9,
          },
          weight: {
            earned_this_month_eur: 0.7,
            minijob_cap_eur: 0.2,
            rate_eur_per_h: 0.1,
          },
          reason: `Rider #${e.idx} shift blocked: mini-job earnings would exceed \u20AC${r}/month cap this pay period (\u20AC${a} booked, rate \u20AC13.90/h).`,
        };
      },
    },
    {
      kind: "priority_boost",
      outcome: "info",
      regulation: "internal",
      build: (t, e) => {
        let a = 3 + Math.floor(t() * 4);
        return {
          inputs: {
            reliability_28d_pct: 90 + Math.floor(t() * 8),
            on_time_streak_days: a,
            zone_familiarity_pct: 70 + Math.floor(t() * 25),
          },
          weight: {
            reliability_28d_pct: 0.4,
            zone_familiarity_pct: 0.4,
            on_time_streak_days: 0.2,
          },
          reason: `Rider #${e.idx} moved to the top of the dispatch queue for the next 30 min: ${a}-day on-time streak in a familiar zone. Advisory only \u2014 no effect on pay.`,
        };
      },
    },
    {
      kind: "no_show_flag",
      outcome: "info",
      regulation: "Platform Work Directive",
      build: (t, e) => {
        let a = 12 + Math.floor(t() * 18);
        return {
          inputs: {
            minutes_past_shift_start: a,
            check_in_received: !1,
            contact_attempts: 2,
          },
          weight: {
            minutes_past_shift_start: 0.6,
            check_in_received: 0.3,
            contact_attempts: 0.1,
          },
          reason: `Rider #${e.idx} flagged as possible no-show: ${a} min past shift start, no app check-in, 2 contact attempts. Flag routed to a human coordinator; no automated penalty.`,
        };
      },
    },
  ],
  sM = 40;
function B5(t, e) {
  let a = [];
  if (e.length === 0) return a;
  let r = Math.floor(t);
  for (let n = 0; n < sM; n++) {
    let i = ((r + 1) * 100003 + n * 9176) >>> 0,
      o = dM(i),
      l = Math.floor(o() * e.length),
      d = e[l],
      c = ((l + 1) * 3) % 97,
      g = S5[Math.floor(o() * S5.length)],
      p = Math.floor(o() * 220),
      u = Math.max(0, r - p),
      s = g.build(o, {
        id: d.id,
        name: d.name,
        idx: c,
      });
    a.push({
      id: `AD-${r}-${n}`,
      at: u,
      driverId: d.id,
      orderId: s.orderId,
      kind: g.kind,
      outcome: g.outcome,
      inputs: s.inputs,
      weight: s.weight,
      humanReadableReason: s.reason,
      regulation: g.regulation,
    });
  }
  return (a.sort((n, i) => i.at - n.at), a);
}
var N5 = [
    {
      name: "Dispatch matcher",
      purpose:
        "Offers orders to the rider with the shortest realistic pickup time and free capacity.",
      humanOverride: !0,
      dataUsed: [
        "Current location",
        "Active order load",
        "28-day acceptance rate",
        "Vehicle type",
        "Zone familiarity",
      ],
    },
    {
      name: "Incentive engine",
      purpose:
        "Fires zone-level bonus offers when forecast demand exceeds staffed capacity. Bonuses only, never penalties.",
      humanOverride: !0,
      dataUsed: [
        "Zone demand forecast",
        "Scheduled hours",
        "Live acceptance rate",
      ],
    },
    {
      name: "ETA predictor",
      purpose:
        "Estimates pickup and drop-off times shown to customers and used by the dispatcher.",
      humanOverride: !1,
      dataUsed: [
        "Restaurant readiness history",
        "Vehicle type",
        "Live traffic",
        "Route distance",
      ],
    },
    {
      name: "No-show scorer",
      purpose:
        "Flags riders who miss a shift check-in so a coordinator can reach out. Never blocks pay on its own.",
      humanOverride: !0,
      dataUsed: [
        "Shift start time",
        "App check-in log",
        "Contact attempts",
        "Recent absence history",
      ],
    },
    {
      name: "ArbZG guard",
      purpose:
        "Blocks dispatch when a shift would breach the 10h daily cap or the 11h rest requirement.",
      humanOverride: !0,
      dataUsed: [
        "Minutes worked today",
        "Break minutes taken",
        "Rest since last shift",
      ],
    },
    {
      name: "Mini-job watchdog",
      purpose:
        "Blocks scheduling when a mini-job rider would cross the \u20AC603/month earnings ceiling.",
      humanOverride: !0,
      dataUsed: [
        "Month-to-date earnings",
        "Hourly rate",
        "Planned shift length",
      ],
    },
  ],
  uM = {
    all: null,
    offers: ["order_offer", "order_reassignment", "shift_offered"],
    blocks: ["shift_denied", "dispatch_block_arbzg", "dispatch_block_minijob"],
    signals: ["incentive_fired", "priority_boost", "no_show_flag"],
  },
  A5 = {
    allowed: "good",
    blocked: "crit",
    info: "info",
  },
  j5 = {
    ArbZG: "warn",
    MiLoG: "warn",
    "Platform Work Directive": "info",
    DSGVO: "info",
    internal: "neutral",
  },
  _5 = {
    ArbZG:
      "Arbeitszeitgesetz \xA73 (10h cap), \xA74 (breaks), \xA75 (11h rest)",
    MiLoG:
      "Mindestlohngesetz \xA71 (\u20AC13.90/h from 2026-01-01); mini-job ceiling \u20AC603/month (SGB IV \xA78)",
    "Platform Work Directive":
      "Directive (EU) 2024/2831 Arts. 7-8 (automated monitoring, human oversight)",
    DSGVO:
      "DSGVO Art. 15 (subject access), Art. 22 (automated individual decisions)",
    internal: "Fleet operations policy \u2014 no external regulatory basis",
  },
  hM = {
    order_offer: "accent",
    order_reassignment: "info",
    shift_denied: "crit",
    shift_offered: "accent",
    incentive_fired: "info",
    dispatch_block_arbzg: "crit",
    dispatch_block_minijob: "crit",
    priority_boost: "info",
    no_show_flag: "warn",
  };
function T5() {
  return Be.replace(/-/g, "");
}
function AlgoLogPage() {
  let t = readPilotModel(),
    { now: e } = useSimClock(),
    a = Sa.useMemo(
      () =>
        t.drivers.map((_) => ({
          id: _.id,
          name: _.name,
        })),
      [t.drivers],
    ),
    r = Sa.useMemo(() => {
      let _ = new Map();
      return (t.drivers.forEach((Mt) => _.set(Mt.id, Mt.name)), _);
    }, [t.drivers]),
    n = Sa.useMemo(() => B5(e, a), [e, a]),
    [i, o] = Sa.useState("all"),
    [l, d] = Sa.useState("all"),
    [c, g] = Sa.useState("all"),
    [p, u] = Sa.useState("all"),
    [s, f] = Sa.useState(null),
    [x, M] = Sa.useState(null),
    [h, m] = Sa.useState(a[0]?.id ?? ""),
    y = Sa.useMemo(() => {
      let _ = uM[i];
      return n.filter(
        (Mt) =>
          !(
            (_ && !_.includes(Mt.kind)) ||
            (l !== "all" && Mt.outcome !== l) ||
            (c !== "all" && Mt.driverId !== c) ||
            (p !== "all" && (Mt.regulation ?? "internal") !== p)
          ),
      );
    }, [n, i, l, c, p]),
    k = n.filter((_) => _.outcome === "blocked").length,
    L = n.filter(
      (_) => _.regulation === "ArbZG" && _.outcome === "blocked",
    ).length,
    w =
      n.length === 0
        ? 0
        : n.reduce((_, Mt) => _ + Object.keys(Mt.inputs).length, 0) / n.length,
    O = [
      {
        value: "all",
        label: `All ${n.length}`,
      },
      {
        value: "offers",
        label: "Offers",
      },
      {
        value: "blocks",
        label: "Blocks",
      },
      {
        value: "signals",
        label: "Signals",
      },
    ],
    A = [
      {
        value: "all",
        label: "All",
      },
      {
        value: "allowed",
        label: "Allowed",
      },
      {
        value: "blocked",
        label: "Blocked",
      },
      {
        value: "info",
        label: "Info",
      },
    ],
    j = Sa.useMemo(
      () => [
        {
          value: "all",
          label: "All riders",
        },
        ...a.map((_) => ({
          value: _.id,
          label: _.name,
        })),
      ],
      [a],
    ),
    v = [
      {
        value: "all",
        label: "All regulations",
      },
      {
        value: "ArbZG",
        label: "ArbZG",
      },
      {
        value: "MiLoG",
        label: "MiLoG / mini-job",
      },
      {
        value: "Platform Work Directive",
        label: "Platform Work Directive",
      },
      {
        value: "DSGVO",
        label: "DSGVO",
      },
      {
        value: "internal",
        label: "Internal policy",
      },
    ],
    E = Sa.useMemo(
      () =>
        a.map((_) => ({
          value: _.id,
          label: `${_.name} (${_.id})`,
        })),
      [a],
    ),
    Q = () => {
      if (!h) return;
      let _ = n.filter((Bt) => Bt.driverId === h),
        Mt = {
          dsar_request: {
            subject_id: h,
            subject_name: r.get(h) ?? null,
            generated_at: `${Be}T${V(e)}:00Z`,
            legal_basis: [
              "DSGVO Art. 15 (right of access by the data subject)",
              "Directive (EU) 2024/2831 Art. 8 (right to explanation of automated decisions)",
            ],
            controller: "eels Fleet GmbH \u2014 Fleet Ops",
            automated_systems: N5.map((Bt) => ({
              name: Bt.name,
              purpose: Bt.purpose,
              human_override: Bt.humanOverride,
              data_used: Bt.dataUsed,
            })),
          },
          decisions: _,
        },
        Wt = new Blob([JSON.stringify(Mt, null, 2)], {
          type: "application/json",
        }),
        Tt = URL.createObjectURL(Wt),
        Pt = document.createElement("a");
      ((Pt.href = Tt),
        (Pt.download = `dsar_${h}_${T5()}.json`),
        document.body.appendChild(Pt),
        Pt.click(),
        document.body.removeChild(Pt),
        URL.revokeObjectURL(Tt));
    };
  return (
    <X.Fragment>
      <PageHeader
        eyebrow="Automated decisions"
        title="Algorithmic Transparency Log"
        description="Every automated decision, with signals, weights, and plain-language reason. Directive Arts. 6-8 + DSGVO Art. 15."
      />
      <Callout>
        {
          "Log entries are advisory records. Under Directive (EU) 2024/2831 Art. 7, no decision that materially affects working conditions is executed without a named human reviewer."
        }
      </Callout>
      <div className="grid g4">
        <Stat
          label="Decisions today"
          value={n.length}
          foot="Rolling 24h window"
        />
        <Stat
          label="Blocks today"
          value={k}
          tone={k > 0 ? "warn" : void 0}
          foot="Dispatch or shift refused"
        />
        <Stat
          label="ArbZG-triggered blocks"
          value={L}
          tone={L > 0 ? "warn" : "good"}
          foot="Working-time cap or rest gap"
        />
        <Stat
          label="Avg signals per decision"
          value={w.toFixed(1)}
          foot="Input features considered"
        />
      </div>
      <div className="grid g-2-1">
        <div className="stack">
          <Card
            title="Decision log"
            sub="Click a row to see the exact inputs, weights and regulation reference."
            actions=<div
              className="row wrap"
              style={{
                gap: 8,
              }}
            >
              <SegmentedControl
                value={i}
                onChange={o}
                options={O}
                label="Kind"
              />
              <SegmentedControl
                value={l}
                onChange={d}
                options={A}
                label="Outcome"
              />
              <Select
                id="algo-driver"
                value={c}
                onChange={g}
                options={j}
                label="Rider"
              />
              <Select
                id="algo-reg"
                value={p}
                onChange={(_) => u(_)}
                options={v}
                label="Regulation"
              />
            </div>
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
                    <th>{"Rider"}</th>
                    <th>{"Kind"}</th>
                    <th>{"Outcome"}</th>
                    <th>{"Regulation"}</th>
                    <th>{"Plain-language reason"}</th>
                  </tr>
                </thead>
                <tbody>
                  {y.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="muted small"
                        style={{
                          padding: 16,
                        }}
                      >
                        {"No decisions match the current filter."}
                      </td>
                    </tr>
                  )}
                  {y.map((_) => {
                    let Mt = _.regulation ?? "internal";
                    return (
                      <tr className="clickable" onClick={() => f(_)} key={_.id}>
                        <td className="num nowrap">{V(_.at)}</td>
                        <td className="nowrap">
                          {_.driverId ? (
                            (r.get(_.driverId) ?? _.driverId)
                          ) : (
                            <span className="muted">{"system"}</span>
                          )}
                          {_.orderId && (
                            <div className="xsmall muted mono">
                              {"order "}
                              {_.orderId}
                            </div>
                          )}
                        </td>
                        <td>
                          <Badge tone={hM[_.kind]}>{E2[_.kind]}</Badge>
                        </td>
                        <td>
                          <Badge tone={A5[_.outcome]}>{_.outcome}</Badge>
                        </td>
                        <td>
                          <Badge tone={j5[Mt]}>{Mt}</Badge>
                        </td>
                        <td
                          className="small"
                          title={_.humanReadableReason}
                          style={{
                            maxWidth: 420,
                          }}
                        >
                          <details>
                            <summary
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              {_.humanReadableReason.length > 110
                                ? `${_.humanReadableReason.slice(0, 110)}\u2026`
                                : _.humanReadableReason}
                            </summary>
                            <div
                              style={{
                                marginTop: 4,
                              }}
                            >
                              {_.humanReadableReason}
                            </div>
                          </details>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
          <Card
            title="Subject-access export (DSGVO Art. 15)"
            sub="Deliver a full JSON of every automated decision that touches one rider, plus the register of systems in scope."
          >
            <div
              className="row wrap"
              style={{
                gap: 12,
                alignItems: "flex-end",
              }}
            >
              <div
                style={{
                  minWidth: 260,
                }}
              >
                <Field id="dsar-driver" label="Export decisions for driver">
                  <select
                    id="dsar-driver"
                    className="select"
                    value={h}
                    onChange={(_) => m(_.target.value)}
                  >
                    {E.map((_) => (
                      <option value={_.value} key={_.value}>
                        {_.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Button variant="primary" onClick={Q} disabled={!h}>
                {"Download JSON"}
              </Button>
              <div
                className="xsmall muted"
                style={{
                  maxWidth: 380,
                }}
              >
                {"File name: "}
                <span className="mono">
                  {"dsar_"}
                  {h || "\u2026"}
                  {"_"}
                  {T5()}
                  {".json"}
                </span>
                {". Requests must be answered within one month (Art. 12)."}
              </div>
            </div>
          </Card>
        </div>
        <Card
          title="Automated systems in use"
          sub="Register kept under Directive Art. 6. Every system has a designated human reviewer."
        >
          <div className="stack">
            {N5.map((_) => (
              <div className="alert-item" key={_.name}>
                <div className="grow">
                  <div className="t row between">
                    <span>{_.name}</span>
                    <Badge tone={_.humanOverride ? "good" : "warn"}>
                      {_.humanOverride ? "Human override" : "Advisory only"}
                    </Badge>
                  </div>
                  <div className="d">{_.purpose}</div>
                  <div
                    className="xsmall muted"
                    style={{
                      marginTop: 4,
                    }}
                  >
                    {"Data used: "}
                    {_.dataUsed.join(" \xB7 ")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      {s && (
        <Drawer
          title={`${E2[s.kind]} \xB7 ${V(s.at)}`}
          onClose={() => f(null)}
          footer=<div
            className="row"
            style={{
              gap: 8,
            }}
          >
            <Button variant="danger" onClick={() => M(s)}>
              {"Dispute this decision"}
            </Button>
            <Button variant="ghost" onClick={() => f(null)}>
              {"Close"}
            </Button>
          </div>
        >
          <div
            className="row wrap"
            style={{
              gap: 6,
              marginBottom: 8,
            }}
          >
            <Badge tone={A5[s.outcome]}>{s.outcome}</Badge>
            <Badge tone={j5[s.regulation ?? "internal"]}>
              {s.regulation ?? "internal"}
            </Badge>
            {s.orderId && (
              <Badge tone="neutral">
                {"order "}
                {s.orderId}
              </Badge>
            )}
          </div>
          <p>{s.humanReadableReason}</p>
          <KeyValueList
            items={[
              [
                "Rider",
                s.driverId ? (r.get(s.driverId) ?? s.driverId) : "\u2014",
              ],
              ["Regulation reference", _5[s.regulation ?? "internal"]],
              ["Decision id", <span className="mono">{s.id}</span>],
            ]}
          />
          <h4
            style={{
              marginTop: 16,
              marginBottom: 8,
            }}
          >
            {"Inputs and weights"}
          </h4>
          <div className="stack">
            {Object.entries(s.inputs).map(([_, Mt]) => {
              let Wt = s.weight[_] ?? 0;
              return (
                <div
                  className="stack-sm"
                  style={{
                    gap: 4,
                  }}
                  key={_}
                >
                  <div className="row between small">
                    <span>{_}</span>
                    <span className="num">
                      {String(Mt)}{" "}
                      <span className="muted xsmall">
                        {"· weight "}
                        {Wt.toFixed(2)}
                      </span>
                    </span>
                  </div>
                  <Meter value={Wt * 100} tone={Wt >= 0.5 ? "warn" : void 0} />
                </div>
              );
            })}
          </div>
          <Callout tone="warn">
            {
              "Under Directive Art. 8 the rider may request human review of this decision within 14 days. The dispute button drafts a message to the works council."
            }
          </Callout>
        </Drawer>
      )}
      {x && (
        <Modal
          title="Draft dispute — worker council notification"
          onClose={() => M(null)}
          footer=<div
            className="row"
            style={{
              gap: 8,
            }}
          >
            <Button variant="primary" onClick={() => M(null)}>
              {"Send (simulated)"}
            </Button>
            <Button variant="ghost" onClick={() => M(null)}>
              {"Cancel"}
            </Button>
          </div>
        >
          <p className="small muted">
            {
              "This would be sent to the works council mailbox. Nothing is transmitted in this prototype."
            }
          </p>
          <pre
            className="mono small"
            style={{
              whiteSpace: "pre-wrap",
              padding: 12,
              background: "var(--panel, #f6f7f9)",
              borderRadius: 8,
            }}
          >{`To: betriebsrat@eels-fleet.de
From: ops-portal@eels-fleet.de
Subject: Anfechtung einer automatisierten Entscheidung (${x.id})

Sehr geehrter Betriebsrat,

im Namen von ${x.driverId ? (r.get(x.driverId) ?? x.driverId) : "einem Fahrer"} legen wir Widerspruch gegen die
folgende automatisierte Entscheidung ein:

  Entscheidung : ${E2[x.kind]} (${x.outcome})
  Zeitpunkt    : ${V(x.at)} am ${Be}
  Grundlage    : ${x.regulation ?? "internal"} \u2014 ${_5[x.regulation ?? "internal"]}
  Begr\xFCndung   : ${x.humanReadableReason}

Wir bitten um Pr\xFCfung nach Art. 8 der Richtlinie (EU) 2024/2831 und um
R\xFCckmeldung innerhalb von 14 Tagen.

Mit freundlichen Gr\xFC\xDFen,
Fleet Operations`}</pre>
        </Modal>
      )}
    </X.Fragment>
  );
}
export { AlgoLogPage };
