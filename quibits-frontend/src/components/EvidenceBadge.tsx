import type { EvidenceClass } from "../types";

const STYLES: Record<EvidenceClass, { label: string; cls: string }> = {
  MANUAL: {
    label: "Manual",
    cls: "bg-green-100 text-green-800 border-green-300",
  },
  HISTORY: {
    label: "Past incident",
    cls: "bg-blue-100 text-blue-800 border-blue-300",
  },
  TECHNICIAN: {
    label: "Unverified note",
    cls: "bg-amber-100 text-amber-800 border-amber-300",
  },
  MAINTENANCE: {
    label: "Maintenance record",
    cls: "bg-purple-100 text-purple-800 border-purple-300",
  },
  INFERENCE: {
    label: "AI inference",
    cls: "bg-gray-100 text-gray-700 border-gray-400 border-dashed",
  },
};

export function EvidenceBadge({
  type,
  source,
}: {
  type: EvidenceClass;
  source?: string;
}) {
  const s = STYLES[type];
  return (
    <span
      className={`ml-1 inline-flex rounded border px-1.5 py-0.5 text-xs align-middle ${s.cls}`}
    >
      {s.label}
      {source ? ` · ${source}` : ""}
    </span>
  );
}
