// Fleet owners page.
import * as jl from "react";
import * as Ot from "react/jsx-runtime";
import { L5 } from "./AdminPage.jsx";
import {
  Badge,
  SegmentedControl,
  Card,
  Modal,
  Field,
  PageHeader,
  Button,
} from "../components/ui.jsx";
import { Fr } from "../components/icons.jsx";
import { M2 } from "../services/portalState.jsx";
function FleetOwnersPage() {
  let [t, e] = jl.useState(L5),
    [a, r] = jl.useState("all"),
    [n, i] = jl.useState(""),
    [o, l] = jl.useState(!1),
    d = t.filter(
      (g) =>
        (a === "all" || g.status === a) &&
        `${g.companyName} ${g.ownerName} ${g.cities.join(" ")}`
          .toLowerCase()
          .includes(n.toLowerCase()),
    ),
    c = {
      active: "good",
      suspended: "crit",
      "on-hold": "warn",
      onboarding: "info",
    };
  return (
    <Ot.Fragment>
      <PageHeader
        eyebrow="Fleet partners"
        title="Manage Fleet Owners"
        description="Fleet companies and their cities, platforms and volumes. Suspended partners stay visible for audit."
        actions=<Button variant="primary" onClick={() => l(!0)}>
          <Fr size={14} />
          {" Add fleet owner"}
        </Button>
      />
      <Card
        title={`${d.length} fleet owners`}
        actions=<Ot.Fragment>
          <input
            id="fo-search"
            className="input"
            placeholder="Search"
            aria-label="Search fleet owners"
            value={n}
            onChange={(g) => i(g.target.value)}
          />
          <SegmentedControl
            value={a}
            onChange={r}
            options={[
              {
                value: "all",
                label: "All",
              },
              {
                value: "active",
                label: "Active",
              },
              {
                value: "onboarding",
                label: "Onboarding",
              },
              {
                value: "on-hold",
                label: "On hold",
              },
              {
                value: "suspended",
                label: "Suspended",
              },
            ]}
          />
        </Ot.Fragment>
        flush={!0}
      >
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{"Company"}</th>
                <th>{"Contact"}</th>
                <th>{"Cities"}</th>
                <th>{"Platforms"}</th>
                <th className="num">{"Riders"}</th>
                <th className="num">{"Orders / month"}</th>
                <th>{"Status"}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {d.map((g) => (
                <tr key={g.id}>
                  <td>
                    <div className="bold">{g.companyName}</div>
                    <div className="xsmall muted">
                      {"Since "}
                      {g.joinedDate}
                    </div>
                  </td>
                  <td className="small">
                    {g.ownerName}
                    <br />
                    <span className="muted">
                      {g.email}
                      {" · "}
                      {g.phone}
                    </span>
                  </td>
                  <td>{g.cities.join(", ")}</td>
                  <td className="small">{g.platforms.join(", ")}</td>
                  <td className="num">{g.riders}</td>
                  <td className="num">{M2(g.monthlyOrders)}</td>
                  <td>
                    <Badge tone={c[g.status]}>{g.status}</Badge>
                  </td>
                  <td className="right">
                    {g.status === "suspended" ? (
                      <Button
                        size="sm"
                        onClick={() =>
                          e(
                            t.map((p) =>
                              p.id === g.id
                                ? {
                                    ...p,
                                    status: "on-hold",
                                  }
                                : p,
                            ),
                          )
                        }
                      >
                        {"Move to review"}
                      </Button>
                    ) : g.status !== "active" ? (
                      <Button
                        size="sm"
                        onClick={() =>
                          e(
                            t.map((p) =>
                              p.id === g.id
                                ? {
                                    ...p,
                                    status: "active",
                                  }
                                : p,
                            ),
                          )
                        }
                      >
                        {"Activate"}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          e(
                            t.map((p) =>
                              p.id === g.id
                                ? {
                                    ...p,
                                    status: "on-hold",
                                  }
                                : p,
                            ),
                          )
                        }
                      >
                        {"Put on hold"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {o && <XM onClose={() => l(!1)} onAdd={(g) => e([...t, g])} />}
    </Ot.Fragment>
  );
}
function XM({ onClose: t, onAdd: e }) {
  let [a, r] = jl.useState({
      companyName: "",
      ownerName: "",
      email: "",
      phone: "",
      cities: "",
      platforms: "",
    }),
    n = a.companyName && a.ownerName && a.email.includes("@");
  return (
    <Modal
      title="Add fleet owner"
      onClose={t}
      footer=<Ot.Fragment>
        <Button onClick={t}>{"Cancel"}</Button>
        <Button
          variant="primary"
          disabled={!n}
          onClick={() => {
            (e({
              id: `fo${Date.now()}`,
              ...a,
              cities: a.cities
                .split(",")
                .map((i) => i.trim())
                .filter(Boolean),
              platforms: a.platforms
                .split(",")
                .map((i) => i.trim())
                .filter(Boolean),
              riders: 0,
              monthlyOrders: 0,
              status: "onboarding",
              joinedDate: "Sep 2026",
            }),
              t());
          }}
        >
          {"Add"}
        </Button>
      </Ot.Fragment>
    >
      <div
        className="grid g2"
        style={{
          gap: 10,
        }}
      >
        {[
          ["companyName", "Company (GmbH or UG)"],
          ["ownerName", "Contact person"],
          ["email", "Email"],
          ["phone", "Phone"],
          ["cities", "Cities (comma separated)"],
          ["platforms", "Platforms (comma separated)"],
        ].map(([i, o]) => (
          <Field id={`add-${i}`} label={o} key={i}>
            <input
              id={`add-${i}`}
              className="input"
              value={a[i]}
              onChange={(l) =>
                r({
                  ...a,
                  [i]: l.target.value,
                })
              }
            />
          </Field>
        ))}
      </div>
      <p className="xsmall muted">
        {
          "Fleet partners need a registered GmbH or UG, VAT ID and business bank account before onboarding."
        }
      </p>
    </Modal>
  );
}
export { FleetOwnersPage };
