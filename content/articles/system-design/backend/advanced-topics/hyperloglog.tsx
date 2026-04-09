"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-advanced-topics-hyperloglog",
  title: "HyperLogLog",
  description:
    "Staff-level deep dive into HyperLogLog: probabilistic cardinality estimation, hash-based bucketing, bias correction, space efficiency, and production-scale distinct counting patterns.",
  category: "backend",
  subcategory: "advanced-topics",
  slug: "hyperloglog",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-08",
  tags: ["backend", "hyperloglog", "probabilistic", "cardinality", "distinct-counting", "analytics"],
  relatedTopics: ["bloom-filters", "count-min-sketch", "time-series-optimization", "tail-latency"],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/advanced-topics";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>HyperLogLog</strong> (HLL) is a probabilistic data structure that estimates
          the number of distinct elements (cardinality) in a dataset using a fixed amount of
          memory. Unlike exact counting, which requires storing every unique element (consuming
          memory proportional to the number of distinct elements), HyperLogLog uses a small,
          fixed-size register array (typically 1-12 KB) to estimate cardinality with a known
          error bound (typically 1-2%). This makes it possible to count billions of distinct
          elements using only a few kilobytes of memory.
        </p>
        <p>
          Consider a web analytics platform that needs to count the number of unique daily
          visitors (distinct IP addresses or user IDs) across a global user base of 500 million
          users. An exact count using a hash set would require storing all 500 million unique
          identifiers, consuming approximately 16 GB of memory (500M × 32 bytes per entry).
          With HyperLogLog using 12 KB of memory (16,384 registers × 6 bits per register), the
          platform can estimate the daily unique visitor count with 1.5% error — meaning the
          estimate is within ±7.5 million of the true count. For analytics dashboards, this
          accuracy is typically acceptable, and the memory savings (16 GB → 12 KB, a 1,300x
          reduction) enable the system to track distinct counts for thousands of dimensions
          (page, country, device, browser) simultaneously.
        </p>
        <p>
          For staff/principal engineers, HyperLogLog requires understanding the mathematical
          foundations (hash-based bucketing, leading-zero counting, harmonic mean estimation),
          the trade-offs between register count (accuracy) and memory usage, and the practical
          considerations of merging HLL sketches (union operations) and bias correction for
          small and large cardinalities.
        </p>
        <p>
          The business impact of HyperLogLog decisions is significant. Correct use enables
          real-time distinct counting at scale (unique visitors, search query diversity, network
          flow tracking) with minimal memory overhead. Incorrect use (insufficient registers,
          missing bias correction) leads to estimation errors that can misinform business
          decisions based on the estimated counts.
        </p>
        <p>
          In system design interviews, HyperLogLog demonstrates understanding of probabilistic
          data structures, the trade-offs between accuracy and memory efficiency, and the
          mathematical foundations of streaming algorithms.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src={`${BASE_PATH}/hyperloglog-structure.svg`}
          alt="HyperLogLog structure showing m registers, hash function splitting into prefix (register index) and suffix (leading zero count), and max tracking per register"
          caption="HyperLogLog structure — a hash function splits each element into a prefix (selecting one of m registers) and a suffix (counting leading zeros); each register tracks the maximum leading zero count seen, and the harmonic mean of 2^(register values) estimates cardinality"
        />

        <h3>Hash-Based Bucketing</h3>
        <p>
          HyperLogLog uses a hash function to map each element to a uniformly distributed
          random value. The hash output is split into two parts: the first p bits (the prefix)
          select one of m = 2^p registers (buckets), and the remaining bits (the suffix) are
          used to count the number of leading zeros. The intuition is that if you observe a
          hash value with k leading zeros, you have likely seen approximately 2^k distinct
          elements (because the probability of k leading zeros is 1/2^k).
        </p>
        <p>
          Each register stores the maximum number of leading zeros observed for elements that
          hash to that register. When a new element is processed, its hash is computed, the
          register is selected by the prefix, and the register is updated to the maximum of its
          current value and the new leading-zero count. After processing all elements, the
          cardinality estimate is computed as the harmonic mean of 2^(register values) across
          all m registers, multiplied by a bias correction constant.
        </p>

        <h3>Harmonic Mean Estimation</h3>
        <p>
          The raw estimate is computed as the harmonic mean of 2^(register values) across all
          registers: E = α_m × m² × (Σ 2^(-M[j]))^(-1), where m is the number of registers,
          M[j] is the value of register j, and α_m is a bias correction constant that depends
          on m. The harmonic mean is used instead of the arithmetic mean because it is less
          sensitive to outliers: a single register with an unusually high leading-zero count
          would disproportionately inflate the arithmetic mean, but the harmonic mean dampens
          the effect of outliers.
        </p>
        <p>
          The standard error of the HyperLogLog estimate is approximately 1.04/√m, where m is
          the number of registers. With m = 16,384 (p = 14), the standard error is
          approximately 0.81%, meaning 95% of estimates are within ±1.6% of the true
          cardinality. This accuracy is achieved using only 12 KB of memory (16,384 registers
          × 6 bits per register).
        </p>

        <h3>Bias Correction</h3>
        <p>
          The raw HyperLogLog estimate is biased for small and large cardinalities. For small
          cardinalities (fewer distinct elements than the number of registers), many registers
          remain at zero, and the estimate overestimates the true cardinality. For large
          cardinalities (approaching 2^32), hash collisions cause the estimate to underestimate
          the true cardinality. Bias correction applies different formulas for these ranges:
          linear counting (using the number of zero registers) for small cardinalities, and
          a large-range correction for cardinalities approaching the hash space limit.
        </p>
        <p>
          The bias correction constants (α_m) are pre-computed through extensive empirical
          analysis and are published in the original HyperLogLog paper by Flajolet et al. (2007).
          Modern implementations (Redis HLL, Google BigQuery HLL++, Apache DataSketches) use
          refined bias correction tables that further reduce estimation error to below 1% for
          most cardinality ranges.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/hyperloglog-estimation.svg`}
          alt="HyperLogLog cardinality estimation showing query flow: hash element, find register, return min across registers, apply bias correction, error bound = 1.04/√m"
          caption="Cardinality estimation — after processing all elements, compute the harmonic mean of 2^(register values), apply bias correction for small/large cardinalities, with error bound = 1.04/√m"
        />
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3>Update and Query Flow</h3>
        <p>
          The update flow processes each element through three steps: hash the element to a
          uniformly distributed value, split the hash into prefix (register index) and suffix
          (leading-zero counter), and update the selected register to the maximum of its
          current value and the new leading-zero count. Each update is O(1) time and O(1)
          memory, making HyperLogLog suitable for high-throughput streaming applications.
        </p>
        <p>
          The query flow computes the cardinality estimate by calculating the harmonic mean of
          2^(register values) across all registers, applying the bias correction constant α_m,
          and then applying the small-range or large-range correction if needed. The query is
          O(m) time where m is the number of registers (typically 16,384), making it fast
          enough for real-time dashboards.
        </p>

        <h3>Merging HyperLogLog Sketches</h3>
        <p>
          One of HyperLogLog&apos;s most powerful properties is that sketches from independent
          data streams can be merged to produce a sketch that estimates the cardinality of the
          union of the streams. The merge operation is element-wise maximum: for each register
          position, the merged register is the maximum of the corresponding registers in the
          input sketches. This merge is commutative, associative, and idempotent, making
          HyperLogLog suitable for distributed cardinality estimation across multiple servers
          or data centers.
        </p>
        <p>
          Merging is used in production systems to combine daily sketches into weekly or monthly
          estimates, to aggregate estimates across regional shards into a global estimate, and
          to combine estimates from parallel processing pipelines. The merged sketch has the
          same error bound as a sketch that was built from the union of all elements directly,
          making merging a lossless operation for cardinality estimation.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/hyperloglog-use-cases.svg`}
          alt="HyperLogLog use cases: unique visitors (IP counting), distinct search queries (query diversity), and network flows (connection tracking) with space efficiency comparison"
          caption="HyperLogLog use cases — unique visitor counting (millions of IPs in 12 KB), search query diversity (distinct queries with bounded error), and network flow tracking (connection counts with mergeable sketches across routers)"
        />
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          HyperLogLog trades exact counting for massive memory efficiency. An exact count of
          500 million distinct elements requires ~16 GB (hash set), while HyperLogLog requires
          ~12 KB with ±1.5% error. The trade-off is acceptable for analytics (where approximate
          counts are sufficient) but unacceptable for billing or financial applications (where
          exact counts are required).
        </p>
        <p>
          Compared to other probabilistic cardinality estimators, HyperLogLog provides the best
          accuracy-to-memory ratio. Linear Probabilistic Counting uses more memory for the same
          accuracy. Adaptive Counting (used in some implementations) switches between Linear
          Counting and HyperLogLog based on the estimated cardinality, providing better accuracy
          for small cardinalities at the cost of implementation complexity. HyperLogLog++ (used
          by Google BigQuery) adds sparse representation for small cardinalities, reducing
          memory usage from 12 KB to a few hundred bytes for cardinalities below 10,000.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Choose the number of registers based on the required accuracy. For 1% error, use
          m = 16,384 (p = 14, 12 KB). For 2% error, use m = 4,096 (p = 12, 3 KB). For 0.5%
          error, use m = 65,536 (p = 16, 48 KB). The standard error formula 1.04/√m allows
          you to compute the required register count for any target accuracy.
        </p>
        <p>
          Use a high-quality hash function (MurmurHash3, CityHash, or xxHash) to ensure
          uniform distribution of hash values. Poor hash functions with non-uniform distribution
          cause biased estimates because some registers are selected more frequently than
          others, leading to underestimation or overestimation of the true cardinality.
        </p>
        <p>
          Implement sparse representation for small cardinalities: when the number of
          non-zero registers is small (e.g., fewer than 100), store only the non-zero
          registers as a sorted list of (index, value) pairs. This reduces memory usage from
          12 KB to a few hundred bytes for small cardinalities, making HyperLogLog practical
          for workloads where most sketches represent small cardinalities but occasionally
          need to represent large cardinalities.
        </p>
        <p>
          Merge sketches at query time rather than storing merged results: store individual
          sketches (per-day, per-region) and merge them on demand when computing aggregate
          estimates. This allows flexible time-window queries (any date range, any region
          combination) without pre-computing every possible merge.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is using too few registers for the required accuracy. With
          m = 256 registers (p = 8), the standard error is 6.5%, meaning a 95% confidence
          interval of ±13%. This is unacceptable for most analytics use cases. The fix is to
          use at least m = 4,096 registers (p = 12, 2% error) for analytics, and m = 16,384
          (p = 14, 0.8% error) for dashboards that display precise-looking numbers.
        </p>
        <p>
          Not applying bias correction for small cardinalities causes overestimation. When the
          true cardinality is smaller than the number of registers, many registers remain at
          zero, and the raw estimate overestimates the true count. The fix is to use linear
          counting (V = m × ln(m/V), where V is the number of zero registers) for small
          cardinalities, as recommended in the HyperLogLog++ paper.
        </p>
        <p>
          Using a weak hash function (e.g., simple modulo or XOR-based hashing) causes
          non-uniform hash distribution, which biases the estimate. Some registers are selected
          more frequently than others, leading to higher leading-zero counts in those registers
          and overestimation of the true cardinality. The fix is to use a well-tested hash
          function with proven uniform distribution properties (MurmurHash3, CityHash, xxHash).
        </p>
        <p>
          Assuming HyperLogLog supports intersection or difference operations is a fundamental
          misunderstanding. HyperLogLog supports union (merge) but not intersection or
          difference. To estimate the intersection of two sets, use the inclusion-exclusion
          principle: |A ∩ B| = |A| + |B| - |A ∪ B|. However, the error bound for
          intersection estimates is significantly larger than for union estimates, because
          the errors from the individual estimates compound. For intersection-heavy workloads,
          consider alternative data structures like MinHash or Theta Sketch.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Google BigQuery: Approximate Distinct Count</h3>
        <p>
          Google BigQuery uses HyperLogLog++ for its APPROX_COUNT_DISTINCT function, which
          estimates the number of distinct values in a column with sub-percent error. BigQuery
          implements sparse representation: for small cardinalities (fewer than 10,000 distinct
          values), the sketch is stored as a sorted list of non-zero registers, reducing memory
          usage from 12 KB to a few hundred bytes. For large cardinalities, the full dense
          representation is used. This optimization allows BigQuery to process trillions of rows
          while maintaining low memory overhead for distinct counting.
        </p>

        <h3>Redis: HLL for Real-Time Analytics</h3>
        <p>
          Redis implements HyperLogLog as a native data type (PFADD, PFCOUNT, PFMERGE commands).
          Each HLL uses 12 KB of memory and provides ±0.81% accuracy. Redis HLL is used for
          real-time unique visitor counting, distinct session tracking, and IP address diversity
          monitoring. The PFMERGE command allows merging HLLs from different Redis instances,
          enabling distributed cardinality estimation across a Redis cluster.
        </p>

        <h3>Cloudflare: Network Flow Tracking</h3>
        <p>
          Cloudflare uses HyperLogLog to track the number of distinct source IP addresses
          connecting to its network in real time. Each edge router maintains a local HLL sketch,
          and sketches are merged periodically at regional aggregation points to produce global
          estimates. This allows Cloudflare to monitor network flow diversity (detecting DDoS
          attacks that involve many distinct source IPs) while using minimal memory per router
          (12 KB per time window).
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is HyperLogLog and when should you use it?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              HyperLogLog is a probabilistic data structure that estimates the number of
              distinct elements (cardinality) using a fixed amount of memory (typically 12 KB).
              It uses a hash function to map elements to registers, tracks the maximum leading
              zero count per register, and estimates cardinality using the harmonic mean of
              2^(register values).
            </p>
            <p>
              Use HyperLogLog when you need to count distinct elements at scale and can tolerate
              small estimation errors (±0.8-2%). Typical use cases include unique visitor
              counting, search query diversity tracking, and network flow monitoring. Do not
              use it for billing or financial applications that require exact counts.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: How does HyperLogLog estimate cardinality?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Each element is hashed to a uniformly distributed value. The hash is split into a
              prefix (selecting one of m registers) and a suffix (counting leading zeros). Each
              register stores the maximum leading-zero count seen. The cardinality estimate is
              computed as the harmonic mean of 2^(register values) across all registers,
              multiplied by a bias correction constant.
            </p>
            <p>
              The intuition: if you observe a hash with k leading zeros, you have likely seen
              approximately 2^k distinct elements (because the probability of k leading zeros is
              1/2^k). The harmonic mean dampens the effect of outlier registers with unusually
              high leading-zero counts.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: Can you merge HyperLogLog sketches from different data streams?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Yes, HyperLogLog sketches can be merged through element-wise maximum: for each
              register position, the merged register is the maximum of the corresponding
              registers in the input sketches. This merge is commutative, associative, and
              idempotent, making it suitable for distributed cardinality estimation.
            </p>
            <p>
              The merged sketch has the same error bound as a sketch built from the union of
              all elements directly. Merging is used to combine daily sketches into weekly
              estimates, aggregate across regional shards, and combine estimates from parallel
              processing pipelines. However, HyperLogLog does not support intersection or
              difference operations — only union.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do you reduce memory usage for small cardinalities?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Use sparse representation: when the number of non-zero registers is small (e.g.,
              fewer than 100), store only the non-zero registers as a sorted list of (index,
              value) pairs. This reduces memory from 12 KB (full dense representation) to a
              few hundred bytes for small cardinalities. When the number of non-zero registers
              exceeds a threshold, convert to the dense representation.
            </p>
            <p>
              Google&apos;s HyperLogLog++ implementation uses this optimization, reducing memory
              usage for cardinalities below 10,000 from 12 KB to a few hundred bytes. Redis HLL
              also supports sparse representation for small cardinalities.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What is the error bound of HyperLogLog?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              The standard error of HyperLogLog is approximately 1.04/√m, where m is the number
              of registers. With m = 16,384 (12 KB), the standard error is 0.81%, meaning 95%
              of estimates are within ±1.6% of the true cardinality. With m = 4,096 (3 KB),
              the standard error is 1.62%, meaning 95% of estimates are within ±3.2%.
            </p>
            <p>
              The error bound is independent of the cardinality: HyperLogLog provides the same
              relative error whether counting 1,000 or 1 billion distinct elements. This is a
              key advantage over exact counting, where memory usage grows linearly with
              cardinality.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How would you estimate the intersection of two sets using HyperLogLog?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Use the inclusion-exclusion principle: |A ∩ B| = |A| + |B| - |A ∪ B|. Compute
              |A| and |B| from the individual HLL sketches, compute |A ∪ B| by merging the
              sketches, and subtract. However, the error bound for intersection estimates is
              significantly larger than for union estimates, because the errors from the three
              individual estimates compound.
            </p>
            <p>
              For intersection-heavy workloads (e.g., finding common users between two
              audiences), consider alternative data structures like MinHash (which estimates
              Jaccard similarity directly) or Theta Sketch (which supports intersection, union,
              and difference with bounded error).
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://algo.inria.fr/flajolet/Publications/FlFuGaMe07.pdf"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Flajolet et al. (2007): HyperLogLog Paper
            </a>{" "}
            — The original paper describing the HyperLogLog algorithm.
          </li>
          <li>
            <a
              href="https://cloud.google.com/bigquery/docs/reference/standard-sql/approximate_aggregate_functions"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google BigQuery: HyperLogLog++
            </a>{" "}
            — How BigQuery implements approximate distinct counting.
          </li>
          <li>
            <a
              href="https://redis.io/docs/data-types/probabilistic/hyperloglogs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Redis: HyperLogLog Documentation
            </a>{" "}
            — PFADD, PFCOUNT, PFMERGE commands for real-time cardinality estimation.
          </li>
          <li>
            <a
              href="https://cloudflare.com/blog/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cloudflare Blog: Network Flow Tracking with HyperLogLog
            </a>{" "}
            — How Cloudflare uses HLL for DDoS detection.
          </li>
          <li>
            <a
              href="https://datasketches.apache.org/docs/HLL/HllSketch.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apache DataSketches: HLL Sketch
            </a>{" "}
            — Production-grade HLL implementation with sparse representation.
          </li>
          <li>
            <a
              href="https://highscalability.com/blog/2012/4/5/big-data-counting-how-to-count-a-billion-distinct-objects-us.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              High Scalability: Counting a Billion Distinct Objects
            </a>{" "}
            — Practical guide to HyperLogLog for large-scale distinct counting.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
