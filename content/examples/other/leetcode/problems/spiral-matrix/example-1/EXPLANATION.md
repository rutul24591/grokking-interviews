# Spiral Matrix — Example 1 (Less Optimized: Visited Grid Walk)

LeetCode: https://leetcode.com/problems/spiral-matrix/

## Approach
Simulate walking the matrix in spiral order with:
- current direction (right/down/left/up)
- a `visited` boolean grid

When the next step is out of bounds or already visited, rotate direction.

## Complexity (step-by-step)
1. Visit each of `R*C` cells once: O(RC).
2. Constant-time direction checks per step.

## Overall Complexity
- Time: O(RC)
- Space: O(RC) for visited grid
