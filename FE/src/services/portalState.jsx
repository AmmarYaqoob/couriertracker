// Pilot model, simulated clock, ops store, i18n, navigation and role checks.
import * as Xr from "react";
import * as Ll from "react";
import * as m5 from "react";
import * as p5 from "react/jsx-runtime";
import * as x5 from "react/jsx-runtime";
import {
  Ck,
  Js,
  Kv,
  Lk,
  Mk,
  Nk,
  Xv,
  Yv,
  _k,
  a2,
  ak,
  bk,
  c2,
  d2,
  ek,
  fk,
  fl,
  h2,
  hi,
  hl,
  jk,
  l2,
  lk,
  mk,
  nk,
  ok,
  pk,
  pl,
  rk,
  s2,
  t2,
  tk,
  ul,
  vk,
  wk,
  xk,
  yk,
} from "../components/icons.jsx";
var Ud = {
    capacity: "Waiting for a free driver",
    restaurant: "Restaurant not ready",
    travel_to_pickup: "Late arrival at restaurant",
    travel_to_customer: "Travel to customer",
    handover: "Customer handover",
    equipment: "Equipment or vehicle problem",
    none: "No delay",
  },
  Qi = ["travel_to_pickup", "travel_to_customer"];
function pi(t) {
  let e = t.actual;
  if (
    t.cancellation ||
    e.delivered === void 0 ||
    e.arrivedPickup === void 0 ||
    e.pickedUp === void 0 ||
    e.arrivedDropoff === void 0 ||
    e.accepted === void 0
  )
    return null;
  let a = t.planned,
    r = [
      {
        key: "assignment",
        label: "Waiting for a driver",
        planned: a.accepted - t.createdAt,
        actual: e.accepted - t.createdAt,
        overrun: 0,
      },
      {
        key: "to_pickup",
        label: "Travel to restaurant",
        planned: a.arrivedPickup - a.accepted,
        actual: e.arrivedPickup - e.accepted,
        overrun: 0,
      },
      {
        key: "restaurant_wait",
        label: "Waiting for food",
        planned: a.pickedUp - a.arrivedPickup,
        actual: e.pickedUp - e.arrivedPickup,
        overrun: 0,
      },
      {
        key: "to_customer",
        label: "Travel to customer",
        planned: a.arrivedDropoff - a.pickedUp,
        actual: e.arrivedDropoff - e.pickedUp,
        overrun: 0,
      },
      {
        key: "handover",
        label: "Handover",
        planned: a.delivered - a.arrivedDropoff,
        actual: e.delivered - e.arrivedDropoff,
        overrun: 0,
      },
    ];
  for (let l of r) l.overrun = l.actual - l.planned;
  let n = e.delivered - t.deadlineOriginal,
    i = n > 0,
    o = "none";
  if (i)
    if (t.equipmentIssue) o = "equipment";
    else {
      let l = [...r].sort((d, c) => c.overrun - d.overrun)[0];
      o = {
        assignment: "capacity",
        to_pickup: "travel_to_pickup",
        restaurant_wait: "restaurant",
        to_customer: "travel_to_customer",
        handover: "handover",
      }[l.key];
    }
  return {
    orderId: t.id,
    lateBy: n,
    late: i,
    legs: r,
    primaryCause: o,
  };
}
function g2(t) {
  let e = new Map(),
    a = 0;
  for (let r of t) {
    if (!r || !r.late) continue;
    a++;
    let n = e.get(r.primaryCause) ?? {
      count: 0,
      minutes: 0,
    };
    (n.count++, (n.minutes += r.lateBy), e.set(r.primaryCause, n));
  }
  return [...e.entries()]
    .map(([r, n]) => ({
      cause: r,
      label: Ud[r],
      count: n.count,
      share: a ? n.count / a : 0,
      minutesLost: n.minutes,
    }))
    .sort((r, n) => n.count - r.count);
}
function Pe(t, e) {
  return {
    num: t,
    den: e,
    pct: e > 0 ? (t / e) * 100 : null,
  };
}
function f2(t, e) {
  if (t < 0 || e < 0 || t > e)
    throw new RangeError("onTime must be between 0 and eligible");
  return Pe(t, e);
}
function qr(t) {
  let e = 0,
    a = 0;
  for (let r of t) ((e += r.num), (a += r.den));
  return Pe(e, a);
}
function Hk(t, e) {
  return Pe(t, e);
}
function Ln(t, e, a) {
  if (a <= 0 || a > 1) throw new RangeError("utilisation must be in (0, 1]");
  let r = (t * e) / (60 * a),
    n = Math.ceil(Math.round(r * 1e9) / 1e9);
  return {
    exact: r,
    rounded: n,
  };
}
function m2(t, e) {
  return t - e;
}
var m0 = {
  amberBelow: 5,
};
function v2(t, e = m0) {
  return t < 0 ? "red" : t <= e.amberBelow ? "amber" : "green";
}
function ml(t) {
  let { targetPct: e, expectedTotal: a, completedSoFar: r, onTimeSoFar: n } = t,
    i = Math.ceil(Math.round((e / 100) * a * 1e9) / 1e9),
    o = Math.max(0, a - r),
    l = Math.max(0, i - n),
    d = o > 0 ? (l / o) * 100 : l > 0 ? 1 / 0 : 0,
    c = n + o,
    g = a > 0 ? (c / a) * 100 : 0,
    p = r > 0 ? n / r : 1,
    u = t.expectedRemainingRate ?? p,
    s = n + o * u,
    f = a > 0 ? (s / a) * 100 : 0,
    x;
  return (
    l === 0
      ? (x = "achieved")
      : l > o
        ? (x = "unreachable")
        : s >= i
          ? (x = "on_track")
          : (x = "at_risk"),
    {
      requiredOnTime: i,
      remaining: o,
      remainingOnTimeNeeded: l,
      requiredRemainingPct: Number.isFinite(d) ? d : null,
      bestCaseOnTime: c,
      bestCasePct: g,
      projectedOnTime: s,
      projectedPct: f,
      currentPct: r > 0 ? p * 100 : null,
      status: x,
    }
  );
}
function v0(t, e) {
  if (t.length === 0) return null;
  let a = [...t].sort((o, l) => o - l),
    r = (e / 100) * (a.length - 1),
    n = Math.floor(r),
    i = Math.ceil(r);
  return n === i ? a[n] : a[n] + (a[i] - a[n]) * (r - n);
}
var vl = (t) => v0(t, 50);
function Rk(t, e, a = 1.96) {
  if (e === 0)
    return {
      low: 0,
      high: 1,
    };
  let r = t / e,
    n = a * a,
    i = 1 + n / e,
    o = r + n / (2 * e),
    l = a * Math.sqrt((r * (1 - r)) / e + n / (4 * e * e));
  return {
    low: Math.max(0, (o - l) / i),
    high: Math.min(1, (o + l) / i),
  };
}
function D8(t, e) {
  return e.deadlineBasis === "updated" ? t.deadlineUpdated : t.deadlineOriginal;
}
function Dk(t, e, a = 1 / 0) {
  let r = [],
    n = 0,
    i = e.toleranceMin;
  for (let d of t) {
    let c = d.actual;
    if (d.cancellation) {
      if (d.cancellation.at > a) continue;
      e.cancellations === "driver_late" &&
      d.cancellation.initiatedBy === "driver"
        ? r.push({
            orderId: d.id,
            kind: "order",
            at: d.cancellation.at,
            onTime: !1,
          })
        : n++;
      continue;
    }
    if (c.delivered === void 0 || c.delivered > a) continue;
    if (e.measuredEvent === "pickup_and_dropoff_arrivals") {
      let p = d.planned.arrivedPickup - d.planned.accepted,
        u = d.planned.arrivedDropoff - d.planned.pickedUp,
        s =
          (c.arrivedPickup ?? c.delivered) - (c.accepted ?? d.planned.accepted),
        f = (c.arrivedDropoff ?? c.delivered) - (c.pickedUp ?? c.delivered);
      (r.push({
        orderId: d.id,
        kind: "pickup_arrival",
        at: c.arrivedPickup ?? c.delivered,
        onTime: s <= p + i,
      }),
        r.push({
          orderId: d.id,
          kind: "dropoff_arrival",
          at: c.arrivedDropoff ?? c.delivered,
          onTime: f <= u + i,
        }));
      continue;
    }
    let g =
      e.measuredEvent === "dropoff_arrival"
        ? (c.arrivedDropoff ?? c.delivered)
        : c.delivered;
    if (
      e.excludeRestaurantWait &&
      c.pickedUp !== void 0 &&
      c.arrivedPickup !== void 0
    ) {
      let p = d.planned.pickedUp - d.planned.arrivedPickup,
        u = Math.max(0, c.pickedUp - c.arrivedPickup - p);
      g -= u;
    }
    if (
      e.measuredEvent === "handover" &&
      e.excludeCustomerWait &&
      c.arrivedDropoff !== void 0
    ) {
      let p = d.planned.delivered - d.planned.arrivedDropoff;
      g -= Math.max(0, c.delivered - c.arrivedDropoff - p);
    }
    r.push({
      orderId: d.id,
      kind: "order",
      at: c.delivered,
      onTime: g <= D8(d, e) + i,
    });
  }
  let o = r;
  e.window.kind === "rolling" &&
    (o = [...r].sort((d, c) => d.at - c.at).slice(-e.window.size));
  let l = o.filter((d) => d.onTime).length;
  return {
    ...Pe(l, o.length),
    excluded: n,
    units: o,
  };
}
function Gr(t) {
  return t.cancellation || t.actual.delivered === void 0
    ? null
    : t.actual.delivered <= t.deadlineOriginal;
}
var zk = {
  soonWithin: 15,
  neighbourTravel: 8,
};
function z8(t, e, a, r = zk) {
  let n = t.zoneId === e.id,
    i = e.neighbors.includes(t.zoneId),
    o = t.shiftEnd - a < 20,
    l = (d, c) => ({
      ...t,
      availability: d,
      explanation: c,
    });
  switch (t.activity) {
    case "off_shift":
      return l("unavailable", "Not on shift");
    case "no_show":
      return l("unavailable", "No-show: replacement needed");
    case "blocked":
      return t.reason?.startsWith("Pre-shift check")
        ? l("unavailable", t.reason)
        : l(
            "unavailable",
            t.reason
              ? `Failed pre-shift check: ${t.reason}`
              : "Failed pre-shift check",
          );
    case "not_started":
      return t.freeAt !== null && t.freeAt - a <= r.soonWithin && n
        ? l("soon", `Shift starts at ${k0(t.freeAt)}`)
        : l("unavailable", "Shift not started");
    case "on_break":
      return t.freeAt !== null && t.freeAt - a <= 5 && n
        ? l("soon", `Break ends at ${k0(t.freeAt)}`)
        : l("unavailable", "On break");
    case "on_delivery": {
      let d = (t.freeAt ?? a) + (n ? 0 : i ? r.neighbourTravel : 1 / 0);
      return o
        ? l("unavailable", "Shift ends soon")
        : d - a <= r.soonWithin
          ? l("soon", `Finishing nearby, free about ${k0(d)}`)
          : l(
              "unavailable",
              n || i
                ? "Long active delivery"
                : "Delivery ends in a distant zone",
            );
    }
    case "free":
      return o
        ? l("unavailable", "Shift ends soon")
        : n
          ? l("now", "Free inside the zone")
          : i
            ? l(
                "soon",
                `Free in a neighbouring zone (+${r.neighbourTravel} min)`,
              )
            : l("unavailable", "Free but far from this zone");
  }
}
function k0(t) {
  let e = Math.floor(t / 60) % 24,
    a = Math.floor(t % 60);
  return `${String(e).padStart(2, "0")}:${String(a).padStart(2, "0")}`;
}
function Vk(t, e, a, r, n = 0.85, i = zk) {
  let l = e.filter((M) => M.zoneId === t.id).map((M) => z8(M, t, a, i)),
    d = l.filter((M) => M.availability === "now").length,
    c = l.filter((M) => M.availability === "soon").length,
    g = l.length - d - c,
    p = r * 2,
    u = Ln(p, t.minutesPerOrder, n),
    s =
      l.filter(
        (M) =>
          (M.activity === "on_delivery" || M.activity === "free") &&
          M.shiftEnd - a >= 20,
      ).length +
      l.filter(
        (M) =>
          M.availability === "soon" &&
          (M.activity === "not_started" || M.activity === "on_break"),
      ).length,
    f = Math.max(0, u.rounded - s),
    x =
      f > 0 ? "short" : s - u.rounded >= t.reserveDrivers ? "covered" : "tight";
  return {
    capacity: {
      zoneId: t.id,
      forecastOrders: r,
      ordersPerHour: p,
      required: u.rounded,
      requiredExact: u.exact,
      availableNow: d,
      availableSoon: c,
      unavailable: g,
      usable: s,
      gap: f,
      reserve: t.reserveDrivers,
      status: x,
    },
    drivers: l,
  };
}
function Pk(t, e, a) {
  let r = [],
    n = {};
  for (let l of t) {
    let d = e[l.id];
    n[l.id] = Math.floor(d.usable - d.required - l.reserveDrivers);
  }
  let i = t
      .filter((l) => e[l.id].gap > 0)
      .sort((l, d) => e[d.id].gap - e[l.id].gap),
    o = new Set();
  for (let l of i) {
    let d = e[l.id].gap,
      c = l.neighbors
        .map((g) => t.find((p) => p.id === g))
        .filter((g) => !!g && n[g.id] > 0)
        .sort((g, p) => n[p.id] - n[g.id]);
    for (let g of c) {
      let p = (a[g.id] ?? []).filter(
        (u) => u.availability === "now" && !o.has(u.driverId),
      );
      for (; d > 0 && n[g.id] > 0 && p.length > 0;) {
        let u = p.shift();
        (o.add(u.driverId),
          n[g.id]--,
          d--,
          r.push({
            driverId: u.driverId,
            driverName: u.name,
            from: g.id,
            to: l.id,
            reason: `${g.name} keeps ${e[g.id].required} required + ${g.reserveDrivers} reserve after the move`,
          }));
      }
    }
  }
  return r;
}
var k2 = [
    {
      from: "2025-01-01",
      rate: 12.82,
    },
    {
      from: "2026-01-01",
      rate: 13.9,
    },
    {
      from: "2027-01-01",
      rate: 14.6,
    },
  ],
  x2 = {
    2025: 556,
    2026: 603,
    2027: 633,
  };
