import java.util.*;

public class Solution {
  public static int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] out = new int[n];
    for (int i = 0; i < n; i++) {
      int prod = 1;
      for (int j = 0; j < n; j++) {
        if (i == j) continue;
        prod *= nums[j];
      }
      out[i] = prod;
    }
    return out;
  }

  public static void main(String[] args) {
    System.out.println(Arrays.toString(productExceptSelf(new int[]{1,2,3,4})));
  }
}
