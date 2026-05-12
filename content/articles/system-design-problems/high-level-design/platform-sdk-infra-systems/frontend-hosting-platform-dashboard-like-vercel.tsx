"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-frontend-hosting-platform-dashboard-like-vercel",
  title: "Design a Frontend Hosting Platform Dashboard (Like Vercel)",
  description:
    "Architecture for a hosting platform dashboard: deployment pipeline visualization, preview environments, rollback, domain management, analytics, and team collaboration.",
  category: "high-level-design",
  subcategory: "platform-sdk-infra-systems",
  slug: "frontend-hosting-platform-dashboard-like-vercel",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-10",
  tags: ["hld", "hosting", "vercel", "deployment", "preview-environments", "rollback"],
  relatedTopics: ["frontend-architecture-for-an-internal-developer-platform", "frontend-observability-dashboard-rum-like-datadog"],
};

export default function FrontendHostingPlatformDashboardLikeVercelArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A frontend hosting platform dashboard (like Vercel, Netlify, or Render) gives developers a web UI to deploy, monitor, and manage their web applications. Each push to a Git branch triggers a build-and-deploy pipeline; the dashboard shows the pipeline's progress in real-time, the resulting preview URL, build logs, and deployment metadata. The dashboard is the primary interface through which developers understand their application's deployment history, diagnose build failures, manage custom domains, and configure the platform's behavior (environment variables, build commands, routing rules).</p>
        <p>The design challenge is that the dashboard must provide real-time visibility into asynchronous, distributed processes (builds running on a fleet of build servers, deployment propagation across a global CDN). The user clicks "Deploy" and expects to see a live progress indicator as the build compiles, tests run, assets are uploaded, and the CDN propagates. Each stage runs in a different system; the dashboard aggregates their status into a coherent timeline. When a deployment fails, the dashboard must surface the exact cause quickly—showing the relevant log lines, the failing test, or the build error—to minimize the developer's debugging time.</p>
        <p><strong>Explicit assumptions:</strong> The platform is a Git-integrated hosting service for static sites and serverless function applications (not containerized applications). Deployments are triggered by Git pushes (GitHub, GitLab, Bitbucket integrations) or by the platform's CLI. Each deployment creates an immutable, URL-addressable snapshot (the preview URL). Production deployments promote a specific deployment to the production URL. The dashboard serves individual developers and teams (with role-based access: owner, member, viewer).</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Deployment list:</strong> Each project shows a chronological list of all deployments with their status (building, ready, failed, cancelled), the triggering branch and commit, the deployer (user or bot), and the deployment URL.</li>
          <li><strong>Real-time build logs:</strong> While a deployment is building, the dashboard streams live build log output to the user. The user can see the current build step, output from the build command, and any errors in real-time.</li>
          <li><strong>Preview environments:</strong> Every branch deployment generates a unique preview URL (a subdomain of the platform's URL namespace). The preview URL is stable for the branch—subsequent pushes to the same branch update the same preview URL.</li>
          <li><strong>Rollback:</strong> Users can promote any past deployment to production (instant rollback to a previous state). A rollback does not rebuild—it re-aliases the CDN to an existing immutable deployment.</li>
          <li><strong>Domain management:</strong> Users can configure custom domains (add a CNAME or A record), view DNS propagation status, and manage SSL certificate provisioning (Let's Encrypt).</li>
          <li><strong>Environment variables:</strong> Users manage environment variables per project, with values scoped to all environments, production only, or preview only.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Build log latency:</strong> Build log lines appear in the dashboard within 1 second of being emitted by the build server.</li>
          <li><strong>Deployment status accuracy:</strong> The dashboard's deployment status is accurate to within 5 seconds of the actual build/deployment state change.</li>
          <li><strong>Rollback speed:</strong> A rollback operation (CDN alias change) completes within 10 seconds.</li>
          <li><strong>Dashboard performance:</strong> Project pages with 1,000+ deployments load within 2 seconds.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The dashboard frontend is a React SPA that communicates with a REST/GraphQL API. The API aggregates data from the build system (which runs builds on ephemeral workers), the CDN management layer (which manages deployment aliases and CDN propagation), the domain service (which handles DNS and SSL), and the analytics service (which aggregates build metrics, error rates, and performance data). Real-time build log streaming uses Server-Sent Events (SSE): the dashboard opens an SSE connection to the log streaming endpoint for the active deployment, and the build server appends log lines to a shared log buffer that the streaming endpoint forwards to connected clients.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/platform-sdk-infra-systems/frontend-hosting-platform-dashboard-like-vercel-architecture.svg"
          alt="Hosting platform dashboard architecture showing React SPA, REST/GraphQL API (aggregating build system status, CDN management layer, domain service, analytics service), real-time build log streaming via SSE (build server → log buffer Redis Streams → SSE endpoint → dashboard), deployment lifecycle (Git push webhook → build trigger → build worker → asset upload → CDN deployment → alias update → status event), and Git integration (GitHub webhook on push → deployment creation → build trigger)."
          caption="Dashboard architecture: REST API aggregating build/CDN/domain/analytics systems, SSE build log streaming via Redis Streams, Git webhook deployment trigger"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Deployment Lifecycle and Status Model</h3>
        <p>A deployment transitions through a defined sequence of states: queued (build job created, waiting for a build worker), building (a worker is executing the build command), uploading (build artifacts are being uploaded to the CDN storage), ready (the deployment is accessible at its preview URL), and terminal states: failed (build or upload error), cancelled (user or system cancelled). Each state transition is recorded as an event in an append-only deployment event log (Kafka-backed, consumed to PostgreSQL for querying and Redis for real-time status cache).</p>
        <p>The dashboard polls the deployment status every 5 seconds during an active deployment, using a short-poll rather than WebSocket because deployments are relatively infrequent events and short-poll is simpler to implement correctly with reconnection and backoff. The poll response includes the current state, the timestamp of the last state transition, and the current build step (a higher-granularity status string like "Running build command: npm run build" for the building state). The 5-second poll interval satisfies the 5-second accuracy requirement while keeping the polling overhead negligible (each poll is a lightweight API call returning a small JSON payload).</p>
        <p>Deployment immutability: each deployment is content-addressed—its URL is derived from a hash of its contents. Two deployments with identical build outputs have the same URL (they are de-duplicated: the second deployment succeeds instantly without re-uploading). This immutability enables instant rollback: "promote to production" is purely an alias change in the CDN (pointing the production domain to a different deployment's URL), not a rebuild. The alias change propagates to all CDN edge nodes within 10 seconds via the CDN's control plane API.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-Time Build Log Streaming</h3>
        <p>Build logs are streamed from the build worker to the dashboard in real-time. The build worker writes log lines to a Redis Stream (XADD) keyed by deploymentId. Each log entry has a sequential ID (Redis Stream auto-generated), a timestamp, a log level (info, warning, error), and the log message. The streaming endpoint (an API server) reads from the Redis Stream (XREAD with blocking, starting from the last read entry ID) and forwards new entries to connected SSE clients as they arrive. The SSE connection is kept alive for the duration of the build; the server sends a "deployment:complete" event when the deployment reaches a terminal state, signaling the client to close the SSE connection.</p>
        <p>Log UI: the log viewer renders build log lines in a virtualized list (only rendering visible lines, crucial for long builds that produce thousands of log lines). The viewer auto-scrolls to the bottom as new lines arrive (following the latest output), with a "scroll to bottom" button that appears if the user scrolls up (to pause auto-scroll and read a specific section). Log lines are syntax-highlighted by log level (info: white, warning: yellow, error: red). The user can search within the log (client-side filtering of the in-memory log buffer) and download the full log as a text file.</p>
        <p>Log persistence: after the build completes, log lines are persisted to object storage (S3) for long-term retention. The SSE stream endpoint serves live logs from Redis during the build and archived logs from S3 for completed deployments. The client requests logs the same way for both cases (the same API endpoint); the server determines whether to stream from Redis (active deployment) or fetch from S3 (completed deployment). S3 log retrieval is paginated: the client fetches the log in 1,000-line chunks, loading more on scroll, rather than downloading the entire log file upfront.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Preview Environment Management</h3>
        <p>Each branch in the connected Git repository gets a stable preview URL: preview-branch-name.project.platform.app. The "branch name" portion is sanitized (lowercased, special characters replaced with hyphens, truncated to 63 characters to fit DNS label limits). Subsequent pushes to the same branch create new deployments but maintain the same preview URL by updating the branch alias (a CDN alias from the branch preview URL to the latest deployment's URL). The preview URL always points to the latest successful deployment on that branch.</p>
        <p>Preview-specific environment variables: environment variables scoped to "preview" are injected into builds triggered from non-production branches. This allows preview deployments to use a staging database rather than the production database, a sandbox payment gateway rather than live payments, or a feature-flagged backend. Environment variable values are encrypted at rest (AES-256 with per-project keys) and are never included in build logs or API responses (they are injected into the build worker's environment directly, not returned to the dashboard UI). The UI shows the variable name and a masked value (first 2 chars + asterisks) to confirm the variable exists without revealing its value.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Domain Management and SSL</h3>
        <p>Custom domain configuration requires two steps: adding the domain in the dashboard (which registers the domain in the platform's CDN edge configuration) and updating DNS records at the registrar (which the user does manually, guided by the platform's DNS instructions). The platform supports both CNAME records (pointing to a platform-provided domain) and A records (pointing to a platform-provided IP, for apex domains that cannot use CNAME). After the user adds the domain, the dashboard shows the required DNS configuration and polls the domain's DNS record every 60 seconds to detect propagation.</p>
        <p>DNS propagation detection: the platform's backend performs DNS resolution for the custom domain and compares the resolved IP/CNAME with the expected value. Propagation is considered complete when at least 3 of 5 geographically distributed DNS resolvers return the correct value. The dashboard shows propagation status per resolver region ("US East: ✓, EU West: ✓, Asia Pacific: pending"). Full propagation typically takes 5–30 minutes for TTL-compliant DNS providers; the UI communicates this expected range to prevent users from thinking something is wrong during the propagation window.</p>
        <p>SSL certificate: once DNS propagates, the platform provisions an SSL certificate via Let's Encrypt using the HTTP-01 ACME challenge (the platform serves a challenge file at the well-known URL to prove domain control). Certificate provisioning takes approximately 30 seconds after DNS propagation. The certificate is renewed automatically 30 days before expiry. The dashboard shows the certificate's status, expiry date, and last renewal date. If a certificate renewal fails (typically due to DNS changes or rate limits), the dashboard shows a warning and allows the user to manually trigger re-provisioning.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Safe Release and Rollback</h3>
        <p>Production deployments are protected by a deployment safety workflow. Before a deployment is aliased to production, the platform runs configurable checks: HTTP health check (the deployment's health endpoint returns 200), Lighthouse performance score above a configured threshold, and custom check functions (the user can configure a check that calls their own API). Only if all checks pass does the alias update proceed. If a check fails, the deployment enters the "check failed" state and the previous production alias remains active—the failed deployment is never exposed to production traffic.</p>
        <p>Rollback is a first-class operation available from the deployment list. Selecting any past "ready" deployment and clicking "Promote to production" triggers an alias update without any rebuild. The rollback completes in under 10 seconds (CDN alias propagation time). The dashboard shows which deployment is the current production deployment (highlighted with a "Production" badge) and the history of production promotions. A deployment that was manually rolled back to is labeled "Restored" to distinguish it from a normal deployment promotion. Rollback actions are audit-logged (actor, timestamp, from/to deployment IDs).</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/platform-sdk-infra-systems/frontend-hosting-platform-dashboard-like-vercel-rollback-safe-release.svg"
          alt="Safe release and rollback showing deployment safety workflow (HTTP health check + Lighthouse score + custom checks → all pass → CDN alias update to new deployment; any fail → deployment stays at 'check failed', previous production alias unchanged), rollback flow (select past ready deployment → alias update only, no rebuild, completes in under 10s), deployment immutability (content-addressed URL, de-duplication of identical builds), branch preview alias (branch name → latest successful deployment on branch)."
          caption="Safe release: pre-promotion checks gate alias update; rollback is alias-only (under 10s), no rebuild; content-addressed deployments enable instant de-duplication"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>SSE versus WebSocket for log streaming: SSE is unidirectional (server to client) and sufficient for log streaming—the client does not send data to the server during log streaming. SSE uses regular HTTP (no connection upgrade), works through HTTP/2 multiplexing (reducing connection overhead), and is automatically reconnected by the browser on connection drop. WebSocket is bidirectional, which is unnecessary overhead for a read-only log stream. The one advantage of WebSocket over SSE is binary message support (SSE is text-only); build log lines are text, so SSE is the correct choice. The client should implement reconnection logic for SSE (the browser does this automatically for EventSource, but if using fetch-based SSE, reconnection must be manual): on disconnect, resume from the last received log line's Redis Stream ID to avoid duplicate or missing log lines.</p>
        <p>Deployment list pagination: a project with 1,000+ deployments requires cursor-based pagination (not offset pagination—offset pagination degrades as the cursor moves deeper into the list). The deployments are fetched in pages of 20, with a cursor derived from the last deployment's (createdAt, deploymentId). The user can load more deployments by scrolling (infinite scroll) or clicking "load more." The initial page load (first 20 deployments) is served from Redis cache (active project's recent deployments, cached for 30 seconds) for sub-200ms response times. Older deployments are fetched from PostgreSQL with a composite index on (projectId, createdAt DESC, deploymentId) for efficient cursor-based traversal.</p>
        <p>Environment variable security: storing environment variable values in the dashboard database requires encryption at rest and careful access control. The platform should never log environment variable values (even in error logs or build logs), never include them in API responses (only return the variable name and masked value), and provide an audit log of who viewed or changed environment variable values. For high-security use cases, consider integrating with external secret management systems (HashiCorp Vault, AWS Secrets Manager) where the platform stores only a reference to the secret (not the value itself) and retrieves the value at build time using a service account credential. This approach ensures that even if the platform's database is compromised, secret values are not exposed.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A hosting platform dashboard provides real-time visibility into Git-triggered build-and-deploy pipelines. Deployment status is tracked via an append-only event log (Kafka → PostgreSQL + Redis), polled every 5 seconds by the dashboard UI. Build log streaming uses SSE backed by Redis Streams (build worker XADD → streaming endpoint XREAD → SSE → virtualized log viewer with auto-scroll and client-side search). Deployments are content-addressed (URL derived from build hash), enabling instant rollback via CDN alias update (no rebuild, under 10 seconds). Preview environments use stable branch-aliased URLs (updated to the latest successful deployment on the branch). Production deployments are gated by a safety workflow (health check + Lighthouse + custom checks) before the alias update proceeds. Domain management polls DNS propagation across 5 geographically distributed resolvers; SSL is provisioned via Let's Encrypt HTTP-01 challenge after propagation. Environment variables are encrypted at rest, never logged, and shown as masked values in the UI. The fundamental performance insight is deployment immutability: by content-addressing deployments, both de-duplication (identical builds resolve instantly) and rollback (alias change, not rebuild) become O(1) operations regardless of build complexity.</p>
      </section>
    </ArticleLayout>
  );
}
