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

  static ListNode removeNthFromEndTwoPass(ListNode head, int n) {
    int len = 0;
    for (ListNode cur = head; cur != null; cur = cur.next) len += 1;
    int removeIndex = len - n;
    if (removeIndex == 0) return head.next;
    ListNode cur = head;
    for (int i = 0; i < removeIndex - 1; i += 1) cur = cur.next;
    cur.next = (cur.next != null) ? cur.next.next : null;
    return head;
  }

  static List<Integer> toArray(ListNode head) {
    List<Integer> out = new ArrayList<>();
    for (ListNode cur = head; cur != null; cur = cur.next) out.add(cur.val);
    return out;
  }

  public static void main(String[] args) {
    ListNode a = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5)))));
    System.out.println(toArray(removeNthFromEndTwoPass(a, 2)));
  }
}
