# Non-overlapping Intervals — Example 2 (More Optimized: Sort by End, Keep Maximum Non-overlaps)

LeetCode: https://leetcode.com/problems/non-overlapping-intervals/

## Approach
Equivalent view: keep the maximum number of non-overlapping intervals.
Classic greedy: sort by end time and pick intervals whose start is ≥ previous picked end.
Removals = total - kept.

## Complexity (step-by-step)
1. Sort by end: O(n log n).
2. Single pass selecting intervals: O(n).

## Overall Complexity
- Time: O(n log n)
- Space: O(1) extra
