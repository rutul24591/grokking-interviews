"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-voice-based-ui-system",
  title: "Design a Voice-Based UI System",
  description: "Principal-level emerging system design covering capability detection, confidence, safety, fallback, privacy, rollback, cost, and observability.",
  category: "high-level-design",
  subcategory: "emerging-future-systems",
  slug: "voice-based-ui-system",
  wordCount: 3400,
  readingTime: 20,
  lastUpdated: "2026-05-29",
  tags: ["hld", "emerging", "ai", "privacy", "safety", "fallback"],
  relatedTopics: [],
};

const definition = [
  "Design a Voice-Based UI System is an emerging product system where device capability, user trust, safety, privacy, and fallback behavior are as important as the primary interaction. A principal-ready design treats a voice-based UI system as a risk-managed experience, not as a novelty interface.",
  "The difficult part is uncertainty. Devices vary, sensors lie, networks disappear, models drift, chains fail, users misunderstand prompts, and irreversible actions can happen from ambiguous input. The architecture must make uncertainty visible and controllable.",
  "The design should define the boundary between local computation, remote services, user intent, policy enforcement, and operational control. Emerging systems fail when teams hide this boundary behind a magical UI that cannot explain or recover from mistakes.",
  "A strong interview answer should classify actions by reversibility and sensitivity. Browsing, previewing, suggesting, and drafting can be forgiving. Payments, wallet signatures, permission grants, identity changes, public posts, and physical-world actions need confirmation and auditability.",
  "Operationally, these systems need feature flags, capability gating, cohort rollout, fallback routes, safety kill switches, privacy controls, and telemetry that measures quality without collecting more sensitive data than needed."
];
const concepts = [
  "The first concept is capability detection. wake-word listener, ASR/NLU pipeline, and dialog state should not assume every device, browser, sensor, model, or wallet provider behaves the same way. The UI needs graceful downgrade paths.",
  "The second concept is intent confirmation. Emerging interfaces often infer intent from speech, gestures, camera input, model output, or wallet metadata. Inferred intent should not trigger irreversible actions without explicit confirmation.",
  "The third concept is local versus remote execution. Local execution improves privacy and latency but has device, battery, model, and upgrade constraints. Remote execution improves consistency and observability but increases latency, cost, and data exposure.",
  "The fourth concept is safety boundaries. Spatial boundaries, prompt boundaries, transaction boundaries, permission boundaries, and model output boundaries should be explicit in both UI and backend policy.",
  "The fifth concept is fallback. A user should be able to continue through a simpler text, touch, web, cloud, or manual review path when the emerging interface is unavailable or low confidence.",
  "The sixth concept is observability. Track capability failures, fallback rate, confirmation cancellation, model confidence, sensor drift, transaction simulation warnings, privacy control usage, latency, battery impact, and incident overrides."
];
const architecture = [
  "The architecture contains wake-word listener, ASR/NLU pipeline, dialog state, confirmation policy, privacy control. The client detects capability and collects user intent. The runtime or gateway evaluates confidence, policy, and safety. Sensitive actions pass through confirmation and audit. Fallback routing keeps the core journey available when the new interaction is not trustworthy.",
  "State should be separated into user intent, inferred context, device/runtime state, remote policy state, and committed action state. Inferred context can be wrong; committed state should be durable and explainable.",
  "The system should keep sensitive inputs local where possible and send minimized, purpose-bound data when remote services are required. Logs should store event class, confidence, policy decision, and correlation ID rather than raw voice, camera, seed, private prompt, or spatial map data unless explicitly necessary and consented.",
  "Capability gating should run before rendering advanced controls. The UI should know whether it is in full mode, degraded mode, remote fallback, read-only mode, or blocked mode because of device, policy, provider, or safety constraints.",
  "For high-risk actions, the design should include preflight simulation or validation. A wallet simulates transaction effects; voice confirms destructive intent; AR checks safe placement; on-device AI checks output confidence and policy.",
  "Operations need remote disablement for risky model versions, wallet providers, voice intents, spatial features, or transaction types. Emerging systems should assume fast rollback is necessary because field failures can be hard to reproduce in lab testing."
];
const tradeoffs = [
  "Local-first execution improves latency and privacy, but creates fragmentation across devices and model/runtime versions. Cloud execution improves control and quality consistency, but sends more data over the network and increases cost.",
  "Rich immersive UI can improve understanding and engagement, but it increases accessibility, motion comfort, battery, and hardware constraints. A principal design keeps a non-immersive fallback for critical flows.",
  "Low-friction confirmations improve speed, but high-risk actions need deliberate friction. The right design uses risk-based confirmation rather than one prompt style for every action.",
  "Telemetry is necessary to improve quality, but emerging interfaces often observe sensitive context. Collecting raw audio, camera frames, private prompts, spatial maps, or wallet details can become a privacy incident. Use minimization and aggregation by default.",
  "Aggressive rollout improves learning speed, but field failures can cause irreversible harm or public trust loss. Use staged rollout, holdouts, model/version attribution, and kill switches.",
  "Fallbacks add product and engineering complexity, but they make the system usable when the novel interface is unavailable, unsafe, low confidence, or blocked by policy."
];
const practices = [
  "Design confidence-aware UI states: ready, low confidence, needs confirmation, degraded, blocked, failed, and manual fallback. Do not represent uncertain inference as fact.",
  "Use policy and risk classification before sensitive actions. The system should know which actions are reversible, destructive, financial, public, privacy-sensitive, or safety-sensitive.",
  "Version every runtime decision: model version, wallet provider, device capability tier, intent schema, safety policy, and fallback route. Versioning makes rollback and incident analysis possible.",
  "Use explicit consent and local data controls for voice, camera, spatial maps, private prompts, wallet metadata, and personalization history.",
  "Build simulation or preview for irreversible actions. Users should see transaction effects, public posting consequences, physical placement, or destructive command summary before committing.",
  "Instrument fallback and cancellation. High fallback rate or confirmation cancellation is a quality signal, not only a UX inconvenience.",
  "Exercise incident playbooks for bad model rollout, wallet provider outage, false activation spike, sensor drift, privacy complaint, and unsafe action pattern."
];
const pitfalls = [
  "false activation can turn a promising interface into a trust failure if the UI hides uncertainty or removes fallback paths.",
  "intent ambiguity is often caused by doing too much on-device or in realtime without resource budgets and user-visible degradation.",
  "background noise is the largest principal-level risk. Emerging interfaces often touch personal surroundings, private text, speech, biometrics, wallet metadata, or sensitive intent.",
  "unsafe action requires rollback, quality monitoring, and explicit user recovery. The system cannot rely on users understanding hidden model, sensor, chain, or provider behavior.",
  "Another pitfall is demo-driven design. A prototype can assume perfect lighting, perfect speech, perfect network, perfect device, and harmless actions; production cannot.",
  "Teams also underinvest in accessibility. Voice, AR/VR, wallets, and AI assistants must have alternative interaction modes for users who cannot or do not want to use the novel surface."
];
const useCases = [
  "smart assistant needs capability gating, confidence-aware UI, privacy controls, fallback, and operational rollback to be production-ready.",
  "hands-free commerce needs capability gating, confidence-aware UI, privacy controls, fallback, and operational rollback to be production-ready.",
  "accessibility voice navigation needs capability gating, confidence-aware UI, privacy controls, fallback, and operational rollback to be production-ready.",
  "During a provider or model incident, the system should fall back to a simpler safe path, preserve user work, disable high-risk actions, and expose the reason without leaking sensitive internals.",
  "During a privacy review, the system should prove what data was processed locally, what was sent remotely, what was logged, and how users can revoke or delete it.",
  "During scale-up, cost and latency should be tracked per capability tier because local, edge, and cloud execution have very different operational economics."
];
const questions = [
  {
    "question": "How would you design a voice-based UI system end to end?",
    "answer": "I would start with capability detection, user intent capture, policy/risk classification, confidence-aware execution, confirmation for sensitive actions, and fallback routing. The architecture includes wake-word listener, ASR/NLU pipeline, dialog state, confirmation policy, privacy control. Committed actions are durable and auditable; inferred context remains tentative. Operations need versioning, staged rollout, telemetry, and kill switches."
  },
  {
    "question": "Why this architecture over a direct UI-to-provider integration?",
    "answer": "Direct integration is fast for a demo but weak for policy, fallback, privacy, observability, and rollback. A principal architecture adds a control plane that understands capability, risk, consent, model/provider version, and action sensitivity. The trade-off is more complexity, but it prevents silent unsafe actions and makes incidents recoverable."
  },
  {
    "question": "What breaks at scale?",
    "answer": "The main failures are false activation, intent ambiguity, background noise, unsafe action, plus provider outages, device fragmentation, quality drift, high cloud cost, privacy complaints, and low-confidence actions. Prevention requires versioning, cohort rollout, capability gating, fallback paths, telemetry, and remote disablement."
  },
  {
    "question": "What consistency model applies?",
    "answer": "Inferred state can be probabilistic and temporary. Committed user actions, permissions, wallet transactions, account state, and privacy choices need authoritative confirmation and audit. Derived suggestions, previews, model outputs, and sensor interpretations can be stale or low confidence if the UI represents them honestly."
  },
  {
    "question": "How do you handle failure, rollback, abuse, privacy, cost, and observability?",
    "answer": "Failures are handled with fallback modes, confirmation, retries where safe, and preserved user intent. Rollback uses version gates and feature kill switches. Abuse is handled through risk policy, rate limits, transaction simulation, and unsafe-intent blocking. Privacy uses local processing, minimization, consent, and redaction. Cost is managed by routing between local, edge, and cloud execution. Observability tracks confidence, fallback, cancellation, latency, battery, and incident controls."
  },
  {
    "question": "How do you defend trade-offs under interviewer pressure?",
    "answer": "I would classify actions by reversibility and sensitivity. I would defend local execution for privacy-sensitive low-latency tasks, cloud fallback for quality or capability gaps, and explicit confirmation for irreversible actions. I would also emphasize that emerging interfaces need safe fallback more than perfect novelty."
  }
];
const references = [
  {
    "label": "WebXR Device API",
    "href": "https://www.w3.org/TR/webxr/"
  },
  {
    "label": "MDN: Web Speech API",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API"
  },
  {
    "label": "W3C WebAuthn",
    "href": "https://www.w3.org/TR/webauthn-3/"
  },
  {
    "label": "OWASP Mobile Application Security",
    "href": "https://mas.owasp.org/"
  },
  {
    "label": "Ethereum JSON-RPC API",
    "href": "https://ethereum.org/en/developers/docs/apis/json-rpc/"
  },
  {
    "label": "Google SRE Workbook",
    "href": "https://sre.google/workbook/table-of-contents/"
  }
];

