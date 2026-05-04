import java.util.Arrays;
import java.util.PriorityQueue;

public class Solution {
  static int minMeetingRoomsHeap(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    PriorityQueue<Integer> pq = new PriorityQueue<>();
    for (int[] it : intervals) {
      int start = it[0];
      int end = it[1];
      if (!pq.isEmpty() && start >= pq.peek()) pq.remove();
      pq.add(end);
    }
    return pq.size();
  }

  public static void main(String[] args) {
    System.out.println(minMeetingRoomsHeap(new int[][] {{0, 30}, {5, 10}, {15, 20}}));
    System.out.println(minMeetingRoomsHeap(new int[][] {{7, 10}, {2, 4}}));
  }
}
