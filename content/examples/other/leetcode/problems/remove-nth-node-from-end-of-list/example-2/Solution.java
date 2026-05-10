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

  static ListNode removeNthFromEndOnePass(ListNode head, int n) {
    ListNode dummy = new ListNode(0, head);
    ListNode fast = dummy;
    ListNode slow = dummy;
    for (int i = 0; i < n; i += 1) fast = fast.next;
    while (fast.next != null) {
      fast = fast.next;
      slow = slow.next;
    }
    slow.next = (slow.next != null) ? slow.next.next : null;
    return dummy.next;
  }

  static List<Integer> toArray(ListNode head) {
    List<Integer> out = new ArrayList<>();
    for (ListNode cur = head; cur != null; cur = cur.next) out.add(cur.val);
    return out;
  }

  public static void main(String[] args) {
    ListNode a = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5)))));
    System.out.println(toArray(removeNthFromEndOnePass(a, 2)));
  }
}
