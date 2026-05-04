# Number of 1 Bits — Example 2 (More Optimized: Kernighan’s Trick)

LeetCode: https://leetcode.com/problems/number-of-1-bits/

## Approach
Repeatedly clear the lowest set bit using `n = n & (n-1)` until `n` becomes 0.

## Complexity (step-by-step)
1. Each loop iteration clears one set bit.
2. Number of iterations equals `popcount(n)` (k).

## Overall Complexity
- Time: O(k) where k = number of 1 bits (≤ 32)
- Space: O(1)
