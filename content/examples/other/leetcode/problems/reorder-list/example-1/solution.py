class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def reorder_list_with_array(head):
    nodes = []
    cur = head
    while cur:
        nodes.append(cur)
        cur = cur.next
    left, right = 0, len(nodes) - 1
    while left < right:
        nodes[left].next = nodes[right]
        left += 1
        if left == right:
            break
        nodes[right].next = nodes[left]
        right -= 1
    if nodes:
        nodes[left].next = None
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
    reorder_list_with_array(a)
    print(to_array(a))
