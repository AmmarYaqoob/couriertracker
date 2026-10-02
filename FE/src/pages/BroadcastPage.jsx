// Rider broadcast composer and message templates.
import * as Na from "react";
import * as tt from "react/jsx-runtime";
import {
  fi,
  jt,
  mt,
  useToast,
  rt,
  readPilotModel,
} from "../services/portalState.jsx";
import {
  Badge,
  Card,
  Select,
  Modal,
  Field,
  Toast,
  PageHeader,
  Tabs,
  Callout,
  Button,
} from "../components/ui.jsx";
var Li = ["de", "en", "ar", "ur", "tr", "pl"],
  ac = {
    de: "Deutsch",
    en: "English",
    ar: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629",
    ur: "\u0627\u0631\u062F\u0648",
    tr: "T\xFCrk\xE7e",
    pl: "Polski",
  },
  q2 = ["ar", "ur"],
  _l = [
    {
      id: "tpl-severe-weather",
      kind: "urgent",
      title: "Severe weather \u2014 pause deliveries",
      mustAcknowledge: !0,
      bodies: {
        de: "Unwetterwarnung. Bitte Lieferungen pausieren, sicheren Unterstand suchen und auf Freigabe warten.",
        en: "Severe weather alert. Pause deliveries, find safe shelter and wait for the all-clear from dispatch.",
        ar: "\u062A\u062D\u0630\u064A\u0631 \u0645\u0646 \u0637\u0642\u0633 \u0634\u062F\u064A\u062F. \u0623\u0648\u0642\u0641 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0645\u0624\u0642\u062A\u0627\u064B\u060C \u0627\u0628\u062D\u062B \u0639\u0646 \u0645\u0623\u0648\u0649 \u0622\u0645\u0646 \u0648\u0627\u0646\u062A\u0638\u0631 \u0625\u0630\u0646 \u0627\u0644\u0627\u0633\u062A\u0626\u0646\u0627\u0641 \u0645\u0646 \u0627\u0644\u0625\u062F\u0627\u0631\u0629.",
        ur: "\u0634\u062F\u06CC\u062F \u0645\u0648\u0633\u0645 \u06A9\u06CC \u0648\u0627\u0631\u0646\u0646\u06AF\u06D4 \u0688\u06CC\u0644\u06CC\u0648\u0631\u06CC \u0631\u0648\u06A9 \u062F\u06CC\u06BA\u060C \u0645\u062D\u0641\u0648\u0638 \u062C\u06AF\u06C1 \u067E\u0631 \u067E\u0646\u0627\u06C1 \u0644\u06CC\u06BA \u0627\u0648\u0631 \u062F\u0648\u0628\u0627\u0631\u06C1 \u0634\u0631\u0648\u0639 \u06A9\u0631\u0646\u06D2 \u06A9\u06CC \u0627\u062C\u0627\u0632\u062A \u06A9\u0627 \u0627\u0646\u062A\u0638\u0627\u0631 \u06A9\u0631\u06CC\u06BA\u06D4",
        tr: "\u015Eiddetli hava uyar\u0131s\u0131. Teslimatlar\u0131 durdurun, g\xFCvenli bir yere s\u0131\u011F\u0131n\u0131n ve merkezden onay bekleyin.",
        pl: "Ostrze\u017Cenie o gwa\u0142townej pogodzie. Wstrzymaj dostawy, znajd\u017A bezpieczne schronienie i czekaj na sygna\u0142 do wznowienia.",
      },
    },
    {
      id: "tpl-break-arbzg",
      kind: "safety",
      title: "Break reminder (ArbZG)",
      mustAcknowledge: !0,
      bodies: {
        de: "Nach 6 Stunden Arbeit ist eine Pause von 30 Minuten Pflicht (ArbZG \xA74). Bitte jetzt einlegen.",
        en: "By law (ArbZG \xA74) you must take a 30 minute break after 6 hours of work. Please take it now.",
        ar: "\u0628\u0645\u0648\u062C\u0628 \u0642\u0627\u0646\u0648\u0646 \u0627\u0644\u0639\u0645\u0644 \u0627\u0644\u0623\u0644\u0645\u0627\u0646\u064A\u060C \u0627\u0644\u0627\u0633\u062A\u0631\u0627\u062D\u0629 30 \u062F\u0642\u064A\u0642\u0629 \u0625\u0644\u0632\u0627\u0645\u064A\u0629 \u0628\u0639\u062F 6 \u0633\u0627\u0639\u0627\u062A \u0639\u0645\u0644. \u064A\u0631\u062C\u0649 \u0623\u062E\u0630\u0647\u0627 \u0627\u0644\u0622\u0646.",
        ur: "\u062C\u0631\u0645\u0646 \u0644\u06CC\u0628\u0631 \u0644\u0627 \u06A9\u06D2 \u062A\u062D\u062A 6 \u06AF\u06BE\u0646\u0679\u06D2 \u06A9\u0627\u0645 \u06A9\u06D2 \u0628\u0639\u062F 30 \u0645\u0646\u0679 \u06A9\u0627 \u0648\u0642\u0641\u06C1 \u0644\u0627\u0632\u0645\u06CC \u06C1\u06D2\u06D4 \u0628\u0631\u0627\u06C1 \u06A9\u0631\u0645 \u0627\u0628\u06BE\u06CC \u0648\u0642\u0641\u06C1 \u0644\u06CC\u06BA\u06D4",
        tr: "Alman i\u015F kanununa g\xF6re 6 saat \xE7al\u0131\u015Fmadan sonra 30 dakikal\u0131k mola zorunludur. L\xFCtfen \u015Fimdi mola verin.",
        pl: "Zgodnie z niemieckim prawem pracy po 6 godzinach pracy obowi\u0105zkowa jest 30 minutowa przerwa. Zr\xF3b j\u0105 teraz.",
      },
    },
    {
      id: "tpl-minijob-cap",
      kind: "briefing",
      title: "Mini-job earnings cap approaching",
      mustAcknowledge: !1,
      bodies: {
        de: "Dein Mini-Job-Verdienst n\xE4hert sich der 538 \u20AC-Grenze. Bitte mit dem Koordinator abstimmen, bevor du weiterf\xE4hrst.",
        en: "Your mini-job earnings are close to the \u20AC538 monthly cap. Please check with your coordinator before taking more shifts.",
        ar: "\u062F\u062E\u0644\u0643 \u0641\u064A \u0648\u0638\u064A\u0641\u0629 \u0627\u0644\u0645\u064A\u0646\u064A \u062C\u0648\u0628 \u064A\u0642\u062A\u0631\u0628 \u0645\u0646 \u0627\u0644\u062D\u062F \u0627\u0644\u0634\u0647\u0631\u064A 538 \u064A\u0648\u0631\u0648. \u064A\u0631\u062C\u0649 \u0627\u0644\u062A\u0646\u0633\u064A\u0642 \u0645\u0639 \u0645\u0646\u0633\u0642\u0643 \u0642\u0628\u0644 \u0642\u0628\u0648\u0644 \u0648\u0631\u062F\u064A\u0627\u062A \u0625\u0636\u0627\u0641\u064A\u0629.",
        ur: "\u0622\u067E \u06A9\u06CC \u0645\u0646\u06CC \u062C\u0627\u0628 \u06A9\u06CC \u0622\u0645\u062F\u0646\u06CC 538 \u06CC\u0648\u0631\u0648 \u0645\u0627\u06C1\u0627\u0646\u06C1 \u062D\u062F \u06A9\u06D2 \u0642\u0631\u06CC\u0628 \u06C1\u06D2\u06D4 \u0645\u0632\u06CC\u062F \u0634\u0641\u0679\u0633 \u0644\u06CC\u0646\u06D2 \u0633\u06D2 \u067E\u06C1\u0644\u06D2 \u06A9\u0648\u0622\u0631\u0688\u06CC\u0646\u06CC\u0679\u0631 \u0633\u06D2 \u0628\u0627\u062A \u06A9\u0631\u06CC\u06BA\u06D4",
        tr: "Mini-job kazanc\u0131n\u0131z ayl\u0131k 538 \u20AC s\u0131n\u0131r\u0131na yakla\u015F\u0131yor. Yeni vardiya almadan \xF6nce koordinat\xF6r\xFCn\xFCzle g\xF6r\xFC\u015F\xFCn.",
        pl: "Twoje zarobki w mini-job zbli\u017Caj\u0105 si\u0119 do miesi\u0119cznego limitu 538 \u20AC. Skontaktuj si\u0119 z koordynatorem przed kolejnymi zmianami.",
      },
    },
    {
      id: "tpl-shift-start",
      kind: "shift",
      title: "Shift start briefing",
      mustAcknowledge: !1,
      bodies: {
        de: "Guten Start! Bitte Readiness-Check machen, Batterie pr\xFCfen und die Zone best\xE4tigen, bevor du dich in der App auf aktiv setzt.",
        en: "Have a good shift. Run the readiness check, verify battery level and confirm your zone before going active in the app.",
        ar: "\u0628\u062F\u0627\u064A\u0629 \u0645\u0648\u0641\u0642\u0629. \u0642\u0645 \u0628\u0641\u062D\u0635 \u0627\u0644\u062C\u0627\u0647\u0632\u064A\u0629\u060C \u062A\u0623\u0643\u062F \u0645\u0646 \u0627\u0644\u0628\u0637\u0627\u0631\u064A\u0629 \u0648\u0623\u0643\u062F \u0627\u0644\u0645\u0646\u0637\u0642\u0629 \u0642\u0628\u0644 \u062A\u0641\u0639\u064A\u0644 \u062D\u0627\u0644\u062A\u0643 \u0641\u064A \u0627\u0644\u062A\u0637\u0628\u064A\u0642.",
        ur: "\u0627\u0686\u06BE\u06CC \u0634\u0641\u0679 \u06C1\u0648\u06D4 \u0631\u06CC\u0688\u06CC \u0646\u06CC\u0633 \u0686\u06CC\u06A9 \u06A9\u0631\u06CC\u06BA\u060C \u0628\u06CC\u0679\u0631\u06CC \u0686\u06CC\u06A9 \u06A9\u0631\u06CC\u06BA \u0627\u0648\u0631 \u0627\u06CC\u067E \u0645\u06CC\u06BA \u0627\u06CC\u06A9\u0679\u0648 \u06C1\u0648\u0646\u06D2 \u0633\u06D2 \u067E\u06C1\u0644\u06D2 \u0632\u0648\u0646 \u06A9\u06CC \u062A\u0635\u062F\u06CC\u0642 \u06A9\u0631\u06CC\u06BA\u06D4",
        tr: "\u0130yi vardiyalar. Uygulamada aktif olmadan \xF6nce haz\u0131rl\u0131k kontrol\xFCn\xFC yap\u0131n, bataryay\u0131 kontrol edin ve b\xF6lgenizi onaylay\u0131n.",
        pl: "Dobrej zmiany. Wykonaj kontrol\u0119 gotowo\u015Bci, sprawd\u017A bateri\u0119 i potwierd\u017A stref\u0119 przed przej\u015Bciem na aktywny w aplikacji.",
      },
    },
    {
      id: "tpl-safety-incident",
      kind: "safety",
      title: "Reported safety incident on route",
      mustAcknowledge: !0,
      bodies: {
        de: "Vorfall auf Route Neuk\xF6lln-Nord gemeldet. Bitte in Zweier-Gruppen fahren, Helm tragen und alle Zwischenf\xE4lle sofort melden.",
        en: "Safety incident reported on Neuk\xF6lln-Nord route. Ride in pairs, keep helmets on and report any concerns to dispatch immediately.",
        ar: "\u062D\u0627\u062F\u062B\u0629 \u0623\u0645\u0627\u0646 \u0641\u064A \u0645\u0633\u0627\u0631 \u0646\u0648\u064A\u0643\u0648\u0644\u0646 \u0627\u0644\u0634\u0645\u0627\u0644\u064A. \u0633\u064A\u0631\u0648\u0627 \u0641\u064A \u062B\u0646\u0627\u0626\u064A\u0627\u062A\u060C \u0627\u0631\u062A\u062F\u0648\u0627 \u0627\u0644\u062E\u0648\u0630\u0629 \u0648\u0623\u0628\u0644\u063A\u0648\u0627 \u0627\u0644\u0625\u062F\u0627\u0631\u0629 \u0641\u0648\u0631\u0627\u064B \u0628\u0623\u064A \u0645\u0634\u0643\u0644\u0629.",
        ur: "\u0646\u0648\u06CC\u06A9\u0648\u0644\u0646 \u0646\u0627\u0631\u062A\u06BE \u0631\u0648\u0679 \u067E\u0631 \u062D\u0641\u0627\u0638\u062A\u06CC \u0648\u0627\u0642\u0639\u06C1 \u0631\u067E\u0648\u0631\u0679 \u06C1\u0648\u0627\u06D4 \u062C\u0648\u0691\u0648\u06BA \u0645\u06CC\u06BA \u0686\u0644\u06CC\u06BA\u060C \u06C1\u06CC\u0644\u0645\u0679 \u067E\u06C1\u0646\u06CC\u06BA \u0627\u0648\u0631 \u06A9\u0648\u0626\u06CC \u0628\u06BE\u06CC \u0645\u0633\u0626\u0644\u06C1 \u0641\u0648\u0631\u0627\u064B \u0688\u0633\u067E\u06CC\u0686 \u06A9\u0648 \u0628\u062A\u0627\u0626\u06CC\u06BA\u06D4",
        tr: "Neuk\xF6lln-Nord g\xFCzerg\xE2h\u0131nda g\xFCvenlik olay\u0131 bildirildi. \xC7iftler halinde ilerleyin, kask\u0131 \xE7\u0131karmay\u0131n ve olaylar\u0131 hemen bildirin.",
        pl: "Zg\u0142oszono incydent bezpiecze\u0144stwa na trasie Neuk\xF6lln-Nord. Jed\u017Acie parami, nie zdejmujcie kasku i natychmiast zg\u0142aszajcie problemy.",
      },
    },
    {
      id: "tpl-uniform-check",
      kind: "briefing",
      title: "Uniform and equipment inspection",
      mustAcknowledge: !1,
      bodies: {
        de: "Diese Woche Uniform- und Ausr\xFCstungskontrolle. Bitte Jacke, Helm und Tasche vor Schichtbeginn beim Koordinator vorzeigen.",
        en: "Uniform and equipment inspection this week. Show your jacket, helmet and bag to the coordinator before starting your shift.",
        ar: "\u0641\u062D\u0635 \u0627\u0644\u0632\u064A \u0648\u0627\u0644\u0645\u0639\u062F\u0627\u062A \u0647\u0630\u0627 \u0627\u0644\u0623\u0633\u0628\u0648\u0639. \u0627\u0639\u0631\u0636 \u0627\u0644\u0633\u062A\u0631\u0629 \u0648\u0627\u0644\u062E\u0648\u0630\u0629 \u0648\u0627\u0644\u062D\u0642\u064A\u0628\u0629 \u0639\u0644\u0649 \u0627\u0644\u0645\u0646\u0633\u0642 \u0642\u0628\u0644 \u0628\u062F\u0621 \u0627\u0644\u0648\u0631\u062F\u064A\u0629.",
        ur: "\u0627\u0633 \u06C1\u0641\u062A\u06D2 \u06CC\u0648\u0646\u06CC\u0641\u0627\u0631\u0645 \u0627\u0648\u0631 \u0633\u0627\u0645\u0627\u0646 \u06A9\u0627 \u0645\u0639\u0627\u0626\u0646\u06C1 \u06C1\u06D2\u06D4 \u0634\u0641\u0679 \u0634\u0631\u0648\u0639 \u06A9\u0631\u0646\u06D2 \u0633\u06D2 \u067E\u06C1\u0644\u06D2 \u062C\u06CC\u06A9\u0679\u060C \u06C1\u06CC\u0644\u0645\u0679 \u0627\u0648\u0631 \u0628\u06CC\u06AF \u06A9\u0648\u0622\u0631\u0688\u06CC\u0646\u06CC\u0679\u0631 \u06A9\u0648 \u062F\u06A9\u06BE\u0627\u0626\u06CC\u06BA\u06D4",
        tr: "Bu hafta \xFCniforma ve ekipman kontrol\xFC var. Vardiyaya ba\u015Flamadan \xF6nce ceket, kask ve \xE7antay\u0131 koordinat\xF6re g\xF6sterin.",
        pl: "W tym tygodniu kontrola munduru i sprz\u0119tu. Przed rozpocz\u0119ciem zmiany poka\u017C kurtk\u0119, kask i torb\u0119 koordynatorowi.",
      },
    },
  ];
