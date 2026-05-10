import java.util.ArrayList;
import java.util.List;

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

  static List<List<Integer>> levelOrderDFS(TreeNode root) {
    List<List<Integer>> out = new ArrayList<>();
    dfs(root, 0, out);
    return out;
  }

  static void dfs(TreeNode node, int depth, List<List<Integer>> out) {
    if (node == null) return;
    if (out.size() == depth) out.add(new ArrayList<>());
    out.get(depth).add(node.val);
    dfs(node.left, depth + 1, out);
    dfs(node.right, depth + 1, out);
  }

  public static void main(String[] args) {
    TreeNode root = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));
    System.out.println(levelOrderDFS(root));
  }
}
