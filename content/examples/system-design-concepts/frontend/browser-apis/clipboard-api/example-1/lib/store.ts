export const scenarios = [
  {
    "id": "plain-copy",
    "label": "Plain-text copy",
    "surface": "Article summary card",
    "status": "healthy",
    "signal": "Write permission already granted",
    "budget": "Inline copy success message",
    "fallback": "Manual select-and-copy stays available",
    "headline": "Standard copy actions can remain inline when the payload is low risk and permission is already granted.",
    "decision": "Keep the flow simple while still preserving a manual fallback path.",
    "tasks": [
      "Show visible success confirmation.",
      "Preserve manual selection fallback.",
      "Log only redaction-safe analytics."
    ]
  },
  {
    "id": "secret-copy",
    "label": "Sensitive value copy",
    "surface": "API token drawer",
    "status": "watch",
    "signal": "Prompt required before write",
    "budget": "Confirmation step before copy",
    "fallback": "Masked preview with timeout",
    "headline": "Sensitive clipboard writes need explicit intent and a short-lived preview to avoid accidental disclosure.",
    "decision": "Gate the write behind confirmation and keep the value masked outside the explicit copy step.",
    "tasks": [
      "Ask for explicit confirmation.",
      "Mask the preview before and after write.",
      "Avoid background clipboard assumptions."
    ]
  },
  {
    "id": "unsupported",
    "label": "Unsupported clipboard runtime",
    "surface": "Legacy browser flow",
    "status": "repair",
    "signal": "Clipboard API unavailable",
    "budget": "Manual-only fallback",
    "fallback": "Advanced paste disabled",
    "headline": "Unsupported browsers need a manual path instead of a silent copy failure.",
    "decision": "Disable advanced clipboard features and present selection-based fallback instructions.",
    "tasks": [
      "Show manual instructions.",
      "Disable unsafe paste features.",
      "Keep failure messaging visible."
    ]
  }
] as const;

export const playbook = [
  "Treat clipboard access as explicit user intent.",
  "Add confirmation and masking for sensitive clipboard writes.",
  "Expose a manual fallback when the API is unavailable or denied."
] as const;

export const recovery = [
  {
    "issue": "Permission denied",
    "action": "Explain the denial and switch to manual copy instructions."
  },
  {
    "issue": "Sensitive copy",
    "action": "Keep payloads masked except during confirmed copy."
  },
  {
    "issue": "Unsupported API",
    "action": "Disable advanced clipboard affordances and keep a safe fallback."
  }
] as const;
