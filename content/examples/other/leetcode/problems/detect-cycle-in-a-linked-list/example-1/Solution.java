import java.util.HashSet;
import java.util.Set;

public class Solution {
  static class ListNode {
    int val;
    ListNode next;

    ListNode(int val) {
      this.val = val;
    }
  }

  static boolean hasCycleHashSet(ListNode head) {
    Set<ListNode> seen = new HashSet<>();
    ListNode cur = head;
    while (cur != null) {
      if (seen.contains(cur)) return true;
      seen.add(cur);
      cur = cur.next;
    }
    return false;
  }

  public static void main(String[] args) {
    ListNode a = new ListNode(1);
    ListNode b = new ListNode(2);
    ListNode c = new ListNode(3);
    a.next = b;
    b.next = c;
    c.next = b;
    System.out.println(hasCycleHashSet(a));
  }
}
