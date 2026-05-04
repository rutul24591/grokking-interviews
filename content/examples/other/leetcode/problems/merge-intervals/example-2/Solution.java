import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Solution {
  static int[][] mergeIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> out = new ArrayList<>();
    for (int[] it : intervals) {
      if (out.isEmpty() || it[0] > out.get(out.size() - 1)[1]) out.add(new int[] {it[0], it[1]});
      else out.get(out.size() - 1)[1] = Math.max(out.get(out.size() - 1)[1], it[1]);
    }
    return out.toArray(new int[0][]);
  }

  public static void main(String[] args) {
    System.out.println(Arrays.deepToString(mergeIntervals(new int[][] {{1, 3}, {2, 6}, {8, 10}, {15, 18}})));
  }
}