export default function VoiceBasedUiSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section><h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="important">{definition[0]}</HighlightBlock>{definition.slice(1).map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Core Concepts</h2>{concepts.map((item, index) => index === 2 ? <HighlightBlock as="p" tier="crucial" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}</section>
      <section>
        <h2>Architecture &amp; Flow</h2>
        {architecture.map((item, index) => index === 0 ? <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/emerging-future-systems/voice-based-ui-system.svg" alt="Design a Voice-Based UI System architecture" caption="Architecture view: capability, runtime/provider boundary, policy, confirmation, fallback, and telemetry." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/emerging-future-systems/voice-based-ui-system-flow.svg" alt="Design a Voice-Based UI System flow" caption="Flow view: inferred intent, confidence, validation, confirmation, committed action, and recovery." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/emerging-future-systems/voice-based-ui-system-operations.svg" alt="Design a Voice-Based UI System operations" caption="Operations view: model/provider/device incidents, privacy controls, rollback, cost, and observability." />
      </section>
      <section><h2>Trade offs &amp; Comparison</h2>{tradeoffs.map((item, index) => index === 0 ? <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}</section>
      <section><h2>Best practices</h2>{practices.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Common Pitfalls</h2>{pitfalls.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Real-world use cases</h2>{useCases.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Common interview question with detailed answer</h2>{questions.map((item) => <div key={item.question} className="mb-6"><h3 className="mb-2 text-lg font-semibold">{item.question}</h3><p>{item.answer}</p></div>)}</section>
      <section><h2>References</h2><ul className="list-disc space-y-2 pl-6">{references.map((item) => <li key={item.href}><a href={item.href} target="_blank" rel="noreferrer" className="text-blue-600 underline dark:text-blue-400">{item.label}</a></li>)}</ul></section>
    </ArticleLayout>
  );
}
