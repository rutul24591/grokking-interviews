"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-backend-query-processing",
  title: "Query Processing",
  description:
    "Comprehensive guide to query processing covering tokenization, query expansion, spelling correction, intent detection, and query optimization for search systems.",
  category: "functional-requirements",
  subcategory: "discovery-search-feed-browsing",
  slug: "query-processing",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-25",
  tags: [
    "requirements",
    "functional",
    "discovery",
    "search",
    "query",
    "backend",
    "nlp",
  ],
  relatedTopics: ["search-indexing", "search-ranking", "autocomplete", "spell-correction"],
};

export default function QueryProcessingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Query Processing</strong> is the pipeline that transforms raw user search
          input into optimized queries that retrieve relevant results. It is the critical
          first step in search—garbage in, garbage out. Even the best ranking algorithms
          cannot recover from poor query understanding. Query processing handles tokenization,
          normalization, expansion, spelling correction, and intent detection to maximize
          result relevance.
        </p>
        <p>
          Modern query processing goes beyond simple keyword matching. It handles typos
          ("iphne" → "iphone"), synonyms ("laptop" OR "notebook"), query intent
          (navigational vs informational vs transactional), and context (user location,
          search history). Google processes 8.5B searches per day, each going through
          sophisticated query understanding pipelines that run in &lt;100ms.
        </p>
        <p>
          For staff-level engineers, query processing involves NLP techniques (tokenization,
          stemming, entity recognition), spelling correction algorithms (edit distance,
          phonetic matching), query expansion strategies (synonyms, related terms), and
          performance optimization (caching, query rewriting). Understanding trade-offs
          between precision and recall is critical.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Tokenization</h3>
        <p>
          Tokenization splits query text into searchable terms (tokens):
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Whitespace Tokenization:</strong> Split on spaces. Simple but fails
            for compound words ("New York" → ["New", "York"]).
          </li>
          <li>
            <strong>Pattern-based Tokenization:</strong> Split on punctuation, special
            characters. Handles hyphens, slashes ("state-of-the-art" → ["state", "of", "the", "art"]).
          </li>
          <li>
            <strong>Language-specific Tokenization:</strong> Different languages have
            different rules. Chinese/Japanese require segmentation (no spaces between
            words). German has compound nouns.
          </li>
          <li>
            <strong>Entity-aware Tokenization:</strong> Preserve named entities as single
            tokens. "New York" stays as one token, not split.
          </li>
        </ul>

        <h3 className="mt-6">Normalization</h3>
        <p>
          Normalization transforms tokens to canonical form for matching:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Lowercasing:</strong> Convert to lowercase. "iPhone" → "iphone".
            Standard practice, loses case information (may matter for proper nouns).
          </li>
          <li>
            <strong>Accent Folding:</strong> Remove diacritics. "café" → "cafe", "naïve" → "naive".
            Improves recall for international queries.
          </li>
          <li>
            <strong>Stop Word Removal:</strong> Remove common words (the, a, is, at).
            Reduces index size, but can hurt phrase search ("To Be or Not to Be").
          </li>
          <li>
            <strong>Stemming:</strong> Reduce to root form. "running" → "run", "happiness" → "happi".
            Improves recall but can over-stem ("university" → "univers" loses meaning).
          </li>
          <li>
            <strong>Lemmatization:</strong> Reduce to dictionary form. "better" → "good",
            "running" → "run". More accurate than stemming but slower (requires POS tagging).
          </li>
        </ul>

        <h3 className="mt-6">Query Expansion</h3>
        <p>
          Query expansion adds related terms to improve recall:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Synonym Expansion:</strong> Add synonyms ("laptop" → "laptop OR notebook").
            Use synonym dictionaries (WordNet) or learned synonyms from query logs.
          </li>
          <li>
            <strong>Related Terms:</strong> Add semantically related terms ("camera" → "camera
            OR lens OR photography"). Use word embeddings (Word2Vec, GloVe) or knowledge
            graphs.
          </li>
          <li>
            <strong>Query Reformulation:</strong> Rewrite query based on context. "apple"
            for tech user → "Apple Inc", for cooking user → "apple fruit".
          </li>
          <li>
            <strong>Automatic Query Expansion (AQE):</strong> Use top results from initial
            query to find related terms. Risk: query drift if initial results off-topic.
          </li>
        </ul>

        <h3 className="mt-6">Spelling Correction</h3>
        <p>
          Spelling correction fixes typos and variations:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Edit Distance (Levenshtein):</strong> Count character edits to transform
            one word to another. "iphne" → "iphone" (1 insertion). Efficient for small
            dictionaries, expensive for large.
          </li>
          <li>
            <strong>N-gram Matching:</strong> Break words into character n-grams. "iphone" →
            ["iph", "pho", "hon", "one"]. Match n-grams for fuzzy matching. Faster than
            edit distance.
          </li>
          <li>
            <strong>Phonetic Matching:</strong> Match words that sound similar. Soundex,
            Metaphone, Double Metaphone. "Smith" matches "Smyth". Good for names, less
            useful for general queries.
          </li>
          <li>
            <strong>ML-based Correction:</strong> Train sequence-to-sequence model on
            query logs with typos. Google's spelling correction uses deep learning.
            Handles context ("to" vs "too" vs "two").
          </li>
        </ul>

        <h3 className="mt-6">Intent Detection</h3>
        <p>
          Query intent classification determines what user wants:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Navigational:</strong> User wants specific page/site. "facebook login",
            "youtube". Return exact match, site homepage.
          </li>
          <li>
            <strong>Informational:</strong> User seeks information. "how to tie tie",
            "weather today". Return articles, guides, answers.
          </li>
          <li>
            <strong>Transactional:</strong> User wants to buy/do something. "buy iphone",
            "book hotel". Return products, booking sites.
          </li>
          <li>
            <strong>Commercial Investigation:</strong> User comparing options. "iphone vs
            samsung", "best laptop 2024". Return comparisons, reviews, roundups.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Production query processing pipeline involves multiple stages transforming
          raw query into optimized search.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/query-processing/query-processing-pipeline.svg"
          alt="Query Processing Pipeline"
          caption="Figure 1: Query Processing Pipeline — Raw query through tokenization, normalization, expansion, correction to optimized query"
          width={1000}
          height={500}
        />

        <h3>Pipeline Stages</h3>
        <ul className="space-y-3">
          <li>
            <strong>Input Validation:</strong> Check query length (max 1000 chars), strip
            dangerous characters (XSS prevention), detect language.
          </li>
          <li>
            <strong>Tokenization:</strong> Split into tokens. Handle quotes for phrase
            search ("exact phrase"). Preserve entity boundaries.
          </li>
          <li>
            <strong>Normalization:</strong> Lowercase, accent fold, remove stop words
            (optional), stem/lemmatize.
          </li>
          <li>
            <strong>Spelling Correction:</strong> Check each token against dictionary.
            Suggest corrections for unknown words. Apply if confidence &gt; threshold.
          </li>
          <li>
            <strong>Query Expansion:</strong> Add synonyms, related terms. Limit expansion
            to prevent query explosion (max 10 terms).
          </li>
          <li>
            <strong>Intent Classification:</strong> Classify query intent. Adjust ranking
            weights based on intent (navigational → exact match boost).
          </li>
          <li>
            <strong>Query Rewriting:</strong> Convert to search engine DSL (Elasticsearch
            query DSL). Optimize for execution.
          </li>
        </ul>

        <h3 className="mt-6">Query Optimization Techniques</h3>
        <p>
          Optimizing queries for efficient execution:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Technique</th>
                <th className="text-left p-2 font-semibold">Purpose</th>
                <th className="text-left p-2 font-semibold">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Term Pruning</td>
                <td className="p-2">Remove low-value terms</td>
                <td className="p-2">"best laptop for students" → "laptop students"</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Phrase Boosting</td>
                <td className="p-2">Boost exact phrase matches</td>
                <td className="p-2">"running shoes" phrase boost 2x</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Field Boosting</td>
                <td className="p-2">Boost matches in important fields</td>
                <td className="p-2">title^3, description^1</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Proximity Search</td>
                <td className="p-2">Find terms near each other</td>
                <td className="p-2">"running"~5 "shoes"~5</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Wildcard Optimization</td>
                <td className="p-2">Use index-friendly wildcards</td>
                <td className="p-2">run* (not *run)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/query-processing/spelling-correction-algorithms.svg"
          alt="Spelling Correction Algorithms"
          caption="Figure 2: Spelling Correction — Edit distance, n-gram matching, phonetic matching, and ML-based approaches"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Caching Strategies</h3>
        <p>
          Query caching reduces processing overhead for repeated queries:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Query Result Cache:</strong> Cache full query results. Key: normalized
            query hash. TTL based on content freshness. Hit rate: 30-50% for popular queries.
          </li>
          <li>
            <strong>Query Suggestion Cache:</strong> Cache spelling corrections, synonyms.
            Key: original query. Long TTL (updates infrequently).
          </li>
          <li>
            <strong>Partial Query Cache:</strong> Cache intermediate results (after
            tokenization, before expansion). Useful for autocomplete.
          </li>
          <li>
            <strong>Cache Invalidation:</strong> Invalidate on content updates. Use
            versioned cache keys or short TTL for dynamic content.
          </li>
        </ul>

        <h3 className="mt-6">Handling Special Queries</h3>
        <ul className="space-y-3">
          <li>
            <strong>Empty Query:</strong> Show trending/popular content, search history,
            or category browsing. Never show empty results.
          </li>
          <li>
            <strong>Single Character:</strong> Require minimum 2-3 characters. Show
            autocomplete suggestions instead of results.
          </li>
          <li>
            <strong>Very Long Query:</strong> Truncate to max length (1000 chars). Extract
            key terms, ignore stop words. May indicate copy-paste—offer advanced search.
          </li>
          <li>
            <strong>Special Characters:</strong> Handle operators (+, -, ", ~). Escape
            regex characters. Preserve quotes for phrase search.
          </li>
          <li>
            <strong>Numbers:</strong> Handle ranges ("10-20"), comparisons ("&gt;100"),
            exact numbers (model numbers, years).
          </li>
        </ul>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Query processing design involves balancing precision, recall, and performance.
        </p>

        <h3>Stemming vs Lemmatization</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Approach</th>
                <th className="text-left p-2 font-semibold">Accuracy</th>
                <th className="text-left p-2 font-semibold">Speed</th>
                <th className="text-left p-2 font-semibold">Complexity</th>
                <th className="text-left p-2 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Stemming</td>
                <td className="p-2">Medium (over-stems)</td>
                <td className="p-2">Very Fast</td>
                <td className="p-2">Low</td>
                <td className="p-2">High-volume search</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Lemmatization</td>
                <td className="p-2">High (dictionary form)</td>
                <td className="p-2">Medium</td>
                <td className="p-2">Medium (POS tagging)</td>
                <td className="p-2">Precision-critical search</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">No Normalization</td>
                <td className="p-2">Exact match only</td>
                <td className="p-2">Fastest</td>
                <td className="p-2">Lowest</td>
                <td className="p-2">Code, product IDs</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/query-processing/query-expansion-strategies.svg"
          alt="Query Expansion Strategies"
          caption="Figure 3: Query Expansion — Synonym expansion, related terms, and automatic query expansion with precision/recall trade-offs"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Query Expansion Trade-offs</h3>
        <p>
          <strong>No Expansion:</strong> Highest precision, lowest recall. User must know
          exact terms. Good for expert users, technical search.
        </p>
        <p>
          <strong>Moderate Expansion:</strong> Add 2-3 synonyms per term. Balanced
          precision/recall. Most production systems use this.
        </p>
        <p>
          <strong>Aggressive Expansion:</strong> Add many related terms. High recall, low
          precision. Risk: query drift (results off-topic). Use for exploratory search.
        </p>

        <h3 className="mt-6">Spelling Correction Confidence</h3>
        <p>
          <strong>High Confidence (&gt;90%):</strong> Auto-correct without asking. "iphne"
          → "iphone". Show "Showing results for iphone".
        </p>
        <p>
          <strong>Medium Confidence (50-90%):</strong> Suggest correction, show both
          results. "Did you mean: iphone? Showing results for iphne".
        </p>
        <p>
          <strong>Low Confidence (&lt;50%):</strong> Don't correct. May be intentional
          (brand name, technical term). Show original results.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Log All Queries:</strong> Store raw queries, processed queries, clicked
            results. Use for synonym discovery, spelling correction training, query
            understanding improvement.
          </li>
          <li>
            <strong>Use Query Caching:</strong> Cache normalized query results. Set
            appropriate TTL based on content freshness. Monitor cache hit rate (target:
            30-50%).
          </li>
          <li>
            <strong>Implement Spelling Correction:</strong> Use edit distance for small
            dictionaries, n-gram for large. Learn common corrections from query logs.
          </li>
          <li>
            <strong>Handle Synonyms:</strong> Maintain synonym dictionary. Update from
            query logs (users searching X also click results for Y).
          </li>
          <li>
            <strong>Respect Phrase Search:</strong> Preserve quoted terms as exact
            phrases. Don't expand or correct within quotes.
          </li>
          <li>
            <strong>Set Minimum Query Length:</strong> Require 2-3 characters before
            searching. Show autocomplete for shorter queries.
          </li>
          <li>
            <strong>Provide Query Feedback:</strong> Show "Did you mean...", "Showing
            results for...", number of results. Help users understand what happened.
          </li>
          <li>
            <strong>Test with Real Queries:</strong> Use query logs for testing. Don't
            just test with ideal queries—test with typos, long-tail, ambiguous queries.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Over-correction:</strong> Correcting intentional queries (brand names,
            technical terms). Solution: Whitelist known brands, use confidence threshold.
          </li>
          <li>
            <strong>Query Drift:</strong> Expansion adds off-topic terms. Solution: Limit
            expansion count, use query-independent scoring for expansion candidates.
          </li>
          <li>
            <strong>Stop Word Removal Hurting Phrases:</strong> "To Be or Not to Be"
            becomes meaningless. Solution: Don't remove stop words in phrase queries.
          </li>
          <li>
            <strong>Over-stemming:</strong> "University" → "univers" loses meaning.
            Solution: Use lemmatization for critical fields, maintain exception dictionary.
          </li>
          <li>
            <strong>Ignoring Context:</strong> "Apple" corrected to fruit for tech query.
            Solution: Use user context (history, domain) for disambiguation.
          </li>
          <li>
            <strong>No Fallback:</strong> Zero results for corrected query. Solution:
            Fall back to original query if corrected query returns 0 results.
          </li>
          <li>
            <strong>Slow Processing:</strong> Complex pipeline adds latency. Solution:
            Cache aggressively, parallelize stages, set timeout per stage.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Google Search</h3>
        <p>
          Google processes 8.5B searches daily with sophisticated query understanding.
          Handles spelling correction ("iphne" → "iphone"), synonym expansion ("laptop"
          → "notebook"), intent detection (navigational vs informational), and context
          (location, search history).
        </p>
        <p>
          <strong>Key Innovation:</strong> BERT integration (2019) for query understanding.
          Understands context ("can you get medicine for someone pharmacy").
        </p>

        <h3 className="mt-6">Amazon Product Search</h3>
        <p>
          Amazon handles product queries with attribute extraction ("red dress size M"),
          brand normalization ("Nike" vs "NIKE"), and category detection. Query processing
          feeds into product ranking with conversion optimization.
        </p>
        <p>
          <strong>Key Innovation:</strong> Query rewriting for e-commerce ("running shoes
          for women" → category: shoes, gender: women, use: running).
        </p>

        <h3 className="mt-6">Stack Overflow Search</h3>
        <p>
          Stack Overflow handles technical queries with code-aware tokenization (preserves
          underscores, camelCase), language detection (python vs Python), and tag
          extraction.
        </p>
        <p>
          <strong>Key Innovation:</strong> Code-aware stemming ("NullPointerException"
          stays intact, not stemmed to "nullpointexcept").
        </p>

        <h3 className="mt-6">Spotify Music Search</h3>
        <p>
          Spotify handles music queries with artist/album/song disambiguation, fuzzy
          matching for artist names, and genre detection. Handles partial queries ("bohemian"
          → "Bohemian Rhapsody").
        </p>
        <p>
          <strong>Key Innovation:</strong> Phonetic matching for artist names ("Beyonce"
          matches "Beyoncé", "Chaile" matches "Charlie").
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle spelling correction?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use edit distance (Levenshtein) for small dictionaries,
              n-gram matching for large. Learn common corrections from query logs (users
              searching X then clicking results for Y). Use phonetic matching (Soundex,
              Metaphone) for names. For production, use ML-based sequence-to-sequence
              models trained on query logs. Apply correction only if confidence &gt;
              threshold (90%+). Show "Did you mean..." for medium confidence.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle ambiguous queries?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Detect ambiguity (short queries, multiple meanings).
              Show results for multiple interpretations ("apple" → fruit + tech). Ask
              clarifying question ("Did you mean Apple Inc or apple fruit?"). Use user
              context (search history, location, domain) to disambiguate. For navigational
              queries, show exact match prominently.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement query expansion?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use synonym dictionaries (WordNet, custom synonyms from
              query logs). Add 2-3 synonyms per term (limit to prevent query explosion).
              Use word embeddings (Word2Vec, GloVe) for related terms. Apply query-independent
              scoring to rank expansion candidates. Monitor precision/recall trade-off.
              Allow users to disable expansion for exact search.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle phrase search?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Preserve quoted terms as exact phrases. Don't apply
              stemming, expansion, or correction within quotes. Use proximity search
              ("running"~5 "shoes"~5) for slop tolerance. Index position information for
              phrase matching. Boost exact phrase matches higher than individual term
              matches.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize query processing latency?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Cache normalized query results (key: query hash).
              Parallelize pipeline stages where possible. Set timeout per stage (fail
              gracefully). Use efficient data structures (trie for autocomplete, bloom
              filter for dictionary lookup). Pre-compute expensive operations (synonym
              expansion). Monitor p99 latency, set SLOs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you detect query intent?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use classification model (logistic regression, BERT)
              trained on labeled queries. Features: query length, presence of action
              words ("buy", "book"), domain-specific terms. Use click patterns
              (navigational queries have high CTR on first result). Consider user context
              (location for local intent). Adjust ranking weights based on detected intent.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://ai.googleblog.com/2019/10/bert-understanding-language-in-search.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google AI Blog — BERT for Query Understanding
            </a>
          </li>
          <li>
            <a
              href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Elasticsearch — Query DSL Reference
            </a>
          </li>
          <li>
            <a
              href="https://nlp.stanford.edu/IR-book/html/htmledition/query-operations-1.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stanford IR Book — Query Operations
            </a>
          </li>
          <li>
            <a
              href="https://engineeringblog.yelp.com/tag/search/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Yelp Engineering — Search Query Processing Articles
            </a>
          </li>
          <li>
            <a
              href="https://www.amazon.science/search"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Amazon Science — Search Query Processing Research
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
