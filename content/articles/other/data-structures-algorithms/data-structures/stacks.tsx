"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "stacks",
  title: "Stacks",
  description:
    "Staff-level deep dive into stacks — LIFO semantics, array-backed versus linked-list-backed implementations, call-stack frames, monotonic stack techniques, and concurrent stack designs.",
  category: "other",
  subcategory: "data-structures",
  slug: "stacks",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-04-17",
  tags: [
    "stacks",
    "lifo",
    "call-stack",
    "monotonic-stack",
    "data-structures",
  ],
  relatedTopics: [
    "queues",
    "arrays",
    "singly-linked-lists",
    "trees",
  ],
};

export default function StacksArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* SECTION 1 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p>
          A <strong>stack</strong> is a collection whose only insertion and
          removal operations act on the most recently added element — a
          strict <em>last-in, first-out</em> (LIFO) discipline. The interface
          is minimal: <code>push</code> adds an element to the top,{" "}
          <code>pop</code> removes and returns it, and <code>peek</code>{" "}
          exposes it without removal. The simplicity of the interface belies
          the structure&apos;s centrality to computing — every function call,
          every expression evaluation, every recursive descent, and every
          depth-first traversal runs on top of some stack somewhere.
        </p>
        <p>
          Stacks predate the vocabulary we use to describe them. Turing
          machines implicitly stack return addresses; Dijkstra&apos;s
          shunting-yard algorithm (1961) used a stack to convert infix to
          postfix expressions; Allen Newell and Herbert Simon&apos;s IPL-V
          (1959) was the first high-level language to provide a stack as a
          first-class construct. Today the stack is woven through every
          layer of the stack, from hardware (the x86{" "}
          <code>CALL</code>/<code>RET</code> instructions manipulate an
          architectural stack pointer) to systems (the kernel&apos;s
          per-thread stack), to languages (JavaScript&apos;s execution
          context stack), to frameworks (React&apos;s reconciliation fiber
          stack).
        </p>
        <p>
          The practitioner-level decision is almost always an implementation
          one: array-backed (growable-vector style) vs linked-node. The
          array backing dominates in the general case on modern CPUs due to
          cache locality and contiguous memory. The linked variant wins in
          workloads demanding O(1) worst-case push (no occasional copy burst)
          or concurrent lock-free access via Treiber&apos;s CAS-on-head
          protocol. Both share the same O(1) amortized push/pop but trade
          vastly different constants.
        </p>
        <p>
          Interview questions on stacks tend to fall into two buckets.
          Straightforward applications — parentheses matching, expression
          evaluation, next-greater-element with monotonic stacks — test
          whether a candidate recognizes when the LIFO discipline matches
          the problem&apos;s recursion structure. Deeper questions — design a
          min-stack with O(1) min query, implement a queue using two stacks,
          or explain how the JavaScript call stack supports asynchronous
          recursion via continuation-passing — probe the structure&apos;s
          interaction with the surrounding runtime.
        </p>
      </section>

      {/* SECTION 2 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">LIFO discipline</h3>
        <p>
          The single defining property. Any sequence of N pushes and N pops
          retrieves elements in exactly the reverse order they were added,
          regardless of interleaving. This property maps directly to nested
          processing: function calls nest, bracket pairs nest, parser
          contexts nest. If the problem has nested structure, a stack is
          almost certainly an appropriate tool.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Array-backed implementation
        </h3>
        <p>
          The dominant practical choice. A growable buffer plus a{" "}
          <code>top</code> index. <code>push</code> writes at{" "}
          <code>top</code> and increments; <code>pop</code> decrements and
          reads. Amortized O(1) push (geometric growth, see Arrays);
          worst-case O(n) on a rare resize. Memory locality is excellent —
          sequential push and pop touch adjacent cache lines. This is the
          implementation used by virtually every language standard library
          (Java <code>ArrayDeque</code>, Python <code>list</code> as stack,
          Go <code>append</code>/slice off the end, Rust <code>Vec</code>).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Linked-node implementation
        </h3>
        <p>
          Each push allocates a node; head pointer is the top. Push is O(1)
          worst case (no resize). Memory cost is higher per element and
          traversal-unfriendly, but the lock-free variant (Treiber stack) is
          elegant: a single CAS on the head pointer both inserts and linearizes
          the operation, with no ambient state to coordinate. Used in
          allocators, free lists, and many lock-free work-stealing pools.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/stacks-diagram-1.svg"
          alt="Stack LIFO push and pop operations showing top-of-stack index movement and elements in insertion-reverse order"
          caption="Figure 1: LIFO push and pop — elements leave in reverse insertion order, mapping directly to nested execution patterns."
        />
      </section>

      {/* SECTION 3 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Push/pop mechanics
        </h3>
        <p>
          In an array-backed stack, push is: bounds check, write{" "}
          <code>buf[top++]</code>, possibly resize. Pop is: bounds check,
          read <code>buf[--top]</code>. Both run in two or three instructions
          in hot paths. Modern JIT compilers fold bounds checks across tight
          loops, and when the top frame is hot in L1 the actual memory cost
          is essentially a register operation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          The hardware call stack
        </h3>
        <p>
          Every function invocation on x86-64 pushes a return address,
          frame pointer (if <code>-fno-omit-frame-pointer</code>), and local
          variables onto the per-thread call stack. The <code>CALL</code>{" "}
          instruction is literally a push of the instruction pointer plus a
          jump. <code>RET</code> is a pop. Stack overflow is the hardware
          enforcement of the same LIFO discipline — a thread exhausts its
          pre-allocated stack region and triggers a fault. Default stack
          sizes vary: 1 MB on Windows, 8 MB on Linux, 512 KB on Node worker
          threads. Any deeply-recursive algorithm must either convert to
          iteration or raise the thread&apos;s stack explicitly.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monotonic stacks</h3>
        <p>
          A <em>monotonic stack</em> maintains elements in strictly
          increasing or decreasing order. On each new input, elements
          violating the monotonicity are popped — and the pop act itself
          performs the logical work (computing next-greater, next-smaller,
          largest rectangle in histogram, daily temperatures). The amortized
          cost is O(n) total because each element is pushed and popped at
          most once, even though the inner loop <em>looks</em> like it
          might be quadratic. Monotonic stacks are the archetype for
          interview problems where the intuition is &quot;brute force is
          O(n²) but somehow O(n) exists&quot;.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/stacks-diagram-2.svg"
          alt="Array-backed stack versus linked-list-backed stack comparison showing storage layout and push pop implementations"
          caption="Figure 2: Array-backed vs linked-list-backed — cache behavior and allocator pressure dominate the practical performance gap."
        />
      </section>

      {/* SECTION 4 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">
          Trade-offs &amp; Comparisons
        </h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Operation complexity
        </h3>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Push</strong>: O(1) amortized (array); O(1) worst case
            (linked).
          </li>
          <li>
            <strong>Pop</strong>: O(1) both implementations.
          </li>
          <li>
            <strong>Peek</strong>: O(1) both.
          </li>
          <li>
            <strong>Search for element</strong>: O(n), not part of the LIFO
            contract but occasionally useful.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Array-backed vs linked-node
        </h3>
        <p>
          Array-backed wins almost universally: cache friendliness, compact
          memory, cheap cold iteration, trivial serialization. Linked-node
          wins only when worst-case latency matters (e.g., real-time
          systems where a resize-induced 8ms stall is unacceptable) or when
          a lock-free Treiber-stack design is required. Benchmark data
          from language standard libraries consistently shows array-backed
          stacks 3–10× faster for pure push-pop workloads.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Stack vs queue
        </h3>
        <p>
          Both are restricted-access linear collections; the only
          distinction is ordering (LIFO vs FIFO). Problems with nested
          structure prefer stacks; problems with fairness or chronological
          processing prefer queues. Converting a stack to a queue (or vice
          versa) using two of the other is a classic interview exercise
          that illustrates amortized analysis.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Stack vs recursion
        </h3>
        <p>
          A recursive algorithm and an explicit-stack iterative version
          express the same computation. The explicit-stack version avoids
          runtime recursion-depth limits, can be paused and resumed, and is
          straightforward to instrument. The recursive version is shorter
          to read. Prefer iteration when depth may exceed a few thousand, or
          when you need mid-computation yield points (generators, coroutines,
          streaming parsers).
        </p>
      </section>

      {/* SECTION 5 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Prefer array-backed stacks in general-purpose code.</strong>
            {" "}Java&apos;s <code>ArrayDeque</code>, Python&apos;s{" "}
            <code>list</code>, Rust&apos;s <code>Vec</code> all give you
            stack semantics with excellent cache behavior.
          </li>
          <li>
            <strong>Convert deep recursion to iteration using an explicit
            stack.</strong> Tree and graph traversals that might exceed
            thousands of frames belong in iterative form.
          </li>
          <li>
            <strong>Pre-allocate when size is known.</strong> Passing a
            capacity hint avoids copy bursts for bounded-size workloads
            (shunting-yard, bracket matching over fixed documents).
          </li>
          <li>
            <strong>Pick Treiber for lock-free.</strong> When a concurrent
            stack is required, a Treiber stack with CAS on head is simpler
            and faster than a locked linked list for almost all workloads.
          </li>
          <li>
            <strong>Design auxiliary stacks for aggregate
            queries.</strong> A parallel min-stack, max-stack, or
            monotonically-sorted stack lets aggregate queries run in O(1)
            per push alongside the main LIFO discipline.
          </li>
          <li>
            <strong>Track stack size at every mutation.</strong> Debug
            assertions on size help catch underflow early — a pop on an
            empty stack is one of the most common production bug signatures.
          </li>
        </ul>
      </section>

      {/* SECTION 6 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Stack overflow from uncontrolled recursion.</strong>{" "}
            Tree traversals and recursive descent parsers crash at a few
            thousand levels on default thread stacks. Always convert to
            iteration or use a dedicated larger-stack thread.
          </li>
          <li>
            <strong>Empty-stack pop.</strong> Failing to check underflow
            before pop either returns garbage (in low-level implementations)
            or throws (in managed ones). Always guard with size checks or
            use a typed <code>Option</code>/<code>Result</code>.
          </li>
          <li>
            <strong>Confusing peek with pop.</strong> A peek that
            accidentally mutates, or a pop that is used as a peek, both
            silently corrupt invariants. Most runtime stacks return the
            popped value, so separating the two in a code review signals
            intent clearly.
          </li>
          <li>
            <strong>Leaking references after pop.</strong> In managed
            languages, pop-then-decrement leaves the now-unused array slot
            still holding a reference to the popped object, keeping it
            alive against the intent. Always null the slot after pop.
          </li>
          <li>
            <strong>Shared mutable state across coroutines.</strong> A
            single stack mutated by multiple coroutines or generators is
            not safe. Either partition the stack per coroutine or lock.
          </li>
          <li>
            <strong>Wrong direction in monotonic stack problems.</strong>{" "}
            Choosing increasing vs decreasing monotonicity, and left-to-right
            vs right-to-left traversal, are the four variants that actually
            exist. Each problem has exactly one correct combination.
          </li>
          <li>
            <strong>Implicit stacks in async code.</strong> Nested{" "}
            <code>await</code> or promise chains build a conceptual stack
            that doesn&apos;t show in any stack trace. Errors thrown N levels
            deep in an async chain can appear to come from a much shallower
            source. Async stack traces (Chromium&apos;s{" "}
            <code>Error.captureStackTrace</code>, V8&apos;s async stack
            traces flag) mitigate this.
          </li>
        </ul>
      </section>

      {/* SECTION 7 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          JavaScript execution context stack
        </h3>
        <p>
          Every JavaScript function invocation pushes a new execution
          context onto the engine&apos;s stack. The context includes
          local variable environment, <code>this</code> binding, and
          closure scope. When the function returns, the context pops and
          control resumes at the caller. The &quot;Uncaught RangeError:
          Maximum call stack size exceeded&quot; error is the V8 stack
          limit hitting its typical 10,000–20,000-frame ceiling.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Parser and expression evaluator
        </h3>
        <p>
          Every infix expression parser uses two stacks — one for operators,
          one for operands — in the shunting-yard algorithm. The
          same pattern powers SQL planners, regex parsers, template
          engines (Handlebars, Mustache), and math renderers (MathJax,
          KaTeX). The nested nature of expressions maps directly to LIFO
          discipline.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          React reconciler fiber stack
        </h3>
        <p>
          React&apos;s reconciler traverses the fiber tree using an
          explicit work stack rather than recursion, so it can pause and
          resume (the concurrent mode contract). Each fiber work unit is a
          stack frame; yielding back to the scheduler is a controlled
          interruption of the traversal. This is the textbook case for
          explicit-stack iteration replacing recursion to buy interruptibility.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Monotonic stacks in production analytics
        </h3>
        <p>
          Calculation of rolling window metrics — next greater temperature,
          stock span, largest rectangle under a histogram, span of decreasing
          returns — all rely on monotonic stacks. These operations appear
          in financial reporting engines, real-time dashboards, and
          climate-data reduction pipelines. A monotonic stack transforms a
          quadratic brute force into a single linear pass.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/stacks-diagram-3.svg"
          alt="Call stack and recursion showing nested function frames with return addresses and local variables"
          caption="Figure 3: The hardware call stack — each function invocation pushes a frame; return unwinds it; recursion and yield both map onto this structure."
        />
      </section>

      {/* SECTION 8 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Design a stack with O(1) min and max queries.
            </p>
            <p className="mt-2 text-sm">
              A: Two auxiliary stacks, one maintaining the running minimum
              and one the running maximum. On push, append to min-stack the
              smaller of the new value and its current top (and symmetric
              for max-stack). On pop, pop all three in sync. Every query
              reads the top of the aux stack. O(1) for all operations, O(n)
              space. The alternative — tracking just the min in the main
              stack alongside each entry — is equivalent in asymptotic cost
              and slightly simpler.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Implement a queue using two stacks.
            </p>
            <p className="mt-2 text-sm">
              A: Maintain an <code>in</code> stack and an <code>out</code>{" "}
              stack. Enqueue pushes to <code>in</code>. Dequeue pops from{" "}
              <code>out</code>; if empty, move everything from{" "}
              <code>in</code> to <code>out</code> in bulk, reversing order,
              then pop. Every element is moved at most twice, so amortized
              O(1) per operation. Worst-case single operation is O(n) during
              the transfer. This is a canonical demonstration of how LIFO
              stacks compose into a FIFO queue.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Why is monotonic-stack for next-greater-element O(n) and
              not O(n²)?
            </p>
            <p className="mt-2 text-sm">
              A: Each element is pushed exactly once and popped exactly
              once over the entire traversal. The inner while-loop that
              pops violating elements runs at most a total of n times
              across all outer iterations, not n times per outer iteration.
              This is amortized analysis: the total work across all outer
              steps is bounded by O(n) because each element can only
              leave the stack once. The illusion of quadratic work comes
              from looking at the inner loop in isolation.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Given a string of brackets, determine whether they are
              balanced.
            </p>
            <p className="mt-2 text-sm">
              A: Iterate the string with a single stack. On every opening
              bracket, push it. On every closing bracket, check the top:
              if it matches the pair, pop and continue; otherwise return
              false. At the end, return whether the stack is empty. Each
              character is processed exactly once: O(n) time, O(n) worst-case
              space (nested opens). This problem generalizes to HTML/XML
              parsers, parenthesized expression validators, and many
              linters.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Evaluate a Reverse Polish Notation expression with a stack.
            </p>
            <p className="mt-2 text-sm">
              A: Scan left to right. For each token: if it&apos;s a number,
              push. If it&apos;s an operator, pop two operands, apply, push
              the result. At the end, the single value on the stack is the
              answer. O(n) time, O(n) worst-case space. This is the final
              step of the shunting-yard algorithm (which converts infix to
              RPN) and is exactly how Forth and PostScript execute.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does a Treiber stack work and what problem does it
              have?
            </p>
            <p className="mt-2 text-sm">
              A: A Treiber stack is a lock-free linked stack. Push
              allocates a node, reads the current head, sets the
              node&apos;s next to that head, and runs CAS(head, oldHead,
              newNode). Pop reads the head, reads head.next, and runs
              CAS(head, oldHead, oldHead.next). Each operation is a single
              CAS. The problem is the ABA issue: if pop reads head A, is
              preempted, and in the meantime A is popped and then re-pushed,
              the CAS succeeds spuriously even though the structure has
              changed. Solutions use tagged pointers, hazard pointers, or
              epoch-based reclamation to detect the ABA case.
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
            Knuth, D.E. — <em>The Art of Computer Programming, Volume 1:
            Fundamental Algorithms</em>, Section 2.2.1 (Stacks, Queues,
            Deques) — the canonical early treatment.
          </li>
          <li>
            Dijkstra, E. — <em>Algol-60 Translation</em>, Mathematical
            Centre, 1961: the shunting-yard algorithm as the original
            practical application of stack-based expression evaluation.
          </li>
          <li>
            Treiber, R. K. — <em>Systems Programming: Coping with
            Parallelism</em>, IBM Research Report RJ 5118, 1986: the
            Treiber stack paper.
          </li>
          <li>
            Michael, M., Scott, M. — <em>Nonblocking Algorithms and
            Preemption-Safe Locking on Multiprogrammed Shared Memory
            Multiprocessors</em>, 1998: canonical treatment of lock-free
            stacks and queues with hazard-pointer reclamation.
          </li>
          <li>
            Sedgewick, R., Wayne, K. — <em>Algorithms</em>, 4th Edition,
            Addison-Wesley, Chapter 1.3 on bag, queue, and stack
            implementations with resizable-array analysis.
          </li>
          <li>
            V8 Blog — <em>Concurrent marking</em> and <em>Async stack
            traces</em>: how V8 manages the JavaScript execution stack,
            garbage collection interactions, and async frame linkage.
          </li>
          <li>
            Intel Corporation — <em>Intel 64 and IA-32 Architectures
            Software Developer&apos;s Manual</em>, Volume 1, Chapter 6 (Procedure
            Calls, Interrupts, and Exceptions) for the hardware stack
            conventions.
          </li>
          <li>
            Okasaki, C. — <em>Purely Functional Data Structures</em>,
            Cambridge University Press, 1998: persistent stacks and banker-
            queue amortized analysis that extends to immutable stack-based
            designs.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
