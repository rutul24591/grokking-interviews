"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-qa-system-stackoverflow",
  title: "Design a Q&A System (StackOverflow-like)",
  description:
    "Architecture for a StackOverflow-like Q&A platform: question posting with tag taxonomy and duplicate detection, Markdown editor with live preview and code syntax highlighting, voting system with reputation score propagation, answer ranking algorithm (accepted answer priority, vote score, recency), full-text search with tag filtering and semantic similarity, notification system for question activity, moderation tools (flag, close, delete), badge award engine, and audit log for content edits.",
  category: "high-level-design",
  subcategory: "knowledge-content-systems",
  slug: "qa-system-stackoverflow",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-14",
  tags: ["hld", "qa-system", "voting", "reputation", "full-text-search", "moderation", "markdown", "tags"],
  relatedTopics: ["medium-like-article-platform", "learning-platform-course-progress"],
};

export default function QaSystemStackoverflowArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">A Q&A platform like StackOverflow is fundamentally a knowledge retrieval system. The value comes not from the questions themselves but from the answers — specifically, from the community's collective judgement about which answers are correct and which are not. The voting and reputation system is the core mechanism: it surfaces high-quality answers, rewards accurate contributors, and gates destructive actions (only high-reputation users can delete others' posts, edit without review, or cast close votes).</HighlightBlock>
        <HighlightBlock as="p" tier="important">The hardest design challenges: (1) duplicate detection — preventing the same question from being asked many times, degrading answer quality; (2) search — users must find existing questions before posting new ones, requiring both keyword search (Elasticsearch) and semantic search (embedding similarity); (3) the voting system's integrity — vote fraud (sock puppets, vote rings) undermines the entire reputation mechanism and must be detected and reversed; (4) answer ranking — the accepted answer is not always the best answer over time as technologies evolve, so the ranking must balance acceptance, vote score, and recency.</HighlightBlock>
        <p><strong>Explicit scope:</strong> Question/answer CRUD with Markdown editor, voting and reputation system, tag taxonomy, duplicate detection, full-text + semantic search, notification system, moderation queue, and badge engine. Not in scope: Teams/private Q&A, jobs board, or ad delivery.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Question posting with duplicate detection:</strong> The question form has a title field, a Markdown body editor with live preview, and a tag input (autocomplete from the tag taxonomy, max 5 tags per question). As the user types the title, the system queries for similar existing questions (GET /api/questions/similar?q=&#123;title&#125;) and shows a "Questions that may already have your answer" sidebar. The similarity query runs a full-text search on question titles (Elasticsearch match query with fuzziness) and a semantic search (embedding of the title compared against a FAISS index of existing question embeddings). The top 5 similar questions are shown. If the user acknowledges the duplicates and submits anyway, the question is posted but automatically flagged for moderator review if the semantic similarity score to an existing question exceeds 0.95.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Voting and reputation system:</strong> Upvoting a question: +5 reputation to the question author. Upvoting an answer: +10 reputation to the answer author. Downvoting an answer: -2 reputation to the answer author, -1 to the voter (voting costs reputation to prevent abuse). Accepting an answer: +15 to the answer author, +2 to the question asker. Reputation scores are stored in the users table and updated atomically with the vote record in the same transaction (to prevent reputation without a corresponding vote record). Votes are idempotent — clicking upvote twice undoes the upvote (toggle). Vote fraud detection runs daily: users who have received more than 5 upvotes from the same user in 24 hours have those votes invalidated and reputation reversed.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Answer ranking algorithm:</strong> The answers on a question page are sorted by: (1) the accepted answer (pinned to top, if any); (2) answer score (upvotes − downvotes); (3) recency (newer answers above equal-scored older answers). The ranking is computed at read time — answers are fetched with their vote counts and sorted in application code. The "accepted" status can only be set by the question author. For old questions where the accepted answer is outdated, the community can vote to un-accept (if &gt;10 upvotes on an alternative answer vs. the accepted answer), but this is rare and requires moderator action. The answer list re-sorts when new votes arrive (triggered by SWR revalidation on focus).</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Tag taxonomy and filtering:</strong> Tags are pre-defined (not free-form) with a canonical name, description, wiki page, and usage count. Common tags: javascript, python, react, sql, etc. The tag taxonomy is maintained by moderators — creating a new tag requires 1,500 reputation or moderator approval. The question feed can be filtered by tag (AND logic for multiple tags: questions tagged both javascript AND react). Tag pages (e.g., /tags/javascript) show all questions for that tag, sorted by "Newest", "Votes", or "Unanswered." Tags are indexed in Elasticsearch with the question documents, so tag filtering is a terms filter applied alongside the full-text query.</HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Full-text search with semantic similarity:</strong> Search is powered by a dual-index approach: an Elasticsearch index (BM25 relevance ranking) for keyword search and a vector search layer for semantic similarity. The search query hits both: Elasticsearch returns results ranked by BM25 + tag boost (questions tagged with the search term get a 1.5× boost) + vote score (questions with higher score rank higher, mixed in as a factor via function_score); the vector layer returns the top 10 semantically similar questions (cosine similarity against the query embedding). The two result sets are interleaved using Reciprocal Rank Fusion (RRF) to produce the final ranked list. Search results display: question title, tags, vote count, answer count, accepted status, and last activity date.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Notification system:</strong> Users are notified of: (1) new answer on their question; (2) new comment on their post; (3) mention in a comment (@username); (4) answer accepted by the question author; (5) badge awarded; (6) vote fraud reversal. Notifications are stored in a notifications table and delivered via: in-app notification bell (polling every 60 seconds or WebSocket push), email (batched: immediate for accepted answer, hourly digest for comments), and browser push (opt-in, VAPID). The notification count badge on the user avatar is updated in real-time via WebSocket for active sessions.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Moderation queue:</strong> Posts flagged by users (as spam, rude, or off-topic) enter a moderation queue. Three flags from users with &gt;500 reputation on a post triggers automatic hiding (the post is hidden from the question page but still accessible via direct link and to moderators). Moderators see: the flagged post, the flag reasons from flaggers, and action buttons (dismiss flag, delete post, warn author, suspend author). Deleted posts are soft-deleted (status=deleted, hidden from public views, visible to moderators). Post edit history is an append-only audit log — every edit is stored with the editor's identity and diff from the previous version.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Badge award engine:</strong> Badges are awarded for milestones: "Nice Answer" (first answer with 10+ upvotes), "Good Answer" (25+ upvotes), "Great Answer" (100+ upvotes), "Curious" (5 consecutive days with a question), "Famous Question" (10K views), etc. The badge engine runs as a batch job triggered by events: on each upvote, the system checks if the new vote count crosses any badge thresholds for the answer author. Badges are idempotent — each badge is awarded at most once per type per user (no duplicate "Nice Answer" badges for the same user). Badges that depend on view counts or streaks are checked by a nightly cron job rather than on every event.</HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="crucial">The Q&A platform has three core services: the content service (question/answer CRUD, tag management, edit history), the reputation service (votes, reputation scores, fraud detection), and the search service (Elasticsearch indexing, vector search, query API). These are backed by a PostgreSQL primary database with read replicas for analytics and search indexing. Elasticsearch maintains a derived index of all questions and answers — changes to the content service are propagated to Elasticsearch via a change data capture (CDC) pipeline using Debezium (PostgreSQL WAL → Kafka → Elasticsearch sink connector).</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">The frontend is a Next.js app with ISR for question pages (revalidation on vote or edit events) and full SSR for the feed and user profile pages (dynamic, personalized). Question pages have a high cache hit rate because most traffic is from search engine indexing and returning users viewing specific questions — ISR with on-demand revalidation (triggered when an answer is added or a vote crosses a threshold) is the right tradeoff.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/knowledge-content-systems/qa-system-stackoverflow.svg"
          alt="Q&A system architecture: question posting with real-time duplicate detection (Elasticsearch BM25 + vector FAISS similarity); Markdown editor with live preview; voting system with atomic reputation update in same transaction; answer ranking (accepted first, then vote score, then recency); dual search (BM25 + RRF with vector results); moderation queue (3 flags auto-hide); badge engine (event-triggered threshold check); notification via WebSocket + email digest + browser push; CDC pipeline (PostgreSQL WAL → Kafka → Elasticsearch)."
          caption="Duplicate detection (Elasticsearch + vector FAISS, similarity &gt;0.95 auto-flag), voting + reputation (atomic transaction, fraud detection daily), answer ranking (accepted → score → recency), dual search (BM25 + RRF vector fusion), moderation queue (3-flag auto-hide), badge engine (event-triggered), notifications (WebSocket + email digest)"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Voting Integrity and Fraud Detection</h3>
        <HighlightBlock as="p" tier="crucial">Vote fraud is the primary integrity threat on the platform. The fraud detection system runs a daily batch job that identifies suspicious voting patterns: (1) serial voting — user A upvoted user B's last 10 answers in a 10-minute window (likely vote ring or self-upvoting via sock puppet); (2) targeted downvoting — user A downvoted 5+ posts from user B in a single day (personal grudge campaign); (3) account cluster voting — a cluster of new accounts (created within the same week, same IP range) that exclusively upvote each other. When a fraudulent voting pattern is detected: the votes are invalidated (deleted from the votes table), reputation is reversed (atomic transaction), and the affected users receive a notification ("We detected and reversed voting irregularities on your account").</HighlightBlock>
        <HighlightBlock as="p" tier="important">Vote reversal after user deletion: when a user's account is deleted (or suspended), all their votes are preserved — removing votes on account deletion would cause reputation instability (popular answers losing points because one voter was banned). Only fraudulent votes (identified by the fraud detector) are reversed.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Search Architecture: BM25 + Vector Fusion</h3>
        <HighlightBlock as="p" tier="important">The Elasticsearch index for questions contains: title (analyzed with the English analyzer — stemming, stop word removal), body (plaintext, analyzed), tags (keyword, not analyzed), voteScore, answerCount, isAnswered, viewCount, and createdAt. The search query is a bool query: should: [match title with boost 3, match body with boost 1], filter: [terms tags if tag filter active], and a function_score that multiplies the text relevance by a saturation function of voteScore (log1p(voteScore) — a question with 100 upvotes ranks higher than 0 upvotes, but the boost saturates to prevent extremely high-voted old questions from dominating new relevant results).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Vector search: question titles are embedded using a sentence-transformer model (e.g., all-MiniLM-L6-v2) at index time and stored in a FAISS index (or pgvector in PostgreSQL). At query time, the search query is embedded and the top-10 nearest neighbors are retrieved. The RRF score for a result at rank r is 1/(60 + r). The final ranking interleaves BM25 results and vector results by summing their RRF scores — documents appearing in both result sets get a boosted combined score.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Question Close and Reopen Workflow</h3>
        <HighlightBlock as="p" tier="important">Questions that are off-topic, too broad, opinion-based, or duplicates can be closed. Close votes: users with &gt;3,000 reputation can cast close votes. Five close votes close the question (no new answers can be added). The close vote reason becomes the close banner shown on the question page: "This question is closed as a duplicate of: [link]." Closed questions can be reopened: five reopen votes (also requiring 3,000 reputation) from users who disagree with the close decision. This bidirectional democratic moderation prevents both over-closing (where expert knowledge is dismissed as "too broad") and keeping clearly off-topic questions open.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">ISR and Cache Strategy for Question Pages</h3>
        <HighlightBlock as="p" tier="important">Each question page is ISR with a 1-hour revalidation. On-demand revalidation is triggered by: a new answer being posted, an answer being accepted, or a vote crossing a multiple of 25 (so that very popular questions don't revalidate on every vote, but update visibly as vote counts change significantly). The question page HTML is cached at the CDN. Dynamic data loaded client-side via SWR (revalidateOnFocus: true): the user's vote state (whether they've upvoted or downvoted), notification count, and the user's login state. This separation ensures that the same CDN-cached page is personalized client-side for each viewer without requiring per-user SSR.</HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">Accepted answer pinning vs. vote-ranked ordering: StackOverflow historically pinned accepted answers to the top regardless of vote score. This caused problems when accepted answers became outdated (the technology changed, a better answer was posted years later). StackOverflow eventually changed this (in 2021) to sort by vote score for signed-in users, keeping accepted pinned only for anonymous users. The system should allow per-question owners to configure accepted-pin behavior, and moderators to override the pin for significantly outdated accepted answers.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Reputation gating vs. inclusivity: reputation-gating moderation actions (edit without review, close votes, delete) ensures quality but creates a barrier for new users whose contributions would improve content. The right calibration: keep the gating for destructive actions (delete, close) but lower it for constructive actions (suggest edits, flag for review). New users should be empowered to contribute high-quality answers that the community upvotes — this is the correct reputation acquisition path.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="crucial">A StackOverflow-like Q&A system requires: (1) question posting with real-time duplicate detection (Elasticsearch BM25 + FAISS vector similarity, similarity &gt;0.95 → auto-flag); (2) Markdown editor with live preview and server-side Shiki code highlighting; (3) voting + reputation (atomic transaction, per-vote reputation delta, fraud detection daily batch — serial voting, targeted downvotes, account cluster); (4) answer ranking (accepted first → vote score → recency, SWR revalidation on focus); (5) dual search (Elasticsearch function_score BM25 + RRF fusion with vector nearest neighbors); (6) moderation queue (3-flag auto-hide, soft-delete, edit audit log, close/reopen democratic voting at 3K rep); (7) badge engine (event-triggered threshold checks for answer badges, nightly cron for view count and streak badges); (8) notifications (WebSocket push for active sessions, hourly email digest for comments, browser push opt-in, VAPID); and (9) ISR question pages (&gt;95% CDN hit, on-demand revalidation on new answer or significant vote count change, dynamic user state via client-side SWR). The core principle: the voting and reputation system is the product — everything else serves to make voting more accurate and harder to manipulate.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
