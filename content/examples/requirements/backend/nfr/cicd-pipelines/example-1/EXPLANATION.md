# What this example covers

This end-to-end example shows a practical CI/CD shape for a Next.js service:

- **Build stamping**: the app exposes `/api/build` which reports a build identity (`gitSha`, `buildId`).
- **Quality gates**: the pipeline runner fails fast if lint/build fails.
- **Smoke tests**: a Node agent hits `/api/health` and `/api/smoke` to validate a deploy candidate.
- **Promotion semantics**: the pipeline only “promotes” if the smoke tests pass.

## Why this matters in real systems

CI/CD for backend services is mostly about *risk reduction*:

- Prevent shipping broken builds (lint/typecheck/build gates).
- Catch runtime misconfigurations quickly (health checks + smoke tests).
- Make rollbacks fast (immutable buildId, environment-specific configuration).

## Trade-offs

- **End-to-end smoke tests** are cheap but not sufficient; add integration tests for dependencies (DB, queue, cache).
- **Build stamping** is useful for incident response, but you must avoid leaking sensitive commit metadata in public APIs.
- **Pipelines as code** keep reviews auditable, but require careful secret management and least privilege.

