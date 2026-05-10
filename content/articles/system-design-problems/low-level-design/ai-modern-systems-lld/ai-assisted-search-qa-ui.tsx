"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-ai-assisted-search-qa",
  title: "AI-Assisted Search & Q&A UI",
  description:
    "Semantic search powered by embeddings with retrieval-augmented generation (RAG) for question answering from documents.",
  category: "low-level-design",
  subcategory: "ai-modern-systems",
  slug: "ai-assisted-search-qa-ui",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: ["lld", "ai", "search", "rag", "embeddings", "semantic"],
  relatedTopics: ["token-streaming-buffer", "streaming-chat-ui"],
};

export default function AIAssistedSearchQAArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          A developer searches an internal documentation site for "how to configure database connection pooling." Keyword search returns 47 results containing those words — including a 3-year-old blog post, a Confluence page about a different database, and the actual configuration guide buried at position 12. The user has to manually scan 12 results to find what they need. The information is available; the retrieval is failing.
        </p>
        <p>
          AI-assisted search addresses this with two complementary techniques: semantic search (find documents by conceptual similarity, not just keyword overlap) and retrieval-augmented generation (RAG, use the retrieved documents to generate a direct answer to the question rather than returning a list of links). The result: the user asks a natural language question and receives a direct answer with citations, rather than a ranked list of documents to scan manually.
        </p>
        <p>
          The engineering challenge is multi-dimensional. Embedding computation must be pre-computed offline (real-time embedding of queries is fast; real-time embedding of all documents at query time is not). Vector similarity search must scale to millions of documents with sub-100ms latency. The LLM that generates the answer must be grounded — it should not hallucinate facts that aren't in the retrieved documents. Citations must be accurate, linking to the exact passages that support each claim. And the entire pipeline must be observable, so quality regressions (new documents added that degrade retrieval precision) are caught before they reach production.
        </p>
        <p>
          <strong>Explicit assumptions:</strong> Documents are pre-indexed with embeddings stored in a vector database. The same embedding model is used for both document indexing and query embedding. The LLM supports structured output (JSON mode) for returning citations alongside the answer. The use case is information retrieval (answering factual questions from known documents), not open-ended generation.
        </p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Semantic Query Understanding:</strong> Classify query intent (factual Q&A vs navigational vs exploratory) and route to appropriate retrieval strategy.
          </li>
          <li>
            <strong>Dense Retrieval:</strong> Embed the user's query using the same model as document indexing; retrieve top-K documents by cosine similarity from the vector store.
          </li>
          <li>
            <strong>Re-ranking:</strong> Optionally apply a cross-encoder re-ranker to improve retrieval precision by comparing each candidate document against the query in a joint representation.
          </li>
          <li>
            <strong>Answer Generation:</strong> Construct a prompt including the question and retrieved document excerpts; generate a concise, grounded answer via LLM.
          </li>
          <li>
            <strong>Citation Display:</strong> Return the answer with inline citation markers ([1], [2]) linked to the specific source documents and passages that support each claim.
          </li>
          <li>
            <strong>Graceful Unknowns:</strong> When the retrieved documents do not contain sufficient information to answer the question, respond with "I don't have enough information to answer that" rather than hallucinating.
          </li>
          <li>
            <strong>Hybrid Search:</strong> Fall back to traditional keyword search results alongside the AI answer for navigational queries where the user is looking for a specific document rather than an answer.
          </li>
          <li>
            <strong>User Feedback:</strong> Collect thumbs up/down and optionally a correction from users on AI answers to drive continuous quality improvement.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>End-to-end latency:</strong> From query submission to displayed answer: P50 under 2s, P95 under 5s (embedding + vector search takes ~50ms; LLM generation takes 1–4s depending on response length and streaming).
          </li>
          <li>
            <strong>Retrieval scale:</strong> Support up to 10 million indexed documents with sub-100ms vector search (achievable with approximate nearest neighbor algorithms like HNSW in Pinecone or Qdrant).
          </li>
          <li>
            <strong>Hallucination rate:</strong> Target under 5% of answers containing factual claims not grounded in the retrieved documents, as measured by automated grounding checks.
          </li>
          <li>
            <strong>Citation accuracy:</strong> 95%+ of inline citations should correctly link to the passage that supports the cited claim.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <li>No relevant documents retrieved (empty result set) — LLM must say "I don't know" rather than generating from parametric knowledge.</li>
          <li>Multi-turn conversation where a follow-up question ("What about the performance implications?") requires context from the previous answer to disambiguate.</li>
          <li>Sensitive documents with access controls — the retrieval system must enforce per-user document permissions so users do not receive answers grounded in documents they're not authorized to read.</li>
          <li>Contradictory information across documents — two documents give conflicting answers; the system should surface the conflict rather than arbitrarily choosing one.</li>
          <li>Query in a different language than the document corpus — cross-lingual embedding models (multilingual-e5) handle this, but monolingual models fail.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          The RAG pipeline is a staged flow. First, classify the query intent so the UI can decide whether to answer directly or emphasize navigation. Next, embed the query using the same embedding family used for indexing, then retrieve the top semantically similar document chunks from the vector store. Optionally re-rank the retrieved set with a stronger model to improve precision. Build the model prompt from a system instruction, the retrieved context, and the user question. The model returns an answer plus a list of citations that reference the retrieved chunks. The UI renders the answer with inline citation links, runs lightweight grounding checks to flag potential hallucinations, and always shows traditional search results as a fallback path when the user prefers to read sources directly.
        </p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/ai-modern-systems/ai-assisted-search-qa-ui.svg"
          alt="AI-assisted search and QA UI showing query pipeline with intent classification and RAG retrieval, AI answer card with citations, hybrid search results, and source handling"
          caption="AI-assisted search and QA UI showing query pipeline with intent classification and RAG retrieval, AI answer card with citations, hybrid search results, and source handling"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Document Indexing Pipeline</h3>
        <p>
          Before queries can be answered, documents must be indexed. The indexing pipeline: (1) Chunk documents into semantically coherent segments (400–600 tokens per chunk, with 50-token overlap between adjacent chunks to preserve context across chunk boundaries). (2) Embed each chunk using the chosen embedding model. (3) Store each chunk's embedding vector alongside metadata (documentId, chunkIndex, sourceUrl, title, lastUpdated) in the vector store. (4) Maintain a separate document store (SQL or document DB) with the full text of each chunk, keyed by chunkId, for retrieval during generation.
        </p>
        <p>
          Chunking strategy significantly affects retrieval quality. Fixed-size chunking (always 400 tokens) is simple but splits sentences and paragraphs mid-thought. Semantic chunking (split on paragraph boundaries, heading changes, or sentence embeddings that diverge significantly) produces more coherent chunks at the cost of variable chunk sizes. For knowledge bases and documentation, semantic chunking consistently outperforms fixed-size chunking in retrieval precision benchmarks.
        </p>
        <p>
          Index freshness: when a document is updated or deleted, its chunks must be re-embedded and the vector store updated. This is the hardest operational challenge for large document sets — maintain a mapping from documentId to chunk IDs for efficient deletion, and trigger re-indexing on document update events via a content management webhook or document change detection job.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Query Classification and Intent Routing</h3>
        <p>
          Not all queries are best served by RAG. A lightweight intent classifier (fine-tuned small LLM or even a rule-based heuristic) routes queries: factual questions ("what is X", "how do I Y") → full RAG pipeline; navigational queries ("go to the billing page", "find the API documentation") → keyword search or sitemap; conversational chitchat ("thanks", "that's helpful") → direct response without retrieval; ambiguous queries → clarifying question.
        </p>
        <p>
          This routing prevents unnecessary LLM API calls and vector searches for queries where they add no value, reducing latency and cost. The routing decision should be deterministic and fast (under 50ms) to not add perceptible latency to the query path.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Dense Retrieval and Approximate Nearest Neighbor</h3>
        <p>
          Embedding models produce dense vectors (768–3072 dimensions). Exact nearest neighbor search over millions of vectors is O(n) in corpus size — too slow for interactive queries. Approximate nearest neighbor (ANN) algorithms (HNSW, IVF-PQ) provide O(log n) search at the cost of occasionally missing the true nearest neighbor. Modern vector databases (Pinecone, Qdrant, Weaviate) implement HNSW with recall rates above 95% at under 10ms for 10M-vector corpora.
        </p>
        <p>
          Filtering during vector search is critical for access control and freshness: filter by userId permissions, by document category, or by lastUpdated date. Vector databases support metadata filters applied during the ANN search (pre-filtering) or after (post-filtering). Pre-filtering (filter before ANN) is more correct but limits the search space, potentially degrading recall. Post-filtering is more precise on recall but may return fewer than K results if many results are filtered out. For strict access control (e.g., financial documents with row-level permissions), pre-filtering is necessary despite the recall trade-off.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cross-Encoder Re-Ranking</h3>
        <p>
          Bi-encoder retrieval (embedding both query and document independently) is fast but imprecise — it can't model the interaction between a specific query and a specific document. Cross-encoder re-ranking takes the top-K bi-encoder candidates and scores each (query, document) pair jointly, producing significantly more accurate relevance scores. The trade-off is latency: cross-encoding K=20 candidates adds 100–300ms to the pipeline.
        </p>
        <p>
          For high-stakes Q&A (legal, medical, compliance), the precision gain from re-ranking justifies the latency cost. For casual documentation Q&A where speed matters more than precision, skip re-ranking. A hybrid: use re-ranking only when the top-K bi-encoder results have low maximum similarity scores (indicating the query is ambiguous or the corpus lacks strong matches).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Context Construction and Context Window Management</h3>
        <p>
          The LLM prompt includes: a system instruction ("Answer the question based only on the provided context. If the answer is not in the context, say 'I don't have enough information.' Include inline citations [N] for each claim."), the retrieved document chunks as numbered context sections (each chunk numbered for citation reference), and the user's question. The total prompt must fit within the model's context window (typically 8K–128K tokens depending on the model).
        </p>
        <p>
          Context window management: if the retrieved chunks exceed the available context, apply a truncation strategy. Options: take the top-K by re-ranker score until the window is full; summarize each chunk to a fixed token budget before inclusion; or split into multiple LLM calls (multi-hop RAG) where each call retrieves and synthesizes part of the answer. For most applications, taking top-5 chunks (typically 2000–3000 tokens) and leaving the rest of the window for the question and answer generation is sufficient.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Structured Output for Citations</h3>
        <p>
          The LLM is prompted to return a structured payload containing two parts: the final answer text (with inline citation markers like bracketed numbers) and a citations list that maps each marker to a specific retrieved chunk, including the chunk identifier, document title, an excerpt, and a source link. When the model supports structured output modes, enabling them reduces the most common failure mode of free-form output: malformed or ambiguous citation formatting.
        </p>
        <p>
          Citation rendering: inline citation numbers ([1]) in the answer text link to the corresponding source cards displayed below the answer. Each source card shows the document title, a brief excerpt of the specific passage cited, and a link to the full document. On hover, a popover shows the full excerpt context, reducing the need to navigate away to verify a citation.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Hallucination Detection</h3>
        <p>
          After generation, run an automated grounding check: for each claim in the answer, verify that at least one of the cited source chunks supports the claim. This can be implemented as a second LLM call (a cheaper, faster model) that evaluates each claim against its cited source and returns a confidence score. Claims with low confidence are flagged with a visual indicator ("This claim may not be fully supported by the source").
        </p>
        <p>
          The grounding check adds latency (~500ms for a second LLM call). For high-stakes applications (medical, legal), this overhead is justified. For general documentation Q&A, a simpler heuristic (if the answer contains specific numbers or proper nouns not present in any retrieved chunk, flag as potentially hallucinated) can catch the most egregious cases without a full second LLM call.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Hybrid Search UI: AI Answer + Traditional Results</h3>
        <p>
          The UI should display both the AI-generated answer and traditional ranked search results. The AI answer appears above the fold in a visually distinct card (different background, AI logo/badge, citation links). Below it, the traditional search results provide a fallback for users who don't trust the AI answer, want to explore the broader topic, or need to navigate to a specific document by name. Providing both respects the full range of user intents without forcing a binary choice between AI and keyword search.
        </p>
        <p>
          A "Show/hide AI answer" toggle allows users to opt out of AI answers. A confidence indicator (based on the re-ranker's top-1 score and the grounding check results) contextualizes when the AI answer should be trusted. High confidence: AI answer shown prominently. Low confidence: traditional results shown first with AI answer in a collapsible section.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring and Quality Evaluation</h3>
        <p>
          Offline evaluation: maintain a test set of question-answer pairs (curated by domain experts) and run regular evaluations against it using automated metrics (RAGAS: faithfulness, answer relevance, context precision, context recall). Measure retrieval quality separately (normalized discounted cumulative gain for the retrieved chunks against the gold document set). Regressions on any metric trigger alerts before the change reaches production.
        </p>
        <p>
          Online evaluation: collect user feedback (thumbs up/down, correction submissions) and compute satisfaction rate per query category. Track the "abandonment" signal — users who immediately click a traditional search result after receiving an AI answer likely found the AI answer unhelpful. A/B testing of retrieval strategies, re-rankers, and prompt templates against satisfaction rate and abandonment provides ongoing optimization data.
        </p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Retrieval Precision vs Recall</h3>
        <p>
          Retrieving more documents (higher K) improves recall (less likely to miss the relevant document) but increases the context window used by the LLM, raises cost, and can dilute the LLM's focus on the most relevant information. K=3–5 is the practical sweet spot for most document Q&A use cases. For complex multi-faceted questions that span multiple topics, a higher K (10–15) with aggressive re-ranking is more appropriate.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Grounding vs Creativity</h3>
        <p>
          Strict grounding (answer only from retrieved context) prevents hallucination but produces terse, mechanical answers — the LLM cannot use its background knowledge to contextualize or explain retrieved facts. Allowing limited use of parametric knowledge (what the LLM knows from pre-training) produces more natural, helpful explanations but increases hallucination risk. Most production RAG systems use a strict grounding instruction and rely on retrieval quality (not parametric knowledge) for completeness.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Embedding Model Selection and Update</h3>
        <p>
          Embedding models improve over time. Switching to a better embedding model (e.g., from text-embedding-ada-002 to text-embedding-3-large) requires re-embedding the entire document corpus — an expensive offline operation. For a 1M-document corpus, this takes hours to days and costs significant API fees. A hybrid index approach (keep old embeddings, add new embeddings for updated documents) allows gradual migration without a full re-index, but complicates the retrieval layer. Plan for periodic embedding model migrations in the architecture.
        </p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>
          AI-assisted search using RAG transforms keyword-based document retrieval into direct question answering with citations. The pipeline centers on pre-computed document embeddings, ANN-based vector search, optional cross-encoder re-ranking, context-aware LLM prompting with structured citation output, and automated hallucination detection. Hybrid search (AI answer + traditional results) respects the full range of user intent. Document access control via vector store metadata filtering enforces permissions. Continuous quality evaluation through offline test sets and online user feedback drives systematic improvement. For staff-level engineers, the critical architecture decisions are: chunking strategy (semantic beats fixed-size for precision); grounding instruction strictness (strict for high-stakes, lenient for casual Q&A); citation structure (JSON mode is more reliable than free-form text with embedded citations); and the offline evaluation pipeline (without systematic measurement, retrieval quality silently degrades with document updates).
        </p>
      </section>
    </ArticleLayout>
  );
}
