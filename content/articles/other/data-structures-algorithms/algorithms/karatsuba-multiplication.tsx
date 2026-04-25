"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "karatsuba-multiplication",
  title: "Karatsuba Multiplication",
  description:
    "Karatsuba multiplication — the first sub-quadratic integer multiplication, divide-and-conquer with three sub-multiplications, Toom–Cook and Schönhage–Strassen successors.",
  category: "other",
  subcategory: "algorithms",
  slug: "karatsuba-multiplication",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-20",
  tags: ["karatsuba", "multiplication", "divide-and-conquer", "bignum"],
  relatedTopics: ["divide-and-conquer", "quickselect", "merge-sort"],
};

export default function KaratsubaMultiplicationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          <span className="font-semibold">Karatsuba multiplication</span> is a
          divide-and-conquer algorithm that multiplies two n-digit numbers using only{" "}
          <span className="font-semibold">three</span> recursive sub-multiplications instead
          of the four needed by the schoolbook split. This drops the running time from
          Θ(n²) to Θ(n^(log₂ 3)) ≈ Θ(n^1.585) — the first sub-quadratic multiplication
          algorithm in history.
        </p>
        <p className="mb-4">
          Anatoly Karatsuba published it in 1962 as a 23-year-old graduate student under
          Andrey Kolmogorov, who had conjectured that Θ(n²) was optimal. Karatsuba refuted
          the conjecture in a single weekend. The technique opened a half-century of
          progressively faster multiplication algorithms — Toom–Cook (1963), Schönhage–
          Strassen (1971), Fürer (2007), and Harvey–van der Hoeven's O(n log n) (2019).
        </p>
        <p className="mb-4">
          In practice, Karatsuba is the workhorse of bignum libraries (GMP, Python int, Java
          BigInteger, OpenSSL) for medium-sized inputs — typically 30 to a few thousand
          machine-word digits. Below the lower threshold, schoolbook's tighter constants
          win; above the upper, Toom-3/4 and FFT-based methods take over.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/karatsuba-multiplication-diagram-1.svg"
          alt="Karatsuba split, three multiplications, and recurrence"
          caption="The three-multiplication identity that defeats schoolbook's four — and the recurrence T(n) = 3T(n/2) + O(n)."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p className="mb-4">
          <span className="font-semibold">Split each number in half.</span> Write
          x = x₁·B^(n/2) + x₀ and y = y₁·B^(n/2) + y₀ where B is the base (10 for decimal,
          2³² for word-level bignum). Schoolbook expansion gives
          x·y = x₁y₁·B^n + (x₁y₀ + x₀y₁)·B^(n/2) + x₀y₀ — four products of n/2-digit
          numbers.
        </p>
        <p className="mb-4">
          <span className="font-semibold">The Karatsuba identity.</span> Compute
          z₂ = x₁·y₁, z₀ = x₀·y₀, and z₁ = (x₁ + x₀)(y₁ + y₀) − z₂ − z₀. Algebraically,
          (x₁ + x₀)(y₁ + y₀) = x₁y₁ + x₁y₀ + x₀y₁ + x₀y₀. Subtracting z₂ and z₀ leaves
          exactly the cross-term x₁y₀ + x₀y₁ — the middle coefficient. One recursive
          multiplication recovers the sum we'd otherwise need two for.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Recurrence.</span> T(n) = 3·T(n/2) + Θ(n). Master
          Theorem Case 1: leaf-work n^(log₂ 3) ≈ n^1.585 dominates the linear combine.
          Total: Θ(n^1.585). The 0.4 reduction in exponent compounds geometrically; for
          n=10⁶, schoolbook does 10¹² operations and Karatsuba ~10⁹.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Combine cost.</span> The combine step does three
          additions (x₁ + x₀, y₁ + y₀, then z₁ formula), three subtractions, and two
          shifts (multiply by B^n and B^(n/2) — really concatenations on word boundaries).
          All Θ(n). The overhead is non-trivial: ~6n word operations vs schoolbook's n²,
          so Karatsuba only wins above the crossover threshold.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Generalization to Toom–Cook.</span> Karatsuba is
          Toom-2: split into 2 parts and use 3 evaluations. Toom-3 splits into 3 parts and
          uses 5 evaluations to reconstruct degree-4 product polynomial — recurrence T(n) =
          5·T(n/3) + Θ(n) gives Θ(n^(log_3 5)) ≈ Θ(n^1.465). Toom-k generalizes to
          O(n^(log_k(2k−1))), approaching linear as k grows but with constants that
          explode.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Sign &amp; carry handling.</span> The sums
          (x₁ + x₀) and (y₁ + y₀) are at most one digit longer than n/2, so the middle
          recursive call may operate on (n/2 + 1)-digit operands. Most implementations zero-
          pad rather than handle the carry separately. For signed integers, take absolute
          values, multiply, and apply the XOR of input signs.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/karatsuba-multiplication-diagram-2.svg"
          alt="Worked example 1234 times 5678"
          caption="Concrete walk-through: 1234 × 5678 = 7 006 652 via three sub-multiplications."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          <span className="font-semibold">Recursive structure.</span> The algorithm
          recurses until reaching a base case where schoolbook is faster. Each level
          splits operands in half, makes three recursive calls, and combines via additions
          and shifts. Implementation typically uses a fixed scratch buffer or stack
          allocation to avoid per-call malloc.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Base-case threshold.</span> Practical libraries
          switch to schoolbook below 30–80 word-sized digits. GMP's
          <code>MUL_TOOM22_THRESHOLD</code> is auto-tuned per CPU at build time. Below the
          threshold, schoolbook's tight inner loop with vector instructions (AVX-512,
          ARMv8 NEON) outruns Karatsuba's recursion overhead.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Memory pattern.</span> Karatsuba's three sub-
          multiplications are independent — perfect for parallelism — but they share input
          buffers. Typical implementations allocate Θ(n) scratch space and reuse it via a
          stack-discipline allocator. The combine pass writes the result in O(n) sequential
          stores, so cache behavior is good.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Karatsuba on polynomials.</span> The same identity
          applies to polynomial multiplication over any ring. Used in finite-field
          arithmetic for elliptic-curve cryptography, error-correcting codes, and lattice-
          based post-quantum schemes. The structure is identical — only the base case
          becomes ring-element multiplication.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Hybrid pipelines.</span> GMP's multiplication is
          a dispatch chain: schoolbook → Karatsuba → Toom-3 → Toom-4 → Toom-6.5 → Toom-8.5
          → Schönhage–Strassen. Each algorithm is asymptotically faster than the previous;
          each has a higher crossover threshold determined empirically. The result is
          near-optimal performance across nine orders of magnitude of input size.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Parallelization.</span> The three sub-
          multiplications are data-independent — fork them onto three threads at the top
          level for ~2.5× speedup. Deeper parallelization yields diminishing returns
          because sub-problem sizes shrink fast. CPython's int doesn't parallelize;
          specialized libraries like FLINT do.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p className="mb-4">
          <span className="font-semibold">Karatsuba vs schoolbook.</span> Below ~30 digits,
          schoolbook wins because Karatsuba's recursion overhead and additions dominate.
          Above ~80 digits, Karatsuba pulls ahead and the gap widens with size.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Karatsuba vs Toom–Cook.</span> Toom-3 has a
          better exponent (1.465 vs 1.585) but higher constants — five recursive calls vs
          three, more complex evaluation/interpolation. Crosses over above ~250 digits.
          Toom-4, Toom-6.5, Toom-8.5 each push the threshold higher.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Karatsuba vs Schönhage–Strassen.</span> SSA uses
          number-theoretic transforms (FFT in finite fields) and runs in O(n log n log log
          n). Crossover is in the tens of thousands of digits. SSA dominates for huge
          numbers; below that, Toom–Cook variants of Karatsuba dominate.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Karatsuba vs hardware multiply.</span> A single
          CPU MUL instruction multiplies 64-bit integers in 1–3 cycles. Karatsuba is
          irrelevant below the word size; relevant only when operands exceed what hardware
          handles natively (cryptography keys, scientific computation).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Asymptotic vs practical.</span> Harvey–van der
          Hoeven's O(n log n) is the asymptotic optimum but is "galactic" — operands
          must be astronomically large for it to beat SSA. Karatsuba and Toom–Cook
          dominate the practical range.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p className="mb-4">
          <span className="font-semibold">Tune the base-case threshold per platform.</span>{" "}
          The exact crossover depends on cache, branch predictor, vectorization, and
          compiler. GMP runs autotuners at build time; for hand-rolled code, profile both
          paths across operand sizes and pick the inflection point.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Pre-allocate scratch space.</span> A single
          arena allocated at the top, sized 2n words, suffices for all recursive levels.
          Per-call malloc destroys performance.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Avoid full sign handling inside the recursion.
          </span> Strip signs at the top, recurse on absolute values, restore sign at the
          end. Internal recursion sees only non-negative bignums.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Use word-aligned splits.</span> If operands are
          k machine words, split at k/2; this makes the shifts trivial concatenations
          rather than bit-level rotates.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Defer to a battle-tested library.</span> GMP and
          OpenSSL have been hand-tuned for decades across architectures. Re-implementing
          Karatsuba from scratch is justified only for educational purposes or in tightly
          constrained environments (microcontrollers, formally verified code).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Pad inputs to equal length.</span> The
          algorithm's clean form assumes n is even and operands are equal-length. For
          unequal sizes, either pad the shorter or use unbalanced multiplication
          algorithms (Karatsuba's "Mul_Asymmetric" in GMP).
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p className="mb-4">
          <span className="font-semibold">Negative middle term.</span> Some Karatsuba
          variants (using x₁ − x₀ instead of x₁ + x₀ to avoid carry growth) produce a
          signed middle product. Forgetting to track the sign flips the result silently.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Carry beyond n/2.</span> The sum (x₁ + x₀) can
          be one bit longer than n/2. Naively recursing on n/2 produces a truncated
          product. Pad to n/2 + 1 or use a separate handler for the carry digit.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Recursing below the schoolbook threshold.</span>{" "}
          Calling Karatsuba on 4-digit numbers is slower than schoolbook. Always check
          base-case threshold before recursing.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Per-call allocation.</span> Allocating scratch
          inside each recursive call costs more than the multiplication savings.
          Pre-allocate once.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Off-by-one in shift positions.</span> The combine
          shifts z₂ by n bits and z₁ by n/2 bits — getting these wrong corrupts every
          intermediate result. Test with simple inputs first.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Using floats for accumulators.</span> Floating
          point loses precision at ~52 bits; bignum work needs integer accumulators.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Believing it's always faster.</span> Karatsuba
          loses to schoolbook for short inputs and to Toom-3/SSA for long inputs. It's
          right only in the middle band.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <span className="font-semibold">RSA &amp; ECC cryptography.</span> 2048- and
          4096-bit RSA modular multiplication uses Karatsuba inside Montgomery reduction.
          OpenSSL, Bouncy Castle, and libsecp256k1 (Bitcoin) all dispatch to Karatsuba
          above small-key thresholds.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Computer algebra systems.</span> Mathematica,
          SageMath, Maple, Maxima — all rely on GMP or FLINT, which use Karatsuba for
          medium-precision arithmetic. Symbolic differentiation, polynomial GCD, factoring
          algorithms generate large bignums routinely.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Programming-language bigints.</span> Python's
          built-in <code>int</code>, Java's <code>BigInteger</code>, JavaScript's
          <code> BigInt</code> (V8), Go's <code>math/big</code> — all switch to Karatsuba
          past empirically tuned thresholds.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Number-theoretic record computations.</span> Pi
          to trillions of digits (y-cruncher), the largest known Mersenne primes (GIMPS),
          and integer factoring records all rely on Karatsuba layered with Toom–Cook and
          SSA.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Polynomial multiplication for ECC &amp; PQC.</span>{" "}
          Karatsuba on polynomial coefficients accelerates GF(2^m) arithmetic in
          binary-field elliptic curves, and is used in lattice-based post-quantum
          cryptography (Kyber, Dilithium) for ring multiplications below the NTT threshold.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Homomorphic encryption.</span> BFV / CKKS
          schemes encrypt plaintexts as polynomials in cyclotomic rings; multiplication
          uses Karatsuba for low-degree intermediate products and NTT for high-degree.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/karatsuba-multiplication-diagram-3.svg"
          alt="Multiplication algorithm family"
          caption="Multiplication algorithm landscape — schoolbook, Karatsuba, Toom–Cook, SSA, Fürer, Harvey–van der Hoeven."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p className="mb-4">
          <span className="font-semibold">"Derive Karatsuba's recurrence."</span> Three
          sub-multiplications on n/2-digit operands, plus O(n) additions and shifts: T(n)
          = 3T(n/2) + Θ(n) → Θ(n^(log₂ 3)).
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Why isn't it always used?"</span> Constants.
          Schoolbook is faster below ~30 digits because Karatsuba does extra additions and
          recursion overhead.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"How does Toom-3 generalize Karatsuba?"</span>{" "}
          Split each operand into 3 parts (degree-2 polynomial); evaluate the product
          polynomial (degree 4) at 5 points; recursively multiply the evaluations;
          interpolate. Recurrence T(n)=5T(n/3)+Θ(n) → Θ(n^1.465).
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Show how three sub-multiplications compute four
          products."</span> The middle term x₁y₀ + x₀y₁ comes from
          (x₁ + x₀)(y₁ + y₀) − x₁y₁ − x₀y₀ — algebra, not magic.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"What's the asymptotically fastest known
          multiplication?"</span> Harvey–van der Hoeven 2019: O(n log n). But it's
          galactic — not practical at any realistic input size.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"How does this connect to FFT?"</span> FFT-based
          multiplication views numbers as polynomials evaluated at roots of unity,
          multiplies pointwise (O(n)), and inverse-transforms. Schönhage–Strassen does
          this in finite fields to avoid floating-point errors.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <p className="mb-4">
          Karatsuba &amp; Ofman, "Multiplication of Many-Digital Numbers by Automatic
          Computers" (Doklady AN SSSR, 1962). Knuth, <em>The Art of Computer Programming
          Vol 2: Seminumerical Algorithms</em>, §4.3.3 — the canonical exposition.
          Schönhage &amp; Strassen, "Schnelle Multiplikation großer Zahlen" (1971). Fürer
          (2007) and Harvey &amp; van der Hoeven (2019) for the asymptotic frontier. The
          GMP manual's chapter on multiplication algorithms is an excellent practical
          reference. CLRS chapter 30 connects Karatsuba's idea to FFT-based polynomial
          multiplication. Brent &amp; Zimmermann's <em>Modern Computer Arithmetic</em>{" "}
          covers the full algorithm hierarchy as implemented in production bignum
          libraries.
        </p>
      </section>
    </ArticleLayout>
  );
}
