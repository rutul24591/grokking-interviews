import java.util.*;

public class Solution {
  public static boolean containsDuplicate(int[] nums) {
    Arrays.sort(nums);
    for (int i = 1; i < nums.length; i++) {
      if (nums[i] == nums[i-1]) return true;
    }
    return false;
  }

  public static void main(String[] args) {
    System.out.println(containsDuplicate(new int[]{1,2,3,1}));
  }
}
