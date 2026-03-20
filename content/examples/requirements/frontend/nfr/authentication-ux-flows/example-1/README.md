# Example 1 — Auth UX Simulator (login + step-up)

## What it shows
- A common UX and security pattern: **basic login** for low-risk actions and **step-up authentication** for sensitive actions.
- Clear server error states (`401` vs `403 step_up_required`) that map cleanly to UX.

## Run
```bash
pnpm install
pnpm dev
```

Agent:
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Demo credentials
- `staff@example.com` / `password12345`

