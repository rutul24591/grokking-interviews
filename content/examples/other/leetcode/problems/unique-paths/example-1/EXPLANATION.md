# Unique Paths — Example 1 (Less Optimized: 2D DP Table)

LeetCode: https://leetcode.com/problems/unique-paths/

## Approach
Let `dp[r][c]` be the number of ways to reach cell `(r,c)`.
Transition: `dp[r][c] = dp[r-1][c] + dp[r][c-1]`.

## Complexity (step-by-step)
1. Fill an `m*n` table once: O(mn).
2. Each cell is O(1) work.

## Overall Complexity
- Time: O(mn)
- Space: O(mn)
