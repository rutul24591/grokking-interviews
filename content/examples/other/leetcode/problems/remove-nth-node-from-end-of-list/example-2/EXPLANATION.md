# Remove Nth Node From End Of List — Example 2 (More Optimized: One Pass Two Pointers)

LeetCode: https://leetcode.com/problems/remove-nth-node-from-end-of-list/

## Approach
Use a dummy node. Advance `fast` by `n` steps, then move `fast` and `slow` together until `fast` reaches the end.
Now `slow.next` is the node to remove.

## Complexity (step-by-step)
1. Fast advances n steps: O(n).
2. Both pointers traverse the list once: O(L).

## Overall Complexity
- Time: O(L)
- Space: O(1)
