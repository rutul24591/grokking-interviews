import java.util.*;

public class Solution {
  public static int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
      int need = target - nums[i];
      if (seen.containsKey(need)) return new int[]{seen.get(need), i};
      seen.put(nums[i], i);
    }
    return null;
  }

  public static void main(String[] args) {
    System.out.println(Arrays.toString(twoSum(new int[]{2,7,11,15}, 9)));
  }
}
