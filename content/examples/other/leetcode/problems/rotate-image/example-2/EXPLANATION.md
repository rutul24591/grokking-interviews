# Rotate Image — Example 2 (More Optimized: Transpose + Reverse In-place)

LeetCode: https://leetcode.com/problems/rotate-image/

## Approach
90° clockwise rotation in-place:
1) transpose the matrix (swap across diagonal)
2) reverse each row

## Complexity (step-by-step)
1. Transpose visits ~n(n-1)/2 pairs: O(n^2).
2. Reverse each row: O(n^2) total swaps.

## Overall Complexity
- Time: O(n^2)
- Space: O(1)
