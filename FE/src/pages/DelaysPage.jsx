// Delays and restaurant waits.
import { useEffect, useState } from "react";
import { Fragment, jsxs } from "react/jsx-runtime";
import { Ca, Mn, opsStore, useHashLocation, useToast } from "../services/portalState.jsx";
import { Badge, Button, Callout, Card, KeyValueList, PageHeader, Toast } from "../components/ui.jsx";
import { D2, ve } from "./CapacityPage.jsx";

const DELAYS_API = "http://127.0.0.1:4000/api/delays";

function DelaysPage() {
  const { query } = useHashLocation();
  const [toast, setToast] = useToast();
  const [screen, setScreen] = useState(null);
  const [tableState, setTableState] = useState("loading");
  const [selected, setSelected] = useState(query.get("order"));

  useEffect(() => {
    let cancelled = false;
    fetch(DELAYS_API, { cache: "no-store" })
      .then((response) => response.json())
      .then((body) => {
        if (cancelled) return;
        if (
          !body?.isSuccess ||
          !Array.isArray(body.data?.deliveries) ||
          !Array.isArray(body.data?.restaurants) ||
          !Array.isArray(body.data?.causes)
        ) {
          setTableState("error");
          return;
        }
        setScreen(body.data);
        setTableState("ready");
      })
      .catch(() => {
        if (!cancelled) setTableState("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const deliveries = screen?.deliveries ?? [];
  const restaurants = screen?.restaurants ?? [];
  const causes = screen?.causes ?? [];
  const lateCount = screen?.lateCount ?? 0;
  const selectedId = selected ?? deliveries[0]?.orderId ?? null;
  const delivery = deliveries.find((row) => row.orderId === selectedId) ?? null;
  const origin = delivery ? delivery.createdAt : 0;
  const span = delivery
    ? Math.max(delivery.deadlineOriginal, delivery.actual.delivered ?? 0, delivery.planned.delivered) + 2 - origin
    : 1;
  const position = (minute) => `${((minute - origin) / span) * 100}%`;

  async function escalate(restaurant) {
    const response = await fetch(
      `${DELAYS_API}/restaurants/${encodeURIComponent(restaurant.restaurantId)}/escalate`,
      { method: "POST" },
    );
    const body = await response.json();
    if (!body?.isSuccess || !body.data?.restaurant) {
      setToast(body?.message || "Could not escalate restaurant");
      return;
    }
    const saved = body.data.restaurant;
    setScreen((current) =>
      current
        ? {
            ...current,
            restaurants: current.restaurants.map((row) =>
              row.restaurantId === saved.restaurantId ? saved : row,
            ),
          }
        : current,
    );
    opsStore.set((state) => ({
      restaurantEscalations: {
        ...state.restaurantEscalations,
        [restaurant.restaurantId]: saved.escalatedAt,
      },
      actions: [
        ...state.actions,
        {
          id: Mn("A"),
          title: `Platform escalation: repeated waits at ${restaurant.name}`,
          owner: `${Ca[1].name} (EELS)`,
          due: "2026-09-17",
          status: "open",
          source: "Restaurant wait report",
          createdAt: saved.escalatedAt,
        },
      ],
    }));
    setToast(`${restaurant.name} escalated; action created`);
  }

  return jsxs(Fragment, {
    children: [
      <PageHeader
        eyebrow="Delivery timeline"
        title="Delays & Restaurants"
        description="A driver may reach the restaurant on time and still deliver late. Outcome and cause are recorded separately, so restaurant and capacity problems are not blamed on drivers."
      />,
      <div className="grid g-1-2">
        <Card
          title="Largest delay causes today"
          sub={
            tableState === "ready"
              ? `${lateCount} late deliveries so far, by primary cause`
              : tableState === "error"
                ? "Could not load delay causes"
                : "Loading delay causes"
          }
        >
          {tableState === "loading" ? (
            <p className="muted">{"Loading delay causes…"}</p>
          ) : tableState === "error" ? (
            <p className="muted">{"Could not load delay causes."}</p>
          ) : causes.length === 0 ? (
            <p className="muted">{"No late deliveries yet."}</p>
          ) : (
            <D2
              items={causes.map((cause) => ({
                label: (
                  <span className="row">
                    {cause.label}{" "}
                    {cause.driverControllable ? <Badge tone="outline">{"driver-controllable"}</Badge> : null}
                  </span>
                ),
                value: cause.count,
                note: `${Math.round(cause.share * 100)}% · ${Math.round(cause.minutesLost)} min late in total`,
                color: cause.driverControllable ? "var(--s-wolt)" : "var(--seq-3)",
              }))}
            />
          )}
          <div style={{ marginTop: 12 }}>
            <Callout>
              {"The end-of-day report lists the three largest causes with the affected zones and peaks."}
            </Callout>
          </div>
        </Card>
        <Card
          title={delivery ? `Timeline of ${delivery.orderId}` : "Timeline"}
          sub={
            delivery
              ? `${delivery.platformName} · ${delivery.zoneName} → ${delivery.dropoffZoneName} · ${delivery.restaurantName} · ${delivery.statusLabel}`
              : "Select an order"
          }
          actions=<select
            className="select"
            id="late-order"
            aria-label="Order"
            value={selectedId ?? ""}
            onChange={(event) => setSelected(event.target.value)}
          >
            {deliveries.slice(0, 60).map((row) => (
              <option value={row.orderId} key={row.orderId}>
                {row.orderId}
                {" · "}
                {Math.round(row.lateBy)}
                {" min late"}
              </option>
            ))}
            {selectedId && !deliveries.some((row) => row.orderId === selectedId) && (
              <option value={selectedId}>{selectedId}</option>
            )}
          </select>
        >
          {tableState === "loading" ? (
            <p className="muted">{"Loading timeline…"}</p>
          ) : tableState === "error" ? (
            <p className="muted">{"Could not load the timeline."}</p>
          ) : delivery ? (
            <div className="stack">
              <div className="timeline">
                {delivery.stages.map((stage) => (
                  <div className="tl-row" key={stage.key}>
                    <span className="bold">{stage.label}</span>
                    <div className="tl-track" aria-hidden={true}>
                      <div
                        className="tl-bar"
                        style={{
                          left: position(stage.planned),
                          width: 3,
                          background: "var(--text-2)",
                        }}
                        title={`Planned ${stage.plannedLabel}`}
                      />
                      {stage.actual !== null && (
                        <div
                          className="tl-bar"
                          style={{
                            left: `calc(${position(stage.actual)} - 5px)`,
                            width: 10,
                            borderRadius: 5,
                            background: stage.delta !== null && stage.delta > 1 ? "var(--crit)" : "var(--good)",
                          }}
                          title={`Actual ${stage.actualLabel}`}
                        />
                      )}
                      <div
                        className="tl-bar"
                        style={{
                          left: position(delivery.deadlineOriginal),
                          width: 2,
                          top: 0,
                          height: 22,
                          background: "var(--warn)",
                        }}
                        title={`Deadline ${delivery.deadlineOriginalLabel}`}
                      />
                    </div>
                    <span className="small num">
                      {stage.plannedLabel}
                      {" → "}
                      {stage.actualLabel ?? "—"}{" "}
                      {stage.deltaLabel && (
                        <span style={{ color: stage.delta > 0 ? "var(--crit-ink)" : "var(--good-ink)" }}>
                          {"("}
                          {stage.deltaLabel}
                          {")"}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <div className="legend">
                <span>
                  <i className="swatch" style={{ background: "var(--text-2)", width: 3 }} />
                  {" Planned"}
                </span>
                <span>
                  <i className="swatch" style={{ background: "var(--good)", borderRadius: 5 }} />
                  {" Actual on plan"}
                </span>
                <span>
                  <i className="swatch" style={{ background: "var(--crit)", borderRadius: 5 }} />
                  {" Actual behind plan"}
                </span>
                <span>
                  <i className="swatch" style={{ background: "var(--warn)", width: 2 }} />
                  {" Deadline "}
                  {delivery.deadlineOriginalLabel}
                </span>
              </div>
              <div className="grid g2">
                <KeyValueList
                  items={[
                    [
                      "Outcome",
                      <Badge tone="crit">
                        {Math.round(delivery.lateBy)}
                        {" min late"}
                      </Badge>,
                    ],
                    ["Primary cause", delivery.primaryCauseLabel],
                    ["Driver", delivery.driverLabel ?? "—"],
                    [
                      "Deadline shown",
                      delivery.deadlineChanged
                        ? `${delivery.deadlineUpdatedLabel} (updated)`
                        : delivery.deadlineOriginalLabel,
                    ],
                  ]}
                />
                <div className="stack-sm">
                  {delivery.legs.map((leg) => (
                    <div className="row between small" key={leg.key}>
                      <span>{leg.label}</span>
                      <span className="num">
                        {leg.actual.toFixed(1)}
                        {" min "}
                        <span
                          className={leg.overrun > 1 ? "" : "muted"}
                          style={{ color: leg.overrun > 1 ? "var(--crit-ink)" : undefined }}
                        >
                          {"("}
                          {leg.overrunLabel}
                          {")"}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {delivery.primaryCause === "restaurant" && (
                <Callout tone="warn">
                  {
                    "The records suggest restaurant waiting. Verify before assigning responsibility: a restaurant-caused late delivery still counts as late under the internal measure."
                  }
                </Callout>
              )}
            </div>
          ) : (
            <p className="muted">{"This order has not been created yet at the current simulated time."}</p>
          )}
        </Card>
      </div>,
      <Card
        title="Restaurant waiting"
        sub="Arrival-to-pickup minutes today. Restaurants above 12 minutes at the 90th percentile on 3 days go on the platform escalation list."
        flush={true}
      >
        <div className="table-wrap table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>{"Restaurant"}</th>
                <th>{"Zone"}</th>
                <th className="num">{"Pickups"}</th>
                <th className="num">{"Median"}</th>
                <th className="num">{"P90"}</th>
                <th className="num">{"Late caused"}</th>
                <th className="num">{"Days over"}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tableState === "loading" ? (
                <tr>
                  <td colSpan={8}>{"Loading restaurants…"}</td>
                </tr>
              ) : tableState === "error" ? (
                <tr>
                  <td colSpan={8}>{"Could not load restaurants."}</td>
                </tr>
              ) : (
                restaurants.map((restaurant) => (
                  <tr key={restaurant.restaurantId}>
                    <td className="bold">{restaurant.name}</td>
                    <td>{restaurant.zoneName}</td>
                    <td className="num">{restaurant.pickups}</td>
                    <td className="num">
                      {restaurant.medianWait === null ? "—" : `${restaurant.medianWait.toFixed(1)} min`}
                    </td>
                    <td className="num">
                      {restaurant.p90Wait === null ? "—" : `${restaurant.p90Wait.toFixed(1)} min`}
                    </td>
                    <td className="num">{restaurant.lateCaused}</td>
                    <td className="num">
                      {restaurant.daysOverThreshold > 0 ? (
                        <Badge tone={restaurant.daysOverThreshold >= 3 ? "crit" : "warn"}>
                          {restaurant.daysOverThreshold}
                          {" of 3"}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="right">
                      {restaurant.escalatedAt !== null ? (
                        <Badge tone="info">
                          {"Escalated "}
                          {restaurant.escalatedAtLabel}
                        </Badge>
                      ) : restaurant.escalate ? (
                        <Button size="sm" variant="danger" onClick={() => escalate(restaurant)}>
                          {"Escalate to platform"}
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>,
      <Card title="Recent late deliveries" sub="Select a row to trace its timeline" flush={true}>
        <div className="table-wrap table-scroll" style={{ maxHeight: 320 }}>
          <table className="table">
            <thead>
              <tr>
                <th>{"Order"}</th>
                <th>{"Zone"}</th>
                <th>{"Restaurant"}</th>
                <th className="num">{"Late by"}</th>
                <th>{"Primary cause"}</th>
              </tr>
            </thead>
            <tbody>
              {tableState === "loading" ? (
                <tr>
                  <td colSpan={5}>{"Loading late deliveries…"}</td>
                </tr>
              ) : tableState === "error" ? (
                <tr>
                  <td colSpan={5}>{"Could not load late deliveries."}</td>
                </tr>
              ) : (
                deliveries.slice(0, 50).map((row) => (
                  <tr
                    className={`clickable ${row.orderId === selectedId ? "sel" : ""}`}
                    onClick={() => setSelected(row.orderId)}
                    key={row.orderId}
                  >
                    <td>
                      <span className="row">
                        <i className="swatch" style={{ background: ve[row.platform] }} />
                        <span className="mono">{row.orderId}</span>
                      </span>
                    </td>
                    <td>{row.zoneName}</td>
                    <td>{row.restaurantName}</td>
                    <td className="num">
                      {Math.round(row.lateBy)}
                      {" min"}
                    </td>
                    <td>{row.primaryCauseLabel}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>,
      <Toast message={toast} />,
    ],
  });
}

export { DelaysPage };
