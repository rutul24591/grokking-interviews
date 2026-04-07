export const scenarios = [
  {
    "id": "urgent-alert",
    "label": "Urgent operational alert",
    "surface": "Deploy monitoring",
    "status": "healthy",
    "signal": "Permission granted for urgent alerts",
    "budget": "Native alert with inbox mirror",
    "fallback": "Action buttons stay mirrored in-app",
    "headline": "Urgent operational alerts can use native notifications because the user has already seen their value.",
    "decision": "Keep urgent notifications native while mirroring every delivery into the in-app inbox.",
    "tasks": [
      "Mirror every native alert into the inbox.",
      "Keep action affordances consistent across surfaces.",
      "Avoid digesting urgent alerts."
    ]
  },
  {
    "id": "digest-lane",
    "label": "Digest-worthy activity",
    "surface": "Social activity summary",
    "status": "watch",
    "signal": "Permission granted but not urgent",
    "budget": "Digest or inbox route preferred",
    "fallback": "Quiet-hours policy respected",
    "headline": "Non-urgent notifications should not consume the native notification channel by default.",
    "decision": "Route non-urgent events to digest or inbox and respect quiet-hours preferences.",
    "tasks": [
      "Keep quiet-hours enforced.",
      "Use digest batching for non-urgent items.",
      "Reserve native notifications for urgent lanes."
    ]
  },
  {
    "id": "permission-denied",
    "label": "Permission denied",
    "surface": "Browser prompt previously rejected",
    "status": "repair",
    "signal": "Notification permission denied",
    "budget": "Inbox-only fallback",
    "fallback": "No re-prompt in blocked session",
    "headline": "A denied notification prompt must lead to a durable inbox-only fallback rather than repeated prompting.",
    "decision": "Stop prompting and rely on the in-app notification center for all delivery.",
    "tasks": [
      "Suppress repeat prompts.",
      "Keep the inbox visible and reliable.",
      "Document quiet-delivery settings clearly."
    ]
  }
] as const;

export const playbook = [
  "Request notification permission only after the user understands the value.",
  "Separate urgent alerts from digest-worthy events.",
  "Treat denied permission as a durable fallback state."
] as const;

export const recovery = [
  {
    "issue": "Denied permission",
    "action": "Stop prompting and route all delivery through the in-app inbox."
  },
  {
    "issue": "Noisy channel",
    "action": "Move non-urgent events into digest or inbox flows."
  },
  {
    "issue": "Missing inbox mirror",
    "action": "Mirror native notifications into the application history."
  }
] as const;
