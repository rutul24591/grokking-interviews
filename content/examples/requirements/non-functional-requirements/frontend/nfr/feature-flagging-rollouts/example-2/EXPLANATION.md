Deterministic bucketing is the core primitive behind percentage rollouts. This demo hashes `(salt, userId)` into a stable value in `[0,1)` and asserts stability.

