# Focus

The fastest retention mechanism for large tables is often:

- partition by time (day/week/month)
- drop old partitions (metadata operation)

This example generates partition keys and decides which partitions are eligible for deletion.

