## Pub/Sub vs Observer

- **Observer**: one subject + many observers; coupling is usually direct (you hold the subject reference).
- **Pub/Sub**: decouples publishers and subscribers via a broker/topic namespace.

In a frontend architecture, pub/sub is useful for:
- cross-tab coordination (auth/session, feature flags, “log out everywhere”)
- decoupling feature modules (toasts, telemetry, navigation)
- integrating micro-frontends (shared event contract)

This example uses `BroadcastChannel` as the broker:
- delivery is best-effort, in-memory
- scope is same-origin tabs
- great for “shared UI signals” but not a durability mechanism

