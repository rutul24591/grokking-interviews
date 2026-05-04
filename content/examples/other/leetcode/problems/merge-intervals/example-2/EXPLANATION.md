# Merge Intervals — Example 2 (More Optimized: Sort + Merge, Minimal Branching)

LeetCode: https://leetcode.com/problems/merge-intervals/

## Approach
Same as Example 1: sorting by start is the key step; then merge in one pass.

## Complexity (step-by-step)
1. Sort: O(n log n).
2. One pass merge: O(n).

## Overall Complexity
- Time: O(n log n)
- Space: O(n) output
