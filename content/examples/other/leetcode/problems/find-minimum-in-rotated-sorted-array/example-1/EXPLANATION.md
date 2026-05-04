# Find Minimum in Rotated Sorted Array — Example 1 (Less Optimized: Linear Scan)

LeetCode: https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/

## Approach
Scan all elements and keep the smallest value.

## Complexity (step-by-step)
1. Visit each element once (n steps): O(n).
2. Constant-time `min` update per step: O(1).

## Overall Complexity
- Time: O(n)
- Space: O(1)