function x0(t) {
  let e = k2[0].rate;
  for (let a of k2) t >= a.from && (e = a.rate);
  return e;
}
function y2(t, e) {
  let a = x0(e);
  return {
    ok: t >= a - 1e-9,
    minimum: a,
    shortfall: Math.max(0, a - t),
  };
}
function kl(t, e) {
  let a = x2[e] ?? x2[2026],
    r = t / a,
    n = r > 1 ? "breach" : r >= 0.9 ? "warning" : "ok";
  return {
    limit: a,
    share: r,
    state: n,
    headroom: a - t,
  };
}
function Uk(t, e, a) {
  let r = t > 540 ? 45 : t > 360 ? 30 : 0,
    n = e.filter((o) => o >= 15).reduce((o, l) => o + l, 0),
    i = [];
  return (
    n < r && i.push(`Break ${n} min, ${r} min required`),
    a > 360 &&
      i.push(`Worked ${Math.round(a / 6) / 10} h without a break (max 6 h)`),
    t > 600 && i.push("Over 10 hours in one day"),
    {
      required: r,
      counted: n,
      ok: i.length === 0,
      issues: i,
    }
  );
}
function gi(t, e) {
  return t ? Math.round((Date.parse(t) - Date.parse(e)) / 864e5) : null;
}
var Ji = {
  employerOnCost: 0.21,
  vehiclePerHour: {
    bike: 0.25,
    e_bike: 0.6,
    scooter: 0.9,
    car: 2.4,
  },
  maintenancePerHour: {
    bike: 0.15,
    e_bike: 0.3,
    scooter: 0.45,
    car: 0.8,
  },
  energyPerKm: {
    bike: 0,
    e_bike: 0.01,
    scooter: 0.04,
    car: 0.14,
  },
  equipmentPerShift: 0.8,
  supportPerShift: 2.5,
  revenuePerDelivery: {
    uber_eats: 9.2,
    wolt: 8.9,
    lieferando: 8.6,
  },
};
function Ik(t, e = Ji) {
  let a = t.deliveries * e.revenuePerDelivery[t.platform],
    r = {
      driver: t.paidHours * t.hourlyRate * (1 + e.employerOnCost),
      vehicle: t.paidHours * e.vehiclePerHour[t.vehicle],
      maintenance: t.paidHours * e.maintenancePerHour[t.vehicle],
      energy: t.km * e.energyPerKm[t.vehicle],
      equipment: t.paidHours > 0 ? e.equipmentPerShift : 0,
      support: t.paidHours > 0 ? e.supportPerShift : 0,
    },
    n = Object.values(r).reduce((o, l) => o + l, 0),
    i = t.paidHours > 0 ? n / t.paidHours : 0;
  return {
    revenue: a,
    costs: r,
    totalCost: n,
    contribution: a - n,
    marginPct: a > 0 ? ((a - n) / a) * 100 : null,
    deliveriesPerPaidHour: t.paidHours > 0 ? t.deliveries / t.paidHours : null,
    deliveriesPerOnlineHour:
      t.onlineHours > 0 ? t.deliveries / t.onlineHours : null,
    breakEvenPerPaidHour: i / e.revenuePerDelivery[t.platform],
  };
}
function y0(t) {
  let e = {
    revenue: 0,
    totalCost: 0,
    contribution: 0,
    driver: 0,
    vehicle: 0,
    maintenance: 0,
    energy: 0,
    equipment: 0,
    support: 0,
  };
  for (let a of t) {
    ((e.revenue += a.revenue),
      (e.totalCost += a.totalCost),
      (e.contribution += a.contribution));
    for (let r of Object.keys(a.costs)) e[r] += a.costs[r];
  }
  return {
    ...e,
    marginPct: e.revenue > 0 ? (e.contribution / e.revenue) * 100 : null,
  };
}
var $k = (t) => Math.min(47, Math.max(0, Math.floor(t / 30))),
  L2 = (t) =>
    `${String(Math.floor(t / 2)).padStart(2, "0")}:${t % 2 === 0 ? "00" : "30"}`;
