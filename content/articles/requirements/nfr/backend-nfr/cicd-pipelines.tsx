"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-cicd-pipelines-extensive",
  title: "CI/CD Pipelines",
  description: "Comprehensive guide to CI/CD pipelines, covering deployment automation, testing strategies, rollback mechanisms, and production deployment patterns for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "cicd-pipelines",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "ci-cd", "deployment", "automation", "testing", "devops"],
  relatedTopics: ["api-versioning", "schema-governance", "monitoring-observability", "disaster-recovery"],
};

export default function CICDPipelinesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>CI/CD (Continuous Integration/Continuous Deployment)</strong> pipelines automate
          the process of building, testing, and deploying software. They are essential for reliable,
          frequent deployments.
        </p>
        <p>
          CI/CD benefits:
        </p>
        <ul>
          <li>
            <strong>Speed:</strong> Automated deployments are faster than manual.
          </li>
          <li>
            <strong>Reliability:</strong> Consistent process reduces human error.
          </li>
          <li>
            <strong>Frequency:</strong> Enables multiple deployments per day.
          </li>
          <li>
            <strong>Rollback:</strong> Quick recovery from bad deployments.
          </li>
          <li>
            <strong>Quality:</strong> Automated testing catches issues early.
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: CI/CD is Risk Management</h3>
          <p>
            The goal of CI/CD isn&apos;t just automation — it&apos;s reducing the risk of each deployment.
            Small, frequent deployments with automated testing and rollback are safer than infrequent
            &quot;big bang&quot; releases.
          </p>
        </div>
      </section>

      <section>
        <h2>CI/CD Pipeline Stages</h2>
        <ArticleImage
          src="/diagrams/backend-nfr/cicd-pipeline.svg"
          alt="CI/CD Pipeline Stages"
          caption="CI/CD Pipeline — showing stages from commit to production, deployment strategies, and quality gates"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Stage 1: Commit</h3>
        <p>
          Triggered on code commit or pull request:
        </p>
        <ul>
          <li>
            <strong>Static analysis:</strong> Linting, code style, complexity checks.
          </li>
          <li>
            <strong>Security scan:</strong> Dependency vulnerabilities, secrets detection.
          </li>
          <li>
            <strong>Code review:</strong> Human review for logic, architecture.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Stage 2: Build</h3>
        <p>
          Compile and package the application:
        </p>
        <ul>
          <li>
            <strong>Compile:</strong> Build binaries, bundle assets.
          </li>
          <li>
            <strong>Package:</strong> Create deployable artifacts (JAR, Docker image).
          </li>
          <li>
            <strong>Version:</strong> Tag with unique version identifier.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Stage 3: Test</h3>
        <p>
          Automated testing at multiple levels:
        </p>
        <ul>
          <li>
            <strong>Unit tests:</strong> Fast, isolated tests for individual functions.
          </li>
          <li>
            <strong>Integration tests:</strong> Test component interactions.
          </li>
          <li>
            <strong>End-to-end tests:</strong> Full system tests from user perspective.
          </li>
          <li>
            <strong>Performance tests:</strong> Load testing, latency benchmarks.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Stage 4: Deploy to Staging</h3>
        <p>
          Deploy to production-like environment:
        </p>
        <ul>
          <li>
            <strong>Smoke tests:</strong> Basic functionality verification.
          </li>
          <li>
            <strong>Performance validation:</strong> Ensure no regression.
          </li>
          <li>
            <strong>Manual approval:</strong> For regulated industries.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Stage 5: Deploy to Production</h3>
        <p>
          Deploy to production with safety mechanisms:
        </p>
        <ul>
          <li>
            <strong>Canary deployment:</strong> Small percentage first.
          </li>
          <li>
            <strong>Health checks:</strong> Automated verification.
          </li>
          <li>
            <strong>Rollback ready:</strong> Quick reversal if issues detected.
          </li>
        </ul>
      </section>

      <section>
        <h2>Deployment Strategies</h2>
        <p>
          Different approaches to deploying to production:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Rolling Update</h3>
        <p>
          Gradually replace old instances with new:
        </p>
        <ul>
          <li>Update one instance at a time.</li>
          <li>Wait for health check before next.</li>
          <li>Zero downtime if multiple instances.</li>
        </ul>
        <p>
          <strong>Use when:</strong> Stateless services, multiple instances.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Blue-Green Deployment</h3>
        <p>
          Two identical environments, switch traffic:
        </p>
        <ul>
          <li>Blue is current production.</li>
          <li>Deploy new version to Green.</li>
          <li>Test Green, then switch traffic.</li>
          <li>Blue becomes backup/rollback.</li>
        </ul>
        <p>
          <strong>Use when:</strong> Need instant rollback, stateless services.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Canary Deployment</h3>
        <p>
          Gradual rollout to subset of users:
        </p>
        <ul>
          <li>Deploy to small percentage (1-5%).</li>
          <li>Monitor metrics, errors.</li>
          <li>Gradually increase percentage.</li>
          <li>Full rollout if no issues.</li>
        </ul>
        <p>
          <strong>Use when:</strong> High-traffic services, risk mitigation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Feature Flags</h3>
        <p>
          Deploy code hidden behind flags:
        </p>
        <ul>
          <li>Deploy code with feature disabled.</li>
          <li>Enable for internal users first.</li>
          <li>Gradually enable for all users.</li>
          <li>Can disable instantly if issues.</li>
        </ul>
        <p>
          <strong>Use when:</strong> Large features, A/B testing, kill switch needed.
        </p>
      </section>

      <section>
        <h2>Rollback Mechanisms</h2>
        <p>
          Every deployment must have a rollback plan:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Automated Rollback</h3>
        <p>
          Trigger rollback automatically on failure:
        </p>
        <ul>
          <li>Health check failures.</li>
          <li>Error rate spikes.</li>
          <li>Latency increases.</li>
          <li>Business metric anomalies.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Database Rollback</h3>
        <p>
          Schema migrations must be reversible:
        </p>
        <ul>
          <li>Write down migrations for every up migration.</li>
          <li>Test rollback before deploying.</li>
          <li>Ensure backward compatibility during transition.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Feature Flag Kill Switch</h3>
        <p>
          Disable problematic features instantly:
        </p>
        <ul>
          <li>Centralized flag management.</li>
          <li>Flags checked at runtime.</li>
          <li>Can disable without redeploy.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. Design a CI/CD pipeline for a microservices architecture with 50 services.
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Source control:</strong> Git with trunk-based development. Feature branches merged to main daily.</li>
                <li><strong>CI pipeline:</strong> (1) Lint + type check. (2) Unit tests. (3) Integration tests. (4) Build Docker image. (5) Security scan. (6) Push to registry.</li>
                <li><strong>CD pipeline:</strong> (1) Deploy to staging. (2) E2E tests. (3) Deploy to production (canary 5% → 50% → 100%). (4) Smoke tests.</li>
                <li><strong>Per-service:</strong> Each service has independent pipeline. No coordinated deploys.</li>
                <li><strong>Tools:</strong> GitHub Actions/GitLab CI for CI. ArgoCD/Flux for GitOps CD. Kubernetes for deployment.</li>
                <li><strong>Rollback:</strong> Automatic on health check failure. Keep last 5 versions for quick rollback.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. Compare blue-green, canary, and rolling deployments. When would you use each?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Blue-Green:</strong> Two identical environments. Switch traffic instantly. ✓ Instant rollback, zero downtime. ✗ 2x infrastructure cost. Best for: Critical apps, database migrations.</li>
                <li><strong>Canary:</strong> Gradual rollout (5% → 50% → 100%). ✓ Catch issues early, minimal blast radius. ✗ Complex routing, slower rollout. Best for: High-traffic services, risky changes.</li>
                <li><strong>Rolling:</strong> Replace instances one-by-one. ✓ No extra infrastructure, simple. ✗ Slow, brief capacity reduction. Best for: Stateless services, low-traffic apps.</li>
                <li><strong>Decision:</strong> Canary for most services. Blue-green for database changes. Rolling for internal tools.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. How do you handle database migrations in a CI/CD pipeline?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Expand-Contract pattern:</strong> (1) Add new column (expand). (2) Deploy app that writes to both. (3) Backfill data. (4) Remove old column (contract).</li>
                <li><strong>Migration timing:</strong> Run migrations BEFORE app deploy (not after). Failed migration = failed deploy.</li>
                <li><strong>Backward compatibility:</strong> New code must work with old schema during rollout. Never break running instances.</li>
                <li><strong>Testing:</strong> Test migration on staging with production-sized data. Measure migration time.</li>
                <li><strong>Rollback:</strong> Every UP migration needs DOWN migration. Test rollback before production.</li>
                <li><strong>Tools:</strong> Flyway, Liquibase, Alembic for migration management.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. Your deployment caused a production outage. How do you rollback and prevent recurrence?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Immediate (rollback):</strong> (1) Trigger automated rollback. (2) Verify health restored. (3) Communicate to stakeholders. Time: &lt;5 minutes.</li>
                <li><strong>Investigation:</strong> (1) Review deployment changes. (2) Check logs, metrics, traces. (3) Identify root cause. (4) Document incident.</li>
                <li><strong>Prevention:</strong> (1) Add missing test case. (2) Improve canary analysis (catch issues at 5%). (3) Add feature flag for risky changes. (4) Improve monitoring/alerting.</li>
                <li><strong>Process improvement:</strong> Post-mortem (blameless). Action items tracked. Share learnings across teams.</li>
                <li><strong>Best practice:</strong> Automated rollback on health check failure. Don&apos;t rely on manual intervention.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. What quality gates would you implement before production deployment?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Code quality:</strong> (1) All tests pass (unit, integration, E2E). (2) Code coverage &gt;80%. (3) No critical linting issues. (4) Security scan passes.</li>
                <li><strong>Staging validation:</strong> (1) E2E tests pass in staging. (2) Performance tests within baseline. (3) Smoke tests after deploy.</li>
                <li><strong>Canary analysis:</strong> (1) Error rate &lt;0.1%. (2) Latency P99 within baseline. (3) Business metrics stable (conversion rate, signups).</li>
                <li><strong>Manual approval:</strong> Required for high-risk changes (database migrations, core services).</li>
                <li><strong>Best practice:</strong> Automate all gates. Manual gates slow down deployment and create bottlenecks.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. How do you balance deployment speed with safety in CI/CD?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Fast feedback:</strong> Run quick tests first (lint, unit). Slow tests later (E2E, performance). Fail fast.</li>
                <li><strong>Progressive delivery:</strong> Deploy to 1% → 5% → 50% → 100%. Catch issues early, limit blast radius.</li>
                <li><strong>Feature flags:</strong> Deploy code hidden. Enable gradually. Instant kill switch if issues.</li>
                <li><strong>Automated rollback:</strong> Don&apos;t wait for human intervention. Auto-rollback on health check failure.</li>
                <li><strong>Trunk-based development:</strong> Small, frequent commits. Easier to rollback. Less merge conflicts.</li>
                <li><strong>Best practice:</strong> Invest in test automation. Fast, reliable tests enable both speed AND safety.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>CI/CD Checklist</h2>
        <ul className="space-y-2">
          <li>✓ Automated testing at all levels (unit, integration, E2E)</li>
          <li>✓ Code quality gates (coverage, linting, security)</li>
          <li>✓ Automated deployment to staging</li>
          <li>✓ Production deployment with rollback capability</li>
          <li>✓ Health checks and monitoring post-deploy</li>
          <li>✓ Feature flags for gradual rollout</li>
          <li>✓ Database migration rollback scripts</li>
          <li>✓ Deployment notifications and audit log</li>
          <li>✓ Runbook for deployment issues</li>
          <li>✓ Regular pipeline maintenance and optimization</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
