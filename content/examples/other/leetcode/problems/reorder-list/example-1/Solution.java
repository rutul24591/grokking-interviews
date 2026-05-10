import java.util.ArrayList;
import java.util.List;

public class Solution {
  static class ListNode {
    int val;
    ListNode next;

    ListNode(int val) {
      this.val = val;
    }

    ListNode(int val, ListNode next) {
      this.val = val;
      this.next = next;
    }
  }

  static void reorderListWithArray(ListNode head) {
    List<ListNode> nodes = new ArrayList<>();
    for (ListNode cur = head; cur != null; cur = cur.next) nodes.add(cur);
    int left = 0;
    int right = nodes.size() - 1;
    while (left < right) {
      nodes.get(left).next = nodes.get(right);
      left += 1;
      if (left == right) break;
      nodes.get(right).next = nodes.get(left);
      right -= 1;
    }
    if (!nodes.isEmpty()) nodes.get(left).next = null;
  }

  static List<Integer> toArray(ListNode head) {
    List<Integer> out = new ArrayList<>();
    for (ListNode cur = head; cur != null; cur = cur.next) out.add(cur.val);
    return out;
  }

  public static void main(String[] args) {
    ListNode a = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4))));
    reorderListWithArray(a);
    System.out.println(toArray(a));
  }
}
