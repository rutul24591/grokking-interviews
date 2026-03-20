# What this example covers

Multi-region replication often uses **async** replication for performance and availability.

That means:

- remote reads can be **stale**
- you need explicit consistency modes (local, session, strong)

This example simulates two regions with replication lag and a practical technique:

- after write, return a token with `requiredVersion`
- if a client reads from another region with `consistency=session`, the server returns `409 stale_read` until the replica catches up

