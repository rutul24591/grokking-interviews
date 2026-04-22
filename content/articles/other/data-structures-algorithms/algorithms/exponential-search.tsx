"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "exponential-search",
  title: "Exponential Search",
  description:
    "Exponential Search — doubling-bracket then binary search. O(log i) for unbounded sorted streams and arrays where the target is near the start.",
  category: "other",
  subcategory: "algorithms",
  slug: "exponential-search",
  wordCount: 4400,
  readingTime: 22,
  lastUpdated: "2026-04-20",
  tags: ["exponential-search", "galloping", "unbounded-search", "search"],
  relatedTopics: ["binary-search", "jump-search", "interpolation-search", "timsort"],
};

export default function ExponentialSearchArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          Exponential Search (also called doubling search, galloping search, or Struzik search)
          locates a target in a sorted sequence by first identifying a bracketing range through
          exponentially growing probes (indices 1, 2, 4, 8, 16, ...), then performing a binary
          search within that range. If the target is at position i, exponential search finds it in
          Θ(log i) comparisons — strictly better than binary search&rsquo;s Θ(log n) when the
          target is near the start, and asymptotically identical when it is not.
        </p>
        <p className="mb-4">
          Its primary use cases are two scenarios binary search cannot handle directly:
          <span className="font-semibold"> unbounded or infinite sorted sequences</span> (where n
          is unknown), and <span className="font-semibold">skewed-position queries</span> where
          the target is expected near the start. It underpins the &ldquo;galloping mode&rdquo; of
          Timsort&rsquo;s merge phase, where one run advances rapidly through another when runs
          are highly uneven in length.
        </p>
        <p className="mb-4">
          The algorithm resolves a real limitation: classic binary search requires lo and hi to be
          known up front. Exponential search decouples the two halves: first find hi cheaply, then
          binary-search. For infinite streams (&ldquo;is this key in this ever-growing sorted
          file?&rdquo;), exponential search reduces an impossible binary search into a well-
          defined log-time operation.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p className="mb-4">
          The algorithm has two phases. Phase 1 (<span className="font-semibold">gallop</span>):
          start at index 1 and double until a[i] &gt; target or i ≥ n. Let i* be the first such
          index. Phase 2 (<span className="font-semibold">binary search</span>): binary-search
          the range [i*/2, min(i*, n) − 1], which is known to contain the target if it exists.
        </p>
        <p className="mb-4">
          Complexity: if the target is at position p, phase 1 makes ⌈log₂(p + 1)⌉ probes to find
          i* ≤ 2p. Phase 2 binary-searches a range of size at most p, costing another log₂ p
          comparisons. Total Θ(log p). When p = n − 1, this matches binary search&rsquo;s Θ(log n);
          when p is small, it dominates binary search.
        </p>
        <p className="mb-4">
          The key invariant after phase 1: if the target exists, it lies in [i/2, min(i, n)). The
          lower bound holds because the previous probe i/2 had a[i/2] ≤ target (that&rsquo;s why
          we doubled). The upper bound holds because the current probe failed — either a[i] &gt;
          target or we ran past the end. Phase 2 exploits this invariant directly.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/exponential-search-diagram-1.svg"
          alt="Exponential search trace showing doubling probes followed by binary search"
          caption="Target at index 13: probes at 1, 2, 4, 8, 16 bracket the range [8, 16); final binary search finds it in 3 more comparisons."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          Implementation starts with the boundary check a[0] == target to handle the trivial case.
          Then i = 1 and the doubling loop: while i &lt; n and a[i] ≤ target, i *= 2. After the
          loop, perform binary_search(a, i/2, min(i, n) − 1, target). The choice of ≤ vs &lt; in the
          loop test is subtle: ≤ lets the loop continue past an exact match, which is fine since
          the binary search will still find it in the bracketed range. Using &lt; would early-exit
          on match, requiring an extra check.
        </p>
        <p className="mb-4">
          For infinite or streamed arrays, the a[i] access may need to fetch or compute the
          element — the bounds check i &lt; n is replaced with a sentinel or EOF detection. If the
          data structure is a lazy sequence (Kotlin/Java Stream, Python iterator), exponential
          search must materialize up to i* elements. This is a real cost; if the target position
          is expected to be at position p, you pay O(p) memory to gallop there, even though you
          compare only log p times.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/exponential-search-diagram-2.svg"
          alt="Exponential search two-phase flow with galloping then binary search"
          caption="Phase 1 galloping doubles the bound until overshoot. Phase 2 runs standard binary search on the narrow bracket. Total Θ(log i)."
        />
        <p className="mb-4">
          The algorithm generalizes to Timsort&rsquo;s <span className="font-semibold">adaptive
          galloping merge</span>: when one run repeatedly wins the merge comparison, Timsort
          switches from one-at-a-time merging to exponential search for the insertion point of the
          losing-run element into the winning run. This converts O(n + m) merges of highly uneven
          runs into O(m log n), a dramatic speedup on nearly-sorted data.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p className="mb-4">
          <span className="font-semibold">vs Binary Search:</span> identical on uniform random
          targets (both Θ(log n)). Exponential wins when the target is likely early. Binary wins
          when n is known and the distribution is uniform, because it avoids the doubling phase&rsquo;s
          constant-factor overhead.
        </p>
        <p className="mb-4">
          <span className="font-semibold">vs Jump Search:</span> Θ(log n) vs Θ(√n). Exponential
          wins asymptotically. Jump wins only when the access cost model strongly penalizes
          log-pattern access (rare in practice).
        </p>
        <p className="mb-4">
          <span className="font-semibold">vs Interpolation Search:</span> exponential has the
          stable Θ(log n) guarantee. Interpolation achieves Θ(log log n) on uniform data but
          degrades to Θ(n) on skewed data. For unbounded data, exponential is the default;
          interpolation requires knowing the value distribution, which streams usually lack.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Galloping vs linear merge:</span> inside Timsort,
          galloping is triggered only after MIN_GALLOP (default 7) consecutive wins, and is
          abandoned when it stops paying off. The adaptive switch matters: galloping on balanced
          runs is slower than linear merge due to binary-search overhead, so the heuristic turns
          it on only when data skew makes it profitable.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p className="mb-4">
          Use exponential search as the default for <span className="font-semibold">any
          unbounded or unknown-size sorted sequence</span>. It is the cleanest way to handle
          &ldquo;search a stream&rdquo; or &ldquo;search a growing file&rdquo; without materializing
          the length. For known-size arrays where targets are uniformly distributed, stick with
          plain binary search — the doubling phase adds constant overhead for no gain.
        </p>
        <p className="mb-4">
          Profile your workload. If queries cluster near the start (recent log entries, small-key
          sorted indexes), exponential search can be measurably faster than binary — not
          asymptotically, just by constants. Conversely, if queries are uniformly distributed,
          the doubling cost is pure overhead.
        </p>
        <p className="mb-4">
          When implementing from scratch, reuse your binary search routine for phase 2 — do not
          re-derive lower_bound bounds. The narrow [i/2, min(i, n)) range plus an existing tested
          binary search gives a simple and correct implementation. Custom phase-2 code is where
          off-by-one bugs hide.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p className="mb-4">
          <span className="font-semibold">Overflow on doubling:</span> in 32-bit code, i *= 2
          overflows at 2³¹. Use 64-bit indices or explicit overflow check i &gt; n/2.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Wrong bracket bounds:</span> the lower bound is i/2, not
          i/2 + 1 — the target could equal a[i/2] itself. The upper bound is min(i, n) − 1
          (inclusive) or min(i, n) (exclusive with half-open convention). Mixing conventions
          silently misses boundary elements.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Galloping on balanced data:</span> inside a custom merge
          algorithm, unconditionally galloping is slower than linear merge. Timsort&rsquo;s
          MIN_GALLOP threshold (start at 7, adapt) exists to avoid this trap.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Treating exponential search as &ldquo;always
          faster&rdquo;:</span> it is faster only when the target is near the start or n is
          unknown. For uniformly distributed targets in a known array, it is strictly slower than
          binary search by a small constant.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <span className="font-semibold">Timsort galloping merge:</span> Python&rsquo;s
          list.sort, Java&rsquo;s Arrays.sort for objects, Android&rsquo;s sort routines. When
          merging two runs and one is dominating, exponential search locates the insertion point
          for the losing element into the winning run in Θ(log k) instead of Θ(k).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Powerset/Struzik search in information retrieval:</span>
          when intersecting two sorted postings lists of very different sizes (common in search
          engines with skewed term frequencies), exponential search through the longer list is
          faster than zipper merge. Lucene uses a variant called &ldquo;skip lists&rdquo; for the
          same purpose.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Growing file search:</span> when searching a sorted
          log file that is currently being appended, the length is fluid. Exponential search
          reads the file exponentially until a read past EOF, then binary-searches the bracket —
          no upfront stat() required.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Database predicate evaluation:</span> when filtering a
          large sorted index for a predicate expected to match near the start (recent data by
          timestamp), exponential search minimizes probes. Many index formats use this pattern
          implicitly via skip-lists or B-tree sibling pointers.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/exponential-search-diagram-3.svg"
          alt="Timsort galloping merge using exponential search"
          caption="Timsort&rsquo;s galloping: when run A dominates, exponentially probe into B to find insertion point, then binary-search. Turns linear merge into log-time skip."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p className="mb-4">
          <span className="font-semibold">Search in an infinite sorted array.</span> Classic
          exponential search question. Double until a[i] &gt; target (or out-of-bounds exception),
          then binary search [i/2, i]. Time Θ(log p) where p is target position.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Why exponential, not linear probing?</span> Linear
          probing to find the bracket is Θ(p), making the total Θ(p) — no better than linear
          search. Exponential makes phase 1 Θ(log p), matching phase 2.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Why doubling (×2) specifically?</span> Any constant base
          &gt; 1 gives Θ(log p). Base 2 minimizes constant factor under uniform cost; base 3 means
          fewer probes but a wider bracket. In practice, base 2 is the clear default.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Describe Timsort&rsquo;s galloping mode.</span> Mention
          MIN_GALLOP, adaptive threshold that increases on balanced runs and decreases on skewed
          runs, and the Θ(log k) cost of each galloping step. Senior interviews will drill into
          this if you claim production experience with Timsort.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Jon Bentley &amp; Andrew Yao, &ldquo;An almost optimal algorithm for unbounded searching&rdquo; (1976) — original formulation.</li>
          <li>Leonid Struzik, &ldquo;Powerset Search&rdquo; — galloping search for posting list intersection.</li>
          <li>Tim Peters, listsort.txt — https://github.com/python/cpython/blob/main/Objects/listsort.txt — Timsort galloping design notes.</li>
          <li>Knuth, TAOCP Vol 3, §6.2.1 — binary search and variants.</li>
          <li>Lucene skip list documentation — https://lucene.apache.org/core/ — production use in posting list intersection.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
