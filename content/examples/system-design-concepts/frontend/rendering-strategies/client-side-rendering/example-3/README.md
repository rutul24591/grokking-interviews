# Example 3 — CSR Edge Cases: Typeahead Races + Cancellation

## What it shows
- Out-of-order responses and stale UI updates in CSR typeahead.
- Cancellation + request sequencing to ensure correctness.
- Bounded retry/backoff for transient 5xx failures.

## Run it (after copy-paste)
```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000` and type quickly (e.g., `re`, `rea`, `react`).