function V8(t, e, a, r = {}) {
  let n = r.weeks ?? 6,
    i = r.decay ?? 0.8,
    o = t
      .filter((g) => g.dow === a && g.slots[e])
      .sort((g, p) => (g.date < p.date ? 1 : -1))
      .slice(0, n),
    l = new Array(48).fill(0),
    d = new Array(48).fill(0);
  if (o.length === 0)
    return {
      mean: l,
      sd: d,
      days: 0,
    };
  let c = 0;
  o.forEach((g, p) => {
    let u = Math.pow(i, p);
    ((c += u), g.slots[e].forEach((s, f) => (l[f] += u * s)));
  });
  for (let g = 0; g < 48; g++) l[g] /= c;
  o.forEach((g, p) => {
    let u = Math.pow(i, p);
    g.slots[e].forEach((s, f) => (d[f] += (u * (s - l[f]) ** 2) / c));
  });
  for (let g = 0; g < 48; g++) d[g] = Math.sqrt(d[g]);
  return {
    mean: l,
    sd: d,
    days: o.length,
  };
}
function P8(t, e, a = 0.6) {
  if (t < 5) return 1;
  let r = e / t,
    n = a * r + (1 - a) * 1;
  return Math.min(1.5, Math.max(0.6, n));
}
function Fk(t, e, a, r, n, i = {}) {
  let o = V8(t, e, a, i),
    l = 0,
    d = 0;
  if (r) for (let u = 0; u < n; u++) ((l += o.mean[u]), (d += r[u] ?? 0));
  let c = r ? P8(l, d, i.alpha) : 1,
    g = i.multiplier ?? 1;
  return {
    slots: o.mean.map((u, s) => {
      let f = i.slotMultipliers?.[s] ?? 1,
        x = u * c * g * f,
        M = Math.max(o.sd[s] * c * g * f, Math.sqrt(Math.max(x, 0)));
      return {
        slot: s,
        p50: x,
        p90: x + 1.2816 * M,
        actual: r && s < n ? (r[s] ?? 0) : null,
      };
    }),
    level: c,
    daysUsed: o.days,
  };
}
function L0(t, e, a, r = "p50") {
  let n = 0,
    i = e + a;
  for (let o of t) {
    let l = o.slot * 30,
      d = l + 30,
      c = Math.max(0, Math.min(d, i) - Math.max(l, e));
    c > 0 && (n += (o[r] * c) / 30);
  }
  return n;
}
function sr(t, e) {
  let a = t.actual;
  return t.cancellation && t.cancellation.at <= e
    ? "cancelled"
    : t.createdAt > e
      ? "not_started"
      : a.accepted === void 0 || a.accepted > e
        ? "waiting_driver"
        : a.delivered !== void 0 && a.delivered <= e
          ? "done"
          : a.arrivedDropoff !== void 0 && a.arrivedDropoff <= e
            ? "at_customer"
            : a.pickedUp !== void 0 && a.pickedUp <= e
              ? "to_customer"
              : a.arrivedPickup !== void 0 && a.arrivedPickup <= e
                ? "at_pickup"
                : "to_pickup";
}
function Zk(t, e, a) {
  let r = sr(t, e),
    n = t.planned,
    i = t.actual,
    o = a.handoverMin ?? n.delivered - n.arrivedDropoff,
    l = n.arrivedDropoff - n.pickedUp,
    d = n.pickedUp - n.arrivedPickup,
    c = n.pickedUp + Math.max(0, a.restaurantDelay(t.restaurantId)),
    g = e,
    p = {
      toPickup: 0,
      wait: 0,
      toCustomer: 0,
      handover: 0,
    },
    u = n.arrivedPickup - n.accepted;
  if (r === "waiting_driver") {
    let M = e + 3 + u;
    ((p.toPickup = M - g), (g = M));
  }
  if (r === "to_pickup") {
    let M = i.accepted + u,
      h = Math.max(e + 0.5, M > e ? M : e + 2);
    ((p.toPickup = h - g), (g = h));
  }
  if (r === "waiting_driver" || r === "to_pickup" || r === "at_pickup") {
    let M = r === "at_pickup" ? i.arrivedPickup : g,
      h = Math.max(g + 0.5, c, M + Math.min(d, 2));
    ((p.wait = h - g), (g = h));
  }
  if (
    r === "waiting_driver" ||
    r === "to_pickup" ||
    r === "at_pickup" ||
    r === "to_customer"
  ) {
    let M = r === "to_customer" ? i.pickedUp : g,
      h = Math.max(g + 0.5, M + l);
    ((p.toCustomer = h - g), (g = h));
  }
  if (r !== "done" && r !== "cancelled" && r !== "not_started") {
    let M = r === "at_customer" ? i.arrivedDropoff : g,
      h = Math.max(g + 0.3, M + o);
    ((p.handover = h - g), (g = h));
  }
  r === "done" && (g = i.delivered);
  let s = t.deadlineUpdated,
    f = m2(s, g),
    x = [
      [
        "Waiting for a free driver",
        r === "waiting_driver" ? e + 3 - n.accepted : 0,
      ],
      [
        "Restaurant not ready",
        r === "waiting_driver" || r === "to_pickup" || r === "at_pickup"
          ? c - n.pickedUp
          : 0,
      ],
      [
        "Late arrival at restaurant",
        r === "to_pickup"
          ? e - i.accepted - u
          : r === "at_pickup"
            ? i.arrivedPickup - n.arrivedPickup
            : 0,
      ],
      ["Travel to customer", r === "to_customer" ? e - i.pickedUp - l : 0],
      ["Customer handover", r === "at_customer" ? e - i.arrivedDropoff - o : 0],
    ];
  return (
    x.sort((M, h) => h[1] - M[1]),
    {
      orderId: t.id,
      stage: r,
      predictedCompletion: g,
      deadline: s,
      margin: f,
      band: v2(f, a.bands ?? m0),
      breakdown: p,
      likelyCause: x[0][1] > 0.5 ? x[0][0] : "No single cause",
    }
  );
}
var V = (t) => {
    if (t == null || !Number.isFinite(t)) return "\u2014";
    let e = Math.round(t),
      a = Math.floor(e / 60) % 24,
      r = ((e % 60) + 60) % 60;
    return `${String(a).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  },
  Et = (t, e = 1) =>
    t == null || !Number.isFinite(t) ? "\u2014" : `${t.toFixed(e)}%`,
  U8 = (t, e = 0) =>
    t == null || !Number.isFinite(t)
      ? "\u2014"
      : t.toLocaleString("en-GB", {
          minimumFractionDigits: e,
          maximumFractionDigits: e,
        }),
  ie = (t, e = 0) =>
    t == null || !Number.isFinite(t)
      ? "\u2014"
      : `${t < 0 && Math.abs(t) >= 0.5 * 10 ** -e ? "\u2212" : ""}\u20AC${Math.abs(
          t,
        ).toLocaleString("en-GB", {
          minimumFractionDigits: e,
          maximumFractionDigits: e,
        })}`,
  Id = (t) => {
    if (t == null || !Number.isFinite(t)) return "\u2014";
    let e = Math.round(t);
    return `${e > 0 ? "+" : ""}${e} min`;
  },
  M2 = (t) =>
    Math.abs(t) >= 1e6
      ? `${(t / 1e6).toFixed(1)}M`
      : Math.abs(t) >= 1e4
        ? `${(t / 1e3).toFixed(1)}K`
        : U8(t),
  mt = {
    uber_eats: "Uber Eats",
    wolt: "Wolt",
    lieferando: "Lieferando",
  },
  me = ["uber_eats", "wolt", "lieferando"],
  ra = {
    bike: "Bicycle",
    e_bike: "E-bike",
    scooter: "E-scooter",
    car: "Car",
  },
  Be = "2026-09-16";
var b2 = 50;
function to(t, e = null) {
  let a = t.deliveries28,
    r = Pe(t.onTime28, a).pct,
    n = a - t.lateDriverControllable28,
    i = Pe(n, a).pct,
    o = a > 0 ? Rk(n, a) : null,
    l = a >= b2,
    d = Pe(t.cancelsDriver28, t.acceptedOrders28).pct,
    c = Pe(t.staffedHours28, t.scheduledHours28).pct,
    g = Pe(t.wrongOrMissing28, a).pct,
    p = t.lateRestaurant28 + t.lateOther28,
    u = "no_action",
    s;
  if (!l)
    ((u = "insufficient_data"),
      (s = `Only ${a} deliveries in 28 days; at least ${b2} are needed before any assessment.`));
  else {
    let f = (o?.high ?? 1) * 100,
      x = (o?.low ?? 0) * 100,
      M = e ?? 95;
    f < M - 1
      ? ((u = "coaching_conversation"),
        (s = `${t.lateDriverControllable28} late deliveries were in legs the driver controls; even the best case (${f.toFixed(1)}%) is below the peer median ${M.toFixed(1)}%. ${p} late deliveries caused by restaurants or others were not counted.`))
      : x > M + 0.5 && (c ?? 0) >= 95
        ? ((u = "recognise"),
          (s = `Consistently above peers (${x.toFixed(1)}% or better) with reliable attendance.`))
        : (s = `Within the normal range for comparable zones. ${p} restaurant or platform delays excluded.`);
  }
  return (
    t.flags.length > 0 &&
      (s += ` ${t.flags.length} record${t.flags.length > 1 ? "s" : ""} flagged for human review.`),
    {
      driverId: t.driverId,
      deliveries: a,
      rawPct: r,
      adjustedPct: i,
      adjustedLow: o ? o.low * 100 : null,
      adjustedHigh: o ? o.high * 100 : null,
      controllableLate: t.lateDriverControllable28,
      excludedLate: p,
      cancellationPct: d,
      attendancePct: c,
      wrongOrMissingPct: g,
      zoneDifficulty: t.zoneDifficulty,
      sufficient: l,
      outcome: u,
      explanation: s,
      flags: t.flags,
    }
  );
}
function qk(t) {
  let e = t.actual,
    a = [];
  if (
    (e.delivered !== void 0 &&
      e.arrivedDropoff !== void 0 &&
      e.delivered < e.arrivedDropoff &&
      a.push({
        kind: "completed_before_arrival",
        orderId: t.id,
        detail: "Marked delivered before arriving at the customer",
      }),
    e.pickedUp !== void 0 && e.arrivedDropoff !== void 0)
  ) {
    let r = t.planned.arrivedDropoff - t.planned.pickedUp,
      n = e.arrivedDropoff - e.pickedUp;
    r > 4 &&
      n < r * 0.4 &&
      a.push({
        kind: "implausibly_fast",
        orderId: t.id,
        detail: `Trip took ${n.toFixed(1)} min against ${r.toFixed(1)} min planned`,
      });
  }
  if (
    t.cancellation?.initiatedBy === "driver" &&
    t.cancellation.stage === "at_pickup" &&
    e.arrivedPickup !== void 0
  ) {
    let r = t.cancellation.at - e.arrivedPickup;
    r > 15 &&
      a.push({
        kind: "cancel_after_long_wait",
        orderId: t.id,
        detail: `Driver cancelled after waiting ${Math.round(r)} min; check the restaurant, not only the driver`,
      });
  }
  return a;
}
function Gk(t, e) {
  let a = new Map();
  for (let r of t) {
    if (!r.driverId || r.planned.accepted > e) continue;
    let n = a.get(r.driverId) ?? {
      deliveries: 0,
      onTime: 0,
      controllable: 0,
      excluded: 0,
      cancels: 0,
      accepted: 0,
    };
    if ((n.accepted++, r.cancellation && r.cancellation.at <= e))
      r.cancellation.initiatedBy === "driver" && n.cancels++;
    else if (r.actual.delivered !== void 0 && r.actual.delivered <= e) {
      n.deliveries++;
      let i = pi(r);
      i && !i.late
        ? n.onTime++
        : i && Qi.includes(i.primaryCause)
          ? n.controllable++
          : n.excluded++;
    }
    a.set(r.driverId, n);
  }
  return a;
}
function Kk(t) {
  let e = t >>> 0;
  return () => {
    e = (e + 1831565813) >>> 0;
    let a = e;
    return (
      (a = Math.imul(a ^ (a >>> 15), a | 1)),
      (a ^= a + Math.imul(a ^ (a >>> 7), a | 61)),
      ((a ^ (a >>> 14)) >>> 0) / 4294967296
    );
  };
}
var eo = (t, e = 0, a = 1) => {
    let r = Math.max(t(), 1e-12),
      n = t();
    return e + a * Math.sqrt(-2 * Math.log(r)) * Math.cos(2 * Math.PI * n);
  },
  _e = (t, e, a) => e + (a - e) * t(),
  na = (t, e, a) => Math.floor(_e(t, e, a + 1)),
  ao = (t, e) => e[Math.floor(t() * e.length)];
function w2(t, e, a) {
  let r = a.reduce((i, o) => i + o, 0),
    n = t() * r;
  for (let i = 0; i < e.length; i++) if (((n -= a[i]), n <= 0)) return e[i];
  return e[e.length - 1];
}
function M0(t, e) {
  if (e <= 0) return 0;
  if (e > 30) return Math.max(0, Math.round(eo(t, e, Math.sqrt(e))));
  let a = Math.exp(-e),
    r = 0,
    n = 1;
  do (r++, (n *= t()));
  while (n > a);
  return r - 1;
}
var Yk = (t, e) => -Math.log(Math.max(t(), 1e-12)) * e;
var $d = "2026-09-16",
  b0 = 3,
  C2 = 630,
  xl = 1425,
  Kr = [
    {
      id: "innenstadt",
      name: "Innenstadt",
      city: "Frankfurt",
      x: 52,
      y: 50,
      neighbors: ["westend", "nordend", "ostend", "sachsenhausen", "gallus"],
      reserveDrivers: 2,
      minutesPerOrder: 19,
      demandShare: 0.2,
    },
    {
      id: "sachsenhausen",
      name: "Sachsenhausen",
      city: "Frankfurt",
      x: 55,
      y: 74,
      neighbors: ["innenstadt", "ostend", "gallus"],
      reserveDrivers: 1,
      minutesPerOrder: 22,
      demandShare: 0.15,
    },
    {
      id: "nordend",
      name: "Nordend",
      city: "Frankfurt",
      x: 56,
      y: 30,
      neighbors: ["innenstadt", "bornheim", "westend"],
      reserveDrivers: 1,
      minutesPerOrder: 20,
      demandShare: 0.15,
    },
    {
      id: "bornheim",
      name: "Bornheim",
      city: "Frankfurt",
      x: 76,
      y: 26,
      neighbors: ["nordend", "ostend"],
      reserveDrivers: 1,
      minutesPerOrder: 21,
      demandShare: 0.11,
    },
    {
      id: "bockenheim",
      name: "Bockenheim",
      city: "Frankfurt",
      x: 20,
      y: 34,
      neighbors: ["westend", "gallus"],
      reserveDrivers: 1,
      minutesPerOrder: 21,
      demandShare: 0.11,
    },
    {
      id: "westend",
      name: "Westend",
      city: "Frankfurt",
      x: 34,
      y: 36,
      neighbors: ["innenstadt", "nordend", "bockenheim", "gallus"],
      reserveDrivers: 1,
      minutesPerOrder: 20,
      demandShare: 0.1,
    },
    {
      id: "ostend",
      name: "Ostend",
      city: "Frankfurt",
      x: 80,
      y: 52,
      neighbors: ["innenstadt", "bornheim", "sachsenhausen"],
      reserveDrivers: 1,
      minutesPerOrder: 22,
      demandShare: 0.1,
    },
    {
      id: "gallus",
      name: "Gallus",
      city: "Frankfurt",
      x: 24,
      y: 60,
      neighbors: ["innenstadt", "westend", "bockenheim", "sachsenhausen"],
      reserveDrivers: 1,
      minutesPerOrder: 23,
      demandShare: 0.08,
    },
  ],
  rt = (t) => Kr.find((e) => e.id === t)?.name ?? t,
  I8 = {
    innenstadt: [
      ["Zeil Burger Kitchen", "Burgers", 1, 3],
      ["R\xF6mer Ramen", "Japanese", 2, 4],
      ["Hauptwache D\xF6ner", "Turkish", 0, 2],
      ["Konstabler Poke", "Poke", 0, 2],
      ["Paulsplatz Pizzeria", "Pizza", 3, 5],
      ["Liebfrauen Thai", "Thai", 1, 3],
    ],
    sachsenhausen: [
      ["Apfelwein Grill", "German", 6, 5],
      ["Schweizer Str. Sushi", "Japanese", 2, 3],
      ["Br\xFCckenstra\xDFe Bowls", "Healthy", 0, 2],
      ["Museumsufer Tacos", "Mexican", 1, 3],
      ["Textorstra\xDFe Curry", "Indian", 4, 4],
    ],
    nordend: [
      ["Berger Pasta Bar", "Italian", 1, 2],
      ["Oeder Weg Falafel", "Middle Eastern", 0, 2],
      ["Glauburg Pho", "Vietnamese", 1, 2],
      ["Nordend Smash", "Burgers", 2, 3],
      ["Friedberger Pizza", "Pizza", 1, 3],
    ],
    bornheim: [
      ["Uhrt\xFCrmchen Kebab", "Turkish", 0, 2],
      ["Bornheim Biryani", "Indian", 3, 4],
      ["Mitte Wok", "Chinese", 1, 2],
      ["Saalburg Salads", "Healthy", 0, 1],
    ],
    bockenheim: [
      ["Campus Noodles", "Asian", 1, 2],
      ["Leipziger Str. Pizza", "Pizza", 2, 3],
      ["Kurf\xFCrsten Grill", "Grill", 5, 5],
      ["Bockenheim Bagels", "Breakfast", 0, 1],
    ],
    westend: [
      ["Gr\xFCneburg Sushi", "Japanese", 1, 2],
      ["Palmengarten Bistro", "French", 2, 3],
      ["Westend Burrito", "Mexican", 0, 2],
      ["Opernplatz Deli", "Deli", 0, 1],
    ],
    ostend: [
      ["Hanauer Landstra\xDFe BBQ", "Barbecue", 4, 5],
      ["Osthafen Pizza", "Pizza", 1, 2],
      ["Ostpark Poke", "Poke", 0, 1],
      ["Danziger Platz Dumplings", "Chinese", 2, 3],
    ],
    gallus: [
      ["Kleyerstra\xDFe Kebab", "Turkish", 1, 2],
      ["Galluspark Curry", "Indian", 2, 3],
      ["Messe Burger", "Burgers", 1, 2],
    ],
  },
  t5 = Object.entries(I8).flatMap(([t, e]) =>
    e.map(([a, r, n, i], o) => ({
      id: `${t.slice(0, 3)}-${o + 1}`,
      name: a,
      zoneId: t,
      cuisine: r,
      readinessDelayMean: n,
      readinessDelaySd: i,
    })),
  ),
  Xk = [
    "Jonas",
    "Lea",
    "Omar",
    "Mila",
    "Nina",
    "Felix",
    "Sarah",
    "Ahmed",
    "Lukas",
    "Amira",
    "Tim",
    "Hannah",
    "Yusuf",
    "Elif",
    "Paul",
    "Sofia",
    "Karim",
    "Julia",
    "Mehmet",
    "Anna",
    "David",
    "Zeynep",
    "Leon",
    "Aylin",
    "Noah",
    "Marta",
    "Ravi",
    "Laura",
    "Emre",
    "Priya",
    "Ben",
    "Chiara",
    "Samuel",
    "Ines",
    "Tariq",
    "Greta",
    "Arjun",
    "Maja",
    "Kofi",
    "Lena",
  ],
  Qk = [
    "Kr\xFCger",
    "Hoffmann",
    "Haddad",
    "Fischer",
    "Vogel",
    "Schmidt",
    "Weber",
    "Yilmaz",
    "Becker",
    "Nasser",
    "Wagner",
    "Demir",
    "Klein",
    "Kaya",
    "Wolf",
    "Rossi",
    "Mansour",
    "Braun",
    "\xD6zt\xFCrk",
    "Richter",
    "Nowak",
    "Aksoy",
    "Lang",
    "Arslan",
    "Hartmann",
    "Kowalski",
    "Patel",
    "Schulz",
    "\xC7elik",
    "Iyer",
    "Neumann",
    "Bianchi",
    "Mensah",
    "Costa",
    "Rahimi",
    "Lindner",
    "Sharma",
    "Zielinski",
    "Owusu",
    "Keller",
  ],
  Ca = [
    {
      id: "sl1",
      name: "Katrin Becker",
      org: "EELS",
      phone: "+49 6142 000 101",
      window: "10:30-17:00",
    },
    {
      id: "sl2",
      name: "Tobias Lang",
      org: "EELS",
      phone: "+49 6142 000 102",
      window: "16:30-23:45",
    },
  ],
  Yr = [
    {
      id: "al1",
      name: "Samir Nasser",
      org: "Alnaif Lieferdienst",
      phone: "+49 69 000 201",
      window: "10:30-17:00",
    },
    {
      id: "al2",
      name: "Dilara Aksoy",
      org: "Alnaif Lieferdienst",
      phone: "+49 69 000 202",
      window: "16:30-23:45",
    },
  ],
  $8 = {
    bike: 14,
    e_bike: 18,
    scooter: 20,
    car: 17,
  },
  F8 = {
    bike: 1,
    e_bike: 1,
    scooter: 1.5,
    car: 3,
  },
  Jk = (t, e) => (t / $8[e]) * 60 + F8[e];
function e5(t) {
  let e = new Array(48).fill(0);
  for (let r = 21; r <= 47; r++) {
    let n = r / 2,
      i = 22 * Math.exp(-((n - 12.75) ** 2) / (2 * 0.8 ** 2)),
      o = 38 * Math.exp(-((n - 19.25) ** 2) / (2 * 1.1 ** 2)),
      l = n >= 11 && n < 23 ? 6 : n >= 10.5 && n < 23.5 ? 2 : 0;
    e[r] = i + o + l;
  }
  let a = [1.25, 0.88, 0.9, 1, 1.02, 1.22, 1.3][t];
  return e.map((r) => r * a);
}
var Z8 = [
  {
    label: "Lunch",
    start: 660,
    end: 900,
  },
  {
    label: "Day",
    start: 660,
    end: 1050,
  },
  {
    label: "Late afternoon",
    start: 900,
    end: 1200,
  },
  {
    label: "Dinner",
    start: 1050,
    end: 1320,
  },
  {
    label: "Evening",
    start: 1110,
    end: 1410,
  },
];
function a5(t = 20260916, e = {}) {
  let a = Kk(t),
    r = [],
    n = [],
    i = {},
    o = {},
    l = {
      innenstadt: [5, 1, 2, 6, 4],
      sachsenhausen: [3, 1, 1, 3, 3],
      nordend: [4, 1, 2, 5, 3],
      bornheim: [2, 1, 1, 4, 2],
      bockenheim: [3, 1, 1, 4, 2],
      westend: [2, 1, 1, 3, 2],
      ostend: [2, 1, 1, 3, 2],
      gallus: [2, 1, 1, 2, 2],
    },
    d = ["Full-time", "Part-time", "Mini-job", "Working Student", "Midi-job"],
    c = [
      "uber_eats",
      "wolt",
      "lieferando",
      "uber_eats",
      "wolt",
      "uber_eats",
      "lieferando",
      "wolt",
    ],
    g = [0, 0, 0, 0, 0],
    p = 0;
  for (let j of Kr)
    l[j.id].forEach((v, E) => {
      let Q = Math.round(v * (e.staffScale ?? 1));
      for (let _ = 0; _ < Q; _++) {
        p++;
        let Mt = `D${String(p).padStart(3, "0")}`,
          Wt = Z8[E],
          Tt = w2(a, ["e_bike", "bike", "scooter", "car"], [55, 22, 15, 8]),
          Pt = w2(a, d, [30, 30, 15, 15, 10]),
          Bt = Wt.end - Wt.start,
          Z = Pt === "Mini-job" ? 13.9 : Number(_e(a, 13.9, 15.5).toFixed(2)),
          qt = `V${String(p).padStart(3, "0")}`,
          Se = c[g[E]++ % c.length],
          ze = Bt > 360 ? 30 : 0;
        (n.push({
          id: Mt,
          name: `${Xk[(p * 7) % Xk.length]} ${Qk[(p * 11) % Qk.length]}`,
          employmentType: Pt,
          vehicleType: Tt,
          vehicleId: qt,
          homeZoneId: j.id,
          platform: Se,
          shiftStart: Wt.start,
          shiftEnd: Wt.end,
          breakStart: Wt.start + Math.round(Bt / 2 / 15) * 15 - 15,
          breakMinutes: ze,
          hourlyRate: Z,
          hoursPerWeek:
            Pt === "Full-time"
              ? 40
              : Pt === "Part-time"
                ? 25
                : Pt === "Midi-job"
                  ? 30
                  : Pt === "Working Student"
                    ? 20
                    : 10,
          contractType:
            Pt === "Full-time"
              ? "Permanent"
              : Pt === "Working Student"
                ? "Fixed-term"
                : Pt,
          joined: ao(a, ["Jul 2026", "Aug 2026", "Sep 2026", "Jun 2026"]),
          lateStartMin: a() < 0.12 ? na(a, 4, 18) : 0,
          noShow: !1,
          readinessPassed: !0,
          workPermitExpiry:
            a() < 0.3
              ? `2026-${ao(a, ["10", "11", "12"])}-${String(na(a, 1, 28)).padStart(2, "0")}`
              : a() < 0.5
                ? "2028-03-31"
                : null,
          contractEnd: Pt === "Working Student" ? "2027-02-28" : null,
          monthlyEarnings: 0,
          alnaifCoordinator: Wt.start < 960 ? Yr[0].name : Yr[1].name,
        }),
          (i[Mt] = Wt.label));
        let Qe = Tt === "e_bike" || Tt === "scooter",
          ot = Tt === "car" ? 15e3 : Tt === "bike" ? 1500 : 2e3;
        r.push({
          id: qt,
          type: Tt,
          label: `${Tt === "e_bike" ? "E-bike" : Tt === "bike" ? "Bike" : Tt === "scooter" ? "E-scooter" : "Car"} ${qt}`,
          status: "in_service",
          kmSinceService: Math.round(_e(a, 0.1, 1.05) * ot),
          serviceIntervalKm: ot,
          daysSinceService: na(a, 3, 95),
          serviceIntervalDays: Tt === "car" ? 365 : 90,
          batteryHealthPct: Qe ? na(a, 71, 99) : null,
          batteryCycles: Qe ? na(a, 40, 620) : null,
          assignedDriverId: Mt,
          downtimeMinutes7d: a() < 0.2 ? na(a, 20, 180) : 0,
          openDefects: [],
        });
      }
    });
  for (let j of n) {
    let v = j.hoursPerWeek * 4.33;
    ((j.monthlyEarnings = Math.round(v * j.hourlyRate)),
      j.employmentType === "Mini-job" &&
        (j.monthlyEarnings = Math.min(j.monthlyEarnings, na(a, 470, 590))));
  }
  let u = n.filter((j) => j.employmentType === "Mini-job");
  (u[0] && (u[0].monthlyEarnings = 571),
    u[1] && (u[1].monthlyEarnings = 612),
    (n[5].workPermitExpiry = "2026-09-28"),
    (n[17].workPermitExpiry = "2026-09-10"),
    (n[29].hourlyRate = 13.5));
  let s = (j, v) => n.filter((E) => E.homeZoneId === j && i[E.id] === v),
    f = s("sachsenhausen", "Dinner");
  f[0] && (f[0].noShow = !0);
  let x = s("ostend", "Evening");
  x[1] && (x[1].noShow = !0);
  let M = s("sachsenhausen", "Evening")[0];
  M &&
    ((M.readinessPassed = !1),
    (M.readinessIssue = "E-bike battery at 18%, spare battery needed"),
    (o[M.id] = 1135));
  let h = s("nordend", "Dinner")[0];
  h &&
    ((h.readinessPassed = !1),
    (h.readinessIssue = "Delivery bag not clean"),
    (o[h.id] = 1045));
  let m = s("gallus", "Evening")[0];
  (m && (m.readinessPassed = null),
    [
      ["e_bike", "reserve"],
      ["e_bike", "reserve"],
      ["bike", "reserve"],
      ["scooter", "maintenance"],
      ["car", "reserve"],
      ["e_bike", "defect"],
    ].forEach(([j, v], E) => {
      let Q = `R${String(E + 1).padStart(2, "0")}`;
      r.push({
        id: Q,
        type: j,
        label: `Reserve ${j === "e_bike" ? "E-bike" : j === "bike" ? "Bike" : j === "scooter" ? "E-scooter" : "Car"} ${Q}`,
        status: v,
        kmSinceService: na(a, 50, 900),
        serviceIntervalKm: j === "car" ? 15e3 : 2e3,
        daysSinceService: na(a, 5, 60),
        serviceIntervalDays: j === "car" ? 365 : 90,
        batteryHealthPct:
          j === "e_bike" || j === "scooter" ? na(a, 80, 97) : null,
        batteryCycles:
          j === "e_bike" || j === "scooter" ? na(a, 30, 300) : null,
        assignedDriverId: null,
        downtimeMinutes7d: v === "defect" ? 1440 : 0,
        openDefects:
          v === "defect"
            ? ["Rear brake pads worn"]
            : v === "maintenance"
              ? ["Scheduled service"]
              : [],
      });
    }));
  let k = r.find((j) => j.assignedDriverId === M?.id);
  k && k.openDefects.push("Battery below 20% at shift start");
  let L = G8(a, n, o, e.dailyTotal ?? 640),
    w = {};
  for (let j of Kr) w[j.id] = new Array(48).fill(0);
  for (let j of L) w[j.zoneId][Math.floor(j.createdAt / 30)]++;
  let O = K8(a),
    A = {};
  return (
    n.forEach((j, v) => {
      let E = j.joined === "Sep 2026" ? na(a, 3, 7) : na(a, 14, 20),
        Q = ((j.shiftEnd - j.shiftStart) / 60) * _e(a, 1.9, 2.5),
        _ = Math.round(E * Q),
        Mt = Number(
          (
            Kr.find((Se) => Se.id === j.homeZoneId).minutesPerOrder / 20
          ).toFixed(2),
        ),
        Wt = Math.round(_ * _e(a, 0.005, 0.025));
      (v === 8 || v === 33) && (Wt = Math.round(_ * 0.075));
      let Tt = Math.round(_ * _e(a, 0.02, 0.05) * Mt),
        Pt = Math.round(_ * _e(a, 0.003, 0.012)),
        Bt = (E * (j.shiftEnd - j.shiftStart)) / 60,
        Z = _ + na(a, 0, 6),
        qt = qk({
          id: `H-${j.id}`,
          platform: j.platform,
          zoneId: j.homeZoneId,
          dropoffZoneId: j.homeZoneId,
          restaurantId: "",
          driverId: j.id,
          createdAt: 0,
          toPickupKm: 1,
          distanceKm: 2,
          deadlineOriginal: 30,
          deadlineUpdated: 30,
          planned: {
            accepted: 0,
            arrivedPickup: 6,
            pickedUp: 10,
            arrivedDropoff: 22,
            delivered: 24,
          },
          actual:
            v === 33
              ? {
                  accepted: 0,
                  arrivedPickup: 6,
                  pickedUp: 10,
                  arrivedDropoff: 14,
                  delivered: 13,
                }
              : {
                  accepted: 0,
                  arrivedPickup: 6,
                  pickedUp: 10,
                  arrivedDropoff: 22,
                  delivered: 24,
                },
          revenue: 0,
          wrongOrMissing: !1,
          equipmentIssue: !1,
        }).map((Se) => ({
          ...Se,
          orderId: `FRA-0912-${String(100 + v)}`,
        }));
      A[j.id] = {
        driverId: j.id,
        deliveries28: _,
        onTime28: _ - Wt - Tt - Pt,
        lateDriverControllable28: Wt,
        lateRestaurant28: Tt,
        lateOther28: Pt,
        cancelsDriver28: a() < 0.3 ? na(a, 1, 3) : 0,
        acceptedOrders28: Z,
        scheduledHours28: Math.round(Bt),
        staffedHours28: Math.round(Bt * (v === 21 ? 0.82 : _e(a, 0.94, 1))),
        lateStarts28: v === 21 ? 5 : na(a, 0, 2),
        noShows28: v === 21 ? 2 : 0,
        wrongOrMissing28: na(a, 0, 3),
        avgDistanceKm: Number(_e(a, 1.6, 3.4).toFixed(1)),
        zoneDifficulty: Mt,
        flags: qt,
      };
    }),
    {
      seed: t,
      date: $d,
      zones: Kr,
      restaurants: t5,
      drivers: n,
      vehicles: r,
      orders: L,
      history: O,
      driverHistory: A,
      unblockAt: o,
      shiftLabel: i,
      actualSlots: w,
    }
  );
}
function q8(t, e, a) {
  if (t.noShow || t.readinessPassed === null) return !1;
  let r = t.shiftStart + t.lateStartMin;
  return !(
    e < r ||
    e > t.shiftEnd - 8 ||
    (t.readinessPassed === !1 && e < (a[t.id] ?? 1 / 0)) ||
    (t.breakMinutes > 0 &&
      e >= t.breakStart &&
      e < t.breakStart + t.breakMinutes)
  );
}
function G8(t, e, a, r) {
  let n = e5(b0),
    i = n.reduce((u, s) => u + s, 0),
    o = [];
  for (let u of Kr)
    for (let s = 0; s < 48; s++) {
      let f = u.id === "sachsenhausen" && s >= 37 && s <= 40 ? 1.9 : 1,
        x = (n[s] / i) * r * u.demandShare * f,
        M = M0(t, x);
      for (let h = 0; h < M; h++)
        o.push({
          createdAt: s * 30 + t() * 30,
          zoneId: u.id,
          platform: w2(t, ["uber_eats", "wolt", "lieferando"], [40, 35, 25]),
        });
    }
  o.sort((u, s) => u.createdAt - s.createdAt);
  let l = new Map();
  for (let u of e)
    l.set(u.id, {
      busyUntil: 0,
      zoneId: u.homeZoneId,
      delivered: 0,
    });
  let d = new Map(Kr.map((u) => [u.id, u])),
    c = [],
    g = 0;
  for (let u of o) {
    g++;
    let s = `FRA-${String(g).padStart(4, "0")}`,
      f = d.get(u.zoneId),
      x = t5.filter((Z) => Z.zoneId === u.zoneId),
      M = ao(t, x),
      h = t() < 0.75 ? u.zoneId : ao(t, f.neighbors),
      m = Math.min(
        6,
        Math.max(
          0.6,
          Math.exp(eo(t, Math.log(2.1), 0.4)) + (h !== u.zoneId ? 0.8 : 0),
        ),
      ),
      y = _e(t, 11, 17),
      k = Math.max(u.createdAt + 0.5, u.createdAt + y - 5),
      L = null;
    for (let Z of e) {
      if (Z.platform !== u.platform) continue;
      let qt = l.get(Z.id),
        Se = k - qt.busyUntil > 8 ? Z.homeZoneId : qt.zoneId,
        ze = Se === u.zoneId,
        Qe = f.neighbors.includes(Se),
        ot =
          !ze &&
          !Qe &&
          f.neighbors.some((nc) => d.get(nc).neighbors.includes(Se));
      if (!ze && !Qe && !ot) continue;
      let Da = Math.max(k, qt.busyUntil);
      if (Da - k > 20 || !q8(Z, Da, a)) continue;
      let au = ze ? _e(t, 0.3, 1.4) : Qe ? _e(t, 1.3, 2.4) : _e(t, 2.4, 3.4),
        Hl = Da + (ze ? 0 : Qe ? 4 : 9);
      (!L || Hl < L.score) &&
        (L = {
          d: Z,
          start: Da,
          km: au,
          score: Hl,
        });
    }
    let w = (() => {
        let Z = L && L.start - k <= 4 ? L.start : k,
          qt = L?.d.vehicleType ?? "e_bike",
          Se = L?.km ?? 0.9,
          ze = Z + Jk(Se, qt),
          Qe = Math.max(ze + 1, u.createdAt + y),
          ot = Qe + Jk(m, qt);
        return {
          accepted: Z,
          arrivedPickup: ze,
          pickedUp: Qe,
          arrivedDropoff: ot,
          delivered: ot + 2,
        };
      })(),
      O = w.delivered + _e(t, 7, 11),
      j = M.readinessDelayMean >= 4 && t() < 0.5 ? O + _e(t, 3, 7) : O,
      v = {
        id: s,
        platform: u.platform,
        zoneId: u.zoneId,
        dropoffZoneId: h,
        restaurantId: M.id,
        driverId: L?.d.id ?? null,
        createdAt: u.createdAt,
        toPickupKm: L?.km ?? 0.9,
        distanceKm: m,
        deadlineOriginal: O,
        deadlineUpdated: j,
        planned: w,
        actual: {},
        revenue: Ji.revenuePerDelivery[u.platform],
        wrongOrMissing: t() < 0.012,
        equipmentIssue: !1,
      };
    if (!L) {
      ((v.cancellation = {
        at: k + 20,
        stage: "before_pickup",
        initiatedBy: "platform",
        reason: "No EELS driver free within 20 min; platform reassigned",
        supportRef: `SUP-${g}`,
      }),
        (v.revenue = 0),
        c.push(v));
      continue;
    }
    let E = L.d,
      Q = l.get(E.id),
      _ = v.actual,
      Mt = 1 + (Number(E.id.slice(1)) % 9 === 0 ? 0.18 : 0) + eo(t, 0, 0.08);
    ((_.accepted = L.start),
      (_.arrivedPickup =
        _.accepted + (w.arrivedPickup - w.accepted) * Math.max(0.7, Mt)));
    let Wt =
      w.pickedUp +
      Math.max(-3, eo(t, M.readinessDelayMean * 0.8, M.readinessDelaySd * 0.8));
    ((_.pickedUp = Math.max(_.arrivedPickup + 0.5, Wt)),
      (v.equipmentIssue = t() < 0.008),
      (_.arrivedDropoff =
        _.pickedUp +
        (w.arrivedDropoff - w.pickedUp) * Math.max(0.7, Mt + eo(t, 0, 0.06)) +
        (v.equipmentIssue ? _e(t, 8, 15) : 0)));
    let Tt = t() < 0.03;
    _.delivered = _.arrivedDropoff + 1.2 + Yk(t, 0.8) + (Tt ? _e(t, 4, 9) : 0);
    let Pt = t(),
      Bt = null;
    (Pt < 0.012
      ? (Bt = {
          stage: "before_pickup",
          party: "customer",
          reason: "Customer changed their mind",
          at: _.accepted + _e(t, 1, 5),
        })
      : Pt < 0.021
        ? (Bt = {
            stage: "at_pickup",
            party: "restaurant",
            reason: ao(t, [
              "Item unavailable",
              "Kitchen closed early",
              "Order not received by restaurant",
            ]),
            at: _.arrivedPickup + _e(t, 2, 10),
          })
        : Pt < 0.024
          ? (Bt = {
              stage: "after_pickup",
              party: "driver",
              reason: ao(t, [
                "Flat tyre",
                "E-bike battery failure",
                "Minor accident, driver safe",
              ]),
              at: _.pickedUp + _e(t, 3, 8),
            })
          : Pt < 0.029
            ? (Bt = {
                stage: "at_dropoff",
                party: "customer",
                reason: "Customer not available",
                at: _.arrivedDropoff + 10,
              })
            : Pt < 0.033 &&
              (Bt = {
                stage: "before_pickup",
                party: "platform",
                reason: "Payment check failed",
                at: _.accepted + _e(t, 1, 4),
              }),
      Bt
        ? ((v.cancellation = {
            at: Bt.at,
            stage: Bt.stage,
            initiatedBy: Bt.party,
            reason: Bt.reason,
            supportRef: t() < 0.7 ? `SUP-${g}` : void 0,
          }),
          Bt.stage === "before_pickup"
            ? (delete _.arrivedPickup,
              delete _.pickedUp,
              delete _.arrivedDropoff,
              delete _.delivered)
            : Bt.stage === "at_pickup"
              ? (delete _.pickedUp, delete _.arrivedDropoff, delete _.delivered)
              : Bt.stage === "after_pickup"
                ? (delete _.arrivedDropoff,
                  delete _.delivered,
                  (v.equipmentIssue = Bt.party === "driver"))
                : delete _.delivered,
          (v.revenue = Bt.stage === "at_dropoff" ? v.revenue : 0),
          (Q.busyUntil = Bt.at + 1),
          (Q.zoneId = Bt.stage === "at_dropoff" ? h : u.zoneId),
          Bt.party === "driver" && (Q.busyUntil = Bt.at + 25))
        : ((Q.busyUntil = _.delivered + 1), (Q.zoneId = h), Q.delivered++),
      c.push(v));
  }
  let p = c.filter((u) => u.actual.delivered !== void 0 && u.driverId);
  for (let u of [p[200], p[610]])
    !u ||
      u.actual.arrivedDropoff === void 0 ||
      (u.actual.delivered = u.actual.arrivedDropoff - 3);
  return c;
}
function K8(t) {
  let e = [],
    a = Date.parse(`${$d}T12:00:00Z`);
  for (let r = 56; r >= 1; r--) {
    let n = new Date(a - r * 864e5),
      i = n.getUTCDay(),
      o = e5(i),
      l = o.reduce((m, y) => m + y, 0),
      d = 1 + (56 - r) * 0.004,
      c = t() < 0.12 ? 1.15 : 1,
      g = {},
      p = 0;
    for (let m of Kr)
      g[m.id] = o.map((y) => {
        let k = M0(t, (y / l) * 620 * d * c * m.demandShare);
        return ((p += k), k);
      });
    let u = Math.round(p * _e(t, 0.028, 0.045)),
      s = p,
      f = p - u,
      x = Math.min(
        0.985,
        0.915 + (56 - r) * 6e-4 + eo(t, 0, 0.01) - (c > 1 ? 0.02 : 0),
      ),
      M = Math.round(f * x),
      h = (m, y) => {
        let k = Math.round(f * m);
        return {
          completed: k,
          onTime: Math.min(k, Math.round(k * Math.min(0.99, x + y))),
        };
      };
    e.push({
      date: n.toISOString().slice(0, 10),
      dow: i,
      slots: g,
      onTime: M,
      completed: f,
      cancelled: u,
      accepted: s,
      byPlatform: {
        uber_eats: h(0.4, 0.004),
        wolt: h(0.35, -0.002),
        lieferando: h(0.25, -0.004),
      },
    });
  }
  return e;
}
var C0 = [
    {
      id: "lunch",
      label: "Lunch peak",
      from: 690,
      to: 840,
    },
    {
      id: "afternoon",
      label: "Afternoon",
      from: 840,
      to: 1050,
    },
    {
      id: "dinner",
      label: "Dinner peak",
      from: 1050,
      to: 1290,
    },
    {
      id: "late",
      label: "Late evening",
      from: 1290,
      to: 1440,
    },
  ],
  w0 = new Map();
function Y8(t, e, a, r, n, i) {
  let o = {
      driverId: t.id,
      name: t.name,
      platform: t.platform,
      shiftEnd: t.shiftEnd,
    },
    l = t.shiftStart + t.lateStartMin,
    d = n.moves[t.id],
    c = r.get(t.id) ?? [],
    g = c
      .filter((M) => (M.actual.delivered ?? M.cancellation?.at ?? 1 / 0) <= e)
      .at(-1),
    p = g ? (g.actual.delivered ?? g.cancellation?.at ?? 0) : -1 / 0,
    u =
      g && e - p <= 8
        ? g.actual.delivered !== void 0
          ? g.dropoffZoneId
          : g.zoneId
        : t.homeZoneId;
  if (
    (d && d.at <= e && (!g || (g.actual.delivered ?? 0) < d.at) && (u = d.to),
    e < t.shiftStart - 60 || e >= t.shiftEnd)
  )
    return {
      ...o,
      activity: "off_shift",
      zoneId: t.homeZoneId,
      freeAt: null,
    };
  if (t.noShow && e >= t.shiftStart)
    return {
      ...o,
      activity: "no_show",
      zoneId: t.homeZoneId,
      freeAt: null,
      reason: "Did not start the shift",
    };
  if (e < l)
    return {
      ...o,
      activity: "not_started",
      zoneId: t.homeZoneId,
      freeAt: l,
    };
  let s = n.readiness[t.id],
    f = s ? s.passed : t.readinessPassed;
  if (f === null)
    return {
      ...o,
      activity: "blocked",
      zoneId: u,
      freeAt: null,
      reason: "Pre-shift check not done",
    };
  if (f === !1) {
    let M = s ? 1 / 0 : (a.unblockAt[t.id] ?? 1 / 0);
    if (e < M)
      return {
        ...o,
        activity: "blocked",
        zoneId: u,
        freeAt: null,
        reason: s?.issue ?? t.readinessIssue,
      };
  }
  if (
    t.breakMinutes > 0 &&
    e >= t.breakStart &&
    e < t.breakStart + t.breakMinutes
  )
    return {
      ...o,
      activity: "on_break",
      zoneId: u,
      freeAt: t.breakStart + t.breakMinutes,
    };
  let x = c.find((M) => {
    let h = M.actual.accepted;
    return h === void 0 || h > e
      ? !1
      : (M.actual.delivered ??
          (M.cancellation
            ? M.cancellation.at +
              (M.cancellation.initiatedBy === "driver" ? 25 : 0)
            : 1 / 0)) > e;
  });
  if (x) {
    let M = i(x);
    return {
      ...o,
      activity: "on_delivery",
      zoneId: x.dropoffZoneId,
      freeAt: M.predictedCompletion,
    };
  }
  return {
    ...o,
    activity: "free",
    zoneId: u,
    freeAt: e,
  };
}
function S2(t, e, a) {
  let r = Math.round(e * 4) / 4,
    n = `${r}|${JSON.stringify([a.readiness, a.moves, a.definitions, a.assumptions, a.targetPct, a.amberBelow, a.utilisation, a.restaurantEscalations, a.escalations.length, a.actions, a.shiftLeadOverride])}`,
    i = w0.get(n);
  if (i) return i;
  let o = t.zones,
    l = new Map(t.restaurants.map((S) => [S.id, S])),
    d = new Map();
  for (let S of t.orders)
    if (S.actual.pickedUp !== void 0 && S.actual.pickedUp <= r) {
      let et = d.get(S.restaurantId) ?? [];
      (et.push(S.actual.pickedUp - S.planned.pickedUp),
        d.set(S.restaurantId, et));
    }
  let g = {
      restaurantDelay: (S) => {
        let et = d.get(S);
        return !et || et.length < 3
          ? (l.get(S)?.readinessDelayMean ?? 0) * 0.5
          : (vl(et.slice(-8)) ?? 0);
      },
      bands: {
        amberBelow: a.amberBelow,
      },
    },
    p = new Map(),
    u = (S) => {
      let et = p.get(S.id);
      return (et || ((et = Zk(S, r, g)), p.set(S.id, et)), et);
    },
    s = t.orders.filter((S) => S.createdAt <= r),
    f = s.filter(
      (S) =>
        !S.cancellation &&
        S.actual.delivered !== void 0 &&
        S.actual.delivered <= r,
    ),
    x = s.filter((S) => S.cancellation && S.cancellation.at <= r),
    M = [];
  for (let S of s) {
    let et = sr(S, r);
    et === "done" ||
      et === "cancelled" ||
      et === "not_started" ||
      M.push({
        order: S,
        stage: et,
        prediction: u(S),
      });
  }
  M.sort((S, et) => S.prediction.margin - et.prediction.margin);
  let h = f.filter((S) => Gr(S)).length,
    m = Pe(h, f.length),
    y = a.definitions.map((S) => ({
      def: S,
      score: Dk(
        S.platform === "internal"
          ? s
          : s.filter((et) => et.platform === S.platform),
        S,
        r,
      ),
    })),
    k = Object.fromEntries(
      me.map((S) => {
        let et = f.filter((ee) => ee.platform === S);
        return [S, Pe(et.filter((ee) => Gr(ee)).length, et.length)];
      }),
    ),
    L = s.filter((S) => S.actual.accepted !== void 0 && S.actual.accepted <= r),
    w = x.filter(
      (S) =>
        S.actual.accepted !== void 0 &&
        S.actual.accepted <= (S.cancellation?.at ?? 0),
    ),
    O = Hk(w.length, L.length),
    A = {};
  for (let S of x)
    A[S.cancellation.initiatedBy] = (A[S.cancellation.initiatedBy] ?? 0) + 1;
  let j = o.map((S) => {
      let et = f.filter((xa) => xa.zoneId === S.id),
        ee = L.filter((xa) => xa.zoneId === S.id),
        pa = w.filter((xa) => xa.zoneId === S.id);
      return {
        zoneId: S.id,
        name: S.name,
        ptod: Pe(et.filter((xa) => Gr(xa)).length, et.length),
        cancel: Pe(pa.length, ee.length),
        accepted: ee.length,
      };
    }),
    v = C0.map((S) => {
      let et = f.filter((ee) => ee.createdAt >= S.from && ee.createdAt < S.to);
      return {
        id: S.id,
        label: S.label,
        ptod: Pe(et.filter((ee) => Gr(ee)).length, et.length),
        orders: s.filter((ee) => ee.createdAt >= S.from && ee.createdAt < S.to)
          .length,
      };
    }),
    E = s.filter(
      (S) => S.actual.arrivedPickup !== void 0 && S.actual.arrivedPickup <= r,
    ),
    Q = Pe(
      E.filter(
        (S) =>
          S.actual.arrivedPickup - S.actual.accepted <=
          S.planned.arrivedPickup - S.planned.accepted + 1,
      ).length,
      E.length,
    ),
    _ = Pe(f.filter((S) => S.wrongOrMissing).length, f.length),
    Mt = new Map();
  for (let S of f) {
    let et = pi(S);
    et && Mt.set(S.id, et);
  }
  let Wt = g2([...Mt.values()]),
    Tt = new Map(t.orders.map((S) => [S.id, S])),
    Pt = new Map();
  for (let S of Mt.values()) {
    if (S.primaryCause !== "restaurant") continue;
    let et = Tt.get(S.orderId).restaurantId;
    Pt.set(et, (Pt.get(et) ?? 0) + 1);
  }
  let Bt = t.restaurants.map((S) => {
    let et = s.filter(
        (za) =>
          za.restaurantId === S.id &&
          za.actual.pickedUp !== void 0 &&
          za.actual.pickedUp <= r &&
          za.actual.arrivedPickup !== void 0,
      ),
      ee = et.map((za) => za.actual.pickedUp - za.actual.arrivedPickup),
      pa = v0(ee, 90),
      xa = Pt.get(S.id) ?? 0,
      dc = S.readinessDelayMean >= 4 ? 3 : S.readinessDelayMean >= 3 ? 1 : 0,
      cc = pa !== null && pa > 12 ? 1 : 0;
    return {
      restaurantId: S.id,
      name: S.name,
      zoneId: S.zoneId,
      pickups: et.length,
      medianWait: vl(ee),
      p90Wait: pa,
      lateCaused: xa,
      daysOverThreshold: dc + cc,
      escalate: dc + cc >= 3,
    };
  });
  Bt.sort((S, et) => (et.p90Wait ?? -1) - (S.p90Wait ?? -1));
  let Z = new Map();
  for (let S of t.orders) {
    if (!S.driverId) continue;
    let et = Z.get(S.driverId) ?? [];
    (et.push(S), Z.set(S.driverId, et));
  }
  let qt = t.drivers.map((S) => Y8(S, r, t, Z, a, u)),
    Se = $k(r),
    ze = {},
    Qe = 0;
  for (let S of o) {
    let et = Fk(t.history, S.id, b0, t.actualSlots[S.id], Se);
    ((ze[S.id] = et.slots), (Qe += et.level));
  }
  let ot = {},
    Da = {};
  for (let S of o) {
    let et = L0(ze[S.id], r, 30),
      ee = Vk(S, qt, r, et, a.utilisation),
      pa = a.reservesCalled[S.id] ?? 0;
    (pa > 0 &&
      ((ee.capacity.usable += pa),
      (ee.capacity.gap = Math.max(
        0,
        ee.capacity.required - ee.capacity.usable,
      )),
      (ee.capacity.status =
        ee.capacity.gap > 0
          ? "short"
          : ee.capacity.usable - ee.capacity.required >= S.reserveDrivers
            ? "covered"
            : "tight")),
      (ot[S.id] = ee.capacity),
      (Da[S.id] = ee.drivers));
  }
  let au = Pk(o, ot, Da),
    Hl = 0;
  for (let S of o) Hl += L0(ze[S.id], r, 1440 - r);
  let nc = L.length > 0 ? x.length / Math.max(1, s.length) : 0.03,
    cp = Math.round(f.length + M.length * (1 - nc) + Hl * (1 - nc)),
    ru = f.filter((S) => (S.actual.delivered ?? 0) > r - 60),
    Gx = ru.length >= 10 ? ru.filter((S) => Gr(S)).length / ru.length : void 0,
    uo = ml({
      targetPct: a.targetPct,
      expectedTotal: cp,
      completedSoFar: f.length,
      onTimeSoFar: h,
      expectedRemainingRate: Gx,
    }),
    ic = 0,
    nu = 0,
    sp = 0,
    up = 0;
  for (let S of t.drivers) {
    if (S.shiftStart > r) continue;
    let et = Math.min(r, S.shiftEnd);
    if (((ic += (et - S.shiftStart) / 60), S.noShow)) {
      up++;
      continue;
    }
    (S.lateStartMin > 0 && S.shiftStart + S.lateStartMin <= r && sp++,
      (nu += Math.max(0, et - (S.shiftStart + S.lateStartMin)) / 60));
  }
  let oc = [],
    hp = 0,
    pp = 0;
  for (let S of t.drivers) {
    if (S.noShow || S.shiftStart + S.lateStartMin > r) continue;
    let et = S.shiftStart + S.lateStartMin,
      ee = Math.max(0, Math.min(r, S.shiftEnd) - et) / 60,
      pa =
        S.breakMinutes > 0
          ? Math.max(
              0,
              Math.min(r, S.breakStart + S.breakMinutes) - S.breakStart,
            ) / 60
          : 0,
      xa = (Z.get(S.id) ?? []).filter(
        (za) =>
          za.actual.delivered !== void 0 &&
          za.actual.delivered <= r &&
          !za.cancellation,
      ),
      dc = xa.reduce((za, mp) => za + mp.toPickupKm + mp.distanceKm, 0),
      cc = Ik(
        {
          platform: S.platform,
          vehicle: S.vehicleType,
          paidHours: ee,
          onlineHours: Math.max(0, ee - pa),
          hourlyRate: S.hourlyRate,
          deliveries: xa.length,
          km: dc,
        },
        a.assumptions,
      );
    ((hp += ee),
      (pp += Math.max(0, ee - pa)),
      oc.push({
        driver: S,
        econ: cc,
        deliveries: xa.length,
      }));
  }
  let iu = (S) => {
      var ee;
      let et = {};
      for (let pa of oc) (et[(ee = S(pa))] ?? (et[ee] = [])).push(pa.econ);
      return Object.fromEntries(
        Object.entries(et).map(([pa, xa]) => [pa, y0(xa)]),
      );
    },
    Kx = {
      total: y0(oc.map((S) => S.econ)),
      byPlatform: iu((S) => S.driver.platform),
      byZone: iu((S) => S.driver.homeZoneId),
      byShift: iu((S) => t.shiftLabel[S.driver.id]),
      perDriver: oc,
      paidHours: hp,
      onlineHours: pp,
    },
    Rl = {
      green: 0,
      amber: 0,
      red: 0,
    };
  for (let S of M) Rl[S.prediction.band]++;
  let ha = [];
  for (let S of o) {
    let et = ot[S.id];
    et.gap >= 2
      ? ha.push({
          id: `gap-${S.id}`,
          severity: "critical",
          title: `${S.name}: ${et.gap} drivers short for the next 30 min`,
          detail: `${et.required} required, ${et.usable} active. Call reserves or ask the platform to reduce the delivery area.`,
          route: "/capacity",
        })
      : et.gap === 1 &&
        ha.push({
          id: `gap-${S.id}`,
          severity: "warning",
          title: `${S.name}: 1 driver short`,
          detail: `${et.required} required, ${et.usable} active.`,
          route: "/capacity",
        });
  }
  (Rl.red > 0 &&
    ha.push({
      id: "red",
      severity: "critical",
      title: `${Rl.red} order${Rl.red > 1 ? "s" : ""} predicted late`,
      detail: "Escalate each and record the cause.",
      route: "/ops",
    }),
    uo.status === "unreachable"
      ? ha.push({
          id: "eod",
          severity: "critical",
          title: `Daily target ${a.targetPct}% is no longer reachable`,
          detail: `Best possible today is ${uo.bestCasePct.toFixed(1)}%. Report it honestly and protect the remaining deliveries.`,
          route: "/ops",
        })
      : uo.status === "at_risk" &&
        ha.push({
          id: "eod",
          severity: "warning",
          title: `Daily target at risk: ${uo.requiredRemainingPct?.toFixed(1)}% needed on remaining deliveries`,
          detail: `Projected ${uo.projectedPct.toFixed(1)}% at the current pace.`,
          route: "/ops",
        }));
  for (let S of qt) {
    let et = t.drivers.find((ee) => ee.id === S.driverId);
    (S.activity === "no_show" &&
      !a.reservesCalled[et.homeZoneId] &&
      ha.push({
        id: `ns-${et.id}`,
        severity: "warning",
        title: `No-show: ${et.name} (${rt(et.homeZoneId)})`,
        detail: `Ask ${et.alnaifCoordinator} (Alnaif) for a replacement.`,
        route: "/readiness",
      }),
      S.activity === "blocked" &&
        ha.push({
          id: `bl-${et.id}`,
          severity: "warning",
          title: `${et.name} not cleared to ride`,
          detail: S.reason ?? "Pre-shift check failed",
          route: "/readiness",
        }));
  }
  for (let S of Bt.filter(
    (et) => et.escalate && !a.restaurantEscalations[et.restaurantId],
  ))
    ha.push({
      id: `rest-${S.restaurantId}`,
      severity: "warning",
      title: `Escalate ${S.name} to the platform`,
      detail: `90th-percentile wait above 12 min on ${S.daysOverThreshold} days.`,
      route: "/delays",
    });
  for (let S of t.drivers) {
    if (S.noShow || S.breakMinutes === 0) continue;
    let et = S.breakStart - r;
    et > 0 &&
      et <= 15 &&
      ha.push({
        id: `brk-${S.id}`,
        severity: "info",
        title: `Break at ${V(S.breakStart)} for ${S.name}`,
        detail: "Plan cover now: 30 min break after 6 h (ArbZG section 4).",
        route: "/shifts",
      });
  }
  let lc = a.actions.filter((S) => S.status === "open" && S.due < Be);
  (lc.length &&
    ha.push({
      id: "actions",
      severity: "warning",
      title: `${lc.length} corrective action${lc.length > 1 ? "s" : ""} overdue`,
      detail: lc.map((S) => S.title).join("; "),
      route: "/ops",
    }),
    [...Ca, ...Yr].some((S) => a.shiftLeadOverride[S.id] === "") &&
      ha.push({
        id: "lead",
        severity: "critical",
        title: "A shift has no named lead",
        detail: "Each shift needs one EELS lead and one Alnaif contact.",
        route: "/responsibilities",
      }));
  for (let S of t.drivers) {
    let et = gi(S.workPermitExpiry, Be);
    (et !== null &&
      et < 0 &&
      ha.push({
        id: `wp-${S.id}`,
        severity: "critical",
        title: `Work permit expired: ${S.name}`,
        detail: "Driver must not be rostered until renewed.",
        route: "/compliance",
      }),
      y2(S.hourlyRate, Be).ok ||
        ha.push({
          id: `mw-${S.id}`,
          severity: "critical",
          title: `Below minimum wage: ${S.name}`,
          detail: `\u20AC${S.hourlyRate.toFixed(2)}/h against \u20AC13.90/h. Payroll is blocked.`,
          route: "/payroll",
        }),
      S.employmentType === "Mini-job" &&
        kl(S.monthlyEarnings, 2026).state === "breach" &&
        ha.push({
          id: `mj-${S.id}`,
          severity: "critical",
          title: `Mini-job limit exceeded: ${S.name}`,
          detail: `\u20AC${S.monthlyEarnings} against \u20AC603 per month.`,
          route: "/payroll",
        }));
  }
  let gp = {
    critical: 0,
    warning: 1,
    info: 2,
  };
  ha.sort((S, et) => gp[S.severity] - gp[et.severity]);
  let fp = {
    now: r,
    visible: s,
    completed: f,
    cancelled: x,
    active: M,
    internal: m,
    byDefinition: y,
    byPlatformInternal: k,
    byZone: j,
    byPeriod: v,
    cancellation: O,
    cancellationsByParty: A,
    pickupPunctuality: Q,
    wrongOrMissing: _,
    attributions: Mt,
    causes: Wt,
    restaurants: Bt,
    driverStates: qt,
    capacity: ot,
    classified: Da,
    moves: au,
    forecasts: ze,
    forecastLevel: Qe / o.length,
    expectedTotal: cp,
    eod: uo,
    attendance: {
      scheduled: ic,
      staffed: nu,
      lateStarts: sp,
      noShows: up,
      pct: ic > 0 ? (nu / ic) * 100 : null,
    },
    economics: Kx,
    bands: Rl,
    alerts: ha,
  };
  return (w0.clear(), w0.set(n, fp), fp);
}
var r5 = [
    {
      id: "internal",
      platform: "internal",
      label: "EELS internal PTOD",
      measuredEvent: "handover",
      deadlineBasis: "original",
      toleranceMin: 0,
      excludeRestaurantWait: !1,
      excludeCustomerWait: !1,
      cancellations: "exclude",
      window: {
        kind: "daily",
      },
      batchRule: "per_order",
      target: 98.5,
      verified: !0,
      source:
        "EELS Last-Mile Delivery Business and Operations Plan, 10 Sep 2026, page 5. Daily target 98.5% decided by EELS on 16 Sep 2026.",
      notes:
        "On-time completed deliveries / eligible completed deliveries. Shown next to the cancellation rate, because cancelled orders leave the denominator.",
    },
    {
      id: "uber_eats",
      platform: "uber_eats",
      label: "Uber Eats (arrival-based, to be agreed)",
      measuredEvent: "pickup_and_dropoff_arrivals",
      deadlineBasis: "updated",
      toleranceMin: 2,
      excludeRestaurantWait: !0,
      excludeCustomerWait: !0,
      cancellations: "exclude",
      window: {
        kind: "rolling",
        size: 200,
      },
      batchRule: "per_stop",
      target: 80,
      verified: !1,
      source:
        "Modelled on Uber's public courier on-time rate (last 200 pickup and drop-off arrivals, waiting excluded). Not an EELS fleet term.",
      notes:
        "Each leg is compared with its planned time plus a modelled 2-minute estimate buffer. Confirm the German fleet-partner definition, target and data access in the agreement.",
    },
    {
      id: "wolt",
      platform: "wolt",
      label: "Wolt (placeholder)",
      measuredEvent: "handover",
      deadlineBasis: "updated",
      toleranceMin: 5,
      excludeRestaurantWait: !0,
      excludeCustomerWait: !1,
      cancellations: "exclude",
      window: {
        kind: "daily",
      },
      batchRule: "per_order",
      target: 95,
      verified: !1,
      source: "Placeholder. No German Wolt fleet PTOD formula was verified.",
      notes:
        "Agree measured event, deadline basis, tolerance and window with Wolt.",
    },
    {
      id: "lieferando",
      platform: "lieferando",
      label: "Lieferando (placeholder)",
      measuredEvent: "handover",
      deadlineBasis: "original",
      toleranceMin: 0,
      excludeRestaurantWait: !1,
      excludeCustomerWait: !1,
      cancellations: "driver_late",
      window: {
        kind: "daily",
      },
      batchRule: "per_order",
      target: 95,
      verified: !1,
      source:
        "Placeholder. No German Lieferando fleet PTOD formula was verified.",
      notes:
        "Agree the definition and whether driver-caused cancellations count as late.",
    },
  ],
  n5 = [
    {
      key: "measuredEvent",
      question: "Pickup, arrival or handover?",
      reason: "Clarifies the exact event being measured.",
    },
    {
      key: "deadlineBasis",
      question: "Original deadline or updated estimate?",
      reason: "Prevents inconsistent treatment when the estimate changes.",
    },
    {
      key: "toleranceMin",
      question: "Any tolerance?",
      reason: "Determines precisely when a delivery becomes late.",
    },
    {
      key: "cancellations",
      question: "Eligible orders and exclusions?",
      reason: "Defines the denominator.",
    },
    {
      key: "excludeRestaurantWait",
      question: "Restaurant waits and cancellations?",
      reason: "Clarifies scoring and attribution of responsibility.",
    },
    {
      key: "window",
      question: "Daily, weekly or rolling window?",
      reason: "Makes reports comparable to the platform score.",
    },
    {
      key: "target",
      question: "Target, batches and reporting access?",
      reason: "Sets the actual obligation and the data needed.",
    },
  ];
function createStore(initialState) {
  let state = initialState;
  const listeners = new Set();
  return {
    get: () => state,
    set(patch) {
      const next = typeof patch === "function" ? patch(state) : patch;
      state = { ...state, ...next };
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
var S0 = null;
function getPilotModel() {
  if (!S0) S0 = a5();
  return S0;
}
var simClock = createStore({
    now: 1145,
    speed: 10,
    running: true,
  }),
  i5 = null;
function startSimClock() {
  if (i5) return;
  i5 = setInterval(() => {
    const clock = simClock.get();
    if (!clock.running) return;
    const next = clock.now + clock.speed / 60;
    if (next >= xl) simClock.set({ now: xl, running: false });
    else simClock.set({ now: next });
  }, 1000);
}
var yl = (t) =>
    simClock.set({
      now: Math.max(C2, Math.min(xl, t)),
    }),
  l5 = "eels_ops_v2",
  Fd = {
    escalations: [],
    actions: [
      {
        id: "A-101",
        title:
          "Agree replacement pool for Sachsenhausen dinner shift with Alnaif",
        owner: "Dilara Aksoy (Alnaif)",
        due: "2026-09-17",
        status: "open",
        source: "Yesterday's end-of-day review",
        createdAt: 0,
      },
      {
        id: "A-102",
        title: "Escalate repeated waits at Apfelwein Grill to the platform",
        owner: "Tobias Lang (EELS)",
        due: "2026-09-16",
        status: "open",
        source: "Restaurant wait report",
        createdAt: 0,
      },
      {
        id: "A-103",
        title: "Order 6 spare e-bike batteries for the Raunheim hub",
        owner: "Katrin Becker (EELS)",
        due: "2026-09-19",
        status: "done",
        source: "Fleet readiness review",
        createdAt: 0,
      },
    ],
    rhythm: {},
    readiness: {},
    moves: {},
    reservesCalled: {},
    definitions: r5,
    assumptions: Ji,
    targetPct: 98.5,
    amberBelow: 5,
    utilisation: 0.85,
    flagReviews: {},
    restaurantEscalations: {},
    partnerChecklist: {},
    incidents: [],
    cancellations: [],
    webhookLog: [],
    defects: {},
    shiftLeadOverride: {},
    gateThresholds: {
      ptod: 98.5,
      peakCoverage: 90,
      controllableCancel: 1,
      contributionPerHour: 0,
    },
  };
function X8() {
  try {
    let t = localStorage.getItem(l5);
    if (!t) return Fd;
    let e = JSON.parse(t);
    return {
      ...Fd,
      ...e,
    };
  } catch {
    return Fd;
  }
}
var opsStore = createStore(typeof window > "u" ? Fd : X8());
opsStore.subscribe(() => {
  try {
    localStorage.setItem(l5, JSON.stringify(opsStore.get()));
  } catch {}
});
function d5() {
  opsStore.set(Fd);
}
var Q8 = 200,
  Mn = (t) => `${t}-${++Q8}${Math.floor(Math.random() * 90 + 10)}`;
function useSimClock() {
  return Xr.useSyncExternalStore(
    simClock.subscribe,
    simClock.get,
    simClock.get,
  );
}
function useOpsStore() {
  return Xr.useSyncExternalStore(
    opsStore.subscribe,
    opsStore.get,
    opsStore.get,
  );
}
var readPilotModel = () => getPilotModel();
function jt() {
  let { now: t } = useSimClock(),
    e = useOpsStore(),
    a = Math.round(t * 4) / 4;
  return Xr.useMemo(() => S2(getPilotModel(), a, e), [a, e]);
}
function useToast() {
  let [t, e] = Xr.useState(null);
  return (
    Xr.useEffect(() => {
      if (!t) return;
      let a = setTimeout(() => e(null), 2600);
      return () => clearTimeout(a);
    }, [t]),
    [t, e]
  );
}
function fi(t, e) {
  let [a, r] = Xr.useState(() => {
    try {
      let i = localStorage.getItem(t);
      return i ? JSON.parse(i) : e;
    } catch {
      return e;
    }
  });
  return [
    a,
    (i) => {
      r(i);
      try {
        localStorage.setItem(t, JSON.stringify(i));
      } catch {}
    },
  ];
}
var c5 = {
  g_overview: {
    en: "Overview",
    de: "\xDCberblick",
  },
  g_operations: {
    en: "Operations",
    de: "Betrieb",
  },
  g_performance: {
    en: "Performance",
    de: "Leistung",
  },
  g_workforce: {
    en: "Workforce & fleet",
    de: "Personal & Flotte",
  },
  g_governance: {
    en: "Governance",
    de: "Governance",
  },
  g_platform: {
    en: "Platform",
    de: "Plattform",
  },
  dashboard: {
    en: "Executive Dashboard",
    de: "Management-Dashboard",
  },
  ops: {
    en: "Ops Control Tower",
    de: "Leitstand",
  },
  capacity: {
    en: "Capacity Planner",
    de: "Kapazit\xE4tsplanung",
  },
  orders: {
    en: "Order Dispatch",
    de: "Auftragsverteilung",
  },
  delays: {
    en: "Delays & Restaurants",
    de: "Versp\xE4tungen & Restaurants",
  },
  readiness: {
    en: "Driver Readiness",
    de: "Fahrerbereitschaft",
  },
  shifts: {
    en: "Shifts & Attendance",
    de: "Schichten & Anwesenheit",
  },
  incidents: {
    en: "Incidents",
    de: "Vorf\xE4lle",
  },
  kpi: {
    en: "KPI Center",
    de: "KPI-Center",
  },
  performance: {
    en: "Fair Performance",
    de: "Faire Leistungsbewertung",
  },
  economics: {
    en: "Unit Economics",
    de: "St\xFCckkosten",
  },
  expansion: {
    en: "Pilot & Expansion",
    de: "Pilot & Expansion",
  },
  riders: {
    en: "Riders",
    de: "Fahrer",
  },
  equipment: {
    en: "Fleet & Equipment",
    de: "Fahrzeuge & Ausr\xFCstung",
  },
  fleet: {
    en: "Fleet Owner Dashboard",
    de: "Flottenbesitzer-Dashboard",
  },
  fleetOwners: {
    en: "Manage Fleet Owners",
    de: "Flottenbesitzer verwalten",
  },
  compliance: {
    en: "Compliance",
    de: "Compliance",
  },
  payroll: {
    en: "Payroll",
    de: "Lohnabrechnung",
  },
  audit: {
    en: "Audit Export",
    de: "Pr\xFCfungsexport",
  },
  responsibilities: {
    en: "Responsibilities",
    de: "Verantwortlichkeiten",
  },
  apiHub: {
    en: "API Hub",
    de: "API-Hub",
  },
  admin: {
    en: "Admin Panel",
    de: "Admin-Bereich",
  },
  copilot: {
    en: "Ops Copilot",
    de: "Ops-Copilot",
  },
  settings: {
    en: "Settings",
    de: "Einstellungen",
  },
  search: {
    en: "Search riders, zones, orders, pages\u2026",
    de: "Fahrer, Zonen, Auftr\xE4ge, Seiten suchen\u2026",
  },
  logout: {
    en: "Log out",
    de: "Abmelden",
  },
  notifications: {
    en: "Alerts",
    de: "Warnungen",
  },
  simTime: {
    en: "Pilot day",
    de: "Pilottag",
  },
  askCopilot: {
    en: "Ask Ops Copilot",
    de: "Ops-Copilot fragen",
  },
  noResults: {
    en: "No results",
    de: "Keine Ergebnisse",
  },
  signIn: {
    en: "Sign in",
    de: "Anmelden",
  },
  email: {
    en: "Email",
    de: "E-Mail",
  },
  password: {
    en: "Password",
    de: "Passwort",
  },
  quickLogin: {
    en: "Quick demo login",
    de: "Schnelle Demo-Anmeldung",
  },
  invalid: {
    en: "Email or password is not correct. Use a quick login below.",
    de: "E-Mail oder Passwort falsch. Nutzen Sie die Schnellanmeldung.",
  },
  simulated: {
    en: "Simulated pilot data",
    de: "Simulierte Pilotdaten",
  },
};
function s5(t, e) {
  return c5[e]?.[t] ?? c5[e]?.en ?? e;
}
var I18nContext = Ll.createContext({
  lang: "en",
  setLang: () => {},
  t: (t) => s5("en", t),
});
function I18nProvider({ children: t }) {
  let [e, a] = Ll.useState(() => {
      try {
        return localStorage.getItem("eels_lang") === "de" ? "de" : "en";
      } catch {
        return "en";
      }
    }),
    r = (n) => {
      a(n);
      try {
        localStorage.setItem("eels_lang", n);
      } catch {}
      document.documentElement.lang = n;
    };
  return (
    <I18nContext.Provider
      value={{
        lang: e,
        setLang: r,
        t: (n) => s5(e, n),
      }}
    >
      {t}
    </I18nContext.Provider>
  );
}
var useI18n = () => Ll.useContext(I18nContext);
var CORE_ROLES = ["executive", "admin", "shift_lead"],
  NAV_ITEMS = [
    {
      key: "dashboard",
      path: "/dashboard",
      icon: vk,
      group: "g_overview",
      roles: ["executive"],
    },
    {
      key: "ops",
      path: "/ops",
      icon: hl,
      group: "g_overview",
      roles: CORE_ROLES,
    },
    {
      key: "inbox",
      path: "/inbox",
      icon: fk,
      group: "g_overview",
      roles: [...CORE_ROLES, "fleet_manager"],
    },
    {
      key: "capacity",
      path: "/capacity",
      icon: hi,
      group: "g_operations",
      roles: [...CORE_ROLES, "fleet_manager"],
    },
    {
      key: "orders",
      path: "/orders",
      icon: l2,
      group: "g_operations",
      roles: [...CORE_ROLES, "fleet_manager"],
    },
    {
      key: "delays",
      path: "/delays",
      icon: a2,
      group: "g_operations",
      roles: CORE_ROLES,
    },
    {
      key: "delayCauses",
      path: "/delay-causes",
      icon: Xv,
      group: "g_operations",
      roles: [...CORE_ROLES, "fleet_manager"],
    },
    {
      key: "prepTime",
      path: "/prep-time",
      icon: Nk,
      group: "g_operations",
      roles: [...CORE_ROLES, "fleet_manager"],
    },
    {
      key: "hex",
      path: "/hex",
      icon: xk,
      group: "g_operations",
      roles: [...CORE_ROLES, "fleet_manager"],
    },
    {
      key: "readiness",
      path: "/readiness",
      icon: Kv,
      group: "g_operations",
      roles: [...CORE_ROLES, "fleet_manager", "hr"],
    },
    {
      key: "shifts",
      path: "/shifts",
      icon: Ck,
      group: "g_operations",
      roles: [...CORE_ROLES, "fleet_manager", "hr"],
    },
    {
      key: "incidents",
      path: "/incidents",
      icon: ul,
      group: "g_operations",
      roles: [...CORE_ROLES, "fleet_manager"],
    },
    {
      key: "safety",
      path: "/safety",
      icon: mk,
      group: "g_operations",
      roles: [...CORE_ROLES, "fleet_manager", "hr"],
    },
    {
      key: "kpi",
      path: "/kpi",
      icon: d2,
      group: "g_performance",
      roles: CORE_ROLES,
    },
    {
      key: "performance",
      path: "/performance",
      icon: rk,
      group: "g_performance",
      roles: [...CORE_ROLES, "hr", "compliance"],
    },
    {
      key: "reports",
      path: "/reports",
      icon: Lk,
      group: "g_performance",
      roles: [
        ...CORE_ROLES,
        "fleet_manager",
        "hr",
        "compliance",
        "payroll",
        "executive",
        "admin",
      ],
    },
    {
      key: "healthPack",
      path: "/health-pack",
      icon: bk,
      group: "g_performance",
      roles: ["executive", "admin", "shift_lead"],
    },
    {
      key: "economics",
      path: "/economics",
      icon: wk,
      group: "g_performance",
      roles: ["executive", "admin", "payroll"],
    },
    {
      key: "expansion",
      path: "/expansion",
      icon: nk,
      group: "g_performance",
      roles: ["executive", "admin"],
    },
    {
      key: "riders",
      path: "/riders",
      icon: t2,
      group: "g_workforce",
      roles: [...CORE_ROLES, "fleet_manager", "hr"],
    },
    {
      key: "broadcast",
      path: "/broadcast",
      icon: pk,
      group: "g_workforce",
      roles: [...CORE_ROLES, "fleet_manager", "hr"],
    },
    {
      key: "equipment",
      path: "/equipment",
      icon: _k,
      group: "g_workforce",
      roles: [...CORE_ROLES, "fleet_manager"],
    },
    {
      key: "fleet",
      path: "/fleet",
      icon: Yv,
      group: "g_workforce",
      roles: ["executive", "admin", "fleet_manager"],
    },
    {
      key: "fleetOwners",
      path: "/fleet-owners",
      icon: jk,
      group: "g_workforce",
      roles: ["executive", "admin"],
    },
    {
      key: "documents",
      path: "/documents",
      icon: pl,
      group: "g_governance",
      roles: ["executive", "admin", "compliance", "hr"],
    },
    {
      key: "compliance",
      path: "/compliance",
      icon: s2,
      group: "g_governance",
      roles: ["executive", "admin", "compliance"],
    },
    {
      key: "algoLog",
      path: "/algo-log",
      icon: ak,
      group: "g_governance",
      roles: ["executive", "admin", "compliance"],
    },
    {
      key: "payroll",
      path: "/payroll",
      icon: h2,
      group: "g_governance",
      roles: ["executive", "admin", "payroll"],
    },
    {
      key: "recon",
      path: "/recon",
      icon: ok,
      group: "g_governance",
      roles: ["executive", "admin", "payroll"],
    },
    {
      key: "audit",
      path: "/audit",
      icon: c2,
      group: "g_governance",
      roles: ["executive", "admin", "compliance", "payroll"],
    },
    {
      key: "responsibilities",
      path: "/responsibilities",
      icon: yk,
      group: "g_governance",
      roles: [...CORE_ROLES, "hr", "compliance"],
    },
    {
      key: "canonicalState",
      path: "/canonical-state",
      icon: Mk,
      group: "g_platform",
      roles: ["executive", "admin"],
    },
    {
      key: "apiSandbox",
      path: "/api-sandbox",
      icon: lk,
      group: "g_platform",
      roles: ["executive", "admin"],
    },
    {
      key: "apiHub",
      path: "/api-hub",
      icon: Js,
      group: "g_platform",
      roles: ["executive", "admin"],
    },
    {
      key: "admin",
      path: "/admin",
      icon: tk,
      group: "g_platform",
      roles: ["executive", "admin"],
    },
    {
      key: "copilot",
      path: "/copilot",
      icon: fl,
      group: "g_platform",
      roles: "all",
    },
    {
      key: "settings",
      path: "/settings",
      icon: ek,
      group: "g_platform",
      roles: ["executive", "admin", "hr"],
    },
  ],
  HOME_BY_ROLE = {
    executive: "/dashboard",
    admin: "/admin",
    shift_lead: "/ops",
    fleet_manager: "/fleet",
    hr: "/riders",
    compliance: "/compliance",
    payroll: "/payroll",
  },
  qd = (t, e) => t.roles === "all" || t.roles.includes(e);
function canAccessPath(t, e) {
  if (t.startsWith("/riders/"))
    return qd(
      NAV_ITEMS.find((r) => r.key === "riders"),
      e,
    );
  let a = NAV_ITEMS.find((r) => r.path === t);
  return !!a && qd(a, e);
}
var J8 = (t) => (
    window.addEventListener("hashchange", t),
    () => window.removeEventListener("hashchange", t)
  ),
  readHashPath = () => {
    let t = window.location.hash.replace(/^#/, "");
    return t.startsWith("/") ? t : "/";
  };
function useHashLocation() {
  let t = m5.useSyncExternalStore(J8, readHashPath, () => "/"),
    [e, a] = t.split("?");
  return {
    path: e || "/",
    query: new URLSearchParams(a ?? ""),
  };
}
function navigate(t) {
  readHashPath() !== t &&
    ((window.location.hash = t),
    window.scrollTo({
      top: 0,
    }));
}
function matchPath(t, e) {
  let a = t.split("/").filter(Boolean),
    r = e.split("/").filter(Boolean);
  if (a.length !== r.length) return null;
  let n = {};
  for (let i = 0; i < a.length; i++)
    if (a[i].startsWith(":")) n[a[i].slice(1)] = decodeURIComponent(r[i]);
    else if (a[i] !== r[i]) return null;
  return n;
}
function Link({ to: t, children: e, onClick: a, ...r }) {
  return (
    <a
      href={`#${t}`}
      onClick={(n) => {
        (a?.(n),
          !(n.defaultPrevented || n.metaKey || n.ctrlKey) &&
            (n.preventDefault(), navigate(t)));
      }}
      {...r}
    >
      {e}
    </a>
  );
}
export {
  $d,
  Be,
  C0,
  C2,
  CORE_ROLES,
  Ca,
  Et,
  Gk,
  Gr,
  HOME_BY_ROLE,
  I18nContext,
  I18nProvider,
  Id,
  Ji,
  Kr,
  L2,
  Link,
  Ln,
  M2,
  Mn,
  NAV_ITEMS,
  Pe,
  Qi,
  S2,
  createStore,
  Ud,
  Uk,
  V,
  Yr,
  b2,
  canAccessPath,
  d5,
  f2,
  fi,
  g2,
  getPilotModel,
  gi,
  ie,
  jt,
  k2,
  kl,
  m2,
  matchPath,
  me,
  ml,
  mt,
  n5,
  navigate,
  opsStore,
  pi,
  qd,
  qr,
  ra,
  readHashPath,
  readPilotModel,
  rt,
  simClock,
  sr,
  startSimClock,
  to,
  useHashLocation,
  useI18n,
  useOpsStore,
  useSimClock,
  useToast,
  v2,
  vl,
  x0,
  x2,
  xl,
  y2,
  yl,
};
