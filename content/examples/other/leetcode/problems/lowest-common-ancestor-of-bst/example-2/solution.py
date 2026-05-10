class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def lowest_common_ancestor(root, p, q):
    low = min(p.val, q.val)
    high = max(p.val, q.val)
    cur = root
    while cur:
        if high < cur.val:
            cur = cur.left
        elif low > cur.val:
            cur = cur.right
        else:
            return cur
    return None


if __name__ == "__main__":
    root = TreeNode(6)
    root.left = TreeNode(2, TreeNode(0), TreeNode(4, TreeNode(3), TreeNode(5)))
    root.right = TreeNode(8, TreeNode(7), TreeNode(9))
    p = root.left
    q = root.right
    print(lowest_common_ancestor(root, p, q).val)
