# Sum of Two Integers — Example 1 (Less Optimized: Bit-by-bit 32-step Add)

LeetCode: https://leetcode.com/problems/sum-of-two-integers/

## Approach
Simulate 32-bit addition by computing each bit of the result from bit `0..31`:
- `sumBit = aBit XOR bBit XOR carry`
- next `carry` comes from the majority of `(aBit, bBit, carry)`

This is deterministic 32 iterations regardless of input.

## Complexity (step-by-step)
1. Loop exactly 32 times: O(32).
2. Do O(1) bit operations per iteration.

## Overall Complexity
- Time: O(1) (32-bit fixed width)
- Space: O(1)
