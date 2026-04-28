"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "bit-manipulation",
  title: "Bit Manipulation Pattern",
  description:
    "Bitwise operations, XOR identities, popcount tricks, and bitmask DP — the toolkit for compact set representation and constant-factor speedups.",
  category: "other",
  subcategory: "patterns",
  slug: "bit-manipulation",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-26",
  tags: ["bit-manipulation", "bitmask", "xor", "leetcode", "patterns"],
  relatedTopics: ["math", "dynamic-programming", "trie"],
};

export default function BitManipulationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
      <p className="mb-4">
        Bit manipulation uses the binary representation of integers as a first-class data
        structure. Each bit is a flag, each integer is a set, and bitwise operators are the
        algebra. The pattern&apos;s win is twofold: a 32-bit int can represent any subset of a
        32-element universe in O(1) memory, and bitwise operations compute on all bits in
        parallel — a single AND tests all 32 flags at once. For problem sizes that fit in 30 to
        60 bits, this is the difference between brute force and feasible.
      </p>
      <p className="mb-4">
        Recognition signals: the problem mentions binary representation, parity, XOR, set
        membership of a small universe, &quot;every element appears twice except&quot;, &quot;
        count the bits&quot;, &quot;subsets&quot;, &quot;maximum XOR&quot;. Implicit signals
        include constraints like n ≤ 20 (bitmask DP fits) or operations on integers without
        explicit set machinery.
      </p>
      <p className="mb-4">
        The pattern matters because it appears in low-level system code, hash table internals,
        cryptographic primitives, networking flag fields, and SIMD-style algorithms. Mastering
        bit manipulation in interviews demonstrates comfort with the bare metal of computation
        — a marker of seniority.
      </p>
      <p className="mb-4">
        At staff level, bit manipulation also appears in subtle places: the way an HLL
        cardinality estimator counts leading zeros, the way a Bloom filter stores set
        membership, the way a B-tree key comparison fast-paths via XOR-of-cache-lines. The
        in-memory tricks transfer up the stack.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
      <p className="mb-4">
        <strong>Six operators.</strong> AND (and; intersection of bits), OR (or; union of bits),
        XOR (exclusive-or; toggle/parity), NOT (one&apos;s complement), shift left (multiply by
        powers of two), shift right (divide). Java distinguishes arithmetic right shift (&gt;&gt;,
        sign-extending) from logical right shift (&gt;&gt;&gt;, zero-filling); Python only has
        arithmetic; C and JavaScript have both with type quirks.
      </p>
      <p className="mb-4">
        <strong>Bit primitives.</strong> Set bit i: x | (1 &lt;&lt; i). Clear bit i: x &amp;
        ~(1 &lt;&lt; i). Toggle bit i: x ^ (1 &lt;&lt; i). Test bit i: (x &gt;&gt; i) &amp; 1.
        These four are the lingua franca of every bit-fiddling algorithm.
      </p>
      <p className="mb-4">
        <strong>Lowest set bit.</strong> x &amp; -x isolates the lowest set bit. This is a
        consequence of two&apos;s complement: -x flips all bits and adds one, leaving only the
        original lowest set bit aligned with itself. Used in Fenwick trees and popcount tricks.
      </p>
      <p className="mb-4">
        <strong>Clear lowest set bit.</strong> x &amp; (x - 1) clears the lowest set bit.
        Repeating until x = 0 counts the set bits — Brian Kernighan&apos;s popcount, O(popcount)
        instead of O(width).
      </p>
      <p className="mb-4">
        <strong>XOR identities.</strong> x ^ x = 0, x ^ 0 = x, XOR is associative and
        commutative. The folklore consequences: XOR of all elements where each appears twice
        except one survivor returns the survivor; XOR can swap two variables in place; XOR
        partitions an array into two single-occurrence elements once you find a differing bit.
      </p>
      <p className="mb-4">
        <strong>Power of two.</strong> x is a power of two iff x &gt; 0 and (x &amp; (x - 1)) ==
        0. The single set bit is unique. Useful in capacity-doubling algorithms and alignment
        checks.
      </p>
      <p className="mb-4">
        <strong>Bitmask as set.</strong> For a universe of size n ≤ 30, an int can represent
        any subset. Membership test is (mask &gt;&gt; i) &amp; 1 in O(1). Union is OR;
        intersection is AND; symmetric difference is XOR; complement is XOR with the universal
        mask (1 &lt;&lt; n) - 1. Bitmask DP exploits this: state is dp[mask].
      </p>
      <p className="mb-4">
        <strong>Submask enumeration.</strong> The trick `s = (s - 1) &amp; mask` walks through
        all submasks of mask in decreasing order. Total work across all masks is O(3^n) — each
        index is visited 3^n times because each element is independently either in mask, in
        submask, or in mask but not in submask. Used in partition DP problems.
      </p>
      <p className="mb-4">
        <strong>Bit-trie.</strong> A binary trie where each level corresponds to a bit position.
        Used for maximum XOR (Leetcode 421) and maximum AND-pair problems. At each level, choose
        the opposite bit if it exists to maximise the XOR.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/bit-manipulation-diagram-1.svg" alt="Bit manipulation toolkit" />

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
      <p className="mb-4">
        The single-number template (Leetcode 136): XOR all elements; the result is the unique
        survivor because each duplicated value cancels. O(n) time, O(1) space.
      </p>
      <p className="mb-4">
        For 137 (single number II — every element appears three times except one), the trick
        is to count each bit position modulo 3. Two integers ones and twos act as a 2-bit
        counter: ones tracks the bits seen once, twos tracks the bits seen twice; bits seen
        three times are cleared from both. After processing, ones holds the survivor.
      </p>
      <p className="mb-4">
        For 260 (single number III — exactly two unique numbers among pairs), XOR everything
        to get the XOR of the two unique numbers; isolate any set bit via XOR &amp; -XOR; this
        bit differs between the two unique numbers; partition the array by that bit, XOR each
        group, get both unique numbers.
      </p>
      <p className="mb-4">
        The popcount template (Leetcode 191): Brian Kernighan&apos;s algorithm. count = 0;
        while x: x &amp;= (x - 1); count += 1. Returns in popcount(x) iterations. Faster than
        bit-by-bit when most bits are zero.
      </p>
      <p className="mb-4">
        The counting-bits DP template (Leetcode 338): for i in 1..n, f[i] = f[i &gt;&gt; 1] +
        (i &amp; 1). Each number is its half plus its lowest bit. O(n) time and space.
      </p>
      <p className="mb-4">
        The subsets template (Leetcode 78): for mask = 0; mask &lt; (1 &lt;&lt; n); mask += 1,
        emit the elements indicated by the bits of mask. 2^n subsets, each emitted in O(n).
      </p>
      <p className="mb-4">
        The bitmask DP template for path/coverage problems: state is (current_position,
        visited_mask). Transitions add unvisited neighbours, setting the corresponding bit.
        Examples: 847 (shortest path visiting all nodes), 1494 (parallel courses).
      </p>
      <p className="mb-4">
        The bit-trie template for maximum XOR: insert each number bit by bit (high to low)
        into a binary trie. For each query, walk the trie, choosing the opposite bit at each
        level when available. The traversal cost is O(W) for a W-bit integer.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
      <p className="mb-4">
        <strong>Bitmask DP vs. recursive backtracking.</strong> Bitmask DP enumerates all 2^n
        states explicitly with memoisation, O(2^n) states, O(n) transitions — total O(n * 2^n).
        Backtracking explores the same space but typically without memoisation, costing O(n!).
        Bitmask DP wins by a factorial factor when subproblems repeat.
      </p>
      <p className="mb-4">
        <strong>XOR-based set vs. hashset.</strong> XOR identifies single occurrences in a
        stream of pairs in O(1) memory. Hashset solves a more general problem (count, locate)
        but uses O(n) memory. Use XOR when the problem is the special &quot;all but one
        appear twice&quot; structure.
      </p>
      <p className="mb-4">
        <strong>Brian Kernighan vs. shift-and-mask popcount.</strong> Kernighan is O(popcount).
        Shift-and-mask is O(W). Built-in popcount instructions (Java&apos;s
        Integer.bitCount, C&apos;s __builtin_popcount, Python&apos;s int.bit_count() since 3.10)
        are O(1) on modern hardware via the POPCNT instruction.
      </p>
      <p className="mb-4">
        <strong>Bit-trie vs. hashmap for max XOR.</strong> Hashmap-based solutions exist (insert
        bit-by-bit prefixes, look up complement) and run O(nW). Bit-trie has the same
        asymptotic but cleaner code and slightly better cache behaviour.
      </p>
      <p className="mb-4">
        <strong>Bitmask vs. bitset.</strong> A 32-bit int handles up to 32 elements. For larger
        universes, use long (64), an array of longs (BitSet in Java, int[][] in C++). The same
        algorithms work; the operators become loops over the words.
      </p>
      <p className="mb-4">
        <strong>Logical vs. arithmetic shift.</strong> Java&apos;s &gt;&gt; is arithmetic;
        &gt;&gt;&gt; is logical. For unsigned interpretations of bit patterns (Hamming weight,
        bit reversals), use &gt;&gt;&gt; or cast to a wider type to avoid sign extension.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/bit-manipulation-diagram-2.svg" alt="Bitmask DP and submask enumeration" />

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
      <p className="mb-4">
        <strong>Use language built-ins for popcount.</strong> Integer.bitCount, __builtin_popcount,
        x.bit_count() — all O(1) on modern hardware. Implement Kernighan only when not
        available.
      </p>
      <p className="mb-4">
        <strong>Use unsigned shift for cross-language portability.</strong> &gt;&gt;&gt; in Java
        avoids sign-extension surprises when treating ints as bit patterns.
      </p>
      <p className="mb-4">
        <strong>Validate that n fits in the integer width.</strong> 32-bit int holds 32-element
        masks; long holds 64. For n &gt; 64, use BitSet or arrays.
      </p>
      <p className="mb-4">
        <strong>Comment intent.</strong> Bit-fiddling code is dense. A single comment like
        &quot;clear lowest set bit&quot; makes it readable.
      </p>
      <p className="mb-4">
        <strong>Use named constants.</strong> 0x55555555 for the alternating pattern; (1 &lt;&lt;
        n) - 1 for the universal mask. Magic numbers in bit code are pure noise.
      </p>
      <p className="mb-4">
        <strong>For bitmask DP, allocate dp of size 1 &lt;&lt; n.</strong> Off-by-one between
        2^n and 2^n - 1 is the most common indexing bug.
      </p>
      <p className="mb-4">
        <strong>Iterate bits with x &amp; -x.</strong> Each iteration extracts one set bit and
        clears it; loops over set bits in O(popcount(x)) instead of O(width).
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
      <p className="mb-4">
        <strong>Sign-extension on right shift.</strong> Negative ints in Java with &gt;&gt; do
        not behave as you expect for bit-pattern operations. Use &gt;&gt;&gt;.
      </p>
      <p className="mb-4">
        <strong>Off-by-one on shift amounts.</strong> 1 &lt;&lt; 32 is undefined behaviour in
        many languages. Use long (1L &lt;&lt; n) when n approaches the integer width.
      </p>
      <p className="mb-4">
        <strong>XOR on negative numbers in Python.</strong> Python ints are arbitrary precision
        and the binary representation extends infinitely on the left for negatives. For 32-bit
        XOR semantics, mask with 0xFFFFFFFF.
      </p>
      <p className="mb-4">
        <strong>Mixing AND with logical and.</strong> &amp; is bitwise; &amp;&amp; is logical.
        Mixing them changes operator precedence and produces wrong results.
      </p>
      <p className="mb-4">
        <strong>Forgetting parentheses.</strong> Bitwise operators have low precedence; ((x
        &amp; mask) == y) needs the inner parentheses or it becomes x &amp; (mask == y).
      </p>
      <p className="mb-4">
        <strong>Bitmask DP with n &gt; 20.</strong> 2^20 is a million; 2^25 is 33 million; 2^30
        is a billion. Memory and time blow up cubically — confirm the constraint before
        committing.
      </p>
      <p className="mb-4">
        <strong>Treating XOR as equality.</strong> XOR returns the differing bits; &quot;equal&quot;
        means the result is zero, not literally true. (a ^ b) == 0 is the equality test.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases (Canonical Leetcode)</h2>
      <p className="mb-4">
        <strong>136. Single Number.</strong> XOR of all elements.
      </p>
      <p className="mb-4">
        <strong>137. Single Number II.</strong> Bit-by-bit count mod 3, or the two-counter
        trick.
      </p>
      <p className="mb-4">
        <strong>260. Single Number III.</strong> XOR everything, isolate a differing bit,
        partition.
      </p>
      <p className="mb-4">
        <strong>191. Number of 1 Bits.</strong> Brian Kernighan or built-in popcount.
      </p>
      <p className="mb-4">
        <strong>338. Counting Bits.</strong> DP on f[i] = f[i &gt;&gt; 1] + (i &amp; 1).
      </p>
      <p className="mb-4">
        <strong>461. Hamming Distance.</strong> popcount(a ^ b).
      </p>
      <p className="mb-4">
        <strong>78. Subsets.</strong> Iterate masks 0 to 2^n - 1.
      </p>
      <p className="mb-4">
        <strong>187. Repeated DNA Sequences.</strong> Encode each 10-letter sequence as a
        20-bit integer; sliding-window with a hashset of seen integers.
      </p>
      <p className="mb-4">
        <strong>421. Maximum XOR of Two Numbers.</strong> Bit-trie greedy descent.
      </p>
      <p className="mb-4">
        <strong>1255. Maximum Score Words.</strong> Bitmask over selected words; DP or brute
        force enumeration.
      </p>
      <p className="mb-4">
        <strong>1457. Pseudo-Palindromic Paths.</strong> XOR a digit-bit on the path; a path
        is pseudo-palindromic iff popcount of the final mask is at most 1.
      </p>
      <p className="mb-4">
        <strong>847. Shortest Path Visiting All Nodes.</strong> BFS over (node, mask). Mask
        encodes visited set.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/bit-manipulation-diagram-3.svg" alt="Canonical bit manipulation Leetcode problems" />

      <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>Why does XOR find the unique element among pairs?</strong> XOR is associative
        and commutative; pairs cancel to zero; the survivor is the only one not cancelled.</li>
        <li><strong>How does Brian Kernighan&apos;s popcount work?</strong> x &amp; (x - 1) clears
        the lowest set bit. The iteration count equals the number of set bits.</li>
        <li><strong>Why is x &amp; -x the lowest set bit?</strong> -x in two&apos;s complement is
        ~x + 1. The +1 propagates carries through the trailing zeros, leaving the lowest set
        bit aligned in both x and -x.</li>
        <li><strong>How do you check power of two?</strong> x &gt; 0 and x &amp; (x - 1) == 0.</li>
        <li><strong>What is the time complexity of bitmask DP for TSP?</strong> O(n² * 2^n). 2^n
        states for the visited mask; n positions for the current node; n transitions for the
        next node.</li>
        <li><strong>Why is submask enumeration O(3^n) total?</strong> Each pair (mask, submask)
        with submask a subset of mask corresponds to a 3-way assignment per element: in
        submask, in mask but not submask, or in neither. 3^n such assignments.</li>
        <li><strong>How do you iterate set bits efficiently?</strong> while x: bit = x &amp; -x;
        process bit; x &amp;= x - 1. O(popcount) iterations.</li>
        <li><strong>Why &gt;&gt;&gt; instead of &gt;&gt;?</strong> &gt;&gt; sign-extends; &gt;&gt;&gt;
        zero-fills. For bit-pattern operations on Java ints, &gt;&gt;&gt; is required.</li>
        <li><strong>How does the bit-trie maximise XOR?</strong> At each bit, prefer the opposite
        bit of the query; the result XOR has a 1 at that position, which is the highest
        possible.</li>
        <li><strong>How would you implement a Bloom filter conceptually?</strong> A bit array of
        m bits, k hash functions; insert sets the k bits; lookup checks all k bits. False
        positives possible; false negatives impossible. Underlying mechanic is bitwise OR for
        insert and AND for membership testing — pure bit manipulation.</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Warren, <em>Hacker&apos;s Delight</em> — the canonical reference for bit-twiddling
        tricks. Knuth, <em>The Art of Computer Programming, Volume 4A: Combinatorial
        Algorithms, Part 1</em>, contains exhaustive treatment of bitwise techniques.</li>
        <li>Sean Eron Anderson&apos;s &quot;Bit Twiddling Hacks&quot; collection documents dozens of
        clever bit manipulations. The Java standard library Integer and Long classes contain
        utility methods worth knowing (numberOfLeadingZeros, highestOneBit).</li>
        <li>Leetcode tag &quot;bit manipulation&quot; lists every canonical problem. NeetCode 150
        covers 136, 191, 338, 7, 268, 190. Competitive-programming sites like Codeforces are a
        rich source of bitmask DP problems for deeper practice.</li>
      </ul>
    </ArticleLayout>
  );
}
