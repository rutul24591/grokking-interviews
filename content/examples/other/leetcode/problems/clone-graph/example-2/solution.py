from collections import deque


class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []


def clone_graph_bfs(node):
    if node is None:
        return None
    seen = {node: Node(node.val, [])}
    q = deque([node])
    while q:
        cur = q.popleft()
        copy = seen[cur]
        for nxt in cur.neighbors:
            if nxt not in seen:
                seen[nxt] = Node(nxt.val, [])
                q.append(nxt)
            copy.neighbors.append(seen[nxt])
    return seen[node]


if __name__ == "__main__":
    a = Node(1)
    b = Node(2)
    a.neighbors = [b]
    b.neighbors = [a]
    cloned = clone_graph_bfs(a)
    print(cloned.val, cloned.neighbors[0].val)
