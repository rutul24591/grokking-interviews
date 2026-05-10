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

  static ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode cur = head;
    while (cur != null) {
      ListNode next = cur.next;
      cur.next = prev;
      prev = cur;
      cur = next;
    }
    return prev;
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
    ListNode a = new ListNode(1, new ListNode(2, new ListNode(3)));
    System.out.println(toArray(reverseList(a)));
  }
}
