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

  static String serializePreorder(TreeNode root) {
    StringBuilder sb = new StringBuilder();
    dfs(root, sb);
    return sb.toString();
  }

  static void dfs(TreeNode node, StringBuilder sb) {
    if (node == null) {
      sb.append("#,");
      return;
    }
    sb.append(node.val).append(",");
    dfs(node.left, sb);
    dfs(node.right, sb);
  }

  static boolean isSubtreeSerialized(TreeNode root, TreeNode subRoot) {
    String a = serializePreorder(root);
    String b = serializePreorder(subRoot);
    return a.contains(b);
  }

  public static void main(String[] args) {
    TreeNode root = new TreeNode(3, new TreeNode(4, new TreeNode(1), new TreeNode(2)), new TreeNode(5));
    TreeNode sub = new TreeNode(4, new TreeNode(1), new TreeNode(2));
    System.out.println(isSubtreeSerialized(root, sub));
  }
}
