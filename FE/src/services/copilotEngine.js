// Offline Ops Copilot answers and the end-of-day report draft.
import { U } from "../config.js";
import { $d, Ca, Et, Qi, V, ie, mt, rt } from "./portalState.jsx";
var tM = `You are Ops Copilot for EELS GmbH's last-mile food delivery pilot in Frankfurt (partners under discussion: Uber Eats, Wolt, Lieferando; workforce support from Alnaif Lieferdienst UG).
Rules:
- Answer only from the LIVE DATA JSON below. Quote the numbers you use with their counts (e.g. 91.7% (543/592)). If something is not in the data, say so.
- Keep the internal EELS PTOD separate from platform scores. Never average percentages; combine counts.
- Platform definitions marked "verified": false are placeholders, say so when you use them.
- Never suggest pressuring drivers to speed, reporting completion early, or cancelling difficult orders to improve a KPI.
- Do not make disciplinary decisions about named drivers; recommend a human review and coaching instead.
- Be brief and practical: at most 8 bullets or short paragraphs, plain language, concrete next actions with an owner.
- For an end-of-day report use these sections: Service; Three largest delay causes; Affected zones and peak periods; Planned vs actual coverage; Economics (illustrative assumptions); Actions for tomorrow (owner + deadline).`;
function A2(t, e, a) {
  let r = new Map(e.drivers.map((n) => [n.id, n]));
  return {
    date: $d,
    time: V(t.now),
    city: "Frankfurt pilot (simulated data)",
    dailyTargetPct: a.targetPct,
    internalPtod: {
      pct: Te(t.internal.pct),
      onTime: t.internal.num,
      completed: t.internal.den,
    },
    platformScores: t.byDefinition.map((n) => ({
      definition: n.def.label,
      pct: Te(n.score.pct),
      onTime: n.score.num,
      units: n.score.den,
      verified: n.def.verified,
    })),
    internalPtodByPlatform: Object.fromEntries(
      Object.entries(t.byPlatformInternal).map(([n, i]) => [
        mt[n],
        {
          pct: Te(i.pct),
          onTime: i.num,
          completed: i.den,
        },
      ]),
    ),
    cancellationsAfterAcceptance: {
      pct: Te(t.cancellation.pct),
      cancelled: t.cancellation.num,
      accepted: t.cancellation.den,
      byInitiatingParty: t.cancellationsByParty,
    },
    pickupPunctuality: {
      pct: Te(t.pickupPunctuality.pct),
      onTime: t.pickupPunctuality.num,
      arrivals: t.pickupPunctuality.den,
    },
    activeOrders: t.active.length,
    riskBands: t.bands,
    ordersAtRisk: t.active
      .filter((n) => n.prediction.band !== "green")
      .slice(0, 8)
      .map((n) => ({
        id: n.order.id,
        zone: rt(n.order.zoneId),
        platform: mt[n.order.platform],
        marginMin: Te(n.prediction.margin),
        likelyCause: n.prediction.likelyCause,
      })),
    endOfDay: {
      status: t.eod.status,
      expectedDeliveries: t.expectedTotal,
      requiredOnTime: t.eod.requiredOnTime,
      onTimeSoFar: t.internal.num,
      requiredRemainingPct: Te(t.eod.requiredRemainingPct),
      projectedPct: Te(t.eod.projectedPct),
      bestCasePct: Te(t.eod.bestCasePct),
    },
    zones: t.byZone.map((n) => {
      let i = t.capacity[n.zoneId];
      return {
        zone: n.name,
        ptodPct: Te(n.ptod.pct),
        onTime: n.ptod.num,
        completed: n.ptod.den,
        next30: {
          forecastOrders: Te(i.forecastOrders),
          requiredDrivers: i.required,
          activeDrivers: i.usable,
          freeNow: i.availableNow,
          freeSoon: i.availableSoon,
          gap: i.gap,
          status: i.status,
        },
      };
    }),
    repositionSuggestions: t.moves.map((n) => ({
      driver: n.driverName,
      from: rt(n.from),
      to: rt(n.to),
    })),
    periods: t.byPeriod.map((n) => ({
      period: n.label,
      ptodPct: Te(n.ptod.pct),
      onTime: n.ptod.num,
      completed: n.ptod.den,
    })),
    topDelayCauses: t.causes.slice(0, 5).map((n) => ({
      cause: n.label,
      lateDeliveries: n.count,
      sharePct: Te(n.share * 100),
      driverControllable: Qi.includes(n.cause),
    })),
    restaurantsByP90Wait: t.restaurants.slice(0, 6).map((n) => ({
      name: n.name,
      zone: rt(n.zoneId),
      pickups: n.pickups,
      medianWaitMin: Te(n.medianWait),
      p90WaitMin: Te(n.p90Wait),
      daysOverThreshold: n.daysOverThreshold,
      escalated: !!a.restaurantEscalations[n.restaurantId],
    })),
    attendance: {
      scheduledHours: Te(t.attendance.scheduled),
      staffedHours: Te(t.attendance.staffed),
      pct: Te(t.attendance.pct),
      lateStarts: t.attendance.lateStarts,
      noShows: t.attendance.noShows,
    },
    driversNotAvailable: t.driverStates
      .filter((n) => n.activity === "blocked" || n.activity === "no_show")
      .map((n) => ({
        name: n.name,
        zone: rt(r.get(n.driverId).homeZoneId),
        status: n.activity,
        reason: n.reason ?? "",
      })),
    economicsSoFar: {
      note: "Illustrative cost and revenue assumptions",
      revenueEur: Te(t.economics.total.revenue),
      directCostEur: Te(t.economics.total.totalCost),
      contributionEur: Te(t.economics.total.contribution),
      deliveriesPerPaidHour: Te(
        t.completed.length / Math.max(1, t.economics.paidHours),
      ),
      byShift: Object.fromEntries(
        Object.entries(t.economics.byShift).map(([n, i]) => [
          n,
          Te(i.contribution),
        ]),
      ),
    },
    alerts: t.alerts.slice(0, 10).map((n) => `${n.severity}: ${n.title}`),
    openActions: a.actions
      .filter((n) => n.status === "open")
      .map((n) => ({
        title: n.title,
        owner: n.owner,
        due: n.due,
      })),
    escalationsToday: a.escalations.length,
    shiftLeads: Ca.map((n) => `${n.name} (${n.window})`),
  };
}
var Te = (t) =>
  t == null || !Number.isFinite(t) ? null : Math.round(t * 10) / 10;
