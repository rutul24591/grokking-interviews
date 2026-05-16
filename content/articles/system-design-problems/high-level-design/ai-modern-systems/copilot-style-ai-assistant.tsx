"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
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
  lastUpdated: "2026-05-16",
  tags: ["hld", "ai", "copilot", "llm", "intent", "rbac", "tool-calling", "streaming"],
  relatedTopics: ["ai-chatbot-frontend", "rag-based-ui-system"],
};

export default function CopilotStyleAiAssistantArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
        A copilot-style AI assistant differs from a generic chatbot in one fundamental
        way: it understands the product's state. When a user on a CRM platform asks
        "summarize this deal," the copilot must know which deal the user is looking at,
        which fields are populated, what the user's role allows them to see, and whether
        write actions (adding a note, scheduling a task) are permitted. A generic chatbot
        has no product context — the user must describe the situation. A copilot is
        context-aware, permission-scoped, and capable of taking actions, not just answering
        questions. The design challenge has three parts: context assembly (serializing
        the product state into a prompt without bloating the context window or leaking
        unauthorized data), intent classification (distinguishing safe read queries from
        write actions that require an approval gate), and execution with guardrails
        (calling product APIs on behalf of the user while maintaining an audit trail
        and preventing privilege escalation).
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/high-level-design/ai-modern-systems/copilot-style-ai-assistant-architecture.svg"
        alt="Copilot architecture showing product context assembly, intent classification, permission guard layer, streaming answer path, approval gate for write actions, tool execution engine, and audit log"
        caption="Copilot architecture: product context → intent classification → permission guard → streaming answer or approval gate → tool execution → audit log"
      />

      <h2>Clarifying the Requirements</h2>
      <p>
        The scope of a copilot varies enormously. Define these upfront:
      </p>
      <p>
        <strong>Read-only or capable of actions?</strong> A read-only copilot (answers
        questions, summarizes, explains) is significantly simpler than an action-capable
        copilot (creates records, updates fields, sends messages). Action capability
        requires an approval gate, audit logging, and a rollback mechanism — the complexity
        doubles.
      </p>
      <p>
        <strong>How much product context?</strong> A copilot that knows only the current
        page entity (one deal, one ticket) assembles a small, focused prompt. A copilot
        with awareness of the user's entire workspace, recent activity, and cross-entity
        relationships can answer more complex questions but requires careful context
        selection to avoid overwhelming the LLM's context window.
      </p>
      <HighlightBlock as="p" tier="crucial">
        Permission enforcement must happen server-side, not in the LLM. The LLM cannot
        be trusted to self-restrict based on role information in its context — a
        well-crafted prompt can instruct the LLM to ignore permissions. Every tool the
        copilot can call must be authorized against the user's RBAC roles before execution,
        regardless of what the LLM requested. The permission guard is a server-side check
        between the LLM's tool call request and the actual API execution, not a line in
        the system prompt.
      </HighlightBlock>

      <h2>Product Context Assembly</h2>
      <p>
        When the user opens the copilot panel or submits a query, the product context
        is assembled into a structured block included in the LLM prompt. Context assembly
        must be synchronous and fast (under 50ms) — it runs in-process from data already
        in the frontend state, not from additional API calls.
      </p>
      <p>
        Context is hierarchical. Primary context (always included): the current page
        entity — the deal, ticket, or project the user is viewing — with its key fields
        (name, status, owner, key dates, recent activity). This is typically 200–400 tokens.
        Secondary context (included if relevant to query type): related entities (linked
        contacts, parent project, associated tasks), user preferences (preferred
        communication style, timezone), and the user's permission set (which actions
        they can take). Tertiary context (included on demand or for complex queries):
        historical context (conversation history with this contact, previous deal notes),
        aggregated metrics, or cross-entity relationships.
      </p>
      <HighlightBlock as="p" tier="important">
        Context is not the full database record. The raw record may contain fields the
        user cannot see (based on their RBAC roles), sensitive fields that should not
        enter the LLM's context (payment card numbers, SSNs), and fields that are
        irrelevant noise (internal metadata, audit trail fields). The context assembler
        applies a field allowlist specific to the entity type and role, selecting only
        the fields relevant to the user's permission level. Unauthorized fields never
        enter the prompt — even if the LLM could hypothetically extract them from the
        context, they're simply not there.
      </HighlightBlock>
      <p>
        Context serialization format: JSON-formatted structured context (not prose)
        is easier for the LLM to parse and less prone to misinterpretation. The context
        block uses clearly labeled sections: CURRENT_ENTITY, USER_CONTEXT, RECENT_ACTIVITY,
        AVAILABLE_ACTIONS (which tools the user's role permits). The AVAILABLE_ACTIONS
        section is derived from the permission guard — only listing actions the user
        can actually take prevents the LLM from proposing unauthorized actions and then
        being surprised when the permission guard rejects them.
      </p>

      <h2>Intent Classification</h2>
      <p>
        Every query is classified before the main LLM response is generated. Intent
        classification determines whether the response is streamed immediately (read
        queries) or gated behind an approval step (write queries).
      </p>
      <p>
        Intent categories: Read (answer-only — summarize this, explain the status,
        what are the next steps?), Write (modifies product data — update the deal stage,
        add a note, assign a task, schedule a follow-up), Navigate (changes the product
        view — go to the associated contact, open the deal timeline), and Explain
        (product feature questions — how do I configure notifications?). Write intents
        require the approval gate. Navigate intents trigger product navigation directly
        (no LLM generation needed). Explain intents may be answered from a product
        documentation RAG index rather than the LLM's parametric knowledge.
      </p>
      <p>
        Classification is performed by a fast, cheap model (GPT-3.5-turbo-level) in
        a parallel call rather than within the main LLM call. The main LLM call begins
        immediately; the classifier result determines UI mode when it returns
        (typically 150–300ms later). For most read queries, the classifier confirms
        safe streaming and the generation is already halfway complete. For write queries,
        the UI shows a loading state while the main LLM generates the proposed action —
        then displays the approval card before executing.
      </p>

      <h2>Streaming Answers for Read Queries</h2>
      <p>
        Read queries stream directly to the copilot panel using the same SSE+rAF batching
        pattern as a general chatbot. The key difference: the context is product-aware,
        so responses like "This deal has been stuck in the proposal stage for 23 days,
        longer than your team's median of 12 days. The last activity was a call note on
        May 5th with no follow-up scheduled" are generated from the assembled product
        context without the user specifying any of those details.
      </p>
      <p>
        Inline actions within read responses: the LLM can propose actions as clickable
        inline elements even within a read response. "I see there's no follow-up scheduled
        — [Schedule a follow-up task]." The bracketed element is rendered as an action
        button that triggers the approval gate for the write action. This pattern allows
        the LLM to suggest next steps without requiring the user to explicitly request
        them, while still going through the approval gate before any data modification.
      </p>

      <h2>Approval Gate for Write Actions</h2>
      <p>
        When a write intent is detected, the LLM generates a structured action proposal
        rather than a prose response. The proposal contains: the action type (update_field,
        create_task, send_email), the target entity (dealId, contactId), the specific
        change (field name, new value), and a human-readable description ("Set deal stage
        from 'Proposal' to 'Negotiation'").
      </p>
      <p>
        The approval card renders in the copilot panel: the proposed action description,
        an "Apply" button, an "Edit" button (opens an editable form with the proposed
        values pre-filled), and a "Dismiss" button. Clicking Apply triggers the actual
        API call. Clicking Edit shows a form where the user can modify the proposed
        values before applying. Dismiss discards the action without modification.
      </p>
      <HighlightBlock as="p" tier="important">
        Destructive actions (delete record, send email to external party, publish content)
        require additional confirmation beyond the standard approval card. The approval
        card for a destructive action includes a bold warning ("This will permanently
        delete the deal and cannot be undone"), requires typing the entity name to
        confirm (not just clicking Apply), and shows the full list of dependent records
        that will be affected. This follows the same design pattern as "dangerous zone"
        UI in settings pages — making accidental destruction require deliberate effort.
      </HighlightBlock>
      <p>
        Batch approval: when the LLM proposes multiple related actions (schedule follow-up,
        update stage, add note), they are presented as a single batch approval card with
        individual checkboxes. The user can approve all, approve a subset, or dismiss
        all. This reduces the friction for multi-step actions while keeping each action
        explicitly visible and controllable.
      </p>

      <h2>Tool Execution Engine</h2>
      <p>
        After the user approves an action, the tool execution engine calls the product's
        API on behalf of the user. This is not a direct LLM tool call (where the LLM
        generates tool call syntax) — the LLM generates the structured action proposal,
        the user approves it, and a separate tool execution layer makes the API call
        using the user's authenticated session and scope.
      </p>
      <p>
        The tool execution layer has three responsibilities: (1) re-verify permissions
        at execution time (the user's permissions may have changed between proposal
        generation and approval), (2) execute the API call with retry and error handling,
        and (3) record the action in the audit log.
      </p>
      <p>
        Error handling at execution: if the API call fails (network error, concurrent
        modification conflict, validation error), show an error card in the copilot
        panel with the failure reason and options to retry or dismiss. Don't silently
        absorb errors — the user must know their action didn't complete.
      </p>

      <h2>Audit Logging</h2>
      <p>
        Every action the copilot takes is recorded in an immutable audit log: actorUserId,
        sessionId, timestamp, entityType, entityId, actionType, aiGeneratedDescription
        (what the LLM proposed), userApproval (apply/edit/dismiss), beforeState (snapshot
        of the record before modification), afterState (snapshot after), and executionResult
        (success/failure and error details if failed).
      </p>
      <p>
        The audit log is accessible to admins in the product's activity history with
        AI-initiated actions visually distinguished from user-initiated ones ("AI suggested,
        user confirmed"). This distinction is important for compliance (who is responsible
        for the action — the user who approved it, not the AI system) and for debugging
        (tracing back an unexpected record change to the specific copilot interaction
        that caused it).
      </p>
      <HighlightBlock as="p" tier="crucial">
        The actorUserId must always be the human user, not a service account. If the copilot
        executes API calls using its own service credentials, the audit trail shows "AI
        System" as the actor, which is legally ambiguous in regulated industries and operationally
        problematic (you cannot tell which user instructed the AI to take the action). Execute
        all copilot actions using the user's own authenticated session — the AI is a
        tool the user wields, not an autonomous actor with its own identity.
      </HighlightBlock>

      <h2>Proactive Suggestions</h2>
      <p>
        A fully reactive copilot (answers questions only when asked) is useful. A proactive
        copilot that surfaces relevant suggestions when the user navigates to a new context
        is significantly more valuable. When the user opens a deal with overdue tasks and
        no scheduled follow-up, the copilot proactively shows: "3 tasks on this deal are
        overdue. Want me to draft a follow-up email to the contact?"
      </p>
      <p>
        Proactive suggestions are triggered by product navigation events. When the user
        lands on a new entity, a lightweight background call assembles the entity context
        and asks the LLM to identify the top 1–2 most relevant proactive suggestions given
        the entity state and the user's role. The suggestions appear as dismissible chips
        in the copilot panel header ("Draft a follow-up", "Summarize activity"), not as
        full-panel content (which would compete with the user's attention on the main product).
      </p>

      <h2>Interview Q&A</h2>

      <h3>Q: How do you prevent the LLM from hallucinating product data that doesn't exist in the context?</h3>
      <p>
        The system prompt explicitly instructs the LLM that it may only reference data
        provided in the CURRENT_ENTITY and RECENT_ACTIVITY context blocks — it must not
        invent field values, contact names, or historical events not present in the context.
        Post-generation validation: for factual claims in the response (specific dates,
        numbers, names), the system checks whether those values appear in the assembled
        context. Mismatches flag a potential hallucination and add a disclaimer to the
        response. For high-stakes actions (the LLM proposes to update a field to a value
        that is not the current value and not a value the user mentioned), the approval
        card shows a warning: "The AI suggested this value but it was not in the current
        record data — please verify before applying."
      </p>

      <h3>Q: How do you handle copilot queries that require data not in the immediate product context (cross-entity queries)?</h3>
      <p>
        Cross-entity queries ("show me all deals from this contact" or "what's the team's
        close rate this quarter?") require data that isn't in the current entity context.
        These queries trigger a read tool call — the LLM requests specific data by type
        and filter parameters, the backend queries the product database (applying the user's
        RBAC filter), and the results are injected into the LLM's context before it
        generates the response. This is similar to RAG retrieval but against the product
        database rather than a document corpus. The tool call results are included in the
        audit log with the query parameters and the access scope used.
      </p>

      <h3>Q: How would you implement slash commands alongside free-form natural language?</h3>
      <p>
        Slash commands (/summarize, /draft-email, /update-stage) provide structured inputs
        with autocomplete for common operations. They appear in the copilot input field
        when the user types "/", showing a picker with available commands based on the
        current entity type and user permissions. Selecting a command may open a form
        with specific fields (for /update-stage: a dropdown of valid stage values) rather
        than free text — making the intent unambiguous without relying on NLP parsing.
        The command is then processed through the same intent classification and approval
        gate as a natural language equivalent. The UX benefit: slash commands surface
        available capabilities and reduce the user's need to know what to ask.
      </p>

      <h2>Disambiguation and Clarifying Questions</h2>
      <p>
        Many copilot queries are ambiguous in ways that have significant implications
        for the response. "Update the owner" could mean the deal owner, the account owner,
        or the contact owner — three different fields on three different records. A copilot
        that guesses and updates the wrong owner creates a data integrity problem that
        requires manual correction. A copilot that asks a single focused clarifying question
        before proceeding prevents the error with minimal friction.
      </p>
      <p>
        Disambiguation strategy: when the intent classifier detects an ambiguous write
        intent, the copilot should not generate a full action proposal. Instead, it
        generates a clarifying question that resolves the ambiguity with the fewest
        possible interactions. Good clarifying questions offer concrete options rather
        than open-ended questions: "Which owner did you mean — the deal owner (currently
        Sarah Chen) or the account owner (currently Marcus Webb)?" rather than "What did
        you mean by owner?" Options pre-populated with the current values require minimal
        cognitive effort from the user and prevent misunderstanding.
      </p>
      <HighlightBlock as="p" tier="important">
        One clarifying question per ambiguous intent is the design constraint. Copilots
        that ask multiple follow-up questions before taking action feel more like a form
        than an assistant. If the first clarifying question doesn't fully resolve the
        ambiguity, it should narrow the possibilities enough that the copilot can make
        a reasonable assumption for the remaining uncertainty and surface that assumption
        explicitly in the approval card: "I've assumed you mean the deal stage, not the
        opportunity stage — click Edit to change this if that's not right."
      </HighlightBlock>
      <p>
        Proactive disambiguation in context: some ambiguities can be resolved without
        asking the user by inspecting the product context. If the user says "email them"
        and there is only one contact associated with the current deal, no clarification
        is needed — the copilot infers "them" refers to the only associated contact.
        If there are three contacts, clarification is required. Context-driven resolution
        reduces unnecessary questions and makes the copilot feel perceptive rather than
        mechanical. Implement this as a pre-step in the intent classification: extract
        ambiguous references from the query, attempt to resolve them from the assembled
        product context, and proceed directly to action generation if all references
        resolve unambiguously.
      </p>

      <h2>Copilot Discoverability and Onboarding</h2>
      <p>
        The hardest product problem for copilot-style assistants is discoverability.
        Users who don't know what the copilot can do won't try it. Users who try it
        with an unsupported query and receive a generic "I can't do that" response
        often don't try again. Onboarding must convey the copilot's specific capabilities
        in the context where those capabilities are useful, not in a generic documentation
        page the user reads once and forgets.
      </p>
      <p>
        Contextual capability surfacing: when the user first opens the copilot panel on
        a specific entity type (a deal record for the first time), show a short capability
        card specific to that entity: "On deal records, I can summarize activity, draft
        follow-up emails, update stage and owner, and remind you about overdue tasks.
        Try asking me to summarize this deal." This pattern exposes capabilities exactly
        when they are relevant, not in a generic getting-started guide. Persist a
        first-use flag per entity type so the capability card shows once, not on every
        visit.
      </p>
      <p>
        Sample prompts: the empty state of the copilot input (before the user has typed
        anything) shows 3–4 suggested queries specific to the current entity and user
        role. These suggestions update based on the entity's state — a deal with overdue
        tasks shows "What tasks are overdue on this deal?" as a suggestion; a deal with
        no recent activity shows "Draft a re-engagement email for this deal." Sample
        prompts are the most effective onboarding mechanism because they demonstrate
        exact phrasing that works, reducing the user's anxiety about "saying the right
        thing."
      </p>

      <h2>Privacy and Data Minimization</h2>
      <p>
        A copilot that assembles rich product context to generate helpful responses
        is also, by definition, sending that context to an LLM API. The context may
        contain personal data (customer names, email addresses, deal amounts, medical
        records in healthcare contexts), confidential business information (unreleased
        product plans, financial projections, competitive analysis), and legally sensitive
        data (communications with external parties, contractual terms). Each LLM API
        call is a data transfer to a third-party provider, subject to the provider's
        data processing terms and potentially to regional data protection regulations.
      </p>
      <p>
        Data minimization at context assembly: the field allowlist described in the product
        context assembly section is the primary privacy control. But beyond field selection,
        implement value-level minimization: replace exact values with categories where
        the full value is unnecessary for the query. A deal amount does not need to be
        "$4,250,000" in the context — it can be "over $4M" for most queries. An email
        address does not need to appear in the context when the query is "summarize this
        deal." Implement a sensitivity classifier that detects high-sensitivity field
        types (email, phone, SSN, financial amounts above a threshold) and applies value
        masking by default, with an explicit user action required to include the exact
        value.
      </p>
      <HighlightBlock as="p" tier="crucial">
        Zero-data-retention agreements with LLM providers are the gold standard for
        copilots operating in regulated industries (healthcare, finance, legal). Without
        a zero-retention agreement, the provider may use API inputs for model training.
        For healthcare copilots, any PHI (Protected Health Information) in the context
        creates HIPAA liability if the provider's data processing terms don't provide
        the required BAA (Business Associate Agreement). Vet the provider's data processing
        terms before building a copilot that handles regulated data, and document the
        compliance posture. Build the context assembly to exclude regulated data categories
        by default, with an explicit opt-in (and accompanying legal review) to include
        them for use cases where they are necessary.
      </HighlightBlock>

      <h3>Q: How do you handle a user who asks the copilot questions outside the product domain ("write me a poem")?</h3>
      <p>
        Out-of-domain queries should be detected and handled gracefully — not silently
        answered with the product context polluting the response, and not rejected with
        a cold "I can't help with that." The intent classifier includes an "out-of-domain"
        category that fires when the query has no clear connection to the product's entity
        types or available actions. The copilot responds: "I'm focused on helping you
        with your deals, contacts, and tasks in [product]. For general questions, you
        might try a general-purpose AI assistant." This response is brief, non-preachy,
        and redirects rather than refusing. Log out-of-domain queries (without content,
        just the intent category and frequency) to understand whether there are unmet
        needs that should be addressed by adding capability, not by repeating the
        out-of-domain response.
      </p>

      <h3>Q: How would you implement response quality feedback specific to copilot actions?</h3>
      <p>
        Copilot feedback has a unique dimension not present in general chatbot feedback:
        the outcome of the action. A user who approved an action and then immediately
        reverted it (undid the change, deleted the created record, corrected the submitted
        email) provided implicit negative feedback stronger than a thumbs down. Track
        action reversal rate as a primary quality metric: if 20% of AI-suggested deal
        stage updates are manually changed back within 5 minutes, the stage prediction
        model is poorly calibrated. Explicit feedback (thumbs up/down per copilot response)
        captures general quality; action reversal rate captures specific outcome quality
        for write actions. Combine both signals in the quality dashboard, segmented by
        action type and entity type, to identify which specific capabilities need improvement.
      </p>
    </ArticleLayout>
  );
}
