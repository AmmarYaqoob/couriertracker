// Rider list.
import * as ip from "react";
import * as Zt from "react/jsx-runtime";
import { Link, navigate } from "../services/portalState.jsx";
import {
  Badge,
  SegmentedControl,
  Card,
  Stat,
  PageHeader,
} from "../components/ui.jsx";
import { ve } from "./CapacityPage.jsx";
const RIDERS_API = "http://127.0.0.1:4000/api/riders";

function RidersPage() {
  let [a, r] = ip.useState(""),
    [n, i] = ip.useState("all"),
    [rows, setRows] = ip.useState([]),
    [summary, setSummary] = ip.useState(null),
    [tableState, setTableState] = ip.useState("loading"),
    o = rows.filter((c) => {
      let zone = c.zone?.name ?? "";
      return (
        (n === "all" || c.employmentType === n) &&
        `${c.name} ${c.id} ${zone}`.toLowerCase().includes(a.toLowerCase())
      );
    });
  ip.useEffect(() => {
    let cancelled = false;
    fetch(RIDERS_API)
      .then((response) => response.json())
      .then((body) => {
        if (cancelled) return;
        if (!body?.isSuccess || !Array.isArray(body.data?.riders) || !body.data.summary) {
          setTableState("error");
          return;
        }
        setRows(body.data.riders);
        setSummary(body.data.summary);
        setTableState("ready");
      })
      .catch(() => {
        if (!cancelled) setTableState("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <Zt.Fragment>
      <PageHeader
        eyebrow="Workforce"
        title="Riders"
        description="Every EELS pilot rider with contract, zone, vehicle, today's shift and compliance status. Workforce availability is coordinated with Alnaif Lieferdienst."
      />
      <div className="grid g4">
        <Stat label="Riders in the pilot" value={summary ? summary.ridersInPilot : "—"} />
        <Stat
          label="Full-time / part-time"
          value={summary ? summary.fullTimePartTimeLabel : "—"}
        />
        <Stat
          label="Mini / midi / student"
          value={summary ? summary.miniMidiStudentLabel : "—"}
        />
        <Stat
          label="Compliance below 70"
          value={summary ? summary.complianceBelow70 : "—"}
          tone="warn"
        />
      </div>
      <Card
        title={
          tableState === "ready"
            ? `${o.length} riders`
            : tableState === "error"
              ? "Riders"
              : "Loading riders"
        }
        actions=<Zt.Fragment>
          <input
            id="rider-search"
            className="input"
            placeholder="Search name, id or zone"
            aria-label="Search riders"
            value={a}
            onChange={(c) => r(c.target.value)}
          />
          <SegmentedControl
            value={n}
            onChange={i}
            options={[
              {
                value: "all",
                label: "All",
              },
              {
                value: "Full-time",
                label: "Full-time",
              },
              {
                value: "Part-time",
                label: "Part-time",
              },
              {
                value: "Mini-job",
                label: "Mini-job",
              },
              {
                value: "Midi-job",
                label: "Midi-job",
              },
              {
                value: "Working Student",
                label: "Student",
              },
            ]}
          />
        </Zt.Fragment>
        flush={!0}
      >
        <div
          className="table-wrap table-scroll"
          style={{
            maxHeight: 640,
          }}
        >
          <table className="table">
            <thead>
              <tr>
                <th>{"Name"}</th>
                <th>{"Employment"}</th>
                <th>{"Zone"}</th>
                <th>{"Platform"}</th>
                <th>{"Vehicle"}</th>
                <th className="num">{"Shift today"}</th>
                <th>{"Status now"}</th>
                <th className="num">{"Compliance"}</th>
              </tr>
            </thead>
            <tbody>
              {tableState === "loading" ? (
                <tr>
                  <td colSpan={8}>{"Loading riders…"}</td>
                </tr>
              ) : tableState === "error" ? (
                <tr>
                  <td colSpan={8}>{"Could not load riders."}</td>
                </tr>
              ) : (
                o.map((c) => (
                  <tr
                    className="clickable"
                    onClick={() => navigate(`/riders/${c.id}`)}
                    key={c.id}
                  >
                    <td>
                      <Link to={`/riders/${c.id}`} className="bold">
                        {c.name}
                      </Link>
                      <div className="xsmall muted">
                        {c.id}
                        {" · joined "}
                        {c.joined}
                      </div>
                    </td>
                    <td className="small">
                      {c.employmentType}
                      <div className="xsmall muted">{c.contractType}</div>
                    </td>
                    <td>{c.zone.name}</td>
                    <td>
                      <span className="row small">
                        <i
                          className="swatch"
                          style={{
                            background: ve[c.platform.id],
                          }}
                        />
                        {c.platform.name}
                      </span>
                    </td>
                    <td className="small">{c.vehicle.typeLabel}</td>
                    <td className="num">{c.shift.label}</td>
                    <td className="small">{c.status.label}</td>
                    <td className="num">
                      <Badge tone={c.compliance.tone}>{c.compliance.score}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </Zt.Fragment>
  );
}
export { RidersPage };
