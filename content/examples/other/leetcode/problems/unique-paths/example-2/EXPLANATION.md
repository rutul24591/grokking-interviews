# Unique Paths — Example 2 (More Optimized: 1D DP)

LeetCode: https://leetcode.com/problems/unique-paths/

## Approach
We only need the previous row to compute the current row, so compress `dp[r][c]` into a 1D array:
`dp[c] = dp[c] + dp[c-1]`.

## Complexity (step-by-step)
1. Still fill `m*n` states: O(mn).
2. Each state update is O(1).

## Overall Complexity
- Time: O(mn)
- Space: O(n)
