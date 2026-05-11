"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-prompt-history-versioning",
  title: "Prompt History & Versioning UI",
  description:
    "Managing prompt iterations, versions, and branching conversations with comparison and rollback capabilities.",
  category: "low-level-design",
  subcategory: "ai-modern-systems",
  slug: "prompt-history-versioning-ui",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: ["lld", "ai", "prompt-engineering", "history", "versioning"],
  relatedTopics: ["time-travel-debugging", "streaming-chat-ui"],
};

export default function PromptHistoryVersioningArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">
          Prompt engineering is an iterative process. A developer building an AI feature writes a system prompt, tests it against 20 sample inputs, finds two failure cases, edits the prompt to fix them, and then discovers the fix broke three other cases. They want to go back to the version from two edits ago — but they've been editing the prompt directly in a text field, overwriting the previous version each time. The history is gone.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          This problem exists at two levels. At the individual conversation level, a user iterating in a chat interface may want to explore alternative branches ("what if I'd rephrased that question differently?") without losing their current thread. At the team/production level, engineers deploying prompts to production need version control with audit history, rollback capability, A/B testing infrastructure, and metrics per version to determine which prompt iteration performs best.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The conversation-level problem is solved by a DAG-based message store that treats each message turn as an immutable node and allows branching (creating an alternate timeline from any historical node). The production-level problem is solved by a prompt version management system analogous to source control — immutable records, semantic versioning, diff views, A/B traffic routing, and champion/challenger evaluation.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          <strong>Explicit assumptions:</strong> Prompts are plain text (possibly with template variables). Versions are immutable — once saved, a version's content never changes. A new version is always created when the prompt changes. Metrics (latency, feedback ratings, output tokens) are attached to each version through evaluation runs and production traffic.
        </HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Version Creation:</strong> Every prompt edit creates a new immutable version with an auto-incremented version number and optional semantic label ("v3 — added JSON format instruction").
          </li>
          <HighlightBlock as="li" tier="crucial">
            <strong>Version History Timeline:</strong> Display all versions in chronological order with author, timestamp, summary of change, and performance metrics.
          </HighlightBlock>
          <li>
            <strong>Diff View:</strong> Side-by-side or inline diff between any two versions, highlighting additions (green), removals (red), and modifications.
          </li>
          <li>
            <strong>Rollback:</strong> Create a new version identical to any historical version (never modify historical versions — always create new).
          </li>
          <li>
            <strong>Conversation Branching:</strong> From any message in a conversation history, create an alternate branch with a different continuation without destroying the original thread.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Template Variables:</strong> Extract and surface template variables (for example customer name and product identifier) from prompt text, allowing inline editing of variable defaults.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>A/B Testing:</strong> Route a percentage of production traffic to a challenger version, track metrics, and promote the winner.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Export:</strong> Export any version's content and evaluation metrics for external analysis or backup.
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Immutability:</strong> Historical versions must never be overwritten. The system must enforce this at the data layer, not just the UI layer.
          </li>
          <li>
            <strong>Audit trail:</strong> Every version includes who created it, when, and from which previous version it was derived.
          </li>
          <li>
            <strong>Diff performance:</strong> Computing a diff between two 10KB prompt texts must complete in under 50ms client-side.
          </li>
          <li>
            <strong>Storage efficiency:</strong> Store full text per version (not deltas) for simplicity, with optional delta compression for very high-frequency iteration scenarios.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Rollback to a version that used a component or model that has since been deprecated — the rollback succeeds but the version may not produce the same results with the current model.</li>
          <li>A/B test with unequal traffic splits (90/10) where the challenger has very low sample size — metrics may not be statistically significant.</li>
          <HighlightBlock as="li" tier="important">Template variables in a versioned prompt that are not provided at runtime — the system should surface missing variables before production deployment.</HighlightBlock>
          <li>Concurrent edits by two team members — last write wins creates a version with the second editor's changes; the first editor's changes are preserved as the previous version but not merged.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="important">For production prompt management: a PromptVersion schema stores each version as an immutable record with full text content, author, timestamp, parent version ID, and evaluation metrics. A version is "current" by having the highest version number in its prompt lineage.</HighlightBlock>
