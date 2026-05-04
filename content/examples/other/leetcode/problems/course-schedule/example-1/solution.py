from collections import deque


def can_finish_bfs_kahn(num_courses, prerequisites):
    indegree = [0] * num_courses
    adj = [[] for _ in range(num_courses)]
    for course, prereq in prerequisites:
        adj[prereq].append(course)
        indegree[course] += 1

    q = deque([i for i in range(num_courses) if indegree[i] == 0])
    taken = 0
    while q:
        cur = q.popleft()
        taken += 1
        for nxt in adj[cur]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                q.append(nxt)

    return taken == num_courses


if __name__ == "__main__":
    print(can_finish_bfs_kahn(2, [(1, 0)]))
    print(can_finish_bfs_kahn(2, [(1, 0), (0, 1)]))
