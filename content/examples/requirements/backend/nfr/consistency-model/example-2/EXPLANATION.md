# Focus

In the context of Consistency Model (consistency, model), this example provides a focused implementation of the concept below.

Quorum systems (e.g., Dynamo-style) often use:

- replication factor **N**
- write quorum **W**
- read quorum **R**

When **R + W > N**, reads are guaranteed to intersect with the latest successful write (under strong assumptions).

This example simulates those intersections and highlights failure/staleness trade-offs.

