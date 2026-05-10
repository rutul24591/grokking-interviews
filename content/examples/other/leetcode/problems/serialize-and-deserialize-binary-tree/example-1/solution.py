from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def serialize_bfs(root):
    if root is None:
        return ""
    out = []
    q = deque([root])
    while q:
        node = q.popleft()
        if node is None:
            out.append("#")
            continue
        out.append(str(node.val))
        q.append(node.left)
        q.append(node.right)
    while out and out[-1] == "#":
        out.pop()
    return ",".join(out)


def deserialize_bfs(data):
    if not data:
        return None
    parts = data.split(",")
    root = TreeNode(int(parts[0]))
    q = deque([root])
    i = 1
    while q and i < len(parts):
        node = q.popleft()
        left = parts[i]
        i += 1
        if left != "#":
            node.left = TreeNode(int(left))
        q.append(node.left)
        if i >= len(parts):
            break
        right = parts[i]
        i += 1
        if right != "#":
            node.right = TreeNode(int(right))
        q.append(node.right)
    return root


if __name__ == "__main__":
    root = TreeNode(1, TreeNode(2), TreeNode(3, TreeNode(4), TreeNode(5)))
    s = serialize_bfs(root)
    print(s)
    print(serialize_bfs(deserialize_bfs(s)))
