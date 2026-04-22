"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "edit-distance",
  title: "Edit Distance (Levenshtein)",
  description:
    "Levenshtein edit distance — O(mn) DP, the three-operation recurrence, Hirschberg's space-optimal variant, banded Ukkonen, and applications from spell check to DNA alignment.",
  category: "other",
  subcategory: "algorithms",
  slug: "edit-distance",
  wordCount: 4800,
  readingTime: 24,
  lastUpdated: "2026-04-20",
  tags: ["edit-distance", "levenshtein", "dynamic-programming", "string-algorithms"],
  relatedTopics: [
    "longest-common-subsequence",
    "dp-fundamentals",
    "kmp",
    "rabin-karp",
  ],
};

export default function EditDistanceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          The <span className="font-semibold">edit distance</span> (Levenshtein distance) between
          two strings a and b is the minimum number of single-character edits — insertions,
          deletions, and substitutions — required to transform a into b. Formally introduced by
          Vladimir Levenshtein in 1965, it generalizes Hamming distance (which permits only
          substitutions) to strings of unequal length.
        </p>
        <p className="mb-4">
          Edit distance is a true metric: it is non-negative, symmetric, zero iff the strings are
          equal, and satisfies the triangle inequality. That metric structure lets us use it as
          the basis for nearest-neighbor search, clustering, and approximate indexing. It is the
          workhorse behind spell check, fuzzy search, speech-recognition evaluation (WER), DNA
          alignment, and diff tooling.
        </p>
        <p className="mb-4">
          The classical Wagner-Fischer algorithm (1974) solves it in O(mn) time and O(mn) space
          via a dynamic programming table. Hirschberg&rsquo;s divide-and-conquer refinement
          (1975) retains O(mn) time but reduces space to O(min(m, n)) while still recovering the
          full alignment. Ukkonen&rsquo;s banded variant exploits the case where distance is
          bounded by k, running in O(kn) time — essential for approximate string matching where
          k is small.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p className="mb-4">
          <span className="font-semibold">State:</span> dp[i][j] = edit distance between the
          first i characters of a and the first j characters of b. The answer is dp[m][n].
        </p>
        <p className="mb-4">
          <span className="font-semibold">Base cases:</span> dp[0][j] = j (insert j characters
          to build b[:j] from empty) and dp[i][0] = i (delete i characters to empty a[:i]).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Recurrence:</span> if a[i-1] == b[j-1], then dp[i][j]
          = dp[i-1][j-1] (free match, no edit needed). Otherwise dp[i][j] = 1 + min(dp[i-1][j],
          dp[i][j-1], dp[i-1][j-1]) — the three candidates correspond to deleting a[i-1],
          inserting b[j-1], and substituting a[i-1] with b[j-1] respectively.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Why min of three:</span> we are computing the shortest
          path in an implicit DAG where each cell (i, j) has incoming edges of weight 1 from
          three neighbors (plus a weight-0 diagonal edge when characters match). The DP is a
          topologically ordered relaxation of that shortest-path problem.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Recovering the alignment:</span> keep a parent pointer
          for each cell indicating which predecessor yielded the minimum. Backtracking from
          (m, n) to (0, 0) reconstructs the sequence of edit operations. Without parent pointers
          the same is recoverable by re-examining neighbors during backtrace.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Complexity:</span> Θ(mn) time, Θ(mn) space for the
          full table. The alphabet size does not appear in the bound — character comparisons are
          O(1). For ASCII or Unicode with O(1) codepoint comparison this is tight.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/edit-distance-diagram-1.svg"
          alt="DP table filling for kitten vs sitting, giving edit distance 3"
          caption="Wagner-Fischer table. Answer dp[m][n] = 3 corresponds to k→s (sub), e→i (sub), +g (insert)."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          The standard tabulation fills the DP matrix row by row, left to right. Each cell reads
          three already-computed neighbors, so the order respects the dependency DAG. After
          filling, dp[m][n] is the answer; a second backward pass reconstructs the alignment if
          needed.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Two-row space optimization:</span> since dp[i][j]
          depends only on row i-1 and the already-computed portion of row i, we can keep just
          the previous row and the current row, dropping memory to Θ(min(m, n)) (always iterate
          with the shorter string on the inner axis). This is the default in production code
          when only the distance is needed.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Hirschberg&rsquo;s algorithm:</span> to recover the
          alignment in O(min(m, n)) space, split one string in half, compute forward DP from
          the start and backward DP from the end to identify the optimal meet point in the
          middle row, then recurse on both halves. Runtime stays O(mn) because the work halves
          each level and forms a geometric series.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Banded (Ukkonen&rsquo;s) DP:</span> if we only need to
          decide whether distance ≤ k, restrict computation to cells with |i - j| ≤ k. Any
          alignment with more than k insertions or more than k deletions is already worse than
          k, so off-band cells cannot improve the answer. This gives O(kn) time — crucial for
          fuzzy search where k is small (e.g. ≤ 2 for spell-check).
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/edit-distance-diagram-2.svg"
          alt="Cost-model variants, two-row memory trick, and Ukkonen banded DP diagram"
          caption="Cost-model variants (Levenshtein, Damerau, Hamming, Needleman-Wunsch), the two-row space trick, and Ukkonen's band for bounded-k queries."
        />
        <p className="mb-4">
          <span className="font-semibold">Bit-parallel (Myers&rsquo; algorithm):</span> for
          binary alphabets or small patterns (|a| ≤ machine word size), the DP column can be
          represented as bit-vectors and transitions become a handful of bitwise operations.
          Myers&rsquo; 1999 algorithm achieves O(⌈m/w⌉ · n) time where w is the word size — often
          an order of magnitude faster in practice for short patterns.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Automaton-based:</span> the Levenshtein automaton of a
          pattern p with bound k accepts exactly the strings within distance k of p. Matching
          against it runs in linear time per candidate. Lucene uses this to implement fuzzy
          queries efficiently.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p className="mb-4">
          <span className="font-semibold">Edit distance vs LCS:</span> if substitution is
          disallowed (cost ∞), then edit distance = m + n − 2·LCS(a, b). That is exactly the
          model the Unix diff and git diff tools use — lines can only be inserted or deleted,
          never substituted in place — which is why diff output always shows a &ldquo;−&rdquo;
          followed by a &ldquo;+&rdquo;. With substitutions allowed, edit distance can be
          strictly less than the LCS-distance, but it no longer corresponds to a clean line-
          oriented diff.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Levenshtein vs Damerau-Levenshtein:</span> Damerau
          adds a fourth operation — swapping adjacent characters (&ldquo;teh&rdquo; →
          &ldquo;the&rdquo;) — at cost 1. Pure Levenshtein would charge 2 for that transposition
          (two substitutions). Damerau models human typos more faithfully and is standard in
          spell-check pipelines.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Levenshtein vs Hamming:</span> Hamming distance only
          allows substitution and requires equal-length strings. It is O(n) to compute but much
          narrower. Hamming is used in error-correcting codes where frame length is fixed;
          Levenshtein is used wherever insertions and deletions are real failure modes
          (channels with bit slips, typos).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Edit distance vs Jaro-Winkler:</span> Jaro-Winkler is
          a similarity metric (0 to 1) tuned for short strings like names, giving higher weight
          to common prefixes. It is faster and often more useful for record linkage where
          prefixes are reliable; edit distance is more uniform and is preferred when you need a
          true metric for indexing.
        </p>
        <p className="mb-4">
          <span className="font-semibold">DP vs approximation:</span> computing edit distance in
          sub-quadratic time is a hard problem — Backurs-Indyk (2015) showed that a strongly
          sub-quadratic algorithm would refute the Strong Exponential Time Hypothesis. In
          practice, for large strings we use banded DP, bit-parallelism, or q-gram filters to
          reject most pairs without computing the full distance.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Full table vs two-row:</span> the two-row optimization
          is strictly better if you only need the distance. It becomes a trap when somebody
          adds an &ldquo;also return the alignment&rdquo; feature later — at that point rewrite
          with Hirschberg rather than pay Θ(mn) memory again.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p className="mb-4">
          <span className="font-semibold">Pick the right cost model up front.</span> Default
          Levenshtein (1/1/1) is wrong for keyboard typos (q↔w is cheaper than q↔z), wrong for
          DNA (purine↔purine cheaper than purine↔pyrimidine), wrong for diff (no sub). Choose
          the variant that matches your domain before tuning anything else.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Bound the distance when possible.</span> Spell-check,
          fuzzy search, and record linkage almost always have a sane upper bound on k (2–3 for
          words, 5–10 for addresses). Use Ukkonen&rsquo;s banded DP or a Levenshtein automaton
          to exploit that bound — full DP is typically 10–100× slower than needed.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Filter before you compute.</span> For large candidate
          pools, compute a cheap upper-bound (length difference, q-gram Jaccard, prefix/suffix
          match) first and only run full DP on the survivors. Symspell, BK-trees, and trigram
          indexes all exist to avoid running the quadratic algorithm on the whole dictionary.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Use two-row by default.</span> Unless you need the
          alignment now, never allocate the full mn table. On strings of a few thousand
          characters the memory difference is measurable; on strings of hundreds of thousands
          it is the difference between working and OOM.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Put the shorter string inside.</span> If min(m, n) is
          on the inner axis, the two-row trick uses O(min(m, n)) memory. If you accidentally
          flip the axes you use O(max(m, n)) — worst-case 2× worse, and for very skewed pairs
          much worse than that.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Measure with realistic inputs.</span> Benchmarks on
          uniformly-distributed random strings wildly overestimate the cost in real use, where
          most string pairs share long common prefixes/suffixes and can be trimmed before DP.
          Add prefix/suffix stripping as a preprocessing step.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Normalize first.</span> Unicode NFC, case folding,
          whitespace collapsing — all should happen before distance computation unless the
          domain forbids it. &ldquo;RESUME&rdquo; vs &ldquo;résumé&rdquo; otherwise registers as
          distance 6 instead of 2.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p className="mb-4">
          <span className="font-semibold">Off-by-one in base row/column.</span> The base cases
          dp[0][j] = j and dp[i][0] = i are the single most common bug. Always test with an
          empty string on each side — the answer must be the length of the other string.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Forgetting the diagonal match case.</span> When
          a[i-1] == b[j-1] the cost is dp[i-1][j-1] with <em>no</em> +1. A surprising number of
          implementations accidentally always add 1 and come up with inflated distances.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Two-row trick that overwrites too eagerly.</span>
          When rolling arrays you need to save the diagonal value (dp[i-1][j-1]) <em>before</em>
          overwriting dp[j-1] with the new row&rsquo;s entry. The classic bug: after the inner
          loop updates cell j-1, cell j reads dp[j-1] expecting the old row and gets the new.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Assuming edit distance on arbitrary objects.</span>
          The DP assumes character (or token) equality is O(1). On strings of complex objects
          (lines with trimming? tokens with regex equivalence?) the comparison cost dominates
          and the Θ(mn) bound misleads.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Unicode pitfalls.</span> A single user-perceived
          character (grapheme cluster) can span multiple codepoints — &ldquo;é&rdquo; can be
          U+00E9 or U+0065 U+0301. Running Levenshtein on raw codepoints reports distance 1
          where a human would say 0. Normalize with NFC (or split on grapheme clusters) first.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Confusing distance with similarity.</span> Many APIs
          return a normalized similarity in [0, 1] (often 1 − d/max(m, n)). These are not
          metrics — normalized similarity breaks the triangle inequality — so do not feed them
          into algorithms that assume metric structure (BK-trees, VP-trees).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Trying to beat Θ(mn) in the general case.</span>
          Backurs-Indyk proved it impossible under SETH. Skip the micro-optimization theatre;
          if quadratic is too slow, change the problem — bound k, filter first, or switch to a
          different similarity metric.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <span className="font-semibold">Spell check and autocorrect.</span> Aspell, Hunspell,
          iOS/Android keyboards, and Google&rsquo;s &ldquo;Did you mean?&rdquo; all rank
          dictionary words by edit distance to the input token, usually with a bounded k ≤ 2
          and a candidate index (Symspell or BK-tree) to prune the search.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Fuzzy search.</span> Elasticsearch and Lucene expose
          fuzzy queries implemented via the Levenshtein automaton of the query term — the
          automaton is traversed in lockstep with the term dictionary trie to yield all matches
          within distance k in time near-linear in the match count.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Speech recognition and machine translation
          evaluation.</span> Word Error Rate (WER = edit-distance-over-words / reference length)
          is the industry standard metric for ASR systems like Whisper and DeepSpeech. CER is
          the analogous character-level metric. These numbers are directly reported in every
          ASR paper because they let researchers compare on a common axis.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Bioinformatics alignment.</span> Needleman-Wunsch
          (global alignment) and Smith-Waterman (local alignment) generalize Wagner-Fischer
          with a substitution-cost matrix (BLOSUM, PAM) and a gap penalty. BLAST uses a seed-
          and-extend pattern where the extend step is banded Smith-Waterman. minimap2 uses
          chaining + banded DP for long-read alignment.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Record linkage and deduplication.</span> Customer
          databases merge records for &ldquo;John Smith&rdquo; and &ldquo;Jon Smyth&rdquo; by
          computing edit distance (or Jaro-Winkler) between normalized name fields, gated by
          blocking keys like soundex or first-character + length. Healthcare and finance
          compliance (KYC) pipelines are the biggest industrial users.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Plagiarism and code similarity.</span> Tokenize the
          source (normalizing identifiers) and compute edit distance or LCS on token streams.
          Moss (Stanford) uses a related fingerprinting approach but edit distance still shows
          up for final pairwise scoring.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Diff / version control.</span> Unix diff, git diff,
          and IDE diff views use LCS-distance (edit distance with substitution disabled) on
          lines. Myers&rsquo; O((m + n) · d) algorithm exploits small edit scripts — typical
          commits change few lines — to run much faster than the Θ(mn) worst case.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Anti-cheat and content moderation.</span> Username
          and message filters use edit distance against banned-word lists to catch intentional
          misspellings (&ldquo;n00b&rdquo; → &ldquo;noob&rdquo;) with a small k. Weighted
          Levenshtein with homoglyph-aware substitution costs handles Unicode impersonation.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/edit-distance-diagram-3.svg"
          alt="Four edit-distance applications: spell check, DNA alignment, speech metrics, fuzzy search"
          caption="Four industries built on the same Θ(mn) recurrence: spell correction, bioinformatics, ASR evaluation, and fuzzy search."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p className="mb-4">
          <span className="font-semibold">Classic: implement edit distance.</span> Given two
          strings, return the Levenshtein distance. Expected answer: O(mn) DP with the three-
          operation recurrence, two-row space optimization. LeetCode 72.
        </p>
        <p className="mb-4">
          <span className="font-semibold">One Edit Distance.</span> Return whether two strings
          are exactly one edit apart. Expected answer: linear scan — if lengths differ by
          &gt;1, no; else walk both strings, allow exactly one mismatch (or one skip on the
          longer string). LeetCode 161.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Delete Operation for Two Strings.</span> Minimum
          deletions from both strings to make them equal. Expected answer: m + n − 2·LCS(a, b).
          Tests the connection between edit distance and LCS. LeetCode 583.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Minimum ASCII Delete Sum.</span> Same shape as above
          but the cost of deleting a character is its ASCII value. Expected answer: the same
          DP with costs summed instead of counted. LeetCode 712.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Word Ladder.</span> Shortest transformation sequence
          from start to end where each step changes one letter and each intermediate is in a
          dictionary. Expected answer: BFS over words connected by Hamming-1 edges — edit
          distance restricted to substitutions. LeetCode 127.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Regex matching with .* and .</span> Expected answer:
          DP on (pattern index, string index). Structurally similar to edit distance but with
          explicit wildcards rather than free-form edits. LeetCode 10.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Interleaving String.</span> Can s3 be formed by
          interleaving s1 and s2? Expected answer: DP on prefixes of s1 and s2 — again a 2D
          table with O(mn). LeetCode 97.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Follow-ups the interviewer likes:</span> how do you
          recover the alignment? (parent pointers or backtrace). How much memory does Hirschberg
          use? (Θ(min(m, n))). Why is edit distance hard to compute in sub-quadratic time?
          (Backurs-Indyk, SETH). Would you use Levenshtein or Damerau for keyboard typos?
          (Damerau — transposition is the #1 human typo).
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <p className="mb-4">
          Levenshtein, &ldquo;Binary codes capable of correcting deletions, insertions, and
          reversals&rdquo; (1965). Wagner &amp; Fischer, &ldquo;The string-to-string correction
          problem&rdquo; (JACM 1974). Hirschberg, &ldquo;A linear space algorithm for computing
          maximal common subsequences&rdquo; (CACM 1975) — blueprint for space-efficient
          alignment.
        </p>
        <p className="mb-4">
          Ukkonen, &ldquo;Algorithms for approximate string matching&rdquo; (1985) — banded DP
          and the O(kn) bound. Myers, &ldquo;A fast bit-vector algorithm for approximate string
          matching based on dynamic programming&rdquo; (JACM 1999) — bit-parallel Levenshtein.
          Backurs &amp; Indyk, &ldquo;Edit distance cannot be computed in strongly sub-
          quadratic time (unless SETH is false)&rdquo; (STOC 2015).
        </p>
        <p className="mb-4">
          Needleman &amp; Wunsch (1970) and Smith &amp; Waterman (1981) for bioinformatics
          alignment. Schulz &amp; Mihov, &ldquo;Fast string correction with Levenshtein
          automata&rdquo; (2002) — the method Lucene uses. CLRS chapter on DP and Jurafsky &amp;
          Martin&rsquo;s <em>Speech and Language Processing</em> chapter on minimum edit
          distance for practical NLP framing.
        </p>
      </section>
    </ArticleLayout>
  );
}
