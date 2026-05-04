public class Solution {
  static int rob(int[] nums) {
    int prev2 = 0;
    int prev1 = 0;
    for (int x : nums) {
      int cur = Math.max(prev1, prev2 + x);
      prev2 = prev1;
      prev1 = cur;
    }
    return prev1;
  }

  public static void main(String[] args) {
    System.out.println(rob(new int[] {1, 2, 3, 1}));
  }
}
