import java.util.HashSet;
import java.util.Set;

public class Solution {
  static boolean wordBreak(String s, String[] wordDict) {
    Set<String> words = new HashSet<>();
    for (String w : wordDict) words.add(w);
    boolean[] dp = new boolean[s.length() + 1];
    dp[0] = true;
    for (int i = 1; i <= s.length(); i += 1) {
      for (int j = 0; j < i; j += 1) {
        if (dp[j] && words.contains(s.substring(j, i))) {
          dp[i] = true;
          break;
        }
      }
    }
    return dp[s.length()];
  }

  public static void main(String[] args) {
    System.out.println(wordBreak("leetcode", new String[] {"leet", "code"}));
  }
}
