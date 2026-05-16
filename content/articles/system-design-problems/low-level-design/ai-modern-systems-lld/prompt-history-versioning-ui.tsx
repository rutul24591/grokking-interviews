"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-prompt-history-versioning-ui",
  title: "Design a Prompt History and Versioning UI",
  description:
    "A staff-level deep dive into prompt versioning systems: schema design, diff algorithms, template variables, branching models, comparison mode, collaboration, tagging, rollback, import/export, and performance at scale.",
  category: "low-level-design",
  subcategory: "ai-modern-systems",
  slug: "prompt-history-versioning-ui",
  wordCount: 4800,
  readingTime: 29,
  lastUpdated: "2026-05-16",
  tags: ["lld", "ai", "prompt-engineering", "history", "versioning"],
  relatedTopics: ["time-travel-debugging", "streaming-chat-ui"],
};

export default function PromptHistoryVersioningArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2>The Prompt as a Versioned Engineering Artifact</h2>
      <p>
        Prompt engineering has evolved from artisanal text wrangling into a structured engineering discipline with its own development lifecycle. A production system prompt that routes customer support queries, generates structured data extractions, or powers a code review assistant is as critical as any piece of application code — and as prone to regressions when edited carelessly. Unlike code, however, prompts are rarely version-controlled with the same rigor as source files. Engineers iterate in a text field, overwriting the previous version each time, and discover two weeks later that the performance they saw last Tuesday was produced by a version of the prompt that no longer exists.
      </p>
      <HighlightBlock as="p" tier="important">
        A prompt history and versioning UI treats each prompt as a versioned document with an immutable history, a branching model for experimental divergence, a diff view for understanding changes between versions, a template variable system for runtime parameterization, and metrics attached to each version from evaluation runs and production traffic. This is git for prompts — but the tooling must be tailored to the unique properties of natural language documents and LLM evaluation metrics, which differ fundamentally from code review and software quality metrics.
      </HighlightBlock>
      <p>
        This article covers the complete design surface: the prompt version schema (including parent linkage, variable registry, and metrics fields), character-level versus semantic diff algorithms, template variable systems from syntax design to type-safe interpolation, the branching model for experimental prompt exploration, comparison mode for side-by-side evaluation, sharing and collaboration with access control, tagging and full-text search, the rollback pattern that preserves history integrity, import/export for ecosystem interoperability, and performance architecture for large version trees with thousands of versions.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/ai-modern-systems/prompt-history-versioning-ui.svg"
        alt="Prompt history and versioning UI showing the version tree with parent-child relationships, side-by-side diff view with character-level highlighting, template variable registry, and evaluation metrics dashboard per version"
        caption="Prompt versioning UI: version tree with parent links, diff view, template variable registry, and per-version evaluation metrics"
      />

      <h2>Prompt Version Schema Design</h2>
      <p>
        The foundational schema for a prompt version system must capture both the content of the prompt and its provenance — where it came from, who created it, and what its relationship is to other versions. Designing this schema incorrectly at the start forces painful migrations later, so it deserves careful thought.
      </p>
      <HighlightBlock as="p" tier="crucial">
        Each version record contains: id (a UUID, globally unique across all prompts and versions), promptId (the stable identifier of the logical prompt that this version belongs to — many versions share a single promptId), versionNumber (an integer auto-incremented per promptId, starting at 1), content (the full prompt text string, stored verbatim without compression for simplicity and direct access), systemPrompt (a separate string for the system prompt if the UI distinguishes system from user prompt, which is relevant for chat-completion APIs), variables (a JSON object mapping variable names to their metadata: type, default value, description, and whether the variable is required or optional), authorId (the user who created this version), parentVersionId (the UUID of the version from which this version was directly derived — null for the first version of a prompt, forming the root of the version DAG), label (an optional human-readable summary of what changed, such as "Added JSON output format instruction"), createdAt (an ISO 8601 timestamp), tags (an array of string tags for categorization and search), and metrics (a nested object aggregating evaluation data attached to this version).
      </HighlightBlock>
      <p>
        The metrics subobject captures: averageOutputTokens, averageLatencyMs, thumbsUpRate, thumbsDownRate, taskCompletionRate (if measurable in the application), evaluationPassRate (from automated test suite runs), and sampleCount (the number of requests on which these aggregates are based). Metrics are mutable — they accumulate as the version is used in production or evaluation — unlike the content and provenance fields which are immutable once written.
      </p>
      <p>
        The parentVersionId field forms an audit trail DAG. For linear iteration (the typical case), the graph is a chain: v1 is the parent of v2, v2 is the parent of v3, and so on. When a user creates a version from a non-latest ancestor — forking from v3 while v7 is current — the resulting version has v3 as its parent, creating a branch. The promptId groups all versions of a logical prompt regardless of which branch they belong to. Querying the full ancestry of any version requires traversing the parentVersionId chain upward to the root, which is O(depth) database queries without optimization, or O(1) with a materialized path or closure table pattern.
      </p>

      <h2>Diff View: Character-Level vs Semantic Diff</h2>
      <p>
        Comparing two prompt versions requires a diff algorithm that produces human-readable output for natural language text. The choice of diff granularity significantly affects readability. Character-level diff (the standard diff algorithm operating on individual characters) is maximally precise but produces visually noisy output for natural language — a rephrasing of one sentence produces dozens of character-level changes that obscure the semantic intent of the edit.
      </p>
      <p>
        Word-level diff strikes a better balance for most prompt editing use cases. The Myers diff algorithm (the standard algorithm behind git diff) and the Patience diff algorithm (used by Bazaar and as an optional git mode) operate on sequences of tokens — in the word-level case, the tokens are words produced by splitting on whitespace and punctuation. Patience diff tends to produce more intuitive outputs for natural language because it first finds unique lines that definitely correspond (anchors), then fills in the differences between anchors, reducing false matches that the Myers algorithm sometimes produces.
      </p>
      <HighlightBlock as="p" tier="important">
        Sentence-level semantic diff is appropriate when comparing long prompts with major structural changes — adding or removing whole sections, reordering few-shot examples, replacing an instruction block. At sentence granularity, the diff unit is a complete sentence (detected by a sentence tokenizer, not a simple period-split which fails on abbreviations). Sentence-level diffs are much more readable when the change is the addition or removal of whole sentences, but they miss intra-sentence edits entirely, which character or word diff catches. The practical approach is to display word-level diff by default, with a toggle to switch to sentence-level diff for high-level structural review. The diff algorithm should be selected client-side — both inputs are short enough (typically under 10KB) that even Myers diff on word tokens completes in under 10 milliseconds in JavaScript.
      </HighlightBlock>
      <p>
        The diff UI rendering must handle three cases: additions (text present in the new version but not the old, rendered with green background highlight), deletions (text present in the old version but not the new, rendered with red background and strikethrough), and unchanged text (rendered normally). For long prompts where most text is unchanged, collapse unchanged runs with a "Show N unchanged words" expander to focus attention on the changed regions. The diff view header shows a summary: plus-N words added, minus-M words removed, as a quick change-magnitude indicator without requiring the reviewer to scan the full diff.
      </p>
      <p>
        An LLM-generated change summary is a high-value UX addition: after computing the diff, call a lightweight model with the diff as context and ask it to summarize the intent of the change in one to two sentences. This summary appears at the top of the diff view — "Removed the multi-step reasoning instruction and replaced it with a direct answer format requirement, likely to reduce verbose outputs." This is more informative than a raw diff for reviewers who want to understand the engineering intent rather than the literal text changes.
      </p>

      <h2>Template Variable System</h2>
      <p>
        Production prompts are rarely static text — they are parameterized templates that substitute runtime values for placeholders. A customer support prompt includes the customer's account tier and recent transaction history. A code review prompt includes the repository language and style guide. A document analysis prompt includes the document's language and target audience. These runtime substitutions must be tracked as first-class entities in the versioning system, not left as implicit conventions in the prompt text.
      </p>
      <HighlightBlock as="p" tier="important">
        Syntax design for template variables is a significant decision. Handlebars-style double curly brace syntax — using double open-curly followed by a variable name and double close-curly — is widely recognized from web templating and is what most developers reach for intuitively. Jinja-style syntax with percent signs inside curly braces is familiar to Python developers. Both are reasonable choices, but the critical requirement is that the syntax be unambiguous: the variable delimiter must not appear in normal prompt prose, and nested delimiters must not be valid (to avoid parsing ambiguity). For prompts that may contain examples of code or JSON, Handlebars-style can conflict with JavaScript template literal syntax or JSON object notation. A safer choice for LLM prompts is double-angle-bracket syntax with square brackets — less likely to appear in prompt examples but equally parseable.
      </HighlightBlock>
      <p>
        The variable registry attached to each version records: name (the variable identifier as it appears in the placeholder), type (string, number, boolean, list, or JSON object), defaultValue (used in the UI's test sandbox and in evaluation runs where the runtime value is not provided), description (documentation for developers consuming this prompt via API), required (whether generation should be blocked if this variable is absent), and source (static config, user context injected by the platform, or request-time parameter provided by the calling application). Variable extraction from prompt content is performed by scanning the content field with the placeholder regex and populating the registry with any placeholders not already registered.
      </p>
      <p>
        Type-safe variable interpolation means the system validates that the runtime value provided for each variable matches the declared type before substituting it into the prompt. A variable declared as type "number" that receives the string "hello" at runtime should fail with a clear validation error rather than silently inserting the string "hello" into the prompt. Missing variable highlighting in the UI editor underlines unregistered placeholders in orange (used but not declared) and highlights declared-but-absent variables in the preview pane. This catches common errors — typos in variable names, variables added to the prompt content but not registered, or variables registered but removed from the content — before the prompt reaches production.
      </p>

      <h2>Branching Model: A Version Tree, Not a Linear History</h2>
      <p>
        The linear version history model (v1, v2, v3...) is sufficient for simple iterative editing but fails for experimental exploration. A prompt engineer wants to try two fundamentally different approaches to the same task — perhaps a chain-of-thought reasoning approach versus a direct concise-answer approach — without losing either thread. In a linear system, they would have to manually copy one version, try the other, and then manually copy back. The branching model treats the version history as a tree (or more precisely a DAG, since rollback creates convergence) where any version can be the parent of multiple child versions.
      </p>
      <HighlightBlock as="p" tier="important">
        Forking is the act of creating a new version with a non-head version as its parent. In the UI, any version in the history list has a "Fork from here" action that pre-populates the editor with that version's content and sets its parentVersionId to the chosen ancestor. The newly created version starts a new branch in the tree. Both the original chain (v1-v2-v3-v4) and the new branch (v1-v2-v3-v3.fork1-v3.fork2) coexist in the tree and share the same promptId. The UI must display which branch is "current" (the most recently updated leaf in the tree, or the branch explicitly promoted to production) while making all branches navigable.
      </HighlightBlock>
      <p>
        Branch visualization in the UI draws from the git log --graph idiom. Each branch is a vertical line with commits as nodes. Branch points are shown as forks in the lines. The current branch is highlighted. Branch labels (user-assigned names or auto-generated descriptors from the first diverging version's label) appear at the branch heads. For prompts with many branches, a simplified representation — collapsing non-divergent runs into compact ranges and expanding only branch points — reduces visual clutter while preserving the topology. Clicking any node in the tree view navigates the detail panel to show that version's content, metadata, and metrics.
      </p>
      <p>
        Merging branches — combining the insights from two experimental branches back into a single version — is not supported natively in most prompt versioning systems, and for good reason. Unlike code merges where a tool can mechanically combine non-overlapping changes, prompt merges require understanding the semantic intent of each change, which is a judgment call for the prompt engineer. The correct design is to make merging a manual action: the engineer reads both branches in the comparison mode, decides which changes to keep, creates a new version incorporating those decisions, and notes in the label which branches were synthesized. The system records the ancestry via parentVersionId pointing to one of the two branch heads; the synthesis of the other branch is a human-level attribution captured in the label field.
      </p>

      <h2>Comparison Mode</h2>
      <p>
        Comparison mode allows evaluating two prompt versions side by side — not just their content diff, but also the outputs they produce for the same inputs. This is the core of evidence-based prompt engineering: instead of arguing about which phrasing is better, run both and compare the outputs empirically.
      </p>
      <HighlightBlock as="p" tier="crucial">
        The comparison view consists of three panels. The left panel shows version A's prompt content with diff highlighting relative to version B. The right panel shows version B's content with the symmetric diff. The bottom panel shows paired outputs: for each test input in the selected evaluation set, version A's output appears on the left and version B's output on the right. Outputs are optionally augmented with automated quality scores (from LLM-as-judge evaluation) displayed as a numerical rating beside each output. The comparison mode should support selecting the test inputs: use a saved evaluation set, paste ad-hoc test inputs, or sample randomly from recent production traffic.
      </HighlightBlock>
      <p>
        Diff highlighting in the output panels is particularly valuable — it makes it immediately obvious when one version produces a more concise answer, or when one version incorrectly includes content that the other does not. Apply the same word-level diff algorithm used for prompt content diff to the output pairs, coloring additions in the version B output (text present in B's output but not A's) in light green and deletions in light red. This output diff often reveals subtle quality differences that are hard to perceive when reading outputs sequentially.
      </p>
      <p>
        Aggregate metrics are displayed at the top of the comparison view: side-by-side table of averageOutputTokens, averageLatencyMs, thumbsUpRate, thumbsDownRate, and evaluationPassRate for both versions, with color coding to highlight which version wins each metric. If sampleCount for either version is below the threshold for statistical significance (typically 100 responses for rate metrics), display a warning that the comparison may not be reliable.
      </p>

      <h2>Sharing, Collaboration, and Access Control</h2>
      <p>
        Prompt versioning in a team context requires sharing individual versions or entire prompt histories with specific access controls. The sharing model has two dimensions: what is shared (a specific version, a branch, or the full prompt including all branches) and who can access it (view-only, edit by creating new versions, or administrative control including archiving and access management).
      </p>
      <p>
        Permalinks to specific versions enable precise communication: a Slack message saying "check out the improvement in v7 over v5" can include a link that navigates directly to the comparison between those two versions with the diff pre-loaded. Version permalinks must be stable — because versions are immutable, a permalink to version v7 of a prompt always refers to the same content regardless of what versions are created afterward. This stability makes permalinks trustworthy for documentation, incident retrospectives, and team knowledge sharing.
      </p>
      <HighlightBlock as="p" tier="important">
        Team prompt libraries are collections of curated, reusable prompt versions that team members can browse and fork as starting points for new prompts. A prompt library entry is a version that has been explicitly marked as a library item, with a searchable description and tags. The library is read-only — library users fork from library entries rather than editing them directly — which preserves the curated quality of library items. Access control for the library distinguishes library viewers (all team members), library contributors (can submit entries for review), and library maintainers (can approve and remove entries). This mirrors the pattern of shared component libraries in frontend development.
      </HighlightBlock>

      <h2>Tagging and Search</h2>
      <p>
        Tagging prompt versions by intent — "customer-facing," "structured-output," "chain-of-thought," "v2-product-line," "pre-launch-review" — creates a taxonomy that makes large version histories navigable. Tags are added at version creation time or retroactively. A tag applied to a version can optionally propagate to all descendant versions (useful for "v2-product-line" lineage tags) or remain version-specific (useful for "pre-launch-review" audit tags).
      </p>
      <p>
        Full-text search across prompt history enables finding specific instructions, examples, or phrasings without knowing which version they belong to. The search index covers: prompt content (the full text of every version), labels, tags, and variable names. The search backend is a standard full-text search engine (Elasticsearch, Typesense, or Postgres full-text search depending on scale). Search results are grouped by prompt and ranked within each group by relevance, with version number and creation date as secondary sort keys. Snippets showing the matched text in context (with the search terms highlighted) are more useful for prompt search than abstract relevance scores.
      </p>
      <HighlightBlock as="p" tier="important">
        Semantic search — embedding-based similarity search rather than keyword matching — is a natural fit for prompts because engineers may search for "a version that asks the model to think step by step" rather than knowing the exact phrase used in the prompt. Embedding the content of each version with a text embedding model and storing embeddings alongside the version record enables vector similarity search. The UI can expose both keyword search (exact phrase matching) and semantic search (similar meaning) as separate modes or as a combined ranked result. Semantic search across a corpus of thousands of prompt versions is feasible with in-memory approximate nearest neighbor search for corpora under 100,000 vectors, or vector database infrastructure (Pinecone, Weaviate, pgvector) for larger corpora.
      </HighlightBlock>

      <h2>Rollback Architecture</h2>
      <p>
        Rollback is the act of making a historical version the current version of a prompt. The critical design constraint is that rollback must never mutate the historical record. A version's content is immutable once written. Rollback is implemented by creating a new version whose content is identical to the target historical version, with the current head version as the parent (preserving the linear audit trail) and a label indicating that this is a rollback action referencing the target version number.
      </p>
      <p>
        This "rollback as new version" pattern is analogous to git's revert command, which creates a new commit that undoes a previous commit rather than deleting the previous commit from history. The history is always complete and monotonically growing. An auditor looking at the history sees: v1 through v7 showing a sequence of changes, then v8 with the label "Rollback to v3 — performance regression in v4 through v7." The content of v8 is identical to v3's content. The history makes clear what happened and when.
      </p>
      <HighlightBlock as="p" tier="important">
        The rollback UI shows a warning when the target version uses a model or configuration that has changed since the version was created. For example, if v3 was created with GPT-4-turbo and the current default is GPT-4o, rolling back the prompt content does not roll back the model selection — the rollback version will run on GPT-4o with v3's prompt. This model mismatch may produce different results than v3 originally produced, even with identical prompt content. The warning should be explicit: "Rolling back prompt content to v3. Note: this prompt was originally tested with GPT-4-turbo. The current deployment model is GPT-4o. Results may differ."
      </HighlightBlock>

      <h2>Import and Export</h2>
      <p>
        Prompt engineers work across multiple tools: they may draft prompts in Anthropic's Workbench, refine them in LangChain Hub, evaluate them in Braintrust, and deploy them through the organization's internal system. Import and export enables interoperability across this ecosystem without manual copy-pasting that loses provenance.
      </p>
      <p>
        The JSON export format for a single version contains all schema fields: id, promptId, versionNumber, content, systemPrompt, variables, authorId, parentVersionId, label, createdAt, tags, and metrics. The full version tree export for a prompt is a JSON array of all versions sorted by versionNumber, with the DAG structure implied by the parentVersionId references. This format is self-describing and can be imported into another system that understands the schema, or into the same system on another team's workspace. The export endpoint generates a signed URL for large exports (version trees with thousands of versions can be several megabytes of JSON) rather than delivering the payload directly in the API response.
      </p>
      <HighlightBlock as="p" tier="important">
        Import from external tools requires format translation. LangChain Hub exports prompts as YAML files with a specific schema. PromptFlow exports as a directed graph of nodes. Braintrust exports evaluation datasets but not prompt content directly. The import UI accepts a file upload or a URL fetch, detects the format by inspecting the file structure, and maps the external format's fields to the internal schema. Unmappable fields are captured in a metadata blob on the imported version. The imported version is created as a new version in the local history with a label indicating the import source, and its parentVersionId is null (it starts a new lineage) or is set to an existing local version if the user specifies a parent for the imported content.
      </HighlightBlock>

      <h2>Performance at Scale: Lazy Loading and Virtual Scroll</h2>
      <p>
        A mature prompt with hundreds of iterations or an organization-wide prompt library with thousands of prompts each with dozens of versions requires pagination and lazy loading to remain performant. The naive approach — loading all versions of all prompts on page load — produces unacceptable initial load times and memory consumption at scale.
      </p>
      <p>
        The version history list uses cursor-based pagination: the initial API request returns the 20 most recent versions with a cursor. Scrolling to the bottom of the list triggers a request for the next page using the cursor. This pattern works correctly for append-only version histories because new versions are always added at the head of the list, never in the middle. The cursor is a version creation timestamp or version number that uniquely identifies the pagination position.
      </p>
      <HighlightBlock as="p" tier="important">
        The version tree visualization for branched histories with many versions requires virtual scrolling. The tree is represented as a flat sorted list of nodes (versions ordered by creation time, with indentation level indicating branch depth). TanStack Virtual renders only the visible portion of the tree with a modest overscan. Node heights are variable because branch labels and metrics summaries expand some nodes. Variable-height virtualization requires measuring each rendered node's height after initial render and caching it in a size map. The virtual list asks for each node's size before rendering (for layout purposes) using the cached size or a reasonable estimated default, then updates the cache with the actual measured size after the node renders.
      </HighlightBlock>
      <p>
        The diff computation for version comparisons is performed client-side using a worker to avoid blocking the main thread during computation. A diff between two 10KB prompts using Myers word-level algorithm completes in under 20 milliseconds in a Web Worker on a modern machine, well within interactive latency budgets. The worker receives the two version content strings as structured clones (postMessage handles this automatically), computes the diff, and returns the diff operations array. Caching computed diffs by the pair of version IDs (since both versions are immutable) avoids redundant computation when the user navigates back to a previously computed comparison.
      </p>
      <p>
        Content search is debounced at 300 milliseconds on the search input to avoid firing a request on every keystroke. The search results list uses the same virtual scrolling pattern as the version tree. For the embedding-based semantic search, the query embedding is computed server-side (to avoid shipping large embedding models to the browser) and the vector similarity search runs against the server's vector index, returning ranked version IDs that the UI then hydrates with cached version metadata.
      </p>

      <h2>Interview Questions and Answers</h2>

      <h3>Q: Design the database schema for a prompt versioning system that supports branching, rollback, and per-version metrics without mutating historical records.</h3>
      <HighlightBlock as="p" tier="important">
        Two primary tables. The prompts table has: id (UUID primary key), name (display name), ownerId, teamId, createdAt, and currentVersionId (a nullable foreign key to the head version, updated on each new version creation). The prompt_versions table has: id (UUID primary key), promptId (foreign key to prompts), versionNumber (integer, auto-incremented per promptId using a sequence or application-level counter), content (text), systemPrompt (text nullable), variables (JSONB), authorId, parentVersionId (UUID nullable, foreign key self-referencing prompt_versions), label (text nullable), createdAt (timestamp with time zone), and tags (text array). A separate prompt_version_metrics table has: versionId (foreign key), metricName (e.g., "thumbsUpRate"), metricValue (numeric), sampleCount (integer), and lastUpdatedAt. Metrics are separated from the version record because they are mutable (accumulate over time) while the version record is immutable (content never changes after creation). Rollback creates a new row in prompt_versions with content copied from the target version and parentVersionId pointing to the current head — never UPDATE-ing the target version's row.
      </HighlightBlock>

      <h3>Q: When would you choose character-level diff versus word-level versus sentence-level for prompt comparison, and how does the diff algorithm choice affect UI rendering complexity?</h3>
      <HighlightBlock as="p" tier="important">
        Character-level diff is appropriate for code snippets embedded in prompts — detecting a single character change in a function signature is meaningful at character granularity. For natural language prose (the majority of prompt content), character-level diff is too granular: a rephrasing produces dozens of character operations that obscure the semantic edit. Word-level diff (Myers or Patience algorithm on whitespace-tokenized words) is the right default for prompt diffs — it shows which words were added, removed, or rearranged, which maps naturally to how prompt engineers think about edits. Sentence-level diff is useful for high-level structural review of long prompts with many instructions — it shows which whole sentences were added or removed, ignoring intra-sentence rewording. In practice, display word-level diff by default with a sentence-level toggle. UI rendering complexity scales with diff granularity: character-level diff may produce thousands of operations for a single paragraph change, each requiring a separate span element in the diff rendering. At this granularity, DOM node count becomes a performance concern for large prompts. Word-level diff produces far fewer operations and renders efficiently. Sentence-level produces the fewest operations and is the most computationally efficient but least precise.
      </HighlightBlock>

      <h3>Q: How would you design the template variable system to catch missing variable errors before they reach production?</h3>
      <HighlightBlock as="p" tier="important">
        Three layers of validation. First, at version save time: extract all variable placeholders from the content using the regex for the chosen syntax, compare against the variables registry. Placeholders present in content but absent from the registry are flagged as "undeclared variables" — require the engineer to declare them with type, default, and source before the version can be saved. Variables declared in the registry but absent from the content are flagged as "orphaned declarations" — warn the engineer, as this often indicates a typo in the placeholder name. Second, at deployment time: verify that each variable in the registry has a defined source (static config, user context, or request-time parameter) and that static-config variables have their config values set. Block deployment if any required variable has an undefined source. Third, at request time: before substituting values into the prompt, validate that each provided value matches the declared type. A runtime number variable receiving a non-numeric string raises a validation error before the API call, returning a clear error to the calling application rather than submitting a malformed prompt to the LLM.
      </HighlightBlock>

      <h3>Q: How do you handle the rollback case where the target version used a model or configuration that has since changed?</h3>
      <HighlightBlock as="p" tier="important">
        Model and configuration state are stored alongside each version as metadata: modelId, temperature, maxTokens, and other generation parameters recorded at version creation time. When the user initiates a rollback to version N, the system displays a configuration diff: the target version's recorded configuration versus the current deployment configuration, highlighting any mismatches. Required information before confirming the rollback: model name (if changed), temperature (if changed), max tokens (if changed). The rollback creates a new version with the target's prompt content but the current configuration — it does not roll back the model or configuration. The version label explicitly records: "Rollback to v3 content. Note: originally tested with GPT-4-turbo at temperature 0.7; this version uses GPT-4o at temperature 0.3. Re-evaluation recommended." An automated evaluation run against the standard test suite is triggered immediately after rollback creation and the results are attached to the new version's metrics before it can be promoted to production traffic.
      </HighlightBlock>

      <h3>Q: Describe the virtual scrolling architecture for rendering a large version tree with thousands of nodes and variable node heights.</h3>
      <HighlightBlock as="p" tier="important">
        Flatten the version tree into a sorted array of nodes with each node carrying its branch depth (indentation level), branch color, and a list of child branch starting points at this node (for rendering fork indicators). Use TanStack Virtual in variable-size mode with an estimateSize function that returns the expected height for an unexpanded node (about 48 pixels for a compact row) and the measured height for nodes that have been rendered. Store measured heights in a sizeCache keyed by version ID. On first render, all nodes use the estimated height. After the virtual list renders visible nodes, a ResizeObserver on each rendered node captures its actual height and updates the sizeCache, then calls the virtual list's measure() method to trigger a layout recalculation. Nodes that have been measured once use their cached heights on subsequent renders. The virtual list renders only visible nodes plus an overscan of about 10 nodes in each direction. Tree branch lines (the vertical and horizontal lines connecting parent and child nodes) are rendered as SVG elements positioned absolutely relative to the virtual list container, using the cached height data to compute connection point Y coordinates. Branch lines for off-screen nodes are not rendered — only the portions visible within the viewport are drawn.
      </HighlightBlock>

      <h3>Q: How would you design the export format for a prompt version tree to support round-trip import without loss of provenance?</h3>
      <HighlightBlock as="p" tier="important">
        The export format is a JSON object with two top-level fields: meta (schema version, export timestamp, exporting system identifier) and versions (array of all version objects). Each version object in the array is a complete record: all schema fields including id, promptId, versionNumber, content, systemPrompt, variables, authorId, parentVersionId, label, createdAt, tags, and the metrics snapshot at export time. The id values in the export are the original UUIDs, not re-generated ones — this is critical for parentVersionId references to remain valid within the exported array. On import, the receiving system checks whether each version's id already exists in its store (to handle re-imports of previously imported versions without creating duplicates) and whether the parentVersionId references point to versions within the same export batch (internal references) or to versions that must already exist in the receiving system (external references). Versions with external parentVersionId references that do not resolve in the receiving system are imported with parentVersionId set to null, and the label is augmented with a note indicating the parent was not resolved. This graceful degradation preserves all content and intra-batch relationships even when the full ancestry is not available.
      </HighlightBlock>
    </ArticleLayout>
  );
}
