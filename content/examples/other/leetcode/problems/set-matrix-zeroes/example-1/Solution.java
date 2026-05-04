import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class Solution {
  static int[][] setZeroesWithSets(int[][] matrix) {
    int rows = matrix.length;
    int cols = rows == 0 ? 0 : matrix[0].length;
    Set<Integer> zeroRows = new HashSet<>();
    Set<Integer> zeroCols = new HashSet<>();

    for (int r = 0; r < rows; r += 1) {
      for (int c = 0; c < cols; c += 1) {
        if (matrix[r][c] == 0) {
          zeroRows.add(r);
          zeroCols.add(c);
        }
      }
    }

    for (int r = 0; r < rows; r += 1) {
      for (int c = 0; c < cols; c += 1) {
        if (zeroRows.contains(r) || zeroCols.contains(c)) matrix[r][c] = 0;
      }
    }
    return matrix;
  }

  public static void main(String[] args) {
    int[][] out = setZeroesWithSets(new int[][] {{1, 1, 1}, {1, 0, 1}, {1, 1, 1}});
    System.out.println(Arrays.deepToString(out));
  }
}
