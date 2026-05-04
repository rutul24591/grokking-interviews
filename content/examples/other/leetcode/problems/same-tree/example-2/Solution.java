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

  static boolean isSameTreeIterative(TreeNode p, TreeNode q) {
    Deque<TreeNode[]> stack = new ArrayDeque<>();
    stack.addLast(new TreeNode[] {p, q});
    while (!stack.isEmpty()) {
      TreeNode[] pair = stack.removeLast();
      TreeNode a = pair[0];
      TreeNode b = pair[1];
      if (a == null && b == null) continue;
      if (a == null || b == null) return false;
      if (a.val != b.val) return false;
      stack.addLast(new TreeNode[] {a.left, b.left});
      stack.addLast(new TreeNode[] {a.right, b.right});
    }
    return true;
  }

  public static void main(String[] args) {
    TreeNode p = new TreeNode(1, new TreeNode(2), new TreeNode(3));
    TreeNode q = new TreeNode(1, new TreeNode(2), new TreeNode(3));
    System.out.println(isSameTreeIterative(p, q));
  }
}
