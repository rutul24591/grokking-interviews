public class Solution {
  static boolean isPalindromeTwoPointers(String s) {
    int left = 0;
    int right = s.length() - 1;
    while (left < right) {
      while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left += 1;
      while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right -= 1;
      char a = Character.toLowerCase(s.charAt(left));
      char b = Character.toLowerCase(s.charAt(right));
      if (a != b) return false;
      left += 1;
      right -= 1;
    }
    return true;
  }

  public static void main(String[] args) {
    System.out.println(isPalindromeTwoPointers("A man, a plan, a canal: Panama"));
    System.out.println(isPalindromeTwoPointers("race a car"));
  }
}
