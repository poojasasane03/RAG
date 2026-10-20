import { useState, type FormEvent } from "react";
import { api } from "../lib/api";
import { useApi } from "../lib/useApi";
import type { Machine } from "../types";

export default function MachinesPage() {
  const { data, error, loading, reload } = useApi<Machine[]>("/machines");
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [location, setLocation] = useState("");

  async function add(e: FormEvent) {
    e.preventDefault();
    await api("/machines", {
      method: "POST",
      body: JSON.stringify({ name, model, location }),
    });
    setName("");
    setModel("");
    setLocation("");
    reload();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Machines</h2>
      <form onSubmit={add} className="flex gap-2">
        <input
          className="input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="input"
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          required
        />
        <input
          className="input"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button className="btn">Add</button>
      </form>
      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}
      <table className="card w-full overflow-hidden text-left text-sm">
        <thead className="border-b bg-slate-50 text-slate-500">
          <tr>
            <th className="p-3">Name</th>
            <th>Model</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((m) => (
            <tr key={m.id} className="border-b last:border-0">
              <td className="p-3">{m.name}</td>
              <td>{m.model}</td>
              <td>{m.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
