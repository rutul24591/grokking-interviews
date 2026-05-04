import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class Solution {
  static boolean wordBreakTopDown(String s, String[] wordDict) {
    Set<String> words = new HashSet<>();
    for (String w : wordDict) words.add(w);
    Map<Integer, Boolean> memo = new HashMap<>();
    return dfs(s, 0, words, memo);
  }

  static boolean dfs(String s, int i, Set<String> words, Map<Integer, Boolean> memo) {
    if (i == s.length()) return true;
    if (memo.containsKey(i)) return memo.get(i);
    for (int j = i + 1; j <= s.length(); j += 1) {
      String piece = s.substring(i, j);
      if (words.contains(piece) && dfs(s, j, words, memo)) {
        memo.put(i, true);
        return true;
      }
    }
    memo.put(i, false);
    return false;
  }

  public static void main(String[] args) {
    System.out.println(wordBreakTopDown("leetcode", new String[] {"leet", "code"}));
  }
}
