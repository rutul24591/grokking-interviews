"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-ai-prompt-management-ui",
  title: "Design an AI Prompt Management UI",
  description:
    "Architecture for a prompt management system: template library with variable schemas, version history with diff view, LLM-as-judge evaluation suites, A/B deployment with champion/challenger pattern, and cost observability.",
  category: "high-level-design",
  subcategory: "ai-modern-systems",
  slug: "ai-prompt-management-ui",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-10",
  tags: ["hld", "ai", "prompt-engineering", "versioning", "ab-testing", "llm", "evaluation"],
  relatedTopics: ["ai-chatbot-frontend", "copilot-style-ai-assistant"],
};

export default function AiPromptManagementUiArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">A prompt management system is the operational infrastructure for teams that use LLMs in production. Without it, prompts are hardcoded strings buried in application code, modified by developers without review, deployed without testing, and rolled back by reverting commits. The consequences: a prompt change that seemed like an improvement in local testing degrades production quality at scale, there is no way to compare prompt versions empirically, no visibility into which prompts are expensive, and no mechanism for non-engineer stakeholders (content, product, legal) to iterate on prompts without a deployment cycle.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">A prompt management UI solves this by treating prompts as versioned, testable artifacts—analogous to how feature flags treat configuration as a first-class deployable. The key capabilities are: a template system (parameterized prompts with typed variable slots), version history with diff view, an evaluation playground (run the prompt against test inputs and score outputs), A/B deployment (gradually shift traffic to a new prompt version and compare metrics), and observability (latency, cost, and quality metrics per version).</HighlightBlock>
        <p><strong>Explicit assumptions:</strong> The system manages prompts used in server-side LLM calls (not client-side). Each prompt is a system prompt template with optional user prompt templates. Variables are declared with types (string, enum, list) and defaults. Prompt versions are stored in a backend database (not in version control, though they can be exported to version control on demand). The evaluation scorer uses an LLM-as-judge approach (a separate judge LLM scores the prompt's output on defined dimensions). A/B testing uses a deterministic hash of a request attribute (userId or requestId) to assign traffic to champion or challenger versions.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Prompt template library:</strong> Users can create, browse, and organize prompt templates. Templates support typed variable slots (&#123;&#123;company&#125;&#125;, &#123;&#123;tone&#125;&#125;, &#123;&#123;product&#125;&#125;). Templates are organized by category and tag. Access control allows owners, editors, and view-only collaborators per template.</li>
          <li><strong>Version history:</strong> Every saved change creates a new version. The UI shows a timeline of versions with author, timestamp, and change summary. A side-by-side diff view highlights added, removed, and changed lines between any two versions.</li>
          <li><strong>Evaluation playground:</strong> Users can test any prompt version by providing variable values and a user message, then running the prompt against a configured model. The playground shows the model's response, token counts, estimated cost, and latency. A golden test set can be run in batch to score all test cases automatically.</li>
          <li><strong>LLM-as-judge scoring:</strong> Prompt outputs are evaluated on defined dimensions (correctness, relevance, tone, safety, conciseness) using a separate judge LLM. Each dimension is scored 1–5 with an explanation. Aggregate scores are tracked per prompt version.</li>
          <li><strong>A/B deployment:</strong> A new prompt version can be deployed as a challenger alongside the current production (champion) version. Traffic is split by percentage. The dashboard shows side-by-side metrics (score, latency, cost, user feedback rate). Auto-promote promotes the challenger if its score exceeds the champion's by a configured threshold over a minimum sample size.</li>
          <li><strong>Rollback:</strong> Any previous version can be restored to production in one click. Rollback triggers a deployment event and closes any active A/B tests.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Prompt resolution latency:</strong> Fetching the active prompt version and resolving variable bindings must add under 5ms to the LLM call path (served from an in-memory cache, not a database query per request).</li>
          <li><strong>Evaluation throughput:</strong> Running a golden test set of 100 cases against a prompt version must complete within 5 minutes (parallelized LLM calls).</li>
          <li><strong>A/B assignment consistency:</strong> A given user must always receive the same prompt version within an active A/B test (deterministic assignment, not random per request).</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="important">The system has three layers. The management UI (browser): the prompt editor, version timeline, evaluation playground, A/B dashboard, and analytics charts. The prompt service (backend): stores prompt versions, resolves the active version for a given prompt ID and request context, manages A/B assignment, and exposes evaluation APIs. The observability pipeline: collects per-call metrics (latency, token count, cost, user feedback) tagged by prompt ID and version, aggregated into a time-series store for the analytics dashboard.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/ai-modern-systems/ai-prompt-management-ui-architecture.svg"
          alt="Prompt management UI architecture showing three panels: Prompt Library (template browser, variable schema with double-brace syntax, version history v1 to v3, deployment tags draft/staging/production, access control owner/editor/viewer, usage analytics calls/day, prompt lifecycle states), Prompt Editor and Playground (system prompt editor with variable highlights and token count, variable bindings test values, user prompt test input, Run button, Compare Versions button, model config temperature/max-tokens/stop-seq), and Testing and Deployment (evaluation suite with golden test set and LLM-as-judge scoring correctness/relevance/tone, regression guard blocks promotion if score drops 5%, A/B deployment champion/challenger with traffic split, rollback, observability latency P95 error rate cache hit)."
          caption="Prompt management architecture: template library with variable schemas → versioned editor → evaluation suite (golden tests + LLM-as-judge) → A/B deployment (champion/challenger) → observability"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Template System and Variable Schema</h3>
        <HighlightBlock as="p" tier="important">A prompt template is a string with named variable slots: &#123;&#123;company&#125;&#125;, &#123;&#123;tone&#125;&#125;, &#123;&#123;context&#125;&#125;. Each variable is declared in a schema attached to the template: name (string), type (string / enum / list / number), description (for UI display and LLM documentation), default value (optional), and required (boolean). The schema serves three purposes: input validation (the playground and production call path validate that all required variables are provided before rendering the prompt), documentation (the schema is displayed in the template browser so other users know how to use the template), and token estimation (variable defaults are used for token count estimation in the editor's cost display).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Prompt rendering: at call time (in the LLM proxy), the prompt template is fetched from the in-memory cache, variables are substituted, and the rendered prompt string is sent to the model. The rendering is pure string substitution—no server-side template engine is invoked. If a required variable is missing, the proxy returns a 400 error before making the LLM call, preventing unrendered &#123;&#123;variable&#125;&#125; literals from reaching the model.</HighlightBlock>
        <p>Prompt composition: large prompts can be composed from smaller sub-templates using an include directive (&#123;&#123;include: safety-rules-v2&#125;&#125;). The prompt service resolves includes at rendering time, assembling the full prompt from its parts. This allows common sections (safety guidelines, tone instructions, citation formatting rules) to be maintained once and referenced across many templates. Include targets are pinned to a specific version of the included sub-template to prevent unexpected changes to the including template when the included one is updated.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Version History and Diff View</h3>
        <p>Every save operation (manual save or auto-save after a 30-second idle period) creates a new version record: versionId, promptId, authorId, createdAt, changeDescription (user-provided or auto-generated from diff), and the full prompt content. Versions are immutable: once created, a version's content cannot be modified. Version labels (draft, staging, production) are metadata attached to versions, not properties of the content itself—the same content exists in one place; labels are pointers to it.</p>
        <HighlightBlock as="p" tier="important">The diff view uses a line-level diff algorithm (Myers diff) between any two selected versions. Additions are shown in green, deletions in red, and unchanged lines in gray. For variable slots, the diff treats &#123;&#123;variable_name&#125;&#125; as an atomic unit (not as individual characters), so a renamed variable shows as a deletion + addition rather than a character-level edit. Token count deltas are shown per-diff: "v3 adds 47 tokens vs v2 (est. +$0.0008/call at 1K calls/day)." This makes the cost impact of prompt changes visible at the point of decision.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Evaluation Playground and Golden Test Sets</h3>
        <p>The playground allows interactive testing: the user enters variable values and a user message, clicks Run, and sees the model's response streamed in real time alongside token counts and latency. The playground also shows the rendered system prompt (with variable substitutions applied) so the user can verify that the substitution worked correctly before running. Multiple runs with different variable values can be saved as test cases and added to the template's golden test set.</p>
        <p>Golden test sets are collections of &#123;variables, userMessage, expectedOutput&#125; tuples associated with a template. Running the golden test set against a prompt version executes all test cases in parallel (rate-limited to the LLM provider's concurrency limit) and collects outputs. Each output is then scored by the LLM-as-judge on the configured evaluation dimensions. The judge LLM receives: the original user message, the prompt version's output, the expected output (if provided), and a scoring rubric for each dimension. It returns a score (1–5) and justification for each dimension. Aggregate scores are compared to the baseline (the previous production version's scores on the same test set) to determine whether the new version represents an improvement or regression.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">A/B Deployment and Champion/Challenger Pattern</h3>
        <p>When a prompt version passes the golden test evaluation and is promoted to an A/B test, the prompt service begins routing a configured percentage of calls (typically 10%) to the challenger version while the remaining 90% continue to use the champion. Assignment is deterministic: for a given promptId and requestIdentifier (userId or sessionId), the prompt service computes a hash (MurmurHash of promptId + requestIdentifier + experimentSeed) modulo 100, and routes to the challenger if the result is below the traffic percentage. This ensures a given user always sees the same prompt version throughout the experiment.</p>
        <HighlightBlock as="p" tier="important">All calls are tagged with their prompt version in the telemetry pipeline. The A/B dashboard shows the champion and challenger side-by-side with metrics updated in near-real time (5-minute aggregation windows): LLM-as-judge average score, latency P50/P95, token cost per call, user feedback rate (thumbs up / thumbs down), and error rate. Statistical significance is computed using a Welch t-test on the score samples; the dashboard shows whether the observed difference is statistically significant at p &lt; 0.05. Auto-promotion triggers when: minimum sample size (configurable, default 500 calls on the challenger) is reached, the challenger's score is significantly higher, and no regressions in latency or error rate exceed the configured thresholds. Manual override is always available.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">In-Path Prompt Resolution</h3>
        <HighlightBlock as="p" tier="important">Production LLM calls must not be slowed by prompt management overhead. The prompt service maintains an in-memory cache of the active prompt version for each promptId. Cache entries include the rendered template string (pre-compiled, with variable slots extracted as a list for fast substitution), the A/B experiment configuration (traffic percentage, challenger versionId, experiment seed), and the model configuration (temperature, max tokens, stop sequences). Cache TTL is 30 seconds; invalidation is event-driven (a deployment event pushes a cache-bust signal to all prompt service instances).</HighlightBlock>
        <HighlightBlock as="p" tier="important">At call time: the LLM proxy receives a promptId and a variable map. It looks up the cache entry (under 1ms), determines the version via A/B hash (under 1ms), renders the prompt (string substitution, under 1ms), and appends the rendered system prompt to the LLM request. Total prompt resolution overhead: under 5ms. Errors in variable resolution (missing required variables) are returned as 400s before any LLM call is made, preventing unrendered prompts from reaching the model and consuming tokens.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cost Observability</h3>
        <HighlightBlock as="p" tier="important">Every LLM call tagged with a promptId reports its token counts (input tokens, output tokens, cached tokens) to the observability pipeline. The pipeline computes cost per call using the model's pricing table (updated when model pricing changes) and aggregates cost by promptId, version, model, and time period. The analytics dashboard shows: cost per call (average, P95), total daily cost per prompt, cost breakdown between input and output tokens, and cache hit rate (if the model supports prompt caching, such as Anthropic's prompt caching for repeated system prompts). A cost estimator in the editor shows the projected monthly cost of a prompt version at a given call volume, updated as the user edits the prompt (reflecting token count changes in real time).</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/ai-modern-systems/ai-prompt-management-ui-versioning.svg"
          alt="Prompt versioning showing timeline with v1 deprecated, v2 deprecated, v3 production champion (green circle), v4 staging challenger (purple circle), v5 draft (dashed circle), and diff view showing deleted line (red) vs added line (green) for v3 vs v4. A/B test dashboard with champion v3 90% traffic showing score 4.12, P95 1240ms, cost $0.0022, thumbs-up 82%; challenger v4 10% traffic showing score 4.31 up arrow, latency 1180ms down arrow, cost $0.0031 up arrow (concern), thumbs-up 86% up arrow; Promote to Prod and Rollback buttons. Right panel with 5 evaluation dimensions (correctness, relevance, tone adherence, safety/refusal, conciseness) and cost estimator formula."
          caption="Version timeline (draft→staging→production A/B), diff view, champion vs challenger metrics dashboard, evaluation dimensions, and cost estimator"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">LLM-as-judge reliability: using an LLM to score another LLM's outputs is convenient but introduces evaluation noise. The judge LLM may score the same output differently across runs (low reliability), may be biased toward outputs stylistically similar to its own generation patterns, and cannot evaluate factual correctness for domain-specific knowledge it does not have. Mitigations: run each test case through the judge 3 times and average the scores (reduces noise), use a different model family for the judge than the model being evaluated (reduces stylistic bias), and supplement LLM-as-judge with deterministic checks (exact-match tests for outputs that have a single correct answer, regex checks for format compliance).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Prompt version explosion: teams that iterate rapidly on prompts can accumulate hundreds of versions quickly. The version history UI becomes unwieldy without a policy for pruning or archiving old versions. A practical approach: retain full version history (for audit and rollback) but show only significant versions in the timeline (a significant version is one that was promoted to staging or production, or was explicitly labeled by a user). Intermediate auto-saves appear only when the user expands the timeline for that time range.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Access control granularity: who can promote a prompt to production? Allowing all editors to promote creates risk (a well-intentioned but untested change can break production). Requiring owner approval for every promotion creates a bottleneck. A practical policy: editors can promote to staging and run A/B tests; only owners (and designated release managers) can confirm auto-promotion or manually promote a challenger to champion. This separates the ability to experiment (open to editors) from the ability to make production decisions (reserved for owners).</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important">A prompt management UI treats prompts as versioned, testable, deployable artifacts. The template system supports typed variable schemas (&#123;&#123;name&#125;&#125; slots with declared types and defaults) and sub-template includes (for shared sections). Every save creates an immutable version; the diff view shows line-level additions/deletions and token count impact between versions. The evaluation playground runs prompts against test inputs and scores outputs using an LLM-as-judge on dimensions (correctness, relevance, tone, safety, conciseness). A/B deployment follows a champion/challenger pattern: 10% traffic to the challenger with deterministic per-user assignment, real-time metrics (score, latency, cost, feedback) on the dashboard, and auto-promotion triggered when significance and sample size thresholds are met. In-path prompt resolution uses an in-memory cache (30s TTL, event-driven invalidation) for under 5ms overhead per LLM call. The observability pipeline reports cost per call by version, enabling data-driven decisions about whether a quality improvement is worth its token cost increase. The defining design principle: prompts should be managed with the same rigor as code—version control, testing, gradual rollout, and rollback capability—because in an LLM-powered product, the prompt is as consequential as the code.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
