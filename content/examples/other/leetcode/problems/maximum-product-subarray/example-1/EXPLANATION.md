# Maximum Product Subarray — Example 1 (Less Optimized: Brute Force)

LeetCode: https://leetcode.com/problems/maximum-product-subarray/

## Approach
Enumerate all subarrays starting at each index and track the running product as we extend the end index.

## Complexity (step-by-step)
1. Choose a start index `i`: executed `n` times.
2. Extend end index `j` from `i` to `n-1` while maintaining `product`: total inner iterations ~ `n(n+1)/2`.
3. Update `best` each inner step: O(1).

## Overall Complexity
- Time: O(n^2)
- Space: O(1)
