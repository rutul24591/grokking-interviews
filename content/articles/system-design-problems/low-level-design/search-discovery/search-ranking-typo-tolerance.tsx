"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-search-ranking-typo-tolerance",
  title: "Search Ranking & Typo Tolerance",
  description:
    "Production-grade search implementation covering edit distance, BK-trees, phonetic matching, BM25 scoring, multi-signal ranking pipeline, query expansion, synonym handling, did-you-mean, and search analytics feedback loops.",
  category: "low-level-design",
  subcategory: "search-discovery",
  slug: "search-ranking-typo-tolerance",
  wordCount: 5400,
  readingTime: 32,
  lastUpdated: "2026-05-16",
  tags: ["search", "ranking", "bm25", "typo-tolerance", "edit-distance", "query-expansion", "lld"],
};

export default function SearchRankingTypoToleranceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
        Search is one of the highest-value features in any product — users who search have high intent and
        convert at higher rates than passive browsers. A search system that fails to handle typos, surface
        relevant results, or respond quickly loses users permanently. FAANG engineers are expected to understand
        the full stack: from query parsing and typo correction through scoring and ranking to frontend UX and
        analytics feedback loops.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/search-discovery/search-ranking-typo-tolerance.svg"
        alt="Search ranking and typo tolerance architecture diagram"
        caption="Edit distance, BM25 ranking pipeline, query expansion, and search analytics feedback loop"
      />

      <h2>Query Processing Pipeline</h2>
      <p>
        Every search query goes through a processing pipeline before reaching the index. The pipeline transforms
        raw user input into a structured query that maximizes recall while maintaining precision.
      </p>
      <p>
        <strong>Tokenization.</strong> Split the query on whitespace and punctuation. Lowercase all tokens.
        Handle special cases: camelCase splitting ("iPhone" → "iphone" + "phone" for broader matching),
        hyphenated terms ("e-mail" → "email"), and numeric strings ("ipad2" as both "ipad" + "2" and "ipad2").
      </p>
      <p>
        <strong>Stop word removal.</strong> Common words ("the", "a", "of", "in") add noise without specificity.
        Remove them for standard queries. But preserve them in phrase queries — "band of brothers" would break
        if "of" were removed. Detect phrase intent by quotation marks or high-specificity queries.
      </p>
      <p>
        <strong>Stemming vs lemmatization.</strong> Stemming reduces words to a base form by removing suffixes:
        "running" → "run", "better" → "bett" (Porter stemmer). Fast but imprecise. Lemmatization uses
        vocabulary and morphological analysis: "better" → "good", "mice" → "mouse". Slower but accurate.
        Use stemming at index time for recall; consider lemmatization for high-value queries where precision
        matters more than speed.
      </p>
      <p>
        <strong>Query classification.</strong> Classify the query intent before processing: navigational
        (user wants a specific page — "facebook login"), informational (user wants to learn — "what is BFS"),
        transactional (user wants to do something — "buy iphone 15 case"). Different intent classes may
        route to different indexes or get different ranking weights.
      </p>

      <h2>Typo Tolerance — Edit Distance Algorithms</h2>
      <p>
        Typo tolerance recovers from user input errors — misspellings, transpositions, missing letters — and
        matches against the correct term in the index.
      </p>
      <p>
        <strong>Levenshtein distance.</strong> The minimum number of single-character edits (insertions,
        deletions, substitutions) to transform one string into another. Computed via dynamic programming in
        O(mn) where m and n are string lengths. Edit distance 1 covers most single-key typos ("recieve" →
        "receive" is 1 substitution). Edit distance 2 covers double typos and some autocorrect failures.
      </p>
      <p>
        <strong>Damerau-Levenshtein distance.</strong> Extends Levenshtein with transpositions (swapping
        adjacent characters: "teh" → "the" = 1 edit). In practice, transpositions are among the most common
        typing errors — DL distance is almost always preferred over plain Levenshtein for search.
      </p>
      <p>
        <strong>Threshold selection.</strong> Apply edit distance selectively based on query term length:
        length 1–4: exact match only (too short for fuzzy — would match too many terms). Length 5–8:
        allow distance 1. Length 9+: allow distance 2. Never apply fuzzy matching to the entire query —
        compute per token and use AND logic (all tokens must match within threshold).
      </p>

      <HighlightBlock as="p" tier="crucial">
        Never apply typo tolerance to the first 3 characters of a term — this would match far too many
        unrelated words. Always require the first character to match exactly, and apply fuzzy matching
        only to the remaining characters. Algolia and Elasticsearch both implement this heuristic to
        avoid false positives.
      </HighlightBlock>

      <p>
        <strong>BK-tree (Burkhard-Keller tree).</strong> A metric tree that enables efficient lookup of
        all dictionary words within edit distance k of the query. Build: insert the first word as root.
        For each subsequent word, compute its edit distance to the current node; follow the edge labeled
        with that distance, creating it if absent. Query: at each node, if |d(query, node) - k| ≤ threshold,
        recurse into children within the range. Expected O(log n) per query for small k. Suitable for
        building in-process vocabulary lookup without Elasticsearch.
      </p>
      <p>
        <strong>Trigram index.</strong> Split each dictionary word into character trigrams: "hello" →
        "hel", "ell", "llo". Index words by their trigrams. At query time, compute the query's trigrams,
        find candidate words sharing at least N trigrams, then apply exact edit distance to rank them.
        Trigram matching is fast (inverted index lookup) and can be implemented in PostgreSQL using the
        <code>pg_trgm</code> extension and GiST index — enabling fuzzy search directly in the database.
      </p>

      <h2>Phonetic Matching</h2>
      <p>
        Phonetic algorithms group words that sound similar into the same bucket, enabling
        "sounds like" matching. Critical for name search where spelling varies significantly.
      </p>
      <p>
        <strong>Soundex.</strong> The original phonetic algorithm (1918). Encodes the first letter plus
        a 3-digit code based on consonant groupings. "Smith" and "Smyth" both encode to S530. Very fast,
        very approximate — many false positives.
      </p>
      <p>
        <strong>Metaphone / Double Metaphone.</strong> More sophisticated phonetic encoding that handles
        English pronunciation rules. Double Metaphone generates two encodings (primary and alternate) to
        handle pronunciation variations. "Catherine" and "Katherine" → same Metaphone code.
      </p>
      <p>
        <strong>Caverphone.</strong> Designed for New Zealand names, better for English variants of European
        names. Useful when your user base has highly varied name spellings.
      </p>
      <p>
        Use phonetic matching as a supplement to edit distance, not a replacement. Combine: exact match →
        prefix match → edit distance ≤ 1 → edit distance ≤ 2 → phonetic match. Each stage broadens recall
        with decreasing precision. Display results from earlier stages first.
      </p>

      <h2>BM25 — The Standard Relevance Scoring Function</h2>
      <p>
        BM25 (Best Match 25) is the baseline ranking algorithm used by Elasticsearch, Solr, and Lucene.
        It extends TF-IDF with field length normalization and saturation.
      </p>
      <p>
        The BM25 score for term t in document d:
      </p>
      <p>
        score(d, t) = IDF(t) × [TF(d,t) × (k1 + 1)] / [TF(d,t) + k1 × (1 - b + b × |d| / avgdl)]
      </p>
      <p>
        Where: IDF(t) = log((N - df + 0.5) / (df + 0.5) + 1), N = total documents, df = documents
        containing t. TF(d,t) = term frequency in document d. |d| = document length. avgdl = average
        document length. k1 (1.2–2.0) controls term frequency saturation — high TF doesn't linearly
        increase score. b (0.75) controls length normalization — long documents are penalized.
      </p>
      <p>
        <strong>Multi-field BM25.</strong> Search across title, description, tags with different weights.
        Compute BM25 separately per field and combine: score = 3 × title_score + 2 × tag_score + 1 × description_score.
        Title matches should always rank higher than body matches for navigational queries.
      </p>

      <h2>Multi-Signal Ranking Pipeline</h2>
      <p>
        BM25 alone is insufficient for production search — it ignores quality signals, personalization,
        and behavioral data. A production ranking pipeline has three stages.
      </p>
      <p>
        <strong>Stage 1 — Retrieval.</strong> BM25 over the full index produces the candidate set (top 100–1000
        documents). This stage optimizes recall — we want all potentially relevant documents in the candidate set.
        The BM25 score is a proxy for text relevance; sorting purely by BM25 would favor keyword stuffing.
      </p>
      <p>
        <strong>Stage 2 — Feature augmentation.</strong> For each candidate, compute additional signals:
        popularity score (click count, view count, save count), recency (newer documents boosted by a time
        decay function), quality signals (completion rate, average rating), authority signals (domain rank,
        author reputation), and personalization multipliers (has user engaged with this author/category before).
      </p>
      <p>
        <strong>Stage 3 — Re-ranking.</strong> A lightweight ML model (LambdaRank, XGBoost, or a small neural
        ranker) takes the feature-augmented candidates and produces a final ranked list. LambdaRank directly
        optimizes NDCG (Normalized Discounted Cumulative Gain) — the standard ranking quality metric.
        Inference is fast (&lt;10ms) because the candidate set is small (100–1000 documents).
      </p>
      <p>
        <strong>Diversity enforcement.</strong> Without diversity enforcement, the top 10 results may all be
        from the same source or category. Apply Maximal Marginal Relevance (MMR): at each position, select
        the candidate that maximizes relevance minus a penalty proportional to similarity to already-selected
        results. This ensures varied results while maintaining relevance.
      </p>

      <h2>Query Expansion and Synonym Handling</h2>
      <p>
        Query expansion broadens the query to retrieve more relevant documents that use different terminology.
      </p>
      <p>
        <strong>Synonym expansion.</strong> Two approaches: query-time expansion (add synonyms to the query:
        "sofa OR couch OR settee") or index-time expansion (index each document's terms plus their synonyms).
        Query-time is more flexible (update synonym list without re-indexing) but larger queries. Index-time
        produces larger indexes but simpler queries.
      </p>
      <p>
        <strong>Abbreviation expansion.</strong> "NYC" → "New York City", "JS" → "JavaScript". Build a
        domain-specific abbreviation dictionary. Apply expansion before sending to the search engine.
      </p>
      <p>
        <strong>Semantic query expansion.</strong> Use an embedding model to find semantically similar terms
        to the query. Add top-k similar terms to the query. Hybrid search: combine BM25 (lexical) with vector
        similarity search using Reciprocal Rank Fusion (RRF) to merge the two ranked lists.
      </p>
      <p>
        <strong>Did-you-mean (spell correction).</strong> The Noisy Channel Model: P(correction | query) ∝
        P(query | correction) × P(correction). P(correction) is the unigram probability from a large corpus
        (query log or Wikipedia). P(query | correction) is the probability of the typo given the correction
        — approximated by edit distance. Select the correction that maximizes this product. Show "Did you mean:
        [correction]?" only when the correction has significantly higher frequency than the original query
        and the edit distance is 1 or 2.
      </p>

      <h2>Frontend Search UX Implementation</h2>
      <p>
        <strong>Debouncing.</strong> Fire search requests 200–300ms after the user stops typing. Cancel
        in-flight requests when a new keystroke arrives (AbortController). For autocomplete dropdowns, 150ms
        is typically fast enough — shorter delays increase server load without noticeable UX improvement.
      </p>
      <p>
        <strong>Instant results from cache.</strong> Maintain a client-side cache of recent query → results
        mappings. On each keystroke, check if a prefix of the current query is cached and display those
        results instantly while the full query request is in-flight. This creates the perception of instant
        search.
      </p>
      <p>
        <strong>Result highlighting.</strong> Wrap matched tokens in the response with highlight markup.
        The search engine returns highlight snippets alongside results. Render using dangerouslySetInnerHTML
        only after sanitizing — or build a highlight renderer that maps match positions to React spans.
      </p>
      <p>
        <strong>Empty results UX.</strong> Never show a blank page. On zero results: show the did-you-mean
        suggestion if available, suggest related categories, show popular searches, and offer to broaden filters.
        Track the zero-result query for analytics — it indicates a content gap or indexing problem.
      </p>
      <p>
        <strong>URL synchronization.</strong> Encode query, filters, sort order, and page number in the URL.
        This enables shareable search URLs, browser back-button navigation, and SEO indexing of search results
        pages. Use the URL as the source of truth — initialize search state from URL params on page load.
      </p>

      <h2>Search Analytics and Feedback Loops</h2>
      <p>
        Search quality is measured and improved through analytics. The key metrics:
      </p>
      <p>
        <strong>Click-Through Rate (CTR) by position.</strong> Track which result position was clicked for
        each query. Position-normalized CTR (dividing by the expected CTR for that position) reveals which
        results users actually prefer. Feed this back into the ranking model as a training signal.
      </p>
      <p>
        <strong>Dwell time.</strong> How long the user spent on the clicked result before returning to search.
        Long dwell time → relevant result. Short dwell time + return to search → poor result (pogo-sticking).
        Weight results with high dwell time higher in future rankings.
      </p>
      <p>
        <strong>Zero-result rate.</strong> Alert if more than 5% of queries return zero results. Investigate
        whether the issue is query parsing, index gaps, or filter combinations that eliminate all candidates.
      </p>
      <p>
        <strong>Query reformulation rate.</strong> If users frequently modify their query immediately after
        seeing results, the initial query is not being understood correctly. Analyze these query pairs to
        improve query understanding and synonym expansion.
      </p>
      <p>
        <strong>A/B testing ranking changes.</strong> Never deploy ranking changes without an A/B test.
        Compute NDCG, CTR, and conversion rate for both variants. Require statistical significance (p &lt; 0.05)
        before promoting changes. Some ranking improvements in NDCG hurt conversion — measure business metrics,
        not just relevance metrics.
      </p>

      <h2>Interview Questions</h2>

      <h3>Q1: What is BM25 and how does it improve over TF-IDF?</h3>
      <p>
        TF-IDF scores documents by term frequency (TF) times inverse document frequency (IDF). It has two problems:
        (1) TF grows linearly — a document with 100 mentions of a term scores 10× higher than one with 10 mentions,
        even though the relevance difference is much smaller. (2) Long documents get unfairly high scores simply
        because they have more words.
      </p>
      <p>
        BM25 fixes both: the k1 parameter adds a saturation term to TF — very high TF values are diminishing
        returns (the score approaches an asymptote). The b parameter normalizes by document length — long
        documents are penalized proportionally to how much longer they are than average. This makes BM25 much
        more robust to document length variation and keyword stuffing.
      </p>

      <h3>Q2: How would you implement typo tolerance for a product search with 10M SKUs?</h3>
      <p>
        Build a vocabulary from all product names and attributes (~500K unique terms after normalization).
        Index this vocabulary in a BK-tree for efficient edit-distance queries. At query time: tokenize the
        query, for each token query the BK-tree for all vocabulary terms within edit distance 1 (or 2 for
        long tokens). Build an expanded query: "original_token OR fuzzy_match_1 OR fuzzy_match_2...". Send
        to Elasticsearch with the fuzzy alternatives as should clauses. Boost exact matches over fuzzy matches
        using the boost parameter.
      </p>
      <p>
        For a production system at 10M SKUs: use Elasticsearch's built-in fuzziness parameter which implements
        DL distance internally. Configure fuzziness: "AUTO" (0 for len 1-2, 1 for len 3-5, 2 for len 6+).
        Add prefix_length: 2 to require the first 2 characters to match exactly — reduces false positives
        significantly. Cache frequent query → fuzzy expansion mappings in Redis (TTL 1 hour).
      </p>

      <h3>Q3: Design the ranking pipeline for an e-commerce search with personalization.</h3>
      <p>
        Stage 1 — Retrieval: BM25 across product name (3×), category (2×), brand (2×), description (1×).
        Retrieve top 500 candidates. Filter by availability (in-stock only), category (if filtered), and
        price range.
      </p>
      <p>
        Stage 2 — Feature engineering per candidate: BM25 score, product popularity (30-day sales rank),
        recency (new arrivals boost), quality (average rating × review count log), image quality score,
        margin score (business signal), personalization: has user viewed this category/brand in last 30 days
        (0/1), purchased similar products (0/1).
      </p>
      <p>
        Stage 3 — LambdaRank model trained on click data: input is the feature vector, output is the ranking
        score. NDCG is the training objective. Model is lightweight (gradient boosted trees, &lt;5ms inference
        for 500 candidates). A/B test every model update with hold-out traffic. Final list: apply diversity
        (no more than 3 items from the same brand in top 10).
      </p>

      <h3>Q4: How does the did-you-mean feature work, and when should you show it?</h3>
      <p>
        Did-you-mean uses the Noisy Channel Model. Build a language model over a large query corpus (query
        log frequency). For the user's query, generate candidate corrections within edit distance 1–2 using
        a BK-tree lookup. Score each candidate: score = log P(candidate) + log P(query|candidate). P(candidate)
        is the unigram frequency. P(query|candidate) is estimated from the edit operations (deletion, insertion,
        substitution) with weights learned from common keyboard errors.
      </p>
      <p>
        Show did-you-mean when: (1) the query has few or zero results, (2) the top correction has frequency
        at least 10× the query frequency, and (3) the edit distance is ≤ 2. Don't show it when the original
        query has many good results — the user may have intentionally searched for an unusual term. Automatically
        execute the corrected query and show "Showing results for [correction]. Search instead for [original]?"
        when the query has 0 results and a high-confidence correction exists.
      </p>

      <h3>Q5: How would you implement real-time search for a billion-document index?</h3>
      <p>
        A billion-document index cannot be held on a single machine. Shard the index: distribute documents
        across N shards (Elasticsearch automatically assigns documents via routing hash). Each query is
        broadcast to all shards, results are merged by the coordinator, and the top K are returned.
      </p>
      <p>
        For real-time: new documents are indexed with a small delay (near-real-time, ~1 second) as Lucene
        segments are refreshed. For immediately available documents (breaking news, live inventory), use a
        separate hot index that is queried alongside the main index with results merged.
      </p>
      <p>
        Latency: with N shards, the query latency is max(shard_latency) not sum — all shards run in parallel.
        Target P99 &lt; 100ms by: (1) caching common queries (top 1000 queries serve 50%+ of traffic), (2) using
        query result caching in Elasticsearch (filter caches), (3) limiting result set size to top 1000,
        (4) deploying shards on NVMe SSDs for fast random I/O. For autocomplete, use a separate trie-based
        index (O(prefix_length) lookup) not BM25.
      </p>

      <h3>Q6: How do you measure and improve search quality over time?</h3>
      <p>
        Define metrics: NDCG@10 (ranking quality), CTR@1 (are users clicking the first result), zero-result
        rate, query reformulation rate, search-to-conversion rate, and dwell time. Collect training data
        from user interactions: (query, clicked_result, position, dwell_time) tuples.
      </p>
      <p>
        Improve iteratively: (1) Identify low-CTR queries in the top 1000 → inspect top results → diagnose
        whether it's a relevance gap (wrong results), a content gap (no good results), or a UX gap (results
        are good but poorly displayed). (2) Expand synonyms for zero-result queries that have obvious corrections.
        (3) Retrain the ranking model monthly on fresh click data. (4) A/B test every change — a 1% CTR
        improvement at 10M queries/day is enormous. (5) Use human judgment (relevance assessors) to create
        labeled datasets for offline NDCG evaluation — don't rely solely on click data (popularity bias).
      </p>
    </ArticleLayout>
  );
}
