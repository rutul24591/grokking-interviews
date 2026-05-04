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

  static boolean isValidBSTInorderList(TreeNode root) {
    List<Integer> values = new ArrayList<>();
    inorder(root, values);
    for (int i = 1; i < values.size(); i += 1) {
      if (values.get(i) <= values.get(i - 1)) return false;
    }
    return true;
  }

  static void inorder(TreeNode node, List<Integer> values) {
    if (node == null) return;
    inorder(node.left, values);
    values.add(node.val);
    inorder(node.right, values);
  }

  public static void main(String[] args) {
    TreeNode ok = new TreeNode(2, new TreeNode(1), new TreeNode(3));
    System.out.println(isValidBSTInorderList(ok));
  }
}
