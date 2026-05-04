# Course Schedule — Example 1 (Less Optimized: Kahn’s Algorithm / BFS Toposort)

LeetCode: https://leetcode.com/problems/course-schedule/

## Approach
Model prerequisites as a directed graph `prereq -> course`.
Use Kahn’s algorithm:
1) compute indegree for each node
2) repeatedly take nodes with indegree 0
3) reduce indegree of their outgoing neighbors

If we can “take” all courses, there is no cycle.

## Complexity (step-by-step)
1. Build adjacency + indegree arrays from prerequisites: O(V + E).
2. Initialize queue with indegree==0 nodes: O(V).
3. Each node dequeued once: O(V).
4. Each edge processed once when reducing indegree: O(E).

## Overall Complexity
- Time: O(V + E)
- Space: O(V + E)
