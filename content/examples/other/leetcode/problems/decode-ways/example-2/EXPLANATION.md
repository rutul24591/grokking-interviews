# Decode Ways — Example 2 (More Optimized: Bottom-up DP, O(1) Space)

LeetCode: https://leetcode.com/problems/decode-ways/

## Approach
Let `dp[i]` be ways to decode prefix `s[0..i)`.
We only need `dp[i-1]` and `dp[i-2]`, so keep two rolling values.

## Complexity (step-by-step)
1. Single pass `i=2..n`: O(n).
2. Constant-time 1-digit and 2-digit checks per index.

## Overall Complexity
- Time: O(n)
- Space: O(1)
