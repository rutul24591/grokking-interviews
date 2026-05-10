public class Solution {
  static class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;

    TreeNode(int val) {
      this.val = val;
    }

    TreeNode(int val, TreeNode left, TreeNode right) {
      this.val = val;
      this.left = left;
      this.right = right;
    }
  }

  static TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    int low = Math.min(p.val, q.val);
    int high = Math.max(p.val, q.val);
    TreeNode cur = root;
    while (cur != null) {
      if (high < cur.val) cur = cur.left;
      else if (low > cur.val) cur = cur.right;
      else return cur;
    }
    return null;
  }

  public static void main(String[] args) {
    TreeNode root = new TreeNode(6);
    root.left = new TreeNode(2, new TreeNode(0), new TreeNode(4, new TreeNode(3), new TreeNode(5)));
    root.right = new TreeNode(8, new TreeNode(7), new TreeNode(9));
    TreeNode p = root.left;
    TreeNode q = root.right;
    System.out.println(lowestCommonAncestor(root, p, q).val);
  }
}
