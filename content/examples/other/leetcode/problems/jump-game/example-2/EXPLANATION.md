# Jump Game — Example 2 (More Optimized: Greedy Farthest Reach)

LeetCode: https://leetcode.com/problems/jump-game/

## Approach
Track the farthest index reachable so far.
If we ever reach an index `i` where `i > farthest`, we are stuck.

## Complexity (step-by-step)
1. Single pass updating farthest: O(n).
2. Constant-time max update per index.

## Overall Complexity
- Time: O(n)
- Space: O(1)
