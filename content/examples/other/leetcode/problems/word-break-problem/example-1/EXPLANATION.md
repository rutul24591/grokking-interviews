# Word Break Problem — Example 1 (Less Optimized: Top-down DFS + Memo)

LeetCode: https://leetcode.com/problems/word-break/

## Approach
Try all prefixes starting at index `i`. If a prefix is a dictionary word, recursively solve the remaining suffix.
Memoize by start index to avoid re-checking the same suffix repeatedly.

## Complexity (step-by-step)
1. There are `n` possible start indices.
2. From a given `i`, we may try up to `n-i` end positions; substring checks dominate.

## Overall Complexity
- Time: O(n^2) substring checks (with memo; exact depends on substring cost)
- Space: O(n) memo + recursion stack
