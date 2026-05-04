import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Solution {
  static List<List<Integer>> threeSumBrute(int[] nums) {
    Set<String> seen = new HashSet<>();
    List<List<Integer>> out = new ArrayList<>();
    int n = nums.length;
    for (int i = 0; i < n; i += 1) {
      for (int j = i + 1; j < n; j += 1) {
        for (int k = j + 1; k < n; k += 1) {
          if (nums[i] + nums[j] + nums[k] == 0) {
            int[] t = new int[] {nums[i], nums[j], nums[k]};
            Arrays.sort(t);
            String key = t[0] + "," + t[1] + "," + t[2];
            if (seen.add(key)) {
              out.add(Arrays.asList(t[0], t[1], t[2]));
            }
          }
        }
      }
    }
    return out;
  }

  public static void main(String[] args) {
    System.out.println(threeSumBrute(new int[] {-1, 0, 1, 2, -1, -4}));
  }
}
