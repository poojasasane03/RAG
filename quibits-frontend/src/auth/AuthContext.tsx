import { createContext, useContext, useState, type ReactNode } from "react";
import { api, setToken } from "../lib/api";
import type { User } from "../types";

interface AuthValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
const Ctx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = sessionStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  });

  async function login(email: string, password: string) {
    const res = await api<{ access_token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(res.access_token);
    sessionStorage.setItem("user", JSON.stringify(res.user));
    setUser(res.user);
  }

  function logout() {
    setToken(null);
    sessionStorage.removeItem("user");
    setUser(null);
  }

  return (
    <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}
