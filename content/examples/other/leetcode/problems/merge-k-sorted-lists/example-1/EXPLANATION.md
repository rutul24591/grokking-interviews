# Merge K Sorted Lists — Example 1 (Less Optimized: Merge One-by-one)

LeetCode: https://leetcode.com/problems/merge-k-sorted-lists/

## Approach
Start with `merged = null`. For each list head, merge it into `merged` using the standard two-list merge.

## Complexity (step-by-step)
1. Each two-list merge takes linear time in the lengths of the two lists: O(a + b).
2. Doing this k times accumulates to roughly O(N * k) in the worst case (because `merged` keeps growing and is scanned repeatedly), where `N` is total nodes.

## Overall Complexity
- Time: O(Nk) worst-case
- Space: O(1) extra (relinks nodes)
