import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Solution {
  static int[][] mergeIntervalsSort(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> merged = new ArrayList<>();
    for (int[] it : intervals) {
      if (merged.isEmpty() || it[0] > merged.get(merged.size() - 1)[1]) merged.add(new int[] {it[0], it[1]});
      else merged.get(merged.size() - 1)[1] = Math.max(merged.get(merged.size() - 1)[1], it[1]);
    }
    return merged.toArray(new int[0][]);
  }

  public static void main(String[] args) {
    int[][] out = mergeIntervalsSort(new int[][] {{1, 3}, {2, 6}, {8, 10}, {15, 18}});
    System.out.println(Arrays.deepToString(out));
  }
}
