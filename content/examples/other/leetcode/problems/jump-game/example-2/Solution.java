public class Solution {
  static boolean canJumpGreedy(int[] nums) {
    int farthest = 0;
    for (int i = 0; i < nums.length; i += 1) {
      if (i > farthest) return false;
      farthest = Math.max(farthest, i + nums[i]);
    }
    return true;
  }

  public static void main(String[] args) {
    System.out.println(canJumpGreedy(new int[] {2, 3, 1, 1, 4}));
    System.out.println(canJumpGreedy(new int[] {3, 2, 1, 0, 4}));
  }
}
