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

  static TreeNode invertTreeBFS(TreeNode root) {
    if (root == null) return null;
    Deque<TreeNode> q = new ArrayDeque<>();
    q.addLast(root);
    while (!q.isEmpty()) {
      TreeNode node = q.removeFirst();
      TreeNode tmp = node.left;
      node.left = node.right;
      node.right = tmp;
      if (node.left != null) q.addLast(node.left);
      if (node.right != null) q.addLast(node.right);
    }
    return root;
  }

  public static void main(String[] args) {
    TreeNode root =
        new TreeNode(
            4,
            new TreeNode(2, new TreeNode(1), new TreeNode(3)),
            new TreeNode(7, new TreeNode(6), new TreeNode(9)));
    System.out.println(invertTreeBFS(root).left.val);
  }
}
