# What this example covers

Disaster recovery is about meeting **RTO** (time to restore service) and **RPO** (data loss window).

This example simulates:

- a primary “region” that accepts writes
- periodic **snapshots** (backups)
- a region **outage**
- restoring from a snapshot (showing **data loss after the snapshot**)

In production, DR is a system:

- backups/snapshots + PITR
- replication (async/sync, multi-region)
- runbooks + automation
- regular game days and restore verification

