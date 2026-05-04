import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Solution {
  static List<List<String>> groupAnagramsCountKey(String[] strs) {
    Map<String, List<String>> groups = new HashMap<>();
    for (String s : strs) {
      int[] counts = new int[26];
      for (int i = 0; i < s.length(); i += 1) counts[s.charAt(i) - 'a'] += 1;
      String key = Arrays.toString(counts);
      groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
    }
    return new ArrayList<>(groups.values());
  }

  public static void main(String[] args) {
    System.out.println(
        groupAnagramsCountKey(new String[] {"eat", "tea", "tan", "ate", "nat", "bat"}));
  }
}
