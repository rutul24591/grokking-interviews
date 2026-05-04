import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Solution {
  static List<Integer> topKFrequentSort(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int x : nums) freq.put(x, freq.getOrDefault(x, 0) + 1);
    List<Map.Entry<Integer, Integer>> entries = new ArrayList<>(freq.entrySet());
    entries.sort((a, b) -> Integer.compare(b.getValue(), a.getValue()));
    List<Integer> out = new ArrayList<>();
    for (int i = 0; i < k; i += 1) out.add(entries.get(i).getKey());
    return out;
  }

  public static void main(String[] args) {
    System.out.println(topKFrequentSort(new int[] {1, 1, 1, 2, 2, 3}, 2));
  }
}
