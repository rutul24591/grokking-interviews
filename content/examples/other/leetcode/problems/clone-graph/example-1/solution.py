class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []


def clone_graph_dfs(node):
    if node is None:
        return None
    seen = {}

    def dfs(cur):
        if cur in seen:
            return seen[cur]
        copy = Node(cur.val, [])
        seen[cur] = copy
        for nxt in cur.neighbors:
            copy.neighbors.append(dfs(nxt))
        return copy

    return dfs(node)


if __name__ == "__main__":
    a = Node(1)
    b = Node(2)
    a.neighbors = [b]
    b.neighbors = [a]
    cloned = clone_graph_dfs(a)
    print(cloned.val, cloned.neighbors[0].val)
