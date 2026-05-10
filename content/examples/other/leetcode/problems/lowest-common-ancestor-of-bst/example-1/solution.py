class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def lowest_common_ancestor_brute(root, p, q):
    def path_to(node, target, path):
        if node is None:
            return False
        path.append(node)
        if node is target:
            return True
        if path_to(node.left, target, path) or path_to(node.right, target, path):
            return True
        path.pop()
        return False

    p_path = []
    q_path = []
    path_to(root, p, p_path)
    path_to(root, q, q_path)

    i = 0
    while i < len(p_path) and i < len(q_path) and p_path[i] is q_path[i]:
        i += 1
    return p_path[i - 1] if i > 0 else None


if __name__ == "__main__":
    root = TreeNode(6)
    root.left = TreeNode(2, TreeNode(0), TreeNode(4, TreeNode(3), TreeNode(5)))
    root.right = TreeNode(8, TreeNode(7), TreeNode(9))
    p = root.left
    q = root.right
    print(lowest_common_ancestor_brute(root, p, q).val)
