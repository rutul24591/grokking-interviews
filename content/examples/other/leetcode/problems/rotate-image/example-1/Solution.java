import java.util.Arrays;

public class Solution {
  static int[][] rotateImageExtraMatrix(int[][] matrix) {
    int n = matrix.length;
    int[][] out = new int[n][n];
    for (int r = 0; r < n; r += 1) {
      for (int c = 0; c < n; c += 1) out[c][n - 1 - r] = matrix[r][c];
    }
    for (int r = 0; r < n; r += 1) {
      for (int c = 0; c < n; c += 1) matrix[r][c] = out[r][c];
    }
    return matrix;
  }

  public static void main(String[] args) {
    int[][] matrix = new int[][] {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
    System.out.println(Arrays.deepToString(rotateImageExtraMatrix(matrix)));
  }
}
