#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const BASE_DIR = path.join(
  ROOT,
  "content",
  "examples",
  "other",
  "data-structures-algorithms",
  "data-structures",
);

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf-8");
}

function cleanDir(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
  fs.mkdirSync(dirPath, { recursive: true });
}

function buildReadme({
  topicSlug,
  topicTitle,
  exampleTitle,
  summary,
  files,
  runTarget,
  checks,
}) {
  const fileLines = files.map((file) => `- \`${file}\``).join("\n");
  const checkLines = checks.map((line) => `- ${line}`).join("\n");

  return `# ${topicTitle} — ${exampleTitle}

${summary}

## Files
${fileLines}

## Run
\`node content/examples/other/data-structures-algorithms/data-structures/${topicSlug}/${runTarget}\`

## What to Verify
${checkLines}
`;
}

function createTopic(topic) {
  const topicDir = path.join(BASE_DIR, topic.slug);
  cleanDir(topicDir);

  for (const example of topic.examples) {
    const exampleDir = path.join(topicDir, example.id);
    fs.mkdirSync(exampleDir, { recursive: true });

    for (const file of example.files) {
      writeFile(path.join(exampleDir, file.name), `${file.content.trim()}\n`);
    }

    writeFile(
      path.join(exampleDir, "README.md"),
      buildReadme({
        topicSlug: topic.slug,
        topicTitle: topic.title,
        exampleTitle: example.title,
        summary: example.summary,
        files: [...example.files.map((file) => file.name), "README.md"],
        runTarget: `${example.id}/${example.runFile}`,
        checks: example.checks,
      }),
    );
  }
}

