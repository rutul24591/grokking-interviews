public class Solution {
  static String longestPalindrome(String s) {
    int[] best = new int[] {0, 0};
    for (int i = 0; i < s.length(); i += 1) {
      expand(s, i, i, best);
      expand(s, i, i + 1, best);
    }
    return s.substring(best[0], best[1] + 1);
  }

  static void expand(String s, int left, int right, int[] best) {
    while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
      left -= 1;
      right += 1;
    }
    int L = left + 1;
    int R = right - 1;
    if (R - L > best[1] - best[0]) {
      best[0] = L;
      best[1] = R;
    }
  }

  public static void main(String[] args) {
    System.out.println(longestPalindrome("babad"));
  }
}
