# Coin Change — Example 1 (Less Optimized: Top-down DFS + Memo)

LeetCode: https://leetcode.com/problems/coin-change/

## Approach
Try subtracting each coin and recursively solve the remainder. Memoize results for `remaining` to avoid repeated work.

## Complexity (step-by-step)
1. There are at most `amount + 1` distinct subproblems (`remaining = 0..amount`).
2. For each subproblem, we try each coin: O(#coins).

## Overall Complexity
- Time: O(amount * #coins)
- Space: O(amount) for memo + recursion stack
