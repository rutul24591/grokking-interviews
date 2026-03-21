# Focus

CI/CD pipelines almost always boil down to a decision:

> Is this build safe to promote to the next stage?

This example demonstrates:

- **Typed gate inputs** (coverage, error budget, migration flags).
- **Deterministic decisions** (the same input always yields the same promote/hold decision).
- **Explicit reasons** (humans need to know why a pipeline blocked a release).

