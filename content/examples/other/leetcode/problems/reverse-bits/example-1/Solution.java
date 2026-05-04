public class Solution {
  static int reverseBitsScan(int n) {
    int result = 0;
    for (int i = 0; i < 32; i += 1) {
      result = (result << 1) | (n & 1);
      n >>>= 1;
    }
    return result;
  }

  public static void main(String[] args) {
    System.out.println(reverseBitsScan(0b00000010100101000001111010011100));
  }
}
