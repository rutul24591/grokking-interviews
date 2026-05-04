import java.util.*;

public class Solution {
  public static int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] out = new int[n];
    int prefix = 1;
    for (int i = 0; i < n; i++) {
      out[i] = prefix;
      prefix *= nums[i];
    }
    int suffix = 1;
    for (int i = n - 1; i >= 0; i--) {
      out[i] *= suffix;
      suffix *= nums[i];
    }
    return out;
  }

  public static void main(String[] args) {
    System.out.println(Arrays.toString(productExceptSelf(new int[]{1,2,3,4})));
  }
}
