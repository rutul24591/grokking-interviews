# Longest Consecutive Sequence — Example 2 (More Optimized: HashSet Sequence Starts)

LeetCode: https://leetcode.com/problems/longest-consecutive-sequence/

## Approach
Use a set. Only begin counting from numbers that are starts (`x-1` not in set). Expand forward.

## Complexity (step-by-step)
1. Build set: O(n).
2. Each number expanded at most once across all starts.

## Overall Complexity
- Time: O(n) average
- Space: O(n)
