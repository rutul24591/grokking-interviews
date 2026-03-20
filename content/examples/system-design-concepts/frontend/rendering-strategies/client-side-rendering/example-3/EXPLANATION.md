Example 3 covers CSR edge cases around **request races**:

Scenario:
- A typeahead search box that hits an API on each query change.

Problems:
- Out-of-order responses can render stale suggestions.
- Retries can amplify traffic or worsen UX if not bounded.
- Without cancellation, you waste bandwidth and CPU.

What this example implements:
- AbortController cancellation per query
- “latest request wins” guard (sequence id)
- bounded retry with exponential backoff for transient server errors
- a tiny client-side cache to avoid re-fetching the same query

