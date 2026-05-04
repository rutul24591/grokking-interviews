# Coin Change — Example 2 (More Optimized: Bottom-up DP)

LeetCode: https://leetcode.com/problems/coin-change/

## Approach
Let `dp[a]` be the minimum coins to make amount `a`.
Transition: `dp[a] = min(dp[a], dp[a-c] + 1)` for each coin `c`.

## Complexity (step-by-step)
1. Outer loop over `a = 1..amount`: O(amount).
2. Inner loop over all coins: O(#coins).

## Overall Complexity
- Time: O(amount * #coins)
- Space: O(amount)
