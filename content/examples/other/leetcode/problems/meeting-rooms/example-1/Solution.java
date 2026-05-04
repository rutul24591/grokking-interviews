import java.util.Arrays;

public class Solution {
  static boolean canAttendMeetingsSort(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    for (int i = 1; i < intervals.length; i += 1) {
      if (intervals[i][0] < intervals[i - 1][1]) return false;
    }
    return true;
  }

  public static void main(String[] args) {
    System.out.println(canAttendMeetingsSort(new int[][] {{0, 30}, {5, 10}, {15, 20}}));
    System.out.println(canAttendMeetingsSort(new int[][] {{7, 10}, {2, 4}}));
  }
}
