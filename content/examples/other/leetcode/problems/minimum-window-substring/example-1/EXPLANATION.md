# Minimum Window Substring — Example 1 (Less Optimized: Brute Force)

LeetCode: https://leetcode.com/problems/minimum-window-substring/

## Approach
Try every substring `s[i..j]` and check if it covers all characters of `t` (with multiplicities). Track the shortest covering substring.

## Complexity (step-by-step)
1. Enumerate all substrings: O(n^2).
2. For each substring, build `need` map from `t` and scan substring: O(|t| + windowLen).

## Overall Complexity
- Time: O(n^3) worst-case (due to checking many large substrings)
- Space: O(|t|)
