# Valid Palindrome — Example 2 (More Optimized: In-place Two Pointers)

LeetCode: https://leetcode.com/problems/valid-palindrome/

## Approach
Use two pointers directly on the original string:
- move pointers inward skipping non-alphanumeric characters
- compare case-insensitively

This avoids allocating a cleaned string.

## Complexity (step-by-step)
1. Each pointer moves at most n steps total: O(n).
2. Constant-time character checks/normalization per step.

## Overall Complexity
- Time: O(n)
- Space: O(1)
