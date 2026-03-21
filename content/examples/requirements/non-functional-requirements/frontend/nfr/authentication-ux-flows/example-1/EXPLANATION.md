# Why this matters

Authentication is both a **security** problem and a **UX** problem.

Key points demonstrated here:
- Distinguish errors: `401` (not authenticated) vs `403` (authenticated but needs step-up).
- Keep step-up short-lived (this demo uses a 5-minute freshness window).
- Rate limit login attempts to reduce brute force and credential stuffing impact.

Production notes:
- Deliver step-up challenges out-of-band (TOTP/push), not via the same channel as the session.
- Add device risk signals, lockout policies, and privacy-safe telemetry.

