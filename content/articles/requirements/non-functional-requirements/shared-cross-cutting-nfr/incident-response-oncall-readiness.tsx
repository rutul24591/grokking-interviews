"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-shared-nfr-incident-response-oncall-extensive",
  title: "Incident Response & On-call Readiness",
  description: "Comprehensive guide to incident response, on-call practices, runbooks, post-mortems, and building resilient on-call culture for staff/principal engineer interviews.",
  category: "shared-cross-cutting-nfr",
  subcategory: "nfr",
  slug: "incident-response-oncall-readiness",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-19",
  tags: ["advanced", "nfr", "incident-response", "on-call", "sre", "post-mortem", "runbook"],
  relatedTopics: ["chaos-testing", "high-availability", "monitoring-observability"],
};

export default function IncidentResponseOncallReadinessArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Incident Response & On-call Readiness</strong> encompasses the people, processes, and
          tools for detecting, responding to, and recovering from production incidents. No matter how
          well-designed your system, incidents will occur. The difference between a minor blip and a
          catastrophic outage is often the quality of incident response.
        </p>
        <p>
          On-call readiness means engineers are prepared, equipped, and supported when they&apos;re
          responsible for responding to incidents. Good on-call practices balance rapid response with
          sustainable engineer wellbeing.
        </p>
        <p>
          <strong>Key principles:</strong>
        </p>
        <ul>
          <li><strong>Detect Fast:</strong> Mean Time To Detect (MTTD) should be minutes, not hours.</li>
          <li><strong>Respond Quickly:</strong> Mean Time To Acknowledge (MTTA) and Resolve (MTTR).</li>
          <li><strong>Clear Roles:</strong> Incident Commander, Communications, Operations.</li>
          <li><strong>Document Everything:</strong> Runbooks, post-mortems, decision logs.</li>
          <li><strong>Learn & Improve:</strong> Every incident is a learning opportunity.</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Incidents Are Inevitable</h3>
          <p>
            The question isn&apos;t if you&apos;ll have an incident, but when. Invest in incident response
            before you need it. The time to build the fire department is before the fire, not during.
          </p>
        </div>
      </section>

      <section>
        <h2>Incident Severity Levels</h2>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Severity</th>
                <th className="p-2 text-left">Impact</th>
                <th className="p-2 text-left">Response Time</th>
                <th className="p-2 text-left">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">SEV-1 (Critical)</td>
                <td className="p-2">Complete outage, data loss</td>
                <td className="p-2">{'<'} 15 minutes</td>
                <td className="p-2">Site down, breach</td>
              </tr>
              <tr>
                <td className="p-2">SEV-2 (High)</td>
                <td className="p-2">Major feature broken</td>
                <td className="p-2">{'<'} 30 minutes</td>
                <td className="p-2">Checkout failing</td>
              </tr>
              <tr>
                <td className="p-2">SEV-3 (Medium)</td>
                <td className="p-2">Partial degradation</td>
                <td className="p-2">{'<'} 2 hours</td>
                <td className="p-2">Slow performance</td>
              </tr>
              <tr>
                <td className="p-2">SEV-4 (Low)</td>
                <td className="p-2">Minor impact</td>
                <td className="p-2">Next business day</td>
                <td className="p-2">Cosmetic issue</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Incident Response Process</h2>
        <ol className="list-decimal pl-6 space-y-3">
          <li>
            <strong>Detection:</strong> Alert fires, user reports, monitoring detects anomaly.
          </li>
          <li>
            <strong>Triage:</strong> Assess severity, assign incident commander, page appropriate responders.
          </li>
          <li>
            <strong>Response:</strong> Investigate root cause, implement mitigation, communicate status.
          </li>
          <li>
            <strong>Resolution:</strong> Fix deployed, service restored, monitoring confirms recovery.
          </li>
          <li>
            <strong>Post-Mortem:</strong> Document what happened, why, and how to prevent recurrence.
          </li>
        </ol>
      </section>

      <section>
        <h2>Incident Roles</h2>
        <ul>
          <li>
            <strong>Incident Commander (IC):</strong> Owns the incident, coordinates response, makes decisions.
          </li>
          <li>
            <strong>Operations Lead:</strong> Technical lead, drives investigation and fix.
          </li>
          <li>
            <strong>Communications Lead:</strong> Updates stakeholders, customers, status page.
          </li>
          <li>
            <strong>Scribe:</strong> Documents timeline, decisions, actions taken.
          </li>
        </ul>
        <p><strong>Key practice:</strong> One person, one role. IC should not be debugging.</p>
      </section>

      <section>
        <h2>Runbooks</h2>
        <p>
          Documented procedures for common incidents:
        </p>
        <ul>
          <li><strong>Troubleshooting Steps:</strong> What to check, in what order.</li>
          <li><strong>Common Fixes:</strong> Known solutions for known problems.</li>
          <li><strong>Escalation Path:</strong> Who to page if initial steps don&apos;t work.</li>
          <li><strong>Rollback Procedures:</strong> How to revert recent changes.</li>
          <li><strong>Communication Templates:</strong> Pre-written status updates.</li>
        </ul>
        <p><strong>Best practice:</strong> Runbooks should be executable by any on-call engineer, not just the author.</p>
      </section>

      <section>
        <h2>On-call Best Practices</h2>
        <ul>
          <li><strong>Rotation:</strong> Weekly rotations, never solo on-call.</li>
          <li><strong>Handoff:</strong> Formal handoff between shifts (active incidents, recent changes).</li>
          <li><strong>Compensation:</strong> On-call pay, time off after heavy incidents.</li>
          <li><strong>Alert Quality:</strong> Page only for actionable alerts. Reduce noise.</li>
          <li><strong>Tooling:</strong> PagerDuty, Opsgenie, incident management platforms.</li>
          <li><strong>Wellbeing:</strong> No on-call immediately after late nights, mental health support.</li>
        </ul>
      </section>

      <section>
        <h2>Post-Mortems</h2>
        <p>
          Blameless post-mortem structure:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Summary:</strong> What happened, impact, duration.</li>
          <li><strong>Timeline:</strong> Detailed sequence of events (minute by minute).</li>
          <li><strong>Root Cause:</strong> What caused the incident (multiple contributing factors).</li>
          <li><strong>What Went Well:</strong> Response successes to reinforce.</li>
          <li><strong>What Went Poorly:</strong> Areas for improvement.</li>
          <li><strong>Action Items:</strong> Specific, assigned, time-bound improvements.</li>
        </ol>
        <p><strong>Key principle:</strong> Blameless — focus on system failures, not individual mistakes.</p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What makes a good incident commander?</p>
            <p className="mt-2 text-sm">
              A: Calm under pressure, clear communicator, delegates effectively, focuses on coordination
              not debugging, makes decisions with incomplete information, ensures documentation, manages
              stakeholder communication.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you reduce alert fatigue?</p>
            <p className="mt-2 text-sm">
              A: Page only for actionable alerts (something a human can do). Use tiers (page, ticket, log).
              Aggregate related alerts. Regular alert review and cleanup. Auto-remediate known issues.
              Track alert metrics (pages per on-call, false positive rate).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What should be in a runbook?</p>
            <p className="mt-2 text-sm">
              A: Symptom description, troubleshooting steps (ordered), common fixes, escalation path,
              rollback procedures, communication templates, relevant links (dashboards, logs, related
              services). Should be executable by any on-call engineer.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a blameless post-mortem?</p>
            <p className="mt-2 text-sm">
              A: Focus on system and process failures, not individual mistakes. Ask &quot;what&quot; and
              &quot;how&quot; not &quot;who&quot;. Goal is learning and prevention, not punishment. Document
              timeline, root cause, action items with owners and deadlines.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
