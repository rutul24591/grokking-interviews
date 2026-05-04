public class Solution {
  static int lengthOfLISDP(int[] nums) {
    int[] dp = new int[nums.length];
    for (int i = 0; i < dp.length; i += 1) dp[i] = 1;
    int best = 0;
    for (int i = 0; i < nums.length; i += 1) {
      for (int j = 0; j < i; j += 1) {
        if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
      }
      best = Math.max(best, dp[i]);
    }
    return best;
  }

  public static void main(String[] args) {
    System.out.println(lengthOfLISDP(new int[] {10, 9, 2, 5, 3, 7, 101, 18}));
  }
}
