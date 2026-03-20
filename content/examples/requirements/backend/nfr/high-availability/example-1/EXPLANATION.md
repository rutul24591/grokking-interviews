# What this example covers

High availability is about minimizing downtime during failures.

This example simulates:

- a two-node active/passive cluster (`A` and `B`)
- a leader that accepts writes
- failover via an election endpoint
- synchronous “replication” to keep state aligned

In production you’d use:

- managed DB replication or consensus systems (Raft/Paxos)
- health checks + automated failover (with caution)
- split-brain prevention (quorum, fencing, leader leases)

