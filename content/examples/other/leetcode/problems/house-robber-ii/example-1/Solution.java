public class Solution {
  static int robLinearDP(int[] nums, int start, int end) {
    int prev2 = 0;
    int prev1 = 0;
    for (int i = start; i <= end; i += 1) {
      int cur = Math.max(prev1, prev2 + nums[i]);
      prev2 = prev1;
      prev1 = cur;
    }
    return prev1;
  }

  static int robHouseRobberII(int[] nums) {
    if (nums.length == 0) return 0;
    if (nums.length == 1) return nums[0];
    return Math.max(robLinearDP(nums, 0, nums.length - 2), robLinearDP(nums, 1, nums.length - 1));
  }

  public static void main(String[] args) {
    System.out.println(robHouseRobberII(new int[] {2, 3, 2}));
    System.out.println(robHouseRobberII(new int[] {1, 2, 3, 1}));
  }
}
