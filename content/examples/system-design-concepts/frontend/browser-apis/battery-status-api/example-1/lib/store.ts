export const scenarios = [
  {
    "id": "charging-desk",
    "label": "Charging desk session",
    "surface": "Research dashboard",
    "status": "healthy",
    "signal": "91% battery on charger",
    "budget": "15s refresh cadence",
    "fallback": "Full preview lane stays enabled",
    "headline": "The app can keep its richer preview lane because the device is charging and battery pressure is low.",
    "decision": "Keep adaptive logic visible but do not downshift the experience yet.",
    "tasks": [
      "Continue background polling for saved searches.",
      "Keep animated previews enabled.",
      "Record battery-safe defaults for unplug transitions."
    ]
  },
  {
    "id": "travel-low",
    "label": "Travel low-battery session",
    "surface": "Search results on 4G",
    "status": "watch",
    "signal": "14% battery with discharging trend",
    "budget": "60s refresh cadence",
    "fallback": "Static cards replace live preview thumbnails",
    "headline": "The current feature set is too expensive for a low-battery mobile session and needs an explicit power-saving downgrade.",
    "decision": "Reduce polling and switch to static rendering before battery drain becomes user-visible.",
    "tasks": [
      "Turn off non-essential motion.",
      "Batch background refresh into a coarse interval.",
      "Keep the main search flow intact while secondary panels degrade."
    ]
  },
  {
    "id": "signal-blocked",
    "label": "Battery signal unavailable",
    "surface": "Shared browser profile",
    "status": "repair",
    "signal": "Battery signal blocked or unsupported",
    "budget": "Generic heuristics only",
    "fallback": "Battery-specific UI is hidden",
    "headline": "The browser cannot be trusted to expose battery state, so battery-aware messaging must disappear entirely.",
    "decision": "Fallback to generic low-cost defaults and stop claiming battery-specific adaptation.",
    "tasks": [
      "Hide battery-specific copy.",
      "Use conservative refresh intervals.",
      "Keep the recovery path documented in product telemetry."
    ]
  }
] as const;

export const playbook = [
  "Treat battery state as advisory and optional.",
  "Downgrade polling and motion before touching core task completion.",
  "Remove battery-specific UX entirely when the API is unavailable."
] as const;

export const recovery = [
  {
    "issue": "Battery pressure",
    "action": "Switch to coarse refresh and static previews."
  },
  {
    "issue": "Missing battery signal",
    "action": "Apply generic low-cost defaults and suppress battery copy."
  },
  {
    "issue": "Unexpected drain",
    "action": "Add telemetry and manual override controls for battery-saving mode."
  }
] as const;
