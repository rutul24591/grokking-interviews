# Reverse a Linked List — Example 2 (More Optimized: Iterative)

LeetCode: https://leetcode.com/problems/reverse-linked-list/

## Approach
Iteratively rewire pointers:
- keep `prev` (already reversed part)
- move `cur` forward, flipping `cur.next` to point to `prev`

## Complexity (step-by-step)
1. Visit each node once: O(n).
2. Constant-time pointer rewiring per node.

## Overall Complexity
- Time: O(n)
- Space: O(1)
