import java.util.ArrayList;
import java.util.Arrays;
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

  static ListNode mergeTwo(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0);
    ListNode tail = dummy;
    while (l1 != null && l2 != null) {
      if (l1.val <= l2.val) {
        tail.next = l1;
        l1 = l1.next;
      } else {
        tail.next = l2;
        l2 = l2.next;
      }
      tail = tail.next;
    }
    tail.next = (l1 != null) ? l1 : l2;
    return dummy.next;
  }

  static ListNode mergeKListsPairwise(ListNode[] lists) {
    ListNode merged = null;
    for (ListNode head : lists) merged = mergeTwo(merged, head);
    return merged;
  }

  static List<Integer> toArray(ListNode head) {
    List<Integer> out = new ArrayList<>();
    ListNode cur = head;
    while (cur != null) {
      out.add(cur.val);
      cur = cur.next;
    }
    return out;
  }

  public static void main(String[] args) {
    ListNode a = new ListNode(1, new ListNode(4, new ListNode(5)));
    ListNode b = new ListNode(1, new ListNode(3, new ListNode(4)));
    ListNode c = new ListNode(2, new ListNode(6));
    System.out.println(toArray(mergeKListsPairwise(new ListNode[] {a, b, c})));
  }
}
