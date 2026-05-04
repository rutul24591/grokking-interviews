import java.util.*;

public class Solution {
  public static boolean containsDuplicate(int[] nums) {
    HashSet<Integer> s = new HashSet<>();
    for (int x : nums) {
      if (s.contains(x)) return true;
      s.add(x);
    }
    return false;
  }

  public static void main(String[] args) {
    System.out.println(containsDuplicate(new int[]{1,2,3,1}));
  }
}
