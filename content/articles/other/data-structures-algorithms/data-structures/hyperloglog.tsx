"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "hyperloglog",
  title: "HyperLogLog",
  description: "A cardinality estimator that counts billions of distinct items in kilobytes — leading-zero registers and harmonic mean deliver ~1% accuracy at fixed memory, mergeable across shards.",
  category: "other",
  subcategory: "data-structures",
  slug: "hyperloglog",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-04-18",
  tags: ["hyperloglog", "hll", "cardinality", "probabilistic", "data-structures"],
  relatedTopics: ["bloom-filters", "count-min-sketch", "hash-tables"],
};

export default function HyperLogLogArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition & Context</h2>
        <p className="mb-4">
          HyperLogLog (HLL) is a probabilistic data structure that estimates the cardinality (number of distinct elements) of a multiset using sublinear memory. It uses an array of m small registers (typically 6 bits each) to track the maximum number of leading zeros in the hashes of items routed to each register. The estimator combines all m registers via a harmonic mean to produce a cardinality estimate with standard error ≈ 1.04 / √m.
        </p>
        <p className="mb-4">
          Philippe Flajolet and his collaborators developed the algorithm in 2007, building on the earlier LogLog (2003) and Probabilistic Counting (1985) work. The progression refined the estimator from O(log log n) memory with ~30% error to ~1% error at the same asymptotic memory. Google&apos;s HyperLogLog++ (2013) added engineering refinements — sparse representation, 64-bit hashes, empirical bias correction — that are now the production standard.
        </p>
        <p>
          HLL is the canonical structure for &quot;count distinct&quot; queries at scale. Redis PFCOUNT, Presto&apos;s approx_distinct, BigQuery&apos;s APPROX_COUNT_DISTINCT, Snowflake&apos;s HLL functions, Cassandra&apos;s nodetool, and Druid&apos;s HLL columns all use it. Counting billions of unique users, IPs, or events with kilobytes of memory and the ability to merge counts across machines is the killer feature.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>
        <p className="mb-4">
          The intuition starts with a single observation: if you hash items uniformly to bit strings, the probability that a given hash starts with k zeros is 2⁻ᵏ. So if you&apos;ve seen any hash with k leading zeros, you&apos;ve probably drawn at least 2ᵏ samples. Tracking the maximum leading-zero count gives a rough cardinality estimate — but with high variance, since one lucky early zero pattern can wildly inflate the estimate.
        </p>
        <p className="mb-4">
          To reduce variance, HLL uses <strong>stochastic averaging</strong>: split the hash into two parts. The first p bits select one of m = 2ᵖ buckets (registers); the remaining bits provide the leading-zero count. Each bucket independently runs the leading-zero estimator. With m independent estimators, averaging cuts the standard error by √m.
        </p>
        <p className="mb-4">
          The combination is not arithmetic mean but <strong>harmonic mean</strong>: n̂ = α_m · m² / Σ 2⁻ᴹ⁽ⁱ⁾, where M(i) is the i-th register and α_m is a small bias-correction constant. The harmonic mean suppresses the dominating effect of a single large register, giving the lowest variance of any of the simple averaging schemes Flajolet evaluated.
        </p>
        <p>
          For very small cardinalities (most registers still 0), the HLL estimator is biased; the standard fix is <strong>linear counting</strong> in this regime: estimate from the count of empty registers via n̂ = m · ln(m / empty_count). Production systems switch between linear counting and HLL based on the fraction of empty registers. At the high-cardinality end, 32-bit hashes saturate at ~2³² distinct items; HLL++ uses 64-bit hashes to push the practical limit past 2⁵⁰.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/hyperloglog-diagram-1.svg"
          alt="HyperLogLog hashing user42 to a 64 bit hash splitting first 8 bits as register index 44 and storing leading zero count from remaining bits"
          caption="Figure 1: Hash the element. The first p bits select a register; the leading-zero count of the remaining bits updates that register&apos;s max."
        />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture & Flow</h2>
        <p className="mb-4">
          A standard HLL is just an array of m 6-bit registers. m is typically 2⁸ to 2¹⁶ — Redis defaults to m = 16384 (12KB). Six bits hold leading-zero counts up to 63, which is plenty for any 64-bit hash. Total memory: m · 6 bits, regardless of how many distinct items you insert.
        </p>
        <p className="mb-4">
          <strong>Insert(x):</strong> compute h = hash(x). Use the first p bits as the register index i; the remaining bits contribute leading-zero count + 1 (the +1 is conventional). Set register[i] = max(register[i], leading_zeros + 1). Operation cost: one hash + one compare-and-write. O(1) per insert, regardless of cardinality.
        </p>
        <p className="mb-4">
          <strong>Count():</strong> compute the raw HLL estimate n̂ = α_m · m² / Σ 2⁻ᴹ⁽ⁱ⁾. If n̂ &lt; 2.5m and there are empty registers, switch to linear counting. If n̂ exceeds 2³² / 30 (for 32-bit hashes), apply a large-cardinality correction. With 64-bit hashes (HLL++), the upper correction is rarely needed.
        </p>
        <p className="mb-4">
          <strong>Mergeable across shards.</strong> Two HLLs with the same m and hash function can be merged element-wise: merged[i] = max(a[i], b[i]). The merged HLL is exactly what you&apos;d get by inserting both streams into a single HLL — no error introduced by the merge. This is the property that makes HLL the universal &quot;count distinct&quot; primitive in distributed systems: every shard maintains a local HLL, the coordinator merges, and the global cardinality estimate falls out at zero coordination cost.
        </p>
        <p>
          <strong>Sparse representation.</strong> When few registers are non-zero, storing the full m-register array wastes memory. HLL++ uses a sparse encoding (a sorted list of (index, value) pairs) until enough registers fill in to make dense representation cheaper. Redis switches representations transparently. This makes HLL viable even when most counters track tiny streams (per-user distinct sessions, per-URL unique visitors).
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/hyperloglog-diagram-2.svg"
          alt="HyperLogLog stream routing four hashes into different buckets each updating a register with the maximum leading zero count and the harmonic mean estimator combining them"
          caption="Figure 2: Each hash routes to one of m buckets via its first p bits. Per-bucket maxima are combined via harmonic mean — variance reduction by √m."
        />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Trade-offs & Comparisons</h2>
        <p className="mb-4">
          <strong>HLL vs exact distinct count.</strong> Exact requires storing the entire set (or a hash-set fingerprint of it) — O(distinct items) memory. HLL is O(log log n) memory, fixed up front. For 1B uniques: exact ~30GB hash set vs HLL ~12KB. The trade-off is ~1% error.
        </p>
        <p className="mb-4">
          <strong>HLL vs Bloom filter.</strong> Different problems. Bloom answers &quot;is x in the set?&quot; (membership); HLL answers &quot;how many distinct x?&quot; (cardinality). Both are sketches over streams, but they don&apos;t replace each other.
        </p>
        <p className="mb-4">
          <strong>HLL vs count-min sketch.</strong> Different problems. Count-min estimates per-item frequency (&quot;how many times have I seen X?&quot;); HLL estimates total distinct count. They&apos;re complementary — analytics queries often use both.
        </p>
        <p className="mb-4">
          <strong>HLL vs LinearCounting / LogLog / HLL++.</strong> LinearCounting is exact-ish for small cardinalities (uses a bit array). LogLog (Durand-Flajolet 2003) was the predecessor with arithmetic mean and ~30% error. HLL improved this to ~1% via harmonic mean. HLL++ (Google 2013) is the production standard: sparse encoding for small cardinalities, 64-bit hashes for large, and empirical bias correction tables.
        </p>
        <p>
          <strong>HLL vs MinHash.</strong> MinHash estimates the Jaccard similarity between two sets (and from there, set sizes). HLL estimates a single set&apos;s cardinality. MinHash is more general (supports similarity), HLL is more memory-efficient for the cardinality-only use case.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Use HLL++ over plain HLL.</strong> The Google enhancements (sparse encoding, 64-bit hashes, bias correction) are strict improvements — there&apos;s no reason to use the original variant in new code.</li>
          <li><strong>Pick m by accuracy budget.</strong> m = 2¹² gives ~1.6% error in 3KB; m = 2¹⁴ (Redis default) gives ~0.81% in 12KB; m = 2¹⁸ gives ~0.20% in 192KB. Doubling m halves error and doubles memory.</li>
          <li><strong>Use a 64-bit hash.</strong> 32-bit hashes saturate around 2³² distinct items (collisions become common). MurmurHash3-64, xxHash64, or SipHash with 64-bit output is the minimum.</li>
          <li><strong>Exploit mergeability.</strong> Compute per-shard HLLs and merge centrally. Don&apos;t ship raw streams just to centralize counting — that defeats the entire point.</li>
          <li><strong>Use the same hash family across systems.</strong> Two HLLs can only be merged if they used the same hash function. Standardize early.</li>
          <li><strong>Switch to linear counting in the small regime.</strong> The HLL estimator is biased for small cardinalities. Production implementations all use linear counting below ~2.5m.</li>
          <li><strong>Pre-allocate dense arrays for hot HLLs.</strong> Sparse → dense conversion is cheap but adds latency on first insert. For known-large HLLs, allocate dense from the start.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Confusing cardinality with frequency.</strong> HLL counts distinct items. It does not tell you how many times any particular item appeared. If you need frequencies, use count-min sketch.</li>
          <li><strong>Mismatched hash functions when merging.</strong> Two HLLs built with different hashes cannot be merged correctly — silent corruption with no error indication.</li>
          <li><strong>Using a 32-bit hash for high-cardinality streams.</strong> Hash collisions in the &gt;2³⁰ range bias the estimate downward. Always use 64-bit for high-cardinality work.</li>
          <li><strong>Treating the estimate as exact.</strong> ~1% error means a billion-cardinality count is ±10M. Downstream logic must handle this — don&apos;t use HLL when exact accounting is required (billing, financial reporting).</li>
          <li><strong>Cardinality of intersections.</strong> HLL doesn&apos;t directly support set intersection. The inclusion-exclusion approximation |A ∩ B| ≈ |A| + |B| − |A ∪ B| compounds errors and can produce negative results. Use MinHash or k-MinValues for similarity.</li>
          <li><strong>Counting non-stationary streams without windowing.</strong> Plain HLL never forgets. To count distinct items in the last hour, use sliding-window HLL or replace HLLs periodically.</li>
          <li><strong>Misusing for tiny cardinalities.</strong> For sets &lt; ~100 distinct items, an exact hash set uses comparable memory and gives exact answers. Use HLL when the estimated cardinality is at least in the thousands.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>
        <p className="mb-4">
          <strong>Analytics &quot;count distinct&quot; queries.</strong> BigQuery&apos;s APPROX_COUNT_DISTINCT, Presto&apos;s approx_distinct, Snowflake&apos;s HLL functions, Redshift&apos;s APPROXIMATE COUNT(DISTINCT), ClickHouse&apos;s uniqHLL12, and Druid&apos;s HLL columns all back the &quot;how many unique X?&quot; query primitive. For dashboards over billions of rows, HLL is 100–1000× faster and more memory-efficient than exact distinct counting.
        </p>
        <p className="mb-4">
          <strong>Redis PFADD/PFCOUNT/PFMERGE.</strong> Redis exposes HLL as a first-class type (PF = Philippe Flajolet). PFADD inserts; PFCOUNT estimates cardinality; PFMERGE combines multiple HLLs. Each Redis HLL uses 12KB regardless of cardinality. Common use: per-page unique-visitor counts, per-event distinct-user counts.
        </p>
        <p className="mb-4">
          <strong>Web analytics.</strong> Google Analytics, Mixpanel, and Amplitude use HLL variants to compute unique users / sessions / pageviews over arbitrary time ranges. Per-day HLLs are stored; queries merge HLLs across the requested range. Storing exact unique-user lists at scale is infeasible; HLL makes it tractable.
        </p>
        <p className="mb-4">
          <strong>Network monitoring.</strong> &quot;How many unique source IPs hit this endpoint in the last 5 minutes?&quot; — HLL makes this O(packets) ingestion at fixed memory. Used in DDoS detection, anomaly detection, and traffic accounting.
        </p>
        <p>
          <strong>Database query optimization.</strong> Postgres, MySQL, and similar systems use HLL (or HLL-like sketches) to estimate column cardinality for query planning. Knowing &quot;this column has ~1M distinct values&quot; informs index selection and join order without requiring exact statistics.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/hyperloglog-diagram-3.svg"
          alt="Standard error curve plotted against register count showing 1.04 over square root m relationship with annotations for 256 16384 and 65536 register configurations"
          caption="Figure 3: Standard error ≈ 1.04 / √m. Redis&apos;s default m=16384 gives ~0.81% error in 12KB — counts up to 2⁶⁴ uniques."
        />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does HyperLogLog estimate cardinality from leading zeros?</p>
            <p className="mt-2 text-sm">A: For uniformly random hashes, the probability of seeing k leading zeros is 2⁻ᵏ. So if the maximum leading-zero count observed is k, the stream probably contains ≈ 2ᵏ distinct items (otherwise that pattern would be unlikely). To reduce variance, HLL splits items across m buckets via the first hash bits, applies the estimator independently per bucket, and combines via harmonic mean — bringing standard error down to ≈ 1.04 / √m.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why harmonic mean and not arithmetic mean?</p>
            <p className="mt-2 text-sm">A: The estimator value 2^M(i) is exponential in the register, so a single large register dominates an arithmetic mean — high variance. Harmonic mean gives small values more weight, suppressing this dominance. Empirically and theoretically (Flajolet 2007), harmonic mean produces the lowest-variance estimator among the simple averaging schemes considered.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you count unique visitors across many web servers?</p>
            <p className="mt-2 text-sm">A: Each server maintains a local HyperLogLog (same m and same hash function). Periodically — or on demand — a coordinator pulls each HLL and merges them via element-wise max. The resulting HLL is exactly what you&apos;d get by sending all visits to a single HLL. No coordination, no duplicate counting, fixed memory per server. This is HLL&apos;s killer property for distributed systems.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the memory cost of HLL at various accuracies?</p>
            <p className="mt-2 text-sm">A: m = 2¹² registers → ~1.6% standard error in 3KB. m = 2¹⁴ (Redis default) → ~0.81% error in 12KB. m = 2¹⁶ → ~0.41% error in 48KB. Doubling m halves error and doubles memory. The killer feature: memory is independent of cardinality — 12KB counts both 1000 and 1 billion uniques.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Can you use HLL to estimate set intersection?</p>
            <p className="mt-2 text-sm">A: Only via inclusion-exclusion: |A ∩ B| ≈ |A| + |B| − |A ∪ B|, where the union is computed by merging HLLs. This compounds the error of three estimates and can produce negative results when intersections are small relative to the sets. For similarity / intersection at scale, use MinHash or k-MinValues sketches, which are designed for it.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why does HLL switch to linear counting for small cardinalities?</p>
            <p className="mt-2 text-sm">A: When most registers are still 0, the HLL estimator is biased downward (the leading-zero signal hasn&apos;t developed). Linear counting estimates n̂ = m · ln(m / empty_count), which is unbiased and accurate in this regime. Production HLL implementations switch between the two estimators based on the fraction of empty registers — typically using linear counting below n̂ ≈ 2.5m.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">References & Further Reading</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Flajolet, Fusy, Gandouet, Meunier — &quot;HyperLogLog: the analysis of a near-optimal cardinality estimation algorithm&quot; (AofA 2007), the canonical paper</li>
          <li>Heule, Nunkesser, Hall — &quot;HyperLogLog in Practice: Algorithmic Engineering of a State-of-The-Art Cardinality Estimation Algorithm&quot; (Google, EDBT 2013), HLL++</li>
          <li>Durand, Flajolet — &quot;LogLog Counting of Large Cardinalities&quot; (ESA 2003), the LogLog predecessor</li>
          <li>Whang, Vander-Zanden, Taylor — &quot;A Linear-Time Probabilistic Counting Algorithm for Database Applications&quot; (TODS 1990), linear counting</li>
          <li>Flajolet, Martin — &quot;Probabilistic Counting Algorithms for Data Base Applications&quot; (JCSS 1985), the original idea</li>
          <li>Redis HyperLogLog source — <code>src/hyperloglog.c</code> (production implementation with sparse encoding)</li>
          <li>Apache DataSketches — open-source HLL implementations across many languages</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
