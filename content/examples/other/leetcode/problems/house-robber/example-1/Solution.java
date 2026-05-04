import java.util.HashMap;
import java.util.Map;

public class Solution {
  static int robTopDown(int[] nums) {
    Map<Integer, Integer> memo = new HashMap<>();
    return dfs(nums, 0, memo);
  }

  static int dfs(int[] nums, int i, Map<Integer, Integer> memo) {
    if (i >= nums.length) return 0;
    if (memo.containsKey(i)) return memo.get(i);
    int best = Math.max(dfs(nums, i + 1, memo), nums[i] + dfs(nums, i + 2, memo));
    memo.put(i, best);
    return best;
  }

  public static void main(String[] args) {
    System.out.println(robTopDown(new int[] {1, 2, 3, 1}));
  }
}
