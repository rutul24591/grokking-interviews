public class Solution {
  static int hammingWeight(int n) {
    int count = 0;
    while (n != 0) {
      n &= (n - 1);
      count += 1;
    }
    return count;
  }

  public static void main(String[] args) {
    System.out.println(hammingWeight(0b00000000000000000000000000001011));
  }
}
