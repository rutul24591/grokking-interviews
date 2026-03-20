Example 3 covers a classic SSR edge case: **hydration mismatches**.

What happens:
- The server renders HTML for a client component using non-deterministic values (time / randomness).
- During hydration, the client renders a different value → React warns about a mismatch.

What this example shows:
- A deliberately buggy client component (`BuggyClock`) that causes a mismatch.
- A fixed version (`FixedClock`) that renders stable HTML and updates after hydration.

