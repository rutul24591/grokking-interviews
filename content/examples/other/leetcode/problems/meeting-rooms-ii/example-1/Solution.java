import java.util.Arrays;

public class Solution {
  static int minMeetingRoomsTwoArrays(int[][] intervals) {
    int n = intervals.length;
    int[] starts = new int[n];
    int[] ends = new int[n];
    for (int i = 0; i < n; i += 1) {
      starts[i] = intervals[i][0];
      ends[i] = intervals[i][1];
    }
    Arrays.sort(starts);
    Arrays.sort(ends);
    int rooms = 0;
    int endIndex = 0;
    for (int i = 0; i < n; i += 1) {
      if (starts[i] < ends[endIndex]) rooms += 1;
      else endIndex += 1;
    }
    return rooms;
  }

  public static void main(String[] args) {
    System.out.println(minMeetingRoomsTwoArrays(new int[][] {{0, 30}, {5, 10}, {15, 20}}));
    System.out.println(minMeetingRoomsTwoArrays(new int[][] {{7, 10}, {2, 4}}));
  }
}
