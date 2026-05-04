import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
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

  static Node cloneGraphBFS(Node node) {
    if (node == null) return null;
    Map<Node, Node> seen = new HashMap<>();
    Deque<Node> q = new ArrayDeque<>();
    seen.put(node, new Node(node.val));
    q.add(node);

    while (!q.isEmpty()) {
      Node cur = q.removeFirst();
      Node copy = seen.get(cur);
      for (Node nxt : cur.neighbors) {
        if (!seen.containsKey(nxt)) {
          seen.put(nxt, new Node(nxt.val));
          q.addLast(nxt);
        }
        copy.neighbors.add(seen.get(nxt));
      }
    }
    return seen.get(node);
  }

  public static void main(String[] args) {
    Node a = new Node(1);
    Node b = new Node(2);
    a.neighbors.add(b);
    b.neighbors.add(a);
    Node cloned = cloneGraphBFS(a);
    System.out.println(cloned.val + " " + cloned.neighbors.get(0).val);
  }
}
