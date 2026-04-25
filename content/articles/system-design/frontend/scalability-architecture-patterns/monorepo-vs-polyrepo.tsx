"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-monorepo-vs-polyrepo",
  title: "Monorepo vs Polyrepo",
  description:
    "In-depth comparison of Monorepo and Polyrepo strategies for frontend projects covering tooling, CI/CD, dependency management, team workflows, and migration strategies.",
  category: "frontend",
  subcategory: "scalability-architecture-patterns",
  slug: "monorepo-vs-polyrepo",
  wordCount: 3500,
  readingTime: 14,
  lastUpdated: "2026-03-20",
  tags: [
    "frontend",
    "monorepo",
    "polyrepo",
    "architecture",
    "tooling",
    "CI-CD",
  ],
  relatedTopics: [
    "module-federation",
    "micro-frontends",
    "component-libraries-and-design-systems",
  ],
};

export default function MonorepoVsPolyrepoArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="crucial">
          A <strong>monorepo</strong> is a single version-controlled repository
          that contains multiple distinct projects, packages, or services that
          may or may not be related. A <strong>polyrepo</strong>
          (also called multi-repo) is a strategy where each project or package
          lives in its own repository with its own version history, CI/CD
          pipeline, and release lifecycle.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The monorepo vs polyrepo decision is one of the most consequential
          architectural choices a frontend platform team makes. It affects
          developer workflow (atomic cross-package changes vs versioned
          dependency updates), CI/CD complexity (affected-project detection vs
          independent pipelines), code sharing (internal imports vs published
          packages), and team coordination (trunk-based development vs
          independent release schedules).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Google, Meta, Microsoft, and Uber operate massive monorepos containing
          billions of lines of code. Netflix, Amazon, and Spotify favor
          polyrepos aligned with autonomous team ownership. Neither approach is
          universally superior — the right choice depends on team size,
          deployment model, code sharing patterns, and organizational culture.
          Many organizations use a hybrid: a monorepo for closely related
          packages (design system + shared utilities + main app) and polyrepos
          for independent services.
        </HighlightBlock>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <ul>
          <li>
            <strong>Workspace Packages:</strong> In a monorepo, each project is
            a &quot;workspace package&quot; with its own package.json, but
            sharing a root-level node_modules and lockfile. Package managers
            (pnpm workspaces, npm workspaces, Yarn workspaces) handle internal
            dependency linking, and tools like Nx and Turborepo orchestrate
            builds across packages.
          </li>
          <li>
            <strong>Affected/Changed Detection:</strong> Monorepo build tools
            analyze the dependency graph to determine which packages are
            affected by a given code change. Only affected packages need to be
            built, tested, and deployed. This is essential for monorepo
            scalability — without it, every commit would trigger builds for all
            packages.
          </li>
          <li>
            <strong>Task Orchestration and Caching:</strong> Tools like Nx and
            Turborepo model builds as a directed acyclic graph (DAG) of tasks.
            Tasks are executed in parallel when their dependencies allow, and
            results are cached (locally and remotely) so that unchanged packages
            are not rebuilt. Remote caching means one developer&apos;s build
            result can be reused by the entire team.
          </li>
          <li>
            <strong>Code Ownership:</strong> CODEOWNERS files define which teams
            own which directories in a monorepo. Pull requests that modify owned
            directories require review from the owning team. This provides team
            autonomy within a shared repository. In polyrepos, ownership is
            implicit — each repo has its own maintainers.
          </li>
          <HighlightBlock as="li" tier="crucial">
            <strong>Atomic Changes:</strong> In a monorepo, a single commit can
            modify multiple packages atomically — update a shared library and
            all consuming applications in one PR. In polyrepos, this requires
            coordinated releases: publish the library, then update each
            consumer&apos;s dependency in separate PRs. Atomic changes are the
            primary workflow advantage of monorepos.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Versioned Dependencies:</strong> In polyrepos, packages
            consume each other through versioned dependencies published to a
            package registry. This provides explicit version control (consumers
            choose when to upgrade) but requires a publish workflow and can lead
            to version fragmentation (different consumers on different
            versions).
          </HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <HighlightBlock as="p" tier="crucial">
          The architectural differences between monorepo and polyrepo manifest
          in every aspect of the development workflow — from code sharing to
          deployment.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Monorepo Structure</h3>
          <p>A typical frontend monorepo structure with shared tooling:</p>
          <ul className="mt-3 space-y-1 font-mono text-sm">
            <li>my-org/</li>
            <li>&nbsp;&nbsp;├── packages/</li>
            <li>
              &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──
              design-system/&nbsp;&nbsp;(shared components)
            </li>
            <li>
              &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──
              utils/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(shared
              utilities)
            </li>
            <li>
              &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──
              types/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(shared
              TypeScript types)
            </li>
            <li>
              &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──
              eslint-config/&nbsp;&nbsp;(shared lint rules)
            </li>
            <li>
              &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└──
              tsconfig/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(shared TS
              config)
            </li>
            <li>&nbsp;&nbsp;├── apps/</li>
            <li>
              &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──
              web/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(main
              web app)
            </li>
            <li>
              &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──
              admin/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(admin
              dashboard)
            </li>
            <li>
              &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└──
              docs/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(documentation
              site)
            </li>
            <li>
              &nbsp;&nbsp;├──
              turbo.json&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(task
              pipeline config)
            </li>
            <li>&nbsp;&nbsp;├── pnpm-workspace.yaml</li>
            <li>
              &nbsp;&nbsp;└──
              package.json&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(root with
              shared devDeps)
            </li>
          </ul>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/scalability-architecture-patterns/monorepo-vs-polyrepo-diagram-1.svg"
          alt="Monorepo vs Polyrepo structure comparison showing single repository with apps and packages folders versus multiple separate repositories"
          caption="Monorepo vs Polyrepo — structural differences between single repository with shared tooling versus multiple independent repositories"
          captionTier="important"
        />

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Polyrepo Structure</h3>
          <p>The same organization with separate repositories:</p>
          <ul className="mt-3 space-y-1 font-mono text-sm">
            <li>
              my-org/design-system&nbsp;&nbsp;→ publishes @my-org/design-system
              to npm
            </li>
            <li>
              my-org/utils&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→
              publishes @my-org/utils to npm
            </li>
            <li>
              my-org/types&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→
              publishes @my-org/types to npm
            </li>
            <li>
              my-org/web-app&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→
              depends on @my-org/* via npm
            </li>
            <li>
              my-org/admin-app&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→
              depends on @my-org/* via npm
            </li>
            <li>
              my-org/docs-site&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→
              depends on @my-org/* via npm
            </li>
          </ul>
          <HighlightBlock as="p" tier="important" className="mt-3">
            Each repo has its own CI/CD pipeline, package.json, lockfile, and
            release schedule. Cross-repo changes require publishing a new
            version and updating consumers.
          </HighlightBlock>
        </div>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Monorepo</th>
              <th className="p-3 text-left">Polyrepo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Code Sharing</strong>
              </td>
              <td className="p-3">
                • Direct imports between packages
                <br />
                • No publish step for internal deps
                <br />• Always using latest version
              </td>
              <td className="p-3">
                • Published packages via registry
                <br />
                • Explicit versioning and changelogs
                <br />• Consumers choose when to upgrade
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>CI/CD</strong>
              </td>
              <td className="p-3">
                • Single pipeline with affected detection
                <br />
                • Remote caching eliminates redundant builds
                <br />• Complex initial setup (Nx/Turborepo config)
              </td>
              <td className="p-3">
                • Simple per-repo pipelines
                <br />
                • Independent build/test/deploy
                <br />• No cross-repo impact analysis
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Refactoring</strong>
              </td>
              <td className="p-3">
                • Atomic cross-package refactors in one PR
                <br />
                • IDE find-and-replace works across packages
                <br />• No version coordination needed
              </td>
              <td className="p-3">
                • Coordinated releases across repos
                <br />
                • Multi-PR workflow for breaking changes
                <br />• Backward compatibility required longer
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Team Autonomy</strong>
              </td>
              <td className="p-3">
                • CODEOWNERS for team boundaries
                <br />
                • Shared tooling standardization
                <br />• Less flexibility in toolchain choices
              </td>
              <td className="p-3">
                • Full control over repo configuration
                <br />
                • Independent technology choices
                <br />• Clear ownership boundaries
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Scale</strong>
              </td>
              <td className="p-3">
                <HighlightBlock tier="crucial">
                  • Git performance degrades with size
                  <br />
                  • Requires specialized tooling (Nx, Bazel)
                  <br />• Single lockfile can cause merge conflicts
                </HighlightBlock>
              </td>
              <td className="p-3">
                • Git performance is always fast
                <br />
                • Standard tooling works out-of-box
                <br />• Dependency version fragmentation
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>Choose Based on Code Sharing Frequency:</strong> If packages
            change together frequently (shared library + consumers), a monorepo
            eliminates version coordination overhead. If packages are truly
            independent with different release cadences, polyrepo provides
            cleaner boundaries.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Invest in Tooling Early for Monorepos:</strong> A monorepo
            without proper tooling (Nx, Turborepo, or Bazel) becomes a nightmare
            at scale. Set up affected detection, remote caching, and task
            orchestration before the repo grows beyond a few packages. The
            tooling investment pays for itself quickly.
          </HighlightBlock>
          <li>
            <strong>Use CODEOWNERS for Monorepo Governance:</strong> Define
            clear ownership boundaries using CODEOWNERS files. Each package
            directory should have an owning team that reviews changes. This
            provides team autonomy within the monorepo and prevents unreviewed
            cross-team changes.
          </li>
          <li>
            <strong>Automate Publishing for Polyrepos:</strong> Use tools like
            changesets, semantic-release, or Lerna for automated versioning and
            publishing. Manual version bumps and npm publish commands are
            error-prone and create bottlenecks. Automate the entire release
            pipeline.
          </li>
          <li>
            <strong>Enforce Consistent Standards:</strong> In monorepos, use
            shared ESLint configs, shared tsconfig, and shared Prettier config
            at the root level. In polyrepos, publish these as packages and
            require them in each repo. Consistency reduces context-switching
            cost when developers move between packages.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Consider the Hybrid Approach:</strong> Use a monorepo for
            closely related packages (design system + apps that consume it) and
            polyrepos for truly independent services. This captures the benefits
            of both strategies where they are most applicable.
          </HighlightBlock>
        </ol>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/scalability-architecture-patterns/monorepo-vs-polyrepo-diagram-2.svg"
        alt="Monorepo affected detection and remote caching flow showing git diff analysis, dependency graph traversal, and cache hit/miss paths"
        caption="Affected detection &amp; remote caching — monorepo tools analyze changes and skip unchanged builds using cached artifacts"
        captionTier="important"
      />

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>Monorepo Without Tooling:</strong> Using a monorepo with
            only npm workspaces and no build orchestration tool leads to full
            rebuilds on every change, slow CI, and developer frustration. Nx or
            Turborepo are not optional — they are essential infrastructure for
            monorepo productivity.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Polyrepo Dependency Hell:</strong> In polyrepos, different
            consumers running different versions of shared packages creates a
            matrix of configurations that is difficult to test and support. Use
            automated dependency update tools (Renovate, Dependabot) and enforce
            a maximum version lag policy.
          </HighlightBlock>
          <li>
            <strong>Monorepo Merge Conflicts:</strong> A single lockfile
            (pnpm-lock.yaml) in a monorepo with many active developers creates
            frequent merge conflicts. Use pnpm&apos;s merge driver and rebase
            workflows to mitigate this.
          </li>
          <li>
            <strong>Implicit Cross-Package Dependencies:</strong> In monorepos,
            it is easy to accidentally import from a package without declaring
            it in package.json dependencies. This works locally (packages are
            linked) but fails in CI or production. Use lint rules that enforce
            explicit dependency declarations.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Over-Coupling in Monorepos:</strong> Just because packages
            are in the same repo does not mean they should depend on each other.
            Maintain clear module boundaries. If every package imports from
            every other package, you have a monolith, not a monorepo.
          </HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <HighlightBlock as="li" tier="crucial">
            <strong>Google (Monorepo):</strong> Google operates one of the
            largest monorepos in the world with billions of lines of code across
            thousands of projects. They built custom tools (Blaze/Bazel) for
            build orchestration and Piper for version control at this scale.
          </HighlightBlock>
          <li>
            <strong>Vercel/Next.js (Monorepo with Turborepo):</strong> The
            Next.js repository is a monorepo managed with Turborepo (which
            Vercel built for this purpose). It contains the framework, examples,
            documentation, and test suites in a single repo with remote caching
            for CI optimization.
          </li>
          <li>
            <strong>Netflix (Polyrepo):</strong> Netflix uses polyrepos aligned
            with team ownership. Each microservice and UI application is a
            separate repository with independent deployment pipelines,
            reflecting their culture of autonomous engineering teams.
          </li>
          <li>
            <strong>Nx (Monorepo Tooling):</strong> Nx itself is developed in a
            monorepo and provides the gold standard for monorepo tooling —
            project graph visualization, affected commands, distributed task
            execution, and plugins for every major framework.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Design System Monorepos:</strong> Many organizations
            maintain their design system in a monorepo — component library,
            documentation site, icon package, token package, and playground all
            in one repo. This enables atomic changes across the system (update a
            token and its documentation simultaneously).
          </HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Security Considerations</h2>
        <HighlightBlock as="p" tier="crucial">
          Monorepo and Polyrepo architectures introduce different security considerations around access control, dependency management, and supply chain security.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Monorepo Security</h3>
          <ul className="space-y-2">
            <HighlightBlock as="li" tier="important">
              <strong>Access Control:</strong> All developers have access to all code. Mitigation: implement CODEOWNERS for sensitive packages, use branch protection rules, audit all changes to security-critical code.
            </HighlightBlock>
            <li>
              <strong>Dependency Management:</strong> Shared dependencies are deduplicated. Mitigation: use automated dependency updates (Dependabot, Renovate), pin exact versions, implement security scanning for all dependencies.
            </li>
            <li>
              <strong>Supply Chain Security:</strong> Single source of truth reduces supply chain attacks. Mitigation: verify all external dependencies, use lockfiles, implement CI/CD security scanning.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Polyrepo Security</h3>
          <ul className="space-y-2">
            <HighlightBlock as="li" tier="important">
              <strong>Access Control:</strong> Fine-grained access per repository. Mitigation: implement organization-wide security policies, audit access across all repositories, use SSO for all repositories.
            </HighlightBlock>
            <li>
              <strong>Dependency Management:</strong> Each repo manages its own dependencies. Mitigation: use shared dependency baselines, implement automated security scanning, coordinate security updates across repos.
            </li>
            <li>
              <strong>Supply Chain Security:</strong> Multiple repositories increase attack surface. Mitigation: use private registries, verify package signatures, implement dependency allowlists.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Performance Benchmarks</h2>
        <HighlightBlock as="p" tier="crucial">
          Monorepo and Polyrepo performance depends on repository size, build tooling efficiency, and CI/CD infrastructure.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Performance Metrics to Track</h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Metric</th>
                <th className="p-2 text-left">Target</th>
                <th className="p-2 text-left">Measurement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Clone Time</td>
                <td className="p-2">&lt;30 seconds</td>
                <td className="p-2">git clone timing</td>
              </tr>
              <tr>
                <td className="p-2">Build Time (Affected)</td>
                <td className="p-2">&lt;5 minutes</td>
                <td className="p-2">CI/CD metrics</td>
              </tr>
              <tr>
                <td className="p-2">CI/CD Queue Time</td>
                <td className="p-2">&lt;2 minutes</td>
                <td className="p-2">CI/CD metrics</td>
              </tr>
              <tr>
                <td className="p-2">Repository Size</td>
                <td className="p-2">&lt;10GB (monorepo)</td>
                <td className="p-2">git count-objects</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Build Tool Comparison</h3>
          <p>
            Different build tools have different performance characteristics for monorepos:
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <strong>Nx:</strong> Affected builds: ~1-3 minutes. Best for: large monorepos, TypeScript projects. Limitation: initial setup complexity.
            </li>
            <li>
              <strong>Turborepo:</strong> Affected builds: ~1-2 minutes. Best for: React/Next.js monorepos. Limitation: less flexible than Nx.
            </li>
            <li>
              <strong>Lerna:</strong> Affected builds: ~3-5 minutes. Best for: JavaScript package monorepos. Limitation: slower than Nx/Turborepo.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Cost Analysis</h2>
        <HighlightBlock as="p" tier="crucial">
          Monorepo and Polyrepo architectures have different cost profiles for infrastructure, tooling, and developer productivity.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Monorepo Costs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Infrastructure:</strong> Single large repository. Git hosting: $100-500/month for large repos. CI/CD: $500-2,000/month with affected builds.
            </li>
            <li>
              <strong>Tooling:</strong> Nx Cloud, Turborepo Turbo: $0-500/month for remote caching.
            </li>
            <li>
              <strong>Operations:</strong> 0.25-0.5 FTE for monorepo maintenance.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Polyrepo Costs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Infrastructure:</strong> Multiple repositories. Git hosting: $200-1,000/month for many repos. CI/CD: $1,000-5,000/month (duplicated pipelines).
            </li>
            <li>
              <strong>Tooling:</strong> Per-repo tooling configuration. Estimate: 2-3x more configuration than monorepo.
            </li>
            <li>
              <strong>Operations:</strong> 0.5-1 FTE for multi-repo coordination.
            </li>
          </ul>
        </div>

        <HighlightBlock
          className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6"
          tier="important"
        >
          <h3 className="mb-3 font-semibold">ROI Decision Framework</h3>
          <p>
            Choose monorepo when: (1) you have 3+ teams sharing code, (2) you need atomic cross-package changes, (3) you have dedicated platform team. Choose polyrepo when: (1) teams need full autonomy, (2) packages have independent release cycles, (3) you lack monorepo expertise. For most startups with 3-10 teams, monorepo shows better ROI.
          </p>
        </HighlightBlock>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <HighlightBlock
            className="rounded-lg border border-theme bg-panel-soft p-4"
            tier="crucial"
          >
            <p className="font-semibold">
              Q: When would you choose a monorepo over a polyrepo?
            </p>
            <p className="mt-2 text-sm">
              A: Choose monorepo when: (1) packages frequently change together
              (shared library + consumers), (2) you want atomic cross-package
              refactoring, (3) you have a dedicated platform team that can
              maintain the tooling, (4) consistency across packages (linting,
              testing, build config) is a priority, and (5) code sharing is
              frequent and needs to be frictionless. Choose polyrepo when: teams
              need full autonomy over technology choices, packages have truly
              independent release cadences, the organization lacks monorepo
              tooling expertise, or the codebase would be too large for Git to
              handle efficiently.
            </p>
          </HighlightBlock>

          <HighlightBlock
            className="rounded-lg border border-theme bg-panel-soft p-4"
            tier="important"
          >
            <p className="font-semibold">
              Q: How does affected detection work in monorepo build systems?
            </p>
            <p className="mt-2 text-sm">
              A: Build tools like Nx and Turborepo maintain a project graph — a
              DAG of packages and their dependencies. When a commit is made, the
              tool compares changed files against the project graph to determine
              which packages are directly or transitively affected. Only
              affected packages are built, tested, and potentially deployed. For
              example, if shared/utils changes, the tool identifies all packages
              that import from shared/utils and schedules their builds. Combined
              with remote caching (reusing build outputs from other developers
              or CI runs), this keeps build times manageable even in large
              monorepos.
            </p>
          </HighlightBlock>

          <HighlightBlock
            className="rounded-lg border border-theme bg-panel-soft p-4"
            tier="important"
          >
            <p className="font-semibold">
              Q: What is remote caching, and why is it important for monorepos?
            </p>
            <p className="mt-2 text-sm">
              A: Remote caching stores build outputs (compiled code, test
              results, lint results) in a shared cache (cloud storage or Nx
              Cloud/Vercel Remote Cache). When developer A builds package X, the
              output is cached. When developer B or CI builds the same package
              with the same inputs, the cached output is returned instantly
              without running the build. This is critical for monorepos because
              without it, every developer and CI run rebuilds everything from
              scratch. With remote caching, builds are typically 10-50x faster
              because most packages have not changed and their cached outputs
              are reused.
            </p>
          </HighlightBlock>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you migrate from polyrepo to monorepo (or vice versa)?
            </p>
            <p className="mt-2 text-sm">
              A: Polyrepo → Monorepo: (1) Set up monorepo tooling (Nx/Turborepo
              + pnpm workspaces). (2) Move repos one at a time, starting with
              shared libraries. (3) Use git subtree or git filter-repo to
              preserve commit history. (4) Update CI to use affected detection.
              (5) Convert published packages to internal workspace dependencies.
              Monorepo → Polyrepo: (1) Extract packages using git filter-branch
              to preserve history. (2) Set up independent CI pipelines. (3)
              Publish shared packages to a registry. (4) Update consumers to
              depend on published versions. Both directions are disruptive —
              plan for a transition period where both setups coexist.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do tools like Nx and Turborepo differ?
            </p>
            <p className="mt-2 text-sm">
              A: Turborepo is focused on task orchestration and caching — it
              runs package.json scripts in the correct order with maximum
              parallelism and caches results. It is lightweight and
              framework-agnostic. Nx is a full monorepo framework with project
              graph analysis, code generation, affected detection, distributed
              task execution, and plugins for specific frameworks (React,
              Angular, Node). Nx is more opinionated and feature-rich; Turborepo
              is simpler and easier to adopt. Choose Turborepo for
              straightforward task caching; choose Nx for advanced features like
              code generation and framework-specific tooling.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://nx.dev/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nx — Smart Monorepo Tooling
            </a>
          </li>
          <li>
            <a
              href="https://turbo.build/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Turborepo — High-Performance Build System for Monorepos
            </a>
          </li>
          <li>
            <a
              href="https://monorepo.tools/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              monorepo.tools — Monorepo Tooling Comparison
            </a>
          </li>
          <li>
            <a
              href="https://pnpm.io/workspaces"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              pnpm — Workspaces Documentation
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
