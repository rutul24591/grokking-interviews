import java.util.Arrays;

public class Solution {
  static int uniquePaths1D(int m, int n) {
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    for (int r = 1; r < m; r += 1) {
      for (int c = 1; c < n; c += 1) dp[c] = dp[c] + dp[c - 1];
    }
    return dp[n - 1];
  }

  public static void main(String[] args) {
    System.out.println(uniquePaths1D(3, 7));
  }
}
