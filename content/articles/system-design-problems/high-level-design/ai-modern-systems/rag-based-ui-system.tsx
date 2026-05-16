"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-rag-based-ui-system",
  title: "Design a RAG-Based UI System",
  description:
    "Architecture for a retrieval-augmented generation UI: ingestion pipeline, chunking strategy, vector retrieval, re-ranking, context assembly, citation rendering, hallucination detection, and tenant isolation.",
  category: "high-level-design",
  subcategory: "ai-modern-systems",
  slug: "rag-based-ui-system",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-16",
  tags: ["hld", "rag", "vector-db", "embeddings", "citations", "retrieval", "llm", "hnsw"],
  relatedTopics: ["ai-chatbot-frontend", "ai-powered-search-interface"],
};

export default function RagBasedUiSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
        A RAG (Retrieval-Augmented Generation) UI system allows users to ask questions
        against a private knowledge base — internal documentation, legal contracts,
        research papers — and receive grounded answers with citations linking each claim
        to its source. The two distinct engineering problems are the retrieval pipeline
        (finding the relevant document chunks for a given query) and the UI design
        (presenting the answer with its citations in a way that lets users verify claims
        and trust the output). A RAG system that produces correct answers with poor citation
        UI is barely better than a plain LLM — users cannot verify the answer. A RAG
        system with excellent UI but poor retrieval produces confident-sounding hallucinations.
        Both components must be engineered deliberately.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/high-level-design/ai-modern-systems/rag-based-ui-system-architecture.svg"
        alt="RAG UI system architecture showing ingestion pipeline (documents, chunker, embedder, vector DB, metadata index), query pipeline (user query, query rewriter, embed query, ANN search, re-ranker, LLM with context), and UI components (query composer, source citations panel, streaming answer, confidence indicator, hallucination guard, feedback)"
        caption="RAG architecture: offline ingestion pipeline (chunk, embed, store) + real-time query pipeline (rewrite, ANN, re-rank, LLM stream) + citation-rich UI"
      />

      <h2>Clarifying the Requirements</h2>
      <p>
        The scope of a RAG system spans from a simple FAQ search to a fully autonomous
        research assistant. Define the scope upfront:
      </p>
      <p>
        <strong>Closed or open corpus?</strong> A closed corpus (known, pre-indexed
        documents under the organization's control) is far simpler than an open corpus
        (web crawling, real-time indexing). Nearly all enterprise RAG systems use a
        closed corpus. Freshness requirements (how quickly do document updates appear
        in retrieval?) affect the ingestion pipeline design.
      </p>
      <p>
        <strong>Single-tenant or multi-tenant?</strong> A shared knowledge base (all
        users query the same documents) is straightforward. Multi-tenant systems (each
        organization has its own document corpus that must not leak to other tenants)
        require strict isolation at the vector store level — not just application-level
        filtering, which is insufficient for compliance.
      </p>
      <HighlightBlock as="p" tier="crucial">
        The hallucination problem is the defining challenge. LLMs generate fluent,
        authoritative-sounding text even when their retrieved context contains no relevant
        information. The RAG UI must make this visible: flagging when a sentence is not
        supported by any retrieved chunk, showing confidence levels derived from retrieval
        similarity scores, and providing the "No Data" response that withholds an answer
        entirely when retrieval finds nothing relevant. A system that always generates
        an answer — even when it shouldn't — will be trusted until it's wrong, at which
        point all trust is lost.
      </HighlightBlock>

      <h2>Document Ingestion Pipeline</h2>
      <p>
        The ingestion pipeline runs asynchronously when documents are uploaded and produces
        the vector index that the query pipeline queries at runtime.
      </p>
      <p>
        <strong>Parsing.</strong> Documents are converted to plain text using format-specific
        parsers: pdfminer or PyMuPDF for PDFs, html-to-text for HTML pages, markdown-it
        for Markdown. Tables require special handling — a table represented as text loses
        the column relationships that make it useful. Convert tables to a structured text
        format that preserves column labels and row relationships ("Timeout: 30s; Service:
        payment-gateway; Environment: production"). Images in PDFs are optionally passed
        through a vision model to extract text descriptions.
      </p>
      <p>
        <strong>Chunking.</strong> The embedding model takes a fixed-size input (typically
        512–8192 tokens). Documents must be split into chunks that fit within this limit.
        Fixed-size chunking (always 512 tokens with a 20% overlap — 102 tokens — between
        adjacent chunks) is the baseline. The overlap ensures that queries about content
        spanning a chunk boundary retrieve context from both sides.
      </p>
      <HighlightBlock as="p" tier="important">
        Semantic chunking produces higher-quality retrieval for most document types.
        Rather than splitting at a fixed token count, split at semantic boundaries:
        paragraph endings, heading changes, or points where the sentence-level similarity
        between adjacent sentences drops significantly. For documentation structured with
        clear sections (API docs, legal contracts with numbered clauses), splitting on
        section/clause boundaries produces chunks that are coherent semantic units —
        each chunk discusses one topic completely. Implement by embedding each sentence,
        computing rolling cosine similarity between adjacent pairs, and splitting where
        similarity drops below a threshold (typically 0.65–0.75). The variable chunk
        sizes this produces are fine — the embedding model handles them within its token
        limit.
      </HighlightBlock>
      <p>
        <strong>Embedding and storage.</strong> Each chunk is embedded using the target
        embedding model (the same model used for query embedding — mixing models produces
        incomparable vector spaces). Chunks are stored in the vector database with metadata:
        documentId, chunkIndex, sourceUrl, pageNumber (for PDFs), section title, tenantId,
        and lastUpdated. The tenantId is stored as an indexed filter field (not metadata)
        to enable efficient pre-filtering during retrieval. The chunk text itself is stored
        in a separate document store (SQL or object storage) keyed by chunkId — vector
        databases are optimized for vector similarity, not text storage.
      </p>
      <p>
        <strong>Ingestion status tracking.</strong> The UI shows ingestion progress per
        document: uploading → parsing → chunking → embedding (with percentage: "43/120
        chunks embedded") → ready. A document is not searchable until it reaches the
        ready state. Failed ingestion (parse error, embedding API rate limit) shows an
        error card with a retry button and the failure reason.
      </p>

      <h2>Retrieval Pipeline</h2>
      <p>
        The query pipeline runs in real time for each user question and must complete
        in under 1200ms to keep time-to-first-token under 1.5s (including LLM generation
        startup).
      </p>
      <p>
        <strong>Query embedding.</strong> The user's question is embedded using the same
        model as the documents. For multi-turn conversations, the current question is
        first rewritten to be self-contained: "what about the timeout?" after a discussion
        of payment gateways becomes "what is the timeout configuration for the payment
        gateway service?" A fast LLM call handles this rewriting and adds ~100ms.
      </p>
      <p>
        <strong>ANN retrieval.</strong> The query vector is compared against all chunk
        vectors using Hierarchical Navigable Small World (HNSW) approximate nearest
        neighbor search. HNSW achieves recall above 95% at under 10ms for 10 million
        vectors. The retrieval returns top-K candidates (typically K=20) with their
        similarity scores. Metadata filters (tenantId, document category, date range)
        are applied during the ANN traversal, not after, to ensure exact filtering
        without affecting K.
      </p>
      <HighlightBlock as="p" tier="important">
        HyDE (Hypothetical Document Embeddings) improves recall for queries where the
        question embedding is semantically distant from the answer embedding. For example,
        "what causes X?" embeds differently from "X is caused by Y" even though they
        describe the same relationship. HyDE generates a hypothetical answer to the
        question (without retrieval context), embeds that hypothetical answer, and uses
        its embedding for retrieval. The hypothetical answer's embedding is closer to
        real answer documents than the raw question embedding. HyDE adds 200–500ms for
        the hypothetical generation step and is appropriate for high-recall scenarios,
        not latency-critical ones.
      </HighlightBlock>
      <p>
        <strong>Cross-encoder re-ranking.</strong> Bi-encoder retrieval (embedding query
        and document independently) cannot model the interaction between a specific query
        and a specific document. A cross-encoder model takes the concatenated (query, chunk)
        pair and scores their joint relevance — it can see that "timeout" in the query
        refers to network timeout not session timeout given the context around it in both
        the query and the chunk. Re-ranking the top-20 ANN candidates with a cross-encoder
        adds 100–150ms but significantly improves precision. The top-5 re-ranked chunks
        are passed to the LLM as context.
      </p>
      <p>
        <strong>Hybrid search.</strong> For queries that depend on exact term matching
        (version numbers, error codes, product names), semantic search can underperform
        keyword search. Hybrid retrieval combines ANN semantic search with BM25 keyword
        search (running in parallel), fusing results using Reciprocal Rank Fusion (RRF):
        each document's final score is the sum of 1/(rank + 60) across both retrieval
        systems. RRF is parameter-free and robust — it doesn't require tuning weights
        between semantic and keyword scores.
      </p>

      <h2>Context Assembly and the Grounding Instruction</h2>
      <p>
        The LLM prompt is assembled from three parts: a system instruction defining the
        grounding policy, the retrieved chunks as numbered context sections, and the user's
        question. The numbering scheme is critical for structured citation output —
        "Source [1]: [title] — [content]" allows the LLM to reference [1], [2] in its
        answer with unambiguous mapping to specific chunks.
      </p>
      <p>
        The grounding instruction defines whether the LLM can supplement retrieved context
        with parametric knowledge (what it learned during pretraining). Strict grounding
        ("answer only from the provided context; if the answer isn't there, say so")
        prevents hallucination but produces mechanical answers that may omit useful
        explanatory context. Lenient grounding ("use the provided context as your primary
        source but you may add relevant background knowledge") produces more helpful
        answers with some hallucination risk. Match the policy to domain sensitivity:
        strict for legal and compliance, lenient for general documentation.
      </p>

      <h2>Citation Rendering</h2>
      <p>
        Citations are the primary mechanism by which users can verify an AI answer. The
        citation UI must make verification frictionless — a user should be able to check
        any claim in under 5 seconds.
      </p>
      <p>
        The LLM is instructed to include inline citation markers ([1], [2]) in the answer
        text, using JSON mode to return a structured payload: an answer text field with
        inline markers, and a citations array mapping each marker to a source chunk ID,
        document title, quoted excerpt, and source URL. The frontend renders the answer
        text with superscript citation badges at each marker location.
      </p>
      <HighlightBlock as="p" tier="important">
        Hover preview: hovering a citation badge shows a popover containing the quoted
        chunk excerpt and a link to the source document at the relevant passage. This
        allows quick verification without leaving the answer view. Click navigates to
        the source document viewer (PDF.js-based viewer for PDFs, rendered Markdown for
        Markdown docs) scrolled to and visually highlighting the cited passage. The passage
        is located by full-text search for the chunk's exact text within the source document.
        If the document was modified after indexing (chunk text no longer matches), show
        a staleness warning: "This source may have been updated since this answer was generated."
      </HighlightBlock>
      <p>
        Chunk highlight: within the source panel (sidebar showing all retrieved chunks),
        the specific sentences within each chunk that most closely match the query are
        highlighted in yellow, helping users quickly locate the relevant evidence within
        a longer passage. Sentence-level highlighting is computed by comparing each
        sentence's embedding to the query embedding.
      </p>

      <h2>Hallucination Detection and Confidence Levels</h2>
      <p>
        Confidence is derived from the retrieval similarity scores of the chunks used
        in the answer. High confidence: top chunk cosine similarity above 0.85, multiple
        chunks supporting the answer — the answer is likely grounded. Medium confidence:
        top score 0.65–0.85 — partial support, possible extrapolation. Low confidence:
        top score below 0.65 — few relevant chunks found. No data: no chunks above a
        minimum threshold — the system declines to answer.
      </p>
      <p>
        The "No data" response is the most important confidence level. When no relevant
        chunks are found, the LLM must be instructed to respond with a predefined phrase
        ("I don't have information about that in the knowledge base") rather than generating
        from parametric knowledge. This requires explicit system prompt instruction and
        a retrieval pre-check: if the top similarity score is below the minimum threshold
        (typically 0.5), short-circuit the LLM call entirely and return the "no data"
        response directly — saving the LLM API call cost and ensuring the response
        is deterministic, not model-dependent.
      </p>
      <p>
        Sentence-level hallucination detection: after generation, each sentence in the
        answer is embedded and compared against the top-5 chunk embeddings. Sentences
        with no supporting chunk above a similarity threshold (0.6) are flagged with
        a warning indicator ("This claim was not found in the retrieved sources").
        This post-processing runs in under 200ms for a typical 300-word answer with
        5 retrieved chunks.
      </p>

      <h2>Tenant Isolation</h2>
      <p>
        Multi-tenant RAG systems must ensure that retrieval never crosses tenant
        boundaries. A user in tenant A must never receive an answer grounded in tenant B's
        documents, even if those documents are highly relevant to the query.
      </p>
      <p>
        Vector database namespacing (Pinecone namespaces, Qdrant collections, pgvector
        schemas) provides hard isolation: vectors in different namespaces are never
        compared against each other. Retrieval within a tenant's namespace cannot surface
        documents from another namespace by design. This is the correct isolation mechanism
        for high-security deployments.
      </p>
      <p>
        Application-level filtering (adding tenantId = X to the metadata filter) is
        insufficient for compliance-sensitive systems. A bug in the filter logic — a
        missing where clause, a null handling error, a caching issue — can leak cross-tenant
        data. Namespace isolation fails closed: a namespace configuration error causes
        queries to return no results (detectable, not a data leak). Filter logic errors
        can fail open (returning data they shouldn't). Prefer namespace isolation for
        any system where data leakage is a compliance violation.
      </p>

      <h2>Offline Evaluation and Quality Monitoring</h2>
      <p>
        Retrieval quality degrades silently as the document corpus changes. Without
        systematic evaluation, a new document added with poor formatting can degrade
        retrieval for an entire topic area without any visible signal.
      </p>
      <p>
        Build a golden evaluation set: curated (question, expected answer, relevant chunk IDs)
        triples maintained by domain experts. Run automated evaluation on every ingestion
        change (new documents, re-chunking, embedding model update): Recall@K (are the
        relevant chunks in the top K?), NDCG@K (are the most relevant chunks ranked
        highest?), and end-to-end answer quality scored by an LLM judge. Regressions
        on any metric by more than 5 percentage points should block the deployment.
      </p>
      <HighlightBlock as="p" tier="crucial">
        User feedback drives quality improvement. Each answer has thumbs-up/thumbs-down
        feedback and an optional "what was wrong" correction. Negative feedback records
        are reviewed weekly — patterns in failed queries guide decisions: add missing
        documentation for frequently-asked topics, re-chunk documents where retrieval
        is consistently poor, tune the minimum similarity threshold to reduce low-confidence
        answers. Treating the feedback queue as a regular operational task (not an occasional
        improvement project) is what separates production RAG systems from prototypes.
      </HighlightBlock>

      <h2>Interview Q&A</h2>

      <h3>Q: How do you handle queries that require synthesizing information from multiple documents?</h3>
      <p>
        Multi-document synthesis is handled by two mechanisms. First, the top-K retrieval
        (K=20 before re-ranking to K=5) naturally collects chunks from different documents
        if multiple documents are relevant. The LLM synthesizes across them in the context
        window. Second, for queries that explicitly span multiple topics ("compare our
        service A and service B timeout configurations"), sub-query decomposition splits
        the query into sub-questions, retrieves independently for each, merges the results
        before re-ranking, and constructs a context that covers all sub-topics. The merged
        context may be larger — requiring a higher-context model or more aggressive
        chunk truncation.
      </p>

      <h3>Q: How do you keep the vector index fresh as documents are updated?</h3>
      <p>
        Document updates trigger a re-ingestion of the updated document. Maintain a
        documentId-to-chunkIds mapping in the metadata store. On document update: (1)
        delete all chunks for the old version (by chunkId) from the vector store,
        (2) re-parse and re-chunk the updated document, (3) embed and insert the new
        chunks with updated metadata. Deletions in vector databases (HNSW particularly)
        are soft-deletes followed by periodic compaction — deleted vectors are marked
        as deleted but continue to consume memory until compaction. For high-update corpora,
        monitor the vector store's deleted-vector ratio and trigger compaction when it
        exceeds 20%.
      </p>

      <h3>Q: How would you implement a "chat with your document" feature for a specific uploaded file?</h3>
      <p>
        Single-document Q&A is a special case of RAG where the retrieval is scoped to
        chunks from one documentId. The metadata filter during ANN retrieval includes
        documentId = [uploaded file's ID], limiting retrieval to chunks from that document.
        For small documents (under 50 pages), a simpler approach is full-document context:
        extract the entire document text and include it directly in the LLM context without
        chunking or retrieval. Modern large-context models (128K–200K tokens) can handle
        a full book in context. The advantage: no retrieval precision problems (the
        full document is always in context). The trade-off: significantly higher API cost
        per query (billing based on context tokens). For casual document Q&A, retrieval
        is cost-justified; for high-volume or time-sensitive analysis, full-document context
        may be preferable.
      </p>

      <h2>Parent Document Retrieval vs Chunk Retrieval</h2>
      <p>
        Standard RAG retrieves chunks — short passages of 200–500 tokens — and passes
        them directly to the LLM as context. This works well when the answer is contained
        within a single chunk. It fails when the answer requires understanding a broader
        section of the document that a single chunk cannot represent — for example, a
        question about the overall argument of a legal section that spans three pages.
        Parent document retrieval addresses this by using chunks for retrieval precision
        but passing the parent section (the full document section the chunk belongs to)
        to the LLM for generation.
      </p>
      <p>
        Implementation: at ingestion time, maintain two granularities. Child chunks
        (200–500 tokens, used for embedding and ANN retrieval) and parent sections (the
        full document section containing each child chunk — typically 1,500–3,000 tokens).
        The vector index stores child chunk embeddings. The document store stores both
        child chunks and their parent sections, linked by a parentSectionId field. At
        retrieval time: run ANN against child chunks, get the top-K child chunks, fetch
        their parent sections from the document store, deduplicate (multiple child chunks
        from the same parent section return only one copy of that section), and pass
        the parent sections as context to the LLM. The child chunk precision tells you
        which sections are relevant; the parent section gives the LLM enough surrounding
        context to answer accurately.
      </p>
      <HighlightBlock as="p" tier="important">
        Parent document retrieval increases context window consumption significantly.
        Five child chunks might correspond to three parent sections totaling 6,000 tokens,
        versus 1,500 tokens for the five child chunks directly. At higher K values (K=10),
        the parent sections may exhaust the context window for shorter-context models.
        Make parent retrieval configurable: enable it for document types where full-section
        context is important (legal contracts, academic papers with complex arguments),
        disable it for corpora where chunk-level context is sufficient (FAQ documents,
        API reference docs where each function's documentation is self-contained).
      </HighlightBlock>

      <h2>Evaluation with the RAGAS Framework</h2>
      <p>
        RAGAS (Retrieval-Augmented Generation Assessment) is an evaluation framework
        specifically designed for RAG systems, measuring four dimensions that capture
        both retrieval quality and generation quality independently. Using RAGAS provides
        a structured way to isolate whether a quality problem originates in the retrieval
        pipeline (wrong chunks are being retrieved) or the generation pipeline (correct
        chunks are retrieved but the LLM is not using them effectively).
      </p>
      <p>
        RAGAS metrics: Faithfulness measures whether each claim in the generated answer
        is supported by the retrieved context (preventing hallucination). Answer Relevancy
        measures whether the generated answer addresses the question (preventing off-topic
        responses). Context Precision measures whether the retrieved chunks are relevant
        to the question (retrieval quality — are we retrieving noise?). Context Recall
        measures whether the retrieved chunks contain the information needed to answer
        the question (retrieval completeness — are we missing relevant chunks?). Each
        metric is computed by an LLM judge, producing a score between 0 and 1.
      </p>
      <p>
        Diagnostic use: RAGAS metrics isolate failure modes with surgical precision.
        Low Faithfulness with high Context Precision means the retrieval is finding good
        chunks but the LLM is ignoring them and hallucinating — the grounding instruction
        in the prompt needs strengthening. Low Context Recall with high Context Precision
        means retrieval is precise but incomplete — increase K or improve the chunking
        strategy to capture more relevant material. High Context Precision with low
        Answer Relevancy means relevant chunks are retrieved but the LLM is generating
        an answer to a subtly different question than was asked — improve query rewriting
        or the grounding instruction to keep the answer focused.
      </p>

      <h3>Q: How do you handle retrieval for time-sensitive queries where the answer depends on the current date?</h3>
      <p>
        Time-sensitive queries ("what is the current API rate limit?") require that the
        retrieved chunks are the most recent version of the relevant documentation. Three
        approaches: (1) Metadata filtering — add a lastUpdated timestamp to each chunk
        and apply a recency filter during retrieval (prefer chunks updated within the
        last 30 days for queries with temporal keywords). (2) Document versioning — when
        a document is updated, re-ingest it and mark the old chunks as deprecated (exclude
        deprecated chunks from retrieval). (3) Explicit date context injection — inject
        the current date into the LLM prompt and instruct it to reason about document
        freshness explicitly ("The following context was last updated on [date]. Consider
        whether this information may be outdated for your answer"). Approach 2 is the
        most reliable but requires robust document lifecycle tracking in the ingestion
        pipeline.
      </p>

      <h3>Q: How do you handle queries that the user asks repeatedly across sessions — can RAG learn from interaction history?</h3>
      <p>
        A user who asks the same or similar questions across multiple sessions provides
        a signal that the existing corpus either doesn't address their need well or that
        the retrieval pipeline fails to surface the right documents for their query pattern.
        Track recurring query patterns (queries that recur more than 3 times across sessions
        from the same user or across users with similar roles) and route them to a corpus
        quality review: does the relevant document exist? Is it indexed? Is it chunked
        correctly? Recurring low-satisfaction queries (negative feedback or low engagement)
        are the highest-priority signal for corpus improvement. Beyond corpus improvement,
        RAG systems can cache answers for high-frequency stable queries (queries where
        the answer doesn't change between sessions) — with explicit staleness tracking
        so cached answers are invalidated when the underlying documents are updated.
      </p>
    </ArticleLayout>
  );
}
