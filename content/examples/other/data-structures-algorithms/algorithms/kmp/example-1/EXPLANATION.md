Example 1 is a production-style implementation demo for this algorithm.

Implements KMP substring search using the LPS (prefix function) table and scans a log string.

It demonstrates:
- LPS computation is correct for repeated prefixes
- search runs in O(n+m) time
- finds the first match index (or -1 on miss)
