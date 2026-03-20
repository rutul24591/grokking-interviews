# Edge cases that matter in real browsers

Browsers throttle timers in background tabs, and localStorage is not a distributed lock service.

Your design goal should be:
- “duplicate work is acceptable and safe” (idempotency),
- and “eventual convergence” (versioned snapshots).

