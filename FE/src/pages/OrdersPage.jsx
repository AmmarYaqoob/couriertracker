// Order dispatch.
import * as K0 from "react";
import * as Rt from "react/jsx-runtime";
import { me, mt, Link } from "../services/portalState.jsx";
import {
  Badge,
  SegmentedControl,
  Card,
  Stat,
  PageHeader,
  wn,
  Callout,
} from "../components/ui.jsx";
import { ve } from "./CapacityPage.jsx";

const ORDERS_API = "http://127.0.0.1:4000/api/orders";

function queueClock(asOf) {
  return typeof asOf === "string" && asOf.length >= 16 ? asOf.slice(11, 16) : "\u2014";
}

function OrderOutlook({ outlook }) {
  if (!outlook) return null;
  if (outlook.kind === "margin") {
    return Rt.jsx(wn, { band: outlook.tone, label: outlook.label });
  }
  if (outlook.kind === "late" || outlook.kind === "on_time") {
    return <Badge tone={outlook.tone}>{outlook.label}</Badge>;
  }
  if (outlook.kind === "cancelled") {
    return <span className="small muted">{outlook.label}</span>;
  }
  return null;
}

function OrdersPage() {
  let [status, setStatus] = K0.useState("active"),
    [platform, setPlatform] = K0.useState("all"),
    [rows, setRows] = K0.useState([]),
    [summary, setSummary] = K0.useState(null),
    [asOf, setAsOf] = K0.useState(null),
    [tableState, setTableState] = K0.useState("loading"),
    visible = rows.slice(0, 150);
  K0.useEffect(() => {
    let cancelled = false;
    setTableState("loading");
    let params = new URLSearchParams({ status, platform });
    fetch(`${ORDERS_API}?${params}`)
      .then((response) => response.json())
      .then((body) => {
        if (cancelled) return;
        if (!body?.isSuccess || !Array.isArray(body.data?.orders) || !body.data.summary) {
          setTableState("error");
          return;
        }
        setRows(body.data.orders);
        setSummary(body.data.summary);
        setAsOf(body.data.asOf ?? null);
        setTableState("ready");
      })
      .catch(() => {
        if (!cancelled) setTableState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [status, platform]);
  return (
    <Rt.Fragment>
      <PageHeader
        eyebrow={`Live queue \xB7 ${queueClock(asOf)}`}
        title="Order Dispatch"
        description="Orders from the partner platforms with stage, deadline and predicted outcome. Assignment itself stays with each platform."
      />
      <div className="grid g4">
        <Stat
          label="Orders in the last hour"
          value={summary ? summary.ordersInLastHour : "\u2014"}
        />
        <Stat
          label="Active now"
          value={summary ? summary.activeNow : "\u2014"}
          foot={
            summary
              ? `${summary.waitingForDriver} waiting for a driver`
              : undefined
          }
        />
        <Stat
          label="Delivered today"
          value={summary ? summary.deliveredToday : "\u2014"}
        />
        <Stat
          label="Cancelled today"
          value={summary ? summary.cancelledToday : "\u2014"}
          tone={summary?.cancelledToday ? "warn" : void 0}
        />
      </div>
      <Callout>
        {
          "In this prototype orders come from the simulated pilot day; with partner agreements they arrive through the API Hub (webhooks or report imports)."
        }
      </Callout>
      <Card
        title="Orders"
        actions=<Rt.Fragment>
          <SegmentedControl
            value={status}
            onChange={setStatus}
            options={[
              {
                value: "active",
                label: "Active",
              },
              {
                value: "done",
                label: "Delivered",
              },
              {
                value: "cancelled",
                label: "Cancelled",
              },
            ]}
          />
          <SegmentedControl
            value={platform}
            onChange={setPlatform}
            options={[
              {
                value: "all",
                label: "All",
              },
              ...me.map((p) => ({
                value: p,
                label: mt[p],
              })),
            ]}
          />
        </Rt.Fragment>
        flush={!0}
      >
        <div
          className="table-wrap table-scroll"
          style={{
            maxHeight: 620,
          }}
        >
          <table className="table">
            <thead>
              <tr>
                <th>{"Order"}</th>
                <th>{"Restaurant"}</th>
                <th>{"Route"}</th>
                <th className="num">{"Distance"}</th>
                <th className="num">{"Received"}</th>
                <th className="num">{"Deadline"}</th>
                <th>{"Rider"}</th>
                <th>{"Status"}</th>
                <th>{"Outlook"}</th>
              </tr>
            </thead>
            <tbody>
              {tableState === "loading" ? (
                <tr>
                  <td colSpan={9}>{"Loading orders\u2026"}</td>
                </tr>
              ) : tableState === "error" ? (
                <tr>
                  <td colSpan={9}>{"Could not load orders."}</td>
                </tr>
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan={9} className="empty">
                    {"No orders in this view."}
                  </td>
                </tr>
              ) : (
                visible.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="row">
                        <i
                          className="swatch"
                          style={{
                            background: ve[order.platform.id],
                          }}
                          title={order.platform.name}
                        />
                        <Link to={`/delays?order=${order.id}`} className="mono">
                          {order.id}
                        </Link>
                      </span>
                    </td>
                    <td className="small">{order.restaurant}</td>
                    <td className="small">{order.route}</td>
                    <td className="num">{order.distanceLabel}</td>
                    <td className="num">{order.received}</td>
                    <td className="num">{order.deadline}</td>
                    <td className="small">{order.rider ?? "\u2014"}</td>
                    <td>
                      <Badge tone={order.status.tone}>{order.status.label}</Badge>
                    </td>
                    <td>
                      <OrderOutlook outlook={order.outlook} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </Rt.Fragment>
  );
}
export { OrdersPage };
