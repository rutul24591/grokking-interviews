# Container With Most Water — Example 2 (More Optimized: Two Pointers)

LeetCode: https://leetcode.com/problems/container-with-most-water/

## Approach
Start with the widest container (`left=0`, `right=n-1`). The area is limited by the shorter wall.
Move the pointer at the shorter wall inward, because moving the taller one cannot improve the limiting height.

## Complexity (step-by-step)
1. Each loop moves `left` or `right` inward at least one step: at most `n-1` iterations.
2. Constant-time area computation per iteration: O(1).

## Overall Complexity
- Time: O(n)
- Space: O(1)
