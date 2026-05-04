# Maximum Product Subarray — Example 2 (More Optimized: Track Max/Min DP)

LeetCode: https://leetcode.com/problems/maximum-product-subarray/

## Approach
Dynamic programming with two running values:
- `currentMax`: maximum product of a subarray ending at current index
- `currentMin`: minimum product of a subarray ending at current index (needed because a negative times negative becomes positive)

For each value `x`, the best/worst product ending here is one of:
`x`, `x * previousMax`, `x * previousMin`.

## Complexity (step-by-step)
1. For each element `x` (n-1 iterations), compute 3 candidates: O(1).
2. Update `currentMax`, `currentMin`, and `best`: O(1).

## Overall Complexity
- Time: O(n)
- Space: O(1)
