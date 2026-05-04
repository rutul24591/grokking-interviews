public class Solution {
  static int maxProductBrute(int[] nums) {
    int best = Integer.MIN_VALUE;
    for (int i = 0; i < nums.length; i += 1) {
      long product = 1;
      for (int j = i; j < nums.length; j += 1) {
        product *= nums[j];
        if (product > best) best = (int) product;
      }
    }
    return best;
  }

  public static void main(String[] args) {
    System.out.println(maxProductBrute(new int[] {2, 3, -2, 4}));
  }
}
