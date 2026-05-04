import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Solution {
  static List<List<String>> groupAnagramsSortKey(String[] strs) {
    Map<String, List<String>> groups = new HashMap<>();
    for (String s : strs) {
      char[] chars = s.toCharArray();
      Arrays.sort(chars);
      String key = new String(chars);
      groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
    }
    return new ArrayList<>(groups.values());
  }

  public static void main(String[] args) {
    System.out.println(
        groupAnagramsSortKey(new String[] {"eat", "tea", "tan", "ate", "nat", "bat"}));
  }
}
