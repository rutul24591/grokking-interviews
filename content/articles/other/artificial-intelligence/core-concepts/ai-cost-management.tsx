"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-ai-cost-management",
  title: "AI Cost Management — Token Economics and Budget Optimization",
  description:
    "Comprehensive guide to AI cost management covering token economics, response caching, model selection for cost optimization, budget guardrails, usage quotas, and production cost control strategies.",
  category: "other",
  subcategory: "artificial-intelligence",
  slug: "ai-cost-management",
  wordCount: 5300,
  readingTime: 21,
  lastUpdated: "2026-04-11",
  tags: ["ai", "cost-management", "token-economics", "optimization", "budget"],
  relatedTopics: ["ai-observability-monitoring", "fine-tuning-vs-rag", "tokens"],
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
          <strong>AI cost management</strong> is the practice of monitoring,
          optimizing, and controlling the costs associated with AI system
          operations. Unlike traditional software where compute costs are
          relatively predictable (server hours, bandwidth, storage), AI costs
          are driven by token consumption — the number of tokens in each input
          and output — which varies widely based on prompt design, model
          selection, response length, and usage patterns.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The token-based pricing model of LLM APIs creates unique cost
          dynamics. A single request can cost $0.001 (simple classification
          with a small model) or $0.50 (complex analysis with a large model and
          long context), a 500x range within the same system. Without active
          cost management, AI costs can spiral unexpectedly — a prompt
          regression that doubles context length doubles costs, a model update
          that changes tokenization can increase token counts by 20-30%, and a
          popular feature can generate thousands of expensive requests per hour.
        </HighlightBlock>
        <p>
          For staff-level engineers, cost management is not an optimization — it
          is a first-class architectural requirement. The difference between a
          well-managed and poorly-managed AI cost structure can be the difference
          between a profitable feature and one that costs more to operate than
          the revenue it generates. Cost management requires understanding token
          economics, implementing budget guardrails, optimizing model selection,
          and building caching and compression strategies.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: show you understand the primitives and which ones matter at scale (latency, correctness, UX, cost).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Token economics</strong> is the foundation of AI cost
          management. LLM providers price their APIs per million tokens, with
          different rates for input and output tokens (output tokens are
          typically 3-5x more expensive than input tokens). The total cost per
          request is calculated as: (input_tokens / 1M × input_price) +
          (output_tokens / 1M × output_price). Understanding this formula is
          essential because every optimization targets one of these variables:
          reducing input tokens (prompt compression, context optimization),
          reducing output tokens (response length limits, structured output),
          or reducing the price per token (model selection, volume discounts).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Model routing</strong> is the most impactful cost optimization
          strategy. Instead of using the most capable (and expensive) model for
          every request, route requests to the smallest model that can handle
          the task. Simple classification tasks can use small models (7B
          parameters, $0.0001 per request), complex reasoning tasks use medium
          models (70B parameters, $0.005 per request), and only the most
          challenging tasks use frontier models (GPT-4, Claude Opus, $0.05+ per
          request). This tiered approach can reduce costs by 60-80% compared to
          using the most capable model for everything.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/other/artificial-intelligence/token-cost-optimization-strategies.svg"
          alt="Token Cost Optimization Strategies"
          caption="Cost optimization — prompt compression, model routing, response caching, output length limits, and batch processing"
        />

        <p>
          <strong>Response caching</strong> eliminates redundant LLM calls by
          storing and reusing responses for identical or semantically similar
          requests. Exact caching (matching identical prompts) can eliminate
          10-20% of API calls in many applications. Semantic caching (matching
          similar prompts using embedding similarity) can eliminate an
          additional 10-15%. The trade-off is that cached responses may become
          stale when the underlying knowledge changes, so cache TTL (time-to-live)
          must be managed carefully.
        </p>
        <p>
          <strong>Prompt compression</strong> reduces the token count of prompts
          without losing semantic content. Techniques include removing redundant
          whitespace, using concise instruction formats, replacing verbose
          examples with compact ones, and summarizing retrieved context before
          inclusion. Advanced approaches use a small, cheap model to compress
          the prompt before sending it to the capable (expensive) model,
          achieving 30-50% token reduction with minimal quality loss.
        </p>
        <p>
          <strong>Budget guardrails</strong> are automated controls that prevent
          cost overruns. These include per-request token budgets (maximum tokens
          per request), per-user rate limits (maximum requests or tokens per
          user per time period), monthly cost caps (hard limits that stop
          processing when reached), and anomaly detection (alerts when cost
          patterns deviate from baseline). Budget guardrails should be
          implemented from day one — cost overruns are easier to prevent than to
          recover from.
        </p>

        <ArticleImage
          src="/diagrams/other/artificial-intelligence/cost-optimization-pipeline.svg"
          alt="Cost Optimization Pipeline"
          caption="Cost optimization pipeline — cache check → model routing → prompt optimization → LLM call → cache response → cost tracking, achieving 60-75% total cost reduction"
        />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: describe the end-to-end flow, where state lives, and where you add backpressure, caching, and observability.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          A production cost management architecture consists of several layers.
          The <strong>cost tracking layer</strong> instruments every LLM call
          to log input tokens, output tokens, model used, and calculated cost.
          The <strong>optimization layer</strong> implements cost reduction
          strategies: model routing, caching, prompt compression, and output
          length limits. The <strong>budget layer</strong> enforces cost
          constraints: per-request budgets, per-user limits, and system-wide
          caps. The <strong>monitoring layer</strong> tracks cost metrics in
          real-time and alerts on anomalies.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/other/artificial-intelligence/cost-management-architecture.svg"
          alt="Cost Management Architecture"
          caption="Cost management — tracking, optimization, budget enforcement, and monitoring working together to control AI costs"
        />

        <HighlightBlock as="p" tier="important">
          The <strong>model routing layer</strong> classifies each request by
          complexity and routes it to the appropriate model tier. The
          classification can be rule-based (keyword matching, input length
          thresholds) or ML-based (a small classifier trained on historical
          request complexity labels). The router maintains a mapping of task
          types to model tiers and can dynamically adjust routing based on
          quality feedback (if a small model consistently produces low-quality
          outputs for a task type, escalate to a larger model).
        </HighlightBlock>
        <p>
          <strong>Cache management</strong> involves deciding what to cache,
          how long to cache it, and when to invalidate cached responses. Exact
          caches (matching identical prompts) are simple and safe — if the
          prompt is identical, the response is guaranteed to be identical (at
          temperature 0). Semantic caches (matching similar prompts) are more
          aggressive but risk returning inappropriate responses for prompts
          that are similar but have meaningfully different intent. The cache
          hit rate and quality should be monitored to ensure the cache is
          improving cost without degrading quality.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <HighlightBlock as="p" tier="crucial">
          Decision rule: choose the approach that makes failure modes explicit and keeps the common path fast, while keeping correctness boundaries clear.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Cost versus quality</strong> is the fundamental trade-off in
          AI cost management. Smaller models, shorter prompts, and aggressive
          caching reduce costs but may degrade output quality. The optimization
          target is not minimum cost but optimal cost-quality ratio — the
          minimum cost that achieves the required quality level. This requires
          measuring quality alongside cost and understanding the relationship
          between them for each task type.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Caching aggressiveness</strong> involves a cost-versus-freshness
          trade-off. Longer cache TTLs reduce costs (more cache hits) but risk
          stale responses. Shorter TTLs ensure freshness but reduce cache
          effectiveness. The optimal TTL depends on how frequently the
          underlying knowledge changes and how sensitive the application is to
          outdated information.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/other/artificial-intelligence/model-routing-cost-optimization.svg"
          alt="Model Routing for Cost Optimization"
          caption="Model routing — classify request complexity, route to appropriate model tier, escalate when quality is insufficient"
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: list the 3–5 non-negotiables you would enforce with tests, budgets, and monitoring.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Implement per-request cost tracking from day one</strong> —
          every LLM call should log input tokens, output tokens, model, and
          calculated cost. Aggregate these metrics by feature, user, and time
          period. Without per-request cost tracking, you cannot identify
          optimization opportunities or detect cost anomalies.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Set budget guardrails before deployment</strong> — implement
          per-request token budgets, per-user rate limits, and system-wide
          monthly cost caps. Configure alerts for cost anomalies (sudden spikes,
          unexpected trends). Budget guardrails are cheaper to implement before
          deployment than to retrofit after a cost overrun.
        </HighlightBlock>
        <p>
          <strong>Optimize prompt token count aggressively</strong> — review
          every prompt for unnecessary tokens: redundant whitespace, verbose
          instructions, excessive examples, and retrieved context that is not
          directly relevant to the query. Each unnecessary token costs money on
          every request, and at scale, these costs compound significantly.
        </p>
        <p>
          <strong>Use model routing for all multi-tier workloads</strong> — if
          your application handles diverse task types (simple classification,
          moderate analysis, complex reasoning), implement model routing to
          match each task to the smallest capable model. The cost savings
          (60-80% reduction compared to using the most capable model for
          everything) typically justify the routing infrastructure investment
          within the first month of operation.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: call out the top failure modes teams hit in production and how you prevent/mitigate them.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The most common pitfall is <strong>not tracking costs until it is too
          late</strong>. Teams deploy AI features without cost monitoring,
          discover unexpectedly high bills weeks later, and then scramble to
          implement cost controls. Implement cost tracking before deployment,
          set budget alerts, and review cost metrics regularly as part of your
          operational routine.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Over-caching dynamic content</strong> — caching responses
          for prompts that include time-sensitive or user-specific information
          can return incorrect or inappropriate responses. Always include
          dynamic context (user ID, timestamp, current state) in the cache key,
          or use a short TTL for time-sensitive content.
        </HighlightBlock>
        <p>
          <strong>Optimizing for cost at the expense of quality</strong> —
          aggressive prompt compression, overly aggressive caching, or routing
          too many requests to small models can degrade output quality to the
          point where the feature is no longer useful. Always measure quality
          alongside cost and ensure that cost optimizations do not push quality
          below the minimum acceptable threshold.
        </p>
        <p>
          <strong>Ignoring output token costs</strong> — many teams focus on
          reducing input tokens (prompt optimization) while ignoring output
          tokens, which are typically 3-5x more expensive per token. Setting
          max_output_tokens limits, using structured output formats that
          constrain response length, and prompting for concise responses can
          reduce output token costs significantly.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: connect the design to measurable outcomes (CWV, conversion, error rates) and operational practices.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Customer support cost optimization</strong> — implementing
          model routing (simple queries to small models, complex queries to
          large models), caching (frequently asked questions served from cache),
          and output length limits (concise responses instead of verbose
          explanations). These optimizations typically reduce per-ticket cost
          by 60-70% while maintaining or improving resolution quality.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Code assistant cost management</strong> — using exact caching
          for repeated code suggestions (the same function signature produces
          the same suggestion), prompt compression for large codebase context,
          and model routing (syntax suggestions from small models, architectural
          analysis from large models). These strategies keep the code assistant
          cost-effective even at high developer usage volumes.
        </HighlightBlock>
        <p>
          <strong>Content generation pipeline optimization</strong> — marketing
          and documentation teams generating thousands of product descriptions,
          blog posts, and help articles use semantic caching to avoid regenerating
          similar content, batch processing to group independent generation
          requests into single API calls (reducing per-request overhead), and
          model routing (simple rewrites from small models, creative generation
          from frontier models). A content platform processing 50,000 articles
          per month reduced its LLM spend from $12,500/month to $3,200/month
          (74% reduction) through this three-layer approach, while maintaining
          content quality scores above 4.2/5 in human evaluation.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: answer with constraints, decisions, trade-offs, and how you’d validate/operate the system.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q1: How do you implement model routing for cost optimization?
          </h3>
          <HighlightBlock as="p" tier="important">
            Model routing classifies each request by complexity and routes it
            to the smallest model capable of handling it. The classification
            can be rule-based (input length, keyword matching, task type) or
            ML-based (a small classifier trained on historical complexity
            labels). The routing map defines which model tier handles which
            task type: small models (7B) for classification and extraction,
            medium models (70B) for analysis and summarization, and frontier
            models (GPT-4, Claude Opus) for complex reasoning and creative
            tasks.
          </HighlightBlock>
          <HighlightBlock as="p" tier="important">
            The router should include an escalation mechanism: if a small model
            produces low-quality output (detected through output validation or
            user feedback), the request is escalated to a larger model. Over
            time, the router learns which task types require which model tiers
            and adjusts its routing map accordingly.
          </HighlightBlock>
          <p>
            The cost savings from model routing are substantial: a typical
            application routes 60% of requests to small models ($0.0001 each),
            30% to medium models ($0.005 each), and 10% to frontier models
            ($0.05 each), achieving an average cost per request of $0.002 —
            compared to $0.05 if all requests used the frontier model.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q2: How do you balance cost optimization with output quality?
          </h3>
          <p>
            The balance requires measuring both cost and quality simultaneously
            and understanding the relationship between them. For each
            optimization strategy (prompt compression, model routing, caching),
            measure the quality impact: does compressing the prompt by 40%
            reduce answer accuracy? Does routing classification tasks to a
            small model maintain the same accuracy as a large model? Does
            caching frequently-asked-question responses produce the same
            quality as fresh generation?
          </p>
          <p>
            The optimization process is iterative: implement one optimization,
            measure quality impact, if quality is acceptable keep it, if quality
            degrades tune the optimization (less aggressive compression,
            different routing thresholds, shorter cache TTL) and re-measure.
            The goal is to find the minimum cost that achieves the required
            quality level, not the absolute minimum cost regardless of quality.
          </p>
          <p>
            Additionally, implement quality guardrails alongside cost guardrails:
            if quality drops below the minimum threshold, automatically disable
            the most aggressive cost optimizations and escalate to more capable
            models. This ensures that cost optimization never pushes quality
            below acceptable levels.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q3: What budget guardrails should you implement for production AI
            systems?
          </h3>
          <p>
            Budget guardrails operate at multiple levels. Per-request: maximum
            token budget (input + output tokens must not exceed a limit),
            maximum cost per request (calculated from token counts and model
            pricing). Per-user: maximum requests per hour, maximum tokens per
            day, maximum cost per month. Per-feature: maximum daily cost,
            maximum cost per user interaction, budget cap that triggers review
            when exceeded. System-wide: monthly budget cap, anomaly detection
            (alert when hourly cost exceeds 3x the rolling average), and
            automatic shutdown when the monthly budget is exhausted.
          </p>
          <p>
            The guardrails should be tiered: soft limits trigger alerts
            (notify the team when 80% of budget is consumed), hard limits
            trigger action (stop processing when 100% of budget is consumed),
            and emergency limits trigger immediate response (alert on-call
            when cost rate exceeds 10x normal). Each tier has a different
            response escalation path.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q4: How effective is response caching for reducing AI costs?
          </h3>
          <p>
            Response caching is one of the most effective cost optimization
            strategies because it eliminates LLM calls entirely for cached
            requests. Exact caching (matching identical prompts at temperature
            0) typically achieves 10-20% cache hit rates in production
            applications, eliminating 10-20% of API calls. Semantic caching
            (matching similar prompts using embedding similarity with a
            configurable threshold) can achieve an additional 10-15% hit rate,
            bringing total cache effectiveness to 20-35%.
          </p>
          <p>
            The effectiveness depends on the application: FAQ-style
            applications (customer support, documentation Q&amp;A) have high
            cache hit rates because many users ask the same questions. Creative
            applications (content generation, brainstorming) have low cache
            hit rates because each request is unique. Code assistants have
            moderate cache hit rates because the same function signatures and
            API patterns generate repeated requests.
          </p>
          <p>
            Cache management involves setting appropriate TTLs (short for
            time-sensitive content, long for stable content), monitoring cache
            hit rates and quality (ensuring cached responses are still
            appropriate), and invalidating caches when the underlying knowledge
            changes (new product features, updated policies, changed code APIs).
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q5: Explain KV cache prefix sharing and agentic token amplification.
            How do you cost-optimize a multi-agent system at scale?
          </h3>
          <p>
            This is a staff-level question testing deep understanding of both
            inference economics and agent system design.
          </p>
          <p className="mt-2">
            <strong>KV cache prefix sharing:</strong> Modern LLM inference
            servers (vLLM with PagedAttention, TGI) cache the key-value
            tensors for each token position in the context. If two requests
            share a common prefix — identical up to position k — the server
            computes the KV values for those k tokens only once and reuses
            them for both requests. This is &quot;prefix caching&quot; or
            &quot;prompt caching.&quot; Anthropic and OpenAI expose this as an
            API feature (cached input tokens are billed at 10-25% of the
            standard rate).
          </p>
          <p className="mt-2">
            The economic impact is large when the prefix is long and reused
            frequently. A system prompt of 10,000 tokens shared by 10,000
            requests per day saves 9M tokens × (standard rate - cache rate).
            At $3/M tokens standard and $0.30/M cached, that is $24.30/day or
            ~$8,900/year from prefix caching alone, for a single prompt.
            Design implication: keep the system prompt identical across all
            requests in a session or product (no per-request customization that
            would break prefix matching).
          </p>
          <p className="mt-2">
            <strong>Agentic token amplification:</strong> A single user message
            in a multi-agent system is amplified into many LLM calls, each with
            its own full context window. The amplification factor is roughly:
            (number of agent steps) × (average context window per step). A
            5-step orchestration where each step sees 8K tokens of history
            costs 40K tokens, not 8K. For a complex 20-step agentic task with
            15K token contexts, the true cost is 300K tokens — 30× the naive
            estimate.
          </p>
          <p className="mt-2">
            <strong>Optimization strategy for multi-agent systems:</strong>
          </p>
          <p>
            (1) <strong>Hierarchical summarization</strong>: the supervisor
            agent summarizes completed sub-task results before passing them to
            the next agent. Never pass the full conversation history — pass a
            3-5 sentence summary of relevant outputs. This caps context growth
            at O(summary_size × steps) instead of O(full_history × steps).
          </p>
          <p>
            (2) <strong>Model tiering</strong>: use expensive models only for
            planning (supervisor), judgment (critic), and high-stakes decisions.
            Use cheap models (Haiku, GPT-4o mini) for data formatting,
            classification, extraction, and search query generation. In a
            5-agent system, 4 cheap-model calls + 1 expensive call costs ~3×
            less than 5 expensive calls with comparable quality.
          </p>
          <p>
            (3) <strong>Prefix caching for agent prompts</strong>: structure
            agent system prompts so the constant portion (role description,
            tool definitions, output format) comes first, and the variable
            portion (current task, history summary) comes at the end. The
            constant prefix is cached; only the variable suffix incurs full
            input token cost.
          </p>
          <p>
            (4) <strong>Hard token budgets per orchestration</strong>: expose
            the remaining token budget to the supervisor as a context variable.
            The supervisor must complete the task within budget, selecting
            cheaper strategies (fewer agents, less exhaustive search) when the
            budget is tight. This prevents runaway orchestrations from
            consuming 10× the expected tokens on unexpectedly complex tasks.
          </p>
          <p>
            (5) <strong>Batch independent subtasks</strong>: when an agent
            needs to process N independent items (e.g., summarize 10 documents),
            batch them into a single LLM call rather than making 10 separate
            calls. This reduces per-call overhead (API round-trip, cold start)
            and preserves prefix caching across items.
          </p>
          <p className="mt-2">
            At scale (10K orchestrations/day, average 20 steps, 15K tokens/step):
            unoptimized cost = 3B tokens/day × $3/M = $9,000/day. With model
            tiering (80% cheap model at $0.15/M): $1,440/day. Add prefix caching
            (50% hit rate on system prompts): $1,080/day. Add summarization
            (reduce average context by 40%): $648/day. Total: 93% cost reduction
            from $9,000 to $648/day.
          </p>
        </div>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: answer with constraints, decisions, trade-offs, and how you'd validate/operate the system.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q4: How effective is response caching for reducing AI costs?
          </h3>
          <p>
            Response caching is one of the most effective cost optimization
            strategies because it eliminates LLM calls entirely for cached
            requests. Exact caching (matching identical prompts at temperature
            0) typically achieves 10-20% cache hit rates in production
            applications, eliminating 10-20% of API calls. Semantic caching
            (matching similar prompts using embedding similarity with a
            configurable threshold) can achieve an additional 10-15% hit rate,
            bringing total cache effectiveness to 20-35%.
          </p>
          <p>
            The effectiveness depends on the application: FAQ-style
            applications (customer support, documentation Q&amp;A) have high
            cache hit rates because many users ask the same questions. Creative
            applications (content generation, brainstorming) have low cache
            hit rates because each request is unique. Code assistants have
            moderate cache hit rates because the same function signatures and
            API patterns generate repeated requests.
          </p>
          <p>
            Cache management involves setting appropriate TTLs (short for
            time-sensitive content, long for stable content), monitoring cache
            hit rates and quality (ensuring cached responses are still
            appropriate), and invalidating caches when the underlying knowledge
            changes (new product features, updated policies, changed code APIs).
          </p>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2 text-sm text-muted">
          <li>
            OpenAI.{" "}
            <a
              href="https://openai.com/api/pricing/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenAI API Pricing — Current Token Pricing
            </a>
          </li>
          <li>
            Anthropic.{" "}
            <a
              href="https://www.anthropic.com/pricing"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Anthropic API Pricing — Claude Model Pricing
            </a>
          </li>
          <li>
            Agrawal, A. et al. (2023).{" "}
            <a
              href="https://arxiv.org/abs/2305.07753"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Semantic Caching for LLM Applications&quot;
            </a>{" "}
            — arXiv:2305.07753
          </li>
          <li>
            Jiang, H. et al. (2023).{" "}
            <a
              href="https://arxiv.org/abs/2310.05067"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;LLM Compression: A Survey&quot;
            </a>{" "}
            — arXiv:2310.05067
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
