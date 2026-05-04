import java.util.Arrays;

public class Solution {
  static int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, 1_000_000);
    dp[0] = 0;
    for (int a = 1; a <= amount; a += 1) {
      for (int c : coins) {
        if (a - c >= 0) dp[a] = Math.min(dp[a], dp[a - c] + 1);
      }
    }
    return dp[amount] >= 1_000_000 ? -1 : dp[amount];
  }

  public static void main(String[] args) {
    System.out.println(coinChange(new int[] {1, 2, 5}, 11));
  }
}
