# Word Break Problem — Example 2 (More Optimized: Bottom-up DP)

LeetCode: https://leetcode.com/problems/word-break/

## Approach
Let `dp[i]` mean `s[0..i)` can be segmented.
For each `i`, find a `j < i` where `dp[j]` is true and `s[j..i)` is in the dictionary.

## Complexity (step-by-step)
1. Outer loop `i = 1..n`: O(n).
2. Inner loop over split point `j`: total O(n^2) checks.

## Overall Complexity
- Time: O(n^2) dictionary lookups (exact depends on substring cost)
- Space: O(n)
