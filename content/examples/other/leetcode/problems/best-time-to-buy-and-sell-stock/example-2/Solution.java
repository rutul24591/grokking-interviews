public class Solution {
  public static int maxProfit(int[] prices) {
    int minSoFar = Integer.MAX_VALUE;
    int best = 0;
    for (int p : prices) {
      if (p < minSoFar) minSoFar = p;
      best = Math.max(best, p - minSoFar);
    }
    return best;
  }

  public static void main(String[] args) {
    System.out.println(maxProfit(new int[]{7,1,5,3,6,4}));
  }
}
