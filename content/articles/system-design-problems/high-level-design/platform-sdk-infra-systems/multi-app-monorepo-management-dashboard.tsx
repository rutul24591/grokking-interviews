"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-multi-app-monorepo-management-dashboard",
  title: "Design a Multi-App Monorepo Management Dashboard",
  description:
    "Architecture for a monorepo management dashboard: workspace graph, affected change detection, pipeline orchestration, release coordination, and cross-team dependency visibility.",
  category: "high-level-design",
  subcategory: "platform-sdk-infra-systems",
  slug: "multi-app-monorepo-management-dashboard",
  wordCount: 5300,
  readingTime: 32,
  lastUpdated: "2026-05-10",
  tags: ["hld", "monorepo", "nx", "turborepo", "affected-packages", "pipeline", "release"],
  relatedTopics: ["frontend-architecture-for-an-internal-developer-platform", "multi-brand-design-system"],
};

export default function MultiAppMonorepoManagementDashboardArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A multi-app monorepo management dashboard gives engineering teams visibility and control over a monorepo containing multiple applications and shared libraries. At small scale (5 packages, 2 apps), a monorepo's state is transparent from the command line. At large scale (200 packages, 30 apps, 10 teams), the monorepo's state becomes opaque: it is not obvious which packages are affected by a given change, which teams own which packages, whether all packages are tested before a release, or why a CI pipeline is slow. The dashboard addresses this opacity by visualizing the workspace graph, tracking build and test pipeline state, coordinating cross-team releases, and surfacing dependency health.</p>
        <p>The central engineering challenge is the change impact analysis: given a set of changed files in a pull request, which packages and applications are affected? This requires computing the transitive closure of the reverse dependency graph (all packages that directly or transitively depend on the changed package). Doing this accurately and quickly (under 2 seconds for a 200-package monorepo) is the core computation the dashboard must perform, because all other features (targeted builds, affected test runs, release scope) derive from it.</p>
        <p><strong>Explicit assumptions:</strong> The monorepo uses a package manager workspace protocol (npm/yarn/pnpm workspaces) and is managed by a task runner (Nx or Turborepo). Package boundaries are declared via package.json files with explicit intra-monorepo dependencies. The dashboard is a web application that reads monorepo metadata from a Git repository (via GitHub/GitLab API) and a CI system (GitHub Actions, CircleCI). Teams are mapped to packages via a CODEOWNERS file. The dashboard is used primarily by platform engineers and engineering managers, not individual developers.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Workspace graph:</strong> Visualize the dependency graph of all packages and apps in the monorepo. Show direct and transitive dependencies. Filter the graph by team, package type (app, library, utility), or specific package.</li>
          <li><strong>Affected change detection:</strong> Given a pull request (or a list of changed files), show which packages are affected (directly or transitively). Highlight the affected subgraph in the workspace visualization.</li>
          <li><strong>Pipeline state:</strong> Show the current CI/CD pipeline state for each affected package: pending, running, passed, failed. Link to individual build and test logs.</li>
          <li><strong>Release coordination:</strong> Track which packages have unreleased changes (published version behind the monorepo's current HEAD for that package). Generate a proposed release plan (which packages to release, in dependency order) and track release progress.</li>
          <li><strong>Dependency health:</strong> Identify dependency issues: circular dependencies, packages using multiple major versions of the same library, outdated third-party dependencies.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Graph computation speed:</strong> The workspace graph for a 200-package monorepo is computed and rendered within 2 seconds of a page load.</li>
          <li><strong>Affected package accuracy:</strong> The affected package set must be identical to what the task runner (Nx/Turborepo) computes—no false negatives (missing affected packages) are acceptable.</li>
          <li><strong>Staleness:</strong> The dashboard's view of the monorepo state (package versions, dependency graph, CI state) is updated within 60 seconds of a change to the monorepo's main branch.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The dashboard's backend is a Monorepo Analyzer service that periodically (and on webhook trigger) clones or fetches the latest monorepo state, computes the workspace graph (by parsing all package.json files and their dependencies), and stores the graph in a database. The frontend queries this pre-computed graph for visualization and affected-package computation. CI pipeline state is fetched from the CI API (GitHub Actions, CircleCI) on demand and cached. The release tracker monitors published npm package versions (from the registry) and compares them to the monorepo's current package.json versions to identify unreleased packages.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/platform-sdk-infra-systems/multi-app-monorepo-management-dashboard-architecture.svg"
          alt="Monorepo dashboard architecture showing Monorepo Analyzer (GitHub webhook on push → clone/fetch monorepo → parse all package.json → compute workspace graph → store in graph database), workspace graph visualization (force-directed graph with D3.js or Cytoscape, filter by team/type, highlight affected subgraph), CI pipeline state (GitHub Actions API with 30s cache), release tracker (npm registry version vs monorepo HEAD version → unreleased packages), and dependency health scanner (circular dependency detection, version conflict detection)."
          caption="Dashboard architecture: Monorepo Analyzer (webhook-triggered graph parsing), workspace graph visualization, CI API polling, npm registry release tracker, and dependency health scanner"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Workspace Graph Computation</h3>
        <p>The Monorepo Analyzer parses the monorepo's package.json files to build the workspace graph. The parser discovers all packages by reading the workspaces field of the root package.json (which lists glob patterns like packages/*) and resolving all matching package.json files. For each package, it reads the name, version, and dependencies (dependencies + devDependencies + peerDependencies). It then resolves which dependencies are intra-monorepo packages (by matching dependency names against the set of known package names) and which are third-party (everything else). The intra-monorepo dependencies form the workspace graph edges.</p>
        <p>The resulting graph is a directed acyclic graph (DAG) where nodes are packages and edges represent "A depends on B" relationships. For a 200-package monorepo, the graph computation (parsing 200 JSON files and building the adjacency list) takes under 500ms. The graph is stored in PostgreSQL as an adjacency list (package_id, dependency_id pairs) with package metadata (name, version, team, path) stored in a separate packages table. The graph is recomputed on every push to the main branch (triggered by a GitHub webhook) and cached in Redis for fast retrieval by the dashboard API.</p>
        <p>The graph computation must be identical to the task runner's computation to ensure affected package accuracy. Nx and Turborepo compute affected packages by: (1) identifying changed files in the PR (git diff against the base branch), (2) mapping changed files to their package (by finding which package.json's path is an ancestor of the changed file), (3) computing the transitive reverse dependency set (all packages that have a path to any directly-affected package via the dependency graph). The dashboard replicates this exact algorithm, using the same package.json parsing logic. Importantly, configuration files (nx.json, turbo.json) can affect the graph (they can declare additional implicit dependencies); the parser must also parse these files to achieve identical results to the task runner.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Workspace Graph Visualization</h3>
        <p>The workspace graph is visualized as an interactive node-link diagram using a force-directed layout (D3.js force simulation or Cytoscape.js). Nodes are packages; edges are dependencies (directed from dependent to dependency). At 200 nodes, a full force-directed layout is computationally expensive (O(N²) per simulation step); the layout is computed in a Web Worker and transferred to the main thread as node positions. The simulation runs for a fixed number of steps (200 iterations) and the final positions are rendered; the user can drag nodes to adjust the layout manually.</p>
        <p>Filtering and focusing: the full 200-node graph is visually overwhelming. The dashboard provides several views: team view (show only the packages owned by the selected team and their immediate dependencies/dependents), app view (show the dependency tree of a selected application—the set of all libraries the app depends on), and affected view (show only the packages affected by a PR, highlighted in the broader graph context). The transition between views uses animated node opacity changes (non-relevant nodes fade to 10% opacity; relevant nodes fade to 100%), preserving spatial context while focusing attention.</p>
        <p>Circular dependency detection: the graph is checked for cycles using a depth-first search (DFS) with a visited/in-stack marker. Packages involved in a cycle are highlighted in red in the visualization with a tooltip explaining the cycle path (A → B → C → A). Circular dependencies in a monorepo are a serious problem: they prevent topological ordering of builds (you cannot build A before B if A depends on B which depends on A) and often indicate a design flaw. The dashboard surfaces these prominently as critical issues in the dependency health panel.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Change Impact Analysis for Pull Requests</h3>
        <p>The change impact analysis is available on the pull request detail page. The dashboard fetches the PR's changed files list from the GitHub API, maps each changed file to its package (by comparing the file path against the known package directories), and computes the affected package set using the reverse dependency graph. The computation is a BFS or DFS traversal of the reverse dependency graph starting from the directly changed packages.</p>
        <p>The affected package set is displayed in three tiers: directly changed packages (the packages where files were actually edited), directly affected packages (packages that directly depend on a changed package), and transitively affected packages (packages that depend on affected packages through one or more intermediary packages). The three tiers are shown with distinct visual treatment (icon colors: red for direct changes, orange for direct dependents, yellow for transitive dependents). This tiering helps prioritize testing: transitive dependents are at lower risk than direct dependents and may not need the full test suite run.</p>
        <p>CI task mapping: the dashboard links each affected package to its CI pipeline tasks (test, lint, build). For Nx-managed monorepos, the affected tasks are fetched from the Nx Cloud API (which records which tasks ran for the current commit). For repositories without Nx Cloud, the dashboard queries GitHub Actions for workflow runs triggered by the PR commit and matches workflow job names to packages using a naming convention (e.g., test:@org/ui-components maps to the @org/ui-components package's test task).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Release Coordination</h3>
        <p>A monorepo release involves publishing updated packages to the npm registry in dependency order (you cannot publish library B before library A if B depends on A, because B's published version would reference an unpublished version of A). The release tracker identifies packages with unreleased changes by comparing the version in the monorepo's package.json to the latest published version in the npm registry. A package with a monorepo version of 2.1.0 and a registry version of 2.0.3 has unreleased changes.</p>
        <p>The release plan generator orders unreleased packages topologically (dependency order) and presents a release checklist. Each checklist item shows: the package name, the new version being released, the changelog (auto-generated from commit messages since the last release using Conventional Commits format), and the dependent packages that will pick up this version update. The release coordinator (a platform engineer or engineering manager) reviews the plan, edits changelog entries if needed, and triggers the release. The release is a CI job (triggered via the GitHub Actions API) that runs the publish script for each package in the planned order.</p>
        <p>Release status tracking: the dashboard tracks the release job's progress via SSE from the CI system. As each package is published, the checklist item transitions from "pending" to "publishing" to "published." If a publish fails (npm registry error, permission issue), the item is marked "failed" with a link to the CI log. The remaining packages are not blocked by a failed package if they are not dependents of the failed package; the release coordinator can decide to proceed with the remaining packages or fix the failure first.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Dependency Health and Version Conflicts</h3>
        <p>Version conflicts arise when multiple packages in the monorepo depend on different major versions of the same third-party library (e.g., package A depends on react@17, package B depends on react@18). In a monorepo with npm/yarn hoisting, both versions may be installed, leading to bundle duplication and potential runtime conflicts if both versions end up in the same browser bundle. The dashboard's dependency health scanner identifies these conflicts by parsing all package.json files and building a map of (library name → set of required versions). Any library with more than one major version in the required set is flagged as a conflict.</p>
        <p>Outdated dependency detection: the dashboard periodically (weekly) checks all third-party dependencies against the npm registry for newer versions. Packages with dependencies more than one major version behind the latest are flagged as outdated. The dashboard shows a summary: "23 packages have outdated dependencies; 5 are more than 2 major versions behind." The team owning each package is shown alongside the outdated dependency, enabling targeted outreach. The dashboard integrates with Renovate or Dependabot (by reading their PR creation events) to show whether automated update PRs are already in flight for each outdated dependency.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/platform-sdk-infra-systems/multi-app-monorepo-management-dashboard-impact-analysis.svg"
          alt="Change impact analysis showing PR changed files → file-to-package mapping (compare file path to package directory prefixes) → direct changed packages → BFS traversal of reverse dependency graph → three-tier affected set (directly changed: red, direct dependents: orange, transitive dependents: yellow), CI task mapping (Nx Cloud API or GitHub Actions job name matching), and release plan generator (topological sort of unreleased packages → changelog from Conventional Commits → ordered publish checklist with SSE progress tracking)."
          caption="Change impact: file→package mapping → reverse dependency BFS → three-tier affected set (direct/direct-dependent/transitive) → CI task linking → topological release plan"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Pre-computed graph versus on-demand computation: pre-computing the workspace graph (recomputing on each push to main) gives fast dashboard query response but means the dashboard may show a slightly stale graph (up to 60 seconds old if the webhook delivery is delayed). On-demand computation (parse the monorepo's package.json files on each dashboard page load) gives a fresh graph but is slow (500ms+ for large monorepos) and puts load on GitHub's API (fetching file contents on every request). For a dashboard consumed by monitoring engineers rather than end users, the 60-second staleness of the pre-computed approach is acceptable and the performance benefit is significant. For pull request impact analysis (where freshness matters more, since the PR's changed files are the input), the dashboard should recompute the affected set on demand for the specific PR rather than relying on the cached main branch graph.</p>
        <p>Monorepo tool lock-in: the dashboard's ability to fetch CI task state depends on the monorepo tool's API (Nx Cloud for Nx, Turborepo Remote Cache for Turborepo). Designing the dashboard to work with multiple monorepo tools requires an abstraction layer that translates tool-specific concepts (Nx's task graph, Turborepo's pipeline) into the dashboard's unified model. The pragmatic choice for most organizations is to support one monorepo tool deeply rather than both superficially. If the organization plans to standardize on one tool, build deep integration with that tool; if tool choice is team-by-team, build a generic integration using the GitHub Actions API (which all tools surface their CI results through) as the lowest common denominator.</p>
        <p>Graph visualization scalability: 200 packages is manageable with force-directed layout in a Web Worker. At 500+ packages, even the layout computation becomes too slow (several seconds), and the resulting graph is visually uninterpretable regardless of the layout algorithm. Above 200 packages, the dashboard should default to filtered views (team view, app view) rather than the full graph, and only show the full graph on explicit user request with a performance warning. Hierarchical layouts (grouping packages by team or domain) scale better than force-directed layouts for large graphs and produce more interpretable visualizations for organizational navigation, at the cost of losing the spatial clustering that force-directed layouts naturally produce for highly interconnected packages.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A multi-app monorepo management dashboard provides organizational visibility into a monorepo's structure, change impact, and release state. The Monorepo Analyzer (triggered by GitHub webhooks) parses all package.json files to build the workspace DAG, stored in PostgreSQL and cached in Redis. The workspace graph is visualized as a force-directed node-link diagram (D3.js in a Web Worker for layout), with team/app/affected filter modes and circular dependency highlighting. Pull request impact analysis maps changed files to packages, then performs BFS on the reverse dependency graph to produce a three-tier affected set (directly changed, direct dependents, transitive dependents) linked to CI task state via GitHub Actions API. The release coordinator identifies unreleased packages (monorepo version ahead of npm registry version), generates a topological publish order with Conventional Commits changelog, and tracks publish progress via SSE. Dependency health scanning detects version conflicts (multiple major versions of the same library) and outdated third-party dependencies (weekly npm registry check). The foundational computation—the reverse dependency BFS for change impact—must be identical to the monorepo task runner's affected algorithm to guarantee no false negatives in the affected package set.</p>
      </section>
    </ArticleLayout>
  );
}
