// API sandbox and sample webhook payloads.
import * as an from "react";
import * as I from "react/jsx-runtime";
import { io, no, oo } from "./CanonicalStatePage.jsx";
import {
  Badge,
  SegmentedControl,
  Card,
  PageHeader,
  Callout,
  Button,
} from "../components/ui.jsx";
var nx = {
    event_id: "evt_01HZ6X5Q7K1V9R2N8M0P4T3B1A",
    event_type: "event.delivery_status",
    event_time: 1758204600,
    resource_href:
      "https://api.uber.com/v1/customers/cus_frankfurt_pilot/deliveries/del_9f1c",
    meta: {
      user_id: "cus_frankfurt_pilot",
      resource_id: "del_9f1c8d",
      status: "pickup_complete",
    },
    data: {
      id: "del_9f1c8d",
      quote_id: "qte_82ac41",
      status: "pickup_complete",
      complete: !1,
      kind: "delivery",
      live_mode: !0,
      tracking_url: "https://trk.uber.com/del_9f1c8d",
      courier: {
        name: "Amir K.",
        phone_number: "+49 176 12345678",
        location: {
          lat: 50.1109,
          lng: 8.6821,
        },
        vehicle_type: "bicycle",
      },
      pickup: {
        name: "Kim's Kitchen \u2014 Sachsenhausen",
        address: "Schweizer Str. 24, 60594 Frankfurt am Main, Germany",
        phone_number: "+49 69 555 0140",
        ready_dt: "2026-09-18T17:22:00Z",
        notes: "Ring bell at side entrance",
      },
      dropoff: {
        name: "S. Weber",
        address: "Textorstra\xDFe 88, 60594 Frankfurt am Main, Germany",
        phone_number: "+49 176 87654321",
      },
      tip: 150,
      fee: 690,
      currency: "eur",
    },
  },
  ix = {
    type: "order.notification",
    order: {
      id: "wolt_ord_5f81a2c4d3b8",
      venue_id: "venue_nordend_02",
      status: "ready",
      pickup_eta: "2026-09-18T17:28:00Z",
      delivery: {
        type: "homedelivery",
        location: {
          coordinates: {
            lat: 50.1289,
            lon: 8.6903,
          },
        },
      },
      order_number: "N-4021",
      company_name: "Trattoria Da Marco",
      price: {
        amount: 3480,
        currency: "EUR",
      },
      consumer_comment: "Please no cutlery, thanks!",
    },
  },
  ox = {
    event: "order_state",
    reference: "L-77219",
    state: "ready",
    restaurant_id: "rst_bornheim_11",
    received_at: "2026-09-18T17:19:31Z",
  };
