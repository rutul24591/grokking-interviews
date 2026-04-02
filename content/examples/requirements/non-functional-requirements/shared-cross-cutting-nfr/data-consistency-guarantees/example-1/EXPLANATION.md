This is a runnable “Consistency Playground”:

- A primary record and two replicas with artificial lag.
- Writes go to primary immediately; replicas apply after delay.
- Reads support:
  - **eventual** (may hit a stale replica)
  - **read-your-writes** (stick to primary until replicas catch up for that session)
- A Node agent validates that read-your-writes eliminates stale reads after a write.

