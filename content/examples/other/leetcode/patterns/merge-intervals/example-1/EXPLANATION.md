Example 1 is a production-style implementation demo for this Leetcode pattern.

Implements interval merging by sorting start times and coalescing overlaps — the canonical merge-intervals pattern.

It demonstrates:
- input is sorted before merging
- overlaps are merged by extending the current end
- non-overlapping intervals remain separate
