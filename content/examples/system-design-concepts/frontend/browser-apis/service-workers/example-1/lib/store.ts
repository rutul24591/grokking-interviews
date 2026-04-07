export const scenarios = [
  {
    "id": "healthy-cache",
    "label": "Healthy reading cache",
    "surface": "Offline article shell",
    "status": "healthy",
    "signal": "Stale-while-revalidate cache policy",
    "budget": "Waiting update prompt ready",
    "fallback": "Offline article shell confirmed",
    "headline": "The worker can cache the reading shell safely as long as versioning and update prompts stay visible to users.",
    "decision": "Keep the waiting update staged and refresh only after explicit consent.",
    "tasks": [
      "Version caches explicitly.",
      "Keep a visible waiting-update prompt.",
      "Retain a minimal offline article shell."
    ]
  },
  {
    "id": "waiting-update",
    "label": "New version waiting",
    "surface": "Release rollout window",
    "status": "watch",
    "signal": "Update found while users are active",
    "budget": "Current session should not be interrupted",
    "fallback": "Old shell still valid until consent",
    "headline": "A newly downloaded worker must not silently take over when it could disrupt an active session.",
    "decision": "Keep the new worker staged and request a controlled reload from the user.",
    "tasks": [
      "Prompt for refresh.",
      "Delay takeover until consent.",
      "Purge old caches only after the new version is active."
    ]
  },
  {
    "id": "stale-shell",
    "label": "Stale offline shell",
    "surface": "Old app shell served indefinitely",
    "status": "repair",
    "signal": "Cache eviction failed",
    "budget": "Old shell still intercepts routes",
    "fallback": "Controlled hard-refresh recovery",
    "headline": "A stale shell can trap users on obsolete code and must be treated as a release blocker.",
    "decision": "Purge invalid caches and force a controlled reload into the current shell.",
    "tasks": [
      "Invalidate old caches.",
      "Show stale-shell recovery messaging.",
      "Force a safe reload path."
    ]
  }
] as const;

export const playbook = [
  "Treat update activation as a user-facing event.",
  "Cache only the shell and essential offline routes intentionally.",
  "Keep explicit cache versioning and cleanup paths."
] as const;

export const recovery = [
  {
    "issue": "Waiting update",
    "action": "Prompt for refresh and activate only after user consent."
  },
  {
    "issue": "Stale shell",
    "action": "Purge old caches and recover through a controlled reload."
  },
  {
    "issue": "Offline gap",
    "action": "Ship a reliable offline route with clear limitations."
  }
] as const;
