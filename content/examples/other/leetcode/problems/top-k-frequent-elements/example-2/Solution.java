import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Solution {
  static List<Integer> topKFrequentBucket(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);

    List<List<Integer>> buckets = new ArrayList<>();
    for (int i = 0; i <= nums.length; i += 1) buckets.add(new ArrayList<>());
    for (Map.Entry<Integer, Integer> e : freq.entrySet()) buckets.get(e.getValue()).add(e.getKey());

    List<Integer> out = new ArrayList<>();
    for (int c = buckets.size() - 1; c >= 0 && out.size() < k; c -= 1) {
      for (int num : buckets.get(c)) {
        out.add(num);
        if (out.size() == k) break;
      }
    }
    return out;
  }

  public static void main(String[] args) {
    System.out.println(topKFrequentBucket(new int[] {1, 1, 1, 2, 2, 3}, 2));
  }
}
