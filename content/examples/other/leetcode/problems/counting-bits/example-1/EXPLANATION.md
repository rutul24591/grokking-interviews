# Counting Bits — Example 1 (Less Optimized: Count Bits per Number)

LeetCode: https://leetcode.com/problems/counting-bits/

## Approach
For each number `i` from `0..n`, scan all 32 bit positions and count how many are set.

## Complexity (step-by-step)
1. Outer loop over `i = 0..n`: O(n).
2. Inner loop over 32 bits per `i`: O(32) = O(1).

## Overall Complexity
- Time: O(n)
- Space: O(n) for the output array
