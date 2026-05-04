# Number of 1 Bits — Example 1 (Less Optimized: 32-bit Scan)

LeetCode: https://leetcode.com/problems/number-of-1-bits/

## Approach
Scan each bit position from 0..31 and count how many are set.

## Complexity (step-by-step)
1. Loop exactly 32 times: O(1).
2. Each iteration shifts/masks and adds: O(1).

## Overall Complexity
- Time: O(1) (fixed 32 bits)
- Space: O(1)
