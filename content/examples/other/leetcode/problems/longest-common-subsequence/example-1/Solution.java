public class Solution {
  static int lcsNaive(String text1, String text2) {
    return dfs(text1, text2, 0, 0);
  }

  static int dfs(String a, String b, int i, int j) {
    if (i == a.length() || j == b.length()) return 0;
    if (a.charAt(i) == b.charAt(j)) return 1 + dfs(a, b, i + 1, j + 1);
    return Math.max(dfs(a, b, i + 1, j), dfs(a, b, i, j + 1));
  }

  public static void main(String[] args) {
    System.out.println(lcsNaive("abcde", "ace"));
  }
}
