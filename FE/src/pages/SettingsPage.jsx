// Settings.
import * as gt from "react/jsx-runtime";
import {
  opsStore,
  useOpsStore,
  simClock,
  V,
  useSimClock,
  d5,
  k2,
  useI18n,
  useToast,
  x2,
  yl,
} from "../services/portalState.jsx";
import {
  Badge,
  Card,
  KeyValueList,
  Field,
  Toast,
  PageHeader,
  Callout,
  Button,
} from "../components/ui.jsx";
import { W2 } from "./AdminPage.jsx";
import { Bl, Nl } from "../api/mockApi.jsx";
import { DEMO_USERS } from "../auth/AuthProvider.jsx";
function SettingsPage() {
  let t = useOpsStore(),
    e = useSimClock(),
    { lang: a, setLang: r } = useI18n(),
    [n, i] = useToast();
  return gt.jsxs(gt.Fragment, {
    children: [
      <PageHeader
        eyebrow="Configuration"
        title="Settings"
        description="Company profile, operating targets, alert thresholds, pay and compliance rules, language and the pilot simulation."
      />,
      <div className="grid g2">
        <Card title="Company profile">
          <KeyValueList
            items={[
              ["Company", "EELS GmbH"],
              ["Base", "Raunheim, Frankfurt region"],
              ["Workforce partner", "Alnaif Lieferdienst UG"],
              ["Pilot city", "Frankfurt am Main"],
              ["Target partners", "Uber Eats, Wolt, Lieferando"],
              ["Tax ID", "To be added"],
              ["Contact", "ops@eels.de"],
            ]}
          />
        </Card>
        <Card title="Branches and hubs">
          <div className="stack-sm">
            {W2.map((o) => (
              <div className="alert-item" key={o.name}>
                <div className="grow">
                  <div className="t">{o.name}</div>
                  <div className="d">{o.services}</div>
                </div>
                <Badge tone="outline">{o.hours}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>,
      <div className="grid g2">
        <Card title="Operating targets and alert thresholds">
          <div
            className="grid g3"
            style={{
              gap: 10,
            }}
          >
            <Field
              id="st-target"
              label="Daily PTOD target (%)"
              hint="Internal measure"
            >
              <input
                id="st-target"
                className="input"
                type="number"
                min={50}
                max={100}
                step={0.1}
                value={t.targetPct}
                onChange={(o) =>
                  opsStore.set({
                    targetPct: Number(o.target.value),
                  })
                }
              />
            </Field>
            <Field
              id="st-amber"
              label="Amber below (min margin)"
              hint="Green above, red below 0"
            >
              <input
                id="st-amber"
                className="input"
                type="number"
                min={1}
                max={15}
                value={t.amberBelow}
                onChange={(o) =>
                  opsStore.set({
                    amberBelow: Number(o.target.value),
                  })
                }
              />
            </Field>
            <Field id="st-util" label="Planned utilisation (%)">
              <input
                id="st-util"
                className="input"
                type="number"
                min={50}
                max={100}
                value={Math.round(t.utilisation * 100)}
                onChange={(o) =>
                  opsStore.set({
                    utilisation: Number(o.target.value) / 100,
                  })
                }
              />
            </Field>
          </div>
          <p
            className="small muted"
            style={{
              marginTop: 8,
            }}
          >
            {
              "The pilot target of 98.5% was set by EELS on 16 September 2026 (the plan's worked example uses 95%). Platform targets stay separate until each partner agrees them."
            }
          </p>
        </Card>
        <Card
          title="Pay and compliance rules"
          sub="Applied by payroll and compliance checks"
        >
          <table className="table">
            <thead>
              <tr>
                <th>{"Rule"}</th>
                <th>{"Value"}</th>
              </tr>
            </thead>
            <tbody>
              {k2.map((o) => (
                <tr key={o.from}>
                  <td>
                    {"Statutory minimum wage from "}
                    {o.from}
                  </td>
                  <td className="num">
                    {"€"}
                    {o.rate.toFixed(2)}
                    {" / h"}
                  </td>
                </tr>
              ))}
              {Object.entries(x2).map(([o, l]) => (
                <tr key={o}>
                  <td>
                    {"Mini-job limit "}
                    {o}
                  </td>
                  <td className="num">
                    {"€"}
                    {l}
                    {" / month"}
                  </td>
                </tr>
              ))}
              <tr>
                <td>{"Breaks"}</td>
                <td>{"30 min above 6 h, 45 min above 9 h; blocks ≥ 15 min"}</td>
              </tr>
              <tr>
                <td>{"Working time"}</td>
                <td>
                  {"8 h per day, up to 10 h when averaged out; 11 h rest"}
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>,
      <div className="grid g3">
        <Card title="Language">
          <div className="seg">
            <button className={a === "en" ? "on" : ""} onClick={() => r("en")}>
              {"English"}
            </button>
            <button className={a === "de" ? "on" : ""} onClick={() => r("de")}>
              {"Deutsch"}
            </button>
          </div>
          <p
            className="xsmall muted"
            style={{
              marginTop: 8,
            }}
          >
            {
              "Navigation and page titles are translated; detailed page text is English in this release."
            }
          </p>
        </Card>
        <Card
          title="Pilot simulation"
          sub="Wednesday 16 September 2026, Frankfurt"
        >
          <div className="stack-sm">
            <div className="row between">
              <span>{"Simulated time"}</span>
              <b className="mono">{V(e.now)}</b>
            </div>
            <div className="row wrap">
              <Button size="sm" onClick={() => yl(750)}>
                {"Lunch peak"}
              </Button>
              <Button size="sm" onClick={() => yl(1145)}>
                {"Dinner peak"}
              </Button>
              <Button size="sm" onClick={() => yl(1395)}>
                {"End of day"}
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  simClock.set({
                    running: !e.running,
                  })
                }
              >
                {e.running ? "Pause" : "Run"}
              </Button>
            </div>
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                (d5(), i("Your changes were reset"));
              }}
            >
              {"Reset my changes"}
            </Button>
          </div>
        </Card>
        <Card title="API and AI">
          <KeyValueList
            items={[
              ["API mode", Bl === "mock" ? "In-browser mock" : "Live backend"],
              ["API base", Nl],
              ["Copilot", "Claude via Netlify function, offline fallback"],
              ["Model", "ANTHROPIC_MODEL (default claude-sonnet-5)"],
            ]}
          />
        </Card>
      </div>,
      <Card title="User roles">
        <div className="grid g4">
          {DEMO_USERS.map((o) => (
            <div className="card inset stat" key={o.role}>
              <div className="label">{o.title}</div>
              <div className="small">{o.name}</div>
              <div className="xsmall muted mono">{o.email}</div>
            </div>
          ))}
        </div>
      </Card>,
      <Callout>
        {
          "Changes are stored in this browser only. Release 2 moves them to the backend with an audit trail."
        }
      </Callout>,
      <Toast message={n} />,
    ],
  });
}
export { SettingsPage };
