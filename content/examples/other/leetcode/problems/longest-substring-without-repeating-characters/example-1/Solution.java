import java.util.HashSet;
import java.util.Set;

public class Solution {
  static int lengthOfLongestSubstringBrute(String s) {
    int best = 0;
    for (int i = 0; i < s.length(); i += 1) {
      Set<Character> seen = new HashSet<>();
      for (int j = i; j < s.length(); j += 1) {
        char ch = s.charAt(j);
        if (seen.contains(ch)) break;
        seen.add(ch);
        best = Math.max(best, j - i + 1);
      }
    }
    return best;
  }

  public static void main(String[] args) {
    System.out.println(lengthOfLongestSubstringBrute("abcabcbb"));
  }
}
