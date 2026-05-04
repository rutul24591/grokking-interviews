public class Solution {
  static int maxProduct(int[] nums) {
    if (nums.length == 0) return 0;
    int currentMax = nums[0];
    int currentMin = nums[0];
    int best = nums[0];

    for (int i = 1; i < nums.length; i += 1) {
      int x = nums[i];
      int a = x;
      int b = x * currentMax;
      int c = x * currentMin;
      int nextMax = Math.max(a, Math.max(b, c));
      int nextMin = Math.min(a, Math.min(b, c));
      currentMax = nextMax;
      currentMin = nextMin;
      best = Math.max(best, currentMax);
    }
    return best;
  }

  public static void main(String[] args) {
    System.out.println(maxProduct(new int[] {2, 3, -2, 4}));
  }
}
