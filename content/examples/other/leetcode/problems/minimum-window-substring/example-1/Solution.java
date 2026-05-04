import java.util.HashMap;
import java.util.Map;

public class Solution {
  static boolean covers(String sub, String t) {
    Map<Character, Integer> need = new HashMap<>();
    for (int i = 0; i < t.length(); i += 1) {
      char ch = t.charAt(i);
      need.put(ch, need.getOrDefault(ch, 0) + 1);
    }
    for (int i = 0; i < sub.length(); i += 1) {
      char ch = sub.charAt(i);
      if (!need.containsKey(ch)) continue;
      int next = need.get(ch) - 1;
      if (next == 0) need.remove(ch);
      else need.put(ch, next);
    }
    return need.isEmpty();
  }

  static String minWindowBrute(String s, String t) {
    String best = "";
    for (int i = 0; i < s.length(); i += 1) {
      for (int j = i; j < s.length(); j += 1) {
        String sub = s.substring(i, j + 1);
        if (!best.isEmpty() && sub.length() >= best.length()) continue;
        if (covers(sub, t)) best = sub;
      }
    }
    return best;
  }

  public static void main(String[] args) {
    System.out.println(minWindowBrute("ADOBECODEBANC", "ABC"));
  }
}
