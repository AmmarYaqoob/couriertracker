// Fair performance page and fleet page (one bundle module).
import * as Al from "react";
import * as P from "react/jsx-runtime";
import * as Qt from "react/jsx-runtime";
import {
  opsStore,
  Et,
  useOpsStore,
  V,
  b2,
  useSimClock,
  jt,
  mt,
  useToast,
  ra,
  rt,
  Link,
  to,
  vl,
  readPilotModel,
} from "../services/portalState.jsx";
import {
  Badge,
  SegmentedControl,
  Card,
  KeyValueList,
  Stat,
  Field,
  Toast,
  PageHeader,
  Drawer,
  Callout,
  Button,
} from "../components/ui.jsx";
import { ve } from "./CapacityPage.jsx";
var I2 = {
  insufficient_data: {
    label: "Not enough data",
    tone: "neutral",
  },
  no_action: {
    label: "Normal range",
    tone: "good",
  },
  coaching_conversation: {
    label: "Review, then coach",
    tone: "warn",
  },
  recognise: {
    label: "Recognise",
    tone: "info",
  },
};
function PerformancePage() {
  let t = readPilotModel(),
    e = jt(),
    a = useOpsStore(),
    { now: r } = useSimClock(),
    [n, i] = useToast(),
    [o, l] = Al.useState(null),
    [d, c] = Al.useState("all"),
    g = Al.useMemo(() => {
      let h = t.drivers.map((y) => to(t.driverHistory[y.id])),
        m = vl(h.filter((y) => y.sufficient).map((y) => y.adjustedPct ?? 0));
      return t.drivers.map((y) => ({
        d: y,
        a: to(t.driverHistory[y.id], m),
      }));
    }, [t]),
    p = vl(g.filter((h) => h.a.sufficient).map((h) => h.a.adjustedPct ?? 0)),
    u = g.flatMap((h) =>
      h.a.flags.map((m) => ({
        ...m,
        driver: h.d,
      })),
    ),
    s = [
      ...e.cancelled.map((h) => ({
        orderId: h.id,
        at: h.cancellation.at,
        stage: h.cancellation.stage,
        party: h.cancellation.initiatedBy,
        reason: h.cancellation.reason,
        ref: h.cancellation.supportRef ?? "",
        zone: rt(h.zoneId),
        platform: mt[h.platform],
        manual: !1,
      })),
      ...a.cancellations.map((h) => ({
        orderId: h.orderId,
        at: h.at,
        stage: h.stage,
        party: h.initiatedBy,
        reason: h.reason,
        ref: h.supportRef,
        zone: "\u2014",
        platform: "\u2014",
        manual: !0,
      })),
    ].sort((h, m) => m.at - h.at),
    f = s.filter((h) => d === "all" || h.party === d),
    x = (h) => s.filter((m) => m.party === h).length,
    M = [...g].sort((h, m) => {
      let y = {
        coaching_conversation: 0,
        recognise: 1,
        no_action: 2,
        insufficient_data: 3,
      };
      return (
        y[h.a.outcome] - y[m.a.outcome] ||
        (h.a.adjustedPct ?? 0) - (m.a.adjustedPct ?? 0)
      );
    });
  return (
    <P.Fragment>
      <PageHeader
        eyebrow="Fair performance management"
        title="Fair Performance"
        description="Drivers are assessed on what they control, across comparable zones and enough deliveries. Restaurant and platform delays are kept out of individual scores."
      />
      <Callout tone="warn">
        {
          "Guardrails: no incentives to speed, report completion early or cancel difficult orders. Scores support coaching only; any decision about a driver needs a named human reviewer, in line with the EU Platform Work Directive's human-oversight rules."
        }
      </Callout>
      <div className="grid g4">
        <Stat
          label="Drivers assessed (28 days)"
          value={g.filter((h) => h.a.sufficient).length}
          foot={`${g.filter((h) => !h.a.sufficient).length} below ${b2} deliveries`}
        />
        <Stat
          label="Peer median, adjusted"
          value={Et(p)}
          foot="Deliveries without a driver-controllable delay"
        />
        <Stat
          label="Coaching reviews suggested"
          value={
            g.filter((h) => h.a.outcome === "coaching_conversation").length
          }
          tone="warn"
          foot="Human review first"
        />
        <Stat
          label="Records flagged for review"
          value={
            u.filter((h) => !a.flagReviews[`${h.driver.id}:${h.orderId}`])
              .length
          }
          foot={`${u.length} flags in total`}
        />
      </div>
      <Card
        title="Driver assessment"
        sub="Raw PTOD vs adjusted score with a 95% range. Click a driver for the explanation."
        flush={!0}
      >
        <div className="table-wrap table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>{"Driver"}</th>
                <th>{"Zone"}</th>
                <th className="num">{"Deliveries"}</th>
                <th className="num">{"Raw PTOD"}</th>
                <th className="num">{"Adjusted (95% range)"}</th>
                <th
                  className="num"
                  title="Late deliveries in legs the driver controls"
                >
                  {"Own delays"}
                </th>
                <th
                  className="num"
                  title="Restaurant, capacity and other delays, not counted"
                >
                  {"Excluded"}
                </th>
                <th className="num">{"Attend."}</th>
                <th>{"Outcome"}</th>
              </tr>
            </thead>
            <tbody>
              {M.map(({ d: h, a: m }) => (
                <tr
                  className="clickable"
                  onClick={() =>
                    l({
                      d: h,
                      a: m,
                    })
                  }
                  key={h.id}
                >
                  <td className="nowrap">
                    <div className="bold">{h.name}</div>
                    <div className="xsmall muted">
                      {h.id}
                      {" · "}
                      {h.vehicleType.replace("_", "-")}
                    </div>
                  </td>
                  <td className="nowrap">
                    {rt(h.homeZoneId)}
                    <div className="xsmall muted">
                      {"difficulty ×"}
                      {m.zoneDifficulty.toFixed(2)}
                    </div>
                  </td>
                  <td className="num">{m.deliveries}</td>
                  <td className="num">{Et(m.rawPct)}</td>
                  <td className="num nowrap">
                    {Et(m.adjustedPct)}{" "}
                    <span className="xsmall muted">
                      {"("}
                      {m.adjustedLow?.toFixed(0)}
                      {"–"}
                      {m.adjustedHigh?.toFixed(0)}
                      {")"}
                    </span>
                  </td>
                  <td className="num">{m.controllableLate}</td>
                  <td className="num muted">{m.excludedLate}</td>
                  <td className="num">{Et(m.attendancePct, 0)}</td>
                  <td className="nowrap">
                    <Badge tone={I2[m.outcome].tone}>
                      {I2[m.outcome].label}
                    </Badge>{" "}
                    {m.flags.length > 0 && (
                      <Badge tone="warn">
                        {m.flags.length} {m.flags.length > 1 ? "flags" : "flag"}
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="grid g-2-1">
        <Card
          title="Cancellation log"
          sub="Stage, initiating party, reason and support reference for every cancellation. PTOD always needs the cancellation view beside it."
          actions=<SegmentedControl
            value={d}
            onChange={c}
            options={[
              {
                value: "all",
                label: `All ${s.length}`,
              },
              {
                value: "customer",
                label: `Customer ${x("customer")}`,
              },
              {
                value: "restaurant",
                label: `Restaurant ${x("restaurant")}`,
              },
              {
                value: "driver",
                label: `Driver ${x("driver")}`,
              },
              {
                value: "platform",
                label: `Platform ${x("platform")}`,
              },
            ]}
          />
          flush={!0}
        >
          <div
            className="table-wrap table-scroll"
            style={{
              maxHeight: 360,
            }}
          >
            <table className="table">
              <thead>
                <tr>
                  <th>{"Order"}</th>
                  <th className="num">{"Time"}</th>
                  <th>{"Stage"}</th>
                  <th>{"Initiated by"}</th>
                  <th>{"Reason"}</th>
                  <th>{"Support ref"}</th>
                </tr>
              </thead>
              <tbody>
                {f.map((h, m) => (
                  <tr key={`${h.orderId}-${m}`}>
                    <td>
                      <span className="mono">{h.orderId}</span>
                      <div className="xsmall muted">
                        {h.platform}
                        {" · "}
                        {h.zone}
                      </div>
                    </td>
                    <td className="num">{V(h.at)}</td>
                    <td className="small">{h.stage.replace("_", " ")}</td>
                    <td>
                      <Badge tone={h.party === "driver" ? "warn" : "neutral"}>
                        {h.party}
                      </Badge>
                    </td>
                    <td className="small">{h.reason}</td>
                    <td className="mono small">
                      {h.ref || <span className="muted">{"missing"}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <div className="stack">
          <KM now={r} onSaved={() => i("Cancellation recorded")} />
          <Card
            title="Records for human review"
            sub="Flags never change a score on their own"
          >
            <div className="stack-sm">
              {u.length === 0 && (
                <p className="muted small">{"No flagged records."}</p>
              )}
              {u.map((h) => {
                let m = `${h.driver.id}:${h.orderId}`,
                  y = a.flagReviews[m];
                return (
                  <div className="alert-item" key={m}>
                    <div className="grow">
                      <div className="t">
                        {h.driver.name}
                        {" · "}
                        <span className="mono">{h.orderId}</span>
                      </div>
                      <div className="d">{h.detail}</div>
                      {y ? (
                        <Badge tone={y === "confirmed" ? "warn" : "good"}>
                          {y === "confirmed"
                            ? "Conversation planned"
                            : "Dismissed after review"}
                        </Badge>
                      ) : (
                        <div
                          className="row"
                          style={{
                            marginTop: 6,
                          }}
                        >
                          <Button
                            size="sm"
                            onClick={() =>
                              opsStore.set((k) => ({
                                flagReviews: {
                                  ...k.flagReviews,
                                  [m]: "confirmed",
                                },
                              }))
                            }
                          >
                            {"Confirm, plan a conversation"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              opsStore.set((k) => ({
                                flagReviews: {
                                  ...k.flagReviews,
                                  [m]: "dismissed",
                                },
                              }))
                            }
                          >
                            {"Dismiss (explained)"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
      {o && (
        <Drawer title={o.d.name} onClose={() => l(null)}>
          <Badge tone={I2[o.a.outcome].tone}>{I2[o.a.outcome].label}</Badge>
          <p>{o.a.explanation}</p>
          <KeyValueList
            items={[
              ["Deliveries (28 days)", o.a.deliveries],
              ["Raw PTOD", Et(o.a.rawPct)],
              [
                "Adjusted score",
                `${Et(o.a.adjustedPct)} (95% range ${o.a.adjustedLow?.toFixed(1)}\u2013${o.a.adjustedHigh?.toFixed(1)}%)`,
              ],
              ["Peer median", Et(p)],
              ["Driver-controllable late", o.a.controllableLate],
              ["Restaurant or other late (excluded)", o.a.excludedLate],
              ["Driver cancellations", Et(o.a.cancellationPct)],
              ["Attendance", Et(o.a.attendancePct)],
              ["Wrong or missing orders", Et(o.a.wrongOrMissingPct)],
              [
                "Zone difficulty",
                `\xD7${o.a.zoneDifficulty.toFixed(2)} (${rt(o.d.homeZoneId)})`,
              ],
            ]}
          />
          <Callout>
            {
              "Before any conversation: check the routes, restaurants and vehicle involved, and whether equipment or platform issues explain the pattern. Reward safe, correct deliveries, not speed."
            }
          </Callout>
        </Drawer>
      )}
      <Toast message={n} />
    </P.Fragment>
  );
}
function KM({ now: t, onSaved: e }) {
  let [a, r] = Al.useState({
      orderId: "",
      stage: "at_pickup",
      initiatedBy: "restaurant",
      reason: "",
      supportRef: "",
    }),
    n = a.orderId.trim() && a.reason.trim();
  return (
    <Card
      title="Record a cancellation"
      sub="For cancellations reported by phone or chat"
    >
      <div
        className="grid g2"
        style={{
          gap: 8,
        }}
      >
        <Field id="cx-order" label="Order id">
          <input
            id="cx-order"
            className="input"
            value={a.orderId}
            onChange={(i) =>
              r({
                ...a,
                orderId: i.target.value,
              })
            }
            placeholder="FRA-0412"
          />
        </Field>
        <Field id="cx-stage" label="Stage">
          <select
            id="cx-stage"
            className="select"
            value={a.stage}
            onChange={(i) =>
              r({
                ...a,
                stage: i.target.value,
              })
            }
          >
            <option value="before_pickup">{"Before pickup"}</option>
            <option value="at_pickup">{"At pickup"}</option>
            <option value="after_pickup">{"After pickup"}</option>
            <option value="at_dropoff">{"At drop-off"}</option>
          </select>
        </Field>
        <Field id="cx-party" label="Initiated by">
          <select
            id="cx-party"
            className="select"
            value={a.initiatedBy}
            onChange={(i) =>
              r({
                ...a,
                initiatedBy: i.target.value,
              })
            }
          >
            <option value="customer">{"Customer"}</option>
            <option value="restaurant">{"Restaurant"}</option>
            <option value="driver">{"Driver"}</option>
            <option value="platform">{"Platform"}</option>
          </select>
        </Field>
        <Field id="cx-ref" label="Support reference">
          <input
            id="cx-ref"
            className="input"
            value={a.supportRef}
            onChange={(i) =>
              r({
                ...a,
                supportRef: i.target.value,
              })
            }
            placeholder="SUP-…"
          />
        </Field>
      </div>
      <div
        style={{
          marginTop: 8,
        }}
      >
        <Field id="cx-reason" label="Reason">
          <input
            id="cx-reason"
            className="input"
            value={a.reason}
            onChange={(i) =>
              r({
                ...a,
                reason: i.target.value,
              })
            }
            placeholder="e.g. Item unavailable"
          />
        </Field>
      </div>
      <div
        style={{
          marginTop: 10,
        }}
      >
        <Button
          variant="primary"
          disabled={!n}
          onClick={() => {
            (opsStore.set((i) => ({
              cancellations: [
                ...i.cancellations,
                {
                  orderId: a.orderId.trim(),
                  stage: a.stage,
                  initiatedBy: a.initiatedBy,
                  reason: a.reason.trim(),
                  supportRef: a.supportRef.trim(),
                  at: t,
                },
              ],
            })),
              r({
                ...a,
                orderId: "",
                reason: "",
                supportRef: "",
              }),
              e());
          }}
        >
          {"Save"}
        </Button>
      </div>
    </Card>
  );
}
var YM = {
  free: {
    label: "Available",
    tone: "good",
  },
  on_delivery: {
    label: "Delivering",
    tone: "info",
  },
  on_break: {
    label: "Break",
    tone: "neutral",
  },
  blocked: {
    label: "Blocked",
    tone: "crit",
  },
  no_show: {
    label: "No-show",
    tone: "crit",
  },
  not_started: {
    label: "Starts soon",
    tone: "neutral",
  },
  off_shift: {
    label: "Off shift",
    tone: "neutral",
  },
};
function FleetPage() {
  let t = jt(),
    e = readPilotModel(),
    a = t.driverStates.filter((i) => i.activity !== "off_shift"),
    r = e.vehicles.filter(
      (i) => i.status === "in_service" || i.status === "reserve",
    ).length,
    n = e.vehicles.filter(
      (i) =>
        i.openDefects.length ||
        i.status === "defect" ||
        i.status === "maintenance",
    );
  return (
    <Qt.Fragment>
      <PageHeader
        eyebrow="EELS GmbH · Frankfurt"
        title="Fleet Owner Dashboard"
        description="Your riders, vehicles and live deliveries today."
      />
      <div className="grid g4">
        <Stat
          label="Riders working"
          value={
            a.filter((i) =>
              ["free", "on_delivery", "on_break"].includes(i.activity),
            ).length
          }
          foot={`${a.length} rostered for the rest of the day`}
        />
        <Stat
          label="Active deliveries"
          value={t.active.length}
          foot={`${t.bands.red} predicted late`}
          tone={t.bands.red ? "warn" : void 0}
        />
        <Stat
          label="Vehicles ready"
          value={`${r}/${e.vehicles.length}`}
          foot={`${n.length} with open issues`}
        />
        <Stat
          label="Completed today"
          value={t.completed.length}
          foot={`${t.cancelled.length} cancelled`}
        />
      </div>
      <div className="grid g-2-1">
        <Card title={`Riders at ${V(t.now)}`} flush={!0}>
          <div className="table-wrap table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>{"Rider"}</th>
                  <th>{"Platform"}</th>
                  <th>{"Zone now"}</th>
                  <th>{"Vehicle"}</th>
                  <th>{"Status"}</th>
                </tr>
              </thead>
              <tbody>
                {a.map((i) => {
                  let o = e.drivers.find((d) => d.id === i.driverId),
                    l = YM[i.activity];
                  return (
                    <tr key={o.id}>
                      <td>
                        <Link to={`/riders/${o.id}`}>{o.name}</Link>
                      </td>
                      <td>
                        <span className="row small">
                          <i
                            className="swatch"
                            style={{
                              background: ve[o.platform],
                            }}
                          />
                          {mt[o.platform]}
                        </span>
                      </td>
                      <td>{rt(i.zoneId)}</td>
                      <td className="small">{ra[o.vehicleType]}</td>
                      <td>
                        <Badge tone={l.tone}>{l.label}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
        <Card
          title="Vehicles needing attention"
          actions=<Link to="/equipment">{"Fleet & Equipment"}</Link>
        >
          <div className="stack-sm">
            {n.map((i) => (
              <div className="alert-item" key={i.id}>
                <div className="grow">
                  <div className="t">{i.label}</div>
                  <div className="d">
                    {i.openDefects.join("; ") || i.status}
                  </div>
                </div>
                <Badge tone={i.status === "defect" ? "crit" : "warn"}>
                  {i.status.replace("_", " ")}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Qt.Fragment>
  );
}
export { FleetPage, PerformancePage };
