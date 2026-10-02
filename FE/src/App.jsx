// Hash router and role home redirects. Inbox page lives in this module.
import { useEffect, useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import {
  useHashLocation,
  V,
  canAccessPath,
  fi,
  HOME_BY_ROLE,
  I18nProvider,
  jt,
  matchPath,
  me,
  mt,
  startSimClock,
  rt,
  sr,
  Link,
  readPilotModel,
  navigate,
} from "./services/portalState.jsx";
import {
  Badge,
  SegmentedControl,
  Card,
  Stat,
  Select,
  Field,
  AppShell,
  PageHeader,
  wn,
  Callout,
  Button,
} from "./components/ui.jsx";
import { CompliancePage, CapacityPage, ve } from "./pages/CapacityPage.jsx";
import { e2, i2 } from "./components/icons.jsx";
import { CopilotPage, DashboardPage } from "./pages/DashboardPage.jsx";
import { OpsPage } from "./pages/OpsPage.jsx";
import { OrdersPage } from "./pages/OrdersPage.jsx";
import { DelaysPage } from "./pages/DelaysPage.jsx";
import { ReadinessPage } from "./pages/ReadinessPage.jsx";
import { ShiftsPage } from "./pages/ShiftsPage.jsx";
import { IncidentsPage } from "./pages/IncidentsPage.jsx";
import { KpiPage } from "./pages/KpiPage.jsx";
import { FleetPage, PerformancePage } from "./pages/PerformancePage.jsx";
import { DocumentsPage, EconomicsPage } from "./pages/EconomicsPage.jsx";
import { ExpansionPage } from "./pages/ExpansionPage.jsx";
import { RidersPage } from "./pages/RidersPage.jsx";
import { EquipmentPage } from "./pages/EquipmentPage.jsx";
import { FleetOwnersPage } from "./pages/FleetOwnersPage.jsx";
import { PayrollPage } from "./pages/PayrollPage.jsx";
import { AuditPage } from "./pages/AuditPage.jsx";
import { ResponsibilitiesPage, ReportsPage } from "./pages/ReportsPage.jsx";
import { ApiHubPage } from "./api/mockApi.jsx";
import { AdminPage } from "./pages/AdminPage.jsx";
import { SettingsPage } from "./pages/SettingsPage.jsx";
import { DelayCausesPage } from "./pages/DelayCausesPage.jsx";
import { CanonicalStatePage } from "./pages/CanonicalStatePage.jsx";
import { AlgoLogPage } from "./pages/AlgoLogPage.jsx";
import { ReconPage } from "./pages/ReconPage.jsx";
import { SafetyPage } from "./pages/SafetyPage.jsx";
import { HealthPackPage } from "./pages/HealthPackPage.jsx";
import { BroadcastPage } from "./pages/BroadcastPage.jsx";
import { PrepTimePage } from "./pages/PrepTimePage.jsx";
import { HexPage } from "./pages/HexPage.jsx";
import { ApiSandboxPage } from "./pages/ApiSandboxPage.jsx";
import { AuthProvider, useAuth } from "./auth/AuthProvider.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { RiderDetailPage } from "./pages/RiderDetailPage.jsx";
var hr = {
    not_started: {
      label: "Scheduled",
      tone: "neutral",
    },
    waiting_driver: {
      label: "Waiting for driver",
      tone: "warn",
    },
    to_pickup: {
      label: "Accepted",
      tone: "info",
    },
    at_pickup: {
      label: "At restaurant",
      tone: "info",
    },
    to_customer: {
      label: "Picked up",
      tone: "info",
    },
    at_customer: {
      label: "At customer",
      tone: "info",
    },
    done: {
      label: "Delivered",
      tone: "good",
    },
    cancelled: {
      label: "Cancelled",
      tone: "crit",
    },
  },
  Xb = {
    waiting_driver: 3,
    to_pickup: 8,
    at_pickup: 4,
    to_customer: 15,
    at_customer: 3,
  },
  Qb = [
    "waiting_driver",
    "to_pickup",
    "at_pickup",
    "to_customer",
    "at_customer",
    "done",
  ],
  Jb = [
    {
      value: "all",
      label: "All statuses",
    },
    {
      value: "waiting_driver",
      label: hr.waiting_driver.label,
    },
    {
      value: "to_pickup",
      label: hr.to_pickup.label,
    },
    {
      value: "at_pickup",
      label: hr.at_pickup.label,
    },
    {
      value: "to_customer",
      label: hr.to_customer.label,
    },
    {
      value: "at_customer",
      label: hr.at_customer.label,
    },
    {
      value: "done",
      label: hr.done.label,
    },
    {
      value: "cancelled",
      label: hr.cancelled.label,
    },
  ],
  t7 = ["Full-time", "Part-time", "Mini-job", "Working Student", "Midi-job"],
  lp = {
    platform: "all",
    zoneId: "all",
    status: "all",
    band: "all",
    courierId: "all",
    restaurantId: "all",
    employment: "all",
    search: "",
  };
function e7(t, e) {
  let a = Math.max(0, Math.round(t)),
    r = a >= 60 ? `${Math.floor(a / 60)}h ${a % 60}m` : `${a}m`,
    n = Xb[e];
  return n !== void 0 && t > n
    ? {
        text: r,
        tone: "crit",
      }
    : n !== void 0 && t > n * 0.6
      ? {
          text: r,
          tone: "warn",
        }
      : {
          text: r,
          tone: "neutral",
        };
}
function InboxPage() {
  let t = jt(),
    e = readPilotModel(),
    a = useMemo(() => new Map(e.drivers.map((v) => [v.id, v])), [e.drivers]),
    r = useMemo(
      () => new Map(e.restaurants.map((v) => [v.id, v])),
      [e.restaurants],
    ),
    n = useMemo(
      () => new Map(t.active.map((v) => [v.order.id, v.prediction])),
      [t.active],
    ),
    [i, o] = useState(lp),
    [l, d] = useState("table"),
    [c, g] = fi("unified-inbox.savedViews", []),
    p = (v) =>
      o({
        ...i,
        ...v,
      }),
    u = useMemo(() => {
      let v = i.search.trim().toLowerCase();
      return t.visible
        .map((E) => {
          let Q = sr(E, t.now),
            _ = E.driverId ? a.get(E.driverId) : void 0,
            Mt = r.get(E.restaurantId),
            Wt = n.get(E.id);
          return {
            o: E,
            stage: Q,
            driver: _,
            restaurant: Mt,
            pred: Wt,
          };
        })
        .filter(
          ({ o: E, stage: Q, driver: _, restaurant: Mt, pred: Wt }) =>
            !(
              (i.platform !== "all" && E.platform !== i.platform) ||
              (i.zoneId !== "all" &&
                E.zoneId !== i.zoneId &&
                E.dropoffZoneId !== i.zoneId) ||
              (i.status !== "all" && Q !== i.status) ||
              (i.band !== "all" && (!Wt || Wt.band !== i.band)) ||
              (i.courierId !== "all" && _?.id !== i.courierId) ||
              (i.restaurantId !== "all" && E.restaurantId !== i.restaurantId) ||
              (i.employment !== "all" && _?.employmentType !== i.employment) ||
              (v &&
                !`${E.id} ${Mt?.name ?? ""} ${_?.name ?? ""}`
                  .toLowerCase()
                  .includes(v))
            ),
        )
        .sort((E, Q) => Q.o.createdAt - E.o.createdAt);
    }, [t.visible, t.now, i, a, r, n]),
    s = u.filter(
      (v) =>
        v.stage !== "done" &&
        v.stage !== "cancelled" &&
        v.stage !== "not_started",
    ),
    f = s.filter((v) => v.stage === "waiting_driver").length,
    x = s.filter(
      (v) => v.pred && (v.pred.band === "amber" || v.pred.band === "red"),
    ).length,
    M = s.filter((v) => t.now > v.o.deadlineUpdated).length,
    h = {
      uber_eats: 0,
      wolt: 0,
      lieferando: 0,
    };
  for (let v of s) h[v.o.platform]++;
  let m = Qb.map((v) => ({
      stage: v,
      items: u.filter((E) => E.stage === v).slice(0, 40),
    })),
    y = () => {
      let v =
        typeof window < "u" ? window.prompt("Name this view", "My view") : null;
      if (!v) return;
      let E = v.trim();
      if (!E) return;
      let Q = {
        id: `sv_${Date.now().toString(36)}`,
        name: E,
        filters: i,
      };
      g([...c, Q]);
    },
    k = (v) =>
      o({
        ...lp,
        ...v.filters,
      }),
    L = (v) => g(c.filter((E) => E.id !== v)),
    w = [
      {
        value: "all",
        label: "All zones",
      },
      ...e.zones.map((v) => ({
        value: v.id,
        label: v.name,
      })),
    ],
    O = [
      {
        value: "all",
        label: "All couriers",
      },
      ...e.drivers.map((v) => ({
        value: v.id,
        label: v.name,
      })),
    ],
    A = [
      {
        value: "all",
        label: "All restaurants",
      },
      ...e.restaurants.map((v) => ({
        value: v.id,
        label: v.name,
      })),
    ],
    j = [
      {
        value: "all",
        label: "All employment types",
      },
      ...t7.map((v) => ({
        value: v,
        label: v,
      })),
    ];
  return jsxs(Fragment, {
    children: [
      <PageHeader
        eyebrow={`Unified inbox \xB7 ${V(t.now)}`}
        title="Unified Order Inbox"
        description="One live queue across Uber Eats, Wolt and Lieferando. Filter, save recurring views and switch between a table and a stage kanban."
      />,
      <Callout>
        {
          "Multi-platform inbox — canonical states unify Uber Eats webhooks, Wolt order events, and Lieferando POS entries."
        }
      </Callout>,
      <div className="grid g4">
        <Stat
          label="Active in view"
          value={s.length}
          foot={`${u.length} total in queue`}
        />
        <Stat
          label="Waiting for driver"
          value={f}
          tone={f > 0 ? "warn" : void 0}
        />
        <Stat
          label="At risk (amber + red)"
          value={x}
          tone={x > 0 ? (x > 5 ? "crit" : "warn") : void 0}
          foot="From live ETA predictions"
        />
        <Stat label="Past deadline" value={M} tone={M > 0 ? "crit" : void 0} />
      </div>,
      <div className="grid g4">
        {me.map((v) => (
          <Stat
            label=<span className="row">
              <i
                className="swatch"
                style={{
                  background: ve[v],
                }}
              />
              {mt[v]}
            </span>
            value={h[v]}
            foot="Active orders"
            key={v}
          />
        ))}
        <Stat
          label="Total platforms"
          value={me.length}
          foot="Uber Eats · Wolt · Lieferando"
        />
      </div>,
      <Card title="Filters" sub="Narrow the queue and save your combinations">
        <div
          className="row wrap"
          style={{
            gap: 12,
            alignItems: "flex-end",
          }}
        >
          <Field
            id="ui-search"
            label="Search"
            hint="Order id, restaurant or rider"
          >
            <div
              className="row"
              style={{
                gap: 6,
                alignItems: "center",
              }}
            >
              {jsx(i2, {
                size: 14,
              })}
              <input
                id="ui-search"
                className="select"
                type="search"
                value={i.search}
                placeholder="e.g. margherita, ali, ord_1234"
                onChange={(v) =>
                  p({
                    search: v.target.value,
                  })
                }
              />
            </div>
          </Field>
          <Field label="Platform">
            <SegmentedControl
              value={i.platform}
              onChange={(v) =>
                p({
                  platform: v,
                })
              }
              options={[
                {
                  value: "all",
                  label: "All",
                },
                ...me.map((v) => ({
                  value: v,
                  label: mt[v],
                })),
              ]}
            />
          </Field>
          <Field label="ETA risk">
            <SegmentedControl
              value={i.band}
              onChange={(v) =>
                p({
                  band: v,
                })
              }
              options={[
                {
                  value: "all",
                  label: "All",
                },
                {
                  value: "green",
                  label: "Green",
                },
                {
                  value: "amber",
                  label: "Amber",
                },
                {
                  value: "red",
                  label: "Red",
                },
              ]}
            />
          </Field>
          <Select
            id="ui-zone"
            label="Zone"
            value={i.zoneId}
            options={w}
            onChange={(v) =>
              p({
                zoneId: v,
              })
            }
          />
          <Select
            id="ui-status"
            label="Status"
            value={i.status}
            options={Jb.map((v) => ({
              value: v.value,
              label: v.label,
            }))}
            onChange={(v) =>
              p({
                status: v,
              })
            }
          />
          <Select
            id="ui-courier"
            label="Courier"
            value={i.courierId}
            options={O}
            onChange={(v) =>
              p({
                courierId: v,
              })
            }
          />
          <Select
            id="ui-restaurant"
            label="Restaurant"
            value={i.restaurantId}
            options={A}
            onChange={(v) =>
              p({
                restaurantId: v,
              })
            }
          />
          <Select
            id="ui-employment"
            label="Employment"
            value={i.employment}
            options={j}
            onChange={(v) =>
              p({
                employment: v,
              })
            }
          />
        </div>
        <div
          className="row wrap"
          style={{
            gap: 8,
            marginTop: 12,
            alignItems: "center",
          }}
        >
          <Button variant="primary" size="sm" onClick={y}>
            {"Save current view"}
          </Button>
          <Button size="sm" onClick={() => o(lp)}>
            {"Reset"}
          </Button>
          {c.length === 0 && (
            <span className="small muted">
              {
                'No saved views yet — set some filters and hit "Save current view".'
              }
            </span>
          )}
          {c.map((v) => (
            <span
              className="badge outline"
              style={{
                gap: 6,
              }}
              key={v.id}
            >
              <button
                type="button"
                onClick={() => k(v)}
                title={`Apply saved view \xB7 platform=${v.filters.platform} zone=${v.filters.zoneId} status=${v.filters.status}`}
                style={{
                  background: "none",
                  border: 0,
                  padding: 0,
                  cursor: "pointer",
                  color: "inherit",
                  font: "inherit",
                }}
              >
                {v.name}
              </button>
              <button
                type="button"
                aria-label={`Delete saved view ${v.name}`}
                onClick={() => L(v.id)}
                style={{
                  background: "none",
                  border: 0,
                  padding: 0,
                  cursor: "pointer",
                  color: "inherit",
                  display: "inline-flex",
                }}
              >
                {jsx(e2, {
                  size: 12,
                })}
              </button>
            </span>
          ))}
        </div>
      </Card>,
      <Card
        title="Queue"
        sub={`${u.length} order${u.length === 1 ? "" : "s"} match the current filters`}
        actions=<SegmentedControl
          value={l}
          onChange={d}
          options={[
            {
              value: "table",
              label: "Table",
            },
            {
              value: "kanban",
              label: "Kanban by stage",
            },
          ]}
        />
        flush={!0}
      >
        {l === "table" ? (
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
                  <th>{"ETA risk"}</th>
                </tr>
              </thead>
              <tbody>
                {u.length === 0 && (
                  <tr>
                    <td colSpan={9} className="empty">
                      {"No orders match these filters."}
                    </td>
                  </tr>
                )}
                {u
                  .slice(0, 200)
                  .map(
                    ({
                      o: v,
                      stage: E,
                      driver: Q,
                      restaurant: _,
                      pred: Mt,
                    }) => {
                      let Wt =
                        t.now > v.deadlineUpdated &&
                        E !== "done" &&
                        E !== "cancelled";
                      return (
                        <tr key={v.id}>
                          <td>
                            <span className="row">
                              <i
                                className="swatch"
                                style={{
                                  background: ve[v.platform],
                                }}
                                title={`${mt[v.platform]} \u2014 canonical stage: ${hr[E].label}`}
                              />
                              <Link
                                to={`/delays?order=${v.id}`}
                                className="mono"
                              >
                                {v.id}
                              </Link>
                            </span>
                          </td>
                          <td className="small">{_?.name ?? "\u2014"}</td>
                          <td className="small">
                            {rt(v.zoneId)}
                            {v.dropoffZoneId !== v.zoneId
                              ? ` \u2192 ${rt(v.dropoffZoneId)}`
                              : ""}
                          </td>
                          <td className="num">
                            {v.distanceKm.toFixed(1)}
                            {" km"}
                          </td>
                          <td className="num">{V(v.createdAt)}</td>
                          <td className="num">
                            {V(v.deadlineUpdated)}
                            {Wt &&
                              jsxs(Fragment, {
                                children: [
                                  " ",
                                  <Badge tone="crit">{"late"}</Badge>,
                                ],
                              })}
                          </td>
                          <td className="small">
                            {Q &&
                            v.actual.accepted !== void 0 &&
                            v.actual.accepted <= t.now ? (
                              <span
                                title={`${Q.employmentType} \xB7 ${Q.contractType}`}
                              >
                                {Q.name}
                              </span>
                            ) : (
                              <span className="muted">{"—"}</span>
                            )}
                          </td>
                          <td>
                            <Badge tone={hr[E].tone}>{hr[E].label}</Badge>
                          </td>
                          <td>
                            {Mt ? (
                              jsx(wn, {
                                band: Mt.band,
                                label: `${Mt.margin >= 0 ? "+" : ""}${Math.round(Mt.margin)} min`,
                              })
                            ) : E === "done" ? (
                              <Badge tone="good">{"On time"}</Badge>
                            ) : E === "cancelled" ? (
                              <span className="small muted">
                                {v.cancellation?.reason ?? "cancelled"}
                              </span>
                            ) : (
                              <span className="muted small">{"—"}</span>
                            )}
                          </td>
                        </tr>
                      );
                    },
                  )}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            className="row"
            style={{
              gap: 12,
              padding: 12,
              overflowX: "auto",
              alignItems: "flex-start",
            }}
          >
            {m.map(({ stage: v, items: E }) => (
              <div
                className="card"
                style={{
                  minWidth: 240,
                  flex: "0 0 240px",
                  background: "var(--panel, transparent)",
                }}
                key={v}
              >
                <div className="card-head">
                  <div>
                    <h3
                      style={{
                        fontSize: 13,
                      }}
                    >
                      <Badge tone={hr[v].tone}>{hr[v].label}</Badge>
                    </h3>
                    <div className="sub small muted">
                      {E.length}
                      {" in stage"}
                    </div>
                  </div>
                </div>
                <div
                  className="card-body"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {E.length === 0 && (
                    <div className="empty small">{"Empty"}</div>
                  )}
                  {E.map(({ o: Q, driver: _, restaurant: Mt, pred: Wt }) => {
                    let Tt = e7(t.now - Q.createdAt, v);
                    return (
                      <div
                        className="card"
                        style={{
                          padding: 8,
                        }}
                        key={Q.id}
                      >
                        <div
                          className="row"
                          style={{
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span
                            className="row"
                            style={{
                              gap: 6,
                              alignItems: "center",
                            }}
                          >
                            <i
                              className="swatch"
                              style={{
                                background: ve[Q.platform],
                              }}
                              title={mt[Q.platform]}
                            />
                            <Link
                              to={`/delays?order=${Q.id}`}
                              className="mono small"
                            >
                              {Q.id}
                            </Link>
                          </span>
                          <Badge
                            tone={Tt.tone === "neutral" ? "neutral" : Tt.tone}
                          >
                            {Tt.text}
                          </Badge>
                        </div>
                        <div
                          className="small"
                          style={{
                            marginTop: 4,
                          }}
                        >
                          {Mt?.name ?? "\u2014"}
                        </div>
                        <div className="small muted">
                          {rt(Q.zoneId)}
                          {Q.dropoffZoneId !== Q.zoneId
                            ? ` \u2192 ${rt(Q.dropoffZoneId)}`
                            : ""}
                        </div>
                        <div
                          className="row"
                          style={{
                            justifyContent: "space-between",
                            marginTop: 6,
                            alignItems: "center",
                          }}
                        >
                          <span className="small">
                            {_ ? (
                              _.name
                            ) : (
                              <span className="muted">{"Unassigned"}</span>
                            )}
                          </span>
                          {Wt ? (
                            jsx(wn, {
                              band: Wt.band,
                              label: `${Wt.margin >= 0 ? "+" : ""}${Math.round(Wt.margin)}m`,
                            })
                          ) : (
                            <span className="small muted">
                              {"deadline "}
                              {V(Q.deadlineUpdated)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>,
    ],
  });
}
var ROUTES = {
  "/dashboard": DashboardPage,
  "/ops": OpsPage,
  "/capacity": CapacityPage,
  "/orders": OrdersPage,
  "/delays": DelaysPage,
  "/readiness": ReadinessPage,
  "/shifts": ShiftsPage,
  "/incidents": IncidentsPage,
  "/kpi": KpiPage,
  "/performance": PerformancePage,
  "/economics": EconomicsPage,
  "/expansion": ExpansionPage,
  "/riders": RidersPage,
  "/equipment": EquipmentPage,
  "/fleet": FleetPage,
  "/fleet-owners": FleetOwnersPage,
  "/compliance": CompliancePage,
  "/payroll": PayrollPage,
  "/audit": AuditPage,
  "/responsibilities": ResponsibilitiesPage,
  "/api-hub": ApiHubPage,
  "/admin": AdminPage,
  "/copilot": CopilotPage,
  "/settings": SettingsPage,
  "/inbox": InboxPage,
  "/reports": ReportsPage,
  "/delay-causes": DelayCausesPage,
  "/canonical-state": CanonicalStatePage,
  "/documents": DocumentsPage,
  "/algo-log": AlgoLogPage,
  "/recon": ReconPage,
  "/safety": SafetyPage,
  "/health-pack": HealthPackPage,
  "/broadcast": BroadcastPage,
  "/prep-time": PrepTimePage,
  "/hex": HexPage,
  "/api-sandbox": ApiSandboxPage,
};
function AppRoutes() {
  const { user } = useAuth();
  const { path } = useHashLocation();

  useEffect(() => {
    startSimClock();
  }, []);

  useEffect(() => {
    if (!user) {
      if (path !== "/login") navigate("/login");
      return;
    }
    if (path === "/login" || path === "/" || !canAccessPath(path, user.role)) {
      navigate(HOME_BY_ROLE[user.role]);
    }
  }, [user, path]);

  if (!user || path === "/login") return <LoginPage />;

  const rider = matchPath("/riders/:id", path);
  if (rider) {
    return (
      <AppShell>
        <RiderDetailPage id={rider.id} />
      </AppShell>
    );
  }

  const Page = ROUTES[path];
  if (!Page) return null;
  return (
    <AppShell>
      <Page />
    </AppShell>
  );
}
function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </I18nProvider>
  );
}
export { App, AppRoutes, InboxPage, ROUTES };
