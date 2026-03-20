"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-shared-nfr-documentation-quality-extensive",
  title: "Documentation Quality",
  description: "Comprehensive guide to documentation quality, covering API documentation, architecture decision records, runbooks, knowledge management, and docs-as-code for staff/principal engineer interviews.",
  category: "shared-cross-cutting-nfr",
  subcategory: "nfr",
  slug: "documentation-quality",
  version: "extensive",
  wordCount: 10000,
  readingTime: 40,
  lastUpdated: "2026-03-19",
  tags: ["advanced", "nfr", "documentation", "knowledge-management", "adr", "api-docs"],
  relatedTopics: ["change-management", "incident-response", "versioning"],
};

export default function DocumentationQualityArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Documentation Quality</strong> refers to the completeness, accuracy, accessibility, and
          maintainability of technical documentation. Good documentation is a force multiplier—it enables
          rapid onboarding, reduces tribal knowledge, supports effective incident response, preserves
          institutional memory, and accelerates development velocity. Poor documentation creates
          bottlenecks, increases bus factor, slows development, and leads to costly mistakes.
        </p>
        <p>
          Documentation is a product with users (developers, operators, customers, partners). Treat it
          with the same care as code: version control, peer review, automated testing, continuous
          integration/deployment, and regular maintenance. Just as technical debt accumulates when code
          isn&apos;t refactored, documentation debt accumulates when docs aren&apos;t updated—and both
          compound over time.
        </p>
        <p>
          For staff and principal engineers, documentation quality is a leadership concern. You set the
          standards, establish the processes, and model the behaviors that determine whether documentation
          thrives or withers in your organization. The technical decisions you make about documentation
          tools, processes, and culture have lasting impact on organizational effectiveness.
        </p>
        <p>
          <strong>Key documentation types in software engineering:</strong>
        </p>
        <ul>
          <li>
            <strong>API Documentation:</strong> Endpoint reference, request/response schemas,
            authentication, rate limits, error codes, SDKs, and working examples.
          </li>
          <li>
            <strong>Architecture Documentation:</strong> System design, component diagrams, data flows,
            Architecture Decision Records (ADRs), technology choices, and trade-offs.
          </li>
          <li>
            <strong>Operational Documentation:</strong> Runbooks, deployment guides, monitoring setup,
            onboarding guides, troubleshooting procedures, and escalation matrices.
          </li>
          <li>
            <strong>Process Documentation:</strong> Development workflows, code review guidelines,
            release procedures, incident response processes, and team norms.
          </li>
          <li>
            <strong>User Documentation:</strong> Tutorials, how-to guides, FAQs, troubleshooting guides,
            and reference manuals for end users.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/documentation-hierarchy.svg"
          alt="Documentation Hierarchy showing different types and their relationships"
          caption="Documentation Hierarchy: From foundational (API docs, architecture) to operational (runbooks, onboarding) to user-facing (tutorials, guides)."
        />

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Documentation Is Code</h3>
          <p>
            Treat documentation like code: version control in Git, code review via PRs, CI/CD pipelines
            for building and deploying, automated testing for links and examples, and regular refactoring.
            Documentation that isn&apos;t maintained becomes worse than no documentation—it actively
            misleads. The cost of wrong documentation exceeds the cost of no documentation because it
            sends engineers down rabbit holes.
          </p>
        </div>
      </section>

      <section>
        <h2>API Documentation</h2>
        <p>
          API documentation is often the first interaction developers have with your system. Poor API docs
          create friction, increase support burden, and reduce API adoption. Excellent API docs enable
          self-service integration and reduce time-to-first-successful-call.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Essential Components</h3>
        <h4 className="mt-4 mb-2 font-semibold">Authentication & Authorization</h4>
        <ul>
          <li>Authentication Methods: API keys, OAuth 2.0 flows, JWT tokens, basic auth, mTLS.</li>
          <li>Token Management: How to obtain, refresh, and revoke tokens. Token expiration policies.</li>
          <li>Security Best Practices: How to securely store credentials, rotate keys.</li>
          <li>Working Example: Complete authentication flow from start to first authenticated request.</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Endpoint Reference</h4>
        <ul>
          <li>URL Patterns: Base URL, path parameters, query parameters. Environment differences.</li>
          <li>HTTP Methods: Supported methods per endpoint. Idempotency guarantees.</li>
          <li>Request Schema: Required vs optional fields, data types, validation rules.</li>
          <li>Response Schema: Success response structure, error response structure, pagination.</li>
          <li>Examples: Real request/response pairs for common scenarios.</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Error Handling</h4>
        <ul>
          <li>Error Codes: Complete list with descriptions. HTTP status and application-specific codes.</li>
          <li>Error Response Format: Consistent structure across all endpoints.</li>
          <li>Troubleshooting: Common errors and how to resolve them. Retry guidance.</li>
          <li>Rate Limiting: Rate limit headers, quota policies, backoff strategies.</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Versioning & Deprecation</h4>
        <ul>
          <li>Version Strategy: URL versioning, header versioning, or parameter versioning.</li>
          <li>Deprecation Policy: Timeline (minimum 6-12 months notice), migration guides.</li>
          <li>Changelog: What changed in each version, breaking changes highlighted.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Documentation Tools & Standards</h3>
        <h4 className="mt-4 mb-2 font-semibold">OpenAPI Specification (Swagger)</h4>
        <p>
          Industry standard for REST API documentation. Machine-readable YAML/JSON format that can
          generate interactive documentation, client SDKs, and server stubs.
        </p>
        <p><strong>Tools:</strong> Swagger UI, Redoc, Stoplight, ReadMe generate interactive docs.</p>

        <h4 className="mt-4 mb-2 font-semibold">GraphQL Schema</h4>
        <p>
          GraphQL is self-documenting through its type system. Introspection enables tools to generate
          documentation automatically.
        </p>
        <p><strong>Tools:</strong> GraphQL Playground, Apollo Studio, GraphiQL.</p>

        <h4 className="mt-4 mb-2 font-semibold">API Documentation Platforms</h4>
        <ul>
          <li><strong>ReadMe:</strong> Full-featured platform with interactive examples and analytics.</li>
          <li><strong>Stoplight:</strong> Design-first documentation with visual editor and mocking.</li>
          <li><strong>Postman:</strong> Collections as executable documentation.</li>
          <li><strong>GitBook:</strong> General documentation platform with API templates.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Best Practices for API Documentation</h3>
        <ul>
          <li><strong>Single Source of Truth:</strong> Generate docs from OpenAPI spec or code annotations.</li>
          <li><strong>Working Examples:</strong> Provide copy-paste examples in multiple languages.</li>
          <li><strong>Interactive Console:</strong> Allow users to try API calls from documentation.</li>
          <li><strong>Quick Start Guide:</strong> Get users to first successful API call in under 5 minutes.</li>
          <li><strong>SDKs and Client Libraries:</strong> Official SDKs reduce integration friction.</li>
          <li><strong>Changelog:</strong> Maintain detailed changelog with migration guides.</li>
          <li><strong>Feedback Mechanism:</strong> Allow users to report issues, suggest improvements.</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Docs Are Part of the API Contract</h3>
          <p>
            API documentation is not optional—it&apos;s part of the API contract. An undocumented API is
            unusable. Treat doc changes like API changes: version control, review process, deprecation
            notices.
          </p>
        </div>
      </section>

      <section>
        <h2>Architecture Decision Records (ADRs)</h2>
        <p>
          Architecture Decision Records (ADRs) document significant architectural decisions, their
          context, and consequences. ADRs preserve institutional knowledge and help future engineers
          understand why decisions were made.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">ADR Template</h3>
        <ul>
          <li><strong>Title:</strong> Short descriptive name (e.g., &quot;Use PostgreSQL as Primary Database&quot;).</li>
          <li><strong>Status:</strong> Proposed, Accepted, Deprecated, Superseded.</li>
          <li><strong>Context:</strong> Problem being solved, constraints, assumptions, requirements.</li>
          <li><strong>Decision:</strong> What was decided, why this option was chosen.</li>
          <li><strong>Alternatives Considered:</strong> Other options evaluated with pros/cons.</li>
          <li><strong>Consequences:</strong> Trade-offs, what becomes easier/harder, risks and mitigations.</li>
          <li><strong>Compliance:</strong> How to verify the decision is being followed.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">When to Write ADRs</h3>
        <p>Write ADRs for:</p>
        <ul>
          <li>Technology selection (database, language, framework)</li>
          <li>Architectural patterns (microservices vs monolith, event-driven vs request-response)</li>
          <li>Infrastructure decisions (cloud provider, deployment strategy)</li>
          <li>Data architecture (schema design, consistency model)</li>
          <li>Security architecture (authentication, authorization, encryption)</li>
          <li>Significant refactoring decisions</li>
        </ul>
        <p>Don&apos;t write ADRs for: Minor implementation details, easily reversible decisions, obvious choices.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">ADR Lifecycle</h3>
        <ul>
          <li><strong>Proposed:</strong> ADR is drafted and under discussion.</li>
          <li><strong>Accepted:</strong> Decision is made and being implemented.</li>
          <li><strong>Deprecated:</strong> Decision is no longer recommended but may still be in use.</li>
          <li><strong>Superseded:</strong> ADR is replaced by a new decision. Link to superseding ADR.</li>
          <li><strong>Archived:</strong> Historical record, no longer active.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Best Practices for ADRs</h3>
        <ul>
          <li><strong>Store with Code:</strong> Keep ADRs in version control alongside code.</li>
          <li><strong>Immutable:</strong> Never edit an accepted ADR. Create a new ADR to supersede it.</li>
          <li><strong>Number Sequentially:</strong> ADR-001, ADR-002, etc. Makes referencing easy.</li>
          <li><strong>Link Related ADRs:</strong> Reference related or superseding ADRs.</li>
          <li><strong>Review Process:</strong> ADRs should be reviewed like code (PR, discussion, approval).</li>
          <li><strong>Keep Concise:</strong> One page is ideal, two pages max.</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: ADRs Prevent Decision Amnesia</h3>
          <p>
            Without ADRs, teams forget why decisions were made. New engineers question settled decisions,
            wasting time re-litigating. ADRs provide context that prevents this and document trade-offs
            considered for when circumstances change.
          </p>
        </div>
      </section>

      <section>
        <h2>Runbooks & Operational Documentation</h2>
        <p>
          Operational documentation enables effective incident response, smooth deployments, and efficient
          on-call rotations. Good operational docs reduce MTTR (Mean Time To Resolution) and reduce
          on-call stress.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Incident Runbooks</h3>
        <p>Runbooks provide step-by-step guidance for responding to specific incident types:</p>
        <h4 className="mt-4 mb-2 font-semibold">Essential Components</h4>
        <ul>
          <li><strong>Trigger:</strong> What alert or symptom triggers this runbook?</li>
          <li><strong>Severity:</strong> What severity level applies? Who should be paged?</li>
          <li><strong>Initial Assessment:</strong> Questions to answer, dashboards to check.</li>
          <li><strong>Immediate Actions:</strong> Steps to stabilize the situation.</li>
          <li><strong>Diagnosis:</strong> How to identify root cause.</li>
          <li><strong>Remediation:</strong> Steps to fix the issue.</li>
          <li><strong>Verification:</strong> How to confirm the fix worked.</li>
          <li><strong>Escalation:</strong> When and who to escalate to.</li>
          <li><strong>Post-Incident:</strong> Required follow-up actions.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Deployment Guides</h3>
        <ul>
          <li><strong>Prerequisites:</strong> Access required, tools to install, permissions needed.</li>
          <li><strong>Pre-Deployment Checklist:</strong> Tests passing, migrations ready, rollback plan.</li>
          <li><strong>Deployment Steps:</strong> Exact commands, in order, with expected output.</li>
          <li><strong>Verification:</strong> How to confirm deployment succeeded.</li>
          <li><strong>Rollback:</strong> Step-by-step rollback procedure.</li>
          <li><strong>Post-Deployment:</strong> Monitoring to watch, issues to look for.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Onboarding Guides</h3>
        <ul>
          <li><strong>Day 1:</strong> Access requests, tool setup, team introduction.</li>
          <li><strong>Week 1:</strong> Development environment setup, first PR, team rituals.</li>
          <li><strong>Month 1:</strong> First feature, on-call shadow, architecture overview.</li>
          <li><strong>Resources:</strong> Key documentation links, team contacts, glossary.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Testing Runbooks</h3>
        <p>Runbooks that aren&apos;t tested become outdated. Test runbooks regularly:</p>
        <ul>
          <li><strong>Game Days:</strong> Simulated incidents to test runbooks and team response.</li>
          <li><strong>Fire Drills:</strong> Unannounced drills to test on-call readiness.</li>
          <li><strong>Runbook Rotation:</strong> Assign engineers to review/update specific runbooks quarterly.</li>
          <li><strong>Post-Incident Updates:</strong> After every incident, update relevant runbooks.</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Runbooks Reduce Cognitive Load</h3>
          <p>
            During incidents, engineers are stressed and cognitive capacity is reduced. Runbooks provide
            clear, step-by-step guidance that doesn&apos;t require deep thinking. Good runbooks turn
            &quot;What do I do?&quot; into &quot;Follow steps 1-10.&quot; This reduces MTTR and burnout.
          </p>
        </div>
      </section>

      <section>
        <h2>Docs-as-Code</h2>
        <p>
          Docs-as-Code treats documentation like software: stored in version control, reviewed via PRs,
          built and tested in CI/CD, and deployed automatically. This approach improves documentation
          quality and maintainability.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Version Control</h3>
        <ul>
          <li><strong>Store with Code:</strong> Keep documentation in the same repository as code.</li>
          <li><strong>Markdown Format:</strong> Use Markdown for simplicity and Git diff readability.</li>
          <li><strong>Branching:</strong> Doc changes go through branches like code changes.</li>
          <li><strong>History:</strong> Git history provides audit trail of doc changes.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Code Review for Docs</h3>
        <ul>
          <li><strong>PR Process:</strong> All doc changes require PR review.</li>
          <li><strong>Review Criteria:</strong> Accuracy, clarity, completeness, consistency.</li>
          <li><strong>Subject Matter Experts:</strong> Route doc changes to relevant SMEs for review.</li>
          <li><strong>Doc Owners:</strong> Assign owners responsible for reviewing doc PRs.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CI/CD for Documentation</h3>
        <ul>
          <li><strong>Build:</strong> Automatically build documentation on PR and merge.</li>
          <li><strong>Lint:</strong> Check for style issues, broken links, typos.</li>
          <li><strong>Test:</strong> Validate code examples, check links, verify screenshots.</li>
          <li><strong>Deploy:</strong> Automatically deploy to documentation site on merge.</li>
          <li><strong>Preview:</strong> Generate preview URLs for PRs to review changes before merge.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Static Site Generators</h3>
        <ul>
          <li><strong>MkDocs:</strong> Python-based, simple, Material theme is excellent.</li>
          <li><strong>Docusaurus:</strong> React-based, supports versioning, good for large docs.</li>
          <li><strong>Hugo:</strong> Go-based, very fast build times.</li>
          <li><strong>Next.js:</strong> Custom solutions with full control.</li>
          <li><strong>GitBook:</strong> Hosted solution with Git integration.</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Automate Documentation Quality</h3>
          <p>
            Manual documentation review misses issues. Automated checks catch broken links, outdated
            examples, and style inconsistencies. Make documentation quality gates part of your CI/CD
            pipeline, just like code quality gates.
          </p>
        </div>
      </section>

      <section>
        <h2>Knowledge Management</h2>
        <p>
          Knowledge management encompasses how organizational knowledge is captured, organized, shared,
          and maintained. Effective knowledge management reduces tribal knowledge, accelerates onboarding,
          and prevents knowledge loss from turnover.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/documentation-types-structure.svg"
          alt="Documentation Types and Structure showing different categories and their purposes"
          caption="Documentation Types and Structure: Organized by audience (engineering, product, users) and purpose (reference, how-to, conceptual, troubleshooting)."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Documentation Hierarchy</h3>
        <ul>
          <li><strong>Product Documentation:</strong> User-facing docs, API docs, tutorials.</li>
          <li><strong>Engineering Documentation:</strong> Architecture, runbooks, development guides.</li>
          <li><strong>Team Documentation:</strong> Team norms, meeting notes, project docs.</li>
          <li><strong>Company Documentation:</strong> Policies, processes, all-hands materials.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Documentation Ownership</h3>
        <ul>
          <li><strong>Doc Owners:</strong> Every document has an owner responsible for accuracy.</li>
          <li><strong>Review Cadence:</strong> Quarterly reviews for critical docs, annual for others.</li>
          <li><strong>Rotation:</strong> Rotate doc ownership to prevent knowledge silos.</li>
          <li><strong>Accountability:</strong> Include documentation in performance reviews.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Search and Discoverability</h3>
        <ul>
          <li><strong>Centralized Search:</strong> Single search across all documentation sources.</li>
          <li><strong>Tagging:</strong> Consistent tags for categorization.</li>
          <li><strong>Navigation:</strong> Clear information architecture, logical grouping.</li>
          <li><strong>Related Content:</strong> Link related documents.</li>
          <li><strong>Search Analytics:</strong> Track what users search for, improve content gaps.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Feedback Loops</h3>
        <ul>
          <li><strong>Feedback Buttons:</strong> Easy way to report issues on every page.</li>
          <li><strong>Comment Threads:</strong> Allow discussion on documentation.</li>
          <li><strong>Issue Tracking:</strong> Link documentation issues to tracking system.</li>
          <li><strong>Regular Audits:</strong> Quarterly documentation health checks.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Knowledge Retention</h3>
        <ul>
          <li><strong>Exit Interviews:</strong> Capture departing employee knowledge.</li>
          <li><strong>Shadow Programs:</strong> Pair new engineers with experienced engineers.</li>
          <li><strong>Recording:</strong> Record important meetings, demos, training sessions.</li>
          <li><strong>Post-Mortems:</strong> Document lessons learned from incidents.</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Documentation Culture Matters</h3>
          <p>
            Tools and processes alone don&apos;t create good documentation. You need a culture that
            values documentation: leaders who model documentation behavior, recognition for good docs,
            time allocated for documentation, and documentation as part of definition of done.
          </p>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/documentation-quality-metrics.svg"
          alt="Documentation Quality Metrics showing key measurements"
          caption="Documentation Quality Metrics: Tracking freshness, coverage, usage, feedback, and findability to measure documentation health."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Writing Quality Documentation</h3>
        <ul>
          <li><strong>Know Your Audience:</strong> Write for the reader, not the writer.</li>
          <li><strong>Be Concise:</strong> Say what needs to be said, no more. Cut unnecessary words.</li>
          <li><strong>Use Examples:</strong> Show, don&apos;t just tell. Real examples beat abstract descriptions.</li>
          <li><strong>Consistent Voice:</strong> Consistent terminology, tone, and style across all docs.</li>
          <li><strong>Visual Aids:</strong> Diagrams, screenshots, and videos complement text.</li>
          <li><strong>Version Control:</strong> Document which version the docs apply to.</li>
          <li><strong>Last Updated:</strong> Show when docs were last reviewed/updated.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Documentation Governance</h3>
        <ul>
          <li><strong>Style Guide:</strong> Documentation style guide for consistency.</li>
          <li><strong>Templates:</strong> Standard templates for common doc types (ADRs, runbooks, RFCs).</li>
          <li><strong>Review Process:</strong> Clear process for doc reviews and approvals.</li>
          <li><strong>Training:</strong> Train engineers on documentation best practices.</li>
          <li><strong>Metrics:</strong> Track documentation health (coverage, freshness, usage).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Definition of Done</h3>
        <p>Include documentation in definition of done for features:</p>
        <ul>
          <li>API changes documented</li>
          <li>Architecture decisions recorded in ADR</li>
          <li>Runbooks updated if operational impact</li>
          <li>Onboarding guide updated if relevant</li>
          <li>Changelog entry created</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Documentation as Code</h3>
        <p>
          Treat documentation with the same rigor as code:
        </p>
        <ul>
          <li><strong>Version Control:</strong> All docs in Git with code</li>
          <li><strong>Code Review:</strong> PRs for doc changes reviewed by peers</li>
          <li><strong>CI/CD:</strong> Automated build, lint, deploy on merge</li>
          <li><strong>Testing:</strong> Link checking, example validation, screenshot verification</li>
          <li><strong>Preview Environments:</strong> Preview doc changes before merge</li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul>
          <li>
            <strong>Docs as Afterthought:</strong> Writing docs after code is done. Result: docs are
            incomplete or never written. Fix: Include docs in definition of done.
          </li>
          <li>
            <strong>No Ownership:</strong> Docs without owners become stale. Fix: Assign owners, review
            cadence.
          </li>
          <li>
            <strong>Wrong Abstraction Level:</strong> Too high-level (not actionable) or too detailed
            (overwhelming). Fix: Know your audience, provide multiple levels.
          </li>
          <li>
            <strong>Outdated Screenshots:</strong> UI changes make screenshots wrong. Fix: Minimize
            screenshots, use annotated diagrams instead.
          </li>
          <li>
            <strong>No Search:</strong> Docs are useless if you can&apos;t find them. Fix: Invest in
            search infrastructure.
          </li>
          <li>
            <strong>Documentation Silos:</strong> Docs scattered across Confluence, Google Docs, GitHub,
            Slack. Fix: Centralize, or at least index all sources.
          </li>
          <li>
            <strong>No Feedback Mechanism:</strong> No way to report issues. Fix: Add feedback buttons,
            monitor channels.
          </li>
          <li>
            <strong>Perfect Is Enemy of Good:</strong> Waiting for perfect docs means no docs. Fix:
            Iterate, start with minimum viable docs.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What makes good API documentation?</p>
            <p className="mt-2 text-sm">
              A: Complete endpoint reference with request/response schemas, working code examples in
              multiple languages, clear authentication guide, error code documentation with troubleshooting,
              rate limit information, versioning/deprecation policy, interactive console for testing, and
              quick start guide. Generate from OpenAPI spec to ensure accuracy.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is an ADR and why use them?</p>
            <p className="mt-2 text-sm">
              A: Architecture Decision Record documents significant architectural decisions with context,
              decision, alternatives considered, and consequences. Benefits: preserves institutional
              knowledge, prevents re-litigating settled decisions, helps new engineers understand why,
              documents trade-offs for future reference. Store with code, review like code, never edit
              once accepted (supersede instead).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you keep documentation up to date?</p>
            <p className="mt-2 text-sm">
              A: Docs-as-code approach: version control, PR reviews, CI/CD with automated checks. Assign
              owners to each document. Quarterly review cadence. Include documentation in definition of
              done. Automate where possible (generate from code/spec). Make it easy to report outdated
              docs. Track documentation metrics (freshness, coverage).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What documentation is essential for on-call?</p>
            <p className="mt-2 text-sm">
              A: Incident runbooks for common scenarios, escalation matrix with contact info, system
              architecture overview, deployment and rollback procedures, monitoring dashboard guide,
              recent changes/changelog, service owner contacts, troubleshooting guides for known issues.
              Test runbooks regularly via game days.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you balance documentation vs. code comments?</p>
            <p className="mt-2 text-sm">
              A: They serve different purposes. Documentation explains the &quot;what&quot; and
              &quot;why&quot; at system level—architecture, APIs, processes. Code comments explain the
              &quot;why&quot; at implementation level—non-obvious decisions, workarounds, complex logic.
              Good code is self-documenting for &quot;what&quot;. Avoid redundant comments that just
              restate code.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you measure documentation quality?</p>
            <p className="mt-2 text-sm">
              A: Metrics: freshness (last updated date), coverage (% of features documented), usage
              (page views, search queries), feedback (ratings, issues reported), accuracy (bug reports
              from outdated docs), findability (search success rate). Qualitative: new hire feedback,
              support ticket reduction, engineer surveys.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle documentation for multiple API versions?</p>
            <p className="mt-2 text-sm">
              A: Version your documentation alongside API versions. Use documentation generators that
              support versioning (Docusaurus, MkDocs). Clearly mark deprecated versions with sunset dates.
              Maintain migration guides between versions. Automatically redirect old version URLs to
              migration guides.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s your strategy for keeping runbooks current?</p>
            <p className="mt-2 text-sm">
              A: Assign owners to each runbook. Update runbooks after every incident (what worked, what
              didn&apos;t). Test runbooks quarterly via fire drills. Include runbook review in change
              management process. Use version control to track changes. Add &quot;last tested&quot; date
              to each runbook.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul>
          <li>Documentation Culture: <a href="https://documentation.divio.com" className="text-accent hover:underline">Diátaxis Framework</a></li>
          <li>OpenAPI Specification: <a href="https://openapis.org" className="text-accent hover:underline">openapis.org</a></li>
          <li>ADR Template: <a href="https://adr.github.io" className="text-accent hover:underline">adr.github.io</a></li>
          <li>Docs-as-Code: <a href="https://www.idratherbewriting.com/learnapidoc/" className="text-accent hover:underline">Learn API Technical Writing</a></li>
          <li>MkDocs: <a href="https://mkdocs.org" className="text-accent hover:underline">mkdocs.org</a></li>
          <li>Docusaurus: <a href="https://docusaurus.io" className="text-accent hover:underline">docusaurus.io</a></li>
          <li>&quot;Docs Like Code&quot; by Anne Gentle</li>
          <li>Google Developer Documentation Style Guide</li>
          <li>Atlassian Team Playbook - Documentation</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
