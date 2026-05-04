def valid_tree_dfs(n, edges):
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)

    visited = [False] * n

    def dfs(node, parent):
        visited[node] = True
        for nxt in adj[node]:
            if nxt == parent:
                continue
            if visited[nxt]:
                return False
            if not dfs(nxt, node):
                return False
        return True

    if n == 0:
        return True
    if not dfs(0, -1):
        return False
    return all(visited)


if __name__ == "__main__":
    print(valid_tree_dfs(5, [(0, 1), (0, 2), (0, 3), (1, 4)]))
    print(valid_tree_dfs(5, [(0, 1), (1, 2), (2, 3), (1, 3), (1, 4)]))
