# Counting Bits — Example 2 (More Optimized: DP Using i>>1)

LeetCode: https://leetcode.com/problems/counting-bits/

## Approach
Use the recurrence:
`bits[i] = bits[i >> 1] + (i & 1)`

Because shifting right by 1 removes the least significant bit, and `(i & 1)` tells whether that bit was 1.

## Complexity (step-by-step)
1. One pass `i=1..n`: O(n).
2. O(1) DP lookup and arithmetic each step.

## Overall Complexity
- Time: O(n)
- Space: O(n) for the output array
