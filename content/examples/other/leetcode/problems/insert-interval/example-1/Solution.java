import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Solution {
  static int[][] insertIntervalLinear(int[][] intervals, int[] newInterval) {
    List<int[]> out = new ArrayList<>();
    int ns = newInterval[0];
    int ne = newInterval[1];
    int i = 0;

    while (i < intervals.length && intervals[i][1] < ns) {
      out.add(intervals[i]);
      i += 1;
    }

    while (i < intervals.length && intervals[i][0] <= ne) {
      ns = Math.min(ns, intervals[i][0]);
      ne = Math.max(ne, intervals[i][1]);
      i += 1;
    }
    out.add(new int[] {ns, ne});

    while (i < intervals.length) {
      out.add(intervals[i]);
      i += 1;
    }

    return out.toArray(new int[0][]);
  }

  public static void main(String[] args) {
    System.out.println(Arrays.deepToString(insertIntervalLinear(new int[][] {{1, 3}, {6, 9}}, new int[] {2, 5})));
  }
}
