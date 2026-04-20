"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "trees",
  title: "Trees",
  description:
    "Staff-level deep dive into trees — binary search trees, balanced variants (AVL, red-black), traversal patterns, persistent trees, and the role of trees as indexes and scheduler structures.",
  category: "other",
  subcategory: "data-structures",
  slug: "trees",
  wordCount: 4600,
  readingTime: 19,
  lastUpdated: "2026-04-17",
  tags: [
    "trees",
    "binary-search-tree",
    "avl",
    "red-black-tree",
    "data-structures",
    "balanced-trees",
  ],
  relatedTopics: [
    "heaps-priority-queues",
    "hash-tables",
    "b-trees",
    "graphs",
  ],
};

export default function TreesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* SECTION 1 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p>
          A <strong>tree</strong> is a connected acyclic graph: a collection
          of nodes arranged in a parent-child hierarchy, with one
          distinguished root, such that every non-root node has exactly one
          parent. A <strong>binary tree</strong> restricts each node to at
          most two children. A <strong>binary search tree</strong> (BST)
          adds an ordering invariant — for every node, all keys in the
          left subtree are less than the node&apos;s key and all keys in
          the right subtree are greater — turning the tree into an
          ordered data structure where search, insert, and delete run in
          O(h) time where h is the tree&apos;s height.
        </p>
        <p>
          The critical fact is that h ranges from log₂ n in a perfectly
          balanced tree to n − 1 in a fully degenerate one. Without
          rebalancing, sorted or adversarial insertion orders produce
          linear trees and destroy the structure&apos;s performance
          guarantees. The last seventy years of tree research — AVL trees
          (1962), red-black trees (1972), splay trees (1985), treaps
          (1989), skip lists (1990), B-trees (1970), and more — all
          exist to enforce height bounds automatically as the tree
          mutates. Specialized shapes serve different queries:
          <strong> segment trees</strong> and
          <strong> Fenwick (binary-indexed) trees</strong> answer range
          aggregates in O(log n), <strong>persistent</strong> (functional)
          trees share structure across versions to give immutable snapshots
          without copying, and <strong>interval/k-d trees</strong> index
          geometric data.
        </p>
        <p>
          In production software, trees are everywhere. Databases index
          rows with B-trees and LSM trees. File systems store directory
          structures as trees. Schedulers order runnable tasks with
          red-black trees (Linux CFS). Compilers represent ASTs. React
          represents component hierarchies. Even inside &quot;hash&quot; maps,
          Java 8+ promotes long bucket chains to red-black trees to defeat
          hash-flooding attacks. Tree fluency is therefore not optional
          at staff level — it is the substrate on which most of the
          performance-critical parts of the stack are built.
        </p>
        <p>
          The interview appeal of trees is their recursive shape: every
          traversal, search, and mutation can be expressed in a handful
          of lines that hide considerable subtlety. Good tree questions
          probe whether a candidate thinks about invariants
          (height balance, BST ordering, heap property), understands
          iterative conversions (for stack-safety), and recognizes when
          an unbalanced tree is the source of a correctness-looking
          performance problem.
        </p>
      </section>

      {/* SECTION 2 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Terminology</h3>
        <p>
          A <strong>node</strong> contains a key and pointers to its
          children. <strong>Root</strong> is the top node, <strong>leaf
          </strong> is any node with no children, <strong>internal</strong>
          {" "}is any non-leaf. <strong>Depth</strong> is distance from the
          root; <strong>height</strong> is the maximum depth among
          descendants. A tree is <strong>balanced</strong> when its height
          is bounded by a constant factor of log n. The <strong>in-order
          traversal</strong> of a BST visits keys in sorted order — a
          defining property of ordered trees.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          BST operations
        </h3>
        <p>
          <strong>Search</strong>: starting at the root, compare the target
          to the current key; recurse left if smaller, right if larger,
          stop on equality or null. O(h). <strong>Insert</strong>: search
          for the key; if not found, attach a new leaf. O(h).
          <strong> Delete</strong>: if the node has zero or one child,
          splice it out. If it has two children, replace it with its
          in-order successor (or predecessor) and delete that successor.
          O(h). All three reduce to tree height; balanced variants keep h
          logarithmic.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Tree traversals
        </h3>
        <p>
          Four canonical orderings: <strong>pre-order</strong> (root,
          left, right — useful for serialization),
          <strong> in-order</strong> (left, root, right — yields sorted
          keys on a BST), <strong>post-order</strong> (left, right, root —
          used for bottom-up computations like tree destruction or
          sub-tree aggregates), and <strong>level-order</strong> /
          breadth-first (visit nodes by depth — needs a queue instead of a
          stack). Every recursive tree algorithm reduces to one of these
          traversals; iterative versions use an explicit stack or queue,
          essential to avoid stack overflow on deep trees.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/trees-diagram-1.svg"
          alt="Binary tree anatomy showing root internal nodes leaves depth and height with parent child relationships"
          caption="Figure 1: Binary tree anatomy — root at top, leaves at the bottom; height is the longest root-to-leaf path."
        />
      </section>

      {/* SECTION 3 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          AVL trees
        </h3>
        <p>
          The first self-balancing BST. Every node stores a balance factor
          — the height of its right subtree minus its left. After every
          insertion or deletion, nodes on the path from the root to the
          mutation are checked; if any balance factor exceeds ±1, one of
          four rotation patterns (LL, LR, RL, RR) restores balance. AVL
          trees keep height strictly bounded by ~1.44 log₂ n, the tightest
          of the standard balanced-BST variants. This tight bound buys
          faster lookups at the cost of more frequent rebalancing on
          insertion.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Red-black trees
        </h3>
        <p>
          A slightly looser balance invariant with four properties: (1)
          every node is red or black; (2) the root is black; (3) no two
          consecutive reds; (4) every path from root to null has the same
          number of black nodes. These guarantee height ≤ 2 log₂(n + 1).
          The looser balance means fewer rotations per insert/delete
          than AVL — typically 0–2 rotations versus AVL&apos;s up to
          log n. Red-black trees power Java&apos;s <code>TreeMap</code>,
          C++ <code>std::map</code>, the Linux CFS scheduler, and epoll&apos;s
          interest list. They are the default balanced BST in most
          industrial-grade software.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Rotations
        </h3>
        <p>
          All balanced-BST rebalancing reduces to left and right
          rotations — local tree surgeries that preserve the BST ordering
          while changing the depth of subtrees. A left rotation around
          node X promotes X&apos;s right child; a right rotation does the
          mirror. Rotations touch only four to six pointers and run in
          O(1). They are the primitive from which every balancing
          algorithm is composed; understanding rotations is the key to
          understanding how balance invariants propagate up the tree
          after a mutation.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/trees-diagram-2.svg"
          alt="Binary search tree operations insert search delete with before and after states showing BST invariant preservation"
          caption="Figure 2: BST operations — search follows the ordering invariant; insert and delete restructure the tree while preserving it."
        />
      </section>

      {/* SECTION 4 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">
          Trade-offs &amp; Comparisons
        </h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Operation complexity (balanced BST)
        </h3>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Search / insert / delete</strong>: O(log n) worst case
            with balancing; O(n) without.
          </li>
          <li>
            <strong>In-order iteration</strong>: O(n) with O(log n) space
            (call stack or explicit).
          </li>
          <li>
            <strong>Min / max</strong>: O(log n) — walk left / right from
            root.
          </li>
          <li>
            <strong>Predecessor / successor</strong>: O(log n) amortized.
          </li>
          <li>
            <strong>Range query [a, b]</strong>: O(log n + k) where k is
            the number of keys in the range.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          BST vs hash map
        </h3>
        <p>
          Hash maps give expected O(1); BSTs give worst-case O(log n). For
          random well-distributed keys, hash maps win on average. For
          ordered iteration, range queries, or adversarial-safe worst-case
          guarantees without hash randomization, BSTs win. Many workloads
          use both: a hash index for equality and a BST index for ranges.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          AVL vs red-black
        </h3>
        <p>
          AVL trees have tighter height bounds → faster lookups. Red-black
          trees rebalance less aggressively → faster insertions and
          deletions. Benchmarks favor red-black on write-heavy workloads
          and AVL on read-heavy ones, though the difference is usually
          modest (10–30%). Production code overwhelmingly chose red-black
          because it dominates the mixed-workload case and has a simpler
          delete algorithm.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Binary tree vs B-tree
        </h3>
        <p>
          A binary tree stores one key per node and two children; a B-tree
          stores hundreds to thousands of keys per node with
          correspondingly high fanout. For in-memory workloads, binary
          trees are fine — the cache line holds the single key. For
          disk-backed indexes, a binary tree&apos;s log₂ n random disk
          reads are catastrophic; a B-tree of order 1000 does the same
          search in log₁₀₀₀ n reads — 3–4 disk hits for billions of keys.
          Every database index is a B-tree or B+ tree for exactly this
          reason.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Tree vs skip list
        </h3>
        <p>
          Skip lists provide logarithmic ordered access with a probabilistic
          structure that&apos;s simpler to implement (no rotations) and
          easier to make concurrent. Redis&apos; sorted set (<code>ZSET</code>)
          uses a skip list precisely because its lock-free operations
          compose better than a balanced BST&apos;s rebalancing. The
          expected-case complexity is identical; the constants differ by
          maybe 2× in either direction depending on workload.
        </p>
      </section>

      {/* SECTION 5 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Use the standard library.</strong> Java <code>TreeMap</code>,
            C++ <code>std::map</code>, Rust <code>BTreeMap</code>,
            .NET <code>SortedDictionary</code> give you a tested
            balanced tree. Implementing your own is rarely justified.
          </li>
          <li>
            <strong>Prefer iterative traversals for deep trees.</strong>
            {" "}Recursive traversal blows the stack at a few thousand levels
            of depth. An explicit stack or Morris traversal (threading
            unused child pointers) avoids the limit.
          </li>
          <li>
            <strong>Choose balance by workload.</strong> Read-heavy?
            Consider AVL. Write-heavy? Red-black. Needs lock-free?
            Consider skip list. Persistent / immutable? Persistent
            red-black or finger tree.
          </li>
          <li>
            <strong>Monitor tree height in debug builds.</strong> A
            self-balancing tree should have height ≤ 2 log n. Assertions
            or instrumentation catch bugs where balance is broken
            silently.
          </li>
          <li>
            <strong>Batch insertions when possible.</strong> Building a
            tree from scratch by bulk-sorting and constructing in
            O(n log n) is faster than n individual O(log n) inserts due
            to better cache behavior.
          </li>
          <li>
            <strong>Serialize with canonical form.</strong> Multiple
            BSTs can hold the same key set with different shapes;
            serializing keys in in-order traversal gives canonical
            output that can be reconstructed into a balanced tree on the
            other side.
          </li>
        </ul>
      </section>

      {/* SECTION 6 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Sorted-insert degeneration.</strong> Inserting a
            pre-sorted sequence into an unbalanced BST produces a linear
            tree — every operation is then O(n). Always use a
            self-balancing variant or shuffle before inserting.
          </li>
          <li>
            <strong>Stack overflow on deep recursion.</strong>{" "}
            Tree-of-depth-100,000 will blow the thread stack on any
            recursive traversal. Convert to iteration or use bounded
            recursion with explicit continuations.
          </li>
          <li>
            <strong>BST delete bugs.</strong> The two-child case is the
            source of more bugs than any other. The canonical approach
            — find in-order successor, copy its key, delete successor
            (which has at most one child) — should be rigorously tested
            at edges.
          </li>
          <li>
            <strong>Iterator invalidation on mutation.</strong>{" "}
            Modifying the tree while iterating can skip or revisit
            nodes. Snapshot, use a copy-on-write variant, or accept the
            restriction.
          </li>
          <li>
            <strong>Balance invariant violations.</strong> Writing
            AVL or red-black rebalancing from scratch is error-prone;
            off-by-one errors in rotation counts or color flips produce
            subtly unbalanced trees that still work correctly but lose
            their O(log n) guarantee silently.
          </li>
          <li>
            <strong>Key mutation post-insertion.</strong> Mutating a
            key&apos;s ordering value after insert corrupts the BST
            invariant. Treat tree keys as immutable.
          </li>
          <li>
            <strong>Equality semantics.</strong> A BST with a custom
            comparator and a hash map with a custom equality function on
            the same key set can disagree on membership if the two
            orderings aren&apos;t consistent. Make sure{" "}
            <code>compareTo</code> and <code>equals</code> agree.
          </li>
        </ul>
      </section>

      {/* SECTION 7 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Linux CFS scheduler
        </h3>
        <p>
          The Completely Fair Scheduler keeps runnable tasks in a
          red-black tree keyed by virtual runtime — each task&apos;s
          vruntime advances as it gets CPU time. The leftmost node is
          always the task with the smallest runtime, so pick-next-task
          is O(log n). Insert and delete when tasks block or unblock are
          also O(log n). This tree is the reason Linux can schedule
          thousands of threads fairly with bounded overhead.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Java TreeMap and C++ std::map
        </h3>
        <p>
          Both are red-black trees in their reference implementations.
          They give O(log n) ordered access, range queries via
          <code> subMap</code>/<code>equal_range</code>, and floor/ceiling
          queries. Used heavily in compiler symbol tables (scoped name
          resolution), scheduler state, and any workload that needs
          sorted iteration.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Java HashMap tree-bin fallback
        </h3>
        <p>
          Since Java 8, HashMap buckets transition from linked lists to
          red-black trees when their chain exceeds 8 entries. This
          defeats hash-flooding attacks by bounding per-bucket worst case
          at O(log n) rather than O(chain length). The transition back
          to a list happens at 6 entries (hysteresis to prevent
          thrashing). A beautiful example of layering balanced trees on
          hash tables for robustness.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          React fiber tree
        </h3>
        <p>
          React represents the component hierarchy as a fiber tree —
          each fiber is a node with child, sibling, and return (parent)
          pointers. The reconciler walks this tree with an iterative
          depth-first traversal (not recursion — to support
          interruption). The same tree structure is what lets React
          reason about component ordering, context propagation, and
          suspense boundaries.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/trees-diagram-3.svg"
          alt="AVL tree rotation example showing left rotation rebalancing after unbalanced insert"
          caption="Figure 3: AVL rotation — a single left rotation rebalances a right-heavy subtree by promoting a child node."
        />
      </section>

      {/* SECTION 8 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Validate that a binary tree is a BST.
            </p>
            <p className="mt-2 text-sm">
              A: Common trap: checking only that each node&apos;s left
              child is smaller and right child is larger. That&apos;s
              necessary but not sufficient — a node deep in the left
              subtree could be larger than the root. The correct approach
              passes down a (lowerBound, upperBound) range. At the root
              the bounds are (−∞, +∞); each left child narrows the upper
              bound to the current node&apos;s key, each right child
              narrows the lower bound. O(n) time, O(h) space. Alternatively,
              perform an in-order traversal and verify output is strictly
              increasing.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Find the lowest common ancestor of two nodes.
            </p>
            <p className="mt-2 text-sm">
              A: Two approaches. (1) On a BST, walk from the root: when
              both targets are less than current, go left; when both
              greater, go right; otherwise current is the LCA. O(h) time.
              (2) On a plain binary tree, recurse; a node is the LCA if
              targets are found in different subtrees. O(n) time. For
              frequent LCA queries on a static tree, Tarjan&apos;s offline
              algorithm with union-find gives O((n + q)α(n)), or Euler
              tour + RMQ gives O(1) queries after O(n log n) preprocessing.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Why does a red-black tree not use AVL-tight balance?
            </p>
            <p className="mt-2 text-sm">
              A: To reduce rebalancing work. AVL&apos;s tight h ≤ 1.44
              log₂ n requires more rotations per update than red-black&apos;s
              h ≤ 2 log₂(n+1). Red-black accepts slightly taller trees
              (10–30% more lookups) for 2–3× fewer rotations on inserts
              and deletes. For mixed workloads — most real systems —
              red-black wins overall. It&apos;s also easier to write
              correct red-black code: the invariant is 4 rules, the
              deletion procedure is fewer cases than AVL&apos;s.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Implement iterative in-order traversal of a binary tree.
            </p>
            <p className="mt-2 text-sm">
              A: Use an explicit stack. Initialize with current = root and
              empty stack. Loop: push all left descendants of current onto
              the stack; pop one, visit it, then set current to its right
              child. Continue until both stack and current are empty. O(n)
              time, O(h) space. For O(1) space, Morris traversal
              temporarily rewires predecessor pointers to thread back to
              successors — elegant but mutating.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Serialize and deserialize a binary tree.
            </p>
            <p className="mt-2 text-sm">
              A: Pre-order traversal with explicit null markers. On
              serialize, emit the node&apos;s key, then recurse left,
              then right, emitting a sentinel like <code>#</code> for
              nulls. On deserialize, consume tokens in the same order,
              constructing nodes recursively and returning null on the
              sentinel. O(n) time and space for both directions. For BSTs,
              pre-order without null markers suffices (the ordering
              reconstructs structure). For level-order serialization (e.g.
              LeetCode), use a queue-based approach.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Why is a BST with sorted insertions O(n²) to build?
            </p>
            <p className="mt-2 text-sm">
              A: Each insert walks the longest path. With sorted input,
              every new key goes to the rightmost position, producing a
              linear tree of depth n. The k-th insert walks k steps, so
              total work is 1 + 2 + ... + n = O(n²). The fix is a
              self-balancing variant that ensures rebalancing keeps
              h = O(log n), giving O(n log n) total. This is why you
              should almost never use a vanilla BST in production — use
              TreeMap, BTreeMap, or equivalent.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 9 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">
          References &amp; Further Reading
        </h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Knuth, D.E. — <em>The Art of Computer Programming, Volume 3:
            Sorting and Searching</em>, Section 6.2 on binary search trees
            and their balancing.
          </li>
          <li>
            Cormen, Leiserson, Rivest, Stein — <em>Introduction to
            Algorithms</em>, 4th Edition, Chapters 12 (BSTs), 13 (Red-Black)
            with complete proofs and pseudo-code.
          </li>
          <li>
            Adelson-Velsky, G., Landis, E. — <em>An algorithm for the
            organization of information</em>, 1962: the original AVL tree
            paper.
          </li>
          <li>
            Guibas, L., Sedgewick, R. — <em>A dichromatic framework for
            balanced trees</em>, FOCS 1978: the red-black tree foundational
            paper.
          </li>
          <li>
            Sedgewick, R. — <em>Left-leaning Red-Black Trees</em>, 2008:
            a simplified variant whose code is dramatically shorter than
            the classical formulation.
          </li>
          <li>
            Okasaki, C. — <em>Purely Functional Data Structures</em>,
            Cambridge University Press, 1998: persistent red-black trees
            with structural sharing for immutable languages.
          </li>
          <li>
            Linux kernel documentation — <em>sched/fair.c and rbtree.h</em>:
            production red-black tree implementation driving the CFS
            scheduler.
          </li>
          <li>
            Open JDK source — <code>TreeMap.java</code>: a complete,
            production-grade red-black tree with well-annotated code
            suitable for reference.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
