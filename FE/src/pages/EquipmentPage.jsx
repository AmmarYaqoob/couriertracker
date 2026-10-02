// Fleet equipment page.
import * as U2 from "react";
import * as ut from "react/jsx-runtime";
import { useToast } from "../services/portalState.jsx";
import {
  Badge,
  SegmentedControl,
  Card,
  Stat,
  Meter,
  Modal,
  Field,
  Toast,
  PageHeader,
  Button,
} from "../components/ui.jsx";
import { qv } from "../components/icons.jsx";

const EQUIPMENT_API = "http://127.0.0.1:4000/api/equipment";

function needsAttention(vehicle) {
  return (
    vehicle.defects.length > 0 ||
    vehicle.serviceInDays <= 7 ||
    vehicle.status !== "in_service" ||
    (vehicle.batteryHealthPct ?? 100) < 75
  );
}

function statusTone(status) {
  if (status === "in_service") return "good";
  if (status === "reserve") return "info";
  if (status === "defect") return "crit";
  return "warn";
}

function EquipmentPage() {
  let [toast, setToast] = useToast(),
    [selected, setSelected] = U2.useState(null),
    [view, setView] = U2.useState("attention"),
    [vehicles, setVehicles] = U2.useState([]),
    [stock, setStock] = U2.useState([]),
    [summary, setSummary] = U2.useState(null),
    [tableState, setTableState] = U2.useState("loading");

  function applyFleet(body) {
    if (
      !body?.isSuccess ||
      !Array.isArray(body.data?.vehicles) ||
      !Array.isArray(body.data?.stock) ||
      !body.data.summary
    ) {
      setTableState("error");
      return false;
    }
    setVehicles(body.data.vehicles);
    setStock(body.data.stock);
    setSummary(body.data.summary);
    setTableState("ready");
    return true;
  }

  U2.useEffect(() => {
    let cancelled = false;
    fetch(EQUIPMENT_API, { cache: "no-store" })
      .then((response) => response.json())
      .then((body) => {
        if (!cancelled) applyFleet(body);
      })
      .catch(() => {
        if (!cancelled) setTableState("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  let visible = vehicles
    .filter((vehicle) => view === "all" || needsAttention(vehicle))
    .sort((left, right) => left.serviceInDays - right.serviceInDays);

  return ut.jsxs(ut.Fragment, {
    children: [
      <PageHeader
        eyebrow="Fleet readiness"
        title="Fleet & Equipment"
        description="Vehicles matched to routes and distances, maintenance before breakdowns, and a replacement pool ready so equipment problems cause less downtime."
      />,
      <div className="grid g4">
        <Stat
          label="Vehicles in service"
          value={summary ? summary.vehiclesInService : "—"}
          foot={summary?.typeBreakdownLabel}
        />
        <Stat
          label="Reserve vehicles ready"
          value={summary ? summary.reserveReady : "—"}
          tone={summary ? (summary.reserveReady < 3 ? "warn" : "good") : undefined}
          foot={summary?.reserveFoot}
        />
        <Stat
          label="Service due within 7 days"
          value={summary ? summary.serviceDueWithin7Days : "—"}
          tone={summary && summary.serviceDueWithin7Days > 5 ? "warn" : undefined}
          foot="Schedule outside peaks"
        />
        <Stat
          label="Vehicles with open defects"
          value={summary ? summary.vehiclesWithOpenDefects : "—"}
          tone={summary ? (summary.vehiclesWithOpenDefects ? "crit" : "good") : undefined}
          foot={summary?.downtimeFoot}
        />
      </div>,
      <Card
        title="Vehicle register"
        sub="Service forecast from km and days since the last service"
        actions=<SegmentedControl
          value={view}
          onChange={setView}
          options={[
            { value: "attention", label: "Needs attention" },
            { value: "all", label: tableState === "ready" ? `All ${vehicles.length}` : "All" },
          ]}
        />
        flush={!0}
      >
        <div className="table-wrap table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>{"Vehicle"}</th>
                <th>{"Status"}</th>
                <th>{"Assigned to"}</th>
                <th style={{ minWidth: 140 }}>{"Service interval used"}</th>
                <th className="num">{"Service in"}</th>
                <th className="num">{"Battery"}</th>
                <th>{"Defects"}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tableState === "loading" ? (
                <tr>
                  <td colSpan={8}>{"Loading fleet…"}</td>
                </tr>
              ) : tableState === "error" ? (
                <tr>
                  <td colSpan={8}>{"Could not load fleet."}</td>
                </tr>
              ) : (
                visible.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>
                      <div className="bold">{vehicle.label}</div>
                      <div className="xsmall muted">{vehicle.typeLabel}</div>
                    </td>
                    <td>
                      <Badge tone={statusTone(vehicle.status)}>{vehicle.statusLabel}</Badge>
                    </td>
                    <td>{vehicle.assignedTo}</td>
                    <td>
                      <Meter
                        value={vehicle.serviceUsedPct}
                        tone={
                          vehicle.serviceUsedPct >= 100
                            ? "crit"
                            : vehicle.serviceUsedPct >= 85
                              ? "warn"
                              : undefined
                        }
                      />
                      <div className="xsmall muted">
                        {vehicle.kmSinceService}
                        {" / "}
                        {vehicle.serviceIntervalKm}
                        {" km · "}
                        {vehicle.daysSinceService}
                        {" / "}
                        {vehicle.serviceIntervalDays}
                        {" days"}
                      </div>
                    </td>
                    <td className="num">
                      {vehicle.overdue ? (
                        <Badge tone="crit">{"Overdue"}</Badge>
                      ) : (
                        `${Math.round(vehicle.serviceInDays)} days`
                      )}
                    </td>
                    <td className="num">
                      {vehicle.batteryHealthPct === null ? (
                        "\u2014"
                      ) : (
                        <Badge tone={vehicle.batteryHealthPct < 75 ? "warn" : "neutral"}>
                          {vehicle.batteryHealthPct}
                          {"%"}
                        </Badge>
                      )}
                    </td>
                    <td className="small">
                      {vehicle.defects.length ? (
                        vehicle.defects.join("; ")
                      ) : (
                        <span className="muted">{"None"}</span>
                      )}
                    </td>
                    <td className="right">
                      <Button size="sm" onClick={() => setSelected(vehicle)}>
                        {ut.jsx(qv, { size: 13 })}
                        {" Report"}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>,
      <Card title="Delivery equipment stock" sub="Bags, safety and weather gear, phone support" flush={!0}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{"Item"}</th>
                <th className="num">{"In use"}</th>
                <th className="num">{"Spare"}</th>
                <th className="num">{"Reorder at"}</th>
                <th>{"Status"}</th>
              </tr>
            </thead>
            <tbody>
              {tableState === "loading" ? (
                <tr>
                  <td colSpan={5}>{"Loading equipment…"}</td>
                </tr>
              ) : tableState === "error" ? (
                <tr>
                  <td colSpan={5}>{"Could not load equipment."}</td>
                </tr>
              ) : (
                stock.map((item) => (
                  <tr key={item.item}>
                    <td>{item.item}</td>
                    <td className="num">{item.inUse}</td>
                    <td className="num">{item.spare}</td>
                    <td className="num">{item.reorderAt}</td>
                    <td>
                      {item.status === "Reorder" ? (
                        <Badge tone="warn">{"Reorder"}</Badge>
                      ) : (
                        <Badge tone="good">{"OK"}</Badge>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>,
      selected && (
        <DefectModal
          vehicle={selected}
          onClose={() => setSelected(null)}
          onSave={async (description) => {
            const response = await fetch(`${EQUIPMENT_API}/${encodeURIComponent(selected.id)}/defects`, {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ description }),
            });
            const body = await response.json();
            if (!body?.isSuccess) throw new Error(body?.message || "Could not record defect");
            const refreshed = await fetch(EQUIPMENT_API, { cache: "no-store" }).then((next) => next.json());
            applyFleet(refreshed);
            setToast(`Defect recorded for ${selected.label}`);
            setSelected(null);
          }}
        />
      ),
      <Toast message={toast} />,
    ],
  });
}

function DefectModal({ vehicle, onClose, onSave }) {
  let [text, setText] = U2.useState(""),
    [saving, setSaving] = U2.useState(false);
  return (
    <Modal
      title={`Report defect: ${vehicle.label}`}
      onClose={onClose}
      footer={ut.jsxs(ut.Fragment, {
        children: [
          <Button onClick={onClose}>{"Cancel"}</Button>,
          <Button
            variant="primary"
            disabled={!text.trim() || saving}
            onClick={() => {
              setSaving(true);
              onSave(text.trim()).catch(() => setSaving(false));
            }}
          >
            {"Save defect"}
          </Button>,
        ],
      })}
    >
      <Field
        id="defect"
        label="What is wrong?"
        hint="The driver stays unavailable until the vehicle is repaired or replaced from the reserve pool."
      >
        <input
          id="defect"
          className="input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="e.g. Brake lever loose"
        />
      </Field>
    </Modal>
  );
}

export { EquipmentPage };
