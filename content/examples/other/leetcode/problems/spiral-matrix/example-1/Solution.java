import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Solution {
  static List<Integer> spiralOrderVisited(int[][] matrix) {
    int rows = matrix.length;
    int cols = rows == 0 ? 0 : matrix[0].length;
    boolean[][] visited = new boolean[rows][cols];
    int[][] dirs = new int[][] {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
    int dir = 0;
    int r = 0;
    int c = 0;
    List<Integer> out = new ArrayList<>();

    for (int step = 0; step < rows * cols; step += 1) {
      out.add(matrix[r][c]);
      visited[r][c] = true;
      int nr = r + dirs[dir][0];
      int nc = c + dirs[dir][1];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || visited[nr][nc]) dir = (dir + 1) % 4;
      r += dirs[dir][0];
      c += dirs[dir][1];
    }

    return out;
  }

  public static void main(String[] args) {
    System.out.println(spiralOrderVisited(new int[][] {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}));
  }
}
