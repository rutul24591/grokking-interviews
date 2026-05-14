"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-customer-support-dashboard",
  title: "Design a Customer Support Dashboard (Zendesk-like)",
  description:
    "Architecture for a Zendesk-like customer support dashboard: ticket ingestion from multiple channels (email, chat, web form, API), ticket routing and assignment engine, SLA tracking with escalation, agent workspace UI, real-time collaboration on tickets, canned responses, knowledge base integration, reporting and analytics, and multi-tier support queue management.",
  category: "high-level-design",
  subcategory: "other",
  slug: "customer-support-dashboard",
  wordCount: 5100,
  readingTime: 31,
  lastUpdated: "2026-05-11",
  tags: ["hld", "customer-support", "ticketing", "sla", "real-time", "routing", "analytics"],
  relatedTopics: ["survey-form-analytics-system", "feature-usage-analytics-dashboard"],
};

export default function CustomerSupportDashboardArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">A customer support platform (Zendesk-like) is a multi-channel ticketing system that unifies customer conversations from email, live chat, web forms, social media, and API integrations into a single agent workspace. The core value proposition is that a support agent should never have to switch between tabs to handle a customer inquiry—all context (conversation history, customer profile, order history, prior tickets) is available in one view, and the ticket lifecycle (creation → assignment → resolution → closing) is managed through a single interface.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The engineering challenge has several dimensions. Ticket ingestion must be real-time for chat channels (a chat message must appear in the agent workspace within 1 second) and near-real-time for email (within 30 seconds of receipt). Routing must be intelligent—assigning tickets to agents with the right skills, within their capacity, and respecting SLA time-to-first-response commitments. SLA tracking requires a precise timer system that pauses when awaiting customer reply and resumes when the customer responds. Collaboration is complex: multiple agents may view a ticket simultaneously; a supervisor may add an internal note; an agent may be reassigned mid-conversation. All of these concurrent mutations must be handled without data races.</HighlightBlock>
        <p><strong>Explicit scope:</strong> Core ticketing (multi-channel ingestion, routing, SLA, agent workspace, reporting). Not in scope: full live chat UI (treated as a channel adapter), native mobile agent apps, or AI auto-reply (referenced as future extension points).</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Multi-channel ingestion:</strong> Email (IMAP/SMTP polling or webhook from email provider), web chat (WebSocket-based live chat widget), web form (POST endpoint), and API (programmatic ticket creation). Each channel adapter converts its native format to a canonical Ticket schema. Threads: replies to an existing email thread are appended to the existing ticket rather than creating a new one (thread matching by email Message-ID or subject + sender).</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Ticket routing:</strong> Round-robin assignment within a group, skills-based routing (route tickets tagged "billing" to agents with the "billing" skill), and load-balanced routing (assign to the agent with the fewest open tickets). Priority routing: VIP customers (by account tier) jump the queue. Manual reassignment: agents and supervisors can reassign tickets to any agent or group.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>SLA management:</strong> Per-ticket SLA tracking: time-to-first-response (T1), time-to-resolution (T2). SLA clock pauses when the ticket is in "Awaiting Customer Reply" status and resumes when the customer responds. Breach alerts: 15 minutes before SLA breach, notify the assigned agent. Escalation rules: automatically reassign to a senior agent or supervisor if T1 SLA is breached without a response.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Agent workspace:</strong> Unified inbox (all assigned tickets), ticket detail view (full conversation thread, customer profile, ticket metadata), rich text reply composer with canned responses (macros), internal notes (visible only to agents), file attachment support, and status transitions (New → Open → Pending → Resolved → Closed).</HighlightBlock>
          <li><strong>Reporting:</strong> Average first response time by group/agent/channel, CSAT scores, ticket volume by channel, SLA breach rate, and agent utilization. Daily and weekly report emails to supervisors.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Real-time latency:</strong> Chat messages must appear in the agent workspace within 1 second. Status changes and new ticket assignments must be pushed to agents within 2 seconds.</HighlightBlock>
          <li><strong>Availability:</strong> 99.9% uptime for ticket ingestion. Agents losing visibility into a ticket for 10 minutes is a customer experience failure. Chat channels require 99.95% uptime.</li>
          <HighlightBlock as="li" tier="important"><strong>Scale:</strong> Support 10,000 concurrent agents across multiple organizations (tenants). Each organization may have up to 500 agents and 100K open tickets. Total ticket volume: 10M tickets/day across all tenants.</HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="crucial">The system has five core services. The Channel Ingestion Service handles all inbound ticket creation and reply routing, converting each channel's native format to the canonical Ticket and Message schemas. The Ticket Service owns the ticket lifecycle state machine (status transitions, ownership changes) and is the authoritative source of truth for all ticket data. The Routing Engine subscribes to new ticket events and applies routing rules to assign tickets to agents, respecting skills, capacity, and priority. The SLA Service maintains per-ticket SLA timers and publishes breach-warning and breach events. The Real-Time Notification Service (WebSocket/SSE) pushes ticket updates, new assignments, and chat messages to connected agent browsers. A shared PostgreSQL database stores tickets, messages, agents, and SLA records. ClickHouse serves the reporting pipeline. Redis holds SLA timer state, agent presence/capacity counters, and WebSocket session mappings.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/other/customer-support-dashboard.svg"
          alt="Customer support dashboard architecture showing multi-channel ingestion (email IMAP/SMTP polling webhook thread matching by Message-ID → channel adapter canonical ticket schema; web chat WebSocket live chat widget <1s latency; web form POST endpoint; API programmatic creation → Channel Ingestion Service → Ticket DB PostgreSQL + Kafka ticket-events), routing engine (Kafka consumer new ticket events → routing rules engine round-robin skills-based load-balanced VIP priority → agent assignment service → assign ticket update DB notify agent via WebSocket; capacity tracker Redis agents open ticket counts; skills index Redis/Postgres agent skill tags), SLA service (per-ticket SLA timers Redis sorted set by breach time; T1 first-response T2 resolution; clock pause on Awaiting Customer status resume on customer reply; breach warning 15min before → agent notification; breach → escalation rule engine reassign senior agent/supervisor), agent workspace UI (WebSocket connection real-time push assignments chat messages status changes; unified inbox assigned tickets sorted by SLA urgency; ticket detail full thread customer profile prior tickets; reply composer rich text canned responses macros file attachments; internal notes agent-only visible; status transitions New→Open→Pending→Resolved→Closed), collaboration (optimistic concurrent viewers shown per ticket; last-write-wins for status; internal note conflicts prevented by version field), reporting pipeline (Kafka → ClickHouse avg first-response time CSAT ticket volume SLA breach rate agent utilization; daily weekly email reports to supervisors), multi-tenant isolation (org_id scoped all queries JWT org claim middleware enforcement)."
          caption="Multi-channel ingestion (email/chat/form/API → canonical ticket schema), routing engine (skills/capacity/priority → agent assignment), SLA timers (Redis sorted set, pause/resume, breach escalation), agent workspace (WebSocket real-time, unified inbox, reply composer, status machine), reporting pipeline (Kafka → ClickHouse), and multi-tenant isolation"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Channel Ingestion and Thread Matching</h3>
        <HighlightBlock as="p" tier="crucial">Each channel has a dedicated adapter that normalizes inbound messages to the canonical schema. The email adapter polls the support inbox via IMAP every 30 seconds (or receives webhooks from SendGrid/Mailgun for lower latency). For each email, it extracts the Message-ID header, References header, sender email, and body. Thread matching logic: if the References header contains a Message-ID that matches an existing ticket's thread_id, the email is appended as a new message to that ticket. If no match, a new ticket is created with the email's Message-ID as the thread anchor. Subject-line thread matching is a fallback (same subject + same sender = same thread) and is less reliable but handles clients that strip References headers. The chat adapter receives WebSocket messages from the live chat widget and maps them to tickets by session_id. A new chat session always creates a new ticket; messages within the same session are appended to that ticket.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Routing Engine</h3>
        <HighlightBlock as="p" tier="important">The routing engine is an event-driven service that subscribes to TicketCreated events from Kafka. For each new ticket, it evaluates routing rules in priority order. Rule evaluation: (1) Check if the ticket has an explicit VIP flag (derived from the customer's account tier in the customer database); if so, route to the VIP queue. (2) Match the ticket's tags (auto-tagged by keyword rules, e.g., "billing", "technical", "account") against agent skill tags. (3) Among agents with matching skills, select the one with the fewest open tickets (load-balanced). (4) Fallback: round-robin assignment across all agents in the default group.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Agent capacity tracking: Redis stores each agent's open ticket count as a sorted set (score = open ticket count, member = agent ID). On ticket assignment, the agent's counter increments; on ticket resolution, it decrements. Capacity limits: each agent has a configurable max_open_tickets (default: 20). The routing engine only considers agents below their capacity limit. If all agents are at capacity, the ticket remains in the Unassigned queue and is visible to supervisors.</HighlightBlock>
        <p>Manual reassignment: agents and supervisors can reassign tickets via the workspace UI. A TicketReassigned event is published, which triggers: (1) decrement the previous agent's capacity counter, (2) increment the new agent's counter, (3) push a notification to the new agent via WebSocket, (4) update the ticket's assignment in PostgreSQL.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">SLA Tracking</h3>
        <HighlightBlock as="p" tier="important">SLA timers are stored as a Redis sorted set (ZSET) keyed by sla_type (T1_response, T2_resolution), with score = breach_timestamp (Unix epoch). A background SLA monitor process runs every 30 seconds and queries ZRANGEBYSCORE to find tickets whose breach time falls within the next 15 minutes (warning threshold) or in the past (breached). For warning events: send a push notification to the assigned agent and email the supervisor. For breach events: execute the escalation rule (typically reassign to a senior agent or supervisor) and log the breach in the SLA breach audit table.</HighlightBlock>
        <HighlightBlock as="p" tier="important">SLA clock pauses: when a ticket transitions to "Awaiting Customer Reply" status, a pause_timestamp is recorded. The breach time in Redis is updated to breach_time + pause_duration (extending the deadline). When the customer replies and the ticket returns to "Open" status, the pause is lifted. This ensures SLA measurement reflects only time the support team was responsible for, not time waiting for the customer. Edge case: if a ticket is in Pending status when the SLA ZSET is scanned, the monitor skips it (its timer is paused).</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Agent Workspace and Real-Time Collaboration</h3>
        <HighlightBlock as="p" tier="important">Agents connect to the real-time service via a persistent WebSocket connection on login. The connection is authenticated (JWT validated on upgrade), and the agent is registered in a Redis Hash (agent_id → {"{ws_connection_id, server_node_id}"}) for message routing across multiple server nodes. When a new ticket is assigned to an agent, the Ticket Service publishes a TicketAssigned event; the real-time service looks up the agent&apos;s WebSocket connection and pushes the event. For chat tickets, each customer message is pushed to the agent&apos;s WebSocket within 1 second of receipt.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Concurrent viewing: when multiple agents view the same ticket simultaneously (common in escalation handoffs), all viewers are tracked in a Redis Set (ticket_id → {"{agent_ids}"}). Presence indicators show &quot;Agent X is viewing this ticket&quot; in the UI. Conflict resolution for concurrent replies: the system does not prevent two agents from drafting a reply simultaneously (preventing this would require locking, which is complex and disruptive). Instead, the first reply to submit wins; the second agent&apos;s submit fails with a &quot;Ticket already replied to your reply has been saved as a draft&quot; error, and their draft is preserved in a drafts store.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Canned Responses and Knowledge Base</h3>
        <HighlightBlock as="p" tier="important">Canned responses (macros) are per-organization template snippets stored in PostgreSQL. The reply composer has a search-as-you-type interface (debounced, 300ms) that queries the canned responses API with the agent's typed text. Results are ranked by usage frequency (most-used macros first). Macros support variable substitution: {"{{customer.first_name}}"}, {"{{ticket.id}}"}, {"{{agent.name}}"} are replaced at render time. The knowledge base is a separate read-only integration: each ticket view shows suggested articles (from a pre-indexed search service, queried with the ticket's title + tags). Agents can insert a knowledge base article link into their reply directly from the workspace. This reduces handle time by surfacing self-service resources at the moment the agent is composing a reply, rather than requiring the agent to search a separate tab.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Reporting Pipeline</h3>
        <HighlightBlock as="p" tier="important">Ticket lifecycle events (created, assigned, replied, resolved, closed) are published to Kafka with timestamps. A Kafka consumer writes these events to ClickHouse (append-only, one row per event). Reporting queries run against ClickHouse: average first-response time = average(first_reply_timestamp − created_timestamp) by group/agent/channel; SLA breach rate = count(breached)/count(total) per time period; CSAT score = average(satisfaction_rating) where rating IS NOT NULL. Reports are pre-computed nightly by a Spark batch job and stored in a report_snapshots table, used to serve the reporting dashboard quickly without hitting ClickHouse on every page load. Live metrics (today's ticket volume, current open tickets per agent) are served from Redis counters updated in real time by the ingestion pipeline.</HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">Email polling versus webhooks: polling the IMAP inbox every 30 seconds introduces up to 30 seconds of latency for email-based tickets. For most support scenarios this is acceptable; email is inherently asynchronous and customers do not expect immediate response. Switching to email provider webhooks (SendGrid Inbound Parse, Mailgun Routes) reduces latency to under 5 seconds. The trade-off is coupling to a specific email provider and handling webhook replay on provider outages. For SLA-sensitive workflows, webhooks are preferable; for cost-optimized deployments, polling is simpler.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Single-assignment versus multi-agent collaboration: the system supports exactly one assigned agent per ticket at any time. Collaborative scenarios (senior agent assisting junior agent on a complex case) are handled through internal notes and manual reassignment—not concurrent assignment. True collaborative ticketing (multiple agents working a ticket simultaneously with shared ownership) would require a more complex assignment model and distributed state machine, adding significant complexity. The single-assignment model covers 95%+ of support workflows and is significantly simpler to implement and reason about.</HighlightBlock>
        <HighlightBlock as="p" tier="important">SLA timer accuracy: the Redis ZSET approach for SLA monitoring is accurate to within the polling interval (30 seconds). For SLAs measured in hours, 30-second granularity is more than sufficient. For sub-minute SLAs (common in enterprise live chat), the monitor should run every 5 seconds, but at scale (100K open tickets), this means processing up to 100K ZRANGEBYSCORE results every 5 seconds, which is expensive. The solution is to run the SLA monitor as a sorted-set consumer using the ZPOPMIN pattern (pop the earliest-breach ticket, process it, then pop the next), which processes only tickets actually approaching breach rather than scanning the full set.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="crucial">A customer support dashboard unifies multi-channel ticket ingestion (email with thread matching by Message-ID, WebSocket chat, web form, API) into a canonical Ticket schema via per-channel adapters. The routing engine uses a priority-ordered rule chain (VIP → skills-based → load-balanced capacity → round-robin) with agent capacity tracked in Redis sorted sets. SLA timers live in a Redis ZSET (score = breach epoch); a 30-second monitor fires warnings at T−15min and escalation at breach. The agent workspace connects via persistent WebSocket for &lt;1s delivery of chat messages and &lt;2s delivery of assignment events; concurrent viewers are tracked in Redis Sets, with optimistic conflict resolution (first-reply-wins). The reporting pipeline writes lifecycle events to Kafka → ClickHouse for analytical queries; daily Spark snapshots serve the dashboard without hitting ClickHouse on each load. The critical architectural decision: isolate the ingestion path (must be 99.9%+ available) from the reporting path (can tolerate eventual consistency) by placing Kafka between them, allowing the analytics tier to fall behind without affecting ticket creation or agent workspace responsiveness.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
