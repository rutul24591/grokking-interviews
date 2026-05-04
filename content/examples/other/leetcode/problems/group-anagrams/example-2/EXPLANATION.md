# Group Anagrams — Example 2 (More Optimized: 26-count Signature Key)

LeetCode: https://leetcode.com/problems/group-anagrams/

## Approach
Instead of sorting each string, build a 26-length letter frequency signature and use it as the map key.

## Complexity (step-by-step)
1. For each string of length K, count chars: O(K).
2. Create/serialize the 26-length key: O(26) = O(1).
3. Hash map insert/lookup: average O(1).

## Overall Complexity
- Time: O(N * K)
- Space: O(N * K) output + storage
