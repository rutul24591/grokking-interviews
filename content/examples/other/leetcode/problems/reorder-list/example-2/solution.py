class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def reorder_list(head):
    if head is None or head.next is None:
        return head

    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    prev = None
    cur = slow
    while cur:
        nxt = cur.next
        cur.next = prev
        prev = cur
        cur = nxt

    first = head
    second = prev
    while second and first:
        t1 = first.next
        t2 = second.next
        first.next = second
        if t1 is None:
            break
        second.next = t1
        first = t1
        second = t2

    if first:
        first.next = None
    return head


def to_array(head):
    out = []
    cur = head
    while cur:
        out.append(cur.val)
        cur = cur.next
    return out


if __name__ == "__main__":
    a = ListNode(1, ListNode(2, ListNode(3, ListNode(4))))
    reorder_list(a)
    print(to_array(a))
