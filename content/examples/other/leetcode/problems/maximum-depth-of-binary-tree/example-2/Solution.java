import java.util.ArrayDeque;
import java.util.Deque;

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

  static int maxDepthBFS(TreeNode root) {
    if (root == null) return 0;
    Deque<TreeNode> q = new ArrayDeque<>();
    q.addLast(root);
    int depth = 0;
    while (!q.isEmpty()) {
      int levelSize = q.size();
      for (int i = 0; i < levelSize; i += 1) {
        TreeNode node = q.removeFirst();
        if (node.left != null) q.addLast(node.left);
        if (node.right != null) q.addLast(node.right);
      }
      depth += 1;
    }
    return depth;
  }

  public static void main(String[] args) {
    TreeNode root = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));
    System.out.println(maxDepthBFS(root));
  }
}
