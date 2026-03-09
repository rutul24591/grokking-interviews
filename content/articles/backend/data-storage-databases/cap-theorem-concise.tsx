"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-cap-theorem-concise",
  title: "CAP Theorem",
  description:
    "Concise guide to CAP theorem trade-offs, practical implications, and interview tips.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "cap-theorem",
  version: "concise",
  wordCount: 1850,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "distributed-systems", "databases", "cap"],
  relatedTopics: [
    "base-properties",
    "read-replicas",
    "database-partitioning",
  ],
};

export default function CapTheoremConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>CAP theorem</strong> states that in the presence of a network
          partition, a distributed system must choose between <strong>Consistency</strong>
          and <strong>Availability</strong>. Partition tolerance is required in
          real networks, so the trade-off is usually CP vs AP.
        </p>
        <p>
          CAP is about behavior during partitions. Outside partitions, many
          systems can provide both consistency and availability.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Consistency:</strong> Every read sees the latest write.</li>
          <li><strong>Availability:</strong> Every request gets a response.</li>
          <li><strong>Partition tolerance:</strong> System continues despite network splits.</li>
          <li><strong>CP systems:</strong> Prefer consistency, may reject requests.</li>
          <li><strong>AP systems:</strong> Prefer availability, may serve stale data.</li>
        </ul>
        <p className="mt-4">
          Real systems choose where they land on the CP/AP spectrum and often
          allow tunable consistency per request.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// CP-style: require majority quorum for reads/writes
const result = await db.read({ consistency: "quorum" });

// AP-style: allow local reads to stay available
const result = await db.read({ consistency: "local" });`}</code>
        </pre>
      </section>

      <section>
        <h2>Pros & Cons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">CP (Consistency)</th>
              <th className="p-3 text-left">AP (Availability)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                ✓ Strong correctness guarantees<br />
                ✓ Predictable reads<br />
                ✓ Safer for financial data
              </td>
              <td className="p-3">
                ✓ Always responds during partitions<br />
                ✓ Better user experience in outages<br />
                ✓ Scales well across regions
              </td>
            </tr>
            <tr>
              <td className="p-3">
                ✗ Lower availability during partitions<br />
                ✗ Higher latency due to coordination
              </td>
              <td className="p-3">
                ✗ Stale reads or conflicts possible<br />
                ✗ Requires reconciliation logic
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Choose CP when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Correctness matters more than uptime</li>
          <li>• You cannot tolerate stale reads</li>
        </ul>
        <p><strong>Choose AP when:</strong></p>
        <ul className="space-y-1">
          <li>• Availability is critical for user experience</li>
          <li>• Eventual consistency is acceptable</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Clarify that CAP applies during partitions, not normal operation.</li>
          <li>Explain CP vs AP trade-offs with examples.</li>
          <li>Mention quorum reads/writes as a tuning mechanism.</li>
          <li>Note that many systems provide configurable consistency levels.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Can a system be CA?</p>
            <p className="mt-2 text-sm">
              A: Only if there are no partitions. In real distributed systems,
              partitions happen, so CA is not achievable.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the difference between CP and AP?</p>
            <p className="mt-2 text-sm">
              A: CP favors consistency and may reject requests during a
              partition; AP favors availability and may return stale data.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Is CAP still relevant today?</p>
            <p className="mt-2 text-sm">
              A: Yes. Networks still partition, and systems must decide how to
              behave when that happens.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do quorum reads relate to CAP?</p>
            <p className="mt-2 text-sm">
              A: Quorum configurations allow systems to trade consistency and
              availability by adjusting read/write thresholds.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
