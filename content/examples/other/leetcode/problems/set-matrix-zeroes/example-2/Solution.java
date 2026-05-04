import java.util.Arrays;

public class Solution {
  static int[][] setZeroes(int[][] matrix) {
    int rows = matrix.length;
    int cols = rows == 0 ? 0 : matrix[0].length;
    boolean firstRowZero = false;
    boolean firstColZero = false;

    for (int c = 0; c < cols; c += 1) if (matrix[0][c] == 0) firstRowZero = true;
    for (int r = 0; r < rows; r += 1) if (matrix[r][0] == 0) firstColZero = true;

    for (int r = 1; r < rows; r += 1) {
      for (int c = 1; c < cols; c += 1) {
        if (matrix[r][c] == 0) {
          matrix[r][0] = 0;
          matrix[0][c] = 0;
        }
      }
    }

    for (int r = 1; r < rows; r += 1) {
      for (int c = 1; c < cols; c += 1) {
        if (matrix[r][0] == 0 || matrix[0][c] == 0) matrix[r][c] = 0;
      }
    }

    if (firstRowZero) for (int c = 0; c < cols; c += 1) matrix[0][c] = 0;
    if (firstColZero) for (int r = 0; r < rows; r += 1) matrix[r][0] = 0;
    return matrix;
  }

  public static void main(String[] args) {
    int[][] out = setZeroes(new int[][] {{1, 1, 1}, {1, 0, 1}, {1, 1, 1}});
    System.out.println(Arrays.deepToString(out));
  }
}
