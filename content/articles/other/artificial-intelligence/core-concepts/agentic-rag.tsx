"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-ai-agentic-rag",
  title: "Agentic RAG — Advanced Retrieval Patterns for Production AI Systems",
  description:
    "Comprehensive guide to agentic RAG covering HyDE, multi-query retrieval, parent-child chunking, self-querying retrieval, multi-hop reasoning, GraphRAG, structured data RAG (text-to-SQL), and enterprise multi-tenant retrieval architectures.",
  category: "other",
  subcategory: "artificial-intelligence",
  slug: "agentic-rag",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-05-15",
  tags: [
    "ai",
    "rag",
    "agentic-rag",
    "hyde",
    "graphrag",
    "multi-hop",
    "retrieval",
  ],
  relatedTopics: [
    "rag",
    "agents",
    "vector-db",
    "embeddings",
    "fine-tuning-vs-rag",
  ],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}><HighlightBlock as="p" tier="crucial" className="mb-4">Interview focus: Agentic RAG — Advanced Retrieval Patterns for Production AI Systems should be explained through a correctness invariant first, then through the implementation technique.</HighlightBlock><HighlightBlock as="p" tier="crucial" className="mb-4">Interview focus: In interviews, the decisive point is why this approach is valid under the stated constraints, not just what API or algorithm is used.</HighlightBlock><HighlightBlock as="p" tier="crucial" className="mb-4">Interview focus: The production-quality answer separates source of truth, derived state, failure behavior, and measurable cost.</HighlightBlock>
      {/* ── 1. Definition & Context ─────────────────────────────── */}
      <section>
        <h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Interview lens: frame Agentic RAG — Advanced Retrieval Patterns for Production AI Systems around model behavior, grounding, memory, evaluation, safety boundaries, latency, and cost control. This is what turns the article from concept notes into interview-ready reasoning.</HighlightBlock>

        <HighlightBlock tier="important">
          Agentic RAG extends naive retrieval-augmented generation by giving
          the retrieval process agency: it can transform queries before
          retrieval, issue multiple retrieval calls, reason about what
          information is still missing, and dynamically choose between
          retrieval strategies based on query complexity — rather than always
          executing a single fixed vector search.
        </HighlightBlock>

        <p>
          Naive RAG — embed the user query, ANN search in a vector store,
          prepend the top-K chunks to the prompt, call the LLM — fails in
          predictable ways. It assumes the user&apos;s phrasing is
          semantically close to the document text. It assumes the answer
          fits within a single retrieval step. It assumes questions are
          self-contained and require no context from related documents.
          For a simple FAQ bot backed by a small, well-structured knowledge
          base these assumptions hold. For an enterprise assistant over 100K
          engineering documents, a financial research tool that needs to
          compare data across multiple filings, or a customer support agent
          that must trace a multi-step incident history, they fail constantly.
          Users experience this as the system confidently giving incomplete or
          wrong answers, failing to surface relevant documents that are
          phrased differently from the query, and being unable to answer
          questions that require synthesizing across multiple sources.
        </p>

        <HighlightBlock tier="important">
          The progression from naive to advanced to agentic RAG follows a
          natural complexity ladder. Naive RAG: one embedding, one ANN search,
          top-K chunks. Advanced RAG: query transformation (HyDE, multi-query),
          better chunking (parent-child), hybrid search (vector + BM25),
          and reranking. Agentic RAG: multi-hop iterative retrieval, dynamic
          strategy selection, GraphRAG for global questions, text-to-SQL for
          structured data, and self-monitoring for citation integrity.
        </HighlightBlock>

        <p>
          The agentic framing means the retrieval step is no longer a
          single function call — it is a loop with conditionals. The agent
          retrieves, inspects what it got, decides whether it has enough
          information to answer, and if not, formulates follow-up retrieval
          queries targeting the specific gaps. This is exactly how a skilled
          human researcher works: they search, read, notice what they still
          do not know, search again with different terms, and synthesize
          only when they have sufficient evidence. The engineering challenge
          is implementing this loop reliably with bounded latency and cost.
          A poorly implemented agentic RAG system will recurse indefinitely,
          accumulate a context window full of low-quality chunks, and produce
          a hallucination with confident-sounding citations. The engineering
          disciplines covered in this article — hop limits, citation
          validation, strategy routing, and RAGAS-based evaluation — are
          what separate production-grade agentic RAG from a research prototype.
        </p>
      </section>

      {/* ── 2. Core Concepts ────────────────────────────────────── */}
      <section>
        <h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core invariant to defend: AI systems must keep generated output attributable, bounded, observable, and recoverable despite probabilistic behavior.</HighlightBlock>

        <HighlightBlock tier="important">
          The six techniques that constitute advanced and agentic RAG are:
          HyDE (generate a hypothetical answer, embed it, search with it),
          multi-query retrieval (rephrase and union), parent-child chunking
          (retrieve small, read large), self-querying retrieval (LLM generates
          metadata filters), iterative multi-hop retrieval (loop until context
          is sufficient), and GraphRAG (knowledge graph for global thematic
          queries). Each solves a different failure mode of naive RAG.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/other/artificial-intelligence/agentic-rag-architecture.svg"
          alt="Agentic RAG Architecture: Query Transformation, Multi-Hop Reasoning, GraphRAG and Structured Data, and Enterprise Patterns quadrants"
          caption="Four quadrants of advanced retrieval: query transformation techniques HyDE and multi-query (A), iterative retrieval and query decomposition for multi-hop reasoning (B), GraphRAG for global questions and text-to-SQL for structured data (C), and enterprise multi-tenant RAG with index management (D)."
        />

        <h3>HyDE — Hypothetical Document Embeddings</h3>
        <p>
          HyDE (Gao et al., 2022) addresses a fundamental asymmetry in
          embedding space: question embeddings and document embeddings live
          in different regions even when the document answers the question.
          A question like &quot;What causes Aurora Borealis?&quot; embeds
          differently from a passage that begins &quot;The Aurora Borealis
          is caused by...&quot; even though they are semantically equivalent.
          HyDE resolves this by instructing the LLM to generate a hypothetical
          document that would answer the query — a fake answer written in the
          same style as a document passage. This fake answer is then embedded
          and used as the search vector. Because the fake answer is in answer
          space rather than question space, it is geometrically closer to
          real answer documents in the embedding manifold. In practice, HyDE
          produces 10-30% recall improvement on open-domain QA benchmarks.
          When to use it: abstract questions, research queries, technical
          documentation lookup where phrasing varies significantly. When not
          to use it: factual lookup queries where the question phrasing is
          already close to the document text (e.g., searching for a specific
          API method name), or latency-sensitive paths where the extra LLM
          call to generate the hypothetical document adds unacceptable delay.
        </p>

        <h3>Multi-Query Retrieval</h3>
        <p>
          Multi-query retrieval acknowledges that any query has multiple
          valid phrasings and that different phrasings will retrieve
          different document sets. The approach: use the LLM to generate
          3-5 semantically equivalent rephrasings of the original query,
          run a retrieval for each rephrasing, take the union of all result
          sets, deduplicate by document ID, and rerank the union. The reranker
          (typically a cross-encoder like Cohere Rerank or a custom model)
          scores each document against the original query and sorts by
          relevance. The cost is N times the embedding and ANN search cost
          of a single retrieval, so it is most appropriate for queries where
          recall is more important than latency — research assistants,
          asynchronous document processing, and batch analytics are good fits.
          For interactive query-response loops with sub-500ms requirements,
          parallelize the N retrievals and time-box them, accepting that some
          may not complete before the deadline.
        </p>

        <h3>Parent-Child Chunking</h3>
        <p>
          The chunking strategy fundamentally affects retrieval quality.
          Smaller chunks improve retrieval precision — a 100-token chunk
          is more likely to be topically coherent and thus closely embedded
          to a specific query than a 2000-token chunk. But small chunks
          lack the surrounding context needed for a coherent LLM response.
          Parent-child chunking resolves this tension: index small chunks
          (128-256 tokens) for retrieval, but store a pointer to the parent
          chunk (512-1024 tokens) or the enclosing document section. When
          a small chunk is retrieved, the system fetches the parent chunk
          and passes that to the LLM. This gives the retrieval precision
          of small chunks and the context richness of large chunks. Overlap
          between chunks (10-15% of chunk size in token count) ensures that
          sentences near chunk boundaries are represented in both adjacent
          chunks and thus findable regardless of which side of the boundary
          the query phrase falls.
        </p>

        <h3>Self-Querying Retrieval</h3>
        <p>
          Self-querying retrieval allows the LLM to extract structured
          metadata filters from natural language queries and apply them
          before or alongside the ANN search. A query like &quot;What did
          engineering blog posts from 2024 say about database migrations?&quot;
          contains two implicit filters: document_type=blog_post and
          year=2024. A self-querying retriever parses these from the
          natural language query using an LLM with the metadata schema as
          context, constructs a filtered ANN search (metadata filter applied
          pre-query in vector databases like Pinecone, Weaviate, or Qdrant),
          and runs the vector search only over the filtered subset. This
          dramatically reduces the candidate space and improves precision
          on queries where the user&apos;s intent includes structural
          constraints that are not reflected in the document text embeddings.
        </p>

        <h3>Iterative Multi-Hop Retrieval</h3>
        <p>
          Multi-hop retrieval enables the agent to answer questions that
          require bridging multiple documents. The loop begins with a
          retrieval for the original query. The retrieved context is
          presented to the LLM with a prompt asking: &quot;Based on what
          you found, what information is still missing to fully answer the
          question?&quot; If the LLM identifies gaps, it generates targeted
          follow-up queries for each gap, and each is retrieved independently.
          This repeats up to a configured maximum hop count (3-5 is standard;
          beyond 5 the accumulated context usually degrades quality rather
          than improving it). The stopping condition is either the LLM
          signaling that it has sufficient context, or the hop limit being
          reached. Intermediate retrieval results are accumulated in the
          context window and deduplicated by document ID across hops. Multi-hop
          retrieval is essential for questions like &quot;How does Company
          A&apos;s pricing strategy compare to Company B&apos;s Q3 2024
          earnings guidance?&quot; where answering requires information from
          at least two distinct source documents.
        </p>

        <h3>RAGAS Evaluation Metrics</h3>
        <p>
          RAGAS (Retrieval-Augmented Generation Assessment) provides four
          metrics for evaluating RAG pipelines without labeled ground truth
          for every test case. Faithfulness: does the generated answer
          contain only claims that are supported by the retrieved context?
          (LLM-judged, 0-1). Answer Relevancy: how relevant is the answer
          to the question? (embedding-based, 0-1). Context Precision: are
          the retrieved chunks actually useful for the answer, or is the
          retrieval noisy? Context Recall: given a reference answer, did
          the retrieval find the documents needed to support it? For advanced
          RAG systems, tracking Context Precision and Context Recall
          separately is critical: a high-recall system retrieves broadly
          (good for multi-hop), while a high-precision system retrieves
          narrowly (good for factual lookup). Most production systems need
          both, which is why hybrid retrieval (vector + BM25 with reciprocal
          rank fusion) typically outperforms either alone.
        </p>
      </section>

      {/* ── 3. Architecture & Flow ──────────────────────────────── */}
      <section>
        <h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="important" className="mb-4">Decision quality comes from naming the constraint, the chosen technique, the proof boundary, and the cost model before discussing implementation details.</HighlightBlock>

        <HighlightBlock tier="important">
          The full agentic RAG pipeline is: query arrives → complexity
          classifier routes to a strategy (simple/multi-query/multi-hop/
          GraphRAG/text-to-SQL) → selected strategy executes (one or more
          retrieval calls) → results reranked → LLM synthesizes answer →
          citation validator checks each claim against source chunks →
          response returned with inline citations. The classification and
          citation validation steps are what make this &quot;agentic.&quot;
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/other/artificial-intelligence/agentic-rag-architecture.svg"
          alt="Agentic RAG pipeline showing strategy selection, retrieval execution, and citation validation"
          caption="The agentic RAG pipeline dynamically selects a retrieval strategy based on query complexity, then validates citations after synthesis to guarantee that every claim in the response is traceable to a specific source chunk."
        />

        <h3>Query Complexity Classification</h3>
        <p>
          The classifier runs before any retrieval and determines which
          strategy to invoke. It operates on a set of heuristic and
          model-based signals: query length, presence of comparative
          language (&quot;compare,&quot; &quot;versus,&quot;
          &quot;difference between&quot;), presence of temporal constraints
          (&quot;in 2024,&quot; &quot;last quarter&quot;), presence of
          aggregation keywords (&quot;all,&quot; &quot;every,&quot;
          &quot;across&quot;), and whether the query references multiple
          named entities. Simple factual queries (short, single entity, no
          comparatives) route to standard RAG with optional HyDE. Complex
          single-document queries route to multi-query retrieval. Multi-entity
          comparisons route to multi-hop with query decomposition. Thematic
          or global questions that do not map to a single document route to
          GraphRAG. Queries against a known structured data source (detected
          by table name or schema keywords in the query) route to text-to-SQL.
          The classifier itself is a lightweight LLM call with a structured
          output schema — the overhead is 100-200 ms, which is acceptable
          given that it determines the strategy for a potentially multi-second
          retrieval operation.
        </p>

        <h3>GraphRAG Index Structure and Query Flow</h3>
        <p>
          GraphRAG (Microsoft, 2024) builds a knowledge graph over the corpus
          during indexing. Each document is processed by an entity and
          relationship extractor (typically an LLM-based pipeline) that
          produces (entity, relation, entity) triples. These triples are
          stored in a graph database (Neo4j or a simple adjacency list in
          Postgres for smaller corpora). Leiden community detection runs
          over the entity graph to find clusters of densely connected entities.
          For each community, the LLM generates a natural-language summary
          of what that community represents. At query time, a global query
          (e.g., &quot;What are the main themes in our engineering
          blog?&quot;) retrieves community summaries rather than individual
          document chunks. A local query (e.g., &quot;What does our blog
          say about PostgreSQL indexing?&quot;) traverses the graph from the
          PostgreSQL entity node. The significant downside of GraphRAG is
          index build cost: for a 100K-document corpus, the entity extraction
          LLM calls alone may cost hundreds of dollars and take hours. This
          makes GraphRAG impractical for frequently-updated corpora — it is
          best suited to archives and corpora that change infrequently. For
          frequently-updated corpora, incremental graph updates on document
          change events mitigate but do not eliminate the cost.
        </p>

        <h3>Text-to-SQL Pipeline with Validation Loop</h3>
        <p>
          When the complexity classifier identifies that the query targets
          a structured data source, the text-to-SQL pipeline activates.
          The schema context is retrieved from a schema registry (table names,
          column names, types, descriptions, and sample rows for 3-5
          representative tables). A few-shot prompt with 3-5 example
          (natural language, SQL) pairs from the same schema domain is
          constructed. The LLM generates a SQL query. Before execution,
          the gateway runs EXPLAIN on the generated query to validate syntax
          and catch missing table references or type mismatches without
          touching actual data. If EXPLAIN succeeds, the query executes
          against a read-only replica with a row limit (DEFAULT LIMIT 1000)
          to prevent expensive full-table scans. If the query fails or
          returns an error, the error message is fed back to the LLM with
          a correction prompt — this error-feedback loop runs up to 3 times
          before returning a failure to the user. The result set is returned
          to the LLM for natural language synthesis, not raw to the user.
          The SELECT-only restriction is enforced at the database connection
          level (a read-only database role) rather than by prompt instruction
          alone, because prompt-based guardrails are insufficient for
          preventing destructive queries.
        </p>

        <HighlightBlock tier="important">
          Citation validation is the mechanism that prevents the LLM from
          hallucinating sources. After the LLM generates its answer, a
          validation pass extracts each cited claim and verifies that the
          claim is entailed by the cited chunk using a smaller entailment
          model or a second LLM call with a strict verification prompt.
          Claims that fail entailment are either removed from the response
          or flagged with a low-confidence indicator before returning to
          the user.
        </HighlightBlock>
      </section>

      {/* ── 4. Trade-offs & Comparison ──────────────────────────── */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>

        <HighlightBlock tier="important">
          Choose the simplest strategy that meets your recall and latency
          requirements. Naive RAG is fast and cheap. HyDE adds one LLM
          call. Multi-query adds N retrieval calls. Multi-hop adds O(hops)
          LLM+retrieval calls. GraphRAG adds a multi-thousand-dollar index
          build. Each upgrade improves answer quality for specific query
          types and degrades cost and latency everywhere.
        </HighlightBlock>

        <p>
          Naive RAG works well when your corpus is small (under 5K documents),
          well-structured (each chunk covers a distinct topic), and the user
          population phrases queries similarly to the document text. If your
          RAGAS Context Recall is above 0.85 with naive RAG, do not add
          complexity. If Context Recall is below 0.7, the first upgrade to
          try is hybrid search (vector + BM25 with reciprocal rank fusion),
          which typically adds 5-10 recall points at minimal latency cost.
          HyDE is the next upgrade for abstract or research-style queries
          where the question and answer phrasings differ significantly. It
          does not help — and can hurt — for keyword-heavy queries where
          the question already closely matches the document text, because
          the hypothetical document may embed near wrong sections of the
          corpus.
        </p>

        <p>
          Multi-query retrieval is the best upgrade for interactive
          applications where recall matters more than latency and the query
          population is diverse in phrasing. It consistently improves Context
          Recall by 10-20 percentage points at the cost of 3-5x retrieval
          latency (which is often acceptable when retrieval itself takes 50 ms
          and the LLM call takes 1500 ms). Multi-hop retrieval is appropriate
          specifically for multi-entity and multi-document questions — it
          adds substantial cost and latency and should not be the default
          strategy for all queries. GraphRAG is justified only when your
          corpus contains a large body of knowledge that users ask global
          thematic questions about, and when the corpus update frequency is
          low enough that the index build cost amortizes over weeks or months.
          Text-to-SQL is a specialized strategy for corpora where the
          &quot;documents&quot; are actually database tables — it is not
          a retrieval fallback but a distinct retrieval modality.
        </p>

        <p>
          The retrieval fallback hierarchy when a strategy fails or returns
          zero results is: vector search → BM25 full-text search → direct
          LLM with no retrieval. BM25 as a fallback catches the cases where
          embedding models fail on specialized vocabulary (medical codes,
          legal citations, proprietary product names) that BM25&apos;s exact
          matching handles naturally. Direct LLM with no retrieval is a last
          resort for queries that cannot be answered from the corpus — better
          to be transparent about this than to silently return a hallucinated
          answer.
        </p>
      </section>

      {/* ── 5. Best Practices ───────────────────────────────────── */}
      <section>
        <h2>Best Practices</h2>

        <HighlightBlock tier="important">
          Measure before optimizing. Establish a RAGAS baseline on a
          representative test set (200-500 question-answer pairs from real
          user queries) before adding any advanced retrieval technique.
          Every technique you add should be validated against this baseline —
          it is common for seemingly sophisticated techniques to hurt metrics
          for specific query categories even while helping globally.
        </HighlightBlock>

        <p>
          Start with hybrid search (vector + BM25) before trying any
          query transformation technique. Hybrid search with reciprocal rank
          fusion is implemented by most modern vector databases (Weaviate,
          Qdrant, Elasticsearch) as a built-in feature and requires no extra
          LLM calls. It consistently improves recall for technical queries
          where exact terminology matching matters, and it handles cold-start
          scenarios where embedding models have not been fine-tuned on
          domain-specific vocabulary. Add HyDE or multi-query retrieval
          only after confirming that hybrid search leaves recall gaps on
          specific query categories.
        </p>

        <HighlightBlock tier="important">
          Cache intermediate retrieval results in multi-hop pipelines.
          The first-hop retrieval result for a common sub-question (e.g.,
          &quot;What is Company A&apos;s revenue in Q3 2024?&quot;) will
          recur across many complex queries. Caching by (query, hop_index)
          using an exact-match cache with a 1-hour TTL can cut the cost
          of multi-hop retrieval by 20-40% on corpora where users ask
          overlapping questions about the same entities.
        </HighlightBlock>

        <p>
          Implement retrieval quality monitoring in production, not just
          offline evaluation. Log the retrieval results (document IDs,
          similarity scores, strategy used) for every query. Periodically
          sample queries and have domain experts rate the retrieval quality
          (did the retrieved chunks actually support the answer?). Track
          Context Precision over time — a degrading metric indicates that
          your corpus has grown in ways that introduce noisy documents
          near your queries in embedding space, and re-tuning the chunking
          strategy or embedding model fine-tuning is warranted. Use LLM-as-judge
          for automated quality scoring at scale when human rating is too
          expensive.
        </p>
      </section>

      {/* ── 6. Common Pitfalls ──────────────────────────────────── */}
      <section>
        <h2>Common Pitfalls</h2><HighlightBlock as="p" tier="important" className="mb-4">Failure modes to call out: hallucination, prompt injection, stale retrieval, unbounded context growth, hidden model cost, and UI that overstates certainty.</HighlightBlock>

        <HighlightBlock tier="important">
          HyDE generating hallucinated documents that embed near wrong content
          is the most insidious failure mode because the system will confidently
          retrieve and cite plausible-sounding but incorrect documents. If the
          LLM generates a hypothetical answer that is factually wrong (which
          happens when the LLM lacks domain knowledge about the query topic),
          the embedding of that wrong answer will search for documents that
          support the wrong claim, not the true answer. Mitigation: evaluate
          HyDE on a test set with known correct answers and confirm recall
          improves before deploying. Disable HyDE for query categories where
          the domain knowledge gap is likely (highly specialized technical or
          medical domains).
        </HighlightBlock>

        <p>
          Multi-hop without hop limits will recurse indefinitely on circular
          or unresolvable knowledge gaps. If the LLM identifies missing
          information that cannot be found in the corpus, it will keep
          generating retrieval queries that return irrelevant results and
          identifying the same gaps in the next iteration. Enforce a hard
          hop limit in the retrieval loop (3-5) and implement a deduplication
          check on follow-up queries — if the follow-up query is semantically
          equivalent (cosine similarity &gt; 0.9) to a previous hop&apos;s
          query, skip it and declare the context collection complete. This
          prevents semantic cycles where the agent rephrases the same gap
          in slightly different ways across multiple hops.
        </p>

        <HighlightBlock tier="important">
          Multi-tenant namespace leakage is the most critical production
          security failure in enterprise RAG deployments. If the tenant_id
          filter is omitted from a query — due to a code bug, a missing
          header, or a default-empty filter condition — the vector search
          will return documents from all tenants. The mitigation is defense
          in depth: enforce tenant_id as a required parameter in the retrieval
          function signature, reject requests with empty or null tenant_id at
          the gateway level, and run regular automated tests that submit
          cross-tenant queries and verify zero cross-tenant results.
        </HighlightBlock>

        <p>
          GraphRAG&apos;s index build cost makes it impractical for
          frequently-updated corpora. A corpus that receives daily document
          updates cannot afford to rebuild the full knowledge graph nightly.
          Incremental graph updates require detecting which entities and
          relations changed in updated documents and merging the delta into
          the existing graph — a non-trivial engineering problem that most
          teams underestimate. If your corpus update frequency is daily or
          higher, GraphRAG is the wrong architecture: use multi-hop RAG
          over a standard vector index with parent-child chunking instead.
          Save GraphRAG for archival corpora (financial filings, research
          papers, historical documentation) where freshness is not a primary
          requirement.
        </p>
      </section>

      {/* ── 7. Real-World Use Cases ─────────────────────────────── */}
      <section>
        <h2>Real-World Use Cases</h2>

        <p>
          An enterprise knowledge base assistant at a software company with
          100K documents (engineering runbooks, architecture decision records,
          incident post-mortems, and product documentation) uses a tiered
          agentic RAG approach. Simple keyword queries like &quot;how to
          restart the billing service&quot; route to hybrid search with
          BM25 taking precedence (exact terminology match). Investigative
          queries like &quot;why did we choose Kafka over RabbitMQ in 2022?&quot;
          route to HyDE (the hypothetical document about messaging system
          tradeoffs embeds close to the ADR). Multi-entity comparison queries
          like &quot;what do our post-mortems say about database connection
          pool exhaustion across all services?&quot; route to multi-hop
          with query decomposition (first retrieve post-mortems mentioning
          connection pools, then retrieve per-service tuning documentation
          for each affected service). The retrieval strategy is selected
          automatically by the complexity classifier, and engineers never
          need to specify which strategy to use. RAGAS Context Recall improved
          from 0.61 (naive RAG) to 0.84 after deploying the full agentic
          pipeline.
        </p>

        <p>
          A financial research assistant at an investment firm compares
          companies across earnings call transcripts, 10-K filings, and
          analyst reports. The primary retrieval challenge is multi-document
          synthesis: answering &quot;How do the three largest cloud providers
          characterize their AI infrastructure investment plans for 2025?&quot;
          requires retrieving relevant passages from three separate documents
          and synthesizing a comparison. This maps directly to multi-hop
          with query decomposition (decompose into three sub-queries, one
          per company, retrieve in parallel, then synthesize). The system
          uses parent-child chunking with earnings call paragraphs as
          children and call sections as parents, ensuring that retrieved
          paragraphs include the surrounding context needed to understand
          the speaker&apos;s full argument. Citation validation is especially
          critical in this domain: every claim in the response must be
          traceable to a specific document, page, and paragraph for
          compliance review.
        </p>

        <p>
          A business analytics assistant for a mid-market SaaS company
          exposes natural language querying over Postgres tables containing
          customer revenue data, usage metrics, and support tickets. The
          text-to-SQL pipeline handles queries like &quot;Which customers
          in the enterprise tier had support ticket volume increase more
          than 50% in Q4 2024?&quot; The schema context includes table
          descriptions written by the data team in plain English, which
          significantly improves SQL generation accuracy (from 62% correct
          on first attempt to 89% after adding descriptions). The error
          feedback loop handles the remaining cases: the LLM sees the
          Postgres error message and corrects column name typos or join
          conditions within 1-2 iterations in 95% of cases. The SELECT-only
          restriction is enforced at the database role level with no
          INSERT/UPDATE/DELETE privileges.
        </p>
      </section>

      {/* ── 8. Interview Q&As ───────────────────────────────────── */}
      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>

        <HighlightBlock as="p" tier="crucial">
          Interview focus: answer with constraints, decisions, trade-offs, and
          how you&apos;d validate/operate the system. Demonstrate that you
          understand when each technique helps and when it hurts, and that
          you have thought about production failure modes, not just happy-path
          quality improvements.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q1: What is HyDE and when would you use it?
          </h3>
          <HighlightBlock as="p" tier="important">
            Interview focus: explain the embedding space intuition, not just
            the mechanism. Name the specific query types where HyDE helps
            vs. hurts, and how you would validate it before deploying.
          </HighlightBlock>
          <p>
            HyDE (Hypothetical Document Embeddings) addresses the semantic
            gap between question and answer embeddings in vector space. When
            you embed a question, you get a vector that is geometrically
            close to other questions about the same topic — but the documents
            that answer those questions are in a different region of the
            embedding manifold because they are written in declarative,
            answer-form language. HyDE resolves this by using the LLM to
            generate a hypothetical answer in the same style as the documents
            in the corpus, then embedding that hypothetical answer instead
            of the question. The hypothetical answer&apos;s embedding lands
            closer to the real answer documents in embedding space.
          </p>
          <p>
            I would use HyDE for abstract or research-style queries where the
            question phrasing and document phrasing are likely to diverge
            significantly: technical how-to questions, conceptual explanations,
            and open-domain QA. I would not use it for keyword-heavy factual
            lookups where the question already mirrors the document text
            (searching for an API endpoint name, a product SKU, or a specific
            procedure name), because the hypothetical answer may embed the
            LLM&apos;s prior knowledge rather than the corpus content, leading
            the search toward plausible-but-wrong documents. Validation: run
            RAGAS Context Recall on a test set with and without HyDE enabled.
            Segment results by query category. Enable HyDE only for categories
            where it improves recall by at least 5 percentage points.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q2: Design a multi-hop RAG system for a research assistant that
            answers questions requiring information from multiple documents.
          </h3>
          <HighlightBlock as="p" tier="important">
            Interview focus: describe the loop mechanics, stopping conditions,
            hop limit enforcement, context accumulation strategy, and how
            you prevent infinite recursion and context window overflow.
          </HighlightBlock>
          <p>
            The multi-hop loop has four components: an initial retrieval,
            a gap analysis step, follow-up retrieval, and a termination
            check. The initial retrieval uses hybrid search (vector + BM25)
            with the original query. The gap analysis prompt presents the
            retrieved context to the LLM and asks: &quot;What specific
            information is still missing to fully answer this question? List
            each gap as a search query. If you have sufficient information,
            respond with DONE.&quot; If the LLM returns DONE, the loop exits.
            Otherwise, each gap query triggers a parallel retrieval. Results
            are added to the accumulated context, deduplicated by document ID.
          </p>
          <p>
            Stopping conditions: (1) LLM signals DONE, (2) hop count reaches
            the maximum (3-5), (3) the follow-up queries are semantically
            equivalent to a previous hop&apos;s queries (cosine similarity
            &gt;0.90, indicating a cycle), or (4) the accumulated context
            exceeds 80% of the model&apos;s context window. Context window
            management is important: as hops accumulate, older, lower-relevance
            chunks should be pruned using a reranker that scores all accumulated
            chunks against the original query and retains the top-K. This
            ensures the context window contains the most relevant evidence
            across all hops rather than a first-come-first-served accumulation.
            Latency management: parallelize follow-up retrievals within each
            hop. Cache sub-query results with a short TTL so repeated
            sub-queries across different user sessions hit the cache.
            Time-box the entire loop to a maximum of 8 seconds for interactive
            use cases; use an asynchronous job for longer research tasks.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q3: How does GraphRAG differ from standard RAG and when is the
            index build cost worth it?
          </h3>
          <HighlightBlock as="p" tier="important">
            Interview focus: explain the structural difference (chunks vs.
            entities/communities), what query types each handles well, and
            give a concrete cost/benefit analysis for when to invest in
            GraphRAG.
          </HighlightBlock>
          <p>
            Standard RAG operates on chunks: documents are split into fixed
            or semantic chunks, embedded, and stored in a vector index.
            Retrieval is local — it finds chunks that are semantically similar
            to the query. It excels at factual lookup and local questions but
            fails at global questions: &quot;What are the main architectural
            themes across our entire engineering corpus?&quot; cannot be
            answered by finding similar chunks, because no single chunk
            captures the global structure of the corpus.
          </p>
          <p>
            GraphRAG operates on knowledge graph communities. The indexing
            pipeline extracts entities and relations from every document,
            builds a graph, runs community detection (Leiden algorithm) to
            find clusters of closely related entities, and generates LLM
            summaries for each community. At query time, global questions
            retrieve community summaries (which capture the thematic structure
            of the corpus); local questions traverse the graph from specific
            entity nodes. The index build cost for a 100K-document corpus
            is typically $50-500 in LLM calls (entity extraction) and 2-8
            hours of compute. This is worthwhile when: your corpus is
            relatively static (monthly or quarterly updates), users regularly
            ask global thematic questions, and the corpus contains dense
            entity relationships (research papers, financial filings, legal
            documents). It is not worthwhile when: the corpus updates daily,
            users primarily ask factual lookup questions, or the corpus is
            small enough that multi-hop retrieval covers all cases.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q4: How do you implement multi-tenant RAG with strict document
            access control?
          </h3>
          <HighlightBlock as="p" tier="important">
            Interview focus: the critical mistake is filtering after ANN search
            rather than before. Explain pre-filtering, index isolation
            trade-offs, and how to test for cross-tenant leakage.
          </HighlightBlock>
          <p>
            Multi-tenant RAG requires that no tenant can retrieve documents
            belonging to another tenant, even if those documents are
            semantically similar. The naive approach — retrieve broadly and
            filter results by tenant_id — is incorrect: ANN search returns
            top-K neighbors globally, and the K relevant documents for a
            given tenant may not even appear in the globally-retrieved set
            if they are outranked by documents from other tenants.
          </p>
          <p>
            The correct approach is pre-filtering: apply the tenant_id filter
            as a metadata constraint before the ANN search, so the search
            operates only over the tenant&apos;s document subset. All major
            vector databases (Pinecone, Weaviate, Qdrant, pgvector with
            WHERE clauses) support pre-filtering. For tenants with very small
            document sets (under 1000 chunks), use separate collections or
            namespaces per tenant rather than a shared collection with metadata
            filters — this provides hard index isolation and eliminates any
            risk of filter bypass. For large tenants (10K+ chunks), shared
            collections with pre-filtering are more operationally manageable.
            Document-level RBAC goes beyond tenant isolation: within a tenant,
            individual documents may have access restrictions (e.g., only HR
            team members can retrieve HR policy documents). Implement this by
            storing an allowed_roles list in each document&apos;s metadata and
            adding the user&apos;s roles as a filter condition alongside
            tenant_id. Test for leakage with automated cross-tenant query tests
            that run on every deployment and verify zero cross-tenant results
            for a test corpus with known tenant boundaries.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q5 (Staff/Principal): Design an agentic RAG system that dynamically
            chooses its retrieval strategy based on query complexity, guarantees
            citation integrity, and meets a &lt;2s P95 latency target for
            interactive queries.
          </h3>
          <HighlightBlock as="p" tier="important">
            Interview focus: this question tests system-level thinking — budget
            allocation across components, parallelism, latency optimization
            within the agentic loop, and the citation integrity mechanism.
            Name specific latency budgets for each component.
          </HighlightBlock>
          <p>
            Starting with the latency budget: 2000 ms P95 must be allocated
            across classifier, retrieval, reranking, LLM synthesis, and
            citation validation. Target allocation: classifier (100 ms),
            retrieval (200-400 ms), reranker (100 ms), LLM synthesis
            (1000-1200 ms), citation validation (150 ms), overhead (50 ms).
            This budget only works for single-hop strategies. Multi-hop queries
            cannot meet 2s P95 by definition; they should be handled
            asynchronously with a streaming response that surfaces intermediate
            results as each hop completes.
          </p>
          <p>
            The complexity classifier uses a fast heuristic-first approach:
            check query length, entity count, and keyword patterns
            (comparative, temporal, aggregative) in under 10 ms with regex
            and a lightweight NER model. Only ambiguous cases (roughly 15-20%
            of queries) escalate to a full LLM classification call. This keeps
            the classifier at 50-100 ms average. For the retrieval step,
            run hybrid search (vector + BM25) always as the baseline. For
            queries classified as multi-query, fire 3 rephrasings in parallel
            and use the union of whichever complete within 300 ms — accept
            that some rephrasings may time out rather than blocking the
            entire retrieval. For HyDE, generate the hypothetical document
            in parallel with the original embedding using a streaming LLM
            call; use whichever embedding returns first or the average of both.
          </p>
          <p>
            Citation integrity requires that every claim in the generated
            response maps to a specific chunk. The implementation is a
            two-stage LLM call. Stage 1: synthesis prompt instructs the LLM
            to generate the response and annotate each factual claim with a
            citation tag referencing the chunk ID (e.g., [chunk:abc123]).
            Stage 2: a fast verification prompt presents each (claim, chunk)
            pair and asks the LLM to confirm entailment (yes/no). This runs
            in parallel for all claims after synthesis completes. Claims that
            fail entailment are flagged in the response UI with a
            &quot;unverified claim&quot; indicator rather than being silently
            removed — transparency is more valuable than hiding uncertainty.
            The verification step adds roughly 100-150 ms when run with a
            fast small model (GPT-4o-mini) and parallelized across claims.
            The end-to-end architecture — fast classifier, parallelized hybrid
            retrieval, synthesis with citation tags, parallel claim verification
            — is the design that meets the 2s P95 target for single-hop
            queries while maintaining citation integrity. Multi-hop queries
            are explicitly out-of-scope for the synchronous path and are
            surfaced with a &quot;researching...&quot; streaming UI that
            updates as each hop completes.
          </p>
        </div>
      </section>

      {/* ── 9. References ───────────────────────────────────────── */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2 text-sm text-muted">
          <li>
            Gao et al. — Precise Zero-Shot Dense Retrieval without Relevance
            Labels (HyDE, 2022):{" "}
            <span className="font-mono">arxiv.org/abs/2212.10496</span>
          </li>
          <li>
            Edge et al. — From Local to Global: A Graph RAG Approach to
            Query-Focused Summarization (Microsoft, 2024):{" "}
            <span className="font-mono">arxiv.org/abs/2404.16130</span>
          </li>
          <li>
            RAGAS — Automated Evaluation of Retrieval-Augmented Generation:{" "}
            <span className="font-mono">github.com/explodinggradients/ragas</span>
          </li>
          <li>
            LlamaIndex — Agentic RAG Documentation:{" "}
            <span className="font-mono">docs.llamaindex.ai/agentic-rag</span>
          </li>
          <li>
            LangChain — Multi-Query Retriever:{" "}
            <span className="font-mono">
              python.langchain.com/docs/modules/data_connection/retrievers/multi_query
            </span>
          </li>
          <li>
            Qdrant — Pre-filtering in Vector Search:{" "}
            <span className="font-mono">
              qdrant.tech/articles/filterset-optimization
            </span>
          </li>
          <li>
            Microsoft GraphRAG — Open-source library:{" "}
            <span className="font-mono">github.com/microsoft/graphrag</span>
          </li>
          <li>
            Reciprocal Rank Fusion for Hybrid Search — Cormack et al. (2009):{" "}
            <span className="font-mono">
              plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf
            </span>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
