import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Solution {
  static class Node {
    public int val;
    public List<Node> neighbors;

    public Node(int val) {
      this.val = val;
      this.neighbors = new ArrayList<>();
    }
  }

  static Node cloneGraphDFS(Node node) {
    if (node == null) return null;
    Map<Node, Node> seen = new HashMap<>();
    return dfs(node, seen);
  }

  static Node dfs(Node cur, Map<Node, Node> seen) {
    if (seen.containsKey(cur)) return seen.get(cur);
    Node copy = new Node(cur.val);
    seen.put(cur, copy);
    for (Node nxt : cur.neighbors) copy.neighbors.add(dfs(nxt, seen));
    return copy;
  }

  public static void main(String[] args) {
    Node a = new Node(1);
    Node b = new Node(2);
    a.neighbors.add(b);
    b.neighbors.add(a);
    Node cloned = cloneGraphDFS(a);
    System.out.println(cloned.val + " " + cloned.neighbors.get(0).val);
  }
}
