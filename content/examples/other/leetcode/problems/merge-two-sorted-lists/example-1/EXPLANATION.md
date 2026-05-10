# Merge Two Sorted Lists — Example 1 (Less Optimized: Iterative Merge)

LeetCode: https://leetcode.com/problems/merge-two-sorted-lists/

## Approach
Use two pointers and iteratively pick the smaller head to append to the result list.

## Complexity (step-by-step)
1. Each node from both lists is visited once: O(n + m).
2. Each step does O(1) comparisons and pointer moves.

## Overall Complexity
- Time: O(n + m)
- Space: O(1) extra (relinks nodes)
