# Longest Common Subsequence — Example 2 (More Optimized: Bottom-up DP)

LeetCode: https://leetcode.com/problems/longest-common-subsequence/

## Approach
Let `dp[i][j]` be LCS length for `text1[0..i)` and `text2[0..j)`.

Transition:
- If chars match: `dp[i][j] = dp[i-1][j-1] + 1`
- Else: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`

## Complexity (step-by-step)
1. Fill a `(m+1) x (n+1)` table: O(mn).
2. Each cell computation is O(1).

## Overall Complexity
- Time: O(mn)
- Space: O(mn)