function bn(t, e) {
  let a = e.targetPct,
    r = (t.internal.pct ?? 0) >= a,
    n = [...t.byZone]
      .filter((d) => d.ptod.den >= 5)
      .sort((d, c) => (d.ptod.pct ?? 100) - (c.ptod.pct ?? 100)),
    i = [...t.byPeriod]
      .filter((d) => d.ptod.den > 0)
      .sort((d, c) => (d.ptod.pct ?? 100) - (c.ptod.pct ?? 100)),
    o =
      Object.entries(t.cancellationsByParty)
        .map(([d, c]) => `${d} ${c}`)
        .join(", ") || "none";
  return [
    `End-of-day report: Frankfurt pilot, ${$d} (as of ${V(t.now)})`,
    "",
    "Service",
    `- PTOD (EELS internal): ${Et(t.internal.pct)} (${t.internal.num}/${t.internal.den}) against a ${a}% target: ${r ? "target met" : "target missed"}.`,
    `- Cancellations after acceptance: ${Et(t.cancellation.pct)} (${t.cancellation.num}/${t.cancellation.den}). All cancellations by initiating party: ${o}.`,
    `- Pickup punctuality: ${Et(t.pickupPunctuality.pct)} (${t.pickupPunctuality.num}/${t.pickupPunctuality.den}). Wrong or missing orders: ${t.wrongOrMissing.num}.`,
    ...t.byDefinition
      .filter((d) => d.def.platform !== "internal")
      .map(
        (d) =>
          `- ${d.def.label}: ${Et(d.score.pct)} (${d.score.num}/${d.score.den})${d.def.verified ? "" : " [placeholder definition]"}.`,
      ),
    "",
    "Three largest delay causes",
    ...(t.causes.length
      ? t.causes
          .slice(0, 3)
          .map(
            (d, c) =>
              `${c + 1}. ${d.label}: ${d.count} late deliveries (${Math.round(d.share * 100)}%)`,
          )
      : ["- No late deliveries recorded."]),
    "",
    "Affected zones and peak periods",
    `- Weakest zones: ${
      n
        .slice(0, 3)
        .map((d) => `${d.name} ${Et(d.ptod.pct)} (${d.ptod.num}/${d.ptod.den})`)
        .join("; ") || "n/a"
    }.`,
    `- Weakest period: ${i[0] ? `${i[0].label} ${Et(i[0].ptod.pct)} (${i[0].ptod.num}/${i[0].ptod.den})` : "n/a"}.`,
    `- Restaurants with the longest waits: ${t.restaurants
      .slice(0, 3)
      .map((d) => `${d.name} (P90 ${d.p90Wait?.toFixed(1) ?? "\u2014"} min)`)
      .join("; ")}.`,
    "",
    "Planned vs actual coverage",
    `- Staffed ${t.attendance.staffed.toFixed(1)} of ${t.attendance.scheduled.toFixed(1)} scheduled hours (${Et(t.attendance.pct)}); ${t.attendance.lateStarts} late starts, ${t.attendance.noShows} no-shows.`,
    `- Drivers not cleared at shift start: ${
      t.driverStates
        .filter((d) => d.activity === "blocked")
        .map((d) => d.name)
        .join(", ") || "none"
    }.`,
    "",
    "Economics (illustrative assumptions)",
    `- Revenue ${ie(t.economics.total.revenue)}, direct costs ${ie(t.economics.total.totalCost)}, contribution ${ie(t.economics.total.contribution)}.`,
    `- ${(t.completed.length / Math.max(1, t.economics.paidHours)).toFixed(2)} deliveries per paid hour.`,
    "",
    "Actions for tomorrow (owner + deadline)",
    ...eM(t, e).map((d) => `- ${d}`),
  ].join(`
`);
}
function eM(t, e) {
  let a = [];
  (t.causes[0]?.cause === "capacity" &&
    a.push(
      `Add peak cover in the weakest zones with Alnaif (owner: ${Ca[1].name}, due tomorrow 16:00).`,
    ),
    t.causes.some((n) => n.cause === "restaurant") &&
      a.push(
        `Escalate repeat restaurant waits to the platform with order IDs (owner: ${Ca[1].name}, due tomorrow 12:00).`,
      ),
    t.attendance.noShows > 0 &&
      a.push(
        "Confirm replacement drivers for tomorrow's dinner shift (owner: Alnaif coordinator, due tomorrow 14:00).",
      ),
    t.driverStates.some((n) => n.activity === "blocked") &&
      a.push(
        `Fix equipment issues found in pre-shift checks and restock spare batteries (owner: ${Ca[0].name}, due tomorrow 10:30).`,
      ),
    (t.internal.pct ?? 100) < e.targetPct &&
      a.push(
        "Review the three largest causes in the morning huddle and assign each an owner (owner: operations lead, due tomorrow 11:00).",
      ));
  for (let n of e.actions.filter((i) => i.status === "open").slice(0, 3))
    a.push(`Carry over: ${n.title} (owner: ${n.owner}, due ${n.due}).`);
  return a.length ? a : ["No corrective actions needed."];
}
function j2(t, e, a, r) {
  let n = t.toLowerCase(),
    i = (...l) => l.some((d) => n.includes(d));
  if (
    i(
      "report",
      "summary",
      "end of day",
      "end-of-day",
      "bericht",
      "zusammenfassung",
    )
  )
    return bn(e, r);
  if (i("target", "reach", "forecast", "end the day", "ziel", "prognose")) {
    let l = e.eod;
    return [
      `Daily target ${r.targetPct}% on about ${e.expectedTotal} deliveries needs ${l.requiredOnTime} on time. ${e.internal.num} are on time so far (${e.internal.num}/${e.internal.den}).`,
      l.status === "unreachable"
        ? `The target is no longer reachable: ${l.remainingOnTimeNeeded} of the remaining ${l.remaining} would have to be on time. Best case is ${l.bestCasePct.toFixed(1)}%. Report that honestly and protect the remaining service.`
        : l.status === "achieved"
          ? "The target is already secured."
          : `The remaining ${l.remaining} deliveries need ${l.requiredRemainingPct?.toFixed(1)}% punctuality. At the current pace the day ends near ${l.projectedPct.toFixed(1)}% (${l.status === "on_track" ? "on track" : "at risk"}).`,
    ].join(`
`);
  }
  if (
    i(
      "capacity",
      "short",
      "gap",
      "coverage",
      "zone",
      "reposition",
      "kapazit\xE4t",
      "fahrer fehlen",
    )
  ) {
    let l = Object.values(e.capacity)
        .filter((c) => c.gap > 0)
        .sort((c, g) => g.gap - c.gap),
      d = [
        l.length
          ? "Zones short for the next 30 minutes:"
          : "All zones are covered for the next 30 minutes.",
      ];
    for (let c of l)
      d.push(
        `- ${rt(c.zoneId)}: ${c.required} drivers required, ${c.usable} active (gap ${c.gap}); about ${c.forecastOrders.toFixed(1)} orders expected.`,
      );
    if (e.moves.length) {
      d.push(
        "Safe moves (source zone keeps its required drivers and reserve):",
      );
      for (let c of e.moves)
        d.push(`- ${c.driverName}: ${rt(c.from)} to ${rt(c.to)}`);
    } else
      l.length &&
        d.push(
          "No neighbouring zone has spare drivers: call planned reserves or ask the platform to reduce the delivery area.",
        );
    return d.join(`
`);
  }
  if (i("late", "risk", "red", "amber", "escalat", "versp\xE4t")) {
    let l = e.active.filter((d) => d.prediction.band !== "green").slice(0, 8);
    return l.length
      ? [
          `${e.bands.red} active orders are predicted late and ${e.bands.amber} have 5 minutes or less of margin:`,
          ...l.map(
            (d) =>
              `- ${d.order.id} (${rt(d.order.zoneId)}, ${mt[d.order.platform]}): margin ${d.prediction.margin.toFixed(1)} min, likely cause: ${d.prediction.likelyCause.toLowerCase()}.`,
          ),
          "Escalate red orders through the platform's support process and record the cause.",
        ].join(`
`)
      : `No active order is predicted late. ${e.active.length} active orders are on track.`;
  }
  if (i("restaurant", "wait", "kitchen", "warte"))
    return [
      "Restaurants with the longest waits today (arrival to pickup):",
      ...e.restaurants
        .slice(0, 5)
        .map(
          (l) =>
            `- ${l.name} (${rt(l.zoneId)}): median ${l.medianWait?.toFixed(1) ?? "\u2014"} min, P90 ${l.p90Wait?.toFixed(1) ?? "\u2014"} min over ${l.pickups} pickups${l.escalate ? "; above threshold on 3+ days, escalate to the platform" : ""}.`,
        ),
      "A restaurant-caused late delivery still counts as late under the internal measure, but it is not a driver coaching topic.",
    ].join(`
`);
  if (i("cancel", "storn"))
    return [
      `Cancellations after acceptance: ${Et(e.cancellation.pct)} (${e.cancellation.num}/${e.cancellation.den}).`,
      `By initiating party: ${
        Object.entries(e.cancellationsByParty)
          .map(([l, d]) => `${l} ${d}`)
          .join(", ") || "none"
      }.`,
      "Cancelled orders leave the PTOD denominator, so read both numbers together. Never cancel difficult orders to protect the score.",
    ].join(`
`);
  if (
    i(
      "cost",
      "profit",
      "econom",
      "money",
      "revenue",
      "contribution",
      "kosten",
      "umsatz",
    )
  ) {
    let l = e.economics;
    return [
      `So far today (illustrative assumptions): revenue ${ie(l.total.revenue)}, direct costs ${ie(l.total.totalCost)}, contribution ${ie(l.total.contribution)}.`,
      `Productivity: ${(e.completed.length / Math.max(1, l.paidHours)).toFixed(2)} deliveries per paid hour over ${l.paidHours.toFixed(0)} paid hours.`,
      `By shift: ${Object.entries(l.byShift)
        .map(([d, c]) => `${d} ${ie(c.contribution)}`)
        .join(", ")}.`,
      "Edit the assumptions on the Unit Economics page once the partner terms are known.",
    ].join(`
`);
  }
  if (
    i(
      "complian",
      "permit",
      "wage",
      "minijob",
      "mini-job",
      "break",
      "pause",
      "mindestlohn",
    )
  ) {
    let l = e.alerts.filter((d) => /permit|wage|Mini-job|Break/i.test(d.title));
    return l.length
      ? [
          "Compliance items needing action:",
          ...l.map((d) => `- ${d.title}: ${d.detail}`),
        ].join(`
`)
      : "No open compliance items.";
  }
  if (i("driver", "rider", "no-show", "readiness", "check")) {
    let l = e.driverStates.filter(
      (d) => d.activity === "blocked" || d.activity === "no_show",
    );
    return [
      `${l.length} rostered drivers are not available right now:`,
      ...l.map(
        (d) =>
          `- ${d.name} (${rt(a.drivers.find((c) => c.id === d.driverId).homeZoneId)}): ${d.activity === "no_show" ? "no-show, ask Alnaif for a replacement" : d.reason}`,
      ),
      "Individual performance questions go through the Fair Performance page, with a human review before any conversation.",
    ].join(`
`);
  }
  if (i("ptod", "punctual", "on time", "on-time", "p\xFCnktlich"))
    return [
      `PTOD (EELS internal) is ${Et(e.internal.pct)} (${e.internal.num}/${e.internal.den}) against the ${r.targetPct}% target.`,
      ...e.byDefinition
        .filter((l) => l.def.platform !== "internal")
        .map(
          (l) =>
            `- ${l.def.label}: ${Et(l.score.pct)} (${l.score.num}/${l.score.den})${l.def.verified ? "" : ", placeholder definition"}`,
        ),
      `Largest cause of lateness: ${e.causes[0] ? `${e.causes[0].label} (${e.causes[0].count})` : "none"}.`,
    ].join(`
`);
  let o = e.alerts.filter((l) => l.severity === "critical").slice(0, 4);
  return [
    `Status at ${V(e.now)}: PTOD ${Et(e.internal.pct)} (${e.internal.num}/${e.internal.den}), ${e.active.length} active orders (${e.bands.red} late, ${e.bands.amber} at risk), cancellations ${Et(e.cancellation.pct)}.`,
    o.length
      ? `Critical: ${o.map((l) => l.title).join("; ")}.`
      : "No critical alerts.",
    "Ask me about capacity gaps, late orders, restaurant waits, the daily target, cancellations, costs, or say \u201Cdraft the end-of-day report\u201D.",
  ].join(`
`);
}
var Ml = null;
function B0() {
  if (Ml) return Ml;
  let t = window;
  return t.claude?.use
    ? ((Ml = t.claude
        .use("sample")
        .then((e) => (typeof e == "function" ? e : null))
        .catch(() => null)),
      Ml)
    : ((Ml = Promise.resolve(null)), Ml);
}
var N2 = null;
async function _2(t, e, a, r = {}) {
  let n = JSON.stringify(e);
  if ((typeof U < "u" ? U.target : "web") === "artifact") {
    let o = await B0();
    if (o)
      try {
        let l = [
          {
            role: "user",
            content: `${tM}

LIVE DATA (JSON):
${n}`,
          },
          ...t.slice(-10),
        ];
        return {
          text: (
            await o(l, {
              cache: !1,
              signal: r.signal,
              onText: (c) => r.onText?.(c.text),
            })
          ).text,
          engine: "Claude (in claude.ai)",
        };
      } catch (l) {
        let d = l.code;
        if (d === "cancelled") throw l;
        return {
          text: a(),
          engine: "Offline engine",
          note:
            d === "not_granted"
              ? "Claude access was not allowed for this page, so the offline engine answered."
              : "Claude was not available, so the offline engine answered.",
        };
      }
    return {
      text: a(),
      engine: "Offline engine",
    };
  }
  if (N2 !== !1)
    try {
      let o = await fetch("/api/copilot", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          messages: t.slice(-10),
          context: n,
        }),
        signal: r.signal,
      });
      if (o.ok) {
        N2 = !0;
        let d = await o.json();
        return (
          r.onText?.(d.text),
          {
            text: d.text,
            engine: "Claude via Netlify function",
          }
        );
      }
      o.status === 404 && (N2 = !1);
      let l =
        o.status === 404
          ? "No Copilot server function is deployed here, so the offline engine answered."
          : o.status === 503
            ? "No ANTHROPIC_API_KEY is set on the server, so the offline engine answered."
            : `The Copilot function returned ${o.status}, so the offline engine answered.`;
      return {
        text: a(),
        engine: "Offline engine",
        note: l,
      };
    } catch (o) {
      if (o.name === "AbortError") throw o;
      N2 = !1;
    }
  return {
    text: a(),
    engine: "Offline engine",
  };
}
export { A2, B0, _2, bn, j2 };
