import java.util.HashMap;
import java.util.Map;

public class Solution {
  static int coinChangeTopDown(int[] coins, int amount) {
    Map<Integer, Integer> memo = new HashMap<>();
    int res = dfs(coins, amount, memo);
    return res >= 1_000_000 ? -1 : res;
  }

  static int dfs(int[] coins, int remaining, Map<Integer, Integer> memo) {
    if (remaining == 0) return 0;
    if (remaining < 0) return 1_000_000;
    if (memo.containsKey(remaining)) return memo.get(remaining);
    int best = 1_000_000;
    for (int c : coins) {
      int sub = dfs(coins, remaining - c, memo);
      if (sub < 1_000_000) best = Math.min(best, sub + 1);
    }
    memo.put(remaining, best);
    return best;
  }

  public static void main(String[] args) {
    System.out.println(coinChangeTopDown(new int[] {1, 2, 5}, 11));
  }
}
