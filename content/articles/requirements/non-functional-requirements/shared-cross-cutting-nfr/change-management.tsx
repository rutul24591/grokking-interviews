"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-shared-nfr-change-management-extensive",
  title: "Change Management",
  description: "Comprehensive guide to change management, covering change control processes, risk assessment, rollout planning, communication strategies, and organizational change for staff/principal engineer interviews.",
  category: "shared-cross-cutting-nfr",
  subcategory: "nfr",
  slug: "change-management",
  version: "extensive",
  wordCount: 9000,
  readingTime: 36,
  lastUpdated: "2026-03-19",
  tags: ["advanced", "nfr", "change-management", "deployment", "risk", "communication"],
  relatedTopics: ["feature-rollout", "versioning", "incident-response"],
};

export default function ChangeManagementArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Change Management</strong> encompasses the processes, tools, and practices for managing
          changes to systems, infrastructure, and processes in a controlled,低风险 manner. In complex
          distributed systems, uncontrolled changes are a leading cause of incidents. Change management
          balances velocity with stability.
        </p>
        <p>
          Change management applies to code deployments, infrastructure changes, configuration updates,
          database migrations, and process changes. The rigor should be proportional to risk — a typo fix
          doesn&apos;t need the same process as a database schema change.
        </p>
        <p>
          <strong>Key principles:</strong>
        </p>
        <ul>
          <li><strong>Risk-Based:</strong> More rigorous process for higher-risk changes.</li>
          <li><strong>Documented:</strong> What, why, when, who, rollback plan.</li>
          <li><strong>Tested:</strong> Changes tested in staging before production.</li>
          <li><strong>Reversible:</strong> Clear rollback plan for every change.</li>
          <li><strong>Communicated:</strong> Stakeholders informed of changes and impact.</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Change Is the Primary Cause of Incidents</h3>
          <p>
            Studies show 70%+ of incidents are caused by changes. Change management isn&apos;t bureaucracy —
            it&apos;s risk mitigation. The goal isn&apos;t to prevent all changes, but to make changes
            safely and recover quickly when they go wrong.
          </p>
        </div>
      </section>

      <section>
        <h2>Change Classification</h2>
        
        <h3 className="mt-8 mb-4 text-xl font-semibold">Standard Changes</h3>
        <p>Pre-approved, low-risk, routine changes:</p>
        <ul>
          <li>Deploying known-good code through pipeline</li>
          <li>Scaling infrastructure (auto-scaling)</li>
          <li>Restarting services</li>
        </ul>
        <p><strong>Process:</strong> Automated, no approval needed.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Normal Changes</h3>
        <p>Moderate-risk changes requiring review:</p>
        <ul>
          <li>New feature deployments</li>
          <li>Database schema changes</li>
          <li>Configuration changes</li>
        </ul>
        <p><strong>Process:</strong> Peer review, change advisory board (CAB) for high-impact.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Emergency Changes</h3>
        <p>Urgent changes to fix incidents:</p>
        <ul>
          <li>Hotfixes for critical bugs</li>
          <li>Security patches</li>
          <li>Incident mitigation</li>
        </ul>
        <p><strong>Process:</strong> Expedited approval, retroactive documentation.</p>
      </section>

      <section>
        <h2>Change Control Process</h2>
        <ol className="list-decimal pl-6 space-y-3">
          <li>
            <strong>Request:</strong> Submit change request with description, justification, risk assessment.
          </li>
          <li>
            <strong>Review:</strong> Technical review by peers, security review if applicable.
          </li>
          <li>
            <strong>Approval:</strong> CAB or designated approver based on risk level.
          </li>
          <li>
            <strong>Schedule:</strong> Plan timing (avoid peak hours, holidays, other changes).
          </li>
          <li>
            <strong>Test:</strong> Validate in staging environment.
          </li>
          <li>
            <strong>Implement:</strong> Execute change with monitoring.
          </li>
          <li>
            <strong>Verify:</strong> Confirm success, monitor for issues.
          </li>
          <li>
            <strong>Document:</strong> Record outcome, update runbooks if needed.
          </li>
        </ol>
      </section>

      <section>
        <h2>Risk Assessment</h2>
        <p>Factors to consider:</p>
        <ul>
          <li><strong>Impact:</strong> How many users/services affected?</li>
          <li><strong>Complexity:</strong> How many components involved?</li>
          <li><strong>Reversibility:</strong> How easy to rollback?</li>
          <li><strong>Testing:</strong> How well tested is the change?</li>
          <li><strong>Timing:</strong> Peak hours? Near other changes?</li>
          <li><strong>Experience:</strong> Has this change been done before?</li>
        </ul>
        <p><strong>Risk Matrix:</strong> Score each factor (1-5), total determines approval level.</p>
      </section>

      <section>
        <h2>Rollout Planning</h2>
        <ul>
          <li><strong>Phased Rollout:</strong> Canary, then percentage, then full.</li>
          <li><strong>Feature Flags:</strong> Enable/disable without redeploy.</li>
          <li><strong>Monitoring:</strong> Define success metrics, alert thresholds.</li>
          <li><strong>Rollback Criteria:</strong> When to abort (error rate, latency, business metrics).</li>
          <li><strong>Communication:</strong> Status updates to stakeholders.</li>
          <li><strong>Post-Implementation:</strong> Verify success, document learnings.</li>
        </ul>
      </section>

      <section>
        <h2>Change Freeze</h2>
        <p>
          Periods when changes are restricted:
        </p>
        <ul>
          <li><strong>Holidays:</strong> Black Friday, Christmas, major events.</li>
          <li><strong>End of Quarter:</strong> Financial reporting periods.</li>
          <li><strong>Major Events:</strong> Product launches, marketing campaigns.</li>
        </ul>
        <p><strong>Exceptions:</strong> Security patches, critical bug fixes (with elevated approval).</p>
      </section>

      <section>
        <h2>Organizational Change</h2>
        <p>
          Managing people-side of change:
        </p>
        <ul>
          <li><strong>Communication:</strong> Why the change, what&apos;s in it for them.</li>
          <li><strong>Training:</strong> Skills needed for new way of working.</li>
          <li><strong>Champions:</strong> Early adopters who advocate for change.</li>
          <li><strong>Feedback:</strong> Listen to concerns, adjust approach.</li>
          <li><strong>Celebration:</strong> Recognize successes, share wins.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a change advisory board (CAB)?</p>
            <p className="mt-2 text-sm">
              A: Group that reviews and approves high-risk changes. Includes representatives from engineering,
              operations, security, and business. Meets regularly (weekly) to review change requests, assess
              risk, and approve/reject. For agile teams, consider async CAB or delegated approval.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you balance velocity with change control?</p>
            <p className="mt-2 text-sm">
              A: Risk-based approach — standard changes automated and pre-approved, normal changes get
              lightweight review, high-risk changes get full CAB. Use feature flags for gradual rollout.
              Invest in testing and staging environments to catch issues early. Measure change failure rate.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What should be in a change request?</p>
            <p className="mt-2 text-sm">
              A: Description of change, business justification, risk assessment, rollback plan, test results,
              implementation timeline, communication plan, success criteria, contacts. Enough detail that
              someone else could execute if needed.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle emergency changes?</p>
            <p className="mt-2 text-sm">
              A: Expedited process — verbal approval from on-call manager, implement fix, document
              retroactively. Post-incident review includes whether emergency process was followed and
              what could be improved. Emergency changes should be rare — if frequent, fix the process.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
