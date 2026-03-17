# Migration Plan

1. Add new columns (backward compatible).
2. Deploy v2 code gated by flag.
3. Enable flag for 5% traffic.
4. Roll back by disabling flag.