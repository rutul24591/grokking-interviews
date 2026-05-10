import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
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

  static List<List<Integer>> levelOrderBFS(TreeNode root) {
    if (root == null) return new ArrayList<>();
    List<List<Integer>> out = new ArrayList<>();
    Deque<TreeNode> q = new ArrayDeque<>();
    q.addLast(root);
    while (!q.isEmpty()) {
      int levelSize = q.size();
      List<Integer> level = new ArrayList<>();
      for (int i = 0; i < levelSize; i += 1) {
        TreeNode node = q.removeFirst();
        level.add(node.val);
        if (node.left != null) q.addLast(node.left);
        if (node.right != null) q.addLast(node.right);
      }
      out.add(level);
    }
    return out;
  }

  public static void main(String[] args) {
    TreeNode root = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));
    System.out.println(levelOrderBFS(root));
  }
}
