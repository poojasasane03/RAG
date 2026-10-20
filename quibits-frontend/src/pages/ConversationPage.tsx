import { useState, type FormEvent } from "react";
import { EvidenceBadge } from "../components/EvidenceBadge";
import { api } from "../lib/api";
import { useApi } from "../lib/useApi";
import type { AnswerResponse, Machine } from "../types";

type Msg =
  | { role: "user"; text: string }
  | { role: "assistant"; answer: AnswerResponse };

export default function ConversationPage() {
  const { data: machines } = useApi<Machine[]>("/machines");
  const [machineId, setMachineId] = useState("");
  const [convId, setConvId] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(e: FormEvent) {
    e.preventDefault();
    if (!machineId || !input.trim()) return;
    const question = input;
    setInput("");
    setBusy(true);
    setMsgs((m) => [...m, { role: "user", text: question }]);
    try {
      let id = convId;
      if (!id) {
        const c = await api<{ id: string }>("/conversations", {
          method: "POST",
          body: JSON.stringify({ machine_id: machineId }),
        });
        id = c.id;
        setConvId(id);
      }
      const answer = await api<AnswerResponse>(
        `/conversations/${id}/messages`,
        { method: "POST", body: JSON.stringify({ content: question }) },
      );
      setMsgs((m) => [...m, { role: "assistant", answer }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h2 className="text-2xl font-semibold">Troubleshoot</h2>
      <select
        className="input w-auto"
        value={machineId}
        disabled={!!convId}
        onChange={(e) => setMachineId(e.target.value)}
      >
        <option value="">Select machine…</option>
        {machines?.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name} ({m.model})
          </option>
        ))}
      </select>

      <div className="space-y-3">
        {msgs.map((m, i) =>
          m.role === "user" ? (
            <div
              key={i}
              className="ml-auto max-w-[80%] rounded bg-slate-900 p-3 text-white"
            >
              {m.text}
            </div>
          ) : m.answer.refused ? (
            <div
              key={i}
              className="rounded border border-red-300 bg-red-50 p-3 text-red-800"
            >
              Not enough evidence to answer. {m.answer.refusal_reason}
            </div>
          ) : (
            <div key={i} className="card p-4">
              {m.answer.sentences.map((s, j) => (
                <p key={j} className="mb-2">
                  {s.text}
                  <EvidenceBadge type={s.evidence_class} source={s.source} />
                </p>
              ))}
              <p className="mt-2 text-xs text-slate-500">
                AI suggestions are not repair actions.
              </p>
            </div>
          ),
        )}
        {busy && <p className="text-slate-500">Thinking…</p>}
      </div>

      <form onSubmit={send} className="flex gap-2">
        <input
          className="input flex-1"
          placeholder="Describe the fault…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button disabled={!machineId || busy} className="btn">
          Send
        </button>
      </form>
    </div>
  );
}
