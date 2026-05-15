"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-dsa-data-structures-segment-tree",
  title: "Segment Tree & Lazy Propagation",
  description: "A comprehensive deep-dive into segment trees and lazy propagation: build, query, and update algorithms, lazy deferral mechanics, persistent and coordinate-compressed variants, and how to apply them in LeetCode problems and real-world range aggregation systems.",
  category: "other",
  subcategory: "data-structures-algorithms",
  slug: "segment-tree",
  wordCount: 3000,
  readingTime: 12,
  lastUpdated: "2026-05-15",
  tags: ["segment-tree", "lazy-propagation", "range-queries", "data-structures"],
  relatedTopics: ["fenwick-tree", "trees", "binary-search"],
};

export default function SegmentTreeArticle() {
  return (
    <ArticleLayout metadata={metadata}>

      {/* ── 1. Definition & Context ── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: a segment tree is the go-to answer whenever an interviewer asks you to handle range queries combined with point or range updates in sub-linear time. Knowing when to reach for it — and when a simpler Fenwick tree or sparse table is enough — signals staff-level judgment.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important" className="mb-4">
          A segment tree is a binary tree built over an array where every node stores a precomputed aggregate (sum, minimum, maximum, GCD, etc.) for a contiguous subarray. The root stores the aggregate of the entire array; its left child covers the left half; its right child covers the right half; leaves store individual array elements. This recursive halving lets you answer any range aggregate query in O(log n) time and update any element in O(log n) time, versus O(n) for a naive pass.
        </HighlightBlock>
        <p className="mb-4">
          The core trade-off that motivates segment trees is this: precomputing all possible range answers would cost O(n&#178;) space; answering queries on the fly costs O(n) time. A segment tree strikes the middle ground — O(n) space and O(log n) per operation — by storing only n-1 internal aggregates, one per internal node, and combining them at query time as needed.
        </p>
        <p>
          Segment trees become essential when the problem has two properties simultaneously: range queries (aggregate over a subarray) and mutations (point updates or range updates). If the data is static (immutable), a sparse table delivers O(1) queries. If only point updates exist and the operation is invertible (like addition), a Fenwick tree (Binary Indexed Tree) is simpler and faster. When you need both range queries and range updates — particularly with non-invertible operations like min or max — the segment tree with lazy propagation is the standard solution.
        </p>
      </section>

      {/* ── 2. Core Concepts ── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: describe the node layout, indexing scheme, and what each node represents before jumping into algorithms. Interviewers want to see you ground the data structure before discussing operations.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important" className="mb-4">
          A segment tree for an array of n elements is stored in a 1-indexed array of size 4n (allocating 4n is the safe upper bound; the exact minimum is 2 &#215; 2&#8968;log&#8322;n&#8969;). Node 1 is the root. For any internal node i, its left child is at index 2i and its right child is at index 2i+1. The parent of node i is at i/2 (integer division). Leaf nodes represent individual array elements; each internal node represents the aggregate of the range covered by its two children combined.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important" className="mb-4">
          Every node i tracks a half-open or closed interval [l, r] of the original array. The root covers [0, n-1]. When splitting, the midpoint m = (l+r)/2; the left child covers [l, m] and the right child covers [m+1, r]. A node is a leaf when l == r, meaning it covers exactly one element. The height of the tree is &#8968;log&#8322;n&#8969;, so there are at most 2&#8968;log&#8322;n&#8969; + 1 levels, giving O(n) total nodes.
        </HighlightBlock>
        <p>
          The aggregate stored at each node is determined by the merge function. For range sum queries the merge is addition; for range minimum the merge is min(); for range maximum it is max(); for range GCD it is gcd(). The critical property is that the merge must be associative: the result of merging three nodes must not depend on the order of pairwise merges. Commutativity is not required. This associativity property is what makes the divide-and-conquer query algorithm correct.
        </p>
      </section>

      {/* ── 3. Build Algorithm ── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Build Algorithm</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: emphasize the O(n) build time and explain why it is O(n) rather than O(n log n). Many candidates assume building n nodes each in O(log n) gives O(n log n); the bottom-up pass is linear because each array element is touched once per level but only contributes to exactly one node per level.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important" className="mb-4">
          The recursive build starts at the root (node 1, range [0, n-1]). At each node, if it is a leaf (l == r), assign the array element directly. Otherwise, recurse into the left child to build [l, m] and the right child to build [m+1, r], then merge their results upward: tree[node] = merge(tree[2&#215;node], tree[2&#215;node+1]). This is a post-order traversal — leaves are filled first, then internal nodes are computed bottom-up.
        </HighlightBlock>
        <p className="mb-4">
          The total work is proportional to the number of nodes: n leaves plus n-1 internal nodes = 2n-1 nodes, each requiring O(1) work. The recurrence T(n) = 2T(n/2) + O(1) solves to T(n) = O(n) by the Master Theorem (case 1). This is why segment tree build is O(n), not O(n log n).
        </p>
        <p>
          The merge function is the only part that changes between segment tree variants. For a sum tree: tree[node] = tree[left] + tree[right]. For a min tree: tree[node] = Math.min(tree[left], tree[right]). For a max GCD tree: tree[node] = gcd(tree[left], tree[right]). The build skeleton is identical; only the merge line changes. This makes segment trees highly reusable across problem types with minimal code modification.
        </p>
      </section>

      {/* ── 4. Query Algorithm ── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Query Algorithm</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: the three-case logic is the heart of the query algorithm. Be able to state all three cases from memory and explain why the recursion visits O(log n) nodes, not O(n).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important" className="mb-4">
          A range query for [ql, qr] starts at the root and recurses with three cases at each node covering interval [l, r]. Case 1 — full overlap: if [l, r] is entirely inside [ql, qr] (that is, ql &lt;= l and r &lt;= qr), return this node&apos;s stored value immediately — no need to recurse further. Case 2 — no overlap: if [l, r] and [ql, qr] are disjoint (r &lt; ql or qr &lt; l), return the identity element (0 for sum, +&#8734; for min, -&#8734; for max). Case 3 — partial overlap: recurse into both children and merge their results.
        </HighlightBlock>
        <p className="mb-4">
          The key insight behind O(log n) complexity is that for any query range, at most O(log n) nodes satisfy the &quot;full overlap&quot; condition, and those are the only nodes that actually return values. The recursion does expand into partial overlaps but the partial-overlap nodes fan out quickly into full-overlap or no-overlap subtrees. A formal proof shows that at each depth of the tree, at most 4 nodes are in &quot;partial overlap&quot; state simultaneously — so the total visited nodes is bounded by 4 &#215; height = O(log n).
        </p>
        <p>
          The identity element for the merge operation matters: it must be the neutral element for the merge. If you return 0 for a no-overlap case in a min-query tree, you corrupt answers for ranges that genuinely contain zero elements. The correct identity for min is positive infinity; for max it is negative infinity; for sum it is 0; for product it is 1; for GCD it is 0 (since gcd(x, 0) = x for all x). Picking the wrong identity is one of the most common subtle bugs in segment tree implementations.
        </p>
      </section>

      {/* ── 5. Point Update ── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Point Update</h2>
        <HighlightBlock as="p" tier="important" className="mb-4">
          A point update modifies a single array element at index pos and keeps the tree consistent. Starting at the root, recurse down the tree like a binary search: if pos falls in the left half [l, m], recurse left; otherwise recurse right. When the leaf is reached (l == r == pos), update its value. Then on the way back up, recalculate each ancestor with the merge function: tree[node] = merge(tree[2&#215;node], tree[2&#215;node+1]).
        </HighlightBlock>
        <p className="mb-4">
          The path from root to the leaf has exactly &#8968;log&#8322;n&#8969; nodes. Each node requires O(1) work. So a point update costs O(log n) total. There is no rebalancing, no rotations, no structural changes — the tree shape is fixed once built. Only the stored values change along a single root-to-leaf path.
        </p>
        <p>
          This O(log n) update is the primary advantage of a segment tree over a prefix sum array. A prefix sum array supports O(1) range sum queries but O(n) updates (since changing one element requires recomputing all subsequent prefix sums). The segment tree trades the O(1) query for O(log n) query, but compresses the O(n) update to O(log n) — a far better bargain when updates are frequent.
        </p>
      </section>

      {/* ── 6. Lazy Propagation ── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Lazy Propagation</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: lazy propagation is the most commonly tested advanced segment tree concept. Be prepared to walk through the push-down logic step by step and explain why it achieves O(log n) for range updates while still maintaining correctness for subsequent queries.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important" className="mb-4">
          Without lazy propagation, a range update — adding a value v to every element in [ql, qr] — would require visiting every leaf in the range and propagating up: O(n) in the worst case. Lazy propagation solves this by deferring the update. Instead of immediately updating all leaves, you annotate intermediate nodes with a &quot;lazy tag&quot; (also called a pending update) and update only the nodes whose stored aggregates need to change right now.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important" className="mb-4">
          The invariant is: before reading or recursing into a node&apos;s children, push down any lazy tag to those children first. This push-down operation transfers the deferred update from the current node to its two children. For an additive range update: lazy[2i] += lazy[i]; val[2i] += lazy[i] &#215; left_range_size; lazy[2i+1] += lazy[i]; val[2i+1] += lazy[i] &#215; right_range_size; then clear lazy[i] = 0. The node&apos;s own stored value was already updated when the tag was first applied, so the node is correct — only its children are pending.
        </HighlightBlock>
        <p className="mb-4">
          During a range update for [ql, qr] with value v, the same three-case logic applies as in queries. On full overlap (node covers a subrange entirely inside [ql, qr]): apply the update to the node immediately — increment its stored value by v &#215; range_size and store v in lazy[node]. On no overlap: do nothing. On partial overlap: push down any existing lazy tag first, then recurse into children, then recalculate the node&apos;s value from its children.
        </p>
        <p className="mb-4">
          The reason this achieves O(log n) is the same as for queries: at most O(log n) nodes see a &quot;full overlap&quot; condition and receive the lazy tag directly. The partial overlap nodes merely pass through. Since at most 4 nodes per level are in partial overlap state, the total work is O(log n).
        </p>
        <p>
          The lazy tag identity element is critical. For additive lazy (add v to every element in range), the identity is 0 — a tag of 0 means no pending update. For multiplicative lazy (multiply every element by v), the identity is 1. When composing multiple lazy updates — say, a previous pending add of 3 and a new add of 5 — the composition is addition: new tag = 3 + 5 = 8. If the operations are mixed (first multiply then add), the composition rule becomes more complex and must be worked out algebraically. Failure to compose lazy tags correctly is the most common bug in advanced lazy propagation implementations.
        </p>
      </section>

      {/* ── 7. Architecture & Flow ── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: describe the end-to-end data flow — how a range query descends the tree, accumulates partial results, and how a lazy push-down ensures children are always up to date before being accessed.
        </HighlightBlock>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/segment-tree-architecture.svg"
          alt="Four-section segment tree architecture diagram showing tree structure with node layout build and query algorithms lazy propagation push-down rules and variants including persistent and coordinate-compressed trees"
          caption="Figure 1: Segment tree architecture overview — Section A shows the 1-indexed node layout for array [2,4,6,8]; Section B covers O(n) build and O(log n) query/update; Section C details lazy propagation push-down; Section D lists variants and LeetCode applications."
        />
        <p className="mb-4">
          The data flow for a range sum query over [ql, qr] proceeds as follows. At the root, check overlap with [0, n-1]. If partial, push down any lazy tag (ensuring children have correct aggregate values), then recurse left and right. Each child repeats the same check. Nodes with full overlap return their stored value instantly. Nodes with no overlap return 0. The merge of left and right results at partial-overlap nodes bubbles upward to form the final answer.
        </p>
        <p>
          For a range update, the descent is identical but the action on full-overlap nodes is different: instead of returning a value, the node&apos;s stored aggregate is updated and a lazy tag is written. The push-down rule ensures that if this node was already carrying a pending tag from a previous update, it is first pushed to the children before the new update is applied. This composability — stacking multiple deferred updates correctly — is what distinguishes a correct lazy segment tree from a buggy one.
        </p>
      </section>

      {/* ── 8. Variants ── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Variants</h2>
        <HighlightBlock as="p" tier="important" className="mb-4">
          <strong>Range Min/Max Segment Tree.</strong> Replace the merge function with min() or max(). The identity element for min is positive infinity; for max it is negative infinity. Lazy propagation for range assignment (set all elements in [ql, qr] to v) is simpler than additive lazy: the tag is an assignment, and composing two assignments always takes the newer one. The stored value at a fully-covered node becomes v; the lazy tag propagates v to children on push-down.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important" className="mb-4">
          <strong>Persistent Segment Tree.</strong> Instead of modifying nodes in place, each update creates a new version of the tree by allocating only the O(log n) nodes along the modified path. All other nodes are shared between the old and new version. After k updates you have k+1 root pointers, each representing the array at that point in time. Querying version j is a normal segment tree query starting from root[j]. Space cost: O(n + k log n) total nodes for k updates. This structure supports &quot;what was the value of prefix sum at time t?&quot; style queries and is used in offline range k-th smallest element problems.
        </HighlightBlock>
        <p className="mb-4">
          <strong>Coordinate Compressed Segment Tree.</strong> When values in the problem can be very large (up to 10&#8313; or 10&#185;&#8312;) but there are only n distinct values (n &#8804; 10&#8309;), building a segment tree of size 10&#8313; is infeasible. Instead, collect all distinct values that actually appear, sort them, and map each to a compact index in [0, n-1]. Then build a segment tree of size n on these indices. This is the standard technique for LeetCode 315 (Count of Smaller Numbers After Self) and 2407 (Longest Increasing Subsequence II).
        </p>
        <p>
          <strong>2D Segment Tree.</strong> A segment tree where each node of the outer tree (covering row ranges) contains an inner segment tree (covering column ranges). Supports 2D range sum/min/max queries and updates in O(log&#178;n) time. Space is O(n&#178;) in the dense case. In practice, for sparse 2D problems, a segment tree of sorted sets or a merge sort tree is more space-efficient. 2D segment trees appear in computational geometry (rectangle union area) and database columnar aggregations.
        </p>
      </section>

      {/* ── 9. Trade-offs ── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Trade-offs &amp; Comparisons</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: the ability to compare segment tree against Fenwick tree and sparse table — and choose correctly — is what separates a candidate who memorized the structure from one who truly understands it.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important" className="mb-4">
          <strong>Segment Tree vs Fenwick Tree (BIT).</strong> Both achieve O(log n) point update and range query. The Fenwick tree is simpler to implement (5–10 lines vs 40–60 for segment tree), has better cache performance (linear array access vs tree traversal), and uses exactly n+1 array slots vs 4n. However, the Fenwick tree only works for invertible operations (addition, XOR) and cannot handle range updates or range min/max without major modifications. The segment tree handles any associative merge, supports range updates via lazy propagation, and works for non-invertible operations (min, max, GCD). Decision rule: if you need range min/max or range updates, use segment tree; if you only need range sum with point updates, prefer Fenwick tree.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important" className="mb-4">
          <strong>Segment Tree vs Sparse Table.</strong> A sparse table answers range min/max queries in O(1) with O(n log n) build time and O(n log n) space, but it is completely immutable — any update requires a full rebuild. The segment tree answers the same queries in O(log n) but supports O(log n) updates. Decision rule: static data with many queries — sparse table. Dynamic data with updates — segment tree.
        </HighlightBlock>
        <p>
          <strong>Segment Tree vs Balanced BST (for ordered statistics).</strong> For problems like &quot;how many elements less than x in range [l, r]?&quot;, an order-statistics tree (augmented BST) answers in O(log n) but handles only offline or single-point queries efficiently. A persistent segment tree on coordinate-compressed values often outperforms in offline batch scenarios. The segment tree is generally more predictable in its constant factors for competitive programming constraints (n up to 10&#8309;), while balanced BSTs (like std::policy_tree in C++) have higher constant factors.
        </p>
      </section>

      {/* ── 10. Best Practices ── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: list the non-negotiables that prevent the most common correctness bugs. Interviewers value candidates who proactively articulate the invariants their implementation must maintain.
        </HighlightBlock>
        <ul className="list-disc space-y-2 pl-6">
          <HighlightBlock as="li" tier="important">
            <strong>Always push down before recursing.</strong> In any lazy segment tree, the very first thing any recursive call does — before comparing ranges or accessing children — is push any pending lazy tag down to the two children. Forgetting this even once corrupts queries on any range that overlaps a pending-update node.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Choose the right identity element for the merge.</strong> For min queries return +&#8734; from no-overlap branches; for max return -&#8734;; for sum return 0; for product return 1; for GCD return 0. Using the wrong identity silently corrupts results for edge-case ranges.
          </HighlightBlock>
          <li>
            <strong>Allocate 4n for the tree array.</strong> Using 2n is insufficient when n is not a power of two. The standard safe allocation is 4n. This is slightly wasteful but avoids subtle out-of-bounds writes that manifest only on specific input sizes.
          </li>
          <li>
            <strong>Use 1-indexed nodes.</strong> The 1-indexed parent/child relationship (parent i, left child 2i, right child 2i+1) is cleaner and more universally recognizable than 0-indexed alternatives. Mixing indexing conventions in the same codebase is a common source of off-by-one bugs.
          </li>
          <li>
            <strong>Test with n=1 and n=2 inputs.</strong> Edge cases with single-element and two-element arrays expose off-by-one errors in range splitting (m = (l+r)/2 where l==r means m==l, and the right child range [m+1, r] becomes [l+1, l] which is empty — handle this correctly).
          </li>
          <li>
            <strong>Verify lazy composition rules algebraically before coding.</strong> For problems mixing additive and multiplicative updates, derive the composition rule on paper first. Coding it without verification leads to subtle ordering bugs that pass most test cases but fail on carefully constructed inputs.
          </li>
        </ul>
      </section>

      {/* ── 11. Common Pitfalls ── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: demonstrating awareness of these pitfalls shows production-level thinking, not just algorithmic knowledge.
        </HighlightBlock>
        <ul className="list-disc space-y-2 pl-6">
          <HighlightBlock as="li" tier="important">
            <strong>Forgetting lazy push-down.</strong> The single most common segment tree bug. If you access tree[2&#215;node] or tree[2&#215;node+1] before pushing down lazy[node], you read stale values. This produces wrong answers that are hard to trace because the tree structure looks correct but the stored values are outdated.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Wrong identity for the merge.</strong> Returning 0 from a no-overlap case in a min-query tree introduces phantom zeros. Returning -&#8734; from a no-overlap case in a sum tree corrupts the entire result. The identity must be the neutral element: merge(identity, x) == x for all x.
          </HighlightBlock>
          <li>
            <strong>Off-by-one in range bounds.</strong> Closed vs half-open intervals ([l, r] vs [l, r)) must be chosen consistently. Mixing conventions — using closed intervals for the tree but half-open for the query parameters — causes systematic off-by-one errors that affect every range query.
          </li>
          <li>
            <strong>Integer overflow in large range sums.</strong> If array values are up to 10&#8313; and ranges can cover up to 10&#8309; elements, the sum can reach 10&#185;&#8308;, which overflows a 32-bit integer. Always use 64-bit integers (long long in C++, BigInt or number checks in JavaScript) for sum segment trees with large inputs.
          </li>
          <li>
            <strong>Applying the update to the wrong node level.</strong> In lazy propagation, when a node has full overlap, you update the node&apos;s stored value AND set its lazy tag. If you only update the lazy tag without updating the node&apos;s value, subsequent queries that land on this node (full overlap) will return the old aggregate rather than the updated one.
          </li>
          <li>
            <strong>Not handling the case where a node has no children.</strong> At leaf nodes, pushing down is a no-op (there are no children). Attempting to push down at a leaf by writing to tree[2&#215;node] and tree[2&#215;node+1] writes out of bounds (if the tree array is exactly 4n, leaves at the bottom of a full tree can have child indices exceeding 4n). Guard the push-down with a leaf check: if (l == r) return before pushing.
          </li>
        </ul>
      </section>

      {/* ── 12. Real-World Use Cases ── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: connect the abstract data structure to concrete system design scenarios. This shows you can translate algorithmic knowledge into engineering judgment.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important" className="mb-4">
          <strong>Database range aggregations.</strong> Column-store databases (Apache Druid, ClickHouse, Amazon Redshift) precompute segment-tree-like structures over time-partitioned data to answer GROUP BY time_bucket aggregate queries efficiently. When a new data point arrives and must be incorporated into aggregate indexes without full recomputation, the O(log n) point update characteristic is the design basis for incremental aggregate maintenance.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important" className="mb-4">
          <strong>Computational geometry.</strong> The classic rectangle union area problem (given n rectangles, find the total area covered, accounting for overlaps) is solved using a coordinate sweep line paired with a segment tree that tracks how many rectangles cover each vertical interval. The segment tree supports range-add updates (when a rectangle starts or ends) and range-max/sum queries (to find the covered length of the sweep line at any x coordinate). This appears in interview problems and in GIS rendering pipelines.
        </HighlightBlock>
        <p className="mb-4">
          <strong>Competitive programming foundations.</strong> LeetCode 307 (Range Sum Query - Mutable) is the canonical introductory segment tree problem: build a sum tree, support point updates and range sum queries. LeetCode 315 (Count of Smaller Numbers After Self) requires a coordinate-compressed segment tree to count how many elements to the right are smaller than the current element in O(n log n) total time. LeetCode 699 (Falling Squares) uses a range-max segment tree to track the height of stacked squares. LeetCode 2407 (Longest Increasing Subsequence II) uses a segment tree to track the maximum LIS ending at each value in O(n log n).
        </p>
        <p>
          <strong>Event scheduling and resource allocation systems.</strong> Systems that track resource availability over time intervals — such as calendar booking engines, hotel reservation systems, or cloud VM slot allocators — can use segment trees to answer &quot;what is the maximum available capacity in time range [t1, t2]?&quot; in O(log n) per query, with O(log n) updates when a reservation is made or cancelled. The lazy propagation variant handles bulk range-reservation operations efficiently, for example, blocking a recurring weekly time slot across an entire year at once.
        </p>
      </section>

      {/* ── 13. Interview Questions ── */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: answer with constraints, decisions, trade-offs, and how you would validate the implementation. Dry-running through an example is expected for the algorithmic questions.
        </HighlightBlock>
        <div className="space-y-4">

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <HighlightBlock as="p" tier="important" className="font-semibold">
              Q1 (Junior-Mid): Explain how lazy propagation achieves O(log n) for a range update when the naive approach is O(n).
            </HighlightBlock>
            <p className="mt-2 text-sm">
              A: Without lazy propagation, a range update visits every leaf in the range and propagates changes upward — O(n) leaves in the worst case. Lazy propagation defers the leaf-level work by storing a &quot;pending update&quot; tag at intermediate nodes. When the segment tree descends for a range update, any node whose interval is fully inside the update range receives the tag directly — its stored aggregate is updated immediately (adding tag &#215; range_size to the sum), but its descendants are not touched yet. The tag is pushed down to children only when those children need to be accessed later, either for a query or another update. Since only O(log n) nodes see a full-overlap condition per operation, the work per range update is O(log n). Correctness is maintained because every node&apos;s stored value is always accurate — the tag represents work that has been applied to this node but not yet propagated downward.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <HighlightBlock as="p" tier="important" className="font-semibold">
              Q2 (Mid): Build a segment tree for range min query and point update. Walk through a query and an update.
            </HighlightBlock>
            <p className="mt-2 text-sm">
              A: Build bottom-up: assign leaves from the array, then for each internal node compute tree[i] = min(tree[2i], tree[2i+1]). The identity element for no-overlap branches is positive infinity. Point update: descend to the leaf at position pos (go left if pos is in [l, m], right otherwise), update the leaf value, then on the way back up recompute each ancestor as min(left child, right child). Range min query: three cases — full overlap returns the node value, no overlap returns +&#8734;, partial overlap recurses both children and returns the min of the two recursive results. Dry run: array [3,1,4,1,5], range min query [1,3] (0-indexed) should return 1. The root covers [0,4]. Split: left [0,2] partially overlaps [1,3] — recurse. Right [3,4] partially overlaps — recurse. Eventually the nodes covering [1,2] (min=1) and [3,3] (val=1) both return 1, and min(1,1) = 1 is correct.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q3 (Mid-Senior): Design a persistent segment tree. How does versioning work and what is the space complexity?</p>
            <p className="mt-2 text-sm">
              A: A persistent segment tree avoids in-place mutation. Each update creates a new root and allocates new nodes only along the path from root to the modified leaf — exactly &#8968;log&#8322;n&#8969; + 1 new nodes. All other nodes are shared between the old and new version via pointer reuse. After each update, store the new root in a version array: roots[v] = new_root. To query the array at version v, call the standard query function with roots[v] as the entry point. Space complexity: O(n) initial build + O(k log n) for k updates. This structure answers questions like &quot;what was the sum of elements in [l, r] after the t-th update?&quot; in O(log n) per query. The critical implementation detail: never mutate an existing node; always allocate a fresh node when modifying. In languages without automatic memory management, pre-allocate a node pool of size n + k &#215; (log n + 1) to avoid repeated heap allocations.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q4 (Senior): What is the difference between a segment tree and a Fenwick tree? When do you use each?</p>
            <p className="mt-2 text-sm">
              A: Both achieve O(log n) point update and prefix query. The Fenwick tree is simpler (10 lines of code), uses n+1 array slots, has excellent cache locality, and its bit manipulation tricks are elegant. However, it only works for invertible operations (addition, XOR) where the range aggregate can be computed as prefix[r] - prefix[l-1]. It cannot natively handle range min/max (non-invertible) or range updates without auxiliary structures. The segment tree is more code (40-60 lines), uses 4n space, and has slightly worse cache behavior due to tree traversal — but it handles any associative merge, supports non-invertible operations like min and max, and supports range updates via lazy propagation. Use Fenwick tree for: range sum with point updates, frequency counting, order statistics via binary lifting on the BIT. Use segment tree for: range min/max, range GCD, range updates (add to all elements in range), any operation that is not invertible. For staff-level judgment: always ask whether the operation is invertible and whether range updates are needed — those two questions determine the choice.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q5 (Senior): How do you handle range updates AND range queries simultaneously with lazy propagation? Walk through the algorithm.</p>
            <p className="mt-2 text-sm">
              A: This is the classic lazy segment tree for range add + range sum query. The tree stores two arrays: val[node] (current aggregate for the node&apos;s range, already accounting for any lazy tags applied to this node) and lazy[node] (pending additive update not yet pushed to children). For a range update add(ql, qr, v): at each node covering [l, r], if full overlap, set val[node] += v &#215; (r-l+1) and lazy[node] += v, then return. If no overlap, return. If partial overlap, first push down (apply lazy[node] to children: val[2i] += lazy[node] &#215; left_size, lazy[2i] += lazy[node], similarly for right child, then lazy[node] = 0), then recurse into children, then recompute val[node] = val[2i] + val[2i+1]. For a range sum query(ql, qr): same three-case logic. On full overlap, return val[node]. On no overlap, return 0. On partial overlap, push down first, recurse, return sum of children results. The invariant throughout: val[node] always reflects the correct aggregate for this node&apos;s range including any lazy[node] that was applied to this node but not yet propagated to children. Children may have stale values until push-down.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q6 (Staff): Design a solution for LeetCode 315 (Count of Smaller Numbers After Self) using a coordinate-compressed segment tree.</p>
            <p className="mt-2 text-sm">
              A: LeetCode 315 asks: for each element nums[i], count how many elements to its right are strictly smaller. The naive O(n&#178;) approach scans all pairs. The segment tree approach achieves O(n log n). Step 1 — coordinate compression: collect all unique values in nums, sort them, map each value to its rank in [0, m-1] where m is the number of distinct values. Step 2 — build an empty count segment tree of size m (all zeros), supporting point increment at a rank and prefix sum query (sum of counts for ranks [0, r]). Step 3 — process nums from right to left. For each nums[i], map it to its compressed rank r. Query the segment tree for the count of elements with rank less than r: query([0, r-1]). This is the count of elements already inserted (i.e., to the right of i in the original array) that are smaller than nums[i]. Record this as result[i]. Then perform a point update: increment the count at rank r by 1 (marking that nums[i] has been processed). Step 4 — return the result array. The segment tree has m &#8804; n nodes (since there are at most n distinct values). Each of the n iterations costs O(log n) for the query and O(log n) for the update. Total: O(n log n). This approach generalizes directly to persistent segment tree for the offline k-th smallest in range problem (LeetCode 3144 and related problems).
            </p>
          </div>

        </div>
      </section>

    </ArticleLayout>
  );
}
