public class Solution {
  static boolean isPal(String s, int left, int right) {
    while (left < right) {
      if (s.charAt(left) != s.charAt(right)) return false;
      left += 1;
      right -= 1;
    }
    return true;
  }

  static int countSubstringsBrute(String s) {
    int count = 0;
    for (int i = 0; i < s.length(); i += 1) {
      for (int j = i; j < s.length(); j += 1) {
        if (isPal(s, i, j)) count += 1;
      }
    }
    return count;
  }

  public static void main(String[] args) {
    System.out.println(countSubstringsBrute("aaa"));
  }
}
