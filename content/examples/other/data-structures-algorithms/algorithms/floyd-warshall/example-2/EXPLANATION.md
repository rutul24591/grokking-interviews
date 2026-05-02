Example 2 focuses on a follow-up/variant that interviewers commonly ask next.

Shows how to detect negative cycles by inspecting the diagonal after running Floyd–Warshall.

It demonstrates:
- dist[i][i] < 0 implies a negative cycle reachable from i
- results are not meaningful if negative cycles exist
- production code should surface cycle presence clearly
