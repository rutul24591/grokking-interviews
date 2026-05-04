import java.util.Arrays;

public class Solution {
  static int missingNumberSort(int[] nums) {
    Arrays.sort(nums);
    for (int i = 0; i < nums.length; i += 1) {
      if (nums[i] != i) return i;
    }
    return nums.length;
  }

  public static void main(String[] args) {
    System.out.println(missingNumberSort(new int[] {3, 0, 1}));
  }
}
