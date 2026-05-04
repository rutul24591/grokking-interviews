public class Solution {
  static int maxArea(int[] height) {
    int left = 0;
    int right = height.length - 1;
    int best = 0;
    while (left < right) {
      int area = Math.min(height[left], height[right]) * (right - left);
      if (area > best) best = area;
      if (height[left] < height[right]) left += 1;
      else right -= 1;
    }
    return best;
  }

  public static void main(String[] args) {
    System.out.println(maxArea(new int[] {1, 8, 6, 2, 5, 4, 8, 3, 7}));
  }
}
