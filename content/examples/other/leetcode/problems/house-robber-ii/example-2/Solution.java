public class Solution {
  static int robLinear(int[] nums, int start, int end) {
    int take = 0;
    int skip = 0;
    for (int i = start; i <= end; i += 1) {
      int nextTake = skip + nums[i];
      int nextSkip = Math.max(skip, take);
      take = nextTake;
      skip = nextSkip;
    }
    return Math.max(take, skip);
  }

  static int rob(int[] nums) {
    if (nums.length == 0) return 0;
    if (nums.length == 1) return nums[0];
    return Math.max(robLinear(nums, 0, nums.length - 2), robLinear(nums, 1, nums.length - 1));
  }

  public static void main(String[] args) {
    System.out.println(rob(new int[] {2, 3, 2}));
    System.out.println(rob(new int[] {1, 2, 3, 1}));
  }
}
