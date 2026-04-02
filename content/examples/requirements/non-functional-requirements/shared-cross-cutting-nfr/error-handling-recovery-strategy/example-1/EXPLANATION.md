This is a runnable “Resilient Write Path” demo for **error handling & recovery**:

- A flaky dependency (`/api/dependency`) that intermittently fails.
- A write API (`/api/publish`) that uses:
  - **Idempotency keys** (safe retries, no duplicate side effects)
  - **Retry with exponential backoff + jitter**
  - A **circuit breaker** to stop hammering a failing dependency
- A UI to exercise behaviors and inspect breaker + side-effect state.
- A Node agent that validates idempotency under repeated requests.

