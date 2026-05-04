# House Robber II — Example 2 (More Optimized: Take/Skip State DP)

LeetCode: https://leetcode.com/problems/house-robber-ii/

## Approach
Same circle-to-two-lines reduction, but the linear DP is expressed as:
- `take`: best if we rob current house
- `skip`: best if we skip current house

Transition:
- `nextTake = skip + nums[i]`
- `nextSkip = max(skip, take)`

## Complexity (step-by-step)
1. Two linear passes over ~n elements total: O(n).
2. Constant-time updates per element.

## Overall Complexity
- Time: O(n)
- Space: O(1)