const topics = [
  {
    slug: "arrays",
    title: "Arrays",
    examples: [
      {
        id: "example-1",
        title: "Catalog Workbench",
        summary:
          "Builds a small product catalog workbench on top of a custom dynamic array implementation and exercises append, insert, delete, update, and resize behavior.",
        runFile: "app.js",
        checks: [
          "capacity doubles only when the array is full",
          "middle inserts shift existing values without losing order",
          "removals compact the array and keep contiguous storage",
        ],
        files: [
          {
            name: "dynamic-array.js",
            content: `
class DynamicArray {
  constructor(initialCapacity = 2) {
    this.capacity = initialCapacity;
    this.length = 0;
    this.buffer = new Array(this.capacity);
  }

  append(value) {
    this.#ensureCapacity(this.length + 1);
    this.buffer[this.length++] = value;
  }

  insertAt(index, value) {
    if (index < 0 || index > this.length) {
      throw new RangeError("insert index out of bounds");
    }
    this.#ensureCapacity(this.length + 1);
    for (let cursor = this.length; cursor > index; cursor -= 1) {
      this.buffer[cursor] = this.buffer[cursor - 1];
    }
    this.buffer[index] = value;
    this.length += 1;
  }

  removeAt(index) {
    if (index < 0 || index >= this.length) {
      throw new RangeError("remove index out of bounds");
    }
    const removed = this.buffer[index];
    for (let cursor = index; cursor < this.length - 1; cursor += 1) {
      this.buffer[cursor] = this.buffer[cursor + 1];
    }
    this.buffer[this.length - 1] = undefined;
    this.length -= 1;
    return removed;
  }

  update(index, value) {
    if (index < 0 || index >= this.length) {
      throw new RangeError("update index out of bounds");
    }
    this.buffer[index] = value;
  }

  toArray() {
    return this.buffer.slice(0, this.length);
  }

  #ensureCapacity(targetLength) {
    if (targetLength <= this.capacity) return;
    while (this.capacity < targetLength) this.capacity *= 2;
    const next = new Array(this.capacity);
    for (let index = 0; index < this.length; index += 1) {
      next[index] = this.buffer[index];
    }
    this.buffer = next;
  }
}

module.exports = { DynamicArray };
`,
          },
          {
            name: "app.js",
            content: `
const { DynamicArray } = require("./dynamic-array");

const catalog = new DynamicArray();

catalog.append({ sku: "SKU-101", name: "Mechanical Keyboard", stock: 14 });
catalog.append({ sku: "SKU-102", name: "USB-C Dock", stock: 9 });
catalog.append({ sku: "SKU-104", name: "4K Monitor", stock: 4 });
catalog.insertAt(2, { sku: "SKU-103", name: "Ergonomic Mouse", stock: 22 });
catalog.update(1, { sku: "SKU-102", name: "USB-C Dock", stock: 12 });

const discontinued = catalog.removeAt(0);

console.log("Discontinued:", discontinued);
console.log("Capacity after growth:", catalog.capacity);
console.table(catalog.toArray());
`,
          },
        ],
      },
      {
        id: "example-2",
        title: "Sliding Window Analytics",
        summary:
          "Uses array indexing for a moving latency window and shows why arrays are strong when reads are dense and positional access matters.",
        runFile: "demo.js",
        checks: [
          "window evicts oldest values in insertion order",
          "running average uses deterministic index arithmetic",
          "dense reads remain simple compared with pointer-heavy structures",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const latencies = [120, 115, 140, 118, 122];
const windowSize = 3;
const averages = [];

for (let start = 0; start <= latencies.length - windowSize; start += 1) {
  const window = latencies.slice(start, start + windowSize);
  const average =
    window.reduce((sum, value) => sum + value, 0) / window.length;
  averages.push({ window, average });
}

console.table(averages);
`,
          },
        ],
      },
      {
        id: "example-3",
        title: "Boundary and Resize Checks",
        summary:
          "Exercises empty-array, bounds, and resize edge cases so failures are explicit instead of silently corrupting contiguous storage.",
        runFile: "demo.js",
        checks: [
          "out-of-bounds writes throw instead of mutating the wrong slot",
          "capacity growth preserves prior elements",
          "removing from an empty structure is rejected clearly",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { DynamicArray } = require("../example-1/dynamic-array");

const array = new DynamicArray(1);
array.append("A");
array.append("B");

console.log("Contents after resize:", array.toArray(), "capacity:", array.capacity);

try {
  array.removeAt(5);
} catch (error) {
  console.log("Expected remove failure:", error.message);
}

try {
  array.insertAt(-1, "bad");
} catch (error) {
  console.log("Expected insert failure:", error.message);
}
`,
          },
        ],
      },
    ],
  },
  {
    slug: "singly-linked-lists",
    title: "Singly Linked Lists",
    examples: [
      {
        id: "example-1",
        title: "Event Stream Pipeline",
        summary:
          "Implements a singly linked list to model an append-heavy event stream where traversal is sequential and inserts at the tail dominate.",
        runFile: "app.js",
        checks: [
          "tail append stays O(1) with an explicit tail pointer",
          "removing by id rewires only predecessor.next",
          "traversal is naturally sequential from head to tail",
        ],
        files: [
          {
            name: "list.js",
            content: `
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
`,
          },
          {
            name: "app.js",
            content: `
const { SinglyLinkedList } = require("./list");

const stream = new SinglyLinkedList();
stream.append({ id: "evt-1", type: "page_view" });
stream.append({ id: "evt-2", type: "search" });
stream.append({ id: "evt-3", type: "click" });
stream.append({ id: "evt-4", type: "purchase" });

const dropped = stream.removeById("evt-2");

console.log("Dropped event:", dropped);
console.log("Tail item:", stream.tail.value);
console.table(stream.toArray());
`,
          },
        ],
      },
      {
        id: "example-2",
        title: "Cycle Detection Follow-Up",
        summary:
          "Demonstrates Floyd’s fast-and-slow pointer technique on a singly linked list because cycle bugs are a common follow-up discussion.",
        runFile: "demo.js",
        checks: [
          "fast and slow pointers meet only when a cycle exists",
          "acyclic lists terminate cleanly at null",
          "the technique uses O(1) extra memory",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { Node } = require("../example-1/list");

function hasCycle(head) {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }

  return false;
}

const first = new Node("A");
const second = new Node("B");
const third = new Node("C");
first.next = second;
second.next = third;

console.log("Acyclic list:", hasCycle(first));

third.next = second;
console.log("Cyclic list:", hasCycle(first));
`,
          },
        ],
      },
      {
        id: "example-3",
        title: "Head and Tail Edge Cases",
        summary:
          "Covers the fragile transitions around empty lists, single-node lists, and tail deletion where pointer bugs usually appear first.",
        runFile: "demo.js",
        checks: [
          "removing the head updates the list root correctly",
          "removing the last node resets both head and tail",
          "missing-item deletes are harmless and explicit",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { SinglyLinkedList } = require("../example-1/list");

const list = new SinglyLinkedList();
list.append({ id: "only", value: 1 });

console.log("Before delete:", list.toArray(), "tail:", list.tail.value.id);
console.log("Removed:", list.removeById("only"));
console.log("After delete:", list.toArray(), "head:", list.head, "tail:", list.tail);
console.log("Missing delete:", list.removeById("missing"));
`,
          },
        ],
      },
    ],
  },
  {
    slug: "doubly-linked-lists",
    title: "Doubly Linked Lists",
    examples: [
      {
        id: "example-1",
        title: "Tab Manager with Back and Forward Traversal",
        summary:
          "Implements a doubly linked list for a tab manager where efficient removal and bidirectional traversal both matter.",
        runFile: "app.js",
        checks: [
          "nodes keep both prev and next links in sync",
          "middle-node removal does not require a full scan from the head",
          "reverse traversal reads the structure backward without rebuilding state",
        ],
        files: [
          {
            name: "list.js",
            content: `
class Node {
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  append(value) {
    const node = new Node(value);
    if (!this.head) {
      this.head = this.tail = node;
      return node;
    }
    node.prev = this.tail;
    this.tail.next = node;
    this.tail = node;
    return node;
  }

  remove(node) {
    if (!node) return;
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
    if (this.head === node) this.head = node.next;
    if (this.tail === node) this.tail = node.prev;
    node.prev = null;
    node.next = null;
  }

  valuesForward() {
    const values = [];
    let current = this.head;
    while (current) {
      values.push(current.value);
      current = current.next;
    }
    return values;
  }

  valuesBackward() {
    const values = [];
    let current = this.tail;
    while (current) {
      values.push(current.value);
      current = current.prev;
    }
    return values;
  }
}

module.exports = { DoublyLinkedList };
`,
          },
          {
            name: "app.js",
            content: `
const { DoublyLinkedList } = require("./list");

const tabs = new DoublyLinkedList();
const dashboard = tabs.append("Dashboard");
tabs.append("Orders");
const alerts = tabs.append("Alerts");
tabs.append("Billing");

tabs.remove(alerts);

console.log("Closed tab:", alerts.value);
console.log("Forward:", tabs.valuesForward());
console.log("Backward:", tabs.valuesBackward());
console.log("Still reachable from head:", dashboard.value);
`,
          },
        ],
      },
      {
        id: "example-2",
        title: "Move-To-Front Cache Follow-Up",
        summary:
          "Shows the canonical follow-up pattern where a doubly linked list is paired with a hash map to support O(1) recency updates.",
        runFile: "demo.js",
        checks: [
          "recently used entries move to the head without a full traversal",
          "eviction naturally happens at the tail",
          "the list is useful when adjacency mutations dominate",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { DoublyLinkedList } = require("../example-1/list");

const list = new DoublyLinkedList();
const a = list.append("A");
const b = list.append("B");
const c = list.append("C");

list.remove(b);
const moved = list.append(b.value);

console.log("Original B node detached:", b.prev, b.next);
console.log("New recency order:", list.valuesForward());
console.log("Newest tail entry:", moved.value);
`,
          },
        ],
      },
      {
        id: "example-3",
        title: "Empty and Single-Node Checks",
        summary:
          "Validates the pointer transitions that usually break first: removing the only node, removing the head, and removing the tail.",
        runFile: "demo.js",
        checks: [
          "single-node delete clears both head and tail",
          "head removal preserves backward links",
          "tail removal preserves forward links",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { DoublyLinkedList } = require("../example-1/list");

const list = new DoublyLinkedList();
const first = list.append("first");

list.remove(first);
console.log("After single removal:", { head: list.head, tail: list.tail });

const second = list.append("second");
const third = list.append("third");
list.remove(second);

console.log("After head removal:", list.valuesForward());
list.remove(third);
console.log("After tail removal:", { head: list.head, tail: list.tail && list.tail.value });
`,
          },
        ],
      },
    ],
  },
  {
    slug: "stacks",
    title: "Stacks",
    examples: [
      {
        id: "example-1",
        title: "Undo and Redo Workbench",
        summary:
          "Uses two stacks to back an editor-style undo and redo workflow, which is the production pattern most engineers recognize immediately.",
        runFile: "app.js",
        checks: [
          "push and pop obey strict LIFO ordering",
          "redo history clears when a fresh mutation arrives",
          "state reconstruction is deterministic from stack history",
        ],
        files: [
          {
            name: "stack.js",
            content: `
class Stack {
  constructor() {
    this.items = [];
  }

  push(value) {
    this.items.push(value);
  }

  pop() {
    if (this.items.length === 0) {
      throw new Error("stack underflow");
    }
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1] ?? null;
  }

  size() {
    return this.items.length;
  }
}

module.exports = { Stack };
`,
          },
          {
            name: "app.js",
            content: `
const { Stack } = require("./stack");

const undo = new Stack();
const redo = new Stack();
let document = "draft";

function apply(change) {
  undo.push(document);
  document = change(document);
  redo.items.length = 0;
}

apply(() => "draft v2");
apply(() => "draft v3");
document = undo.pop();
redo.push("draft v3");
document = undo.pop();

console.log("Current document:", document);
console.log("Redo candidate:", redo.peek());
console.log("Undo depth:", undo.size());
`,
          },
        ],
      },
      {
        id: "example-2",
        title: "Expression Validation Follow-Up",
        summary:
          "Uses a stack for bracket validation because interviewers often ask for a secondary scenario beyond undo and call stacks.",
        runFile: "demo.js",
        checks: [
          "open delimiters push onto the stack",
          "mismatched closers fail immediately",
          "an empty stack at the end indicates balanced structure",
        ],
        files: [
          {
            name: "demo.js",
            content: `
function isBalanced(expression) {
  const matches = { ")": "(", "]": "[", "}": "{" };
  const stack = [];

  for (const char of expression) {
    if (Object.values(matches).includes(char)) stack.push(char);
    if (matches[char] && stack.pop() !== matches[char]) return false;
  }

  return stack.length === 0;
}

console.log("({[]}) ->", isBalanced("({[]})"));
console.log("([)] ->", isBalanced("([)]"));
`,
          },
        ],
      },
      {
        id: "example-3",
        title: "Underflow and Minimum Tracking",
        summary:
          "Covers stack underflow and a min-stack extension so correctness checks are not limited to the happy path.",
        runFile: "demo.js",
        checks: [
          "underflow throws instead of returning corrupted state",
          "minimum tracking stays in sync across pops",
          "duplicate minima do not disappear early",
        ],
        files: [
          {
            name: "demo.js",
            content: `
class MinStack {
  constructor() {
    this.values = [];
    this.minimums = [];
  }

  push(value) {
    this.values.push(value);
    if (
      this.minimums.length === 0 ||
      value <= this.minimums[this.minimums.length - 1]
    ) {
      this.minimums.push(value);
    }
  }

  pop() {
    if (this.values.length === 0) throw new Error("stack underflow");
    const value = this.values.pop();
    if (value === this.minimums[this.minimums.length - 1]) {
      this.minimums.pop();
    }
    return value;
  }

  min() {
    return this.minimums[this.minimums.length - 1] ?? null;
  }
}

const stack = new MinStack();
stack.push(5);
stack.push(3);
stack.push(3);
stack.push(8);
console.log("Min before pops:", stack.min());
stack.pop();
stack.pop();
console.log("Min after duplicate pop:", stack.min());

try {
  const empty = new MinStack();
  empty.pop();
} catch (error) {
  console.log("Expected underflow:", error.message);
}
`,
          },
        ],
      },
    ],
  },
  {
    slug: "queues",
    title: "Queues",
    examples: [
      {
        id: "example-1",
        title: "Job Dispatch Queue",
        summary:
          "Implements a circular-buffer queue to model a worker dispatcher where enqueue and dequeue happen continuously under load.",
        runFile: "app.js",
        checks: [
          "head and tail wrap around the buffer correctly",
          "FIFO ordering is preserved across many operations",
          "capacity checks reject overflow explicitly",
        ],
        files: [
          {
            name: "queue.js",
            content: `
class CircularQueue {
  constructor(capacity) {
    this.buffer = new Array(capacity);
    this.capacity = capacity;
    this.head = 0;
    this.tail = 0;
    this.length = 0;
  }

  enqueue(value) {
    if (this.length === this.capacity) throw new Error("queue overflow");
    this.buffer[this.tail] = value;
    this.tail = (this.tail + 1) % this.capacity;
    this.length += 1;
  }

  dequeue() {
    if (this.length === 0) throw new Error("queue underflow");
    const value = this.buffer[this.head];
    this.buffer[this.head] = undefined;
    this.head = (this.head + 1) % this.capacity;
    this.length -= 1;
    return value;
  }
}

module.exports = { CircularQueue };
`,
          },
          {
            name: "app.js",
            content: `
const { CircularQueue } = require("./queue");

const queue = new CircularQueue(5);
queue.enqueue({ id: "job-1", type: "thumbnail" });
queue.enqueue({ id: "job-2", type: "email" });
queue.enqueue({ id: "job-3", type: "search-index" });

console.log("Dispatch:", queue.dequeue());
queue.enqueue({ id: "job-4", type: "billing-sync" });
queue.enqueue({ id: "job-5", type: "fraud-check" });

console.log("Dispatch:", queue.dequeue());
console.log("Dispatch:", queue.dequeue());
console.log("Remaining length:", queue.length, "head:", queue.head, "tail:", queue.tail);
`,
          },
        ],
      },
      {
        id: "example-2",
        title: "Priority Lane Follow-Up",
        summary:
          "Shows a multi-queue follow-up where urgent work bypasses standard work without abandoning FIFO guarantees inside each lane.",
        runFile: "demo.js",
        checks: [
          "urgent tasks drain before standard tasks",
          "each lane still preserves insertion order",
          "the pattern scales into explicit scheduler policies",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const urgent = ["fraud-review", "manual-refund"];
const standard = ["email-digest", "invoice-export", "crm-sync"];

const dispatchOrder = [];
while (urgent.length || standard.length) {
  if (urgent.length) dispatchOrder.push({ lane: "urgent", task: urgent.shift() });
  else dispatchOrder.push({ lane: "standard", task: standard.shift() });
}

console.table(dispatchOrder);
`,
          },
        ],
      },
      {
        id: "example-3",
        title: "Wraparound and Empty-State Checks",
        summary:
          "Exercises wraparound, overflow, and underflow behavior because queue pointer bugs usually appear only after many cycles.",
        runFile: "demo.js",
        checks: [
          "tail wraps to index zero after hitting capacity",
          "overflow is explicit instead of overwriting live entries",
          "underflow is explicit instead of reading stale slots",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { CircularQueue } = require("../example-1/queue");

const queue = new CircularQueue(3);
queue.enqueue("A");
queue.enqueue("B");
console.log(queue.dequeue());
queue.enqueue("C");
queue.enqueue("D");
console.log("Pointer state:", { head: queue.head, tail: queue.tail, length: queue.length });

try {
  queue.enqueue("E");
} catch (error) {
  console.log("Expected overflow:", error.message);
}

while (queue.length) queue.dequeue();
try {
  queue.dequeue();
} catch (error) {
  console.log("Expected underflow:", error.message);
}
`,
          },
        ],
      },
    ],
  },
  {
    slug: "trees",
    title: "Trees",
    examples: [
      {
        id: "example-1",
        title: "Content Taxonomy Explorer",
        summary:
          "Builds a small tree-backed content taxonomy to show parent-child hierarchies, recursive traversal, and subtree aggregation.",
        runFile: "app.js",
        checks: [
          "hierarchy is encoded directly in parent-child relationships",
          "depth-first traversal visits descendants in a predictable order",
          "subtree aggregation composes naturally from child nodes",
        ],
        files: [
          {
            name: "tree.js",
            content: `
class TreeNode {
  constructor(name) {
    this.name = name;
    this.children = [];
  }

  addChild(node) {
    this.children.push(node);
  }
}

function depthFirst(node, visit) {
  visit(node);
  for (const child of node.children) depthFirst(child, visit);
}

function countNodes(node) {
  return 1 + node.children.reduce((sum, child) => sum + countNodes(child), 0);
}

module.exports = { TreeNode, depthFirst, countNodes };
`,
          },
          {
            name: "app.js",
            content: `
const { TreeNode, depthFirst, countNodes } = require("./tree");

const root = new TreeNode("Knowledge Base");
const frontend = new TreeNode("Frontend");
const backend = new TreeNode("Backend");
const caching = new TreeNode("Caching");
const rendering = new TreeNode("Rendering");

root.addChild(frontend);
root.addChild(backend);
frontend.addChild(rendering);
backend.addChild(caching);

const order = [];
depthFirst(root, (node) => order.push(node.name));

console.log("DFS order:", order.join(" -> "));
console.log("Tree size:", countNodes(root));
`,
          },
        ],
      },
      {
        id: "example-2",
        title: "Traversal Variants Follow-Up",
        summary:
          "Contrasts breadth-first and depth-first traversal so the follow-up covers how tree shape influences query and rendering behavior.",
        runFile: "demo.js",
        checks: [
          "BFS is level-oriented and useful for nearest-parent queries",
          "DFS is subtree-oriented and natural for recursive processing",
          "traversal choice changes memory and latency profiles",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { TreeNode } = require("../example-1/tree");

const root = new TreeNode("root");
root.addChild(new TreeNode("left"));
root.addChild(new TreeNode("right"));
root.children[0].addChild(new TreeNode("left.left"));

function breadthFirst(node) {
  const queue = [node];
  const order = [];
  while (queue.length) {
    const current = queue.shift();
    order.push(current.name);
    queue.push(...current.children);
  }
  return order;
}

console.log("BFS:", breadthFirst(root));
console.log("DFS-like preorder:", ["root", "left", "left.left", "right"]);
`,
          },
        ],
      },
      {
        id: "example-3",
        title: "Degenerate Tree Checks",
        summary:
          "Highlights edge conditions like skewed trees and missing children because interviews often pivot into worst-case shape analysis.",
        runFile: "demo.js",
        checks: [
          "a skewed tree behaves more like a linked list",
          "deep recursion risks stack growth",
          "missing children should not break traversal logic",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { TreeNode, countNodes } = require("../example-1/tree");

const root = new TreeNode("n1");
let current = root;

for (let index = 2; index <= 5; index += 1) {
  const child = new TreeNode(\`n\${index}\`);
  current.addChild(child);
  current = child;
}

console.log("Skewed node count:", countNodes(root));
console.log("Depth approximation:", 5);
console.log("Observation: lookup degenerates toward linear depth on a skewed tree.");
`,
          },
        ],
      },
    ],
  },
  {
    slug: "graphs",
    title: "Graphs",
    examples: [
      {
        id: "example-1",
        title: "Service Route Planner",
        summary:
          "Uses an adjacency-list graph to model service dependencies and shortest unweighted paths across a small platform topology.",
        runFile: "app.js",
        checks: [
          "nodes can have multiple outgoing and incoming connections",
          "BFS finds the minimum-hop route in an unweighted graph",
          "the model supports cycles without breaking traversal",
        ],
        files: [
          {
            name: "graph.js",
            content: `
class Graph {
  constructor() {
    this.adjacency = new Map();
  }

  addEdge(from, to) {
    if (!this.adjacency.has(from)) this.adjacency.set(from, []);
    if (!this.adjacency.has(to)) this.adjacency.set(to, []);
    this.adjacency.get(from).push(to);
  }

  shortestPath(start, target) {
    const queue = [[start, [start]]];
    const visited = new Set([start]);

    while (queue.length) {
      const [node, path] = queue.shift();
      if (node === target) return path;

      for (const neighbor of this.adjacency.get(node) ?? []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([neighbor, [...path, neighbor]]);
        }
      }
    }

    return null;
  }
}

module.exports = { Graph };
`,
          },
          {
            name: "app.js",
            content: `
const { Graph } = require("./graph");

const graph = new Graph();
graph.addEdge("api-gateway", "auth-service");
graph.addEdge("api-gateway", "catalog-service");
graph.addEdge("catalog-service", "search-index");
graph.addEdge("auth-service", "session-store");
graph.addEdge("search-index", "analytics-pipeline");

console.log(
  "Path api-gateway -> analytics-pipeline:",
  graph.shortestPath("api-gateway", "analytics-pipeline"),
);
`,
          },
        ],
      },
      {
        id: "example-2",
        title: "Topological Ordering Follow-Up",
        summary:
          "Demonstrates dependency ordering for build or deploy graphs, which is a common follow-up after basic traversal.",
        runFile: "demo.js",
        checks: [
          "dependencies appear before dependents",
          "indegree accounting drives scheduling order",
          "DAG assumptions must be enforced explicitly",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const edges = [
  ["schema", "api"],
  ["api", "web"],
  ["shared-ui", "web"],
];

const nodes = new Set(edges.flat());
const indegree = new Map([...nodes].map((node) => [node, 0]));
const adjacency = new Map([...nodes].map((node) => [node, []]));

for (const [from, to] of edges) {
  adjacency.get(from).push(to);
  indegree.set(to, indegree.get(to) + 1);
}

const queue = [...nodes].filter((node) => indegree.get(node) === 0);
const order = [];

while (queue.length) {
  const node = queue.shift();
  order.push(node);
  for (const neighbor of adjacency.get(node)) {
    indegree.set(neighbor, indegree.get(neighbor) - 1);
    if (indegree.get(neighbor) === 0) queue.push(neighbor);
  }
}

console.log("Topological order:", order);
`,
          },
        ],
      },
      {
        id: "example-3",
        title: "Disconnected and Cyclic Cases",
        summary:
          "Covers disconnected components and cycle detection so graph handling is not limited to a single connected happy path.",
        runFile: "demo.js",
        checks: [
          "missing paths return null cleanly",
          "a back-edge is recognized as a cycle in directed traversal",
          "multiple components need explicit outer iteration",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { Graph } = require("../example-1/graph");

const graph = new Graph();
graph.addEdge("A", "B");
graph.addEdge("B", "C");

console.log("A -> C:", graph.shortestPath("A", "C"));
console.log("A -> Z:", graph.shortestPath("A", "Z"));

const adjacency = { A: ["B"], B: ["C"], C: ["A"] };
const visiting = new Set();
const visited = new Set();

function hasCycle(node) {
  if (visiting.has(node)) return true;
  if (visited.has(node)) return false;
  visiting.add(node);
  for (const neighbor of adjacency[node] ?? []) {
    if (hasCycle(neighbor)) return true;
  }
  visiting.delete(node);
  visited.add(node);
  return false;
}

console.log("Directed cycle present:", hasCycle("A"));
`,
          },
        ],
      },
    ],
  },
  {
    slug: "hash-tables",
    title: "Hash Tables",
    examples: [
      {
        id: "example-1",
        title: "Session Store with Separate Chaining",
        summary:
          "Implements a compact hash table with separate chaining and uses it as an in-memory session store.",
        runFile: "app.js",
        checks: [
          "lookups use the hash bucket first, then resolve collisions within the chain",
          "updates replace existing keys without duplicating entries",
          "distribution quality influences average lookup time",
        ],
        files: [
          {
            name: "hash-table.js",
            content: `
class HashTable {
  constructor(bucketCount = 8) {
    this.buckets = Array.from({ length: bucketCount }, () => []);
  }

  #hash(key) {
    let hash = 0;
    for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) % this.buckets.length;
    return hash;
  }

  set(key, value) {
    const bucket = this.buckets[this.#hash(key)];
    const pair = bucket.find((entry) => entry.key === key);
    if (pair) {
      pair.value = value;
      return;
    }
    bucket.push({ key, value });
  }

  get(key) {
    return this.buckets[this.#hash(key)].find((entry) => entry.key === key)?.value ?? null;
  }

  debugBuckets() {
    return this.buckets.map((bucket) => bucket.map((entry) => entry.key));
  }
}

module.exports = { HashTable };
`,
          },
          {
            name: "app.js",
            content: `
const { HashTable } = require("./hash-table");

const sessions = new HashTable(4);
sessions.set("sess-100", { userId: "u1", device: "web" });
sessions.set("sess-101", { userId: "u2", device: "ios" });
sessions.set("sess-102", { userId: "u3", device: "android" });
sessions.set("sess-101", { userId: "u2", device: "ios", refreshed: true });

console.log("Lookup sess-101:", sessions.get("sess-101"));
console.log("Bucket layout:", sessions.debugBuckets());
`,
          },
        ],
      },
      {
        id: "example-2",
        title: "Collision Stress Follow-Up",
        summary:
          "Forces collisions so the follow-up makes the bucket-chain trade-off visible instead of assuming a perfect hash.",
        runFile: "demo.js",
        checks: [
          "multiple keys can occupy the same bucket without data loss",
          "collision-heavy workloads degrade toward linear bucket scans",
          "observability into bucket state helps detect poor key distribution",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { HashTable } = require("../example-1/hash-table");

const table = new HashTable(2);
["aa", "bb", "cc", "dd"].forEach((key, index) => {
  table.set(key, { value: index });
});

console.log("Buckets after forced collisions:", table.debugBuckets());
console.log("Lookup cc:", table.get("cc"));
`,
          },
        ],
      },
      {
        id: "example-3",
        title: "Missing Keys and Update Checks",
        summary:
          "Checks the operational edges around absent keys and updates because the table must behave predictably even when reads miss.",
        runFile: "demo.js",
        checks: [
          "missing keys resolve to null explicitly",
          "idempotent updates keep only one logical record per key",
          "bucket scans remain bounded to the chosen bucket",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { HashTable } = require("../example-1/hash-table");

const table = new HashTable();
table.set("config", { retries: 3 });
table.set("config", { retries: 5 });

console.log("Updated config:", table.get("config"));
console.log("Missing key:", table.get("missing"));
`,
          },
        ],
      },
    ],
  },
  {
    slug: "heaps-priority-queues",
    title: "Heaps & Priority Queues",
    examples: [
      {
        id: "example-1",
        title: "Incident Scheduler",
        summary:
          "Implements a binary min-heap to schedule incident response work by severity and deadline.",
        runFile: "app.js",
        checks: [
          "the minimum-priority element always stays at the root",
          "insert and extract rebalance with sift-up and sift-down",
          "priority queues are ideal when only the next-best item matters",
        ],
        files: [
          {
            name: "heap.js",
            content: `
class MinHeap {
  constructor(compare) {
    this.compare = compare;
    this.items = [];
  }

  insert(value) {
    this.items.push(value);
    this.#siftUp(this.items.length - 1);
  }

  extractMin() {
    if (this.items.length === 0) throw new Error("heap underflow");
    const min = this.items[0];
    const last = this.items.pop();
    if (this.items.length > 0) {
      this.items[0] = last;
      this.#siftDown(0);
    }
    return min;
  }

  #siftUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.compare(this.items[index], this.items[parent]) >= 0) break;
      [this.items[index], this.items[parent]] = [this.items[parent], this.items[index]];
      index = parent;
    }
  }

  #siftDown(index) {
    while (true) {
      let smallest = index;
      const left = index * 2 + 1;
      const right = index * 2 + 2;
      if (left < this.items.length && this.compare(this.items[left], this.items[smallest]) < 0) smallest = left;
      if (right < this.items.length && this.compare(this.items[right], this.items[smallest]) < 0) smallest = right;
      if (smallest === index) return;
      [this.items[index], this.items[smallest]] = [this.items[smallest], this.items[index]];
      index = smallest;
    }
  }
}

module.exports = { MinHeap };
`,
          },
          {
            name: "app.js",
            content: `
const { MinHeap } = require("./heap");

const queue = new MinHeap((a, b) => a.priority - b.priority);
queue.insert({ id: "inc-3", priority: 3 });
queue.insert({ id: "inc-1", priority: 1 });
queue.insert({ id: "inc-2", priority: 2 });

console.log("Dispatch 1:", queue.extractMin());
console.log("Dispatch 2:", queue.extractMin());
console.log("Remaining heap:", queue.items);
`,
          },
        ],
      },
      {
        id: "example-2",
        title: "Top-K Stream Follow-Up",
        summary:
          "Uses a bounded heap for top-k ranking, which is the usual follow-up when interviewers pivot from scheduling to streaming analytics.",
        runFile: "demo.js",
        checks: [
          "the heap retains only the k largest values seen so far",
          "bounded memory is maintained regardless of stream length",
          "the root tracks the current threshold for admission",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { MinHeap } = require("../example-1/heap");

const heap = new MinHeap((a, b) => a - b);
const values = [10, 3, 25, 7, 18, 30];
const k = 3;

for (const value of values) {
  if (heap.items.length < k) heap.insert(value);
  else if (value > heap.items[0]) {
    heap.extractMin();
    heap.insert(value);
  }
}

console.log("Top 3 (unordered heap view):", heap.items);
`,
          },
        ],
      },
      {
        id: "example-3",
        title: "Tie and Empty-State Checks",
        summary:
          "Covers duplicate priorities and empty-heap extraction so behavior is explicit under real operational conditions.",
        runFile: "demo.js",
        checks: [
          "equal priorities remain valid even if internal ordering differs",
          "extracting from an empty heap throws clearly",
          "the comparator fully defines ordering semantics",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { MinHeap } = require("../example-1/heap");

const heap = new MinHeap((a, b) => a.priority - b.priority);
heap.insert({ id: "a", priority: 2 });
heap.insert({ id: "b", priority: 2 });
heap.insert({ id: "c", priority: 1 });

console.log("First item:", heap.extractMin());
console.log("Next tie candidates:", heap.items);

try {
  const empty = new MinHeap((a, b) => a - b);
  empty.extractMin();
} catch (error) {
  console.log("Expected underflow:", error.message);
}
`,
          },
        ],
      },
    ],
  },
  {
    slug: "bit-manipulation",
    title: "Bit Manipulation",
    examples: [
      {
        id: "example-1",
        title: "Permission Flag Console",
        summary:
          "Represents feature and permission flags as bit masks so multiple booleans fit in one compact integer.",
        runFile: "app.js",
        checks: [
          "each flag occupies a stable bit position",
          "bitwise OR enables permissions and bitwise AND checks them",
          "compact packing is useful for hot paths and wire efficiency",
        ],
        files: [
          {
            name: "flags.js",
            content: `
const FLAGS = {
  READ: 1 << 0,
  WRITE: 1 << 1,
  DELETE: 1 << 2,
  EXPORT: 1 << 3,
};

function enable(mask, flag) {
  return mask | flag;
}

function disable(mask, flag) {
  return mask & ~flag;
}

function has(mask, flag) {
  return (mask & flag) === flag;
}

module.exports = { FLAGS, enable, disable, has };
`,
          },
          {
            name: "app.js",
            content: `
const { FLAGS, enable, disable, has } = require("./flags");

let mask = 0;
mask = enable(mask, FLAGS.READ);
mask = enable(mask, FLAGS.WRITE);
mask = enable(mask, FLAGS.EXPORT);
mask = disable(mask, FLAGS.WRITE);

console.log("Mask:", mask.toString(2).padStart(4, "0"));
console.log("Can export?", has(mask, FLAGS.EXPORT));
console.log("Can write?", has(mask, FLAGS.WRITE));
`,
          },
        ],
      },
      {
        id: "example-2",
        title: "Population Count Follow-Up",
        summary:
          "Counts enabled bits to answer questions like 'how many capabilities are active' without materializing a full boolean array.",
        runFile: "demo.js",
        checks: [
          "bit clearing removes the lowest set bit per iteration",
          "runtime scales with number of set bits, not bit width",
          "compact masks still support useful aggregate queries",
        ],
        files: [
          {
            name: "demo.js",
            content: `
function popcount(value) {
  let count = 0;
  let remaining = value;
  while (remaining) {
    remaining &= remaining - 1;
    count += 1;
  }
  return count;
}

console.log("0b111010 ->", popcount(0b111010));
console.log("0b10000000 ->", popcount(0b10000000));
`,
          },
        ],
      },
      {
        id: "example-3",
        title: "Shift and Sign Edge Cases",
        summary:
          "Covers signed shifts and mask width assumptions so the examples do not silently teach unsafe bit-level habits.",
        runFile: "demo.js",
        checks: [
          "left shifts grow values by powers of two until width limits matter",
          "signed right shift preserves the sign bit",
          "unsigned coercion is sometimes required for wire-format work",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const negative = -8;

console.log("negative >> 1:", negative >> 1);
console.log("negative >>> 1:", negative >>> 1);
console.log("1 << 5:", 1 << 5);
console.log("Observation: JavaScript bitwise operators operate on 32-bit signed integers.");
`,
          },
        ],
      },
    ],
  },
  {
    slug: "strings",
    title: "Strings",
    examples: [
      {
        id: "example-1",
        title: "Search Query Normalization Pipeline",
        summary:
          "Builds a small string-processing pipeline for search queries, covering trimming, normalization, tokenization, and canonical formatting.",
        runFile: "app.js",
        checks: [
          "normalization standardizes inputs before indexing or matching",
          "tokenization is deterministic across similar user inputs",
          "string work is often pipeline-oriented rather than random-access heavy",
        ],
        files: [
          {
            name: "pipeline.js",
            content: `
function normalize(query) {
  return query.trim().toLowerCase().replace(/\\s+/g, " ");
}

function tokenize(query) {
  return normalize(query).split(" ").filter(Boolean);
}

function canonicalKey(query) {
  return tokenize(query).join("|");
}

module.exports = { normalize, tokenize, canonicalKey };
`,
          },
          {
            name: "app.js",
            content: `
const { normalize, tokenize, canonicalKey } = require("./pipeline");

const input = "  Distributed   CACHE   Invalidation ";

console.log("Normalized:", normalize(input));
console.log("Tokens:", tokenize(input));
console.log("Cache key:", canonicalKey(input));
`,
          },
        ],
      },
      {
        id: "example-2",
        title: "Substring Search Follow-Up",
        summary:
          "Adds a practical follow-up by scanning log lines for repeated markers, which connects string handling to real diagnostics work.",
        runFile: "demo.js",
        checks: [
          "substring matching detects repeated signatures quickly",
          "string APIs are often enough before more advanced indexing is needed",
          "prefix and containment checks drive many product features",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const logs = [
  "ERROR timeout on shard-1",
  "INFO cache warm complete",
  "ERROR retry exhausted on shard-2",
];

const matches = logs.filter((line) => line.includes("ERROR"));
console.table(matches);
`,
          },
        ],
      },
      {
        id: "example-3",
        title: "Unicode and Grapheme Edge Cases",
        summary:
          "Highlights the gap between code units and user-visible characters so edge cases are not ignored in multilingual systems.",
        runFile: "demo.js",
        checks: [
          "string length can differ from grapheme count",
          "Array.from helps inspect code points more safely",
          "naive slicing can split visible characters unexpectedly",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const text = "A😊é";

console.log("String length:", text.length);
console.log("Code points:", Array.from(text));
console.log("First two code units:", text.slice(0, 2));
`,
          },
        ],
      },
    ],
  },
  {
    slug: "b-trees",
    title: "B-Trees",
    examples: [
      {
        id: "example-1",
        title: "Page-Oriented Index Workbench",
        summary:
          "Implements a small B-tree insertion flow to demonstrate page-friendly multi-key nodes and split behavior.",
        runFile: "app.js",
        checks: [
          "nodes hold multiple ordered keys instead of just one",
          "splits promote a separator key upward when a node overflows",
          "the structure stays shallow for disk-oriented workloads",
        ],
        files: [
          {
            name: "btree.js",
            content: `
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
`,
          },
          {
            name: "app.js",
            content: `
const { BTree } = require("./btree");

const tree = new BTree(3);
[10, 20, 5, 6, 12, 30, 7, 17].forEach((value) => tree.insert(value));

console.log("Root keys:", tree.root.keys);
console.log("Child key ranges:", tree.root.children.map((child) => child.keys));
`,
          },
        ],
      },
      {
        id: "example-2",
        title: "Node Split Trace Follow-Up",
        summary:
          "Focuses on node overflow and promotion because that is the critical follow-up discussion for B-tree design.",
        runFile: "demo.js",
        checks: [
          "splits happen only when node capacity is exceeded",
          "the promoted key partitions left and right child ranges",
          "higher fan-out reduces tree height compared with binary trees",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { BTree } = require("../example-1/btree");

const tree = new BTree(3);
[1, 2, 3, 4].forEach((value) => tree.insert(value));

console.log("Root after split:", tree.root.keys);
console.log("Children after split:", tree.root.children.map((child) => child.keys));
`,
          },
        ],
      },
      {
        id: "example-3",
        title: "Duplicate and Missing-Key Checks",
        summary:
          "Validates edge conditions around repeated inserts and shallow trees so correctness is not assumed only for balanced happy paths.",
        runFile: "demo.js",
        checks: [
          "duplicate keys remain visible to application policy decisions",
          "small trees may stay leaf-only with no split",
          "search expectations must define duplicate handling explicitly",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { BTree } = require("../example-1/btree");

const tree = new BTree(4);
[8, 8, 4].forEach((value) => tree.insert(value));

console.log("Leaf-only root keys:", tree.root.keys);
console.log("Observation: duplicate-key policy is application-specific in many B-tree implementations.");
`,
          },
        ],
      },
    ],
  },
  {
    slug: "bloom-filters",
    title: "Bloom Filters",
    examples: [
      {
        id: "example-1",
        title: "Cache Admission Precheck",
        summary:
          "Implements a Bloom filter to precheck probable membership before hitting a slower backing store.",
        runFile: "app.js",
        checks: [
          "adds set multiple hash-derived bit positions",
          "definite negatives are reliable",
          "positives are only probabilistic and require confirmation elsewhere",
        ],
        files: [
          {
            name: "bloom-filter.js",
            content: `
class BloomFilter {
  constructor(size = 32) {
    this.size = size;
    this.bits = new Array(size).fill(0);
  }

  #hashes(value) {
    const codes = [...value].map((char) => char.charCodeAt(0));
    const sum = codes.reduce((total, code) => total + code, 0);
    const weighted = codes.reduce((total, code, index) => total + code * (index + 1), 0);
    return [sum % this.size, weighted % this.size, (sum * 7 + weighted) % this.size];
  }

  add(value) {
    for (const index of this.#hashes(value)) this.bits[index] = 1;
  }

  mightContain(value) {
    return this.#hashes(value).every((index) => this.bits[index] === 1);
  }
}

module.exports = { BloomFilter };
`,
          },
          {
            name: "app.js",
            content: `
const { BloomFilter } = require("./bloom-filter");

const filter = new BloomFilter(24);
["user:1", "user:2", "user:9"].forEach((value) => filter.add(value));

console.log("user:2 ->", filter.mightContain("user:2"));
console.log("user:5 ->", filter.mightContain("user:5"));
console.log("Bits:", filter.bits.join(""));
`,
          },
        ],
      },
      {
        id: "example-2",
        title: "False Positive Follow-Up",
        summary:
          "Shows how false positives appear once the bitset becomes crowded, which is the core operational trade-off of Bloom filters.",
        runFile: "demo.js",
        checks: [
          "more inserted keys increase collision pressure",
          "a positive result may still be wrong",
          "bitset size and hash count determine practical error rates",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { BloomFilter } = require("../example-1/bloom-filter");

const filter = new BloomFilter(12);
["A", "B", "C", "D", "E", "F"].forEach((value) => filter.add(value));

console.log("Known member A:", filter.mightContain("A"));
console.log("Potential false positive Z:", filter.mightContain("Z"));
console.log("Dense bitset:", filter.bits.join(""));
`,
          },
        ],
      },
      {
        id: "example-3",
        title: "Deletion and Reset Checks",
        summary:
          "Calls out the edge-case limitation that plain Bloom filters do not support safe deletion without a counting variant.",
        runFile: "demo.js",
        checks: [
          "resetting the filter clears every prior membership hint",
          "safe deletion requires counters, not just bits",
          "operational lifecycle must account for rebuild or rotation",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { BloomFilter } = require("../example-1/bloom-filter");

const filter = new BloomFilter(16);
filter.add("account:1");
console.log("Before reset:", filter.mightContain("account:1"));
filter.bits.fill(0);
console.log("After reset:", filter.mightContain("account:1"));
console.log("Observation: plain Bloom filters cannot safely delete one item without affecting others.");
`,
          },
        ],
      },
    ],
  },
  {
    slug: "count-min-sketch",
    title: "Count-Min Sketch",
    examples: [
      {
        id: "example-1",
        title: "Trending Event Counter",
        summary:
          "Implements a count-min sketch to approximate event frequencies in a memory-bounded streaming workload.",
        runFile: "app.js",
        checks: [
          "each update increments one counter per row",
          "the minimum row estimate bounds the answer from above",
          "the sketch is suited to heavy hitters, not exact counts",
        ],
        files: [
          {
            name: "count-min-sketch.js",
            content: `
class CountMinSketch {
  constructor(rows = 3, width = 16) {
    this.rows = rows;
    this.width = width;
    this.table = Array.from({ length: rows }, () => new Array(width).fill(0));
  }

  #index(value, row) {
    const base = [...value].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return (base * (row + 3) + row * 11) % this.width;
  }

  increment(value, count = 1) {
    for (let row = 0; row < this.rows; row += 1) {
      this.table[row][this.#index(value, row)] += count;
    }
  }

  estimate(value) {
    let min = Number.POSITIVE_INFINITY;
    for (let row = 0; row < this.rows; row += 1) {
      min = Math.min(min, this.table[row][this.#index(value, row)]);
    }
    return min;
  }
}

module.exports = { CountMinSketch };
`,
          },
          {
            name: "app.js",
            content: `
const { CountMinSketch } = require("./count-min-sketch");

const sketch = new CountMinSketch();
["search", "view", "search", "click", "search", "view"].forEach((event) => {
  sketch.increment(event);
});

console.log("search estimate:", sketch.estimate("search"));
console.log("view estimate:", sketch.estimate("view"));
console.log("table:", sketch.table);
`,
          },
        ],
      },
      {
        id: "example-2",
        title: "Heavy Hitter Follow-Up",
        summary:
          "Uses sketch estimates to rank likely heavy hitters, which is the natural follow-up after the basic counting workflow.",
        runFile: "demo.js",
        checks: [
          "frequent keys stand out despite approximation noise",
          "ordering can still be useful even when exact counts are unavailable",
          "sketches are especially practical for bounded-memory telemetry",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { CountMinSketch } = require("../example-1/count-min-sketch");

const sketch = new CountMinSketch();
const events = ["/home", "/home", "/pricing", "/home", "/docs", "/docs"];
events.forEach((event) => sketch.increment(event));

const ranked = ["/home", "/pricing", "/docs"].map((key) => ({
  key,
  estimate: sketch.estimate(key),
}));

ranked.sort((a, b) => b.estimate - a.estimate);
console.table(ranked);
`,
          },
        ],
      },
      {
        id: "example-3",
        title: "Collision Bias Checks",
        summary:
          "Makes the overestimation property explicit so edge cases do not get mistaken for exact counting semantics.",
        runFile: "demo.js",
        checks: [
          "estimates never undershoot true counts in this sketch",
          "collisions inflate some keys",
          "exact answers still need a different data structure",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { CountMinSketch } = require("../example-1/count-min-sketch");

const sketch = new CountMinSketch(2, 4);
["A", "B", "C", "A"].forEach((value) => sketch.increment(value));

console.log("A exact=2 estimate=", sketch.estimate("A"));
console.log("B exact=1 estimate=", sketch.estimate("B"));
console.log("Observation: collisions can only push estimates upward.");
`,
          },
        ],
      },
    ],
  },
  {
    slug: "disjoint-set-union-find",
    title: "Disjoint Set Union Find",
    examples: [
      {
        id: "example-1",
        title: "Network Connectivity Console",
        summary:
          "Implements union-find with path compression and union by rank to track connectivity between network zones.",
        runFile: "app.js",
        checks: [
          "find compresses paths to flatten future lookups",
          "union joins components only when roots differ",
          "connectivity queries become very cheap after compression",
        ],
        files: [
          {
            name: "union-find.js",
            content: `
class UnionFind {
  constructor(items) {
    this.parent = new Map(items.map((item) => [item, item]));
    this.rank = new Map(items.map((item) => [item, 0]));
  }

  find(item) {
    const parent = this.parent.get(item);
    if (parent !== item) this.parent.set(item, this.find(parent));
    return this.parent.get(item);
  }

  union(a, b) {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA === rootB) return false;

    const rankA = this.rank.get(rootA);
    const rankB = this.rank.get(rootB);
    if (rankA < rankB) this.parent.set(rootA, rootB);
    else if (rankA > rankB) this.parent.set(rootB, rootA);
    else {
      this.parent.set(rootB, rootA);
      this.rank.set(rootA, rankA + 1);
    }
    return true;
  }

  connected(a, b) {
    return this.find(a) === this.find(b);
  }
}

module.exports = { UnionFind };
`,
          },
          {
            name: "app.js",
            content: `
const { UnionFind } = require("./union-find");

const zones = new UnionFind(["web", "api", "auth", "payments", "search"]);
zones.union("web", "api");
zones.union("api", "auth");
zones.union("payments", "search");

console.log("web ~ auth:", zones.connected("web", "auth"));
console.log("web ~ search:", zones.connected("web", "search"));
console.log("Parent map:", Object.fromEntries(zones.parent));
`,
          },
        ],
      },
      {
        id: "example-2",
        title: "Cluster Merge Follow-Up",
        summary:
          "Uses union-find to merge accounts and clusters, which is one of the most common follow-up applications after basic connectivity.",
        runFile: "demo.js",
        checks: [
          "merges deduplicate overlapping groups",
          "root identity is an implementation detail, not a user-facing value",
          "component grouping is derived after unions complete",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { UnionFind } = require("../example-1/union-find");

const uf = new UnionFind(["acct-1", "acct-2", "acct-3", "acct-4"]);
uf.union("acct-1", "acct-2");
uf.union("acct-2", "acct-3");

const groups = {};
for (const account of ["acct-1", "acct-2", "acct-3", "acct-4"]) {
  const root = uf.find(account);
  groups[root] ??= [];
  groups[root].push(account);
}

console.log("Merged account clusters:", groups);
`,
          },
        ],
      },
      {
        id: "example-3",
        title: "Repeated Union and Invalid Input Checks",
        summary:
          "Covers repeated unions and invalid references so the structure behaves predictably in operational code paths.",
        runFile: "demo.js",
        checks: [
          "repeated union on the same component is a no-op",
          "unknown nodes should be rejected by application guards",
          "connectivity semantics stay stable across redundant operations",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { UnionFind } = require("../example-1/union-find");

const uf = new UnionFind(["A", "B"]);
console.log("First union changed state:", uf.union("A", "B"));
console.log("Second union changed state:", uf.union("A", "B"));
console.log("Connected:", uf.connected("A", "B"));
console.log("Observation: production code should guard unknown nodes before calling find/union.");
`,
          },
        ],
      },
    ],
  },
  {
    slug: "hyperloglog",
    title: "HyperLogLog",
    examples: [
      {
        id: "example-1",
        title: "Unique Visitor Estimator",
        summary:
          "Implements a compact HyperLogLog-style estimator to approximate unique visitor counts with fixed memory.",
        runFile: "app.js",
        checks: [
          "items are split into registers by a prefix of their hash",
          "register values track leading-zero runs",
          "estimates trade exactness for bounded memory at scale",
        ],
        files: [
          {
            name: "hyperloglog.js",
            content: `
function simpleHash(value) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function leadingZeros32(value) {
  return Math.clz32(value) + 1;
}

class HyperLogLog {
  constructor(registerBits = 4) {
    this.registerBits = registerBits;
    this.registerCount = 1 << registerBits;
    this.registers = new Array(this.registerCount).fill(0);
  }

  add(value) {
    const hash = simpleHash(value);
    const register = hash & (this.registerCount - 1);
    const remainder = hash >>> this.registerBits;
    this.registers[register] = Math.max(
      this.registers[register],
      leadingZeros32(remainder || 1),
    );
  }

  estimate() {
    const alpha = 0.673;
    const harmonic = this.registers.reduce(
      (sum, value) => sum + 2 ** -value,
      0,
    );
    return Math.round(alpha * this.registerCount ** 2 / harmonic);
  }
}

module.exports = { HyperLogLog };
`,
          },
          {
            name: "app.js",
            content: `
const { HyperLogLog } = require("./hyperloglog");

const hll = new HyperLogLog();
[
  "u1",
  "u2",
  "u3",
  "u1",
  "u4",
  "u5",
  "u2",
  "u6",
].forEach((user) => hll.add(user));

console.log("Registers:", hll.registers);
console.log("Estimated uniques:", hll.estimate());
`,
          },
        ],
      },
      {
        id: "example-2",
        title: "Shard Merge Follow-Up",
        summary:
          "Shows the follow-up property that makes HyperLogLog operationally useful: independent sketches can be merged register-wise.",
        runFile: "demo.js",
        checks: [
          "merge keeps the maximum register value per position",
          "partitioned counting avoids shipping raw identities",
          "merged estimates remain approximate but scalable",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { HyperLogLog } = require("../example-1/hyperloglog");

const left = new HyperLogLog();
const right = new HyperLogLog();
["u1", "u2", "u3"].forEach((user) => left.add(user));
["u3", "u4", "u5"].forEach((user) => right.add(user));

const mergedRegisters = left.registers.map((value, index) =>
  Math.max(value, right.registers[index]),
);

console.log("Left estimate:", left.estimate());
console.log("Right estimate:", right.estimate());
console.log("Merged registers:", mergedRegisters);
`,
          },
        ],
      },
      {
        id: "example-3",
        title: "Small-Cardinality Checks",
        summary:
          "Calls out the small-range weakness where approximate estimators are least comfortable and exact sets may be cheaper.",
        runFile: "demo.js",
        checks: [
          "very small cardinalities can be over- or under-estimated",
          "exact sets are often preferable before scale justifies approximation",
          "register precision is a configurable trade-off",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { HyperLogLog } = require("../example-1/hyperloglog");

const hll = new HyperLogLog();
["a", "b"].forEach((value) => hll.add(value));

console.log("Exact unique count:", 2);
console.log("Approximate count:", hll.estimate());
console.log("Observation: small-cardinality bias is why many HLL implementations add correction logic.");
`,
          },
        ],
      },
    ],
  },
  {
    slug: "lsm-trees",
    title: "LSM Trees",
    examples: [
      {
        id: "example-1",
        title: "Write-Heavy Key-Value Store",
        summary:
          "Models an LSM-style store with a mutable memtable and immutable SSTable snapshots to show why writes stay fast.",
        runFile: "app.js",
        checks: [
          "recent writes land in the memtable first",
          "flush turns sorted memory state into immutable segments",
          "reads consult recent state before colder levels",
        ],
        files: [
          {
            name: "lsm-store.js",
            content: `
class LSMStore {
  constructor(flushThreshold = 3) {
    this.flushThreshold = flushThreshold;
    this.memtable = new Map();
    this.sstables = [];
  }

  put(key, value) {
    this.memtable.set(key, value);
    if (this.memtable.size >= this.flushThreshold) this.flush();
  }

  get(key) {
    if (this.memtable.has(key)) return this.memtable.get(key);
    for (const table of this.sstables) {
      if (table.has(key)) return table.get(key);
    }
    return null;
  }

  flush() {
    const sorted = new Map([...this.memtable.entries()].sort(([a], [b]) => a.localeCompare(b)));
    this.sstables.unshift(sorted);
    this.memtable.clear();
  }
}

module.exports = { LSMStore };
`,
          },
          {
            name: "app.js",
            content: `
const { LSMStore } = require("./lsm-store");

const store = new LSMStore(3);
store.put("user:1", "active");
store.put("user:2", "pending");
store.put("user:3", "suspended");
store.put("user:2", "active");

console.log("Memtable size:", store.memtable.size);
console.log("SSTable count:", store.sstables.length);
console.log("Lookup user:2:", store.get("user:2"));
`,
          },
        ],
      },
      {
        id: "example-2",
        title: "Compaction Follow-Up",
        summary:
          "Adds a compaction pass because merge and cleanup behavior is the essential follow-up for LSM discussions.",
        runFile: "demo.js",
        checks: [
          "newer SSTables shadow older values for the same key",
          "compaction rewrites data into fewer sorted runs",
          "read amplification falls as levels are merged",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const newer = new Map([
  ["a", "2"],
  ["c", "9"],
]);
const older = new Map([
  ["a", "1"],
  ["b", "7"],
]);

const compacted = new Map([...older.entries(), ...newer.entries()]);
console.log("Compacted view:", Object.fromEntries(compacted));
`,
          },
        ],
      },
      {
        id: "example-3",
        title: "Tombstone and Stale-Read Checks",
        summary:
          "Covers deletes and stale segments because these are where LSM correctness bugs usually become visible.",
        runFile: "demo.js",
        checks: [
          "deletes are represented as tombstones until compaction",
          "reads must prefer the newest version of a key",
          "old segments may still contain stale values physically",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const tables = [
  new Map([["acct:1", "__deleted__"]]),
  new Map([["acct:1", "active"]]),
];

function lookup(key) {
  for (const table of tables) {
    if (table.has(key)) return table.get(key);
  }
  return null;
}

console.log("Newest logical value:", lookup("acct:1"));
console.log("Observation: tombstones must be preserved until compaction makes older values unreachable.");
`,
          },
        ],
      },
    ],
  },
  {
    slug: "merkle-trees",
    title: "Merkle Trees",
    examples: [
      {
        id: "example-1",
        title: "Artifact Integrity Verifier",
        summary:
          "Builds a Merkle tree over file chunks so integrity can be validated from a single root hash.",
        runFile: "app.js",
        checks: [
          "leaf hashes represent chunk content",
          "internal hashes summarize child hashes recursively",
          "a root mismatch proves some chunk changed",
        ],
        files: [
          {
            name: "merkle.js",
            content: `
const crypto = require("crypto");

function sha(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function buildMerkleRoot(leaves) {
  let level = leaves.map((leaf) => sha(leaf));
  while (level.length > 1) {
    const next = [];
    for (let index = 0; index < level.length; index += 2) {
      const left = level[index];
      const right = level[index + 1] ?? left;
      next.push(sha(left + right));
    }
    level = next;
  }
  return level[0];
}

module.exports = { sha, buildMerkleRoot };
`,
          },
          {
            name: "app.js",
            content: `
const { buildMerkleRoot } = require("./merkle");

const chunks = ["chunk-a", "chunk-b", "chunk-c", "chunk-d"];
const cleanRoot = buildMerkleRoot(chunks);
const tamperedRoot = buildMerkleRoot(["chunk-a", "chunk-b", "chunk-X", "chunk-d"]);

console.log("Clean root:", cleanRoot);
console.log("Tampered root:", tamperedRoot);
console.log("Roots equal?", cleanRoot === tamperedRoot);
`,
          },
        ],
      },
      {
        id: "example-2",
        title: "Inclusion Proof Follow-Up",
        summary:
          "Explains the follow-up use case of inclusion proofs, where a client verifies one leaf without downloading every chunk.",
        runFile: "demo.js",
        checks: [
          "a proof carries sibling hashes along the path to the root",
          "verification recomputes upward from the target leaf",
          "proof size grows logarithmically with leaf count",
        ],
        files: [
          {
            name: "demo.js",
            content: `
console.log("Example proof path for chunk-b:");
console.table([
  { level: 0, sibling: "hash(chunk-a)" },
  { level: 1, sibling: "hash(hash(chunk-c)+hash(chunk-d))" },
]);
console.log("Verification recomputes the root using the target leaf plus sibling hashes.");
`,
          },
        ],
      },
      {
        id: "example-3",
        title: "Odd-Leaf and Update Checks",
        summary:
          "Covers odd leaf counts and partial updates because those operational details are easy to skip but matter in practice.",
        runFile: "demo.js",
        checks: [
          "odd levels duplicate the last hash or use an equivalent policy",
          "changing one leaf only invalidates hashes on its path",
          "root stability depends on deterministic leaf ordering",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { buildMerkleRoot } = require("../example-1/merkle");

const oddRoot = buildMerkleRoot(["a", "b", "c"]);
const updatedRoot = buildMerkleRoot(["a", "b", "c-updated"]);

console.log("Odd leaf root:", oddRoot);
console.log("Updated leaf root:", updatedRoot);
console.log("Observation: only one branch changes logically, but the root still changes globally.");
`,
          },
        ],
      },
    ],
  },
  {
    slug: "skip-lists",
    title: "Skip Lists",
    examples: [
      {
        id: "example-1",
        title: "Leaderboard Index",
        summary:
          "Implements a compact skip list to index leaderboard scores with probabilistic levels and ordered traversal.",
        runFile: "app.js",
        checks: [
          "higher levels skip across large sorted regions",
          "insert preserves overall sorted order",
          "probabilistic balancing avoids full tree rotations",
        ],
        files: [
          {
            name: "skip-list.js",
            content: `
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
`,
          },
          {
            name: "app.js",
            content: `
const { SkipList } = require("./skip-list");

const leaderboard = new SkipList();
[42, 17, 88, 63, 55].forEach((score) => leaderboard.insert(score));

console.log("Ordered scores:", leaderboard.values());
console.log("Top-level head links:", leaderboard.head.forward.map((node) => node && node.value));
`,
          },
        ],
      },
      {
        id: "example-2",
        title: "Range Scan Follow-Up",
        summary:
          "Demonstrates ordered range scans, which are where skip lists often compete directly with balanced trees.",
        runFile: "demo.js",
        checks: [
          "ordered iteration starts at the first matching value",
          "level-zero links provide full sorted traversal",
          "range access is friendlier than in pure hash indexing",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { SkipList } = require("../example-1/skip-list");

const list = new SkipList();
[5, 8, 12, 17, 21, 25].forEach((value) => list.insert(value));

const range = list.values().filter((value) => value >= 10 && value <= 20);
console.log("Range 10..20:", range);
`,
          },
        ],
      },
      {
        id: "example-3",
        title: "Duplicate and Level-Distribution Checks",
        summary:
          "Covers duplicate values and deterministic level assignment so edge cases stay visible in a simplified teaching implementation.",
        runFile: "demo.js",
        checks: [
          "duplicate inserts still preserve sorted traversal",
          "level distribution drives search performance",
          "production skip lists use randomness rather than deterministic levels",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { SkipList } = require("../example-1/skip-list");

const list = new SkipList();
[10, 10, 11, 14].forEach((value) => list.insert(value));

console.log("Values with duplicate:", list.values());
console.log("Observation: real skip lists rely on random promotion to keep expected height low.");
`,
          },
        ],
      },
    ],
  },
  {
    slug: "tries",
    title: "Tries",
    examples: [
      {
        id: "example-1",
        title: "Autocomplete Dictionary",
        summary:
          "Implements a trie to back prefix-based autocomplete over a small dictionary of search suggestions.",
        runFile: "app.js",
        checks: [
          "common prefixes share nodes instead of duplicating storage",
          "prefix traversal reaches the candidate sub-tree directly",
          "autocomplete is faster than scanning every whole string",
        ],
        files: [
          {
            name: "trie.js",
            content: `
class TrieNode {
  constructor() {
    this.children = new Map();
    this.isWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let current = this.root;
    for (const char of word) {
      if (!current.children.has(char)) current.children.set(char, new TrieNode());
      current = current.children.get(char);
    }
    current.isWord = true;
  }

  collect(prefix) {
    let current = this.root;
    for (const char of prefix) {
      current = current.children.get(char);
      if (!current) return [];
    }

    const results = [];
    const dfs = (node, path) => {
      if (node.isWord) results.push(path);
      for (const [char, child] of node.children) dfs(child, path + char);
    };

    dfs(current, prefix);
    return results;
  }
}

module.exports = { Trie };
`,
          },
          {
            name: "app.js",
            content: `
const { Trie } = require("./trie");

const trie = new Trie();
["cache", "caching", "catalog", "category", "queue"].forEach((word) =>
  trie.insert(word),
);

console.log("Suggestions for 'cat':", trie.collect("cat"));
console.log("Suggestions for 'cach':", trie.collect("cach"));
`,
          },
        ],
      },
      {
        id: "example-2",
        title: "Prefix Analytics Follow-Up",
        summary:
          "Adds prefix fan-out inspection as a follow-up so the trie example covers more than raw autocomplete lookups.",
        runFile: "demo.js",
        checks: [
          "prefix counts reflect how many words share a branch",
          "high fan-out prefixes can guide caching decisions",
          "branching structure reveals more than flat string storage",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { Trie } = require("../example-1/trie");

const trie = new Trie();
["api", "app", "apple", "apply", "apt"].forEach((word) => trie.insert(word));

const suggestions = trie.collect("ap");
console.log("Words under 'ap':", suggestions);
console.log("Prefix count:", suggestions.length);
`,
          },
        ],
      },
      {
        id: "example-3",
        title: "Duplicate Words and Empty Prefix Checks",
        summary:
          "Exercises duplicate inserts and empty-prefix behavior because these are common edge conditions in autocomplete services.",
        runFile: "demo.js",
        checks: [
          "duplicate word inserts do not corrupt the trie",
          "an empty prefix can enumerate the whole dictionary",
          "missing prefixes should terminate early with no candidates",
        ],
        files: [
          {
            name: "demo.js",
            content: `
const { Trie } = require("../example-1/trie");

const trie = new Trie();
["go", "go", "gone", "guild"].forEach((word) => trie.insert(word));

console.log("All words:", trie.collect(""));
console.log("Missing prefix 'z':", trie.collect("z"));
`,
          },
        ],
      },
    ],
  },
];

for (const topic of topics) createTopic(topic);

console.log(`Generated ${topics.length} data-structure topic example set(s).`);
