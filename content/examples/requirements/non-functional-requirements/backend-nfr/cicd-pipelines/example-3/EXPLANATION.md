# Focus

Pipelines interact with deployment systems that must support:

- **Idempotency**: retrying `promote(buildId)` should not create new state.
- **Rollback**: a build can be “un-promoted” safely.
- **Concurrency**: two pipeline runs must not race and corrupt rollout state.

This example models those concerns using a tiny in-memory state machine.

