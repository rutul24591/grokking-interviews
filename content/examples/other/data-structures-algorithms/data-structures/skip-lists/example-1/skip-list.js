class Node {
  constructor(value, level) {
    this.value = value;
    this.forward = new Array(level).fill(null);
  }
}

class SkipList {
  constructor(maxLevel = 4) {
    this.maxLevel = maxLevel;
    this.head = new Node(Number.NEGATIVE_INFINITY, maxLevel);
  }

  #levelFor(value) {
    return Math.min(this.maxLevel, 1 + (value % this.maxLevel));
  }

  insert(value) {
    const update = new Array(this.maxLevel).fill(this.head);
    let current = this.head;

    for (let level = this.maxLevel - 1; level >= 0; level -= 1) {
      while (current.forward[level] && current.forward[level].value < value) {
        current = current.forward[level];
      }
      update[level] = current;
    }

    const nodeLevel = this.#levelFor(value);
    const node = new Node(value, nodeLevel);
    for (let level = 0; level < nodeLevel; level += 1) {
      node.forward[level] = update[level].forward[level];
      update[level].forward[level] = node;
    }
  }

  values() {
    const out = [];
    let current = this.head.forward[0];
    while (current) {
      out.push(current.value);
      current = current.forward[0];
    }
    return out;
  }
}

module.exports = { SkipList };
