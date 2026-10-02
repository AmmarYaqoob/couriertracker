// Payroll checklist.
import * as Y3 from "react";
import * as $t from "react/jsx-runtime";
import { Link } from "../services/portalState.jsx";
import { Badge, Card, Stat, PageHeader } from "../components/ui.jsx";

const PAYROLL_API = "http://127.0.0.1:4000/api/payroll";

function PayrollPage() {
  let [page, setPage] = Y3.useState(null),
    [checks, setChecks] = Y3.useState({}),
    [tableState, setTableState] = Y3.useState("loading"),
    summary = page?.summary ?? null,
    checklist = page?.checklist ?? [],
    done = Object.values(checks).filter(Boolean).length;
  Y3.useEffect(() => {
    let cancelled = false;
    fetch(PAYROLL_API)
      .then((response) => response.json())
      .then((body) => {
        if (cancelled) return;
        if (
          !body?.isSuccess ||
          !body.data?.summary ||
          !Array.isArray(body.data.checklist) ||
          !Array.isArray(body.data.exceptions) ||
          !Array.isArray(body.data.riders)
        ) {
          setTableState("error");
          return;
        }
        setPage(body.data);
        setChecks(
          Object.fromEntries(body.data.checklist.map((item, index) => [index, item.done])),
        );
        setTableState("ready");
      })
      .catch(() => {
        if (!cancelled) setTableState("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return $t.jsxs($t.Fragment, {
    children: [
      <PageHeader
        eyebrow={page?.period?.eyebrow ?? "September 2026, month to date"}
        title="Payroll"
        description={
          page?.period?.description ??
          "Hours, gross pay and exceptions that must be cleared before the month closes."
        }
      />,
      <div className="grid g4">
        <Stat
          label="Approved hours to date"
          value={summary ? summary.approvedHoursLabel : "—"}
        />
        <Stat label="Gross pay to date" value={summary ? summary.grossPayLabel : "—"} />
        <Stat
          label="Blocked riders"
          value={summary ? summary.blockedRiders : "—"}
          tone={summary?.blockedTone}
          foot={summary?.blockedFoot ?? "Payroll cannot run for them"}
        />
        <Stat
          label="Month-close checklist"
          value={summary ? `${done}/${checklist.length}` : "—"}
        />
      </div>,
      <div className="grid g2">
        <Card title="Month-close checklist">
          <div className="stack-sm">
            {tableState === "loading" ? (
              <p className="small muted">{"Loading payroll…"}</p>
            ) : tableState === "error" ? (
              <p className="small muted">{"Could not load payroll."}</p>
            ) : (
              checklist.map((item, index) => (
                <label className="check" key={item.label}>
                  <input
                    type="checkbox"
                    id={`close-${index}`}
                    checked={!!checks[index]}
                    onChange={(event) =>
                      setChecks({
                        ...checks,
                        [index]: event.target.checked,
                      })
                    }
                  />
                  {item.label}
                </label>
              ))
            )}
          </div>
        </Card>
        <Card title="Exceptions" flush={!0}>
          <table className="table">
            <tbody>
              {(page?.exceptions ?? []).map((item) => (
                <tr key={item.type}>
                  <td>{item.type}</td>
                  <td className="num">
                    <Badge tone={item.tone}>{item.count}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>,
      <Card title="Riders" flush={!0}>
        <div
          className="table-wrap table-scroll"
          style={{
            maxHeight: 560,
          }}
        >
          <table className="table">
            <thead>
              <tr>
                <th>{"Rider"}</th>
                <th>{"Employment"}</th>
                <th className="num">{"Rate"}</th>
                <th className="num">{"Hours"}</th>
                <th className="num">{"Gross"}</th>
                <th>{"Status"}</th>
                <th>{"Note"}</th>
              </tr>
            </thead>
            <tbody>
              {tableState === "loading" ? (
                <tr>
                  <td colSpan={7}>{"Loading payroll…"}</td>
                </tr>
              ) : tableState === "error" ? (
                <tr>
                  <td colSpan={7}>{"Could not load payroll."}</td>
                </tr>
              ) : (
                page.riders.map((rider) => (
                  <tr key={rider.id}>
                    <td>
                      <Link to={`/riders/${rider.id}`}>{rider.name}</Link>
                    </td>
                    <td className="small">{rider.employmentType}</td>
                    <td className="num">{rider.hourlyRateLabel}</td>
                    <td className="num">{rider.hours}</td>
                    <td className="num">{rider.grossLabel}</td>
                    <td>
                      <Badge tone={rider.statusTone}>{rider.status}</Badge>
                    </td>
                    <td className="small">{rider.note}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>,
    ],
  });
}
export { PayrollPage };
