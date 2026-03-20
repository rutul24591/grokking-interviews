# Focus

Strict ordering can stall when a message is missing forever.

Common strategies:

- gap timeouts + dead-letter queues
- watermarks (process up to a point)
- compensating actions / rebuild from source of truth

This example models a gap timeout that moves a missing seq to a DLQ.

