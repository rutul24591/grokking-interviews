Example 1 is a full list-management UI where memoization has a clear payoff.

It demonstrates:
- memoized filtered data and aggregate metrics
- `React.memo` around row components
- a parent render signal plus visible row render counters that prove unchanged rows can remain stable
