public class Solution {
  static int getSumBitByBit(int a, int b) {
    int result = 0;
    int carry = 0;
    for (int i = 0; i < 32; i += 1) {
      int abit = (a >>> i) & 1;
      int bbit = (b >>> i) & 1;
      int sum = abit ^ bbit ^ carry;
      carry = (abit & bbit) | (abit & carry) | (bbit & carry);
      result |= (sum << i);
    }
    return result;
  }

  public static void main(String[] args) {
    System.out.println(getSumBitByBit(1, 2));
    System.out.println(getSumBitByBit(-4, 7));
  }
}
