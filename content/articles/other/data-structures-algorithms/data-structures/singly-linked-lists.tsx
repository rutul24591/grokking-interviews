"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "singly-linked-lists",
  title: "Singly Linked Lists",
  description:
    "Staff-level deep dive into singly linked lists — node topology, pointer rewiring, memory fragmentation, lock-free concurrent variants, and the narrow set of workloads where they beat arrays.",
  category: "other",
  subcategory: "data-structures",
  slug: "singly-linked-lists",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-04-17",
  tags: [
    "linked-lists",
    "singly-linked-list",
    "pointers",
    "data-structures",
    "concurrency",
  ],
  relatedTopics: [
    "doubly-linked-lists",
    "stacks",
    "queues",
    "arrays",
  ],
};

export default function SinglyLinkedListsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p>
          A <strong>singly linked list</strong> is a linear collection where
          every element (a <em>node</em>) holds a value and a single pointer
          to its successor. The list is addressed by a head pointer; the last
          node&apos;s successor is <code>null</code> (or a sentinel tail node in
          some implementations). The property that distinguishes linked lists
          from arrays is that successive elements need not live in adjacent
          memory — each node is an independent heap allocation tied to its
          neighbors only by its next pointer.
        </p>
        <p>
          Singly linked lists were central to early LISP (1958), where every
          <code> cons</code> cell is exactly a two-field singly-linked node:
          a car and a cdr. That design underpins most functional languages
          today (Scheme, Clojure, Erlang, Elixir, Haskell lists), and the
          persistent data-structure literature depends on it. In the wider
          programming world, however, linked lists are used more narrowly.
          Modern CPUs reward spatial locality so aggressively that
          array-backed structures outperform linked lists across nearly every
          benchmark that does not hinge on O(1) splice or structural sharing.
        </p>
        <p>
          That said, the narrow set of workloads where a linked list is the
          correct choice matters. Non-blocking concurrent queues (Michael-Scott
          queue, CLH lock, Harris&apos;s ordered list) use singly linked lists
          because single-pointer atomic updates compose cleanly with
          compare-and-swap. The free-list inside an allocator, the LRU chain
          inside a hash table, and the run-queue inside an OS scheduler all
          reduce to singly linked lists because each benefits from O(1) head
          insertion with no ambient state. A staff-level engineer should be
          able to name which concrete systems rely on the structure and why
          the alternatives don&apos;t fit.
        </p>
        <p>
          Interview questions on linked lists are also disproportionately
          about pointer manipulation — reversal, cycle detection, k-th from
          end, merging — not because the structure is practically dominant,
          but because pointer rewiring is the cleanest proxy for reasoning
          about invariants under mutation. A correct in-place reversal
          demonstrates that the candidate can hold three references in
          mind simultaneously and update them in the right order, which is a
          transferable skill for lock-free, allocator, and tree-rebalancing
          code.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Node topology</h3>
        <p>
          Every singly-linked node has a value field and a next pointer.
          The value&apos;s size is workload-dependent; the pointer is 8 bytes
          on 64-bit systems plus per-allocation header overhead (typically
          16–24 bytes in a mark-sweep GC, 0 bytes with a bump allocator). A
          million 4-byte values stored in a linked list therefore occupy 24–40
          MB versus 4 MB in an array — a 6–10× space penalty that matters
          more than any theoretical complexity argument when the working set
          has to fit in L2 or L3.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Head-only vs head-and-tail
        </h3>
        <p>
          A bare list with only a head pointer gives O(1) prepend and O(n)
          append. Caching a tail pointer converts append to O(1) at the cost
          of maintaining the invariant on every mutation. The common error in
          naive implementations is forgetting to null-out the tail on final
          removal — production code should always have a tail assertion or a
          sentinel-node design to make the invariant structural rather than
          procedural.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Sentinel nodes and invariant preservation
        </h3>
        <p>
          Using a dummy head (and optionally a dummy tail) node eliminates
          the special-case code for empty lists and first-node operations. A
          non-empty list is indistinguishable structurally from an empty one,
          so insertion and deletion share a single code path. The pattern
          comes from Knuth and is pervasive in production codebases because
          it eliminates a whole class of null-pointer branches — a worthwhile
          trade for one extra allocation.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/singly-linked-lists-diagram-1.svg"
          alt="Singly linked list node structure with value and next pointer fields and head/tail pointer topology"
          caption="Figure 1: Node topology — each node holds a value and a single next pointer; head and optional tail track the list ends."
        />
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Insertion and deletion
        </h3>
        <p>
          Insertion after a known node is O(1): allocate a new node, point
          its <code>next</code> at the old successor, and update the
          predecessor&apos;s <code>next</code> to the new node. Deletion after
          a known node is symmetric: splice the successor of the successor
          into the predecessor&apos;s <code>next</code>, and release the
          removed node. Both assume you already have a pointer to the
          <em>predecessor</em>, which is the central limitation: you cannot
          remove a node in O(1) given only a pointer to that node in a
          singly-linked list, because recovering the predecessor requires a
          full O(n) scan from the head.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          In-place reversal
        </h3>
        <p>
          The canonical interview exercise. Walk the list with three pointers
          — previous, current, next — and at each step redirect{" "}
          <code>current.next</code> from its old successor to the previous
          node, then advance all three. The pattern generalizes: any reversal
          of a linked structure is a variant of this three-pointer dance.
          Done correctly it runs in O(n) time and O(1) additional space.
          Recursion works too but trades the in-place savings for a stack
          frame per node, which blows the default 1 MB thread stack at
          roughly 20,000 elements.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Cycle detection and Floyd&apos;s algorithm
        </h3>
        <p>
          Given a head, how do you decide whether the list is cyclic without
          extra memory? Floyd&apos;s tortoise-and-hare runs two pointers, one
          advancing by one step and the other by two. If a cycle exists they
          will eventually coincide inside the cycle; the meeting point plus a
          second walk from the head identifies the cycle entry. Floyd&apos;s
          algorithm is foundational well beyond linked lists: it detects
          cycles in functional graphs, finds duplicates in constant-space
          integer arrays, and powers Pollard&apos;s rho factorization.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/singly-linked-lists-diagram-2.svg"
          alt="Insertion and deletion operations on a singly linked list showing pointer rewiring steps to splice nodes in and out"
          caption="Figure 2: Insertion and deletion — pointer rewiring is O(1) given a predecessor reference, but finding the predecessor is O(n)."
        />
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparisons
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">
          Trade-offs &amp; Comparisons
        </h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Operation complexity
        </h3>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Prepend</strong>: O(1) — one allocation and one pointer
            swap.
          </li>
          <li>
            <strong>Append</strong>: O(n) without a cached tail; O(1) with.
          </li>
          <li>
            <strong>Insert/delete given predecessor</strong>: O(1).
          </li>
          <li>
            <strong>Search</strong>: O(n) — no random access.
          </li>
          <li>
            <strong>Access by index</strong>: O(n) — must walk from head.
          </li>
          <li>
            <strong>Reverse</strong>: O(n) time, O(1) space in-place.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Linked list vs array
        </h3>
        <p>
          Arrays win for any workload dominated by iteration, random access,
          or compact storage. Linked lists win when the workload requires
          O(1) insertion or deletion at a known node reference (not index),
          tolerates pointer-chasing cache misses, and benefits from structural
          sharing. The break-even point for linked-list insertion versus
          array shift is typically somewhere between 10 and 1000 elements
          depending on cache behavior and allocator cost — and modern
          benchmarks consistently show arrays winning even there for search
          plus insert workloads because of cache locality.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Singly vs doubly linked
        </h3>
        <p>
          Doubly-linked lists cost twice the pointer overhead per node in
          exchange for O(1) deletion given only a pointer to the node to
          remove (no predecessor scan). The LRU cache pattern relies on this:
          moving a hit node to the head of the recency list must be O(1),
          which requires the back-pointer. For workloads where removal always
          starts from the head (stacks, queues, free lists), singly linked is
          both smaller and simpler.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Cache behavior
        </h3>
        <p>
          Every traversal is a pointer chase. In the worst case every node
          lives in a different cache line, so traversal costs one cache miss
          per element — 100–300 CPU cycles each on modern hardware. Arena
          allocators or intrusive nodes (where the list pointer lives
          alongside the element data) regain some locality, but the
          fundamental structural cost remains. In performance-critical code
          this overhead alone disqualifies linked lists for any traversal-heavy
          workload.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Use a sentinel head.</strong> A dummy first node removes
            the null-head special case from every insertion, deletion, and
            merge routine. The small memory cost buys structural uniformity.
          </li>
          <li>
            <strong>Cache the tail when append dominates.</strong> Stack
            operations push at head; queue operations enqueue at tail.
            Maintaining both pointers explicitly is cheaper than scanning
            every time.
          </li>
          <li>
            <strong>Prefer intrusive nodes in high-performance code.</strong>
            {" "}Embedding the next pointer inside the element itself eliminates
            the indirection between list structure and payload, and avoids a
            separate node allocation per insert. The Linux kernel&apos;s{" "}
            <code>list_head</code> and Rust&apos;s <code>intrusive-collections</code>
            {" "}crate follow this pattern.
          </li>
          <li>
            <strong>Use arena allocation for transient lists.</strong> Bump-
            allocating nodes into a region that is freed all at once
            eliminates the per-node <code>free</code> cost that otherwise
            dominates short-lived list churn.
          </li>
          <li>
            <strong>Test with sentinel, empty, and single-element
            cases.</strong> Linked-list bugs cluster around these edge cases.
            Property-based tests comparing against a reference array-backed
            implementation catch most of them.
          </li>
          <li>
            <strong>Reach for a purpose-built structure when needed.</strong>
            {" "}A VecDeque outperforms a linked list for FIFO work; a hash map
            beats a linked list for membership; a skip list matches doubly
            linked for ordered sets. Linked lists rarely win outside their
            specific niches.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Losing nodes during reversal.</strong> Forgetting to save
            the next pointer before rewriting a node&apos;s <code>next</code>
            {" "}strands the rest of the list. The canonical three-pointer
            pattern exists precisely to prevent this.
          </li>
          <li>
            <strong>Leaked tail pointer after clear.</strong> A{" "}
            <code>clear()</code> that resets head but forgets to reset the
            tail leaves the next enqueue writing into a detached node. Either
            null both or derive the tail from the head.
          </li>
          <li>
            <strong>Concurrent mutation without synchronization.</strong>{" "}
            Two threads concurrently inserting at the head can drop an
            element. Use CAS-based primitives (<code>AtomicReference</code>
            {" "}in Java, <code>AtomicPtr</code> in Rust) or lock the head.
          </li>
          <li>
            <strong>Stack-overflowing recursive traversal.</strong> A 10-million-
            element list blows the default thread stack in a naive recursive
            implementation. Convert to iteration before shipping.
          </li>
          <li>
            <strong>ABA problems in lock-free code.</strong> A node removed
            and re-inserted between a CAS read and CAS write looks unchanged
            but represents a different logical state. Tagged pointers, hazard
            pointers, or epoch-based reclamation address this.
          </li>
          <li>
            <strong>Accidental O(n²) on repeated append.</strong> Appending
            by walking to the end each time is O(n²) cumulative. Always cache
            the tail or reverse-append-then-reverse.
          </li>
          <li>
            <strong>Double-free on deletion.</strong> Freeing the removed
            node before clearing neighbor pointers leaves dangling references
            that crash on next access.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Lock-free concurrent queues
        </h3>
        <p>
          The Michael-Scott queue, the backbone of Java&apos;s{" "}
          <code>ConcurrentLinkedQueue</code> and many production message
          brokers, is a singly linked list with atomic head and tail pointers.
          Enqueue runs CAS on tail.next; dequeue runs CAS on head. The
          single-successor topology is what makes the algorithm tractable —
          adding back-pointers would multiply the number of atomic updates
          required per operation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Allocator free lists
        </h3>
        <p>
          Modern allocators (jemalloc, tcmalloc, mimalloc) maintain free lists
          of same-size blocks as singly linked lists. Each free block&apos;s
          first bytes double as the next pointer — zero space overhead. Pop
          on allocate, push on free, both O(1). This is the canonical intrusive
          linked list.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          LISP cons cells and functional lists
        </h3>
        <p>
          Clojure, Scheme, Erlang, and Elixir lists are singly linked because
          structural sharing requires immutable forward pointers. Prepending
          to a 10-million-element list is O(1) and shares the entire tail —
          only the new head node is allocated. Most functional recursion
          patterns (map, filter, fold) are expressed naturally over this
          structure.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Hash table collision chains
        </h3>
        <p>
          Chaining hash tables (Java&apos;s <code>HashMap</code> pre-Java-8,
          Go&apos;s <code>map</code>, Python&apos;s dict for small buckets)
          resolve collisions with short singly linked lists per bucket. Load
          factor tuning keeps chain lengths small (usually under 8), so the
          per-access cache miss cost stays bounded.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/singly-linked-lists-diagram-3.svg"
          alt="Memory layout comparison of a linked list versus a contiguous array showing pointer chasing cache misses"
          caption="Figure 3: Memory layout — arrays occupy one cache line per 8+ elements; linked lists scatter nodes, incurring a cache miss per hop."
        />
      </section>

      {/* ============================================================
          SECTION 8: Common Interview Questions
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Reverse a singly linked list in place.
            </p>
            <p className="mt-2 text-sm">
              A: Three-pointer iterative walk. Initialize <code>prev = null</code>,
              {" "}<code>curr = head</code>. At each step: save{" "}
              <code>next = curr.next</code>, set <code>curr.next = prev</code>,
              advance <code>prev = curr</code> and <code>curr = next</code>.
              When <code>curr</code> is null, <code>prev</code> is the new
              head. O(n) time, O(1) space. Recursive solutions are elegant but
              blow the stack on large inputs.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Detect whether a list has a cycle and find the entry point.
            </p>
            <p className="mt-2 text-sm">
              A: Floyd&apos;s tortoise-and-hare. Advance a slow pointer by 1
              and a fast pointer by 2; if they meet, there is a cycle.
              To find the entry, reset one pointer to the head and advance
              both by 1 until they meet again — that node is the cycle start.
              Proof: the distance from the head to the entry equals the
              distance from the meeting point to the entry (traversing around
              the cycle). O(n) time, O(1) space.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Find the k-th node from the end in a single pass.
            </p>
            <p className="mt-2 text-sm">
              A: Two-pointer gap technique. Advance a lead pointer k nodes
              ahead, then walk both pointers together until lead falls off the
              end. The trailing pointer is now at the k-th from end. O(n)
              time, O(1) space, single pass — essential for streamed inputs
              where a length scan followed by a second traversal is
              impossible.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Merge two sorted singly linked lists.
            </p>
            <p className="mt-2 text-sm">
              A: Maintain a dummy head for the output. Walk both inputs in
              parallel, always attaching the smaller current node to the
              output tail and advancing its pointer. When one input is
              exhausted, splice the other&apos;s remaining tail onto the
              output. O(n + m) time, O(1) space because no nodes are copied —
              they are relinked. This is the merge step of merge-sort on
              linked lists and runs without the O(n) auxiliary buffer that
              array merge requires.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Why is random access O(n) and can it be made faster?
            </p>
            <p className="mt-2 text-sm">
              A: Because successive nodes can live anywhere in memory, the
              only way to reach index i is to walk i next pointers from the
              head. To recover sub-linear random access you have to layer an
              index on top — which is exactly what skip lists do, by
              maintaining forward pointers at multiple levels. A skip list
              gives O(log n) search with the insertion simplicity of linked
              lists, at the cost of higher per-node memory.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Implement a lock-free singly linked list — why is the
              singly-linked topology easier than doubly-linked?
            </p>
            <p className="mt-2 text-sm">
              A: Each node has one outgoing pointer, so inserting or removing
              requires a single atomic compare-and-swap on one field. Doubly
              linked lists require atomically updating two pointers (predecessor
              and successor) which no common CPU supports atomically — the
              Harris–Michael solution stitches together two single-word CAS
              operations with marking bits to make it look atomic, but the
              complexity grows significantly. The Michael-Scott queue
              explicitly chooses singly linked to keep each enqueue/dequeue to
              one or two CAS operations.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References & Further Reading
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">
          References &amp; Further Reading
        </h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Knuth, D.E. — <em>The Art of Computer Programming, Volume 1:
            Fundamental Algorithms</em>, 3rd Edition, Addison-Wesley, Section
            2.2.3–2.2.5 on linked allocation, circular lists, and doubly
            linked variants.
          </li>
          <li>
            Cormen, Leiserson, Rivest, Stein — <em>Introduction to
            Algorithms</em>, 4th Edition, MIT Press, Chapter 10.2 for the
            canonical treatment of linked-list operations.
          </li>
          <li>
            Michael, M., Scott, M. — <em>Simple, Fast, and Practical
            Non-Blocking and Blocking Concurrent Queue Algorithms</em>, PODC
            1996: the Michael-Scott queue foundational paper.
          </li>
          <li>
            Harris, T. — <em>A Pragmatic Implementation of Non-Blocking
            Linked Lists</em>, DISC 2001: the modern reference for lock-free
            linked-list ordered sets.
          </li>
          <li>
            Herlihy, M., Shavit, N. — <em>The Art of Multiprocessor
            Programming</em>, Revised Edition, Morgan Kaufmann, Chapters 9–10
            on concurrent lists and synchronization.
          </li>
          <li>
            Stroustrup, B. — <em>Why you should avoid linked lists</em>, GoingNative
            2012 keynote: widely-cited benchmarks showing cache effects dominate
            theoretical complexity.
          </li>
          <li>
            Linux kernel source — <code>include/linux/list.h</code>: the
            canonical intrusive-list implementation used throughout the
            kernel.
          </li>
          <li>
            Okasaki, C. — <em>Purely Functional Data Structures</em>,
            Cambridge University Press, 1998: the definitive treatment of
            persistent linked structures for functional languages.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
