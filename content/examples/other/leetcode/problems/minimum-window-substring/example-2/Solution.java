import java.util.HashMap;
import java.util.Map;

public class Solution {
  static String minWindow(String s, String t) {
    if (t.length() == 0) return "";
    Map<Character, Integer> need = new HashMap<>();
    for (int i = 0; i < t.length(); i += 1) {
      char ch = t.charAt(i);
      need.put(ch, need.getOrDefault(ch, 0) + 1);
    }

    Map<Character, Integer> window = new HashMap<>();
    int have = 0;
    int needKinds = need.size();
    int bestLen = Integer.MAX_VALUE;
    int bestLeft = 0;
    int left = 0;

    for (int right = 0; right < s.length(); right += 1) {
      char ch = s.charAt(right);
      window.put(ch, window.getOrDefault(ch, 0) + 1);
      if (need.containsKey(ch) && window.get(ch).intValue() == need.get(ch).intValue()) have += 1;

      while (have == needKinds) {
        int len = right - left + 1;
        if (len < bestLen) {
          bestLen = len;
          bestLeft = left;
        }
        char drop = s.charAt(left);
        window.put(drop, window.get(drop) - 1);
        if (need.containsKey(drop) && window.get(drop) < need.get(drop)) have -= 1;
        left += 1;
      }
    }

    return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestLeft, bestLeft + bestLen);
  }

  public static void main(String[] args) {
    System.out.println(minWindow("ADOBECODEBANC", "ABC"));
  }
}
