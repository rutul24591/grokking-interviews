# Detect Cycle in a Linked List — Example 2 (More Optimized: Floyd’s Tortoise/Hare)

LeetCode: https://leetcode.com/problems/linked-list-cycle/

## Approach
Use two pointers:
- `slow` moves 1 step
- `fast` moves 2 steps

If there's a cycle, `fast` will eventually meet `slow`.

## Complexity (step-by-step)
1. Each loop iteration advances pointers; in worst case O(n) iterations.
2. Constant-time pointer moves per iteration.

## Overall Complexity
- Time: O(n)
- Space: O(1)
