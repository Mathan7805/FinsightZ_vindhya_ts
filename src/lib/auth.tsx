import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Persona = "ceo" | "cfo" | "finance" | "it" | "operations" | "facilities";

export const PERSONAS: Record<Persona, { label: string; title: string; route: string; tagline: string }> = {
  ceo: { label: "CEO / CXO", title: "Chief Executive Officer", route: "/ceo", tagline: "Enterprise pulse & strategic KPIs" },
  cfo: { label: "CFO", title: "Chief Financial Officer", route: "/cfo", tagline: "Profitability, MIS & Publish" },
  finance: { label: "Finance", title: "Finance Team Lead", route: "/finance", tagline: "Upload, validate, reconcile" },
  it: { label: "IT / Admin", title: "IT / Admin Head", route: "/it", tagline: "Infra, seats & software costs" },
  operations: { label: "Operations", title: "Operations Head", route: "/operations", tagline: "Process metrics & utilization" },
  facilities: { label: "Facilities", title: "Facilities Head", route: "/facilities", tagline: "Building, utilities & expenses" },
};

export type User = {
  id: string;
  persona: Persona;
  name: string;
  email: string;
  mustChangePassword: boolean;
};

const KEY = "finsightz.user";

type Ctx = {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => void;
  ready: boolean;
};
const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUserState(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  const setUser = (u: User | null) => {
    if (u) {
      localStorage.setItem(KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(KEY);
    }
    setUserState(u);
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    setUserState(null);
  };

  return <AuthContext.Provider value={{ user, setUser, logout, ready }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const c = useContext(AuthContext);
  if (!c) throw new Error("useAuth outside provider");
  return c;
};
