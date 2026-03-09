"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-stateless-stateful-concise",
  title: "Stateless vs Stateful Services",
  description: "Quick comparison of stateless and stateful services for backend interviews.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "stateless-vs-stateful-services",
  version: "concise",
  wordCount: 1750,
  readingTime: 8,
  lastUpdated: "2026-03-09",
  tags: ["backend", "architecture", "state"],
  relatedTopics: ["horizontal-vs-vertical-scaling", "request-response-lifecycle", "caching-performance"],
};

export default function StatelessStatefulConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Stateless</strong> services store no session data in memory.
          <strong>Stateful</strong> services keep session data on the server.
          Stateless systems scale and recover more easily.
        </p>
        <p>
          The trade-off is simplicity versus performance. Stateless services
          scale out easily but rely on external stores. Stateful services can
          be faster in the short term but create operational complexity when
          you add more nodes.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li>Stateless: requests include all context.</li>
          <li>Stateful: server memory holds session state.</li>
          <li>Sticky sessions needed for stateful systems.</li>
          <li>External session stores (Redis) decouple state from app servers.</li>
          <li>Tokens/JWTs reduce server-side session storage.</li>
        </ul>
        <p className="mt-4">
          A useful rule: if you can kill any server instance without breaking
          active users, you are stateless. If killing one instance drops sessions,
          you are stateful.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Stateless: auth token on every request
GET /me
Authorization: Bearer <token>

// Stateful: server stores session
Set-Cookie: session_id=abc123; HttpOnly; Secure`}</code>
        </pre>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain why stateless simplifies load balancing.</li>
          <li>Discuss external session stores as a compromise.</li>
          <li>Call out failure behavior: stateful servers lose in-memory sessions on restart.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why prefer stateless services at scale?</p>
            <p className="mt-2 text-sm">A: They allow horizontal scaling and simpler failover.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When is stateful acceptable?</p>
            <p className="mt-2 text-sm">A: Small systems or where latency is critical and scale is limited.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you keep sessions in a stateless service?</p>
            <p className="mt-2 text-sm">
              A: Store sessions in Redis or use signed tokens so any instance can serve the request.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
