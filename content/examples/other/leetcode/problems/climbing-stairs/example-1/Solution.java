public class Solution {
  static int climbStairsNaive(int n) {
    if (n <= 2) return n;
    return climbStairsNaive(n - 1) + climbStairsNaive(n - 2);
  }

  public static void main(String[] args) {
    System.out.println(climbStairsNaive(5));
  }
}
