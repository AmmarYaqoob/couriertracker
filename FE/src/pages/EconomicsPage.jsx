// Economics page and documents page (one bundle module).
import * as wr from "react";
import * as _t from "react/jsx-runtime";
import * as it from "react/jsx-runtime";
import {
  opsStore,
  Et,
  useOpsStore,
  Ji,
  ie,
  jt,
  me,
  mt,
  useToast,
  ra,
  rt,
  x0,
  readPilotModel,
} from "../services/portalState.jsx";
import {
  Badge,
  SegmentedControl,
  Card,
  Stat,
  Field,
  Toast,
  PageHeader,
  Callout,
  Button,
} from "../components/ui.jsx";
import { An, D2, ve } from "./CapacityPage.jsx";
const DOCUMENTS_API = "http://127.0.0.1:4000/api/documents";
function DocumentsPage() {
  let [toast, setToast] = useToast(),
    [kind, setKind] = wr.useState("all"),
    [band, setBand] = wr.useState("all"),
    [search, setSearch] = wr.useState(""),
    [page, setPage] = wr.useState(null),
    [tableState, setTableState] = wr.useState("loading");
  wr.useEffect(() => {
    let cancelled = false;
    fetch(DOCUMENTS_API)
      .then((response) => response.json())
      .then((body) => {
        if (cancelled) return;
        if (
          !body?.isSuccess ||
          !body.data?.summary ||
          !Array.isArray(body.data.kinds) ||
          !Array.isArray(body.data.documents)
        ) {
          setTableState("error");
          return;
        }
        setPage(body.data);
        setTableState("ready");
      })
      .catch(() => {
        if (!cancelled) setTableState("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);
  let summary = page?.summary ?? null,
    kinds = page?.kinds ?? [],
    documents = page?.documents ?? [],
    query = search.trim().toLowerCase(),
    visible = documents.filter(
      (row) =>
        (kind === "all" || row.kind === kind) &&
        (band === "all" || row.band === band) &&
        (!query || `${row.riderName} ${row.riderId}`.toLowerCase().includes(query)),
    ),
    kindOptions = [
      {
        value: "all",
        label: "All kinds",
      },
      ...kinds.map((item) => ({
        value: item.value,
        label: item.label,
      })),
    ],
    bandOptions = [
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
        value: "good",
        label: "Healthy",
      },
    ];
  return _t.jsxs(_t.Fragment, {
    children: [
      <PageHeader
        eyebrow="Compliance"
        title="Document Expiry Cockpit"
        description="One screen for Aufenthaltstitel, Fuehrerscheinkontrolle, UVV, BG Verkehr registration, insurance, A1. Colour-graded by days-to-expiry. Compliance owns this; ops sees it too."
      />,
      <Callout tone="warn">
        {
          "Every renewal takes time: Aufenthaltstitel appointments run 6-10 weeks out at the Frankfurt ABH. Start when a row turns amber, not red."
        }
      </Callout>,
      <div className="grid g4">
        <Stat label="Expired" value={summary ? summary.expired : "—"} tone="crit" />
        <Stat
          label="Due within 14 days"
          value={summary ? summary.dueWithin14Days : "—"}
          tone="crit"
          foot="Includes expired"
        />
        <Stat
          label="Due within 60 days"
          value={summary ? summary.dueWithin60Days : "—"}
          tone="warn"
          foot="Includes above"
        />
        <Stat
          label="Total tracked"
          value={summary ? summary.total : "—"}
          foot={summary ? `across ${summary.riders} riders` : "across riders"}
        />
      </div>,
      <Card
        title="Documents"
        sub={
          tableState === "ready"
            ? `Showing ${visible.length} of ${documents.length}`
            : tableState === "error"
              ? "Could not load documents"
              : "Loading documents"
        }
        actions={_t.jsxs(_t.Fragment, {
          children: [
            <SegmentedControl
              value={kind}
              options={kindOptions}
              onChange={setKind}
              label="Document kind"
            />,
            <SegmentedControl
              value={band}
              options={bandOptions}
              onChange={setBand}
              label="Urgency"
            />,
            <input
              type="search"
              className="input"
              placeholder="Search rider..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search rider name"
            />,
          ],
        })}
        flush={!0}
      >
        <div className="table-wrap table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>{"Rider"}</th>
                <th>{"Document"}</th>
                <th>{"Reference"}</th>
                <th>{"Issued"}</th>
                <th>{"Expires"}</th>
                <th>{"Days left"}</th>
                <th>{"Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {tableState === "loading" ? (
                <tr>
                  <td colSpan={7} className="small muted" style={{ textAlign: "center", padding: 24 }}>
                    {"Loading documents…"}
                  </td>
                </tr>
              ) : tableState === "error" ? (
                <tr>
                  <td colSpan={7} className="small muted" style={{ textAlign: "center", padding: 24 }}>
                    {"Could not load documents."}
                  </td>
                </tr>
              ) : (
                visible.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <div className="bold">{row.riderName}</div>
                      <div className="xsmall muted">{row.riderId}</div>
                    </td>
                    <td>
                      <div className="bold">{row.kindLabel}</div>
                      <div className="xsmall muted">{row.kindName}</div>
                    </td>
                    <td className="small num">{row.reference}</td>
                    <td className="small">{row.issuedOn}</td>
                    <td className="small">{row.expiresOn}</td>
                    <td>
                      <Badge
                        tone={row.band === "crit" ? "crit" : row.band === "warn" ? "warn" : "good"}
                        title={row.daysLeft < 0 ? "Already expired" : "Days until expiry"}
                      >
                        {row.daysLeftLabel}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setToast(
                            `Renewal requested for ${row.riderName} - ${row.kindLabel} (${row.reference})`,
                          )
                        }
                      >
                        {"Request renewal"}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
              {tableState === "ready" && visible.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="small muted"
                    style={{
                      textAlign: "center",
                      padding: 24,
                    }}
                  >
                    {"No documents match the current filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>,
      <Card
        title="Legal hints"
        sub="One line per document kind - what the law actually says"
      >
        <div className="stack">
          {tableState === "loading" ? (
            <p className="small muted">{"Loading documents…"}</p>
          ) : tableState === "error" ? (
            <p className="small muted">{"Could not load documents."}</p>
          ) : (
            kinds.map((item) => (
              <div className="alert-item" key={item.value}>
                <div className="grow">
                  <div className="t row between">
                    <span>{item.name}</span>
                    <Badge tone="info">{item.label}</Badge>
                  </div>
                  <div className="d">{item.legal}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>,
      <Callout>
        {
          "Sub-fleets today track this on paper - the Platform Work Directive and MiLoG section 17 make it auditable."
        }
      </Callout>,
      <Toast message={toast} />,
    ],
  });
}
var FM = ["bike", "e_bike", "scooter", "car"];
function EconomicsPage() {
  let t = jt(),
    e = useOpsStore(),
    a = readPilotModel(),
    r = e.assumptions,
    n = t.economics,
    i = (s) =>
      opsStore.set({
        assumptions: {
          ...r,
          ...s,
        },
      }),
    o = t.completed.length / Math.max(1, n.paidHours),
    l = me.reduce((s, f) => s + r.revenuePerDelivery[f], 0) / me.length,
    d = n.total.totalCost / Math.max(1, n.paidHours),
    c = d / l,
    g = Object.keys(n.byShift),
    p = [
      {
        label: "Driver pay incl. employer costs",
        value: n.total.driver,
      },
      {
        label: "Vehicles",
        value: n.total.vehicle,
      },
      {
        label: "Maintenance",
        value: n.total.maintenance,
      },
      {
        label: "Energy and fuel",
        value: n.total.energy,
      },
      {
        label: "Equipment",
        value: n.total.equipment,
      },
      {
        label: "Direct support",
        value: n.total.support,
      },
    ],
    u = (s, f, x, M, h = 0.1) => (
      <Field id={s} label={f}>
        <input
          id={s}
          className="input"
          type="number"
          min={0}
          step={h}
          value={x}
          onChange={(m) => M(Number(m.target.value))}
        />
      </Field>
    );
  return it.jsxs(it.Fragment, {
    children: [
      <PageHeader
        eyebrow="Commercial discipline"
        title="Unit Economics"
        description="Revenue less direct operating costs by platform, zone and shift: paid driver time, vehicles, maintenance, energy, equipment and directly attributable support."
        actions=<Button
          onClick={() =>
            opsStore.set({
              assumptions: Ji,
            })
          }
        >
          {"Reset assumptions"}
        </Button>
      />,
      <Callout tone="warn">
        {
          "Pay rates, cost figures and pilot zones are still to be discussed with EELS. Every revenue and cost value below is a placeholder; edit them once agreed and every number on this page updates."
        }
      </Callout>,
      <div className="grid g4">
        <Stat
          label="Revenue so far"
          value={ie(n.total.revenue)}
          foot={`${t.completed.length} completed deliveries`}
        />
        <Stat
          label="Direct costs so far"
          value={ie(n.total.totalCost)}
          foot={`${n.paidHours.toFixed(0)} paid hours \xB7 ${ie(d, 2)} per hour`}
        />
        <Stat
          label="Contribution"
          value={ie(n.total.contribution)}
          tone={n.total.contribution >= 0 ? "good" : "crit"}
          foot={`Margin ${Et(n.total.marginPct)}`}
        />
        <Stat
          label="Deliveries per paid hour"
          value={o.toFixed(2)}
          tone={o >= c ? "good" : "warn"}
          foot={`Break-even \u2248 ${c.toFixed(2)} at these assumptions`}
        />
      </div>,
      <div className="grid g2">
        <Card
          title="Contribution by shift"
          sub="Revenue less direct costs for shifts started so far"
        >
          <An
            categories={g}
            series={[
              {
                id: "c",
                label: "Contribution (\u20AC)",
                color: "var(--seq-3)",
                values: g.map((s) => n.byShift[s].contribution),
              },
            ]}
            diverging={!0}
            format={(s) => ie(s)}
          />
          <div
            className="legend"
            style={{
              marginTop: 6,
            }}
          >
            {g.map((s) => (
              <span key={s}>
                {s}
                {": "}
                {ie(n.byShift[s].revenue)}
                {" revenue, "}
                {Et(n.byShift[s].marginPct, 0)}
                {" margin"}
              </span>
            ))}
          </div>
        </Card>
        <Card title="Where the cost goes">
          <D2
            items={p.map((s) => ({
              label: s.label,
              value: s.value,
              note: Et((s.value / Math.max(1, n.total.totalCost)) * 100, 0),
            }))}
            format={(s) => ie(s)}
          />
        </Card>
      </div>,
      <div className="grid g2">
        <Card title="By platform" flush={!0}>
          <table className="table">
            <thead>
              <tr>
                <th>{"Platform"}</th>
                <th className="num">{"Revenue"}</th>
                <th className="num">{"Direct cost"}</th>
                <th className="num">{"Contribution"}</th>
                <th className="num">{"Margin"}</th>
              </tr>
            </thead>
            <tbody>
              {me.map((s) => {
                let f = n.byPlatform[s];
                return f ? (
                  <tr key={s}>
                    <td>
                      <span className="row">
                        <i
                          className="swatch"
                          style={{
                            background: ve[s],
                          }}
                        />
                        {mt[s]}
                      </span>
                    </td>
                    <td className="num">{ie(f.revenue)}</td>
                    <td className="num">{ie(f.totalCost)}</td>
                    <td className="num">
                      <Badge tone={f.contribution >= 0 ? "good" : "crit"}>
                        {ie(f.contribution)}
                      </Badge>
                    </td>
                    <td className="num">{Et(f.marginPct, 0)}</td>
                  </tr>
                ) : null;
              })}
            </tbody>
          </table>
        </Card>
        <Card title="By home zone" flush={!0}>
          <div
            className="table-wrap table-scroll"
            style={{
              maxHeight: 280,
            }}
          >
            <table className="table">
              <thead>
                <tr>
                  <th>{"Zone"}</th>
                  <th className="num">{"Revenue"}</th>
                  <th className="num">{"Contribution"}</th>
                  <th className="num">{"Margin"}</th>
                </tr>
              </thead>
              <tbody>
                {a.zones.map((s) => {
                  let f = n.byZone[s.id];
                  return f ? (
                    <tr key={s.id}>
                      <td>{rt(s.id)}</td>
                      <td className="num">{ie(f.revenue)}</td>
                      <td className="num">
                        <Badge tone={f.contribution >= 0 ? "good" : "crit"}>
                          {ie(f.contribution)}
                        </Badge>
                      </td>
                      <td className="num">{Et(f.marginPct, 0)}</td>
                    </tr>
                  ) : null;
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>,
      <Card
        title="Assumptions"
        sub={`Driver pay uses each contract's hourly rate (statutory minimum \u20AC${x0("2026-09-16").toFixed(2)} in 2026) plus employer on-costs`}
      >
        <div className="stack">
          <div
            className="grid g4"
            style={{
              gap: 10,
            }}
          >
            {me.map((s) =>
              u(
                `rev-${s}`,
                `Revenue per delivery, ${mt[s]} (\u20AC)`,
                r.revenuePerDelivery[s],
                (f) =>
                  i({
                    revenuePerDelivery: {
                      ...r.revenuePerDelivery,
                      [s]: f,
                    },
                  }),
              ),
            )}
            {u(
              "oncost",
              "Employer on-costs (% of pay)",
              Math.round(r.employerOnCost * 100),
              (s) =>
                i({
                  employerOnCost: s / 100,
                }),
              1,
            )}
            {u(
              "equip",
              "Equipment per shift (\u20AC)",
              r.equipmentPerShift,
              (s) =>
                i({
                  equipmentPerShift: s,
                }),
            )}
            {u(
              "support",
              "Direct support per shift (\u20AC)",
              r.supportPerShift,
              (s) =>
                i({
                  supportPerShift: s,
                }),
            )}
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>{"Vehicle"}</th>
                  <th>{"Vehicle cost per hour (€)"}</th>
                  <th>{"Maintenance per hour (€)"}</th>
                  <th>{"Energy per km (€)"}</th>
                </tr>
              </thead>
              <tbody>
                {FM.map((s) => (
                  <tr key={s}>
                    <td>{ra[s]}</td>
                    <td>
                      <input
                        className="input"
                        aria-label={`${ra[s]} cost per hour`}
                        id={`vc-${s}`}
                        type="number"
                        step={0.05}
                        value={r.vehiclePerHour[s]}
                        onChange={(f) =>
                          i({
                            vehiclePerHour: {
                              ...r.vehiclePerHour,
                              [s]: Number(f.target.value),
                            },
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="input"
                        aria-label={`${ra[s]} maintenance per hour`}
                        id={`vm-${s}`}
                        type="number"
                        step={0.05}
                        value={r.maintenancePerHour[s]}
                        onChange={(f) =>
                          i({
                            maintenancePerHour: {
                              ...r.maintenancePerHour,
                              [s]: Number(f.target.value),
                            },
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="input"
                        aria-label={`${ra[s]} energy per km`}
                        id={`ve-${s}`}
                        type="number"
                        step={0.01}
                        value={r.energyPerKm[s]}
                        onChange={(f) =>
                          i({
                            energyPerKm: {
                              ...r.energyPerKm,
                              [s]: Number(f.target.value),
                            },
                          })
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>,
    ],
  });
}
export { DocumentsPage, EconomicsPage };
