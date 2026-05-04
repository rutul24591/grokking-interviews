import java.util.HashSet;
import java.util.Set;

public class Solution {
  static int longestConsecutiveHashSet(int[] nums) {
    Set<Integer> s = new HashSet<>();
    for (int x : nums) s.add(x);
    int best = 0;
    for (int x : s) {
      if (s.contains(x - 1)) continue;
      int cur = 1;
      while (s.contains(x + cur)) cur += 1;
      best = Math.max(best, cur);
    }
    return best;
  }

  public static void main(String[] args) {
    System.out.println(longestConsecutiveHashSet(new int[] {100, 4, 200, 1, 3, 2}));
  }
}
