# Serialize and Deserialize Binary Tree — Example 2 (More Optimized: DFS Preorder)

LeetCode: https://leetcode.com/problems/serialize-and-deserialize-binary-tree/

## Approach
Serialize with preorder DFS including null markers (`#`). Deserialize by consuming tokens in the same preorder order.

This is compact and easy to implement (no queue), but recursion depth depends on tree height.

## Complexity (step-by-step)
1. Serialization visits each node once: O(n).
2. Deserialization builds each node once: O(n).

## Overall Complexity
- Time: O(n)
- Space: O(n) output + O(h) recursion stack
