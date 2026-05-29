"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-learning-platform-course-progress",
  title: "Design a Learning Platform Course Progress System",
  description: "Principal-level knowledge and content system design covering lifecycle, indexing, ranking, moderation, trust, progress, rollback, and observability.",
  category: "high-level-design",
  subcategory: "knowledge-content-systems",
  slug: "learning-platform-course-progress",
  wordCount: 3400,
  readingTime: 20,
  lastUpdated: "2026-05-29",
  tags: ["hld", "knowledge", "content", "search", "moderation", "ranking"],
  relatedTopics: [],
};

const definition = [
  "Design a Learning Platform Course Progress System is a knowledge product system where content quality, authorship, discovery, trust, moderation, and user progress matter as much as rendering pages. A principal-ready answer treats a learning platform progress system as a lifecycle for knowledge objects, not as a CRUD site.",
  "Knowledge objects have versions, authors, visibility, quality signals, policy state, search representation, recommendation features, and sometimes learning or reputation effects. Derived views can lag, but users must understand which content is current, trusted, and accessible.",
  "The design should cover creation, editing, publishing, indexing, ranking, moderation, feedback, analytics, and operational recovery. The hardest problems are usually trust and freshness: bad content can spread, good content can become stale, and search or recommendation systems can keep showing old projections.",
  "A staff/principal interview answer should also separate community/product policy from infrastructure. The system must support policy decisions such as takedown, duplicate closure, accepted answer change, certificate revocation, or paid-content access without hardcoding them into one UI path.",
  "Operationally, knowledge systems need support tooling to reconstruct why a user saw content, why progress changed, why an answer ranked highly, or why a piece of content was removed."
];
const concepts = [
  "The first concept is content lifecycle. Draft, submitted, published, edited, archived, deleted, blocked, and appealed states need explicit transitions and audit history.",
  "The second concept is derived discovery. recommendation engine and recommendation surfaces should use versioned content, policy state, and quality signals. Search results that ignore takedowns or stale versions create trust failures.",
  "The third concept is quality and reputation. Votes, reads, completions, comments, reports, editor picks, author reputation, and freshness can influence ranking, but each signal can be gamed or biased.",
  "The fourth concept is consistency. Authoritative content state, access control, paid entitlement, takedown decisions, and course completion records need stronger consistency than search index, feed ranking, or analytics projections.",
  "The fifth concept is moderation and governance. Community reports, automated classifiers, editorial workflows, plagiarism checks, duplicate detection, and appeals should produce durable policy decisions.",
  "The sixth concept is observability. Track publishing failures, indexing lag, ranking experiments, moderation queue age, stale-content reports, progress drift, fraud signals, and search zero-result rates."
];
const architecture = [
  "The architecture contains course catalog, lesson state, progress ledger, recommendation engine, certificate workflow. The write path records durable content or learning events. The processing path builds derived artifacts: rendered pages, snippets, search documents, recommendation features, progress summaries, and moderation queues. The read path serves personalized or permissioned views.",
  "Content writes should be versioned. Edits should not silently mutate search, notifications, certificates, or historical audit views without a version decision. Versioning also supports rollback after bad edits, spam waves, or rendering regressions.",
  "Indexing should be asynchronous but observable. Each content version should know whether it is indexed, searchable, recommended, blocked, or stale. Users and operators need different levels of this state.",
  "Ranking should combine relevance, quality, freshness, personalization, safety, and policy. Principal designs avoid optimizing a single metric such as click-through because it can reward clickbait, outdated answers, or low-quality learning paths.",
  "The frontend should expose trustworthy state: draft saved, published, under review, blocked, stale, completed, in progress, certificate pending, or access restricted. These states are product semantics, not generic loading spinners.",
  "Operational controls should include index rebuild, content rollback, moderation override, feature-flagged ranking, duplicate merge, progress repair, and certificate revocation with audit trail."
];
const tradeoffs = [
  "Synchronous indexing gives fast search freshness but slows writes and couples publishing to search availability. Asynchronous indexing improves write reliability but creates lag. The answer should include index status, freshness metrics, and fallback behavior for newly published content.",
  "Open contribution increases knowledge growth but increases spam, plagiarism, misinformation, and moderation load. Curated contribution improves quality but slows content coverage and may centralize bias.",
  "Personalized recommendations improve engagement and learning continuity, but they can hide high-quality canonical content or trap users in narrow paths. Ranking needs diversity, freshness, and explicit user controls.",
  "Strong consistency for progress or paid access protects trust and compliance. Eventual consistency is acceptable for read counts, recommendation features, and analytics. Accepted answers, certificate issuance, and entitlement checks need durable server confirmation.",
  "Community moderation scales better than staff-only review but can be brigaded or biased. Automated moderation is fast but error-prone. Mature systems combine reputation weighting, classifier triage, staff escalation, and appeals.",
  "Detailed author and learner analytics help improve content but create privacy risk. Telemetry should avoid exposing private reading behavior unnecessarily and should respect consent and enterprise policy."
];
const practices = [
  "Represent content, answer, lesson, progress, and certificate state with explicit lifecycle transitions and audit history.",
  "Make derived artifacts version-aware: rendered HTML, snippets, search documents, recommendation features, notifications, and certificates should point to the content or progress version that produced them.",
  "Track indexing and recommendation lag as product metrics. Users do not care that a queue is delayed; they care that published content is missing or stale.",
  "Use abuse controls for posting, voting, reporting, progress completion, and certificate issuance. Reputation and rate limits should protect both content quality and platform integrity.",
  "Build moderation and support views with evidence, actor history, policy version, appeal state, and safe redaction of private data.",
  "Design rollback. Bad content, bad ranking, bad certificate logic, or bad search indexing needs a reversible operational path.",
  "Measure quality beyond engagement: helpfulness, accepted-answer freshness, completion validity, report rate, stale reports, and long-term retention."
];
const pitfalls = [
  "progress drift becomes a platform problem when ranking or recommendations amplify it. The architecture needs prevention, detection, demotion, removal, and appeal.",
  "cheating often reflects missing governance in content identity. Duplicate detection, canonicalization, merge workflows, and redirect policy are core system behavior.",
  "offline sync conflict happens when derived projections are treated as secondary. Search, feeds, notifications, and certificates can all expose stale or unsafe state.",
  "certificate fraud is dangerous because users make decisions based on trust. Knowledge systems should show freshness, policy state, and authoritative source where needed.",
  "Another pitfall is allowing analytics to drive ranking without integrity checks. Clicks and completions can be noisy, fraudulent, or biased toward shallow content.",
  "Teams also forget accessibility and internationalization. Knowledge systems often contain long-form text, code, captions, transcripts, and learning flows that must work for diverse users."
];
const useCases = [
  "online course player needs durable content state, quality signals, search or recommendation projection, and policy-aware visibility.",
  "enterprise training portal needs durable content state, quality signals, search or recommendation projection, and policy-aware visibility.",
  "exam preparation path needs durable content state, quality signals, search or recommendation projection, and policy-aware visibility.",
  "During a spam attack, the platform should throttle creation, demote suspicious content, pause recommendation of risky items, and preserve review evidence.",
  "During an indexing incident, newly published content should still be accessible by direct URL, while search freshness dashboards and rebuild controls guide recovery.",
  "During a policy dispute, the system should preserve versions, reports, reviewer actions, and appeal history so the decision can be audited."
];
const questions = [
  {
    "question": "How would you design a learning platform progress system end to end?",
    "answer": "I would model knowledge objects with versioned lifecycle state, authorship, visibility, quality signals, and policy state. Writes create durable records and events. Processing builds rendered pages, search documents, recommendations, summaries, and moderation queues. Reads use surface-specific projections with access control. Operations include index rebuild, rollback, moderation override, progress repair, and audit views."
  },
  {
    "question": "Why this architecture over a simple CMS or CRUD model?",
    "answer": "A simple CRUD model cannot explain search freshness, ranking, moderation, version rollback, paid or private access, reputation, or learning progress. Knowledge products rely on derived surfaces, so the architecture must make those surfaces observable and version-aware."
  },
  {
    "question": "What breaks at scale?",
    "answer": "The main failures are progress drift, cheating, offline sync conflict, certificate fraud, plus spam waves, ranking manipulation, search lag, moderation backlog, cache stampedes, and stale recommendations. Prevention requires lifecycle state, abuse controls, async processing with lag metrics, quality signals, and operational rollback."
  },
  {
    "question": "What consistency model applies?",
    "answer": "Authoritative content state, permissions, paid access, takedowns, accepted answers, and certificate issuance need strong server-controlled consistency. Search indexes, recommendations, read counts, and analytics can be eventually consistent if they carry version and freshness signals."
  },
  {
    "question": "How do you handle failure, rollback, abuse, privacy, cost, and observability?",
    "answer": "Failures are handled with direct URL access, index rebuilds, queue retry, content rollback, and support-visible state. Abuse is controlled with rate limits, reputation, classifiers, reports, and moderation. Privacy requires careful analytics and entitlement checks. Cost is controlled by incremental indexing, cache policy, and sampled telemetry. Observability tracks indexing lag, search quality, moderation SLA, progress drift, and ranking experiments."
  },
  {
    "question": "How do you defend trade-offs under interviewer pressure?",
    "answer": "I would separate authoritative knowledge state from derived discovery views. I would defend asynchronous indexing because it protects write reliability, but I would pair it with freshness metrics and direct access. I would defend mixed moderation because community, automation, and staff review each solve different parts of the scale-quality trade-off."
  }
];
const references = [
  {
    "label": "Elasticsearch guide",
    "href": "https://www.elastic.co/guide/index.html"
  },
  {
    "label": "Google Search Central documentation",
    "href": "https://developers.google.com/search/docs"
  },
  {
    "label": "Stack Overflow Engineering blog",
    "href": "https://stackoverflow.blog/engineering/"
  },
  {
    "label": "Google SRE Workbook",
    "href": "https://sre.google/workbook/table-of-contents/"
  },
  {
    "label": "W3C Web Content Accessibility Guidelines",
    "href": "https://www.w3.org/WAI/standards-guidelines/wcag/"
  }
];

export default function LearningPlatformCourseProgressArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section><h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="important">{definition[0]}</HighlightBlock>{definition.slice(1).map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Core Concepts</h2>{concepts.map((item, index) => index === 3 ? <HighlightBlock as="p" tier="crucial" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}</section>
      <section>
        <h2>Architecture &amp; Flow</h2>
        {architecture.map((item, index) => index === 0 ? <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/knowledge-content-systems/learning-platform-course-progress.svg" alt="Design a Learning Platform Course Progress System architecture" caption="Architecture view: content lifecycle, indexing, ranking, moderation, policy, and read surfaces." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/knowledge-content-systems/learning-platform-course-progress-flow.svg" alt="Design a Learning Platform Course Progress System flow" caption="Flow view: creation, processing, discovery, feedback, moderation, and rollback." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/knowledge-content-systems/learning-platform-course-progress-operations.svg" alt="Design a Learning Platform Course Progress System operations" caption="Operations view: index lag, quality signals, abuse controls, policy decisions, and support reconstruction." />
      </section>
      <section><h2>Trade offs &amp; Comparison</h2>{tradeoffs.map((item, index) => index === 0 ? <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}</section>
      <section><h2>Best practices</h2>{practices.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Common Pitfalls</h2>{pitfalls.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Real-world use cases</h2>{useCases.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Common interview question with detailed answer</h2>{questions.map((item) => <div key={item.question} className="mb-6"><h3 className="mb-2 text-lg font-semibold">{item.question}</h3><p>{item.answer}</p></div>)}</section>
      <section><h2>References</h2><ul className="list-disc space-y-2 pl-6">{references.map((item) => <li key={item.href}><a href={item.href} target="_blank" rel="noreferrer" className="text-blue-600 underline dark:text-blue-400">{item.label}</a></li>)}</ul></section>
    </ArticleLayout>
  );
}
