class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class SinglyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  append(value) {
    const node = new Node(value);
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.size += 1;
  }

  removeById(id) {
    let previous = null;
    let current = this.head;

    while (current) {
      if (current.value.id === id) {
        if (!previous) {
          this.head = current.next;
        } else {
          previous.next = current.next;
        }
        if (this.tail === current) {
          this.tail = previous;
        }
        this.size -= 1;
        return current.value;
      }
      previous = current;
      current = current.next;
    }
    return null;
  }

  toArray() {
    const values = [];
    let current = this.head;
    while (current) {
      values.push(current.value);
      current = current.next;
    }
    return values;
  }
}

module.exports = { Node, SinglyLinkedList };
