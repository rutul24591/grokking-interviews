def can_finish_dfs(num_courses, prerequisites):
    adj = [[] for _ in range(num_courses)]
    for course, prereq in prerequisites:
        adj[prereq].append(course)

    # 0=unvisited, 1=visiting, 2=visited
    state = [0] * num_courses

    def dfs(node):
        if state[node] == 1:
            return False
        if state[node] == 2:
            return True
        state[node] = 1
        for nxt in adj[node]:
            if not dfs(nxt):
                return False
        state[node] = 2
        return True

    for i in range(num_courses):
        if not dfs(i):
            return False
    return True


if __name__ == "__main__":
    print(can_finish_dfs(2, [(1, 0)]))
    print(can_finish_dfs(2, [(1, 0), (0, 1)]))
