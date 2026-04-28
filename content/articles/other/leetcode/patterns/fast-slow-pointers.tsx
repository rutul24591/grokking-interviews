"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "fast-slow-pointers",
  title: "Fast & Slow Pointers (Floyd's Tortoise and Hare)",
  description:
    "Two pointers advancing at different speeds detect cycles, find midpoints, and locate cycle entries in linked lists and iterated functions — all in O(n) time and O(1) space.",
  category: "other",
  subcategory: "patterns",
  slug: "fast-slow-pointers",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-25",
  tags: ["fast-slow-pointers", "floyd", "cycle-detection", "linked-list", "leetcode", "patterns"],
  relatedTopics: ["two-pointer", "linked-list", "in-place-linked-list-reversal"],
};

export default function FastSlowPointersArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
      <p className="mb-4">
        Fast and slow pointers — also called Floyd&apos;s tortoise-and-hare algorithm — is a specialisation of the
        two-pointer pattern in which both pointers walk in the same direction but at different speeds. Slow advances
        one node per step; fast advances two. The configuration solves three flavours of problem in O(n) time and O(1)
        space: cycle detection in linked lists or iterated functions, locating the entry point of such a cycle, and
        finding structural midpoints (the middle node of a linked list, the &quot;n-th from the end&quot; pointer
        offset).
      </p>
      <p className="mb-4">
        Robert W. Floyd published the cycle-detection variant in the 1960s — hence the textbook name &quot;Floyd&apos;s
        cycle-finding algorithm.&quot; The algorithm is a workhorse of number theory (Pollard&apos;s rho integer
        factorisation), pseudorandom-number-generator analysis (period detection), and functional-iteration questions
        (happy numbers, fixed points). On Leetcode the pattern shows up most often as &quot;does this linked list have
        a cycle?&quot; or &quot;what node does the cycle enter at?&quot; but extends naturally to any setting where a
        sequence x, f(x), f(f(x)), ... eventually repeats.
      </p>
      <p className="mb-4">
        Recognition signals: a linked-list problem that mentions cycles, midpoints, or &quot;remove the n-th from the
        end&quot;; an iterative numeric process that may or may not terminate (happy number); an array re-cast as a
        function (find duplicate). The unifying intuition is that whenever the search space is finite and the
        transition is deterministic, fast/slow pointers detect periodicity without a hash set, in constant extra
        space.
      </p>
      <p className="mb-4">
        For staff-level interviews, the bar is articulating <em>why</em> the two pointers must meet inside a cycle and
        why the &quot;reset slow to head, walk both at speed 1&quot; trick lands them at the cycle entry. The math is
        elegant — modular arithmetic on cycle length — and interviewers expect you to be able to derive it under
        pressure.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
      <p className="mb-4">
        <strong>Why fast and slow meet inside a cycle.</strong> Once both pointers are inside the cycle, consider the
        gap from slow to fast (counting forward around the cycle). Each step, fast moves two nodes and slow moves
        one, so the gap closes by exactly one position per iteration. Starting from any gap g ∈ {`{0, 1, ..., λ-1}`}
        where λ is the cycle length, after at most λ - 1 steps the gap is zero — they collide. There is no way for
        fast to &quot;jump over&quot; slow because integer mod λ wraps continuously.
      </p>
      <p className="mb-4">
        <strong>No cycle, no meeting.</strong> If the list is acyclic, fast hits null (or its .next does) before slow
        reaches it. The termination check is &quot;while fast and fast.next: ...&quot; — both must be non-null for
        fast to advance two nodes safely.
      </p>
      <p className="mb-4">
        <strong>Cycle entry via the reset trick.</strong> Let µ be the distance from head to cycle entry, and λ the
        cycle length. When slow has taken k steps and fast 2k steps and they meet, both are inside the cycle, and the
        relation 2k − µ ≡ k − µ (mod λ) gives k ≡ 0 (mod λ). So slow is at offset (k − µ) from the cycle entry,
        equivalently at offset −µ mod λ. A walker starting at head reaches the entry in µ steps; a walker at the
        meeting point reaches the entry in µ steps mod λ — which is the same node. So if we reset slow to head and
        advance both at speed 1, they meet at the cycle entry.
      </p>
      <p className="mb-4">
        <strong>Cycle length.</strong> From the meeting point, hold one pointer fixed and walk the other forward
        until it returns. The number of steps is λ.
      </p>
      <p className="mb-4">
        <strong>Midpoint of a list.</strong> When fast reaches the end (fast == null or fast.next == null), slow has
        taken half as many steps and is at the middle. For even-length lists, slow lands on the (n/2 + 1)-th node;
        adjust by initialising fast = head.next if you want the lower middle.
      </p>
      <p className="mb-4">
        <strong>N-th from the end.</strong> Advance fast n nodes first, then walk both at speed 1 until fast reaches
        the end. Slow is now n nodes from the end. Same skeleton, different initial gap.
      </p>
      <p className="mb-4">
        <strong>Functional iteration.</strong> Replace &quot;.next&quot; with an arbitrary function f. Slow becomes
        f(slow); fast becomes f(f(fast)). Floyd&apos;s applies because the sequence x, f(x), f²(x), ... in any finite
        state space must eventually cycle (by pigeonhole), and the same gap-closing argument works.
      </p>
      <ArticleImage
        src="/diagrams/other/leetcode/patterns/fast-slow-pointers-diagram-1.svg"
        alt="Floyd's tortoise and hare: cycle detection, midpoint, and functional iteration"
        caption="Slow steps 1, fast steps 2. Inside any cycle, the gap closes by 1 per iteration — they collide in O(λ) steps."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
      <p className="mb-4">
        The standard cycle-detection skeleton has two phases. <strong>Phase 1:</strong> slow and fast both start at
        head. Loop: advance slow by one, fast by two, after each step check if fast or fast.next is null (no cycle,
        return) or if slow == fast (cycle, break). <strong>Phase 2:</strong> reset slow to head; loop advancing both
        by one until slow == fast; return that node as the cycle entry.
      </p>
      <p className="mb-4">
        Edge cases: empty list (head is null), single node with self-loop, two-node cycle, cycle that includes the
        head (µ = 0). The phase-1 termination check &quot;while fast and fast.next&quot; handles the null case
        cleanly; phase 2 handles µ = 0 by terminating immediately on the first iteration (slow == fast at head).
      </p>
      <p className="mb-4">
        For midpoint problems, the loop is &quot;while fast and fast.next: slow = slow.next; fast =
        fast.next.next&quot;. Initialising fast at head returns the upper middle on even-length; initialising fast at
        head.next returns the lower middle. Pick consistently — palindrome-list reverses the second half starting
        from slow, so you want the lower middle on even input to keep halves equal.
      </p>
      <p className="mb-4">
        For &quot;remove the n-th from the end&quot;, advance fast n + 1 steps before starting the joint walk so that
        when fast falls off the end, slow points to the predecessor of the target — which is what you need for the
        unlink. A dummy head node simplifies the n == length case.
      </p>
      <p className="mb-4">
        For functional iteration (Happy Number, Find Duplicate), define the transition f and run the same skeleton
        with f in place of next. Happy Number terminates either when slow == 1 (special case — the &quot;happy&quot;
        fixed point) or when slow == fast inside the unhappy cycle. Find Duplicate uses f(i) = A[i] on a 1-indexed
        array of values in [1, n] over n + 1 slots — the duplicate value is the cycle entry by the same Floyd math.
      </p>
      <p className="mb-4">
        <strong>Brent&apos;s algorithm</strong> is an alternative cycle-finder with the same asymptotic complexity but
        better constants in practice. It uses a single fast pointer that periodically &quot;teleports&quot; to wider
        search radii. For Leetcode, Floyd&apos;s is universally accepted; Brent&apos;s is worth knowing for follow-ups.
      </p>
      <ArticleImage
        src="/diagrams/other/leetcode/patterns/fast-slow-pointers-diagram-2.svg"
        alt="Floyd's cycle math: why reset-and-walk finds the entry"
        caption="Modular arithmetic on µ (entry distance) and λ (cycle length) gives k ≡ 0 mod λ at meeting — the algebra behind the reset trick."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
      <p className="mb-4">
        Floyd&apos;s vs. <strong>hash set</strong>: hash set is O(n) time and O(n) space — walk the list, store every
        visited node, return on first repeat. Trivial to implement and easy to extend to &quot;return the cycle
        node&quot; (the first repeat is the entry). Floyd&apos;s is O(n) time and O(1) space — better when memory is
        tight or when the list is enormous (gigabytes). Pick Floyd&apos;s for embedded or stream-style settings; pick
        hash set when clarity matters and memory is cheap.
      </p>
      <p className="mb-4">
        Floyd&apos;s vs. <strong>Brent&apos;s</strong>: Brent&apos;s typically uses fewer function evaluations
        (relevant when f is expensive, e.g., Pollard&apos;s rho on large integers), but the constant factors and
        cache behaviour are comparable on linked-list traversal. Same O(λ + µ) total work.
      </p>
      <p className="mb-4">
        Two-pointer (convergent / parallel) vs. <strong>fast/slow</strong>: convergent walks toward each other from
        opposite ends — needs random access (arrays). Fast/slow walks in the same direction at different speeds —
        works on sequential structures (linked lists, iterated functions) where random access is unavailable. They
        share the &quot;two cursors, O(n) time, O(1) space&quot; spirit but apply to disjoint problem shapes.
      </p>
      <p className="mb-4">
        Floyd&apos;s vs. <strong>marking nodes in place</strong>: some Leetcode &quot;detect cycle&quot; submissions
        mutate the list (set node.val to a sentinel or rewire .next). This works but destroys the input — almost
        always disqualified in real interviews. Floyd&apos;s is the non-destructive O(1) space solution.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
      <p className="mb-4">
        Always check &quot;fast and fast.next&quot; before advancing fast by two. The order matters: short-circuit
        evaluation lets you safely access fast.next.next only when fast.next is non-null. A bug here null-derefs on
        any non-cyclic list of length 1.
      </p>
      <p className="mb-4">
        For midpoint problems, decide upfront whether you want the lower or upper middle on even-length lists, and
        document your choice. Initialising fast = head returns the upper middle (lengths 4 → index 2); fast = head.next
        returns the lower middle (lengths 4 → index 1).
      </p>
      <p className="mb-4">
        Use a dummy head node for problems that may delete the head (Remove N-th From End with n = length). It
        eliminates the special case and shrinks the code.
      </p>
      <p className="mb-4">
        For functional iteration, prove that f maps the state space to itself. Find Duplicate works because A[i] ∈ [1,
        n] and indices ∈ [0, n], so following f(i) = A[i] from i = 0 stays in bounds. Happy Number works because
        digit-square-sum of any positive integer stays positive and is bounded by 81 × digit-count, eventually
        entering a finite range.
      </p>
      <p className="mb-4">
        State the cycle-entry argument before writing phase-2 code — it&apos;s short, beautiful, and exactly what
        interviewers want to hear. &quot;k ≡ 0 mod λ, so slow is µ steps before the entry; head is µ steps before too;
        walking both at speed 1 they meet at the entry.&quot;
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
      <p className="mb-4">
        <strong>Null-deref on fast.next.next.</strong> Skipping the &quot;fast and fast.next&quot; check on a
        non-cyclic list of length ≥ 1 crashes. Always test both before advancing.
      </p>
      <p className="mb-4">
        <strong>Returning slow as the cycle entry without the reset trick.</strong> The meeting point is not the
        entry. Reset slow to head and walk both at speed 1.
      </p>
      <p className="mb-4">
        <strong>Off-by-one on midpoint for palindrome.</strong> Reversing from slow on an even-length list with the
        upper middle leaves halves of unequal length. Use the lower middle (fast = head.next initialisation) and
        compare lengths cleanly.
      </p>
      <p className="mb-4">
        <strong>Modifying the list during phase 1.</strong> Some implementations rewire .next to a sentinel for
        marking — destructive and not equivalent to Floyd&apos;s. Don&apos;t do it unless the problem permits.
      </p>
      <p className="mb-4">
        <strong>Confusing &quot;n-th from end&quot; gap initialisation.</strong> Advancing fast n times leaves slow at
        the n-th-from-end node; n + 1 leaves slow at its predecessor (needed for unlink). Pick the gap based on what
        the unlink step expects.
      </p>
      <p className="mb-4">
        <strong>Treating Happy Number termination as &quot;until cycle&quot; only.</strong> The success case (slow ==
        1) must be checked separately, otherwise you classify the happy fixed point as &quot;cycle of length 1&quot;
        and return false.
      </p>
      <p className="mb-4">
        <strong>Find Duplicate without proving the cycle exists.</strong> The proof: by pigeonhole, A has ≥ 2 indices
        with the same value, so f(i) = A[i] has at least two predecessors mapping to the duplicate, creating a cycle.
        Floyd&apos;s then locates the entry, which is the duplicate. State this — interviewers expect it.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
      <p className="mb-4">
        Floyd&apos;s is the standard technique in <strong>Pollard&apos;s rho integer factorisation</strong>, where it
        detects a non-trivial gcd along an iterated quadratic-residue sequence. <strong>Pseudorandom number generator
        analysis</strong> uses it to measure period. <strong>Garbage collectors</strong> sometimes use cycle
        detection variants to reclaim cyclic reference structures. <strong>Linked-list libraries</strong> (Java&apos;s
        ConcurrentLinkedQueue, Linux kernel list traversal in debug mode) use Floyd&apos;s to assert non-cyclic
        invariants without allocating a hash set.
      </p>
      <p className="mb-4">
        Below are the canonical Leetcode problems that map to this pattern. Each tests a slightly different facet.
      </p>
      <p className="mb-4">
        <strong>141. Linked List Cycle.</strong> Detection only — return bool. Phase 1 of Floyd&apos;s. Edge cases:
        empty list, single node, single node with self-loop.
      </p>
      <p className="mb-4">
        <strong>142. Linked List Cycle II.</strong> Full Floyd&apos;s — return the cycle entry node, or null. The
        canonical reset-trick exercise. Be ready to derive the modular argument.
      </p>
      <p className="mb-4">
        <strong>876. Middle of the Linked List.</strong> Pure midpoint variant. The problem accepts the upper middle
        on even-length input (init fast = head).
      </p>
      <p className="mb-4">
        <strong>234. Palindrome Linked List.</strong> Find lower middle, reverse second half, walk first half and
        reversed second half together. O(n) time, O(1) space — better than the obvious stack-based O(n) space.
      </p>
      <p className="mb-4">
        <strong>143. Reorder List.</strong> Find middle, reverse second half, interleave. The composite of three
        linked-list patterns.
      </p>
      <p className="mb-4">
        <strong>19. Remove N-th Node From End of List.</strong> Gap-based fast/slow — advance fast n + 1 steps with a
        dummy head, then walk both. Single-pass, no length precomputation.
      </p>
      <p className="mb-4">
        <strong>202. Happy Number.</strong> Functional Floyd&apos;s on f(n) = digit-square-sum. Cycle ⟹ unhappy;
        slow == 1 ⟹ happy.
      </p>
      <p className="mb-4">
        <strong>287. Find the Duplicate Number.</strong> Array-as-function trick. Prove the cycle exists, then run
        Floyd&apos;s to locate the entry. Read-only, O(1) extra space — strictly better than sort or hash set.
      </p>
      <p className="mb-4">
        <strong>457. Circular Array Loop.</strong> Direction-consistent cycle detection in modular array indexing.
        Same Floyd&apos;s skeleton with extra invariants (skip same-index loops, enforce same-direction).
      </p>
      <ArticleImage
        src="/diagrams/other/leetcode/patterns/fast-slow-pointers-diagram-3.svg"
        alt="Canonical fast/slow-pointer Leetcode problems"
        caption="Linked-list flavour (141, 142, 876, 234, 143, 19) and functional flavour (202, 287, 457)."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>Why are slow and fast guaranteed to meet inside a cycle?</strong> Once both are in the cycle, the
        forward gap from slow to fast modulo λ shrinks by exactly 1 each step. Starting from any gap in [0, λ), it
        reaches 0 in at most λ − 1 steps. The integers wrap continuously mod λ, so fast cannot &quot;skip over&quot;
        slow.</li>
        <li><strong>Walk through the reset trick.</strong> Slow has taken k steps at meeting; k ≡ 0 mod λ. So slow is at
        offset (k − µ) ≡ −µ (mod λ) from the cycle entry. A walker from head needs µ steps to reach the entry. A
        walker at the meeting needs µ steps mod λ — same node. Walk both at speed 1; they meet at the entry.</li>
        <li><strong>What if slow advanced by 1 and fast by 3?</strong> The gap closes by 2 per step. If λ is odd, gcd(2,
        λ) = 1, so all residues are reachable and they meet. If λ is even, they only meet when the initial gap is
        even — sometimes never. The 1-vs-2 speed pair is preferred because gcd(1, λ) = 1 for any λ.</li>
        <li><strong>Compare Floyd&apos;s with hash-set cycle detection.</strong> Hash set: O(n) time, O(n) space, returns
        the cycle node directly (first repeat). Floyd&apos;s: O(n) time, O(1) space, returns the meeting point and
        needs the reset trick for the entry.</li>
        <li><strong>How does Floyd&apos;s find the cycle length?</strong> From the meeting point, hold one pointer and
        walk the other forward, counting until it returns.</li>
        <li><strong>Why does Find Duplicate Number reduce to cycle detection?</strong> Treat A as a function f(i) = A[i].
        Two indices have the same value ⟹ two predecessors map to the duplicate ⟹ the functional graph from i = 0
        eventually enters a cycle whose entry is the duplicate. Floyd&apos;s locates the entry.</li>
        <li><strong>Find the middle of a singly-linked list in one pass.</strong> Slow = fast = head; while fast and
        fast.next: slow = slow.next, fast = fast.next.next. When fast is exhausted, slow is at the middle.</li>
        <li><strong>Remove the n-th node from the end without computing length.</strong> Dummy head; fast advances n + 1
        steps; walk both until fast is null; slow is the predecessor of the target; unlink.</li>
        <li><strong>Detect intersection of two linked lists.</strong> Not Floyd&apos;s but the same family — pointer A
        walks listA then listB; pointer B walks listB then listA. They meet at the intersection (or both reach null).
        O(m + n), O(1).</li>
        <li><strong>What goes wrong on Happy Number with a hash set?</strong> Nothing — it works in O(log n) effective
        time with O(log n) space (the cycle is bounded by the size of the small-int square-sum cycle). Floyd&apos;s
        achieves the same in O(1) space; pick based on memory constraints.</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Knuth volume 2, exercise 3.1.6 introduces the formal analysis of Floyd&apos;s. Brent&apos;s 1980 paper &quot;An
        Improved Monte Carlo Factorization Algorithm&quot; presents the alternative cycle-finder with the
        teleportation trick. Pollard&apos;s 1975 &quot;A Monte Carlo Method for Factorisation&quot; is the original
        application of Floyd&apos;s outside of linked lists.</li>
        <li>For Leetcode practice: 141, 142, 876, 234, 143, 19, 202, 287, 457 in that order builds the muscle. NeetCode
        and Grokking both group these into a &quot;fast and slow pointers&quot; module — work through the entire
        module sequentially for pattern fluency.</li>
        <li>For the math, &quot;The Cycle Detection Problem&quot; chapter in Sedgewick is the most accessible
        proof-walkthrough. Cracking the Coding Interview chapter on linked lists has variants of 141 and 142.</li>
        <li>For interview prep, drill the cycle-entry derivation until you can write it on a whiteboard in under two
        minutes. The math is the differentiator — almost every candidate can implement Floyd&apos;s; far fewer can
        explain why the reset trick lands on the entry. That explanation is the staff-level signal.</li>
      </ul>
    </ArticleLayout>
  );
}
