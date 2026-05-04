import java.util.Arrays;

public class Solution {
  static int[] countBits(int n) {
    int[] out = new int[n + 1];
    for (int i = 1; i <= n; i += 1) {
      out[i] = out[i >> 1] + (i & 1);
    }
    return out;
  }

  public static void main(String[] args) {
    System.out.println(Arrays.toString(countBits(5)));
  }
}
