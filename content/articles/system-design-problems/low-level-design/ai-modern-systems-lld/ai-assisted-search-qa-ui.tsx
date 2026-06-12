"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-ai-assisted-search-qa",
  title: "AI-Assisted Search & Q&A UI",
  description:
    "Semantic search powered by embeddings with retrieval-augmented generation (RAG) for question answering from documents — chunking strategy, ANN retrieval, re-ranking, grounding, and citation rendering.",
  category: "low-level-design",
  subcategory: "ai-modern-systems",
  slug: "ai-assisted-search-qa-ui",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-16",
  tags: ["lld", "ai", "search", "rag", "embeddings", "semantic", "vector-search"],
  relatedTopics: ["token-streaming-buffer", "streaming-chat-ui"],
};

export default function AIAssistedSearchQAArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section><h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame AI-Assisted Search &amp; Q&amp;A UI around system boundary, state ownership, failure handling, scalability, security, and observable recovery. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock><p>AI-Assisted Search and Q&A UI is an implementation-heavy low-level design problem. A principal-level answer must define authoritative state, client projections, lifecycle transitions, failure behavior, privacy boundaries, abuse controls, cost limits, rollback, and observability.</p><p>The retrieval service is authoritative for authorized source candidates; the generated answer is a derived projection that must remain grounded in cited chunks.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/ai-modern-systems/ai-assisted-search-qa-ui-runtime.svg" alt="AI-Assisted Search and Q&A UI runtime lifecycle" caption="Runtime lifecycle with authority boundaries and observable checkpoints." /></section>
      <section><h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: the design must preserve correctness under latency, concurrency, partial failure, and changing permissions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For AI-Assisted Search &amp; Q&amp;A UI, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock><p>The retained deep dive below covers the topic-specific implementation mechanics.</p>
      <p>
        AI-assisted search occupies an uncomfortable middle ground between full
        chat interfaces and traditional keyword search. Users arrive with specific
        questions — "what's the timeout for our payment gateway?" — not with keyword
        lists. Keyword search returns documents containing those words in unknown
        proximity. A RAG (Retrieval-Augmented Generation) system returns a direct
        answer grounded in those documents, with citations. The engineering challenge
        is the pipeline from question to grounded answer: embedding computation,
        approximate nearest-neighbor retrieval, re-ranking, context assembly, LLM
        generation, citation rendering, and the hallucination detection layer that
        keeps the system honest about what it does and doesn't know.
      </p>
