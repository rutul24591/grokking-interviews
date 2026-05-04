import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Solution {
  static List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> out = new ArrayList<>();
    for (int i = 0; i < nums.length; i += 1) {
      if (i > 0 && nums[i] == nums[i - 1]) continue;
      int left = i + 1;
      int right = nums.length - 1;
      while (left < right) {
        int sum = nums[i] + nums[left] + nums[right];
        if (sum == 0) {
          out.add(Arrays.asList(nums[i], nums[left], nums[right]));
          left += 1;
          right -= 1;
          while (left < right && nums[left] == nums[left - 1]) left += 1;
          while (left < right && nums[right] == nums[right + 1]) right -= 1;
        } else if (sum < 0) {
          left += 1;
        } else {
          right -= 1;
        }
      }
    }
    return out;
  }

  public static void main(String[] args) {
    System.out.println(threeSum(new int[] {-1, 0, 1, 2, -1, -4}));
  }
}
