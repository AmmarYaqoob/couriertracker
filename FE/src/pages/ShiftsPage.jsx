// Shifts and attendance.
import * as At from "react/jsx-runtime";
import {
  Et,
  Uk,
  V,
  jt,
  rt,
  Link,
  readPilotModel,
} from "../services/portalState.jsx";
import { Badge, Card, Stat, PageHeader, Callout } from "../components/ui.jsx";
import { An } from "./CapacityPage.jsx";
function ShiftsPage() {
  let t = readPilotModel(),
    e = jt(),
    r = t.drivers
      .filter((d) => d.shiftStart <= e.now)
      .filter((d) => d.lateStartMin > 0 && !d.noShow),
    n = e.driverStates.filter((d) =>
      ["free", "on_delivery", "on_break"].includes(d.activity),
    ).length,
    i = (d) =>
      t.drivers.filter(
        (c) =>
          c.homeZoneId === d && e.now >= c.shiftStart && e.now < c.shiftEnd,
      ),
    o = t.zones.map((d) => {
      let c = i(d.id),
        g = c.filter(
          (p) => !p.noShow && e.now >= p.shiftStart + p.lateStartMin,
        );
      return {
        z: d,
        scheduled: c.length,
        staffed: g.length,
      };
    }),
    l = t.drivers.filter((d) => d.shiftEnd - d.shiftStart > 360);
  return (
    <At.Fragment>
      <PageHeader
        eyebrow={`Attendance \xB7 ${V(e.now)}`}
        title="Shifts & Attendance"
        description="Planned vs staffed hours, late starts and no-shows, and break rules for every shift. Working time is recorded start to end, with breaks."
      />
      <div className="grid g4">
        <Stat label="Online riders now" value={n} />
        <Stat
          label="Staffed vs planned hours"
          value={Et(e.attendance.pct)}
          foot={`${e.attendance.staffed.toFixed(0)} of ${e.attendance.scheduled.toFixed(0)} h so far`}
        />
        <Stat
          label="Late check-ins"
          value={r.length}
          tone={r.length ? "warn" : void 0}
          foot={`${r.reduce((d, c) => d + c.lateStartMin, 0)} minutes in total`}
        />
        <Stat
          label="No-shows"
          value={e.attendance.noShows}
          tone={e.attendance.noShows ? "crit" : void 0}
          foot=<Link to="/readiness">{"Replacements"}</Link>
        />
      </div>
      <div className="grid g2">
        <Card
          title="Shift coverage by zone, now"
          sub="Scheduled vs actually staffed"
        >
          <An
            categories={o.map((d) => d.z.name)}
            series={[
              {
                id: "s",
                label: "Scheduled",
                color: "var(--seq-2)",
                values: o.map((d) => d.scheduled),
              },
              {
                id: "a",
                label: "Staffed",
                color: "var(--seq-4)",
                values: o.map((d) => d.staffed),
              },
            ]}
          />
        </Card>
        <Card title="Late check-ins today" flush={!0}>
          <table className="table">
            <thead>
              <tr>
                <th>{"Rider"}</th>
                <th>{"Zone"}</th>
                <th className="num">{"Planned"}</th>
                <th className="num">{"Actual"}</th>
                <th className="num">{"Late"}</th>
              </tr>
            </thead>
            <tbody>
              {r.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty">
                    {"No late starts so far."}
                  </td>
                </tr>
              )}
              {r.map((d) => (
                <tr key={d.id}>
                  <td>
                    <Link to={`/riders/${d.id}`}>{d.name}</Link>
                  </td>
                  <td>{rt(d.homeZoneId)}</td>
                  <td className="num">{V(d.shiftStart)}</td>
                  <td className="num">{V(d.shiftStart + d.lateStartMin)}</td>
                  <td className="num">
                    <Badge tone={d.lateStartMin > 10 ? "crit" : "warn"}>
                      {d.lateStartMin}
                      {" min"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
      <Card
        title="Break planning (ArbZG section 4)"
        sub="Shifts over 6 hours need at least 30 minutes, in blocks of 15 minutes or more; nobody works more than 6 hours without a break"
        flush={!0}
      >
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{"Rider"}</th>
                <th className="num">{"Shift"}</th>
                <th className="num">{"Break"}</th>
                <th>{"Rule check"}</th>
                <th>{"Now"}</th>
              </tr>
            </thead>
            <tbody>
              {l.map((d) => {
                let c = d.shiftEnd - d.shiftStart - d.breakMinutes,
                  g = Math.max(
                    d.breakStart - d.shiftStart,
                    d.shiftEnd - (d.breakStart + d.breakMinutes),
                  ),
                  p = Uk(c, d.breakMinutes ? [d.breakMinutes] : [], g),
                  u =
                    e.now >= d.breakStart &&
                    e.now < d.breakStart + d.breakMinutes,
                  s = d.breakStart - e.now > 0 && d.breakStart - e.now <= 15;
                return (
                  <tr key={d.id}>
                    <td>{d.name}</td>
                    <td className="num">
                      {V(d.shiftStart)}
                      {"–"}
                      {V(d.shiftEnd)}
                    </td>
                    <td className="num">
                      {V(d.breakStart)}
                      {" · "}
                      {d.breakMinutes}
                      {" min"}
                    </td>
                    <td>
                      {p.ok ? (
                        <Badge tone="good">{"Compliant"}</Badge>
                      ) : (
                        <Badge tone="crit">{p.issues.join("; ")}</Badge>
                      )}
                    </td>
                    <td>
                      {u ? (
                        <Badge tone="info">{"On break"}</Badge>
                      ) : s ? (
                        <Badge tone="warn">
                          {"Break due "}
                          {V(d.breakStart)}
                        </Badge>
                      ) : (
                        <span className="muted small">{"—"}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      <Callout>
        {
          "Working time is recorded start to end with breaks, as German law requires since the BAG ruling of 13 September 2022; a draft bill proposes electronic recording as the default."
        }
      </Callout>
    </At.Fragment>
  );
}
export { ShiftsPage };
