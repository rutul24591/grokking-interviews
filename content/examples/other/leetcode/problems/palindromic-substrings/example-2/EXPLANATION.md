# Palindromic Substrings — Example 2 (More Optimized: Expand Around Center)

LeetCode: https://leetcode.com/problems/palindromic-substrings/

## Approach
Every palindrome has a center:
- odd-length palindromes center at a character `(i,i)`
- even-length palindromes center between characters `(i,i+1)`

For each center, expand outward while characters match, counting palindromes found.

## Complexity (step-by-step)
1. There are `2n-1` centers: O(n).
2. Each expansion step moves pointers outward; total across all centers is O(n^2) in worst case.

## Overall Complexity
- Time: O(n^2)
- Space: O(1)
