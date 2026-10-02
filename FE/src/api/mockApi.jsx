// In-browser mock API (OpenAPI-shaped routes), webhook signature checks, and the API Hub screen.
import * as De from "react";
import * as W from "react/jsx-runtime";
import { U } from "../config.js";
import {
  opsStore,
  useOpsStore,
  simClock,
  Ln,
  Mn,
  S2,
  f2,
  m2,
  ml,
  useToast,
  pi,
  qr,
  rt,
  sr,
  to,
  getPilotModel,
  v2,
} from "../services/portalState.jsx";
import { tn } from "../pages/AdminPage.jsx";
import { bn, j2 } from "../services/copilotEngine.js";
import {
  Badge,
  Card,
  Field,
  Toast,
  PageHeader,
  Tabs,
  Callout,
  Button,
} from "../components/ui.jsx";
import { Pd, gl, o2, xr } from "../components/icons.jsx";
class ApiError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}
const Kd = new TextEncoder();
function pM(t) {
  return [...new Uint8Array(t)]
    .map((e) => e.toString(16).padStart(2, "0"))
    .join("");
}
function H2(t) {
  let e = typeof t == "string" ? Kd.encode(t) : t,
    a = "";
  for (let r of e) a += String.fromCharCode(r);
  return btoa(a).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function O5(t) {
  let e = t.length % 4 === 0 ? "" : "=".repeat(4 - (t.length % 4)),
    a = atob(t.replace(/-/g, "+").replace(/_/g, "/") + e);
  return new TextDecoder().decode(Uint8Array.from(a, (r) => r.charCodeAt(0)));
}
async function O0(t) {
  return crypto.subtle.importKey(
    "raw",
    Kd.encode(t),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    !1,
    ["sign"],
  );
}
async function E0(t, e) {
  return pM(await crypto.subtle.sign("HMAC", await O0(e), Kd.encode(t)));
}
function E5(t, e) {
  if (t.length !== e.length) return !1;
  let a = 0;
  for (let r = 0; r < t.length; r++) a |= t.charCodeAt(r) ^ e.charCodeAt(r);
  return a === 0;
}
async function H5(t, e, a) {
  return E5(await E0(t, a), e.toLowerCase());
}
async function R5(t, e) {
  let a = H2(
      JSON.stringify({
        alg: "HS256",
        typ: "JWT",
      }),
    ),
    r = H2(JSON.stringify(t)),
    n = new Uint8Array(
      await crypto.subtle.sign("HMAC", await O0(e), Kd.encode(`${a}.${r}`)),
    );
  return `${a}.${r}.${H2(n)}`;
}
async function D5(t, e) {
  let a = t.split(".");
  if (a.length !== 3)
    throw new ApiError("invalid_payload", "Token must have three parts");
  let r = JSON.parse(O5(a[0]));
  if (r.alg !== "HS256")
    throw new ApiError("bad_signature", `Unexpected algorithm ${r.alg}`);
  let n = new Uint8Array(
    await crypto.subtle.sign("HMAC", await O0(e), Kd.encode(`${a[0]}.${a[1]}`)),
  );
  if (!E5(H2(n), a[2]))
    throw new ApiError("bad_signature", "JWT signature does not match");
  return JSON.parse(O5(a[1]));
}
function z5(t) {
  if (!t || t.kind !== "event.delivery_status" || !t.delivery_id)
    throw new ApiError("invalid_payload", "Not a delivery status event");
  let e;
  switch (t.status) {
    case "pending":
      e = "accepted";
      break;
    case "pickup":
      e = t.data.courier_at_pickup ? "arrived_pickup" : "accepted";
      break;
    case "pickup_complete":
      e = "picked_up";
      break;
    case "dropoff":
      e = t.data.courier_at_dropoff ? "arrived_dropoff" : "picked_up";
      break;
    case "delivered":
      e = "delivered";
      break;
    case "canceled":
    case "returned":
      e = "cancelled";
      break;
    default:
      throw new ApiError("unknown_status", `Unknown status ${t.status}`);
  }
  let a = t.data.cancelation;
  return {
    eventId: t.id,
    platform: "uber_eats",
    externalOrderId: t.delivery_id,
    type: e,
    occurredAt: t.created,
    driverRef: t.data.courier?.ref ?? null,
    zoneRef: t.data.zone_ref ?? null,
    deadlineOriginal: t.data.dropoff_deadline ?? null,
    deadlineUpdated: t.data.dropoff_eta ?? t.data.dropoff_deadline ?? null,
    batchId: t.data.batch_id ?? null,
    cancellation:
      e === "cancelled"
        ? {
            stage: U5(a?.stage),
            initiatedBy: H0(a?.initiated_by),
            reason:
              a?.reason ??
              t.data.undeliverable_reason ??
              (t.status === "returned" ? "Returned" : "Not given"),
            supportRef: a?.support_ref ?? null,
          }
        : null,
  };
}
function V5(t) {
  if (!t?.details?.order_id)
    throw new ApiError("invalid_payload", "Missing order id");
  let e = {
    "order.received": "accepted",
    "order.pickup_started": "accepted",
    "order.pickup_arrival": "arrived_pickup",
    "order.picked_up": "picked_up",
    "order.dropoff_arrival": "arrived_dropoff",
    "order.delivered": "delivered",
    "order.dropoff_completed": "delivered",
    "order.rejected": "cancelled",
    "order.customer_no_show": "cancelled",
  };
  if (t.type === "order.location_updated") return null;
  let a = e[t.type];
  if (!a) throw new ApiError("unknown_status", `Unknown event ${t.type}`);
  return {
    eventId: t.id,
    platform: "wolt",
    externalOrderId: t.details.order_id,
    type: a,
    occurredAt: t.created_at,
    driverRef: t.details.courier_id ?? null,
    zoneRef: t.details.zone ?? null,
    deadlineOriginal: t.details.promised_dropoff ?? null,
    deadlineUpdated:
      t.details.dropoff_eta ?? t.details.promised_dropoff ?? null,
    batchId: t.details.batch ?? null,
    cancellation:
      a === "cancelled"
        ? {
            stage:
              t.type === "order.customer_no_show"
                ? "at_dropoff"
                : U5(t.details.stage),
            initiatedBy:
              t.type === "order.customer_no_show"
                ? "customer"
                : H0(t.details.cancelled_by),
            reason:
              t.type === "order.customer_no_show"
                ? "Customer not available"
                : (t.details.reason ?? "Not given"),
            supportRef: null,
          }
        : null,
  };
}
function P5(t, e, a) {
  let r = {
      platform: t,
      externalOrderId: e.order_id,
      driverRef: e.courier_id || null,
      zoneRef: e.zone || null,
      deadlineOriginal: e.promised_at || null,
      deadlineUpdated: e.promised_at || null,
      batchId: null,
    },
    n = [],
    i = (l, d, c = null) =>
      n.push({
        ...r,
        eventId: `${t}-${e.order_id}-${l}-${a}`,
        type: l,
        occurredAt: d,
        cancellation: c,
      });
  (e.accepted_at && i("accepted", e.accepted_at),
    e.picked_up_at && i("picked_up", e.picked_up_at));
  let o = e.status.toLowerCase();
  return (
    o === "delivered" && e.delivered_at
      ? i("delivered", e.delivered_at)
      : o.startsWith("cancel") &&
        i("cancelled", e.delivered_at || e.picked_up_at || e.accepted_at, {
          stage: e.picked_up_at ? "after_pickup" : "before_pickup",
          initiatedBy: H0(e.cancelled_by),
          reason: e.cancel_reason || "Not given",
          supportRef: null,
        }),
    n
  );
}
function H0(t) {
  let e = (t ?? "").toLowerCase();
  return e.includes("merchant") ||
    e.includes("restaurant") ||
    e.includes("store")
    ? "restaurant"
    : e.includes("courier") || e.includes("driver") || e.includes("rider")
      ? "driver"
      : e.includes("customer") || e.includes("eater")
        ? "customer"
        : "platform";
}
function U5(t) {
  let e = (t ?? "").toLowerCase();
  return e.includes("dropoff") || e.includes("customer")
    ? "at_dropoff"
    : e.includes("after") || e.includes("transit") || e.includes("picked")
      ? "after_pickup"
      : e.includes("pickup") || e.includes("store") || e.includes("restaurant")
        ? "at_pickup"
        : "before_pickup";
}
function gM(t, e) {
  let a = t.replace(/^﻿/, ""),
    r = a.split(/\r?\n/, 1)[0] ?? "",
    n = e ?? (r.split(";").length > r.split(",").length ? ";" : ","),
    i = [],
    o = [],
    l = "",
    d = !1;
  for (let c = 0; c < a.length; c++) {
    let g = a[c];
    d
      ? g === '"'
        ? a[c + 1] === '"'
          ? ((l += '"'), c++)
          : (d = !1)
        : (l += g)
      : g === '"'
        ? (d = !0)
        : g === n
          ? (o.push(l), (l = ""))
          : g ===
                `
` || g === "\r"
            ? (g === "\r" &&
                a[c + 1] ===
                  `
` &&
                c++,
              o.push(l),
              (l = ""),
              o.some((p) => p.trim() !== "") && i.push(o),
              (o = []))
            : (l += g);
  }
  return (o.push(l), o.some((c) => c.trim() !== "") && i.push(o), i);
}
function I5(t, e, a) {
  let r = gM(t);
  if (r.length === 0)
    return {
      rows: [],
      errors: [
        {
          line: 0,
          message: "The file is empty",
        },
      ],
      missingColumns: e,
    };
  let n = r[0].map((d) => d.trim().toLowerCase()),
    i = e.filter((d) => !n.includes(d)),
    o = [],
    l = [];
  return i.length
    ? {
        rows: o,
        errors: l,
        missingColumns: i,
      }
    : (r.slice(1).forEach((d, c) => {
        let g = {};
        n.forEach((u, s) => (g[u] = (d[s] ?? "").trim()));
        let p = a?.(g) ?? null;
        p
          ? l.push({
              line: c + 2,
              message: p,
            })
          : o.push(g);
      }),
      {
        rows: o,
        errors: l,
        missingColumns: i,
      });
}
function $5(t) {
  if (t.length === 0) return "";
  let e = Object.keys(t[0]),
    a = (r) => {
      let n = r == null ? "" : String(r);
      return /[",\n;]/.test(n) ? `"${n.replace(/"/g, '""')}"` : n;
    };
  return [e.join(","), ...t.map((r) => e.map((n) => a(r[n])).join(","))].join(`
`);
}
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
var Ra = () => S2(getPilotModel(), simClock.get().now, opsStore.get()),
  Sn = (t) => (t === null ? null : Math.round(t * 10) / 10),
  Ba = (t) =>
    t === void 0
      ? null
      : `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(Math.floor(t % 60)).padStart(2, "0")}`,
  R0 = {
    name: "platform",
    in: "path",
    required: !0,
    description: "Platform id",
    enum: ["uber_eats", "wolt", "lieferando"],
    example: "wolt",
  },
  Yd = {
    uber_eats: "demo-uber-signing-key",
    wolt: "demo-wolt-client-secret",
    lieferando: "demo-lieferando-key",
  },
  API_ROUTES = [
    {
      method: "GET",
      path: "/kpis/scorecard",
      tag: "KPIs",
      summary: "Daily performance scorecard",
      description:
        "Internal PTOD, platform scores, cancellations and pickup punctuality with counts, by zone and period.",
      params: [
        {
          name: "zone",
          in: "query",
          description: "Zone id filter",
          example: "sachsenhausen",
        },
      ],
      handler: ({ query: t }) => {
        let e = Ra(),
          a = t.zone ? e.byZone.filter((r) => r.zoneId === t.zone) : e.byZone;
        return {
          asOf: Ba(e.now),
          internal: e.internal,
          platforms: e.byDefinition.map((r) => ({
            definitionId: r.def.id,
            label: r.def.label,
            verified: r.def.verified,
            onTime: r.score.num,
            units: r.score.den,
            pct: Sn(r.score.pct),
            target: r.def.target,
          })),
          cancellation: e.cancellation,
          pickupPunctuality: e.pickupPunctuality,
          wrongOrMissing: e.wrongOrMissing,
          zones: a.map((r) => ({
            zoneId: r.zoneId,
            name: r.name,
            ptod: r.ptod,
            cancellation: r.cancel,
          })),
          periods: e.byPeriod,
          combinedZones: qr(a.map((r) => r.ptod)),
        };
      },
    },
    {
      method: "GET",
      path: "/kpis/definitions",
      tag: "KPIs",
      summary: "KPI definition registry",
      handler: () => opsStore.get().definitions,
    },
    {
      method: "PUT",
      path: "/kpis/definitions/{platform}",
      tag: "KPIs",
      summary: "Update a platform's KPI definition",
      params: [
        {
          ...R0,
          enum: ["internal", "uber_eats", "wolt", "lieferando"],
        },
      ],
      body: {
        contentType: "application/json",
        description: "Fields to change",
        example: {
          toleranceMin: 3,
          target: 96,
          verified: !1,
        },
      },
      handler: ({ params: t, body: e }) => {
        let a = opsStore.get().definitions,
          r = a.find((l) => l.id === t.platform);
        if (!r) throw new HttpError(404, `No definition ${t.platform}`);
        let n = e ?? {},
          i = [
            "measuredEvent",
            "deadlineBasis",
            "toleranceMin",
            "excludeRestaurantWait",
            "excludeCustomerWait",
            "cancellations",
            "window",
            "batchRule",
            "target",
            "verified",
            "source",
            "notes",
            "label",
          ],
          o = {
            ...r,
          };
        for (let l of i) l in n && (o[l] = n[l]);
        return (
          opsStore.set({
            definitions: a.map((l) => (l.id === r.id ? o : l)),
          }),
          o
        );
      },
    },
    {
      method: "POST",
      path: "/kpis/calculate",
      tag: "KPIs",
      summary: "Run a KPI formula",
      description: "type: ptod | combine | eod | required_drivers | margin",
      body: {
        contentType: "application/json",
        description: "Formula inputs",
        example: {
          type: "eod",
          targetPct: 98.5,
          expectedTotal: 500,
          completedSoFar: 200,
          onTimeSoFar: 180,
        },
      },
      handler: ({ body: t }) => {
        let e = t ?? {},
          a = (r) => {
            let n = Number(e[r]);
            if (!Number.isFinite(n))
              throw new HttpError(400, `${r} must be a number`);
            return n;
          };
        switch (e.type) {
          case "ptod":
            return f2(a("onTime"), a("eligible"));
          case "combine":
            return qr(e.parts ?? []);
          case "eod":
            return ml({
              targetPct: a("targetPct"),
              expectedTotal: a("expectedTotal"),
              completedSoFar: a("completedSoFar"),
              onTimeSoFar: a("onTimeSoFar"),
            });
          case "required_drivers":
            return Ln(
              a("ordersPerHour"),
              a("minutesPerOrder"),
              a("utilisation"),
            );
          case "margin": {
            let r = m2(a("deadline"), a("predicted"));
            return {
              margin: r,
              band: v2(r),
            };
          }
          default:
            throw new HttpError(
              400,
              "type must be one of ptod, combine, eod, required_drivers, margin",
            );
        }
      },
    },
    {
      method: "GET",
      path: "/kpis/eod-forecast",
      tag: "KPIs",
      summary: "End-of-day PTOD forecast",
      handler: () => {
        let t = Ra();
        return {
          asOf: Ba(t.now),
          targetPct: opsStore.get().targetPct,
          expectedTotal: t.expectedTotal,
          completedSoFar: t.completed.length,
          onTimeSoFar: t.internal.num,
          ...t.eod,
        };
      },
    },
    {
      method: "GET",
      path: "/orders",
      tag: "Orders and risk",
      summary: "Orders visible at the current time",
      params: [
        {
          name: "status",
          in: "query",
          description: "active | done | cancelled",
          enum: ["active", "done", "cancelled"],
        },
        {
          name: "zone",
          in: "query",
          description: "Zone id",
        },
        {
          name: "platform",
          in: "query",
          description: "Platform id",
          enum: ["uber_eats", "wolt", "lieferando"],
        },
        {
          name: "limit",
          in: "query",
          description: "Max rows (default 50)",
          example: "20",
        },
      ],
      handler: ({ query: t }) => {
        let e = Ra(),
          a = e.visible.map((n) => ({
            o: n,
            stage: sr(n, e.now),
          }));
        (t.status === "active" &&
          (a = a.filter(
            (n) => !["done", "cancelled", "not_started"].includes(n.stage),
          )),
          t.status === "done" && (a = a.filter((n) => n.stage === "done")),
          t.status === "cancelled" &&
            (a = a.filter((n) => n.stage === "cancelled")),
          t.zone && (a = a.filter((n) => n.o.zoneId === t.zone)),
          t.platform && (a = a.filter((n) => n.o.platform === t.platform)));
        let r = Math.min(500, Number(t.limit) || 50);
        return a
          .slice(-r)
          .reverse()
          .map(({ o: n, stage: i }) => ({
            id: n.id,
            platform: n.platform,
            zone: n.zoneId,
            restaurantId: n.restaurantId,
            driverId: n.driverId,
            stage: i,
            createdAt: Ba(n.createdAt),
            deadline: Ba(n.deadlineUpdated),
            deliveredAt: Ba(n.actual.delivered),
            cancellation: n.cancellation ?? null,
          }));
      },
    },
    {
      method: "GET",
      path: "/orders/{id}/timeline",
      tag: "Orders and risk",
      summary: "Planned vs actual timeline and delay attribution",
      params: [
        {
          name: "id",
          in: "path",
          required: !0,
          description: "Order id",
          example: "FRA-0300",
        },
      ],
      handler: ({ params: t }) => {
        let e = Ra(),
          a = e.visible.find((n) => n.id === t.id);
        if (!a)
          throw new HttpError(
            404,
            `Order ${t.id} not found or not yet created`,
          );
        let r = [
          "accepted",
          "arrivedPickup",
          "pickedUp",
          "arrivedDropoff",
          "delivered",
        ];
        return {
          id: a.id,
          stage: sr(a, e.now),
          deadlineOriginal: Ba(a.deadlineOriginal),
          deadlineUpdated: Ba(a.deadlineUpdated),
          events: r.map((n) => ({
            event: n,
            planned: Ba(a.planned[n]),
            actual:
              a.actual[n] !== void 0 && a.actual[n] <= e.now
                ? Ba(a.actual[n])
                : null,
          })),
          attribution:
            a.actual.delivered !== void 0 && a.actual.delivered <= e.now
              ? pi(a)
              : null,
          cancellation:
            a.cancellation && a.cancellation.at <= e.now
              ? a.cancellation
              : null,
        };
      },
    },
    {
      method: "GET",
      path: "/risk/active",
      tag: "Orders and risk",
      summary: "Active orders with predicted completion and alert band",
      params: [
        {
          name: "band",
          in: "query",
          description: "green | amber | red",
          enum: ["green", "amber", "red"],
        },
      ],
      handler: ({ query: t }) =>
        Ra()
          .active.filter((e) => !t.band || e.prediction.band === t.band)
          .map((e) => ({
            orderId: e.order.id,
            zone: e.order.zoneId,
            platform: e.order.platform,
            stage: e.stage,
            deadline: Ba(e.prediction.deadline),
            predictedCompletion: Ba(e.prediction.predictedCompletion),
            marginMin: Sn(e.prediction.margin),
            band: e.prediction.band,
            likelyCause: e.prediction.likelyCause,
          })),
    },
    {
      method: "POST",
      path: "/risk/{orderId}/escalate",
      tag: "Orders and risk",
      summary: "Escalate an at-risk order and record the cause",
      params: [
        {
          name: "orderId",
          in: "path",
          required: !0,
          description: "Order id",
          example: "FRA-0300",
        },
      ],
      body: {
        contentType: "application/json",
        description: "Cause and note",
        example: {
          cause: "Restaurant not ready",
          note: "Called the restaurant, food in 6 min",
          supportRef: "SUP-12345",
        },
      },
      handler: ({ params: t, body: e }) => {
        let a = e ?? {};
        if (!a.cause) throw new HttpError(400, "cause is required");
        let r = {
          orderId: t.orderId,
          cause: a.cause,
          note: a.note ?? "",
          at: simClock.get().now,
          by: "API",
          platformSupportRef: a.supportRef,
        };
        return (
          opsStore.set((n) => ({
            escalations: [...n.escalations, r],
          })),
          {
            ok: !0,
            escalation: r,
          }
        );
      },
    },
    {
      method: "GET",
      path: "/forecast/demand",
      tag: "Capacity",
      summary: "Demand forecast per 30-minute slot",
      params: [
        {
          name: "zone",
          in: "query",
          required: !0,
          description: "Zone id",
          example: "innenstadt",
        },
      ],
      handler: ({ query: t }) => {
        let a = Ra().forecasts[t.zone];
        if (!a) throw new HttpError(404, "Unknown zone");
        return a
          .filter((r) => r.slot >= 21)
          .map((r) => ({
            slot: Ba(r.slot * 30),
            p50: Sn(r.p50),
            p90: Sn(r.p90),
            actual: r.actual,
          }));
      },
    },
    {
      method: "GET",
      path: "/capacity/zones",
      tag: "Capacity",
      summary: "Required vs active drivers per zone for the next 30 minutes",
      handler: () =>
        Object.values(Ra().capacity).map((t) => ({
          ...t,
          zone: rt(t.zoneId),
          forecastOrders: Sn(t.forecastOrders),
          requiredExact: Sn(t.requiredExact),
        })),
    },
    {
      method: "GET",
      path: "/capacity/reposition-suggestions",
      tag: "Capacity",
      summary: "Safe driver moves between neighbouring zones",
      handler: () => Ra().moves,
    },
    {
      method: "GET",
      path: "/drivers",
      tag: "Workforce",
      summary: "Drivers with live status",
      handler: () => {
        let t = Ra();
        return getPilotModel().drivers.map((e) => {
          let a = t.driverStates.find((r) => r.driverId === e.id);
          return {
            id: e.id,
            name: e.name,
            employmentType: e.employmentType,
            platform: e.platform,
            homeZone: e.homeZoneId,
            vehicle: e.vehicleType,
            shift: `${Ba(e.shiftStart)}-${Ba(e.shiftEnd)}`,
            activity: a.activity,
            currentZone: a.zoneId,
          };
        });
      },
    },
    {
      method: "GET",
      path: "/drivers/{id}/assessment",
      tag: "Workforce",
      summary: "Fair 28-day assessment (for human review)",
      params: [
        {
          name: "id",
          in: "path",
          required: !0,
          description: "Driver id",
          example: "D009",
        },
      ],
      handler: ({ params: t }) => {
        let e = getPilotModel().driverHistory[t.id];
        if (!e) throw new HttpError(404, "Unknown driver");
        return to(e);
      },
    },
    {
      method: "POST",
      path: "/readiness-checks",
      tag: "Workforce",
      summary: "Record a pre-shift readiness check",
      body: {
        contentType: "application/json",
        description: "All items must be true to pass",
        example: {
          driverId: "D004",
          items: {
            attendance: !0,
            zone: !0,
            vehicle: !0,
            battery: !0,
            phone: !0,
            powerBank: !0,
            bag: !0,
            gear: !0,
            support: !0,
          },
        },
      },
      handler: ({ body: t }) => {
        let e = t ?? {};
        if (
          !e.driverId ||
          !getPilotModel().drivers.some((i) => i.id === e.driverId)
        )
          throw new HttpError(400, "Valid driverId required");
        let a = e.items ?? {},
          r = Object.keys(a).length >= 9 && Object.values(a).every(Boolean),
          n = {
            passed: r,
            items: a,
            issue: r ? void 0 : (e.issue ?? "One or more checks failed"),
            at: simClock.get().now,
            by: "API",
          };
        return (
          opsStore.set((i) => ({
            readiness: {
              ...i.readiness,
              [e.driverId]: n,
            },
          })),
          {
            driverId: e.driverId,
            ...n,
            countedAsAvailable: r,
          }
        );
      },
    },
    {
      method: "GET",
      path: "/vehicles",
      tag: "Fleet",
      summary: "Vehicle register",
      handler: () =>
        getPilotModel().vehicles.map((t) => ({
          ...t,
          openDefects: [
            ...t.openDefects,
            ...(opsStore.get().defects[t.id] ?? []),
          ],
        })),
    },
    {
      method: "POST",
      path: "/vehicles/{id}/defects",
      tag: "Fleet",
      summary: "Report a vehicle defect",
      params: [
        {
          name: "id",
          in: "path",
          required: !0,
          description: "Vehicle id",
          example: "V004",
        },
      ],
      body: {
        contentType: "application/json",
        description: "Defect description",
        example: {
          description: "Front light not working",
        },
      },
      handler: ({ params: t, body: e }) => {
        let a = e?.description;
        if (!a) throw new HttpError(400, "description is required");
        if (!getPilotModel().vehicles.some((r) => r.id === t.id))
          throw new HttpError(404, "Unknown vehicle");
        return (
          opsStore.set((r) => ({
            defects: {
              ...r.defects,
              [t.id]: [...(r.defects[t.id] ?? []), a],
            },
          })),
          {
            ok: !0,
            vehicleId: t.id,
            defects: opsStore.get().defects[t.id],
          }
        );
      },
    },
    {
      method: "GET",
      path: "/maintenance/due",
      tag: "Fleet",
      summary: "Vehicles due for service within 10%",
      handler: () =>
        getPilotModel()
          .vehicles.map((t) => ({
            id: t.id,
            label: t.label,
            kmUsedPct: Math.round(
              (t.kmSinceService / t.serviceIntervalKm) * 100,
            ),
            daysUsedPct: Math.round(
              (t.daysSinceService / t.serviceIntervalDays) * 100,
            ),
          }))
          .filter((t) => t.kmUsedPct >= 90 || t.daysUsedPct >= 90)
          .sort(
            (t, e) =>
              Math.max(e.kmUsedPct, e.daysUsedPct) -
              Math.max(t.kmUsedPct, t.daysUsedPct),
          ),
    },
    {
      method: "GET",
      path: "/cancellations",
      tag: "Service quality",
      summary: "Cancellations so far with stage and initiating party",
      handler: () =>
        Ra().cancelled.map((t) => ({
          orderId: t.id,
          platform: t.platform,
          zone: t.zoneId,
          driverId: t.driverId,
          ...t.cancellation,
          at: Ba(t.cancellation.at),
        })),
    },
    {
      method: "POST",
      path: "/cancellations",
      tag: "Service quality",
      summary: "Record a cancellation manually",
      body: {
        contentType: "application/json",
        description: "Cancellation record",
        example: {
          orderId: "FRA-0412",
          stage: "at_pickup",
          initiatedBy: "restaurant",
          reason: "Item unavailable",
          supportRef: "SUP-0412",
        },
      },
      handler: ({ body: t }) => {
        let e = t ?? {};
        for (let r of ["orderId", "stage", "initiatedBy", "reason"])
          if (!e[r]) throw new HttpError(400, `${r} is required`);
        let a = {
          orderId: e.orderId,
          stage: e.stage,
          initiatedBy: e.initiatedBy,
          reason: e.reason,
          supportRef: e.supportRef ?? "",
          at: simClock.get().now,
        };
        return (
          opsStore.set((r) => ({
            cancellations: [...r.cancellations, a],
          })),
          a
        );
      },
    },
    {
      method: "GET",
      path: "/restaurants/waits",
      tag: "Service quality",
      summary: "Median and 90th-percentile restaurant waits",
      handler: () =>
        Ra().restaurants.map((t) => ({
          ...t,
          medianWait: Sn(t.medianWait),
          p90Wait: Sn(t.p90Wait),
        })),
    },
    {
      method: "GET",
      path: "/economics",
      tag: "Economics",
      summary: "Revenue less direct costs so far",
      params: [
        {
          name: "groupBy",
          in: "query",
          description: "shift | platform | zone",
          enum: ["shift", "platform", "zone"],
          example: "shift",
        },
      ],
      handler: ({ query: t }) => {
        let e = Ra().economics,
          a =
            t.groupBy === "platform"
              ? e.byPlatform
              : t.groupBy === "zone"
                ? e.byZone
                : e.byShift;
        return {
          assumptions: opsStore.get().assumptions,
          total: e.total,
          paidHours: Sn(e.paidHours),
          groups: a,
        };
      },
    },
    {
      method: "GET",
      path: "/actions",
      tag: "Economics",
      summary: "Corrective actions",
      handler: () => opsStore.get().actions,
    },
    {
      method: "POST",
      path: "/actions",
      tag: "Economics",
      summary: "Create a corrective action (owner and deadline required)",
      body: {
        contentType: "application/json",
        description: "Action",
        example: {
          title: "Add one reserve driver in Sachsenhausen 18:30-21:00",
          owner: "Dilara Aksoy (Alnaif)",
          due: "2026-09-17",
          source: "API",
        },
      },
      handler: ({ body: t }) => {
        let e = t ?? {};
        if (!e.title || !e.owner || !e.due)
          throw new HttpError(400, "title, owner and due are required");
        let a = {
          id: Mn("A"),
          title: e.title,
          owner: e.owner,
          due: e.due,
          status: "open",
          source: e.source ?? "API",
          createdAt: simClock.get().now,
        };
        return (
          opsStore.set((r) => ({
            actions: [...r.actions, a],
          })),
          a
        );
      },
    },
    {
      method: "POST",
      path: "/webhooks/{platform}",
      tag: "Integrations",
      summary: "Receive a platform event",
      description:
        'uber_eats: JSON body with x-uber-signature (HMAC SHA-256 hex). wolt: {"token": "<HS256 JWT>"}. Events are verified, de-duplicated and mapped to the EELS order-event model.',
      params: [
        R0,
        {
          name: "x-uber-signature",
          in: "header",
          description: "HMAC SHA-256 of the raw body (Uber-style feeds)",
        },
      ],
      body: {
        contentType: "application/json",
        description: "Platform payload",
        example: {
          id: "evt_1",
          kind: "event.delivery_status",
          created: "2026-09-16T17:05:00Z",
          delivery_id: "del_9",
          status: "pickup_complete",
          data: {
            courier: {
              ref: "D007",
            },
            zone_ref: "sachsenhausen",
          },
        },
      },
      handler: async ({ params: t, body: e, headers: a }) => {
        let r = t.platform,
          n,
          i = !1;
        if (r === "uber_eats") {
          let l = typeof e == "string" ? e : JSON.stringify(e),
            d = a["x-uber-signature"] ?? "";
          if (((i = await H5(l, d, Yd.uber_eats)), !i))
            throw new HttpError(401, "Signature does not match");
          n = z5(JSON.parse(l));
        } else if (r === "wolt") {
          let l = e?.token;
          if (!l) throw new HttpError(400, "token is required");
          let d = await D5(l, Yd.wolt).catch(() => {
            throw new HttpError(401, "JWT signature does not match");
          });
          ((i = !0), (n = V5(d)));
        } else
          throw new HttpError(
            400,
            "Lieferando data arrives as report imports: POST /imports/lieferando/report",
          );
        let o = {
          id: Mn("WH"),
          at: new Date().toISOString(),
          platform: r,
          eventType: n?.type ?? "location (dropped)",
          verified: i,
          result: n ? `Mapped to ${n.type}` : "Location update not stored",
        };
        return (
          opsStore.set((l) => ({
            webhookLog: [o, ...l.webhookLog].slice(0, 50),
          })),
          {
            accepted: !0,
            event: n,
          }
        );
      },
    },
    {
      method: "POST",
      path: "/imports/{platform}/report",
      tag: "Integrations",
      summary: "Import a partner-portal report (CSV)",
      params: [R0],
      body: {
        contentType: "text/csv",
        description:
          "Columns: order_id, courier_id, zone, accepted_at, picked_up_at, delivered_at, promised_at, status, cancel_reason, cancelled_by",
        example: `order_id;courier_id;zone;accepted_at;picked_up_at;delivered_at;promised_at;status;cancel_reason;cancelled_by
L-1001;D012;nordend;2026-09-16T18:02;2026-09-16T18:14;2026-09-16T18:27;2026-09-16T18:32;delivered;;`,
      },
      handler: ({ params: t, body: e }) => {
        if (typeof e != "string")
          throw new HttpError(400, "Send the CSV as text");
        let a = I5(
          e,
          ["order_id", "courier_id", "status", "promised_at"],
          (n) => (n.order_id ? null : "order_id is empty"),
        );
        if (a.missingColumns.length)
          throw new HttpError(
            422,
            `Missing columns: ${a.missingColumns.join(", ")}`,
          );
        let r = a.rows.flatMap((n, i) => P5(t.platform, n, i));
        return {
          rows: a.rows.length,
          rejected: a.errors,
          events: r.length,
          sample: r.slice(0, 5),
        };
      },
    },
    {
      method: "GET",
      path: "/integrations/health",
      tag: "Integrations",
      summary: "Data channel status per partner",
      handler: () => tn,
    },
    {
      method: "POST",
      path: "/copilot/chat",
      tag: "Copilot",
      summary: "Ask the Ops Copilot (mock: offline engine)",
      body: {
        contentType: "application/json",
        description: "Question",
        example: {
          question: "Which zones are short of drivers?",
        },
      },
      handler: ({ body: t }) => {
        let e = t?.question;
        if (!e) throw new HttpError(400, "question is required");
        return {
          engine: "offline",
          answer: j2(e, Ra(), getPilotModel(), opsStore.get()),
        };
      },
    },
    {
      method: "POST",
      path: "/copilot/daily-report",
      tag: "Copilot",
      summary: "Draft the end-of-day report",
      handler: () => ({
        report: bn(Ra(), opsStore.get()),
      }),
    },
  ];
function F5(t, e) {
  for (let a of API_ROUTES) {
    if (a.method !== t) continue;
    let r = a.path.split("/").filter(Boolean),
      n = e.split("/").filter(Boolean);
    if (r.length !== n.length) continue;
    let i = {},
      o = !0;
    for (let l = 0; l < r.length; l++)
      r[l].startsWith("{")
        ? (i[r[l].slice(1, -1)] = decodeURIComponent(n[l]))
        : r[l] !== n[l] && (o = !1);
    if (o)
      return {
        ep: a,
        params: i,
      };
  }
  return null;
}
var Z5 =
    typeof U < "u"
      ? U
      : {
          apiMode: "mock",
          apiBaseUrl: "",
          target: "web",
          builtAt: "",
        },
  Bl = Z5.apiMode === "http" ? "http" : "mock",
  Nl = Z5.apiBaseUrl || "/api/v1";
async function callApi(t, e, a = {}) {
  let r = performance.now(),
    n = Object.fromEntries(
      Object.entries(a.query ?? {}).filter(([, o]) => o !== ""),
    );
  if (Bl === "http") {
    let o = new URLSearchParams(n).toString(),
      l = typeof a.body == "string",
      d = await fetch(`${Nl}${e}${o ? `?${o}` : ""}`, {
        method: t,
        headers: {
          ...(a.body !== void 0
            ? {
                "content-type": l ? "text/csv" : "application/json",
              }
            : {}),
          ...(a.headers ?? {}),
        },
        body: a.body === void 0 ? void 0 : l ? a.body : JSON.stringify(a.body),
      }),
      c = d.headers.get("content-type")?.includes("json")
        ? await d.json()
        : await d.text();
    return {
      status: d.status,
      data: c,
      ms: performance.now() - r,
      mode: "http",
    };
  }
  let i = F5(t, e);
  if ((await new Promise((o) => setTimeout(o, 60 + Math.random() * 90)), !i))
    return {
      status: 404,
      data: {
        error: `No route ${t} ${e}`,
      },
      ms: performance.now() - r,
      mode: "mock",
    };
  try {
    let o = Object.fromEntries(
        Object.entries(a.headers ?? {}).map(([d, c]) => [d.toLowerCase(), c]),
      ),
      l = await i.ep.handler({
        params: i.params,
        query: n,
        body: a.body,
        headers: o,
      });
    return {
      status: 200,
      data: JSON.parse(JSON.stringify(l ?? null)),
      ms: performance.now() - r,
      mode: "mock",
    };
  } catch (o) {
    return {
      status: o instanceof HttpError ? o.status : 500,
      data: {
        error: o.message,
      },
      ms: performance.now() - r,
      mode: "mock",
    };
  }
}
function q5(t = "https://api.eels.example/api/v1") {
  var a;
  let e = {};
  for (let r of API_ROUTES) {
    let n = {
      tags: [r.tag],
      summary: r.summary,
      operationId: `${r.method.toLowerCase()}${r.path.replace(/[{}]/g, "").replace(/(^|[/_-])(\w)/g, (i, o, l) => l.toUpperCase())}`,
      parameters: (r.params ?? []).map((i) => ({
        name: i.name,
        in: i.in,
        required: i.in === "path" ? !0 : !!i.required,
        description: i.description,
        schema: i.enum
          ? {
              type: "string",
              enum: i.enum,
            }
          : {
              type: "string",
            },
        ...(i.example
          ? {
              example: i.example,
            }
          : {}),
      })),
      responses: {
        200: {
          description: "OK",
          content: {
            "application/json": {
              schema: {
                type: "object",
              },
            },
          },
        },
        400: {
          description: "Invalid input",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        401: {
          description: "Missing or invalid credentials or signature",
        },
        404: {
          description: "Not found",
        },
      },
      security: r.path.startsWith("/webhooks")
        ? []
        : [
            {
              bearerAuth: [],
            },
          ],
    };
    (r.description && (n.description = r.description),
      r.body &&
        (n.requestBody = {
          required: !0,
          description: r.body.description,
          content: {
            [r.body.contentType]: {
              schema:
                r.body.contentType === "text/csv"
                  ? {
                      type: "string",
                    }
                  : {
                      type: "object",
                    },
              example: r.body.example,
            },
          },
        }),
      ((e[(a = r.path)] ?? (e[a] = {}))[r.method.toLowerCase()] = n));
  }
  return {
    openapi: "3.1.0",
    info: {
      title: "EELS Operations API",
      version: "1.0.0",
      description:
        "Contract for the EELS Fleet Portal backend: KPIs, capacity, risk, workforce, fleet, economics and platform integrations. The portal ships with an in-browser mock of this API; a backend implementing it can be switched on with VITE_API_MODE=http.",
    },
    servers: [
      {
        url: t,
      },
    ],
    tags: [...new Set(API_ROUTES.map((r) => r.tag))].map((r) => ({
      name: r,
    })),
    paths: e,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
            },
          },
          required: ["error"],
        },
        Ratio: {
          type: "object",
          properties: {
            num: {
              type: "integer",
            },
            den: {
              type: "integer",
            },
            pct: {
              type: ["number", "null"],
            },
          },
          required: ["num", "den", "pct"],
        },
        EelsOrderEvent: {
          type: "object",
          required: [
            "eventId",
            "platform",
            "externalOrderId",
            "type",
            "occurredAt",
          ],
          properties: {
            eventId: {
              type: "string",
            },
            platform: {
              type: "string",
              enum: ["uber_eats", "wolt", "lieferando"],
            },
            externalOrderId: {
              type: "string",
            },
            type: {
              type: "string",
              enum: [
                "accepted",
                "arrived_pickup",
                "picked_up",
                "arrived_dropoff",
                "delivered",
                "cancelled",
              ],
            },
            occurredAt: {
              type: "string",
              format: "date-time",
            },
            driverRef: {
              type: ["string", "null"],
            },
            zoneRef: {
              type: ["string", "null"],
            },
            deadlineOriginal: {
              type: ["string", "null"],
              format: "date-time",
            },
            deadlineUpdated: {
              type: ["string", "null"],
              format: "date-time",
            },
            batchId: {
              type: ["string", "null"],
            },
            cancellation: {
              type: ["object", "null"],
              properties: {
                stage: {
                  type: "string",
                  enum: [
                    "before_pickup",
                    "at_pickup",
                    "after_pickup",
                    "at_dropoff",
                  ],
                },
                initiatedBy: {
                  type: "string",
                  enum: ["customer", "restaurant", "driver", "platform"],
                },
                reason: {
                  type: "string",
                },
                supportRef: {
                  type: ["string", "null"],
                },
              },
            },
          },
        },
        KpiDefinition: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            platform: {
              type: "string",
            },
            measuredEvent: {
              type: "string",
              enum: [
                "handover",
                "dropoff_arrival",
                "pickup_and_dropoff_arrivals",
              ],
            },
            deadlineBasis: {
              type: "string",
              enum: ["original", "updated"],
            },
            toleranceMin: {
              type: "number",
            },
            excludeRestaurantWait: {
              type: "boolean",
            },
            excludeCustomerWait: {
              type: "boolean",
            },
            cancellations: {
              type: "string",
              enum: ["exclude", "driver_late"],
            },
            window: {
              type: "object",
            },
            target: {
              type: "number",
            },
            verified: {
              type: "boolean",
            },
          },
        },
      },
    },
  };
}
async function downloadTextFile(t, e, a) {
  let r = typeof U < "u" ? U.target : "web",
    n = window;
  if (r === "artifact" && n.claude?.use) {
    try {
      let i = await n.claude.use("downloads");
      if (i)
        return (
          await i.save({
            filename: t,
            data: e,
          }),
          !0
        );
    } catch {
      return !1;
    }
    return !1;
  }
  try {
    let i = URL.createObjectURL(
        new Blob([e], {
          type: a,
        }),
      ),
      o = document.createElement("a");
    return (
      (o.href = i),
      (o.download = t),
      document.body.appendChild(o),
      o.click(),
      o.remove(),
      setTimeout(() => URL.revokeObjectURL(i), 2e3),
      !0
    );
  } catch {
    return !1;
  }
}
function ApiHubPage() {
  let [t, e] = De.useState("integrations");
  return (
    <W.Fragment>
      <PageHeader
        eyebrow="Integrations"
        title="API Hub"
        description="Every platform feed is verified, de-duplicated and mapped to one EELS order-event model, so KPIs work the same for Uber Eats, Wolt and Lieferando."
        actions=<W.Fragment>
          <Badge tone={Bl === "mock" ? "warn" : "good"}>
            {"API mode: "}
            {Bl === "mock" ? "in-browser mock" : Nl}
          </Badge>
        </W.Fragment>
      />
      <Tabs
        value={t}
        onChange={e}
        tabs={[
          {
            value: "integrations",
            label: "Data channels",
          },
          {
            value: "webhooks",
            label: "Webhook simulator",
          },
          {
            value: "import",
            label: "Report import",
          },
          {
            value: "explorer",
            label: "API explorer",
          },
          {
            value: "openapi",
            label: "OpenAPI",
          },
        ]}
      />
      {t === "integrations" && W.jsx(fM, {})}
      {t === "webhooks" && W.jsx(kM, {})}
      {t === "import" && W.jsx(yM, {})}
      {t === "explorer" && <LM />}
      {t === "openapi" && <MM />}
    </W.Fragment>
  );
}
function fM() {
  let t = {
    "live feed": "good",
    "report import": "info",
    "agreement pending": "warn",
    prototype: "neutral",
  };
  return (
    <div className="stack">
      <Callout>
        {
          "None of the three partners publishes an open fleet-partner API. The pilot starts with partner-portal report imports; live feeds are switched on per partner once the agreement grants data access."
        }
      </Callout>
      <Card title="Data channels" flush={!0}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{"Source"}</th>
                <th>{"Channel"}</th>
                <th>{"Status"}</th>
                <th className="num">{"Health"}</th>
                <th>{"Last sync"}</th>
                <th>{"Note"}</th>
              </tr>
            </thead>
            <tbody>
              {tn.map((e) => (
                <tr key={e.id}>
                  <td className="bold">{e.name}</td>
                  <td className="small">{e.dataChannel}</td>
                  <td>
                    <Badge tone={t[e.status]}>{e.status}</Badge>
                  </td>
                  <td className="num">
                    {e.health ? `${e.health}%` : "\u2014"}
                  </td>
                  <td className="small">{e.lastSync}</td>
                  <td className="small text-2">{e.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="grid g3">
        <Card title="Security">
          <ul
            className="small stack-sm"
            style={{
              margin: 0,
              paddingLeft: 18,
            }}
          >
            <li>{"Portal API: bearer tokens (JWT) per user and role."}</li>
            <li>
              {"Uber-style events: HMAC SHA-256 signature in "}
              <code>{"x-uber-signature"}</code>
              {"."}
            </li>
            <li>
              {
                "Wolt-style events: HS256-signed JWT verified with the client secret."
              }
            </li>
            <li>
              {
                "Secrets live in the backend secret store, never in the browser."
              }
            </li>
          </ul>
        </Card>
        <Card title="Reliability">
          <ul
            className="small stack-sm"
            style={{
              margin: 0,
              paddingLeft: 18,
            }}
          >
            <li>
              {"Event ids are de-duplicated, so platform retries are safe."}
            </li>
            <li>
              {
                "Uber retries at 10, 30, 60 and 120 seconds; Wolt uses exponential backoff."
              }
            </li>
            <li>
              {"Unknown statuses are rejected and logged, never guessed."}
            </li>
          </ul>
        </Card>
        <Card title="Data minimisation">
          <ul
            className="small stack-sm"
            style={{
              margin: 0,
              paddingLeft: 18,
            }}
          >
            <li>{"Courier location updates are not stored with orders."}</li>
            <li>{"Reports aggregate by zone, not by live position."}</li>
            <li>
              {"No emotional-state or private-message data is processed."}
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
var mM = [
    "pending",
    "pickup",
    "pickup_complete",
    "dropoff",
    "delivered",
    "canceled",
  ],
  vM = [
    "order.received",
    "order.pickup_arrival",
    "order.picked_up",
    "order.dropoff_arrival",
    "order.delivered",
    "order.customer_no_show",
    "order.location_updated",
  ];
function kM() {
  let t = useOpsStore(),
    [e, a] = De.useState("uber_eats"),
    [r, n] = De.useState("pickup_complete"),
    [i, o] = De.useState("order.delivered"),
    [l, d] = De.useState("FRA-0300"),
    [c, g] = De.useState(!1),
    [p, u] = De.useState(""),
    [s, f] = De.useState(""),
    [x, M] = De.useState(null),
    [h, m] = De.useState(!1),
    y = async () => {
      let L = `evt_${Math.random().toString(36).slice(2, 10)}`;
      if (e === "uber_eats") {
        let w = {
            id: L,
            kind: "event.delivery_status",
            created: new Date().toISOString(),
            delivery_id: l,
            status: r,
            data: {
              courier: {
                ref: "D007",
              },
              zone_ref: "sachsenhausen",
              dropoff_deadline: "2026-09-16T17:35:00Z",
              courier_at_pickup: r === "pickup",
              ...(r === "canceled"
                ? {
                    cancelation: {
                      initiated_by: "merchant",
                      stage: "at_pickup",
                      reason: "Item unavailable",
                      support_ref: "SUP-88121",
                    },
                  }
                : {}),
            },
          },
          O = JSON.stringify(w, null, 2);
        (u(O), f(await E0(O, Yd.uber_eats)));
      } else {
        let w = {
            id: L,
            type: i,
            created_at: new Date().toISOString(),
            details: {
              order_id: l,
              courier_id: "D012",
              zone: "nordend",
              promised_dropoff: "2026-09-16T17:40:00Z",
            },
          },
          O = await R5(w, Yd.wolt);
        (u(
          JSON.stringify(
            {
              token: O,
            },
            null,
            2,
          ),
        ),
          f(JSON.stringify(w, null, 2)));
      }
      M(null);
    },
    k = async () => {
      m(!0);
      let L = p,
        w = {};
      if (e === "uber_eats")
        ((L = c ? p.replace(l, `${l}X`) : p), (w["x-uber-signature"] = s));
      else {
        let O = JSON.parse(p);
        L = {
          token: c ? O.token.slice(0, -3) + "abc" : O.token,
        };
      }
      (M(
        await callApi("POST", `/webhooks/${e}`, {
          body: L,
          headers: w,
        }),
      ),
        m(!1));
    };
  return (
    <div className="grid g-2-1">
      <Card
        title="Send a signed test event"
        sub="Payloads follow the public Uber Direct and Wolt Drive webhook patterns; the real fleet feeds must be confirmed with each partner"
      >
        <div className="stack">
          <div
            className="grid g3"
            style={{
              gap: 10,
            }}
          >
            <Field id="wh-p" label="Platform">
              <select
                id="wh-p"
                className="select"
                value={e}
                onChange={(L) => a(L.target.value)}
              >
                <option value="uber_eats">{"Uber-style (HMAC)"}</option>
                <option value="wolt">{"Wolt-style (JWT)"}</option>
              </select>
            </Field>
            {e === "uber_eats" ? (
              <Field id="wh-s" label="Status">
                <select
                  id="wh-s"
                  className="select"
                  value={r}
                  onChange={(L) => n(L.target.value)}
                >
                  {mM.map((L) => (
                    <option key={L}>{L}</option>
                  ))}
                </select>
              </Field>
            ) : (
              <Field id="wh-t" label="Event type">
                <select
                  id="wh-t"
                  className="select"
                  value={i}
                  onChange={(L) => o(L.target.value)}
                >
                  {vM.map((L) => (
                    <option key={L}>{L}</option>
                  ))}
                </select>
              </Field>
            )}
            <Field id="wh-o" label="External order id">
              <input
                id="wh-o"
                className="input"
                value={l}
                onChange={(L) => d(L.target.value)}
              />
            </Field>
          </div>
          <div className="row wrap">
            <Button onClick={y}>
              {W.jsx(o2, {
                size: 14,
              })}
              {" Generate signed payload"}
            </Button>
            <label className="check">
              <input
                type="checkbox"
                id="wh-tamper"
                checked={c}
                onChange={(L) => g(L.target.checked)}
              />
              {" Tamper with the payload before sending"}
            </label>
            <Button variant="primary" disabled={!p || h} onClick={k}>
              <Pd size={14} />
              {" Send to /webhooks/"}
              {e}
            </Button>
          </div>
          {p && (
            <div className="grid g2">
              <div className="stack-sm">
                <div className="field-label">{"Request body"}</div>
                <pre className="code">{p}</pre>
              </div>
              <div className="stack-sm">
                <div className="field-label">
                  {e === "uber_eats"
                    ? "x-uber-signature (HMAC SHA-256)"
                    : "Decoded JWT payload"}
                </div>
                <pre className="code">{s}</pre>
              </div>
            </div>
          )}
          {x && (
            <div className="stack-sm">
              <div className="row">
                <Badge tone={x.status < 300 ? "good" : "crit"}>
                  {"HTTP "}
                  {x.status}
                </Badge>
                <span className="small muted">
                  {x.ms.toFixed(0)}
                  {" ms"}
                </span>
              </div>
              <pre className="code">{JSON.stringify(x.data, null, 2)}</pre>
            </div>
          )}
        </div>
      </Card>
      <Card title="Event log" sub="Accepted events, newest first">
        <div className="stack-sm">
          {t.webhookLog.length === 0 && (
            <p className="small muted">{"No events yet."}</p>
          )}
          {t.webhookLog.map((L) => (
            <div className="alert-item" key={L.id}>
              <div className="grow">
                <div className="t">
                  {L.platform}
                  {" · "}
                  {L.eventType}
                </div>
                <div className="d">
                  {new Date(L.at).toLocaleTimeString()}
                  {" · "}
                  {L.result}
                </div>
              </div>
              <Badge tone={L.verified ? "good" : "crit"}>
                {L.verified ? "verified" : "rejected"}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
var xM = `order_id;courier_id;zone;accepted_at;picked_up_at;delivered_at;promised_at;status;cancel_reason;cancelled_by
L-1001;D012;nordend;2026-09-16T18:02;2026-09-16T18:14;2026-09-16T18:27;2026-09-16T18:32;delivered;;
L-1002;D015;bornheim;2026-09-16T18:05;2026-09-16T18:19;2026-09-16T18:41;2026-09-16T18:35;delivered;;
L-1003;D021;westend;2026-09-16T18:07;;;2026-09-16T18:40;cancelled;"Restaurant closed early";restaurant
;D022;westend;2026-09-16T18:09;2026-09-16T18:20;2026-09-16T18:33;2026-09-16T18:38;delivered;;`;
function yM() {
  let [t, e] = De.useState("lieferando"),
    [a, r] = De.useState(xM),
    [n, i] = De.useState(null);
  return (
    <div className="grid g2">
      <Card
        title="Import a partner report"
        sub="CSV with ; or , separators. Required columns: order_id, courier_id, status, promised_at"
      >
        <div className="stack">
          <Field id="imp-p" label="Partner">
            <select
              id="imp-p"
              className="select"
              value={t}
              onChange={(o) => e(o.target.value)}
            >
              <option value="lieferando">{"Lieferando"}</option>
              <option value="uber_eats">{"Uber Eats"}</option>
              <option value="wolt">{"Wolt"}</option>
            </select>
          </Field>
          <Field id="imp-csv" label="Report content">
            <textarea
              id="imp-csv"
              className="textarea"
              style={{
                minHeight: 180,
              }}
              value={a}
              onChange={(o) => r(o.target.value)}
            />
          </Field>
          <div className="row">
            <Button
              variant="primary"
              onClick={async () =>
                i(
                  await callApi("POST", `/imports/${t}/report`, {
                    body: a,
                  }),
                )
              }
            >
              {"Validate and import"}
            </Button>
            <label className="btn" htmlFor="imp-file">
              {"Load file"}
            </label>
            <input
              id="imp-file"
              type="file"
              accept=".csv,text/csv"
              hidden={!0}
              onChange={async (o) => {
                let l = o.target.files?.[0];
                l && r(await l.text());
              }}
            />
          </div>
        </div>
      </Card>
      <Card title="Result">
        {n ? (
          <div className="stack">
            <div className="row">
              <Badge tone={n.status < 300 ? "good" : "crit"}>
                {"HTTP "}
                {n.status}
              </Badge>
            </div>
            <pre className="code">{JSON.stringify(n.data, null, 2)}</pre>
          </div>
        ) : (
          <p className="muted small">
            {"Run an import to see mapped events and rejected rows."}
          </p>
        )}
      </Card>
    </div>
  );
}
function LM() {
  let t = De.useMemo(() => [...new Set(API_ROUTES.map((s) => s.tag))], []),
    [e, a] = De.useState(API_ROUTES[0]),
    [r, n] = De.useState({}),
    [i, o] = De.useState(""),
    [l, d] = De.useState(null),
    [c, g] = De.useState(!1),
    p = (s) => {
      (a(s),
        n(
          Object.fromEntries(
            (s.params ?? []).map((f) => [f.name, f.example ?? ""]),
          ),
        ),
        o(
          s.body
            ? typeof s.body.example == "string"
              ? s.body.example
              : JSON.stringify(s.body.example, null, 2)
            : "",
        ),
        d(null));
    },
    u = async () => {
      g(!0);
      let s = e.path,
        f = {},
        x = {};
      for (let h of e.params ?? []) {
        let m = r[h.name] ?? "";
        h.in === "path"
          ? (s = s.replace(`{${h.name}}`, encodeURIComponent(m)))
          : h.in === "query"
            ? (f[h.name] = m)
            : m && (x[h.name] = m);
      }
      let M;
      if (e.body)
        if (e.body.contentType === "text/csv") M = i;
        else
          try {
            M = JSON.parse(i || "{}");
          } catch {
            (d({
              status: 400,
              data: {
                error: "Body is not valid JSON",
              },
              ms: 0,
              mode: "mock",
            }),
              g(!1));
            return;
          }
      (d(
        await callApi(e.method, s, {
          query: f,
          body: M,
          headers: x,
        }),
      ),
        g(!1));
    };
  return (
    <div className="grid g-1-2">
      <Card title="Endpoints" sub={`Base URL ${Nl}`} flush={!0}>
        <div
          className="stack-sm"
          style={{
            padding: "0 10px 10px",
            maxHeight: 620,
            overflow: "auto",
          }}
        >
          {t.map((s) => (
            <div className="stack-sm" key={s}>
              <div
                className="nav-group"
                style={{
                  color: "var(--muted)",
                  padding: "10px 6px 2px",
                }}
              >
                {s}
              </div>
              {API_ROUTES.filter((f) => f.tag === s).map((f) => (
                <button
                  type="button"
                  className="btn ghost"
                  style={{
                    justifyContent: "flex-start",
                    background: f === e ? "var(--surface-3)" : void 0,
                  }}
                  onClick={() => p(f)}
                  key={f.method + f.path}
                >
                  <span className={`method ${f.method.toLowerCase()}`}>
                    {f.method}
                  </span>
                  <span
                    className="mono small"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {f.path}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </Card>
      <Card
        title=<span className="row">
          <span className={`method ${e.method.toLowerCase()}`}>{e.method}</span>
          <span className="mono">{e.path}</span>
        </span>
        sub={e.summary}
      >
        <div className="stack">
          {e.description && <p className="small text-2">{e.description}</p>}
          {(e.params ?? []).length > 0 && (
            <div
              className="grid g2"
              style={{
                gap: 10,
              }}
            >
              {(e.params ?? []).map((s) => (
                <Field
                  id={`ex-${s.name}`}
                  label={`${s.name} (${s.in}${s.required ? ", required" : ""})`}
                  hint={s.description}
                  key={s.name}
                >
                  {s.enum ? (
                    <select
                      id={`ex-${s.name}`}
                      className="select"
                      value={r[s.name] ?? ""}
                      onChange={(f) =>
                        n({
                          ...r,
                          [s.name]: f.target.value,
                        })
                      }
                    >
                      <option value="">{"—"}</option>
                      {s.enum.map((f) => (
                        <option key={f}>{f}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={`ex-${s.name}`}
                      className="input"
                      value={r[s.name] ?? ""}
                      onChange={(f) =>
                        n({
                          ...r,
                          [s.name]: f.target.value,
                        })
                      }
                    />
                  )}
                </Field>
              ))}
            </div>
          )}
          {e.body && (
            <Field
              id="ex-body"
              label={`Body (${e.body.contentType})`}
              hint={e.body.description}
            >
              <textarea
                id="ex-body"
                className="textarea"
                style={{
                  minHeight: 130,
                }}
                value={i}
                onChange={(s) => o(s.target.value)}
              />
            </Field>
          )}
          <div>
            <Button variant="primary" onClick={u} disabled={c}>
              <Pd size={14} /> {c ? "Sending\u2026" : "Send request"}
            </Button>
          </div>
          {l && (
            <div className="stack-sm">
              <div className="row">
                <Badge tone={l.status < 300 ? "good" : "crit"}>
                  {"HTTP "}
                  {l.status}
                </Badge>
                <span className="small muted">
                  {l.ms.toFixed(0)}
                  {" ms · "}
                  {l.mode === "mock" ? "in-browser mock" : "live backend"}
                </span>
              </div>
              <pre className="code">{JSON.stringify(l.data, null, 2)}</pre>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
function MM() {
  let t = De.useMemo(() => JSON.stringify(q5(), null, 2), []),
    [e, a] = useToast();
  return (
    <Card
      title="OpenAPI 3.1 document"
      sub={`${API_ROUTES.length} operations. The build also publishes it as /openapi.json.`}
      actions=<W.Fragment>
        <Button
          onClick={async () => {
            try {
              (await navigator.clipboard.writeText(t), a("Copied"));
            } catch {
              a("Copy is blocked here; use Download");
            }
          }}
        >
          {W.jsx(gl, {
            size: 14,
          })}
          {" Copy"}
        </Button>
        <Button
          variant="primary"
          onClick={async () => {
            let r = await downloadTextFile(
              "eels-operations-api.openapi.json",
              t,
              "application/json",
            );
            a(r ? "Download started" : "Download was not allowed");
          }}
        >
          {W.jsx(xr, {
            size: 14,
          })}
          {" Download"}
        </Button>
      </W.Fragment>
    >
      <pre
        className="code"
        style={{
          maxHeight: 560,
        }}
      >
        {t}
      </pre>
      <Toast message={e} />
    </Card>
  );
}
export {
  $5,
  API_ROUTES,
  ApiError,
  ApiHubPage,
  Bl,
  HttpError,
  Nl,
  callApi,
  downloadTextFile,
};
