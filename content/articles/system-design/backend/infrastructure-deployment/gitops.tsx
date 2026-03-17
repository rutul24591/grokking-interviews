"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-gitops-extensive",
  title: "GitOps",
  description:
    "Run infrastructure and deployment workflows through Git as the source of truth, using reconciliation to keep runtime state aligned and auditable.",
  category: "backend",
  subcategory: "infrastructure-deployment",
  slug: "gitops",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-14",
  tags: ["backend", "infra", "gitops"],
  relatedTopics: ["infrastructure-as-code", "ci-cd-pipelines", "immutable-infrastructure"],
};

export default function GitOpsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>What GitOps Is</h2>
        <p>
          <strong>GitOps</strong> is an operating model where <strong>Git is the authoritative source</strong> of desired
          state for environments, and an automated reconciler continuously aligns runtime state to match what is declared
          in Git. Instead of pushing changes directly into clusters or environments, you merge changes into Git, and the
          reconciler pulls and applies them.
        </p>
        <p>
          The core promise is not magic automation. It is control: every change is reviewable, attributable, and
          reproducible. When things go wrong, rollback is a version-control operation. When someone makes a manual
          &quot;temporary&quot; fix, drift is visible.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/gitops-diagram-1.svg"
          alt="GitOps architecture: Git repository as source of truth with a controller reconciling runtime state"
          caption="GitOps turns runtime change into a reconciliation problem: Git declares, the controller enforces, and drift becomes observable."
        />
      </section>

      <section>
        <h2>How GitOps Differs From CI/CD (and Complements It)</h2>
        <p>
          CI/CD pipelines usually <em>build</em> and <em>test</em> artifacts, and may also push deployments. GitOps shifts
          the deployment side toward a pull-based model. CI produces artifacts and evidence. GitOps applies environment
          configuration and deploy intent by reconciling to Git.
        </p>
        <p>
          This separation is valuable. CI systems often run outside your runtime perimeter and can become credential
          sprawl. A GitOps controller runs inside the target environment with scoped permissions and a narrower set of
          responsibilities: apply the desired state, report status, and correct drift.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">A Practical Division of Labor</h3>
          <ul className="space-y-2">
            <li>
              <strong>CI:</strong> build artifacts, run tests, scan security, attach provenance and approvals.
            </li>
            <li>
              <strong>GitOps:</strong> deploy and configure by reconciling to a declared state in Git, with continuous drift detection.
            </li>
          </ul>
        </div>
        <p>
          GitOps does not eliminate the need for gates. It changes where gates live: you can gate via pull-request
          checks, policy enforcement, and staged promotion workflows that determine what merges and what the controller
          is allowed to apply.
        </p>
      </section>

      <section>
        <h2>Reconciliation as a System: Safety Comes From Policy and Order</h2>
        <p>
          The reconciler is an automation engine. Automation can be safe or dangerous depending on how it is constrained.
          The most important GitOps design questions are about <strong>what</strong> can change, <strong>who</strong> can
          change it, and <strong>how</strong> changes are applied over time.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/gitops-diagram-2.svg"
          alt="GitOps decision map: repository structure, promotion flow, sync policy, and drift correction"
          caption="GitOps maturity is about controlled reconciliation: how changes flow from Git to runtime with safety and observability."
        />
        <ul className="mt-6 space-y-2">
          <li>
            <strong>Repository structure:</strong> organize configuration so ownership and review are clear (by service,
            by environment, or by platform layer).
          </li>
          <li>
            <strong>Promotion model:</strong> decide how changes move from dev to staging to prod. Promotion can be
            branch-based, directory-based, or release-tag-based.
          </li>
          <li>
            <strong>Sync policy:</strong> fully automated sync reduces manual steps but increases the need for robust
            checks. Manual promotion reduces risk but can slow incident response.
          </li>
          <li>
            <strong>Ordering:</strong> define how dependent changes apply (infrastructure before apps, shared services
            before leaf services). Without ordering, reconciliation creates partial states that are hard to diagnose.
          </li>
          <li>
            <strong>Drift correction:</strong> decide whether to aggressively revert drift or to alert and require
            human intervention. Both are valid depending on incident practices.
          </li>
        </ul>
        <p className="mt-4">
          GitOps is easiest when deployments are declarative. If your system relies on imperative actions (database
          migrations, one-time jobs), you need explicit workflows and guardrails so those actions do not repeat
          unexpectedly during reconciliation.
        </p>
      </section>

      <section>
        <h2>Secrets and Identity: Where GitOps Gets Real</h2>
        <p>
          Git is not a good place for secrets. A GitOps design needs a deliberate strategy for secret delivery and
          rotation that does not leak credentials into repositories and does not rely on manual interventions that break
          the reconciliation model.
        </p>
        <p>
          The reconciler also needs an identity model. It should have the minimum permissions required to apply intended
          changes. If the controller can do everything, the blast radius of a misconfiguration or compromise is large.
          Strong GitOps setups scope controllers by environment, namespace, or cluster and use policy checks to constrain
          risky changes.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Secret boundaries:</strong> keep secrets in a dedicated secret system and inject at runtime.
          </li>
          <li>
            <strong>Least privilege:</strong> controller permissions should match ownership boundaries.
          </li>
          <li>
            <strong>Audit:</strong> changes are traceable via Git history plus controller apply logs.
          </li>
          <li>
            <strong>Policy:</strong> enforce constraints so &quot;bad but valid&quot; configs do not ship.
          </li>
        </ul>
      </section>

      <section>
        <h2>Failure Modes and How to Avoid Them</h2>
        <p>
          GitOps failures tend to be fast because automation applies changes quickly. The goal is to keep failure modes
          safe: easy to stop, easy to roll back, and visible before widespread impact.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/gitops-diagram-3.svg"
          alt="GitOps failure modes: bad commit propagation, reconciliation loops, policy gaps, and drift conflicts"
          caption="GitOps failure is usually control failure: unsafe changes merged, unsafe reconciliation, or unclear ownership and policy boundaries."
        />
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Bad change merges fast</h3>
            <p className="mt-2 text-sm text-muted">
              A misconfiguration is merged and immediately applied, causing widespread impact.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> policy checks, staged promotion, and narrower blast-radius controllers.
              </li>
              <li>
                <strong>Signal:</strong> production incident directly follows a merge, with no gating or delayed exposure.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Reconciliation thrash</h3>
            <p className="mt-2 text-sm text-muted">
              Controllers repeatedly apply changes or fight with dynamic systems, consuming resources and creating instability.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> clear ownership of what is declarative, explicit ignore rules where necessary, and rate-limited reconciliation.
              </li>
              <li>
                <strong>Signal:</strong> frequent apply loops and noisy event streams without real configuration changes.
              </li>
            </ul>
          </div>
        </div>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Emergency fixes create drift</h3>
            <p className="mt-2 text-sm text-muted">
              On-call applies a manual fix, and the controller later reverts it, or drift remains and surprises future changes.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> documented break-glass path and a required &quot;capture back to Git&quot; workflow.
              </li>
              <li>
                <strong>Signal:</strong> manual changes repeatedly reappear or are undone unexpectedly.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Secret delivery breaks reconciliation</h3>
            <p className="mt-2 text-sm text-muted">
              Secrets are stored or referenced inconsistently, causing deploy failures that are hard to reproduce.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> standard secret integration and rotation policies, plus validation checks before promotion.
              </li>
              <li>
                <strong>Signal:</strong> deploy failures cluster around secret references and environment-specific drift.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Operational Playbook</h2>
        <ul className="space-y-2">
          <li>
            <strong>Watch sync health:</strong> treat reconciliation lag and apply failures as production signals.
          </li>
          <li>
            <strong>Define rollback:</strong> rollback should be a Git revert plus a known method to pause or gate sync when needed.
          </li>
          <li>
            <strong>Gate risky changes:</strong> require additional approval for changes that alter networking, identity, or data-plane routing.
          </li>
          <li>
            <strong>Practice break-glass:</strong> document how to apply emergency changes and how to reconcile them back into Git quickly.
          </li>
          <li>
            <strong>Keep ownership clear:</strong> avoid shared directories where everyone can change everything; that is where mistakes hide.
          </li>
        </ul>
      </section>

      <section>
        <h2>Scenario: Multi-Cluster Deployments With Audit Requirements</h2>
        <p>
          A company runs multiple clusters across environments and regions. They need consistent configuration, clear
          approvals, and a reliable rollback story. GitOps provides a stable model: clusters continuously reconcile to
          declared state, and environment promotion is a controlled Git operation.
        </p>
        <p>
          The system succeeds when promotion is staged, policy is enforced before merge, and the reconciler&apos;s
          permissions are scoped to match ownership boundaries. Without those, GitOps becomes &quot;automated outages&quot;:
          mistakes ship faster than humans can react.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>
            Is Git the single source of truth for desired state, with drift detectable and actionable?
          </li>
          <li>
            Are promotion steps defined (dev to staging to prod) with guardrails that match risk?
          </li>
          <li>
            Are controller permissions scoped to the smallest practical blast radius?
          </li>
          <li>
            Is secret delivery standardized without storing secrets in Git?
          </li>
          <li>
            Is there a documented and practiced process to pause sync and roll back safely?
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Why is pull-based deployment attractive?</p>
            <p className="mt-2 text-sm">
              It reduces credential sprawl: the environment pulls desired state with scoped permissions, rather than external systems pushing with broad access.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">What is the biggest operational risk in GitOps?</p>
            <p className="mt-2 text-sm">
              Unsafe changes merged without adequate gating, combined with automation that applies them quickly across large blast radius.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">How do you handle emergencies without breaking the model?</p>
            <p className="mt-2 text-sm">
              Use a break-glass procedure that is audited, then capture the fix back into Git immediately so drift does not persist.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

