"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "kmp",
  title: "Knuth-Morris-Pratt (KMP)",
  description:
    "Linear-time exact string matching via the failure function — the LPS array, the no-text-backtrack invariant, and how KMP generalizes to Z-algorithm, Aho-Corasick, and string-period analysis.",
  category: "other",
  subcategory: "algorithms",
  slug: "kmp",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-20",
  tags: [
    "kmp",
    "string-matching",
    "failure-function",
    "lps-array",
    "z-algorithm",
    "aho-corasick",
  ],
  relatedTopics: [
    "rabin-karp",
    "boyer-moore",
    "trie",
    "string",
  ],
};

export default function KMPArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p>
          The Knuth-Morris-Pratt algorithm (KMP) finds all occurrences of a
          pattern P of length m in a text T of length n in O(n + m) time —
          guaranteed worst case, with no dependence on alphabet size or
          input distribution. Its key insight: when a mismatch occurs after
          some characters of P have already matched, you don't need to
          re-examine those text characters; the pattern's own structure
          tells you the longest suffix of the matched portion that is also
          a prefix of P, so you can resume comparison there.
        </p>
        <p>
          Donald Knuth, James H. Morris, and Vaughan Pratt published the
          algorithm in 1977 — though Morris and Pratt had developed an
          earlier version in 1970, and Knuth refined the failure function
          analysis. The algorithm was the first to break the O(n·m) barrier
          of naive matching for the single-pattern case and remains the
          textbook reference for "linear-time string matching."
        </p>
        <p>
          KMP's importance is partly historical, partly pedagogical, and
          partly structural. Historically, it was the first proof that the
          O(n·m) wall was breakable. Pedagogically, the failure function
          (LPS — longest proper prefix that is also a suffix) is the
          gateway to a whole family of string algorithms: Z-algorithm
          (1977 too, similar bounds), Aho-Corasick (KMP generalized to a
          trie of patterns), suffix automata, and period analysis. If you
          know KMP, you know how to think about string structure.
        </p>
        <p>
          Practically, KMP is rarely the fastest single-pattern matcher in
          a benchmark — Boyer-Moore typically wins on long patterns over
          large alphabets, and SIMD-accelerated specialized matchers
          (memmem in glibc, ripgrep's Rust regex engine) often win on
          short patterns. But KMP has a unique advantage: its worst case is
          its average case. Boyer-Moore can degrade to O(n·m) on
          adversarial input; Rabin-Karp's worst case is O(n·m) under hash
          collisions; KMP is always O(n + m). This makes KMP the algorithm
          of choice when worst-case latency matters more than average-case
          throughput — real-time systems, network intrusion detection
          (with Aho-Corasick extension), and adversarial settings.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/kmp-diagram-1.svg"
          alt="KMP failure function and search loop"
          caption="The LPS (longest proper prefix = suffix) array and the search loop that never re-examines text characters."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p>
          The <em>failure function</em> (also called the LPS array) is the
          algorithm's beating heart. For a pattern P, lps[i] is the length
          of the longest proper prefix of P[0..i] that equals a suffix of
          P[0..i]. "Proper" means strictly shorter than the string itself
          (otherwise the trivial answer is the whole string). The intuition:
          if you've matched P[0..i] in the text and then a mismatch
          happens, lps[i] tells you how much of the prefix you can reuse
          rather than starting over.
        </p>
        <p>
          Computing the LPS array. Use two pointers: i (current position)
          and k (length of the longest border so far). Walk i from 1 to
          m-1. If P[i] == P[k], extend the border: lps[i] = ++k. Otherwise
          fall back: k = lps[k-1] (the next-shorter border) and retry. If
          k drops to 0 and still no match, lps[i] = 0. Total time O(m) —
          each character extends k at most once, and each fallback strictly
          decreases k, so the amortized cost per position is O(1).
        </p>
        <p>
          The search loop uses the same two-pointer logic against the text.
          i walks the text (never backwards); j tracks how much of the
          pattern matches the text ending at i. If T[i] == P[j], advance
          both. If j reaches m, report a match at i - m and fall back j =
          lps[j - 1] to look for overlapping matches. On mismatch with
          j &gt; 0, fall back j = lps[j - 1] without advancing i. On
          mismatch with j == 0, advance i.
        </p>
        <p>
          The <em>no-text-backtrack</em> invariant is what gives KMP its
          linearity. The text pointer i never decreases. Each iteration
          either advances i or strictly decreases j, and j is bounded by
          m, so the total number of iterations is at most n + m. This is
          also why KMP works on streaming text: you never need to revisit
          a character, so the algorithm processes text one character at a
          time with O(m) state.
        </p>
        <p>
          <strong>String periods.</strong> The LPS array reveals the
          period structure of the pattern. The smallest period of P[0..i]
          is i + 1 - lps[i]. If this period evenly divides i + 1, the
          prefix is a repetition (e.g., "abcabc" has period 3 dividing
          length 6). Period analysis underlies tandem-repeat detection in
          biology, music structure analysis, and text compression.
        </p>
        <p>
          <strong>Borders and the border tree.</strong> A "border" of a
          string is any prefix that is also a suffix; lps[i] is the
          longest non-trivial border. Following lps[i] → lps[lps[i] - 1]
          → ... gives all borders of P[0..i] in decreasing order.
          Counting and enumerating borders is a basic primitive in
          combinatorics on words.
        </p>
        <p>
          <strong>Z-algorithm.</strong> A close cousin of KMP: Z[i] is the
          length of the longest substring starting at i that matches a
          prefix of S. Built in O(|S|) with a "Z-box" sliding window. To
          search for P in T, compute Z over P + "$" + T (where $ is a
          delimiter not in either); any Z[i] ≥ m with i past the
          delimiter marks a match. Same asymptotic bound as KMP,
          conceptually simpler proofs, often preferred in competitive
          programming. KMP wins for streaming because it processes text
          one character at a time without lookahead.
        </p>
        <p>
          <strong>Aho-Corasick.</strong> KMP generalizes to a trie of
          multiple patterns. Build a trie of all patterns; compute
          "failure links" between trie nodes (analogous to the LPS array)
          via BFS; search the text against the trie, following failure
          links on mismatch. Total search time O(n + total matches +
          total pattern length). Used in classical antivirus signature
          matching, intrusion detection (Snort), and dictionary-based
          tokenizers.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p>
          KMP needs minimal state: an integer LPS array of length m, two
          integer cursors. Memory O(m); the text pointer is a single
          integer. This makes KMP attractive in embedded and streaming
          contexts where state must be tight.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/kmp-diagram-2.svg"
          alt="String-matching algorithms compared and Z-algorithm intro"
          caption="KMP within the broader family — Z-algorithm, Boyer-Moore, Rabin-Karp, Aho-Corasick — and where each shines."
        />
        <p>
          For streaming applications, KMP processes text one character at
          a time without buffering. Network intrusion detection systems
          watching packet payloads, log-tail alerting, and serial-port
          parsers all use this property: keep the LPS array and current
          j cursor in O(m) state, process incoming bytes immediately,
          report matches as they happen. Boyer-Moore can't do this
          cleanly because its skip heuristic requires lookahead.
        </p>
        <p>
          For multi-pattern matching, build an Aho-Corasick automaton:
          a trie of all patterns plus failure links. Once built (O(total
          pattern length)), search runs in O(text length + matches) — a
          single pass independent of pattern count. Snort and Suricata
          (network IDS) preprocess thousands of signatures into a single
          AC automaton and scan packets at line rate.
        </p>
        <p>
          For period detection in long strings, the LPS array is the
          input to a wide range of combinatorial-on-words algorithms:
          Lyndon decomposition, run detection, tandem-repeat detection,
          longest common factor with a fixed length. Bioinformatics tools
          (RepeatMasker, MISA) use these primitives to detect biological
          repeats.
        </p>
        <p>
          For practical libc string searching, glibc's memmem uses
          Two-Way (Crochemore-Perrin) — a hybrid that combines KMP-like
          period analysis with Boyer-Moore-style skipping. Two-Way
          achieves the linear worst case of KMP and the practical speed
          of Boyer-Moore. Most production string-search libraries use
          Two-Way or its variants rather than vanilla KMP.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p>
          <strong>KMP vs naive.</strong> Naive matching is O(n·m) worst
          case (e.g., P = "aaab", T = "aaaaaa..."). KMP eliminates the
          re-comparison of text characters, dropping to O(n + m). On
          random inputs, naive is often "fast enough" because mismatches
          fail quickly; KMP's win is on adversarial or structured inputs.
        </p>
        <p>
          <strong>KMP vs Boyer-Moore.</strong> Boyer-Moore can skip
          characters using bad-character and good-suffix heuristics,
          achieving sublinear average-case performance — O(n/m) on
          natural text with a large alphabet. But Boyer-Moore can
          degrade to O(n·m) on adversarial inputs. KMP guarantees O(n
          + m) always. Pick KMP for predictable latency, Boyer-Moore
          for average-case throughput on large alphabets.
        </p>
        <p>
          <strong>KMP vs Z-algorithm.</strong> Same asymptotic bound,
          same family. Z-algorithm has slightly cleaner proofs and is
          often preferred in competitive programming. KMP processes text
          incrementally (suitable for streams); Z-algorithm precomputes
          a value over the entire concatenated string.
        </p>
        <p>
          <strong>KMP vs Rabin-Karp.</strong> Rabin-Karp uses rolling
          hashes; expected O(n + m) but worst case O(n·m) under
          adversarial collisions. Rabin-Karp shines for multi-pattern
          matching with hashes (one hash table lookup per text position
          tests against all patterns of the same length) and for
          two-dimensional pattern matching. KMP is faster and worst-case
          deterministic for single-pattern.
        </p>
        <p>
          <strong>KMP vs SIMD-accelerated string matchers.</strong>
          glibc's memmem, Rust's memchr/memmem, and ripgrep's regex
          engine use SIMD instructions to scan 16–64 bytes at a time
          looking for the first character of the pattern. On modern
          hardware this often beats KMP by an order of magnitude on
          short patterns. For competitive programming or worst-case
          guarantees, KMP. For production grep-like tools, SIMD wins.
        </p>
        <p>
          <strong>KMP vs Aho-Corasick.</strong> AC generalizes KMP from
          one pattern to a trie of patterns. For a single pattern they're
          equivalent. For k patterns, AC is O(n + total matches), KMP run
          k times is O(k·n).
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p>
          <strong>Handle the empty-pattern case.</strong> A pattern of
          length 0 trivially matches at every position. Most
          implementations either special-case this or rely on the loop
          structure naturally producing the right answer; verify with a
          unit test.
        </p>
        <p>
          <strong>Use lps[i] consistently as "length, not index."</strong>
          The LPS array stores lengths (0 to i). When falling back, the
          new pattern position is lps[j - 1], not lps[j] — a frequent
          off-by-one in homegrown implementations.
        </p>
        <p>
          <strong>Compute LPS exactly once per pattern.</strong> If
          you're searching the same pattern in many texts (a stable
          regex compiled once), preprocess the LPS array once and reuse.
        </p>
        <p>
          <strong>Report all matches, including overlapping.</strong>
          After a match, fall back j = lps[j - 1] rather than j = 0, so
          the next iteration can find overlapping occurrences. "abab" in
          "abababab" has three overlapping matches; without the fallback,
          you'd find only one.
        </p>
        <p>
          <strong>Stream-friendly state.</strong> For streaming
          applications, persist (j, lps array) between byte arrivals.
          Process bytes one at a time; the "single character per
          iteration" structure of KMP makes this trivial.
        </p>
        <p>
          <strong>Watch for unicode pitfalls.</strong> KMP works on
          arbitrary alphabets, but multi-byte encodings (UTF-8) can have
          partial-character matches. Either match at the byte level
          (works for fixed patterns) or normalize to code points first.
        </p>
        <p>
          <strong>Use Aho-Corasick for many patterns.</strong> Don't run
          KMP k times for k patterns; build an AC automaton once and
          search once. Massive savings when k is large or patterns share
          prefixes.
        </p>
        <p>
          <strong>Combine with Two-Way for libc-style speed.</strong>
          For production code that needs both worst-case linearity and
          practical speed, Two-Way (Crochemore-Perrin) is the standard
          choice. Most libc memmem implementations use it.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p>
          <strong>Off-by-one in LPS construction.</strong> The most
          common bug. The recurrence is lps[i] = lps[k - 1] + 1 only
          when P[i] == P[k]; otherwise k = lps[k - 1] and you retry.
          Dropping the "k - 1" or mishandling k = 0 produces silently
          wrong LPS arrays.
        </p>
        <p>
          <strong>Resetting j to 0 after match.</strong> If you reset j
          = 0 after each full match, you miss overlapping occurrences.
          Fall back j = lps[j - 1] instead.
        </p>
        <p>
          <strong>Using LPS to locate the next mismatch retry
          incorrectly.</strong> On text mismatch with j &gt; 0, you fall
          back j = lps[j - 1] but do NOT advance i. A common variant bug:
          advancing i along with the fallback, which loses positions.
        </p>
        <p>
          <strong>Unicode byte-level vs code-point-level confusion.</strong>
          A pattern containing multi-byte characters compared byte-wise
          can succeed in unexpected places (e.g., a partial UTF-8 byte
          sequence matching the start of an unrelated character). Either
          decode first or restrict patterns to ASCII / pre-validated
          UTF-8 boundaries.
        </p>
        <p>
          <strong>Treating LPS as a generic "border" array.</strong>
          lps[i] is the longest <em>proper</em> border (strictly shorter
          than the string). Some applications need all borders; iterate
          lps[i] → lps[lps[i] - 1] → ... to enumerate them.
        </p>
        <p>
          <strong>Z-algorithm "$" delimiter that appears in input.</strong>
          The standard Z-search uses P + "$" + T with $ a sentinel. If
          $ can appear in either string, the algorithm misbehaves.
          Choose a sentinel known to be absent or use two distinct
          sentinels.
        </p>
        <p>
          <strong>Cache effects on long patterns.</strong> Long LPS
          arrays in tight loops can blow L1; structure the search loop
          to keep hot variables in registers and prefetch the next text
          chunk on streaming workloads.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/kmp-diagram-3.svg"
          alt="KMP applications and selection criteria"
          caption="Where KMP and its derivatives show up in production — and the criteria for choosing it over Boyer-Moore, Rabin-Karp, or Aho-Corasick."
        />
        <p>
          <strong>Network intrusion detection systems.</strong> Snort,
          Suricata, and Bro/Zeek use Aho-Corasick (KMP generalized to
          tries) to match packet payloads against thousands of attack
          signatures simultaneously. The need for worst-case linearity
          on adversarial input is a defining requirement: an attacker
          can craft traffic that breaks Boyer-Moore.
        </p>
        <p>
          <strong>Antivirus signature scanning.</strong> Classical
          antivirus engines (ClamAV) used Aho-Corasick on virus-signature
          tries. Modern engines combine AC with hash-based scanning
          (locality-sensitive hashing) and behavioral analysis, but the
          KMP-family algorithms remain in the core scanning loop.
        </p>
        <p>
          <strong>Bioinformatics.</strong> Exact substring search in DNA
          (4-letter alphabet) or protein (20-letter alphabet) sequences.
          For short queries, KMP is competitive; for long sequences with
          many queries, suffix arrays or BWT-based tools (BLAST,
          Bowtie, BWA) win. Tandem-repeat detection uses period analysis
          derived from the LPS array.
        </p>
        <p>
          <strong>Text editor "find."</strong> Vim, Emacs, VS Code, and
          web-browser find-in-page use various string-search algorithms
          internally. Modern implementations typically use SIMD-accelerated
          memchr scans plus a fallback (Two-Way, Boyer-Moore, or KMP) for
          long patterns.
        </p>
        <p>
          <strong>Compiler lexers.</strong> Tokenizing keywords and
          operators in a programming language: a fixed dictionary of
          patterns matched against streaming source. Aho-Corasick is the
          natural fit and underlies many lexer generators.
        </p>
        <p>
          <strong>Streaming log alerting.</strong> Tail a log file or
          syslog firehose, alert on fixed patterns ("ERROR", specific
          stack-trace fragments). Constant memory, one-pass processing,
          worst-case bounded — all KMP strengths.
        </p>
        <p>
          <strong>Plagiarism detection.</strong> Exact-match phase of
          plagiarism systems uses KMP-family algorithms to find verbatim
          fragments. Approximate-match (after edit distance, paraphrase
          detection) typically uses other techniques.
        </p>
        <p>
          <strong>Web crawlers and content extraction.</strong> Scanning
          HTML for fixed boilerplate markers (script tags, ad scripts,
          tracking pixels) at scale. KMP handles streaming HTML without
          buffering the full document.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p>
          <strong>Implement KMP.</strong> The canonical question.
          Construct the LPS array, then search. Strong candidates handle
          overlapping matches and explain the no-text-backtrack invariant
          clearly.
        </p>
        <p>
          <strong>Find the longest proper prefix of S that is also a
          suffix.</strong> A pure LPS-array problem. Run the LPS
          construction on S; answer is lps[n - 1].
        </p>
        <p>
          <strong>Shortest Palindrome (LeetCode 214).</strong> Add the
          fewest characters to the front of s to make a palindrome.
          Reduces to finding the longest palindromic prefix; do that by
          computing LPS of s + "#" + reverse(s); the answer is
          reverse(s)[0..n - lps[n']].
        </p>
        <p>
          <strong>Repeated Substring Pattern (LeetCode 459).</strong>
          Determine if s is a repetition of a shorter substring. Use the
          period property: s is a repetition iff n - lps[n - 1] divides
          n. One-line LPS-based answer.
        </p>
        <p>
          <strong>Find All Anagrams in a String.</strong> Not strictly
          KMP — sliding window with character frequencies — but
          interviewers sometimes pose KMP for it. The right answer is
          the sliding-window approach; KMP doesn't handle anagram
          matching.
        </p>
        <p>
          <strong>Longest Happy Prefix (LeetCode 1392).</strong>
          Equivalent to "longest LPS." Direct application of the LPS
          array.
        </p>
        <p>
          <strong>Count occurrences of pattern in text.</strong>
          Standard KMP usage. Return the count by incrementing on each
          match and falling back j = lps[j - 1].
        </p>
        <p>
          <strong>Why does KMP not re-examine text characters?</strong>
          The conceptual interview question. The LPS array tells you,
          on mismatch, how much pattern prefix is preserved as a suffix
          of the matched text — so the text pointer doesn't need to
          rewind. Total iterations bounded by n + m.
        </p>
        <p>
          <strong>Design a multi-pattern matcher.</strong> System-design
          framing. Strong answers cover Aho-Corasick (for fixed pattern
          set), trade-offs against running KMP per pattern, memory
          consumption of the AC automaton, and dynamic update
          strategies.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <p>
          The original Knuth-Morris-Pratt paper "Fast Pattern Matching in
          Strings" (SIAM J. Comput., 1977) is short and worth reading.
          The Z-algorithm was published independently by Main and
          Lorentz around the same time. CLRS Chapter 32 covers KMP and
          the failure function with proofs. Sedgewick and Wayne's <em>
          Algorithms</em> covers KMP, Boyer-Moore, and Rabin-Karp with
          clean code.
        </p>
        <p>
          For Aho-Corasick, the original 1975 paper "Efficient String
          Matching: An Aid to Bibliographic Search" by Aho and Corasick
          is foundational. For Two-Way (Crochemore-Perrin, 1991) — the
          algorithm behind glibc memmem — the paper "Two-Way String
          Matching" gives the construction. Crochemore, Hancart, and
          Lecroq's <em>Algorithms on Strings</em> covers the entire
          family.
        </p>
        <p>
          For string algorithms generally, Gusfield's <em>Algorithms on
          Strings, Trees, and Sequences</em> remains the standard
          reference, with deep treatment of suffix structures, Z-array,
          and applications to bioinformatics. Crochemore and Rytter's{" "}
          <em>Jewels of Stringology</em> is a beautifully written
          alternative.
        </p>
        <p>
          For practical implementations, glibc's memmem source and Rust's
          memchr crate (especially the Two-Way and SIMD modules) are
          excellent reading. The ripgrep source (in Rust) has detailed
          comments on string-matching strategy selection. For Aho-Corasick
          in production, Snort and Suricata source code shows AC running
          on real network traffic.
        </p>
        <p>
          For period analysis and combinatorics on words, Lothaire's three
          volumes (<em>Combinatorics on Words</em>, <em>Algebraic
          Combinatorics on Words</em>, <em>Applied Combinatorics on
          Words</em>) are the deep references. Smyth's <em>Computing
          Patterns in Strings</em> is more applied.
        </p>
      </section>
    </ArticleLayout>
  );
}
