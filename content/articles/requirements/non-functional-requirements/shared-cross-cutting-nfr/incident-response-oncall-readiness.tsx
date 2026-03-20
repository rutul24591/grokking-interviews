"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-shared-nfr-incident-response-oncall-extensive",
  title: "Incident Response & On-call Readiness",
  description: "Comprehensive guide to incident response, on-call practices, runbooks, post-mortems, and building resilient on-call culture for staff/principal engineer interviews.",
  category: "shared-cross-cutting-nfr",
  subcategory: "nfr",
  slug: "incident-response-oncall-readiness",
  version: "extensive",
  wordCount: 10000,
  readingTime: 40,
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
          sustainable engineer wellbeing. For staff and principal engineers, building effective incident
          response capabilities is a critical leadership responsibility.
        </p>
        <p>
          Industry data shows that high-performing organizations have:
        </p>
        <ul>
          <li><strong>Lower MTTR:</strong> Mean Time To Recovery measured in minutes, not hours.</li>
          <li><strong>Better On-call Health:</strong> Sustainable page rates, low burnout.</li>
          <li><strong>Learning Culture:</strong> Every incident drives improvement.</li>
        </ul>
        <p>
          <strong>Key principles:</strong>
        </p>
        <ul>
          <li><strong>Detect Fast:</strong> Mean Time To Detect (MTTD) should be minutes, not hours.</li>
          <li><strong>Respond Quickly:</strong> Mean Time To Acknowledge (MTTA) and Resolve (MTTR).</li>
          <li><strong>Clear Roles:</strong> Incident Commander, Communications, Operations.</li>
          <li><strong>Document Everything:</strong> Runbooks, post-mortems, decision logs.</li>
          <li><strong>Learn & Improve:</strong> Every incident is a learning opportunity.</li>
          <li><strong>Blameless:</strong> Focus on systems, not individuals.</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/incident-response-process.svg"
          alt="Incident Response Process flowchart showing detection to resolution"
          caption="Incident Response Process: From detection through triage, response, resolution, and post-mortem with feedback loops for continuous improvement."
        />

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Incidents Are Inevitable</h3>
          <p>
            The question isn&apos;t if you&apos;ll have an incident, but when. Invest in incident response
            before you need it. The time to build the fire department is before the fire, not during.
            High-performing organizations treat incidents as learning opportunities, not failures.
          </p>
        </div>
      </section>

      <section>
        <h2>Incident Severity Levels</h2>
        <p>
          Clear severity definitions ensure appropriate response and resource allocation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SEV-1 (Critical)</h3>
        <p>
          Complete service outage, data loss, or security breach affecting all users.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Impact</h4>
        <ul>
          <li>Complete service unavailability</li>
          <li>Data loss or corruption</li>
          <li>Security breach with user impact</li>
          <li>Revenue-impacting outage</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Response</h4>
        <ul>
          <li>Response time: &lt; 15 minutes</li>
          <li>All hands on deck</li>
          <li>Executive notification</li>
          <li>Status page update immediately</li>
          <li>War room activated</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Examples</h4>
        <ul>
          <li>Site completely down</li>
          <li>Database corruption</li>
          <li>Credential leak</li>
          <li>Payment processing down</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SEV-2 (High)</h3>
        <p>
          Major feature broken, significant user impact.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Impact</h4>
        <ul>
          <li>Core functionality unavailable</li>
          <li>Significant performance degradation</li>
          <li>Partial service outage</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Response</h4>
        <ul>
          <li>Response time: &lt; 30 minutes</li>
          <li>On-call + relevant team members</li>
          <li>Manager notification</li>
          <li>Status page update within 30 minutes</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Examples</h4>
        <ul>
          <li>Checkout failing for some users</li>
          <li>Search not working</li>
          <li>Mobile app crashing</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SEV-3 (Medium)</h3>
        <p>
          Partial degradation, limited user impact.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Impact</h4>
        <ul>
          <li>Non-core features affected</li>
          <li>Minor performance issues</li>
          <li>Limited user segment affected</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Response</h4>
        <ul>
          <li>Response time: &lt; 2 hours</li>
          <li>On-call handles</li>
          <li>Team notification</li>
          <li>Status page if customer-facing</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Examples</h4>
        <ul>
          <li>Slow dashboard loading</li>
          <li>Email notifications delayed</li>
          <li>Reports generating slowly</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SEV-4 (Low)</h3>
        <p>
          Minor impact, cosmetic issues, or internal tool problems.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Impact</h4>
        <ul>
          <li>Cosmetic issues</li>
          <li>Internal tools affected</li>
          <li>Minor inconvenience</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Response</h4>
        <ul>
          <li>Response time: Next business day</li>
          <li>Ticket created</li>
          <li>Normal prioritization</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Examples</h4>
        <ul>
          <li>Typo on landing page</li>
          <li>Internal dashboard bug</li>
          <li>Minor UI glitch</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/incident-command-structure.svg"
          alt="Incident Command Structure showing roles and responsibilities"
          caption="Incident Command Structure: Clear role separation with Incident Commander coordinating Operations, Communications, and Scribe functions."
        />

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Severity Can Change</h3>
          <p>
            Incidents can escalate or de-escalate. Start with appropriate severity based on initial
            information, but be ready to adjust. It&apos;s better to over-escalate initially than
            under-escalate and lose response time.
          </p>
        </div>
      </section>

      <section>
        <h2>Incident Response Process</h2>
        <p>
          A structured process ensures consistent, effective response to incidents.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Phase 1: Detection</h3>
        <p>
          How the incident is discovered:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Detection Sources</h4>
        <ul>
          <li><strong>Monitoring Alerts:</strong> Automated alerts from monitoring systems.</li>
          <li><strong>User Reports:</strong> Support tickets, social media, direct contact.</li>
          <li><strong>Internal Reports:</strong> Engineers noticing issues.</li>
          <li><strong>Synthetic Monitoring:</strong> Automated health checks failing.</li>
          <li><strong>Third-party Notifications:</strong> Vendors reporting issues.</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Best Practices</h4>
        <ul>
          <li>Multiple detection methods (don&apos;t rely on single source)</li>
          <li>Alert on symptoms, not causes</li>
          <li>Minimize false positives (alert fatigue is real)</li>
          <li>Clear alert messages with context</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Phase 2: Triage</h3>
        <p>
          Initial assessment and response setup:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Triage Steps</h4>
        <ol>
          <li>Acknowledge the alert</li>
          <li>Assess severity based on impact</li>
          <li>Assign Incident Commander</li>
          <li>Page appropriate responders</li>
          <li>Create incident channel/thread</li>
          <li>Start incident timer</li>
        </ol>
        <h4 className="mt-4 mb-2 font-semibold">Triage Questions</h4>
        <ul>
          <li>What&apos;s the user impact?</li>
          <li>How many users affected?</li>
          <li>What features are impacted?</li>
          <li>Are there any recent changes?</li>
          <li>Is this a known issue?</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Phase 3: Response</h3>
        <p>
          Active incident management:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Response Activities</h4>
        <ul>
          <li>Investigate root cause</li>
          <li>Implement mitigation (restore service first)</li>
          <li>Communicate status to stakeholders</li>
          <li>Document decisions and actions</li>
          <li>Coordinate across teams if needed</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Key Principle</h4>
        <p><strong>Restore service first, fix root cause second.</strong> Mitigation before prevention.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Phase 4: Resolution</h3>
        <p>
          Incident resolved and service restored:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Resolution Steps</h4>
        <ol>
          <li>Confirm fix is working</li>
          <li>Verify monitoring shows recovery</li>
          <li>Update status page to resolved</li>
          <li>Notify stakeholders</li>
          <li>Stand down responders</li>
          <li>Schedule post-mortem</li>
        </ol>
        <h4 className="mt-4 mb-2 font-semibold">Verification</h4>
        <ul>
          <li>Check key metrics (error rate, latency)</li>
          <li>Verify user-facing functionality</li>
          <li>Confirm no cascading issues</li>
          <li>Monitor for regression</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Phase 5: Post-Mortem</h3>
        <p>
          Learn and improve from the incident:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Post-Mortem Timeline</h4>
        <ul>
          <li><strong>Within 24 hours:</strong> Initial summary, thank responders</li>
          <li><strong>Within 48 hours:</strong> Post-mortem meeting</li>
          <li><strong>Within 1 week:</strong> Final post-mortem document</li>
          <li><strong>Ongoing:</strong> Track action item completion</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Mitigation Before Prevention</h3>
          <p>
            During an incident, the priority is restoring service, not fixing the root cause. A rollback
            that restores service is better than a perfect fix that takes hours. Fix the root cause
            after service is stable.
          </p>
        </div>
      </section>

      <section>
        <h2>Incident Roles</h2>
        <p>
          Clear role separation enables effective incident response. Each role has specific
          responsibilities.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Incident Commander (IC)</h3>
        <p>
          Owns the incident, coordinates all response activities.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Responsibilities</h4>
        <ul>
          <li>Coordinate response efforts</li>
          <li>Make key decisions</li>
          <li>Assign tasks to responders</li>
          <li>Manage stakeholder communication</li>
          <li>Decide when to escalate</li>
          <li>Declare incident resolved</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Key Skills</h4>
        <ul>
          <li>Calm under pressure</li>
          <li>Clear communication</li>
          <li>Decision-making with incomplete information</li>
          <li>Delegation</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">What IC Does NOT Do</h4>
        <ul>
          <li>Debug issues directly</li>
          <li>Implement fixes</li>
          <li>Write communications (delegates to Comms Lead)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Operations Lead</h3>
        <p>
          Technical lead for the incident, drives investigation and fix.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Responsibilities</h4>
        <ul>
          <li>Lead technical investigation</li>
          <li>Coordinate debugging efforts</li>
          <li>Propose and implement fixes</li>
          <li>Verify resolution</li>
          <li>Report technical status to IC</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Key Skills</h4>
        <ul>
          <li>Deep system knowledge</li>
          <li>Debugging expertise</li>
          <li>Technical decision-making</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Communications Lead</h3>
        <p>
          Manages all external and internal communication.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Responsibilities</h4>
        <ul>
          <li>Update status page</li>
          <li>Communicate with customers</li>
          <li>Update internal stakeholders</li>
          <li>Manage social media response</li>
          <li>Prepare customer-facing communications</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Key Skills</h4>
        <ul>
          <li>Clear, concise writing</li>
          <li>Stakeholder management</li>
          <li>Knowing what to communicate when</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Scribe</h3>
        <p>
          Documents the incident timeline and decisions.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Responsibilities</h4>
        <ul>
          <li>Record timeline of events</li>
          <li>Document decisions made</li>
          <li>Track action items</li>
          <li>Take notes during war room</li>
          <li>Prepare incident summary</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Key Skills</h4>
        <ul>
          <li>Fast, accurate note-taking</li>
          <li>Attention to detail</li>
          <li>Understanding technical discussions</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Role Handoff</h3>
        <p>
          For long incidents, roles may need to be handed off:
        </p>
        <ul>
          <li>IC shift change every 4-6 hours</li>
          <li>Brief incoming person thoroughly</li>
          <li>Document current status and open questions</li>
          <li>Outgoing person stays available for questions</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: One Person, One Role</h3>
          <p>
            During an incident, each person should have exactly one role. The IC should not be debugging.
            The Operations Lead should not be writing status updates. Role clarity prevents confusion
            and ensures all necessary functions are covered.
          </p>
        </div>
      </section>

      <section>
        <h2>Runbooks</h2>
        <p>
          Runbooks are documented procedures for responding to common incidents. They enable any on-call
          engineer to respond effectively, not just the person who wrote the runbook.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Runbook Components</h3>
        <h4 className="mt-4 mb-2 font-semibold">Header Information</h4>
        <ul>
          <li>Runbook title and ID</li>
          <li>Last updated date and owner</li>
          <li>Related services and dependencies</li>
          <li>Severity levels this applies to</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Symptom Description</h4>
        <ul>
          <li>What alerts trigger this runbook</li>
          <li>What users might experience</li>
          <li>Related symptoms to look for</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Troubleshooting Steps</h4>
        <ul>
          <li>Ordered list of checks to perform</li>
          <li>Expected vs actual results</li>
          <li>Links to relevant dashboards</li>
          <li>Commands to run (with expected output)</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Common Fixes</h4>
        <ul>
          <li>Known solutions for known problems</li>
          <li>Step-by-step fix instructions</li>
          <li>Risk level of each fix</li>
          <li>Rollback procedure if fix fails</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Escalation Path</h4>
        <ul>
          <li>Who to page if initial steps don&apos;t work</li>
          <li>When to escalate (time-based, complexity-based)</li>
          <li>Contact information</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Related Resources</h4>
        <ul>
          <li>Links to dashboards</li>
          <li>Links to logs</li>
          <li>Links to related runbooks</li>
          <li>Links to service documentation</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Runbook Best Practices</h3>
        <ul>
          <li><strong>Test Regularly:</strong> Run fire drills using runbooks.</li>
          <li><strong>Keep Current:</strong> Update after every incident.</li>
          <li><strong>Be Specific:</strong> Exact commands, exact dashboards.</li>
          <li><strong>Include Context:</strong> Why this step, what to look for.</li>
          <li><strong>Executable by Any On-Call:</strong> Not just the author.</li>
          <li><strong>Version Control:</strong> Track changes to runbooks.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Communication Templates</h3>
        <p>
          Pre-written templates for common scenarios:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Initial Status Update</h4>
        <p>
          Template: &quot;We&apos;re investigating reports of [issue]. Users may experience [impact].
          We&apos;re currently [investigating/identifying/implementing a fix]. Next update in [timeframe].&quot;
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Resolution Update</h4>
        <p>
          Template: &quot;The issue has been resolved. Services are recovering. We&apos;ll continue to
          monitor for any recurrence. A post-mortem will be shared within [timeframe].&quot;
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/post-mortem-process.svg"
          alt="Post-Mortem Process showing blameless analysis workflow"
          caption="Post-Mortem Process: Blameless analysis from timeline creation through root cause identification, action items, and follow-up tracking."
        />

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Runbooks Are Living Documents</h3>
          <p>
            Runbooks should evolve with your system. Update them after every incident, after every
            significant change, and review them quarterly. A runbook that&apos;s out of date is worse
            than no runbook—it leads you down the wrong path during an incident.
          </p>
        </div>
      </section>

      <section>
        <h2>On-call Best Practices</h2>
        <p>
          Sustainable on-call practices are essential for engineer wellbeing and effective incident
          response.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Rotation Structure</h3>
        <h4 className="mt-4 mb-2 font-semibold">Rotation Length</h4>
        <ul>
          <li><strong>Weekly:</strong> Most common, manageable duration.</li>
          <li><strong>Bi-weekly:</strong> Fewer handoffs, longer recovery.</li>
          <li><strong>Monthly:</strong> Too long, leads to burnout.</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Team Size</h4>
        <ul>
          <li>Minimum 4 people for weekly rotation (one week per month).</li>
          <li>Ideally 6+ people for sustainable on-call.</li>
          <li>Never solo on-call (always have backup).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Handoff Process</h3>
        <p>
          Formal handoff between on-call shifts:
        </p>
        <ul>
          <li>Review active incidents</li>
          <li>Discuss recent changes</li>
          <li>Highlight any concerns</li>
          <li>Verify alerting is working</li>
          <li>Confirm contact information</li>
          <li>Document handoff in shared channel</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Alert Quality</h3>
        <p>
          Good alerts are actionable and meaningful:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Page Only For</h4>
        <ul>
          <li>User-impacting issues</li>
          <li>Issues requiring immediate human action</li>
          <li>Issues that can&apos;t auto-remediate</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Don&apos;t Page For</h4>
        <ul>
          <li>Self-healing issues</li>
          <li>Informational alerts</li>
          <li>Known issues with existing tickets</li>
          <li>Test alerts</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Compensation & Wellbeing</h3>
        <h4 className="mt-4 mb-2 font-semibold">Compensation</h4>
        <ul>
          <li>On-call stipend or hourly pay</li>
          <li>Time off after heavy incidents</li>
          <li>Comp time for pages during off-hours</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Wellbeing</h4>
        <ul>
          <li>No on-call immediately after late nights</li>
          <li>Mental health support available</li>
          <li>Regular on-call load review</li>
          <li>Opt-out process for personal circumstances</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">On-call Metrics</h3>
        <p>
          Track these to ensure sustainable on-call:
        </p>
        <ul>
          <li><strong>Pages per shift:</strong> Should be reasonable (not nightly pages).</li>
          <li><strong>Sleep disruption:</strong> Track pages during sleep hours.</li>
          <li><strong>Alert false positive rate:</strong> Should be low.</li>
          <li><strong>On-call satisfaction:</strong> Regular surveys.</li>
          <li><strong>Burnout indicators:</strong> Turnover, complaints.</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Sustainable On-call Is a Feature</h3>
          <p>
            On-call shouldn&apos;t be a burden that drives engineers away. Invest in alert quality,
            automation, and runbooks to reduce page volume. Compensate on-call fairly. Track and
            address burnout indicators. Happy on-call engineers respond better to incidents.
          </p>
        </div>
      </section>

      <section>
        <h2>Post-Mortems</h2>
        <p>
          Post-mortems are the primary mechanism for learning from incidents. A good post-mortem drives
          concrete improvements that prevent recurrence.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Blameless Post-Mortem</h3>
        <p>
          Focus on systems and processes, not individuals:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Blameless Principles</h4>
        <ul>
          <li>Focus on &quot;what&quot; and &quot;how&quot; not &quot;who&quot;</li>
          <li>Assume everyone did their best with available information</li>
          <li>Look for systemic causes, not individual mistakes</li>
          <li>Punishment discourages reporting and learning</li>
        </ul>
        <h4 className="mt-4 mb-2 font-semibold">Language Matters</h4>
        <ul>
          <li>Avoid: &quot;John deployed the bad code&quot;</li>
          <li>Use: &quot;The deployment process allowed incorrect code to reach production&quot;</li>
          <li>Avoid: &quot;Ops missed the alert&quot;</li>
          <li>Use: &quot;The alert was noisy and got deprioritized&quot;</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Post-Mortem Document Structure</h3>
        <h4 className="mt-4 mb-2 font-semibold">Summary</h4>
        <ul>
          <li>Brief overview of what happened</li>
          <li>Impact (users affected, duration, severity)</li>
          <li>TL;DR for leadership</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Timeline</h4>
        <ul>
          <li>Detailed minute-by-minute sequence</li>
          <li>When alert fired, when acknowledged</li>
          <li>Key decisions and when made</li>
          <li>When fix deployed, when resolved</li>
          <li>Include timezone for all timestamps</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Root Cause Analysis</h4>
        <ul>
          <li>Primary cause of the incident</li>
          <li>Contributing factors</li>
          <li>5 Whys analysis</li>
          <li>System vulnerabilities exposed</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">What Went Well</h4>
        <ul>
          <li>Response successes to reinforce</li>
          <li>Processes that worked</li>
          <li>Tools that helped</li>
          <li>Individual contributions to recognize</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">What Went Poorly</h4>
        <ul>
          <li>Areas for improvement</li>
          <li>Process gaps</li>
          <li>Tool limitations</li>
          <li>Communication issues</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Action Items</h4>
        <ul>
          <li>Specific, actionable items</li>
          <li>Assigned owners</li>
          <li>Due dates</li>
          <li>Priority levels</li>
          <li>Track to completion</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">5 Whys Analysis</h3>
        <p>
          Iterative technique to find root cause:
        </p>
        <ol>
          <li>Why did the service go down? Database connections exhausted.</li>
          <li>Why were connections exhausted? Connection leak in new deployment.</li>
          <li>Why was there a connection leak? Code didn&apos;t close connections on error path.</li>
          <li>Why didn&apos;t code close connections? Code review missed this case.</li>
          <li>Why did code review miss this? No checklist for resource cleanup.</li>
        </ol>
        <p><strong>Action item:</strong> Add resource cleanup to code review checklist.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Post-Mortem Review</h3>
        <p>
          Ensure post-mortems drive improvement:
        </p>
        <ul>
          <li>Review in team meeting</li>
          <li>Share across organization</li>
          <li>Track action item completion</li>
          <li>Follow up on overdue items</li>
          <li>Celebrate improvements made</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: No Action Items = No Learning</h3>
          <p>
            A post-mortem without action items is just documentation. Every post-mortem should produce
            specific, assigned, time-bound action items. Track completion. The goal is prevention, not
            just understanding.
          </p>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <h3 className="mt-8 mb-4 text-xl font-semibold">Preparation</h3>
        <ul>
          <li>Maintain up-to-date runbooks for all critical services</li>
          <li>Regular fire drills and game days</li>
          <li>On-call training for all engineers</li>
          <li>Test alerting regularly</li>
          <li>Document escalation paths</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">During Incident</h3>
        <ul>
          <li>Follow established process</li>
          <li>Communicate frequently</li>
          <li>Document as you go</li>
          <li>Mitigate first, fix root cause later</li>
          <li>Know when to escalate</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">After Incident</h3>
        <ul>
          <li>Schedule post-mortem within 48 hours</li>
          <li>Write blameless post-mortem</li>
          <li>Track action items to completion</li>
          <li>Share learnings broadly</li>
          <li>Update runbooks based on learnings</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Continuous Improvement</h3>
        <ul>
          <li>Review incident metrics monthly</li>
          <li>Identify patterns across incidents</li>
          <li>Invest in prevention based on data</li>
          <li>Reduce toil through automation</li>
          <li>Regular on-call health surveys</li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul>
          <li>
            <strong>No clear roles:</strong> Everyone tries to do everything. Fix: Assign roles early,
            stick to them.
          </li>
          <li>
            <strong>Poor communication:</strong> Stakeholders in the dark. Fix: Dedicated comms lead,
            regular updates.
          </li>
          <li>
            <strong>Alert fatigue:</strong> Too many pages, ignored alerts. Fix: Page only for actionable
            issues, regular alert review.
          </li>
          <li>
            <strong>Blame culture:</strong> Punishing mistakes discourages reporting. Fix: Blameless
            post-mortems, focus on systems.
          </li>
          <li>
            <strong>No runbooks:</strong> Every incident is ad-hoc. Fix: Document common scenarios,
            test runbooks.
          </li>
          <li>
            <strong>Post-mortem without action:</strong> Documentation without improvement. Fix: Track
            action items, follow up.
          </li>
          <li>
            <strong>Hero culture:</strong> Relying on individuals. Fix: Document processes, cross-train.
          </li>
          <li>
            <strong>Ignoring on-call health:</strong> Burnout, turnover. Fix: Track metrics, compensate
            fairly, reduce pages.
          </li>
          <li>
            <strong>Fixing during incident:</strong> Debugging in production without safeguards. Fix:
            Have rollback ready, test fixes in staging when possible.
          </li>
          <li>
            <strong>No incident taxonomy:</strong> Can&apos;t analyze trends. Fix: Standardize severity,
            categorize incidents.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What makes a good incident commander?</p>
            <p className="mt-2 text-sm">
              A: Calm under pressure, clear communicator, delegates effectively, focuses on coordination
              not debugging, makes decisions with incomplete information, ensures documentation, manages
              stakeholder communication. IC should not be the one debugging—they should be orchestrating.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you reduce alert fatigue?</p>
            <p className="mt-2 text-sm">
              A: Page only for actionable alerts (something a human can do). Use tiers (page, ticket, log).
              Aggregate related alerts. Regular alert review and cleanup. Auto-remediate known issues.
              Track alert metrics (pages per on-call, false positive rate). Involve team in alert tuning.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What should be in a runbook?</p>
            <p className="mt-2 text-sm">
              A: Symptom description, troubleshooting steps (ordered), common fixes, escalation path,
              rollback procedures, communication templates, relevant links (dashboards, logs, related
              services). Should be executable by any on-call engineer, not just the author. Test runbooks
              regularly via fire drills.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a blameless post-mortem?</p>
            <p className="mt-2 text-sm">
              A: Focus on system and process failures, not individual mistakes. Ask &quot;what&quot; and
              &quot;how&quot; not &quot;who&quot;. Assume everyone did their best with available information.
              Goal is learning and prevention, not punishment. Document timeline, root cause, action items
              with owners and deadlines.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle a SEV-1 incident?</p>
            <p className="mt-2 text-sm">
              A: Acknowledge immediately, assess impact, declare SEV-1, page all relevant responders,
              assign IC and roles, open war room, start communicating (status page, stakeholders),
              investigate and mitigate, communicate updates regularly, resolve, schedule post-mortem
              within 48 hours.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for incident response?</p>
            <p className="mt-2 text-sm">
              A: MTTD (Mean Time To Detect), MTTA (Mean Time To Acknowledge), MTTR (Mean Time To Resolve),
              incident count by severity, pages per on-call shift, alert false positive rate, post-mortem
              action item completion rate, on-call satisfaction scores.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul>
          <li>Google SRE Book: Incident Response</li>
          <li>&quot;Accelerate&quot; by Nicole Forsgren et al.</li>
          <li>Atlassian: Incident Management Handbook</li>
          <li>PagerDuty: Incident Response Best Practices</li>
          <li>&quot;The Human Element of On-Call&quot; - Various SRE blogs</li>
          <li>Blameless Post-Mortems: Etsy, GitHub engineering blogs</li>
          <li>ITIL Incident Management</li>
          <li>NIST Incident Response Guide</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}