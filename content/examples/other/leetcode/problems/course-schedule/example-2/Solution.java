import java.util.ArrayList;
import java.util.List;

public class Solution {
  static boolean canFinishDFS(int numCourses, int[][] prerequisites) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < numCourses; i += 1) adj.add(new ArrayList<>());
    for (int[] p : prerequisites) adj.get(p[1]).add(p[0]);

    // 0=unvisited, 1=visiting, 2=visited
    int[] state = new int[numCourses];
    for (int i = 0; i < numCourses; i += 1) {
      if (!dfs(i, adj, state)) return false;
    }
    return true;
  }

  static boolean dfs(int node, List<List<Integer>> adj, int[] state) {
    if (state[node] == 1) return false;
    if (state[node] == 2) return true;
    state[node] = 1;
    for (int nxt : adj.get(node)) {
      if (!dfs(nxt, adj, state)) return false;
    }
    state[node] = 2;
    return true;
  }

  public static void main(String[] args) {
    System.out.println(canFinishDFS(2, new int[][] {{1, 0}}));
    System.out.println(canFinishDFS(2, new int[][] {{1, 0}, {0, 1}}));
  }
}
