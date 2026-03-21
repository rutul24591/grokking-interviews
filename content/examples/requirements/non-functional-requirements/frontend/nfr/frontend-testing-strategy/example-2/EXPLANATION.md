# Contract tests without “heavy” infrastructure

For frontends, contract tests are often just **schemas**:

- UI validates API responses at runtime (fail fast + capture telemetry).
- API validates its own outputs in tests (and optionally validates “golden” historical payloads).

This example demonstrates how **additive** changes are usually safe, while type changes or shape changes are breaking.

