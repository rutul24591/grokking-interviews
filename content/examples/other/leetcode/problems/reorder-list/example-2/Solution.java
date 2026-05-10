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

  static void reorderList(ListNode head) {
    if (head == null || head.next == null) return;

    ListNode slow = head;
    ListNode fast = head;
    while (fast != null && fast.next != null) {
      slow = slow.next;
      fast = fast.next.next;
    }

    ListNode prev = null;
    ListNode cur = slow;
    while (cur != null) {
      ListNode nxt = cur.next;
      cur.next = prev;
      prev = cur;
      cur = nxt;
    }

    ListNode first = head;
    ListNode second = prev;
    while (second != null && first != null) {
      ListNode t1 = first.next;
      ListNode t2 = second.next;
      first.next = second;
      if (t1 == null) break;
      second.next = t1;
      first = t1;
      second = t2;
    }
    if (first != null) first.next = null;
  }

  static List<Integer> toArray(ListNode head) {
    List<Integer> out = new ArrayList<>();
    for (ListNode cur = head; cur != null; cur = cur.next) out.add(cur.val);
    return out;
  }

  public static void main(String[] args) {
    ListNode a = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4))));
    reorderList(a);
    System.out.println(toArray(a));
  }
}