function lx(t) {
  let e = t.trim();
  return e
    ? /^[a-f0-9]+$/i.test(e)
      ? e.length !== 64
        ? {
            ok: !1,
            reason: `Expected 64 hex chars for SHA-256, got ${e.length}`,
          }
        : {
            ok: !0,
            reason:
              "HMAC-SHA256 hex shape looks valid (real verify uses shared secret)",
          }
      : {
          ok: !1,
          reason: "Signature must be lowercase hex",
        }
    : {
        ok: !1,
        reason: "Missing x-uber-signature header",
      };
}
function dx(t) {
  let e = t.trim();
  if (!e)
    return {
      ok: !1,
      reason: "Missing JWT token",
    };
  let a = e.split(".");
  if (a.length !== 3)
    return {
      ok: !1,
      reason: `JWT must have 3 parts, got ${a.length}`,
    };
  if (a.some((r) => r.length === 0))
    return {
      ok: !1,
      reason: "JWT segments cannot be empty",
    };
  try {
    let r = a[0].length % 4 === 0 ? "" : "=".repeat(4 - (a[0].length % 4)),
      n = JSON.parse(atob(a[0].replace(/-/g, "+").replace(/_/g, "/") + r));
    if (n.alg !== "HS256")
      return {
        ok: !1,
        reason: `Unexpected alg ${n.alg}; expected HS256`,
      };
  } catch {
    return {
      ok: !1,
      reason: "JWT header is not valid base64url-encoded JSON",
    };
  }
  return {
    ok: !0,
    reason:
      "JWT shape and alg header look valid (real verify uses client secret)",
  };
}
var K2 = [
  {
    platform: "uber_eats",
    hasWebhooks: !0,
    hasCourierData: !0,
    hasTipData: !0,
    hasCashOrderFlag: !1,
    authScheme: "HMAC-SHA256",
    retryPolicy: "10s, 30s, 60s, 120s (max 4 retries, 24h drop)",
    eventTypes: [
      "event.delivery_status",
      "event.courier_update",
      "event.refund_request",
      "event.shopping_progress",
    ],
    gaps: [
      "No explicit courier_at_pickup event; inferred from status + courier location",
      "No structured cancellation stage \u2014 reason is a free-text field",
    ],
  },
  {
    platform: "wolt",
    hasWebhooks: !0,
    hasCourierData: !1,
    hasTipData: !1,
    hasCashOrderFlag: !1,
    authScheme: "JWT-HS256",
    retryPolicy: "Exponential backoff, 30s base, 6 attempts",
    eventTypes: [
      "order.received",
      "order.acknowledged",
      "order.production",
      "order.ready",
      "order.delivered",
      "order.rejected",
      "order.refunded",
    ],
    gaps: [
      "Merchant API exposes order state, not courier telemetry",
      "No tip data on the merchant channel (paid via consumer app)",
    ],
  },
  {
    platform: "lieferando",
    hasWebhooks: !1,
    hasCourierData: !1,
    hasTipData: !1,
    hasCashOrderFlag: !0,
    authScheme: "POS-manual",
    retryPolicy:
      "Not applicable \u2014 POS pushes on state change; manual entry otherwise",
    eventTypes: ["order_state"],
    gaps: [
      "No public partner API \u2014 integration is POS-adapter or CSV import",
      "No signed transport; integrity relies on the POS network boundary",
      "Cash orders exist and must be flagged for payroll reconciliation",
    ],
  },
];
function Y0(t) {
  let e = 3735928559 ^ t.length,
    a = 1103547991 ^ t.length;
  for (let i = 0; i < t.length; i++) {
    let o = t.charCodeAt(i);
    ((e = Math.imul(e ^ o, 2654435761)), (a = Math.imul(a ^ o, 1597334677)));
  }
  ((e =
    Math.imul(e ^ (e >>> 16), 2246822507) ^
    Math.imul(a ^ (a >>> 13), 3266489909)),
    (a =
      Math.imul(a ^ (a >>> 16), 2246822507) ^
      Math.imul(e ^ (e >>> 13), 3266489909)));
  let r = (a >>> 0).toString(16).padStart(8, "0"),
    n = (e >>> 0).toString(16).padStart(8, "0");
  return `idk_${r}${n}`;
}
var Y2 = {
    uber_eats: nx,
    wolt: ix,
    lieferando: ox,
  },
  X0 = {
    uber_eats: "Uber Eats",
    wolt: "Wolt",
    lieferando: "Lieferando",
  };
