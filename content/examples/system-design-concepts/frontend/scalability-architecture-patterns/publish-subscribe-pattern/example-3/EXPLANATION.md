## Why at-least-once shows up everywhere

Once you add:
- durability (store messages)
- retries (handle subscriber downtime)

you almost always get **at-least-once delivery**.

That means consumers must handle duplicates safely:
- keep a bounded dedupe cache of processed ids
- make handlers idempotent
- record offsets/checkpoints when possible