<h2>Clarifying the Requirements</h2>
      <p>
        Before building, establish scope. The answer changes the architecture significantly:
      </p>
      <p>
        <strong>What is the document corpus?</strong> A closed, known corpus (internal
        documentation, a product knowledge base, legal contracts) is indexed offline
        and queried at runtime. An open-web corpus requires real-time crawling or
        a search API (Bing, Brave) and is out of scope for most internal RAG systems.
        Closed corpus is significantly easier to control for quality and freshness.
      </p>
      <p>
        <strong>Multi-turn or single-turn?</strong> Single-turn Q&A (each question is
        independent) is straightforward. Multi-turn conversation (follow-up questions
        depend on prior context — "what about the timeout?" after already discussing
        payment gateways) requires query rewriting: the follow-up question must be
        rewritten to be self-contained before embedding, or the embedding must incorporate
        the conversational context. Query rewriting via a fast LLM call ("given this
        conversation, rephrase the latest question to be self-contained") adds ~100ms
        but is necessary for coherent multi-turn retrieval.
      </p>
      <p>
        <strong>Access controls?</strong> Many enterprise document corpora have
        per-user or per-role document permissions. A user must not receive an answer
        grounded in documents they're not authorized to read. This is the access
        control problem: filtering must happen during retrieval, not after — showing
        that a document exists but not its content is still a leak.
      </p>
      <HighlightBlock as="p" tier="crucial">
        Define the hallucination policy upfront. "I don't know" behavior — refusing
        to answer when the retrieved documents don't contain sufficient information —
        is non-negotiable for high-stakes domains (legal, medical, financial compliance).
        For casual documentation Q&A, allowing the LLM to supplement retrieved context
        with parametric knowledge produces more helpful answers at the cost of some
        hallucination risk. This policy decision determines the system prompt instructions
        and the grounding check design.
      </HighlightBlock>

      <h2>Document Indexing Pipeline</h2>
      <p>
        Before any query can be answered, documents must be indexed. The indexing
        pipeline runs offline (or as documents are added/updated) and produces the
        vector store that retrieval queries against.
      </p>
      <p>
        <strong>Chunking strategy.</strong> Embedding models take a fixed-size input
        (typically 512 or 8192 tokens). A 50-page document cannot be embedded as a
        single unit. It must be split into chunks that are embedded individually.
        The chunking strategy significantly affects retrieval quality.
      </p>
      <p>
        Fixed-size chunking (always 400 tokens per chunk with 50-token overlap between
        adjacent chunks) is the simplest approach. The overlap preserves context that
        would otherwise be split at chunk boundaries. However, fixed-size chunking
        ignores document structure — it splits mid-sentence, mid-paragraph, and
        mid-section regardless of semantic boundaries.
      </p>
      <HighlightBlock as="p" tier="important">
        Semantic chunking — splitting on paragraph boundaries, heading changes, or
        when the semantic similarity between adjacent sentences drops below a threshold —
        produces more coherent chunks at the cost of variable chunk sizes. For structured
        documentation with clear sections (API docs, legal clauses, knowledge base
        articles), semantic chunking consistently outperforms fixed-size chunking in
        retrieval precision benchmarks. The implementation: embed each sentence, compute
        rolling cosine similarity between adjacent sentence pairs, split where similarity
        drops significantly (a threshold around 0.7 works for most domains).
      </HighlightBlock>
      <p>
        <strong>Embedding each chunk.</strong> The embedding model converts each chunk
        to a dense vector (768–3072 dimensions depending on the model). The same
        embedding model must be used for both document indexing and query embedding —
        mixing models produces incompatible vector spaces. OpenAI's text-embedding-3-large,
        Cohere's embed-v3, and open-source models like BGE-large or E5-large are common
        choices. The model selection involves a quality-vs-cost trade-off: larger models
        produce higher-quality embeddings at higher API cost and latency.
      </p>
      <p>
        <strong>Metadata alongside embeddings.</strong> Each embedded chunk is stored
        in the vector database with metadata: documentId, chunkIndex, sourceUrl, title,
        section heading (if identifiable), lastUpdated, and access control tags (user
        groups or roles that can read this document). Metadata enables filtering during
        retrieval without scanning the full corpus, and enables the UI to construct
        accurate source citations.
      </p>
      <p>
        <strong>Index freshness.</strong> When a document is updated or deleted, its
        chunks must be re-indexed. The stale chunk problem: a document is updated to
        correct wrong information, but the old embedding remains in the index and continues
        to be retrieved. Maintain a mapping from documentId to all chunkIds; on document
        update, delete all old chunk embeddings and insert new ones. Trigger re-indexing
        from a webhook or change event from the document storage system.
      </p>

      <h2>Dense Retrieval and Approximate Nearest Neighbor</h2>
      <p>
        At query time, the user's question is embedded using the same model as the
        documents. The resulting query vector is compared against all chunk vectors
        in the index to find the most semantically similar chunks. This is the retrieval
        step, and it has a fundamental scalability constraint.
      </p>
      <p>
        Exact nearest-neighbor search is O(n × d) where n is the number of vectors and
        d is the vector dimension. For a corpus of 10 million chunks with 768 dimensions,
        exact search requires 7.68 billion floating-point operations per query — too slow
        for interactive search (target: under 100ms). Approximate nearest neighbor (ANN)
        algorithms solve this by trading a small amount of recall for orders-of-magnitude
        speedup.
      </p>
      <HighlightBlock as="p" tier="important">
        HNSW (Hierarchical Navigable Small World) is the dominant ANN algorithm in
        production systems. It builds a multi-layer graph where each node represents a
        chunk vector, and edges connect vectors that are close in the embedding space.
        Search navigates from the top layer (coarse, few nodes) down to the bottom layer
        (fine, all nodes), following the greedy path toward the query vector. HNSW achieves
        recall above 95% at under 10ms for 10M-vector corpora. Modern vector databases
        (Pinecone, Qdrant, Weaviate, pgvector with HNSW index) implement HNSW natively.
        The two tuning parameters: M (number of edges per node, higher M = better recall,
        more memory) and ef_construction (search depth during index construction, higher =
        better quality, slower indexing). For most documentation search use cases, M=16 and
        ef_construction=200 are reasonable defaults.
      </HighlightBlock>
      <p>
        <strong>Filtering during vector search.</strong> Access control and freshness
        filtering must happen during vector search, not after. Post-filtering (retrieve
        top-K, then filter) can return fewer than K usable results if many results are
        filtered out — returning only 2 usable results when K=10 was requested degrades
        generation quality significantly. Pre-filtering (filter before ANN) constrains
        the search space to authorized documents and produces K results that all pass
        the filter. The trade-off: pre-filtering on small authorized corpora degrades
        ANN recall (the graph traversal has fewer nodes to navigate). For strict access
        control, this is an acceptable trade-off. Most production vector databases support
        metadata filters applied during the ANN traversal.
      </p>

      <h2>Cross-Encoder Re-Ranking</h2>
      <p>
        Bi-encoder retrieval (embedding query and documents independently) is fast but
        architecturally limited. The query and document embeddings are computed in
        isolation — the model cannot see the specific interaction between the query
        "timeout for payment gateway" and a document discussing timeout configurations
        for multiple services. The embeddings capture general semantic similarity but
        miss fine-grained relevance signals.
      </p>
      <HighlightBlock as="p" tier="crucial">
        Cross-encoder re-ranking computes a joint representation of each
        (query, document) pair, allowing the model to see their interaction directly.
        A cross-encoder takes the concatenated query and document as input and outputs
        a relevance score (0–1). Applied to the top-20 bi-encoder candidates, it
        re-orders them by the more precise relevance score. Cross-encoders are 10–50x
        slower than bi-encoders (they cannot be pre-computed), so they run only on the
        small candidate set, not the full corpus. The latency overhead: re-ranking 20
        candidates with a cross-encoder takes 100–300ms on a GPU server. For high-stakes
        Q&A (legal, compliance, medical), this overhead is justified by precision gains
        of 10–20 percentage points in NDCG. For casual documentation search, skip
        re-ranking and rely on bi-encoder recall.
      </HighlightBlock>
      <p>
        A practical middle ground: use re-ranking conditionally. When the top-1 bi-encoder
        similarity score is above a high threshold (0.92+), the match is confident — skip
        re-ranking. When scores are lower or the spread between top candidates is small
        (they are similarly relevant), re-rank to disambiguate. This conditional strategy
        applies re-ranking where it provides the most value while saving latency for
        high-confidence retrieval.
      </p>

      <h2>Query Intent Classification</h2>
      <p>
        Not all queries benefit from RAG generation. A lightweight intent classifier
        routes queries before the expensive retrieval and generation steps:
      </p>
      <p>
        Factual questions ("what is the default timeout for the payment service?") go
        through the full RAG pipeline. Navigational queries ("show me the billing page")
        route to traditional search or navigation aids — the user wants a document or UI
        element, not a generated answer. Ambiguous queries may trigger a clarifying
        question ("are you asking about our payment service or the third-party gateway?").
        Unanswerable queries (asking about topics outside the corpus) are detected early
        using a "scope check" against corpus-level summaries and return a graceful
        "I don't have information about that" without invoking the full pipeline.
      </p>
      <p>
        The classifier can be as simple as a few regex patterns for clear navigational
        signals combined with a fast small LLM call (a 1B parameter local model or
        a fast API like GPT-3.5-turbo with a carefully engineered prompt). The classifier
        adds under 50ms. Without it, every user input — including "thanks" or "close" —
        triggers a full RAG invocation, wasting API cost and adding unnecessary latency.
      </p>

      <h2>Context Assembly and Context Window Management</h2>
      <p>
        After retrieval (and optional re-ranking), the top-K chunks are assembled into
        the LLM context. The context window is finite — models have limits ranging from
        8K tokens (older models) to 200K tokens (Claude, Gemini 1.5). The context must
        include the system instruction, the retrieved chunks, the conversation history
        (for multi-turn), and leave room for the generated answer.
      </p>
      <p>
        The standard RAG prompt structure: a system instruction that defines the
        grounding policy ("Answer based only on the provided context. If the answer is
        not in the context, say so. Include inline citations [N] for each claim."),
        followed by numbered context sections (each retrieved chunk is presented as
        "Source [N]: [title] — [content]"), followed by the user's question. The
        numbered source format is what makes structured citation output possible —
        the LLM can reference [1], [2] in its answer, and the UI maps these back to
        the source chunks.
      </p>
      <HighlightBlock as="p" tier="important">
        Context window filling strategy: fill from highest relevance score downward
        until the token budget (context limit minus system prompt minus response space)
        is exhausted. For most queries, top-5 chunks at 400 tokens each (2000 tokens total)
        leaves ample room for the answer within even an 8K context window. For queries
        that require synthesizing information from many sources ("summarize the key
        configuration options across all our services"), a larger K (10–15 chunks) with
        aggressive re-ranking produces better coverage, but requires a larger context
        model. Match the chunk count to the model's context size and the query's
        breadth requirements.
      </HighlightBlock>

      <h2>Structured Citation Output</h2>
      <p>
        Citations are the difference between a trustworthy RAG answer and an untraceable
        LLM hallucination. The answer must map every factual claim to the specific source
        passage that supports it. This requires structured output from the LLM.
      </p>
      <p>
        Using JSON mode (supported by OpenAI, Anthropic, Gemini with schema constraints),
        the LLM returns a structured object: an "answer" field containing the answer text
        with inline citation markers (formatted as square bracket numbers), and a "citations"
        array where each element contains a sourceIndex (the number from the context prompt),
        the document title, a quoted excerpt from the source, and the source URL. The UI
        renders the answer text with citation superscripts linked to the source cards below.
      </p>
      <p>
        Inline citation rendering: parse the answer text for citation markers using a
        regex. Each marker is replaced with a superscript element that anchors to the
        corresponding source card. On desktop, hovering a citation shows a popover with
        the quoted excerpt without requiring navigation to the source document. On mobile,
        the source cards are shown collapsed below the answer with expand-on-tap behavior.
      </p>
      <HighlightBlock as="p" tier="important">
        Citation accuracy degrades when the LLM attributes a claim to the wrong source
        (hallucinated attribution). Detect this with a post-generation verification step:
        for each citation, check whether the quoted excerpt actually appears in the
        referenced source chunk (substring match or high cosine similarity between the
        excerpt and the chunk text). Mismatched citations are flagged with a visual
        indicator ("source may not fully support this claim"). This check runs in under
        10ms per citation and catches the most common attribution errors.
      </HighlightBlock>

      <h2>Hallucination Detection and Grounding Checks</h2>
      <p>
        The most dangerous failure mode in RAG is confident hallucination — the LLM
        asserts a specific fact (a number, a configuration value, a deadline) that is
        not present in any of the retrieved documents. This happens when the model
        supplements retrieved context with parametric knowledge (what it learned during
        pre-training), which may be outdated or domain-specific wrong.
      </p>
      <p>
        The grounding check runs after generation. For each factual claim in the answer,
        verify that at least one cited source chunk contains the claimed information.
        A lightweight implementation: extract numerical values, dates, and named entities
        from the answer, and check whether those values appear in the cited chunks. A more
        thorough implementation uses a second LLM call (a smaller, cheaper model): "Given
        this source text and this answer claim, does the source support the claim? Yes/No."
        Running this check for each claim adds 200–500ms to the pipeline.
      </p>
      <p>
        When grounding confidence is low, the UI should communicate this clearly: show
        a "verify this answer" indicator, deemphasize the AI answer relative to traditional
        search results, or withhold the answer entirely and fall back to a ranked list of
        source documents. The fallback behavior should match the domain's risk tolerance.
      </p>

      <h2>Hybrid Search: AI Answer + Traditional Results</h2>
      <p>
        Displaying only the AI answer and hiding traditional search results is a
        common but poor design choice. Users have diverse information-seeking behaviors:
        some want a direct answer, others want to scan multiple sources, and some
        specifically need to navigate to a particular document. Hybrid search serves
        all three modes simultaneously.
      </p>
      <p>
        The layout: the AI answer appears at the top in a visually distinct card with
        an AI badge, inline citations, and a confidence indicator. Below it, traditional
        ranked search results appear (BM25 or Elasticsearch keyword search, sorted by
        relevance). The user can dismiss the AI answer if they prefer to browse results.
        A "sources" section in the AI card links directly to the documents that grounded
        the answer, providing a bridge between the synthesized answer and the underlying
        sources.
      </p>
      <HighlightBlock as="p" tier="important">
        The confidence indicator drives the UI emphasis. When the top retrieved chunk
        has high similarity and the grounding check passes, show the AI answer prominently.
        When retrieved chunks have low similarity scores (the query may be outside the
        corpus) or the grounding check fails, show traditional results first with the AI
        answer in a collapsible section ("AI may not have reliable information for this
        query"). This adaptive emphasis prevents the AI answer from displacing useful
        traditional results when retrieval quality is poor.
      </HighlightBlock>

      <h2>Query Understanding for Multi-Turn Conversations</h2>
      <p>
        Multi-turn Q&A introduces query disambiguation. A user who has been discussing
        payment gateway configuration asks "what about retry logic?" The question is
        ambiguous — it could refer to any system's retry logic. To retrieve the correct
        documents, the embedding must represent the full question: "what is the retry
        logic for our payment gateway?"
      </p>
      <p>
        Query rewriting: given the conversation history and the latest user question,
        a fast LLM call rewrites the question to be self-contained. The prompt: "Given
        the conversation history below, rewrite the last user message as a self-contained
        question that can be understood without context. Do not add information not implied
        by the conversation." The rewritten question is what gets embedded for retrieval.
        This adds ~100ms (using a fast, cheap model like GPT-3.5-turbo or a small local
        model) but dramatically improves multi-turn retrieval precision.
      </p>

      <h2>Offline Evaluation and Quality Monitoring</h2>
      <p>
        RAG system quality degrades silently as documents change, embedding models
        age, and corpus distribution shifts. Without systematic evaluation, regressions
        reach production undetected.
      </p>
      <p>
        Offline evaluation requires a test set: curated (question, expected answer,
        relevant documents) triples. The test set is maintained by domain experts who
        periodically add new questions as the corpus grows. Evaluation metrics: RAGAS
        (faithfulness — does the answer stick to retrieved context; answer relevance —
        does the answer address the question; context precision — are the retrieved chunks
        relevant; context recall — were all relevant chunks retrieved), plus end-to-end
        answer quality scored by an LLM judge against the gold answer.
      </p>
      <HighlightBlock as="p" tier="crucial">
        Run evaluations on every significant change: new embedding model, modified
        chunking strategy, changed system prompt, updated corpus. Regressions on any
        RAGAS metric by more than 5 percentage points should block deployment. Without
        this gate, well-intentioned prompt changes can quietly degrade retrieval quality
        by confusing the model's grounding instruction. The evaluation pipeline should
        run in CI/CD, not as a manual step.
      </HighlightBlock>
      <p>
        Online monitoring: user feedback (thumbs up/down on answers), abandonment rate
        (user clicks a traditional result immediately after seeing the AI answer), and
        follow-up rephrasing rate (user rephrases the same question, indicating the
        answer didn't meet their need) provide continuous quality signals. Alert when
        the thumbs-up rate drops more than 5 percentage points over a 24-hour window.
      </p>

      <h2>Access Control Integration</h2>
      <p>
        Enterprise document corpora typically have row-level access controls: user A can
        read contracts for clients they manage, user B cannot. The RAG system must enforce
        these controls without exposing the content of unauthorized documents — even
        as metadata in the UI ("I found a relevant answer but you don't have access to the
        source" still reveals that a document discussing that topic exists).
      </p>
      <p>
        The retrieval filter: when querying the vector store, pass the user's group
        memberships or document permission IDs as a metadata filter. The vector database
        applies this filter during ANN traversal, returning only chunks from authorized
        documents. The LLM never sees unauthorized content, so it cannot inadvertently
        include it in the answer.
      </p>
      <p>
        Permission syncing: document permission metadata in the vector store must stay
        in sync with the authoritative permission system. Stale permissions are a security
        issue — a document that was de-authorized after indexing still appears in search
        if the vector store hasn't been updated. Build a reconciliation job that periodically
        verifies permission metadata in the vector store against the source permission system,
        triggering updates where discrepancies are found.
      </p>



</section>
      <section><h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: state model, API contracts, cache policy, async workflow, authorization, rollout, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock><p>Model the runtime as explicit transitions: query rewrite to ACL filter to hybrid retrieve to rerank to ground answer. Every asynchronous completion carries a generation, version, or correlation id so stale work can be rejected safely. Separate user intent, untrusted transport input, validated intermediate state, durable truth, and derived UI projection.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/ai-modern-systems/ai-assisted-search-qa-ui-recovery.svg" alt="AI-Assisted Search and Q&A UI failure containment and rollback" caption="Failure containment, rollback controls, and audit evidence." /></section>
      <section><h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock><p>The retrieval service is authoritative for authorized source candidates; the generated answer is a derived projection that must remain grounded in cited chunks.</p><p>The major pressure points are permission-filtered ANN recall, stale indexes, citation drift, multi-turn query ambiguity, retrieval fan-out, reranker latency, and unsupported-answer refusal. Prefer explicit bounded degradation over hidden correctness loss. Caches and optimistic UI improve latency only when invalidation, expiry, cancellation, and stale-response rejection are designed with them.</p></section>
      <section><h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: latency, error rate, fallback rate, conversion, stale-state duration, and rollback success.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock><p>Use typed state machines, immutable identifiers, bounded queues, idempotent writes, cancellation propagation, versioned contracts, redacted logs, privacy-aware retention, and stage-level metrics. Test stale callbacks, retries, partial failure, duplicate input, slow consumers, access-control changes, rollback, and degraded dependencies.</p></section>
      <h3>Principal defense: consistency, cost, and rollback</h3><p>State the consistency boundary explicitly. User intent, request generation, model or retrieval bundle version, and terminal status belong to one attributable execution. Streaming tokens and previews are derived projections; durable history, approved revisions, feedback events, and citation access checks are authoritative records. Reject late generations after cancellation or supersession even when transport continues to deliver bytes.</p><p>Defend cost as a product constraint, not an infrastructure footnote. Bound context, retrieval fan-out, concurrent generations, retry budgets, preview depth, and retained history. Record bundle id, latency by stage, token or candidate volume, refusal reason, and fallback outcome. Roll back by immutable revision or alias swap so a bad prompt, model, parser, or retrieval policy can be isolated without rewriting evidence.</p><section><h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: stale state, hidden partial failure, unbounded retries, ownership ambiguity, and missing observability.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock><p>Avoid treating derived UI as authoritative, accepting stale asynchronous completion, hiding unsupported states, leaking sensitive payloads into telemetry, retrying non-idempotent work blindly, and adding expensive AI calls without latency and cost budgets.</p></section>
      <section><h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock><p>This design applies to enterprise knowledge search, policy lookup, support-agent assistance, and citation-backed documentation Q&A.</p></section>
      <section><h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock><h3>What state is authoritative, and what may remain optimistic?</h3><p>The retrieval service is authoritative for authorized source candidates; the generated answer is a derived projection that must remain grounded in cited chunks.</p><h3>What fails first under scale, abuse, or degraded dependencies?</h3><p>Pressure-test permission-filtered ANN recall, stale indexes, citation drift, multi-turn query ambiguity, retrieval fan-out, reranker latency, and unsupported-answer refusal. Bound queues, reject stale transitions, preserve provenance, and make degraded behavior explicit rather than silently returning misleading UI.</p><h3>How do you recover or roll back without corrupting user-visible state?</h3><p>version indexes, retain source provenance, reject stale generations, fall back to ranked documents, and expose an explicit insufficient-evidence state</p><h3>How do you make the design observable in production?</h3><p>Emit redacted correlation ids, stage latency, terminal status, retry count, rejection reason, version identifiers, queue depth, and recovery outcome. Alert on ratios and tail latency, not only aggregate success counts.</p><h3>How do you defend the architecture against a simpler alternative?</h3><p>Start with the simplest state machine that preserves authority boundaries. Add asynchronous stages, caching, workers, or secondary indexes only when measured latency, scale, or isolation requirements justify their operational cost.</p></section>
      <section><h2>References</h2><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Streams_API" target="_blank" rel="noreferrer">MDN Streams API</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://owasp.org/www-project-cheat-sheets/" target="_blank" rel="noreferrer">OWASP Cheat Sheet Series</a></li><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA Authoring Practices</a></li></ul></section>
    </ArticleLayout>
  );
}
