# Detect Cycle in a Linked List — Example 1 (Less Optimized: HashSet)

LeetCode: https://leetcode.com/problems/linked-list-cycle/

## Approach
Traverse the list and store each visited node reference in a set.
If we ever see the same node again, there's a cycle.

## Complexity (step-by-step)
1. Visit each node at most once: O(n).
2. Each set lookup/insert is O(1) average.

## Overall Complexity
- Time: O(n)
- Space: O(n)
