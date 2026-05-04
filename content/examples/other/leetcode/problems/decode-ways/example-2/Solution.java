public class Solution {
  static int numDecodings(String s) {
    if (s.length() == 0) return 0;
    int dp2 = 1;
    int dp1 = s.charAt(0) == '0' ? 0 : 1;
    for (int i = 2; i <= s.length(); i += 1) {
      int cur = 0;
      if (s.charAt(i - 1) != '0') cur += dp1;
      int two = Integer.parseInt(s.substring(i - 2, i));
      if (two >= 10 && two <= 26) cur += dp2;
      dp2 = dp1;
      dp1 = cur;
    }
    return dp1;
  }

  public static void main(String[] args) {
    System.out.println(numDecodings("226"));
  }
}
