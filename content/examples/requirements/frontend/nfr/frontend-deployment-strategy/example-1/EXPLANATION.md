Frontend deployments need controlled rollout and fast rollback.

This example demonstrates:
- deterministic ring assignment (stable vs canary),
- ring→build mapping,
- and a “salt” that can be changed to reshuffle assignments if needed (use carefully).

Production notes:
- Keep ring assignment stable for a user to reduce confusion.
- Support instant kill-switch/rollback at the routing/config layer.

