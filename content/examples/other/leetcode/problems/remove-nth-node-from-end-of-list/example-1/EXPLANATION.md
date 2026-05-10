# Remove Nth Node From End Of List — Example 1 (Less Optimized: Two Pass)

LeetCode: https://leetcode.com/problems/remove-nth-node-from-end-of-list/

## Approach
1) compute list length `L`
2) remove the `(L-n)`-th node from the start

## Complexity (step-by-step)
1. First pass to compute length: O(L).
2. Second pass to reach the node before removal: O(L).

## Overall Complexity
- Time: O(L)
- Space: O(1)
