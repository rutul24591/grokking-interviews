"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-multi-channel-communication-hub",
  title: "Design a Multi-Channel Communication Hub",
  description:
    "Architecture for a multi-channel communication hub like Intercom or Zendesk: unified inbox aggregating messages from email, live chat, WhatsApp, SMS, and social media; channel adapter pattern for normalizing heterogeneous message formats; agent assignment and round-robin routing; conversation state machine (open, pending, resolved, snoozed); real-time agent presence with typing relay; collision detection when multiple agents view the same conversation; SLA timer tracking per conversation; and canned response search with keyboard shortcuts.",
  category: "high-level-design",
  subcategory: "messaging-communication",
  slug: "multi-channel-communication-hub",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-12",
  tags: ["hld", "omnichannel", "unified-inbox", "intercom", "zendesk", "channel-adapter", "agent-assignment", "sla", "collision-detection"],
  relatedTopics: ["notification-inbox-system", "whatsapp-slack-frontend"],
};

export default function MultiChannelCommunicationHubArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">A multi-channel communication hub (omnichannel inbox) aggregates customer conversations from multiple channels — email, live chat widget, WhatsApp Business API, SMS, Twitter DMs, Facebook Messenger — into a single unified interface for support agents. Intercom, Zendesk, Freshdesk, and Crisp all implement this pattern. The core challenge is heterogeneity: each channel has a different message format, different attachment capabilities, different character limits, and different delivery semantics. A WhatsApp message has a template requirement for outbound messages. An email has a subject line and HTML body. A live chat message is ephemeral (the user might close the tab). An SMS has a 160-character limit. The hub must abstract these differences while preserving channel-specific capabilities.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The agent experience challenge: multiple support agents may simultaneously view the same conversation. Without coordination, two agents can send duplicate replies, causing a confusing customer experience. Agent assignment, collision detection (showing when another agent is currently typing in a conversation), and conversation locking are required for a functional multi-agent inbox.</HighlightBlock>
        <p><strong>Explicit scope:</strong> Unified inbox architecture, channel adapter pattern, conversation state machine, agent assignment and collision detection, SLA tracking, and canned response system. Not in scope: channel-specific API integrations (WhatsApp Business API, Twilio SMS), AI auto-reply, or analytics dashboards.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Unified inbox:</strong> All conversations from all channels appear in a single inbox sorted by last activity. Each conversation shows the channel icon (email, chat, WhatsApp), the customer name and avatar, the last message snippet, and the current agent assignment. Conversations can be filtered by channel, status (open/pending/resolved/snoozed), assigned agent, and SLA breach status.</li>
          <HighlightBlock as="li" tier="important"><strong>Channel adapters:</strong> Each incoming channel (email, chat, WhatsApp, SMS) has an adapter that normalizes the channel-specific payload into a canonical Conversation and Message format: &#123;id, channelType, externalId, customerId, messages: [&#123;id, direction, body, attachments, timestamp, metadata&#125;], status, assigneeId, slaDeadline&#125;. Outbound messages are de-normalized back to the channel format by the adapter before delivery.</HighlightBlock>
          <li><strong>Conversation state machine:</strong> Each conversation has a state: Open (new or waiting for agent reply), Pending (agent replied, waiting for customer response), Resolved (closed by agent), Snoozed (suppressed until a time or a customer reply). State transitions are triggered by: new customer message (Pending → Open), agent reply (any → Pending), agent closes (any → Resolved), new message to resolved conversation (Resolved → Open), SLA breach (any → SLA Breached overlay). State is stored server-side and synced to all agents viewing the conversation via WebSocket.</li>
          <li><strong>Agent assignment and routing:</strong> Conversations are assigned to agents via round-robin (balanced load) or manual assignment. The assignment is shown in the conversation header. Multiple agents can view a conversation, but only the assigned agent's reply is recorded as the agent reply. Other agents can add internal notes (not visible to the customer) or reassign.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Collision detection:</strong> When Agent A opens a conversation that Agent B is currently viewing or composing in, a real-time collision indicator appears: "Agent B is currently typing a reply." This prevents duplicate replies. The assigned agent's composer is active; non-assigned agents see the composer as read-only with the collision banner. If Agent A clicks "Take over," the assignment transfers to Agent A.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>SLA tracking:</strong> Each conversation has an SLA deadline (e.g., first response within 2 hours). A countdown timer appears in the conversation list and detail view. Conversations approaching (within 30 minutes) or past the SLA deadline are highlighted red. SLA is paused when the conversation is in Pending state (waiting for customer reply). Breach events trigger escalation notifications to team leads.</HighlightBlock>
          <li><strong>Canned responses:</strong> Agents can access a library of templated responses (canned responses) via a keyboard shortcut (/shortcut in the compose box or Ctrl+K search). Canned responses support template variables (&#123;&#123;customer.name&#125;&#125;, &#123;&#123;agent.name&#125;&#125;, &#123;&#123;ticket.id&#125;&#125;) that are substituted on insertion. Search within canned responses is client-side (all responses are fetched on login and indexed locally with Fuse.js fuzzy search — typically under 500 entries).</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="crucial">The architecture has four layers. The Channel Layer: each external channel (email, WhatsApp, SMS, chat widget) sends events to the hub via webhooks or polling. A channel adapter per source normalizes events into the canonical Conversation and Message schemas. The Routing Layer: the conversation router assigns new conversations to agents (round-robin, skill-based, or manual), updates the conversation state machine, and emits events to the agent WebSocket connections. The Agent Layer: the React frontend receives conversations and messages via WebSocket, renders the unified inbox, and sends agent replies through the router (which de-normalizes and delivers to the correct channel). The SLA Layer: a background process (cron job every minute) checks conversation SLA deadlines, emits breach events for overdue conversations, and pauses SLA timers for Pending conversations.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/messaging-communication/multi-channel-communication-hub.svg"
          alt="Multi-channel communication hub: channel adapters (email webhook → normalize to &#123;channelType:email, body, attachments&#125;; WhatsApp webhook → &#123;channelType:whatsapp, body, mediaUrl&#125;; SMS → &#123;body, from, to&#125;; live chat WS → &#123;sessionId, body&#125;; all → canonical Message schema), conversation state machine (Open: new/unassigned; Pending: agent replied, waiting customer; Resolved: closed; Snoozed: until time or reply; transitions: customer msg→Open; agent reply→Pending; agent close→Resolved; customer msg to Resolved→Open; SLA breach→highlight), agent assignment (round-robin pool → assigneeId; assigned agent: active composer; viewing agents: read-only + collision banner 'Agent B is typing'; Take over → reassign; internal notes: not sent to customer; WS event: AGENT_VIEWING, AGENT_TYPING), SLA tracking (deadline per conversation; countdown timer in list + detail; within 30min: amber; breached: red; paused in Pending state; breach → escalation notif to team lead), canned responses (Ctrl+K search; Fuse.js local fuzzy; &#123;&#123;customer.name&#125;&#125; substitution on insert; channel-specific: WhatsApp only allows approved templates for outbound)."
          caption="Channel adapter normalization (email/WhatsApp/SMS/chat → canonical schema), conversation state machine (Open/Pending/Resolved/Snoozed), round-robin assignment with collision detection (active composer vs read-only + banner), SLA countdown (amber 30min, red breach, paused Pending), canned responses (Ctrl+K Fuse.js local fuzzy search, template variable substitution)"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Channel Adapter Pattern</h3>
        <HighlightBlock as="p" tier="important">Each channel has a dedicated adapter class that implements a common interface: &#123;receive(rawPayload) → Message, send(message) → ChannelDeliveryResult, getCustomerProfile(channelId) → Customer&#125;. The receive() method maps channel-specific fields to the canonical Message schema. For email: the raw MIME payload is parsed (subject, from, to, html body, attachments), and mapped to &#123;channelType: "email", direction: "inbound", body: stripHtml(htmlBody), richBody: htmlBody, attachments: [], subject, externalId: messageId&#125;. For WhatsApp: the webhook payload (from Twilio or Meta's Cloud API) maps to &#123;channelType: "whatsapp", direction: "inbound", body: text, attachments: [&#123;type: "image", url: mediaUrl&#125;]&#125;. For live chat: the WebSocket frame maps to &#123;channelType: "chat", direction: "inbound", body: text, sessionId&#125;.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The send() method performs the reverse transformation. For WhatsApp outbound, regulatory requirements apply: the message must use a pre-approved template if the customer has not messaged in the last 24 hours (WhatsApp's "24-hour window" rule). The WhatsApp adapter checks the last_customer_message_at timestamp and either sends a free-form message (within the window) or a template message (outside the window). This channel-specific business logic is encapsulated in the adapter, invisible to the conversation view.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Collision Detection and Typing Relay</h3>
        <HighlightBlock as="p" tier="important">Collision detection requires real-time coordination between agents. When Agent A opens a conversation, the client sends a VIEWING_START event via WebSocket: &#123;type: "VIEWING_START", conversationId: "conv-123", agentId: "agent-A"&#125;. The server adds Agent A to the conversation's viewer set (stored in Redis: SADD conv:conv-123:viewers agent-A with a 30-second TTL, refreshed every 15 seconds). All agents currently viewing the same conversation receive a VIEWERS_UPDATED event with the current viewer set. The composer shows a banner for each viewer who is not the assigned agent: "Agent B is also viewing."</HighlightBlock>
        <HighlightBlock as="p" tier="important">Typing relay: when the assigned agent types in the compose box, a TYPING event is sent via WebSocket every 1 second (not on every keystroke — debounced). The server broadcasts the TYPING event to all other agents viewing the conversation, showing a "Agent A is typing..." indicator. For the customer-facing side (live chat), the TYPING event is also relayed to the customer's chat widget (via the chat WebSocket), showing the familiar "... agent is typing" indicator in the customer's window.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">SLA Timer Implementation</h3>
        <HighlightBlock as="p" tier="important">SLA timers are calculated server-side and displayed client-side. The SLA deadline is stored as an absolute UTC timestamp on the conversation record: slaDeadline: "2026-05-12T14:30:00Z". The client displays the remaining time by calculating (slaDeadline - Date.now()) and updating the display every minute via setInterval. Color coding: green if &gt;60 minutes remain, amber if 30–60 minutes remain, red if &lt;30 minutes or breached. The SLA timer is paused (the deadline does not advance) while the conversation is in Pending state — a separate field tracks the cumulative SLA time used (slaTimeUsedMs), updated by the server when the conversation transitions from Pending back to Open.</HighlightBlock>
        <HighlightBlock as="p" tier="important">SLA breach handling: a server-side cron job (every minute) queries conversations where slaDeadline &lt; NOW() AND status != "resolved". For breached conversations, it: (1) emits a SLA_BREACHED WebSocket event to all agents viewing the conversation; (2) sends an escalation notification to the team lead (via email and notification inbox); (3) applies a "SLA Breached" badge to the conversation in the inbox list. The conversation is not automatically closed or reassigned — breach requires agent action, not automatic resolution.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unified Inbox Filtering and Search</h3>
        <HighlightBlock as="p" tier="important">The inbox filter state (channel, status, assignee, SLA breach, tag) is stored in URL query parameters (?channel=email&amp;status=open&amp;assignee=me) — making the filter state shareable and bookmarkable. Each filter change triggers a new server query: GET /api/conversations?channel=email&amp;status=open&amp;assigneeId=current_user&amp;limit=30&amp;cursor=last_id. The response is paginated with keyset cursors (by lastActivityAt DESC). The conversation list is rendered with virtual scrolling (TanStack Virtual, ~15 visible rows, each row 80px fixed height).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Full-text search across conversation bodies queries Elasticsearch (GET /api/conversations/search?q=refund&amp;channel=email&amp;status=open). Results are highlighted (Elasticsearch's highlight feature returns fragments with &lt;em&gt; tags). Search results are a flat list (no grouping), sorted by relevance score. The search field is in the inbox header with a 300ms debounce — fast enough to feel instant but not spamming the server on every keystroke.</HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">Unified data model vs. channel-native features: normalizing all channels into a canonical schema loses channel-specific capabilities. WhatsApp supports interactive buttons and list messages; email supports arbitrary HTML; SMS supports only plain text. The canonical schema must be rich enough to represent the superset of all channel capabilities, or the adapter must preserve channel-native metadata in an opaque &#123;channelMetadata: &#123;...&#125;&#125; field that is rendered by channel-specific UI components. The risk of premature normalization: building a schema around today's channels makes it hard to add new channels with different capabilities (video messages, interactive forms).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Agent assignment fairness: round-robin assignment (the simplest strategy) does not account for conversation complexity (a refund dispute takes longer than a password reset question) or agent skill (routing technical questions to technical support, billing questions to billing). Skill-based routing requires tagging conversations with categories (via keyword matching or AI classification) and maintaining agent skill profiles. This is significantly more complex than round-robin but reduces resolution time for specialized queries. The simplest viable system starts with round-robin and adds skill-based routing incrementally as the team grows beyond 10 agents.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important">A multi-channel communication hub is built on: (1) channel adapters (receive() normalizes to canonical Message schema; send() de-normalizes to channel-specific format; WhatsApp 24h window check in adapter); (2) conversation state machine (Open/Pending/Resolved/Snoozed, server-side with WebSocket sync on transitions, SLA pause in Pending); (3) agent assignment + collision detection (round-robin, VIEWING_START WS event → Redis viewer set with 30s TTL, VIEWERS_UPDATED broadcast, assigned agent active composer, viewers read-only + banner, typing relay via WS debounced 1s); (4) SLA tracking (absolute UTC deadline, client countdown setInterval, server cron breach detection, escalation notification, amber/red thresholds); and (5) canned responses (Ctrl+K, local Fuse.js fuzzy, template variable substitution, channel restrictions enforced on send). The core complexity is the channel adapter layer — every new channel adds a new adapter but does not change the core conversation model or agent UI.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
