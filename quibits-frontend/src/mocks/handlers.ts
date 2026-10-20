import { http, HttpResponse, delay } from "msw";
import type { Incident, Machine, Role } from "../types";

const machines: Machine[] = [
  { id: "m1", name: "Press 01", model: "HP-200", location: "Plant A" },
  { id: "m2", name: "Conveyor 04", model: "CV-77", location: "Plant B" },
];
const incidents: Incident[] = [
  {
    id: "i1",
    machine_id: "m1",
    title: "Hydraulic pressure drop",
    status: "open",
  },
  {
    id: "i2",
    machine_id: "m2",
    title: "Belt misalignment",
    status: "resolved",
  },
];

export const handlers = [
  http.post("/api/auth/login", async ({ request }) => {
    const { email } = (await request.json()) as { email: string };
    const role: Role = email.includes("admin")
      ? "admin"
      : email.includes("viewer")
        ? "viewer"
        : "technician";
    return HttpResponse.json({
      access_token: "mock-token",
      user: { id: "u1", email, role },
    });
  }),

  http.get("/api/machines", () => HttpResponse.json(machines)),
  http.post("/api/machines", async ({ request }) => {
    const body = (await request.json()) as Omit<Machine, "id">;
    const m = { id: `m${machines.length + 1}`, ...body };
    machines.push(m);
    return HttpResponse.json(m, { status: 201 });
  }),

  http.get("/api/incidents", () => HttpResponse.json(incidents)),
  http.post("/api/incidents/:id/resolve", ({ params }) => {
    const i = incidents.find((x) => x.id === params.id);
    if (i) i.status = "resolved";
    return HttpResponse.json(i);
  }),

  http.post("/api/conversations", () =>
    HttpResponse.json({ id: "c1" }, { status: 201 }),
  ),
  http.post("/api/conversations/:id/messages", async ({ request }) => {
    const { content } = (await request.json()) as { content: string };
    await delay(800);
    if (content.toLowerCase().includes("unknown")) {
      return HttpResponse.json({
        refused: true,
        refusal_reason: "No manual section matches this machine model.",
        sentences: [],
      });
    }
    return HttpResponse.json({
      refused: false,
      sentences: [
        {
          text: "Check that hydraulic pressure is within 2.5–3.0 bar before restarting.",
          evidence_class: "MANUAL",
          source: "Manual p.42",
        },
        {
          text: "A similar fault on this machine was cleared by replacing the pressure sensor.",
          evidence_class: "HISTORY",
          source: "Incident #112, resolved",
        },
        {
          text: "A technician noted the filter may clog sooner in humid conditions.",
          evidence_class: "TECHNICIAN",
        },
        {
          text: "The pressure drop is likely caused by a worn pump seal.",
          evidence_class: "INFERENCE",
        },
      ],
    });
  }),
];
