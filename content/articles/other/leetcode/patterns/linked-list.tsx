"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "linked-list",
  title: "Linked List Pattern",
  description:
    "Pointer-surgery techniques for singly and doubly linked lists — dummy heads, fast/slow pointers, splicing, and the design problems (LRU, LFU) that pair a list with a hash map for O(1) operations.",
  category: "other",
  subcategory: "patterns",
  slug: "linked-list",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-26",
  tags: ["linked-list", "leetcode", "patterns", "pointers", "splicing"],
  relatedTopics: ["fast-slow-pointers", "in-place-linked-list-reversal", "hash-table"],
};

export default function LinkedListArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
      <p className="mb-4">
        The linked list pattern groups all problems whose central operation is pointer surgery on a chain
        of nodes — splicing, splitting, merging, reversing, partitioning, and finding by traversal. The
        data structure trades O(1) random access for O(1) head insert / delete and O(1) splice given a
        node reference. The interview value is not the algorithmic content — most problems are O(n)
        single-pass — but the pointer discipline. One-character bugs in next-pointer assignments break
        chains, leak memory, or create cycles.
      </p>
      <p className="mb-4">
        Five micro-techniques cover most of the syllabus. <strong>Dummy head</strong> eliminates the
        special case for operations that may modify the head itself. <strong>Fast / slow pointers</strong>
        find the middle, the k-th-from-end, or detect cycles in one pass. <strong>Iterative
        reversal</strong> uses a prev / curr / next triple-step (its own pattern). <strong>Splice</strong>
        connects two chains by reassigning two pointers in O(1). <strong>Partition into two dummies</strong>
        sorts a list into two output lists by predicate without allocation.
      </p>
      <p className="mb-4">
        Recognition signals are explicit. The problem statement passes a ListNode head — the data
        structure is a linked list. Operations are typically &quot;reverse a sub-range&quot;, &quot;remove
        every duplicate&quot;, &quot;merge two sorted&quot;, &quot;split in half&quot;, &quot;find the
        cycle entry&quot;. Constant extra space is usually expected because allocating a fresh list is
        considered cheating; the discipline is in-place pointer manipulation.
      </p>
      <p className="mb-4">
        For staff interviews, the lift is composing the micro-techniques. Reorder List (143) splits
        (find middle), reverses (in-place reversal), and merges (interleaved splice) — three patterns in
        one. LRU Cache (146) pairs a doubly linked list with a hash map for O(1) get and put. The base
        material is mechanical; the interview engineering is correctness under pointer discipline plus
        boundary cases (empty list, single node, head modification).
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
      <p className="mb-4">
        <strong>Dummy head.</strong> Allocate a sentinel node whose next points at the real head. All
        traversal and modification proceed from the dummy. Operations that would otherwise need to
        special-case &quot;is the head being deleted / replaced?&quot; become uniform — the dummy is
        always there to be modified. Return dummy.next at the end. The cost is one extra allocation per
        problem; the savings are dozens of branches.
      </p>
      <p className="mb-4">
        <strong>Two-pointer (fast / slow).</strong> The fast pointer moves twice (or k times) per slow
        step. To find the middle: when fast.next or fast.next.next is null, slow is at the middle. To
        find k-th-from-end: advance fast k steps first, then move both until fast hits the end. To
        detect a cycle: fast and slow meet inside the cycle if one exists.
      </p>
      <p className="mb-4">
        <strong>Splice.</strong> To insert node n between a and b: n.next = b; a.next = n. To remove n
        between a and b: a.next = n.next (singly) or a.next = n.next; n.next.prev = a (doubly). The
        two-line surgery does not require traversal — given the predecessor reference, splice is O(1).
      </p>
      <p className="mb-4">
        <strong>Reversal in place.</strong> Maintain prev = null, curr = head. While curr: save next =
        curr.next, set curr.next = prev, advance prev = curr and curr = next. Return prev as the new
        head. The triple-step is the building block for sub-range reversal and is its own pattern.
      </p>
      <p className="mb-4">
        <strong>Partition into two dummies.</strong> Allocate two dummy heads (e.g., &quot;less&quot; and
        &quot;greater_or_equal&quot;). Walk the input, splice each node into the appropriate output. At
        the end, splice less.tail to greater.head and return less.next. No allocation per node — pure
        pointer reassignment.
      </p>
      <p className="mb-4">
        <strong>Doubly linked list.</strong> Each node carries prev and next. Removal given a node
        reference is O(1) — n.prev.next = n.next; n.next.prev = n.prev. Use head and tail sentinels to
        remove null-checks at the boundaries. Doubly linked is the substrate for LRU / LFU caches and
        any structure that needs O(1) move-to-front given a node handle.
      </p>
      <p className="mb-4">
        <strong>Complexity.</strong> Most linked-list operations are O(n) time and O(1) extra space if
        recursion is avoided. Recursive variants are O(n) time and O(n) stack space — for inputs up to
        10⁴ nodes, Java&apos;s default stack overflows; switch to iteration above ~10⁵ nodes.
      </p>

      <ArticleImage
        src="/diagrams/other/leetcode/patterns/linked-list-diagram-1.svg"
        alt="Linked list core techniques"
        caption="Five micro-techniques — dummy head, two pointers, reversal, splice, partition — and the dummy-head template that removes head-modification special cases."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
      <p className="mb-4">
        <strong>Merge two sorted lists (21).</strong> Allocate a dummy head; walk a tail pointer from
        dummy. While both inputs non-empty, splice the smaller head into tail.next, advance that input
        pointer and the tail. After the loop, splice whichever input is non-empty. Return dummy.next.
        Pure splicing — no allocation per node.
      </p>
      <p className="mb-4">
        <strong>Remove Nth from end (19).</strong> Dummy head; fast pointer advances n + 1 steps. Then
        fast and slow move together until fast hits null. slow.next is the node to remove; slow.next =
        slow.next.next. Return dummy.next. The +1 lead places slow at the predecessor of the target.
      </p>
      <p className="mb-4">
        <strong>Find middle (876).</strong> fast = slow = head. While fast and fast.next, advance both.
        Slow ends at floor((n + 1) / 2) — the right of two middles for even-length lists. Variant:
        stop when fast.next.next is null to land on the left middle.
      </p>
      <p className="mb-4">
        <strong>Reorder List (143).</strong> Three steps: find middle, reverse second half, merge by
        alternation. Each step is its own template; combining them is the interview content. After
        finding the middle, split with mid = slow.next; slow.next = null. Reverse mid. Then merge by
        alternating heads — first half head, then reversed-second head, then first.next, then second.next.
      </p>
      <p className="mb-4">
        <strong>Partition list (86).</strong> Two dummies (less, greater). Walk input; for each node,
        splice into the appropriate dummy&apos;s tail. After the walk, less.tail.next = greater.next;
        greater.tail.next = null. Return less.next. The two-dummy approach preserves stability.
      </p>
      <p className="mb-4">
        <strong>Add Two Numbers (2).</strong> Two pointers (one per input) plus a carry. While either
        pointer non-null or carry non-zero: sum = carry + a.val + b.val; carry = sum / 10; create node
        with sum mod 10. Output is built with a tail pointer from a dummy head.
      </p>
      <p className="mb-4">
        <strong>Copy List with Random Pointer (138).</strong> Two approaches. Hash-map: pass once to
        clone nodes and map original-to-clone, pass again to wire up next and random. Interleave: clone
        each node and splice it after its original (O(1) space), then wire up randoms via the
        interleaving, then split.
      </p>
      <p className="mb-4">
        <strong>LRU Cache (146).</strong> Hash map from key to doubly linked list node; doubly linked
        list ordered by recency. get: lookup, remove from current position, insert at front, return
        value. put: lookup; if present, update value and move to front; if absent, insert at front and
        evict from back if size exceeds capacity. All ops O(1).
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
      <p className="mb-4">
        <strong>Linked list vs. dynamic array.</strong> Array gives O(1) random access; list does not.
        Array gives amortised O(1) push-back; list gives O(1) push-anywhere given a reference. Use a
        list when you need O(1) splice or move-to-front given a handle (LRU). Use an array when index
        access dominates and reallocation cost is acceptable.
      </p>
      <p className="mb-4">
        <strong>Singly vs. doubly linked.</strong> Doubly is twice the memory but supports O(1) deletion
        given a reference, O(1) reverse traversal. Singly is enough for forward-only algorithms (merge,
        split, reverse). Use doubly when the design problem requires arbitrary node deletion (LRU, LFU,
        skip-list).
      </p>
      <p className="mb-4">
        <strong>Iterative vs. recursive linked-list code.</strong> Recursion is shorter for reversal,
        merge, and reverse-pairs. It is also stack-bounded — Java overflows around 10⁴, Python defaults
        to 10³. For Leetcode constraints up to 10⁴ nodes, iteration is safer; for any production code
        on possibly long lists, iteration is mandatory.
      </p>
      <p className="mb-4">
        <strong>Linked list vs. deque (ArrayDeque).</strong> ArrayDeque is a circular array; LinkedList
        is a doubly linked list. ArrayDeque has better cache behaviour and is preferred for
        queue / stack roles. Use a true linked list only when stable references survive insertion (an
        ArrayDeque resize invalidates references).
      </p>
      <p className="mb-4">
        <strong>Hash + linked list vs. tree map for LRU.</strong> The hash + linked list combination
        gives O(1) get / put. A tree map would give O(log n). For systems work, the hash-list pairing is
        the universal answer — it is the design behind LinkedHashMap and most production caches.
      </p>
      <p className="mb-4">
        <strong>Cycle detection: Floyd vs. hash set.</strong> Hash set is O(n) time, O(n) space. Floyd&apos;s
        tortoise / hare is O(n) time, O(1) space. Floyd is the textbook answer; the hash-set version is
        the easier-to-explain warm-up.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
      <p className="mb-4">
        <strong>Always start with a dummy when the head may change.</strong> Removing the first node,
        inserting before the head, partitioning — any operation that might modify head should use a
        dummy. The branch elimination is worth the allocation.
      </p>
      <p className="mb-4">
        <strong>Save next before mutating curr.next.</strong> next = curr.next is the first line of
        every reversal-style loop. Mutating curr.next first loses the rest of the list.
      </p>
      <p className="mb-4">
        <strong>Use sentinels at both ends in doubly linked lists.</strong> Head and tail sentinels
        remove the &quot;is this the first / last node?&quot; checks. Every real insertion is between
        two existing nodes.
      </p>
      <p className="mb-4">
        <strong>Null out the disconnected end.</strong> When splitting a list, set the tail of the first
        half&apos;s last node to null. Forgetting this leaves a cycle through the second half and
        produces infinite loops in subsequent traversals.
      </p>
      <p className="mb-4">
        <strong>Validate against an empty list and a single node.</strong> Most pointer bugs surface in
        n = 0 or n = 1 inputs. Run the algorithm in your head against both before submitting.
      </p>
      <p className="mb-4">
        <strong>Prefer iteration to recursion above 10⁴ nodes.</strong> Java and Python default stack
        depths overflow on long recursive linked-list calls. Iterate; if recursion is required, document
        the depth bound.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
      <p className="mb-4">
        <strong>Forgetting to save next before re-pointing curr.next.</strong> The classic reversal bug:
        curr.next = prev loses curr&apos;s old next. Save it first.
      </p>
      <p className="mb-4">
        <strong>Returning the original head after head modification.</strong> If the head was deleted
        or replaced, the original head pointer is stale. Use a dummy and return dummy.next.
      </p>
      <p className="mb-4">
        <strong>Failing to null the tail after split.</strong> Reorder List (143) needs slow.next = null
        after slow lands at the middle; otherwise the reversed second half still points back at the
        first half, creating a cycle.
      </p>
      <p className="mb-4">
        <strong>Off-by-one in fast / slow.</strong> &quot;Fast moves k steps first&quot; is k, not k − 1.
        For 19 (Remove Nth From End), fast moves n + 1 steps because we want slow to land at the
        predecessor of the target.
      </p>
      <p className="mb-4">
        <strong>Mixing up prev and curr in reversal.</strong> The triple-step is prev = null, curr =
        head, loop with next save / re-point / advance. Returning curr (which is null at the end) gives
        a null head; return prev.
      </p>
      <p className="mb-4">
        <strong>Not handling cycles.</strong> A list with a cycle traverses forever. Cycle problems use
        Floyd or a visited set; non-cycle problems should at minimum bound the traversal by input size
        if cycles are possible.
      </p>
      <p className="mb-4">
        <strong>Using LinkedList where ArrayDeque suffices.</strong> Java&apos;s LinkedList has high
        per-node overhead. For queue / stack use cases, ArrayDeque is faster and uses less memory.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases (Canonical Leetcode Problems)</h2>
      <p className="mb-4">
        <strong>21. Merge Two Sorted Lists.</strong> Dummy head + tail pointer; splice the smaller head.
        The base linked-list pattern.
      </p>
      <p className="mb-4">
        <strong>23. Merge k Sorted Lists.</strong> Heap of (value, list-pointer); pop and splice. O(N
        log k) where N is total nodes. Or pairwise merge for O(N log k) without a heap.
      </p>
      <p className="mb-4">
        <strong>19. Remove Nth From End.</strong> Dummy + fast / slow with n + 1 lead. Slow ends at the
        predecessor of the target.
      </p>
      <p className="mb-4">
        <strong>876. Middle of Linked List.</strong> Fast / slow. Stop condition determines left vs.
        right middle for even-length lists.
      </p>
      <p className="mb-4">
        <strong>83 / 82. Remove Duplicates I / II.</strong> 83: skip-on-equal traversal. 82: dummy +
        skip-all-with-equal-value subgroups. The II variant requires a prev pointer that does not
        advance into duplicates.
      </p>
      <p className="mb-4">
        <strong>2. Add Two Numbers.</strong> Digit pointers + carry; build output from a dummy head.
      </p>
      <p className="mb-4">
        <strong>143. Reorder List.</strong> Find middle → reverse second half → merge by alternation.
        Three-pattern composition.
      </p>
      <p className="mb-4">
        <strong>86. Partition List.</strong> Two dummies (less, greater). Splice each node into the
        appropriate dummy; concatenate at the end.
      </p>
      <p className="mb-4">
        <strong>234. Palindrome Linked List.</strong> Find middle, reverse second half, walk both halves
        comparing. O(n) time, O(1) extra space.
      </p>
      <p className="mb-4">
        <strong>146. LRU Cache.</strong> Doubly linked list (recency order) + hash map (key →
        list-node). All ops O(1).
      </p>

      <ArticleImage
        src="/diagrams/other/leetcode/patterns/linked-list-diagram-2.svg"
        alt="Linked list patterns and doubly linked list surgery"
        caption="Recurring sub-patterns and the symmetric pointer surgery enabled by doubly linked lists with sentinels."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>Why use a dummy head?</strong> To eliminate the &quot;is this the head?&quot; branch on
        every insert / delete. The cost is one allocation; the benefit is uniform code paths.</li>
        <li><strong>How does fast / slow find the middle in one pass?</strong> Fast moves twice per slow
        step. After fast traverses n nodes, slow has traversed n / 2.</li>
        <li><strong>Why does Floyd&apos;s cycle detection work?</strong> If a cycle exists, fast eventually
        catches up to slow inside it because the gap closes by one node per iteration. The proof is
        modular arithmetic on the cycle length.</li>
        <li><strong>How do you reverse a linked list in O(1) extra space?</strong> Iterative prev / curr /
        next: save next, re-point curr.next = prev, advance prev = curr and curr = next.</li>
        <li><strong>How does LRU achieve O(1) get and put?</strong> Hash map for O(1) lookup of nodes;
        doubly linked list for O(1) move-to-front and O(1) eviction from the back.</li>
        <li><strong>How do you split a linked list in half without knowing its length?</strong> Fast / slow.
        When fast hits the end, slow is at the middle. Set slow.next = null to detach.</li>
        <li><strong>How do you copy a list with random pointers in O(1) extra space?</strong> Interleave the
        clones with the originals (a → a&apos; → b → b&apos; → ...), wire up randoms via the
        interleaving (clone.random = original.random.next), then split.</li>
        <li><strong>When should you use a doubly linked list?</strong> When O(1) deletion given a node
        reference is required, or when the design needs O(1) move-to-front given a handle (LRU, LFU).</li>
        <li><strong>Why not use recursion for linked-list reversal?</strong> Stack depth equals list length;
        Java and Python overflow at ~10⁴ frames. Iteration is O(1) stack space.</li>
        <li><strong>How do you detect and remove a cycle?</strong> Floyd to detect; reset slow to head and
        advance both one step until they meet at the cycle entry. The predecessor of that meeting node
        is the tail of the cycle; null its next to break.</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Leetcode problem set.</strong> 21, 23, 19, 876, 83, 82, 2, 143, 86, 328, 234, 138, 146,
        460. Solve in this order — the syllabus runs from base patterns to design.</li>
        <li><strong>CLRS, §10.2 (Linked Lists).</strong> Foundational treatment of singly, doubly, and
        circular variants with pseudocode for all base operations.</li>
        <li><strong>Cracking the Coding Interview, Chapter 2.</strong> The interview canon for linked
        lists; problems 2.1 (Remove Duplicates), 2.5 (Sum Lists), and 2.7 (Intersection) cover the
        breadth.</li>
        <li><strong>Java LinkedHashMap source.</strong> Production-grade hash + doubly linked list — the
        same design as the LRU Cache answer, with eviction policy hooks.</li>
        <li><strong>Elements of Programming Interviews, Chapter 7.</strong> Lists chapter with the full
        suite of pointer-surgery problems and the proof of Floyd&apos;s.</li>
        <li><strong>Grokking the Coding Interview — &quot;In-place Reversal of a LinkedList&quot;
        module.</strong> Useful framing of the reversal sub-pattern in isolation.</li>
      </ul>
    </ArticleLayout>
  );
}
