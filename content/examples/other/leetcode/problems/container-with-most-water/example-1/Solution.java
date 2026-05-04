public class Solution {
  static int maxAreaBrute(int[] height) {
    int best = 0;
    for (int i = 0; i < height.length; i += 1) {
      for (int j = i + 1; j < height.length; j += 1) {
        int area = Math.min(height[i], height[j]) * (j - i);
        if (area > best) best = area;
      }
    }
    return best;
  }

  public static void main(String[] args) {
    System.out.println(
        maxAreaBrute(new int[] {1, 8, 6, 2, 5, 4, 8, 3, 7}));
  }
}
