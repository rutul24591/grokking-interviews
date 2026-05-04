# Decode Ways — Example 1 (Less Optimized: Top-down DFS + Memo)

LeetCode: https://leetcode.com/problems/decode-ways/

## Approach
At index `i`, decode:
- one digit if `s[i] != '0'`
- two digits if `10 <= int(s[i..i+2)) <= 26`

Use DFS with memoization by index.

## Complexity (step-by-step)
1. There are `n` indices; memo ensures each `dfs(i)` computed once: O(n).
2. Each `dfs(i)` does O(1) parsing/checks and up to 2 calls.

## Overall Complexity
- Time: O(n)
- Space: O(n) memo + O(n) recursion stack worst-case
