import { useState } from "react";
import { DEMO_PASSWORD, DEMO_USERS, useAuth } from "../auth/AuthProvider.jsx";
import { d2 as KpiIcon, hi as CapacityIcon, hl as TowerIcon, p2 as ArrowIcon, s2 as ComplianceIcon } from "../components/icons.jsx";
import { useI18n } from "../services/portalState.jsx";

const FEATURES = [
  {
    icon: <TowerIcon size={18} />,
    title: "Live control tower",
    text: "Late-delivery alerts before they happen",
  },
  {
    icon: <CapacityIcon size={18} />,
    title: "Capacity by zone",
    text: "30-minute forecasts and safe repositioning",
  },
  {
    icon: <KpiIcon size={18} />,
    title: "Platform KPIs",
    text: "PTOD under each partner's own definition",
  },
  {
    icon: <ComplianceIcon size={18} />,
    title: "Compliance evidence",
    text: "Wages, hours, permits and audit packs",
  },
];

function LoginPage() {
  const { login, loginAs } = useAuth();
  const { t, lang, setLang } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalid, setInvalid] = useState(false);

  const onSubmit = (event) => {
    event.preventDefault();
    setInvalid(!login(email, password));
  };

  return (
    <div className="login">
      <section className="login-hero">
        <div className="row">
          <div className="brand-mark">EE</div>
          <div>
            <div className="brand-name">EELS FLEET PORTAL</div>
            <div className="brand-sub">Last-mile food delivery</div>
          </div>
        </div>
        <div>
          <h1>
            Ready drivers. Right zones. <em>Honest numbers.</em>
          </h1>
          <p style={{ marginTop: 14, color: "#b7c4da", maxWidth: 520 }}>
            The operating system for the EELS Frankfurt pilot with Uber Eats, Wolt and Lieferando:
            workforce readiness, live delivery control, fair performance and compliance in one place.
          </p>
        </div>
        <div className="grid g2" style={{ maxWidth: 560 }}>
          {FEATURES.map((feature) => (
            <div className="feature" key={feature.title}>
              <span style={{ color: "var(--lime-500)" }}>{feature.icon}</span>
              <b>{feature.title}</b>
              <span>{feature.text}</span>
            </div>
          ))}
        </div>
        <div className="xsmall" style={{ marginTop: "auto", color: "#7f90b0" }}>
          © 2026 EELS GmbH · Raunheim · Prototype with simulated pilot data
        </div>
      </section>
      <section className="login-side">
        <form className="login-card" onSubmit={onSubmit}>
          <div className="row between">
            <h2 style={{ fontSize: 22 }}>{t("signIn")}</h2>
            <button
              type="button"
              className="btn ghost sm"
              onClick={() => setLang(lang === "en" ? "de" : "en")}
            >
              {lang === "en" ? "Deutsch" : "English"}
            </button>
          </div>
          <div className="field">
            <label htmlFor="email">{t("email")}</label>
            <input
              id="email"
              className="input"
              type="email"
              autoComplete="username"
              placeholder="you@eels.de"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="password">{t("password")}</label>
            <input
              id="password"
              className="input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <div className="hint">Demo password for every account: {DEMO_PASSWORD}</div>
          </div>
          {invalid && <div className="note crit">{t("invalid")}</div>}
          <button type="submit" className="btn primary" style={{ padding: "10px 14px" }}>
            {t("signIn")} <ArrowIcon size={15} />
          </button>
          <div className="divider" />
          <div className="field-label">{t("quickLogin")}</div>
          <div className="chips">
            {DEMO_USERS.map((account) => (
              <button type="button" key={account.role} onClick={() => loginAs(account.role)}>
                {account.title}
              </button>
            ))}
          </div>
        </form>
      </section>
    </div>
  );
}

export { LoginPage };
