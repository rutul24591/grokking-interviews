# Serialize and Deserialize Binary Tree — Example 1 (Less Optimized: BFS Level-order)

LeetCode: https://leetcode.com/problems/serialize-and-deserialize-binary-tree/

## Approach
Serialize using level-order traversal (BFS), using `#` as a null marker.
Deserialize by reconstructing children in queue order.

## Complexity (step-by-step)
1. Serialization enqueues/dequeues each node and null marker once: O(n).
2. Deserialization processes each token once: O(n).

## Overall Complexity
- Time: O(n)
- Space: O(n) for queue and output tokens
