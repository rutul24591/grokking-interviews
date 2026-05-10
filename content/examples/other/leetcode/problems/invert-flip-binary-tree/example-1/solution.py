class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def invert_tree_recursive(root):
    if root is None:
        return None
    left = invert_tree_recursive(root.left)
    right = invert_tree_recursive(root.right)
    root.left = right
    root.right = left
    return root


if __name__ == "__main__":
    root = TreeNode(4, TreeNode(2, TreeNode(1), TreeNode(3)), TreeNode(7, TreeNode(6), TreeNode(9)))
    print(invert_tree_recursive(root).left.val)
