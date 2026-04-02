# Focus

In the context of Scalability Strategy (scalability, strategy), this example provides a focused implementation of the concept below.

One common scaling policy:

- pick a target utilization (e.g. CPU 60%)
- estimate load per instance
- scale instances to keep utilization near the target with headroom

This example computes a recommended instance count from RPS and per-instance capacity.

