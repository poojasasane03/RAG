import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench } from "lucide-react";
import { BRAND } from "../config";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      nav("/machines");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <form onSubmit={submit} className="card w-full max-w-sm space-y-4 p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-slate-900">
            <Wrench size={22} />
          </div>
          <div>
            <h2 className="text-xl font-semibold leading-tight">
              {BRAND.name}
            </h2>
            <p className="text-xs text-slate-500">{BRAND.tagline}</p>
          </div>
        </div>

        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn w-full">Sign in</button>
        <p className="text-xs text-slate-500">
          Mock mode: any password works. Email with "admin" or "viewer" sets the
          role.
        </p>
        <p className="text-center text-xs text-slate-400">by {BRAND.team}</p>
      </form>
    </div>
  );
}
