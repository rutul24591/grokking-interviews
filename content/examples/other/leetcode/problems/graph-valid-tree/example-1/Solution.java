import java.util.ArrayList;
import java.util.List;

public class Solution {
  static boolean validTreeDFS(int n, int[][] edges) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i += 1) adj.add(new ArrayList<>());
    for (int[] e : edges) {
      adj.get(e[0]).add(e[1]);
      adj.get(e[1]).add(e[0]);
    }

    boolean[] visited = new boolean[n];
    if (n == 0) return true;
    if (!dfs(0, -1, adj, visited)) return false;
    for (boolean v : visited) if (!v) return false;
    return true;
  }

  static boolean dfs(int node, int parent, List<List<Integer>> adj, boolean[] visited) {
    visited[node] = true;
    for (int nxt : adj.get(node)) {
      if (nxt == parent) continue;
      if (visited[nxt]) return false;
      if (!dfs(nxt, node, adj, visited)) return false;
    }
    return true;
  }

  public static void main(String[] args) {
    System.out.println(validTreeDFS(5, new int[][] {{0, 1}, {0, 2}, {0, 3}, {1, 4}}));
    System.out.println(
        validTreeDFS(5, new int[][] {{0, 1}, {1, 2}, {2, 3}, {1, 3}, {1, 4}}));
  }
}
