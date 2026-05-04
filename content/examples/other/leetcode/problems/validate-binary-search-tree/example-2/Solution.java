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

  static boolean isValidBST(TreeNode root) {
    return dfs(root, Long.MIN_VALUE, Long.MAX_VALUE);
  }

  static boolean dfs(TreeNode node, long low, long high) {
    if (node == null) return true;
    if (!(low < node.val && node.val < high)) return false;
    return dfs(node.left, low, node.val) && dfs(node.right, node.val, high);
  }

  public static void main(String[] args) {
    TreeNode ok = new TreeNode(2, new TreeNode(1), new TreeNode(3));
    System.out.println(isValidBST(ok));
  }
}
