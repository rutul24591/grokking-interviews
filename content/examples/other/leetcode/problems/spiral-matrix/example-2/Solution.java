import java.util.ArrayList;
import java.util.List;

public class Solution {
  static List<Integer> spiralOrder(int[][] matrix) {
    List<Integer> out = new ArrayList<>();
    int top = 0;
    int bottom = matrix.length - 1;
    int left = 0;
    int right = matrix.length == 0 ? -1 : matrix[0].length - 1;

    while (top <= bottom && left <= right) {
      for (int c = left; c <= right; c += 1) out.add(matrix[top][c]);
      top += 1;

      for (int r = top; r <= bottom; r += 1) out.add(matrix[r][right]);
      right -= 1;

      if (top <= bottom) {
        for (int c = right; c >= left; c -= 1) out.add(matrix[bottom][c]);
        bottom -= 1;
      }

      if (left <= right) {
        for (int r = bottom; r >= top; r -= 1) out.add(matrix[r][left]);
        left += 1;
      }
    }

    return out;
  }

  public static void main(String[] args) {
    System.out.println(spiralOrder(new int[][] {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}));
  }
}
