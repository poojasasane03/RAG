export type Role = "admin" | "manager" | "technician" | "viewer";
export interface User {
  id: string;
  email: string;
  role: Role;
}

export type EvidenceClass =
  | "MANUAL"
  | "HISTORY"
  | "TECHNICIAN"
  | "MAINTENANCE"
  | "INFERENCE";
export interface AnswerSentence {
  text: string;
  evidence_class: EvidenceClass;
  source?: string;
}

export interface Machine {
  id: string;
  name: string;
  model: string;
  location: string;
}
export interface Incident {
  id: string;
  machine_id: string;
  title: string;
  status: "open" | "resolved";
}

export interface AnswerResponse {
  refused: boolean;
  refusal_reason?: string;
  sentences: AnswerSentence[];
}
