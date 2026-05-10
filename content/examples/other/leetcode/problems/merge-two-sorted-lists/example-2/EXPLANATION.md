# Merge Two Sorted Lists — Example 2 (More Optimized: Recursive Merge)

LeetCode: https://leetcode.com/problems/merge-two-sorted-lists/

## Approach
Recursive definition:
- pick the smaller head as the result head
- recursively merge the remainder

## Complexity (step-by-step)
1. Each node participates in exactly one recursive call: O(n + m).
2. Constant-time work per call.

## Overall Complexity
- Time: O(n + m)
- Space: O(n + m) recursion stack in worst case
