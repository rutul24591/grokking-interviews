export const scenarios = [
  {
    "id": "healthy-fanout",
    "label": "Healthy fanout",
    "surface": "Document workspace",
    "status": "healthy",
    "signal": "3 tabs subscribed to one workspace",
    "budget": "28ms average broadcast lag",
    "fallback": "Visible-tab leader keeps writes serialized",
    "headline": "The current leader election is stable and broadcast lag is low enough for normal collaborative state fanout.",
    "decision": "Keep one visible leader for writes while all tabs stay read-capable.",
    "tasks": [
      "Preserve one authoritative writer.",
      "Replay only the most recent queued event on reconnect.",
      "Keep heartbeat telemetry available in the workspace footer."
    ]
  },
  {
    "id": "handoff",
    "label": "Leader handoff",
    "surface": "Foreground tab closes mid-edit",
    "status": "watch",
    "signal": "Leader exit with 2 queued sync events",
    "budget": "90ms handoff target",
    "fallback": "Next visible tab receives queued mutations",
    "headline": "Leader handoff is safe only if queued state transfers cleanly and the new leader avoids duplicate writes.",
    "decision": "Drain the old queue once and hand write authority to the next visible tab.",
    "tasks": [
      "Promote the next visible tab.",
      "Reapply unsent mutations once.",
      "Mark the handoff in diagnostics to catch duplicate writes."
    ]
  },
  {
    "id": "partitioned",
    "label": "Partitioned background tab",
    "surface": "Long-suspended browser tab",
    "status": "repair",
    "signal": "Heartbeat gap exceeds 12 seconds",
    "budget": "Read-only until snapshot sync",
    "fallback": "Stale tab can read after resync only",
    "headline": "A partitioned tab must stop accepting writes until it consumes a fresh snapshot from the active leader.",
    "decision": "Quarantine stale tabs and require a full state snapshot before they rejoin write coordination.",
    "tasks": [
      "Block writes from stale tabs.",
      "Require snapshot replay before unquarantine.",
      "Keep split-brain detection visible in operator diagnostics."
    ]
  }
] as const;

export const playbook = [
  "Use Broadcast Channel for coordination, not as the only source of truth.",
  "Elect one writer and quarantine tabs that miss heartbeats.",
  "Recover from handoff with a single replay of unsent mutations."
] as const;

export const recovery = [
  {
    "issue": "Leader lost",
    "action": "Promote the next visible tab and replay the queue once."
  },
  {
    "issue": "Split brain risk",
    "action": "Move stale tabs to read-only until snapshot sync completes."
  },
  {
    "issue": "Broadcast storm",
    "action": "Coalesce redundant events before they hit every tab."
  }
] as const;
