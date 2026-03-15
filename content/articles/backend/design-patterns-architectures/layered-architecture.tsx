"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-layered-architecture-extensive",
  title: "Layered Architecture",
  description:
    "Structure an application into layers (presentation, application, domain, infrastructure) to control dependencies, simplify change, and keep responsibilities clear.",
  category: "backend",
  subcategory: "design-patterns-architectures",
  slug: "layered-architecture",
  wordCount: 0,
  readingTime: 0,
  lastUpdated: "2026-03-14",
  tags: ["backend", "architecture", "layered"],
  relatedTopics: ["clean-architecture", "hexagonal-architecture", "repository-pattern", "unit-of-work-pattern"],
};

export default function LayeredArchitectureArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition: A Simple Dependency and Responsibility Model</h2>
        <p>
          <strong>Layered architecture</strong> organizes code into layers with clear responsibilities and a clear
          dependency direction. The canonical layers are:
          <strong> presentation</strong> (HTTP, UI), <strong>application</strong> (use-case orchestration),{" "}
          <strong>domain</strong> (business rules), and <strong>infrastructure</strong> (databases, external systems).
        </p>
        <p>
          The value is clarity: when you find a bug or need to change behavior, you can predict where the change belongs.
          The layers also create a vocabulary for code review: &quot;this controller is doing domain logic&quot; or
          &quot;this domain object depends on a database client.&quot;
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/layered-architecture-diagram-1.svg"
          alt="Layered architecture diagram showing presentation, application, domain, and infrastructure layers"
          caption="Layering is a dependency discipline: keep responsibilities separated so change does not propagate unpredictably."
        />
      </section>

      <section>
        <h2>What Makes Layering Work</h2>
        <p>
          Many teams say they have layers, but the layers only exist as folders. Real layering requires clear rules about
          dependencies and about what belongs in each layer.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Presentation:</strong> parse inputs, authenticate/authorize at the edge, map to application calls,
            and shape responses. Avoid business rules here.
          </li>
          <li>
            <strong>Application:</strong> coordinate workflows, manage transactions, call domain rules, and invoke
            dependencies through abstractions. Keep it focused on &quot;what happens&quot; rather than &quot;how
            persistence works.&quot;
          </li>
          <li>
            <strong>Domain:</strong> encode invariants and meaning. This is where correctness lives.
          </li>
          <li>
            <strong>Infrastructure:</strong> implement persistence and external integrations, including failure semantics
            and operational concerns (timeouts, retries, mapping).
          </li>
        </ul>
        <p className="mt-4">
          Layering is successful when you can change infrastructure without rewriting domain meaning, and when domain
          changes do not require rewriting transport logic.
        </p>
      </section>

      <section>
        <h2>Strict vs Relaxed Layers</h2>
        <p>
          Layering has variants. In a <strong>strict</strong> layered architecture, each layer can depend only on the
          layer directly below it. In a <strong>relaxed</strong> approach, upper layers may depend on deeper layers
          directly. Strict layering improves isolation but can create boilerplate. Relaxed layering reduces ceremony but
          can increase coupling.
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/layered-architecture-diagram-2.svg"
          alt="Decision map showing strict vs relaxed layering and dependency inversion points"
          caption="Choose strictness intentionally. The goal is stability and clarity, not bureaucracy."
        />
        <p className="mt-4">
          Many teams use a hybrid rule: strict around the domain core (domain should not depend on infrastructure),
          relaxed for adapters and glue code where the cost of strictness is not worth it.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Layered architecture is popular because it is easy to explain, but it is easy to degrade into ineffective
          layering. The most common failure is a &quot;service layer&quot; that becomes a dump for everything.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Pitfalls That Cause Long-Term Pain</h3>
          <ul className="space-y-2">
            <li>
              <strong>Anemic domain:</strong> domain objects carry data only; business rules live in controllers or
              services.
            </li>
            <li>
              <strong>Leaky persistence:</strong> query builders, table schemas, or ORM models leak into application and
              domain decisions.
            </li>
            <li>
              <strong>Circular dependencies:</strong> &quot;helper&quot; utilities become a dependency knot across layers.
            </li>
            <li>
              <strong>Inconsistent policy:</strong> timeouts/retries/validation implemented inconsistently at different
              entry points.
            </li>
          </ul>
        </div>
        <p>
          The remedy is to treat layering as an enforcement tool: architecture tests, code review conventions, and
          explicit modules that make boundary violations difficult.
        </p>
      </section>

      <section>
        <h2>Operational Implications</h2>
        <p>
          Layering changes how you instrument and debug systems. If the application layer represents workflows, then
          logging and tracing around application boundaries makes incidents easier to interpret. If your logs only exist
          at controller level, you often miss the workflow context that matters.
        </p>
        <p>
          Layering also helps with safe rollouts. When domain changes are isolated, you can ship new domain rules with
          confidence that transport and persistence concerns were not accidentally modified. Conversely, when
          infrastructure changes are isolated, you can tune databases or swap providers without rewriting business logic.
        </p>
      </section>

      <section>
        <h2>Enforcing Boundaries in Practice</h2>
        <p>
          The biggest difference between “folder layers” and real layers is enforcement. Without enforcement, teams
          naturally optimize for speed and will reach across boundaries when under delivery pressure. Over time, those
          shortcuts accumulate into coupling and unpredictable change.
        </p>
        <p>
          Practical enforcement techniques range from lightweight to strict. The right choice depends on the team size
          and how costly regressions are. In many systems, the most valuable enforcement is around the domain core:
          prevent domain logic from depending on frameworks, ORMs, or network concerns so meaning stays stable.
        </p>
        <ul className="mt-4 space-y-2">
          <li><strong>Module boundaries:</strong> separate packages per layer and restrict imports.</li>
          <li><strong>Architecture tests:</strong> fail CI if a domain module imports infrastructure code.</li>
          <li><strong>Adapters and ports:</strong> define interfaces at the boundary so dependencies are explicit.</li>
          <li><strong>Code review rules:</strong> “no domain logic in controllers” and “no SQL in the domain.”</li>
        </ul>
      </section>

      <section>
        <h2>Evolution Strategy: Refactor Without a Rewrite</h2>
        <p>
          Layering is often introduced into an existing codebase. The safe approach is incremental: pick one high-value
          workflow, extract an application service, and move the invariant logic into a domain component. Then wrap
          existing persistence with an adapter. This yields benefits quickly without forcing a big-bang rewrite.
        </p>
        <p>
          A common mistake is to re-label code without changing boundaries. If your application layer still calls ORM
          entities directly and your domain objects still depend on HTTP concepts, layering is not doing its job. The
          measure of success is whether changes stay localized and whether incident debugging becomes easier.
        </p>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/layered-architecture-diagram-3.svg"
          alt="Layered architecture failure modes: leaking layers, god services, and circular dependencies"
          caption="Layering fails when boundaries are not enforced. The result is coupling and unpredictable change."
        />
        <ul className="mt-6 space-y-2">
          <li>
            <strong>Boundary leakage:</strong> persistence or HTTP concepts influence domain decisions. Mitigation: use
            repositories/adapters and keep domain language pure.
          </li>
          <li>
            <strong>God application services:</strong> one layer accumulates everything. Mitigation: split by use case and
            align code to workflows.
          </li>
          <li>
            <strong>Unclear transaction boundaries:</strong> long transactions leak across layers. Mitigation: define
            transaction boundaries in the application layer explicitly.
          </li>
        </ul>
      </section>

      <section>
        <h2>Scenario Walkthrough: Turning a &quot;Ball of Mud&quot; Into Layers</h2>
        <p>
          A monolithic service grows quickly. Controllers call the database directly, and business rules are scattered
          across HTTP handlers. Incidents are hard to debug because behavior depends on which handler path was taken.
        </p>
        <p>
          The team introduces an application layer for the highest-value workflows and moves domain rules into domain
          objects. Database access is moved behind a repository abstraction so the domain stops depending on ORM models.
          Over time, layering makes changes smaller and reduces regressions because responsibilities are explicit.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>Define responsibilities per layer and enforce dependency direction, especially around the domain core.</li>
          <li>Keep business invariants in the domain layer; keep request parsing and response shaping in presentation.</li>
          <li>Use the application layer to define workflow and transaction boundaries explicitly.</li>
          <li>Prevent persistence and framework leakage by using adapters/repositories at the boundary.</li>
          <li>Instrument workflows at the application layer so incidents have domain context.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is layered architecture trying to optimize for?</p>
            <p className="mt-2 text-sm">
              A: Clarity of responsibilities and controlled dependencies so change is localized and correctness is easier
              to maintain.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the difference between strict and relaxed layering?</p>
            <p className="mt-2 text-sm">
              A: Strict layering restricts dependencies to adjacent layers, improving isolation but adding boilerplate.
              Relaxed layering reduces ceremony but can increase coupling if abused.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the most common failure mode in layered systems?</p>
            <p className="mt-2 text-sm">
              A: Boundary leakage: controllers and persistence concerns absorb business rules, producing a tangled service
              layer and inconsistent behavior.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Where should transaction boundaries live?</p>
            <p className="mt-2 text-sm">
              A: Typically in the application layer, where workflows are orchestrated and consistency boundaries are
              defined explicitly.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
