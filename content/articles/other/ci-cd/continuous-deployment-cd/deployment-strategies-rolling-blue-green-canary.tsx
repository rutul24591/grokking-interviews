"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-ci-cd-deployment-strategies-rolling-blue-green-canary",
  title: "Deployment Strategies: Rolling, Blue-Green, Canary",
  description: "Staff-level guide to Deployment Strategies: Rolling, Blue-Green, Canary with topic-specific architecture, trade-offs, failure modes, interview questions, and production delivery guidance.",
  category: "other",
  subcategory: "ci-cd",
  slug: "deployment-strategies-rolling-blue-green-canary",
  wordCount: 5100,
  readingTime: 22,
  lastUpdated: "2026-05-16",
  tags: ["cd","deployment-strategies","canary","blue-green","rolling-deployments"],
  relatedTopics: ["cd-fundamentals-release-pipeline-architecture","deployment-observability-slo-gates-rollback","progressive-delivery-feature-flags"],
};

export default function DeploymentStrategiesRollingBlueGreenCanaryArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="crucial">
          Deployment Strategies: Rolling, Blue-Green, Canary is the discipline of designing CI/CD so that rollout strategy is chosen by availability target, blast radius, capacity cost, state compatibility, and rollback speed. The useful interview answer explains the risk model, not just the toolchain.
        </HighlightBlock>

        <p>
          Rolling, blue-green, and canary deployments solve different production risks. Treating them as interchangeable deployment styles is a common interview mistake.
        </p>

        <p>
          At staff level, the answer should discuss traffic shifting, capacity headroom, health checks, state compatibility, observability windows, rollback latency, and what happens when only part of the fleet is upgraded.
        </p>

        <p>
          The dominant failure modes are global bad deploys, capacity spikes, mixed-version incompatibility, false health checks, slow rollback, and database or cache state that cannot support version overlap. These are not abstract concerns; they are the issues that appear when teams deploy frequently, share infrastructure, and need to recover quickly after bad changes.
        </p>

        <p>
          A mid-level answer should identify the basic pipeline behavior. A senior answer should reason about ownership and trade-offs. A staff or principal answer should explain how the design behaves under load, during incidents, across many teams, and under audit pressure.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <HighlightBlock as="p" tier="crucial">
          The core concept is not more automation. The core concept is trustworthy decision-making: each stage should produce evidence that justifies the next increase in blast radius.
        </HighlightBlock>

        <h3>Rolling updates</h3>

        <p>
          A rolling deployment gradually replaces instances while keeping service capacity online. It is efficient because it does not require a full duplicate environment.
        </p>

        <p>
          The risk is mixed-version behavior. Old and new instances may handle the same user session, queue, cache key, or database row.
        </p>

        <h3>Blue-green deployment</h3>

        <p>
          Blue-green keeps two environments and shifts traffic when green is ready. Rollback can be fast if blue remains healthy.
        </p>

        <p>
          The cost is capacity and state synchronization. It works best when environments are truly equivalent and state is compatible.
        </p>

        <h3>Canary rollout</h3>

        <p>
          Canary exposes a small percentage of users or traffic to the new version and expands only if metrics stay healthy.
        </p>

        <p>
          The main challenge is metric confidence. A canary with too little traffic may miss rare errors; a canary with too much traffic increases blast radius.
        </p>

        <h3>Shadow traffic</h3>

        <p>
          Shadowing sends copied traffic to a new version without returning responses to users. It is useful for performance and compatibility checks.
        </p>

        <p>
          It cannot prove user-visible correctness because writes, side effects, and response behavior may be disabled or synthetic.
        </p>
        <h3>Staff-level primitives to reason about</h3>

        <p>
          rolling batch is a first-class design object in Deployment Strategies: Rolling, Blue-Green, Canary. It should have an owner, input contract, output contract, failure mode, and observable state. When candidates treat it as an implementation detail, they usually miss the production risk hidden behind the abstraction.
        </p>

        <p>
          For interview purposes, explain how rolling batch changes the decision boundary. It should either reduce uncertainty, reduce blast radius, improve recovery, or create evidence. If it does none of those, it is process weight rather than engineering value.
        </p>

        <p>
          blue environment is a first-class design object in Deployment Strategies: Rolling, Blue-Green, Canary. It should have an owner, input contract, output contract, failure mode, and observable state. When candidates treat it as an implementation detail, they usually miss the production risk hidden behind the abstraction.
        </p>

        <p>
          For interview purposes, explain how blue environment changes the decision boundary. It should either reduce uncertainty, reduce blast radius, improve recovery, or create evidence. If it does none of those, it is process weight rather than engineering value.
        </p>

        <p>
          green environment is a first-class design object in Deployment Strategies: Rolling, Blue-Green, Canary. It should have an owner, input contract, output contract, failure mode, and observable state. When candidates treat it as an implementation detail, they usually miss the production risk hidden behind the abstraction.
        </p>

        <p>
          For interview purposes, explain how green environment changes the decision boundary. It should either reduce uncertainty, reduce blast radius, improve recovery, or create evidence. If it does none of those, it is process weight rather than engineering value.
        </p>

        <p>
          canary cohort is a first-class design object in Deployment Strategies: Rolling, Blue-Green, Canary. It should have an owner, input contract, output contract, failure mode, and observable state. When candidates treat it as an implementation detail, they usually miss the production risk hidden behind the abstraction.
        </p>

        <p>
          For interview purposes, explain how canary cohort changes the decision boundary. It should either reduce uncertainty, reduce blast radius, improve recovery, or create evidence. If it does none of those, it is process weight rather than engineering value.
        </p>

        <p>
          traffic splitter is a first-class design object in Deployment Strategies: Rolling, Blue-Green, Canary. It should have an owner, input contract, output contract, failure mode, and observable state. When candidates treat it as an implementation detail, they usually miss the production risk hidden behind the abstraction.
        </p>

        <p>
          For interview purposes, explain how traffic splitter changes the decision boundary. It should either reduce uncertainty, reduce blast radius, improve recovery, or create evidence. If it does none of those, it is process weight rather than engineering value.
        </p>

        <p>
          rollback target is a first-class design object in Deployment Strategies: Rolling, Blue-Green, Canary. It should have an owner, input contract, output contract, failure mode, and observable state. When candidates treat it as an implementation detail, they usually miss the production risk hidden behind the abstraction.
        </p>

        <p>
          For interview purposes, explain how rollback target changes the decision boundary. It should either reduce uncertainty, reduce blast radius, improve recovery, or create evidence. If it does none of those, it is process weight rather than engineering value.
        </p>
        <h3>Interview-depth design notes</h3>

        <p>
          For rolling, blue-green, and canary deployment strategy, the most important mental model is choosing a rollout pattern based on blast radius, capacity, state compatibility, traffic control, and rollback speed. In an interview, this framing prevents the answer from becoming a tool tour and keeps the conversation anchored on the risk that the delivery system must reduce.
        </p>

        <p>
          The central risk is mixed-version incompatibility, blue-green shared-state corruption, canaries with too little traffic, and health checks that miss user-visible failures. A senior candidate should make that risk explicit, then show which controls reduce it, which controls merely observe it, and which controls add process without materially improving safety.
        </p>

        <p>
          Treat deployment state containing active version, candidate version, traffic split, cohort, capacity headroom, health window, and rollback target as durable product state, not temporary pipeline output. If that state disappears with the runner, the organization loses the ability to debug incidents, defend release decisions, or improve the system from historical evidence.
        </p>
        <h3>Additional interview anchors</h3>

        <p>
          Design anchor: rolling deployment is efficient for stateless compatible services but risky when old and new versions cannot coexist. This is worth stating explicitly in interviews because it turns the answer from a generic CI/CD checklist into a concrete control with an owner, input, output, failure mode, and measurable signal.
        </p>

        <p>
          Production review question: what happens when this assumption is false? The answer should identify how the system detects the problem, whether it blocks or degrades, who receives the remediation work, and what evidence remains for later review.
        </p>

        <p>
          Design anchor: blue-green deployment buys fast traffic switching at the cost of duplicate capacity and shared-state compatibility requirements. This is worth stating explicitly in interviews because it turns the answer from a generic CI/CD checklist into a concrete control with an owner, input, output, failure mode, and measurable signal.
        </p>

        <p>
          Production review question: what happens when this assumption is false? The answer should identify how the system detects the problem, whether it blocks or degrades, who receives the remediation work, and what evidence remains for later review.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <HighlightBlock as="p" tier="crucial">
          The architecture should make the topic's control loop visible: inputs, execution boundary, evidence, gate decision, ownership, and recovery path.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/other/ci-cd/continuous-deployment-cd/deployment-strategies-rolling-blue-green-canary-architecture.svg"
          alt="Deployment Strategy Comparison"
          caption="Deployment Strategy Comparison"
          captionTier="important"
        />

        <p>
          The first diagram, Deployment Strategy Comparison, is the article's architecture anchor. Read it as the system boundary: what enters the pipeline, what decisions are made, where trust increases, and where the team should capture evidence before moving forward.
        </p>

        <h3>Classify release risk</h3>

        <p>
          The strategy should depend on service tier, change type, traffic volume, state compatibility, and rollback capability.
        </p>

        <h3>Prepare capacity and routing</h3>

        <p>
          Rolling needs enough spare capacity for replacement. Blue-green needs duplicate environment capacity. Canary needs traffic routing and segmentation.
        </p>

        <h3>Observe by strategy</h3>

        <p>
          Rolling focuses on instance health and fleet error rate. Canary compares control and treatment. Blue-green validates green before and after switch.
        </p>

        <h3>Rollback deliberately</h3>

        <p>
          Rollback may be traffic switch, old replica scale-up, canary halt, or roll forward when data changed irreversibly.
        </p>

        <ArticleImage
          src="/diagrams/other/ci-cd/continuous-deployment-cd/deployment-strategies-rolling-blue-green-canary-control-loop.svg"
          alt="Blast Radius, Capacity Cost, and Rollback Speed"
          caption="Blast Radius, Capacity Cost, and Rollback Speed"
          captionTier="important"
        />

        <p>
          The second diagram, Blast Radius, Capacity Cost, and Rollback Speed, focuses on the operational loop. This matters in interviews because delivery systems fail less from missing steps and more from missing feedback: no owner, no confidence score, no rollback signal, no audit record, or no clear degraded-mode behavior.
        </p>

        <p>
          When explaining this architecture, explicitly call out what fails closed, what can degrade to warning-only, and which team owns remediation. That is the difference between a diagram that looks complete and a production system that can be operated.
        </p>
        <h3>Failure-driven architecture walkthrough</h3>

        <p>
          When rolling deployment exposes incompatible versions, the architecture should not rely on a senior engineer remembering a manual workaround. The pipeline or release system should classify the failure, preserve context, route the owner, and choose a safe default such as block, pause, retry, quarantine, or rollback.
        </p>

        <p>
          The staff-level design question is what evidence would prove the system handled this case correctly. Useful evidence includes the triggering input, affected service, policy decision, exact artifact or config identity, owner notification, elapsed time, and final remediation action.
        </p>

        <p>
          When blue-green switch corrupts shared state, the architecture should not rely on a senior engineer remembering a manual workaround. The pipeline or release system should classify the failure, preserve context, route the owner, and choose a safe default such as block, pause, retry, quarantine, or rollback.
        </p>

        <p>
          The staff-level design question is what evidence would prove the system handled this case correctly. Useful evidence includes the triggering input, affected service, policy decision, exact artifact or config identity, owner notification, elapsed time, and final remediation action.
        </p>

        <p>
          When canary sample size is too small, the architecture should not rely on a senior engineer remembering a manual workaround. The pipeline or release system should classify the failure, preserve context, route the owner, and choose a safe default such as block, pause, retry, quarantine, or rollback.
        </p>

        <p>
          The staff-level design question is what evidence would prove the system handled this case correctly. Useful evidence includes the triggering input, affected service, policy decision, exact artifact or config identity, owner notification, elapsed time, and final remediation action.
        </p>

        <p>
          When health checks miss user-visible failures, the architecture should not rely on a senior engineer remembering a manual workaround. The pipeline or release system should classify the failure, preserve context, route the owner, and choose a safe default such as block, pause, retry, quarantine, or rollback.
        </p>

        <p>
          The staff-level design question is what evidence would prove the system handled this case correctly. Useful evidence includes the triggering input, affected service, policy decision, exact artifact or config identity, owner notification, elapsed time, and final remediation action.
        </p>

        <p>
          When rollback has no old capacity, the architecture should not rely on a senior engineer remembering a manual workaround. The pipeline or release system should classify the failure, preserve context, route the owner, and choose a safe default such as block, pause, retry, quarantine, or rollback.
        </p>

        <p>
          The staff-level design question is what evidence would prove the system handled this case correctly. Useful evidence includes the triggering input, affected service, policy decision, exact artifact or config identity, owner notification, elapsed time, and final remediation action.
        </p>
        <h3>Operational architecture details</h3>

        <p>
          The control plane is the deployment controller, load balancer, service mesh or edge router, health analyzer, and capacity manager. Its job is to decide whether the next batch or traffic step should proceed, pause, roll back, or require human review. The execution plane can be replaced from Jenkins to GitHub Actions to Buildkite, but the control-plane decisions should remain stable.
        </p>

        <p>
          A robust design separates decision logic from job execution. Runners, workers, scanners, and deployment agents execute work; policy, ownership, trust boundaries, and evidence retention decide whether the work is allowed to increase blast radius.
        </p>

        <p>
          The recovery path is shifting traffic back, stopping batches, restoring the blue environment, or rolling forward when state has migrated. This must be designed before the happy path is automated, because incident-time recovery is where weak CI/CD designs reveal hidden coupling and missing state.
        </p>
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2>
        <HighlightBlock as="p" tier="crucial">
          The key trade-off is not simply speed versus safety. It is deciding which evidence is worth collecting before the next decision and which risks are better controlled by rollback, isolation, or post-release monitoring.
        </HighlightBlock>

        <h3>Rolling vs blue-green</h3>

        <p>
          Rolling is cheaper and continuous but has mixed-version risk. Blue-green has faster traffic rollback but higher capacity cost.
        </p>

        <p>
          Choose rolling for stateless compatible services; choose blue-green when fast cutover and rollback justify extra capacity.
        </p>

        <h3>Canary vs all-at-once</h3>

        <p>
          Canary limits blast radius and provides production signal. All-at-once is faster but riskier.
        </p>

        <p>
          Canary is only useful when metrics are timely and representative.
        </p>

        <h3>Regional rollout vs global canary</h3>

        <p>
          Regional rollout limits blast radius geographically, but regional behavior may not represent global traffic.
        </p>

        <p>
          Global canary can be more representative but needs careful traffic percentage control.
        </p>

        <h3>Rollback vs state migration</h3>

        <p>
          Code rollback is straightforward when data contracts are compatible. It is unsafe after destructive migrations.
        </p>

        <p>
          Deployment strategy must be coordinated with database migration strategy.
        </p>
        <h3>Decision matrix for senior interviews</h3>

        <p>
          A recurring decision is when rolling is enough. Do not answer it with a single universal rule. State the variables: service tier, blast radius, rollback safety, data sensitivity, team ownership, compliance exposure, and feedback-time budget.
        </p>

        <p>
          A strong answer gives a default and an exception. For example, choose the faster path when failure is reversible and observable, but require stronger gates when the same mistake can corrupt data, leak secrets, break shared contracts, or affect many teams at once.
        </p>

        <p>
          A recurring decision is when blue-green capacity is justified. Do not answer it with a single universal rule. State the variables: service tier, blast radius, rollback safety, data sensitivity, team ownership, compliance exposure, and feedback-time budget.
        </p>

        <p>
          A strong answer gives a default and an exception. For example, choose the faster path when failure is reversible and observable, but require stronger gates when the same mistake can corrupt data, leak secrets, break shared contracts, or affect many teams at once.
        </p>

        <p>
          A recurring decision is how large canary steps should be. Do not answer it with a single universal rule. State the variables: service tier, blast radius, rollback safety, data sensitivity, team ownership, compliance exposure, and feedback-time budget.
        </p>

        <p>
          A strong answer gives a default and an exception. For example, choose the faster path when failure is reversible and observable, but require stronger gates when the same mistake can corrupt data, leak secrets, break shared contracts, or affect many teams at once.
        </p>

        <p>
          A recurring decision is which metrics decide rollout. Do not answer it with a single universal rule. State the variables: service tier, blast radius, rollback safety, data sensitivity, team ownership, compliance exposure, and feedback-time budget.
        </p>

        <p>
          A strong answer gives a default and an exception. For example, choose the faster path when failure is reversible and observable, but require stronger gates when the same mistake can corrupt data, leak secrets, break shared contracts, or affect many teams at once.
        </p>

        <p>
          A recurring decision is how state compatibility constrains strategy. Do not answer it with a single universal rule. State the variables: service tier, blast radius, rollback safety, data sensitivity, team ownership, compliance exposure, and feedback-time budget.
        </p>

        <p>
          A strong answer gives a default and an exception. For example, choose the faster path when failure is reversible and observable, but require stronger gates when the same mistake can corrupt data, leak secrets, break shared contracts, or affect many teams at once.
        </p>
        <h3>Trade-off reasoning that interviewers look for</h3>

        <p>
          The main trade-off is not speed versus safety in the abstract. It is whether rolling, blue-green, and canary deployment strategy should optimize for low-latency feedback, stronger pre-change confidence, lower operational load, stricter auditability, or smaller blast radius for this specific service tier.
        </p>

        <p>
          If the team optimizes only for speed, A rolling deployment can expose old and new versions together, which is dangerous when wire formats or database assumptions changed. If the team optimizes only for safety, delivery may become slow enough that engineers batch large changes, which often increases actual release risk.
        </p>

        <p>
          A strong answer defines a default and an exception. The default should cover common low-risk changes; the exception should handle changes involving shared libraries, data shape, secrets, regulated behavior, customer-visible critical paths, or irreversible state.
        </p>
        <h3>Production trade-off anchors</h3>

        <p>
          Design anchor: canary deployment reduces blast radius only when the cohort, metrics, and analysis window are statistically meaningful. This is worth stating explicitly in interviews because it turns the answer from a generic CI/CD checklist into a concrete control with an owner, input, output, failure mode, and measurable signal.
        </p>

        <p>
          Production review question: what happens when this assumption is false? The answer should identify how the system detects the problem, whether it blocks or degrades, who receives the remediation work, and what evidence remains for later review.
        </p>

        <p>
          Design anchor: shadow traffic validates read-side behavior but cannot prove write correctness unless side effects are isolated. This is worth stating explicitly in interviews because it turns the answer from a generic CI/CD checklist into a concrete control with an owner, input, output, failure mode, and measurable signal.
        </p>

        <p>
          Production review question: what happens when this assumption is false? The answer should identify how the system detects the problem, whether it blocks or degrades, who receives the remediation work, and what evidence remains for later review.
        </p>
      </section>

      <section>
        <h2>Best practices</h2>
        <HighlightBlock as="p" tier="crucial">
          Best practices should be evaluated by whether they improve correctness, operability, auditability, and developer behavior for this specific topic.
        </HighlightBlock>

        <p>
          Choose rollout strategy based on failure mode, not team habit.
        </p>

        <p>
          Verify version compatibility before allowing mixed fleets.
        </p>

        <p>
          Define health checks that cover user behavior, not only process liveness.
        </p>

        <p>
          Use canary windows long enough to observe meaningful traffic.
        </p>

        <p>
          Preserve enough old capacity to roll back quickly when strategy requires it.
        </p>

        <p>
          Coordinate deployment strategy with schema, cache, queue, and client compatibility.
        </p>

        <p>
          For staff and principal interviews, close this section by explaining how you would measure whether the practice works. Good metrics include lead time, queue time, failure reason distribution, rollback time, exception rate, escaped incidents, and developer bypass behavior.
        </p>
        <h3>Operating metrics and ownership model</h3>

        <p>
          Track blast radius percentage as an operating metric, not a dashboard decoration. The metric should have an owner, expected range, alert threshold, and review cadence. Otherwise the platform team will know something is wrong but not have a mechanism to improve it.
        </p>

        <p>
          When blast radius percentage regresses, the response should be concrete: tune policy, add capacity, fix noisy checks, improve ownership metadata, change rollout gates, or remove stale controls. Metrics that do not trigger decisions eventually become ignored background noise.
        </p>

        <p>
          Track capacity headroom as an operating metric, not a dashboard decoration. The metric should have an owner, expected range, alert threshold, and review cadence. Otherwise the platform team will know something is wrong but not have a mechanism to improve it.
        </p>

        <p>
          When capacity headroom regresses, the response should be concrete: tune policy, add capacity, fix noisy checks, improve ownership metadata, change rollout gates, or remove stale controls. Metrics that do not trigger decisions eventually become ignored background noise.
        </p>

        <p>
          Track canary error delta as an operating metric, not a dashboard decoration. The metric should have an owner, expected range, alert threshold, and review cadence. Otherwise the platform team will know something is wrong but not have a mechanism to improve it.
        </p>

        <p>
          When canary error delta regresses, the response should be concrete: tune policy, add capacity, fix noisy checks, improve ownership metadata, change rollout gates, or remove stale controls. Metrics that do not trigger decisions eventually become ignored background noise.
        </p>

        <p>
          Track time to rollback as an operating metric, not a dashboard decoration. The metric should have an owner, expected range, alert threshold, and review cadence. Otherwise the platform team will know something is wrong but not have a mechanism to improve it.
        </p>

        <p>
          When time to rollback regresses, the response should be concrete: tune policy, add capacity, fix noisy checks, improve ownership metadata, change rollout gates, or remove stale controls. Metrics that do not trigger decisions eventually become ignored background noise.
        </p>

        <p>
          Track mixed-version compatibility failures as an operating metric, not a dashboard decoration. The metric should have an owner, expected range, alert threshold, and review cadence. Otherwise the platform team will know something is wrong but not have a mechanism to improve it.
        </p>

        <p>
          When mixed-version compatibility failures regresses, the response should be concrete: tune policy, add capacity, fix noisy checks, improve ownership metadata, change rollout gates, or remove stale controls. Metrics that do not trigger decisions eventually become ignored background noise.
        </p>
        <h3>Operating model for production teams</h3>

        <p>
          Make canary error delta and mixed-version compatibility failures first-class operating metrics. Each metric needs an owner, expected range, escalation threshold, and recurring review; otherwise it becomes a dashboard number that never changes platform behavior.
        </p>

        <p>
          Ownership should be split clearly: service owners for compatibility guarantees and platform owners for traffic and health automation. This avoids the common failure where platform teams own generic plumbing but nobody owns the domain-specific confidence signal that actually protects users.
        </p>

        <p>
          The system should preserve enough evidence to explain a decision months later. That evidence should include the triggering change, policy version, service tier, owners, artifact or config identity, gate result, and recovery action when something went wrong.
        </p>
        <h3>Depth-band readiness checkpoint</h3>

        <p>
          Deployment Strategies: Rolling, Blue-Green, Canary is interview-relevant only when the candidate can connect the mechanism to day-two operation. A useful final check is to ask how the design behaves after six months: which controls became noisy, which metrics changed team behavior, which exceptions expired, and which incident reviews produced permanent platform improvements.
        </p>

        <p>
          Another readiness check is whether the design has a safe degraded mode. CI/CD systems depend on scanners, runners, registries, metrics, secret issuers, and approval services; when one dependency is down, the platform should make a deliberate policy choice rather than letting every team invent a bypass during pressure.
        </p>

        <p>
          Finally, the article's topic should be explained through ownership. For Deployment Strategies: Rolling, Blue-Green, Canary, the platform team normally owns reusable controls, but product or service teams own domain correctness, rollback safety, and user-facing risk. Strong interview answers separate those responsibilities because unclear ownership is one of the most common reasons delivery systems decay.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <HighlightBlock as="p" tier="crucial">
          The most dangerous pitfalls are the ones that make the delivery system appear healthy while reducing actual confidence.
        </HighlightBlock>

        <h3>Health check lies</h3>

        <p>
          A liveness endpoint can be green while checkout, login, or payment is broken.
        </p>

        <h3>Canary without traffic volume</h3>

        <p>
          A tiny canary may not see enough requests to reveal errors.
        </p>

        <h3>Blue-green with shared mutable state</h3>

        <p>
          If green corrupts shared state, switching back to blue may not fix the incident.
        </p>

        <h3>Rolling incompatible versions</h3>

        <p>
          Mixed old and new versions can break sessions, messages, caches, or database writes.
        </p>

        <p>
          A useful interview pattern is to name the pitfall, describe how it shows up operationally, and then explain the guardrail that prevents it from becoming normal behavior.
        </p>
        <h3>Subtle pitfalls and failure modes</h3>

        <p>
          Selecting canary because it sounds advanced is weak; sometimes rolling is enough, and sometimes blue-green is safer despite higher capacity cost. In staff-level interviews, explicitly naming this anti-pattern helps show that the design is based on production failure modes rather than a checklist.
        </p>

        <p>
          A blue-green cutover can look instant while both environments share a database that was not designed for reversal. The mitigation is usually not a single extra check; it is better state modeling, stricter ownership, clearer trust boundaries, and a safe degraded-mode behavior when the automated system cannot be fully confident.
        </p>

        <p>
          A one-percent canary may be statistically meaningless for a low-traffic admin flow. The design should state how this is detected, how the owner is routed, what happens automatically, and what evidence remains for incident review.
        </p>
        <h3>Failure-mode rehearsal anchors</h3>

        <p>
          Design anchor: deployment strategy must be chosen with database and API compatibility, not only traffic routing preference. This is worth stating explicitly in interviews because it turns the answer from a generic CI/CD checklist into a concrete control with an owner, input, output, failure mode, and measurable signal.
        </p>

        <p>
          Production review question: what happens when this assumption is false? The answer should identify how the system detects the problem, whether it blocks or degrades, who receives the remediation work, and what evidence remains for later review.
        </p>

        <p>
          Design anchor: rollback should be measured as a real operational path because a strategy is unsafe if old capacity or old assets are unavailable. This is worth stating explicitly in interviews because it turns the answer from a generic CI/CD checklist into a concrete control with an owner, input, output, failure mode, and measurable signal.
        </p>

        <p>
          Production review question: what happens when this assumption is false? The answer should identify how the system detects the problem, whether it blocks or degrades, who receives the remediation work, and what evidence remains for later review.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2>
        <HighlightBlock as="p" tier="crucial">
          A strong real-world answer maps the topic to service criticality, team size, release frequency, compliance needs, and rollback constraints.
        </HighlightBlock>

        <p>
          A stateless API with backward-compatible changes can use rolling updates.
        </p>

        <p>
          A high-traffic checkout service can use canary plus SLO gates before global rollout.
        </p>

        <p>
          A frontend static deployment can use blue-green asset directories with CDN traffic switch.
        </p>

        <p>
          A machine learning service can shadow traffic to compare latency and output quality before canary.
        </p>

        <p>
          A database-contracting release may require canary plus feature flags rather than pure rollback.
        </p>

        <p>
          The same mechanism should not be applied uniformly to every system. A tier-zero service, internal dashboard, mobile application, shared SDK, and infrastructure platform have different risk profiles and need different gates.
        </p>
        <h3>Concrete system-design scenarios</h3>

        <p>
          If asked to choose strategy for a stateless API, start by clarifying the service tier, team count, repository model, deployment frequency, rollback expectation, and compliance constraints. Those inputs decide whether the design should optimize for speed, auditability, isolation, or blast-radius reduction.
        </p>

        <p>
          Then describe the minimum viable control loop: what event starts the process, what evidence is gathered, what gate makes the decision, what happens on failure, and how the outcome feeds future improvements. This structure keeps the answer grounded rather than tool-centric.
        </p>

        <p>
          If asked to deploy a checkout service with canary, start by clarifying the service tier, team count, repository model, deployment frequency, rollback expectation, and compliance constraints. Those inputs decide whether the design should optimize for speed, auditability, isolation, or blast-radius reduction.
        </p>

        <p>
          Then describe the minimum viable control loop: what event starts the process, what evidence is gathered, what gate makes the decision, what happens on failure, and how the outcome feeds future improvements. This structure keeps the answer grounded rather than tool-centric.
        </p>

        <p>
          If asked to release static frontend assets via blue-green, start by clarifying the service tier, team count, repository model, deployment frequency, rollback expectation, and compliance constraints. Those inputs decide whether the design should optimize for speed, auditability, isolation, or blast-radius reduction.
        </p>

        <p>
          Then describe the minimum viable control loop: what event starts the process, what evidence is gathered, what gate makes the decision, what happens on failure, and how the outcome feeds future improvements. This structure keeps the answer grounded rather than tool-centric.
        </p>

        <p>
          If asked to shadow a new recommendation service, start by clarifying the service tier, team count, repository model, deployment frequency, rollback expectation, and compliance constraints. Those inputs decide whether the design should optimize for speed, auditability, isolation, or blast-radius reduction.
        </p>

        <p>
          Then describe the minimum viable control loop: what event starts the process, what evidence is gathered, what gate makes the decision, what happens on failure, and how the outcome feeds future improvements. This structure keeps the answer grounded rather than tool-centric.
        </p>

        <p>
          If asked to coordinate deployment strategy with database migration, start by clarifying the service tier, team count, repository model, deployment frequency, rollback expectation, and compliance constraints. Those inputs decide whether the design should optimize for speed, auditability, isolation, or blast-radius reduction.
        </p>

        <p>
          Then describe the minimum viable control loop: what event starts the process, what evidence is gathered, what gate makes the decision, what happens on failure, and how the outcome feeds future improvements. This structure keeps the answer grounded rather than tool-centric.
        </p>
        <h3>Real-world scenario expansion</h3>

        <p>
          Choose a strategy for a stateless API, a checkout service, a frontend CDN release, and a service with database migration requirements. Start the answer by clarifying scale, service tier, deployment frequency, team topology, trust boundaries, rollback expectations, and compliance exposure. These inputs determine which controls are necessary and which are optional overhead.
        </p>

        <p>
          Regional traffic, cache behavior, and capacity headroom can make a globally safe-looking rollout fail in one edge or availability zone. This is the reason mature CI/CD architecture has to model capacity, ownership, policy, and state, not just the sequence of stages in a pipeline file.
        </p>

        <p>
          High-risk regulated flows may require cohort targeting, audit evidence, and explicit rollback authority before traffic expansion. Even when the company is not formally regulated, the same evidence helps with incident response, customer trust, and executive review after a release failure.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2>
        <HighlightBlock as="p" tier="crucial">
          Answer these questions by connecting the mechanism to production risk, operational ownership, and recovery behavior.
        </HighlightBlock>

        <h3>How do you choose between rolling, blue-green, and canary?</h3>

        <p>
          I look at capacity cost, blast radius, state compatibility, observability confidence, rollback speed, and service criticality. Rolling is efficient, blue-green is fast to switch, and canary is best for limiting user exposure while measuring real production behavior.
        </p>

        <h3>What can go wrong with canary deployments?</h3>

        <p>
          The canary may lack traffic volume, metrics may be delayed, treatment and control may not be comparable, or the change may affect shared state beyond the canary users.
        </p>

        <h3>Why is blue-green not always safest?</h3>

        <p>
          It needs duplicate capacity and compatible shared state. If the new version mutates shared data incorrectly, switching traffic back may not undo the damage.
        </p>

        <h3>What does rollback mean for rolling deployment?</h3>

        <p>
          It usually means stopping rollout and replacing updated instances with the previous version, but this is safe only if old and new versions are compatible with current data and configuration.
        </p>

        <h3>How do deployment strategies interact with database migrations?</h3>

        <p>
          Migrations must support version overlap. Expand-contract patterns are often required before rolling or canary deployment of application code.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul>
          <li><a href="https://kubernetes.io/docs/concepts/workloads/controllers/deployment/" target="_blank" rel="noreferrer">Kubernetes Deployments</a></li>
          <li><a href="https://argo-rollouts.readthedocs.io/" target="_blank" rel="noreferrer">Argo Rollouts</a></li>
          <li><a href="https://docs.aws.amazon.com/whitepapers/latest/overview-deployment-options/bluegreen-deployments.html" target="_blank" rel="noreferrer">AWS Blue/Green Deployments</a></li>
          <li><a href="https://istio.io/latest/docs/concepts/traffic-management/" target="_blank" rel="noreferrer">Istio Traffic Management</a></li>
          <li><a href="https://dora.dev/" target="_blank" rel="noreferrer">DORA - Accelerate State of DevOps research</a></li>
          <li><a href="https://sre.google/sre-book/release-engineering/" target="_blank" rel="noreferrer">Google SRE Book - Release Engineering</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
