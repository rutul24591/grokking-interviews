import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

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

  static ListNode mergeKListsHeap(ListNode[] lists) {
    PriorityQueue<ListNode> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a.val));
    for (ListNode head : lists) if (head != null) pq.add(head);

    ListNode dummy = new ListNode(0);
    ListNode tail = dummy;
    while (!pq.isEmpty()) {
      ListNode node = pq.remove();
      tail.next = node;
      tail = tail.next;
      if (node.next != null) pq.add(node.next);
    }
    tail.next = null;
    return dummy.next;
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
    System.out.println(toArray(mergeKListsHeap(new ListNode[] {a, b, c})));
  }
}
