# What this example shows

This app demonstrates the end-to-end retry loop for transient failures:

- the API simulates repeated failures before success
- the client displays each exponential delay
- the sequence stops once the operation succeeds

The core lesson is that retries need spacing and bounded attempts, not tight loops.
