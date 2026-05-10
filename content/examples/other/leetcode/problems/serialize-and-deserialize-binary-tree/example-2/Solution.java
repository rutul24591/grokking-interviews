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

  static String serializeDFS(TreeNode root) {
    StringBuilder sb = new StringBuilder();
    dfs(root, sb);
    // remove trailing comma
    if (sb.length() > 0) sb.setLength(sb.length() - 1);
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

  static TreeNode deserializeDFS(String data) {
    if (data == null || data.isEmpty()) return null;
    String[] parts = data.split(",");
    int[] idx = new int[] {0};
    return build(parts, idx);
  }

  static TreeNode build(String[] parts, int[] idx) {
    String token = parts[idx[0]++];
    if (token.equals("#")) return null;
    TreeNode node = new TreeNode(Integer.parseInt(token));
    node.left = build(parts, idx);
    node.right = build(parts, idx);
    return node;
  }

  public static void main(String[] args) {
    TreeNode root = new TreeNode(1, new TreeNode(2), new TreeNode(3, new TreeNode(4), new TreeNode(5)));
    String s = serializeDFS(root);
    System.out.println(s);
    System.out.println(serializeDFS(deserializeDFS(s)));
  }
}
