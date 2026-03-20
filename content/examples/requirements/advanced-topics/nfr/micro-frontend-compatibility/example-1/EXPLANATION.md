This is a runnable micro-frontend compatibility demo built around a realistic constraint:

- The **host shell** (Next.js app) upgrades over time.
- **Remote micro-frontends** may lag behind (older contract versions).
- You need a **versioned contract** + compatibility shims + contract tests.

This demo uses a lightweight, production-friendly approach:
- Remotes ship as **static JS** that defines a **Custom Element** (`<mf-profile>`).
- The host exposes a versioned contract on `window.__MF_HOST__`.
- Remotes emit typed events back to the host (navigation, telemetry, errors).
- The host can switch between `profile-v1` and `profile-v2` at runtime to simulate rolling upgrades.

This mirrors real org patterns when Module Federation is overkill or when you need strict isolation:
- Custom elements + runtime loader
- Contract versioning + compatibility matrix
- Contract tests in CI

