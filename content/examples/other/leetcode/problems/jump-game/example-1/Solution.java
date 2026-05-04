public class Solution {
  static boolean canJumpDP(int[] nums) {
    boolean[] good = new boolean[nums.length];
    good[nums.length - 1] = true;
    for (int i = nums.length - 2; i >= 0; i -= 1) {
      int farthest = Math.min(nums.length - 1, i + nums[i]);
      for (int j = i + 1; j <= farthest; j += 1) {
        if (good[j]) {
          good[i] = true;
          break;
        }
      }
    }
    return good[0];
  }

  public static void main(String[] args) {
    System.out.println(canJumpDP(new int[] {2, 3, 1, 1, 4}));
    System.out.println(canJumpDP(new int[] {3, 2, 1, 0, 4}));
  }
}
