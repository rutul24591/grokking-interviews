public class Solution {
  public static int maxSubArray(int[] nums) {
    int best = nums[0];
    int cur = nums[0];
    for (int i = 1; i < nums.length; i++) {
      cur = Math.max(nums[i], cur + nums[i]);
      best = Math.max(best, cur);
    }
    return best;
  }

  public static void main(String[] args) {
    System.out.println(maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4}));
  }
}
