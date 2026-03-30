# PWA Example 3 — Update strategy trade-offs

This example demonstrates a safe mental model for SW updates:

- A new SW is downloaded and installed, then typically sits in **waiting**.
- The app decides when to activate it (often after user confirmation, or when the app is idle).
- After activation, clients see `controllerchange` and can reload into the new version.

Trade-offs to discuss in interviews:
- **skipWaiting immediately**: faster fixes, but can break in-flight sessions or multi-tab consistency.
- **controlled activation**: slower rollout, but safer UX and easier incident handling.
- **versioned caches**: prevents serving mixed assets; still requires discipline for invalidation and app shell safety.

