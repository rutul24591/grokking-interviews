export const scenarios = [
  {
    "id": "nearby-store",
    "label": "Nearby store search",
    "surface": "Store locator",
    "status": "healthy",
    "signal": "Location granted with 35m accuracy",
    "budget": "Fresh within 15 seconds",
    "fallback": "Manual postcode stays available",
    "headline": "Coarse location is good enough for store discovery and does not require excessive precision.",
    "decision": "Keep the experience coarse by default and avoid unnecessary high-accuracy requests.",
    "tasks": [
      "Default to coarse location.",
      "Keep manual postcode fallback available.",
      "Explain why location improves ranking."
    ]
  },
  {
    "id": "courier-route",
    "label": "Courier route refresh",
    "surface": "Active delivery tracking",
    "status": "watch",
    "signal": "High-accuracy mode enabled",
    "budget": "Fresh within 20 seconds",
    "fallback": "Route freezes when stale",
    "headline": "High-accuracy updates are justified only while the live route view is foregrounded and should stop when stale.",
    "decision": "Scope precision to the active route view and pause updates when freshness slips.",
    "tasks": [
      "Downgrade to coarse mode off-screen.",
      "Block stale route actions.",
      "Keep manual address recovery available."
    ]
  },
  {
    "id": "denied-location",
    "label": "Permission denied",
    "surface": "Location-gated checkout",
    "status": "repair",
    "signal": "Browser denied location permission",
    "budget": "Manual address required",
    "fallback": "Last known location is hidden",
    "headline": "A denied geolocation prompt cannot dead-end the flow; the app needs a manual route to continue.",
    "decision": "Switch immediately to manual address entry and stop prompting inside the blocked session.",
    "tasks": [
      "Show manual address form.",
      "Explain the benefit of location without nagging.",
      "Hide stale cached coordinates."
    ]
  }
] as const;

export const playbook = [
  "Ask for geolocation only at the point of need.",
  "Prefer coarse location unless precision materially changes the outcome.",
  "Treat denied or stale location as a first-class fallback state."
] as const;

export const recovery = [
  {
    "issue": "Permission denied",
    "action": "Route users to manual location entry without repeated prompts."
  },
  {
    "issue": "Stale coordinates",
    "action": "Block precision-dependent actions until freshness returns."
  },
  {
    "issue": "High battery cost",
    "action": "Drop back to coarse updates when high accuracy is not required."
  }
] as const;
