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

  static String serializeBFS(TreeNode root) {
    if (root == null) return "";
    List<String> out = new ArrayList<>();
    Deque<TreeNode> q = new ArrayDeque<>();
    q.addLast(root);
    while (!q.isEmpty()) {
      TreeNode node = q.removeFirst();
      if (node == null) {
        out.add("#");
        continue;
      }
      out.add(Integer.toString(node.val));
      q.addLast(node.left);
      q.addLast(node.right);
    }
    int end = out.size() - 1;
    while (end >= 0 && out.get(end).equals("#")) end -= 1;
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i <= end; i += 1) {
      if (i > 0) sb.append(",");
      sb.append(out.get(i));
    }
    return sb.toString();
  }

  static TreeNode deserializeBFS(String data) {
    if (data == null || data.isEmpty()) return null;
    String[] parts = data.split(",");
    TreeNode root = new TreeNode(Integer.parseInt(parts[0]));
    Deque<TreeNode> q = new ArrayDeque<>();
    q.addLast(root);
    int i = 1;
    while (!q.isEmpty() && i < parts.length) {
      TreeNode node = q.removeFirst();
      String left = parts[i++];
      if (!left.equals("#")) node.left = new TreeNode(Integer.parseInt(left));
      q.addLast(node.left);
      if (i >= parts.length) break;
      String right = parts[i++];
      if (!right.equals("#")) node.right = new TreeNode(Integer.parseInt(right));
      q.addLast(node.right);
    }
    return root;
  }

  public static void main(String[] args) {
    TreeNode root = new TreeNode(1, new TreeNode(2), new TreeNode(3, new TreeNode(4), new TreeNode(5)));
    String s = serializeBFS(root);
    System.out.println(s);
    System.out.println(serializeBFS(deserializeBFS(s)));
  }
}
