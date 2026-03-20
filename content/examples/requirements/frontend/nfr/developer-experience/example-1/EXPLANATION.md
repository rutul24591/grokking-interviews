Developer experience improves when failures are:
- **fast** (catch misconfig at startup),
- **actionable** (clear errors with paths),
- **safe** (secrets are redacted in logs and UI),
- and **consistent** (one schema shared across app).

This demo validates config via Zod and returns redacted echo + structured errors suitable for rendering.

