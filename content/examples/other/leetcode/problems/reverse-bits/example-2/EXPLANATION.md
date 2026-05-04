# Reverse Bits — Example 2 (More Optimized: Bit Swaps with Masks)

LeetCode: https://leetcode.com/problems/reverse-bits/

## Approach
Reverse bits by swapping progressively larger blocks using bit masks:
1-bit swaps, then 2-bit, 4-bit, 8-bit, and 16-bit.

## Complexity (step-by-step)
1. Perform a fixed sequence of 5 mask+shift operations: O(1).

## Overall Complexity
- Time: O(1)
- Space: O(1)
