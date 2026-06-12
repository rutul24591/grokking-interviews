"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-dsa-algorithms-randomized-algorithms",
  title: "Randomized Algorithms",
  description: "Randomized algorithms leverage randomness for better expected performance — Las Vegas vs Monte Carlo distinction, QuickSort expected O(n log n) analysis, universal hashing, reservoir sampling, Chernoff bounds, Bloom filters, and probabilistic data structures used in production systems.",
  category: "other",
  subcategory: "data-structures-algorithms",
  slug: "randomized-algorithms",
  wordCount: 2400,
  readingTime: 10,
  lastUpdated: "2026-05-16",
  tags: ["randomized", "las-vegas", "monte-carlo", "quicksort", "hashing", "reservoir-sampling"],
};

export default function RandomizedAlgorithmsArticle() {
  return (
    <ArticleLayout metadata={metadata}><HighlightBlock as="p" tier="crucial" className="mb-4">Interview focus: Randomized Algorithms should be explained through a correctness invariant first, then through the implementation technique.</HighlightBlock><HighlightBlock as="p" tier="crucial" className="mb-4">Interview focus: In interviews, the decisive point is why this approach is valid under the stated constraints, not just what API or algorithm is used.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Interview focus: Compare the simple baseline with the optimized or production-ready approach so the trade-off is explicit.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Interview focus: Name the data structure, state machine, pipeline stage, or control plane that owns each decision.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Interview focus: Include the cost model: preprocessing cost, per-operation cost, storage cost, latency impact, and failure recovery cost.</HighlightBlock><HighlightBlock as="p" tier="crucial" className="mb-4">Interview lens: frame Randomized Algorithms around problem constraints, correctness proof, complexity class, data-structure choice, and degradation strategy. This is what turns the article from concept notes into interview-ready reasoning.</HighlightBlock><HighlightBlock as="p" tier="crucial" className="mb-4">Core invariant to defend: the chosen algorithm must match the input constraints and expose why it is correct, not only why it passes sample cases.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Decision quality comes from naming the constraint, the chosen technique, the proof boundary, and the cost model before discussing implementation details.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Failure modes to call out: choosing a familiar algorithm without proving fit, ignoring worst-case complexity, missing edge cases, and failing to switch to approximation or heuristics when exact solutions are infeasible.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Useful signals or metrics: time complexity, space complexity, approximation quality, preprocessing cost, query cost, and worst-case failure behavior.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare the simple approach with the production/interview approach: what gets faster, what gets safer, and what new complexity appears.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For staff/principal depth, explain how this topic behaves under scale, partial failure, adversarial input, migration pressure, and observability gaps.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Close the answer with edge cases and tests: smallest input, largest input, invalid input, concurrent or repeated operations, and rollback or recovery behavior.</HighlightBlock>
      <p>
        Randomized algorithms deliberately introduce randomness into their logic to achieve better expected performance,
        simpler implementations, or probabilistic correctness guarantees. Unlike deterministic algorithms that always
        follow the same path, randomized algorithms flip coins at decision points — producing results that are correct
        with high probability or efficient in expectation, even when adversarial inputs would defeat deterministic
        approaches.
      </p>

      <ArticleImage
        src="/diagrams/other/data-structures-algorithms/algorithms/randomized-algorithms-architecture.svg"
        alt="Randomized algorithms architecture diagram"
        caption="Randomized algorithms — Las Vegas vs Monte Carlo, QuickSort analysis, hashing, and probabilistic guarantees"
      />

      <h2>Las Vegas vs Monte Carlo</h2>
      <p>
        The fundamental taxonomy divides randomized algorithms into two families based on where randomness affects
        the output.
      </p>
      <p>
        <strong>Las Vegas algorithms</strong> always produce a correct answer; randomness affects only running time.
        Randomized QuickSort is the canonical example — regardless of pivot choices, the final sorted array is correct.
        The expected runtime is O(n log n), but worst-case remains O(n²) with negligible probability. Las Vegas
        algorithms are preferred when correctness is non-negotiable and expected-time guarantees suffice.
      </p>
      <p>
        <strong>Monte Carlo algorithms</strong> run in bounded deterministic time but may produce incorrect answers
        with some probability ε. Miller-Rabin primality testing reports "probably prime" or "definitely composite":
        for a random witness, the error probability per round is at most 1/4. Running k independent rounds drives
        error below (1/4)^k — for k=40, error is less than 10^-24, sufficient for cryptographic use. Monte Carlo
        algorithms are chosen when a small, quantifiable error probability is acceptable and fast bounded runtime
        is essential.
      </p>

      <HighlightBlock as="p" tier="crucial">
        Las Vegas = correct answer, random runtime. Monte Carlo = bounded runtime, probabilistic correctness.
        You can convert Las Vegas to Monte Carlo by imposing a time limit; converting Monte Carlo to Las Vegas
        requires a verification step.
      </HighlightBlock>

      <h2>Randomized QuickSort Analysis</h2>
      <p>
        Randomized QuickSort selects a pivot uniformly at random from the subarray at each recursive call. This
        single change eliminates adversarial worst-case inputs that plague deterministic QuickSort (e.g., already
        sorted arrays with first-element pivot selection).
      </p>
      <p>
        The expected number of comparisons is exactly 2n ln n ≈ 1.39n log₂ n. The proof uses indicator random
        variables: let X_ij = 1 if elements i and j (in sorted order) are ever compared. Elements i and j are
        compared if and only if one of them is the first pivot chosen from the set &#123;i, i+1, ..., j&#125;.
        Since pivot selection is uniform, P[X_ij = 1] = 2/(j-i+1). Summing over all pairs:
      </p>
      <p>
        E[comparisons] = Σ_&#123;i&lt;j&#125; 2/(j-i+1) = 2 Σ_&#123;k=2&#125;^n (n-k+1)/k ≈ 2n ln n
      </p>
      <p>
        For QuickSelect (finding the k-th smallest element), the expected runtime is O(n) even though worst-case
        is O(n²). The analysis shows each recursive call reduces the problem size by a constant fraction in
        expectation, yielding a geometric series that sums to O(n).
      </p>

      <h2>Universal Hashing</h2>
      <p>
        Deterministic hash functions are vulnerable to adversarial inputs — an adversary who knows the function
        can craft a set of keys that all collide, degrading hash table operations to O(n). Universal hashing
        defeats this by choosing the hash function randomly.
      </p>
      <p>
        A family H of hash functions from universe U to &#123;0,...,m-1&#125; is <em>universal</em> if for any
        two distinct keys x ≠ y, the fraction of functions h ∈ H with h(x) = h(y) is at most 1/m. The Carter-Wegman
        construction achieves this: for prime p ≥ |U|, choose random a ∈ &#123;1,...,p-1&#125; and b ∈ &#123;0,...,p-1&#125;,
        then h_&#123;a,b&#125;(x) = ((ax + b) mod p) mod m.
      </p>
      <p>
        With universal hashing, the expected number of collisions for any fixed key x against n other keys is
        at most n/m. For a table of size m = n, expected collisions per key is O(1), giving O(1) expected lookup,
        insert, and delete — against any adversary who does not see the random coins.
      </p>

      <HighlightBlock as="p" tier="important">
        Perfect hashing extends universal hashing to achieve O(1) worst-case lookups for static sets. A two-level
        scheme uses a universal family at the top level and per-bucket universal functions sized quadratically
        to eliminate all collisions, using O(n) expected space overall.
      </HighlightBlock>

      <h2>Reservoir Sampling</h2>
      <p>
        Reservoir sampling solves the problem of selecting k items uniformly at random from a stream of unknown
        length n, using O(k) space and a single pass.
      </p>
      <p>
        Algorithm R (Vitter 1985): fill the reservoir with the first k items. For the i-th item (i &gt; k), with
        probability k/i, replace a uniformly random reservoir element with the current item. After processing all
        n items, each item has been selected with probability exactly k/n.
      </p>
      <p>
        Proof by induction: item i (i ≤ k) survives to the end iff it is not evicted by any later item j (j &gt; k).
        The probability item j evicts item i is (k/j) × (1/k) = 1/j. The probability of survival through all n
        items is k/n by the telescoping product: ∏_&#123;j=k+1&#125;^n (1 - 1/j) = k/n.
      </p>
      <p>
        Reservoir sampling is fundamental in distributed systems (sampling from Kafka streams), A/B testing
        (selecting users from live traffic), and database query optimization (approximate query processing).
      </p>

      <h2>Treaps and Skip Lists</h2>
      <p>
        Randomized data structures achieve BST and sorted-set operations in O(log n) expected time without
        the complex rebalancing logic of AVL trees or red-black trees.
      </p>
      <p>
        A <strong>treap</strong> is a BST where each node stores a random priority drawn uniformly at random.
        The structure maintains the BST invariant on keys and the heap invariant on priorities. Because priorities
        are random, the resulting tree has the same distribution as a random BST, giving O(log n) expected height.
        Insertion is O(log n): BST-insert then rotations to restore heap order. The key insight is that the
        tree structure is uniquely determined by the keys and priorities, so no complex balancing state is needed.
      </p>
      <p>
        A <strong>skip list</strong> is a layered linked list where each element is promoted to higher layers
        independently with probability p = 1/2. Expected height is O(log n), and search, insert, delete all
        run in O(log n) expected time. Skip lists are cache-friendly, support range queries naturally, and are
        used in Redis (sorted sets), LevelDB (MemTable), and Lucene (posting lists).
      </p>

      <h2>Chernoff Bounds</h2>
      <p>
        Chernoff bounds give exponentially tight tail bounds for sums of independent random variables — far stronger
        than Markov or Chebyshev inequalities.
      </p>
      <p>
        For independent Bernoulli variables X₁,...,Xₙ with X = Σ Xᵢ and μ = E[X]:
      </p>
      <p>
        P[X ≥ (1+δ)μ] ≤ (eᵟ / (1+δ)^&#123;1+δ&#125;)^μ ≤ exp(-μδ²/3) for 0 &lt; δ ≤ 1
      </p>
      <p>
        P[X ≤ (1-δ)μ] ≤ exp(-μδ²/2) for 0 &lt; δ &lt; 1
      </p>
      <p>
        Chernoff bounds underpin the analysis of randomized load balancing. With n balls thrown uniformly into
        n bins, the maximum load is O(log n / log log n) with high probability — each bin receives at most that
        many balls. The power of two choices (throw each ball into the less loaded of two random bins) reduces
        the maximum load to O(log log n) — an exponential improvement in the exponent.
      </p>

      <HighlightBlock as="p" tier="crucial">
        Power of two choices: routing each request to the less loaded of two randomly chosen servers reduces
        maximum load from O(log n / log log n) to O(log log n) — used in Nginx, HAProxy, and distributed
        hash tables for load balancing.
      </HighlightBlock>

      <h2>Bloom Filters</h2>
      <p>
        A Bloom filter is a probabilistic set data structure that answers membership queries with no false negatives
        and bounded false positive rate, using O(n) bits for n elements.
      </p>
      <p>
        Construction: an array of m bits, initialized to 0, with k independent hash functions. To insert x,
        set bits h₁(x), h₂(x),...,hₖ(x) to 1. To query x, check all k positions — if any is 0, x is definitely
        absent; if all are 1, x is probably present.
      </p>
      <p>
        False positive probability: (1 - e^&#123;-kn/m&#125;)^k. Optimal k = (m/n) ln 2. For m = 10n bits and
        optimal k ≈ 7, false positive rate ≈ 0.8%. Bloom filters are used in databases (Cassandra, RocksDB,
        BigTable check Bloom filters before expensive disk reads), browsers (Chrome safe browsing list),
        and distributed systems (Akamai CDN cache routing).
      </p>

      <h2>Randomized Algorithms in System Design</h2>
      <p>
        Randomized techniques appear throughout production systems at scale:
      </p>
      <p>
        <strong>Count-Min Sketch:</strong> approximates frequency of elements in a stream using O(ε^-1 log δ^-1)
        space. Used in network traffic analysis (Cisco), ad click counting (Twitter), and database query optimization
        (heavy hitters detection). Overestimates by at most ε × total count with probability 1-δ.
      </p>
      <p>
        <strong>HyperLogLog:</strong> estimates cardinality of a multiset using O(log log n) bits with error
        ±1.04/√m where m is register count. Redis HyperLogLog uses 12KB to count billions of distinct values
        with &lt;1% error. The key insight is hashing elements and tracking the maximum leading zeros.
      </p>
      <p>
        <strong>Locality-Sensitive Hashing (LSH):</strong> hashes similar items to the same bucket with high
        probability, enabling approximate nearest neighbor search in O(n^ρ) time where ρ &lt; 1. Used in
        deduplication (detecting near-duplicate web pages), recommendation systems, and image similarity search.
      </p>
      <p>
        <strong>Randomized rounding:</strong> solves NP-hard integer programs by solving the LP relaxation and
        rounding fractional solutions randomly. For weighted vertex cover, randomized rounding achieves a
        2-approximation. For MAX-SAT, a hybrid of randomized rounding and greedy achieves a 3/4-approximation.
      </p>

      <h2>Probabilistic Analysis vs Average-Case Analysis</h2>
      <p>
        Probabilistic analysis assumes inputs are drawn from a known distribution; the algorithm itself is
        deterministic. Average-case QuickSort analysis assumes uniformly random input permutations and shows
        O(n log n) average runtime — but this fails against an adversary who can choose inputs.
      </p>
      <p>
        Randomized analysis puts random coins in the algorithm, not the input. Randomized QuickSort achieves
        O(n log n) expected runtime for any input, including adversarially chosen ones. This distinction is
        critical for security-sensitive applications: a deterministic hash function with good average-case
        performance can still be DoS'd by an attacker who studies the function.
      </p>

      <h2>Interview Questions</h2>

      <h3>Q1: What is the difference between a Las Vegas and Monte Carlo algorithm? Give one example of each.</h3>
      <p>
        Las Vegas algorithms always produce correct output but have random runtime. Randomized QuickSort is Las Vegas:
        pivot selection is random but the sorted output is always correct. Monte Carlo algorithms have bounded
        deterministic runtime but may err with probability ε. Miller-Rabin primality testing is Monte Carlo:
        it runs in O(k log² n) time but reports "probably prime" with error at most (1/4)^k per iteration.
        To convert Monte Carlo to Las Vegas requires an efficient verifier — for primality, trial division up
        to √n would work but is too slow, so Miller-Rabin stays Monte Carlo in practice.
      </p>

      <h3>Q2: Prove that randomized QuickSort has O(n log n) expected comparisons.</h3>
      <p>
        Define indicator variable X_ij = 1 if elements with sorted ranks i &lt; j are compared. Elements i and j
        are compared iff one is chosen as pivot before any element strictly between them. Since pivot selection
        is uniform, P[X_ij = 1] = 2/(j-i+1). Expected comparisons = Σ_&#123;1≤i&lt;j≤n&#125; 2/(j-i+1).
        Let d = j-i, so this equals Σ_&#123;d=1&#125;^&#123;n-1&#125; (n-d) × 2/(d+1) ≤ 2n Σ_&#123;d=1&#125;^n 1/d = 2n H_n ≈ 2n ln n = O(n log n).
      </p>

      <h3>Q3: How does universal hashing protect against adversarial inputs?</h3>
      <p>
        A deterministic hash function h is fixed before insertion; an adversary who knows h can enumerate
        keys that all map to the same bucket, forcing O(n) per operation. Universal hashing chooses h randomly
        from a family H after the adversary commits to inputs. For any two keys x ≠ y, P_&#123;h∈H&#125;[h(x) = h(y)] ≤ 1/m.
        By linearity of expectation, the expected number of collisions for any fixed key x among n-1 other keys
        is at most (n-1)/m &lt; 1 for m = n. An adversary who does not see the random coins cannot cause more
        than O(1) expected collisions per key, regardless of input.
      </p>

      <h3>Q4: Explain reservoir sampling and prove its correctness for k=1.</h3>
      <p>
        Algorithm: initialize reservoir with item 1. For item i ≥ 2, replace reservoir with item i with probability
        1/i. Claim: after n items, each item j is in the reservoir with probability 1/n. Proof: item j is selected
        at step j with probability 1/j. It survives step j+1 with probability j/(j+1) (not replaced), step j+2
        with probability (j+1)/(j+2), etc. Telescoping: (1/j) × ∏_&#123;i=j+1&#125;^n (i-1)/i = (1/j) × (j/n) = 1/n. ∎
      </p>

      <h3>Q5: Design a system to count distinct visitors to 10 million web pages with &lt;1% error using limited memory.</h3>
      <p>
        Use HyperLogLog (HLL) per page. HLL uses m registers of b=5 bits each (m=2^14 = 16384 registers), totaling
        ~12KB per page. For 10M pages: 10M × 12KB = 120GB — too much for a single machine.
      </p>
      <p>
        Distributed approach: partition pages across 100 shards (1M pages each, 120GB/shard). Each shard maintains
        an HLL per page. For global queries, HLL supports merging: HLL(A ∪ B) = merge(HLL(A), HLL(B)) by taking
        per-register max. This makes union queries across shards O(m) = O(16384) — trivial.
      </p>
      <p>
        For real-time requirements, use Redis HyperLogLog (built-in PFADD/PFCOUNT commands) with Redis Cluster
        sharding by page ID. Batch export to cold storage (S3 + Parquet) nightly for historical analysis. Error
        bound: HLL with m=16384 registers achieves 1.04/√m ≈ 0.81% standard error — within the 1% SLA.
        Alternative: Count-Min Sketch for frequency queries (top-k pages by distinct visitors) alongside HLL.
      </p>

      <h3>Q6: When would you use randomized rounding, and what approximation ratio does it achieve for weighted vertex cover?</h3>
      <p>
        Randomized rounding applies when: (1) the problem has a natural LP relaxation, (2) the LP is efficiently
        solvable, and (3) fractional solutions can be rounded with bounded loss in objective. For weighted vertex cover,
        the LP has variable x_v ∈ [0,1] for each vertex with x_u + x_v ≥ 1 for each edge (u,v), minimizing Σ w_v x_v.
        Randomized rounding: include vertex v if x_v ≥ 1/2 (deterministic threshold rounding achieves 2-approximation)
        or include v with probability x_v (probabilistic rounding, needs amplification for coverage guarantees).
        The deterministic 1/2-threshold achieves a 2-approximation since any edge has at least one endpoint with
        x ≥ 1/2, so every edge is covered, and total weight ≤ 2 × LP_OPT ≤ 2 × OPT. This matches the best
        known polynomial approximation ratio (assuming P≠NP, no (2-ε)-approximation exists under UGC).
      </p>
    </ArticleLayout>
  );
}
