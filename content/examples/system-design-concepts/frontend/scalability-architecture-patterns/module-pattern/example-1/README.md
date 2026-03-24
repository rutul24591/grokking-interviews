## Module Pattern — Example 1: “Revealing module” for a todo feature

This example demonstrates the **Module Pattern** as an encapsulation boundary:
- private state lives inside a closure
- the module exposes a minimal public API (`add/toggle/remove/subscribe/getSnapshot`)
- React reads the module state via `useSyncExternalStore`

### Run
```bash
pnpm i
pnpm dev
```

Open `http://localhost:3000`.

