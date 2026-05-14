"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-rag-based-ui-system",
  title: "Design a RAG-Based UI System",
  description:
    "Architecture for a retrieval-augmented generation UI: ingestion pipeline, vector retrieval strategies, re-ranking, citation rendering, confidence indicators, and hallucination guards.",
  category: "high-level-design",
  subcategory: "ai-modern-systems",
  slug: "rag-based-ui-system",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-11",
  tags: ["hld", "rag", "vector-db", "embeddings", "citations", "retrieval", "llm"],
  relatedTopics: ["ai-chatbot-frontend", "ai-powered-search-interface"],
};

export default function RagBasedUiSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">A Retrieval-Augmented Generation (RAG) UI system allows users to ask questions against a private knowledge base—internal documentation, product manuals, legal contracts, research papers—and receive answers that are grounded in those documents, with citations linking each claim to its source. The two distinct engineering problems are the retrieval pipeline (finding the relevant document chunks for a given query) and the UI design (presenting the answer alongside its citations in a way that lets users verify claims and trust the system's output). A RAG system that produces correct answers with poor citation UI is barely better than a plain LLM—users cannot verify the answer and must trust it blindly. A RAG system with excellent citation UI but poor retrieval produces hallucinated or irrelevant answers pointed at misleading sources. Both components must excel.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">The hallucination problem is the defining challenge: LLMs can generate fluent text that sounds authoritative but is not grounded in the retrieved documents. The RAG UI must make this visible—flagging when a sentence in the answer is not supported by any retrieved chunk, showing confidence levels based on retrieval scores, and giving users an easy path to verify each claim by opening the source passage.</HighlightBlock>
        <p><strong>Explicit assumptions:</strong> The knowledge base contains structured documents (PDFs, Markdown, HTML). Documents are owned by tenants (organizations) and must not be retrievable across tenant boundaries. The embedding model is text-embedding-3-large (1536 dimensions). The vector store is Pinecone or pgvector. Retrieval uses approximate nearest neighbor (ANN) search. Re-ranking uses a cross-encoder model. The LLM generates answers in streaming mode with inline citation markers ([1], [2]).</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Document ingestion:</strong> Users can upload documents (PDF, Markdown, HTML, DOCX). Documents are chunked, embedded, and stored in the vector database. Ingestion status is tracked per document.</li>
          <li><strong>Semantic search:</strong> Users submit natural-language questions. The system retrieves the most relevant chunks from the knowledge base using semantic similarity.</li>
          <li><strong>Grounded answers:</strong> The LLM generates answers using only the retrieved chunks as context. Each sentence in the answer includes inline citation markers ([1], [2]) linking to the source chunk.</li>
          <li><strong>Citation UI:</strong> Citations are rendered as numbered superscripts. Hovering a citation shows a preview of the source chunk (excerpt, document title, section). Clicking opens the source document at the relevant passage.</li>
          <li><strong>Confidence indicators:</strong> Each answer shows a confidence level (High/Medium/Low/No Data) based on the retrieval scores of the supporting chunks.</li>
          <li><strong>Hallucination warnings:</strong> Sentences in the answer that are not supported by any retrieved chunk are flagged with a warning indicator.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Retrieval latency:</strong> ANN search completes in under 80ms. Cross-encoder re-ranking completes in under 150ms. Total time to first token under 1200ms.</li>
          <li><strong>Tenant isolation:</strong> No retrieval can cross tenant boundaries. Each tenant's documents are stored in an isolated namespace in the vector store.</li>
          <li><strong>Retrieval quality:</strong> Recall@5 above 0.85 on a golden evaluation set (ensuring relevant chunks are in the top 5 for 85%+ of queries).</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="important">The RAG system has two pipelines: the ingestion pipeline (offline, processes uploaded documents into vector embeddings stored in the vector database) and the query pipeline (real-time, retrieves relevant chunks for a user query, re-ranks them, and feeds them to the LLM). The UI interacts only with the query pipeline in real-time; the ingestion pipeline runs asynchronously in the background after document upload. The UI shows ingestion status (queued, embedding, ready) so users know when a newly uploaded document is searchable.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/ai-modern-systems/rag-based-ui-system-architecture.svg"
          alt="RAG UI system architecture showing ingestion pipeline (documents → chunker 512 tok/20% overlap → embedder text-embedding-3-large → vector DB Pinecone/pgvector → metadata index), query pipeline (user query → query rewriter HyDE/sub-query → embed query → ANN search top-k=20 → re-ranker cross-encoder top-5 → LLM + context grounded answer), and UI components (query composer with filters, source citations panel, streaming answer with inline markers, confidence indicator, hallucination guard, feedback buttons, chunk preview on hover)."
          caption="RAG architecture: offline ingestion pipeline (chunk → embed → store) + real-time query pipeline (rewrite → ANN → re-rank → LLM stream) + citation-rich UI"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Ingestion Pipeline</h3>
        <HighlightBlock as="p" tier="important">When a user uploads a document, the ingestion pipeline processes it in four stages. Parsing: the document is converted to plain text using format-specific parsers (pdfminer for PDFs, markdown-it for Markdown, html-to-text for HTML). Tables are extracted as structured text with column labels. Images are handled by an optional vision model (extracting text descriptions from embedded images). Chunking: the text is split into overlapping chunks using a recursive sentence splitter. Chunk size is 512 tokens with 20% overlap (approximately 102 tokens of overlap between adjacent chunks). The overlap ensures that queries about content spanning a chunk boundary can retrieve context from both sides.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Embedding: each chunk is embedded using the same model that will embed queries at retrieval time (consistency between ingestion and query embedding models is critical—embedding with different models produces incomparable vectors). The embedding model is called in batches (typically 100 chunks per batch) to maximize throughput. Storage: the embedding vectors are stored in the vector database alongside the chunk text and metadata (documentId, chunkIndex, pageNumber, sectionTitle, tenantId). The tenantId is stored as a filter field (not just metadata) to support efficient pre-filtering during retrieval.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Ingestion status tracking: the UI polls a /documents/&#123;id&#125;/status endpoint (or subscribes via SSE) for each uploaded document. The status transitions through: uploaded → parsing → chunking → embedding (with progress: "43/120 chunks embedded") → ready. The UI shows a progress bar per document and a "searchable" badge when the document reaches the ready state. Failed ingestion (parsing error, embedding API rate limit) shows an error card with a retry button.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Retrieval Strategies</h3>
        <HighlightBlock as="p" tier="important">Naive RAG (embed query → ANN → top-k) is the starting point but underperforms for complex or ambiguous queries. The system uses a progressive retrieval strategy selected based on query complexity. For simple factual queries, naive retrieval suffices. For complex queries with multiple sub-topics, sub-query decomposition splits the query into 3–5 sub-questions (using a fast LLM call), retrieves chunks for each sub-question independently, and merges the results before re-ranking. For queries where keyword matching is important (exact product names, version numbers, error codes), hybrid search combines ANN semantic search with BM25 keyword search, fusing the results using Reciprocal Rank Fusion (RRF).</HighlightBlock>
        <HighlightBlock as="p" tier="important">HyDE (Hypothetical Document Embeddings): for queries where the embedding of the question is semantically distant from the embedding of the answer (a common mismatch—"what causes X?" embeds differently from "X is caused by Y"), HyDE generates a hypothetical answer using the LLM (without RAG context), embeds the hypothetical answer, and uses that embedding for retrieval. The hypothetical answer's embedding is closer to the embedding of real answer documents, improving retrieval recall. HyDE adds a 200–500ms latency for the hypothetical generation step, making it appropriate for high-quality recall requirements rather than low-latency applications.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Cross-encoder re-ranking: the ANN search retrieves top-20 candidates efficiently. A cross-encoder model (a BERT-based model that jointly encodes the query and each candidate chunk as a pair) re-scores all 20 candidates with much higher accuracy than the ANN retrieval (which uses approximate similarity of independently embedded vectors). The re-ranker selects the top-5 chunks, which are passed to the LLM as context. The re-ranking step adds 100–150ms but significantly improves answer quality by filtering out false-positive retrievals that scored high in ANN but are not actually relevant to the query.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Citation Rendering and Verification</h3>
        <p>The LLM is instructed (via the system prompt) to include inline citation markers ([1], [2], etc.) corresponding to the retrieved chunks, numbered in the order they appear in the context. Each marker in the answer text is rendered as a superscript badge. The citation list is rendered in a sidebar panel, showing each chunk's source document title, page number, section, relevance score, and a short excerpt. Chunk excerpts are highlighted: the specific sentences within the chunk that are most relevant to the query are highlighted in yellow, helping users quickly locate the supporting evidence within a longer passage.</p>
        <p>Hover preview: when the user hovers over a citation marker in the answer, a popup appears showing the source chunk excerpt and a link to the source document at the relevant passage. This allows quick verification without leaving the answer view. Click navigates to the source document viewer (a PDF.js-based viewer for PDFs, or a rendered Markdown view) scrolled to and highlighting the cited passage. The passage is located by searching for the chunk's exact text within the document; if the document has been modified since ingestion (outdated chunk), a staleness warning is shown.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Confidence Levels and Hallucination Detection</h3>
        <p>Confidence is computed from the retrieval scores of the top-5 chunks used in the answer. High confidence (top chunk cosine similarity above 0.85, multiple supporting chunks): the answer is likely well-grounded. Medium confidence (top score 0.65–0.85): partial support; the answer may extrapolate beyond the retrieved chunks. Low confidence (top score below 0.65): the retrieval found few relevant chunks; the answer should be treated with skepticism. No data (no chunks above a minimum threshold): the system declines to answer and tells the user the knowledge base does not contain relevant information. The "No data" response is critical for preventing the LLM from hallucinating an answer when no supporting evidence exists.</p>
        <p>Sentence-level hallucination detection: after the LLM completes generating the answer, a lightweight post-processing step checks each sentence against the retrieved chunks. For each sentence, it computes the cosine similarity between the sentence's embedding and the top-5 chunk embeddings. If no chunk achieves a similarity above 0.6 for a given sentence, that sentence is flagged as potentially unsupported—rendered with a subtle warning underline and a tooltip: "This claim was not found in the retrieved sources." This post-processing runs in parallel with streaming delivery (the last-pass check is applied to completed sentences as they arrive, not the entire answer at the end).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Feedback Loop and Quality Monitoring</h3>
        <HighlightBlock as="p" tier="important">Each answer includes thumbs-up/thumbs-down feedback buttons and an optional "improve this answer" freetext field. Negative feedback (thumbs-down) is recorded with the query, the retrieved chunks, the generated answer, and the user's freetext explanation. These records form a golden evaluation set: queries with known correct or incorrect answers that can be used to measure and improve retrieval quality over time. The feedback data is reviewed weekly; patterns in failed queries (e.g., "all questions about pricing return low-confidence answers") guide decisions to add more pricing documentation, re-chunk those documents differently, or fine-tune the embedding model on domain-specific data.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/ai-modern-systems/rag-based-ui-system-retrieval.svg"
          alt="RAG retrieval strategies and citation UI showing five retrieval approaches (naive RAG, HyDE, sub-query decomposition, hybrid search ANN+BM25, cross-encoder re-ranking), citation UI mockup with inline numbered markers, source list with scores and excerpts, hover popup showing chunk preview with document link, and confidence color coding (green high, orange medium, dark low, no-data response withheld). Config panel: chunk size 512 tok, 20% overlap, Recall@5 target 0.85. Feedback buttons feed RLHF training signal."
          caption="Retrieval strategies (naive/HyDE/sub-query/hybrid/re-rank) and citation UI with hover previews, confidence levels, hallucination sentence flagging, and feedback-to-training loop"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">Chunk size trade-off: larger chunks (1024 tokens) capture more context per chunk, which helps the LLM generate coherent answers, but reduces retrieval precision (the query matches a broad passage rather than a specific sentence). Smaller chunks (256 tokens) improve retrieval precision but may lack the surrounding context needed for the LLM to write a coherent sentence. The 512-token chunk with 20% overlap is the empirically validated sweet spot for most document types. For highly structured documents (legal contracts with numbered clauses), section-based chunking (each numbered clause as one chunk) often outperforms fixed-size chunking.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Tenant isolation implementation: Pinecone provides native namespace isolation (vectors in different namespaces never mix in retrieval). pgvector provides row-level security (RLS) policies enforced at the PostgreSQL level. The namespace approach (Pinecone) is simpler but more expensive (separate index infrastructure per tenant). The RLS approach (pgvector) is more cost-efficient but requires careful verification that RLS policies are correctly enforced—a bug in the RLS policy can leak cross-tenant data. For high-security deployments, separate vector indexes per tenant (Pinecone namespace or separate pgvector schema) is safer than shared-index RLS.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Citation faithfulness versus fluency: when instructed to include citation markers, LLMs sometimes "citation-wash"—attributing claims to citations that don't actually support them, to appear grounded. The post-generation sentence-similarity check catches this and flags the unsupported sentences. A stricter approach is to use structured generation (instructing the LLM to produce each sentence paired with the citation numbers that support it), making citation attribution explicit and verifiable, at the cost of some fluency in the answer's prose style.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important">A RAG UI system has two pipelines: offline ingestion (document → chunk 512 tok/20% overlap → embed text-embedding-3-large → store in tenant-isolated vector namespace with metadata) and real-time query (query → optional HyDE/sub-query rewrite → embed → ANN top-20 → cross-encoder re-rank top-5 → LLM stream with inline citation markers). The UI renders citations as superscript badges with hover previews (chunk excerpt, document link) and click-to-navigate to source passages. Confidence levels (High/Medium/Low/No Data) are derived from top retrieval scores; the "No Data" state withholds the answer rather than hallucinating. Sentence-level hallucination detection embeds each sentence and checks cosine similarity against retrieved chunks (flagging unsupported sentences with a warning underline). Thumbs-down feedback with freetext builds a golden evaluation set for weekly retrieval quality review. The defining design constraint is tenant isolation: retrieval must never cross tenant boundaries, enforced at the vector store level (namespace isolation), not just application-level filtering.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
