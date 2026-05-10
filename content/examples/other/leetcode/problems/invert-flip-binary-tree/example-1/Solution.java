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

  static TreeNode invertTreeRecursive(TreeNode root) {
    if (root == null) return null;
    TreeNode left = invertTreeRecursive(root.left);
    TreeNode right = invertTreeRecursive(root.right);
    root.left = right;
    root.right = left;
    return root;
  }

  public static void main(String[] args) {
    TreeNode root =
        new TreeNode(
            4,
            new TreeNode(2, new TreeNode(1), new TreeNode(3)),
            new TreeNode(7, new TreeNode(6), new TreeNode(9)));
    System.out.println(invertTreeRecursive(root).left.val);
  }
}
