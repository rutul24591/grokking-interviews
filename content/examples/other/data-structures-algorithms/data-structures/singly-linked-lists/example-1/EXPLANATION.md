Example 1 is a production-style implementation demo for this data structure.

Implements a singly linked list to model an append-heavy event stream where traversal is sequential and inserts at the tail dominate.

It demonstrates:
- tail append stays O(1) with an explicit tail pointer
- removing by id rewires only predecessor.next
- traversal is naturally sequential from head to tail
