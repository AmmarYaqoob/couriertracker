// Incidents page.
import * as $2 from "react";
import * as bt from "react/jsx-runtime";
import { useSimClock, useToast } from "../services/portalState.jsx";
import {
  Badge,
  SegmentedControl,
  Card,
  Stat,
  Modal,
  Field,
  Toast,
  PageHeader,
  Button,
} from "../components/ui.jsx";
import { Fr } from "../components/icons.jsx";

const INCIDENTS_API = "http://127.0.0.1:4000/api/incidents";
const RIDERS_API = "http://127.0.0.1:4000/api/riders";

const FALLBACK_TYPES = [
  "Vehicle or equipment failure",
  "Accident (rider safe)",
  "Order damaged",
  "Wrong or missing items",
  "Customer not available",
  "Restaurant problem",
  "App or connectivity problem",
  "Safety concern",
];

function IncidentsPage() {
  let { now } = useSimClock(),
    [toast, setToast] = useToast(),
    [logOpen, setLogOpen] = $2.useState(false),
    [view, setView] = $2.useState("open"),
    [rows, setRows] = $2.useState([]),
    [summary, setSummary] = $2.useState(null),
    [types, setTypes] = $2.useState(FALLBACK_TYPES),
    [riders, setRiders] = $2.useState([]),
    [tableState, setTableState] = $2.useState("loading");

  function applyIncidents(body) {
    if (!body?.isSuccess || !Array.isArray(body.data?.incidents) || !body.data.summary) {
      setTableState("error");
      return false;
    }
    setRows(body.data.incidents);
    setSummary(body.data.summary);
    if (Array.isArray(body.data.types) && body.data.types.length) {
      setTypes(body.data.types.map((type) => type.value ?? type.label ?? type));
    }
    setTableState("ready");
    return true;
  }

  function loadIncidents() {
    return fetch(INCIDENTS_API, { cache: "no-store" })
      .then((response) => response.json())
      .then(applyIncidents);
  }

  $2.useEffect(() => {
    let cancelled = false;
    fetch(INCIDENTS_API, { cache: "no-store" })
      .then((response) => response.json())
      .then((body) => {
        if (!cancelled) applyIncidents(body);
      })
      .catch(() => {
        if (!cancelled) setTableState("error");
      });
    fetch(RIDERS_API, { cache: "no-store" })
      .then((response) => response.json())
      .then((body) => {
        if (!cancelled && body?.isSuccess && Array.isArray(body.data?.riders)) {
          setRiders(body.data.riders);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  let visible = rows.filter((incident) => view === "all" || incident.status === "open");

  async function resolveIncident(incident) {
    const response = await fetch(`${INCIDENTS_API}/${encodeURIComponent(incident.id)}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "resolved" }),
    });
    const body = await response.json();
    if (!body?.isSuccess) throw new Error(body?.message || "Could not resolve incident");
    await loadIncidents();
    setToast(`${incident.id} resolved`);
  }

  async function logIncident(payload) {
    const response = await fetch(INCIDENTS_API, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await response.json();
    if (!body?.isSuccess) throw new Error(body?.message || "Could not log incident");
    await loadIncidents();
    setLogOpen(false);
    setToast("Incident logged");
  }

  return bt.jsxs(bt.Fragment, {
    children: [
      <PageHeader
        eyebrow="Incidents"
        title="Incidents"
        description="Breakdowns, accidents, failed deliveries and escalations in one place, each with a cause and an outcome."
        actions=<Button variant="primary" onClick={() => setLogOpen(true)}>
          <Fr size={14} />
          {" Log incident"}
        </Button>
      />,
      <div className="grid g3">
        <Stat
          label="Open incidents"
          value={summary ? summary.open : "\u2014"}
          tone="warn"
        />
        <Stat
          label="High severity today"
          value={summary ? summary.highSeverity : "\u2014"}
          tone="crit"
        />
        <Stat
          label="Resolved today"
          value={summary ? summary.resolved : "\u2014"}
          tone="good"
        />
      </div>,
      <Card
        title="Incident log"
        actions=<SegmentedControl
          value={view}
          onChange={setView}
          options={[
            {
              value: "open",
              label: "Open",
            },
            {
              value: "all",
              label: "All",
            },
          ]}
        />
        flush={!0}
      >
        <div className="table-wrap table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>{"Case"}</th>
                <th>{"Type"}</th>
                <th>{"Severity"}</th>
                <th>{"Rider"}</th>
                <th>{"Description"}</th>
                <th className="num">{"Reported"}</th>
                <th>{"Status"}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tableState === "loading" ? (
                <tr>
                  <td colSpan={8}>{"Loading incidents\u2026"}</td>
                </tr>
              ) : tableState === "error" ? (
                <tr>
                  <td colSpan={8}>{"Could not load incidents."}</td>
                </tr>
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty">
                    {view === "open" ? "No open incidents." : "No incidents."}
                  </td>
                </tr>
              ) : (
                visible.map((incident) => (
                  <tr key={incident.id}>
                    <td className="mono small">
                      {incident.id}
                      {incident.orderId && <div className="xsmall muted">{incident.where}</div>}
                    </td>
                    <td>{incident.type}</td>
                    <td>
                      <Badge
                        tone={
                          incident.severity === "High"
                            ? "crit"
                            : incident.severity === "Medium"
                              ? "warn"
                              : "neutral"
                        }
                      >
                        {incident.severity}
                      </Badge>
                    </td>
                    <td className="small">{incident.rider}</td>
                    <td className="small">{incident.description}</td>
                    <td className="num">{incident.reported}</td>
                    <td>
                      <Badge tone={incident.status === "open" ? "warn" : "good"}>
                        {incident.status}
                      </Badge>
                    </td>
                    <td className="right">
                      {incident.status === "open" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            resolveIncident(incident).catch(() => setToast("Could not resolve incident"));
                          }}
                        >
                          {"Resolve"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>,
      logOpen && (
        <LogIncidentModal
          now={now}
          types={types}
          riders={riders}
          onClose={() => setLogOpen(false)}
          onSaved={logIncident}
        />
      ),
      <Toast message={toast} />,
    ],
  });
}

function LogIncidentModal({ now, types, riders, onClose, onSaved }) {
  let [form, setForm] = $2.useState({
      type: types[0] ?? "Vehicle or equipment failure",
      severity: "Medium",
      riderId: "",
      orderId: "",
      description: "",
    }),
    [saving, setSaving] = $2.useState(false);
  return (
    <Modal
      title="Log incident"
      onClose={onClose}
      footer={bt.jsxs(bt.Fragment, {
        children: [
          <Button onClick={onClose}>{"Cancel"}</Button>,
          <Button
            variant="primary"
            disabled={!form.description.trim() || saving}
            onClick={() => {
              const rider = riders.find((item) => item.id === form.riderId);
              setSaving(true);
              onSaved({
                type: form.type,
                severity: form.severity,
                riderId: form.riderId || null,
                riderName: rider?.name ?? null,
                orderId: form.orderId.trim() || null,
                description: form.description.trim(),
                reportedMin: now,
              }).catch(() => setSaving(false));
            }}
          >
            {"Save"}
          </Button>,
        ],
      })}
    >
      <div
        className="grid g2"
        style={{
          gap: 10,
        }}
      >
        <Field id="inc-type" label="Type">
          <select
            id="inc-type"
            className="select"
            value={form.type}
            onChange={(event) =>
              setForm({
                ...form,
                type: event.target.value,
              })
            }
          >
            {types.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </Field>
        <Field id="inc-sev" label="Severity">
          <select
            id="inc-sev"
            className="select"
            value={form.severity}
            onChange={(event) =>
              setForm({
                ...form,
                severity: event.target.value,
              })
            }
          >
            <option>{"Low"}</option>
            <option>{"Medium"}</option>
            <option>{"High"}</option>
          </select>
        </Field>
        <Field id="inc-driver" label="Rider">
          <select
            id="inc-driver"
            className="select"
            value={form.riderId}
            onChange={(event) =>
              setForm({
                ...form,
                riderId: event.target.value,
              })
            }
          >
            <option value="">{"\u2014"}</option>
            {riders.map((rider) => (
              <option value={rider.id} key={rider.id}>
                {rider.name}
              </option>
            ))}
          </select>
        </Field>
        <Field id="inc-order" label="Order id (optional)">
          <input
            id="inc-order"
            className="input"
            value={form.orderId}
            onChange={(event) =>
              setForm({
                ...form,
                orderId: event.target.value,
              })
            }
          />
        </Field>
      </div>
      <Field id="inc-desc" label="What happened and what was done">
        <textarea
          id="inc-desc"
          className="textarea"
          style={{
            fontFamily: "var(--font-ui)",
          }}
          value={form.description}
          onChange={(event) =>
            setForm({
              ...form,
              description: event.target.value,
            })
          }
        />
      </Field>
    </Modal>
  );
}
export { IncidentsPage };
