public class Solution {
  static boolean isAnagramCounts(String s, String t) {
    if (s.length() != t.length()) return false;
    int[] counts = new int[26];
    for (int i = 0; i < s.length(); i += 1) {
      counts[s.charAt(i) - 'a'] += 1;
      counts[t.charAt(i) - 'a'] -= 1;
    }
    for (int x : counts) if (x != 0) return false;
    return true;
  }

  public static void main(String[] args) {
    System.out.println(isAnagramCounts("anagram", "nagaram"));
    System.out.println(isAnagramCounts("rat", "car"));
  }
}
