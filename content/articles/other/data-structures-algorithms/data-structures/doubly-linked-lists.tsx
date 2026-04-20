"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "doubly-linked-lists",
  title: "Doubly Linked Lists",
  description:
    "Staff-level deep dive into doubly linked lists — bidirectional traversal, O(1) arbitrary deletion, LRU cache composition with hash maps, intrusive variants, and concurrency challenges.",
  category: "other",
  subcategory: "data-structures",
  slug: "doubly-linked-lists",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-04-17",
  tags: [
    "linked-lists",
    "doubly-linked-list",
    "lru-cache",
    "data-structures",
    "pointers",
  ],
  relatedTopics: [
    "singly-linked-lists",
    "hash-tables",
    "queues",
    "arrays",
  ],
};

export default function DoublyLinkedListsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p>
          A <strong>doubly linked list</strong> is a linear collection whose
          nodes carry pointers to both successor and predecessor. Structurally
          it is a singly linked list paid a second 8-byte pointer per node for
          the ability to navigate and mutate in both directions in O(1). That
          small increase in per-node overhead unlocks a qualitatively
          different set of algorithms — most notably, O(1) removal of a node
          given only a direct reference to it.
        </p>
        <p>
          Doubly linked lists sit at the heart of one of the most commonly
          requested interview designs: the LRU cache. The pattern is
          canonical — a hash map keyed on the logical cache key, storing as
          its value a pointer into a doubly linked recency list. Lookups are
          O(1) through the hash map; moving a hit node to the head of the
          recency list is O(1) because the back-pointer lets the node splice
          itself out without a predecessor scan. This is precisely the
          operation a singly linked list cannot offer without paying O(n).
        </p>
        <p>
          Beyond LRU, doubly linked lists show up in DOM node sibling
          traversal (browsers expose <code>nextSibling</code> and{" "}
          <code>previousSibling</code>), the process scheduler queues of Unix
          kernels, the chat-log scrollback of IRC clients, and the
          job-execution ordering inside many workflow engines. The deck of
          trade-offs is identical to singly linked lists, plus the additional
          cost of maintaining both pointers through every mutation. Staff
          engineers reach for the structure when and only when back-traversal
          or arbitrary-pointer deletion is essential; otherwise singly linked
          or array-backed alternatives win on simplicity and memory.
        </p>
        <p>
          The concurrency picture changes sharply. Each insertion or deletion
          now touches up to four pointers (predecessor.next, new.prev, new.next,
          successor.prev), none of which can be updated atomically together on
          commodity CPUs. Lock-free doubly linked lists are research-level
          algorithms — Harris&apos;s marking scheme and Fraser&apos;s
          multi-word CAS abstractions are required to make the structure
          safe without locks — and even then performance rarely beats a
          well-tuned locked list.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Node topology with prev pointer
        </h3>
        <p>
          Each node carries three fields: value, next, and prev. The head&apos;s
          prev and the tail&apos;s next are null (or point to sentinel
          boundary nodes). Memory per node is therefore two pointers plus the
          payload — still dominated in aggregate by the allocator header, but
          strictly larger than the singly linked equivalent. On a 64-bit
          system, a doubly linked node carrying a 4-byte integer payload
          costs 8 + 8 + 4 = 20 bytes of content plus 16 bytes of allocator
          header, for roughly 36 bytes — nine times the 4-byte array
          equivalent.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          O(1) deletion given a node reference
        </h3>
        <p>
          The defining capability. Given a direct pointer to node X, you can
          splice X out of the list in four pointer updates without a scan:
          <code> X.prev.next = X.next</code>, <code>X.next.prev = X.prev</code>,
          then null X&apos;s pointers for hygiene. Sentinel head/tail nodes
          eliminate the null checks on X.prev and X.next, making the routine
          a four-instruction sequence in compiled languages.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Sentinel head and tail
        </h3>
        <p>
          A common industrial pattern is to allocate two dummy nodes — a
          head sentinel and a tail sentinel — and maintain the invariant that
          every real node lies strictly between them. The sentinels eliminate
          every null check: head.next gives the first real node, tail.prev
          gives the last real node, and insertion and deletion no longer
          special-case the endpoints. This pattern is used in Linux kernel
          list heads, Java&apos;s <code>LinkedHashMap</code>, and every
          production LRU implementation worth inspecting.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/doubly-linked-lists-diagram-1.svg"
          alt="Doubly linked list node structure with prev and next pointers with sentinel head and tail"
          caption="Figure 1: Node topology — prev and next pointers enable bidirectional traversal; sentinels remove null-endpoint special cases."
        />
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Insertion between two known nodes
        </h3>
        <p>
          Splicing a new node N between P and S is four pointer updates:
          <code> N.prev = P</code>, <code>N.next = S</code>,{" "}
          <code>P.next = N</code>, <code>S.prev = N</code>. Order matters in
          concurrent contexts but not single-threaded. The symmetric case at
          the head or tail reduces to the same four updates against the
          sentinels if they are used.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Deletion of an arbitrary node
        </h3>
        <p>
          The canonical O(1) deletion: <code>node.prev.next = node.next</code>,
          {" "}<code>node.next.prev = node.prev</code>. Given a list of a
          million elements, deleting any arbitrary node costs the same four
          instructions whether it is the first, the millionth, or somewhere
          in between. This is the property that makes doubly linked lists the
          backbone of LRU caches and task queues where entries can be
          canceled or reordered from anywhere in the list.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Circular doubly linked lists
        </h3>
        <p>
          In a circular variant, the tail&apos;s next points to the head and
          the head&apos;s prev points to the tail. This enables uniform
          traversal code (no null boundary), O(1) access to both ends from
          the head pointer alone, and clean rotation operations (move the
          head forward or backward N steps). The Linux kernel&apos;s{" "}
          <code>list_head</code> is circular and the code relies heavily on
          that uniformity. Chromium&apos;s task queues also use circular
          structures for similar reasons.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/doubly-linked-lists-diagram-2.svg"
          alt="Doubly linked list arbitrary node deletion showing four pointer updates to splice a node out"
          caption="Figure 2: Arbitrary deletion — four pointer updates excise a node from anywhere in the list without any scan."
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
            <strong>Prepend / append</strong>: O(1) with head and tail
            sentinels.
          </li>
          <li>
            <strong>Insert / delete given node reference</strong>: O(1) — the
            defining capability.
          </li>
          <li>
            <strong>Search by value</strong>: O(n).
          </li>
          <li>
            <strong>Access by index</strong>: O(n), or O(n/2) if the tail is
            known and the index is closer to the back.
          </li>
          <li>
            <strong>Reverse traversal</strong>: O(n) — trivial thanks to prev
            pointers.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Doubly vs singly linked
        </h3>
        <p>
          The singly linked version saves one pointer per node — 12.5%
          memory for large pointer-heavy payloads, more for small ones — at
          the cost of O(n) predecessor lookup. Pick singly linked when the
          workload only mutates at the head (stacks, free lists) or when
          lock-free variants matter. Pick doubly linked when arbitrary
          deletions from known references are frequent (LRU caches, priority
          queues with cancellation, DOM mutation, scheduler queues).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Doubly linked vs deque (VecDeque / ArrayDeque)
        </h3>
        <p>
          Many workloads that historically used doubly linked lists — queues
          with both-end operations, history buffers, undo stacks — are
          better served by array-backed deques (ring buffers). They give
          O(1) push/pop at both ends, cache-friendly iteration, and better
          memory density. A doubly linked list wins only when the workload
          also needs O(1) mid-list deletion by node reference; otherwise the
          deque is almost always the correct choice.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Concurrency cost
        </h3>
        <p>
          A doubly linked list mutation touches up to four pointers. No mainstream
          CPU supports atomic updates across four independent memory locations.
          Lock-free doubly linked lists therefore rely either on double-word CAS
          (DCAS, not native on x86-64) or on Harris/Fraser-style marking protocols
          that layer a logical-delete step before physical removal. The practical
          consequence is that production doubly linked lists shipping under
          concurrent access almost always hold a lock — fine-grained per-bucket
          locks for hash-backed LRUs, a single lock for small scheduler lists.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Always use head and tail sentinels.</strong> The 16 extra
            bytes buy structural uniformity — no endpoint null checks in any
            operation, fewer bugs, less branching.
          </li>
          <li>
            <strong>Compose with a hash map for LRU.</strong> The
            hash-map-plus-doubly-linked-list pattern is idiomatic for any
            cache with recency-based eviction; implement it once, reuse
            extensively.
          </li>
          <li>
            <strong>Prefer intrusive lists in kernels and allocators.</strong>
            {" "}Embedding prev/next pointers inside the payload structure
            eliminates a level of indirection and avoids a per-node
            allocation. Linux&apos;s <code>list_head</code> is the canonical
            intrusive doubly-linked list.
          </li>
          <li>
            <strong>Lock pessimistically under concurrency.</strong>{" "}
            Lock-free doubly linked lists are hard. A single coarse lock
            around the recency list backing an LRU cache is usually fine; if
            it becomes a bottleneck, shard the LRU into N stripes rather than
            attempting lock-free.
          </li>
          <li>
            <strong>Favor VecDeque when back-traversal isn&apos;t
            needed.</strong> Ring buffers win on cache behavior and memory
            density for pure two-ended queue workloads.
          </li>
          <li>
            <strong>Maintain sentinel invariants in debug builds.</strong>{" "}
            Assert <code>head.prev === null</code> and{" "}
            <code>tail.next === null</code> (or pointer-back to sentinels) on
            every boundary-affecting operation. Most doubly-linked-list bugs
            violate one of these invariants.
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
            <strong>Half-updated pointers on deletion.</strong> Updating
            <code> X.prev.next</code> but forgetting <code>X.next.prev</code>
            {" "}leaves the list with a corrupt back-pointer chain. The next
            reverse traversal will find the wrong predecessor.
          </li>
          <li>
            <strong>Double removal.</strong> Removing the same node twice in
            quick succession (typical when multiple code paths race) rewrites
            neighbor pointers to the wrong values. Guard with a{" "}
            <code>node.prev === null</code> check or a removed flag.
          </li>
          <li>
            <strong>Aliased prev/next on single-node lists.</strong> With
            sentinels, a single-element list has head.next pointing to the
            lone node whose prev and next both point to the sentinel. Without
            sentinels, the edge case multiplies and is a common source of
            off-by-one bugs.
          </li>
          <li>
            <strong>Memory leaks from cyclic references in
            GC&apos;d languages.</strong> Historically, naive reference-
            counted runtimes (Swift, Python with circular references) leak
            the entire list because every node retains its neighbors. Use
            weak references on back-pointers or explicit clear on eviction.
          </li>
          <li>
            <strong>Iterator invalidation during removal.</strong> Removing
            the current node from inside a forward traversal without first
            caching <code>next</code> stands the iterator into freed memory.
          </li>
          <li>
            <strong>Concurrent mutation without synchronization.</strong> Two
            threads inserting at adjacent positions can corrupt the back
            chain even when the forward chain looks intact. Lock or use a
            proven concurrent structure.
          </li>
          <li>
            <strong>Mixing up prev/next in reverse traversal.</strong> Walking
            the list from tail to head using <code>.next</code> reads garbage
            after the first step. Careful naming (<code>previousNode</code>,
            {" "}<code>nextNode</code>) and code-review attention avoid most
            occurrences.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          LRU cache (hash map + doubly linked list)
        </h3>
        <p>
          The canonical design: the hash map maps keys to node references;
          the doubly linked list orders entries by recency with most-recently-
          used at the head. On hit, the node is spliced out (O(1) thanks to
          prev pointers) and moved to the head. On eviction, the tail node is
          removed (O(1)) and its key deleted from the hash map. Every
          production in-memory cache — Redis&apos; LRU eviction, Caffeine,
          Guava Cache, Memcached&apos;s slab-level LRU — uses this exact
          pattern.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          DOM node siblings
        </h3>
        <p>
          Browser DOM expose <code>nextSibling</code>,{" "}
          <code>previousSibling</code>, <code>firstChild</code>, and{" "}
          <code>lastChild</code> — the exact interface of a doubly linked
          list. Live node collections (like{" "}
          <code>childNodes</code>) dispatch their mutation events through the
          underlying linked structure. Inserting or removing a node anywhere
          in the tree is O(1) relative to the tree operation itself because
          the DOM stores siblings this way.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Linux kernel list_head
        </h3>
        <p>
          The Linux kernel&apos;s intrusive circular doubly linked list
          backs nearly every ordered collection in the kernel — task queues,
          inode lists, superblock tracking, module lists. The design is an
          intrusive structure with macros that take the containing-struct
          type and field name and compute offsets. It&apos;s a masterclass in
          how circular sentinels + macros + intrusive storage combine to
          produce zero-overhead, type-safe linked lists.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Java LinkedHashMap
        </h3>
        <p>
          Java&apos;s <code>LinkedHashMap</code> maintains insertion or
          access order using a doubly linked list overlaid on the underlying
          hash table buckets. The ordering can be switched to access-order
          with a single boolean in the constructor, instantly turning the
          structure into an LRU cache with bounded size. It is the
          textbook example of composing the two data structures.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/doubly-linked-lists-diagram-3.svg"
          alt="LRU cache architecture with hash map keys mapping to nodes in a doubly linked recency list"
          caption="Figure 3: LRU cache — hash map gives O(1) lookup; doubly linked recency list gives O(1) promotion-to-head and O(1) tail eviction."
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
              Q: Design an LRU cache with O(1) get and put.
            </p>
            <p className="mt-2 text-sm">
              A: Combine a hash map (key → node) with a doubly linked list
              ordered by recency. On get: look up the node in the hash map
              (O(1)), splice it out of its current position, and move it to
              the head (O(1)). On put: if the key exists, update the value
              and move to head; otherwise create a node, insert at head, add
              to hash map. If over capacity, remove the tail (O(1)) and
              delete its key from the hash map. Both operations O(1). The
              doubly linked list is essential because promoting a hit to
              head requires removing it from its current position, which
              needs the prev pointer.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Why can&apos;t you build an O(1) LRU with a singly linked
              list?
            </p>
            <p className="mt-2 text-sm">
              A: Promoting a hit to the head requires removing it from its
              current position. In a singly linked list, removing a node
              given only a direct reference requires an O(n) scan to find
              the predecessor. You&apos;d have to either scan the list
              (defeating the O(1) guarantee) or copy the successor&apos;s
              value into the doomed node and remove the successor instead (a
              trick that works but corrupts external references to that
              node, breaking the hash map). Doubly linked fixes all of this
              by making the prev pointer the answer.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Flatten a multi-level doubly linked list where each node may
              have a child list.
            </p>
            <p className="mt-2 text-sm">
              A: DFS traversal. Walk the list with <code>curr</code>. When
              {" "}<code>curr.child</code> exists, recursively flatten it and
              splice the flattened sublist between <code>curr</code> and{" "}
              <code>curr.next</code>, updating all four pointers at the
              boundaries. Clear the child pointer. Iterative equivalent uses
              an explicit stack. O(n) time, O(depth) space.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you make a doubly linked list thread-safe for
              concurrent insertions and deletions?
            </p>
            <p className="mt-2 text-sm">
              A: The honest answer is: with a lock. A doubly linked list
              mutation touches four pointers across three nodes; no mainstream
              CPU supports a four-word atomic update. A single mutex around
              the list is typically adequate for LRU-style workloads where
              the hit rate keeps contention low. For scalable variants, shard
              the list into stripes keyed by hash of the element, each with
              its own lock. True lock-free doubly linked lists (Harris,
              Fraser) exist in research papers but rarely outperform locked
              designs in practice.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are the pros and cons of a circular doubly linked list
              vs sentinel-bounded?
            </p>
            <p className="mt-2 text-sm">
              A: Circular lists unify the representation: head.prev points
              to the tail, tail.next points to the head, so boundary checks
              collapse. Traversal code doesn&apos;t special-case the end.
              Sentinel-bounded lists use two dummy nodes as the boundaries,
              achieving similar uniformity with a slightly more obvious
              structure. Circular is marginally more memory-efficient
              (no sentinels); sentinels make the &quot;empty list&quot; state
              more explicit and harder to accidentally confuse with a
              single-element list. Linux kernel chose circular; Java
              LinkedHashMap chose sentinel-bounded. Both work.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Given a reference to a node in a doubly linked list, how do
              you delete it in O(1)?
            </p>
            <p className="mt-2 text-sm">
              A: Update{" "}
              <code>node.prev.next = node.next</code> and{" "}
              <code>node.next.prev = node.prev</code>. Then null out{" "}
              <code>node.prev</code> and <code>node.next</code> for hygiene
              (to catch use-after-free and help GC reclaim). If the list uses
              sentinels, no null checks are needed. If not, handle the
              boundary cases: if <code>node.prev</code> is null it was the
              head (update head pointer); symmetric for tail. All four-step
              operations run in constant time regardless of list length.
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
            Fundamental Algorithms</em>, Section 2.2.5 (Doubly Linked Lists)
            with sentinel-based analysis.
          </li>
          <li>
            Cormen, Leiserson, Rivest, Stein — <em>Introduction to
            Algorithms</em>, 4th Edition, Chapter 10.2 on doubly linked list
            operations.
          </li>
          <li>
            Linux kernel source — <code>include/linux/list.h</code>: the
            canonical intrusive circular doubly linked list macros and
            conventions.
          </li>
          <li>
            Fraser, K. — <em>Practical Lock-Freedom</em>, PhD thesis,
            Cambridge, 2004: the comprehensive reference for lock-free
            doubly linked lists and multi-word CAS.
          </li>
          <li>
            Harris, T.L. — <em>A Pragmatic Implementation of Non-Blocking
            Linked Lists</em>, DISC 2001: foundational for lock-free ordered
            lists using marking.
          </li>
          <li>
            Oracle Java documentation — <em>LinkedHashMap</em> and{" "}
            <em>LinkedList</em>: the reference implementations using
            doubly linked list semantics with sentinel nodes.
          </li>
          <li>
            Caffeine Cache source (github.com/ben-manes/caffeine): a
            production-quality LRU cache with advanced W-TinyLFU eviction
            built on doubly linked list recency tracking.
          </li>
          <li>
            Sedgewick, R., Wayne, K. — <em>Algorithms</em>, 4th Edition,
            Chapter 1.3: doubly linked list as the substrate for deques and
            LRU caches.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
