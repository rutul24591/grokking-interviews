"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-search-ranking-experimentation-ui",
  title: "Design a Search Ranking Experimentation UI",
  description: "Principal-level search and discovery system design covering query understanding, indexing, retrieval, ranking, facets, personalization, experimentation, abuse, privacy, and observability.",
  category: "high-level-design",
  subcategory: "search-discovery-systems",
  slug: "search-ranking-experimentation-ui",
  wordCount: 3500,
  readingTime: 21,
  lastUpdated: "2026-05-29",
  tags: ["hld", "search", "ranking", "discovery", "indexing", "experimentation"],
  relatedTopics: [],
};

const definition = [
  "Design a Search Ranking Experimentation UI is a discovery system where user intent, index freshness, ranking quality, result presentation, and feedback loops all shape whether users find the right thing. A principal-ready answer treats a search ranking experimentation UI as a full search product, not as a text box backed by an index.",
  "The visible UI is only the final step in a larger pipeline: content ingestion, indexing, query understanding, retrieval, ranking, filtering, presentation, analytics, and continuous quality improvement. If any part drifts, users see irrelevant results, stale content, empty states, or unsafe recommendations.",
  "Search and discovery systems are also adversarial. Sellers, creators, spammers, and internal teams may try to game ranking signals. The architecture should include spam controls, policy filters, quality metrics, and explainability for operators.",
  "The design should define which state is authoritative. Indexed documents, ranking features, facet counts, suggestions, recommendations, and analytics are projections. Permissions, takedowns, privacy policy, inventory availability, and safety decisions need stronger enforcement.",
  "A staff/principal answer should be able to defend latency, relevance, freshness, privacy, cost, and experimentation trade-offs under pressure. Search is not only about returning results quickly; it is about returning the right results safely and measurably."
];
const concepts = [
  "The first concept is query understanding. The system should handle spelling, synonyms, entity detection, intent classification, natural language, filters, personalization, and query rewriting without hiding how much confidence it has.",
  "The second concept is retrieval strategy. traffic splitter, metric pipeline, and guardrail dashboard may use lexical retrieval, vector retrieval, structured filters, popularity priors, freshness boosts, or hybrid retrieval depending on the product.",
  "The third concept is ranking. Ranking combines relevance, quality, freshness, personalization, safety, diversity, availability, and business constraints. A principal design avoids optimizing only clicks because clicks can reward spam, clickbait, or shallow results.",
  "The fourth concept is freshness and consistency. Search indexes, suggestions, facet counts, embeddings, analytics, and recommendations can lag. Takedowns, permissions, private data, inventory state, and safety blocks need fast invalidation or query-time enforcement.",
  "The fifth concept is feedback. Explicit feedback, clicks, dwell time, reformulations, no-click sessions, hides, reports, purchases, completions, and abandonment all provide quality signals. These signals must be protected from fraud and bias.",
  "The sixth concept is observability. Track query latency, suggestion latency, zero-result rate, reformulation rate, click position, long-click rate, facet usage, index lag, permission-filter drops, freshness distribution, and ranking experiment guardrails."
];
const architecture = [
  "The architecture contains experiment registry, traffic splitter, metric pipeline, guardrail dashboard, rollback control. The ingestion path normalizes documents or items and builds indexes. The query path parses user intent, retrieves candidates, ranks them, applies policy and permissions, and renders results. The feedback path records behavior for analytics, quality review, and controlled ranking updates.",
  "Indexing should be version-aware. A document, video, product, or answer should know which content version produced its search document, embedding, snippet, thumbnail, and facet values. This is essential for rollback, takedown propagation, and explaining stale results.",
  "The query serving path should be layered. A fast suggestion path handles prefix and recent queries. A retrieval path returns candidate IDs. A ranking path scores candidates. A policy path enforces permissions, safety, consent, inventory, and regional restrictions. A rendering path builds snippets, highlights, facets, and empty-state guidance.",
  "The frontend should preserve query state in URLs or route state where appropriate, but the backend should own interpretation. Filters, facets, sort order, pagination cursor, personalization mode, and experiment assignment should be explicit and reproducible for support and debugging.",
  "Result presentation matters. The UI should show why results match when possible, make filters reversible, avoid hiding zero-result recovery options, and handle partial failures such as missing facets or delayed recommendations without losing the primary result list.",
  "Operations need controls for index rebuild, ranking rollback, synonym rollback, suggestion blacklist, spam demotion, model rollback, experiment stop, cache purge, and privacy takedown verification."
];
const tradeoffs = [
  "Lexical search is predictable and strong for exact terms, IDs, error codes, and names. Semantic search handles intent and paraphrase better, but can return surprising matches and is harder to explain. Hybrid retrieval is often the most defensible production choice.",
  "Query-time permission filtering is safer but can be expensive and may reduce candidate quality after ranking. Index-time filtering is faster but risks stale permissions. Sensitive systems usually combine indexed permission fields with query-time enforcement for high-risk data.",
  "Fresh indexes improve trust but cost more in ingestion, indexing throughput, and cache churn. Batch indexing is cheaper and simpler but creates visible lag. The right answer depends on whether users expect real-time discovery.",
  "Personalization improves relevance but creates privacy and filter-bubble concerns. Anonymous or generic ranking is more explainable but can be less useful. A strong design supports user controls, privacy modes, and unbiased evaluation sets.",
  "Facet counts and aggregations improve exploration but can be expensive over large datasets and misleading under approximate counts. The UI should distinguish exact, approximate, delayed, or unavailable aggregations when it matters.",
  "Experimentation improves ranking quality but can harm users if guardrails are weak. Search experiments need relevance metrics, latency, zero-result rate, complaint/report rate, revenue or conversion, diversity, and fairness guardrails."
];
const practices = [
  "Define relevance and quality metrics before choosing infrastructure. A fast search system with poor relevance is not successful; a relevant search system with unacceptable latency is also not successful.",
  "Keep search documents and ranking features versioned. Store source ID, source version, index version, embedding version, policy version, and freshness timestamp where possible.",
  "Use stable pagination cursors. Offset pagination becomes incorrect when ranking changes, new content arrives, or policy filters remove results between pages.",
  "Protect sensitive queries and logs. Query text can contain names, secrets, health data, customer IDs, or legal terms. Redact, sample, aggregate, and restrict access to raw logs.",
  "Build quality review tools. Search teams need query replay, side-by-side ranking comparison, bad-result labeling, zero-result review, synonym management, and rollback controls.",
  "Handle empty and low-confidence states intentionally. Suggest spelling fixes, broader filters, related categories, popular results, saved searches, or escalation depending on product context.",
  "Separate online serving from offline training and evaluation. Production ranking should be reproducible and rollback-safe even if model training or analytics pipelines are delayed."
];
const pitfalls = [
  "metric gaming is usually caused by optimizing one path while ignoring the full discovery loop. Suggestions, results, facets, and recommendations must share policy and freshness assumptions.",
  "sample pollution becomes a trust issue when ranking rewards behavior without integrity checks. Search systems need spam, abuse, and business-rule guardrails.",
  "guardrail regression happens when indexes and derived projections are treated as secondary. Users experience stale search as product incorrectness, not infrastructure lag.",
  "bad rollout is dangerous because search can expose private or unsafe content through snippets, suggestions, facets, caches, and analytics dashboards.",
  "Another pitfall is measuring only click-through rate. Clicks can increase when results are ambiguous, sensational, or low quality. Use long-clicks, reformulation, task completion, reports, and satisfaction signals.",
  "Teams also forget supportability. Operators should be able to answer why a result appeared, why it ranked where it did, what filters applied, and which experiment or model was active."
];
const useCases = [
  "ranking A/B test console requires query understanding, retrieval, ranking, filtering, presentation, and feedback to work as one system rather than separate widgets.",
  "offline-to-online relevance review requires query understanding, retrieval, ranking, filtering, presentation, and feedback to work as one system rather than separate widgets.",
  "search quality release gate requires query understanding, retrieval, ranking, filtering, presentation, and feedback to work as one system rather than separate widgets.",
  "During an indexing incident, the product should continue serving existing results, show freshness where appropriate, pause risky ranking changes, and provide index lag dashboards and rebuild controls.",
  "During a spam or abuse incident, the system should demote suspicious documents, blacklist harmful suggestions, throttle abusive actors, and preserve review evidence.",
  "During a ranking experiment regression, teams should stop the experiment, replay affected queries, compare side-by-side results, and roll back the ranking or feature version safely."
];
const questions = [
  {
    "question": "How would you design a search ranking experimentation UI end to end?",
    "answer": "I would design ingestion, indexing, query understanding, retrieval, ranking, policy enforcement, result rendering, and feedback loops as separate but observable stages. The frontend owns query state and presentation, while the backend owns interpretation, candidate retrieval, ranking, and permission enforcement. Operations need index rebuilds, ranking rollback, query replay, spam controls, and quality dashboards."
  },
  {
    "question": "Why this architecture over a simple indexed keyword search?",
    "answer": "Keyword search alone is predictable but insufficient for intent, personalization, facets, semantic matching, ranking experiments, policy enforcement, and quality learning. The layered architecture adds complexity, but it lets the system tune relevance, freshness, safety, and latency independently."
  },
  {
    "question": "What breaks at scale?",
    "answer": "The main failures are metric gaming, sample pollution, guardrail regression, bad rollout, plus cache stampedes, index lag, high-cardinality facets, hot queries, ranking drift, spam manipulation, privacy leaks in logs, and experiment regressions. Prevention requires versioned indexes, stable cursors, guardrail metrics, query sampling, cache strategy, and operational rollback."
  },
  {
    "question": "What consistency model applies?",
    "answer": "Search indexes, suggestions, embeddings, facet counts, recommendations, and analytics can be eventually consistent if freshness is tracked. Permissions, takedowns, private data, safety filters, inventory availability, and paid access need strong query-time enforcement or fast invalidation. The design should classify each projection explicitly."
  },
  {
    "question": "How do you handle failure, rollback, abuse, privacy, cost, and observability?",
    "answer": "Failures are handled through stale-but-safe results, index rebuild, ranking rollback, degraded facets, and query replay. Abuse is controlled through spam scoring, suggestion blacklists, rate limits, and moderation. Privacy requires query log minimization and permission-safe snippets. Cost is controlled through caching, tiered indexes, approximate aggregations, and sampling. Observability tracks latency, freshness, zero-result rate, reformulation, guardrails, and quality labels."
  },
  {
    "question": "How do you defend trade-offs under interviewer pressure?",
    "answer": "I would separate exact retrieval, semantic intent, ranking, policy, and presentation. I would defend hybrid retrieval because it handles both exact and fuzzy intent. I would defend eventual index consistency for normal discovery, but not for privacy or takedown enforcement. I would also explain how guardrails prevent ranking optimizations from harming trust."
  }
];
const references = [
  {
    "label": "Elasticsearch relevance and query guide",
    "href": "https://www.elastic.co/guide/index.html"
  },
  {
    "label": "Lucene scoring documentation",
    "href": "https://lucene.apache.org/core/"
  },
  {
    "label": "Google Search quality documentation",
    "href": "https://developers.google.com/search/docs"
  },
  {
    "label": "Nielsen Norman Group: search usability",
    "href": "https://www.nngroup.com/topic/search/"
  },
  {
    "label": "Google SRE Workbook",
    "href": "https://sre.google/workbook/table-of-contents/"
  },
  {
    "label": "NIST privacy framework",
    "href": "https://www.nist.gov/privacy-framework"
  }
];

export default function SearchRankingExperimentationUiArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section><h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="important">{definition[0]}</HighlightBlock>{definition.slice(1).map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Core Concepts</h2>{concepts.map((item, index) => index === 3 ? <HighlightBlock as="p" tier="crucial" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}</section>
      <section>
        <h2>Architecture &amp; Flow</h2>
        {architecture.map((item, index) => index === 0 ? <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/search-discovery-systems/search-ranking-experimentation-ui.svg" alt="Design a Search Ranking Experimentation UI architecture" caption="Architecture view: ingestion, query understanding, retrieval, ranking, policy, rendering, and feedback loops." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/search-discovery-systems/search-ranking-experimentation-ui-flow.svg" alt="Design a Search Ranking Experimentation UI flow" caption="Flow view: query lifecycle, candidate retrieval, ranking, filtering, result presentation, and quality feedback." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/search-discovery-systems/search-ranking-experimentation-ui-operations.svg" alt="Design a Search Ranking Experimentation UI operations" caption="Operations view: index freshness, ranking rollback, spam controls, privacy-safe logs, and search quality observability." />
      </section>
      <section><h2>Trade offs &amp; Comparison</h2>{tradeoffs.map((item, index) => index === 0 ? <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}</section>
      <section><h2>Best practices</h2>{practices.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Common Pitfalls</h2>{pitfalls.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Real-world use cases</h2>{useCases.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Common interview question with detailed answer</h2>{questions.map((item) => <div key={item.question} className="mb-6"><h3 className="mb-2 text-lg font-semibold">{item.question}</h3><p>{item.answer}</p></div>)}</section>
      <section><h2>References</h2><ul className="list-disc space-y-2 pl-6">{references.map((item) => <li key={item.href}><a href={item.href} target="_blank" rel="noreferrer" className="text-blue-600 underline dark:text-blue-400">{item.label}</a></li>)}</ul></section>
    </ArticleLayout>
  );
}
