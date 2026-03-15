"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-frontend-deployment-strategy",
  title: "Frontend Deployment Strategy",
  description: "Comprehensive guide to frontend deployment: CI/CD pipelines, hosting platforms, CDN configuration, rollback strategies, and zero-downtime deployments.",
  category: "frontend",
  subcategory: "nfr",
  slug: "frontend-deployment-strategy",
  version: "extensive",
  wordCount: 8500,
  readingTime: 34,
  lastUpdated: "2026-03-15",
  tags: ["frontend", "nfr", "deployment", "ci-cd", "cdn", "hosting", "rollback"],
  relatedTopics: ["build-optimization", "developer-experience", "feature-flags"],
};

export default function FrontendDeploymentStrategyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Frontend Deployment Strategy</strong> encompasses the processes, tools, and
          infrastructure for releasing frontend applications to production. This includes build
          pipelines, hosting platforms, CDN configuration, rollout strategies, and rollback
          procedures. For staff engineers, deployment strategy balances velocity (fast releases)
          with reliability (zero downtime, easy rollback).
        </p>
        <p>
          Modern frontend deployment has evolved from FTP uploads to sophisticated CI/CD pipelines
          with automated testing, preview deployments, canary releases, and instant rollback.
          The right strategy enables multiple deploys per day with confidence.
        </p>
        <p>
          <strong>Deployment considerations:</strong>
        </p>
        <ul>
          <li><strong>Hosting:</strong> Static hosting, serverless, traditional servers</li>
          <li><strong>CDN:</strong> Global distribution, caching, edge functions</li>
          <li><strong>Rollout:</strong> Blue-green, canary, gradual rollouts</li>
          <li><strong>Rollback:</strong> Instant rollback, version retention</li>
          <li><strong>Monitoring:</strong> Post-deploy verification, error tracking</li>
        </ul>
      </section>

      <section>
        <h2>Hosting Platforms</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Static Hosting</h3>
        <ul className="space-y-2">
          <li><strong>Vercel:</strong> Next.js creators, edge functions, preview deployments</li>
          <li><strong>Netlify:</strong> JAMstack focus, serverless functions, form handling</li>
          <li><strong>Cloudflare Pages:</strong> Edge deployment, Workers integration</li>
          <li><strong>AWS S3 + CloudFront:</strong> Raw AWS, more configuration, cost-effective</li>
          <li><strong>Google Firebase Hosting:</strong> Integrated with Firebase ecosystem</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Traditional Hosting</h3>
        <ul className="space-y-2">
          <li><strong>Nginx/Apache:</strong> Full control, self-managed</li>
          <li><strong>Docker + Kubernetes:</strong> Container orchestration, scaling</li>
          <li><strong>EC2/VMs:</strong> Traditional server deployment</li>
          <li><strong>Best for:</strong> Complex requirements, existing infrastructure</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Platform Selection Criteria</h3>
        <ul className="space-y-2">
          <li>Framework support (Next.js, Nuxt, SvelteKit)</li>
          <li>Preview deployments for PRs</li>
          <li>Edge function support</li>
          <li>CDN coverage and performance</li>
          <li>Pricing model (bandwidth, build minutes)</li>
          <li>Integration with existing tools (GitHub, monitoring)</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/hosting-platforms.svg"
          alt="Hosting Platforms Comparison"
          caption="Frontend hosting options — static hosting, serverless, and traditional with trade-offs"
        />
      </section>

      <section>
        <h2>CI/CD Pipelines</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Pipeline Stages</h3>
        <ol className="space-y-3">
          <li><strong>Build:</strong> Install dependencies, run build</li>
          <li><strong>Test:</strong> Unit tests, integration tests, E2E tests</li>
          <li><strong>Lint/Type-check:</strong> Code quality gates</li>
          <li><strong>Security scan:</strong> Dependency vulnerabilities</li>
          <li><strong>Deploy to staging:</strong> Deploy to staging environment</li>
          <li><strong>Smoke tests:</strong> Post-deploy verification</li>
          <li><strong>Deploy to production:</strong> Production release</li>
          <li><strong>Post-deploy monitoring:</strong> Error tracking, performance</li>
        </ol>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CI/CD Tools</h3>
        <ul className="space-y-2">
          <li><strong>GitHub Actions:</strong> Native GitHub integration, generous free tier</li>
          <li><strong>GitLab CI:</strong> Integrated with GitLab, powerful configuration</li>
          <li><strong>CircleCI:</strong> Fast, good caching, parallel jobs</li>
          <li><strong>Jenkins:</strong> Self-hosted, highly customizable</li>
          <li><strong>Vercel/Netlify CI:</strong> Built-in for those platforms</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Pipeline Optimization</h3>
        <ul className="space-y-2">
          <li>Cache dependencies between runs (node_modules)</li>
          <li>Parallelize independent jobs (lint, test, build)</li>
          <li>Skip irrelevant jobs (docs change → skip tests)</li>
          <li>Use incremental builds where possible</li>
          <li>Set timeouts to catch stuck jobs</li>
          <li>Provide clear failure messages</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Environment Promotion</h3>
        <ul className="space-y-2">
          <li>Development → Staging → Production</li>
          <li>Same build artifact through all environments</li>
          <li>Environment-specific configuration (env vars)</li>
          <li>Automated promotion after tests pass</li>
          <li>Manual approval for production (optional)</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/cicd-pipeline.svg"
          alt="CI/CD Pipeline"
          caption="CI/CD pipeline flow — build, test, staging, verification, and production deployment"
        />
      </section>

      <section>
        <h2>CDN Configuration</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CDN Benefits</h3>
        <ul className="space-y-2">
          <li>Global distribution (lower latency)</li>
          <li>Edge caching (faster load times)</li>
          <li>DDoS protection</li>
          <li>SSL/TLS termination</li>
          <li>Edge functions (compute at edge)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cache Configuration</h3>
        <ul className="space-y-2">
          <li>Static assets (JS, CSS): Long TTL (1 year), immutable</li>
          <li>HTML pages: Short TTL or no-cache (revalidate)</li>
          <li>Images: Medium TTL (1 month), with versioning</li>
          <li>API responses: Varies by endpoint</li>
          <li>Use cache-control headers properly</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CDN Providers</h3>
        <ul className="space-y-2">
          <li><strong>Cloudflare:</strong> Free tier, global network, security features</li>
          <li><strong>Fastly:</strong> Real-time purging, edge compute</li>
          <li><strong>AWS CloudFront:</strong> AWS integration, customizable</li>
          <li><strong>Akamai:</strong> Enterprise, largest network</li>
          <li><strong>Platform CDN:</strong> Vercel/Netlify built-in CDN</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Edge Functions</h3>
        <ul className="space-y-2">
          <li>Run code at edge locations</li>
          <li>Lower latency than origin server</li>
          <li>Use cases: A/B testing, personalization, auth</li>
          <li>Providers: Cloudflare Workers, Vercel Edge Functions, Fastly Compute</li>
          <li>Limitations: Cold starts, execution time limits</li>
        </ul>
      </section>

      <section>
        <h2>Deployment Strategies</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Blue-Green Deployment</h3>
        <ul className="space-y-2">
          <li>Two identical environments (blue, green)</li>
          <li>Deploy to inactive environment</li>
          <li>Switch traffic to new environment</li>
          <li>Instant rollback (switch back)</li>
          <li>Zero downtime, full environment cost</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Canary Deployment</h3>
        <ul className="space-y-2">
          <li>Deploy to subset of users (5%, 10%, 50%, 100%)</li>
          <li>Monitor metrics at each stage</li>
          <li>Rollback if issues detected</li>
          <li>Gradual risk exposure</li>
          <li>Requires traffic routing capability</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Feature Flags</h3>
        <ul className="space-y-2">
          <li>Deploy code behind feature flag</li>
          <li>Enable for specific users/segments</li>
          <li>Gradual rollout without redeploy</li>
          <li>Instant kill switch</li>
          <li>Tools: LaunchDarkly, Flagsmith, Unleash</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Preview Deployments</h3>
        <ul className="space-y-2">
          <li>Deploy every PR to unique URL</li>
          <li>Test changes in production-like environment</li>
          <li>Share preview URLs for review</li>
          <li>Auto-delete on PR merge/close</li>
          <li>Vercel, Netlify provide this out-of-box</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/deployment-strategies.svg"
          alt="Deployment Strategies"
          caption="Deployment strategies — blue-green, canary, feature flags, and preview deployments"
        />
      </section>

      <section>
        <h2>Rollback Strategies</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Instant Rollback</h3>
        <ul className="space-y-2">
          <li>Keep previous version deployed</li>
          <li>Switch traffic back to previous version</li>
          <li>CDN cache purge for immediate effect</li>
          <li>Test rollback procedure regularly</li>
          <li>Document rollback steps</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Version Retention</h3>
        <ul className="space-y-2">
          <li>Keep N previous versions available</li>
          <li>Label versions with git SHA, timestamp</li>
          <li>Enable one-click rollback in UI</li>
          <li>Automated cleanup of old versions</li>
          <li>Retention policy (30 days, 10 versions)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Database Rollback</h3>
        <ul className="space-y-2">
          <li>Database migrations must be backward compatible</li>
          <li>Don&apos;t remove columns immediately (deprecate first)</li>
          <li>Test rollback with database changes</li>
          <li>Have database rollback scripts ready</li>
          <li>Consider data migration implications</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Rollback Triggers</h3>
        <ul className="space-y-2">
          <li>Error rate spike (Sentry alerts)</li>
          <li>Performance degradation (RUM metrics)</li>
          <li>Failed smoke tests</li>
          <li>Manual trigger (team decision)</li>
          <li>Automated rollback on health check failure</li>
        </ul>
      </section>

      <section>
        <h2>Post-Deploy Verification</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Smoke Tests</h3>
        <ul className="space-y-2">
          <li>Critical path tests after deploy</li>
          <li>Login, core functionality, checkout</li>
          <li>Automated, fast execution</li>
          <li>Fail deployment if smoke tests fail</li>
          <li>Run against production (carefully)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitoring</h3>
        <ul className="space-y-2">
          <li>Error tracking (Sentry, LogRocket)</li>
          <li>Performance monitoring (RUM, CrUX)</li>
          <li>Business metrics (conversion, signups)</li>
          <li>Infrastructure metrics (CPU, memory, latency)</li>
          <li>Set up alerts for anomalies</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Deployment Checklist</h3>
        <ul className="space-y-2">
          <li>Pre-deploy: Tests pass, changelog reviewed</li>
          <li>During deploy: Monitor progress, watch for errors</li>
          <li>Post-deploy: Smoke tests, error monitoring, performance</li>
          <li>24 hours post: Review metrics, user feedback</li>
          <li>Document any issues and resolutions</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s your deployment strategy for a frontend app?</p>
            <p className="mt-2 text-sm">
              A: CI/CD pipeline with automated tests (unit, integration, E2E). Preview deployments
              for every PR. Deploy to staging, run smoke tests. Canary deployment to production
              (5% → 50% → 100%). Feature flags for gradual rollout. Instant rollback capability.
              Post-deploy monitoring (errors, performance). Use Vercel/Netlify for static hosting
              with built-in CDN.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure zero-downtime deployments?</p>
            <p className="mt-2 text-sm">
              A: Blue-green deployment (two environments, switch traffic). Or canary deployment
              (gradual rollout). Keep previous version available for instant rollback. CDN cache
              purge for immediate effect. Database migrations must be backward compatible. Test
              rollback procedure regularly.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you configure CDN caching for frontend assets?</p>
            <p className="mt-2 text-sm">
              A: Static assets (JS, CSS with content hashes): 1 year TTL, immutable. HTML pages:
              no-cache (revalidate every time). Images: 1 month TTL with versioning. Use
              cache-control headers. Purge CDN cache on deploy for HTML. Leverage browser caching
              with proper headers.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s in your CI/CD pipeline?</p>
            <p className="mt-2 text-sm">
              A: Install dependencies (cached), lint, type-check, unit tests, integration tests,
              build, E2E tests, deploy to staging, smoke tests, deploy to production, post-deploy
              monitoring. Parallelize independent jobs. Cache node_modules. Skip irrelevant jobs.
              Target &lt;10min total pipeline time.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle rollback?</p>
            <p className="mt-2 text-sm">
              A: Keep previous versions available (10 versions or 30 days). One-click rollback in
              UI. Automated rollback on health check failure or error spike. Test rollback
              procedure regularly. Document rollback steps. For database changes, ensure migrations
              are backward compatible so rollback doesn&apos;t break data.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://vercel.com/docs" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Vercel Documentation
            </a>
          </li>
          <li>
            <a href="https://docs.netlify.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Netlify Documentation
            </a>
          </li>
          <li>
            <a href="https://cloudflare.com/pages" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Cloudflare Pages
            </a>
          </li>
          <li>
            <a href="https://martinfowler.com/bliki/BlueGreenDeployment.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Blue-Green Deployment (Martin Fowler)
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