function Z2(t) {
  let e = 2166136261;
  for (let a = 0; a < t.length; a++)
    ((e ^= t.charCodeAt(a)), (e = Math.imul(e, 16777619)));
  return (e >>> 0) / 4294967295;
}
function I3(t, e, a, r) {
  let n = Math.max(0, Math.min(1, r));
  return e.map((i, o) => {
    let l = Z2(`${t}:${i.id}:lang`),
      d = Li[Math.floor(l * Li.length)],
      c = a - Math.floor(Z2(`${t}:${i.id}:sent`) * 9e4) - o * 40,
      p = Z2(`${t}:${i.id}:ack`) < n,
      u = p ? c + Math.floor(Z2(`${t}:${i.id}:when`) * 24e4) + 5e3 : void 0;
    return {
      driverId: i.id,
      langUsed: d,
      sentAt: c,
      acknowledged: p,
      acknowledgedAt: u,
    };
  });
}
var pb = [
    {
      value: "on_shift",
      label: "All riders on shift now",
    },
    {
      value: "zone",
      label: "Riders by home zone",
    },
    {
      value: "employment",
      label: "Riders by employment type",
    },
    {
      value: "platform",
      label: "Riders by platform",
    },
  ],
  $3 = {
    safety: "warn",
    shift: "info",
    briefing: "neutral",
    urgent: "crit",
  },
  Z0 = {
    safety: "Safety",
    shift: "Shift",
    briefing: "Briefing",
    urgent: "Urgent",
  };
