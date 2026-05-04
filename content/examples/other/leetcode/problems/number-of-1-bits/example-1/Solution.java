public class Solution {
  static int hammingWeightScan(int n) {
    int count = 0;
    for (int i = 0; i < 32; i += 1) {
      count += (n >>> i) & 1;
    }
    return count;
  }

  public static void main(String[] args) {
    System.out.println(hammingWeightScan(0b00000000000000000000000000001011));
  }
}
