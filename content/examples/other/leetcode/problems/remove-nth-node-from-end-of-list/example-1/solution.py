class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def remove_nth_from_end_two_pass(head, n):
    length = 0
    cur = head
    while cur:
        length += 1
        cur = cur.next
    remove_index = length - n
    if remove_index == 0:
        return head.next
    cur = head
    for _ in range(remove_index - 1):
        cur = cur.next
    cur.next = cur.next.next if cur.next else None
    return head


def to_array(head):
    out = []
    cur = head
    while cur:
        out.append(cur.val)
        cur = cur.next
    return out


if __name__ == "__main__":
    a = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))
    print(to_array(remove_nth_from_end_two_pass(a, 2)))
