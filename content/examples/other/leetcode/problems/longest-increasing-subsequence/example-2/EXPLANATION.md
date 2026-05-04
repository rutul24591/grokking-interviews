# Longest Increasing Subsequence — Example 2 (More Optimized: Patience + Binary Search)

LeetCode: https://leetcode.com/problems/longest-increasing-subsequence/

## Approach
Maintain `tails[len]` as the smallest possible tail value of an increasing subsequence of length `len+1`.
For each number, binary-search where it fits in `tails` and replace/extend.

## Complexity (step-by-step)
1. Iterate each element once: O(n).
2. Binary search in `tails` (size ≤ n) per element: O(log n).

## Overall Complexity
- Time: O(n log n)
- Space: O(n)
