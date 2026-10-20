import { api } from "../lib/api";
import { useApi } from "../lib/useApi";
import type { Incident } from "../types";

export default function IncidentsPage() {
  const { data, error, loading, reload } = useApi<Incident[]>("/incidents");

  async function resolve(id: string) {
    if (
      !window.confirm(
        "Confirm this incident is resolved? This is a human action and is audit-logged.",
      )
    )
      return;
    await api(`/incidents/${id}/resolve`, { method: "POST" });
    reload();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Incidents</h2>
      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}
      <ul className="space-y-2">
        {data?.map((i) => (
          <li key={i.id} className="card flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{i.title}</p>
              <p className="text-xs text-slate-500">Machine {i.machine_id}</p>
            </div>
            {i.status === "open" ? (
              <button onClick={() => resolve(i.id)} className="btn-outline">
                Confirm resolved
              </button>
            ) : (
              <span className="text-sm text-green-700">Resolved</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
