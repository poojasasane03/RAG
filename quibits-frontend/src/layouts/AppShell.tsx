import { NavLink, Outlet } from "react-router-dom";
import {
  ClipboardList,
  Cpu,
  LogOut,
  MessageSquare,
  Wrench,
} from "lucide-react";
import { BRAND } from "../config";
import { useAuth } from "../auth/AuthContext";

const link = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
    isActive
      ? "bg-slate-800 text-white ring-1 ring-amber-500/40"
      : "text-slate-300 hover:bg-slate-800/60"
  }`;

export default function AppShell() {
  const { user, logout } = useAuth();
  const canChat = user && user.role !== "viewer";

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-60 flex-col bg-slate-900 p-4">
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-900">
            <Wrench size={18} />
          </div>
          <div>
            <h1 className="text-base font-semibold leading-tight text-white">
              {BRAND.name}
            </h1>
            <p className="text-[11px] text-slate-500">by {BRAND.team}</p>
          </div>
        </div>

        <nav className="space-y-1">
          <NavLink to="/machines" className={link}>
            <Cpu size={16} /> Machines
          </NavLink>
          <NavLink to="/incidents" className={link}>
            <ClipboardList size={16} /> Incidents
          </NavLink>
          {canChat && (
            <NavLink to="/chat" className={link}>
              <MessageSquare size={16} /> Troubleshoot
            </NavLink>
          )}
        </nav>

        <div className="mt-auto border-t border-slate-800 pt-4 text-xs text-slate-400">
          <p className="truncate text-slate-200">{user?.email}</p>
          <p className="capitalize">{user?.role}</p>
          <button
            onClick={logout}
            className="mt-3 flex items-center gap-1.5 text-slate-300 hover:text-white"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
