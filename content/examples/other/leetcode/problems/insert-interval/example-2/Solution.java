import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Solution {
  static int[][] insertInterval(int[][] intervals, int[] newInterval) {
    List<int[]> out = new ArrayList<>();
    int ns = newInterval[0];
    int ne = newInterval[1];
    for (int[] it : intervals) {
      int s = it[0];
      int e = it[1];
      if (e < ns) out.add(new int[] {s, e});
      else if (s > ne) {
        out.add(new int[] {ns, ne});
        ns = s;
        ne = e;
      } else {
        ns = Math.min(ns, s);
        ne = Math.max(ne, e);
      }
    }
    out.add(new int[] {ns, ne});
    return out.toArray(new int[0][]);
  }

  public static void main(String[] args) {
    System.out.println(Arrays.deepToString(insertInterval(new int[][] {{1, 3}, {6, 9}}, new int[] {2, 5})));
  }
}
