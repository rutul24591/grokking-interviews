# Longest Common Subsequence — Example 1 (Less Optimized: Naive Recursion)

LeetCode: https://leetcode.com/problems/longest-common-subsequence/

## Approach
Recursive definition:
- If chars match, take 1 + LCS of next indices.
- Else, take max of skipping one char from either string.

## Complexity (step-by-step)
1. Each mismatch branches into two recursive calls.
2. Many overlapping subproblems are recomputed.

## Overall Complexity
- Time: O(2^(m+n)) (exponential, worst-case)
- Space: O(m+n) recursion stack
