"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "linear-search",
  title: "Linear Search",
  description:
    "Linear Search — sequential O(n) scan. The default, cache-optimal, branchless-friendly search for small, unsorted, or streaming data.",
  category: "other",
  subcategory: "algorithms",
  slug: "linear-search",
  wordCount: 4600,
  readingTime: 23,
  lastUpdated: "2026-04-20",
  tags: ["linear-search", "search", "sequential", "simd", "streaming"],
  relatedTopics: ["binary-search", "jump-search", "hash-tables", "arrays"],
};

export default function LinearSearchArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          Linear Search scans a sequence from one end to the other, comparing each element to the
          target, returning the index of the first match or −1 if no match exists. It is the
          simplest search algorithm and the only one that works on arbitrary unsorted input without
          preprocessing. Time is Θ(n) worst case and Θ(n) expected for a uniformly random target
          position; best case is Θ(1) when the target is at the start. Space is Θ(1). No algorithm
          is simpler, and for sufficiently small n or cache-resident data, no algorithm is faster.
        </p>
        <p className="mb-4">
          The apparent triviality of linear search hides real engineering nuance. On modern CPUs,
          a tight linear scan of a cache-resident array runs at 10–50 GB/s — comparable to memory
          bandwidth. A binary search over the same data may be slower despite O(log n) asymptotic
          because of branch mispredictions and cache-line thrashing on small inputs. The rule of
          thumb &quot;linear for n &lt; 64, binary for n &gt; 64&quot; is workload-specific but worth internalizing:
          asymptotic analysis describes growth, not constants, and for small n the constants win.
        </p>
        <p className="mb-4">
          Linear search is the primitive behind every std::find, Array.indexOf, and list.index
          in mainstream standard libraries. It is also the foundation of SIMD-accelerated string
          search (strchr, memchr, strstr short-needle fast path), linked list traversal, and stream
          processing where data arrives one element at a time. The question &quot;is this value in the
          last 10k log lines?&quot; is linear search in its natural habitat — unsorted, streaming,
          cache-resident.
        </p>
        <p className="mb-4">
          Variants abound. Sentinel linear search eliminates the loop-bound check by placing the
          target at the end of the array; this saves one comparison per iteration and was a
          textbook optimization in the 1970s (less relevant today given branch prediction).
          Move-to-front self-organizing linear search relocates found elements to the front,
          exploiting temporal locality — the &quot;most recently used wins&quot; principle that drives
          browser history, LRU caches, and some compiler symbol tables. Branchless SIMD linear
          search compares 16–64 elements per instruction using vector registers, giving multi-GB/s
          throughput for short-array searches.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/linear-search-diagram-1.svg"
          alt="Linear search sequential scan comparing each element against target"
          caption="Sequential scan: compare, advance, compare, advance. Θ(n) worst case, Θ(1) best."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <h3 className="text-xl font-semibold mt-6 mb-3">Sequential access &amp; cache behavior</h3>
        <p className="mb-4">
          Linear search&apos;s killer feature is sequential memory access. Modern CPUs prefetch the
          next cache line while processing the current one, giving effectively 0-latency access
          to sequential data. On a 64-byte cache line, 16 int32 values are loaded per miss — a
          linear scan of 16 elements costs one memory access, not sixteen. This is why linear
          search on cache-resident arrays saturates memory bandwidth: the CPU is ahead of the
          data by hundreds of cycles.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Branch prediction &amp; the early-exit cost</h3>
        <p className="mb-4">
          The inner loop has two branches: &quot;done yet?&quot; (bounds check) and &quot;found it?&quot; (comparison).
          Branch predictors learn that both are usually not-taken, so the loop runs at nearly
          one iteration per cycle. The first mispredict is when the match is found — typically a
          single bubble of 15–20 cycles. For large arrays with early matches, the mispredict is
          dominant; for small arrays with no match, the loop unrolls cleanly. Branchless variants
          replace the comparison with arithmetic (e.g., sum of (arr[i] == target) · i) to avoid
          mispredicts entirely.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">SIMD acceleration</h3>
        <p className="mb-4">
          SSE2 (128-bit), AVX2 (256-bit), and AVX-512 (512-bit) vector instructions let a single
          instruction compare 4, 8, or 16 int32s against target. The implementation: broadcast
          target to a vector register, PCMPEQD against each loaded cache line, PMOVMSKB to
          extract a bitmask of matches, and BSF/TZCNT to find the first match. This gives ~10×
          speedup over scalar linear search. libc&apos;s memchr, strchr, and glibc&apos;s strstr all use
          this pattern. Java&apos;s HotSpot auto-vectorizes simple linear search loops; C/C++
          compilers with -O3 do so when loop bounds are clear.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Self-organizing variants</h3>
        <p className="mb-4">
          If queries are non-uniform (e.g., 80% hit the same 20% of elements — Zipf&apos;s law),
          moving found elements closer to the front reduces average search cost. Move-to-front
          makes expected search O(H), where H is the entropy of the query distribution. It
          matches optimal static ordering within a factor of 2 and adapts online. Transposition
          (swap found element with its predecessor) is more conservative. Both are used in
          interpreter symbol tables, LRU metadata, and network routing caches.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/linear-search-diagram-2.svg"
          alt="SIMD linear search comparing 8 elements per AVX2 instruction"
          caption="SIMD: broadcast target, PCMPEQ over 8 elements/cycle, extract match bitmask. ~10× scalar throughput."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          A production linear search has four tiers. For n &lt; 4, unroll the loop completely (no
          branch overhead). For 4 ≤ n &lt; 32, scalar loop with loop-invariant target in register.
          For 32 ≤ n &lt; 10M, SIMD vectorized loop with 4–8× unrolling. For n &gt; 10M, prefetching
          hints (PREFETCHT0 on lines 512 bytes ahead) plus SIMD. Glibc&apos;s memchr follows roughly
          this structure, with different code paths triggered by compile-time length hints.
        </p>
        <p className="mb-4">
          Parallel linear search splits the array across threads, each scanning their chunk. Early
          termination is subtle: the first thread to find a match must signal others to stop. Naive
          implementations poll a shared atomic flag every iteration, causing cache-line ping-pong.
          Better: each thread polls every K iterations (K ≈ 256) or uses work-stealing so idle
          threads take unclaimed chunks. OpenMP&apos;s parallel_find and C++17&apos;s std::find with
          execution::par use this pattern, getting near-linear scaling up to memory-bandwidth limits.
        </p>
        <p className="mb-4">
          Distributed linear search is a broadcast-and-collect: every node scans its partition, the
          first hit wins (lowest-rank node with a match, by convention). Spark&apos;s rdd.filter().first()
          is exactly this when no indexing is available. For streaming data (Kafka topic, Flink
          stream), linear search is the only option without pre-built indices — each incoming
          record is compared, matches fan out to downstream consumers.
        </p>
        <p className="mb-4">
          Hardware-accelerated linear search appears in CPU microcode (REPNE SCASB on x86,
          specialized CISC-era instructions), FPGA designs for network intrusion detection (Snort
          rules scan packets linearly at line rate), and content-addressable memory (CAM) chips in
          routing silicon that perform parallel linear comparison in one clock.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <h3 className="text-xl font-semibold mt-6 mb-3">vs. Binary Search</h3>
        <p className="mb-4">
          Binary search is O(log n) but requires sorted input. Linear is O(n) on any input. For
          small n (&lt; 64) or cache-resident arrays, linear is faster in practice because of branch
          prediction and prefetching. For n &gt; 1000 with sorted data, binary wins definitively.
          Rule: if you pay for sorting once and query many times, binary; if you query once or data
          mutates often, linear.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">vs. Hash Table Lookup</h3>
        <p className="mb-4">
          Hash tables are O(1) expected but require O(n) space and hashing overhead. Linear search
          is O(n) but has zero setup cost. For n &lt; 16–32 distinct keys, linear search beats hash
          lookup because the hash computation itself costs 15–20 cycles — more than scanning the
          array. Small-array-optimized hash maps (absl::flat_hash_set, Rust&apos;s SmallMap) fall back
          to linear search below a size threshold.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">vs. Tree Lookup</h3>
        <p className="mb-4">
          Trees (BST, B-tree) give O(log n) with O(n) space and O(log n) insert. Linear on an
          array is faster for small n because tree nodes scatter across cache. For n = 32
          elements, linear scan is ~3× faster than std::set lookup despite same asymptotic.
          B-trees with wide fanout (128+) counter this on-disk by amortizing a node load across
          many comparisons.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">When not to use linear</h3>
        <p className="mb-4">
          For random-access queries on sorted data of size &gt; 1000, binary or interpolation search
          is better. For repeated lookups on mutable data, hash tables or balanced trees are
          better. Linear search is the wrong choice when (a) you query the same dataset many
          times, (b) the dataset is large, and (c) preprocessing is affordable.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Default to linear for n &lt; 64</strong> on cache-resident data. Binary&apos;s O(log n) advantage is swamped by branch mispredicts.</li>
          <li><strong>Let the compiler autovectorize</strong> — simple <code>for</code> loops with fixed-size loads become SIMD with -O3.</li>
          <li><strong>Keep target in a register</strong> by loop-invariant code motion; don&apos;t recompute on each iteration.</li>
          <li><strong>For streaming data, linear is the default</strong> — no preprocessing possible.</li>
          <li><strong>Move-to-front or sort by frequency</strong> when queries follow Zipf&apos;s law — average-case gain is large.</li>
          <li><strong>Branchless variants</strong> for unpredictable data: compute hit as (arr[i] == target), accumulate.</li>
          <li><strong>SIMD for n &gt; 32</strong> when writing low-level code — memchr/strchr already do this.</li>
          <li><strong>Parallel scan</strong> for n &gt; 10M with early termination via polled atomic flag (poll every 256 iterations).</li>
          <li><strong>Never use linear on large static sorted data</strong> — build an index once, pay O(log n) forever.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Using linear on large sorted data</strong> where binary is trivially applicable — quadratic time in n queries.</li>
          <li><strong>Off-by-one bounds</strong>: <code>i &lt;= n</code> vs <code>i &lt; n</code>, especially with sentinels.</li>
          <li><strong>Branch-prediction regressions</strong> on random data — consider branchless.</li>
          <li><strong>Not short-circuiting on first match</strong> when uniqueness is assumed — wasted work.</li>
          <li><strong>Re-scanning the same dataset repeatedly</strong> instead of building an index — O(Q·n) total when O(n + Q log n) is available.</li>
          <li><strong>Parallel scan without early-exit signal</strong> → threads keep working after match found, wasting CPU.</li>
          <li><strong>Floating-point comparison with ==</strong>: use epsilon tolerance when semantically matching equivalent floats.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <strong>libc memchr / strchr</strong>: linear byte search accelerated by SIMD. The
          foundation of every string operation on Linux, Windows, and macOS — called billions of
          times per second in web servers, databases, and file systems.
        </p>
        <p className="mb-4">
          <strong>std::find, Array.indexOf, list.index</strong>: standard library default. Small-n
          search for dictionary keys, enum values, configuration lookup. Billion-call-per-second
          scale.
        </p>
        <p className="mb-4">
          <strong>Intrusion detection (Snort, Suricata)</strong>: match packet payload against
          thousands of signatures using Aho-Corasick (generalized linear search across patterns)
          on hardware at 10+ Gbps.
        </p>
        <p className="mb-4">
          <strong>Log search (grep, rg, journalctl)</strong>: linear scan of log files with SIMD.
          Ripgrep uses Teddy (SIMD multi-pattern matching) built on linear search primitives.
        </p>
        <p className="mb-4">
          <strong>Small LRU caches</strong>: linked-list caches of size 8–32 use linear scan to
          find entries. CPU TLBs, branch target buffers, and call-stack unwinding tables are
          essentially hardware linear searches.
        </p>
        <p className="mb-4">
          <strong>Compiler symbol tables (local scope)</strong>: gcc and clang use linear search
          for local variable lookup in small functions; only switch to hash-based lookup when
          scope size grows past ~16.
        </p>
        <p className="mb-4">
          <strong>Distributed batch search</strong>: Spark&apos;s rdd.filter when data is unsorted.
          Kafka Streams filter operations. ElasticSearch&apos;s initial linear scan before building
          inverted indices.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/linear-search-diagram-3.svg"
          alt="Crossover point where binary search beats linear search considering constants"
          caption="Crossover: linear beats binary for n &lt; ~64 due to branch prediction and prefetching; binary wins above."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li><strong>Implement linear search.</strong> Loop with early exit on match; return index or −1.</li>
          <li><strong>When is linear faster than binary?</strong> Small n (&lt; 64), unsorted data, cache-resident, mutable.</li>
          <li><strong>How does SIMD accelerate linear search?</strong> Compare 4–16 elements per instruction via broadcast + PCMPEQ + bitmask.</li>
          <li><strong>Self-organizing linear search.</strong> Move-to-front on hit; adapts to query distribution; O(H) expected where H = distribution entropy.</li>
          <li><strong>Find first and last occurrence in unsorted array.</strong> Two linear scans or one scan tracking both indices.</li>
          <li><strong>Parallelize linear search.</strong> Partition array; threads scan chunks; first match wins via atomic flag polled periodically.</li>
          <li><strong>Why can branchless linear search be faster?</strong> Avoids mispredict penalty on unpredictable data; constant-time per iteration.</li>
          <li><strong>Given a stream, find the first element matching a predicate.</strong> Linear is required — no preprocessing possible.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>CLRS Chapter 2.1 — linear search as the canonical introduction.</li>
          <li>Knuth TAOCP Vol. 3, §6.1 — sequential search analysis including self-organizing variants.</li>
          <li>Agner Fog, <em>Optimizing Subroutines in Assembly Language</em> — SIMD linear search patterns.</li>
          <li>glibc source: <code>string/memchr.c</code> and AVX2 variants.</li>
          <li>Sleator &amp; Tarjan, &quot;Amortized Efficiency of List Update Rules&quot; (1985) — move-to-front analysis.</li>
          <li>Ripgrep internals blog — SIMD multi-pattern linear search for log grepping.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
