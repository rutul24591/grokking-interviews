public class Solution {
  static int missingNumber(int[] nums) {
    int x = 0;
    for (int i = 0; i <= nums.length; i += 1) x ^= i;
    for (int v : nums) x ^= v;
    return x;
  }

  public static void main(String[] args) {
    System.out.println(missingNumber(new int[] {3, 0, 1}));
  }
}
