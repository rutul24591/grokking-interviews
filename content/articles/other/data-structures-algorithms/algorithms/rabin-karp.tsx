"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "rabin-karp",
  title: "Rabin-Karp Algorithm",
  description:
    "Rolling-hash pattern matching that wins on multi-pattern, 2D, and fingerprinting problems — polynomial hashing, collision strategy, and the rsync/dedup ecosystem built on top of it.",
  category: "other",
  subcategory: "algorithms",
  slug: "rabin-karp",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-20",
  tags: [
    "rabin-karp",
    "rolling-hash",
    "string-matching",
    "fingerprinting",
    "content-defined-chunking",
    "rsync",
  ],
  relatedTopics: [
    "kmp",
    "boyer-moore",
    "hashing",
    "string",
  ],
};

export default function RabinKarpArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p>
          The Rabin-Karp algorithm finds occurrences of a pattern P of length
          m in a text T of length n by comparing hashes instead of strings.
          It computes a hash of P once, then slides a window over T and
          compares its hash with the pattern hash; only on hash match does it
          fall back to direct character comparison. The defining trick is the
          <em> rolling hash</em>: the hash of the window starting at i+1 can
          be computed from the hash at i in O(1) time, giving expected
          O(n + m) total.
        </p>
        <p>
          Michael Rabin and Richard Karp introduced the algorithm in their
          1987 paper "Efficient Randomized Pattern-Matching Algorithms." The
          key innovation was applying randomized hashing to string matching:
          even though the worst case is O(n·m) under collisions, the expected
          performance is linear, and the algorithm extends naturally to
          multi-pattern and 2D matching where deterministic alternatives
          struggle.
        </p>
        <p>
          Rabin-Karp's profile is unusual among string algorithms. For
          single-pattern matching it loses to KMP (worst-case linear) and to
          Boyer-Moore (sublinear average case). Its real wins are elsewhere.
          For multi-pattern matching with patterns of the same length, you
          hash all patterns into a set and run a single rolling hash over
          the text: O(n + Σ|P_i|) expected time, much better than running
          KMP per pattern. For 2D pattern matching, the rolling-hash trick
          extends naturally — hash rows, then hash sequences of row hashes.
          For fingerprinting and content-similarity, the rolling hash is
          the foundational primitive.
        </p>
        <p>
          The algorithm's broader impact comes from <em>rolling-hash
          fingerprinting</em>. Rsync uses a rolling weak checksum plus a
          strong hash to compute file diffs over a network. Content-defined
          chunking (Restic, BorgBackup, Dropbox sync, deduplicating
          storage) uses rolling hashes to find chunk boundaries that survive
          insertions. Plagiarism detectors like Stanford's MOSS use
          winnowed rolling hashes. Git uses related techniques in pack-file
          delta compression. None of these systems are doing "string
          matching" in the textbook sense, but all of them rely on the
          rolling hash that Rabin-Karp made famous.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/rabin-karp-diagram-1.svg"
          alt="Rabin-Karp rolling hash and algorithm"
          caption="The polynomial rolling hash and the search loop — hash compare, then verify direct match on hash hit."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p>
          The standard hash is a polynomial:{" "}
          <code>hash(s) = (s[0]·b^(m-1) + s[1]·b^(m-2) + ... + s[m-1]) mod p</code>.
          The base b is typically a small integer ≥ alphabet size (commonly
          31, 53, 257, or a random prime); the modulus p is a large prime,
          often 2^61 - 1 (Mersenne prime, fast modular reduction). The
          choice of b and p determines collision behavior.
        </p>
        <p>
          The <em>rolling update</em> is the win:{" "}
          <code>hash(T[i+1..i+m]) = (hash(T[i..i+m-1]) - T[i]·b^(m-1)) · b + T[i+m]</code>{" "}
          all mod p. Subtract the contribution of the leaving character,
          multiply by b to shift the remaining characters left one
          power, add the entering character. Three multiplications, two
          additions, one mod — O(1) per slide. Precompute b^(m-1) once.
        </p>
        <p>
          <strong>The verify-on-hit pattern.</strong> Hash matches don't
          guarantee string matches — different strings can share a hash
          (collisions). On a hash hit, compare the strings directly. The
          expected number of false hits is n/p, which is tiny for p ≈
          2^61. The verify cost is O(m) per hit. Total expected work:
          O(n + m + (n/p) · m) = O(n + m).
        </p>
        <p>
          <strong>Worst case is O(n·m).</strong> If every position
          collides, you verify every position. On adversarial input — an
          attacker who knows b and p can construct collisions — this is
          a real risk. Mitigations: randomize b and p at startup, use
          double hashing (two independent hashes; collision rate 1/p²),
          fall back to KMP on collision-heavy inputs.
        </p>
        <p>
          <strong>Multi-pattern matching with hashes.</strong> If all
          patterns have the same length m, hash each into a set. Roll a
          single hash over the text; at each position, check whether the
          current hash is in the pattern set. Set lookup is O(1)
          expected. Total: O(n + Σ|P_i|). Same trick generalizes to
          patterns of multiple distinct lengths by maintaining one hash
          per length.
        </p>
        <p>
          <strong>2D pattern matching.</strong> To find an m × m pattern
          in an n × n grid: first hash each row of the pattern as a
          1D string, getting m hash values. Then treat the column of row
          hashes as a 1D string of length m and hash it. To search the
          text grid, compute row hashes for each row, then run a 2D
          rolling hash that slides both horizontally (rolling within a
          row) and vertically (rolling across rows of row hashes).
          Total O(n²) expected — a remarkable result.
        </p>
        <p>
          <strong>Mersenne prime arithmetic.</strong> p = 2^61 - 1 lets
          you compute mod via bit tricks: <code>x mod p = (x &amp; p) +
          (x &gt;&gt; 61)</code>, possibly with one correction. On
          64-bit hardware, this is much faster than a general division.
          Most production rolling-hash implementations use 2^61 - 1.
        </p>
        <p>
          <strong>Double hashing.</strong> Two hashes with independent
          (p1, b1) and (p2, b2). Collision rate drops to 1/(p1·p2). For
          most adversarial settings, double hashing eliminates collision
          attacks; for true cryptographic resistance use SHA-256, but
          you lose the rolling property.
        </p>
        <p>
          <strong>Boundary detection (CDC).</strong> Slide a rolling
          hash over a file; whenever <code>hash &amp; mask == 0</code>
          for some mask of k bits, declare a chunk boundary. Average
          chunk size 2^k bytes. The boundaries are content-defined: an
          insertion shifts only one chunk's boundary, leaving downstream
          chunks identical and dedup-able. This is the foundation of
          rsync-like sync and deduplicating backup.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p>
          Rabin-Karp's per-step work is tiny: read one new character, do
          three multiplications and a mod. The hot loop fits in registers
          and runs at near-memory-bandwidth speeds. For a single pattern
          this is roughly tied with KMP; the win shows up in multi-pattern
          and 2D, where the rolling hash amortizes across many checks.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/rabin-karp-diagram-2.svg"
          alt="Rabin-Karp wins and collision strategy"
          caption="Where Rabin-Karp wins — multi-pattern, 2D matching, fingerprinting — and the production strategy for hash collisions."
        />
        <p>
          For rsync, the architecture has two layers. The receiver
          divides its local file into fixed-size blocks and computes both
          a weak rolling checksum (adler-32 family) and a strong hash
          (MD5) for each. The sender slides a rolling weak checksum over
          its file; on weak-checksum match, it computes the strong hash;
          on strong-hash match, the block is reused. The weak checksum
          is rolling for cheap O(1) updates; the strong hash is
          collision-resistant for correctness.
        </p>
        <p>
          For content-defined chunking, the architecture is simpler:
          slide a rolling hash, declare a boundary on hash-property
          match. Restic and BorgBackup use polynomial rolling hashes;
          modern systems use FastCDC or Gear hashing for better boundary
          regularity and faster computation. The chunks are
          content-addressed (SHA-256) and stored once per unique chunk.
        </p>
        <p>
          For string-hashing in competitive programming, the architecture
          is more like a precomputed-prefix-hash table. Compute prefix
          hashes <code>H[i] = hash(S[0..i])</code> for all i in O(n).
          Then any substring hash is computable in O(1) via{" "}
          <code>hash(S[l..r]) = (H[r] - H[l-1] · b^(r-l+1)) mod p</code>.
          This enables O(1) substring comparison, longest common
          substring via binary search + hashing, palindrome detection,
          and many other applications.
        </p>
        <p>
          For plagiarism detection, the architecture combines rolling
          hashes with <em>winnowing</em> (Schleimer, Wilkerson, Aiken,
          2003): hash all k-grams, then within each window of w
          consecutive hashes keep only the minimum. This sparsifies the
          hash set while guaranteeing that any substring of length w +
          k - 1 contributes at least one fingerprint, so common
          substrings get matched. Stanford's MOSS uses this approach.
        </p>
        <p>
          For deduplicating storage, the architecture wraps CDC in a
          chunk-store layer. NetApp ASIS, Data Domain, ZFS deduplication,
          and modern object stores (Ceph, MinIO with dedup) all use
          rolling-hash-based chunking with strong-hash addressing.
          Compression happens at the chunk level after deduplication.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p>
          <strong>Rabin-Karp vs KMP (single pattern).</strong> KMP is O(n
          + m) worst case; Rabin-Karp is O(n + m) expected with O(n·m)
          worst case. For untrusted single-pattern inputs, KMP is safer.
          For multi-pattern or fingerprinting, Rabin-Karp wins.
        </p>
        <p>
          <strong>Rabin-Karp vs Boyer-Moore.</strong> Boyer-Moore is
          O(n/m) average case for natural text — sublinear, faster than
          Rabin-Karp's linear expected case. Rabin-Karp wins on
          multi-pattern; Boyer-Moore wins on single-pattern in natural
          text.
        </p>
        <p>
          <strong>Rabin-Karp vs Aho-Corasick (multi-pattern).</strong>
          Aho-Corasick handles patterns of mixed lengths in a single
          pass; Rabin-Karp is most natural with same-length patterns
          but extends to mixed lengths via per-length tables.
          Aho-Corasick is deterministic O(n + matches); Rabin-Karp is
          expected-linear with collision verification.
        </p>
        <p>
          <strong>Single vs double hash.</strong> Single hash has 1/p
          collision rate per comparison (≈ 10⁻¹⁸ for p ≈ 2^61). Verify
          on collision and you're fine for benign inputs. Double hash
          has 1/(p1·p2) collision rate, adversarial-proof up to
          knowledge of the parameters. Production code with adversarial
          input uses double-hash with random parameters.
        </p>
        <p>
          <strong>Rolling-hash variants.</strong> Polynomial hash
          (Rabin-Karp original) is general. Cyclic polynomial / Buzhash
          uses a rotating XOR over a precomputed table — faster on
          binary data. Gear hashing (FastCDC) uses table-lookup +
          shift; very fast on modern hardware. Adler-32 is weak but
          extremely fast and used in rsync.
        </p>
        <p>
          <strong>Rabin-Karp vs cryptographic hash.</strong> SHA-256 is
          collision-resistant against any adversary; rolling hashes
          aren't. But SHA-256 isn't rolling — recomputing from scratch
          every position is O(m) per shift. The standard pattern: weak
          rolling hash to find candidates, strong cryptographic hash
          to verify. Rsync, dedup storage, git all use this two-layer
          design.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p>
          <strong>Always verify on hash hit.</strong> A hash match is a
          candidate, not a confirmation. Compare the strings directly
          before reporting a match. Without this, you accept all
          collisions as matches — silently wrong.
        </p>
        <p>
          <strong>Use a Mersenne prime modulus.</strong> 2^61 - 1 enables
          fast bit-trick mod on 64-bit hardware. Combined with 64-bit
          multiplication, you can compute hash updates without
          overflow concerns when bases are small.
        </p>
        <p>
          <strong>Randomize b and p at startup for adversarial
          inputs.</strong> If patterns or texts come from untrusted
          sources, fixed (b, p) lets attackers construct collisions.
          Generate random b and p at process start; collisions become
          unpredictable.
        </p>
        <p>
          <strong>Use double hashing for safety-critical applications.</strong>
          Two independent hashes drop collision probability to 1/(p1·p2).
          For dedup storage where collisions cause silent data
          corruption, this is essential.
        </p>
        <p>
          <strong>Precompute b^(m-1).</strong> The rolling update needs
          this constant; compute once, reuse. Trivial optimization but
          easy to miss; doing it inside the loop costs O(log m) per
          step.
        </p>
        <p>
          <strong>Watch for negative mod in some languages.</strong> C,
          Java, and JavaScript yield negative results for negative
          dividends in <code>%</code>. After subtraction during the
          roll, add p before mod to keep values non-negative.
        </p>
        <p>
          <strong>For prefix-hash tables, store powers of b too.</strong>
          Precompute <code>pow[i] = b^i mod p</code> for i up to n.
          Substring hash queries become O(1).
        </p>
        <p>
          <strong>For CDC, choose k by target chunk size.</strong> Mask
          k bits gives average chunk size 2^k. Common: k=12 → 4 KB
          average; k=16 → 64 KB; k=20 → 1 MB. Smaller chunks dedup
          better but cost more metadata.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p>
          <strong>Forgetting to verify.</strong> Returning a "match" on
          hash equality alone produces silently wrong results.
          Always direct-compare on hash hit.
        </p>
        <p>
          <strong>Using a fixed small modulus.</strong> p = 10⁹ + 7 is
          common in competitive programming but has 1/p ≈ 10⁻⁹
          collision rate, frequently triggered on n = 10⁵ inputs.
          Larger primes (2^61 - 1) push the rate to 10⁻¹⁸.
        </p>
        <p>
          <strong>Negative numbers in subtraction.</strong> The roll
          formula subtracts <code>T[i] · b^(m-1)</code>. In modular
          arithmetic this can produce a negative pre-mod value. Add p
          (or work in unsigned 64-bit) to avoid sign issues.
        </p>
        <p>
          <strong>Hash overflow.</strong> Multiplying two 61-bit numbers
          overflows 64-bit. Use 128-bit intermediate (__int128 in C++,
          BigInt in JS) or be careful with the multiplication ordering
          to keep intermediates bounded.
        </p>
        <p>
          <strong>Adversarial inputs in production with fixed params.</strong>
          A library function with fixed b = 31 and p = 10⁹ + 7 is
          trivially attackable. Real production systems either use
          double hash, randomize parameters, or fall back to a
          collision-resistant hash.
        </p>
        <p>
          <strong>Mistaking hash equality for string equality in
          maps.</strong> A hash-keyed map storing strings by hash alone
          (no string comparison on lookup) is broken. The map needs
          either string equality or a strong hash (SHA-256) to be
          safe.
        </p>
        <p>
          <strong>Using polynomial hash for content addressing.</strong>
          Polynomial hashes are not collision-resistant against
          adversaries. Content-addressable storage must use a
          cryptographic hash (SHA-256 minimum) for the address itself;
          the rolling hash is only for boundary detection.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/rabin-karp-diagram-3.svg"
          alt="Rabin-Karp applications and content-defined chunking"
          caption="Production systems built on rolling hashes — rsync, dedup storage, plagiarism detection — and the content-defined chunking pattern."
        />
        <p>
          <strong>rsync.</strong> The original killer application for
          rolling hashes. Rsync sliding-window comparison uses adler-32
          (rolling) plus MD5 (verifying) to compute file deltas over a
          network with bandwidth proportional to the changed bytes.
          Tridgell's 1996 paper "The rsync algorithm" remains the
          canonical reference.
        </p>
        <p>
          <strong>Content-defined chunking.</strong> Restic, BorgBackup,
          Bup, attic, Dropbox sync, NetApp ASIS, Data Domain, and the
          ZFS dedup feature all use rolling hashes to find chunk
          boundaries that survive insertions and deletions. FastCDC and
          Gear hashing are modern refinements with better boundary
          statistics.
        </p>
        <p>
          <strong>Plagiarism detection.</strong> Stanford's MOSS, JPlag,
          and similar systems use winnowed rolling hashes (k-gram
          fingerprints with min-window selection) to find duplicated
          code or text across submissions. Used at scale in CS
          coursework grading and in academic-integrity tools.
        </p>
        <p>
          <strong>Bioinformatics.</strong> Minhash, sourmash, Mash, and
          the BWT-based aligners (BWA, Bowtie) use rolling hashes for
          k-mer indexing. The kraken-2 metagenomic classifier hashes
          k-mers in reads against a reference database. SARS-CoV-2
          variant tracking and outbreak surveillance pipelines use
          rolling-hash signatures.
        </p>
        <p>
          <strong>git.</strong> Git's pack file delta compression uses
          rolling hashes (Rabin fingerprints) to find common
          substrings between similar blobs. The rolling hash drives
          which block boundaries to align between source and target.
        </p>
        <p>
          <strong>Spam / malware detection.</strong> Classical approaches
          hash short fragments of incoming messages and check against
          blocklists. SimHash and MinHash use rolling-hash front-ends
          to compute similarity sketches at scale.
        </p>
        <p>
          <strong>Database query optimization.</strong> Some query
          engines hash substrings of column data to accelerate
          LIKE-pattern matching. The rolling-hash technique generalizes
          to fingerprint comparison across joined tables.
        </p>
        <p>
          <strong>Compiler diff / merge tools.</strong> Diff3, kdiff3,
          and similar use rolling hashes to find common subsequences
          across file versions, accelerating Myers-style diff for
          large files.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p>
          <strong>Implement strStr / indexOf.</strong> Either KMP or
          Rabin-Karp works. Strong candidates discuss the tradeoff:
          KMP for worst-case linearity, Rabin-Karp for simplicity and
          extensibility to multi-pattern.
        </p>
        <p>
          <strong>Repeated DNA Sequences (LeetCode 187).</strong> Find
          all 10-letter sequences that appear more than once in a DNA
          string. A perfect Rabin-Karp problem: roll a hash, store
          counts in a hash map, output keys with count &gt; 1.
        </p>
        <p>
          <strong>Longest Duplicate Substring (LeetCode 1044).</strong>
          Binary search over substring length k; for each k, use
          rolling hash to detect duplicates in O(n) expected. Total
          O(n log n) expected. Showcases the prefix-hash + binary
          search pattern.
        </p>
        <p>
          <strong>Find Pattern in Text with Multi-Pattern Set.</strong>
          k patterns of the same length m. Hash each pattern, roll the
          hash over the text, set-lookup at each position. O(n + km)
          expected.
        </p>
        <p>
          <strong>2D Pattern Search.</strong> Find an m × m pattern in
          an n × n grid. Hash rows of the pattern; hash sequences of
          row hashes; roll over the grid in both dimensions. Tests
          mastery of rolling-hash decomposition.
        </p>
        <p>
          <strong>Distinct substrings of a string.</strong> Compute
          prefix hashes, hash every substring, count distinct values.
          O(n²) expected with O(n) prefix-hash preprocessing. Watch for
          collisions on adversarial inputs.
        </p>
        <p>
          <strong>Why might Rabin-Karp degrade to O(n·m)?</strong>
          Conceptual question. Hash collisions force direct comparison
          at every position. Adversarial inputs that know the
          parameters can produce this. Mitigations: random parameters,
          double hashing, fallback to KMP.
        </p>
        <p>
          <strong>Design rsync.</strong> System-design framing. Strong
          answers cover the rolling-weak-checksum + strong-hash
          two-layer design, block-size tradeoffs, the protocol's
          asymmetric nature (sender does most work), and failure modes.
        </p>
        <p>
          <strong>Design a deduplicating backup system.</strong> Strong
          answers cover content-defined chunking, the rolling hash for
          boundary detection, content-addressable storage with a
          cryptographic hash, encryption of chunks for at-rest privacy,
          and metadata management.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <p>
          The original Karp-Rabin 1987 paper "Efficient Randomized
          Pattern-Matching Algorithms" introduces the algorithm and the
          fingerprinting framework. Knuth-Morris-Pratt's 1977 paper
          provides the deterministic alternative. CLRS Chapter 32 covers
          Rabin-Karp with collision analysis. Sedgewick and Wayne's <em>
          Algorithms</em> has a clean implementation.
        </p>
        <p>
          For rolling hashes in production, Andrew Tridgell's 1999 thesis
          "Efficient Algorithms for Sorting and Synchronization" — the
          rsync paper — is the canonical real-world treatment. Muthitacharoen,
          Chen, and Mazières's "A Low-Bandwidth Network File System"
          (LBFS, 2001) introduced content-defined chunking.
        </p>
        <p>
          For modern CDC, "FastCDC: a Fast and Efficient Content-Defined
          Chunking Approach for Data Deduplication" (Xia et al., USENIX
          ATC 2016) is the production-grade algorithm. "Buzhash" and
          "Gear hashing" papers document alternative rolling functions.
          The Restic and BorgBackup source code show real implementations.
        </p>
        <p>
          For plagiarism detection, Schleimer, Wilkerson, and Aiken's
          "Winnowing: Local Algorithms for Document Fingerprinting"
          (SIGMOD 2003) is the MOSS paper. Manber's "Finding Similar
          Files in a Large File System" (1994) is an earlier related
          work.
        </p>
        <p>
          For string algorithms generally, Crochemore, Hancart, and
          Lecroq's <em>Algorithms on Strings</em> covers Rabin-Karp,
          KMP, Boyer-Moore, and Aho-Corasick with proofs and benchmarks.
          Gusfield's <em>Algorithms on Strings, Trees, and Sequences</em>{" "}
          covers fingerprinting in the context of bioinformatics.
        </p>
      </section>
    </ArticleLayout>
  );
}
