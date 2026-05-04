# Climbing Stairs — Example 1 (Less Optimized: Naive Recursion)

LeetCode: https://leetcode.com/problems/climbing-stairs/

## Approach
Direct recursion following the recurrence:
`f(n) = f(n-1) + f(n-2)`.

## Complexity (step-by-step)
1. Each call branches into two calls (except base cases).
2. Many subproblems are recomputed repeatedly.

## Overall Complexity
- Time: O(2^n) (exponential)
- Space: O(n) recursion stack
