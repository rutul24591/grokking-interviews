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

  static boolean isSame(TreeNode a, TreeNode b) {
    if (a == null && b == null) return true;
    if (a == null || b == null) return false;
    if (a.val != b.val) return false;
    return isSame(a.left, b.left) && isSame(a.right, b.right);
  }

  static boolean isSubtreeBrute(TreeNode root, TreeNode subRoot) {
    if (subRoot == null) return true;
    if (root == null) return false;
    if (isSame(root, subRoot)) return true;
    return isSubtreeBrute(root.left, subRoot) || isSubtreeBrute(root.right, subRoot);
  }

  public static void main(String[] args) {
    TreeNode root = new TreeNode(3, new TreeNode(4, new TreeNode(1), new TreeNode(2)), new TreeNode(5));
    TreeNode sub = new TreeNode(4, new TreeNode(1), new TreeNode(2));
    System.out.println(isSubtreeBrute(root, sub));
  }
}
