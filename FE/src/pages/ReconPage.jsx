// Settlement reconciliation.
import * as Aa from "react";
import * as Y from "react/jsx-runtime";
import {
  useSimClock,
  ie,
  mt,
  useToast,
  readPilotModel,
} from "../services/portalState.jsx";
import { downloadTextFile } from "../api/mockApi.jsx";
import {
  Badge,
  SegmentedControl,
  Card,
  Stat,
  Modal,
  Field,
  Toast,
  PageHeader,
  Callout,
  Button,
} from "../components/ui.jsx";
function kb(t) {
  let e = t >>> 0;
  return () => {
    e = (e + 1831565813) | 0;
    let a = e;
    return (
      (a = Math.imul(a ^ (a >>> 15), a | 1)),
      (a ^= a + Math.imul(a ^ (a >>> 7), a | 61)),
      ((a ^ (a >>> 14)) >>> 0) / 4294967296
    );
  };
}
var xb = {
  uber_eats: "UE",
  wolt: "W",
  lieferando: "L",
};
function yb(t, e) {
  let a = Math.floor(e() * 9999999)
    .toString()
    .padStart(7, "0");
  return `${xb[t]}-${a}`;
}
var Q3 = ["uber_eats", "wolt", "lieferando"];
function J3(t, e) {
  let r = kb(Math.floor(e) * 31 + t.length + 42),
    n = [];
  [
    ["matched", 102],
    ["short_paid", 7],
    ["missing_settlement", 5],
    ["over_paid", 4],
    ["under_review", 2],
  ].forEach(([g, p]) => {
    for (let u = 0; u < p; u++) n.push(g);
  });
  for (let g = n.length - 1; g > 0; g--) {
    let p = Math.floor(r() * (g + 1)),
      u = n[g];
    ((n[g] = n[p]), (n[p] = u));
  }
  let o = [
      "Delivery fee below agreed rate",
      "Fuel surcharge withheld by platform",
      "Zone surge not honoured",
      "Refunded to customer but not reversed on our side",
    ],
    l = [
      "Weekend bonus applied by platform",
      "Reliability bonus reconciled late",
      "Adjustment for missed webhook",
    ],
    d = [
      "Order flagged for fraud check",
      "Batched delivery, split unclear",
      "Address changed after pickup, pay re-quoted",
    ],
    c = [];
  for (let g = 0; g < 120; g++) {
    let p = t[g % Math.max(1, t.length)],
      u = p ? p.platform : Q3[g % Q3.length],
      s = p ? p.id : `ord-${String(1e3 + g).padStart(5, "0")}`,
      f = p?.revenue && p.revenue > 0 ? p.revenue : 4.5 + r() * 7.5,
      x = Math.round(f * 100),
      M = n[g] ?? "matched",
      h = x,
      m;
    M === "short_paid"
      ? ((h = x - Math.round(r() * 220 + 40)),
        (m = o[Math.floor(r() * o.length)]))
      : M === "over_paid"
        ? ((h = x + Math.round(r() * 180 + 30)),
          (m = l[Math.floor(r() * l.length)]))
        : M === "missing_settlement"
          ? (h = 0)
          : M === "under_review" &&
            ((h = x - Math.round(r() * 120)),
            (m = d[Math.floor(r() * d.length)]));
    let y = M !== "missing_settlement",
      k = y ? Math.round(r() * 260) : 0,
      L = h - x,
      w = y ? yb(u, r) : "\u2014";
    c.push({
      id: `rec-${String(g + 1).padStart(4, "0")}`,
      canonicalOrderId: s,
      externalOrderId: w,
      platform: u,
      expectedCents: x,
      paidCents: h,
      tipCents: k,
      deltaCents: L,
      status: M,
      note: m,
      createdAt: Math.max(0, Math.floor(e) - Math.floor(r() * 60 * 24 * 6)),
    });
  }
  return c;
}
function tx(t) {
  let e = [
      "id",
      "canonical_order_id",
      "external_order_id",
      "platform",
      "expected_eur",
      "paid_eur",
      "tip_eur",
      "delta_eur",
      "status",
      "note",
    ],
    a = (i) => (/[",\n]/.test(i) ? `"${i.replace(/"/g, '""')}"` : i),
    r = (i) => (i / 100).toFixed(2),
    n = t.map((i) =>
      [
        i.id,
        i.canonicalOrderId,
        i.externalOrderId,
        i.platform,
        r(i.expectedCents),
        r(i.paidCents),
        r(i.tipCents),
        r(i.deltaCents),
        i.status,
        i.note ?? "",
      ]
        .map((o) => a(String(o)))
        .join(","),
    );
  return [e.join(","), ...n].join(`
`);
}
var jn = {
    matched: "Matched",
    missing_settlement: "Missing settlement",
    short_paid: "Short paid",
    over_paid: "Over paid",
    under_review: "Under review",
    disputed: "Disputed",
    resolved: "Resolved",
  },
  ex = {
    matched: "good",
    missing_settlement: "crit",
    short_paid: "crit",
    over_paid: "warn",
    under_review: "warn",
    disputed: "accent",
    resolved: "good",
  },
  Lb = [
    {
      value: "all",
      label: "All platforms",
    },
    {
      value: "uber_eats",
      label: mt.uber_eats,
    },
    {
      value: "wolt",
      label: mt.wolt,
    },
    {
      value: "lieferando",
      label: mt.lieferando,
    },
  ],
  Mb = [
    {
      value: "all",
      label: "All statuses",
    },
    {
      value: "matched",
      label: jn.matched,
    },
    {
      value: "missing_settlement",
      label: jn.missing_settlement,
    },
    {
      value: "short_paid",
      label: jn.short_paid,
    },
    {
      value: "over_paid",
      label: jn.over_paid,
    },
    {
      value: "under_review",
      label: jn.under_review,
    },
    {
      value: "disputed",
      label: jn.disputed,
    },
    {
      value: "resolved",
      label: jn.resolved,
    },
  ],
  ax = [
    {
      platform: "uber_eats",
      hint: "Weekly file, Mondays",
      fakeFile: "uber_settlement_2026-09-14.csv",
      fakeRows: 214,
    },
    {
      platform: "wolt",
      hint: "Bi-weekly file",
      fakeFile: "wolt_payout_2026-09-15.csv",
      fakeRows: 138,
    },
    {
      platform: "lieferando",
      hint: "Monthly file",
      fakeFile: "lieferando_report_2026-08.csv",
      fakeRows: 471,
    },
  ],
  Sr = (t) => ie(t / 100, 2);
function ReconPage() {
  let t = readPilotModel(),
    { now: e } = useSimClock(),
    [a, r] = useToast(),
    [n, i] = Aa.useState("all"),
    [o, l] = Aa.useState("all"),
    [d, c] = Aa.useState(null),
    [g, p] = Aa.useState(null),
    [u, s] = Aa.useState({
      uber_eats: 0,
      wolt: 0,
      lieferando: 0,
    }),
    [f, x] = Aa.useState({}),
    M = Aa.useMemo(
      () => J3(t.orders, Math.floor(e)),
      [t.orders, e, u.uber_eats, u.wolt, u.lieferando],
    ),
    h = Aa.useMemo(
      () =>
        M.map((v) => {
          let E = f[v.id];
          return E
            ? {
                ...v,
                status: E.status ?? v.status,
                note: E.note ?? v.note,
              }
            : v;
        }),
      [M, f],
    ),
    m = Aa.useMemo(
      () =>
        h.filter(
          (v) =>
            (n === "all" || v.platform === n) &&
            (o === "all" || v.status === o),
        ),
      [h, n, o],
    ),
    y = Aa.useMemo(() => {
      let v = h.reduce((_, Mt) => _ + Mt.deltaCents, 0),
        E = h.filter((_) => _.status === "missing_settlement").length,
        Q = h.filter((_) => _.status === "disputed").length;
      return {
        total: h.length,
        totalDeltaCents: v,
        missing: E,
        disputed: Q,
      };
    }, [h]),
    k = (v) => {
      let E = ax.find((Q) => Q.platform === v);
      E &&
        (s((Q) => ({
          ...Q,
          [v]: Q[v] + 1,
        })),
        r(`Imported ${E.fakeRows} rows from ${E.fakeFile}`));
    },
    L = (v) =>
      c({
        item: v,
        reason: "",
      }),
    w = () => {
      d &&
        (x((v) => ({
          ...v,
          [d.item.id]: {
            status: "disputed",
            note: d.reason.trim() || d.item.note || "Disputed with platform",
          },
        })),
        r(`Dispute sent to ${mt[d.item.platform]} support`),
        c(null));
    },
    O = (v) => {
      (x((E) => ({
        ...E,
        [v.id]: {
          status: "resolved",
          note: E[v.id]?.note ?? v.note,
        },
      })),
        r(`${v.canonicalOrderId} marked resolved`));
    },
    A = async () => {
      let v = await downloadTextFile(
        `eels-payout-recon-${new Date().toISOString().slice(0, 10)}.csv`,
        tx(h),
        "text/csv",
      );
      r(
        v ? "Reconciliation CSV downloaded" : "Download blocked by the browser",
      );
    },
    j = y.totalDeltaCents / 100;
  return (
    <Y.Fragment>
      <PageHeader
        eyebrow="Finance operations"
        title="Payout Reconciliation"
        description="Weekly settlement files from Uber, Wolt, Lieferando matched to our canonical order IDs. Missing money surfaced automatically."
        actions=<Button onClick={A}>{"Export CSV"}</Button>
      />
      <div className="grid g4">
        <Stat label="Items in queue" value={y.total.toLocaleString("en-GB")} />
        <Stat
          label="Total delta"
          value={ie(j, 2)}
          tone={j < 0 ? "crit" : j > 0 ? "warn" : "good"}
          foot="Paid minus expected across all items"
        />
        <Stat
          label="Missing settlements"
          value={y.missing}
          tone={y.missing ? "crit" : "good"}
          foot="Orders with no matching payout row"
        />
        <Stat
          label="Disputed"
          value={y.disputed}
          tone={y.disputed ? "warn" : "good"}
          foot="Awaiting platform response"
        />
      </div>
      <Card
        title="Import settlement file"
        sub="Drop a CSV from each partner. The portal joins to our canonical order IDs, then updates the queue."
      >
        <div className="grid g3">
          {ax.map((v) =>
            Y.jsx(
              bb,
              {
                platform: v.platform,
                hint: v.hint,
                onFile: () => k(v.platform),
              },
              v.platform,
            ),
          )}
        </div>
      </Card>
      <Card
        title="Reconciliation queue"
        sub={`${m.length.toLocaleString("en-GB")} of ${y.total.toLocaleString("en-GB")} items`}
        actions=<div
          className="row wrap"
          style={{
            gap: 8,
          }}
        >
          <SegmentedControl
            value={n}
            options={Lb}
            onChange={i}
            label="Platform"
          />
          <SegmentedControl
            value={o}
            options={Mb}
            onChange={l}
            label="Status"
          />
        </div>
        flush={!0}
      >
        <div
          className="table-wrap table-scroll"
          style={{
            maxHeight: 560,
          }}
        >
          <table className="table">
            <thead>
              <tr>
                <th>{"Canonical order"}</th>
                <th>{"Platform"}</th>
                <th className="num">{"Expected"}</th>
                <th className="num">{"Paid"}</th>
                <th className="num">{"Tip"}</th>
                <th className="num">{"Delta"}</th>
                <th>{"Status"}</th>
                <th
                  style={{
                    width: 220,
                  }}
                >
                  {"Actions"}
                </th>
              </tr>
            </thead>
            <tbody>
              {m.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="small"
                    style={{
                      padding: 16,
                      textAlign: "center",
                      color: "var(--muted)",
                    }}
                  >
                    {"No items match these filters."}
                  </td>
                </tr>
              ) : (
                m.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <div>{v.canonicalOrderId}</div>
                      <div className="small muted">{v.externalOrderId}</div>
                    </td>
                    <td className="small">{mt[v.platform]}</td>
                    <td className="num">{Sr(v.expectedCents)}</td>
                    <td className="num">{Sr(v.paidCents)}</td>
                    <td className="num">{Sr(v.tipCents)}</td>
                    <td className="num">
                      <Badge
                        tone={
                          v.deltaCents < 0
                            ? "crit"
                            : v.deltaCents > 0
                              ? "warn"
                              : "neutral"
                        }
                      >
                        {Sr(v.deltaCents)}
                      </Badge>
                    </td>
                    <td>
                      <Badge tone={ex[v.status]}>{jn[v.status]}</Badge>
                    </td>
                    <td>
                      <div
                        className="row"
                        style={{
                          gap: 6,
                        }}
                      >
                        <Button size="sm" variant="ghost" onClick={() => p(v)}>
                          {"View"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => L(v)}
                          disabled={
                            v.status === "disputed" || v.status === "resolved"
                          }
                        >
                          {"Dispute"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => O(v)}
                          disabled={v.status === "resolved"}
                        >
                          {"Mark resolved"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <Callout>
        {
          "Uber settlement is weekly (Mon Tue), Wolt bi-weekly, Lieferando monthly. Tip data ships in settlement, not webhooks."
        }
      </Callout>
      {g && (
        <Modal
          title={`Recon item ${g.canonicalOrderId}`}
          onClose={() => p(null)}
        >
          <div className="stack-sm">
            <div>
              <div className="small muted">{"External order"}</div>
              <div>{g.externalOrderId}</div>
            </div>
            <div>
              <div className="small muted">{"Platform"}</div>
              <div>{mt[g.platform]}</div>
            </div>
            <div
              className="row"
              style={{
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div className="small muted">{"Expected"}</div>
                <div>{Sr(g.expectedCents)}</div>
              </div>
              <div>
                <div className="small muted">{"Paid"}</div>
                <div>{Sr(g.paidCents)}</div>
              </div>
              <div>
                <div className="small muted">{"Tip"}</div>
                <div>{Sr(g.tipCents)}</div>
              </div>
              <div>
                <div className="small muted">{"Delta"}</div>
                <div>{Sr(g.deltaCents)}</div>
              </div>
            </div>
            <div>
              <div className="small muted">{"Status"}</div>
              <Badge tone={ex[g.status]}>{jn[g.status]}</Badge>
            </div>
            {g.note && (
              <div>
                <div className="small muted">{"Note"}</div>
                <div>{g.note}</div>
              </div>
            )}
          </div>
        </Modal>
      )}
      {d && (
        <Modal
          title={`Dispute ${d.item.canonicalOrderId}`}
          onClose={() => c(null)}
          footer=<div
            className="row"
            style={{
              gap: 8,
              justifyContent: "flex-end",
            }}
          >
            <Button variant="ghost" onClick={() => c(null)}>
              {"Cancel"}
            </Button>
            <Button variant="primary" onClick={w}>
              {"Send to "}
              {mt[d.item.platform]}
              {" support"}
            </Button>
          </div>
        >
          <div className="stack-sm">
            <div className="small muted">
              {"Expected "}
              {Sr(d.item.expectedCents)}
              {" · Paid "}
              {Sr(d.item.paidCents)}
              {" · Delta"} {Sr(d.item.deltaCents)}
            </div>
            <Field
              id="dispute-reason"
              label="Reason"
              hint="Include order id and platform reference. Finance archives this text with the audit pack."
            >
              <textarea
                id="dispute-reason"
                className="input"
                rows={5}
                value={d.reason}
                onChange={(v) =>
                  c({
                    ...d,
                    reason: v.target.value,
                  })
                }
                placeholder="e.g. Short paid by €2.20, zone surge not applied for shift 18:00-22:00."
              />
            </Field>
          </div>
        </Modal>
      )}
      <Toast message={a} />
    </Y.Fragment>
  );
}
function bb({ platform: t, hint: e, onFile: a }) {
  let r = Aa.useRef(null),
    [n, i] = Aa.useState(!1),
    o = () => r.current?.click(),
    l = (d) => {
      let c = d.target.files?.[0];
      (c && a(c), (d.target.value = ""));
    };
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={o}
      onKeyDown={(d) => (d.key === "Enter" || d.key === " ") && o()}
      onDragOver={(d) => {
        (d.preventDefault(), i(!0));
      }}
      onDragLeave={() => i(!1)}
      onDrop={(d) => {
        (d.preventDefault(), i(!1));
        let c = d.dataTransfer.files?.[0];
        c && a(c);
      }}
      style={{
        border: `1px dashed ${n ? "var(--accent-ink, #2b6cb0)" : "var(--border, #d0d7de)"}`,
        background: n
          ? "var(--accent-bg, rgba(43, 108, 176, 0.06))"
          : "transparent",
        borderRadius: 10,
        padding: 16,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          fontWeight: 600,
        }}
      >
        {mt[t]}
      </div>
      <div className="small muted">{e}</div>
      <div className="small">{"Drop a .csv here or click to browse"}</div>
      <input
        ref={r}
        type="file"
        accept=".csv,text/csv"
        onChange={l}
        style={{
          display: "none",
        }}
        aria-label={`Upload ${mt[t]} settlement CSV`}
      />
    </div>
  );
}
export { ReconPage };
