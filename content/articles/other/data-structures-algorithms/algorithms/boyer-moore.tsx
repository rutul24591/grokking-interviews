"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "boyer-moore",
  title: "Boyer-Moore String Matching",
  description:
    "Sublinear average-case substring search using right-to-left comparison with bad-character and good-suffix heuristics — the algorithm behind grep, ripgrep, and libc's strstr.",
  category: "other",
  subcategory: "algorithms",
  slug: "boyer-moore",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-20",
  tags: ["string-matching", "boyer-moore", "horspool", "two-way", "grep", "algorithms"],
  relatedTopics: ["kmp", "rabin-karp"],
};

export default function BoyerMooreArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
      <p className="mb-4">
        The Boyer-Moore algorithm, published by Robert S. Boyer and J Strother Moore in 1977, finds occurrences of a
        pattern P of length m inside a text T of length n. Unlike naive scanning or KMP, Boyer-Moore compares the
        pattern to the text right-to-left and, on a mismatch, uses precomputed tables to shift the pattern forward by
        as many characters as possible — often by the full length of the pattern. The result is the only widely-used
        general-purpose string matcher whose average-case complexity is sublinear: roughly O(n/m) on natural-language
        text and source code.
      </p>
      <p className="mb-4">
        That sublinear behavior comes from a simple observation. If we align P at position i in T and the very last
        character of the alignment, T[i+m-1], does not appear anywhere in P, then no alignment of P that overlaps
        T[i+m-1] can possibly match. We can shift i by m positions in a single step, never having looked at
        T[i..i+m-2]. The longer the pattern and the larger the alphabet, the more characters we get to skip.
      </p>
      <p className="mb-4">
        Boyer-Moore is the algorithmic ancestor of nearly every fast literal substring matcher in production. GNU grep,
        ripgrep, glibc&apos;s memmem, vim&apos;s plain search, antivirus signature scanners, and intrusion-detection
        engines all descend from its skip-and-verify pattern, even when the exact variant they use (Horspool, Sunday,
        Two-Way, Turbo-BM) differs in detail.
      </p>
      <p className="mb-4">
        For staff and principal engineers, Boyer-Moore is the reference implementation for understanding the broader
        principle that <em>preprocessing the pattern</em> often beats preprocessing the text. It also illustrates a
        recurring tension in modern systems: hand-tuned algorithmic cleverness versus brute-force SIMD throughput.
        Modern grep variants combine both — algorithmic skips to amortize work, hardware vector instructions to scan
        within a window — and Boyer-Moore is the algorithm at the center of that conversation.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
      <p className="mb-4">
        The algorithm maintains an alignment position i in T. At each step it compares P[m-1] to T[i+m-1], then
        P[m-2] to T[i+m-2], and so on, walking right-to-left. If all m comparisons succeed, an occurrence is reported
        at i. On the first mismatch, the algorithm chooses a shift — how far to move i forward — using two
        independent rules: the bad-character rule and the good-suffix rule. The actual shift is the maximum of the two,
        because both rules produce <em>safe</em> shifts (they cannot skip over a real match).
      </p>
      <p className="mb-4">
        The <strong>bad-character rule</strong> reacts to the specific text character that caused the mismatch. Suppose
        we mismatched at P[j] with text character c = T[i+j]. We want to shift P forward so that the rightmost
        occurrence of c in P[0..j-1] aligns with position i+j. If c does not occur in P[0..j-1] at all, we can shift
        past it entirely: i becomes i + j + 1. Preprocessing builds a table BadChar[c] for each character c in the
        alphabet, storing the rightmost index of c in P. The shift becomes max(1, j - BadChar[c]).
      </p>
      <p className="mb-4">
        The <strong>good-suffix rule</strong> reacts to the suffix of P we already matched before the mismatch. If we
        matched suffix P[j+1..m-1] (call it the &quot;good suffix&quot;) and then mismatched at P[j], we want to shift
        P so that another occurrence of that good suffix in P aligns with the matched region of T — but with a
        different character preceding it (otherwise the same mismatch will recur). If no such occurrence exists, we
        fall back to the longest prefix of P that matches a suffix of the good suffix. The good-suffix table is
        computed in O(m) time using techniques closely related to KMP&apos;s failure function but applied to suffixes.
      </p>
      <p className="mb-4">
        On a full match, both heuristics still apply: we slide forward by the length of the period of P (the
        good-suffix value for j = -1) so that the next possible occurrence starts where the prior match ended, minus
        any overlap.
      </p>
      <p className="mb-4">
        The right-to-left scan is the key insight. Naive scanning compares left-to-right and learns nothing about
        whether to skip the next text characters. By scanning right-to-left, a mismatch on T[i+j] tells us about a
        character m-1-j positions ahead of the leftmost text position we&apos;ve touched, which is exactly the
        information we need to shift past entire blocks.
      </p>
      <ArticleImage
        src="/diagrams/other/data-structures-algorithms/algorithms/boyer-moore-diagram-1.svg"
        alt="Boyer-Moore algorithm: right-to-left scan with bad-character and good-suffix heuristics"
        caption="Right-to-left scan; shift = max(bad-character, good-suffix). Average O(n/m), worst O(n) with Galil's rule."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
      <p className="mb-4">
        Preprocessing has two phases. First, the bad-character table: a length-σ array indexed by alphabet character,
        each entry recording the rightmost position in P where that character appears, or -1 if absent. For ASCII this
        is 256 ints; for Unicode you either fold to a smaller working alphabet or replace the array with a hash table.
        Total time: O(σ + m).
      </p>
      <p className="mb-4">
        Second, the good-suffix table, which has two arrays of length m+1. The first records, for each suffix length k,
        the shift to use if a suffix of length k matched and the character before it mismatched. It is computed in O(m)
        using a Z-function-like sweep. The second handles the fallback case where no internal occurrence of the good
        suffix exists — it stores, for each k, the longest prefix of P that is also a suffix of P[0..k-1]. Together
        they ensure shifts are always safe and as large as possible.
      </p>
      <p className="mb-4">
        The search loop is then straightforward. Start with i = 0. While i ≤ n - m: set j = m - 1; while j ≥ 0 and
        P[j] = T[i+j], decrement j. If j becomes -1, we found a match at i; report and shift by GoodSuffix[0] (the
        period). Otherwise, c = T[i+j], and shift = max(GoodSuffix[j+1], j - BadChar[c]). Advance i by shift.
      </p>
      <p className="mb-4">
        With Galil&apos;s rule, after a successful match or after matching part of a good suffix, we remember the
        rightmost text position we&apos;ve already verified. On the next alignment, we don&apos;t re-compare those
        characters — they&apos;re already known to match. This bound on re-comparisons turns the worst case from O(n·m)
        into O(n + m) without changing the average case.
      </p>
      <ArticleImage
        src="/diagrams/other/data-structures-algorithms/algorithms/boyer-moore-diagram-2.svg"
        alt="Boyer-Moore vs KMP vs Rabin-Karp: when each algorithm wins"
        caption="BM dominates on long patterns and large alphabets; KMP on small alphabets and streaming; Rabin-Karp on multi-pattern."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
      <p className="mb-4">
        Compared with KMP, Boyer-Moore is faster on average for long patterns over large alphabets but slower for very
        short patterns and small alphabets like DNA, where the bad-character table buys little (the rightmost
        occurrence is rarely more than a few characters back) and KMP&apos;s simpler inner loop wins on cache and
        branch prediction. KMP also has a deterministic O(n) bound without needing Galil&apos;s rule and supports
        streaming input where Boyer-Moore&apos;s right-to-left scan inside an alignment requires lookahead.
      </p>
      <p className="mb-4">
        Compared with Rabin-Karp, Boyer-Moore is much better for single-pattern search but loses for multi-pattern
        same-length matching, where Rabin-Karp&apos;s rolling hash finds any of k patterns in one pass. For multiple
        short patterns, Aho-Corasick is the right answer — a multi-pattern KMP that runs in O(n + total pattern
        length + matches).
      </p>
      <p className="mb-4">
        Compared with the brute-force naive matcher, Boyer-Moore is dramatically faster on natural text but adds O(σ +
        m) preprocessing. For tiny patterns (m ≤ 4) and short texts, the preprocessing cost can dominate; libc&apos;s
        strstr typically uses naive or two-way scanning for very short needles.
      </p>
      <p className="mb-4">
        Compared with SIMD memchr-based scanning (the dominant approach in ripgrep and modern grep), Boyer-Moore loses
        on raw throughput for short needles. Hardware vector instructions can scan 16 or 32 bytes per cycle for a
        single anchor character, while Boyer-Moore processes a few characters per cycle algorithmically. Modern fast
        matchers therefore combine the two: SIMD scan for the rare anchor character, then BM-style shift-and-verify
        from each candidate position.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
      <p className="mb-4">
        Always use Galil&apos;s rule (or Turbo-BM, which subsumes it) in production. The unbounded worst case of plain
        Boyer-Moore is a real DoS surface: an attacker who controls both pattern and text can construct inputs that
        force O(n·m) comparisons. Galil&apos;s adds a few lines of code and bounds re-comparisons.
      </p>
      <p className="mb-4">
        For ASCII or Latin-1 alphabets, use a 256-entry bad-character array. For Unicode, hash the rightmost-occurrence
        table — but only after deciding whether to operate on bytes (UTF-8) or code points. Byte-level matching is
        usually faster and correct as long as the pattern is also UTF-8 encoded; code-point-level matching is needed
        only for case-insensitive or normalization-aware search.
      </p>
      <p className="mb-4">
        Benchmark with realistic patterns and texts. Synthetic worst-case inputs make Boyer-Moore look bad; real
        English, source code, and binary signatures make it look great. Pattern length, alphabet size, and pattern
        composition (repetitive vs. random) all matter, and the right algorithm depends on the workload.
      </p>
      <p className="mb-4">
        Combine with SIMD anchoring for short patterns. Pick the rarest character in the pattern (or the last byte) as
        the anchor, scan with vectorized memchr to find candidates, then verify with full pattern comparison. This is
        what ripgrep and Hyperscan do, and it dominates pure Boyer-Moore for m &lt; 16 on modern hardware.
      </p>
      <p className="mb-4">
        For repeated searches with the same pattern, cache the preprocessing tables. If you&apos;re grepping a million
        files for the same regex literal, you should compute BadChar and GoodSuffix once. Most production grep
        implementations expose a precompiled-pattern API for exactly this reason.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
      <p className="mb-4">
        <strong>Forgetting Galil&apos;s rule and shipping plain BM.</strong> The textbook three-page implementation is
        O(n·m) worst case. On adversarial input, that&apos;s a DoS. Always include the re-comparison bound.
      </p>
      <p className="mb-4">
        <strong>Using a plain array bad-character table for Unicode.</strong> A 1.1-million-entry int array is 4 MB per
        compiled pattern, and most entries are -1. Use a hash table or fold to a smaller working alphabet.
      </p>
      <p className="mb-4">
        <strong>Implementing right-to-left scan inefficiently.</strong> A common bug is allocating a substring per
        comparison or using high-level string indexing in languages with non-O(1) char access (Python str indexing is
        O(1) but JavaScript with surrogate pairs is not). Operate on byte arrays.
      </p>
      <p className="mb-4">
        <strong>Cache misses from large skips.</strong> Skipping forward by m on a multi-gigabyte text kills the
        sequential prefetcher. For very long texts and short patterns, a cache-friendly linear scan with SIMD often
        beats algorithmic skips. Profile, don&apos;t assume.
      </p>
      <p className="mb-4">
        <strong>Mishandling case-insensitive search.</strong> Folding both pattern and text per-comparison is slow.
        Pre-fold the pattern once and build BadChar/GoodSuffix on the folded form, then fold each text byte during
        comparison via a 256-byte lookup table. Don&apos;t call toupper inside the inner loop.
      </p>
      <p className="mb-4">
        <strong>Reporting overlapping vs non-overlapping matches inconsistently.</strong> After a match at i, do you
        shift by 1 (find overlaps) or by the period (no overlaps)? Document and test both behaviors. grep reports
        non-overlapping; some signature scanners need overlapping.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
      <p className="mb-4">
        <strong>GNU grep and ripgrep.</strong> Both use BM-derived literal matchers as the inner kernel of regex
        searches that have a literal &quot;required factor.&quot; ripgrep&apos;s memchr-based prefilter combined with
        Two-Way verification is the modern descendant of Boyer-Moore-Horspool, and it&apos;s why ripgrep can scan
        gigabytes per second.
      </p>
      <p className="mb-4">
        <strong>glibc memmem and strstr.</strong> Use the Two-Way algorithm by Crochemore and Perrin, a Boyer-Moore
        cousin with O(1) extra space and O(n) worst case. The two-way scan combines forward and backward comparisons
        with a critical-factorization preprocessing step, giving the same skip behavior with better worst-case
        guarantees.
      </p>
      <p className="mb-4">
        <strong>Antivirus signature scanning.</strong> Engines like ClamAV combine Aho-Corasick (for many short
        signatures) with Boyer-Moore (for long signatures where skip-based scanning dominates). Signature scanning is
        a textbook BM workload: long patterns, large alphabets (binary), many files.
      </p>
      <p className="mb-4">
        <strong>Network intrusion detection.</strong> Snort and Suricata match content rules against packet payloads
        using BM variants. Hyperscan, Intel&apos;s open-source regex engine, generalizes the idea with SIMD-accelerated
        multi-pattern matching but inherits the BM heritage of skip-based scanning.
      </p>
      <p className="mb-4">
        <strong>Editor &quot;Find&quot;.</strong> vim, emacs, VS Code, and Sublime all use BM-Horspool or similar for
        plain literal search. The pattern is short and the text is small, so the constant factors dominate, but BM is
        still measurably faster than naive scan for typical English search terms.
      </p>
      <p className="mb-4">
        <strong>Database LIKE queries.</strong> Some database engines (PostgreSQL, MySQL with certain configurations)
        use BM internally for fixed substring patterns in LIKE &apos;%foo%&apos; queries against unindexed text
        columns. The optimizer chooses between full-table BM scan and a trigram or prefix index based on selectivity.
      </p>
      <p className="mb-4">
        <strong>Bioinformatics short-read alignment.</strong> While BWT-based tools like BWA and Bowtie dominate
        modern read alignment, BM and its variants are used in older tools and in approximate-matching frontends where
        a literal seed needs to be found before extension. DNA&apos;s small alphabet (σ = 4) limits BM&apos;s
        advantage, so KMP or hash-based seeding is often preferred.
      </p>
      <ArticleImage
        src="/diagrams/other/data-structures-algorithms/algorithms/boyer-moore-diagram-3.svg"
        alt="Boyer-Moore in production: grep, ripgrep, glibc, antivirus, IDS"
        caption="BM and its descendants power most modern fast literal matchers, often combined with SIMD anchoring."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
      <p className="mb-4">
        <strong>Why does Boyer-Moore scan right-to-left?</strong> Because a mismatch on the rightmost compared
        character gives information about characters far to the right of the alignment&apos;s leftmost position,
        enabling large skips. Left-to-right scanning learns nothing about future characters and so cannot skip past
        them safely.
      </p>
      <p className="mb-4">
        <strong>Walk through finding &quot;EXAMPLE&quot; in a long text using bad-character.</strong> Align P at i = 0.
        Compare P[6] = &apos;E&apos; to T[6]. If T[6] is, say, &apos;X&apos;, look up BadChar[&apos;X&apos;] = 1
        (rightmost X in EXAMPLE). Shift = 6 - 1 = 5. Continue from i = 5. The interviewer is checking that you can
        compute shift = j - BadChar[c] correctly and handle the c-not-in-P case.
      </p>
      <p className="mb-4">
        <strong>What&apos;s the worst case and how do you eliminate it?</strong> O(n·m) without Galil&apos;s rule, on
        inputs where the bad-character and good-suffix shifts both stay small (e.g., highly repetitive patterns).
        Galil&apos;s rule bounds re-comparisons by remembering the rightmost verified text position, giving O(n) worst
        case.
      </p>
      <p className="mb-4">
        <strong>When would you choose KMP over Boyer-Moore?</strong> Streaming input that cannot back up, very small
        alphabets (DNA), very short patterns, hard real-time deadlines that need a deterministic O(n) without
        Galil&apos;s implementation complexity, or when preprocessing memory is tight.
      </p>
      <p className="mb-4">
        <strong>How does Boyer-Moore-Horspool differ from full Boyer-Moore?</strong> Horspool uses only the
        bad-character rule and uses the rightmost character of the alignment (T[i+m-1]) to look up the shift, ignoring
        which position mismatched. Simpler code, slightly worse worst case, often faster in practice on natural text
        because the inner loop is tighter.
      </p>
      <p className="mb-4">
        <strong>How do production tools beat textbook Boyer-Moore?</strong> SIMD anchor-character scanning to find
        candidates, then BM-style shift-and-verify; precomputed tables cached across many searches; byte-level (not
        character-level) operation; Two-Way for O(1) extra space; Turbo-BM for guaranteed 2n-1 comparisons.
      </p>
      <p className="mb-4">
        <strong>How would you extend BM to multi-pattern matching?</strong> The classic answer is Commentz-Walter, a
        BM-style multi-pattern algorithm using a reverse trie of the patterns plus bad-character and good-suffix
        analogs. In practice, Aho-Corasick or Hyperscan dominates for multi-pattern.
      </p>
      <p className="mb-4">
        <strong>Why is Two-Way preferred over BM in glibc?</strong> O(1) extra space (no σ-sized table), guaranteed
        O(n) worst case without Galil-style bookkeeping, and competitive average performance. glibc cares about memory
        footprint and predictable worst case more than peak throughput on long patterns.
      </p>
      <p className="mb-4">
        <strong>Design grep for log files.</strong> Memory-map files, SIMD scan for first character of literal, BM
        verify, line-boundary detection via memchr for &apos;\n&apos;, parallel across files. Discuss heuristic
        selection between literal BM, regex VM, and DFA based on pattern shape, and how to handle very large files
        without loading them into memory.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
      <p className="mb-4">
        Boyer and Moore&apos;s 1977 paper &quot;A Fast String Searching Algorithm&quot; in Communications of the ACM is
        the original. Galil&apos;s 1979 paper &quot;On Improving the Worst-Case Running Time of the Boyer-Moore String
        Matching Algorithm&quot; introduced the rule that linearizes the worst case. Horspool&apos;s 1980 simplification
        is often the practical choice. Crochemore and Perrin&apos;s 1991 Two-Way algorithm is the basis for
        glibc&apos;s strstr.
      </p>
      <p className="mb-4">
        Crochemore and Rytter&apos;s &quot;Jewels of Stringology&quot; and Gusfield&apos;s &quot;Algorithms on Strings,
        Trees, and Sequences&quot; both contain rigorous treatments. Sedgewick &amp; Wayne&apos;s &quot;Algorithms&quot;
        gives a very accessible walk-through with code. The CLRS chapter on string matching covers BM as part of a
        broader survey.
      </p>
      <p className="mb-4">
        For modern engineering perspective, read Andrew Gallant&apos;s ripgrep blog posts and the source of the
        memchr, aho-corasick, and bstr Rust crates. Intel&apos;s Hyperscan paper describes how SIMD and BM-style
        skipping combine in a production multi-pattern engine. The glibc string.h source is a master class in
        practical Two-Way implementation.
      </p>
      <p className="mb-4">
        For interview preparation, implement Boyer-Moore from scratch, then add Galil&apos;s rule, then convert to
        Horspool, then to Sunday&apos;s. Each variant takes only a few dozen lines but illuminates a different aspect
        of the design space — exactly the kind of incremental implementation a staff-level interviewer wants you to
        be comfortable with on a whiteboard.
      </p>
    </ArticleLayout>
  );
}
