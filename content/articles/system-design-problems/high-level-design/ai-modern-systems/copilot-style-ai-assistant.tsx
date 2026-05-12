"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-copilot-style-ai-assistant",
  title: "Design a Copilot-Style AI Assistant (Embedded in a Product)",
  description:
    "Architecture for a product-embedded AI copilot: context assembly from product state, intent classification, permission guarding, streaming answers, tool-calling with approval gates, and audit logging.",
  category: "high-level-design",
  subcategory: "ai-modern-systems",
  slug: "copilot-style-ai-assistant",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-10",
  tags: ["hld", "ai", "copilot", "llm", "intent", "rbac", "tool-calling", "streaming"],
  relatedTopics: ["ai-chatbot-frontend", "rag-based-ui-system"],
};

export default function CopilotStyleAiAssistantArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A copilot-style AI assistant is not a generic chatbot—it is an AI that lives inside a product and understands the product's state. When a user on a CRM platform asks "Summarize this deal," the copilot must know which deal the user is looking at, which fields are populated, what the user's role allows them to see, and whether the user can take write actions (adding a note, scheduling a follow-up). The copilot is context-aware, permission-scoped, and capable of taking actions—not just answering questions. This is the fundamental design difference: a generic chatbot has no product context; a copilot is wired into the product's data model, navigation state, and permission system.</p>
        <p>The design challenge has three parts. Context assembly: how do you serialize the product's current state into an LLM prompt without bloating the context window or leaking data the user cannot see? Intent classification: how do you determine whether a query requires a read-only answer (safe to stream immediately) versus a write action (requires an approval gate before execution)? Execution with guardrails: how do you execute product API calls on behalf of the user while maintaining audit trails, preventing privilege escalation, and requiring explicit confirmation for destructive actions?</p>
        <p><strong>Explicit assumptions:</strong> The copilot is embedded as a side panel in an existing SaaS product (CRM, project management, or similar). The product has an existing RBAC system with roles and scoped action lists. The LLM is accessed via a server-side API (not from the browser). The copilot panel knows the current page route, entity type, entity ID, and the user's permission set. Tool calls (product API operations) are executed server-side. The copilot streams responses via SSE. Actions that modify or delete data require explicit user confirmation before execution.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Context-aware queries:</strong> The copilot understands the current page, selected entity, and visible data. Queries like "summarize this" or "what's the status?" resolve against the current product context without the user specifying what "this" refers to.</li>
          <li><strong>Natural language and slash commands:</strong> Users can ask free-form questions or use slash commands (/summarize, /draft, /analyze) for common operations. Slash commands provide structured inputs with autocomplete.</li>
          <li><strong>Intent classification:</strong> The backend classifies every query as read (answer-only), write (modifies data), navigate (changes the product view), or explain (describes how something works). Classification determines whether the response is streamed immediately or gated behind an approval step.</li>
          <li><strong>Streaming answers:</strong> Read and explain queries receive a streaming response with no user confirmation step. The answer appears token-by-token in the copilot panel.</li>
          <li><strong>Approval gate for write actions:</strong> Write queries (create record, update field, send email, assign task) show a confirmation card ("Apply: Set deal stage to Negotiation?") before executing. The user can apply, edit, or dismiss the proposed action.</li>
          <li><strong>Audit log:</strong> Every action the copilot takes on behalf of a user is logged with the actor's userId, the AI-generated action description, and before/after state of any modified record.</li>
          <li><strong>Proactive hints:</strong> When the product context changes (user navigates to a deal with overdue tasks), the copilot surface proactively suggests relevant actions ("3 tasks are overdue—want me to draft a follow-up?").</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Time to first token:</strong> For read queries, the first streaming token must appear within 800ms of the user submitting the query.</li>
          <li><strong>Context assembly:</strong> Serializing the product context into a prompt must complete within 50ms (sync, in-memory operation—no additional API calls during context assembly).</li>
          <li><strong>Permission enforcement:</strong> The backend must enforce RBAC at the permission guard layer, not rely on the LLM to self-restrict. The LLM must never be able to trigger an action the user's role does not permit, regardless of prompt content.</li>
          <li><strong>Zero privilege escalation:</strong> Prompt injection attacks (malicious content in page data that attempts to override instructions) must not allow the LLM to perform actions beyond the user's scope. All tool call parameters are validated against the user's permission set server-side before execution.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The copilot has three logical layers. The product UI context layer (client-side): the copilot panel subscribes to the product's frontend state and maintains a live snapshot of the current page context—route, entity type, entity ID, visible data, user permissions, and recent activity. This context is sent with every query. The copilot panel UI layer (client-side): a side panel that renders the slash command palette, the natural language input, streaming answers, suggested action cards with apply/dismiss buttons, and proactive hints triggered by context changes. The backend intelligence layer (server-side): receives the user's query and product context, assembles a structured prompt, classifies the user's intent, checks permissions, routes the query to the LLM for streaming or to a tool call pipeline for action execution, and writes the audit log.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/ai-modern-systems/copilot-style-ai-assistant-architecture.svg"
          alt="Copilot architecture showing three columns: Product UI Context (current page state, selected/visible data, user permissions, recent activity, product schema, user profile), Copilot Panel UI (slash command palette, natural language input, streaming answer, suggested actions, approval gate, proactive hints), and Backend Intelligence (context assembler, intent classifier, permission guard, LLM+tool router, action executor, audit log). Context arrow flows left-to-right; query arrow goes to backend, stream arrow returns."
          caption="Copilot architecture: product UI context feeds the copilot panel, which sends queries to backend intelligence (context assembler → intent classifier → permission guard → LLM router → action executor → audit log)"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Context Assembly</h3>
        <p>The context assembler converts the product's frontend state into a structured prompt section. The context contains: page identity (route template, entity type, entity ID), the current entity's key fields (the copilot must know the deal name, stage, owner, and amount—but not every field on the entity, to avoid bloating the context), the user's role and permission set (expressed as a list of allowed action verbs: "can: create-note, update-deal-stage, send-email; cannot: delete-deal, access-billing"), the user's recent activity (last 10 navigation events and actions, so the copilot can understand what the user was doing before asking), and the product's entity schema (the names and types of fields the product uses, so the LLM can generate field references correctly).</p>
        <p>Context budget management: the context window is not infinite. The context assembler applies a token budget: entity fields get 800 tokens, permissions get 200 tokens, recent activity gets 300 tokens, product schema gets 400 tokens. If the entity has more fields than fit the budget, the assembler prioritizes fields that are currently visible on screen (fields above the fold in the product UI) over hidden fields. The user's query gets 400 tokens, and the remainder of the context window is reserved for the LLM's response.</p>
        <p>Schema injection: the product schema (entity types, field names, allowed values for enum fields) is injected into the system prompt (not the user turn) to keep it separate from the user's natural language input. This prevents prompt injection attacks from using schema knowledge to escalate privileges. The schema is fetched from a static configuration file at startup and cached; it does not change per request.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Intent Classification</h3>
        <p>Intent classification happens server-side before the query reaches the LLM for answer generation. A fast, small classifier model (or a simple LLM call with a classification-only prompt) determines the query's intent category. The four categories are: Read (the user wants information from existing data—no side effects), Write (the user wants to create, update, or delete data—requires permission check and approval gate), Navigate (the user wants to change what they're looking at—the copilot triggers a product navigation event), and Explain (the user wants to understand how something works—no product data involved, safe to answer from general knowledge).</p>
        <p>Classification latency: the classifier call adds approximately 100ms to the end-to-end latency. This is acceptable because the alternative—routing all queries through the full LLM and determining intent from the LLM's first output tokens—is slower and less reliable. A dedicated classifier is faster, cheaper, and produces structured output. The classifier also extracts the action parameters for write intents: for a query like "move this deal to Closed Won," the classifier extracts &#123;entity: deal, entityId: &lt;from context&gt;, field: stage, value: "Closed Won"&#125; as structured parameters to pass to the tool router.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Permission Guard</h3>
        <p>The permission guard is the most security-critical component. It validates that the classified intent and extracted action parameters are within the user's permission scope before passing anything to the LLM or tool router. For read intents: the guard checks that the fields referenced in the query are visible to the user's role (some roles cannot see financial data, contract terms, or other users' private notes). For write intents: the guard checks that the action verb and target entity are in the user's allowed action list. The check is a simple set membership test: is "update-deal-stage" in the user's allowed actions? If not, the request is rejected immediately with a "You don't have permission to perform this action" response—the LLM never sees the request.</p>
        <p>Anti-prompt-injection: the permission guard checks action parameters structurally (is the requested action in the allowed list?) not semantically (does the LLM think this is allowed?). This means an attacker cannot use a malicious prompt in the page data to convince the LLM to bypass the guard—the guard is a deterministic code path that the LLM output cannot influence. If the LLM generates a tool call that is not in the user's allowed action list, the tool router rejects the call and returns an error to the LLM without executing it.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">LLM + Tool Router</h3>
        <p>For read and explain intents, the LLM receives the assembled context + user query and streams the response directly back to the copilot panel via SSE. The panel renders the streaming text with a blinking cursor. For write intents (after permission check passes), the LLM is given the context, user query, and a tool definition for the classified action. The LLM generates a tool_call event (or a structured JSON block) specifying the exact action parameters. The tool router intercepts this, converts it to a human-readable confirmation card (showing the exact proposed change), and sends it to the copilot panel as a pending action. The LLM waits.</p>
        <p>When the user clicks "Apply," the tool router executes the product API call with the user's auth token (not a service account). The action is executed as the user, so the product's existing permission enforcement at the API layer applies as a second layer of defense. The LLM then receives the tool result and streams its commentary ("Done—I've updated the deal stage to Closed Won."). When the user clicks "Dismiss," the tool router sends a cancellation signal to the LLM, which generates a brief acknowledgment ("Got it, no changes made.") and ends the turn.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Proactive Hints</h3>
        <p>Proactive hints are triggered by product context changes, not user queries. The copilot panel subscribes to the product's navigation events (using the same context subscription as the query flow). When the context changes significantly (user navigates to a new entity, a key field changes value, a time-sensitive condition is detected), the copilot evaluates a hint ruleset: a list of condition → hint mappings that are evaluated locally (no LLM call) against the new context.</p>
        <p>Example hint rules: if deal.closeDate is within 7 days and deal.stage is not "Closed," suggest "This deal closes soon—want me to draft a follow-up?" If task.dueDate is in the past and task.status is "Open," suggest "This task is overdue." The hints are generated by a rule engine (not an LLM) to keep latency near zero and to avoid consuming LLM quota on every navigation event. If the user accepts a hint, it becomes a pre-filled query in the copilot panel and proceeds through the normal query flow (context → intent → permission → LLM). Hints that the user dismisses are suppressed for 24 hours for the same condition on the same entity.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Audit Logging</h3>
        <p>Every copilot action that produces a side effect (any write intent that the user confirmed) is written to the audit log before the action is executed. The audit record contains: actorId (the user's ID), actorRole, copilotVersion (the version of the copilot backend), intentClassification, actionDescription (human-readable: "Updated deal 'Acme Corp' stage from 'Proposal' to 'Closed Won'"), entityType, entityId, beforeState (snapshot of relevant fields before the change), afterState (snapshot after), timestamp, and a clientSessionId linking the audit record to the copilot session. The audit log is append-only (no updates or deletes). Write operations to the audit log are transactional with the product API call—if the product API call fails, the audit record is marked as "failed" but retained.</p>
        <p>Audit log UI: a separate "Copilot Activity" tab in the product's admin dashboard shows the audit log filtered to the current user's or organization's copilot actions. Each record shows the human-readable action description, the actor, and the timestamp, with an "Undo" button for reversible actions (only available within a configurable window, e.g., 15 minutes, and only for actions with a stored beforeState).</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/ai-modern-systems/copilot-style-ai-assistant-workflow.svg"
          alt="Sequence diagram showing 5 lifelines (Copilot Panel, Context Assembler, Intent Classifier, Permission Guard, LLM+Tools Router). Steps: user query + page state → context assembler builds prompt ctx → classifier labels intent read/write/nav → permission guard checks RBAC (blocked → error response; allowed → LLM router). LLM router streams tokens for read intent; sends tool_call event for write intent (approval gate). User confirms → action executor + audit log. Right panel shows intent types, latency targets (TTFT <800ms, context build <50ms, classify <100ms), and audit fields."
          caption="Request lifecycle: context assembly (50ms) → intent classification (100ms) → permission guard → stream for reads / approval gate for writes → action executor + audit log"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Context freshness versus latency: the context sent with each query is assembled from the frontend state at the moment the user submits the query. This means the context is always fresh but assembling it adds a client-side serialization step. An alternative—caching the assembled context on the server and invalidating it on navigation events—reduces per-request serialization but introduces staleness risk (the cached context is stale if the entity was modified by another user between the last navigation and the copilot query). For a copilot that reads mutable CRM data, freshness is more important than the marginal latency saving: always assemble from the current frontend state.</p>
        <p>LLM classification versus rule-based classification: using an LLM for intent classification is flexible (it can handle nuanced queries) but slow and expensive. A rule-based classifier (pattern matching on verb keywords: "create," "update," "delete" → write; "what," "show," "summarize" → read) is fast and cheap but brittle for complex queries. The pragmatic approach: start with a rule-based classifier for common patterns and add an LLM fallback for queries the rules cannot classify confidently. Over time, logs of unclassified queries train a small fine-tuned classifier that replaces both the rules and the LLM fallback.</p>
        <p>Single-turn versus multi-turn copilot: a single-turn copilot (each query is independent) is simpler to build but cannot handle multi-step tasks ("first draft an email, then schedule a follow-up meeting"). A multi-turn copilot (with conversation memory) can handle complex workflows but requires session management, per-session context accumulation, and more complex approval gate flows (the user approves a sequence of steps, not individual actions). The first version should be single-turn; multi-turn can be added once the single-turn flow is stable and users express demand for it.</p>
        <p>Slash commands versus free-form NL: slash commands (/summarize, /draft /email, /analyze) provide a structured entry point that bypasses intent classification (the intent is known from the command) and reduces LLM ambiguity. Free-form NL is more flexible but harder to classify reliably. The best design offers both: slash commands for common operations with high confidence, and free-form NL with classification for everything else. Slash commands also serve as a discoverability mechanism—users who don't know what the copilot can do can browse the command palette to learn.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A copilot-style AI assistant is distinguished from a generic chatbot by product context awareness, intent-based routing, and permission-enforced action execution. The context assembler serializes the product's current UI state (entity, fields, permissions, recent activity) into a structured prompt within 50ms. An intent classifier (fast, dedicated model) categorizes the query as read/write/navigate/explain in under 100ms, determining whether the response is streamed immediately or requires an approval gate. The permission guard (deterministic RBAC check, not LLM-based) blocks any action outside the user's scope before the LLM is called—preventing prompt injection escalation. Read intents stream tokens via SSE directly to the panel (TTFT under 800ms). Write intents generate a confirmation card; on user approval, the action executor calls the product API with the user's auth token (respecting existing API-layer permissions) and writes a transactional audit log. Proactive hints are triggered by context changes using a local rule engine (no LLM), shown in the panel sidebar, and suppressed for 24 hours on dismissal. The defining architectural principle: the LLM is an answer-generator and parameter-extractor, not a permission decision-maker. All security decisions are code-path decisions made before and after the LLM call, not inside it.</p>
      </section>
    </ArticleLayout>
  );
}
