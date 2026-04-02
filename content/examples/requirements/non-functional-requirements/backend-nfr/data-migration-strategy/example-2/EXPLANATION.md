# Focus

Online migrations typically require a backfill that is:

- checkpointed (resume after crash)
- rate-limited (protect primary traffic)
- idempotent (safe retries)

This example models a checkpointed backfill loop with a batch cursor.

