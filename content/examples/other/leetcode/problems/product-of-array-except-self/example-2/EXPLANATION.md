# Product of Array Except Self — Example 2 (Optimized: Prefix/Suffix Products)

LeetCode: https://leetcode.com/problems/product-of-array-except-self/

## Approach
Compute prefix products then fold in suffix products.

## Complexity (step-by-step)
1. First pass: out[i] = product of nums[0..i-1] (prefix): O(n).
2. Second pass from right: multiply out[i] by product of nums[i+1..] (suffix): O(n).
3. No division; handles zeros naturally.
## Overall Complexity
- Time: O(n)
- Space: O(1) extra (excluding output)