function q0(t) {
  let e = new Date(t),
    a = e.getHours().toString().padStart(2, "0"),
    r = e.getMinutes().toString().padStart(2, "0"),
    n = e.getSeconds().toString().padStart(2, "0");
  return `${a}:${r}:${n}`;
}
function Tl(t, e) {
  return t.trim()
    ? e === "de"
      ? t
      : `${t} (auto-translated \u2192 ${ac[e]})`
    : "";
}
function BroadcastPage() {
  let t = readPilotModel(),
    e = jt(),
    [a, r] = useToast(),
    [n, i] = Na.useState(_l[0].id),
    [o, l] = Na.useState("de"),
    [d, c] = Na.useState("on_shift"),
    [g, p] = Na.useState(t.zones[0]?.id ?? ""),
    [u, s] = Na.useState("Full-time"),
    [f, x] = Na.useState("uber_eats"),
    [M, h] = Na.useState(!1),
    [m, y] = Na.useState(null),
    [k, L] = Na.useState(null),
    [w, O] = fi("broadcast.drafts", []),
    [A, j] = Na.useState(""),
    v = Na.useMemo(() => _l.find((Z) => Z.id === n) ?? _l[0], [n]),
    E = Na.useMemo(() => {
      if (d === "on_shift") {
        let Z = new Set(["off_shift", "no_show", "not_started"]),
          qt = new Set(
            e.driverStates
              .filter((Se) => !Z.has(Se.activity))
              .map((Se) => Se.driverId),
          );
        return t.drivers.filter((Se) => qt.has(Se.id));
      }
      return d === "zone"
        ? t.drivers.filter((Z) => Z.homeZoneId === g)
        : d === "employment"
          ? t.drivers.filter((Z) => Z.employmentType === u)
          : t.drivers.filter((Z) => Z.platform === f);
    }, [d, e.driverStates, t.drivers, g, u, f]),
    Q = Na.useMemo(
      () =>
        d === "on_shift"
          ? "riders on shift now"
          : d === "zone"
            ? `riders in ${rt(g)}`
            : d === "employment"
              ? `${u} riders`
              : `${mt[f]} riders`,
      [d, g, u, f],
    ),
    _ = q2.includes(o),
    Mt = () => {
      let Z = Date.now(),
        qt = I3(v.id, E, Z, 0.82);
      (y(qt),
        L(v.id),
        h(!1),
        r(`Sent to ${E.length} riders in ${Li.length} languages`));
    },
    Wt = () => {
      if (!A.trim()) {
        r("Draft is empty");
        return;
      }
      let Z = {
          de: A,
          en: Tl(A, "en"),
          ar: Tl(A, "ar"),
          ur: Tl(A, "ur"),
          tr: Tl(A, "tr"),
          pl: Tl(A, "pl"),
        },
        qt = {
          id: `draft-${Date.now()}`,
          createdAt: Date.now(),
          de: A,
          translations: Z,
        };
      (O([qt, ...w]), j(""), r("Draft saved locally"));
    },
    Tt = (Z) => {
      O(w.filter((qt) => qt.id !== Z));
    },
    Pt = (Z) => t.drivers.find((qt) => qt.id === Z)?.name ?? Z,
    Bt = k === v.id ? m : null;
  return tt.jsxs(tt.Fragment, {
    children: [
      <PageHeader
        eyebrow="Communications"
        title="Multilingual Broadcast"
        description="Reach every rider in their language. Must-acknowledge for safety and compliance."
      />,
      <div
        className="grid"
        style={{
          gridTemplateColumns: "minmax(280px, 340px) 1fr",
          gap: 16,
          alignItems: "start",
        }}
      >
        <Card title="Templates" sub={`${_l.length} ready to send`} flush={!0}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {_l.map((Z) => {
              let qt = Z.id === v.id;
              return (
                <button
                  type="button"
                  onClick={() => {
                    (i(Z.id), l("de"));
                  }}
                  className={`clickable ${qt ? "on" : ""}`}
                  style={{
                    textAlign: "left",
                    padding: "12px 14px",
                    borderBottom: "1px solid var(--line, #eee)",
                    background: qt
                      ? "var(--accent-soft, rgba(0,0,0,0.04))"
                      : "transparent",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    border: 0,
                  }}
                  aria-pressed={qt}
                  key={Z.id}
                >
                  <div
                    className="row"
                    style={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Badge tone={$3[Z.kind]}>{Z0[Z.kind]}</Badge>
                    {Z.mustAcknowledge && (
                      <Badge tone="accent">{"Must acknowledge"}</Badge>
                    )}
                  </div>
                  <div className="bold small">{Z.title}</div>
                  <div className="xsmall muted">
                    {Z.bodies.de.slice(0, 72)}
                    {"…"}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <Card
            title={v.title}
            sub=<span
              className="row"
              style={{
                gap: 8,
              }}
            >
              <Badge tone={$3[v.kind]}>{Z0[v.kind]}</Badge>
              {v.mustAcknowledge && (
                <Badge tone="accent">{"Must acknowledge"}</Badge>
              )}
            </span>
            actions={tt.jsxs(tt.Fragment, {
              children: [
                <Select
                  id="audience"
                  value={d}
                  options={pb}
                  onChange={c}
                  label="Audience"
                />,
                d === "zone" && (
                  <Select
                    id="audience-zone"
                    value={g}
                    options={t.zones.map((Z) => ({
                      value: Z.id,
                      label: Z.name,
                    }))}
                    onChange={p}
                    label="Zone"
                  />
                ),
                d === "employment" && (
                  <Select
                    id="audience-emp"
                    value={u}
                    options={[
                      {
                        value: "Full-time",
                        label: "Full-time",
                      },
                      {
                        value: "Part-time",
                        label: "Part-time",
                      },
                      {
                        value: "Mini-job",
                        label: "Mini-job",
                      },
                      {
                        value: "Midi-job",
                        label: "Midi-job",
                      },
                      {
                        value: "Working Student",
                        label: "Working Student",
                      },
                    ]}
                    onChange={s}
                    label="Employment"
                  />
                ),
                d === "platform" && (
                  <Select
                    id="audience-platform"
                    value={f}
                    options={[
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
                    ]}
                    onChange={x}
                    label="Platform"
                  />
                ),
                <Button
                  variant="primary"
                  onClick={() => h(!0)}
                  disabled={E.length === 0}
                >
                  {"Send now"}
                </Button>,
              ],
            })}
          >
            <Tabs
              value={o}
              onChange={l}
              tabs={Li.map((Z) => ({
                value: Z,
                label: ac[Z],
              }))}
            />
            <div
              dir={_ ? "rtl" : "ltr"}
              lang={o}
              style={{
                marginTop: 12,
                padding: 16,
                border: "1px solid var(--line, #eee)",
                borderRadius: 8,
                background: "var(--surface, #fafafa)",
                fontSize: 15,
                lineHeight: 1.55,
                textAlign: _ ? "right" : "left",
                minHeight: 120,
              }}
            >
              {v.bodies[o]}
            </div>
            <div
              className="row small muted"
              style={{
                marginTop: 10,
                justifyContent: "space-between",
              }}
            >
              <span>
                {"Target: "}
                {E.length} {Q}
              </span>
              <span>
                {Li.length}
                {" languages · "}
                {_ ? "RTL" : "LTR"}
                {" preview"}
              </span>
            </div>
          </Card>
          {Bt && (
            <Card
              title="Delivery receipts"
              sub={`${Bt.filter((Z) => Z.acknowledged).length} of ${Bt.length} acknowledged`}
              flush={!0}
            >
              <div
                className="table-wrap table-scroll"
                style={{
                  maxHeight: 360,
                }}
              >
                <table className="table">
                  <thead>
                    <tr>
                      <th>{"Rider"}</th>
                      <th>{"Language used"}</th>
                      <th className="num">{"Sent"}</th>
                      <th>{"Acknowledged"}</th>
                      <th className="num">{"Ack time"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Bt.map((Z) => (
                      <tr key={Z.driverId}>
                        <td>
                          <span className="bold">{Pt(Z.driverId)}</span>
                          <div className="xsmall muted">{Z.driverId}</div>
                        </td>
                        <td className="small">{ac[Z.langUsed]}</td>
                        <td className="num small">{q0(Z.sentAt)}</td>
                        <td>
                          {Z.acknowledged ? (
                            <Badge tone="good">{"Yes"}</Badge>
                          ) : (
                            <Badge tone="warn">{"Pending"}</Badge>
                          )}
                        </td>
                        <td className="num small">
                          {Z.acknowledged && Z.acknowledgedAt
                            ? q0(Z.acknowledgedAt)
                            : "\u2014"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
          <Card
            title="Compose new"
            sub="Custom broadcast with placeholder auto-translation"
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <Field
                id="draft-de"
                label="Deutsch (source)"
                hint="Write once in German. The other five languages are stubbed for the POC."
              >
                <textarea
                  id="draft-de"
                  className="input"
                  rows={3}
                  placeholder="z. B. Bitte heute Warnwesten tragen — Sichtbarkeit ist bei Nebel eingeschränkt."
                  value={A}
                  onChange={(Z) => j(Z.target.value)}
                  style={{
                    resize: "vertical",
                    minHeight: 80,
                    fontFamily: "inherit",
                  }}
                />
              </Field>
              <div
                className="grid g3"
                style={{
                  gap: 8,
                }}
              >
                {Li.filter((Z) => Z !== "de").map((Z) => (
                  <div
                    dir={q2.includes(Z) ? "rtl" : "ltr"}
                    lang={Z}
                    style={{
                      padding: 10,
                      border: "1px dashed var(--line, #ddd)",
                      borderRadius: 6,
                      fontSize: 13,
                      minHeight: 56,
                      textAlign: q2.includes(Z) ? "right" : "left",
                    }}
                    key={Z}
                  >
                    <div
                      className="xsmall muted"
                      style={{
                        marginBottom: 4,
                        textAlign: "left",
                      }}
                    >
                      {ac[Z]}
                    </div>
                    <div>
                      {Tl(A, Z) || <span className="muted">{"…"}</span>}
                    </div>
                  </div>
                ))}
              </div>
              <Callout tone="warn">
                {
                  "Auto-translation is a POC stub; production would call DeepL / Anthropic for translation-with-context."
                }
              </Callout>
              <div
                className="row"
                style={{
                  justifyContent: "flex-end",
                  gap: 8,
                }}
              >
                <Button onClick={() => j("")} disabled={!A}>
                  {"Clear"}
                </Button>
                <Button variant="primary" onClick={Wt} disabled={!A.trim()}>
                  {"Save draft"}
                </Button>
              </div>
              {w.length > 0 && (
                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  <div
                    className="small bold"
                    style={{
                      marginBottom: 6,
                    }}
                  >
                    {"Saved drafts ("}
                    {w.length}
                    {")"}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    {w.map((Z) => (
                      <div
                        className="row"
                        style={{
                          justifyContent: "space-between",
                          gap: 8,
                          padding: "6px 8px",
                          border: "1px solid var(--line, #eee)",
                          borderRadius: 6,
                        }}
                        key={Z.id}
                      >
                        <div
                          style={{
                            minWidth: 0,
                          }}
                        >
                          <div
                            className="small"
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {Z.de}
                          </div>
                          <div className="xsmall muted">
                            {"Saved "}
                            {q0(Z.createdAt)}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => Tt(Z.id)}
                        >
                          {"Delete"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>,
      M && (
        <Modal
          title="Send broadcast"
          onClose={() => h(!1)}
          footer={tt.jsxs(tt.Fragment, {
            children: [
              <Button onClick={() => h(!1)}>{"Cancel"}</Button>,
              <Button variant="primary" onClick={Mt}>
                {"Confirm send"}
              </Button>,
            ],
          })}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div>
              {"About to send "}
              <span className="bold">{v.title}</span>
              {" to"} <span className="bold">{E.length}</span> {Q}
              {" in"} <span className="bold">{Li.length}</span>
              {" languages."}
            </div>
            {v.mustAcknowledge && (
              <Callout tone="warn">
                {"This template requires each rider to acknowledge receipt."}
              </Callout>
            )}
            <div className="xsmall muted">
              {"Kind: "}
              {Z0[v.kind]}
              {" · Template "}
              {v.id}
            </div>
          </div>
        </Modal>
      ),
      <Toast message={a} />,
    ],
  });
}
export { BroadcastPage };
