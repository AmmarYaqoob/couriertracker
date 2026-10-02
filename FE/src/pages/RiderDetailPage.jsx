// Rider detail route /riders/:id.
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Link } from "../services/portalState.jsx";
import {
  Badge,
  Card,
  KeyValueList,
  PageHeader,
  Tabs,
  Callout,
} from "../components/ui.jsx";
import { Ok } from "../components/icons.jsx";

const RIDERS_API = "http://127.0.0.1:4000/api/riders";
const DOCUMENT_TONE = {
  verified: "good",
  expiring: "warn",
  expired: "crit",
  pending: "warn",
};

function RiderDetailPage({ id }) {
  const [tab, setTab] = useState("overview");
  const [rider, setRider] = useState(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    setRider(null);
    fetch(`${RIDERS_API}/${encodeURIComponent(id)}`)
      .then((response) => response.json())
      .then((body) => {
        if (cancelled) return;
        if (body?.isSuccess && body.data?.rider) {
          setRider(body.data.rider);
          setState("ready");
          return;
        }
        setState(body?.httpStatus === 404 ? "missing" : "error");
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state === "loading") {
    return jsx(Card, { title: "Loading rider", children: "Loading rider…" });
  }
  if (state !== "ready" || !rider) {
    return jsxs(Card, {
      title: state === "missing" ? "Rider not found" : "Could not load rider",
      children: jsx(Link, { to: "/riders", children: "Back to riders" }),
    });
  }

  const items = rider.compliance.items;
  return jsxs(Fragment, {
    children: [
      jsxs(Link, {
        to: "/riders",
        className: "small row",
        children: [jsx(Ok, { size: 14 }), " Back to riders"],
      }),
      jsx(PageHeader, {
        eyebrow: `${rider.id} · ${rider.employmentType}`,
        title: rider.name,
        description: `${rider.zone.name} · ${rider.platform.name} · ${rider.vehicle.typeLabel} · shift ${rider.shift.label}`,
        actions: jsxs(Fragment, {
          children: [
            jsxs(Badge, {
              tone: rider.compliance.tone,
              children: ["Compliance ", rider.compliance.score],
            }),
            jsx(Badge, { tone: "info", children: rider.status.label }),
          ],
        }),
      }),
      jsx(Tabs, {
        value: tab,
        onChange: setTab,
        tabs: [
          { value: "overview", label: "Overview" },
          { value: "documents", label: "Documents" },
          { value: "payroll", label: "Payroll" },
          { value: "compliance", label: `Compliance (${items.length})` },
          { value: "performance", label: "Performance" },
        ],
      }),
      tab === "overview" &&
        jsxs("div", {
          className: "grid g2",
          children: [
            jsx(Card, {
              title: "Contract and assignment",
              children: jsx(KeyValueList, {
                items: [
                  ["Employment type", rider.contract.employmentType],
                  ["Contract", rider.contract.contractType],
                  ["Hours per week", rider.contract.hoursPerWeek],
                  ["Hourly rate", rider.contract.hourlyRateLabel],
                  ["Joined", rider.contract.joined],
                  ["Contract end", rider.contract.contractEndLabel],
                  ["Home zone", rider.contract.homeZone.name],
                  ["Platform today", rider.contract.platform.name],
                  ["Alnaif coordinator", rider.contract.alnaifCoordinator],
                ],
              }),
            }),
            jsx(Card, {
              title: `Today · ${rider.asOf}`,
              children: jsx(KeyValueList, {
                items: [
                  ["Status", rider.today.status.label],
                  ["Current zone", rider.today.currentZone.name],
                  ["Shift", rider.today.shift.label],
                  ["Break", rider.today.break.label],
                  ["Pre-shift check", rider.today.preShiftCheck.label],
                  ["Deliveries today", rider.today.deliveries.label],
                  ["Vehicle", rider.today.vehicle.display],
                ],
              }),
            }),
          ],
        }),
      tab === "documents" &&
        jsx(Card, {
          title: "Document checklist",
          flush: true,
          children: jsxs("table", {
            className: "table",
            children: [
              jsx("thead", {
                children: jsxs("tr", {
                  children: [
                    jsx("th", { children: "Document" }),
                    jsx("th", { children: "Status" }),
                    jsx("th", { children: "Detail" }),
                  ],
                }),
              }),
              jsx("tbody", {
                children: rider.documents.map((document) =>
                  jsxs(
                    "tr",
                    {
                      children: [
                        jsx("td", { className: "bold", children: document.name }),
                        jsx("td", {
                          children: jsx(Badge, {
                            tone: DOCUMENT_TONE[document.status],
                            children: document.status,
                          }),
                        }),
                        jsx("td", { className: "small", children: document.detail }),
                      ],
                    },
                    document.name,
                  ),
                ),
              }),
            ],
          }),
        }),
      tab === "payroll" &&
        jsxs("div", {
          className: "stack",
          children: [
            jsx(Card, {
              title: "Payroll",
              flush: true,
              children: jsxs("table", {
                className: "table",
                children: [
                  jsx("thead", {
                    children: jsxs("tr", {
                      children: [
                        jsx("th", { children: "Month" }),
                        jsx("th", { className: "num", children: "Hours" }),
                        jsx("th", { className: "num", children: "Gross" }),
                        jsx("th", { children: "Status" }),
                        jsx("th", { children: "Note" }),
                      ],
                    }),
                  }),
                  jsx("tbody", {
                    children: rider.payroll.map((month) =>
                      jsxs(
                        "tr",
                        {
                          children: [
                            jsx("td", { children: month.month }),
                            jsx("td", { className: "num", children: month.hours }),
                            jsx("td", { className: "num", children: month.grossLabel }),
                            jsx("td", {
                              children: jsx(Badge, {
                                tone:
                                  month.status === "approved"
                                    ? "good"
                                    : month.status === "blocked"
                                      ? "crit"
                                      : "warn",
                                children: month.status,
                              }),
                            }),
                            jsx("td", { className: "small", children: month.note }),
                          ],
                        },
                        month.month,
                      ),
                    ),
                  }),
                ],
              }),
            }),
            rider.miniJob &&
              jsx(Callout, {
                tone: rider.miniJob.state === "ok" ? undefined : "warn",
                children: rider.miniJob.message,
              }),
          ],
        }),
      tab === "compliance" &&
        jsx(Card, {
          title: "Compliance items",
          children:
            items.length === 0
              ? jsx("p", { className: "muted", children: "No open compliance items." })
              : jsx("div", {
                  className: "stack-sm",
                  children: items.map((item) =>
                    jsxs(
                      "div",
                      {
                        className: "alert-item",
                        children: [
                          jsxs("div", {
                            className: "grow",
                            children: [
                              jsx("div", { className: "t", children: item.issue }),
                              jsxs("div", {
                                className: "d",
                                children: [item.detail, " · ", item.rule, " · due ", item.due],
                              }),
                            ],
                          }),
                          jsx(Badge, {
                            tone:
                              item.severity === "High"
                                ? "crit"
                                : item.severity === "Medium"
                                  ? "warn"
                                  : "neutral",
                            children: item.severity,
                          }),
                        ],
                      },
                      item.issue,
                    ),
                  ),
                }),
        }),
      tab === "performance" &&
        jsx(Card, {
          title: "28-day assessment",
          sub: "For coaching conversations after human review",
          actions: jsx(Link, { to: "/performance", children: "Fair Performance" }),
          children: jsxs(Fragment, {
            children: [
              jsx("p", { children: rider.performance.explanation }),
              jsx("div", {
                style: { marginTop: 10 },
                children: jsx(KeyValueList, {
                  items: [
                    ["Deliveries", rider.performance.deliveries],
                    ["Raw PTOD", rider.performance.rawPctLabel ?? "—"],
                    ["Adjusted", rider.performance.adjustedRangeLabel ?? "—"],
                    ["Driver-controllable late", rider.performance.controllableLate],
                    ["Excluded (restaurant, other)", rider.performance.excludedLate],
                    ["Attendance", rider.performance.attendancePctLabel ?? "—"],
                  ],
                }),
              }),
            ],
          }),
        }),
    ],
  });
}

export { RiderDetailPage };
