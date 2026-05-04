# Product of Array Except Self — Example 1 (Less Optimized: Multiply All Others)

LeetCode: https://leetcode.com/problems/product-of-array-except-self/

## Approach
Brute force per index.

## Complexity (step-by-step)
1. For each index i, multiply all j!=i: O(n) per i.
2. Total O(n^2) multiplications.
## Overall Complexity
- Time: O(n^2)
- Space: O(1) extra aside from output
