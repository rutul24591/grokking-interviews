# Merge K Sorted Lists — Example 2 (More Optimized: Min-Heap)

LeetCode: https://leetcode.com/problems/merge-k-sorted-lists/

## Approach
Push the head of each list into a min-heap by node value.
Repeatedly pop the smallest node and push its `next` node (from the same list).

## Complexity (step-by-step)
1. Initial heap build with up to k heads: O(k log k).
2. For each of N total nodes:
   - pop min: O(log k)
   - push next: O(log k)

## Overall Complexity
- Time: O(N log k)
- Space: O(k) heap
