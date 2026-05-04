# Valid Palindrome — Example 1 (Less Optimized: Normalize Then Two Pointers)

LeetCode: https://leetcode.com/problems/valid-palindrome/

## Approach
Normalize by:
1) lowercasing
2) removing non-alphanumeric characters
Then use two pointers to compare from both ends.

## Complexity (step-by-step)
1. Build cleaned string: O(n).
2. Two-pointer comparison: O(n).

## Overall Complexity
- Time: O(n)
- Space: O(n) for cleaned string
