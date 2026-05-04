import java.util.Arrays;

public class Solution {
  static int eraseOverlapIntervalsSortEnd(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
    int kept = 0;
    int prevEnd = Integer.MIN_VALUE;
    for (int[] it : intervals) {
      int s = it[0];
      int e = it[1];
      if (s >= prevEnd) {
        kept += 1;
        prevEnd = e;
      }
    }
    return intervals.length - kept;
  }

  public static void main(String[] args) {
    System.out.println(
        eraseOverlapIntervalsSortEnd(new int[][] {{1, 2}, {2, 3}, {3, 4}, {1, 3}}));
  }
}
