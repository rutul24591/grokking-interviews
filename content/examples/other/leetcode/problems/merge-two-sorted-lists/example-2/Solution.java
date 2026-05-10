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

  static ListNode mergeTwoListsRecursive(ListNode l1, ListNode l2) {
    if (l1 == null) return l2;
    if (l2 == null) return l1;
    if (l1.val <= l2.val) {
      l1.next = mergeTwoListsRecursive(l1.next, l2);
      return l1;
    }
    l2.next = mergeTwoListsRecursive(l1, l2.next);
    return l2;
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
    ListNode a = new ListNode(1, new ListNode(2, new ListNode(4)));
    ListNode b = new ListNode(1, new ListNode(3, new ListNode(4)));
    System.out.println(toArray(mergeTwoListsRecursive(a, b)));
  }
}
