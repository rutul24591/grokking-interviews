# Missing Number — Example 2 (More Optimized: XOR)

LeetCode: https://leetcode.com/problems/missing-number/

## Approach
XOR all indices `0..n` and all numbers in `nums`. All pairs cancel out, leaving the missing value.

## Complexity (step-by-step)
1. XOR `0..n`: O(n).
2. XOR all array values: O(n).

## Overall Complexity
- Time: O(n)
- Space: O(1)
