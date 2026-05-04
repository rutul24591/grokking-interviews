import heapq


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def merge_k_lists_heap(lists):
    heap = []
    seq = 0
    for head in lists:
        if head is not None:
            heapq.heappush(heap, (head.val, seq, head))
            seq += 1

    dummy = ListNode(0)
    tail = dummy
    while heap:
        _, _, node = heapq.heappop(heap)
        tail.next = node
        tail = tail.next
        if node.next is not None:
            heapq.heappush(heap, (node.next.val, seq, node.next))
            seq += 1
    tail.next = None
    return dummy.next


def to_array(head):
    out = []
    cur = head
    while cur:
        out.append(cur.val)
        cur = cur.next
    return out


if __name__ == "__main__":
    a = ListNode(1, ListNode(4, ListNode(5)))
    b = ListNode(1, ListNode(3, ListNode(4)))
    c = ListNode(2, ListNode(6))
    print(to_array(merge_k_lists_heap([a, b, c])))
