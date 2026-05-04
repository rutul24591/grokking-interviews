class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def is_valid_bst_inorder_list(root):
    values = []

    def inorder(node):
        if not node:
            return
        inorder(node.left)
        values.append(node.val)
        inorder(node.right)

    inorder(root)
    for i in range(1, len(values)):
        if values[i] <= values[i - 1]:
            return False
    return True


if __name__ == "__main__":
    ok = TreeNode(2, TreeNode(1), TreeNode(3))
    print(is_valid_bst_inorder_list(ok))
