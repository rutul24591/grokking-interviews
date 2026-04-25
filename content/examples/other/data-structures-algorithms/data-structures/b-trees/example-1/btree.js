class BTreeNode {
  constructor(isLeaf = true) {
    this.isLeaf = isLeaf;
    this.keys = [];
    this.children = [];
  }
}

class BTree {
  constructor(order = 3) {
    this.order = order;
    this.root = new BTreeNode(true);
  }

  insert(key) {
    const split = this.#insertIntoNode(this.root, key);
    if (!split) return;
    const nextRoot = new BTreeNode(false);
    nextRoot.keys = [split.middle];
    nextRoot.children = [split.left, split.right];
    this.root = nextRoot;
  }

  #insertIntoNode(node, key) {
    if (node.isLeaf) {
      node.keys.push(key);
      node.keys.sort((a, b) => a - b);
      return this.#splitIfNeeded(node);
    }

    let childIndex = 0;
    while (childIndex < node.keys.length && key > node.keys[childIndex]) childIndex += 1;
    const split = this.#insertIntoNode(node.children[childIndex], key);
    if (!split) return null;

    node.keys.splice(childIndex, 0, split.middle);
    node.children.splice(childIndex, 1, split.left, split.right);
    return this.#splitIfNeeded(node);
  }

  #splitIfNeeded(node) {
    if (node.keys.length < this.order) return null;
    const middleIndex = Math.floor(node.keys.length / 2);
    const middle = node.keys[middleIndex];
    const left = new BTreeNode(node.isLeaf);
    const right = new BTreeNode(node.isLeaf);
    left.keys = node.keys.slice(0, middleIndex);
    right.keys = node.keys.slice(middleIndex + 1);
    if (!node.isLeaf) {
      left.children = node.children.slice(0, middleIndex + 1);
      right.children = node.children.slice(middleIndex + 1);
    }
    return { middle, left, right };
  }
}

module.exports = { BTree };
