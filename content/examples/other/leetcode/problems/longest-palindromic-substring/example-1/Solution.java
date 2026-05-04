public class Solution {
  static boolean isPal(String s, int left, int right) {
    while (left < right) {
      if (s.charAt(left) != s.charAt(right)) return false;
      left += 1;
      right -= 1;
    }
    return true;
  }

  static String longestPalindromeBrute(String s) {
    int bestL = 0;
    int bestR = -1;
    for (int i = 0; i < s.length(); i += 1) {
      for (int j = i; j < s.length(); j += 1) {
        if (j - i <= bestR - bestL) continue;
        if (isPal(s, i, j)) {
          bestL = i;
          bestR = j;
        }
      }
    }
    return s.substring(bestL, bestR + 1);
  }

  public static void main(String[] args) {
    System.out.println(longestPalindromeBrute("babad"));
  }
}
