class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def merge_two(l1, l2):
    dummy = ListNode(0)
    tail = dummy
    while l1 and l2:
        if l1.val <= l2.val:
            tail.next = l1
            l1 = l1.next
        else:
            tail.next = l2
            l2 = l2.next
        tail = tail.next
    tail.next = l1 or l2
    return dummy.next


def merge_k_lists_pairwise(lists):
    merged = None
    for head in lists:
        merged = merge_two(merged, head)
    return merged


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
    print(to_array(merge_k_lists_pairwise([a, b, c])))
