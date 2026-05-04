import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;

public class Solution {
  static boolean canFinishBFSKahn(int numCourses, int[][] prerequisites) {
    int[] indegree = new int[numCourses];
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < numCourses; i += 1) adj.add(new ArrayList<>());
    for (int[] p : prerequisites) {
      int course = p[0];
      int prereq = p[1];
      adj.get(prereq).add(course);
      indegree[course] += 1;
    }

    Deque<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < numCourses; i += 1) if (indegree[i] == 0) q.addLast(i);

    int taken = 0;
    while (!q.isEmpty()) {
      int cur = q.removeFirst();
      taken += 1;
      for (int nxt : adj.get(cur)) {
        indegree[nxt] -= 1;
        if (indegree[nxt] == 0) q.addLast(nxt);
      }
    }
    return taken == numCourses;
  }

  public static void main(String[] args) {
    System.out.println(canFinishBFSKahn(2, new int[][] {{1, 0}}));
    System.out.println(canFinishBFSKahn(2, new int[][] {{1, 0}, {0, 1}}));
  }
}
