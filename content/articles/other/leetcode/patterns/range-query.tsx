"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-leetcode-patterns-range-query",
  title: "Range Query Pattern",
  description: "Range query pattern decision guide — when to use prefix sum, Fenwick tree, segment tree with lazy propagation, sparse table, persistent segment tree, or Mo's algorithm, with classic LeetCode problems mapped to each structure.",
  category: "other",
  subcategory: "leetcode",
  slug: "range-query",
  wordCount: 2200,
  readingTime: 9,
  lastUpdated: "2026-05-16",
  tags: ["range-query", "segment-tree", "fenwick-tree", "sparse-table", "prefix-sum", "mos-algorithm"],
};

export default function RangeQueryArticle() {
  return (
    <ArticleLayout metadata={metadata}><HighlightBlock as="p" tier="crucial" className="mb-4">Interview focus: Range Query Pattern should be explained through a correctness invariant first, then through the implementation technique.</HighlightBlock><HighlightBlock as="p" tier="crucial" className="mb-4">Interview focus: In interviews, the decisive point is why this approach is valid under the stated constraints, not just what API or algorithm is used.</HighlightBlock><HighlightBlock as="p" tier="crucial" className="mb-4">Interview focus: The production-quality answer separates source of truth, derived state, failure behavior, and measurable cost.</HighlightBlock><HighlightBlock as="p" tier="crucial" className="mb-4">Interview focus: A staff/principal candidate should state when this technique stops being appropriate and what alternative should replace it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Interview focus: Compare the simple baseline with the optimized or production-ready approach so the trade-off is explicit.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Interview focus: Name the data structure, state machine, pipeline stage, or control plane that owns each decision.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Interview focus: Include the cost model: preprocessing cost, per-operation cost, storage cost, latency impact, and failure recovery cost.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Interview focus: Call out common mistakes because they are often what interviewers use to distinguish memorized answers from reasoned answers.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Interview focus: Tie the concept back to real systems: scale, concurrency, partial failure, security boundaries, and migration pressure.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Interview focus: Explain the test strategy: normal path, boundary path, adversarial input, regression case, and observability assertion.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Interview focus: If multiple approaches work, choose based on constraints rather than preference: static vs dynamic, online vs offline, exact vs approximate, safe vs fast.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Interview focus: Make the answer auditable: identify inputs, outputs, ownership, failure modes, and signals that prove the system is healthy.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Interview focus: Avoid vague claims. Attach scalable, reliable, and secure to concrete thresholds, guarantees, and fallback behavior.</HighlightBlock>
      <p>
        Range queries — aggregate operations over a subarray [l, r] — appear in a large fraction of hard
        LeetCode problems and almost every competitive programming contest. The key skill is identifying which
        structure fits the constraints: whether the array is mutable, whether the operation is idempotent, and
        whether queries arrive online or can be processed offline.
      </p>

      <ArticleImage
        src="/diagrams/other/leetcode/patterns/range-query-architecture.svg"
        alt="Range query pattern decision guide"
        caption="Range query pattern — Segment Tree, Fenwick Tree, Sparse Table, and Prefix Sum decision matrix"
      />

      <h2>Pattern Recognition</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Interview lens: frame Range Query Pattern around pattern recognition, invariant proof, constraint fit, edge cases, and complexity trade-off. This is what turns the article from concept notes into interview-ready reasoning.</HighlightBlock>
      <p>
        The range query pattern applies when you see: "given array A and multiple queries [l, r], return some
        aggregate (sum, min, max, GCD, XOR) over A[l..r]." The distinguishing axis is mutability:
      </p>
      <p>
        <strong>Static array:</strong> precompute once, answer many queries. For idempotent operations (min, max, GCD),
        use Sparse Table for O(1) queries after O(n log n) build. For sum or other non-idempotent operations,
        use a prefix sum array for O(1) queries after O(n) build.
      </p>
      <p>
        <strong>Mutable array (point updates):</strong> use a Fenwick Tree (BIT) for prefix-sum-style queries
        in O(log n) per update and query — minimal constant, simple code. For more complex range operations,
        use a Segment Tree.
      </p>
      <p>
        <strong>Mutable array (range updates + range queries):</strong> use a Segment Tree with lazy propagation.
        This handles "add v to all elements in [l, r]" followed by "sum of [l, r]" in O(log n) per operation.
      </p>
      <p>
        <strong>Keywords that signal range query:</strong> "range sum", "range min/max", "subarray aggregate",
        "point update", "range update", "query after updates", "k-th smallest in range [l, r]".
      </p>

      <h2>Prefix Sum Array</h2>
      <p>
        The simplest structure. Build: pre[i] = A[0] + A[1] + ... + A[i-1] in O(n). Query sum(l, r) =
        pre[r+1] - pre[l] in O(1). No updates supported — the array must be static.
      </p>
      <p>
        2D prefix sum for matrix queries: pre[i][j] = sum of rectangle from (0,0) to (i-1, j-1). Query
        rectangle (r1, c1) to (r2, c2) = pre[r2+1][c2+1] - pre[r1][c2+1] - pre[r2+1][c1] + pre[r1][c1]
        (inclusion-exclusion). LeetCode 304, 1074 use this.
      </p>

      <HighlightBlock as="p" tier="important">
        Always handle the off-by-one carefully. Store pre[0] = 0 so that sum(0, r) = pre[r+1] - pre[0] = pre[r+1]
        without a special case. This 1-indexed prefix array eliminates a common bug.
      </HighlightBlock>

      <h2>Fenwick Tree (Binary Indexed Tree)</h2>
      <p>
        The Fenwick Tree (BIT) supports point updates and prefix sum queries in O(log n) with extremely small
        constants and a 5-line implementation. Core operations:
      </p>
      <p>
        <strong>lowbit(i) = i &amp; (-i):</strong> isolates the lowest set bit of i. This encodes the range
        each BIT node is responsible for.
      </p>
      <p>
        <strong>Query prefix(i):</strong> sum from index 1 to i. Walk: add tree[i], then i -= lowbit(i), repeat
        until i = 0. At most O(log n) steps.
      </p>
      <p>
        <strong>Update point(i, delta):</strong> walk: add delta to tree[i], then i += lowbit(i), repeat until
        i &gt; n. At most O(log n) steps.
      </p>
      <p>
        <strong>Range query [l, r]:</strong> query(r) - query(l-1). Critical: BIT is 1-indexed — always
        add 1 when converting 0-indexed problem input.
      </p>
      <p>
        For range update + range query, use two BITs B1 and B2. To add v to [l, r]: update B1[l]+=v, B1[r+1]-=v,
        update B2[l]+=v*(l-1), B2[r+1]-=v*r. Prefix sum up to i = B1.query(i)*i - B2.query(i).
      </p>

      <h2>Segment Tree</h2>
      <p>
        Segment Tree handles any associative operation (sum, min, max, GCD, XOR, matrix product) over ranges,
        with or without updates. Build: O(n). Query and update: O(log n).
      </p>
      <p>
        Tree structure: node at index i covers range [l, r]. Left child at 2i covers [l, mid], right child
        at 2i+1 covers [mid+1, r]. Internal nodes store the aggregate of their range; leaves store A[i].
        Array representation: size 4n is safe for n elements.
      </p>
      <p>
        <strong>Lazy propagation</strong> extends the tree to support range updates. Store a "pending" lazy
        value at each node. Before recursing into a child, push down the lazy value — apply it to the child's
        stored value and propagate to the child's lazy field. This defers work to when it is actually needed.
        Critical rule: always push down before accessing children. Build: push-down not needed (leaves only).
        Update: push down before recursing, then push up after. Query: push down before recursing.
      </p>
      <p>
        Merge function must be defined for the problem. For sum: merge(l, r) = l + r. For min: merge(l, r) = min(l, r).
        For a "paint" operation with lazy: lazy represents "all elements in this range are set to v". The lazy
        application is: node.val = lazy * (r - l + 1) for sum, or node.val = lazy for min/max.
      </p>

      <HighlightBlock as="p" tier="crucial">
        The two most common Segment Tree bugs: (1) forgetting to push down lazy before recursing — causes
        stale reads. (2) using node count 2n instead of 4n — causes index out of bounds. Use 4n always.
      </HighlightBlock>

      <h2>Sparse Table</h2>
      <p>
        Sparse Table answers static range minimum/maximum queries in O(1) after O(n log n) preprocessing.
        It only works for idempotent operations: f(f(a,b), b) = f(a,b). Min and max are idempotent; sum is not.
      </p>
      <p>
        Build: sparse[j][i] = min(A[i..i+2^j-1]). sparse[0][i] = A[i]. sparse[j][i] = min(sparse[j-1][i], sparse[j-1][i+2^&#123;j-1&#125;]).
        Total O(n log n) space and time.
      </p>
      <p>
        Query min(l, r): let k = floor(log₂(r-l+1)). Return min(sparse[k][l], sparse[k][r-2^k+1]).
        The two intervals [l, l+2^k-1] and [r-2^k+1, r] overlap but that is fine — min is idempotent so
        double-counting is harmless. O(1) query.
      </p>
      <p>
        Applications beyond range min: Lowest Common Ancestor (LCA) via Euler tour + RMQ. Suffix Array LCP
        queries via Sparse Table on the LCP array, enabling O(1) LCP of any two suffixes. Both reduce to
        range minimum on a derived array.
      </p>

      <h2>Mo&apos;s Algorithm</h2>
      <p>
        Mo&apos;s algorithm processes offline range queries in O((n+q)√n) time. It sorts queries by a 2D
        block ordering and processes them by moving the [l, r] window incrementally.
      </p>
      <p>
        Block size B = √n. Sort queries by (l/B, r). For queries in the same block of l, sort by r ascending
        (alternating direction in Hilbert curve ordering reduces constant). Process queries in sorted order,
        maintaining a sliding window [curL, curR]. To move from one query to the next, expand/contract l and r,
        updating the answer incrementally. Each add/remove operation must be O(1) for the total bound to hold.
      </p>
      <p>
        Mo&apos;s is ideal for offline distinct count queries or mode queries where no efficient online structure
        exists. It cannot handle updates (queries must be known in advance). For updates, Mo&apos;s with updates
        (3D blocking) works in O(n^&#123;5/3&#125;).
      </p>

      <h2>Persistent Segment Tree</h2>
      <p>
        A persistent segment tree creates a new version after each update by copying only the O(log n) nodes
        on the path from root to the updated leaf. All other nodes are shared (structural sharing).
      </p>
      <p>
        Key application: offline k-th smallest in range [l, r] (LeetCode 315 variant). Build a persistent
        segment tree over values. Version i is built after inserting A[0..i-1]. To find k-th smallest in
        [l, r]: simultaneously walk version[r] and version[l-1] trees. At each node, count = leftChild[r].count
        - leftChild[l-1].count gives how many elements in [l, r] fall in the left subtree. If count ≥ k,
        go left; else k -= count and go right. O(log(max_val)) per query after O(n log(max_val)) build.
      </p>
      <p>
        This technique (two version trees walked simultaneously) is called "merge two trees" and appears
        in several LeetCode hard problems.
      </p>

      <h2>Coordinate Compression</h2>
      <p>
        When values are large (e.g., up to 10^9) but only n ≤ 10^5 values appear, map them to &#123;1,...,n&#125;
        before using a BIT or segment tree. Sort and deduplicate the values, then replace each value with
        its rank. This compresses the value domain from 10^9 to n without changing relative order.
      </p>
      <p>
        Common pattern: sort values, use binary search (lower_bound) to map original value to compressed index.
        Always compress before building the BIT. LeetCode 315 (count of smaller numbers after self), 493
        (reverse pairs), and 327 (count of range sum) all require coordinate compression.
      </p>

      <h2>Classic LeetCode Problems by Structure</h2>
      <p>
        <strong>Prefix Sum:</strong> 303 (Range Sum Query Immutable), 304 (Range Sum Query 2D Immutable),
        560 (Subarray Sum Equals K — use prefix sum + hash map), 1074 (Number of Submatrices That Sum to Target).
      </p>
      <p>
        <strong>Fenwick Tree:</strong> 307 (Range Sum Query Mutable — simpler than segment tree), 315 (Count of
        Smaller Numbers After Self — BIT with coordinate compression), 493 (Reverse Pairs — BIT over sorted values).
      </p>
      <p>
        <strong>Segment Tree with Lazy:</strong> 699 (Falling Squares — range max + range set lazy), 732 (My Calendar III
        — range add + range max), 218 (The Skyline Problem — alternative to priority queue approach).
      </p>
      <p>
        <strong>Segment Tree on Values:</strong> 2407 (Longest Increasing Subsequence II — segtree over values,
        query max LIS ending at value &lt; current, update with new LIS length).
      </p>
      <p>
        <strong>Sparse Table:</strong> Appears less in LeetCode but common in competitive programming for
        O(1) RMQ and LCA. Recognize it when the array is never modified and queries are min/max/GCD.
      </p>
      <p>
        <strong>Persistent Segment Tree:</strong> 315 can be solved this way; also useful for any "k-th smallest
        in a range" problem on a static array.
      </p>

      <h2>Interview Questions</h2>

      <h3>Q1: When should you use a Fenwick Tree vs a Segment Tree?</h3>
      <p>
        Use a Fenwick Tree when: (1) the operation is a prefix query (sum, XOR, count) — not range min/max.
        (2) only point updates are needed (no range updates). (3) code simplicity and speed matter — BIT is
        3-5× faster in practice due to cache-friendliness and simpler index arithmetic. Use a Segment Tree when:
        (1) the operation is not reducible to prefix queries (range min, range max, range GCD). (2) range updates
        with lazy propagation are needed. (3) the merge function is custom (interval scheduling, segment painting).
        For LeetCode 307 (Range Sum Query Mutable), BIT suffices. For LeetCode 699 (Falling Squares), you need
        a segment tree with lazy propagation (range max + range set).
      </p>

      <h3>Q2: How does lazy propagation work in a segment tree?</h3>
      <p>
        Lazy propagation defers range updates by storing a "pending update" at each node. When you update range
        [l, r] with operation op: if the node&apos;s range [nl, nr] is fully covered by [l, r], apply op to
        the node&apos;s stored value and record op in the node&apos;s lazy field — do not recurse. If partially
        overlapping, first push down the current lazy to both children (apply the lazy to each child&apos;s
        value and propagate the lazy to each child&apos;s lazy field, then clear the current lazy), then recurse
        into relevant children, then update the current node from children (push up). Push-down must happen
        before any recursive access. The key invariant: every node&apos;s stored value is correct for its range
        given its pending lazy, but children may not yet reflect it.
      </p>

      <h3>Q3: Solve LeetCode 315 (Count of Smaller Numbers After Self) using a Fenwick Tree.</h3>
      <p>
        Approach: process numbers from right to left. For each number A[i], query the BIT for count of numbers
        already inserted (to the right of i) that are strictly less than A[i]. Then insert A[i] into the BIT.
        Since values can be up to 10^4 (or after coordinate compression, up to n), query = prefix_sum(A[i]-1)
        and update = point_update(A[i], +1). Coordinate compression: sort unique values, map each A[i] to its
        rank 1..m. This gives O(n log n) time and O(n) space. The BIT counts frequencies; prefix_sum(v) = count
        of elements ≤ v inserted so far; count of elements &lt; A[i] = prefix_sum(A[i]-1) in compressed coords.
      </p>

      <h3>Q4: Explain how to find the k-th smallest in range [l, r] using a persistent segment tree.</h3>
      <p>
        Build a persistent segment tree over value space. Version 0 is empty. For i = 1..n, create version i
        from version i-1 by inserting A[i-1] (increment count at its value leaf, update path to root). Each
        version stores the cumulative frequency tree of A[0..i-1]. To answer k-th smallest in [l, r]: walk
        version[r] and version[l-1] simultaneously from root. At each node, left_count = version[r].left.count
        - version[l-1].left.count = number of elements in [l, r] falling in the left value subtree. If
        left_count ≥ k, go to left children. Else k -= left_count, go to right children. O(log(max_val))
        per query. Total O(n log V + q log V) with O(n log V) space where V = max value range.
      </p>

      <h3>Q5: When is Mo&apos;s algorithm the right choice?</h3>
      <p>
        Mo&apos;s algorithm is the right choice when: (1) all queries are known in advance (offline). (2) no
        efficient online structure exists for the query type (e.g., count distinct elements in [l, r], mode,
        or complex statistical queries). (3) O((n+q)√n) time is acceptable — for n=q=10^5, this is ~3×10^7 operations.
        (4) add/remove a single element from the window can be done in O(1). It is wrong when: updates arrive
        interleaved with queries (use segment tree or BIT), or the operation cannot be maintained incrementally
        (e.g., median requires a more complex structure). LeetCode rarely features Mo&apos;s directly but
        competitive programming uses it for distinct values, frequency counts, and XOR queries.
      </p>

      <h3>Q6: How do you handle the edge case in Sparse Table where the query range has length not a power of 2?</h3>
      <p>
        This is the core trick of Sparse Table: overlapping intervals are allowed for idempotent operations.
        For query(l, r) where len = r - l + 1, let k = floor(log₂(len)). Then 2^k ≤ len &lt; 2^&#123;k+1&#125;.
        Query = f(sparse[k][l], sparse[k][r-2^k+1]) where f is min or max. The two intervals [l, l+2^k-1]
        and [r-2^k+1, r] overlap when len is not a power of 2, but since f(f(a,b),b) = f(a,b) (idempotent),
        double-counting elements in the overlap does not change the result. This is why Sparse Table only works
        for idempotent operations — sum would be incorrect because overlapping elements would be counted twice.
        For sum queries on static arrays, use a prefix sum array instead (O(1) query, O(n) build, no overlap issue).
      </p>
    </ArticleLayout>
  );
}