<HighlightBlock as="p" tier="important">Rollback creates a new version identical to the target version (not mutating the historical record). A/B testing is managed by a traffic router that assigns each request a consistent hash to a version bucket.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          For conversation branching: the conversation data model uses a tree structure (each message node has a parentMessageId). The active conversation path is a root-to-leaf path in this tree. Branching creates a new sibling node at the branch point with a new parentMessageId pointing to the chosen historical node. Both branches coexist in the tree; the UI shows the current active path while making other branches navigable.
        </HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/ai-modern-systems/prompt-history-versioning-ui.svg"
          alt="Prompt history and versioning UI with version timeline, diff view showing inline changes, PromptVersion schema, and evaluation metrics per version for A/B testing"
          caption="Prompt history and versioning UI with version timeline, diff view showing inline changes, PromptVersion schema, and evaluation metrics per version for A/B testing"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">PromptVersion Schema</h3>
        <HighlightBlock as="p" tier="crucial">
          Each version is a record: id (UUID), promptId (the logical prompt this version belongs to), versionNumber (auto-incrementing integer), content (full prompt text string), variables (extracted template variable names and their default values), authorId (user who created the version), parentVersionId (the version this was derived from — null for v1), label (optional human-readable name: "Added structured output instruction"), createdAt (timestamp), and metrics (aggregated evaluation data: avgOutputTokens, avgLatencyMs, thumbsUpRate, thumbsDownRate, sampleCount from production or eval runs).
        </HighlightBlock>
        <p>
          The parentVersionId forms an audit trail DAG (usually a linear chain for simple iteration, branching when a user creates a version from a non-latest ancestor — effectively a fork). This graph enables answering: "which version did version 7 come from?" and "what were all the changes made between v2 and v7?"
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Immutability Enforcement</h3>
        <p>
          Immutability is enforced at the data layer. The versions table has no UPDATE path in the API — only INSERT. The UI editor creates a draft version (stored in ephemeral local state) and on save, calls the create-version API endpoint, which inserts a new record. The "edit" action in the UI is actually "create a new version pre-populated with the current version's content." This is analogous to how git commits work — you never edit a commit in place; you create a new commit on top.
        </p>
        <p>
          Soft-deletion: versions can be "archived" (hidden from the default UI) but never permanently deleted, preserving the audit trail. Archived versions are retrievable by explicit filter in the API and shown with a visual indicator in the history UI.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Diff View Implementation</h3>
        <p>
          The diff view computes a character-level or word-level diff between two version's content strings. Word-level diffs are more readable for natural language prompts (character-level diffs are overly granular for prose). Libraries like diff-match-patch (Google, open source) or jsdiff provide the diff computation. The result is an array of diff operations (equal, insert, delete) rendered as inline or side-by-side HTML.
        </p>
        <p>
          Semantic diff annotation: for structured prompts with identifiable sections (instruction block, few-shot examples block, output format block), the diff can be annotated at the section level — "the few-shot examples section changed" is more informative than raw text diff. This requires a prompt section parser, which is practical for prompts with consistent section delimiters (markdown headers, comment annotations).
        </p>
        <p>
          The diff UI shows: total tokens changed (as a heuristic for change magnitude), added words highlighted green, removed words highlighted red/strikethrough, unchanged sections collapsible (to focus on changed regions in long prompts). A "change summary" generated by a lightweight LLM call ("summarize what changed between these two versions in one sentence") is a high-value UX feature for understanding the intent of an edit without reading the full diff.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Conversation Branching</h3>
        <p>
          The conversation tree is a directed graph where each message node has: id, conversationId, role (user or assistant), content, parentMessageId, createdAt, and metadata (model, temperature, input tokens, output tokens). The active conversation path is the set of nodes on the path from the root to the currently active leaf. Each branch is a different root-to-leaf path.
        </p>
        <p>
          Branching UI: on each user message bubble, a "Branch from here" button creates a new empty sibling (a new user message with the same parentMessageId as the clicked message). The user can now type a different message to continue the conversation from that historical point. The original branch is preserved as a separate navigable path. A branch selector (tab bar or dropdown) shows all branches from the current conversation, labeled by their first diverging message or a user-assigned name.
        </p>
        <p>
          Branch visualization: a tree view (similar to git's --graph output) shows the full conversation topology with branch points indicated by visual forks. Each branch is color-coded. Clicking any node in the tree activates that branch and navigates the conversation view to that path. For conversations with many branches, a sidebar panel with collapsible branch tree is more practical than an inline visualization.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Template Variables</h3>
        <HighlightBlock as="p" tier="important">
          Prompt templates often contain placeholder variables (for example company name, current date, or account tier) that are substituted at runtime. The system should detect and list these variables so they can be reviewed, documented, and tested. For simple placeholder syntaxes, variable extraction can be done with pattern matching; for more advanced templating languages, use a proper parser so you do not mis-detect variables inside quoted strings or comments. In the UI, surface extracted variables as an editable list of key and value pairs, with descriptions and whether each value is provided by config, user context, or request context.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Variable defaults allow the version to be tested directly from the UI without providing runtime values. At deployment, the team defines which variables are filled from static config (company_name), from user context (account_tier), or from runtime request data (current_date). Variable validation at deployment time catches missing or incorrectly named variables before they reach production.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">A/B Testing and Traffic Routing</h3>
        <p>
          A/B testing assigns production traffic between a champion version (currently deployed) and a challenger version (under evaluation). Traffic routing uses a consistent hash of a stable user identifier (userId or sessionId) to assign each user deterministically to a version — so the same user always gets the same version within an experiment, preventing the jarring experience of receiving different prompt behaviors within the same session.
        </p>
        <HighlightBlock as="p" tier="important">
          The routing configuration: champion version ID, challenger version ID, traffic split percentage (e.g., 90% champion, 10% challenger). Each request logs which version was used, enabling per-version metric aggregation. Evaluation metrics: response latency (does the new prompt increase or decrease generation time by changing output length), user satisfaction (feedback ratings), task completion rate (if measurable), and output token count (cost proxy).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Statistical significance: the UI should show a confidence interval on the metric difference between versions and highlight when the sample size is sufficient to draw conclusions (typically 1000+ responses per variant for feedback-based metrics). Premature promotion based on low-sample-size metrics is a common failure mode that should be prevented by the UI enforcing a minimum sample threshold before enabling the "promote challenger" action.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Evaluation Runs</h3>
        <p>
          Beyond A/B testing on live traffic, version evaluation should run against a curated test set: a collection of representative (prompt, expected output) pairs maintained by the team. When a new version is created, an automated evaluation pipeline runs it against the test set and attaches the results (pass/fail per test case, aggregate pass rate) to the version record. A version that degrades the test suite pass rate below a threshold can be blocked from promotion to production.
        </p>
        <p>
          LLM-as-judge evaluation: use a separate powerful LLM to score the quality of the output on each test case (helpfulness, accuracy, adherence to format). This is more expressive than exact-match evaluation for generative prompts and scales to large test suites without requiring manual human labeling for every evaluation.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Tools and Ecosystem</h3>
        <p>
          Dedicated prompt management platforms (PromptLayer, LangSmith, Braintrust, Weights &amp; Biases) provide much of this functionality out of the box, including version storage, diff views, A/B testing, and evaluation frameworks. For teams already using these platforms, building custom versioning infrastructure is rarely justified. For teams with specific compliance, privacy, or integration requirements, a custom system modeled on these platforms' designs is appropriate.
        </p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Full Content Storage vs Delta Storage</h3>
        <HighlightBlock as="p" tier="important">
          Storing the full prompt text per version is simple (direct access, no reconstruction) but wastes space when prompts are long and changes are small. Delta storage (store only the diff between consecutive versions) reduces space by 10–100x for iterative editing but requires reconstruction (apply all deltas from v1 to vN) for random access. For prompts up to 10KB, full content storage is the practical choice — the storage cost is negligible and the access simplicity is valuable. Delta storage is worth considering only for prompts that are very long (50KB+) or have very high version counts (1000+).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Conversation Branching Complexity</h3>
        <HighlightBlock as="p" tier="important">
          Conversation branching is intuitive in concept but the UI is challenging at scale. A conversation with 20 turns and 5 branch points has a tree with potentially dozens of leaves. Displaying this tree compactly without overwhelming users requires good information hierarchy: default to showing only the current active branch, with branch points indicated by a small indicator, expandable to reveal alternative branches on demand. The git log --graph model provides a good reference for how to present a complex branch topology in a constrained display.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Metrics Attribution</h3>
        <HighlightBlock as="p" tier="crucial">
          Attributing production metrics to prompt versions requires every API call to log which version it used. This logging adds a small amount of overhead per request and generates significant data volume at scale. Summary aggregation (pre-aggregate per-version metrics hourly rather than storing per-request logs indefinitely) manages the storage cost while preserving the operational insights that drive version management decisions.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">For staff-level engineers, the key architectural insights are: enforce immutability at the data layer (not just the UI); build evaluation pipeline integration from day one</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">(version without evaluation data is just documentation, not engineering); use consistent hashing for A/B traffic routing to preserve within-session consistency; and integrate with prompt management platforms (PromptLayer, LangSmith) before building custom infrastructure unless there are specific requirements that existing tools don't address.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
