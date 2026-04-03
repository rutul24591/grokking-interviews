export const accessibilityChecklist = [
  "Every control exposes a visible label and a programmatic name.",
  "Inline errors are linked through aria-describedby and included in the error summary.",
  "The first invalid control receives focus after submit or step reveal.",
  "Success and error summaries are announced through a live region.",
  "Custom widgets keep keyboard order and role/state parity."
];

export const accessibleFields = [
  { id: "ticketTitle", label: "Ticket title", description: "Summarize the request in 80 characters.", step: "Basics" },
  { id: "severity", label: "Severity", description: "Choose the highest impacted user path.", step: "Basics" },
  { id: "details", label: "Details", description: "Explain what the operator must know before triage.", step: "Context" },
  { id: "contact", label: "Responder contact", description: "Provide the contact for incident follow-up.", step: "Context" }
];

export const accessibilityScenarios = [
  "Inline validation while the user remains on the same field.",
  "Submit-time focus movement to the first invalid control.",
  "Hidden step reveal before focusing an invalid control.",
  "Live region summary for screen reader users."
];
