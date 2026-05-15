"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-ai-rag",
  title: "Retrieval-Augmented Generation (RAG)",
  description:
    "Comprehensive guide to RAG covering document chunking strategies, embedding pipelines, retrieval optimization, hybrid search, reranking, and RAG evaluation frameworks for production systems.",
  category: "other",
  subcategory: "artificial-intelligence",
  slug: "rag",
  wordCount: 5600,
  readingTime: 22,
  lastUpdated: "2026-04-11",
  tags: ["ai", "rag", "retrieval", "embeddings", "vector-search"],
  relatedTopics: ["vector-db", "embeddings", "context-window", "agents"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: define the constraint/goal and name the 2–3 variables that actually drive design decisions in production.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Retrieval-Augmented Generation (RAG)</strong> is an
          architecture that grounds an LLM&apos;s responses in external knowledge
          by retrieving relevant documents from a knowledge base and including
          them in the prompt alongside the user&apos;s query. Rather than
          relying solely on the model&apos;s internal (and potentially outdated
          or hallucinated) knowledge, RAG ensures the model&apos;s output is
          informed by specific, current, domain-relevant information that the
          system controls.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The RAG architecture follows a three-phase pipeline. In the{" "}
          <strong>indexing phase</strong>, source documents are split into
          chunks, each chunk is converted to an embedding (a dense vector
          representation), and the embeddings are stored in a vector database
          with the original text as metadata. In the{" "}
          <strong>retrieval phase</strong>, a user query is embedded using the
          same embedding model, and the most similar document chunks are
          retrieved from the vector database based on vector similarity. In the{" "}
          <strong>generation phase</strong>, the retrieved chunks are included
          in the prompt as context, and the LLM generates a response grounded
          in that context.
        </HighlightBlock>
        <p>
          RAG addresses the fundamental limitations of LLMs: knowledge cutoff
          (the model can&apos;t know about events after its training date),
          domain-specific knowledge (the model wasn&apos;t trained on your
          company&apos;s internal documents), hallucination (the model
          invents plausible but incorrect information), and source attribution
          (the model can&apos;t cite where its information came from). By
          grounding the model in retrieved documents, RAG ensures the
          model&apos;s output is based on actual, citable, current information
          rather than its training data.
        </p>
        <p>
          For production systems, RAG is the dominant pattern for building
          knowledge-grounded AI applications. It is used in enterprise search,
          customer support bots, research assistants, code documentation
          systems, and any application where the model needs access to
          information that is too large, too current, or too domain-specific
          to fit in its training data or context window.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: show you understand the primitives and which ones matter at scale (latency, correctness, UX, cost).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The quality of a RAG system is determined primarily by the quality
          of its retrieval — if the right documents aren&apos;t retrieved, the
          LLM cannot produce accurate answers, regardless of its capability.
          The retrieval quality depends on three factors:{" "}
          <strong>chunking strategy</strong> (how documents are split into
          retrievable units), <strong>embedding quality</strong> (how well the
          embedding model captures semantic similarity), and{" "}
          <strong>retrieval parameters</strong> (how many chunks to retrieve
          and how to rank them).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Chunking strategy</strong> is the most impactful design
          decision in RAG. Documents must be split into chunks small enough to
          fit within the context window budget and focused enough to provide
          relevant information without noise, but large enough to contain
          sufficient context for the LLM to understand. The most common
          strategies are: <strong>fixed-size chunking</strong> (split by token
          count, e.g., 500 tokens with 50-token overlap — simple but ignores
          document structure), <strong>semantic chunking</strong> (split at
          topic boundaries detected by the embedding model — produces
          coherent chunks but is computationally expensive),{" "}
          <strong>structural chunking</strong> (split at natural boundaries
          like paragraphs, sections, or headings — preserves document
          structure but produces variable-sized chunks), and{" "}
          <strong>agentic chunking</strong> (use an LLM to summarize and split
          documents intelligently — highest quality but most expensive).
        </HighlightBlock>
        <p>
          <strong>Chunk overlap</strong> is critical for maintaining context
          across chunk boundaries. When a document is split into chunks,
          information relevant to a query may span the boundary between two
          chunks. Overlap (typically 10-20% of chunk size) ensures that
          information at the end of one chunk also appears at the beginning of
          the next, reducing the chance that a relevant fact is split between
          chunks and lost. Without overlap, a query about a topic discussed
          across a chunk boundary may retrieve neither chunk with high enough
          similarity to be included.
        </p>

        <ArticleImage
          src="/diagrams/other/artificial-intelligence/rag-pipeline-architecture.svg"
          alt="RAG Pipeline Architecture"
          caption="RAG pipeline — document ingestion → chunking → embedding → vector store → retrieval → prompt augmentation → generation"
        />

        <p>
          <strong>Hybrid search</strong> combines vector similarity (semantic
          search) with keyword matching (BM25, full-text search) to improve
          retrieval recall. Vector search excels at finding semantically
          similar content even when the query uses different words than the
          document, but can miss exact matches for specific terms (product
          names, error codes, IDs). Keyword search excels at exact term
          matching but misses semantic similarity. Hybrid search runs both and
          combines the results using reciprocal rank fusion or learned ranking,
          achieving higher recall than either approach alone.
        </p>

        <ArticleImage
          src="/diagrams/other/artificial-intelligence/hybrid-search-fusion.svg"
          alt="Hybrid Search Fusion Flow"
          caption="Hybrid search — query runs through both vector search (semantic match) and BM25 keyword search, then Reciprocal Rank Fusion combines results for higher recall than either alone"
        />

        <p>
          <strong>Reranking</strong> is a second-stage retrieval optimization
          where the top-k results from the initial retrieval are re-scored
          using a more accurate (but slower and more expensive) cross-encoder
          model. The initial retrieval uses a bi-encoder embedding model that
          can compare the query to millions of documents efficiently. The
          reranker then performs pairwise comparison of the query against each
          of the top-k candidates, producing more accurate relevance scores.
          Reranking typically improves retrieval precision by 10-30% over
          embedding-only retrieval, at the cost of additional latency for the
          reranking step.
        </p>
        <p>
          <strong>Context compression</strong> addresses the problem of
          retrieved chunks being too large to fit in the prompt or containing
          too much irrelevant information. Instead of including full chunks in
          the prompt, compression techniques extract only the relevant
          sentences or passages from each chunk. This can be done through
          sentence-level retrieval (retrieve individual sentences rather than
          chunks), LLM-based compression (ask a small model to summarize each
          chunk&apos;s relevance to the query), or extractive compression
          (select the most relevant sentences based on embedding similarity to
          the query). Compression reduces prompt token count by 40-70% while
          preserving answer quality.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: describe the end-to-end flow, where state lives, and where you add backpressure, caching, and observability.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          A production RAG pipeline consists of several components. The{" "}
          <strong>document ingestion pipeline</strong> fetches documents from
          source systems (databases, file systems, APIs, web crawlers),
          cleans them (removes formatting, extracts text from PDFs/HTML),
          chunks them according to the chunking strategy, embeds each chunk,
          and stores the embeddings in the vector database with metadata
          (document source, last updated, document type, access permissions).
          This pipeline runs periodically to keep the index current.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The <strong>query processing pipeline</strong> takes the user&apos;s
          query, optionally rewrites it for better retrieval (query expansion,
          hypothetical document embeddings, sub-query decomposition), embeds
          the query, performs vector search against the index, applies hybrid
          search combining keyword and semantic results, reranks the top
          candidates, selects the top-n chunks for inclusion in the prompt,
          and constructs the augmented prompt with the retrieved context and
          the original query.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/other/artificial-intelligence/rag-chunking-strategies.svg"
          alt="Document Chunking Strategies"
          caption="Chunking strategies — fixed-size with overlap, semantic boundaries, structural (headings/paragraphs), and agentic splitting"
        />

        <p>
          The <strong>prompt construction</strong> assembles the retrieved
          chunks into the prompt with clear formatting that helps the LLM
          distinguish between the retrieved context and the user&apos;s query.
          Each chunk is typically formatted with a source identifier, the
          chunk content, and optionally a relevance score. The prompt includes
          explicit instructions for the LLM to base its answer on the provided
          context, cite sources, and acknowledge when the context doesn&apos;t
          contain sufficient information to answer the query.
        </p>
        <p>
          <strong>Metadata filtering</strong> is essential for production RAG
          systems that serve multiple users or domains. Retrieved chunks should
          be filtered by access permissions (users should only see documents
          they have access to), document type (prefer official documentation
          over discussion threads), freshness (prefer recent documents over
          outdated ones), and domain relevance (prefer documents from the
          user&apos;s department or project). Metadata filtering is applied
          before or during the vector search, not after, to ensure the
          retrieved results are both relevant and accessible.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <HighlightBlock as="p" tier="crucial">
          Decision rule: choose the approach that makes failure modes explicit and keeps the common path fast, while keeping correctness boundaries clear.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Chunk size</strong> presents a fundamental trade-off. Small
          chunks (100-200 tokens) are precise — when retrieved, they provide
          focused, relevant information without noise — but may lack the
          surrounding context needed for the LLM to understand them. Large
          chunks (1000-2000 tokens) provide rich context but include more
          irrelevant information, consuming context window budget and
          potentially distracting the LLM from the key information. The
          optimal chunk size depends on the document type and query patterns —
          technical documentation benefits from smaller chunks (specific API
          references), while analytical reports benefit from larger chunks
          (broader context).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Number of retrieved chunks</strong> involves a trade-off
          between information completeness and context window efficiency.
          Retrieving more chunks increases the chance of including the right
          information, but also increases the chance of including irrelevant
          information (which can confuse the LLM due to the &quot;lost in the
          middle&quot; phenomenon) and consumes more context window budget
          (increasing cost). The typical range is 3-10 chunks, with the
          optimal number determined empirically by measuring answer quality
          against the number of retrieved chunks.
        </HighlightBlock>
        <p>
          <strong>RAG vs. fine-tuning</strong> is the fundamental architectural
          decision for domain-specific AI. RAG provides access to current,
          specific information without modifying the model, making it ideal
          for knowledge that changes frequently or is too large to fit in model
          weights. Fine-tuning teaches the model domain-specific patterns and
          knowledge, making it faster (no retrieval overhead) and more
          consistent, but requires retraining when knowledge changes and cannot
          access information not in the training data. The pragmatic approach
          is RAG for factual knowledge (what the model should know) and
          fine-tuning for behavioral patterns (how the model should respond).
        </p>

        <ArticleImage
          src="/diagrams/other/artificial-intelligence/rag-retrieval-optimization.svg"
          alt="RAG Retrieval Optimization"
          caption="Retreval optimization — vector search, hybrid search, reranking, and context compression for optimal retrieval quality"
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: list the 3–5 non-negotiables you would enforce with tests, budgets, and monitoring.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Invest in document preprocessing</strong> — the quality of
          RAG output is bounded by the quality of the indexed documents.
          Remove boilerplate (headers, footers, navigation), extract
          structured data (tables, code blocks, diagrams) into machine-readable
          format, preserve document structure (headings, sections, lists) as
          metadata, and normalize formatting (consistent terminology, resolved
          references). Clean, well-structured documents produce significantly
          better retrieval results than raw, unprocessed documents.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Implement retrieval evaluation</strong> — measure retrieval
          quality independently of generation quality. Use a benchmark dataset
          of (query, relevant_documents) pairs and measure recall (did we
          retrieve the right documents?), precision (how many retrieved
          documents are relevant?), and MRR (Mean Reciprocal Rank — how high
          is the first relevant document in the results?). Optimize retrieval
          parameters (chunk size, number of results, hybrid search weights)
          against these metrics before optimizing the generation phase.
        </HighlightBlock>
        <p>
          <strong>Use query rewriting</strong> to improve retrieval. Users
          often phrase queries poorly for retrieval — they use pronouns without
          context (&quot;how do I configure it?&quot;), abbreviations the
          system doesn&apos;t recognize, or ambiguous terms. Query rewriting
          transforms the user&apos;s query into a retrieval-optimized form by
          adding context, expanding abbreviations, and generating sub-queries
          for multi-part questions. This can improve retrieval recall by 15-25%.
        </p>
        <p>
          <strong>Implement answer validation</strong> — after the LLM
          generates its answer, validate that it is actually grounded in the
          retrieved context. Check that factual claims in the answer are
          supported by specific chunks, that the answer doesn&apos;t contradict
          the retrieved information, and that the answer acknowledges
          uncertainty when the context is insufficient. This validation catches
          hallucinations that occur even when the right documents were retrieved.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: call out the top failure modes teams hit in production and how you prevent/mitigate them.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The most common pitfall is <strong>poor chunking</strong> — using
          fixed-size chunking without considering document structure, resulting
          in chunks that cut across topic boundaries, split tables or code
          blocks, or lose heading context. A chunk that contains the middle of
          a table without the table header is useless for retrieval. Always use
          structure-aware chunking that respects document boundaries and
          preserves context (heading ancestry, table headers, code function
          names) as metadata.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Stale index</strong> — the RAG index is only as current as
          the last ingestion run. If documents are updated frequently and the
          ingestion pipeline runs daily, users will receive outdated
          information. Implement change detection (file modification times,
          database timestamps, webhook notifications) to trigger targeted
          re-indexing of changed documents rather than full re-indexing on a
          schedule.
        </HighlightBlock>
        <p>
          <strong>Ignoring access control</strong> — retrieved chunks may
          contain information the user shouldn&apos;t see. If a user queries
          &quot;what is the salary range for senior engineers&quot; and the
          retrieved chunks include confidential compensation data from an
          internal document that the user doesn&apos;t have access to, the LLM
          will include that information in its response. Always filter
          retrieved results by access permissions before including them in the
          prompt.
        </p>
        <p>
          <strong>No retrieval evaluation</strong> — many teams build RAG
          systems and evaluate only the final output quality, making it
          impossible to distinguish retrieval failures (wrong documents
          retrieved) from generation failures (right documents retrieved, but
          LLM produced a bad answer). Evaluate retrieval and generation
          separately: retrieval quality against a (query, relevant_documents)
          benchmark, and generation quality against a (query, context,
          expected_answer) benchmark.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: connect the design to measurable outcomes (CWV, conversion, error rates) and operational practices.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Enterprise knowledge base search</strong> — employees query
          a RAG system backed by company documentation, meeting notes, policy
          documents, and technical specifications. The system retrieves
          relevant documents and generates answers with source citations.
          Access control ensures employees only see documents they have
          permission to access. This pattern is used by companies like Notion,
          Confluence, and Gong for AI-powered knowledge search.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Customer support with product documentation</strong> — a
          support bot uses RAG to ground its responses in the product&apos;s
          documentation, FAQ, release notes, and known issues database.
          Retrieved chunks include version-specific information, ensuring
          answers are accurate for the user&apos;s product version. Source
          citations allow users to verify answers and read the full
          documentation for more detail.
        </HighlightBlock>
        <p>
          <strong>Legal and compliance research</strong> — lawyers and
          compliance officers use RAG to search across contracts, regulations,
          case law, and internal policies. The system retrieves relevant
          clauses and regulations, and the LLM synthesizes them into answers
          with precise citations (document name, section, paragraph number).
          The ability to cite exact sources is critical in legal contexts where
          answers must be verifiable.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: answer with constraints, decisions, trade-offs, and how you’d validate/operate the system.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q1: How do you choose the optimal chunk size for a RAG system?
          </h3>
          <HighlightBlock as="p" tier="important">
            The optimal chunk size depends on document type, query patterns,
            and embedding model characteristics. The approach is empirical:
            start with a range of chunk sizes (100, 200, 500, 1000, 2000
            tokens) with 10-20% overlap, build a test index for each, and
            evaluate retrieval quality against a benchmark of (query,
            relevant_documents) pairs.
          </HighlightBlock>
          <HighlightBlock as="p" tier="important">
            Measure retrieval recall (percentage of relevant documents
            retrieved in the top-k), precision (percentage of retrieved
            documents that are relevant), and answer quality (generated answers
            evaluated for accuracy). The chunk size that maximizes answer
            quality — not just retrieval quality — is the optimal choice.
          </HighlightBlock>
          <p>
            As a starting point: 500-token chunks with 50-token overlap work
            well for most document types. Technical documentation (APIs, code)
            benefits from smaller chunks (200-300 tokens) because queries
            target specific functions or parameters. Analytical documents
            (reports, essays) benefit from larger chunks (800-1000 tokens)
            because queries target broader concepts that need context.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q2: What is hybrid search in RAG and why is it better than vector
            search alone?
          </h3>
          <p>
            Hybrid search combines vector similarity search (semantic matching)
            with keyword search (BM25, full-text matching) and merges the
            results. Vector search finds documents that are semantically similar
            to the query even when they use different words, but can miss exact
            matches for specific terms like product names, error codes, or IDs.
            Keyword search finds documents containing the exact query terms but
            misses semantically similar documents that use different
            terminology.
          </p>
          <p>
            Hybrid search runs both searches in parallel and combines results
            using reciprocal rank fusion: for each document, score = 1/(k +
            rank_vector) + 1/(k + rank_keyword), where k is a constant
            (typically 60). Documents that rank highly in both searches get
            the highest combined scores. This achieves higher recall than
            either approach alone because it captures both semantic similarity
            and exact term matching.
          </p>
          <p>
            In production, hybrid search typically improves retrieval recall
            by 15-30% over vector search alone, particularly for queries
            containing specific identifiers (product names, error codes, ticket
            numbers) that vector search struggles with because these terms may
            not have strong semantic embeddings.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q3: How do you handle RAG when the retrieved context contradicts
            itself?
          </h3>
          <p>
            Contradictory retrieved context is common in real-world knowledge
            bases — different documents may contain outdated vs. current
            information, different perspectives on the same topic, or outright
            factual disagreements. The RAG system must handle this gracefully.
          </p>
          <p>
            The first line of defense is <strong>metadata-based prioritization</strong> —
            prefer fresher documents over older ones, official documentation
            over discussion threads, and higher-authority sources over
            lower-authority ones. If a 2024 document contradicts a 2022
            document, prefer the 2024 document.
          </p>
          <p>
            The second line of defense is <strong>explicit instruction in the
            prompt</strong> — tell the LLM to note contradictions in the
            retrieved context and present both perspectives with their sources.
            For example: &quot;The retrieved context contains conflicting
            information. Source A (2022) states X, while Source B (2024) states
            Y. The more recent source is likely more accurate.&quot;
          </p>
          <p>
            The third line of defense is <strong>answer validation</strong> —
            after the LLM generates its answer, check that it acknowledges
            contradictions rather than presenting one side as definitive truth.
            If the answer presents contradictory information as fact, request
            a revision that acknowledges the uncertainty.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q4: How do you evaluate the quality of a RAG system?
          </h3>
          <p>
            RAG quality must be evaluated at two levels: retrieval quality and
            generation quality. For <strong>retrieval quality</strong>, use a
            benchmark dataset of queries with labeled relevant documents.
            Measure recall@k (what fraction of relevant documents are in the
            top-k retrieved?), precision@k (what fraction of top-k retrieved
            are relevant?), and MRR (Mean Reciprocal Rank — how high is the
            first relevant document?). Optimize retrieval parameters (chunk
            size, embedding model, number of results, hybrid weights) against
            these metrics.
          </p>
          <p>
            For <strong>generation quality</strong>, use a benchmark dataset
            of (query, context, expected_answer) triplets. Generate answers
            using the RAG pipeline and evaluate using: faithfulness (are all
            factual claims in the answer supported by the retrieved context?),
            answer relevance (does the answer address the query?), and
            context precision (is the retrieved context actually useful for
            answering the query?). Frameworks like RAGAS and DeepEval provide
            automated evaluation along these dimensions.
          </p>
          <p>
            Additionally, track <strong>production metrics</strong>: query
            volume, retrieval latency, generation latency, user satisfaction
            (thumbs up/down), re-query rate (users who ask a follow-up
            immediately, indicating the first answer was unsatisfactory), and
            escalation rate (users who request human help after the RAG answer).
            These metrics provide ongoing quality monitoring and early detection
            of quality regressions.
          </p>
        </div>
      </section>

      <section>
        <h2>Advanced RAG Patterns</h2>
        <div className="space-y-4">
          <p>
            Naive RAG — chunk, embed, retrieve, generate — fails at scale for
            complex queries and large corpora. Production systems layer several
            advanced retrieval strategies on top of the baseline.
          </p>

          <h3 className="text-lg font-semibold mt-4">HyDE (Hypothetical Document Embeddings)</h3>
          <p>
            Sparse queries like &quot;what is the refund policy for enterprise
            contracts?&quot; embed poorly because they are short and abstract.
            HyDE inverts the problem: generate a <em>hypothetical answer</em>
            with the LLM (without retrieval), embed that answer, and use it as
            the retrieval query. The hypothetical answer uses domain vocabulary
            and sentence structure similar to real documents, so it lands closer
            to the relevant chunk in embedding space. In practice HyDE improves
            recall by 10-25% on knowledge-base Q&amp;A tasks at the cost of one
            extra LLM call (~100ms). Use it when short queries produce poor
            recall and latency budget permits.
          </p>

          <h3 className="text-lg font-semibold mt-4">Multi-Query Retrieval</h3>
          <p>
            A single query reformulation can miss relevant documents. Multi-query
            retrieval uses the LLM to generate 3-5 alternate phrasings of the
            user query, retrieves candidates for each, and deduplicates using
            reciprocal rank fusion before passing results to the generator.
            This is especially effective for ambiguous queries where the correct
            interpretation is unclear. Parallelise the vector lookups; total
            retrieval latency overhead is typically under 50ms.
          </p>

          <h3 className="text-lg font-semibold mt-4">Parent-Child Chunking</h3>
          <p>
            Context windows need rich surrounding text to answer questions, but
            embedding quality degrades for long chunks. Parent-child chunking
            resolves this tension: index small child chunks (128-256 tokens) for
            precise semantic matching, but return the parent chunk (512-1024
            tokens) to the generator. The child chunk wins the retrieval; the
            parent provides the full context. Implement by storing parent IDs in
            chunk metadata and fetching parents after retrieval. This pattern is
            natively supported in LlamaIndex as &quot;Small-to-Big Retrieval.&quot;
          </p>

          <h3 className="text-lg font-semibold mt-4">Iterative / Multi-Hop Retrieval</h3>
          <p>
            Complex questions require chaining retrievals. A question like
            &quot;What are the tax implications of the acquisition announced in
            the Q3 2024 earnings call?&quot; requires first finding the
            acquisition announcement, then retrieving tax-related documents for
            that specific deal. Iterative retrieval solves this by having the LLM
            extract sub-queries from its intermediate reasoning, retrieving for
            each, and compiling a final answer. This is the retrieval pattern at
            the core of agentic RAG — see the dedicated Agentic RAG article for
            full architectural detail including tool selection, loop termination,
            and latency management.
          </p>

          <h3 className="text-lg font-semibold mt-4">GraphRAG</h3>
          <p>
            Vector similarity retrieval treats documents as independent; it
            misses relational structure. GraphRAG builds a knowledge graph from
            entities and relationships extracted from the corpus. Retrieval
            traverses the graph — starting from entities matched by the query
            and following edges — capturing multi-hop relationships that are
            invisible in embedding space. This is critical for questions like
            &quot;which subsidiaries are affected by the new EU regulation?&quot;
            The tradeoff: graph construction (entity extraction, deduplication,
            relationship extraction) is expensive both in compute and LLM calls.
            Microsoft Research released an open-source GraphRAG implementation
            in 2024; it requires 10-100× the ingestion cost of vector RAG but
            improves accuracy on relationship-heavy queries by 30-50%.
          </p>

          <h3 className="text-lg font-semibold mt-4">Enterprise Multi-Tenant RAG</h3>
          <p>
            When many tenants share an infrastructure, the central failure mode
            is <strong>cross-tenant leakage</strong> — Tenant A retrieving
            documents that belong only to Tenant B. Mitigation has three layers:
            (1) <strong>Namespace isolation at the vector store</strong> — every
            upsert and query includes the tenant ID as a mandatory metadata
            filter; the vector store enforces this at query time; (2)
            <strong>Embedding-time segregation</strong> — separate index
            namespaces (Pinecone) or collections (Qdrant/Weaviate) per tenant,
            which provides hard isolation at the cost of higher index overhead;
            (3) <strong>Row-level security in the relational metadata store</strong>
            — chunk metadata is also stored in PostgreSQL with tenant-scoped RLS
            policies so that even metadata queries cannot leak. In addition, the
            system prompt should instruct the LLM to cite only documents
            explicitly provided in context and to refuse to answer questions
            that require knowledge outside the provided context, preventing
            prompt-injection-based leakage.
          </p>

          <h3 className="text-lg font-semibold mt-4">Citation Integrity</h3>
          <p>
            LLMs hallucinate citations even when retrieving real documents. A
            production RAG system must verify that every factual claim in the
            generated answer is traceable to a specific retrieved chunk. The
            standard pattern is <strong>post-generation attribution</strong>: after
            generating the answer, run a second LLM pass that maps each sentence
            in the answer to the chunk it was derived from. Flag answers where
            any sentence cannot be attributed. For lower latency, use structured
            generation to force the model to emit inline citations as
            <code>[source_id]</code> markers during generation, then validate
            those source IDs against the retrieved chunk IDs. Citiation hit rate
            (fraction of sentences with a valid source) is a key production metric.
          </p>
        </div>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q5: Design an agentic RAG system for an enterprise legal platform
            with 500K documents. Requirements: multi-hop reasoning, citation
            guarantees, &lt;2s P95 latency, and strict tenant isolation.
          </h3>
          <p>
            This is a staff/principal-level question testing the ability to
            decompose a complex system with competing constraints.
          </p>
          <p className="mt-2">
            <strong>Retrieval architecture:</strong> Use parent-child chunking
            (256-token children indexed, 1024-token parents returned). Run
            HyDE for queries under 10 tokens to boost embedding quality. For
            queries containing entity names, run a parallel graph traversal over
            a pre-built entity-relationship graph (case law citations,
            statute references). Merge results with reciprocal rank fusion.
          </p>
          <p className="mt-2">
            <strong>Multi-hop orchestration:</strong> Implement a ReAct loop
            capped at 3 hops with a hard 1.2s wall-clock budget for retrieval.
            The LLM emits structured JSON with &#123;action: &quot;retrieve&quot;,
            query: &quot;...&quot;&#125; or &#123;action: &quot;answer&quot;, text: &quot;...&quot;&#125;. After 3 hops
            or 1.2s, force the answer action regardless of confidence.
          </p>
          <p className="mt-2">
            <strong>Citation guarantees:</strong> Force structured generation
            with inline citations using constrained decoding (Outlines or
            Guidance). Each claim must be followed by <code>[doc_id:chunk_id]</code>.
            A post-generation validator resolves all citation IDs against the
            retrieved chunk manifest and rejects answers with unresolvable citations,
            triggering a retry with an explicit &quot;cite only retrieved chunks&quot;
            instruction.
          </p>
          <p className="mt-2">
            <strong>Tenant isolation:</strong> Each tenant has a dedicated Qdrant
            collection. All queries include a signed JWT whose tenant claim is
            verified in the retrieval middleware — no query reaches the vector
            store without this check. The LLM gateway rate-limits per tenant to
            prevent token amplification abuse.
          </p>
          <p className="mt-2">
            <strong>Latency budget allocation:</strong> HyDE generation 200ms,
            parallel retrieval across vector + graph 300ms, reranking 100ms,
            generation with constrained decoding 800ms, citation validation 100ms
            — total budget ~1.5s P50, 2s P95 at 10 concurrent requests. Scale
            with horizontal generation replicas; use prefix caching on the system
            prompt (constant across all requests in the session) to cut TTFT by
            40%.
          </p>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2 text-sm text-muted">
          <li>
            Lewis, P. et al. (2020).{" "}
            <a
              href="https://arxiv.org/abs/2005.11401"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks&quot;
            </a>{" "}
            — NeurIPS 2020
          </li>
          <li>
            Gao, Y. et al. (2023).{" "}
            <a
              href="https://arxiv.org/abs/2312.10997"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;RAGAG: Retrieval-Augmented Generation with Adaptive Generation&quot;
            </a>{" "}
            — arXiv:2312.10997
          </li>
          <li>
            Es, S. et al. (2023).{" "}
            <a
              href="https://arxiv.org/abs/2309.15217"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;RAGAS: Automated Evaluation of Retrieval Augmented Generation&quot;
            </a>{" "}
            — arXiv:2309.15217
          </li>
          <li>
            Nogueira, R. et al. (2019).{" "}
            <a
              href="https://arxiv.org/abs/1901.04085"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Document Ranking with a Pretrained Sequence-to-Sequence Model&quot;
            </a>{" "}
            — EMNLP 2019
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
