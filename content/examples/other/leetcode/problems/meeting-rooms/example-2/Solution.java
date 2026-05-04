import java.util.Arrays;

public class Solution {
  static boolean canAttendMeetingsTwoArrays(int[][] intervals) {
    int n = intervals.length;
    int[] starts = new int[n];
    int[] ends = new int[n];
    for (int i = 0; i < n; i += 1) {
      starts[i] = intervals[i][0];
      ends[i] = intervals[i][1];
    }
    Arrays.sort(starts);
    Arrays.sort(ends);
    for (int i = 1; i < n; i += 1) {
      if (starts[i] < ends[i - 1]) return false;
    }
    return true;
  }

  public static void main(String[] args) {
    System.out.println(canAttendMeetingsTwoArrays(new int[][] {{0, 30}, {5, 10}, {15, 20}}));
    System.out.println(canAttendMeetingsTwoArrays(new int[][] {{7, 10}, {2, 4}}));
  }
}
