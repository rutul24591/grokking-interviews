# Container With Most Water — Example 1 (Less Optimized: Brute Force)

LeetCode: https://leetcode.com/problems/container-with-most-water/

## Approach
Check every pair of lines `(i, j)` and compute the area `min(h[i], h[j]) * (j-i)`.

## Complexity (step-by-step)
1. Two nested loops over all pairs: O(n^2).
2. Each area computation is O(1).

## Overall Complexity
- Time: O(n^2)
- Space: O(1)
