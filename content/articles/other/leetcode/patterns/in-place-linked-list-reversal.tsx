"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "in-place-linked-list-reversal",
  title: "In-Place Linked List Reversal Pattern",
  description:
    "The prev/curr/next triple-step that reverses a singly linked list in O(n) time and O(1) extra space — the substrate for k-group reversal, palindrome checks, reorder list, and any problem that needs to walk a singly linked list backwards.",
  category: "other",
  subcategory: "patterns",
  slug: "in-place-linked-list-reversal",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-26",
  tags: ["linked-list", "reversal", "leetcode", "patterns", "in-place"],
  relatedTopics: ["linked-list", "fast-slow-pointers", "two-pointer"],
};

export default function InPlaceLinkedListReversalArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
      <p className="mb-4">
        In-place linked-list reversal is the technique of reversing the direction of a singly linked
        list — or a contiguous sub-range of one — by re-pointing existing next pointers, without
        allocating new nodes. The core is a four-line loop body that walks three pointers (prev, curr,
        next) and produces a reversed list in O(n) time and O(1) extra space. The pattern earns its own
        article (separate from the broader linked-list pattern) because it is the single most reused
        sub-routine in linked-list problems.
      </p>
      <p className="mb-4">
        The pattern serves two roles. First as a <strong>standalone operation</strong> — reverse the
        whole list, reverse a sub-range [m, n], reverse in groups of k. Second as a <strong>building
        block</strong> — palindrome check (reverse the second half, walk both halves comparing),
        reorder list (reverse second half, merge by alternation), maximum twin sum (reverse second
        half, walk pairs), add two numbers stored in forward order (reverse, add, reverse). Whenever a
        singly linked list needs to be walked backwards, in-place reversal is the answer.
      </p>
      <p className="mb-4">
        Recognition signals are concrete. &quot;Reverse&quot;, &quot;reverse between m and n&quot;,
        &quot;reverse in groups of k&quot;, &quot;palindrome linked list&quot;, &quot;reorder
        list&quot;, &quot;walk a singly linked list in reverse without using a stack&quot; — all reduce
        to the triple-step core. Any problem that hints at backwards traversal on a singly linked list
        without converting to an array signals reversal.
      </p>
      <p className="mb-4">
        For staff interviews, the lift is performing the triple-step under live coding without an
        off-by-one — the four lines (save, re-point, advance prev, advance curr) must be in the right
        order, and the loop termination must use the saved next, not curr.next (which has been
        clobbered). Sub-range reversal adds two boundary fixups that are surprisingly easy to mis-write.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
      <p className="mb-4">
        <strong>The three pointers.</strong> prev starts at null and tracks the head of the
        already-reversed prefix. curr is the node currently being processed; its next pointer is
        re-pointed at prev each iteration. next is a temporary saved before curr.next is mutated, so we
        can advance curr without losing the rest of the list. After the loop ends, prev is the new
        head and curr is null.
      </p>
      <p className="mb-4">
        <strong>The four-line invariant.</strong> Each iteration: save next, re-point curr.next at
        prev, advance prev to curr, advance curr to next. The order matters — re-pointing before
        saving loses next; advancing prev before re-pointing produces a self-loop. The same four lines
        appear verbatim across every reversal-based algorithm.
      </p>
      <p className="mb-4">
        <strong>Sub-range reversal needs two boundary fixups.</strong> To reverse positions m through
        n: walk prev_outer to position m − 1, save its next as the head of the sub-list (which becomes
        the tail after reversal). Run the triple-step n − m + 1 times. After the loop, prev is the new
        head of the reversed sub-list, and the saved sub-list-head&apos;s next is the original
        post-range successor. Two assignments stitch everything back: prev_outer.next.next becomes the
        post-range successor, prev_outer.next becomes the new sub-list head.
      </p>
      <p className="mb-4">
        <strong>k-group reversal.</strong> Repeat sub-range reversal in chunks of k. Before each chunk,
        check that at least k nodes remain — if fewer, leave them as-is (per 25) or reverse the
        remainder anyway (variant). Each chunk uses the triple-step core; the wrapper handles boundary
        connections between consecutive chunks.
      </p>
      <p className="mb-4">
        <strong>Recursive form.</strong> reverse(head) returns the new head. If head is null or
        head.next is null, return head. Otherwise: new_head = reverse(head.next); head.next.next =
        head; head.next = null; return new_head. The recursion is concise but stack-bounded — for
        n &gt; 10⁴ the iterative form is mandatory.
      </p>
      <p className="mb-4">
        <strong>Why the iterative form is O(1) space.</strong> Only three local pointers across the
        whole call. No stack, no auxiliary structure. The recursive form is O(n) stack space — same
        time, worse space.
      </p>
      <p className="mb-4">
        <strong>Complexity.</strong> O(n) time, O(1) space (iterative). O(n) time, O(n) space
        (recursive). Sub-range and k-group are still O(n) time because each node is visited exactly
        once even with the wrapper logic.
      </p>

      <ArticleImage
        src="/diagrams/other/leetcode/patterns/in-place-linked-list-reversal-diagram-1.svg"
        alt="In-place linked list reversal triple-step"
        caption="The three pointers and the four-line loop body — save next, re-point, advance prev, advance curr."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
      <p className="mb-4">
        <strong>Whole-list reversal template (206).</strong> prev = null, curr = head. While curr:
        next = curr.next; curr.next = prev; prev = curr; curr = next. Return prev. Four lines in the
        loop body. The base case (empty or single-node list) is handled implicitly because curr is
        immediately null and the loop does not execute.
      </p>
      <p className="mb-4">
        <strong>Sub-range reversal template (92).</strong> Use a dummy head pointing at head. Walk
        prev_outer m − 1 steps from dummy. Save sub_head = prev_outer.next (this becomes the tail of
        the reversed sub-list). Reverse n − m + 1 nodes using the triple-step starting at
        prev_outer.next. After the loop: sub_head.next = curr (the post-range successor, which curr
        points at after the loop ends); prev_outer.next = prev (the new sub-list head). Return
        dummy.next.
      </p>
      <p className="mb-4">
        <strong>k-group reversal template (25).</strong> Loop until fewer than k nodes remain.
        Per chunk: identify the k-th node by walking k steps; reverse the chunk; connect the previous
        chunk&apos;s tail to the reversed chunk&apos;s head; the original chunk head (which is now the
        chunk tail) becomes the connector for the next chunk. Use a dummy head for the first chunk&apos;s
        connection.
      </p>
      <p className="mb-4">
        <strong>Reverse-pairs template (24).</strong> Same as k-group with k = 2, or written
        explicitly: dummy.next = head; prev = dummy; while prev.next and prev.next.next: a =
        prev.next; b = a.next; a.next = b.next; b.next = a; prev.next = b; prev = a. Pairs are
        rewired in O(1) each.
      </p>
      <p className="mb-4">
        <strong>Palindrome via reversal (234).</strong> Find middle with fast / slow. Reverse second
        half. Walk both halves comparing values. If any mismatch, return false. The reversal is the
        load-bearing operation — without it, comparing forward against backward on a singly linked
        list would need O(n) extra space.
      </p>
      <p className="mb-4">
        <strong>Reorder list (143).</strong> Find middle; reverse second half; merge by alternation.
        After splitting, reverse the second half in place. Merging walks both halves as
        first1 → first2 → second1 → second2 → ..., reassigning next pointers to interleave.
      </p>
      <p className="mb-4">
        <strong>Add two numbers in forward order (445).</strong> Reverse both inputs; run the carry
        loop from 2 (Add Two Numbers); reverse the result. Three reversals, all O(n), still O(n)
        total. Alternative: use stacks to read backwards; O(n) extra space.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
      <p className="mb-4">
        <strong>Iterative vs. recursive reversal.</strong> Both are O(n) time. Iterative is O(1)
        space; recursive is O(n) stack. For Leetcode constraints up to 10⁴ nodes recursion is
        borderline; for production code, iteration is mandatory. Recursion is shorter to write but
        slower in practice due to call overhead.
      </p>
      <p className="mb-4">
        <strong>Reverse-then-walk vs. stack-based backwards walk.</strong> Both achieve backwards
        traversal. Reversal is O(1) extra space (in-place modification); stack is O(n) extra space
        (stores all nodes). Reversal mutates the input — if the original order must be preserved,
        either reverse twice (once to read, once to restore) or use the stack.
      </p>
      <p className="mb-4">
        <strong>Reverse vs. doubly linked list.</strong> A doubly linked list supports O(1) backwards
        walk natively. If the data structure is fixed (singly linked) and the design allows in-place
        modification, reversal is cheaper than converting. If the design is free, doubly linked is
        the structural answer.
      </p>
      <p className="mb-4">
        <strong>Sub-range vs. whole-list.</strong> Whole-list reversal is the four-line loop with no
        boundary work. Sub-range adds a walk-to-the-start, a saved sub-head, and two stitch
        assignments at the end — about 8–10 lines instead of 4. The complexity is still O(n).
      </p>
      <p className="mb-4">
        <strong>k-group vs. pair swap.</strong> Pair swap (k = 2) is special-cased in 24 with a more
        readable per-pair rewiring. For k &gt; 2, reuse the sub-range template per chunk. The
        per-chunk overhead is constant, so total is still O(n).
      </p>
      <p className="mb-4">
        <strong>Reverse vs. array-of-values.</strong> Copy values into an array, reverse the array,
        write back. O(n) time, O(n) space, mutates only values not structure. Correct but uglier than
        the in-place pointer reversal — the interview expectation is the pointer surgery.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
      <p className="mb-4">
        <strong>Memorise the four lines.</strong> next = curr.next; curr.next = prev; prev = curr;
        curr = next. In that order. Anyone who has done linked-list interviews more than once should
        be able to type these lines in their sleep.
      </p>
      <p className="mb-4">
        <strong>Use a dummy head for sub-range reversal.</strong> Walking to position m − 1 is
        cleaner from a dummy than from the head, because the m = 1 case (reverse from the start)
        otherwise needs special handling.
      </p>
      <p className="mb-4">
        <strong>Save the original sub-head before reversing.</strong> After sub-range reversal, the
        original head of the sub-list is now its tail; you need a reference to it to connect to the
        post-range successor. Save it before the inner loop.
      </p>
      <p className="mb-4">
        <strong>Validate the four-line order against an example.</strong> Mentally trace 1 → 2 → 3 →
        null. After iteration 1: prev = 1, curr = 2, 1.next = null. After iteration 2: prev = 2,
        curr = 3, 2.next = 1. After iteration 3: prev = 3, curr = null, 3.next = 2. Return prev = 3.
        If the trace breaks, the order is wrong.
      </p>
      <p className="mb-4">
        <strong>Set the new tail&apos;s next to null.</strong> After whole-list reversal the new head
        is prev; the old head (now the tail) had its next re-pointed to null on the first iteration,
        so this happens for free. Be sure of this if reading reversed code carefully.
      </p>
      <p className="mb-4">
        <strong>Prefer iteration to recursion.</strong> Recursion is shorter but uses O(n) stack —
        for inputs &gt; 10⁴ nodes, iteration is the only safe choice. Mention the trade-off if asked.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
      <p className="mb-4">
        <strong>Re-pointing curr.next before saving next.</strong> The classic bug — once curr.next
        becomes prev, the original successor is lost and the loop traverses the already-reversed
        prefix instead of the rest of the list.
      </p>
      <p className="mb-4">
        <strong>Returning curr instead of prev.</strong> At loop end, curr is null and prev is the
        new head. Returning curr returns null and breaks the contract.
      </p>
      <p className="mb-4">
        <strong>Forgetting the boundary fixups in sub-range reversal.</strong> After the inner loop,
        the original sub-head&apos;s next still points at the first node past the range — but the
        prev_outer.next still points at the original sub-head, not the new (reversed) head. Both
        ends need explicit reassignment.
      </p>
      <p className="mb-4">
        <strong>Off-by-one in k-group counting.</strong> Walking k steps from a starting node lands
        you at the (k + 1)-th node from the start. Mis-counting either reverses k − 1 nodes or
        reverses past the end.
      </p>
      <p className="mb-4">
        <strong>Not handling fewer-than-k remaining nodes.</strong> 25 specifies that a final group
        smaller than k stays as-is. Reversing it anyway changes the answer. Always count first, then
        reverse only if k full nodes remain.
      </p>
      <p className="mb-4">
        <strong>Stack overflow on long inputs with the recursive form.</strong> 10⁴-node lists
        overflow Java&apos;s default 512 KB stack. Iterate.
      </p>
      <p className="mb-4">
        <strong>Reversing in place when the original is needed downstream.</strong> Reversal mutates
        the list. If a later step compares against the original ordering, save a copy of the values
        first or reverse back at the end.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases (Canonical Leetcode Problems)</h2>
      <p className="mb-4">
        <strong>206. Reverse Linked List.</strong> The base template — four-line loop body. Both
        iterative and recursive are expected answers.
      </p>
      <p className="mb-4">
        <strong>92. Reverse Linked List II.</strong> Sub-range reversal with two boundary stitch
        assignments. The interview test for the pattern beyond the base case.
      </p>
      <p className="mb-4">
        <strong>25. Reverse Nodes in k-Group.</strong> Repeated sub-range reversal with a fewer-than-k
        check. The hardest of the pure-reversal problems.
      </p>
      <p className="mb-4">
        <strong>24. Swap Nodes in Pairs.</strong> k = 2 specialisation; often written explicitly
        with per-pair rewiring rather than the generic k-group code.
      </p>
      <p className="mb-4">
        <strong>61. Rotate List.</strong> Find the new tail (n − k % n − 1 steps from head), splice
        the original tail to the original head, and break at the new tail. Reversal-adjacent — uses
        pointer surgery without the triple-step.
      </p>
      <p className="mb-4">
        <strong>234. Palindrome Linked List.</strong> Reverse second half, walk both halves
        comparing. Restoring the second half before returning is good citizenship; not always
        required by the problem.
      </p>
      <p className="mb-4">
        <strong>143. Reorder List.</strong> Find middle, reverse second half, merge by alternation.
        Three patterns combined; the reversal is the central one.
      </p>
      <p className="mb-4">
        <strong>2130. Maximum Twin Sum of a Linked List.</strong> Reverse second half, walk pairs
        (first[i], reversed[i]), track max sum. O(n) time, O(1) space.
      </p>
      <p className="mb-4">
        <strong>445. Add Two Numbers II.</strong> Numbers stored in forward order. Reverse both,
        run the carry loop, reverse the result. Or use stacks for O(n) extra space without
        mutation.
      </p>
      <p className="mb-4">
        <strong>369. Plus One Linked List.</strong> Reverse, increment with carry, reverse back.
        Or recursive carry-from-the-tail (more elegant but stack-bounded).
      </p>

      <ArticleImage
        src="/diagrams/other/leetcode/patterns/in-place-linked-list-reversal-diagram-2.svg"
        alt="Sub-range and k-group reversal"
        caption="Sub-range reversal stitches two boundaries; k-group reversal applies the sub-range template per chunk."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>Why save next before re-pointing curr.next?</strong> Because re-pointing curr.next at
        prev clobbers the only reference to the rest of the list. Saving next first preserves the
        ability to advance.</li>
        <li><strong>Why does the iterative version need O(1) space?</strong> Only three local pointers
        across the whole call; no stack, no auxiliary structure. Each node is visited exactly once
        and modified in place.</li>
        <li><strong>What does prev hold at loop end?</strong> The new head of the reversed list. curr
        holds null (the original tail&apos;s old next was null, so the loop terminates).</li>
        <li><strong>How does sub-range reversal connect the boundaries?</strong> Two assignments:
        sub_head.next = curr (curr after the inner loop is the post-range successor) and
        prev_outer.next = prev (prev is the new sub-list head).</li>
        <li><strong>Why is k-group reversal still O(n)?</strong> Each node is reversed exactly once; the
        wrapper overhead per chunk is constant. n / k chunks × O(k) per chunk = O(n).</li>
        <li><strong>How does palindrome detection use reversal?</strong> Reverse the second half so it
        can be walked forward in step with the first half. Without reversal, comparing first
        forward to last backward needs O(n) extra space.</li>
        <li><strong>What happens if you reverse the recursive way on a long list?</strong> Stack
        overflow at the language&apos;s default depth — Java around 10⁴, Python at 10³ unless
        sys.setrecursionlimit is raised.</li>
        <li><strong>Can you reverse without mutating the original?</strong> Yes, by allocating new
        nodes — but that defeats the &quot;in-place&quot; expectation. The interview asks for in-place.</li>
        <li><strong>How does the recursive form work?</strong> reverse(head.next) returns the new head
        of the reversed suffix; head.next.next = head wires the current node onto the end; head.next
        = null marks it as the new tail.</li>
        <li><strong>Why is reorder list a good test of the pattern?</strong> Because it composes find-
        middle, reverse-second-half, and interleave-merge — three sub-patterns into one O(n)
        algorithm. Each step has its own pitfalls; getting all three right is the bar.</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Leetcode problem set.</strong> 206, 92, 25, 24, 61, 234, 143, 2130, 445, 369. Solve
        in this order — base, sub-range, k-group, then the composition problems.</li>
        <li><strong>Cracking the Coding Interview, §2.</strong> Problem 2.6 (Palindrome) and 2.5 (Sum
        Lists) require reversal as a sub-step; 2.4 (Partition) does not but is structurally adjacent.</li>
        <li><strong>Elements of Programming Interviews, Chapter 7.</strong> The lists chapter walks
        through reversal in three forms — iterative, recursive, and sub-range — with timing
        comparisons.</li>
        <li><strong>CLRS, §10.2 Exercises.</strong> Reversing a singly linked list is exercise 10.2-7;
        the official solution is the four-line loop body.</li>
        <li><strong>Editorials for 206 and 25.</strong> The 25 editorial walks through the chunk-
        boundary connections explicitly — read it once, the second time you see this pattern
        it becomes mechanical.</li>
        <li><strong>Grokking the Coding Interview — &quot;In-place Reversal of a LinkedList&quot;
        module.</strong> Practical drill set with sub-range and k-group framing.</li>
      </ul>
    </ArticleLayout>
  );
}
