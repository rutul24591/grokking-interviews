import java.util.Arrays;

public class Solution {
  static void rotate(int[][] matrix) {
    int n = matrix.length;
    for (int r = 0; r < n; r += 1) {
      for (int c = r + 1; c < n; c += 1) {
        int tmp = matrix[r][c];
        matrix[r][c] = matrix[c][r];
        matrix[c][r] = tmp;
      }
    }
    for (int r = 0; r < n; r += 1) {
      for (int c = 0; c < n / 2; c += 1) {
        int tmp = matrix[r][c];
        matrix[r][c] = matrix[r][n - 1 - c];
        matrix[r][n - 1 - c] = tmp;
      }
    }
  }

  public static void main(String[] args) {
    int[][] matrix = new int[][] {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
    rotate(matrix);
    System.out.println(Arrays.deepToString(matrix));
  }
}
