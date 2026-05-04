# Search in Rotated Sorted Array — Example 2 (More Optimized: Modified Binary Search)

LeetCode: https://leetcode.com/problems/search-in-rotated-sorted-array/

## Approach
At any `mid`, one side (left..mid or mid..right) is sorted.
Use that to decide whether `target` lies in the sorted side or the other side, then discard half.

## Complexity (step-by-step)
1. Each iteration discards half the interval: O(log n) iterations.
2. Constant-time comparisons and pointer updates per iteration: O(1).

## Overall Complexity
- Time: O(log n)
- Space: O(1)
