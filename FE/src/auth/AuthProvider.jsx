import { createContext, useContext, useEffect, useState } from "react";

const AUTH_STORAGE_KEY = "eels_auth_v1";
const DEMO_PASSWORD = "demo123";

const DEMO_USERS = [
  {
    email: "executive@eels.de",
    role: "executive",
    name: "Marcus Klein",
    title: "Chief Executive",
  },
  {
    email: "admin@eels.de",
    role: "admin",
    name: "Anna Müller",
    title: "Operations Admin",
  },
  {
    email: "shiftlead@eels.de",
    role: "shift_lead",
    name: "Tobias Lang",
    title: "Shift Lead",
  },
  {
    email: "fleet@eels.de",
    role: "fleet_manager",
    name: "Björn Richter",
    title: "Fleet Owner",
  },
  {
    email: "hr@eels.de",
    role: "hr",
    name: "Priya Sharma",
    title: "HR Manager",
  },
  {
    email: "compliance@eels.de",
    role: "compliance",
    name: "Ali Hassan",
    title: "Compliance Officer",
  },
  {
    email: "payroll@eels.de",
    role: "payroll",
    name: "Sophie Wagner",
    title: "Payroll Admin",
  },
];

const AuthContext = createContext({
  user: null,
  login: () => false,
  loginAs: () => {},
  logout: () => {},
});

function readStoredUser() {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!saved) return null;
    const { email } = JSON.parse(saved);
    return DEMO_USERS.find((account) => account.email === email) ?? null;
  } catch {
    return null;
  }
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ email: user.email }));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // Storage can be blocked. The session still works for this tab.
    }
  }, [user]);

  const login = (email, password) => {
    const account = DEMO_USERS.find(
      (candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase(),
    );
    if (!account || password !== DEMO_PASSWORD) return false;
    setUser(account);
    return true;
  };

  const loginAs = (role) => {
    setUser(DEMO_USERS.find((account) => account.role === role) ?? null);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { AUTH_STORAGE_KEY, AuthContext, AuthProvider, DEMO_PASSWORD, DEMO_USERS, useAuth };
