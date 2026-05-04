# Merge Intervals — Example 1 (Less Optimized: Sort + Merge)

LeetCode: https://leetcode.com/problems/merge-intervals/

## Approach
Sort intervals by start time, then iterate and merge overlapping intervals into an output list.

## Complexity (step-by-step)
1. Sort intervals: O(n log n).
2. Single pass merge: O(n).

## Overall Complexity
- Time: O(n log n)
- Space: O(n) output (and sort overhead)
