class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def serialize_dfs(root):
    out = []

    def dfs(node):
        if node is None:
            out.append("#")
            return
        out.append(str(node.val))
        dfs(node.left)
        dfs(node.right)

    dfs(root)
    return ",".join(out)


def deserialize_dfs(data):
    if not data:
        return None
    parts = data.split(",")
    i = 0

    def build():
        nonlocal i
        token = parts[i]
        i += 1
        if token == "#":
            return None
        node = TreeNode(int(token))
        node.left = build()
        node.right = build()
        return node

    return build()


if __name__ == "__main__":
    root = TreeNode(1, TreeNode(2), TreeNode(3, TreeNode(4), TreeNode(5)))
    s = serialize_dfs(root)
    print(s)
    print(serialize_dfs(deserialize_dfs(s)))
