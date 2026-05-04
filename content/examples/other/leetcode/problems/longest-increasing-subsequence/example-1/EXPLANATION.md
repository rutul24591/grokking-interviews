# Longest Increasing Subsequence — Example 1 (Less Optimized: O(n^2) DP)

LeetCode: https://leetcode.com/problems/longest-increasing-subsequence/

## Approach
Let `dp[i]` be the LIS length ending at index `i`.
Transition: `dp[i] = 1 + max(dp[j])` for all `j < i` where `nums[j] < nums[i]`.

## Complexity (step-by-step)
1. Outer loop over `i`: O(n).
2. Inner loop over `j < i`: total O(n^2) comparisons.
3. Constant-time updates to `dp[i]`: O(1).

## Overall Complexity
- Time: O(n^2)
- Space: O(n)
