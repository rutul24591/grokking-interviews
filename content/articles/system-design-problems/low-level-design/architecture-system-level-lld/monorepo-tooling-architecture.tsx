"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-monorepo-tooling-architecture",
  title: "Monorepo Tooling Architecture",
  description:
    "Production-grade monorepo design covering pnpm workspace structure, Turborepo task orchestration and remote caching, Nx project graph and module boundaries, Changesets versioning, affected-only CI, dependency management, and when to split to polyrepo.",
  category: "low-level-design",
  subcategory: "architecture-system-level-lld",
  slug: "monorepo-tooling-architecture",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-16",
  tags: ["monorepo", "turborepo", "nx", "pnpm", "changesets", "ci-cd", "lld"],
};

export default function MonorepoToolingArchitectureArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
        A monorepo is a single version-controlled repository containing multiple related packages or applications.
        Done well, it enables atomic cross-package changes, unified tooling, shared CI infrastructure, and easy code
        sharing. Done poorly, it becomes a slow, untested monolith where every change rebuilds everything and every
        team blocks every other team. Staff-level engineers are expected to know the workspace structure, task
        caching mechanics, dependency management rules, and the tradeoffs versus a polyrepo setup.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/architecture-system-level-lld/monorepo-tooling-architecture.svg"
        alt="Monorepo tooling architecture diagram"
        caption="Workspace structure, build caching, dependency management, and CI/CD orchestration"
      />

      <h2>Workspace Structure</h2>
      <p>
        The workspace is the logical organization of packages within the monorepo. A well-structured workspace
        makes the dependency graph obvious and enforces separation of concerns:
      </p>

      <h3>Directory Layout</h3>
      <ul>
        <li><code>apps/</code> — deployable applications (Next.js app, React Native app, Electron app). Apps
        can depend on packages but packages never depend on apps.</li>
        <li><code>packages/</code> — shared libraries (UI components, utilities, API client, shared types,
        design tokens). Published to npm or consumed internally via workspace protocol.</li>
        <li><code>tools/</code> — build scripts, code generators, custom CLI tooling. Not deployable, not
        publishable — used only during development and CI.</li>
        <li><code>configs/</code> — shared configurations for ESLint, TypeScript, Prettier, Jest, Vitest,
        Tailwind. Each config is a small package that other packages extend.</li>
      </ul>

      <h3>Package Naming Convention</h3>
      <p>
        All packages use an organization scope: <code>@acme/ui</code>, <code>@acme/utils</code>,
        <code>@acme/api-client</code>. This prevents name collisions with npm packages and makes import paths
        self-documenting — any import starting with <code>@acme/</code> is internal code.
      </p>
      <p>
        Package names should describe their domain, not their implementation: <code>@acme/auth</code> rather than
        <code>@acme/jwt-handler</code>. The domain name remains stable even as the implementation evolves.
      </p>

      <h3>Package Manifest Pattern</h3>
      <p>
        Each package has a <code>package.json</code> that declares its exports precisely. Use the
        <code>exports</code> field with subpath exports to control what consumers can import:
      </p>
      <ul>
        <li><code>"."</code> — the main public API</li>
        <li><code>"./server"</code> — server-only code (prevents importing Node.js code in browser bundles)</li>
        <li><code>"./client"</code> — client-only code</li>
        <li><code>"./types"</code> — type-only exports</li>
      </ul>
      <p>
        Do not expose internal modules via subpath exports. <code>@acme/ui/internal/Button</code> should not be
        importable — only <code>@acme/ui</code> exposes the public API. This freedom to refactor internals is
        one of the core benefits of proper encapsulation.
      </p>

      <h2>pnpm Workspaces</h2>
      <p>
        pnpm is the recommended package manager for monorepos. Its key advantages over npm and yarn:
      </p>

      <h3>Strict Dependency Isolation</h3>
      <p>
        pnpm uses a content-addressable store and symlinked <code>node_modules</code> structure. Each package's
        <code>node_modules</code> contains only the dependencies that package explicitly declares. This prevents
        "phantom dependencies" — using a package that isn't declared in your <code>package.json</code> because
        it happens to be installed in the parent directory.
      </p>
      <p>
        With npm/yarn hoisting, a package can accidentally <code>require('lodash')</code> without listing it as
        a dependency, and it works in development because lodash is hoisted to the root. It breaks silently when
        the package that actually depends on lodash removes it. pnpm's strict mode makes this impossible.
      </p>

      <h3>Workspace Protocol</h3>
      <p>
        Internal packages reference each other using the workspace protocol in <code>package.json</code>:
        <code>"@acme/utils": "workspace:*"</code>. The <code>workspace:*</code> protocol always uses the local
        version of the package — not what's published to npm. This ensures that when you change <code>@acme/utils</code>,
        all consumers in the monorepo immediately see the change without a publish step.
      </p>
      <p>
        When publishing to npm (via Changesets), pnpm replaces <code>workspace:*</code> with the actual version
        number in the published package manifest. Internal consumers continue using workspace references; external
        consumers get the resolved version.
      </p>

      <h3>Shared Configuration Hoisting</h3>
      <p>
        Some packages must be at the root <code>node_modules</code> for tooling to work correctly — ESLint
        plugins, TypeScript, Prettier. Configure these in <code>.npmrc</code>:
        <code>public-hoist-pattern[]=*eslint*</code>. Hoist only what's necessary — unnecessary hoisting
        undermines pnpm's isolation guarantees.
      </p>

      <h2>Turborepo Task Orchestration</h2>
      <p>
        Turborepo is a task runner designed for monorepos. Its core capability: understanding the dependency
        graph between packages and using it to run tasks in the correct order with aggressive caching.
      </p>

      <h3>Task Graph Configuration</h3>
      <p>
        <code>turbo.json</code> defines the task pipeline. Each task declares its dependencies:
      </p>
      <ul>
        <li><code>"build": {"{'"}dependsOn": ["^build"]{"}"}</code> — run this package's build after all
        upstream packages' builds complete. The <code>^</code> means "in dependency packages".</li>
        <li><code>"test": {"{'"}dependsOn": ["build"]{"}"}</code> — run tests after the build in the same
        package completes.</li>
        <li><code>"lint": {"{'"}dependsOn": []{"}"}</code> — lint has no dependencies, can run in parallel
        with everything.</li>
      </ul>
      <p>
        Given this config, when you run <code>turbo build</code>, Turborepo:
      </p>
      <ol>
        <li>Builds the dependency graph: which packages depend on which.</li>
        <li>Builds packages without dependencies first, in parallel.</li>
        <li>Builds dependent packages only after their dependencies complete.</li>
        <li>Runs as many tasks in parallel as possible within the dependency constraints.</li>
      </ol>

      <h3>Content-Hash Caching</h3>
      <p>
        For each task, Turborepo computes a cache key from the hash of all inputs:
      </p>
      <ul>
        <li>Source files matching the declared input glob (e.g., <code>src/**</code>, <code>package.json</code>)</li>
        <li>Environment variable values declared as relevant</li>
        <li>The task's dependencies' cache keys (if a dependency's build changes, dependent packages' caches are
        invalidated)</li>
      </ul>
      <p>
        If the cache key matches a previous run, the task is skipped and the cached outputs are restored. The skip
        is near-instant — for a large monorepo where only one package changed, 95% of tasks can be cache hits,
        reducing CI time from 20 minutes to under 2 minutes.
      </p>

      <h3>Remote Cache</h3>
      <p>
        Local cache only helps on the same machine. Remote cache shares cache artifacts across all CI agents and
        all developers' machines. Turborepo supports Vercel Remote Cache (hosted) and self-hosted cache servers.
      </p>
      <p>
        When a CI agent computes a cache miss and runs a task, it uploads the output artifacts (compiled files,
        test results) to the remote cache. The next CI run (or another developer's machine) that computes the same
        cache key downloads the artifacts — zero recomputation. For a team of 50 engineers, remote cache means
        most builds are cache hits regardless of who built it last.
      </p>

      <HighlightBlock as="p" tier="crucial">
        Remote cache is the single highest-ROI optimization in a monorepo. A 20-minute CI pipeline with a warm
        remote cache often takes under 3 minutes — only changed packages build. Without remote cache, every CI
        agent starts cold and rebuilds everything every time.
      </HighlightBlock>

      <h3>Affected Package Detection</h3>
      <p>
        Run tasks only for packages affected by the current change:
        <code>turbo build --filter=...[origin/main]</code>. The <code>[origin/main]</code> filter selects packages
        that have changed compared to the main branch, plus all their dependents (because a change in
        <code>@acme/utils</code> might break <code>@acme/ui</code> which depends on it).
      </p>
      <p>
        This is the primary mechanism for fast CI on PRs. Instead of building and testing all 50 packages,
        only the 3 packages affected by the PR run.
      </p>

      <h2>Nx Project Graph and Module Boundaries</h2>
      <p>
        Nx is an alternative to (or complement of) Turborepo with stronger features around project graph analysis,
        code generation, and module boundary enforcement.
      </p>

      <h3>Project Graph</h3>
      <p>
        Nx builds a project graph by analyzing imports across all packages. This graph is used for:
      </p>
      <ul>
        <li>Affected project detection (same as Turborepo's filter)</li>
        <li>Circular dependency detection (circular imports between packages are flagged as errors)</li>
        <li>Visualization (Nx provides an interactive graph browser: <code>nx graph</code>)</li>
        <li>Impact analysis: "if I change <code>@acme/utils</code>, which 23 packages are affected?"</li>
      </ul>

      <h3>Module Boundary Enforcement</h3>
      <p>
        Nx's ESLint plugin enforces architectural constraints via <code>@nx/enforce-module-boundaries</code>. You
        declare which tags each project has (<code>type:app</code>, <code>type:lib</code>, <code>scope:auth</code>,
        <code>scope:payments</code>) and which can import which:
      </p>
      <ul>
        <li>Apps can import libs but not other apps.</li>
        <li>Libs tagged <code>scope:payments</code> cannot import libs tagged <code>scope:auth</code> (payment code
        should not depend on auth internals).</li>
        <li>Libs tagged <code>type:util</code> (pure utilities) cannot import libs tagged <code>type:feature</code>
        (which have side effects and framework dependencies).</li>
      </ul>
      <p>
        These rules are enforced by ESLint at lint time — not just by convention. A pull request that violates
        a boundary fails CI.
      </p>

      <h2>Dependency Management</h2>

      <h3>Version Synchronization</h3>
      <p>
        All packages in the monorepo should use the same version of shared dependencies (React, TypeScript, testing
        framework). Version divergence causes subtle bugs — multiple React versions loaded simultaneously break
        hooks. Use the root <code>package.json</code> to declare the canonical version of core shared dependencies.
        Each package's <code>package.json</code> declares them as peer dependencies and the root version satisfies them.
      </p>
      <p>
        A tool like <code>syncpack</code> audits version consistency across all package manifests in CI —
        fails if any package pins a different major version of a shared dependency.
      </p>

      <h3>External Dependency Updates</h3>
      <p>
        Renovate or Dependabot automatically opens PRs when external dependencies have new versions. In a monorepo,
        configure them to batch updates by package group (e.g., all React ecosystem packages in one PR, all testing
        framework packages in another). Avoid per-package update PRs — 50 packages × 20 dependencies = 1000 PRs
        per month.
      </p>
      <p>
        Critical: run the full test suite (affected packages only, using remote cache) on every dependency update
        PR. Many dependency updates break subtle behaviors — don't auto-merge without tests.
      </p>

      <h3>Peer Dependency Management</h3>
      <p>
        Shared libraries (UI component library, utility packages) declare their framework dependencies as peer
        dependencies, not direct dependencies. <code>@acme/ui</code> declares <code>"react": "^18.0.0"</code>
        as a peer — it doesn't bundle React, it expects the consuming application to provide it. This avoids
        the multiple-React problem and lets the consuming app control the React version.
      </p>

      <h2>Changesets for Versioning and Publishing</h2>
      <p>
        Changesets is the standard tool for versioning and publishing packages in a monorepo.
      </p>

      <h3>The Changeset Workflow</h3>
      <ol>
        <li>A developer makes changes to <code>@acme/ui</code> that fix a bug.</li>
        <li>They run <code>changeset add</code>, which prompts: "Which packages changed?" and "Is this a major,
        minor, or patch change?" They describe the change in a human-readable sentence.</li>
        <li>A <code>.changeset/random-name.md</code> file is committed with the PR.</li>
        <li>The Changesets GitHub bot opens a "Version Packages" PR that bumps versions, updates changelogs,
        and updates all internal workspace references.</li>
        <li>Merging the Version Packages PR triggers a CI job that publishes changed packages to npm.</li>
      </ol>

      <h3>Version Bump Rules</h3>
      <p>
        Changesets follows semantic versioning. The bump decision is made per-package, not globally:
      </p>
      <ul>
        <li><strong>Patch:</strong> Bug fixes with no API changes (<code>1.2.3</code> → <code>1.2.4</code>).</li>
        <li><strong>Minor:</strong> New features, backward-compatible API additions
        (<code>1.2.3</code> → <code>1.3.0</code>).</li>
        <li><strong>Major:</strong> Breaking changes — prop renames, removed exports, changed behavior
        (<code>1.2.3</code> → <code>2.0.0</code>).</li>
      </ul>
      <p>
        When <code>@acme/utils</code> gets a major bump, <code>@acme/ui</code> which depends on it also gets a
        major bump automatically (because its peer dependency contract changed). Changesets handles this cascade.
      </p>

      <h2>CI/CD Architecture</h2>

      <h3>PR Pipeline</h3>
      <p>
        On every PR, the CI pipeline runs only for affected packages:
      </p>
      <ol>
        <li>Compute affected packages: <code>turbo run build test lint --filter=...[origin/main]</code></li>
        <li>Turborepo checks remote cache — most tasks are hits from previous runs.</li>
        <li>Only changed packages and their dependents run. For a typical PR touching 1–2 packages, this is
        under 5 minutes including startup.</li>
        <li>PR merge is blocked until all checks pass.</li>
      </ol>

      <h3>Main Branch Pipeline</h3>
      <p>
        On merge to main, the full pipeline runs to verify the complete state:
      </p>
      <ol>
        <li>Build all packages (with cache — most are already built from PR checks).</li>
        <li>Run end-to-end tests against the full application builds.</li>
        <li>Deploy changed apps to staging environments.</li>
        <li>If a Version Packages PR is open: publish changed packages to npm.</li>
      </ol>

      <h3>Parallelization Strategy</h3>
      <p>
        Turborepo's parallel execution handles task-level parallelism. For large monorepos, add agent-level
        parallelism: split the full task list across multiple CI agents and let each agent handle a subset.
        Turborepo's distributed task execution (via a task queue) assigns tasks to available agents and
        handles coordination. The remote cache ensures no task is executed twice.
      </p>

      <h2>Code Generation</h2>
      <p>
        New packages in a monorepo should be created consistently — same file structure, same config files,
        same exports pattern. Code generators eliminate the boilerplate and ensure every package follows the
        standard:
      </p>
      <ul>
        <li><strong>Nx generators:</strong> <code>nx generate @nx/react:library @acme/my-lib</code> scaffolds
        a complete library package with tsconfig, eslint config, jest config, and an index.ts entry point.</li>
        <li><strong>hygen:</strong> Template-based generator for simpler, custom scaffolding patterns.</li>
        <li><strong>plop:</strong> Interactive CLI for generating files from templates with prompts.</li>
      </ul>
      <p>
        For GraphQL codegen in a monorepo: run <code>graphql-codegen</code> in CI against the GraphQL schema.
        Generated TypeScript types are committed to the repository (not gitignored) — they're artifacts that
        other packages import, and they need to be in source control for type checking to work across packages.
        A CI check verifies the committed types are up to date with the schema.
      </p>

      <h2>Monorepo vs Polyrepo Decision</h2>
      <p>
        Not every organization should use a monorepo. The decision depends on team structure, deployment cadence,
        and code coupling.
      </p>

      <h3>When Monorepo Makes Sense</h3>
      <ul>
        <li>Multiple apps share significant code (shared UI library, shared utilities, shared API client).</li>
        <li>Atomic cross-package changes are frequent — a single feature touches the shared component library
        and two apps simultaneously.</li>
        <li>A single team (or small number of teams) owns all the code — coordination overhead is low.</li>
        <li>Consistent tooling and standards across packages is a priority.</li>
      </ul>

      <h3>When Polyrepo Makes Sense</h3>
      <ul>
        <li>10+ independent teams with completely different tech stacks, deploy cadences, and code ownership.
        A monorepo creates artificial coupling between teams that would rather be fully autonomous.</li>
        <li>Packages have very different security or compliance requirements — a payment processing service
        might need separate audit trails, access controls, and deployment pipelines that are hard to maintain
        in a monorepo.</li>
        <li>The monorepo has grown to the point where even affected-only CI takes too long — a rare but real
        problem at Google/Meta scale, where they have custom build systems (Bazel, Buck2) specifically designed
        for massive monorepos.</li>
      </ul>

      <HighlightBlock as="p" tier="important">
        Most teams in a FAANG interview context should default to monorepo for a multi-package frontend. The tooling
        (Turborepo, pnpm, Changesets) has made the operational overhead minimal. Move to polyrepo only when you
        have genuine organizational reasons — not because "monorepos are complex."
      </HighlightBlock>

      <h2>Interview Q&A</h2>

      <h3>Q: How does Turborepo know which packages to rebuild when you change a shared utility?</h3>
      <p>
        Turborepo builds a dependency graph by reading <code>package.json</code> dependencies across all
        workspace packages. It knows that <code>@acme/ui</code> depends on <code>@acme/utils</code> because
        <code>@acme/ui/package.json</code> lists <code>"@acme/utils": "workspace:*"</code>.
      </p>
      <p>
        When <code>@acme/utils</code> changes, Turborepo marks it as affected. It then traverses the dependency
        graph in reverse — every package that depends on <code>@acme/utils</code> (directly or transitively) is
        also marked affected. All affected packages run their tasks in topological order: <code>@acme/utils</code>
        builds first, then its dependents build.
      </p>
      <p>
        The cache key for each affected package includes the cache key of its dependencies — so when
        <code>@acme/utils</code> changes and its build output hash changes, every dependent package's cache key
        also changes, forcing a cache miss and a rebuild. Packages not in the affected set get cache hits and
        are skipped entirely.
      </p>

      <h3>Q: How do you prevent one team's package from importing another team's internal code?</h3>
      <p>
        Two mechanisms work together:
      </p>
      <p>
        <strong>Package exports field:</strong> In <code>@acme/auth/package.json</code>, define
        <code>"exports"</code> precisely. Only paths listed in exports are importable. Internal modules not
        in exports throw a module resolution error. This is enforced by Node.js and bundlers — not just convention.
      </p>
      <p>
        <strong>Nx module boundary rules:</strong> Configure ESLint with <code>@nx/enforce-module-boundaries</code>.
        Tag packages with domain tags (<code>scope:auth</code>, <code>scope:payments</code>) and declare which
        tags can import which. A payments package importing an auth internal module fails lint in CI.
      </p>
      <p>
        These two defenses are complementary — package exports prevent the import at runtime/build time, and
        module boundaries prevent it at the lint level before CI even starts.
      </p>

      <h3>Q: A developer accidentally introduced a circular dependency between two packages. How do you detect and fix it?</h3>
      <p>
        Detection: Nx's project graph analysis detects circular imports automatically. Run <code>nx graph</code>
        to visualize — circular dependencies are highlighted. Also configure <code>eslint-plugin-import</code>
        with <code>import/no-cycle</code> — this catches circular imports within and between packages at lint time.
        Turborepo's task execution will deadlock on circular package dependencies (Package A waits for B, B waits
        for A) — a visible symptom that the CI pipeline hangs.
      </p>
      <p>
        Fix: circular dependencies almost always indicate that two packages share a concern that should be
        extracted to a third package. For example, if <code>@acme/ui</code> imports from <code>@acme/auth</code>
        and <code>@acme/auth</code> imports from <code>@acme/ui</code>, extract the shared types or utilities
        into <code>@acme/types</code> or <code>@acme/utils</code> that both depend on. Neither package imports
        the other — the circular dependency is broken.
      </p>

      <h3>Q: How do you manage a shared component library that different apps need to use at different versions simultaneously?</h3>
      <p>
        This scenario — app-A on <code>@acme/ui@1.x</code>, app-B on <code>@acme/ui@2.x</code> — is a signal that
        the monorepo's benefit (shared versions) is breaking down. Within a monorepo using workspace protocol, all
        apps always use the same version of internal packages. Version divergence only applies to externally
        published packages.
      </p>
      <p>
        If apps genuinely need different major versions during a migration: use a compatibility shim. Publish both
        <code>@acme/ui-v1</code> and <code>@acme/ui-v2</code> as separate packages simultaneously. App-A depends
        on v1, App-B depends on v2, and the migration timeline is clear: all apps migrate to v2 before v1 is
        deprecated. Within the monorepo, maintain both packages until all consumers have migrated.
      </p>
      <p>
        Better prevention: use a feature flag inside <code>@acme/ui</code> to enable/disable the breaking change
        behavior. Apps opt into the new behavior via a prop or context flag rather than a version upgrade. When
        all apps have opted in, remove the flag in a clean major version bump. This avoids the dual-package
        maintenance burden.
      </p>
    </ArticleLayout>
  );
}
