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

  static TreeNode lowestCommonAncestorBrute(TreeNode root, TreeNode p, TreeNode q) {
    List<TreeNode> pPath = new ArrayList<>();
    List<TreeNode> qPath = new ArrayList<>();
    pathTo(root, p, pPath);
    pathTo(root, q, qPath);
    int i = 0;
    while (i < pPath.size() && i < qPath.size() && pPath.get(i) == qPath.get(i)) i += 1;
    return i == 0 ? null : pPath.get(i - 1);
  }

  static boolean pathTo(TreeNode node, TreeNode target, List<TreeNode> path) {
    if (node == null) return false;
    path.add(node);
    if (node == target) return true;
    if (pathTo(node.left, target, path) || pathTo(node.right, target, path)) return true;
    path.remove(path.size() - 1);
    return false;
  }

  public static void main(String[] args) {
    TreeNode root = new TreeNode(6);
    root.left = new TreeNode(2, new TreeNode(0), new TreeNode(4, new TreeNode(3), new TreeNode(5)));
    root.right = new TreeNode(8, new TreeNode(7), new TreeNode(9));
    TreeNode p = root.left;
    TreeNode q = root.right;
    System.out.println(lowestCommonAncestorBrute(root, p, q).val);
  }
}
