public class Solution {
  static int searchLinear(int[] nums, int target) {
    for (int i = 0; i < nums.length; i += 1) {
      if (nums[i] == target) return i;
    }
    return -1;
  }

  public static void main(String[] args) {
    System.out.println(searchLinear(new int[] {4, 5, 6, 7, 0, 1, 2}, 0));
  }
}
