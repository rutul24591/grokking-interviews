import java.util.HashMap;
import java.util.Map;

public class Solution {
  static int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> last = new HashMap<>();
    int left = 0;
    int best = 0;
    for (int right = 0; right < s.length(); right += 1) {
      char ch = s.charAt(right);
      if (last.containsKey(ch)) left = Math.max(left, last.get(ch) + 1);
      last.put(ch, right);
      best = Math.max(best, right - left + 1);
    }
    return best;
  }

  public static void main(String[] args) {
    System.out.println(lengthOfLongestSubstring("abcabcbb"));
  }
}
