# Sum of Two Integers — Example 2 (More Optimized: XOR + Carry Loop)

LeetCode: https://leetcode.com/problems/sum-of-two-integers/

## Approach
Use the identity:
- `a XOR b` adds without carrying
- `(a AND b) << 1` computes carry bits

Repeat until no carry remains.

## Complexity (step-by-step)
1. Each loop removes carry bits progressively; for fixed 32-bit integers this is bounded by 32 iterations.
2. Each iteration does O(1) bit operations.

## Overall Complexity
- Time: O(1) (bounded by word size)
- Space: O(1)
