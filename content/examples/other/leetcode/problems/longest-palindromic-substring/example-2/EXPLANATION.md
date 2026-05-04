# Longest Palindromic Substring — Example 2 (More Optimized: Expand Around Center)

LeetCode: https://leetcode.com/problems/longest-palindromic-substring/

## Approach
For each index, treat it as a palindrome center:
- odd center `(i,i)`
- even center `(i,i+1)`
Expand while matching and keep the best bounds.

## Complexity (step-by-step)
1. There are O(n) centers.
2. Each expansion can take O(n) in worst case; total O(n^2) worst-case.

## Overall Complexity
- Time: O(n^2)
- Space: O(1)
