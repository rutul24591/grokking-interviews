public class Solution {
  static int findMinLinear(int[] nums) {
    int best = Integer.MAX_VALUE;
    for (int x : nums) best = Math.min(best, x);
    return best;
  }

  public static void main(String[] args) {
    System.out.println(findMinLinear(new int[] {3, 4, 5, 1, 2}));
  }
}
