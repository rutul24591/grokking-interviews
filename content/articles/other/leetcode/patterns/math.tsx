"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "math",
  title: "Math Pattern",
  description:
    "Number theory, modular arithmetic, fast exponentiation, sieves, and combinatorics — closed-form thinking that turns brute force into logarithmic.",
  category: "other",
  subcategory: "patterns",
  slug: "math",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-26",
  tags: ["math", "number-theory", "modular-arithmetic", "leetcode", "patterns"],
  relatedTopics: ["bit-manipulation", "divide-and-conquer", "dynamic-programming"],
};

export default function MathArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
      <p className="mb-4">
        The math pattern groups problems whose solution depends on a numerical insight rather
        than a data-structure manoeuvre. The toolkit is small but pervasive: GCD via the
        Euclidean algorithm, modular arithmetic for overflow control and counting under a
        modulus, fast exponentiation, the Sieve of Eratosthenes for primes, basic
        combinatorics, and a few geometric primitives. Mastering the toolkit converts many
        seemingly complicated problems into a few lines of closed-form computation.
      </p>
      <p className="mb-4">
        Recognition signals are direct. The problem mentions divisibility, primes, factorials,
        permutations, modular results, base conversion, digit manipulation, geometry, or
        randomness. Sometimes the signal is implicit: a counting problem with answer modulo
        10^9 + 7 is a math problem dressed up as combinatorics; a problem about overflow on
        Integer.MIN_VALUE is a math problem dressed up as input handling.
      </p>
      <p className="mb-4">
        The pattern matters because math-flavoured problems reward asymptotic insight. A naive
        loop over divisors is O(n); checking up to sqrt(n) is O(sqrt(n)); a closed-form is O(1).
        The interviewer is testing whether you can drop the right factor of n. At staff level,
        the same instinct transfers to system-design choices around hashing, sampling, and
        approximation.
      </p>
      <p className="mb-4">
        Strong math intuition also covers a wide swath of competitive programming, financial
        modelling, simulation, and cryptography. The interview question is just the tip of an
        iceberg of applications, but for the prep itself the goal is to make the toolkit
        reflexive.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
      <p className="mb-4">
        <strong>Euclidean algorithm.</strong> gcd(a, b) = gcd(b, a mod b), with gcd(a, 0) = a.
        Logarithmic in the magnitude of the inputs. The extended Euclidean algorithm
        additionally returns coefficients x, y such that a * x + b * y = gcd(a, b) — used to
        compute modular inverses and solve Bezout-style problems (Leetcode 365 Water and Jug).
      </p>
      <p className="mb-4">
        <strong>Least common multiple.</strong> lcm(a, b) = a * b / gcd(a, b). Beware overflow:
        compute a / gcd(a, b) * b instead of a * b / gcd, to keep the intermediate within
        bounds.
      </p>
      <p className="mb-4">
        <strong>Modular arithmetic.</strong> Identities (a + b) mod m, (a * b) mod m, (a^n) mod
        m. Subtraction must add m once before the final mod to handle the negative case.
        Division is replaced by multiplication by the modular inverse, which exists when the
        divisor is coprime to the modulus. For prime m, Fermat&apos;s little theorem gives
        a^(m-2) as the inverse of a.
      </p>
      <p className="mb-4">
        <strong>Fast exponentiation.</strong> power(base, exp, mod) iteratively squares base
        while consuming bits of exp. Each iteration is one squaring and at most one
        multiplication, giving O(log exp). The same trick generalises to matrix exponentiation
        (Fibonacci in O(log n), linear recurrences in general).
      </p>
      <p className="mb-4">
        <strong>Sieve of Eratosthenes.</strong> Mark non-primes by walking from each prime p,
        starting at p * p, in steps of p. Time O(n log log n), space O(n) for the sieve array.
        For n up to 10^7, the sieve fits comfortably in memory and is the right way to
        precompute primes for batch queries.
      </p>
      <p className="mb-4">
        <strong>Combinatorics.</strong> Binomial coefficient C(n, k) = n! / (k! * (n - k)!).
        Pascal&apos;s triangle gives O(n²) precomputation. For modular C(n, k), precompute
        factorials and modular inverse factorials up to n; then C(n, k) = fact[n] * invfact[k]
        * invfact[n - k] mod m.
      </p>
      <p className="mb-4">
        <strong>Overflow.</strong> 32-bit int overflows around 2 * 10^9. For products of two
        large ints, use 64-bit long. For larger arithmetic, switch to BigInteger (Java) or use
        Python (which has arbitrary precision built in). Modular arithmetic prevents overflow
        but does not preserve the literal value — be sure the problem asks for the value mod m.
      </p>
      <p className="mb-4">
        <strong>Geometry primitives.</strong> Cross product (x1*y2 - x2*y1) gives signed area
        and orientation; useful for &quot;is this point left or right of this line&quot; tests.
        Slope as a reduced fraction (dy/dx with both divided by gcd) avoids floating-point
        comparisons in problems like Leetcode 149.
      </p>
      <p className="mb-4">
        <strong>Randomness.</strong> Rejection sampling produces uniform samples from a
        non-uniform source: keep generating until the result lies in a desired sub-range, then
        accept. Reservoir sampling produces a uniform random k-subset of an unknown-length
        stream in O(k) memory.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/math-diagram-1.svg" alt="Math pattern toolkit" />

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
      <p className="mb-4">
        The fast-exponentiation template: result = 1; base = base mod m. While exp &gt; 0: if
        exp is odd, result = (result * base) mod m; base = (base * base) mod m; exp = exp / 2.
        Return result. Time O(log exp). Used directly for Leetcode 50 (Pow(x, n)) — handle
        negative exponent by computing the positive power and inverting at the end (or, for
        floating-point, divide).
      </p>
      <p className="mb-4">
        The Euclidean GCD template (recursive): if b == 0 return a, else return gcd(b, a mod
        b). Iterative variant uses while b != 0: (a, b) = (b, a mod b); return a. Both are O(log
        min(a, b)).
      </p>
      <p className="mb-4">
        The sieve template: bool[] is_prime sized n + 1, all true initially with [0] and [1]
        false. For p from 2 to sqrt(n): if is_prime[p], walk j from p * p to n in steps of p,
        marking is_prime[j] false. Final pass: collect indices that remain true.
      </p>
      <p className="mb-4">
        The reverse-integer template (Leetcode 7): result = 0; while x: digit = x % 10; x = x /
        10; check overflow before result = result * 10 + digit; assign and continue. Negative
        numbers and Integer.MIN_VALUE are the edge cases. The clean check is to compare result
        against Integer.MAX_VALUE / 10 before each multiplication.
      </p>
      <p className="mb-4">
        The factorial-trailing-zeroes template (Leetcode 172): count the factors of 5 in n! by
        summing n / 5 + n / 25 + n / 125 + ... until the term reaches zero. Each level counts
        multiples of 5, 25, 125, ... in the factorial — collectively, the total number of 5s in
        the factorisation, which equals the number of trailing zeroes (the 2s are always more
        plentiful).
      </p>
      <p className="mb-4">
        The unique-paths template (Leetcode 62): the number of monotonic lattice paths from
        top-left to bottom-right of an m by n grid is C(m + n - 2, m - 1). Compute the binomial
        coefficient with a single loop that multiplies and divides incrementally to avoid
        overflow, or use a DP table for clarity.
      </p>
      <p className="mb-4">
        The rejection-sampling template (Leetcode 470 Rand10 from Rand7): map two Rand7 calls
        to a uniform value in [1, 49]; if the result is in [1, 40], accept and return mod 10
        plus 1; else reject and try again. Expected calls per accept is 49 / 40 = 1.225.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
      <p className="mb-4">
        <strong>Closed form vs. iterative.</strong> Many counting problems have a closed form
        in C(n, k) or a polynomial. Always look for it before writing a loop. The closed form
        is O(1) (with O(n) precompute) where the loop is O(n) per query.
      </p>
      <p className="mb-4">
        <strong>Sieve vs. trial division.</strong> Sieve precomputes all primes up to n in
        O(n log log n). Trial division tests one number for primality in O(sqrt(n)). For batch
        queries, sieve. For one-shot, trial division.
      </p>
      <p className="mb-4">
        <strong>Fast exponentiation vs. linear.</strong> O(log n) vs. O(n). Always use fast
        exponentiation when the exponent can be large.
      </p>
      <p className="mb-4">
        <strong>BigInteger vs. modular arithmetic.</strong> BigInteger preserves the exact
        value but is slow. Modular arithmetic with a fixed prime is fast but only gives the
        value mod m. If the problem asks for the value mod 10^9 + 7, use modular; if it asks
        for the literal value, use BigInteger.
      </p>
      <p className="mb-4">
        <strong>Floating-point vs. integer.</strong> Floating-point introduces precision loss.
        For problems involving slopes, fractions, or geometric comparisons, prefer integer
        arithmetic with cross-multiplication, GCD reduction, or scaled integers.
      </p>
      <p className="mb-4">
        <strong>Rejection sampling vs. shuffle-then-take.</strong> For uniform sampling without
        replacement, both work. Rejection is O(1) expected per sample but unbounded worst case;
        shuffle-then-take is O(n) total. Pick by data size and call frequency.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/math-diagram-2.svg" alt="Modular arithmetic and fast exponentiation" />

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
      <p className="mb-4">
        <strong>Use long for multiplications that risk overflow.</strong> int * int can
        overflow at 2 * 10^9. (long) a * b is the standard cast in Java.
      </p>
      <p className="mb-4">
        <strong>Apply mod after every operation.</strong> Not just at the end. Intermediate
        results can grow well past 64-bit if you delay.
      </p>
      <p className="mb-4">
        <strong>Compute lcm as a / gcd * b, not a * b / gcd.</strong> Prevents overflow.
      </p>
      <p className="mb-4">
        <strong>Reduce slopes to gcd-normalised pairs.</strong> Comparing slopes as floats
        risks 0.5 == 0.5 + epsilon failures. Always reduce dy and dx by gcd and compare pairs.
      </p>
      <p className="mb-4">
        <strong>For Pow(x, n), handle n = Integer.MIN_VALUE specially.</strong> Negating it
        overflows. Cast to long first.
      </p>
      <p className="mb-4">
        <strong>Sieve up to inclusive n.</strong> Off-by-one on array size n vs. n + 1 is a
        recurring bug.
      </p>
      <p className="mb-4">
        <strong>Precompute factorials and inverse factorials once.</strong> O(n + log m) total
        for n binomial queries.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
      <p className="mb-4">
        <strong>Overflow.</strong> The most common math bug. int sums above 2 * 10^9 wrap.
        Test with extreme inputs.
      </p>
      <p className="mb-4">
        <strong>Negative results from mod.</strong> In Java and C++, ((-3) % 5) == -3, not 2.
        Add m before the final mod to normalise.
      </p>
      <p className="mb-4">
        <strong>Modular inverse for non-coprime divisor.</strong> Inverse exists only when gcd
        with modulus is 1. For other divisors, no modular inverse exists.
      </p>
      <p className="mb-4">
        <strong>Forgetting Integer.MIN_VALUE in reverse-integer.</strong> Negating
        MIN_VALUE overflows. Use a long intermediate.
      </p>
      <p className="mb-4">
        <strong>Float equality.</strong> 0.1 + 0.2 == 0.3 is false. Compare with epsilon or
        switch to integer arithmetic.
      </p>
      <p className="mb-4">
        <strong>Sieve marking from p instead of p * p.</strong> Wastes time but does not
        produce wrong answers; still, p * p is the canonical optimisation.
      </p>
      <p className="mb-4">
        <strong>Not handling n = 0 in fast exponentiation.</strong> x^0 = 1 for x != 0; 0^0 is
        usually defined as 1 in problems but check.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases (Canonical Leetcode)</h2>
      <p className="mb-4">
        <strong>7. Reverse Integer.</strong> Digit-by-digit reversal with overflow check
        before each multiply.
      </p>
      <p className="mb-4">
        <strong>9. Palindrome Number.</strong> Reverse half the digits and compare.
      </p>
      <p className="mb-4">
        <strong>50. Pow(x, n).</strong> Fast exponentiation. Handle negative n by inverting.
      </p>
      <p className="mb-4">
        <strong>204. Count Primes.</strong> Sieve of Eratosthenes.
      </p>
      <p className="mb-4">
        <strong>263. Ugly Number / 264. Ugly Number II.</strong> Factorise by 2, 3, 5; II uses
        a heap or three-pointer to generate the n-th ugly number.
      </p>
      <p className="mb-4">
        <strong>172. Factorial Trailing Zeroes.</strong> Count factors of 5 via repeated
        division.
      </p>
      <p className="mb-4">
        <strong>62. Unique Paths.</strong> Combinatorics or DP.
      </p>
      <p className="mb-4">
        <strong>89. Gray Code.</strong> i XOR (i shifted right by one).
      </p>
      <p className="mb-4">
        <strong>149. Max Points on a Line.</strong> For each anchor point, count slopes to all
        others using gcd-reduced (dy, dx) pairs as hash keys.
      </p>
      <p className="mb-4">
        <strong>528. Random Pick with Weight.</strong> Build prefix sum of weights; binary
        search for a uniform random integer in [1, total].
      </p>
      <p className="mb-4">
        <strong>470. Rand10() Using Rand7().</strong> Rejection sampling on a 7 by 7 grid
        mapped to [1, 49].
      </p>
      <p className="mb-4">
        <strong>365. Water and Jug Problem.</strong> Solvable iff target divides gcd(x, y) and
        target ≤ x + y.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/math-diagram-3.svg" alt="Canonical math Leetcode problems" />

      <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>Why does fast exponentiation work?</strong> Squaring halves the remaining
        exponent at each step. Bits of the exponent decide whether the current base square
        contributes to the result. log n squarings, each O(1).</li>
        <li><strong>Why is gcd O(log min(a, b))?</strong> Each step reduces the larger number to
        the modulus, which is strictly less than half the previous larger after at most two
        steps (Lame&apos;s theorem). The total number of steps is O(log).</li>
        <li><strong>How do you handle modular division?</strong> Multiply by the modular inverse,
        which exists when divisor and modulus are coprime. For prime modulus, Fermat&apos;s
        little theorem gives the inverse as a^(m - 2) mod m.</li>
        <li><strong>Why does rejection sampling produce a uniform distribution?</strong> Because
        every accepted outcome arises with equal probability conditional on acceptance, and
        rejection only filters — it never biases toward one outcome over another.</li>
        <li><strong>Why is Integer.MIN_VALUE special?</strong> -MIN_VALUE overflows. The negation
        is undefined in two&apos;s complement; you must promote to long or handle it as a
        special case.</li>
        <li><strong>How do you count factors of a prime in n!?</strong> n / p + n / p² + n / p³ +
        ... — each level counts multiples of higher powers.</li>
        <li><strong>How does the Sieve of Eratosthenes start at p * p?</strong> All composites less
        than p * p with smallest prime factor at least p have already been marked by smaller
        primes.</li>
        <li><strong>How do you avoid floating-point in slope comparisons?</strong> Reduce dy and
        dx by gcd; compare as pairs. Or compare via cross-multiplication: (dy1 / dx1) =
        (dy2 / dx2) iff dy1 * dx2 = dy2 * dx1.</li>
        <li><strong>What is the modular inverse of 2 mod 10^9 + 7?</strong> By Fermat&apos;s little
        theorem, 2^(10^9 + 5) mod (10^9 + 7), computed with fast exponentiation.</li>
        <li><strong>Why use 10^9 + 7 as a modulus?</strong> It is prime, so modular inverses always
        exist for non-zero residues. Its size keeps multiplications within 63 bits, avoiding
        overflow on long math.</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Cormen, Leiserson, Rivest, Stein, <em>Introduction to Algorithms</em>, chapter 31
        (Number-Theoretic Algorithms). Knuth, <em>The Art of Computer Programming, Volume 2:
        Seminumerical Algorithms</em>, the canonical reference for arithmetic algorithms.</li>
        <li>Niven, Zuckerman, Montgomery, <em>An Introduction to the Theory of Numbers</em>, for
        deeper treatment of GCD, congruences, and Bezout. Crandall and Pomerance, <em>Prime
        Numbers: A Computational Perspective</em>, for sieves and primality testing.</li>
        <li>Leetcode tag &quot;math&quot; lists every problem in this pattern. Project Euler is a
        rich training ground that doubles as competitive-programming preparation. NeetCode 150
        covers 7, 50, 204, 172, 62, 149, 528.</li>
      </ul>
    </ArticleLayout>
  );
}
