import java.util.Arrays;

public class Solution {
  static int eraseOverlapIntervalsSortStart(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    if (intervals.length == 0) return 0;
    int removed = 0;
    int prevEnd = intervals[0][1];
    for (int i = 1; i < intervals.length; i += 1) {
      int s = intervals[i][0];
      int e = intervals[i][1];
      if (s < prevEnd) {
        removed += 1;
        prevEnd = Math.min(prevEnd, e);
      } else {
        prevEnd = e;
      }
    }
    return removed;
  }

  public static void main(String[] args) {
    System.out.println(
        eraseOverlapIntervalsSortStart(new int[][] {{1, 2}, {2, 3}, {3, 4}, {1, 3}}));
  }
}
