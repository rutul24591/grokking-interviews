public class Solution {
  static int expand(String s, int left, int right) {
    int count = 0;
    while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
      count += 1;
      left -= 1;
      right += 1;
    }
    return count;
  }

  static int countSubstrings(String s) {
    int total = 0;
    for (int i = 0; i < s.length(); i += 1) {
      total += expand(s, i, i);
      total += expand(s, i, i + 1);
    }
    return total;
  }

  public static void main(String[] args) {
    System.out.println(countSubstrings("aaa"));
  }
}
