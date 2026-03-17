Read replicas improve read scale but introduce replication lag.
The primary handles writes; replicas serve reads asynchronously.
The demo shows a read-after-write returning stale data.
Systems often route recent reads to primary to preserve consistency.
