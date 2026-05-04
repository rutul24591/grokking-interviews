# Reverse Bits — Example 1 (Less Optimized: 32-bit Scan)

LeetCode: https://leetcode.com/problems/reverse-bits/

## Approach
Build `result` from left to right by repeatedly taking the least significant bit from `n`.

## Complexity (step-by-step)
1. Loop exactly 32 times: O(1).
2. Each iteration does O(1) shift/mask operations.

## Overall Complexity
- Time: O(1)
- Space: O(1)
