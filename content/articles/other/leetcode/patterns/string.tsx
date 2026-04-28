"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "string",
  title: "String Pattern",
  description:
    "Sliding-window, hashing, stack, trie, and substring-search techniques applied to strings — the umbrella pattern that intersects every other algorithmic family.",
  category: "other",
  subcategory: "patterns",
  slug: "string",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-26",
  tags: ["string", "leetcode", "patterns", "substring"],
  relatedTopics: ["sliding-window", "hash-table", "trie"],
};

export default function StringArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
      <p className="mb-4">
        The string pattern is not a single algorithm but an umbrella over every algorithmic
        family applied to character sequences: sliding window for substrings, hashing for
        anagrams and frequency, stack for parenthesised expressions and decode problems, trie
        for prefix dictionaries, and dedicated substring-search algorithms (KMP, Z, Rabin-Karp,
        Manacher) for occurrence problems. The reason it deserves treatment as a pattern is
        that strings impose enough special constraints — immutability, character-set
        assumptions, encoding, comparison semantics — that the engineering practice differs
        from the same algorithms applied to integer arrays.
      </p>
      <p className="mb-4">
        Recognition is layered. The surface signal is &quot;the input is a string&quot;. The
        deeper signal is the question shape: &quot;substring with property&quot; (sliding
        window), &quot;anagrams or character counts&quot; (hashing), &quot;balanced or nested&quot;
        (stack), &quot;prefix queries against a dictionary&quot; (trie), &quot;find pattern in
        text&quot; (KMP / Rabin-Karp), &quot;palindromic substrings&quot; (expand around centers
        or Manacher).
      </p>
      <p className="mb-4">
        Strings dominate the easy and medium tiers of Leetcode and appear everywhere in
        production: log parsing, configuration files, URL routing, search query analysis,
        genome assembly, NLP tokenisation. The data structure&apos;s ubiquity makes the pattern
        a core competency rather than an exotic technique.
      </p>
      <p className="mb-4">
        At staff level, the test is whether you reach for the right sub-pattern. A senior
        engineer who applies sliding window to a substring-occurrence problem (which needs KMP)
        signals shallow toolbox depth. The discipline is to pause, identify the structural
        question, and then pick from the toolbox.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
      <p className="mb-4">
        <strong>Character set assumptions.</strong> Lowercase Latin? Use int[26]. ASCII? int[128].
        Full Unicode? Map&lt;Character, Integer&gt;. The choice determines memory and access
        cost. Always confirm the alphabet before allocating a fixed-size array.
      </p>
      <p className="mb-4">
        <strong>Immutability.</strong> In Java and Python, strings are immutable; in JavaScript,
        too. Repeated concatenation is O(n²) (each + creates a new string copying both
        operands). Use StringBuilder (Java), list-of-chars + join (Python), or Array.join (JS).
        For interview problems, an early sign of senior code is reaching for a buffer instead of
        accumulating with +.
      </p>
      <p className="mb-4">
        <strong>Sliding window for substrings.</strong> Two pointers (left and right) define a
        window over the string. Right expands; left shrinks while a property is violated. The
        canonical examples — longest substring without repeats, minimum window substring, longest
        repeating-character replacement — all share this structure. The state inside the window
        is typically a hashmap or counter that can be updated in O(1) on each pointer move.
      </p>
      <p className="mb-4">
        <strong>Anagram and frequency comparison.</strong> Count vectors of length 26 (or 128)
        compared element-wise in O(alphabet). Hashable for use as map keys (49 Group Anagrams).
        Sorted-string normalisation works too but is O(n log n) per string vs. O(n) for counts.
      </p>
      <p className="mb-4">
        <strong>Stack for nested structure.</strong> Parentheses, brackets, decode strings,
        evaluate expressions. Push when opening, pop when closing, validate matching on close.
        For decode problems (394), push (string, repeat-count) tuples; on close-bracket, pop and
        repeat.
      </p>
      <p className="mb-4">
        <strong>Trie for prefix queries.</strong> When the question involves a dictionary of
        strings and many prefix queries, a trie gives O(L) per query independent of dictionary
        size. The bit-trie variant handles XOR and binary-string problems with the same
        structure on bit-by-bit decomposition.
      </p>
      <p className="mb-4">
        <strong>Substring search.</strong> Naive search is O(nm); KMP is O(n + m) by precomputing
        the longest proper prefix-suffix table and skipping comparisons on mismatch; Rabin-Karp
        is O(n + m) expected by rolling-hash; Z-algorithm is similar to KMP but cleaner. Pick
        based on context: KMP is the classical exam answer; Rabin-Karp is right when you need to
        find many patterns or compare substrings by hash.
      </p>
      <p className="mb-4">
        <strong>Palindromes.</strong> Two techniques — expand around centers (O(n²) worst case
        but trivial code) and Manacher&apos;s algorithm (O(n) but algorithmically dense).
        Expanding around centers handles odd and even centers separately. Manacher is a
        worth-knowing reference but rarely asked at the implementation level in interviews.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/string-diagram-1.svg" alt="String pattern overview" />

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
      <p className="mb-4">
        The sliding-window template for &quot;longest substring satisfying P&quot;: initialise
        left = 0, an empty state structure, and best = 0. Iterate right; update the state with
        the new character; while the state violates P, increment left and remove that character
        from the state; record best as max(best, right - left + 1). Time O(n) — each character
        enters and leaves the window once.
      </p>
      <p className="mb-4">
        For minimum window substring (76), the variant tracks &quot;need&quot; — a count of how
        many characters of the target are still missing from the window. As right advances and
        adds a needed character, decrement need. Once need reaches zero, record the window
        and shrink from the left while need stays at zero. This is the canonical
        variable-window template for &quot;contains all of T&quot; questions.
      </p>
      <p className="mb-4">
        For anagrams in a string (438, 567), the window is fixed-size (length of the pattern).
        Maintain a count of characters within the window and compare to the pattern&apos;s
        count. Slide the window by one — add the new right character, remove the old left
        character — and re-check equality. Comparison is O(26).
      </p>
      <p className="mb-4">
        The decode-string template (394): two stacks, one of strings and one of repeat counts.
        On a digit, accumulate the multiplier. On open bracket, push the current string and
        multiplier; reset both. On close bracket, pop and concatenate (popped_string +
        current_string * popped_count). On a letter, append to the current string.
      </p>
      <p className="mb-4">
        The KMP template: compute lps[] for the pattern (lps[i] = longest proper prefix of
        pattern[0..i] that is also a suffix). Walk the text; on mismatch at position i in the
        pattern, jump to lps[i-1] instead of restarting. Time O(n + m) — each character is
        examined at most twice.
      </p>
      <p className="mb-4">
        The expand-around-centers template for palindromes: for each index i, expand outward
        treating i as the centre of an odd-length palindrome (left = i, right = i) and as the
        centre between i and i+1 of an even-length palindrome (left = i, right = i+1). Track the
        longest palindrome found. Time O(n²); the simplicity wins over Manacher in interviews.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
      <p className="mb-4">
        <strong>Sliding window vs. brute-force.</strong> Brute-force is O(n²) or O(n³) for
        substring problems. Sliding window achieves O(n) when the property is monotonic
        (extending the window only makes it harder to satisfy, shrinking only makes it easier).
        Confirm monotonicity before committing to the window approach.
      </p>
      <p className="mb-4">
        <strong>Sliding window vs. dynamic programming.</strong> For palindromic substring
        counting (647), DP is O(n²) time and space; expand-around-centers is O(n²) time and
        O(1) space. For longest palindromic subsequence, DP is necessary because the structure
        is not contiguous.
      </p>
      <p className="mb-4">
        <strong>KMP vs. Rabin-Karp.</strong> KMP is deterministic O(n + m). Rabin-Karp is
        expected O(n + m) but worst case O(nm) on hash collisions. Use Rabin-Karp when you
        need to compare many substrings against many patterns (the rolling hash is reusable);
        KMP for a single pattern.
      </p>
      <p className="mb-4">
        <strong>Trie vs. hash set for word lookup.</strong> Hash set gives O(L) lookup per word
        with no prefix sharing. Trie gives the same lookup plus O(P) prefix queries and saves
        memory through prefix compression on dense dictionaries. For pure word-membership
        queries, hash set is simpler.
      </p>
      <p className="mb-4">
        <strong>Sorted-string vs. count-vector for anagram.</strong> Sorting is O(L log L),
        count vector is O(L). Both work as hashmap keys; count vector is faster but requires a
        bounded alphabet.
      </p>
      <p className="mb-4">
        <strong>Expand-around-centers vs. Manacher.</strong> O(n²) vs. O(n). For interview
        problems with n up to 10^4, expand is fine; for production string processing on
        large texts, Manacher matters.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/string-diagram-2.svg" alt="Substring search algorithms" />

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
      <p className="mb-4">
        <strong>Confirm the alphabet.</strong> Lowercase Latin? ASCII? Unicode? The data
        structure choice depends on this answer.
      </p>
      <p className="mb-4">
        <strong>Use a buffer for accumulation.</strong> Never build a string with repeated +.
        StringBuilder, list-of-chars + join, array push + join.
      </p>
      <p className="mb-4">
        <strong>For sliding window, prove monotonicity.</strong> &quot;If [l, r] is invalid,
        is [l, r+1] also invalid?&quot; If yes, sliding window is correct. If no, brute-force
        or different technique.
      </p>
      <p className="mb-4">
        <strong>Compare counts efficiently.</strong> If the alphabet is 26, an int[26]
        comparison is O(26). For two-frequency comparisons, track a &quot;matches&quot; counter
        — number of indices where the two arrays agree — and update it on each character move.
        This drops per-step cost to O(1).
      </p>
      <p className="mb-4">
        <strong>For KMP, write the lps function carefully.</strong> The recurrence is subtle.
        Test on edge cases: pattern of all same characters, pattern with no internal periodicity.
      </p>
      <p className="mb-4">
        <strong>For decode, push state on open and pop on close.</strong> Two stacks, or one
        stack of tuples. Never accumulate a partial result in a single string variable that
        cannot be reset.
      </p>
      <p className="mb-4">
        <strong>For palindrome expansion, handle even and odd centers.</strong> Even centers
        sit between two characters; odd centers sit on a character. Skipping one of them halves
        your coverage.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
      <p className="mb-4">
        <strong>Concatenation in a loop.</strong> O(n²) silently. Use a buffer.
      </p>
      <p className="mb-4">
        <strong>Comparing strings with == in Java.</strong> Tests reference equality, not
        content. Use equals.
      </p>
      <p className="mb-4">
        <strong>Forgetting to handle empty strings.</strong> Many implementations crash or
        return wrong values on the empty input. Test it explicitly.
      </p>
      <p className="mb-4">
        <strong>Off-by-one on window boundaries.</strong> Inclusive vs. exclusive matters.
        Standard convention: [left, right] inclusive both ends; window size is right - left +
        1.
      </p>
      <p className="mb-4">
        <strong>Sliding-window non-monotonic invariants.</strong> If shrinking the window can
        re-violate the invariant, sliding window does not work. Switch to brute-force or DP.
      </p>
      <p className="mb-4">
        <strong>KMP with wrong lps construction.</strong> The recurrence is len = lps[len-1]
        when characters mismatch and len &gt; 0; otherwise len stays at zero and i increments.
        Off-by-one bugs here are subtle.
      </p>
      <p className="mb-4">
        <strong>Rabin-Karp without collision check.</strong> Hash matches do not guarantee
        substring equality — collisions are possible. Always verify on hash match.
      </p>
      <p className="mb-4">
        <strong>Encoding length confusion.</strong> In Java, string.length() returns
        UTF-16 code units, not characters or bytes. For codepoint counts, use
        codePointCount(). For UTF-8 byte length, encode and measure the byte array.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases (Canonical Leetcode)</h2>
      <p className="mb-4">
        <strong>3. Longest Substring Without Repeating Characters.</strong> Sliding window
        with a hashmap of last-seen index.
      </p>
      <p className="mb-4">
        <strong>76. Minimum Window Substring.</strong> Variable window with need-counter and
        frequency map. The canonical &quot;contains all of T&quot; problem.
      </p>
      <p className="mb-4">
        <strong>567. Permutation in String / 438. Find All Anagrams.</strong> Fixed-size window
        + count comparison.
      </p>
      <p className="mb-4">
        <strong>424. Longest Repeating Character Replacement.</strong> Sliding window where the
        invariant is window_size - max_freq ≤ k. Tests subtle window-shrinking logic.
      </p>
      <p className="mb-4">
        <strong>5. Longest Palindromic Substring.</strong> Expand around centers. Tests
        odd-and-even-center handling.
      </p>
      <p className="mb-4">
        <strong>647. Palindromic Substrings.</strong> Same expansion technique, count instead
        of track-longest.
      </p>
      <p className="mb-4">
        <strong>49. Group Anagrams.</strong> Hash by sorted string or count tuple.
      </p>
      <p className="mb-4">
        <strong>242. Valid Anagram.</strong> Count comparison.
      </p>
      <p className="mb-4">
        <strong>28. Find the Index of the First Occurrence.</strong> KMP or Rabin-Karp.
        Interviewers expect at least one of the linear-time algorithms.
      </p>
      <p className="mb-4">
        <strong>394. Decode String.</strong> Stack of (string, count) for nested encoding.
      </p>
      <p className="mb-4">
        <strong>271. Encode and Decode Strings.</strong> Length-prefix encoding to handle
        arbitrary characters in the payload, including the delimiter.
      </p>
      <p className="mb-4">
        <strong>20. Valid Parentheses.</strong> Stack-based matching, the introductory string
        problem.
      </p>
      <ArticleImage src="/diagrams/other/leetcode/patterns/string-diagram-3.svg" alt="Canonical string Leetcode problems" />

      <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>Why is repeated concatenation O(n²)?</strong> Each concatenation copies both
        operands; if the result grows linearly, the total work is the sum of 1, 2, 3, ..., n,
        which is O(n²).</li>
        <li><strong>When is sliding window correct?</strong> When the property is monotonic in the
        window: extending makes satisfying harder (so once unsatisfied, must shrink); shrinking
        makes satisfying easier (so once satisfied, can record and try to shrink further).</li>
        <li><strong>How does KMP avoid restarting?</strong> The lps array tells you the longest
        prefix of the pattern that matches a suffix of what you have already compared. On
        mismatch, jump back by that much instead of starting over.</li>
        <li><strong>Why use a count vector rather than sorting for anagrams?</strong> O(n) vs. O(n
        log n). Also, count vectors are mutable — you can update them in O(1) on each
        sliding-window move.</li>
        <li><strong>What is the difference between Manacher and expand-around-centers?</strong>
        Manacher uses information from already-computed palindromes to skip work, achieving
        O(n). Expand-around-centers is O(n²) worst case. Most interviews are happy with the
        latter for clarity.</li>
        <li><strong>How do you encode a list of strings into one string and decode back?</strong>
        Length-prefix encoding: prepend each string with its length and a delimiter (e.g.,
        &quot;5#hello5#world&quot;). Decoder reads the length, then exactly that many
        characters.</li>
        <li><strong>How does Rabin-Karp handle hash collisions?</strong> On hash match, verify
        the literal substring equality before reporting a match.</li>
        <li><strong>What is the trade-off of using a trie for word problems?</strong> O(L) per
        operation but higher memory than a hash set. The win comes when prefix queries are
        common.</li>
        <li><strong>How do you handle Unicode correctly?</strong> Use codepoint iteration (in Java,
        codePoints(); in Python, str is codepoint-iterated by default; in JS, for...of). Beware
        surrogate pairs in UTF-16 length calculations.</li>
        <li><strong>Why is the &quot;match count&quot; trick faster for anagram windows?</strong>
        Comparing two int[26] arrays each step is O(26). Tracking how many indices currently
        agree, and updating that count when characters move, is O(1) per move — the total work
        is O(n) instead of O(26n).</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Knuth, Morris, Pratt, &quot;Fast Pattern Matching in Strings&quot;, SIAM J. Computing,
        1977 (the original KMP paper). Karp, Rabin, &quot;Efficient Randomized Pattern-Matching
        Algorithms&quot;, IBM J. Research, 1987. Manacher, &quot;A New Linear-Time On-Line
        Algorithm for Finding the Smallest Initial Palindrome of a String&quot;, JACM, 1975.</li>
        <li>Cormen et al., chapter 32 (String Matching). Sedgewick, <em>Algorithms</em>, 4th ed.,
        chapter 5 (Strings). Crochemore and Rytter, <em>Jewels of Stringology</em>, for deeper
        treatment.</li>
        <li>Leetcode tags &quot;string&quot;, &quot;sliding window&quot;, &quot;hash table&quot;,
        and &quot;string matching&quot;. Grokking the Coding Interview&apos;s sliding-window and
        two-pointer patterns. NeetCode 150 covers 3, 76, 567, 5, 49, 271, 20, 22, 647.</li>
      </ul>
    </ArticleLayout>
  );
}
