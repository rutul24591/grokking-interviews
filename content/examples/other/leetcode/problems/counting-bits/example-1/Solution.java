import java.util.Arrays;

public class Solution {
  static int[] countBitsNaive(int n) {
    int[] out = new int[n + 1];
    for (int i = 0; i <= n; i += 1) {
      int count = 0;
      for (int b = 0; b < 32; b += 1) count += (i >>> b) & 1;
      out[i] = count;
    }
    return out;
  }

  public static void main(String[] args) {
    System.out.println(Arrays.toString(countBitsNaive(5)));
  }
}
