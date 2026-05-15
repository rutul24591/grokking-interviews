"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-dsa-data-structures-persistent-data-structures",
  title: "Persistent Data Structures",
  description: "Persistent data structures preserve all previous versions after updates — enabling time-travel queries, undo/redo systems, functional programming, and database MVCC through structural sharing that keeps update costs to O(log n) new nodes.",
  category: "other",
  subcategory: "data-structures-algorithms",
  slug: "persistent-data-structures",
  wordCount: 2500,
  readingTime: 10,
  lastUpdated: "2026-05-16",
  tags: ["persistent-data-structures", "immutable", "path-copying", "functional", "segment-tree"],
  relatedTopics: ["segment-tree", "trees", "fenwick-tree", "functional-programming"],
};

export default function PersistentDataStructuresArticle() {
  return (
    <ArticleLayout metadata={metadata}>

      <section>
        <h2>Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: persistent data structures appear in two contexts — competitive programming (offline range kth-smallest using persistent segment tree) and system design (MVCC in databases, undo/redo, Git internals). Know path copying for trees and the O(log n) cost per version, and be able to explain the structural sharing that makes persistence efficient.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          A <strong>persistent data structure</strong> preserves every previous version of itself after updates. A standard (ephemeral) data structure destroys the old version when updated; a persistent one lets you query any past version at any time. There are two flavors: <strong>partially persistent</strong> structures allow updates only to the current version but queries on all versions; <strong>fully persistent</strong> structures allow updates to any version, creating a branching version DAG.
        </HighlightBlock>
        <p>
          The naive approach — copying the entire structure on each update — costs O(n) time and space per update, which is too expensive for large structures with many updates. The key technique, <strong>path copying</strong>, copies only the path from root to the modified node, leaving all other subtrees shared between versions. This brings the cost per update down to O(log n) new nodes for balanced trees and tries.
        </p>
        <p>
          Persistence is fundamental to functional programming (Haskell, Clojure, Scala immutable collections use persistent hash array mapped tries), version control systems (Git stores immutable tree snapshots), database systems (MVCC provides snapshot isolation by maintaining multiple versions of each row), and competitive programming (persistent segment trees solve offline kth-smallest in O(n log n) time and space).
        </p>
      </section>

      <section>
        <h2>Path Copying — The Core Technique</h2>
        <HighlightBlock as="p" tier="important">
          Path copying is the standard technique for making any tree-based structure persistent. When updating a node x, copy every node on the path from the root to x. The new copies point to new children along the update path and share all other subtrees with the previous version. The new root of the copied path becomes the root of the new version.
        </HighlightBlock>
        <p>
          For a balanced BST of height h = O(log n), each update creates O(log n) new nodes. For a trie of depth L (key length), each update creates O(L) new nodes. The old versions remain intact because no existing node is modified — only new nodes are added. All old roots remain valid entry points to their respective versions.
        </p>
        <p>
          The total space for k updates to an initially n-node structure is O(n + k log n) — the original structure plus O(log n) new nodes per update. This is efficient: storing k complete copies would require O(kn) space.
        </p>
        <p>
          Structural sharing is the reason this works: the unchanged subtrees are shared between versions via pointer aliasing. A node that is not on the update path is pointed to by both the old version and the new version. Because nodes are never modified (only new nodes are created), this sharing is safe — there are no aliasing bugs. This immutability is the same property that makes functional data structures safe for concurrent access without locks.
        </p>
      </section>

      <section>
        <h2>Persistent Segment Tree</h2>
        <HighlightBlock as="p" tier="important">
          The persistent segment tree is the most commonly tested persistent data structure in FAANG-level interviews. It stores an array of version roots (roots[0..k]) and creates O(log n) new nodes per update. Every query on version v traverses from roots[v] — the tree as it existed after the v-th update.
        </HighlightBlock>
        <p>
          The standard application is <strong>offline range kth-smallest</strong>: given an array A of n values and queries of the form &quot;what is the kth smallest value in A[l..r]?&quot;, answer all queries in O(log n) per query after O(n log n) preprocessing.
        </p>
        <p>
          Construction: process array elements left to right, inserting each value into the segment tree (where the segment tree is indexed by value, not position, after coordinate compression). After inserting A[i], save the new root as roots[i]. The segment tree at version i counts how many of the first i elements have values in each range [lo, hi].
        </p>
        <p>
          Query(l, r, k): walk two version trees simultaneously — roots[l-1] (before position l) and roots[r] (after position r). At each segment tree node covering value range [lo, hi] with midpoint mid, compute count = (left child count in roots[r]) - (left child count in roots[l-1]). If count &gt;= k, recurse left; otherwise recurse right with k -= count. After O(log n) steps, reach a leaf — that leaf&apos;s value is the kth smallest.
        </p>
        <p>
          This technique elegantly combines persistent structure with the segment tree&apos;s divide-and-conquer to answer what would otherwise require a balanced BST per query prefix — a total of O(n²) space.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/persistent-data-structures-architecture.svg"
          alt="Persistent Data Structures — path copying, persistent segment tree, fat nodes, and applications"
          caption="Persistent data structures: path copying creates O(log n) new nodes per update with structural sharing, persistent segment tree enables O(log n) kth-smallest queries"
        />
        <p>
          The diagram covers four aspects of persistence. Top-left: the path copying mechanism for BSTs and tries. Top-right: persistent segment tree with version roots array and simultaneous two-version tree walk for kth-smallest. Bottom-left: fat node and node copying methods as alternative implementation techniques. Bottom-right: real-world applications from Git to MVCC to React state.
        </p>
      </section>

      <section>
        <h2>Fat Node &amp; Node Copying Methods</h2>
        <p>
          Path copying is the most common persistence technique, but two alternatives exist for cases where the update path is not easily defined.
        </p>
        <p>
          <strong>Fat node method:</strong> instead of copying nodes, augment each node with a list of (value, timestamp) pairs. When a field is updated, append (new_value, current_time) to its list rather than overwriting. To query at time t, binary search the list for the largest timestamp ≤ t. This gives O(1) amortized update and O(log k) query (where k is the number of updates to that field). Total space is O(n + k) for k updates. The downside is poor cache behavior for nodes with many historical values.
        </p>
        <p>
          <strong>Node copying (Driscoll et al., 1989):</strong> each node has a fixed number of extra modification fields. When all extra fields are used, copy the node (creating a new version of that node) and update the parent to point to the copy. This gives O(log n) amortized per update and O(log n) per query with O(n) space per update — optimal space for pointer-based structures.
        </p>
        <p>
          In practice, path copying is used almost universally for tree-based structures because it is simple to implement and naturally integrates with functional programming patterns.
        </p>
      </section>

      <section>
        <h2>Persistent Arrays and Hash Maps</h2>
        <p>
          Standard arrays are not naturally tree-based, but a persistent array can be built from a complete binary tree where leaves store array values. An update to index i copies the O(log n) path from root to the leaf at position i. Query at version v, index i: traverse from roots[v] down to the leaf — O(log n) per access. This is slower than O(1) array access but enables persistence.
        </p>
        <p>
          Clojure&apos;s PersistentVector uses a 32-way trie (branching factor 32, depth ≤ 6) for near-O(1) access (6 steps instead of log₂n steps) with O(32 × 6) = O(192) new nodes per update. This is the data structure behind Clojure&apos;s immutable vectors and, by extension, Facebook&apos;s Immutable.js library.
        </p>
        <p>
          Clojure&apos;s PersistentHashMap uses a Hash Array Mapped Trie (HAMT) — a compressed 32-way trie keyed by hash bits. The HAMT achieves O(log₃₂ n) operations — effectively constant for practical n — with structural sharing between versions. This is also the basis for Scala&apos;s immutable HashMap and Haskell&apos;s Data.HashMap.
        </p>
      </section>

      <section>
        <h2>Trade-offs</h2>
        <HighlightBlock as="p" tier="important">
          Persistence adds a constant factor (typically 2-5×) in time and O(log n) in space per update compared to ephemeral equivalents. The tradeoff is worth it when: (1) multiple versions must be queried (offline algorithms, undo/redo), (2) concurrent readers exist (no locking needed on immutable versions), or (3) functional correctness is required (immutable state simplifies reasoning about program behavior).
        </HighlightBlock>
        <p>
          The main cost is memory: persistent structures accumulate old versions. A persistent segment tree with n versions uses O(n log n) space — for n = 10⁶ and a 32-bit segment tree, this is ~20M nodes × 12 bytes ≈ 240MB. Plan for this in competitive programming and production systems.
        </p>
        <p>
          Garbage collection handles old versions automatically in managed languages (Java, Python, JavaScript), but in C++ or competitive programming, old nodes accumulate in a pre-allocated pool. Memory pool allocation (global array + counter) is dramatically faster than malloc per node and is standard practice.
        </p>
      </section>

      <section>
        <h2>Real-World Applications</h2>
        <HighlightBlock as="p" tier="important">
          <strong>Git:</strong> every commit points to an immutable tree object (a persistent trie of file paths to blob SHAs). Commits share unchanged subtrees — a one-file commit in a 100,000-file repository creates only O(log 100000) ≈ 17 new tree nodes, not 100,000.
        </HighlightBlock>
        <p>
          <strong>Database MVCC:</strong> PostgreSQL, MySQL InnoDB, and Oracle maintain multiple versions of each row to provide snapshot isolation. Each transaction reads the version of rows that existed at transaction start time, without blocking writers. This is conceptually equivalent to a persistent data structure where each transaction creates a new &quot;version&quot; of affected rows.
        </p>
        <p>
          <strong>Functional languages:</strong> Clojure, Haskell, and Scala use persistent data structures as their default collections. Immutability enables safe concurrency (no locks needed), referential transparency (pure functions), and structural sharing for efficient copying.
        </p>
        <p>
          <strong>React state management:</strong> React&apos;s reconciliation relies on immutable state updates — the virtual DOM diff algorithm compares old and new state via reference equality checks, which is O(1) only when state is immutable and structural sharing is used. Libraries like Immer and Immutable.js implement persistent data structures for this purpose.
        </p>
        <p>
          <strong>Competitive programming:</strong> persistent segment trees solve LeetCode 315 (Count of Smaller Numbers After Self), LeetCode 493 (Reverse Pairs), and the classic offline range kth-smallest problem that appears in many advanced algorithm competitions.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: explain path copying clearly (O(log n) new nodes, structural sharing, immutable nodes), walk through the persistent segment tree for kth-smallest, and connect to real systems (Git trees, MVCC) — these signal staff-level awareness of how persistence appears in practice.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Q1: What is a persistent data structure and how does path copying achieve it efficiently? (junior-mid)</h3>
          <p>A persistent data structure preserves all previous versions after updates. Path copying achieves this by copying only the nodes on the root-to-modified-leaf path on each update, leaving all other subtrees shared with the previous version. The new copy of the root becomes the new version&apos;s entry point; the old root remains unchanged. For a balanced tree of height O(log n), each update creates O(log n) new nodes — far cheaper than copying the whole structure.</p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Q2: Walk through how a persistent segment tree answers &quot;kth smallest in A[l..r]&quot; queries. (mid-senior)</h3>
          <p>Build n+1 segment tree versions, one per prefix of A. Version i is built by inserting A[i]&apos;s value into the coordinate-compressed segment tree (which counts values in ranges). Save root[i] after each insertion. To answer kth-smallest in A[l..r]: walk trees rooted at root[r] and root[l-1] simultaneously. At each node, compute count = root[r].left.count - root[l-1].left.count — the number of elements in A[l..r] whose value falls in the left half. If count &gt;= k, recurse left; else recurse right with k -= count. Repeat for O(log n) steps to reach the answer.</p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Q3: How does Git use persistent data structures internally? (mid)</h3>
          <p>Git stores the repository as a DAG of immutable objects. Each commit points to a tree object representing the root directory. Tree objects point to other tree objects (subdirectories) and blob objects (file contents). All objects are content-addressed by SHA-1 hash — an object&apos;s hash is determined by its content, so identical content is automatically deduplicated. When you commit a change to one file, Git creates new blob and tree objects only for the changed file and its ancestor directories — O(depth) new objects, not O(total files). All unchanged subtrees are shared between commits via their existing SHA hashes. This is path copying in a content-addressed file system.</p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Q4: What is the space complexity of a persistent segment tree after n insertions? (senior)</h3>
          <p>Each insertion into a persistent segment tree creates O(log n) new nodes (one per level of the tree). After n insertions, total new nodes = O(n log n). The original segment tree has O(n) nodes. Total space: O(n log n). For n = 10⁶ and a typical segment tree node of 12 bytes (left index, right index, value), this is ~20 × 10⁶ × 12 bytes ≈ 240MB. In competitive programming, allocate a static array of 20×10⁶ nodes upfront to avoid malloc overhead.</p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Q5: How does database MVCC use persistence concepts? What are the trade-offs vs locking? (senior)</h3>
          <p>MVCC (Multi-Version Concurrency Control) maintains multiple versions of each row. When a transaction updates a row, it creates a new version rather than overwriting the old one (like path copying). Each transaction reads the snapshot of the database as of its start time — it sees only versions committed before it began. This enables readers and writers to proceed concurrently without blocking each other, unlike lock-based systems where readers block writers and vice versa.</p>
          <p>Trade-offs: MVCC requires a garbage collection process (vacuum in PostgreSQL) to reclaim old row versions that no active transaction needs. Under high write load, old version accumulation can consume significant storage and slow down full-table scans. Lock-based systems avoid storage overhead but suffer from higher contention. MVCC wins for read-heavy OLTP workloads; lock-based can win for write-heavy workloads on small tables.</p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Q6: Design an undo/redo system for a collaborative document editor using persistent data structures. (staff)</h3>
          <p>Represent document state as a persistent rope or persistent trie (character-indexed tree). Each edit operation creates a new version via path copying — O(log n) new nodes for a balanced structure. Maintain a version pointer (current version index) and a version DAG.</p>
          <p>Undo: decrement version pointer — the old version is immediately accessible (O(1)), since it was never mutated. Redo: increment version pointer. Branching undo (user undoes, then makes a new edit): create a new branch in the version DAG from the current version. Maintain a list of version roots for each branch.</p>
          <p>For collaborative editing, each client maintains its own version pointer on the shared DAG. Operational transforms or CRDTs reconcile concurrent edits. Persistent structure ensures that each client&apos;s local state is always recoverable without affecting other clients&apos; views — a direct application of the immutability property of persistent data structures.</p>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2 text-sm text-muted">
          <li>Driscoll, J. et al. (1989). &quot;Making Data Structures Persistent&quot; — JCSS 38(1)</li>
          <li>Okasaki, C. (1999). <em>Purely Functional Data Structures</em> — Cambridge University Press</li>
          <li>Bagwell, P. (2001). &quot;Ideal Hash Trees&quot; — EPFL Technical Report (basis for HAMT)</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
