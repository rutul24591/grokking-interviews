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

  static Integer kthSmallest(TreeNode root, int k) {
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode cur = root;
    while (cur != null || !stack.isEmpty()) {
      while (cur != null) {
        stack.addLast(cur);
        cur = cur.left;
      }
      cur = stack.removeLast();
      k -= 1;
      if (k == 0) return cur.val;
      cur = cur.right;
    }
    return null;
  }

  public static void main(String[] args) {
    TreeNode root = new TreeNode(3, new TreeNode(1, null, new TreeNode(2)), new TreeNode(4));
    System.out.println(kthSmallest(root, 1));
  }
}
