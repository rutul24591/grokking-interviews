public class Solution {
  static int lengthOfLIS(int[] nums) {
    int[] tails = new int[nums.length];
    int size = 0;
    for (int x : nums) {
      int left = 0;
      int right = size;
      while (left < right) {
        int mid = left + (right - left) / 2;
        if (tails[mid] < x) left = mid + 1;
        else right = mid;
      }
      tails[left] = x;
      if (left == size) size += 1;
    }
    return size;
  }

  public static void main(String[] args) {
    System.out.println(lengthOfLIS(new int[] {10, 9, 2, 5, 3, 7, 101, 18}));
  }
}
