# Focus

Eventual consistency needs a way to reason about concurrency:

- Did update A happen **before** update B?
- Or are they **concurrent** (conflict)?

Vector clocks are one approach to detect concurrency and avoid “last write wins” surprises.

