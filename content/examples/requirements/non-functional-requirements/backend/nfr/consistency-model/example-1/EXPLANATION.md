# What this example covers

This example simulates a common real-world setup:

- **Leader** handles writes
- **Follower** serves reads
- Replication happens with **delay**, so follower reads can be **stale**

On top of that, it demonstrates a practical consistency level:

- **Session “read-your-writes”**: after a client writes, it should not read an older value.

In production you’d implement this via:

- sticky sessions to the leader,
- session tokens carrying `lastWrite` metadata,
- or client-side fallbacks (read from leader when follower is behind).

