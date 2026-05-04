import java.util.HashMap;
import java.util.Map;

public class Solution {
  static int numDecodingsTopDown(String s) {
    Map<Integer, Integer> memo = new HashMap<>();
    return dfs(s, 0, memo);
  }

  static int dfs(String s, int i, Map<Integer, Integer> memo) {
    if (i == s.length()) return 1;
    if (s.charAt(i) == '0') return 0;
    if (memo.containsKey(i)) return memo.get(i);

    int ways = dfs(s, i + 1, memo);
    if (i + 1 < s.length()) {
      int two = Integer.parseInt(s.substring(i, i + 2));
      if (two >= 10 && two <= 26) ways += dfs(s, i + 2, memo);
    }
    memo.put(i, ways);
    return ways;
  }

  public static void main(String[] args) {
    System.out.println(numDecodingsTopDown("226"));
  }
}