function cx(t, e) {
  if (!e || typeof e != "object") return null;
  let a = e;
  if (t === "uber_eats") {
    let r = a.data;
    return typeof r?.status == "string" ? r.status : null;
  }
  if (t === "wolt") {
    let r = a.order;
    return typeof r?.status == "string" ? r.status : null;
  }
  return typeof a.state == "string" ? a.state : null;
}
function sx(t, e) {
  if (!e || typeof e != "object") return null;
  let a = e;
  if (t === "uber_eats")
    return typeof a.event_id == "string" ? a.event_id : null;
  if (t === "wolt") {
    let r = a.order;
    return typeof r?.id == "string" ? r.id : null;
  }
  return typeof a.reference == "string" ? a.reference : null;
}
function ux(t, e) {
  if (!e) return null;
  let a = e.toLowerCase().trim();
  return t === "uber_eats"
    ? a in no
      ? no[a]
      : null
    : t === "wolt"
      ? a in io
        ? io[a]
        : null
      : a in oo
        ? oo[a]
        : null;
}
function wb(t) {
  return K2.find((e) => e.platform === t)?.retryPolicy ?? "\u2014";
}
function hx(t) {
  return K2.find((e) => e.platform === t)?.authScheme ?? "\u2014";
}
function px(t) {
  try {
    return {
      ok: !0,
      value: JSON.parse(t),
    };
  } catch (e) {
    return {
      ok: !1,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}
var Cb = "3c8f9a12b46d5e7f1a2c9b0d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f50617",
  Sb =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmRlcl9pZCI6IndvbHRfb3JkXzVmODFhMmM0ZDNiOCIsInN0YXR1cyI6InJlYWR5In0.5RxK9c-3hV8mQ2LpN1t7fJb0aY6dU4wZzXrHsGvKoAE";
function gx(t) {
  return t === "uber_eats" ? Cb : t === "wolt" ? Sb : "";
}
function fx(t, e) {
  return t === "uber_eats"
    ? lx(e)
    : t === "wolt"
      ? dx(e)
      : {
          ok: !0,
          reason:
            "Lieferando integration is POS-adapter or CSV \u2014 no cryptographic transport",
        };
}
function ApiSandboxPage() {
  let [t, e] = an.useState("uber_eats"),
    [a, r] = an.useState(!1),
    [n, i] = an.useState({
      uber_eats: JSON.stringify(Y2.uber_eats, null, 2),
      wolt: JSON.stringify(Y2.wolt, null, 2),
      lieferando: JSON.stringify(Y2.lieferando, null, 2),
    }),
    [o, l] = an.useState(gx("uber_eats")),
    [d, c] = an.useState(""),
    [g, p] = an.useState(""),
    [u, s] = an.useState(null),
    f = (j) => {
      (e(j), l(gx(j)), r(!1));
    },
    x = n[t],
    M = an.useMemo(() => px(x), [x]),
    h = M.ok ? M.value : null,
    m = cx(t, h),
    y = ux(t, m),
    k = sx(t, h),
    L = k ? Y0(k) : null,
    w = fx(t, o),
    O = () => {
      i((j) => ({
        ...j,
        [t]: JSON.stringify(Y2[t], null, 2),
      }));
    },
    A = () => {
      let j = px(d),
        v = j.ok ? j.value : null,
        E = cx(t, v),
        Q = ux(t, E),
        _ = sx(t, v);
      s({
        verified: fx(t, g),
        parsed: j.ok
          ? {
              ok: !0,
            }
          : {
              ok: !1,
              error: j.error,
            },
        raw: E,
        canonical: Q,
        idempotency: _ ? Y0(_) : null,
      });
    };
  return (
    <I.Fragment>
      <PageHeader
        eyebrow="Adapters"
        title="Platform API Sandbox"
        description="Prove out Uber Eats, Wolt, and Lieferando adapters with real event shapes. Signature verification live."
        actions=<SegmentedControl
          value={t}
          onChange={f}
          options={[
            {
              value: "uber_eats",
              label: "Uber Eats",
            },
            {
              value: "wolt",
              label: "Wolt",
            },
            {
              value: "lieferando",
              label: "Lieferando",
            },
          ]}
          label="Platform"
        />
      />
      <div className="grid g2">
        <Card
          title={`Sample event \xB7 ${X0[t]}`}
          sub={
            a
              ? "Edit and the mapping updates on the right"
              : "Realistic payload matching the partner's public docs"
          }
          actions=<I.Fragment>
            <Button size="sm" onClick={() => r((j) => !j)}>
              {a ? "Preview" : "Edit"}
            </Button>
            {a && (
              <Button size="sm" variant="ghost" onClick={O}>
                {"Reset"}
              </Button>
            )}
          </I.Fragment>
        >
          {a ? (
            <textarea
              className="textarea mono"
              style={{
                minHeight: 420,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
              value={x}
              onChange={(j) =>
                i((v) => ({
                  ...v,
                  [t]: j.target.value,
                }))
              }
              aria-label="Sample event JSON"
            />
          ) : (
            <pre
              className="code mono"
              style={{
                maxHeight: 420,
                overflow: "auto",
              }}
            >
              {x}
            </pre>
          )}
          {!M.ok && (
            <div
              className="stack-sm"
              style={{
                marginTop: 10,
              }}
            >
              <Badge tone="crit">{"JSON parse error"}</Badge>
              <span className="small muted">{M.error}</span>
            </div>
          )}
        </Card>
        <Card
          title="Verification & mapping"
          sub="What the ingestion pipeline would do next"
        >
          <div className="stack">
            <div className="stack-sm">
              <div className="field-label">
                {"Signature verification ("}
                {hx(t)}
                {")"}
              </div>
              <div className="row wrap">
                <Badge tone={w.ok ? "good" : "crit"}>
                  {w.ok ? "verified" : "rejected"}
                </Badge>
                {w.reason && <span className="small text-2">{w.reason}</span>}
              </div>
              {t !== "lieferando" && (
                <label
                  className="stack-sm"
                  style={{
                    marginTop: 6,
                  }}
                >
                  <span className="field-label">
                    {t === "uber_eats"
                      ? "x-uber-signature header (hex)"
                      : "Wolt JWT (compact)"}
                  </span>
                  <textarea
                    className="textarea mono small"
                    style={{
                      minHeight: 70,
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                    }}
                    value={o}
                    onChange={(j) => l(j.target.value)}
                    aria-label="Signature credential"
                  />
                </label>
              )}
            </div>
            <div className="stack-sm">
              <div className="field-label">{"Canonical state mapping"}</div>
              <div className="row wrap">
                <code className="mono small">{m ?? "\u2014"}</code>
                <span className="muted small">{"→"}</span>
                {y ? (
                  <Badge tone="accent">{y}</Badge>
                ) : (
                  <Badge tone="warn">{"unmapped"}</Badge>
                )}
              </div>
              <p
                className="small text-2"
                style={{
                  margin: 0,
                }}
              >
                {"Mapping table lives in "}
                <code className="mono">{"src/lib/canonicalState.ts"}</code>
                {". Unknown statuses are rejected, never guessed."}
              </p>
            </div>
            <div className="stack-sm">
              <div className="field-label">
                {"Idempotency key (derived from event id)"}
              </div>
              <code className="mono small">
                {L ?? "\u2014 (no event id in payload)"}
              </code>
              <p
                className="small text-2"
                style={{
                  margin: 0,
                }}
              >
                {
                  "Sandbox uses a fast non-cryptographic hash. The backend derives a SHA-1 of the event id so platform retries are safe."
                }
              </p>
            </div>
            <div className="stack-sm">
              <div className="field-label">
                {"Retry policy for "}
                {X0[t]}
              </div>
              <span className="small text-2">{wb(t)}</span>
            </div>
          </div>
        </Card>
      </div>
      <Card
        title="Capabilities matrix"
        sub="What each partner's channel actually gives us"
        flush={!0}
      >
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{"Capability"}</th>
                <th>{"Uber Eats"}</th>
                <th>{"Wolt"}</th>
                <th>{"Lieferando"}</th>
              </tr>
            </thead>
            <tbody>
              <Mi
                label="Signed webhooks"
                pick={(j) => j.hasWebhooks}
                kind="bool"
              />
              <Mi
                label="Courier telemetry"
                pick={(j) => j.hasCourierData}
                kind="bool"
              />
              <Mi
                label="Tip data on the feed"
                pick={(j) => j.hasTipData}
                kind="bool"
              />
              <Mi
                label="Cash-order flag"
                pick={(j) => j.hasCashOrderFlag}
                kind="bool"
              />
              <Mi label="Auth scheme" pick={(j) => j.authScheme} kind="text" />
              <Mi
                label="Retry policy"
                pick={(j) => j.retryPolicy}
                kind="text"
              />
              <Mi
                label="Event types"
                pick={(j) => j.eventTypes.join(", ")}
                kind="text"
              />
              <Mi
                label="Known gaps"
                pick={(j) => (
                  <ul
                    className="small stack-sm"
                    style={{
                      margin: 0,
                      paddingLeft: 16,
                    }}
                  >
                    {j.gaps.map((v) => (
                      <li key={v}>{v}</li>
                    ))}
                  </ul>
                )}
                kind="node"
              />
            </tbody>
          </table>
        </div>
      </Card>
      <Card
        title="Try it: paste your own event"
        sub={`Runs the ${hx(t)} shape-check plus the canonical mapping for ${X0[t]}`}
      >
        <div className="grid g2">
          <div className="stack-sm">
            <label className="field-label" htmlFor="custom-body">
              {"Event JSON"}
            </label>
            <textarea
              id="custom-body"
              className="textarea mono"
              style={{
                minHeight: 220,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
              value={d}
              onChange={(j) => c(j.target.value)}
              placeholder="Paste an event body here…"
            />
            {t !== "lieferando" && (
              <I.Fragment>
                <label className="field-label" htmlFor="custom-cred">
                  {t === "uber_eats" ? "x-uber-signature (hex)" : "Wolt JWT"}
                </label>
                <textarea
                  id="custom-cred"
                  className="textarea mono small"
                  style={{
                    minHeight: 70,
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, monospace",
                  }}
                  value={g}
                  onChange={(j) => p(j.target.value)}
                  placeholder={
                    t === "uber_eats"
                      ? "64 hex chars"
                      : "header.payload.signature"
                  }
                />
              </I.Fragment>
            )}
            <div className="row">
              <Button variant="primary" onClick={A}>
                {"Verify & map"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  (c(""), p(""), s(null));
                }}
              >
                {"Clear"}
              </Button>
            </div>
          </div>
          <div className="stack-sm">
            <div className="field-label">{"Result"}</div>
            {u ? (
              <div className="stack-sm">
                <div className="row wrap">
                  <Badge tone={u.parsed.ok ? "good" : "crit"}>
                    {u.parsed.ok ? "JSON parsed" : "JSON invalid"}
                  </Badge>
                  {u.parsed.error && (
                    <span className="small text-2">{u.parsed.error}</span>
                  )}
                </div>
                <div className="row wrap">
                  <Badge tone={u.verified.ok ? "good" : "crit"}>
                    {u.verified.ok ? "signature ok" : "signature rejected"}
                  </Badge>
                  {u.verified.reason && (
                    <span className="small text-2">{u.verified.reason}</span>
                  )}
                </div>
                <div className="row wrap">
                  <span className="field-label">{"Mapping:"}</span>
                  <code className="mono small">{u.raw ?? "\u2014"}</code>
                  <span className="muted small">{"→"}</span>
                  {u.canonical ? (
                    <Badge tone="accent">{u.canonical}</Badge>
                  ) : (
                    <Badge tone="warn">{"unmapped"}</Badge>
                  )}
                </div>
                <div className="row wrap">
                  <span className="field-label">{"Idempotency:"}</span>
                  <code className="mono small">
                    {u.idempotency ?? "\u2014"}
                  </code>
                </div>
              </div>
            ) : (
              <p className="small muted">
                {"Paste an event and press Verify & map."}
              </p>
            )}
          </div>
        </div>
      </Card>
      <Callout>
        {"Real HMAC-SHA256 + JWT verification is implemented in "}
        <code className="mono">{"src/lib/adapters.ts"}</code>
        {
          ". This sandbox demonstrates the full event shape and mapping — the shape-checks here mirror what the backend does before running the cryptographic verify with the shared secret."
        }
      </Callout>
    </I.Fragment>
  );
}
function Mi({ label: t, pick: e, kind: a }) {
  let r = (n) => {
    let i = K2.find((l) => l.platform === n);
    if (!i) return <span className="muted">{"—"}</span>;
    let o = e(i);
    return a === "bool" ? (
      o ? (
        <Badge tone="good">{"yes"}</Badge>
      ) : (
        <Badge tone="neutral">{"no"}</Badge>
      )
    ) : a === "text" ? (
      <span className="small">{o}</span>
    ) : (
      o
    );
  };
  return (
    <tr>
      <td className="bold">{t}</td>
      <td>{r("uber_eats")}</td>
      <td>{r("wolt")}</td>
      <td>{r("lieferando")}</td>
    </tr>
  );
}
export { ApiSandboxPage };
