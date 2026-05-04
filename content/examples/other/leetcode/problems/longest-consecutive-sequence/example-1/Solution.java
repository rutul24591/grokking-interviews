import java.util.Arrays;

public class Solution {
  static int longestConsecutiveSort(int[] nums) {
    if (nums.length == 0) return 0;
    Arrays.sort(nums);
    int best = 1;
    int cur = 1;
    for (int i = 1; i < nums.length; i += 1) {
      if (nums[i] == nums[i - 1]) continue;
      if (nums[i] == nums[i - 1] + 1) cur += 1;
      else cur = 1;
      best = Math.max(best, cur);
    }
    return best;
  }

  public static void main(String[] args) {
    System.out.println(longestConsecutiveSort(new int[] {100, 4, 200, 1, 3, 2}));
  }
}
