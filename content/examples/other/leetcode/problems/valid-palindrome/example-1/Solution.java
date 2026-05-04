public class Solution {
  static boolean isPalindromeFiltered(String s) {
    String cleaned = s.toLowerCase().replaceAll("[^a-z0-9]", "");
    int left = 0;
    int right = cleaned.length() - 1;
    while (left < right) {
      if (cleaned.charAt(left) != cleaned.charAt(right)) return false;
      left += 1;
      right -= 1;
    }
    return true;
  }

  public static void main(String[] args) {
    System.out.println(isPalindromeFiltered("A man, a plan, a canal: Panama"));
    System.out.println(isPalindromeFiltered("race a car"));
  }
}
