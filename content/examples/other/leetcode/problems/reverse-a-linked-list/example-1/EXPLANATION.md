# Reverse a Linked List — Example 1 (Less Optimized: Recursion)

LeetCode: https://leetcode.com/problems/reverse-linked-list/

## Approach
Recursive:
- reverse the sublist starting at `head.next`
- then flip `head.next.next = head` and set `head.next = null`

## Complexity (step-by-step)
1. Each node participates in one recursion frame: O(n).
2. Constant pointer rewiring per node: O(1).

## Overall Complexity
- Time: O(n)
- Space: O(n) recursion stack
