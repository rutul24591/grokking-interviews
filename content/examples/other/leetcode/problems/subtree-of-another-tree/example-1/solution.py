class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def is_same(a, b):
    if a is None and b is None:
        return True
    if a is None or b is None:
        return False
    if a.val != b.val:
        return False
    return is_same(a.left, b.left) and is_same(a.right, b.right)


def is_subtree_brute(root, sub_root):
    if sub_root is None:
        return True
    if root is None:
        return False
    if is_same(root, sub_root):
        return True
    return is_subtree_brute(root.left, sub_root) or is_subtree_brute(root.right, sub_root)


if __name__ == "__main__":
    root = TreeNode(3, TreeNode(4, TreeNode(1), TreeNode(2)), TreeNode(5))
    sub = TreeNode(4, TreeNode(1), TreeNode(2))
    print(is_subtree_brute(root, sub))
