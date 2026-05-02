Example 3 focuses on edge cases and correctness checks you should validate.

Covers missing edges (Infinity) and small graphs so consumers treat unreachable pairs explicitly.

It demonstrates:
- missing edges remain Infinity
- dist[i][i] is zero when no negative cycles exist
- empty edge sets behave safely
